export type PlatformType = 'all' | 'meta' | 'tiktok';

export type CreativeHealthStatus = 'scaling' | 'warning' | 'fatigued';

export type HookArchetype =
  | 'negative_framing'
  | 'social_proof'
  | 'curiosity_gap'
  | 'direct_offer';

export type VisualFormat =
  | 'Direct-to-camera UGC'
  | 'Split-screen'
  | 'Product Demo'
  | 'Text Banner Overlay'
  | 'Green Screen Reaction';

export interface FramePoint {
  second: number; // e.g., 0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0
  thumbnailUrl: string;
  visualSummary: string;
  onScreenText: string;
  audioSpoken: string;
  instantDropOffPct: number; // % dropped at this specific half-second
  cumulativeRetention: number; // % remaining viewers
  patternInterrupt?: boolean;
}

export interface RetentionPoint {
  second: number; // 0 to 30
  retentionRate: number; // 100 down to e.g. 24
  industryBenchmark: number;
}

export interface DecayHistoryPoint {
  date: string;
  thumbstopRate: number;
  cpa: number;
  frequency: number;
  cfi: number;
}

export interface CreativeAd {
  id: string;
  name: string;
  adAccountId: string;
  brandName: string;
  platform: 'meta' | 'tiktok';
  format: VisualFormat;
  durationSeconds: number;
  videoUrl?: string;
  thumbnailUrl: string;
  adCopy: string;
  
  // Spend & Primary Delivery Metrics
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpa: number;
  targetCpa: number;
  roas: number;
  shopifyRoas: number; // True ROAS from store webhook
  frequency_7d: number;
  
  // Time-Windowed Delta Metrics for Fatigue Formula
  cpa_7d: number;
  cpa_avg_30d: number;
  thumbstop_7d: number;
  thumbstop_avg_30d: number;
  
  // Milestone Views (Continuous)
  views_3s: number; // 3-second continuous video views
  views_25p: number;
  views_50p: number;
  views_75p: number;
  views_100p: number; // 100% or 15s body completion
  
  // Calculated Proprietary Metrics
  thumbstopRate: number; // (views_3s / impressions) * 100
  holdRate: number; // (views_100p / views_3s) * 100
  cfi: number; // Composite Creative Fatigue Index (0 to 100)
  healthStatus: CreativeHealthStatus;
  wastedSpend: number;
  daysActive: number;

  // Module 2: Hook Decomposition Data
  hookSpokenText: string;
  hookArchetype: HookArchetype;
  hookArchetypeName: string;
  hookVisualCategory: string;
  pacing: string;
  patternInterrupt: boolean;
  frames_0_to_3s: FramePoint[];
  retentionCurve: RetentionPoint[];
  decayHistory: DecayHistoryPoint[];
}

export interface AdAccount {
  id: string;
  name: string;
  brandNiche: string;
  platforms: ('Meta' | 'TikTok')[];
  monthlySpend: number;
  currency: string;
  shopifySynced: boolean;
  attributionDivergencePct: number; // e.g. -14% (Shopify reports less than ad networks)
  creativesCount: number;
}

export interface CreativeBrief {
  briefTitle: string;
  status: string;
  bodyAssessment: string;
  targetGoal: string;
  editorInstructions: string[];
  hookVariantsToShoot: {
    variation: string;
    openingDialogue: string;
    visualFrame0to3: string;
    onScreenTextOverlay: string;
    soundEffect: string;
  }[];
  unchangedPortion: string;
}

export interface SlackAlert {
  id: string;
  creativeId: string;
  creativeName: string;
  brandName: string;
  severity: 'warning' | 'critical';
  title: string;
  message: string;
  cfi: number;
  thumbstopDropPct: number;
  frequency: number;
  timestamp: string;
  paused?: boolean;
}
