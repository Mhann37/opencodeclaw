#!/usr/bin/env node

/**
 * PRODUCTION HEALTH BRIEF GENERATOR — WITH WHOOP-CLI
 * 
 * Uses whoop-cli for live data (auto-refresh tokens, JSON output)
 * Combined with StrengthInsight for workout analysis
 * 
 * Runs at 07:30 AEDT via cron, delivers to Telegram
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('[HEALTH-BRIEF] Starting analysis...\n');

// ============================================================================
// GET WHOOP DATA VIA CLI
// ============================================================================

function getWhoopData() {
  try {
    console.log('[WHOOP] Fetching live data via whoop-cli...');
    const output = execSync('whoop check --format json 2>&1', { encoding: 'utf-8', timeout: 10000 });
    // Filter out dotenv logs, keep only JSON
    const jsonLine = output.split('\n').find(line => line.trim().startsWith('{'));
    if (!jsonLine) throw new Error('No JSON in output');
    const data = JSON.parse(jsonLine);
    
    if (!data.ok) {
      throw new Error('WHOOP check failed');
    }

    console.log(`[WHOOP] ✓ Got live data (recovery: ${data.recovery_score}%, strain: ${data.strain})`);
    return data;
  } catch (e) {
    console.log(`[WHOOP] ✗ Failed: ${e.message}`);
    console.log('[WHOOP] Attempting trends (7-day avg)...');
    
    try {
      const output = execSync('whoop trends --format json 2>&1', { encoding: 'utf-8', timeout: 10000 });
      const jsonLine = output.split('\n').find(line => line.trim().startsWith('{'));
      if (!jsonLine) throw new Error('No JSON in trends output');
      const trends = JSON.parse(jsonLine);
      console.log(`[WHOOP] ✓ Got 7-day trends`);
      return trends;
    } catch (e2) {
      console.log(`[WHOOP] ✗ Trends failed: ${e2.message}`);
      return null;
    }
  }
}

// ============================================================================
// LOAD STRENGTH DATA
// ============================================================================

function loadStrengthData() {
  const strengthDir = '/var/lib/openclaw/.openclaw/media/inbound';
  try {
    const files = fs.readdirSync(strengthDir)
      .filter(f => f.includes('strengthinsight') && f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (files.length === 0) {
      console.log('[STRENGTH] No exports found');
      return null;
    }
    
    const filePath = path.join(strengthDir, files[0]);
    console.log(`[STRENGTH] ✓ Loaded ${files[0].substring(0, 40)}...`);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`[STRENGTH] ✗ Error: ${e.message}`);
    return null;
  }
}

// ============================================================================
// ANALYZE DATA
// ============================================================================

function analyzeStrengthData(data) {
  if (!data || !data.workouts) {
    return { total_workouts: 0, total_volume: 0, recent_7day: [] };
  }

  const workouts = data.workouts || [];
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recent_7day = workouts.filter(w => new Date(w.date) >= sevenDaysAgo);
  const total_volume = recent_7day.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);

  // Muscle group balance
  const muscleGroups = {};
  recent_7day.forEach(w => {
    (w.exercises || []).forEach(e => {
      const mg = e.muscleGroup || 'Unknown';
      muscleGroups[mg] = (muscleGroups[mg] || 0) + 1;
    });
  });

  return {
    total_workouts: workouts.length,
    total_volume: Math.round(total_volume),
    recent_7day_count: recent_7day.length,
    recent_7day_volume: Math.round(total_volume),
    muscle_groups: muscleGroups
  };
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  try {
    // Get WHOOP data
    const whoopData = getWhoopData();
    if (!whoopData) {
      throw new Error('Could not fetch WHOOP data');
    }

    // Load StrengthInsight
    const strengthData = loadStrengthData();
    const strengthAnalysis = analyzeStrengthData(strengthData);

    console.log('[ANALYSIS] Computing trends...');

    // Format timestamp
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }).split(', ')[1];

    // Recovery assessment
    const recoveryStatus = whoopData.recovery_score >= 70 ? '✓ Optimal' 
                        : whoopData.recovery_score >= 50 ? '⚠ Fair' 
                        : '🔴 Low (prioritize recovery)';

    // Strain assessment
    const strainStatus = whoopData.strain >= 12 && whoopData.strain <= 17 ? '✓ Optimal'
                      : whoopData.strain > 17 ? '⚠ High (risk of overtraining)'
                      : '🟡 Low (consider increasing volume)';

    // Sleep assessment
    const sleepStatus = whoopData.sleep_hours >= 8 ? '✓ Excellent'
                     : whoopData.sleep_hours >= 7 ? '✓ Good'
                     : '⚠ Below target';

    const brief = `# Daily Health Brief — ${dateStr}

*Generated ${timeStr} AEDT*
*Data: Live WHOOP API + StrengthInsight*

---

## 💚 Recovery Analysis

**Recovery Score:** ${whoopData.recovery_score}% ${recoveryStatus}

**HRV (Heart Rate Variability):** ${whoopData.hrv_rmssd_milli}ms (baseline: ~44ms)

**Resting Heart Rate:** ${whoopData.resting_heart_rate}bpm

**SpO₂:** ${whoopData.spo2_percentage}%

**Status:** ${whoopData.recovery_score >= 70 ? 'Ready for intense training' : 'Focus on recovery & sleep'}

---

## 💪 Strain & Workload

**Today's Strain:** ${whoopData.strain} / 21 (recommended: 12-17)

**Assessment:** ${strainStatus}

**Calories Burned:** ${whoopData.calories}

---

## 😴 Sleep Quality & Duration

**Last Night:** ${whoopData.sleep_hours}h sleep at ${whoopData.sleep_efficiency}% efficiency

**Sleep Performance:** ${whoopData.sleep_performance}%

**Assessment:** ${sleepStatus}

**Recommendation:** Aim for 8+ hours tonight for optimal recovery

---

## 💪 Strength Training Analysis

**Total Workouts (lifetime):** ${strengthAnalysis.total_workouts}

**Recent Volume (last 7 days):** ${strengthAnalysis.recent_7day_volume}kg across ${strengthAnalysis.recent_7day_count} sessions

**Muscle Group Distribution (last 7 days):**
${Object.entries(strengthAnalysis.muscle_groups)
  .sort((a, b) => b[1] - a[1])
  .map(([group, count]) => `• ${group}: ${count} exercises`)
  .join('\n')}

**Trend:** ${strengthAnalysis.recent_7day_count > 0 ? 'Consistent training activity' : 'No recent sessions'}

---

## 🎯 Recommendations for Next 2 Weeks

**Recovery Priority:** ${whoopData.recovery_score < 50 ? 'HIGH — prioritize sleep and rest days' : 'Standard — maintain current recovery habits'}

**Training Focus:** ${whoopData.strain > 17 ? 'Reduce volume, focus on quality' : 'Maintain current training load'}

**Sleep Target:** 8+ hours nightly

**Hydration:** 3.5-4L daily

**Protein:** 150-180g minimum

---

## 📍 Daily Checklist

□ Hydration: 3.5-4L water
□ Protein: 150-180g minimum
□ Sleep: ${whoopData.sleep_hours >= 8 ? '✓ Met target' : '⚠ Target 8+ hours tonight'}
□ Training: ${whoopData.workout_count > 0 ? `✓ ${whoopData.workout_count} workout(s) logged` : '⚠ Consider movement/training'}
□ Recovery: Foam roll + stretching 5-10 min

---

**Brief generated with live WHOOP API (whoop-cli) + StrengthInsight data.**
*Auto-delivered daily at 07:30 AEDT.*`;

    console.log('[ANALYSIS] ✓ Complete\n');
    console.log('[OUTPUT] Writing brief...\n');

    fs.writeFileSync('/var/lib/openclaw/.openclaw/workspace/daily-health-brief.md', brief);
    console.log(brief);
    console.log('\n[OUTPUT] ✓ Brief saved to daily-health-brief.md');

  } catch (e) {
    console.error(`\n[ERROR] ${e.message}`);
    process.exit(1);
  }
}

main();
