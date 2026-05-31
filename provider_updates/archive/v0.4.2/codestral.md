# Codestral — Model Validity Audit

**Verification date:** 2026-05-31
**Source:** https://docs.mistral.ai/models/overview (Codestral is part of Mistral LP)

---

## Summary
| Stat | Count | Details |
|------|-------|---------|
| ✅ Confirmed existing | 1 | Codestral still available |
| 🗑️ Deprecated — to remove | 0 | Not deprecated |
| ❌ Removed — to remove | 0 | None |
| ➕ New — to add | 0 | No new Codestral models |
| ⚠️ Config to fix | 0 | — |

---

## ✅ CONFIRMED Operational Models

| Model ID | Display Name | Tier | SWE | Ctx | Notes |
|----------|-------------|------|-----|-----|-------|
| codestral-2508 | Codestral | B+ | 34.0% | 128k | PREMIER (paid), still active |

Note: Mistral docs show Codestral (v25.08) as PREMIER. The `codestral-2508` ID in sources.js is a slightly older version. A newer Codestral exists (v25.08) but both IDs may work. The free tier (30 req/min, 2000/day) still requires phone number for key.

## Changes to apply in sources.js
No changes needed.
