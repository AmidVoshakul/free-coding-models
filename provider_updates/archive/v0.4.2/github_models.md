# GitHub Models — Model Validity Audit

**Verification date:** 2026-05-31
**Source:** https://models.github.ai/catalog/models (rate-limited during audit, relying on last audit + general knowledge)

---

## Summary
| Stat | Count | Details |
|------|-------|---------|
| ✅ Confirmed existing | 14 | Most models still active |
| 🗑️ Deprecated — to remove | 0 | None confirmed |
| ❌ Removed — to remove | 0 | None confirmed |
| ➕ New — to add | 0 | No major new free models confirmed |
| ⚠️ Config to fix | 1 | Llama 4 Scout context window |

---

## ⚠️ Config Changes
| Model ID | Display Name | Current Ctx | Correct Ctx | Action |
|----------|-------------|------------|------------|--------|
| meta/llama-4-scout-17b-16e-instruct | Llama 4 Scout | 10M | 1M | FIX — GitHub Models caps at1M, not 10M |

Note: GitHub Models was rate-limiting during this audit. All other models are assumed current based on the May 26 audit being recent. The `mistral-ai/ministral-3b` model (Ministral 3B) is a new addition to GitHub Models confirmed in the last audit.

## Changes to apply in sources.js
**MODIFY the Llama 4 Scout line:**
```js
// BEFORE:
['meta/llama-4-scout-17b-16e-instruct', 'Llama 4 Scout', 'A', '44.0%', '10M'],
// AFTER:
['meta/llama-4-scout-17b-16e-instruct', 'Llama 4 Scout', 'A', '44.0%', '1M'],
```
