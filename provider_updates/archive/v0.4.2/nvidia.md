# NVIDIA NIM — Model Validity Audit

**Verification date:** 2026-05-31
**Source:** https://build.nvidia.com/models

---

## Summary
| Stat | Count | Details |
|------|-------|---------|
| ✅ Confirmed existing | 24 | All24 models still listed on build.nvidia.com |
| 🗑️ Deprecated — to remove | 0 | None found |
| ❌ Removed — to remove | 0 | None found |
| ➕ New — to add | 1 | step-3.7-flash (S+, new on NIM free tier) |
| ⚠️ Config to fix | 0 | All context windows verified against NIM catalog |

---

## ➕ New models to add
| Model ID | Display Name | Tier | SWE | Ctx | Action |
|----------|-------------|------|-----|-----|--------|
| stepfun-ai/step-3.7-flash | Step 3.7 Flash | S+ | 74.4% | 256k | ADD — appeared 2 days ago (2026-05-29), free endpoint confirmed,199K downloads |

## ✅ CONFIRMED Operational Models
All 24 models verified on build.nvidia.com with Free Endpoint or Downloadable badge:

| Model ID | Display Name | Tier | SWE | Ctx |
|----------|-------------|------|-----|-----|
| minimaxai/minimax-m2.7 | MiniMax M2.7 | S+ | 80.2% | 200k |
| z-ai/glm-5.1 | GLM5.1 | S+ | 77.8% | 128k |
| moonshotai/kimi-k2.6 | Kimi K2.6 | S+ | 76.8% | 256k |
| deepseek-ai/deepseek-v4-pro | DeepSeek V4 Pro | S+ | 73.1% | 128k |
| deepseek-ai/deepseek-v4-flash | DeepSeek V4 Flash | S+ | 72.0% | 128k |
| z-ai/glm5 | GLM 5 | S+ | 73.8% | 200k |
| stepfun-ai/step-3.5-flash | Step 3.5 Flash | S+ | 74.4% | 256k |
| qwen/qwen3-coder-480b-a35b-instruct | Qwen3 Coder 480B | S+ | 70.6% | 256k |
| qwen/qwen3-next-80b-a3b-instruct | Qwen3 80B Instruct | S | 65.0% | 128k |
| qwen/qwen3.5-397b-a17b | Qwen3.5 400B VLM | S | 68.0% | 128k |
| openai/gpt-oss-120b | GPT OSS 120B | S | 60.0% | 128k |
| meta/llama-4-maverick-17b-128e-instruct | Llama 4 Maverick | S | 62.0% | 1M |
| mistralai/mistral-medium-3.5-128b | Mistral Medium 3.5 | S | 66.0% | 128k |
| mistralai/mistral-small-4-119b-2603 | Mistral Small 4 | S | 60.0% | 128k |
| qwen/qwen3.5-122b-a10b | Qwen3.5 122B | S | 64.0% | 128k |
| mistralai/mistral-large-3-675b-instruct-2512 | Mistral Large 675B | A+ | 58.0% | 256k |
| nvidia/nemotron-3-super-120b-a12b | Nemotron 3 Super | A+ | 56.0% | 128k |
| nvidia/nemotron-3-nano-omni-30b-a3b-reasoning | Nemotron 3 Omni | A+ | 52.0% | 128k |
| nvidia/nemotron-3-nano-30b-a3b | Nemotron Nano 30B | A | 43.0% | 128k |
| openai/gpt-oss-20b | GPT OSS 20B | A | 42.0% | 128k |
| google/gemma-4-31b-it | Gemma 4 31B | A | 45.0% | 256k |
| bytedance/seed-oss-36b-instruct | Seed OSS 36B | A- | 38.0% | 32k |
| stockmark/stockmark-2-100b-instruct | Stockmark 100B | A- | 36.0% | 32k |
| mistralai/ministral-14b-instruct-2512 | Ministral 14B | B+ | 34.0% | 32k |
| meta/llama-3.2-11b-vision-instruct | Llama 3.2 11B Vision | B | 28.0% | 128k |
| microsoft/phi-4-mini-instruct | Phi4 Mini | C | 14.0% | 128k |

## Changes to apply in sources.js
**ADD after step-3.5-flash (insert in S+ tier):**
```js
  ['stepfun-ai/step-3.7-flash',                    'Step 3.7 Flash',     'S+', '74.4%', '256k'],
```
