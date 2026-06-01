# TUI → Web Dashboard Feature Parity Plan

> **Mission:** Bring the Web Dashboard to full feature parity with the TUI.
> The TUI is the **source of truth** for every feature — the Web UI must
> surface every TUI capability, adapted to a mouse-first / keyboard-friendly
> browser context.

> **Surface mandate** (from `AGENTS.md`): every change must work across all
> three surfaces (CLI/TUI, Web/Docker, Desktop/Tauri). This plan therefore
> only considers work that is shared through the engine layer, not TUI- or
> Web-only experiments.

---

## 0. Progress tracker

| Milestone | Status | Started | Done | Notes |
|---|---|---|---|---|
| **M1** — Layout refactor + engine-quick wins | ✅ **DONE** | 2026-06-01 | 2026-06-01 | Shipped in npm 0.5.5 (M1 + post-M1 polish) |
| **M2** — Settings parity + palette + URL write-back | ✅ **DONE** | 2026-06-01 | 2026-06-01 | Shipped in npm 0.5.6. Full Settings parity, full TUI command palette, help + changelog modals, update chip, URL write-back. 451 tests pass. |
| **M3** — Smart Recommend + Tool mode/launch | 🔜 **NEXT** | — | — | This is where the next session picks up. See spec in §M3 below. |
| M4 — Router + Token Usage + Installed Models + Install Endpoints | ⏳ pending | — | — | |
| M5 — Polish, a11y, tests, release | ⏳ pending | — | — | |

---

## 🪂 Handoff to the next session (M3)

**Date:** 2026-06-01
**Last state:** Both M1 and M2 are shipped to npm (0.5.5 + 0.5.6), the CI/CD Docker pipeline is now also auto-building (issue #95 fixed), all 451 tests pass, `pnpm build:web` is clean.

**Where to start the new session:**
> Open the repo, read this file end-to-end, then start at §M3 below. The implementation order is already laid out — do not start by re-reading the codebase; trust the progress table + the file references below.

**What's already in place that M3 can lean on:**
- Layout (no sidebar, full-width table, header menu, sticky FilterBar) — don't touch.
- TUI source of truth: `src/core/utils.js` (`scoreModelForTask`, `getTopRecommendations`, `TASK_TYPES`, `PRIORITY_TYPES`, `CONTEXT_BUDGETS`), `src/core/tool-metadata.js` (`TOOL_METADATA`, `getToolMeta`, `getCompatibleTools`, `isModelCompatibleWithTool`, `findSimiLarCompatibleModels`), `src/core/tool-bootstrap.js` (`getToolInstallPlan`, `installToolWithPlan`, `isToolInstalled`), `src/core/tool-launchers.js` (`startExternalTool`, `buildToolEnv`), `src/core/opencode.js` + `src/core/openclaw.js` (the two largest launchers).
- Web side: `useFavorites`, `useChangelog`, `useUpdateChecker`, `useUrlState` hooks, `CommandPalette` (1:1 TUI registry), `HelpView`, `ChangelogView`, `UpdateChip`, full `SettingsView` parity.
- Server endpoints added in M1+M2: `/api/favorites`, `/api/key/:provider/test`, `/api/settings/feature`, `/api/shell-env/toggle`, `/api/legacy-cleanup`, `/api/version`, `/api/update/check`, `/api/update/run`, `/api/changelog`. M3 needs ~5 more (see spec).
- CI/CD: `Release` workflow → npm + GitHub Release + Discord + `vX.Y.Z` tag push. Docker workflow now triggered by `workflow_run: ["Release"]` so every npm publish auto-builds the Docker image. M3 releases will automatically include the Docker image.

**What M3 must NOT do:**
- Re-introduce a sidebar. Header-only navigation is locked in.
- Add key bindings beyond the single ⌘K / Ctrl+P global. The Web is mouse-first.
- Modify `src/tui/command-palette.js` registry — M3's Tool mode picker in the Web must use the same registry via `TOOL_METADATA` + `TOOL_MODE_ORDER`, not a parallel list.
- Bump the version. The plan tracks version; the user does the bump.

**M3 hot spots (in order, do NOT re-order):**
1. Tool mode picker in Header (`Z` cycle in TUI) — required for rows to know which tool to launch.
2. `useToolMode` hook + `/api/tool-mode` endpoint (persists to same config the TUI uses).
3. Per-row Launch button in DetailPanel + `/api/launch` endpoint (calls `startExternalTool` etc.).
4. Missing-tool install modal (uses `getToolInstallPlan` from TUI engine, mirror of TUI `renderToolInstallPrompt`).
5. Incompatible-fallback modal (uses `getCompatibleTools` + `findSimiLarCompatibleModels` from TUI engine).
6. Smart Recommend modal (the largest piece — 3-question wizard + 10s analysis + Top 3 results; the TUI uses `scoreModelForTask` + `getTopRecommendations` which the Web can call via a new `/api/recommend` endpoint).
7. Update `Header.jsx` to remove the M3 `comingIn` badges from `Recommend` and the overflow menu; wire `Recommend` as a real nav item.
8. Update `App.jsx` `handleNavigate` to open the M3 modals (`recommend`, tool-install prompt, incompatible fallback) instead of toasting.
9. Wire `toolMode` prop into `ModelTable` row class (M1 already did the visual highlight — M3 just needs to pass the prop from the picker).
10. Tests for new helpers + bump `pnpm test` to 460+.
11. README Web Dashboard section updated; plan `§M3 detailed progress` ticked; changelog `vX.Y.Z.md` created (the user bumps the version after, not you).

---

### M1 detailed progress

- [x] **Layout refactor (foundational)**
  - [x] Remove `Sidebar.jsx` from `App.jsx` and `main.jsx`
  - [x] Delete `web/src/components/layout/Sidebar.jsx` + `Sidebar.module.css`
  - [x] Delete `web/src/components/map/MapView.jsx` + `MapView.module.css` + folder
  - [x] Move nav entries into `Header.jsx` (Dashboard, Settings, Analytics, Recommend, Router + overflow menu)
  - [x] Add `⌘K` button in header (real palette wired in M1; expanded command set ships in M2)
  - [x] Verify `.app-content` has no left rail, table is 100% width, resizes correctly
- [x] **Favorites** (star per row, persist, display mode toggle, reorder) — uses `/api/favorites` endpoint
- [x] **Per-model benchmark** (button in DetailPanel + clickable AI Lat. cell, live result)
- [x] **Reset view** button (counts active filters, resets all)
- [x] **Theme "auto"** cycle (tri-state: auto / dark / light)
- [x] ~~**StatsBar** above the table~~ — **removed post-M1**: noisy, users preferred the table + chips alone
- [x] **Custom text filter chip** + "X" clear
- [x] **Verdict + full Health filter chips** in FilterBar (9 verdict states, 7 health states)
- [x] **Hide-unconfigured** toggle (in Visibility dropdown, with 3-state cycle)
- [x] **Tool-compat dark-red row highlighting** (visual only, ready for M3 tool mode picker)
- [x] **URL deep-linking** read-only (`?view=…` hydrates on load; full filter hydration in M2)
- [x] **Tests**: cycle constants (TIER/STATUS/VERDICT/HEALTH/VISIBILITY) exported and tested against TUI order
- [x] **README** updated with the new Web Dashboard feature table
- [x] `pnpm test` green — 440 tests pass (was 434 before M1)
- [x] `pnpm build:web` clean
- [x] Live UI verified in Chrome DevTools: header nav, overflow menu, ⌘K palette, all filter chips render correctly

### M2 detailed progress

- [x] **Server endpoints** (all wired through the same `~/.free-coding-models.json` the TUI uses)
  - [x] `GET /api/version` — returns `{ local, latest, lastReleaseDate, error }`
  - [x] `POST /api/update/check` — force-fresh npm registry check
  - [x] `POST /api/update/run` — spawns the package manager upgrade
  - [x] `GET /api/changelog` — returns the parsed changelog directory (142 versions)
  - [x] `POST /api/settings/feature` — single-feature toggle (handles boolean + string values)
  - [x] `POST /api/key/:provider/test` — per-provider auth probe + chat ping (TUI `T` key parity)
  - [x] `POST /api/shell-env/toggle` — enable/disable shell env export
  - [x] `POST /api/legacy-cleanup` — run the discontinued-proxy cleanup
- [x] **Pre-existing bug fix** — `src/core/changelog-loader.js` path was `src/changelog/`, now correctly `../../changelog/` (project root). The TUI's changelog overlay was silently broken.
- [x] **React components**
  - [x] `useChangelog` hook — wraps `/api/changelog` with sortedVersions + getVersion helpers
  - [x] `useUpdateChecker` hook — polls `/api/version` every 5 min, exposes `updateAvailable` + `runUpdate`
  - [x] `useUrlState` hook — full read + write-back, debounced 80ms, `buildUrlParams` pure helper exported for tests
  - [x] `HelpView` modal — 11 sections, live search bar, mirrors TUI help content
  - [x] `ChangelogView` modal — two-phase (index + details), B-key to go back, deep-link to a specific version
  - [x] `UpdateChip` — header chip + popover with "Update now" + "What's new"
  - [x] **Full `CommandPalette`** — consumes `buildCommandPaletteEntries` from `src/tui/command-palette.js` (1:1 TUI registry), fuzzy-matches via `filterCommandPaletteEntries`, groups by section, handles TUI commands that don't have a Web equivalent with a friendly "arrives in M3/M4" toast
  - [x] **Full `SettingsView` parity** — theme dropdown, favorites mode toggle, startup AI speed scan toggle, shell env toggle, legacy proxy cleanup button, open Changelog link, update row, per-provider "Test" key button with outcome badge
- [x] **App.jsx wiring** — header modals (help / changelog), UpdateChip slot, URL state hydration, Esc closes any open overlay
- [x] **Tests** — `buildUrlParams` (4 cases), validation constants (3 cases), hook import smoke tests (3 cases) = **+10 new tests, 451 total**
- [x] `pnpm test` green
- [x] `pnpm build:web` clean
- [x] All 8 new endpoints verified via curl (theme / feature / cleanup / key test / shell-env / version / changelog / update)

### Post-M1 layout polish (date: 2026-06-01)

After BAWSS tested the live app, three UX fixes landed on top of M1:

- **StatsBar removed** — 5 cards above the table (Total / Online / Avg / Fastest / Providers) deleted. Files `web/src/components/dashboard/StatsBar.jsx` + `StatsBar.module.css` removed; import + usage stripped from `App.jsx`. The same data is reachable from the chips, the table, and the Analytics view.
- **FilterBar is now sticky** — `position: sticky; top: 60px; z-index: 99` so the chip row stays visible under the sticky header. Users never lose filter context when scrolling a long table.
- **Table is full-bleed / seamless** — `ModelTable.container` no longer has margin, border-radius, or left/right borders. The table flows edge-to-edge under the sticky header + sticky FilterBar.
- **Table header row stays sticky** — the `<th>` cells already had `position: sticky; top: 0`; with the new layout they now stick to the top of the table container's scroll, right under the FilterBar.
- **Ping countdown replaces "Pinging…"** — the FilterBar now always shows `next ping in Xs` (TUI style) instead of switching between `Pinging…` and the countdown. A small pulsing dot stays as the live indicator.

These changes are part of M1 (no new milestone). The plan stays as-is.

### M1 backend exception

The M1 plan said "no new backend." One small exception was made for
favorites: the Web needs `/api/favorites` (GET + POST) to share the
favorites array with the TUI through `~/.free-coding-models.json`.
Without it, the Web could only persist to localStorage and the two
surfaces would drift — which would break the parity promise.

The new endpoint is 50 lines of code, reuses the TUI's
`ensureFavoritesConfig` and `saveConfig` helpers verbatim, and lives in
`web/server.js` next to the existing `/api/settings` route. No new
modules, no new dependencies.

---

## 1. Executive summary

The TUI today exposes **~70 distinct user-facing features** (overlays,
command-palette entries, filter cycles, tool launches, daemon controls,
prompts). The Web Dashboard today exposes **~25** of them.

**Hard constraints baked into this plan:**

- **No left sidebar.** The model table is always **100% of the viewport
  width**. All navigation lives in the **Header** (header menu + always-
  visible header buttons). The user can resize the browser freely and the
  table never gets squeezed.
- **No TUI keyboard shortcuts on the Web**, except the universal
  `Ctrl+P` / `Cmd+K` for the command palette. The Web is mouse-first;
  the TUI stays keyboard-first. They diverge by design.
- **CLI flags are not ported as features.** They become **URL query
  parameters** so any CLI preset is shareable as a link (e.g.
  `?tier=S&sort=verdict&origin=groq`).

After deep diffing (`src/tui/key-handler.js`, `src/tui/command-palette.js`,
`src/tui/overlays.js`, `src/tui/render-table.js`, `src/tui/tui-state.js`,
`src/tui/tui-filters.js`, `web/src/App.jsx`, `web/src/hooks/useFilter.js`,
`web/src/components/**`, `web/server.js`), the gaps fall into three buckets:

| Bucket | What it is | Estimated items | Backend needed? |
|---|---|---:|---|
| **A. Engine already exists, only Web UI is missing** | Per-model benchmark, hide-no-key, theme "auto" cycle, etc. | ~12 | Sometimes |
| **B. New frontend + minor new endpoints** | Favorites, command palette, help, changelog, smart recommend, install endpoints, installed models, token usage, update flow | ~25 | Often |
| **C. Brand new surface** | Tool mode + tool launch, router dashboard, tool install prompt, incompatible fallback | ~10 | Yes (significant) |

A safe, shippable plan delivers the project in **five milestones** over
several PRs, each with a coherent scope, the right tests, and a clean
release. M1 unblocks the most-requested user actions (favorites + per-model
benchmark + the missing filters) for the smallest possible surface area,
and ships the foundational layout refactor (sidebar removed, table
full-width, header menu in place).

---

## 2. TUI feature inventory (source of truth)

### 2.1 Key bindings — intentionally NOT ported to Web

The TUI uses ~38 keyboard shortcuts to navigate (`src/tui/key-handler.js`).
**The Web Dashboard does NOT replicate these shortcuts** — the Web is
mouse-first and surfaces every action through the header menu, modals,
buttons, and form controls. The TUI keeps its keyboard-driven UX
unchanged.

**One exception:** the universal `Ctrl+P` / `Cmd+K` opens the command
palette in both surfaces. This is the only shortcut shared between TUI
and Web, and it stays in the TUI as-is.

> 📖 If a keyboard-driven user lands on the Web, they should be able to
> do everything with mouse + `Cmd+K`. The `Cmd+K` palette mirrors the
> TUI palette so power users can stay fast.

### 2.2 Overlays / screens (`src/tui/overlays.js`)

| Overlay | Trigger | Responsibilities |
|---|---|---|
| `renderSettings` | `P` | Provider keys, theme, favorites mode, startup AI scan, legacy cleanup, changelog link, shell-env export, update check, key test |
| `renderHelp` | `K` / `I` | Full key binding reference |
| `renderChangelog` | Palette / Settings | 2-phase (index → details) |
| `renderRecommend` | `Q` / `--recommend` | 3-question questionnaire → 10s analysis → Top 3 |
| `renderCommandPalette` | `Ctrl+P` | Fuzzy search across all commands + dynamic model filters |
| `renderInstallEndpoints` | Palette | 4-step wizard (provider → tool → connection → scope) |
| `renderInstalledModels` | Palette | Scan all tool configs, launch or soft-delete |
| `renderToolInstallPrompt` | Auto on Enter if tool missing | Yes/No install prompt |
| `renderIncompatibleFallback` | Auto on Enter if incompatible | Switch tool / similar model |
| `renderRouterDashboard` | `Shift+R` | Daemon health, sets, request log, probe mode, start/stop |
| `renderTokenUsage` | `Shift+T` | Today / 7-day chart / all-time |
| `renderRouterOnboarding` | First launch | Enable router Y/N |

### 2.3 Filter cycles (`src/tui/tui-filters.js`)

1. `hideUnconfiguredModels` (E, first)
2. `bestModeOnly` (E, second)
3. `favoritesPinnedAndSticky` (Y)
4. `tierFilterMode` (T — `null` or one of `S+ S A+ A A- B+ B C`)
5. `originFilterMode` (D — `null` or any provider key)
6. `verdictFilterMode` (V — `null` or `Perfect / Normal / Spiky / Slow / Overloaded / Down`)
7. `healthFilterMode` (H — `null` or `up / timeout / down / pending / noauth / auth_error`)
8. `customTextFilter` (from palette)

### 2.4 Command palette tree (`src/tui/command-palette.js`)

- **Filters** → tier (8) / provider (cycle + per-provider) / model (top 20 dynamic) / other
- **Sort** → rank, tier, origin, model, latest ping, avg ping, swe, ctx, health, verdict, stability, uptime
- **Actions** → target tool (cycle + 22 named), ping mode (cycle + 4), favorites mode (toggle + 2), favorite on row, cycle theme, reset view
- **Pages** → Settings, Help, Changelog, Smart Recommend, Install Endpoints, Installed Models, Router Dashboard, Token Usage
- **Update banner** → auto-prepended when newer npm version is known

### 2.5 Tool modes (`src/core/tool-metadata.js`)

`opencode, opencode-desktop, opencode-web, openclaw, crush, goose, pi,
aider, kilo, qwen, openhands, amp, hermes, continue, cline, xcode,
fcm_router, rovo, gemini, caveman, jcode, copilot, forgecode` —
**22 modes total**, each with its own color, emoji, and CLI flag.

### 2.6 CLI flags (`src/tui/cli-help.js` + `bin/free-coding-models.js`)

CLI flags stay a CLI-only feature (e.g. `--json` is meaningless in a
browser, `--fiable` is a one-shot CLI analysis, `--daemon-stop` is a
shell action). The Web does NOT need to expose any of them as buttons.

**However**, several CLI flags are really just *preset view state*:

- `--best` / `--premium` / `--tier S` / `--tier A`
- `--sort <col>` / `--desc` / `--asc`
- `--origin <provider>`
- `--hide-unconfigured` / `--show-unconfigured`
- `--ping-interval <ms>`
- `--recommend` (auto-open Smart Recommend)

These are ported to the Web as **URL query parameters** (see §5.4) so a
user can click a link like `http://localhost:3333/?tier=S&sort=verdict&origin=groq`
and land on a pre-filtered view. They are NOT buttons in the UI; they
are shareable links.

Flags that have no Web equivalent (kept CLI-only):

`--json`, `--fiable`, `--daemon`, `--daemon-bg`, `--daemon-status`,
`--daemon-stop`, `--sync-set [name]`, `--no-telemetry`, `--help/-h`,
and the 22 tool launch flags (`--opencode`, `--pi`, etc.) — the user
selects the tool from the header menu instead.

---

## 3. Web Dashboard inventory (today)

| Surface | Files | What it has |
|---|---|---|
| Layout | `App.jsx`, `Header.jsx`, `Sidebar.jsx` *(to be **removed**)*, `Footer.jsx` | 4 nav items (Dashboard, Settings, Analytics, Map), theme toggle, search, export, global benchmark button |
| Dashboard | `FilterBar.jsx`, `ModelTable.jsx`, `DetailPanel.jsx`, `StatsBar.jsx` (orphaned), `ExportModal.jsx` | Tier buttons, status buttons, provider select, ping mode buttons, 16-column TanStack table with resizable widths, detail panel on click, JSON/CSV/clipboard export |
| Settings | `SettingsView.jsx` | Provider cards: enable/disable, masked key, reveal, copy, save, delete, search |
| Analytics | `AnalyticsView.jsx` | Provider health bar, fastest-models leaderboard, tier distribution |
| Map | `MapView.jsx` | Placeholder only — to be **removed** (out of parity scope) |
| Hooks | `useFilter.js`, `useSocket.js`, `useSSE.js`, `useTheme.js`, `useColumnSizing.js` | All reactive state encapsulated |
| Server | `server.js` | 14 endpoints: `/api/models`, `/api/state`, `/api/health`, `/api/config`, `/api/events`, `/api/settings`, `/api/ping-mode`, `/api/ping-timer`, `/api/activity`, `/api/benchmark`, `/api/global-benchmark`, `/api/key/:provider`, plus static file serving |

### 3.1 Target layout (post-parity)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ HEADER (full width)                                                        │
│  [Logo]  [Dashboard] [Settings] [Analytics] [Recommend] [Router] [...]  [⌘K] [☀] │
├────────────────────────────────────────────────────────────────────────────┤
│ FilterBar (full width)                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ StatsBar (full width, slim)                                                │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ModelTable  ← 100% of viewport width, always                              │
│                                                                            │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ Footer                                                                     │
└────────────────────────────────────────────────────────────────────────────┘

[Modals layered on top, full-screen or centered]
  - Command palette (⌘K)
  - Help
  - Changelog viewer
  - Smart Recommend
  - Install Endpoints wizard
  - Installed Models
  - Update popover
```

**Rules:**
- No left sidebar. The model table uses 100% of the viewport width at all
  times. The user can resize the browser freely without anything else
  squeezing the table.
- The header holds every navigation entry. Views that are part of the
  daily flow (Dashboard, Settings, Analytics) are inline pages. Heavy /
  occasional views (Recommend, Router, Changelog, Help, Install
  Endpoints, Installed Models, Update) are modals that open from the
  header menu.
- `Cmd+K` (a.k.a. `Ctrl+P`) opens the command palette from anywhere. This
  is the only global keyboard shortcut.

---

## 4. Coverage matrix (delta)

Legend: ✅ parity · 🟡 partial · ❌ missing · 🆕 backend missing entirely.

Web delivery is split between **header menu items** (e.g. `Settings`,
`Recommend`, `Router`, `Help`, `Changelog`), **inline pages**
(`Dashboard`, `Analytics`, `Settings`), and **modals** (everything
heavy or one-off — Recommend, Changelog, Help, Install Endpoints,
Installed Models, Command palette, Update popover, Missing-tool
prompt, Incompatible fallback).

The TUI keyboard shortcuts are NOT ported; only `Ctrl+P` / `Cmd+K` is
shared (command palette). All other rows describe mouse/touch flows
that match the TUI outcome.

| # | TUI feature | TUI trigger | Web today | Web after | Notes |
|---|---|---|---|---|---|
| 1 | Tier filter cycle | `T` / palette | Tier buttons (✅) | Tier buttons + cycle chip in FilterBar | |
| 2 | Provider filter cycle | `D` / palette | `<select>` (🟡) | Cycle chip + dropdown hybrid in FilterBar | |
| 3 | Configured-only / Usable-only | `E` | ❌ | Filter chip in FilterBar | |
| 4 | Verdict filter | `V` | ❌ | New cycle chip in FilterBar | |
| 5 | Health filter (full granularity) | `H` | 3 states (🟡) | Full cycle chip in FilterBar | |
| 6 | Custom text filter + `X` clear | Palette + `X` | Search (🟡) | Sticky filter chip + "X" | |
| 7 | Favorites toggle | `F` | ❌ | Star button per row + DetailPanel | |
| 8 | Favorites display mode (pinned+sticky) | `Y` | ❌ | Toggle in FilterBar + persisted | |
| 9 | Reorder favorite priority | `Shift+↑↓` | ❌ | Drag handle on row + ↑↓ buttons in DetailPanel | |
| 10 | Per-model benchmark | `Ctrl+A` | ❌ (only global) | Per-row "▶" button + DetailPanel button | |
| 11 | Global benchmark | `Ctrl+U` | ✅ Header button | Header button (kept) | |
| 12 | Reset view (filters + sort) | `N` | ❌ | "Reset" button in FilterBar | |
| 13 | Theme "auto" | `G` | 🟡 (dark/light only) | Tri-state theme button in Header | |
| 14 | Tool mode cycling + launch | `Z` + `Enter` | ❌ | "Tools" header menu (22 modes) + Launch button in DetailPanel + "Launch" in row context menu | |
| 15 | Missing-tool auto-install | Auto on Enter | ❌ | Modal prompt + `/api/install-tool` | |
| 16 | Incompatible fallback | Auto on Enter | ❌ | Modal inside the launcher flow | |
| 17 | Smart Recommend | `Q` / `--recommend` | ❌ | Header menu item → modal with 3-step flow | |
| 18 | Help | `K` / `I` | ❌ | Header menu item → modal | |
| 19 | Changelog viewer | Palette / Settings | ❌ | Header menu item → modal (index + details) + link in Settings | |
| 20 | Command palette | `Ctrl+P` | ❌ | `Cmd+K` (or `Ctrl+P`) global modal — **the only shared shortcut** | |
| 21 | Install Endpoints wizard | Palette | ❌ | Header menu item → modal wizard | |
| 22 | Installed Models manager | Palette | ❌ | Header menu item → modal (scan + launch + delete) | |
| 23 | Router Dashboard | `Shift+R` | ❌ | Header menu item → page OR modal (TBD) + `/api/router/*` proxy | |
| 24 | Token Usage | `Shift+T` | ❌ | New "Tokens" panel inside Analytics page | |
| 25 | Update banner | `Shift+U` | ❌ | Header chip "⬆ vX.Y.Z available" → popover with "Update now" + "What's new" | |
| 26 | Hide-unconfigured toggle | `--hide-unconfigured` | ❌ | Toggle in FilterBar | |
| 27 | Tool-compat dark-red highlighting | Auto in TUI | ❌ | CSS class on row when tool mode is set | |
| 28 | Per-provider key test | `t` in Settings | ❌ | "Test" button in SettingsView | |
| 29 | Shell-env export toggle | Settings row | ❌ | Toggle in SettingsView | |
| 30 | Startup AI Speed Scan toggle | Settings row | ❌ | Toggle in SettingsView | |
| 31 | Legacy proxy cleanup | Settings row | ❌ | Button in SettingsView | |
| 32 | Header click flash | Mouse | ❌ (cosmetic) | Optional CSS animation | |
| 33 | CLI startup flag deep-linking | `--tier`, `--premium`, etc. | ❌ | URL query params: `?tier=S&sort=verdict&origin=groq` | |
| 34 | `--recommend` deep-link | CLI | ❌ | `?recommend=true` opens the Recommend modal | |
| 35 | Router onboarding | First launch | ❌ | First-run modal in App.jsx | |
| 36 | StatsBar | n/a | 🟡 orphaned | Wire above the table (full width) | |
| 37 | Sidebar | n/a | ✅ present (to remove) | **Removed** — menus move to Header | |
| 38 | Table full viewport width | n/a | 🟡 sidebar steals width | **100% width** after sidebar removal | |
| 39 | Map view | n/a | 🟡 placeholder | **Removed** — out of parity scope | |
| 40 | Cross-session reset all filters | `N` | ❌ | "Reset" button | |

**Coverage delta:** 13 ✅ / 6 🟡 / 21 ❌ today → target 40 ✅ by end of M5
(including the **new** layout baseline of no sidebar + full-width table).

---

## 5. Architecture

### 5.0 Layout decision (no sidebar, full-width table, header menu)

**The left `Sidebar` is being removed.** The model table must always use
**100% of the viewport width** (no left rail, no right rail, no padding
traps). All navigation entries move to the **Header**. The table can be
resized freely and never gets squeezed.

Navigation lives in the header as a flat row of buttons / a menu:

- **Always-visible header buttons:** `Dashboard`, `Settings`, `Analytics`,
  `Recommend`, `Router`.
- **Header menu (overflow / kebab):** `Help`, `Changelog`, `Install
  Endpoints`, `Installed Models`, `Update`, `Theme`, `Export`.
- **Always-visible on the right of the header:** `⌘K` button (opens
  command palette), theme toggle, ping-mode indicator.

Views are either **inline pages** (full-bleed below the header) or
**modals** (centered, large, with an Esc / outside-click close). The
table itself never lives in a modal — only helper / occasional views
do.

The TUI's keyboard-driven overlay model does not transfer. Each TUI
overlay is mapped to one of:
- a header menu item (heavy / occasional),
- a button in `DetailPanel` (per-row actions),
- a button in `FilterBar` (table-wide),
- the `⌘K` command palette (universal).

### 5.1 Mirror TUI state in the Web (no duplication of logic)

The TUI keeps a mutable `state` object. The Web should **not** mirror the
full structure 1:1; it should keep its React idioms. Instead:

- **Pure logic stays in `src/core/`** (already done: `utils.js`,
  `favorites.js`, `tui-filters.js` types, `tool-metadata.js`,
  `command-palette.js` registry, `tool-launchers.js`, `endpoint-installer.js`,
  `installed-models-manager.js`, `changelog-loader.js`, `recommend` scoring,
  `benchmark.js`, `updater.js`).
- **TUI-specific state stays in `src/tui/`**: `tui-state.js`,
  `key-handler.js`, `overlays.js`, `render-table.js`. These are **not**
  imported by the Web app. The Web has its own React state via hooks.
- **New shared selectors** (this plan introduces them) live in
  `src/core/web-shared.js` (a new file). Examples:
  - `filterModels(models, { tier, provider, verdict, health, mode, customText })` — pure function reused by `tui-filters.js` and a new `useFilter` in the Web.
  - `cycleValue(currentValue, cycleArray)` — pure helper.
  - `getModelLauncherState(model, toolMode)` — checks compat + missing-tool.
  - `scoreRecommend(answers, model, pingHistory)` — wraps `getTopRecommendations`.

> 📖 Mandate: **No new TUI feature ships without a Web equivalent** and vice
> versa. The TUI registry in `command-palette.js` is the canonical command
> list; the Web will consume the same registry via a small JSON export
> function (added to the file) so palette entries are 1:1.

### 5.2 New hook: split hooks per concern

```
src/web/src/hooks/
  useFavorites.js          ← localStorage + sync with /api/favorites
  useToolMode.js           ← cycle + persist to /api/tool-mode + launch
  useFilterChips.js        ← cycle tier/provider/verdict/health/E
  useChangelog.js          ← load + index + details
  useRecommend.js          ← 3-step wizard + analysis timer
  useRouterDashboard.js    ← poll + SSE + actions
  useUpdateChecker.js      ← poll npm + Header chip + popover
  useCommandPalette.js     ← Cmd+K / Ctrl+P modal, fuzzy match
  useInstalledModels.js
  useInstallEndpoints.js
  useTokenUsage.js
  usePaletteHotkey.js      ← only "Cmd+K / Ctrl+P" global shortcut
```

Each hook owns one concern, returns a small surface, and is testable in
isolation (the codebase already uses `node:test` for `src/core/utils.js`
and should expand to the Web through Vitest or a small `node:test` runner
against the Vite build).

> **No `useGlobalHotkeys`** — the Web only registers the single shared
> shortcut (`Cmd+K` / `Ctrl+P` → command palette). All other interactions
> go through the header menu, modals, and buttons.

### 5.3 New endpoints (server.js)

```
GET    /api/favorites                       → array of "providerKey/modelId" + mode
POST   /api/favorites                       → { action: 'add' | 'remove' | 'reorder', key, direction? }
POST   /api/tool-mode                       → { mode: 'opencode' | ... }
POST   /api/launch                          → { providerKey, modelId, mode }
POST   /api/install-tool                    → { mode } → spawns npm/pip installer
GET    /api/changelog                       → returns { versions: { '0.5.1': { added: [], fixed: [], ... } } }
GET    /api/version                         → { local, latest, lastRelease }
POST   /api/update/check                    → { latest }
POST   /api/update/run                      → { started: true } + spawn npm
POST   /api/recommend                       → { answers } → { top3, scores }
GET    /api/installed-models                → { results: [{ toolMode, label, models: [...] }] }
POST   /api/installed-models/:tool/:model/disable  → soft delete
POST   /api/install-endpoints               → { providerKey, toolMode, scope, modelIds?, connectionMode }
GET    /api/router/summary                  → { running, port, activeSet, requestTotals, tokenTotals, bestModel, degradedProviders }
GET    /api/router/quick-setup              → { baseUrl, model, apiKey, compatibleTools }
POST   /api/router/start                    → spawn --daemon-bg
POST   /api/router/stop                     → spawn --daemon-stop
POST   /api/router/restart                  → stop + start
GET    /api/router/sets                     → list of sets
POST   /api/router/sets/:name/reorder       → { order: ['provider/model', ...] }
GET    /api/router/events                   → SSE mirror of daemon /stream/events
GET    /api/router/tokens                   → { today, week[], allTime, topModels, topProviders }
POST   /api/key/:provider/test              → mirror TUI testProviderKey (parallel auth probe + chat ping)
POST   /api/settings/feature                → { key: 'shellEnvEnabled'|'runAiSpeedTestOnStartup'|'legacyProxyCleanup', value }
POST   /api/telemetry                       → opt-in browser-side telemetry mirror
```

**Design rule:** every endpoint must be **stateless, idempotent** (except
mutations), and **read from / write to `~/.free-coding-models.json`** through
the same helpers the TUI uses (`loadConfig`, `saveConfig`,
`persistApiKeysForProvider`, `toggleFavoriteModel`, `reorderFavorite`,
`addApiKey`, `removeApiKey`). No business logic in the routes.

### 5.4 URL deep-linking (the Web's answer to CLI flags)

CLI startup flags like `--tier S`, `--premium`, `--origin groq`,
`--hide-unconfigured`, `--recommend`, `--sort verdict`, `--desc` are
really just **preset view state**. On the Web they become **URL query
parameters** so a user can share a link, bookmark a setup, or have a
shell command open a pre-filtered dashboard.

Add a small `useUrlState.js` hook that:

- On mount, hydrates from query params: `?tier=S&sort=verdict&origin=groq&toolMode=opencode&recommend=true&palette=open&hideUnconfigured=1`.
- Pushes updates back to the URL (via `history.replaceState`) whenever a
  filter / sort / tool mode / palette state changes — without page reload.
- Stays out of the way: defaults match the TUI's defaults, so an empty
  URL still works.

CLI flag → URL param mapping:

| CLI flag | URL param | Effect on Web |
|---|---|---|
| `--tier S\|A\|B\|C` | `?tier=S+` (or `S`, `A+`, `A`, …) | Sets the tier filter chip |
| `--premium` | `?tier=S&sort=verdict&dir=asc` | Convenience shortcut |
| `--sort <col>` | `?sort=verdict` | Sets the sort column |
| `--desc` / `--asc` | `?dir=desc` / `?dir=asc` | Sets the sort direction |
| `--origin <provider>` | `?origin=groq` | Sets the provider filter |
| `--hide-unconfigured` | `?hideUnconfigured=1` | Toggles the FilterBar chip |
| `--show-unconfigured` | (omitted) | Default behavior |
| `--ping-interval <ms>` | `?pingMode=speed\|normal\|slow\|forced` | Sets the ping mode |
| `--best` | `?tier=S&sort=verdict` | Convenience shortcut |
| `--recommend` | `?recommend=true` | Opens the Recommend modal on load |

Flags that have NO Web equivalent (kept CLI-only): `--json`,
`--fiable`, `--daemon`, `--daemon-bg`, `--daemon-status`,
`--daemon-stop`, `--sync-set [name]`, `--no-telemetry`, `--help/-h`,
and the 22 tool launch flags. The user picks the tool from the
**header menu** instead.

> 📖 Future-friendly: the `bin/free-coding-models.js --premium` flag
> could also open the Web URL with the same params, but that is out of
> scope for the parity work.

### 5.5 Global keyboard shortcuts

**The only global shortcut is `Cmd+K` (macOS) / `Ctrl+P` (Win/Linux)**
which toggles the command palette. Everything else is mouse-driven.

`usePaletteHotkey.js` registers that single shortcut and ignores the
event when a text input is focused. The command palette itself
consumes its own keys (arrows, Enter, Esc, type to search) while open.

### 5.6 Command palette component

- New `web/src/components/palette/CommandPalette.jsx` + CSS module.
- Consumes the TUI registry via a new helper in
  `src/tui/command-palette.js`:

  ```js
  export function getCommandPaletteSnapshot() {
    return buildCommandPaletteTree([]) // no dynamic models needed for static entries
  }
  ```

  This is plain JSON, so the Web can ship it as `import` and never drift.

- `Cmd+K` (or `Ctrl+P`) opens it; Esc closes; click outside closes
  (already a pattern in `ExportModal`).
- Group categories: Filters, Sort, Actions, Pages, Update (when available).
- Click a category to expand/collapse (mirrors TUI `→/←`).
- A small **`⌘K`** button in the header is always visible (so users
  discover the shortcut).

### 5.7 Favorites (key shared concern)

- Add a `favorites: string[]` array on `~/.free-coding-models.json`
  (already there in TUI; expose to Web).
- New `useFavorites` hook reads/writes via `/api/favorites`.
- `ModelTable` rows show a star button. Click toggles.
- Toolbar shows "Pinned" mode toggle (the TUI `Y` key). When pinned,
  favorites bypass filters and stay at the top.
- Reorder: drag handle in the row (HTML5 drag/drop), or `↑/↓` buttons
  inside the DetailPanel favorites section.

### 5.8 Tool mode + launch (biggest piece)

- New `/api/tool-mode` and `/api/launch` endpoints that shell out to the
  same launchers the TUI uses (`src/core/tool-launchers.js`,
  `src/core/opencode.js`, `src/core/openclaw.js`, `src/core/kilo.js`,
  `src/core/tool-bootstrap.js`).
- New `useToolMode` hook returns `{ toolMode, cycle, setMode, launch }`.
- Toolbar: new "Tools" chip with cycle arrow + dropdown of all 22 modes.
- `Launch` button in `DetailPanel` and the main table row (right-click
  menu or dedicated button column).
- Compat highlighting: when a tool mode is set, the row of an incompatible
  model gets `.incompatible` (dark red) class, mirroring TUI.
- Missing-tool prompt: pre-launch modal asks to install the missing binary
  using `getToolInstallPlan` + `installToolWithPlan` (already in
  `src/core/tool-bootstrap.js`).
- Incompatible-fallback: if model is incompatible, show a modal listing
  compatible tools and 3 similar compatible models (uses
  `findSimiLarCompatibleModels` from `src/core/tool-metadata.js`).

### 5.9 Settings parity

- `SettingsView.jsx` already covers keys + enable/disable. Add:
  - **Test key** button per provider (calls `/api/key/:provider/test`).
  - **Theme** dropdown (Auto / Dark / Light).
  - **Favorites mode** toggle.
  - **Startup AI Speed Scan** toggle.
  - **Shell env export** toggle.
  - **Legacy proxy cleanup** button.
  - **Open Changelog** link → opens the new Changelog tab.
  - **Update status row** (check + version).
- Each new control posts to `/api/settings/feature` (single endpoint, the
  same key the TUI uses on its config object).

### 5.10 Changelog viewer

- New `useChangelog` hook loads `/api/changelog` (server reads
  `changelog/v*.md` exactly like `changelog-loader.js`).
- Two-phase modal: index of versions + details pane. Esc closes, an
  on-screen "Back" button mirrors the TUI `B` key.
- Triggered from the **header menu** ("Changelog") and from Settings
  ("Open Changelog" link).

### 5.11 Smart Recommend

- New **header menu item** ("Recommend") opens a full-screen modal.
- `useRecommend` hook implements the 3-question wizard, the 10s analysis
  timer, and the Top 3 results. Reuses `getTopRecommendations` from
  `src/core/utils.js`.
- During analysis: live progress (timer + ping count).
- On result: "Launch" button per recommendation (uses the same tool mode
  / launch flow as the rest of the Web) + "Pin" toggle (favorites).
- Deep-linkable: `?recommend=true` opens this modal on load.

### 5.12 Router Dashboard

- New **header menu item** ("Router") opens a full-screen view (page-like
  modal). Could be a dedicated page; the implementation detail is to
  keep it reachable from the header and easy to close.
- Reuses all the daemon endpoints (`/health`, `/stats`, `/sets`,
  `/stream/events`, `/probes`) via a small proxy in `server.js` (so the
  Web doesn't need to know the daemon port).
- Shows the same hero card, request log, set manager, probe mode as the
  TUI overlay.
- "Start/Stop" buttons call `/api/router/start` and `/api/router/stop`.
- "Quick setup" panel copies the Base URL + model + key to clipboard.

### 5.13 Token Usage

- New "Tokens" panel inside the **Analytics page** (not a separate tab).
- 7-day bar chart (lightweight: no charting library; pure CSS bars).
- Top models / top providers breakdown.
- `/api/router/tokens` aggregates from `~/.free-coding-models-tokens.json`
  (TUI already has the file).

### 5.14 Update flow

- New `useUpdateChecker.js` polls `/api/version` every 5 min (TUI does
  the same).
- When newer, show a Header chip: "⬆ v0.6.0 available" — click opens a
  popover with "Update now" + "What's new" (deep-link to Changelog
  modal).
- "Update now" calls `/api/update/run` which spawns `npm i -g ...` and
  tells the user to restart the server. (Mirror TUI's `Shift+U`
  behavior — same caveats apply.)

### 5.15 Help screen

- New `HelpView.jsx` renders the same content as the TUI help overlay
  (markdown → JSX, sectioned by category).
- Triggered from the **header menu** ("Help") and from the command
  palette. No global `?` shortcut (Web users have the header).
- Live search bar at the top.

### 5.16 Install Endpoints + Installed Models

- "Install Endpoints" = full-screen modal wizard (provider → tool →
  connection → scope), backed by `/api/install-endpoints`. Triggered
  from the **header menu**.
- "Installed Models" = full-screen modal: scanned configs grouped by
  tool, with launch and soft-delete actions. Triggered from the
  **header menu**.
- Reuses `installProviderEndpoints` and `scanAllToolConfigs` /
  `softDeleteModel` from `src/core/endpoint-installer.js` and
  `src/core/installed-models-manager.js`.

### 5.17 StatsBar wiring

The `StatsBar.jsx` already exists but is orphaned. Wire it into
`App.jsx` **above the table** (slim horizontal strip, full width)
showing 5 cards: total, online, avg, fastest, providers.

### 5.18 Misc

- Wire `useSSE.js` to also drive the analytics / token counters.
- **Remove the `MapView` placeholder entirely** (out of parity scope).
- Document the parity in `README.md` and the `docs/` folder.

---

## 6. Milestones (PR-sized)

### M1 — Layout refactor + engine-quick wins (no new backend)

> 1 PR, ~3–4 days. Removes the sidebar, makes the table full-width, and
> ships the most visible "TUI can, Web can't" items.

- **Layout refactor (foundational)**:
  - Remove `Sidebar.jsx` from `App.jsx` and `main.jsx`.
  - Delete `Sidebar.module.css` and the `web/src/components/map/MapView.jsx`
    placeholder (and its CSS module).
  - Move navigation entries into `Header.jsx`: `Dashboard`, `Settings`,
    `Analytics`, `Recommend`, `Router`, plus an overflow menu (kebab) for
    `Help`, `Changelog`, `Install Endpoints`, `Installed Models`.
  - Add a small **`⌘K`** button on the right of the header.
  - Make the table truly 100% width: verify `.app-content` has no left
    rail, the table fills the viewport, and resizing the browser reflows
    the table.
- Favorites (star button per row, persist, display mode toggle, reorder).
- Per-model benchmark (button in DetailPanel, "▶" in row, live cell).
- Reset view button.
- Theme "auto" cycle (tri-state).
- StatsBar wired above the table.
- Custom text filter chip + "X" clear.
- Verdict + full Health filter chips in FilterBar.
- Hide-unconfigured toggle.
- Tool-compat dark-red row highlighting (no launch yet, just visual).
- Deep-link URL params: `?tier=…&sort=…&origin=…&toolMode=…` (read-only
  for now; M2 will add write-back).
- Tests: `pnpm test` + new `node:test` for `useFavorites` reducer.

**Acceptance:**
- The model table spans 100% of the viewport at every browser size.
- No `Sidebar` is rendered anywhere; no `MapView` is rendered.
- Every feature above is reachable from the dashboard view without leaving it.
- Server.js untouched; TUI untouched.
- README updated to list each feature in the Web table.
- All 62 existing unit tests + new tests for the parity work pass.
- `pnpm start` shows no runtime errors.

### M2 — Settings parity + command palette + URL write-back + help/changelog/update

> 1–2 PRs, ~5 days.

- Settings view: theme, favorites mode, startup AI scan, shell env,
  legacy cleanup, test key, update row, changelog link.
- Command palette (`Cmd+K` / `Ctrl+P`) with all the registry entries
  from `src/tui/command-palette.js`. The palette is reachable from
  anywhere via the header `⌘K` button.
- Help modal (render the same content as TUI help).
- Changelog modal (index + details).
- Update flow (header chip + popover + `/api/update/check` +
  `/api/update/run`).
- `useUrlState.js` now also writes back to the URL on filter / sort /
  tool mode / palette state changes.
- New endpoints: `/api/version`, `/api/update/check`, `/api/update/run`,
  `/api/settings/feature`, `/api/changelog`, `/api/key/:provider/test`.

**Acceptance:**
- All Settings rows from the TUI exist in the Web.
- `Cmd+K` opens the palette, fuzzy search works, every TUI command is
  present.
- `Esc` closes any open modal.
- The header `⌘K` button is always visible.
- Update chip shows when a newer version exists.
- Sharing a URL with `?tier=S&sort=verdict&origin=groq` opens the
  pre-filtered view.
- All tests pass.

### M3 detailed progress

> 📖 All M3 work goes in this section. Tick the boxes as features land.

- [ ] **Tool mode picker (Header)** — `ToolPicker` component + `useToolMode` hook
  - [ ] Wire `useToolMode` (GET + POST `/api/tool-mode`) so the choice persists to the same config the TUI uses
  - [ ] `ToolPicker` dropdown listing all 22 tools from `TOOL_METADATA` (emoji + label)
  - [ ] Cycle button (TUI `Z` key parity) — `cycleToolMode()` + visual highlight of the active tool
  - [ ] Pass `toolMode` from picker to `ModelTable` (M1 row highlight already wired, just need the data flow)
- [ ] **Per-row Launch button**
  - [ ] `LaunchButton` component used in DetailPanel + the table row (rocket icon, hover-visible)
  - [ ] `POST /api/launch` server endpoint that calls `startExternalTool` / `startOpenCode` / `startOpenClaw` from the TUI engine
  - [ ] On launch success: toast "Launched <model> in <tool>" + call `syncFavoritesToRouter` mirror
  - [ ] On 409 (missing tool) → open `InstallToolModal` (step 4)
  - [ ] On incompatible model → open `IncompatibleFallbackModal` (step 5)
- [ ] **Detail panel: tool indicator + Launch button**
  - [ ] Tool indicator in DetailPanel header (e.g. "Tool: 📦 OpenCode CLI ▾")
  - [ ] Launch button below the benchmark button
  - [ ] "Open in compatible tool" link when the model is incompatible with the active tool
- [ ] **Missing-tool install modal**
  - [ ] `InstallToolModal` Yes/No prompt mirroring TUI `renderToolInstallPrompt`
  - [ ] `POST /api/install-tool` server endpoint that calls `installToolWithPlan` from `src/core/tool-bootstrap.js`
  - [ ] Use `getToolInstallPlan` for the install summary + docs URL
  - [ ] Success path: close modal, re-trigger the original Launch attempt
- [ ] **Incompatible-fallback modal**
  - [ ] `IncompatibleFallbackModal` mirroring TUI `renderIncompatibleFallback`
  - [ ] "Switch tool" section (compatible tools, click → cycle + re-launch)
  - [ ] "Similar models" section (3 alternatives from `findSimiLarCompatibleModels`, click → launch the similar one)
  - [ ] All data from the TUI engine helpers — no new server endpoint needed
- [ ] **Smart Recommend modal** (largest piece)
  - [ ] `RecommendView` with 3-question wizard (Q1 `TASK_TYPES`, Q2 `PRIORITY_TYPES`, Q3 `CONTEXT_BUDGETS`)
  - [ ] Analyzing phase (10s, 2 pings/sec) with progress UI
  - [ ] `useRecommend` hook calling `POST /api/recommend` with `{ answers }`
  - [ ] Server endpoint calls `getTopRecommendations(answers, models)` + `scoreModelForTask` from `src/core/utils.js`
  - [ ] Top 3 results with score, "Pin + Launch" button per result (favorites + launch combined)
  - [ ] Deep-linkable: `?recommend=true` opens the modal on load
  - [ ] Wire into Header `NAV_ITEMS` (remove M3 `comingIn` badge)
- [ ] **Telemetry mirror**
  - [ ] `POST /api/telemetry/event` from launch + recommend flows
  - [ ] No new behavior — just makes sure the Web doesn't silently bypass telemetry
- [ ] **URL deep-linking** (tool mode)
  - [ ] Add `toolMode` to `VALID_*` allowlist in `urlState.constants.js`
  - [ ] Wire into `buildUrlParams` (only when toolMode is set, similar to other params)
  - [ ] `useToolMode` hydrates from `?toolMode=…` on mount
- [ ] **Tests** — +20 new tests:
  - [ ] `useToolMode` round-trip + 422 error handling
  - [ ] `useRecommend` wizard → analysis → results smoke
  - [ ] `LaunchButton` click → `/api/launch` → success toast smoke
  - [ ] `InstallToolModal` Yes / No / dismissed states smoke
  - [ ] `IncompatibleFallbackModal` two-section layout + click handlers smoke
  - [ ] Pure helper: `recommendScoreShape` (validates top3 payload)
  - [ ] Pure helper: `toolInstallSummary` (formats a `getToolInstallPlan` for display)
  - [ ] URL state: `toolMode` round-trips through buildUrlParams
  - [ ] Target: 460+ tests pass total
- [ ] **README** — add Tool picker, Launch button, Recommend modal, install / fallback modals to the Web Dashboard features table
- [ ] **Plan** — tick all M3 boxes above
- [ ] **Changelog** — create `changelog/v0.5.7.md` (or whatever the bump is)
- [ ] `pnpm test` green — 460+
- [ ] `pnpm build:web` clean
- [ ] Live verified in Chrome DevTools: pick tool → row highlight changes → click Launch → end up in the tool → if incompatible, fallback modal shows up → if not installed, install modal shows up → Recommend modal returns Top 3

### M3 — Smart Recommend + Tool mode/launch

> 2 PRs, ~1 week. The biggest single change. The Web Dashboard finally
> gains the ability to *do something* with the catalog — pick a model, pick
> a tool, hit Launch — instead of just observing it.

#### M3 implementation order (DO NOT re-order)

The features build on each other: toolMode is needed before Launch can
work; Launch is needed before the install / fallback modals can be
exercised; Smart Recommend is the largest piece and ships last because
it needs the data plumbing (toolMode, launch results) to be sane first.

1. **Tool mode picker** (Header)
   - Add a "Tools" button to the header (right side, before the ⌘K button).
     Click → dropdown listing all 22 tools from `TOOL_METADATA` with
     their emoji + label. Active one highlighted.
   - Click a tool → setToolMode(newMode) → row compat highlighting
     updates instantly.
   - Persist via new `useToolMode` hook + `/api/tool-mode` endpoint
     (POST `{ mode: 'opencode' }` / GET current).
   - For the cycle UX (TUI `Z` key), expose a small "↻" button next to the
     dropdown trigger that calls `cycleToolMode()`.
   - Wire into `ModelTable` via the `toolMode` prop (M1 already passed it;
     the table already applies the `.incompatible` row class).

2. **Per-row Launch button** (DetailPanel + table row)
   - Add a "🚀 Launch" button in the DetailPanel (below the benchmark
     button). Click → calls `/api/launch` with `{ providerKey, modelId,
     toolMode }`.
   - The table row gets a small rocket icon in the last column (or
     appended to the existing layout) — only visible on hover / when
     a tool mode is set.
   - `/api/launch` endpoint:
     - Calls the TUI's `startExternalTool(toolMode, model, config)` (or the
       dedicated launcher for opencode / openclaw / kilo).
     - Persists `toolMode` to the config so the next TUI launch picks it
       up.
     - Calls the existing `syncFavoritesToRouter` so the router fallback
       chain stays current.
     - On launch success → toast "Launched <model> in <tool>".
     - On missing tool → opens the install modal (step 4) with the model
       pre-filled.
     - On incompatibility → opens the fallback modal (step 5).

3. **Detail panel "tool mode" indicator**
   - The DetailPanel header already shows the model's tier, provider, etc.
     Add a small "Tool: <emoji> <name> ▾" indicator that opens the same
     Tools dropdown as the header (so users can change the tool without
     going back to the table).
   - If the model is incompatible with the active tool, show a warning
     chip and an "Open in compatible tool" link that opens the fallback
     modal (step 5).

4. **Missing-tool install modal**
   - Mirror of TUI `renderToolInstallPrompt` (in `src/tui/overlays.js`).
   - Triggered when `/api/launch` returns 409 (tool not installed) OR
     when the user clicks the Install button in the Settings page.
   - Body: Yes / No buttons. "Yes" → calls `/api/install-tool` → spawns
     `installToolWithPlan` server-side. "No" → dismiss.
   - Uses `getToolInstallPlan` from `src/core/tool-bootstrap.js` to get
     the install summary, docs URL, and shell command.
   - New server endpoint: `POST /api/install-tool` body `{ mode }`.

5. **Incompatible-fallback modal**
   - Triggered when the user tries to Launch a model that's not
     compatible with the active tool.
   - Uses `getCompatibleTools(model.providerKey)` and
     `findSimiLarCompatibleModels(model, toolMode, allResults, 3)` from
     `src/core/tool-metadata.js` (already imported by M1's ModelTable).
   - Two sections:
     - "Switch tool": list of compatible tool modes; click → cycle to
       that tool and re-launch.
     - "Similar models": 3 alternative models with comparable SWE
       scores; click → launch the similar one in the current tool.
   - Mirror of TUI `renderIncompatibleFallback` (in `src/tui/overlays.js`).
   - No new server endpoint needed — the data is computed client-side
     from the same helpers the TUI uses.

6. **Smart Recommend modal** (the largest piece)
   - "Recommend" header item → full-screen modal (mirror of TUI
     `renderRecommend` in `src/tui/overlays.js`).
   - 3-question wizard (TUI parity):
     - Q1 "What are you working on?" → `TASK_TYPES` options
     - Q2 "What matters most?" → `PRIORITY_TYPES` options
     - Q3 "How big is your context?" → `CONTEXT_BUDGETS` options
   - After Q3 → "Analyzing..." phase (10s, 2 pings/sec) → call
     `/api/recommend` with `{ answers: { taskType, priority, contextBudget } }`.
   - Server calls `getTopRecommendations(answers, models)` from
     `src/core/utils.js` → returns Top 3 with score + reason.
   - Each result row: model name, provider, score, "Pin + Launch" button
     (calls `/api/favorites` + `/api/launch`).
   - Server endpoint: `POST /api/recommend` body `{ answers }` →
     `{ top3: [{ result, score, reason }] }`.
   - Deep-linkable: `?recommend=true` opens the modal on load.

7. **Telemetry mirror** (small, do it last)
   - When the user launches a model, call a new
     `POST /api/telemetry/event` (no-op or local) with the same shape
     the TUI sends. This is mostly defensive (the actual telemetry
     infra is server-side in `src/core/telemetry.js`) — M3 just makes
     sure the Web doesn't have a code path that silently bypasses it.

#### M3 server endpoints (all new)

```
GET    /api/tool-mode                        → { mode }
POST   /api/tool-mode    { mode }            → 200, persists to config.settings.preferredToolMode
POST   /api/launch       { providerKey, modelId, toolMode? } → { started, mode }
POST   /api/install-tool { mode }            → { ok, exitCode }
POST   /api/recommend    { answers }         → { top3: [{ result, score, reason }] }
POST   /api/telemetry/event { event, properties } → 200
```

#### M3 React components / hooks (all new)

```
web/src/hooks/useToolMode.js         — GET + POST /api/tool-mode, exposes { toolMode, setToolMode, cycleToolMode }
web/src/hooks/useRecommend.js        — POST /api/recommend, exposes { recommend, loading }
web/src/components/tools/ToolPicker.jsx  + CSS — Header Tools dropdown
web/src/components/recommend/RecommendView.jsx + CSS — 3-question wizard + Top 3
web/src/components/launch/LaunchButton.jsx — per-row + DetailPanel rocket button
web/src/components/launch/InstallToolModal.jsx + CSS — missing-tool install prompt
web/src/components/launch/IncompatibleFallbackModal.jsx + CSS — fallback picker
```

#### M3 files to modify

- `web/src/components/layout/Header.jsx` — remove `comingIn: 'M3'` from `NAV_ITEMS`; add the `ToolPicker` to the right side
- `web/src/App.jsx` — `handleNavigate('recommend')` opens the Recommend modal (no longer toasts); add modals for `Recommend`, `InstallTool`, `IncompatibleFallback`; wire `toolMode` from `useToolMode` into `ModelTable` and `LaunchButton`
- `web/src/components/dashboard/ModelTable.jsx` — add the per-row launch button (rocket icon column, hover-visible); pass `toolMode` from the picker into the row class
- `web/src/components/dashboard/DetailPanel.jsx` — add the Launch button (below the benchmark button), the tool indicator in the header, and the "Open in compatible tool" link when incompatible
- `web/src/components/dashboard/FilterBar.jsx` — add the visibility / tool picker status to the chip row (TUI shows the active tool in the header; the Web can mirror that)
- `web/src/hooks/useUrlState.js` — add `toolMode` to the URL param allowlist (`?toolMode=opencode`) + write-back
- `web/server.js` — 5 new endpoints (above); reuse `startExternalTool`, `getToolInstallPlan`, `installToolWithPlan`, `getTopRecommendations`, `scoreModelForTask` from the TUI engine modules

#### M3 tests (new, +20 target)

- `useToolMode`: round-trips mode through the API, handles 422 errors.
- `useRecommend`: smoke test the wizard → analysis → results flow.
- `LaunchButton`: smoke test the click → `/api/launch` → success toast.
- `InstallToolModal`: smoke test the Yes / No / dismissed states.
- `IncompatibleFallbackModal`: smoke test the two-section layout + click handlers.
- Pure helpers: `recommendScoreShape` (validates the top3 payload shape), `toolInstallSummary` (formats a `getToolInstallPlan` for display).
- URL state: add `toolMode` to the allowlist in `urlState.constants.js` and verify it round-trips.

Target: **460+ tests pass** after M3.

#### M3 docs

- README "Web Dashboard features" table — add the new entries (Tool picker, Launch button, Recommend modal, install / fallback modals).
- `ideas/tui-web-feature-parity.md` — tick `§M3 detailed progress` items below.
- `changelog/v0.5.7.md` (or whatever the bump is) — the user does the bump + push; you just create the file.

#### M3 acceptance

- A user can pick a model in the Web, pick a tool from the Header dropdown, click Launch in the DetailPanel, and end up inside that tool with the same flow as the TUI.
- If the tool isn't installed, the Web shows the same install prompt the TUI shows, and "Yes" installs it.
- If the model is incompatible, the Web shows the fallback picker (switch tool OR pick a similar model).
- A user can answer 3 questions in the Recommend modal and get the same Top 3 the TUI would.
- All 460+ tests pass; TUI source untouched (only the Web layer + the server route file change).
- CI/CD Docker image rebuilds automatically (issue #95's fix means the M3 release will also get a fresh Docker tag without manual intervention).

### M4 — Router Dashboard + Token Usage + Installed Models + Install Endpoints

> 2 PRs, ~1 week.

- Router header item: hero card, request log, set manager, probe mode,
  start/stop. Quick-setup card (copy base URL / model / key).
- Token Usage sub-section of Analytics (7-day chart, top models,
  top providers).
- Installed Models header item: modal (scan + launch + soft-delete).
- Install Endpoints header item: modal wizard (4 steps).
- New endpoints: all `/api/router/*` listed in §5.3.

**Acceptance:**
- The Web shows the same router state the TUI would, in real time.
- Quick-setup card copies values to clipboard on click.
- All tests pass; TUI untouched.

### M5 — Polish, accessibility, tests, release

- Mobile / narrow-viewport layout for the header (collapsing the menu
  into a hamburger without ever reintroducing a sidebar).
- Add `aria-label` to all interactive controls.
- Add `:focus-visible` outlines.
- Add a Storybook-style catalog page for the design system.
- Add `web/src/components/__tests__/useFavorites.test.js` (Vitest or
  `node:test`).
- Update `README.md` with the new Web feature list.
- Update `docs/local-web-ui.md` to mark parity work done.
- Bump version. Tag release. Verify on npm.

**Acceptance:**
- Web passes Lighthouse accessibility ≥ 95.
- All tests green.
- CHANGELOG entry under `changelog/vX.Y.Z.md`.
- Real npm install of the new version works (per AGENTS.md release
  process).

---

## 7. Per-feature implementation notes (cheat sheet)

| Feature | Files touched | Tests | Cross-surface note |
|---|---|---|---|
| **Layout (no sidebar, full-width table, header menu)** | `App.jsx`, `Header.jsx`, *delete* `Sidebar.jsx` + `Sidebar.module.css` + `MapView.jsx` + `MapView.module.css`, update `global.css` | snapshot of new `App.jsx` + new header menu test | TUI layout is independent; this is Web-only |
| Favorites | `ModelTable.jsx`, `useFavorites.js`, server `/api/favorites`, tui `command-palette.js` (no change) | `useFavorites.test.js`, `favorites.test.js` | TUI already uses same config; no behavior change |
| Per-model benchmark | `ModelTable.jsx`, `DetailPanel.jsx`, server `/api/benchmark` exists, new `useBenchmarkRow.js` | reuse `benchmark.test.js` | Backend already there |
| Reset view | `FilterBar.jsx`, `useFilter.js` | unit | TUI N key still works |
| Theme "auto" | `useTheme.js` | unit | TUI G key still works |
| Verdict / Health chips | `FilterBar.jsx`, `useFilter.js` | unit | Backed by TUI's `VERDICT_CYCLE` / `HEALTH_CYCLE` constants |
| Tool mode + launch | new `useToolMode.js`, `LaunchButton.jsx`, `ToolCompatBadge.jsx`, `InstallToolModal.jsx`, `IncompatibleFallbackModal.jsx`; new server routes | unit + integration | Reuses all TUI launcher modules |
| Smart Recommend | new `RecommendView.jsx`, `useRecommend.js`; new server `/api/recommend` | integration | Wraps `getTopRecommendations` |
| Command palette | new `palette/CommandPalette.jsx`, `useCommandPalette.js`, `usePaletteHotkey.js`; new export `getCommandPaletteSnapshot` in tui | snapshot test | TUI registry becomes single source of truth |
| Help | new `HelpView.jsx` | snapshot | Same content as TUI help |
| Changelog | new `ChangelogView.jsx`, `useChangelog.js`; new `/api/changelog` | snapshot | Reuses `loadChangelog` |
| Update flow | new `UpdateChip.jsx`, `useUpdateChecker.js`; new `/api/version`, `/api/update/check`, `/api/update/run` | unit | Same data source |
| Router dashboard | new `RouterView.jsx`, `useRouterDashboard.js`; new `/api/router/*` | integration | Mirrors TUI overlay 1:1 |
| Token usage | new `TokenUsagePanel.jsx`; new `/api/router/tokens` | unit | Same data file |
| Install endpoints | new `InstallEndpointsView.jsx`; new `/api/install-endpoints` | integration | Reuses `installProviderEndpoints` |
| Installed models | new `InstalledModelsView.jsx`; new `/api/installed-models` | integration | Reuses `scanAllToolConfigs` |
| StatsBar wiring | `App.jsx`, `FilterBar.jsx` | none | Cosmetic |
| URL deep-linking | new `useUrlState.js` | unit | The Web's answer to CLI flags |

---

## 8. Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Tool launch in browser triggers weird popups/permission prompts | UX break | Always use the same launcher functions the TUI uses (server-side spawn) and surface the launched process in a "Sessions" toast. |
| Header menu grows unwieldy on narrow viewports | Lost navigation | M5 ships a hamburger collapse for narrow widths — never reintroduce a sidebar. |
| Vite bundle size grows past 1 MB | Slow first paint | Code-split each new view via `React.lazy`; keep shared atoms in the same chunk. |
| Cross-surface regression: TUI breaks because a shared helper changed | CLI users affected | Add a `node:test` for every helper the Web introduces. TUI tests are the canary. |
| Long-lived SSE breaks through reverse proxies | Live updates stop | Keep the existing `?transport=polling` fallback in socket.io (already configured). |
| New endpoints missing CSRF / origin check | Local-only risk but possible if user exposes the port | Lock the server to `127.0.0.1` by default (already `FCM_HOST=0.0.0.0` env override) and add a same-origin check on mutations. |
| npm `update` step kills the running server | Update flow fails | Use `npm i -g <pkg>@<ver>` with `--silent`, then print a "Restart the dashboard to apply" toast (same as TUI behavior). |
| Command palette registry drifts from TUI | Parity promise broken | Add a snapshot test that compares `getCommandPaletteSnapshot()` against an expected JSON on both surfaces. |
| Per-model benchmark rate-limited | User spam-clicks | Reuse the same `benchmarkRunning` Set the server already has; UI shows "Running…" state. |
| Cmd+K hijacks browser find / system shortcuts on some OSes | Annoying | Use `event.preventDefault()` and only fire when `e.metaKey || e.ctrlKey` is held. Some browsers reserve Cmd+K (e.g. Firefox search bar) — document the override. |

---

## 9. Success metrics

- Coverage matrix from §4 ends at **40 ✅** (including the layout
  baseline: no sidebar, full-width table, header-driven nav).
- All five milestones shippable in 5 PRs without breaking `pnpm test`
  or `pnpm start`.
- README "Web Dashboard" section grows from 6 lines to a full feature list.
- Web users can complete the same flows the TUI can, with the same
  outcomes, in 100% of the documented use cases — via the header menu,
  modals, buttons, and the `⌘K` palette.
- 1:1 with TUI command palette (snapshot test) — no drift.
- Per-feature accessibility: every new control has a label, focus ring, and
  keyboard alternative (even though the only global keyboard shortcut is
  the palette).
- Resize the browser to any width: the model table always uses 100% of
  the available width. No left rail, no right rail, ever.

---

## 10. Out of scope (intentionally)

- Public website work (see `ideas/public-website.md`).
- Architecture refactor of `src/tui/overlays.js` / `key-handler.js` (see
  `ideas/architecture-and-maintenance.md`) — orthogonal and tracked
  separately.
- **`MapView` and the entire `web/src/components/map/` folder** —
  removed; the map is not part of parity.
- Doctor / guided setup (see `ideas/cli-doctor-and-setup.md`).
- Telemetry mirror beyond minimal parity (no new event types).
- **Re-introducing a left sidebar in any form** — this is a hard
  layout decision. Header only.

---

### Post-M2 (CI/CD fix, date: 2026-06-01)

- 🐛 **Issue #95 — Docker image was behind the npm package.** The `push: tags: v*.*.*` trigger in `.github/workflows/docker.yml` had stopped firing after v0.3.72, leaving the ghcr.io image on 0.3.72 while the npm package was on 0.5.6.
  - Replaced the broken trigger with `on.workflow_run: workflows: ["Release"], types: [completed]`. Every successful `npm publish` now auto-builds the Docker image.
  - Added a conditional `if:` gate so the build only runs when the upstream `Release` succeeded (or for manual `workflow_dispatch`).
  - Pinned the checkout to `workflow_run.headsha` so the build is deterministic.
  - Updated the metadata step to read the version from `package.json` and emit it as a `type=raw` tag, plus `type=raw,value=latest,enable={{is_default_branch}}` so the `latest` tag always tracks the most recent release.
  - Result: `docker pull ghcr.io/vava-nessa/free-coding-models:0.5.6` now resolves, `latest` is in sync, and every future release will rebuild Docker automatically.
  - Detailed status comment posted on issue #95.

## 11. References

- TUI source of truth: `src/tui/key-handler.js`, `src/tui/overlays.js`,
  `src/tui/command-palette.js`, `src/tui/render-table.js`,
  `src/tui/tui-state.js`, `src/tui/tui-filters.js`, `src/tui/cli-help.js`.
- Shared engine: `src/core/utils.js`, `src/core/favorites.js`,
  `src/core/tool-metadata.js`, `src/core/tool-launchers.js`,
  `src/core/endpoint-installer.js`,
  `src/core/installed-models-manager.js`, `src/core/changelog-loader.js`,
  `src/core/benchmark.js`, `src/core/updater.js`,
  `src/core/router-dashboard.js`, `src/core/router-daemon.js`.
- Web today: `web/src/App.jsx`, `web/server.js`,
  `web/src/components/{layout,dashboard,settings,analytics,atoms,palette}/**`,
  `web/src/hooks/**`. To delete as part of M1:
  `web/src/components/layout/Sidebar.jsx`,
  `web/src/components/layout/Sidebar.module.css`,
  `web/src/components/map/MapView.jsx`,
  `web/src/components/map/MapView.module.css`,
  and the `web/src/components/map/` folder.
- Existing related idea: `ideas/local-web-ui.md` (Router Control Center
  framing — this plan supersedes the "M2–M4" phase in that file).
- Cross-surface mandate: `AGENTS.md` (top of file).
- Testing: `pnpm test` runs `node --test test/test.js` — 62 tests across
  11 suites; parity work must keep this green.

- TUI source of truth: `src/tui/key-handler.js`, `src/tui/overlays.js`,
  `src/tui/command-palette.js`, `src/tui/render-table.js`,
  `src/tui/tui-state.js`, `src/tui/tui-filters.js`, `src/tui/cli-help.js`.
- Shared engine: `src/core/utils.js`, `src/core/favorites.js`,
  `src/core/tool-metadata.js`, `src/core/tool-launchers.js`,
  `src/core/endpoint-installer.js`,
  `src/core/installed-models-manager.js`, `src/core/changelog-loader.js`,
  `src/core/benchmark.js`, `src/core/updater.js`,
  `src/core/router-dashboard.js`, `src/core/router-daemon.js`.
- Web today: `web/src/App.jsx`, `web/server.js`,
  `web/src/components/{layout,dashboard,settings,analytics,atoms,palette}/**`,
  `web/src/hooks/**`. To delete as part of M1:
  `web/src/components/layout/Sidebar.jsx`,
  `web/src/components/layout/Sidebar.module.css`,
  `web/src/components/map/MapView.jsx`,
  `web/src/components/map/MapView.module.css`,
  and the `web/src/components/map/` folder.
- Existing related idea: `ideas/local-web-ui.md` (Router Control Center
  framing — this plan supersedes the "M2–M4" phase in that file).
- Cross-surface mandate: `AGENTS.md` (top of file).
- Testing: `pnpm test` runs `node --test test/test.js` — 62 tests across
  11 suites; parity work must keep this green.
