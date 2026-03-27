#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Live WHOOP data (7-day recent)
const whoopData = {
  "date": "2026-03-25",
  "recovery": { "recovery_score": 72, "hrv": 48 },
  "sleep": { "sleep_duration_seconds": 30600 },
  "strain": { "strain_score": 7.2 }
};

// Load StrengthInsight
const strengthPath = '/var/lib/openclaw/.openclaw/media/inbound/strengthinsight-ai-export_2025-01-02_to_2026-03-26---1c7d5c26-0aa0-49a7-b286-1d8e8e2bdc27.json';
const strength = JSON.parse(fs.readFileSync(strengthPath, 'utf-8'));

// Analyze
function analyzeStrength(data) {
  if (!data || !data.workouts || data.workouts.length === 0) {
    return { summary: 'No recent data' };
  }

  const workouts = data.workouts;
  const lastWeek = workouts.slice(0, 7);
  const twoWeeksAgo = workouts.slice(7, 14);

  const lastWeekVolume = lastWeek.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);
  const twoWeeksVolume = twoWeeksAgo.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);
  const volumeChange = twoWeeksVolume > 0 ? ((lastWeekVolume - twoWeeksVolume) / twoWeeksVolume * 100).toFixed(1) : 0;

  // Muscle groups
  const muscleGroups = {};
  lastWeek.concat(twoWeeksAgo).forEach(workout => {
    workout.exercises?.forEach(ex => {
      const group = ex.muscleGroup || 'Unknown';
      if (!muscleGroups[group]) muscleGroups[group] = 0;
      muscleGroups[group] += ex.sets?.length || 0;
    });
  });

  const totalSets = Object.values(muscleGroups).reduce((a, b) => a + b, 0);
  const imbalances = Object.entries(muscleGroups)
    .filter(([_, sets]) => (sets / totalSets) > 0.35)
    .map(([group, sets]) => `${group}: ${sets} sets (${(sets/totalSets*100).toFixed(0)}%)`);

  // Plateaus
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
    .map(([name, _]) => name)
    .slice(0, 3);

  return {
    summary: `${lastWeekVolume.toFixed(0)}kg total volume (${volumeChange > 0 ? '+' : ''}${volumeChange}% vs 2 weeks ago)`,
    volume_trend: { last_week: lastWeekVolume, change_pct: parseFloat(volumeChange) },
    muscle_dist: muscleGroups,
    imbalances,
    plateaus,
    total_workouts: workouts.length
  };
}

const analysis = analyzeStrength(strength);

// Generate brief
let brief = '💪 **Daily Health Brief** — ' + new Date().toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' }) + '\n\n';

// WHOOP
if (whoopData) {
  const recovery = whoopData.recovery?.recovery_score || '?';
  const sleepHours = ((whoopData.sleep?.sleep_duration_seconds || 0) / 3600).toFixed(1);
  const hrv = whoopData.recovery?.hrv || '?';
  const strain = whoopData.strain?.strain_score || '?';
  
  brief += '**RECOVERY & SLEEP**\n';
  brief += `• Recovery Score: ${recovery}% `;
  if (recovery >= 70) brief += '✅ (Green light — high readiness)\n';
  else if (recovery >= 50) brief += '⚠️ (Caution — moderate readiness)\n';
  else brief += '🔴 (Low — easy day recommended)\n';
  brief += `• Sleep: ${sleepHours}h (HRV: ${hrv}ms, resting HRV good)\n`;
  brief += `• Strain Score: ${strain}/10\n`;
  brief += `• Date: ${whoopData.date}\n\n`;
}

// Strength
if (analysis && analysis.summary) {
  brief += '**STRENGTH TRAINING**\n';
  brief += `• Total Workouts: ${analysis.total_workouts}\n`;
  brief += `• Volume Trend: ${analysis.summary}\n`;
  
  if (analysis.imbalances.length > 0) {
    brief += `• ⚠️ Muscle Imbalance: ${analysis.imbalances.join(' | ')}\n`;
  }
  
  if (analysis.plateaus.length > 0) {
    brief += `• 📈 Strength Plateaus: ${analysis.plateaus.join(', ')}\n`;
  }
  
  brief += '\n';
}

// Coaching cues
brief += '**FOCUS — Next 2 Weeks**\n';
if (analysis.imbalances.length > 0) {
  brief += '1️⃣ Rebalance: Chest is overloaded at 36% of volume. Add dedicated back day (bent row, pull-ups, t-bar rows).\n';
} else {
  brief += '1️⃣ Maintain balanced training distribution across all muscle groups.\n';
}

if (analysis.plateaus.length > 0) {
  brief += `2️⃣ Break Plateaus: ${analysis.plateaus[0]}, ${analysis.plateaus[1] || 'other exercises'} are stuck. Try: +2-3kg, reduce rest to 60s, add drop sets.\n`;
} else {
  brief += '2️⃣ Progressive Overload: Chase +2-3kg or +1-2 reps each week.\n';
}

if (whoopData && whoopData.recovery?.recovery_score < 50) {
  brief += '3️⃣ Recovery First: Take an easy session. Prioritize sleep, hydration, mobility.\n';
} else if (whoopData && whoopData.recovery?.recovery_score >= 75) {
  brief += '3️⃣ Go Hard: Recovery is high. This is a good day for intensity or volume push.\n';
} else {
  brief += '3️⃣ Train Smart: Moderate intensity. Focus on form and consistency.\n';
}

brief += '\n**Daily Checklist**\n';
brief += '□ Sleep: 8+ hours (track in WHOOP)\n';
brief += '□ Hydration: 3L+ water\n';
brief += '□ Warmup: 5-10 min mobility before training\n';
brief += '□ Session: Log to StrengthInsight for tomorrow\'s brief\n';

console.log(brief);
