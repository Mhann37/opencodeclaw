#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 7-day WHOOP data with trends
const whoopHistory = [
  { date: "2026-03-25", recovery: 72, hrv: 48, sleep_sec: 30600, strain: 7.2 },
  { date: "2026-03-24", recovery: 68, hrv: 45, sleep_sec: 28800, strain: 8.1 },
  { date: "2026-03-23", recovery: 75, hrv: 50, sleep_sec: 32400, strain: 6.5 },
  { date: "2026-03-22", recovery: 62, hrv: 42, sleep_sec: 25200, strain: 8.8 },
  { date: "2026-03-21", recovery: 83, hrv: 54, sleep_sec: 31800, strain: 5.2 },
  { date: "2026-03-20", recovery: 71, hrv: 48, sleep_sec: 29400, strain: 7.9 },
  { date: "2026-03-19", recovery: 67, hrv: 44, sleep_sec: 27000, strain: 8.4 }
];

// Load StrengthInsight
const strengthPath = '/var/lib/openclaw/.openclaw/media/inbound/strengthinsight-ai-export_2025-01-02_to_2026-03-26---1c7d5c26-0aa0-49a7-b286-1d8e8e2bdc27.json';
const strength = JSON.parse(fs.readFileSync(strengthPath, 'utf-8'));

// Analysis functions
function analyzeRecovery(history) {
  const scores = history.map(h => h.recovery);
  const avg = (scores.reduce((a, b) => a + b) / scores.length).toFixed(1);
  const trend = scores[0] > scores[6] ? 'improving' : 'declining';
  const hvs = history.map(h => h.hrv);
  const hvAvg = (hvs.reduce((a, b) => a + b) / hvs.length).toFixed(1);
  
  return {
    latest: scores[0],
    avg,
    trend,
    hvAvg,
    hvLatest: hvs[0],
    history: scores,
    status: scores[0] >= 70 ? 'excellent' : scores[0] >= 50 ? 'moderate' : 'low'
  };
}

function analyzeStrain(history) {
  const strains = history.map(h => h.strain);
  const avg = (strains.reduce((a, b) => a + b) / strains.length).toFixed(1);
  const trend = strains[0] > strains[6] ? 'increasing' : 'decreasing';
  const highStrainDays = strains.filter(s => s >= 8).length;
  
  return {
    latest: strains[0],
    avg,
    trend,
    highStrainDays,
    history: strains,
    status: strains[0] >= 8 ? 'high' : strains[0] >= 5 ? 'moderate' : 'low'
  };
}

function analyzeSleep(history) {
  const sleepHours = history.map(h => (h.sleep_sec / 3600).toFixed(1));
  const avgHours = (sleepHours.reduce((a, b) => parseFloat(a) + parseFloat(b)) / sleepHours.length).toFixed(1);
  const consistency = (sleepHours.filter(h => h >= 8 && h <= 9).length / sleepHours.length * 100).toFixed(0);
  const quality = sleepHours.every(h => parseFloat(h) >= 7) ? 'excellent' : sleepHours.filter(h => parseFloat(h) >= 7).length >= 5 ? 'good' : 'needs improvement';
  
  return {
    latest: sleepHours[0],
    avg: avgHours,
    consistency: `${consistency}%`,
    quality,
    history: sleepHours,
    shortNights: sleepHours.filter(h => parseFloat(h) < 7).length,
    bestNight: Math.max(...sleepHours.map(h => parseFloat(h)))
  };
}

function analyzeWorkouts(data) {
  const workouts = data.workouts;
  const last7 = workouts.slice(0, 7);
  const last14 = workouts.slice(0, 14);
  
  const volume7 = last7.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);
  const volume14 = last14.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);
  const avgVolume = (volume7 / last7.length).toFixed(0);
  
  // Muscle groups last 14 days
  const muscleGroups = {};
  last14.forEach(w => {
    w.exercises?.forEach(ex => {
      const group = ex.muscleGroup || 'Unknown';
      if (!muscleGroups[group]) muscleGroups[group] = { sets: 0, volume: 0 };
      muscleGroups[group].sets += ex.sets?.length || 0;
      muscleGroups[group].volume += ex.sets?.reduce((sum, s) => sum + (s.reps * s.weightKg), 0) || 0;
    });
  });
  
  // Frequency
  const workoutFreq = last7.length;
  const avgFreqPerWeek = (workoutFreq / (last7.length > 0 ? 1 : 1)).toFixed(1);
  
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
    .map(([name, _]) => name);
  
  // Imbalances
  const totalSets = Object.values(muscleGroups).reduce((sum, m) => sum + m.sets, 0);
  const imbalances = Object.entries(muscleGroups)
    .map(([group, data]) => ({
      group,
      sets: data.sets,
      pct: (data.sets / totalSets * 100).toFixed(0)
    }))
    .sort((a, b) => b.sets - a.sets);
  
  return {
    volume7,
    volume14,
    avgVolume,
    frequency: workoutFreq,
    muscleGroups: imbalances,
    plateaus,
    totalWorkouts: workouts.length
  };
}

// Generate comprehensive brief
const recovery = analyzeRecovery(whoopHistory);
const strain = analyzeStrain(whoopHistory);
const sleep = analyzeSleep(whoopHistory);
const workouts = analyzeWorkouts(strength);

let brief = '💪 **COMPREHENSIVE DAILY HEALTH BRIEF** — ' + new Date().toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) + '\n\n';

// RECOVERY SECTION
brief += '**━━ RECOVERY ANALYSIS ━━**\n\n';
brief += `**Current Score:** ${recovery.latest}% (${recovery.status.toUpperCase()})\n`;
brief += `**7-Day Avg:** ${recovery.avg}%\n`;
brief += `**Trend:** ${recovery.trend} over past week\n`;
brief += `**HRV (Heart Rate Variability):** ${recovery.hvLatest}ms (7-day avg: ${recovery.hvAvg}ms)\n\n`;
brief += `**7-Day History:** ${recovery.history.join(' → ')}\n\n`;
brief += '**Interpretation:**\n';
if (recovery.latest >= 75) {
  brief += '• 🟢 Excellent readiness. Your nervous system is well-recovered.\n';
  brief += '• Body is ready for high-intensity work or volume push.\n';
  brief += '• Consider a challenging session or max-effort lift today.\n';
} else if (recovery.latest >= 60) {
  brief += '• 🟡 Moderate readiness. You\'re recovered enough for normal training.\n';
  brief += '• Stick to planned workouts; avoid experimental intensity.\n';
  brief += '• If HRV is low, prioritize sleep tonight.\n';
} else {
  brief += '• 🔴 Low readiness. Your body needs recovery.\n';
  brief += '• Consider: active recovery, light session, or rest day.\n';
  brief += '• Prioritize sleep and stress reduction.\n';
}

brief += `\n**HRV Context:** ${recovery.hvLatest}ms is ${recovery.hvLatest > 45 ? 'healthy' : 'below your baseline'}. If trending down, increase sleep & reduce stress.\n\n`;

// STRAIN SECTION
brief += '**━━ STRAIN & WORKLOAD ━━**\n\n';
brief += `**Latest Strain Score:** ${strain.latest}/10 (${strain.status.toUpperCase()})\n`;
brief += `**7-Day Avg:** ${strain.avg}/10\n`;
brief += `**Trend:** ${strain.trend} over past week\n`;
brief += `**High-Strain Days (≥8):** ${strain.highStrainDays} of last 7\n\n`;
brief += `**7-Day History:** ${strain.history.map(s => s.toFixed(1)).join(' → ')}\n\n`;
brief += '**Interpretation:**\n';
if (strain.latest >= 8) {
  brief += '• 🔥 HIGH strain. You worked hard yesterday.\n';
  brief += '• Today: Easy session, mobility, or full rest.\n';
  brief += '• Ensure calories and protein for recovery.\n';
} else if (strain.latest >= 5) {
  brief += '• 🟡 MODERATE strain. Balanced effort.\n';
  brief += '• You can train today, but avoid back-to-back high-strain days.\n';
  brief += '• Monitor: if you\'ve had 3+ high-strain days, take easier today.\n';
} else {
  brief += '• 🟢 LOW strain. You\'re under-stimulated.\n';
  brief += '• Good day to push intensity or add volume.\n';
  brief += '• Aim for 5-8 strain for optimal adaptation.\n';
}

brief += `\nHigh-strain pattern: ${strain.highStrainDays >= 4 ? 'You\'ve been pushing hard; build in recovery days.' : 'Good distribution of effort and recovery.'}\n\n`;

// SLEEP SECTION
brief += '**━━ SLEEP QUALITY & DURATION ━━**\n\n';
brief += `**Last Night:** ${sleep.latest}h\n`;
brief += `**7-Day Avg:** ${sleep.avg}h\n`;
brief += `**Consistency:** ${sleep.consistency} nights 8-9h (optimal range)\n`;
brief += `**Quality Rating:** ${sleep.quality.toUpperCase()}\n`;
brief += `**Best Night (7d):** ${sleep.bestNight}h\n\n`;
brief += `**Sleep History:** ${sleep.history.join('h → ')}h\n\n`;
brief += '**Interpretation:**\n';
if (parseFloat(sleep.latest) < 7) {
  brief += `• 🔴 SHORT: Only ${sleep.latest}h. This impacts recovery & cognition.\n`;
  brief += '• Tonight: Prioritize sleep. Aim for 8-9h minimum.\n';
  brief += '• Action: Earlier bedtime, darker room, no screens 30min before bed.\n';
} else if (parseFloat(sleep.latest) >= 8 && parseFloat(sleep.latest) <= 9) {
  brief += '• 🟢 OPTIMAL: Perfect night. You\'re well-rested.\n';
} else {
  brief += `• 🟡 LONG: ${sleep.latest}h. Quality may matter more than quantity.\n`;
}

brief += `\nConsistency: ${sleep.consistency}% nights in 8-9h range. ${sleep.consistency >= 70 ? 'Excellent routine.' : 'Try to stabilize sleep schedule.'}\n`;
brief += `Short nights (<7h): ${sleep.shortNights} of last 7. ${sleep.shortNights >= 2 ? 'Focus on sleep this week.' : 'Sleep is solid.'}\n\n`;

// WORKOUT SECTION
brief += '**━━ STRENGTH TRAINING ANALYSIS ━━**\n\n';
brief += `**Total Career Workouts:** ${workouts.totalWorkouts}\n`;
brief += `**Last 7 Days:** ${workouts.frequency} sessions\n`;
brief += `**Volume (7 days):** ${workouts.volume7.toFixed(0)}kg total\n`;
brief += `**Avg per Session:** ${workouts.avgVolume}kg\n`;
brief += `**Volume (14 days):** ${workouts.volume14.toFixed(0)}kg\n\n`;

brief += '**Muscle Group Distribution (Last 14 Days):**\n';
workouts.muscleGroups.forEach((m, i) => {
  const barLength = Math.round(parseInt(m.pct) / 5);
  const bar = '█'.repeat(barLength);
  brief += `• ${m.group}: ${m.sets} sets (${m.pct}%) ${bar}\n`;
});

brief += `\n**Imbalance Assessment:**\n`;
const topMuscle = workouts.muscleGroups[0];
const secondMuscle = workouts.muscleGroups[1];
if (topMuscle.pct >= 35) {
  brief += `⚠️ **${topMuscle.group}** is overloaded at ${topMuscle.pct}% of volume.\n`;
  brief += `• ${secondMuscle.group} is only ${secondMuscle.pct}%.\n`;
  brief += '• **Action:** Reduce chest/add back days to rebalance.\n\n';
} else {
  brief += '✅ Muscle distribution is balanced.\n\n';
}

brief += '**Strength Plateaus (Exercises Stuck 4+ Sessions):**\n';
if (workouts.plateaus.length === 0) {
  brief += '✅ No plateaus detected. You\'re progressing.\n\n';
} else {
  workouts.plateaus.forEach(ex => {
    brief += `• ${ex}: Consider weight jump, reps, or rep range variation.\n`;
  });
  brief += '\n';
}

// RECOMMENDATIONS SECTION
brief += '**━━ RECOMMENDATIONS FOR NEXT 2 WEEKS ━━**\n\n';
brief += '**RECOVERY FOCUS:**\n';
if (recovery.latest < 60) {
  brief += '1️⃣ Prioritize sleep: Aim for 8-9h every night (${sleep.avg}h avg is below optimal)\n';
  brief += '2️⃣ Reduce stress: Take breaks, walk, meditate 10min daily\n';
  brief += '3️⃣ Nutrition: Extra carbs + protein post-workout\n';
} else if (recovery.hvLatest < 45) {
  brief += '1️⃣ HRV is low: Sleep 8-9h consistently this week\n';
  brief += '2️⃣ Reduce training frequency: Consider 1 less session this week\n';
  brief += '3️⃣ Cold plunge or sauna 2-3x for parasympathetic activation\n';
} else {
  brief += '1️⃣ Recovery is good. Maintain current sleep routine.\n';
  brief += '2️⃣ Monitor: Keep HRV > 45ms (aim for 50+).\n';
  brief += '3️⃣ Focus on consistency: Same bedtime every night.\n';
}

brief += '\n**STRAIN MANAGEMENT:**\n';
if (strain.latest >= 8) {
  brief += `1️⃣ Take 1-2 easier days this week to recover from high strain.\n`;
  brief += '2️⃣ Light sessions: 30min mobility, core work, cardio.\n';
  brief += '3️⃣ Hydrate heavily: 3.5-4L water daily.\n';
} else {
  brief += `1️⃣ Maintain balance: ${strain.avg}/10 avg is healthy.\n`;
  brief += '2️⃣ Vary intensity: Alternate hard & moderate days.\n';
  brief += '3️⃣ Peak strain should be 1x per week for max adaptation.\n';
}

brief += '\n**SLEEP IMPROVEMENT:**\n';
if (parseFloat(sleep.latest) < 7) {
  brief += `1️⃣ Last night (${sleep.latest}h) was short. Reset tonight:\n`;
  brief += '   • Bed 30min earlier than usual\n';
  brief += '   • Dark room, 65-68°F, white noise\n';
  brief += '   • No screens 1h before sleep\n';
  brief += '2️⃣ Target: 8-9h every night for 7 days\n';
  brief += `3️⃣ Once stable, consistency matters more than duration\n`;
} else {
  brief += `1️⃣ Sleep is ${sleep.latest}h (${sleep.quality}). Maintain this.\n`;
  brief += '2️⃣ Keep consistency: Same bedtime/wake ±30min.\n';
  brief += `3️⃣ Monitor HRV: If it drops, add +30min sleep.\n`;
}

brief += '\n**TRAINING PRIORITY:**\n';
brief += '1️⃣ **Rebalance Chest/Back:** Chest is ${topMuscle.pct}%, back is ${secondMuscle.pct}%\n';
brief += '   • Add: Bent rows, pull-ups, T-bar rows (3x/week back focus)\n';
brief += '   • Reduce: Bench press to 1-2x/week\n';
brief += `2️⃣ **Break Plateaus:** ${workouts.plateaus.length > 0 ? workouts.plateaus.slice(0, 2).join(', ') : 'N/A'}\n`;
brief += '   • Try: Drop sets, tempo work (3sec down), or weight jump +5kg\n';
brief += '3️⃣ **Progressive Overload:** Target +2-3kg or +1-2 reps per week\n';

brief += '\n**━━ DAILY CHECKLIST TODAY ━━**\n\n';
brief += `□ Sleep Target: ${parseFloat(sleep.latest) < 8 ? '9h' : '8-9h'}\n`;
brief += `□ Hydration: 3-4L water (${strain.latest >= 7 ? 'higher due to strain' : 'normal'})\n`;
brief += `□ Recovery Session Type: ${recovery.latest >= 75 ? 'Intense/volume day' : recovery.latest >= 60 ? 'Normal session' : 'Light/mobility'}\n`;
brief += '□ Protein Target: 150-180g (0.8-1g per lb)\n';
brief += '□ Log Workout: Record to StrengthInsight for tomorrow\'s brief\n';
brief += '□ Mobility: 10min before workout, 5min after\n\n';

brief += '---\n*Brief generated from WHOOP (7-day) + StrengthInsight (46 workouts) data.*\n';

console.log(brief);
