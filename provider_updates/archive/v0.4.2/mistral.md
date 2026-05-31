# Mistral LP — Model Validity Audit

**Verification date:** 2026-05-31
**Source:** https://docs.mistral.ai/models/overview

---

## Summary
| Stat | Count | Details |
|------|-------|---------|
| ✅ Confirmed existing | 5 | All 5 models still in Mistral LP catalog |
| 🗑️ Deprecated — to remove | 0 | None yet (retirements in July/August 2026) |
| ❌ Removed — to remove | 0 | None |
| ➕ New — to add | 0 | No new free models |
| ⚠️ Config to fix | 0 | Model IDs and context windows match |

---

## ✅ CONFIRMED Operational Models

| Model ID | Display Name | Tier | SWE | Ctx | Notes |
|----------|-------------|------|-----|-----|-------|
| mistral-large-2512 | Mistral Large 3 | S+ | 70.0% | 256k | v25.12, OPEN |
| mistral-medium-3-5 | Mistral Medium 3.5 | S+ | 77.6% | 256k | v26.04, OPEN |
| devstral-2512 | Devstral 2 | S+ | 72.2% | 256k | v25.12, OPEN |
| magistral-medium-2509 | Magistral Medium 1.2 | A+ | 52.0% | 128k | v25.09, OPEN |
| mistral-small-2603 | Mistral Small 4 | A | 48.0% | 256k | v26.03, OPEN |

## ⚠️ Upcoming Deprecations (after July 31, 2026)
These models are still active but will be retired:
- `devstral-2512` → retirement7/31/2026, replacement: Mistral Medium 3.5
- `magistral-medium-2509` → retirement 7/31/2026, replacement: Mistral Medium 3.5
- `mistral-small-2603` → NOT deprecated (this is Mistral Small 4, new)

**Action:** Do NOT remove yet. These models are still active until July31, 2026. Schedule removal for next audit cycle.

## Changes to apply in sources.js
No changes needed for this audit cycle.
