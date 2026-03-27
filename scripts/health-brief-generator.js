#!/usr/bin/env node

/**
 * Health Brief Generator
 * Pulls WHOOP data + StrengthInsight JSON, generates coaching-level brief.
 * 
 * Usage:
 *   node health-brief-generator.js [--test] [--whoop-path PATH] [--strength-path PATH]
 */

const fs = require('fs');
const path = require('path');

// Config
const WHOOP_CACHE = path.join(process.env.HOME, '.openclaw/workspace/.whoop-cache.json');
const STRENGTH_EXPORT_DIR = path.join(process.env.HOME, '.openclaw/workspace/research');
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8593559681'; // Matt's ID

// Flags
const TEST_MODE = process.argv.includes('--test');
const WHOOP_PATH = process.argv[process.argv.indexOf('--whoop-path') + 1] || WHOOP_CACHE;
const STRENGTH_PATH = process.argv[process.argv.indexOf('--strength-path') + 1];

/**
 * Load WHOOP data (most recent entry)
 */
function loadWhoopData() {
  try {
    if (!fs.existsSync(WHOOP_PATH)) {
      console.warn(`⚠️  WHOOP cache not found: ${WHOOP_PATH}`);
      return null;
    }
    const data = JSON.parse(fs.readFileSync(WHOOP_PATH, 'utf-8'));
    if (!Array.isArray(data) || data.length === 0) return null;
    return data[0]; // Most recent
  } catch (e) {
    console.warn(`⚠️  Error loading WHOOP data: ${e.message}`);
    return null;
  }
}

/**
 * Load StrengthInsight data (latest export)
 */
function loadStrengthData() {
  try {
    let targetFile = STRENGTH_PATH;
    
    if (!targetFile) {
      // Auto-find latest export
      const files = fs.readdirSync(STRENGTH_EXPORT_DIR)
        .filter(f => f.includes('strengthinsight') && f.endsWith('.json'))
        .sort()
        .reverse();
      
      if (files.length === 0) {
        console.warn(`⚠️  No StrengthInsight exports found in ${STRENGTH_EXPORT_DIR}`);
        return null;
      }
      targetFile = path.join(STRENGTH_EXPORT_DIR, files[0]);
    }
    
    if (!fs.existsSync(targetFile)) {
      console.warn(`⚠️  StrengthInsight file not found: ${targetFile}`);
      return null;
    }
    
    return JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
  } catch (e) {
    console.warn(`⚠️  Error loading StrengthInsight data: ${e.message}`);
    return null;
  }
}

/**
 * Analyze strength data for trends, imbalances, plateaus
 */
function analyzeStrength(data) {
  if (!data || !data.workouts || data.workouts.length === 0) {
    return { summary: 'No recent data', volume_trend: null, issues: [] };
  }

  const workouts = data.workouts;
  const lastWeek = workouts.slice(0, 7); // Last 7 sessions
  const twoWeeksAgo = workouts.slice(7, 14);

  // Volume trend
  const lastWeekVolume = lastWeek.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);
  const twoWeeksVolume = twoWeeksAgo.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);
  const volumeChange = twoWeeksVolume > 0 ? ((lastWeekVolume - twoWeeksVolume) / twoWeeksVolume * 100).toFixed(1) : 0;

  // Muscle group distribution (last 14 days)
  const muscleGroups = {};
  lastWeek.concat(twoWeeksAgo).forEach(workout => {
    workout.exercises?.forEach(ex => {
      const group = ex.muscleGroup || 'Unknown';
      if (!muscleGroups[group]) muscleGroups[group] = 0;
      muscleGroups[group] += ex.sets?.length || 0;
    });
  });

  // Identify imbalances (>40% of volume in one muscle group is suspicious)
  const totalSets = Object.values(muscleGroups).reduce((a, b) => a + b, 0);
  const imbalances = Object.entries(muscleGroups)
    .filter(([_, sets]) => (sets / totalSets) > 0.35)
    .map(([group, sets]) => `${group}: ${sets} sets (${(sets/totalSets*100).toFixed(0)}%)`);

  // Plateau detection: check if max lifts are stagnant over 4 weeks
  const exercises = {};
  workouts.slice(0, 20).forEach(w => {
    w.exercises?.forEach(ex => {
      if (!exercises[ex.name]) exercises[ex.name] = [];
      const maxWeight = Math.max(...(ex.sets?.map(s => s.weightKg) || [0]));
      exercises[ex.name].push(maxWeight);
    });
  });

  const plateaus = Object.entries(exercises)
    .filter(([_, weights]) => weights.length >= 4 && 
      Math.max(...weights) === weights[0] && 
      weights.every(w => w === weights[0]))
    .map(([name, _]) => name);

  return {
    summary: `${lastWeekVolume.toFixed(0)}kg total volume (${volumeChange > 0 ? '+' : ''}${volumeChange}% vs 2 weeks ago)`,
    volume_trend: { last_week: lastWeekVolume, change_pct: parseFloat(volumeChange) },
    muscle_dist: muscleGroups,
    imbalances,
    plateaus
  };
}

/**
 * Generate coaching brief
 */
function generateBrief(whoopData, strengthData) {
  const analysis = analyzeStrength(strengthData);
  
  let brief = '💪 **Daily Health Brief** — ' + new Date().toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' }) + '\n\n';

  // WHOOP Section
  if (whoopData) {
    const recovery = whoopData.recovery?.recovery_score || '?';
    const sleepHours = ((whoopData.sleep?.sleep_duration_seconds || 0) / 3600).toFixed(1);
    const hrv = whoopData.recovery?.hrv || '?';
    
    brief += '**RECOVERY**\n';
    brief += `• Recovery Score: ${recovery}% `;
    if (recovery >= 70) brief += '✅ (Green light)';
    else if (recovery >= 50) brief += '⚠️ (Caution)';
    else brief += '🔴 (Low — easy day)';
    brief += '\n';
    brief += `• Sleep: ${sleepHours}h (HRV: ${hrv})\n`;
    brief += `• Date: ${whoopData.date}\n\n`;
  }

  // Strength Section
  if (analysis && analysis.summary) {
    brief += '**TRAINING**\n';
    brief += `• Volume: ${analysis.summary}\n`;
    
    if (analysis.imbalances.length > 0) {
      brief += `• ⚠️ Imbalances: ${analysis.imbalances.join(' | ')}\n`;
    }
    
    if (analysis.plateaus.length > 0) {
      brief += `• 📈 Plateau Alert: ${analysis.plateaus.slice(0, 2).join(', ')}\n`;
    }
    
    brief += '\n';
  }

  // Coaching cues
  brief += '**FOCUS — Next 2 Weeks**\n';
  if (analysis.imbalances.length > 0) {
    brief += '1️⃣ Address muscle imbalance — more back/posterior work\n';
  } else {
    brief += '1️⃣ Maintain balanced volume distribution\n';
  }
  
  if (analysis.plateaus.length > 0) {
    brief += '2️⃣ Break plateaus with rep/weight/rest variation\n';
  } else {
    brief += '2️⃣ Progressive overload — chase +2-3kg or +1-2 reps\n';
  }
  
  if (whoopData && whoopData.recovery?.recovery_score < 50) {
    brief += '3️⃣ Recovery is low — prioritize sleep, easy session today\n';
  } else {
    brief += '3️⃣ Hydration & mobility between lifts\n';
  }

  return brief;
}

/**
 * Send to Telegram
 */
async function sendToTelegram(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('📨 Telegram config missing — output to console only:\n');
    console.log(message);
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('❌ Telegram error:', err);
      return false;
    }

    console.log('✅ Brief sent to Telegram');
    return true;
  } catch (e) {
    console.error('❌ Send failed:', e.message);
    return false;
  }
}

/**
 * Main
 */
async function main() {
  console.log('🏃 Generating health brief...');

  const whoop = loadWhoopData();
  const strength = loadStrengthData();

  if (!whoop && !strength) {
    console.error('❌ No data available. Exiting.');
    process.exit(1);
  }

  const brief = generateBrief(whoop, strength);

  if (TEST_MODE) {
    console.log('\n📋 **TEST OUTPUT**:\n');
    console.log(brief);
  } else {
    await sendToTelegram(brief);
  }
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
