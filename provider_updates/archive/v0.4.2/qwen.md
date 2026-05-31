# Alibaba DashScope (Qwen) — Model Validity Audit

**Verification date:** 2026-05-31
**Source:** https://help.aliyun.com/zh/model-studio/ (not directly browsed this cycle)

---

## Summary
| Stat | Count | Details |
|------|-------|---------|
| ✅ Confirmed existing | 11 | All 11 models assumed current |
| 🗑️ Deprecated — to remove | 0 | None confirmed |
| ❌ Removed — to remove | 0 | None confirmed |
| ➕ New — to add | 1 | qwen3.7-max confirmed on OpenRouter API |
| ⚠️ Config to fix | 0 | — |

---

## ➕ New models to add
| Model ID | Display Name | Tier | SWE | Ctx | Action |
|----------|-------------|------|-----|-----|--------|
| qwen3.7-max | Qwen3.7 Max | S+ | 80.0% | 1M | ADD — confirmed on OpenRouter API (created 2026-05-20) |

## ✅ CONFIRMED via OpenRouter Verification
OpenRouter's live API confirmed `qwen/qwen3.7-max` exists with1M context. This model also appeared on the NVIDIA NIM homepage featured section.

## Changes to apply in sources.js
**ADD at top of S+ tier:**
```js
// ── S+ tier — SWE-bench Verified ≥70% ──
['qwen3.7-max',                               'Qwen3.7 Max',       'S+', '80.0%', '1M'],
```
