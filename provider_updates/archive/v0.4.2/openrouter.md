# OpenRouter — Model Validity Audit

**Verification date:** 2026-05-31
**Source:** https://openrouter.ai/api/v1/models (live JSON API)

---

## Summary
| Stat | Count | Details |
|------|-------|---------|
| ✅ Confirmed existing | 19 | 19 of26 models still have :free tier |
| 🗑️ Deprecated — to remove | 0 | None confirmed |
| ❌ Removed — to remove | 3 |3 models lost :free tier since May 26 |
| ➕ New — to add | 2 | 2 new :free models appeared |
| ⚠️ Config to fix | 2 | Context window corrections |

---

## 🗑️ REMOVED from Free Tier (lost :free suffix)
| Model ID | Display Name | Reason | Action |
|----------|-------------|--------|--------|
| minimax/minimax-m2.5:free | MiniMax M2.5 | No longer in OpenRouter free tier | REMOVE |
| deepseek/deepseek-v4-flash:free | DeepSeek V4 Flash | No longer in OpenRouter free tier | REMOVE |
| baidu/cobuddy:free | Baidu CoBuddy | No longer in OpenRouter free tier | REMOVE |

## ➕ New Free Models to Add
| Model ID | Display Name | Tier | SWE | Ctx | Action |
|----------|-------------|------|-----|-----|--------|
| moonshotai/kimi-k2.6:free | Kimi K2.6 | S+ | 76.8% | 262k | ADD — new on OpenRouter free tier |
| arcee-ai/trinity-large-thinking:free | Arcee Trinity Large | A | - | 262k | ADD — already in sources.js (keep it) |

Note: `arcee-ai/trinity-large-thinking:free` was already in sources.js. Verified it still has :free tier.

## ⚠️ Config Changes
| Model ID | Current Ctx | Correct Ctx | Reason |
|----------|------------|------------|--------|
| qwen/qwen3-coder:free | 262k | 262k | Already correct |
| nvidia/nemotron-3-super-120b-a12b:free | 262k | 262k | Already correct |

All other models' context windows match OpenRouter's `top_provider.context_length`.

## ✅ CONFIRMED Operational Free Models (19 models)
| Model ID | Display Name | Tier | Ctx |
|----------|-------------|------|-----|
| qwen/qwen3-coder:free | Qwen3 Coder 480B | S+ | 262k |
| z-ai/glm-4.5-air:free | GLM 4.5 Air | S+ | 131k |
| poolside/laguna-m.1:free | Poolside Laguna M.1 | S+ | 131k |
| poolside/laguna-xs.2:free | Poolside Laguna XS.2 | S+ | 131k |
| moonshotai/kimi-k2.6:free | Kimi K2.6 | S+ | 262k |
| qwen/qwen3-next-80b-a3b-instruct:free | Qwen3 80B Instruct | S | 262k |
| openai/gpt-oss-120b:free | GPT OSS 120B | S | 131k |
| nvidia/nemotron-3-super-120b-a12b:free | Nemotron 3 Super | A+ | 262k |
| nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free | Nemotron 3 Omni | A+ | 256k |
| nvidia/nemotron-nano-12b-v2-vl:free | Nemotron Nano 12B VL | A | 128k |
| openrouter/owl-alpha | Owl Alpha | A+ | 1M |
| nousresearch/hermes-3-llama-3.1-405b:free | Hermes 3 405B | A | 131k |
| openai/gpt-oss-20b:free | GPT OSS 20B | A | 131k |
| nvidia/nemotron-nano-30b-a3b:free | Nemotron Nano 30B | A | 256k |
| cognitivecomputations/dolphin-mistral-24b-venice-edition:free | Dolphin Mistral 24B | B+ | 33k |
| google/gemma-4-31b-it:free | Gemma 4 31B | A | 256k |
| google/gemma-4-26b-a4b-it:free | Gemma4 26B MoE | A- | 256k |
| meta-llama/llama-3.3-70b-instruct:free | Llama 3.3 70B | A- | 131k |
| meta-llama/llama-3.2-3b-instruct:free | Llama 3.2 3B | B | 128k |
| nvidia/nemotron-nano-9b-v2:free | Nemotron Nano 9B | B+ | 128k |
| openrouter/free | OpenRouter Free | B | 200k |
| liquid/lfm-2.5-1.2b-instruct:free | LFM 2.5 1.2B | C | 32k |
| liquid/lfm-2.5-1.2b-thinking:free | LFM 2.5 Thinking | C | 32k |
| arcee-ai/trinity-large-thinking:free | Arcee Trinity Large | A | 262k |

## Changes to apply in sources.js
**REMOVE (3 models lost :free tier):**
```js
// Removed (2026-05-31): minimax/minimax-m2.5:free (no longer on OpenRouter free tier)
['minimax/minimax-m2.5:free', 'MiniMax M2.5', 'S+', '80.2%', '197k'],
// Removed (2026-05-31): deepseek/deepseek-v4-flash:free (no longer on OpenRouter free tier)
['deepseek/deepseek-v4-flash:free', 'DeepSeek V4 Flash', 'S', '-', '1M'],
// Removed (2026-05-31): baidu/cobuddy:free (no longer on OpenRouter free tier)
['baidu/cobuddy:free', 'Baidu CoBuddy', 'B+', '-', '131k'],
```

**ADD (1 new free model):**
```js
// ── S+ tier — live :free chat/coding models ──
['moonshotai/kimi-k2.6:free', 'Kimi K2.6', 'S+', '76.8%', '262k'],
```
