# Product Requirement Document (PRD) — free-coding-models Desktop (FCM-Desktop)

---

## 1. Overview & Objectives

The objective of **FCM-Desktop** is to transform the command-line interface (CLI) experience of the `free-coding-models` package into a lightweight, ultra-responsive, and accessible system utility residing in the system tray (Tray App / Menu Bar) on macOS, Windows, and Linux.

The application is designed for developers practicing *vibe coding* with autonomous agents (Cline, Aider, Goose, OpenCode, Pi, etc.). It acts as an **intelligent local HTTP proxy (`localhost:19280`)** capable of routing requests on the fly to the most performant and stable free API provider, eliminating failures at the start of generation (Pre-Stream Failover).

### Key Objectives

* **Raw Performance:** Maintain the responsiveness and detection speed of the original CLI.
* **Zero Friction:** No more background commands to launch; the application starts with the OS and exposes a single OpenAI-compatible endpoint.
* **Maximum Code Sharing:** Leverage the existing codebase — not just `sources.js`, but the **entire engine** (router daemon, scoring, ping, config, quota, telemetry) — ensuring that any fix, new model, or provider added instantly benefits the CLI, Docker/Web, and Desktop application with zero duplication.

---

## 2. Architecture & Code Sharing Strategy

### 2.1. Core Principle: One Engine, Three Surfaces

The CLI, the Docker/Web dashboard, and the Desktop app all share the **exact same Node.js engine**. There is no Rust rewrite, no parallel implementation. The business logic exists in one place and is consumed three ways:

```
┌─────────────────────────────────────────────────────────┐
│                  📦 Shared Core (Node.js)                │
│                                                          │
│  sources.js · utils.js · ping.js · config.js             │
│  router-daemon.js · benchmark.js · telemetry.js          │
│  constants.js · security.js · analysis.js                │
│  provider-quota-fetchers.js · quota-capabilities.js      │
│  cache.js · ping-loop.js · model-merger.js               │
│  favorites.js · sync-set.js · provider-metadata.js       │
│                                                          │
│  → Scoring, sorting, filtering, verdict engine           │
│  → HTTP ping infrastructure                              │
│  → Router daemon (OpenAI-compatible failover proxy)      │
│  → Config management (~/.free-coding-models.json)        │
│  → Token tracking, quota management                      │
│  → Circuit breaker, health probes, model sets            │
│  → SSE live events, web dashboard API routes             │
└───────────┬──────────────────┬───────────────┬───────────┘
            │                  │               │
     ┌──────▼──────┐   ┌──────▼──────┐  ┌─────▼──────┐
     │  📟 CLI TUI  │   │ 🐳 Docker   │  │ 🖥️ Desktop │
     │  (terminal)  │   │   / Web     │  │  (Tauri)   │
     │              │   │             │  │            │
     │ chalk, ANSI  │   │ Browser at  │  │ Tauri      │
     │ key-handler  │   │ :19280      │  │ webview    │
     │ overlays     │   │             │  │ + tray     │
     └──────────────┘   └─────────────┘  └────────────┘
                              │               │
                              └───────┬───────┘
                                      │
                            ┌─────────▼──────────┐
                            │  🌐 Same React UI   │
                            │   (web/src/)        │
                            │                     │
                            │  Served by router   │
                            │  daemon in both     │
                            │  Docker and Desktop  │
                            └─────────────────────┘
```

### 2.2. Unified React UI for Web & Desktop

The React application in `web/src/` serves **both** the Docker/Web dashboard **and** the Desktop UI:

| Scenario | Who serves the UI | Who serves the API | User sees |
|----------|-------------------|-------------------|-----------|
| `--daemon` / Docker | router-daemon serves `web/dist/` | router-daemon serves `/api/*` | Browser → `localhost:19280` |
| Desktop (Tauri) | Tauri webview loads embedded `web/dist/` | Node.js sidecar = same router-daemon | Native window, tray icon |
| CLI only | No web UI | No server (or `--daemon-bg`) | Terminal TUI |

The React app communicates exclusively via HTTP (`fetch('/api/models')`, `fetch('/api/config')`, `EventSource('/api/events')`) — the same API whether accessed from a browser tab or a Tauri webview.

Desktop-specific UI features (tray controls, OS notifications, minimize-to-tray) are conditionally enabled:

```js
const isDesktop = window.__TAURI_INTERNALS__ !== undefined
```

This keeps 95%+ of the components identical across web and desktop.

### 2.3. Why Not Rust for the Engine

The original PRD proposed rewriting the engine in Rust (Axum + Reqwest). This approach was abandoned because:

1. **Double maintenance** — every new provider, scoring tweak, or bug fix would need to be ported to two languages
2. **Inevitable desync** — the CLI Node.js engine and the Desktop Rust engine would diverge over time
3. **Illusory performance gain** — the bottleneck is network I/O (HTTP pings to remote APIs), not local CPU. Node.js `fetch()` is perfectly suited for this I/O-bound workload
4. **The router daemon already exists** — `router-daemon.js` (~2,300 lines) already implements the full proxy, failover, circuit breaker, health probes, web dashboard, SSE events, and token tracking. Rewriting it in Rust is wasted effort
5. **Acceptable memory footprint** — the Node.js daemon runs at ~30-50 MB, which is fine for a tray application

---

## 3. Functional Specifications

### 3.1. Local HTTP Proxy & Intelligent Routing

* **Single Endpoint:** `POST http://localhost:19280/v1/chat/completions`
* **Format:** 100% compatible with the OpenAI standard (seamless handling of the `"stream": true` parameter).
* **Selection Algorithm:** Upon receiving an agent request, the proxy identifies the requested model, queries the routing table sorted by stability score, and selects the best provider available at instant $T$.
* **Model:** Point your coding tool at `model: "fcm"` and API key `fcm-local`.

> **Note:** The endpoint is `localhost:19280` (same as the existing `--daemon` mode), not `:4096`. This ensures a single consistent port across CLI daemon, Docker, and Desktop.

### 3.2. "Pre-Stream" Failover Mechanism

* **Aggressive Timeout:** When targeting provider $A$, if the response time to get the first HTTP headers (Time to First Token - TTFT) exceeds the configured `requestTimeoutMs` (default: **15 seconds**) or returns a direct error (`429 Too Many Requests`, `503 Service Unavailable`), the proxy aborts the attempt.
* **Transparent Routing:** The proxy immediately switches to provider $B$ (the second highest-ranked for this model) in a manner completely invisible to the user agent. Up to `maxRetries` (default: 3) failover attempts.
* **Stream Locking:** Once the first token is successfully received, the streaming flow is piped directly to the agent without interception or text processing to guarantee minimal network latency.
* **Auth Isolation:** Authentication failures (`401`, `403`) are isolated per-provider — a bad key on provider $A$ does not poison the circuit breaker or prevent failover to provider $B$.
* **Client Disconnect:** If the coding tool disconnects mid-request, the daemon aborts the upstream request immediately without counting it as a provider failure.

### 3.3. Background Benchmark Engine

* The shared Node.js engine runs health probes in the background, isolated from the UI and proxy request handling.
* It performs lightweight pings at regular intervals across provider endpoints to calculate the **Stability Score (0 to 100)** using the formula already implemented in `src/utils.js`:

$$\text{Stability} = 0.30 \times \text{p95\_score} + 0.30 \times \text{jitter\_score} + 0.20 \times \text{spike\_score} + 0.20 \times \text{reliability\_score}$$

Where each component is normalized to 0–100:
- **p95 score** = `max(0, 100 × (1 - p95 / 5000))`
- **Jitter score** = `max(0, 100 × (1 - σ / 2000))`
- **Spike score** = `100 × (1 - spike_rate)` (spikes = pings > 3000ms)
- **Reliability score** = uptime percentage (HTTP 200 pings / total pings)

* Adaptive probe cadence: **2s burst** for the first 60s → **10s normal** → **30s idle**.
* Configurable probe modes: `eco` (120s), `balanced` (30s), `aggressive` (10s).

### 3.4. User Interface (Tray Popover)

The visual interface is the **same React application** as the web dashboard (`web/src/`), displayed in a Tauri webview popover attached to the system tray:

* **Overview:** Proxy status (On/Off) and live ping monitoring represented by lightweight charts, received via SSE from the Node.js engine (`/api/events`).
* **Key Management:** A secure screen to store API keys for the various providers (NVIDIA NIM, Groq, Cerebras, etc.), saved locally in `~/.free-coding-models.json` with file permissions `0o600`.
* **Priority Selection:** A drag-and-drop interface to reorder backup models (preferred fallback order) within router sets.
* **Model Table:** Full model catalog with live latency, stability scores, tier, SWE-bench scores, verdict — identical to the web dashboard.
* **Settings:** Provider enable/disable toggles, theme switching, telemetry opt-out.

#### Desktop-Specific UI Features

These features are only available in the Desktop (Tauri) context, conditionally rendered:

| Feature | How |
|---------|-----|
| **Minimize to tray** | Window close → hide to tray (Tauri window API) |
| **OS notifications** | Alert when a model goes down or failover triggers (Tauri notification plugin) |
| **Auto-start on boot** | Register as login item (Tauri autostart plugin) |
| **Global hotkey** | Quick-open the popover from anywhere (Tauri global shortcut plugin) |
| **Native menu bar** | macOS menu bar / Windows system tray icon |

---

## 4. Technical Specifications & Chosen Stack

| Component | Technology | Role / Justification |
|-----------|------------|---------------------|
| **App Framework** | **Tauri v2** | Ultra-lightweight (~15 MB) cross-platform standalone binary. Provides native tray, window, autostart, notifications, and global shortcuts. |
| **Engine / Proxy** | **Node.js sidecar** | The existing `router-daemon.js` runs as a Tauri sidecar. Same code as CLI `--daemon` mode. Zero rewrite. |
| **Sidecar Packaging** | **Node.js SEA** or **pkg** | The Node.js engine is compiled into a single executable binary bundled inside the Tauri app. No Node.js installation required for end users. |
| **Graphical Interface** | **React** (from `web/src/`) | Same React app used by Docker/Web dashboard. Loaded in Tauri's webview. |
| **Communication** | **HTTP + SSE** | The webview communicates with the sidecar via `localhost:19280` — same API as the browser dashboard (`/api/models`, `/api/config`, `/api/events`, `/v1/chat/completions`). |
| **Desktop-only features** | **Tauri Plugins** | `@tauri-apps/plugin-autostart`, `@tauri-apps/plugin-notification`, `@tauri-apps/plugin-global-shortcut`, `@tauri-apps/plugin-shell` |

### Why Tauri + Node.js Sidecar (Not Electron)

| Criteria | Tauri + Sidecar | Electron |
|----------|----------------|----------|
| Bundle size | ~15-25 MB | ~80-120 MB |
| RAM idle | ~30-50 MB | ~80-120 MB |
| Code sharing | Sidecar imports `core/` | Main process imports `core/` directly |
| Dev complexity | Medium (sidecar setup) | Low (Node.js native) |
| Native feel | Excellent (OS webview) | Good (Chromium) |

Tauri is preferred for its smaller footprint, which matters for a tray utility that runs 24/7. If sidecar packaging proves too complex, Electron remains a valid fallback with even easier code sharing (direct `import`).

---

## 5. File Structure and Git Workflow

The project retains its current structure and integrates the `desktop` folder at the root:

```text
free-coding-models/ (Root)
├── sources.js                    # Absolute source of truth (shared)
├── src/                          # Shared core engine + CLI-specific modules
│   ├── utils.js                  # Scoring, sorting, filtering, verdicts (shared)
│   ├── ping.js                   # HTTP ping infrastructure (shared)
│   ├── config.js                 # Config management (shared)
│   ├── router-daemon.js          # Router + proxy + web API (shared)
│   ├── constants.js              # Timeouts, limits (shared)
│   ├── benchmark.js              # AI speed test engine (shared)
│   ├── telemetry.js              # Anonymous telemetry (shared)
│   ├── ...                       # Other shared modules
│   ├── key-handler.js            # ❌ CLI-only (terminal keypresses)
│   ├── render-table.js           # ❌ CLI-only (ANSI table)
│   ├── overlays.js               # ❌ CLI-only (TUI modals)
│   └── ...                       # Other CLI-only modules
├── web/                          # React UI (shared between Web/Docker and Desktop)
│   ├── src/                      # React components, hooks, styles
│   ├── dist/                     # Built assets (embedded by Docker + Tauri)
│   └── index.html                # SPA entry point
├── bin/                          # CLI entry point
│   └── free-coding-models.js     # CLI main (imports from src/)
└── desktop/                      # Desktop-specific Tauri configuration
    ├── prd-desktop.md            # This document
    ├── tauri.conf.json           # Tauri v2 configuration
    ├── package.json              # Desktop build scripts
    ├── src/                      # Desktop-specific React overrides (minimal)
    │   ├── desktop-bridge.js     # Tauri IPC helpers (notifications, tray, autostart)
    │   └── desktop-overrides.jsx # Conditional desktop UI features
    └── src-tauri/                # Minimal Tauri Rust code
        ├── Cargo.toml
        └── src/
            └── main.rs           # App lifecycle, tray menu, sidecar management
```

### Key Differences from Original PRD

| Original PRD | New Architecture |
|-------------|------------------|
| `proxy.rs` — Rust HTTP proxy server | ❌ Removed — `router-daemon.js` does this already |
| `bouncer.rs` — Rust ping/scoring engine | ❌ Removed — `utils.js` + `ping.js` do this already |
| Rust reads/embeds `sources.js` | ❌ Unnecessary — Node.js sidecar imports it natively |
| Desktop-specific React UI in `desktop/src/` | Minimal overrides only — 95% of UI is `web/src/` |
| Port 4096 | Port 19280 — consistent across CLI, Docker, Desktop |

### Sidecar Build Pipeline

The Node.js sidecar is compiled into a standalone binary before Tauri packaging:

1. **Bundle** — `esbuild` bundles the router daemon entry point + all `src/` and `sources.js` dependencies into a single `.js` file
2. **Compile** — Node.js SEA (`node --experimental-sea-config`) or `pkg` compiles the bundle into a native binary (`fcm-engine-darwin-arm64`, `fcm-engine-win-x64.exe`, etc.)
3. **Embed** — Tauri's `externalBin` configuration embeds the compiled binary as a sidecar
4. **Runtime** — On app launch, Tauri spawns the sidecar which starts the router daemon on `:19280`

```json
// tauri.conf.json
{
  "bundle": {
    "externalBin": ["binaries/fcm-engine"]
  }
}
```

---

## 6. Shared Code Inventory

### Modules shared 1:1 between CLI, Docker, and Desktop (~220 KB)

| Module | Size | What it does |
|--------|------|-------------|
| `sources.js` | 29 KB | Provider & model catalog — the single source of truth |
| `src/utils.js` | 39 KB | Scoring, sorting, filtering, verdict engine — pure functions |
| `src/ping.js` | 11 KB | HTTP ping infrastructure — provider-specific request building |
| `src/config.js` | 42 KB | Config management — `~/.free-coding-models.json` |
| `src/router-daemon.js` | 92 KB | Router proxy, failover, circuit breaker, web API, SSE |
| `src/constants.js` | 7 KB | Timeouts, limits, defaults |
| `src/benchmark.js` | 11 KB | AI speed test engine |
| `src/telemetry.js` | 16 KB | Anonymous usage telemetry |
| `src/ping-loop.js` | 4 KB | Adaptive ping cadence loop |
| `src/provider-quota-fetchers.js` | 12 KB | Per-provider quota fetching |
| `src/quota-capabilities.js` | 5 KB | Quota support detection |
| `src/security.js` | 7 KB | Config validation, security checks |
| `src/analysis.js` | 9 KB | Result analysis helpers |
| `src/provider-metadata.js` | 12 KB | Provider env vars, URLs |
| `src/cache.js` | 5 KB | TTL cache utility |
| `src/favorites.js` | 6 KB | Favorites management |
| `src/model-merger.js` | 2 KB | Dynamic model merging |
| `src/sync-set.js` | 16 KB | Router set auto-discovery |

### Modules that stay CLI-only (~340 KB)

| Module | Size | Why CLI-only |
|--------|------|-------------|
| `src/key-handler.js` | 144 KB | Terminal stdin keypress handling |
| `src/overlays.js` | 83 KB | TUI modals (chalk + ANSI) |
| `src/render-table.js` | 53 KB | ANSI table rendering |
| `src/command-palette.js` | 19 KB | TUI command palette |
| `src/render-helpers.js` | 13 KB | chalk formatting helpers |
| `src/theme.js` | 12 KB | ANSI terminal themes |
| `src/tui-state.js` | 10 KB | TUI state machine |
| `src/mouse.js` | 7 KB | Terminal mouse event parsing |
| `src/tui-filters.js` | 6 KB | TUI filter cycling |
| `src/tier-colors.js` | 2 KB | chalk color mappings |

---

## 7. Performance Criteria & QA Verification

* **Memory Consumption:** Sidecar + Tauri shell combined must stay under **80 MB** RAM at idle. Target: ~50 MB (30 MB sidecar + 20 MB Tauri webview).
* **Routing Latency (Overhead):** The Node.js proxy must not add more than **5 ms** of latency compared to a direct network request to the API provider.
* **Stream Responsiveness:** The UI monitoring chart must display ping variations with a maximum delay of **200 ms** relative to the actual probe result (SSE delivery from sidecar → React state update → render).
* **Resilience:** By simulating a sudden network outage on the primary provider at the moment the agent sends a request, the application must reroute traffic and deliver the first token on the secondary provider in under **3.5 seconds**.
* **Startup Time:** From app launch to router listening on `:19280` — under **3 seconds** on modern hardware.
* **Parity:** The stability scores, verdicts, and model rankings displayed in the Desktop UI must be **byte-identical** to those produced by `free-coding-models --daemon` in the CLI. This is guaranteed by using the same code.

---

## 8. Development Phases

### Phase 1 — Shared Core Formalization (Pre-Desktop)

Before touching Desktop code, formalize the shared core:

1. Create `core/index.js` barrel export that re-exports all shared modules
2. Ensure `router-daemon.js` web API routes are clean and documented
3. Verify `web/src/` React app works standalone with the daemon API
4. Add integration tests: start daemon → hit API → verify React app renders

### Phase 2 — Tauri Shell + Sidecar

1. Set up `desktop/` Tauri v2 project with minimal `main.rs`
2. Build Node.js sidecar from `router-daemon.js` entry point
3. Configure `tauri.conf.json` with `externalBin` sidecar
4. Webview loads `web/dist/` — verify dashboard renders
5. Add tray icon, minimize-to-tray, click-to-open behavior

### Phase 3 — Desktop-Specific Features

1. Auto-start on login (Tauri autostart plugin)
2. OS notifications on model failures / failover events
3. Global hotkey to toggle popover
4. Desktop-specific settings panel (autostart toggle, notification preferences)
5. Native installer builds (`.dmg` for macOS, `.msi` for Windows, `.AppImage` for Linux)

### Phase 4 — Polish & Release

1. Auto-update mechanism (Tauri updater plugin)
2. Code signing for macOS and Windows
3. Performance profiling and optimization
4. Beta testing with community
5. Public release