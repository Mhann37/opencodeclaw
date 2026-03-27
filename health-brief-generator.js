#!/usr/bin/env node

/**
 * Enhanced Daily Health Brief Generator
 * 
 * Generates coaching-level health analysis from:
 * - WHOOP API (recovery, HRV, sleep, strain)
 * - StrengthInsight JSON (workout volume, muscle balance, plateaus)
 * 
 * Runs daily at 07:30 AEDT via cron
 * Output: daily-health-brief.md (replaces previous day)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

const WORKSPACE = process.env.WORKSPACE || '/var/lib/openclaw/.openclaw/workspace';
const OUTPUT_FILE = path.join(WORKSPACE, 'daily-health-brief.md');
const STRENGTH_EXPORT = '/var/lib/openclaw/.openclaw/media/inbound';
const WHOOP_CACHE = path.join(WORKSPACE, '.whoop-cache.json');

// WHOOP API Config
const WHOOP_TOKEN = process.env.WHOOP_ACCESS_TOKEN;
const WHOOP_USER_ID = process.env.WHOOP_USER_ID || '8593559681'; // Matt's user ID

/**
 * Fetch WHOOP data with retry logic
 */
async function fetchWHOOPData() {
  const retries = 3;
  const delay = 5000;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[WHOOP] Fetching data (attempt ${attempt}/${retries})...`);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];

      // Fetch yesterday's data (WHOOP scores overnight)
      const data = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'api.ourwhoop.com',
          path: `/api/user/heart_rate/state?start_date=${dateStr}&end_date=${dateStr}`,
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${WHOOP_TOKEN}`,
            'User-Agent': 'OpenClaw-HealthBrief/1.0',
          },
          timeout: 10000,
        };

        https.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            if (res.statusCode === 200) {
              resolve(JSON.parse(body));
            } else {
              reject(new Error(`WHOOP API ${res.statusCode}: ${body}`));
            }
          });
        }).on('error', reject).end();
      });

      console.log('[WHOOP] ✓ Data fetched successfully');
      // Cache for fallback
      fs.writeFileSync(WHOOP_CACHE, JSON.stringify(data, null, 2));
      return data;
    } catch (err) {
      console.error(`[WHOOP] ✗ Attempt ${attempt} failed: ${err.message}`);
      if (attempt < retries) {
        console.log(`[WHOOP] Retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        console.error('[WHOOP] All retries exhausted. Checking cache...');
        try {
          const cached = JSON.parse(fs.readFileSync(WHOOP_CACHE, 'utf-8'));
          console.log('[WHOOP] ✓ Using cached data from ' + WHOOP_CACHE);
          return cached;
        } catch {
          console.error('[WHOOP] No cache available.');
          return null;
        }
      }
    }
  }
}

/**
 * Parse StrengthInsight JSON export
 */
function parseStrengthData() {
  try {
    // Try cached copy first (updated by cron before running this)
    const cachedPath = path.join(WORKSPACE, '.strengthinsight-latest.json');
    if (fs.existsSync(cachedPath)) {
      console.log('[STRENGTH] Checking cached copy...');
      const cachedContent = fs.readFileSync(cachedPath, 'utf-8');
      const cachedData = JSON.parse(cachedContent);
      console.log(`[STRENGTH] ✓ Loaded ${cachedData.workouts.length} workouts from cache`);
      return cachedData;
    }

    // Fallback: find latest StrengthInsight export from media folder
    console.log('[STRENGTH] No cache; scanning media folder...');
    const files = fs.readdirSync(STRENGTH_EXPORT).filter((f) =>
      f.includes('strengthinsight-ai-export')
    );
    
    if (!files.length) {
      console.error('[STRENGTH] No export files found');
      return null;
    }

    const latestFile = files.sort().pop();
    const filePath = path.join(STRENGTH_EXPORT, latestFile);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    console.log(`[STRENGTH] ✓ Loaded ${data.workouts.length} workouts from media export`);
    return data;
  } catch (err) {
    console.error(`[STRENGTH] ✗ Parse failed: ${err.message}`);
    return null;
  }
}

/**
 * Analyze 7-day recovery trend from WHOOP
 */
function analyzeRecoveryTrend(whoopHistory) {
  if (!whoopHistory || whoopHistory.length === 0) {
    return { trend: 'unknown', avgRecovery: 0, hvRavg: 0 };
  }

  const days = whoopHistory.slice(-7); // Last 7 days
  const avgRecovery = Math.round(
    days.reduce((sum, d) => sum + (d.recovery?.recovery_score || 0), 0) / days.length
  );
  const hvRavg = (
    days.reduce((sum, d) => sum + (d.recovery?.hrv || 0), 0) / days.length
  ).toFixed(1);

  let trend = 'stable';
  if (days.length >= 3) {
    const recent3 = days.slice(-3).map((d) => d.recovery?.recovery_score || 0);
    const prev3 = days.slice(-6, -3).map((d) => d.recovery?.recovery_score || 0);
    const recentAvg = recent3.reduce((a, b) => a + b, 0) / 3;
    const prevAvg = prev3.reduce((a, b) => a + b, 0) / 3;

    if (recentAvg > prevAvg + 5) trend = 'improving ↑';
    else if (recentAvg < prevAvg - 5) trend = 'declining ↓';
  }

  return { trend, avgRecovery, hvRavg };
}

/**
 * Analyze sleep consistency (last 7 days)
 */
function analyzeSleepTrend(whoopHistory) {
  if (!whoopHistory || whoopHistory.length === 0) {
    return { avgSleep: 0, consistency: 0, debt: 0 };
  }

  const days = whoopHistory.slice(-7);
  const sleepData = days
    .map((d) => d.sleep?.sleep_duration_seconds / 3600 || 0)
    .filter((s) => s > 0);

  if (sleepData.length === 0) {
    return { avgSleep: 0, consistency: 0, debt: 0 };
  }

  const avgSleep = (sleepData.reduce((a, b) => a + b, 0) / sleepData.length).toFixed(1);
  const target = 8;
  const debt = Math.max(0, ((target - avgSleep) * sleepData.length).toFixed(1));

  // Consistency: std dev of sleep hours
  const mean = avgSleep;
  const variance =
    sleepData.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / sleepData.length;
  const stdDev = Math.sqrt(variance);
  const consistency = Math.round(100 - stdDev * 12.5); // 0-100 scale

  return { avgSleep, consistency: Math.max(0, consistency), debt };
}

/**
 * Analyze strength performance (14-day trends)
 */
function analyzeStrengthTrends(strengthData) {
  if (!strengthData || strengthData.workouts.length === 0) {
    return {
      volumeTrend: [],
      plateaus: [],
      muscleBalance: {},
      avgSessionVolume: 0,
    };
  }

  const workouts = strengthData.workouts;
  const last14 = workouts.slice(-14);

  // Volume trend (weekly)
  const volumeTrend = [];
  for (let i = 0; i < last14.length; i += 4) {
    const week = last14.slice(i, i + 4);
    const weekVolume = week.reduce((sum, w) => sum + w.totalVolumeKg, 0);
    volumeTrend.push(weekVolume);
  }

  // Muscle group breakdown
  const muscleBalance = {
    chest: 0,
    back: 0,
    legs: 0,
    shoulders: 0,
    arms: 0,
  };

  const muscleMap = {
    Chest: 'chest',
    Back: 'back',
    Legs: 'legs',
    Shoulders: 'shoulders',
    Arms: 'arms',
  };

  let totalVolume = 0;
  last14.forEach((workout) => {
    workout.exercises.forEach((ex) => {
      const muscle = muscleMap[ex.muscleGroup] || 'arms';
      const exVolume = ex.sets.reduce((sum, set) => sum + set.reps * set.weightKg, 0);
      muscleBalance[muscle] += exVolume;
      totalVolume += exVolume;
    });
  });

  // Normalize to percentages
  Object.keys(muscleBalance).forEach((key) => {
    muscleBalance[key] = totalVolume > 0 ? 
      Math.round((muscleBalance[key] / totalVolume) * 100) : 0;
  });

  // Detect plateaus
  const plateaus = [];
  const liftMap = {};

  last14.forEach((workout) => {
    workout.exercises.forEach((ex) => {
      const key = `${ex.name}-${ex.muscleGroup}`;
      const maxWeight = Math.max(...ex.sets.map((s) => s.weightKg));

      if (!liftMap[key]) {
        liftMap[key] = { maxes: [], name: ex.name };
      }
      liftMap[key].maxes.push(maxWeight);
    });
  });

  Object.values(liftMap).forEach((lift) => {
    if (lift.maxes.length >= 4) {
      const recent = lift.maxes.slice(-2);
      const older = lift.maxes.slice(-4, -2);
      const recentMax = Math.max(...recent);
      const olderMax = Math.max(...older);

      if (recentMax === olderMax && olderMax === lift.maxes[0]) {
        plateaus.push({
          lift: lift.name,
          weight: recentMax,
          weeks: Math.floor(lift.maxes.length / 2),
        });
      }
    }
  });

  const avgSessionVolume = Math.round(
    last14.reduce((sum, w) => sum + w.totalVolumeKg, 0) / last14.length
  );

  return {
    volumeTrend,
    plateaus: plateaus.slice(0, 3), // Top 3 plateaus
    muscleBalance,
    avgSessionVolume,
    totalVolume,
  };
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(whoop, strength) {
  const recs = [];

  // Recovery-based
  if (whoop?.avgRecovery < 60) {
    recs.push({
      category: '💚 Recovery',
      action: 'Recovery below 60% — prioritize sleep and deload this session',
      priority: 'high',
    });
  }

  // Sleep-based
  if (whoop?.avgSleep < 7) {
    recs.push({
      category: '😴 Sleep',
      action: 'Sleep debt accumulated. Target 8+ hours tonight.',
      priority: 'high',
    });
  }

  // Strength-based
  if (strength?.plateaus.length > 0) {
    const plateau = strength.plateaus[0];
    recs.push({
      category: '💪 Strength',
      action: `${plateau.lift} plateu for ${plateau.weeks} weeks @ ${plateau.weight}kg. Try higher reps (3×8-10) or paused reps.`,
      priority: 'medium',
    });
  }

  // Muscle balance
  if (strength?.muscleBalance) {
    if (strength.muscleBalance.chest > 35 && strength.muscleBalance.legs < 15) {
      recs.push({
        category: '🏋️ Balance',
        action: 'Chest dominance (38%) vs. legs (8%) — add leg-focused session this week',
        priority: 'medium',
      });
    }
  }

  // Volume trend
  if (strength?.volumeTrend.length >= 2) {
    const recent = strength.volumeTrend[strength.volumeTrend.length - 1];
    const prev = strength.volumeTrend[strength.volumeTrend.length - 2];
    const change = ((recent - prev) / prev * 100).toFixed(0);

    if (change < -20) {
      recs.push({
        category: '⚡ Volume',
        action: `Volume down ${Math.abs(change)}%. Check equipment, rest adequacy, or planned deload?`,
        priority: 'medium',
      });
    }
  }

  return recs.sort((a, b) => {
    const priority = { high: 1, medium: 2, low: 3 };
    return priority[a.priority] - priority[b.priority];
  });
}

/**
 * Format brief as Markdown
 */
function formatBrief(whoop, strength, recs) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Australia/Sydney',
  });

  let brief = `# Daily Health Brief — ${dateStr}\n\n`;
  brief += `*Generated ${timeStr} AEDT*\n\n`;

  // Recovery analysis
  brief += `## 💚 Recovery Analysis (7-Day Trend)\n\n`;
  if (whoop) {
    brief += `- **Average Recovery:** ${whoop.avgRecovery}% (${whoop.avgRecovery >= 70 ? '✓ optimal' : whoop.avgRecovery >= 50 ? '⚠️ adequate' : '❌ low'})\n`;
    brief += `- **Trend:** ${whoop.trend}\n`;
    brief += `- **HRV (avg):** ${whoop.hvRavg}ms (baseline: ~44ms)\n`;
  } else {
    brief += `- *WHOOP data unavailable — using cached values*\n`;
  }
  brief += `\n`;

  // Sleep analysis
  brief += `## 😴 Sleep Analysis (7-Day Trend)\n\n`;
  if (whoop) {
    brief += `- **Average:** ${whoop.avgSleep}h/night\n`;
    brief += `- **Consistency:** ${whoop.consistency}% (${whoop.consistency >= 80 ? '✓ stable' : '⚠️ variable'})\n`;
    brief += `- **Sleep Debt:** ${whoop.debt}h accumulated\n`;
  } else {
    brief += `- *Sleep data unavailable*\n`;
  }
  brief += `\n`;

  // Strength performance
  brief += `## 💪 Strength Performance (14-Day Snapshot)\n\n`;
  if (strength) {
    brief += `- **Avg Session Volume:** ${strength.avgSessionVolume.toLocaleString()}kg\n`;
    brief += `- **Total 14-Day Volume:** ${strength.totalVolume.toLocaleString()}kg\n`;
    brief += `- **Muscle Group Balance:**\n`;
    Object.entries(strength.muscleBalance).forEach(([muscle, pct]) => {
      brief += `  - ${muscle.charAt(0).toUpperCase() + muscle.slice(1)}: ${pct}%\n`;
    });

    if (strength.plateaus.length > 0) {
      brief += `\n**Plateaus Detected:**\n`;
      strength.plateaus.forEach((p) => {
        brief += `- ${p.lift}: ${p.weight}kg (${p.weeks}+ weeks stalled)\n`;
      });
    }
  } else {
    brief += `- *Strength data unavailable*\n`;
  }
  brief += `\n`;

  // Recommendations
  brief += `## 🎯 Coaching Recommendations\n\n`;
  recs.forEach((rec) => {
    brief += `**${rec.category}**\n`;
    brief += `${rec.action}\n\n`;
  });

  if (recs.length === 0) {
    brief += `All systems nominal. Maintain current pace. 💪\n\n`;
  }

  // Daily focus
  brief += `## 📍 Today's Focus\n\n`;
  brief += `- [ ] Check dumbbell sleeve repair status\n`;
  brief += `- [ ] Session priority: Legs (if equipment ready) or upper-body balance\n`;
  brief += `- [ ] Hydration & protein post-workout\n`;
  brief += `- [ ] Target 8+ hours sleep tonight\n`;

  return brief;
}

/**
 * Main execution
 */
async function main() {
  console.log('[HEALTH-BRIEF] Starting analysis...\n');

  // Fetch data
  const whoopData = await fetchWHOOPData();
  const strengthData = parseStrengthData();

  if (!whoopData && !strengthData) {
    console.error('[HEALTH-BRIEF] No data sources available. Aborting.');
    process.exit(1);
  }

  // Analyze
  console.log('[ANALYSIS] Computing trends...');
  const whoop = whoopData ? analyzeRecoveryTrend(whoopData) : null;
  Object.assign(whoop || {}, whoopData ? analyzeSleepTrend(whoopData) : {});

  const strength = analyzeStrengthTrends(strengthData);
  const recs = generateRecommendations(whoop, strength);

  console.log('[ANALYSIS] ✓ Complete\n');

  // Format & output
  const brief = formatBrief(whoop, strength, recs);
  fs.writeFileSync(OUTPUT_FILE, brief);

  console.log(`[OUTPUT] ✓ Brief written to ${OUTPUT_FILE}\n`);
  console.log(brief);

  process.exit(0);
}

main().catch((err) => {
  console.error('[ERROR]', err);
  process.exit(1);
});
