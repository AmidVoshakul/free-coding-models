# Google AI Studio / Gemini CLI — Model Validity Audit

**Verification date:** 2026-05-31
**Source:** https://ai.google.dev/gemini-api/docs/models + https://ai.google.dev/gemini-api/docs/deprecations

---

## Summary
| Stat | Count | Details |
|------|-------|---------|
| ✅ Confirmed existing | 7 | All 7 models still in Gemini API catalog |
| 🗑️ Deprecated — to remove | 0 | gemini-2.5-pro/flash still have shutdown Oct 16, 2026 (not yet) |
| ❌ Removed — to remove | 0 | None |
| ➕ New — to add | 0 | No new free models |
| ⚠️ Config to fix | 0 | Context windows match |

---

## ✅ CONFIRMED Operational Models

| Model ID | Display Name | Tier | SWE | Ctx | Notes |
|----------|-------------|------|-----|-----|-------|
| gemini-3.5-flash | Gemini 3.5 Flash | S+ | - | 1M | Stable, no shutdown date |
| gemini-3.1-pro-preview | Gemini 3.1 Pro Preview | S+ | 78.0% | 1M | Stable, no shutdown date |
| gemini-3-flash-preview | Gemini 3 Flash Preview | S | 65.0% | 1M | Stable, no shutdown date |
| gemini-3.1-flash-lite | Gemini 3.1 Flash Lite | A+ | 55.0% | 1M | Stable, no shutdown date |
| gemini-2.5-pro | Gemini 2.5 Pro | S+ | 63.2% | 1M | ⚠️ Shutdown Oct 16, 2026 |
| gemini-2.5-flash | Gemini 2.5 Flash | A+ | 50.0% | 1M | ⚠️ Shutdown Oct 16, 2026 |
| gemini-2.5-flash-lite | Gemini 2.5 Flash Lite | A | 42.0% | 1M | ⚠️ Shutdown Oct 16, 2026 |

## ⚠️ Deprecation Notes
- `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.5-flash-lite` all have shutdown date **October 16, 2026** per official deprecations page.
- **Do NOT remove yet** — they still work until Oct 16, 2026. We should remove them in the next audit after that date.
- No new free models added to the catalog.

## Changes to apply in sources.js
No changes needed for this audit cycle. Mark Oct 16, 2026 in your calendar to remove the 2.5 models in the next audit.
