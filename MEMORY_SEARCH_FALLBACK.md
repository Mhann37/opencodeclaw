# Memory Search Fallback System

## Problem
OpenAI embeddings quota exceeded → memory_search tool returns 429 error → memory search unavailable.

## Solution (Implemented Tonight)
Local text-based memory search fallback (zero API calls, instant results).

## How It Works

### When to Use
If `memory_search()` returns quota error, use the fallback:

```javascript
// Fallback script
const { memorySearchFallback } = require('./scripts/memory-search-fallback.js');
const results = memorySearchFallback(query, maxResults=10);
```

### CLI Usage
```bash
# Search for "JoelCaine framework"
node /var/lib/openclaw/.openclaw/workspace/scripts/memory-search-fallback.js "JoelCaine framework"

# Returns top 10 results with scores (no API calls)
```

## What It Searches
1. **MEMORY.md** — Long-term memory (curated)
2. **memory/YYYY-MM-DD.md** — Daily notes (recent first)

## Scoring Algorithm
- Exact phrase match: 100 points
- Each keyword match: 10 points
- Results sorted by score (highest first)
- Deduplication and top 10 returned

## Limitations vs Semantic Search
- ✅ **Advantages:** No API quota, instant, offline, zero cost
- ❌ **Disadvantages:** Less contextual (keyword-based), no fuzzy matching

## Long-Term Fix (To Implement Later)

**Option A: Local Embeddings**
- Switch to Ollama or sentence-transformers
- Zero cost, fully offline, no quota
- Implementation time: 2-3 hours

**Option B: Alternative Embedding API**
- Anthropic embeddings, Cohere, or other provider
- Still requires API key but different quota limits
- Implementation time: 1-2 hours

## Files Created
- `/scripts/memory-search-local.js` — Basic local search
- `/scripts/memory-search-fallback.js` — Production fallback with exports
- `/MEMORY_SEARCH_FALLBACK.md` — This file

## Status
✅ **Fallback system LIVE and tested**
✅ **No API calls required**
✅ **Works immediately as backup**

## Next Steps
1. **Tonight:** Test fallback in production (use when memory_search quota fails)
2. **This weekend:** Implement permanent fix (local embeddings or alternative API)
3. **Monitor:** Track memory_search quota usage to prevent future issues
