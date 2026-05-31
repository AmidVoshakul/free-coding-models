# Groq — Model Validity Audit

**Verification date:** 2026-05-31
**Source:** https://console.groq.com/docs/models + https://console.groq.com/docs/deprecations

---

## Summary
| Stat | Count | Details |
|------|-------|---------|
| ✅ Confirmed existing | 8 | All 8 models still in Groq catalog |
| 🗑️ Deprecated — to remove | 0 | None currently deprecated |
| ❌ Removed — to remove | 0 | None found |
| ➕ New — to add | 0 | No new free/coding models |
| ⚠️ Config to fix | 0 | Context windows and model IDs verified |

---

## ✅ CONFIRMED Operational Models
All verified on Groq docs (Production + Preview sections):

| Model ID | Display Name | Tier | SWE | Ctx | Notes |
|----------|-------------|------|-----|-----|-------|
| llama-3.3-70b-versatile | Llama 3.3 70B | A- | 39.5% | 131k | Production |
| meta-llama/llama-4-scout-17b-16e-instruct | Llama 4 Scout | A | 44.0% | 131k | Preview — may be discontinued |
| llama-3.1-8b-instant | Llama 3.1 8B | B | 28.8% | 131k | Production |
| openai/gpt-oss-120b | GPT OSS 120B | S | 60.0% | 131k | Production |
| openai/gpt-oss-20b | GPT OSS 20B | A | 42.0% | 131k | Production |
| qwen/qwen3-32b | Qwen3 32B | A+ | 50.0% | 131k | Production |
| groq/compound | Groq Compound | A | 45.0% | 131k | Production System |
| groq/compound-mini | Groq Compound Mini | B+ | 32.0% | 131k | Production System |

## ⚠️ Config Changes
None required — all model IDs, context windows, and tiers match Groq's current catalog.

## Deprecations History (already resolved)
- `moonshotai/kimi-k2-instruct-0905` deprecated April 15, 2026 → replaced by `openai/gpt-oss-120b`
- `meta-llama/llama-4-maverick-17b-128e-instruct` deprecated March 9, 2026 → replaced by `openai/gpt-oss-120b`
- Both already removed from sources.js in previous audit.

## Changes to apply in sources.js
No changes needed — all 8 models are current and accurate.
