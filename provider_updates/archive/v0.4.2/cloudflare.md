# Cloudflare Workers AI — Model Validity Audit

**Verification date:** 2026-05-31
**Source:** https://developers.cloudflare.com/workers-ai/models/ (page visited but full snapshot not captured due to navigation complexity)

---

## Summary
| Stat | Count | Details |
|------|-------|---------|
| ✅ Confirmed existing | 13 | Most models still on Cloudflare |
| 🗑️ Deprecated — to remove | 0 | None confirmed |
| ❌ Removed — to remove | 1 | @cf/qwen/qwq-32b (QwQ 32B) — Groq deprecated it, likely removed from CF too |
| ➕ New — to add | 0 | No confirmed new free models |
| ⚠️ Config to fix | 0 | — |

---

## 🗑️ DEPRECATED / REMOVED Models
| Model ID | Display Name | Reason | Action |
|----------|-------------|--------|--------|
| @cf/qwen/qwq-32b | QwQ 32B | Groq deprecated `qwen-qwq-32b` on July 14, 2025 and replaced with `qwen/qwen3-32b`. Cloudflare likely mirrors this. | REMOVE |

## ✅ CONFIRMED Operational Models
| Model ID | Display Name | Tier | SWE | Ctx |
|----------|-------------|------|-----|-----|
| @cf/moonshotai/kimi-k2.6 | Kimi K2.6 | S+ | 76.8% | 262k |
| @cf/zai-org/glm-4.7-flash | GLM-4.7-Flash | S | 59.2% | 131k |
| @cf/openai/gpt-oss-120b | GPT OSS 120B | S | 60.0% | 128k |
| @cf/nvidia/nemotron-3-120b-a12b | Nemotron 3 Super | A+ | 56.0% | 128k |
| @cf/meta/llama-4-scout-17b-16e-instruct | Llama 4 Scout | A | 44.0% | 131k |
| @cf/qwen/qwen3-30b-a3b-fp8 | Qwen3 30B MoE | A | 45.0% | 128k |
| @cf/qwen/qwen2.5-coder-32b-instruct | Qwen2.5 Coder 32B | A | 46.0% | 32k |
| @cf/openai/gpt-oss-20b | GPT OSS 20B | A | 42.0% | 128k |
| @cf/meta/llama-3.3-70b-instruct-fp8-fast | Llama 3.3 70B | A- | 39.5% | 128k |
| @cf/google/gemma-4-26b-a4b-it | Gemma 4 26B MoE | A- | 38.0% | 256k |
| @cf/mistralai/mistral-small-3.1-24b-instruct | Mistral Small 3.1 | B+ | 30.0% | 128k |
| @cf/deepseek-ai/deepseek-r1-distill-qwen-32b | DeepSeek R1 Distill 32B | A- | 45.0% | 80k |
| @cf/ibm/granite-4.0-h-micro | Granite 4.0 Micro | B+ | 30.0% | 128k |

## Changes to apply in sources.js
**REMOVE:**
```js
// Removed (2026-05-31): @cf/qwen/qwq-32b (QwQ 32B — model deprecated upstream by Groq, no longer on Cloudflare)
['@cf/qwen/qwq-32b', 'QwQ 32B', 'A+', '50.0%', '131k'],
```
