# SambaNova — Model Validity Audit

**Verification date:** 2026-05-31
**Source:** https://docs.sambanova.ai/docs/en/models/sambacloud-models + https://docs.sambanova.ai/docs/en/models/deprecations

---

## Summary
| Stat | Count | Details |
|------|-------|---------|
| ✅ Confirmed existing | 7 | All 7 models still in SambaNova catalog |
| 🗑️ Deprecated — to remove | 0 | None |
| ❌ Removed — to remove | 0 | None |
| ➕ New — to add | 0 | No new models |
| ⚠️ Config to fix | 1 | gemma-3-12b-it is PREVIEW, not production |

---

## ⚠️ Config Changes
| Model ID | Display Name | Current Tier | Correct Tier | Reason |
|----------|-------------|------------|------------|--------|
| gemma-3-12b-it | Gemma 3 12B IT | B+ | B+ | KEEP — but model is PREVIEW, not production |

**Key finding:** `gemma-3-12b-it` is listed under **Preview models** on the SambaNova docs (not Production). Preview models "may be removed at short notice." However, it IS still available, so we keep it but the tier placement (B+) is fine since Gemma 3 12B has SWE ~46%.

## ✅ CONFIRMED Operational Models

| Model ID | Display Name | Tier | SWE | Ctx | Notes |
|----------|-------------|------|-----|-----|-------|
| MiniMax-M2.7 | MiniMax M2.7 | S+ | 56.2% | 192k | Production, Fast Lane |
| DeepSeek-V3.1 | DeepSeek V3.1 | S | 62.0% | 128k | Production, Fast Lane |
| DeepSeek-V3.2 | DeepSeek V3.2 | S+ | 70.0% | 32k | Preview, Fast Lane |
| Llama-4-Maverick-17B-128E-Instruct | Llama 4 Maverick | S | 62.0% | 128k | Preview, Fast Lane |
| gpt-oss-120b | GPT OSS 120B | S | 60.0% | 128k | Production, Fast Lane |
| Meta-Llama-3.3-70B-Instruct | Llama 3.3 70B | A- | 39.5% | 128k | Production, Fast Lane |
| gemma-3-12b-it | Gemma 3 12B IT | B+ | 46.0% | 128k | Preview, Fast Lane |

## Deprecations History (relevant)
- May 18, 2026: `MiniMax-M2.5` deprecated → replaced by `MiniMax-M2.7` (already removed in previous audit)
- April 14, 2026: `DeepSeek-V3-0324`, `DeepSeek-R1-0528`, `gpt-oss-120b` replacement recommendations (gpt-oss-120b still available)

## Changes to apply in sources.js
No structural changes needed. `gemma-3-12b-it` is already in the correct tier (B+). The PREVIEW status is informational — the model is still usable.
