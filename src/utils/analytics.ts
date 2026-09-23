import { CreativeAd, CreativeHealthStatus } from '../types';

/**
 * 1. Thumbstop Rate (Hook Efficiency)
 * Measures the ability of the opening visual/audio to stop user scrolling:
 * Thumbstop Rate (%) = (3-Second Continuous Video Views / Total Impressions) * 100
 * Benchmarks: <25% Poor | 25%-35% Average | >35% Top Tier
 */
export function calculateThumbstopRate(views3s: number, impressions: number): number {
  if (!impressions || impressions <= 0) return 0;
  return Number(((views3s / impressions) * 100).toFixed(1));
}

export function getThumbstopBenchmark(rate: number): {
  label: 'Poor' | 'Average' | 'Top Tier';
  color: string;
  badgeBg: string;
} {
  if (rate >= 35) {
    return { label: 'Top Tier', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  }
  if (rate >= 25) {
    return { label: 'Average', color: 'text-amber-400', badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
  }
  return { label: 'Poor', color: 'text-rose-400', badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
}

/**
 * 2. Hold Rate (Body Quality)
 * Measures if the script and body hold attention once hooked:
 * Hold Rate (%) = (100% or 15s Video Views / 3-Second Video Views) * 100
 */
export function calculateHoldRate(views100p: number, views3s: number): number {
  if (!views3s || views3s <= 0) return 0;
  return Number(((views100p / views3s) * 100).toFixed(1));
}

/**
 * 3. Composite Creative Fatigue Index (CFI)
 * Normalized score from 0 to 100 computed daily for every active creative:
 * CFI = w1 * (ΔCPA_7d / CPA_30d) + w2 * (ΔThumbstop_7d / Thumbstop_30d) + w3 * (Frequency_7d / τ_freq)
 * Where w1 = 0.45 (CPA weight), w2 = 0.35 (Hook drop weight), w3 = 0.20 (Audience saturation weight)
 * τ_freq = 2.2 target saturation threshold
 * Action Trigger: When CFI >= 75, trigger Fatigue Alert.
 */
export function calculateCFI(
  cpa7d: number,
  cpaAvg30d: number,
  thumbstop7d: number,
  thumbstopAvg30d: number,
  frequency7d: number
): number {
  const w1 = 0.45;
  const w2 = 0.35;
  const w3 = 0.20;
  const tauFreq = 2.2;

  // Relative increase in CPA (higher is worse)
  // If CPA increased from 30 to 45, delta is +15, relative is +0.50
  const cpaChangeRatio = cpaAvg30d > 0 ? Math.max(0, (cpa7d - cpaAvg30d) / cpaAvg30d) : 0;

  // Relative drop in Thumbstop Rate (higher drop is worse)
  // If thumbstop dropped from 35% to 21%, delta drop is 14%, ratio is 0.40
  const thumbstopDropRatio = thumbstopAvg30d > 0 ? Math.max(0, (thumbstopAvg30d - thumbstop7d) / thumbstopAvg30d) : 0;

  // Audience saturation ratio relative to threshold 2.2
  const frequencyRatio = frequency7d > 0 ? Math.min(2.5, frequency7d / tauFreq) : 1;

  // Baseline normalized score to 0-100:
  // Normalize factors so that standard deteriorating metrics yield 50-90
  const rawScore = (w1 * cpaChangeRatio * 1.8 + w2 * thumbstopDropRatio * 2.2 + w3 * (frequencyRatio - 0.7) * 1.5) * 100;
  
  // Clamped strictly between 0 and 100
  return Math.min(100, Math.max(0, Math.round(rawScore)));
}

/**
 * Creative Health Status:
 * 🟢 Scaling: High hook retention, stable or decreasing CPA, low frequency
 * 🟡 Fatigue Warning: Frequency rising above 2.2, thumbstop rate dropping >15%, CPA trending upward (or CFI 50-74)
 * 🔴 Fatigued: Marginal CPA exceeding target by >35%, or CFI >= 75
 */
export function getCreativeHealthStatus(
  cfi: number,
  cpa: number,
  targetCpa: number,
  thumbstopRate: number,
  frequency: number
): CreativeHealthStatus {
  if (cfi >= 75 || (targetCpa > 0 && cpa > targetCpa * 1.35)) {
    return 'fatigued';
  }
  if (cfi >= 50 || frequency >= 2.2 || thumbstopRate < 25) {
    return 'warning';
  }
  return 'scaling';
}

export interface DailyCfiTrendPoint {
  day: number;
  dateLabel: string;
  formattedDate: string;
  cfi: number;
  thumbstopRate: number;
  cpa: number;
  frequency: number;
  status: CreativeHealthStatus;
  isWarningCrossed?: boolean;
  isFatiguedCrossed?: boolean;
}

/**
 * Generates or expands 30 daily data points for the Fatigue Index (CFI) trend
 * reflecting real-world ad decay dynamics, frequency saturation, and CPA creep.
 */
export function generate30DayCfiTrend(creative: CreativeAd): DailyCfiTrendPoint[] {
  const points: DailyCfiTrendPoint[] = [];
  const totalDays = 30;

  // Key terminal values from the creative
  const targetCfi = creative.cfi;
  const targetThumbstop = creative.thumbstopRate;
  const targetCpa = creative.cpa;
  const targetFreq = creative.frequency_7d || 2.4;

  // Baseline start values (30 days ago) based on creative health status
  let startCfi = 16;
  let startThumbstop = Math.min(52, targetThumbstop * 1.85);
  let startCpa = Math.max(18, targetCpa * 0.62);
  let startFreq = 1.08;

  if (creative.healthStatus === 'scaling') {
    startCfi = Math.max(12, targetCfi - 6);
    startThumbstop = targetThumbstop + 2.5;
    startCpa = targetCpa * 0.95;
    startFreq = 1.05;
  } else if (creative.healthStatus === 'warning') {
    startCfi = 22;
    startThumbstop = targetThumbstop * 1.4;
    startCpa = targetCpa * 0.75;
    startFreq = 1.12;
  }

  let warningRecorded = false;
  let fatiguedRecorded = false;

  for (let i = 1; i <= totalDays; i++) {
    // Non-linear sigmoid/decay curve simulation:
    // Most creatives stay healthy for days 1-12, begin decaying days 13-22, and rapidly deteriorate days 23-30
    const progress = (i - 1) / (totalDays - 1);
    
    // S-curve weighting for decay acceleration
    const sCurve = Math.pow(progress, creative.healthStatus === 'fatigued' ? 1.7 : 1.2);
    
    // Add realistic daily noise (-1.5 to +1.5 pts)
    const seedNoise = Math.sin(i * 1.7) * 1.2;

    const rawCfi = Math.round(startCfi + (targetCfi - startCfi) * sCurve + seedNoise);
    const cfi = Math.max(5, Math.min(100, i === totalDays ? targetCfi : rawCfi));

    const rawThumbstop = Number((startThumbstop - (startThumbstop - targetThumbstop) * sCurve + Math.cos(i * 1.4) * 0.4).toFixed(1));
    const thumbstopRate = Math.max(10, i === totalDays ? targetThumbstop : rawThumbstop);

    const rawCpa = Number((startCpa + (targetCpa - startCpa) * sCurve + Math.sin(i * 2.1) * 0.6).toFixed(2));
    const cpa = Math.max(12, i === totalDays ? targetCpa : rawCpa);

    const rawFreq = Number((startFreq + (targetFreq - startFreq) * sCurve).toFixed(2));
    const frequency = Math.max(1.0, i === totalDays ? targetFreq : rawFreq);

    const status: CreativeHealthStatus = cfi >= 75 ? 'fatigued' : cfi >= 50 ? 'warning' : 'scaling';

    let isWarningCrossed = false;
    let isFatiguedCrossed = false;

    if (cfi >= 50 && !warningRecorded) {
      isWarningCrossed = true;
      warningRecorded = true;
    }

    if (cfi >= 75 && !fatiguedRecorded) {
      isFatiguedCrossed = true;
      fatiguedRecorded = true;
    }

    // Relative date label: e.g. "Day -29" to "Today"
    const daysAgo = totalDays - i;
    const dateLabel = daysAgo === 0 ? 'Today' : `-${daysAgo}d`;
    const formattedDate = daysAgo === 0 ? 'Today (Day 30)' : `Day ${i} (-${daysAgo} days)`;

    points.push({
      day: i,
      dateLabel,
      formattedDate,
      cfi,
      thumbstopRate,
      cpa,
      frequency,
      status,
      isWarningCrossed,
      isFatiguedCrossed,
    });
  }

  return points;
}

/**
 * Calculates estimated wasted creative ad spend
 * That is the portion of spend after creative crossed fatigue warning/fatigued state
 */
export function calculateWastedSpend(ad: CreativeAd): number {
  if (ad.healthStatus === 'fatigued') {
    // 30% - 45% of total spend was burned past fatigue
    const ratio = Math.min(0.55, 0.25 + (ad.cfi - 75) * 0.012);
    return Math.round(ad.spend * ratio);
  }
  if (ad.healthStatus === 'warning') {
    return Math.round(ad.spend * 0.12);
  }
  return 0;
}

