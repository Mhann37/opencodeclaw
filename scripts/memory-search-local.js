#!/usr/bin/env node

/**
 * LOCAL MEMORY SEARCH (No API calls)
 * Text-based grep search of memory files
 * Fallback when semantic search is down
 */

const fs = require('fs');
const path = require('path');

const MEMORY_DIR = '/var/lib/openclaw/.openclaw/workspace/memory';
const MEMORY_FILE = '/var/lib/openclaw/.openclaw/workspace/MEMORY.md';

function localMemorySearch(query) {
  console.log(`[MEMORY-LOCAL] Searching: "${query}"\n`);
  
  const results = [];
  const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 2);
  
  // Search MEMORY.md
  try {
    const content = fs.readFileSync(MEMORY_FILE, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      const lowerLine = line.toLowerCase();
      let score = 0;
      
      // Scoring: exact phrase = 100, each term match = 10
      if (lowerLine.includes(query.toLowerCase())) score = 100;
      else {
        searchTerms.forEach(term => {
          if (lowerLine.includes(term)) score += 10;
        });
      }
      
      if (score > 0) {
        results.push({
          source: 'MEMORY.md',
          line: idx + 1,
          text: line.trim(),
          score,
          context: {
            before: lines[idx - 1]?.trim() || '',
            after: lines[idx + 1]?.trim() || ''
          }
        });
      }
    });
  } catch (e) {
    console.error(`[ERROR] Could not read MEMORY.md: ${e.message}`);
  }
  
  // Search daily memory files
  if (fs.existsSync(MEMORY_DIR)) {
    const files = fs.readdirSync(MEMORY_DIR).filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/));
    
    files.forEach(file => {
      try {
        const content = fs.readFileSync(path.join(MEMORY_DIR, file), 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, idx) => {
          const lowerLine = line.toLowerCase();
          let score = 0;
          
          if (lowerLine.includes(query.toLowerCase())) score = 100;
          else {
            searchTerms.forEach(term => {
              if (lowerLine.includes(term)) score += 10;
            });
          }
          
          if (score > 0) {
            results.push({
              source: file,
              line: idx + 1,
              text: line.trim(),
              score,
              context: {
                before: lines[idx - 1]?.trim() || '',
                after: lines[idx + 1]?.trim() || ''
              }
            });
          }
        });
      } catch (e) {
        // Silently skip unreadable files
      }
    });
  }
  
  // Sort by score (highest first) and deduplicate
  const sorted = results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  
  // Format output
  console.log(`[MEMORY-LOCAL] Found ${results.length} matches (showing top 10):\n`);
  
  sorted.forEach((r, i) => {
    console.log(`${i + 1}. ${r.source}#${r.line} (score: ${r.score})`);
    console.log(`   "${r.text}"`);
    if (r.context.before) console.log(`   Context: ${r.context.before}`);
    console.log('');
  });
  
  return sorted;
}

// CLI usage
const query = process.argv.slice(2).join(' ');
if (!query) {
  console.error('[ERROR] Usage: node memory-search-local.js <query>');
  process.exit(1);
}

localMemorySearch(query);
