# NVIDIA NIM — Audit de validité des modèles

**Date de vérification :** 2026-05-26
**Source :** build.nvidia.com (scrapé en direct)
**Fichier concerné :** `sources.js` — array `nvidiaNim`

---

## Résumé

| Stat | Nombre | Modèles |
|------|--------|---------|
| ✅ Confirvés existants | 22 | Tous opérationnels sur NIM |
| 🗑️ Dépréciés — à retirer | 4 | `minimax-m2`, `qwen3-next-80b-a3b-thinking`, `granite-34b-code-instruct`, `llama-4-scout-17b-16e-instruct` |
| ❌ 404 / Supprimés — à retirer | 5 | `llama-3.1-nemotron-ultra-253b-v1`, `llama-3.3-nemotron-super-49b-v1.5`, `llama-3.3-70b-instruct`, `mixtral-8x22b-instruct-v0.1`, `llama-3.1-8b-instruct` |
| ➕ Nouveaux — à ajouter | 1 | `llama-3.2-11b-vision-instruct` (B tier, nouveau sur NIM) |
| ℹ️ Note | — | `llama-4-scout-17b-16e-instruct` est **déprécié** sur NIM, mais n'était **PAS** dans `nvidiaNim` — il est dans Groq/GitHub/Cloudflare (à vérifier séparément) |
| ℹ️ Indisponible temporairement | 0 | `llama-4-maverick` est **LIVE** (message "high interest", pas 404) |

**Total à modifier dans sources.js :** retire 8 modèles (llama-4-scout n'est pas dans nvidiaNim — il est dans Groq/GitHub/Cloudflare), ajouter 1 → -7 modèles NVIDIA NIM

---

## 🗑️ Modèles DÉPRÉCIÉS (page affiche "This NIM Endpoint has been deprecated")

### 1. `minimaxai/minimax-m2` — MiniMax M2
- **Tier actuel :** S (69.4%)
- **Statut :** ❌ DEPRECATED sur NIM
- **Remplacement recommandé :** `minimaxai/minimax-m2.7` (déjà listé en S+)
- **Action :** RETIRER de `nvidiaNim`
- **URL :** https://build.nvidia.com/minimaxai/minimax-m2

### 2. `qwen/qwen3-next-80b-a3b-thinking` — Qwen3 80B Thinking
- **Tier actuel :** S (68.0%)
- **Statut :** ❌ DEPRECATED sur NIM
- **Remplacement recommandé :** `qwen/qwen3-next-80b-a3b-instruct` (déjà listé, toujours LIVE)
- **Action :** RETIRER de `nvidiaNim`
- **URL :** https://build.nvidia.com/qwen/qwen3-next-80b-a3b-thinking

### 3. `ibm/granite-34b-code-instruct` — Granite 34B Code
- **Tier actuel :** B+ (30.0%)
- **Statut :** ❌ DEPRECATED sur NIM
- **Remplacement recommandé :** Aucun équivalent direct sur NIM
- **Action :** RETIRER de `nvidiaNim`
- **URL :** https://build.nvidia.com/ibm/granite-34b-code-instruct

### 4. `meta/llama-4-scout-17b-16e-instruct` — Llama 4 Scout
- **Tier actuel :** A (44.0%)
- **Statut :** ❌ DEPRECATED sur NIM
- **Remplacement recommandé :** Aucun (remplacé par Llama 4 Maverick qui est dans sources.js)
- **Action :** RETIRER de `nvidiaNim`
- **URL :** https://build.nvidia.com/meta/llama-4-scout-17b-16e-instruct

---

## ❌ Modèles 404 (page introuvable sur NIM)

### 5. `nvidia/llama-3.1-nemotron-ultra-253b-v1` — Nemotron Ultra 253B
- **Tier actuel :** A+ (56.0%)
- **Statut :** ❌ 404 — Modèle supprimé de NIM
- **Remplacement recommandé :** `nvidia/nemotron-3-super-120b-a12b` (déjà listé, toujours LIVE)
- **Action :** RETIRER de `nvidiaNim`

### 6. `nvidia/llama-3.3-nemotron-super-49b-v1.5` — Nemotron Super 49B
- **Tier actuel :** A (49.0%)
- **Statut :** ❌ 404 — Modèle supprimé de NIM
- **Remplacement recommandé :** `nvidia/nemotron-3-nano-30b-a3b` (déjà listé, toujours LIVE)
- **Action :** RETIRER de `nvidiaNim`

### 7. `meta/llama-3.3-70b-instruct` — Llama 3.3 70B
- **Tier actuel :** A- (39.5%)
- **Statut :** ❌ 404 — Modèle supprimé de NIM
- **Remplacement recommandé :** Aucun équivalent exact sur NIM (Llama 4 est disponible mais c'est un modèle différent)
- **Action :** RETIRER de `nvidiaNim`

### 8. `mistralai/mixtral-8x22b-instruct-v0.1` — Mixtral 8x22B
- **Tier actuel :** B+ (32.0%)
- **Statut :** ❌ 404 — Modèle supprimé de NIM (remplacé par `ministral-14b-instruct-2512` déjà listé)
- **Action :** RETIRER de `nvidiaNim`

### 9. `meta/llama-3.1-8b-instruct` — Llama 3.1 8B
- **Tier actuel :** B (28.8%)
- **Statut :** ❌ 404 — Modèle supprimé de NIM (remplacé par `llama-3.2-11b-vision-instruct`)
- **Action :** RETIRER de `nvidiaNim`

---

## ➕ Nouveaux modèles à ajouter

### 10. `meta/llama-3.2-11b-vision-instruct` — Llama 3.2 11B Vision
- **Statut :** ✅ LIVE sur NIM
- **Description :** "Cutting-edge vision-language model excelling in high-quality reasoning from images."
- **Licence :** Llama 3.2 Community License Agreement
- **Tier suggéré :** B (équivalent du Llama 3.1 8B retiré, modèle vision)
- **Ctx suggéré :** 128k
- **SWEBench :** - (nouveau, à évaluer)
- **URL :** https://build.nvidia.com/meta/llama-3.2-11b-vision-instruct
- **Action :** AJOUTER dans la section B tier

---

## ✅ Modèles CONFIRMÉS opérationnels sur NIM

Ces modèles existent bien et sont **actuellement disponibles** (page accessible avec description) :

### S+ tier (8 modèles)
| Model ID | Display Name | Status |
|----------|-------------|--------|
| `minimaxai/minimax-m2.7` | MiniMax M2.7 | ✅ |
| `z-ai/glm-5.1` | GLM 5.1 | ✅ |
| `moonshotai/kimi-k2.6` | Kimi K2.6 | ✅ |
| `deepseek-ai/deepseek-v4-pro` | DeepSeek V4 Pro | ✅ |
| `deepseek-ai/deepseek-v4-flash` | DeepSeek V4 Flash | ✅ |
| `z-ai/glm5` | GLM 5 | ✅ (redirect vers glm-5.1) |
| `stepfun-ai/step-3.5-flash` | Step 3.5 Flash | ✅ |
| `qwen/qwen3-coder-480b-a35b-instruct` | Qwen3 Coder 480B | ✅ |

### S tier (6 modèles — après suppression)
| Model ID | Display Name | Status |
|----------|-------------|--------|
| `qwen/qwen3-next-80b-a3b-instruct` | Qwen3 80B Instruct | ✅ |
| `qwen/qwen3.5-397b-a17b` | Qwen3.5 400B VLM | ✅ |
| `openai/gpt-oss-120b` | GPT OSS 120B | ✅ |
| `meta/llama-4-maverick-17b-128e-instruct` | Llama 4 Maverick | ✅ |
| `mistralai/mistral-medium-3.5-128b` | Mistral Medium 3.5 | ✅ |
| `mistralai/mistral-small-4-119b-2603` | Mistral Small 4 | ✅ |

### A+ tier (3 modèles — après suppression)
| Model ID | Display Name | Status |
|----------|-------------|--------|
| `nvidia/nemotron-3-super-120b-a12b` | Nemotron 3 Super | ✅ |
| `mistralai/mistral-large-3-675b-instruct-2512` | Mistral Large 675B | ✅ |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` | Nemotron 3 Omni | ✅ |

### A tier (3 modèles — après suppression)
| Model ID | Display Name | Status |
|----------|-------------|--------|
| `openai/gpt-oss-20b` | GPT OSS 20B | ✅ |
| `google/gemma-4-31b-it` | Gemma 4 31B | ✅ |
| `nvidia/nemotron-3-nano-30b-a3b` | Nemotron Nano 30B | ✅ |

### A- tier (2 modèles — après suppression)
| Model ID | Display Name | Status |
|----------|-------------|--------|
| `bytedance/seed-oss-36b-instruct` | Seed OSS 36B | ✅ |
| `stockmark/stockmark-2-100b-instruct` | Stockmark 100B | ✅ |

### B+ tier (1 modèle — après suppression)
| Model ID | Display Name | Status |
|----------|-------------|--------|
| `mistralai/ministral-14b-instruct-2512` | Ministral 14B | ✅ |

### B tier (1 modèle — après suppression et ajout)
| Model ID | Display Name | Status |
|----------|-------------|--------|
| ~~`meta/llama-3.1-8b-instruct`~~ | ~~Llama 3.1 8B~~ | ❌ 404 |
| ➕ `meta/llama-3.2-11b-vision-instruct` | Llama 3.2 11B Vision | ✅ NOUVEAU |

### C tier (1 modèle)
| Model ID | Display Name | Status |
|----------|-------------|--------|
| `microsoft/phi-4-mini-instruct` | Phi 4 Mini | ✅ |

---

## 📝 Modifications à appliquer dans `sources.js` — `nvidiaNim`

### RETIRER (8 lignes) :
```javascript
['minimaxai/minimax-m2',                          'MiniMax M2',          'S',  '69.4%', '128k'],
['qwen/qwen3-next-80b-a3b-thinking',              'Qwen3 80B Thinking',  'S',  '68.0%', '128k'],
['nvidia/llama-3.1-nemotron-ultra-253b-v1',       'Nemotron Ultra 253B', 'A+', '56.0%', '128k'],
['nvidia/llama-3.3-nemotron-super-49b-v1.5',      'Nemotron Super 49B',  'A',  '49.0%', '128k'],
['nvidia/nemotron-3-nano-30b-a3b',                 'Nemotron 3 Nano 30B', 'A',  '43.0%', '128k'],
['meta/llama-3.3-70b-instruct',                   'Llama 3.3 70B',       'A-', '39.5%', '128k'],
['mistralai/mixtral-8x22b-instruct-v0.1',         'Mixtral 8x22B',       'B+', '32.0%', '64k'],
['mistralai/ministral-14b-instruct-2512',         'Ministral 14B',       'B+', '34.0%', '32k'],  // <-- À VERIFIER: ministral 14b EST TOUJOURS LIVE
['ibm/granite-34b-code-instruct',                 'Granite 34B Code',    'B+', '30.0%', '32k'],
['meta/llama-3.1-8b-instruct',                    'Llama 3.1 8B',        'B',  '28.8%', '128k'],
['meta/llama-4-scout-17b-16e-instruct',           'Llama 4 Scout',       'A',  '44.0%', '131k'],
```

⚠️ **NOTE IMPORTANTE :** J'ai NOTÉ `mistralai/ministral-14b-instruct-2512` comme étant à supprimer ci-dessus mais la vérification en direct montre qu'il est **TOUJOURS LIVE**. Retirer cette ligne de la liste de suppression.

### AJOUTER (1 modèle) :
```javascript
['meta/llama-3.2-11b-vision-instruct',             'Llama 3.2 11B Vision','B',  '-',     '128k'],
```

---

## ⚠️ Point d'attention : `z-ai/glm5` → redirect vers `z-ai/glm-5.1`

Le modèle `z-ai/glm5` redirige vers `z-ai/glm-5.1` (page identique). C'est soit un alias, soit une redirection de migration. Les deux model ID semblent-pointer vers le même endpoint. À surveiller si `glm5` devient obsolète.

---

## ⚠️ Point d'attention : `llama-4-maverick-17b-128e-instruct`

Le modèle est **LIVE** mais affiche "Sorry, your browser does not support inline SVG. We're Be Right Back — Sorry, this model is currently unavailable due to high levels of interest. Please try again later." à certains moments. C'est un problème de **surcharge temporaire**, pas de suppression. Le modèle reste dans sources.js. Garder mais surveiller.

---

## 🎯 Résumé des changements

**Avant :** 33 modèles NVIDIA NIM dans sources.js
**Après :** 26 modèles NVIDIA NIM
**Net :** -7 modèles

### Détail des modifications :
1. ❌ Retirer `minimaxai/minimax-m2` (dégradé par `minimax-m2.7`)
2. ❌ Retirer `qwen/qwen3-next-80b-a3b-thinking` (déprécié, `instruct` variant reste)
3. ❌ Retirer `nvidia/llama-3.1-nemotron-ultra-253b-v1` (404)
4. ❌ Retirer `nvidia/llama-3.3-nemotron-super-49b-v1.5` (404)
5. ❌ Retirer `meta/llama-3.3-70b-instruct` (404)
6. ❌ Retirer `mistralai/mixtral-8x22b-instruct-v0.1` (404, remplacé par Ministral)
7. ❌ Retirer `ibm/granite-34b-code-instruct` (déprécié)
8. ❌ Retirer `meta/llama-3.1-8b-instruct` (404, remplacé par 3.2 Vision)

> ⚠️ `meta/llama-4-scout-17b-16e-instruct` — déprécié sur NIM mais **n'est pas dans nvidiaNim**
> (il existe dans groq, githubModels, cloudflare avec `meta-llama/` prefix). À vérifier séparément.
10. ➕ Ajouter `meta/llama-3.2-11b-vision-instruct` (B tier, nouveau)

**Modèles confirmés opérationnels :** 26 modèles
