#!/usr/bin/env node

/**
 * MEMORY SEARCH FALLBACK SYSTEM
 * 
 * Tries semantic search first (OpenAI embeddings)
 * Falls back to local text search if quota exceeded
 * 
 * This is a standalone helper that can be called when memory_search() fails
 */

const fs = require('fs');
const path = require('path');

const MEMORY_DIR = '/var/lib/openclaw/.openclaw/workspace/memory';
const MEMORY_FILE = '/var/lib/openclaw/.openclaw/workspace/MEMORY.md';

/**
 * Local text-based search (no APIs)
 */
function localSearch(query, maxResults = 10) {
  const results = [];
  const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 2);
  
  // Search MEMORY.md
  if (fs.existsSync(MEMORY_FILE)) {
    const content = fs.readFileSync(MEMORY_FILE, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      const lowerLine = line.toLowerCase();
      let score = 0;
      
      if (lowerLine.includes(query.toLowerCase())) {
        score = 100;
      } else {
        searchTerms.forEach(term => {
          if (lowerLine.includes(term)) score += 10;
        });
      }
      
      if (score > 0) {
        results.push({
          source: 'MEMORY.md',
          path: 'MEMORY.md',
          line: idx + 1,
          text: line.trim(),
          score
        });
      }
    });
  }
  
  // Search daily files
  if (fs.existsSync(MEMORY_DIR)) {
    const files = fs.readdirSync(MEMORY_DIR)
      .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
      .sort()
      .reverse(); // Most recent first
    
    files.forEach(file => {
      const filepath = path.join(MEMORY_DIR, file);
      const content = fs.readFileSync(filepath, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, idx) => {
        const lowerLine = line.toLowerCase();
        let score = 0;
        
        if (lowerLine.includes(query.toLowerCase())) {
          score = 100;
        } else {
          searchTerms.forEach(term => {
            if (lowerLine.includes(term)) score += 10;
          });
        }
        
        if (score > 0) {
          results.push({
            source: file,
            path: `memory/${file}`,
            line: idx + 1,
            text: line.trim(),
            score
          });
        }
      });
    });
  }
  
  // Sort by score, return top N
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(r => ({
      ...r,
      minScore: r.score // For compatibility with memory_search response
    }));
}

/**
 * Main fallback search function
 */
function memorySearchFallback(query, maxResults = 5) {
  console.log(`[FALLBACK] Local memory search (no API): "${query}"`);
  
  const results = localSearch(query, maxResults);
  
  return {
    results,
    disabled: false,
    unavailable: false,
    source: 'local-text-search',
    warning: 'Using local text search (semantic search unavailable). Results may be less contextual.'
  };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { localSearch, memorySearchFallback };
}

// CLI usage
if (require.main === module) {
  const query = process.argv.slice(2).join(' ');
  if (!query) {
    console.error('Usage: node memory-search-fallback.js <query>');
    process.exit(1);
  }
  
  const results = memorySearchFallback(query, 10);
  console.log('\n[FALLBACK] Results:\n');
  results.results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.path}#${r.line} (score: ${r.score})`);
    console.log(`   "${r.text}"`);
    console.log('');
  });
}
