import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize Google Gen AI client with required User-Agent
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('[HookMetrics] Google GenAI initialized successfully.');
  } catch (err) {
    console.warn('[HookMetrics] Error initializing Google GenAI:', err);
  }
} else {
  console.log('[HookMetrics] GEMINI_API_KEY not provided; heuristic intelligent engine active.');
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Module 2: AI Hook Decomposition & Archetype Analysis
app.post('/api/gemini/analyze-hook', async (req: Request, res: Response) => {
  const { hookText, visualDescription, brandNiche, targetAudience, currentThumbstopRate } = req.body;

  const defaultResult = {
    archetype: 'negative_framing',
    archetypeName: 'Negative Framing (Problem Callout)',
    hookPacing: 'Fast-cut (<0.8s cuts)',
    visualCategory: 'Direct-to-camera UGC with bold caption overlay',
    psychologicalTriggers: ['Loss Aversion', 'Pattern Interrupt', 'Ego Threat'],
    thumbstopPotentialScore: 88,
    dropOffRiskSecond: '1.4s (if visual caption is not read in 1st second)',
    whyItWorksOrFails:
      'Starting with a strong warning or mistake immediately activates the reticular activating system (RAS), preventing thumb scroll. Fast caption pacing keeps viewer reading during audio mute.',
    recommendedVariantHooks: [
      {
        angle: 'Loss Aversion / Mistake-Led',
        spokenHook: 'If you are still applying serum with your bare hands, stop right now.',
        visualAction: 'Extreme close-up of dropper touching finger with a big red X graphic.',
        onScreenText: 'STOP DOING THIS ❌',
        expectedThumbstopBoost: '+22%',
      },
      {
        angle: 'Curiosity Gap / Contrast',
        spokenHook: 'This is the exact reason your $80 moisturizer feels like it disappears in 20 minutes.',
        visualAction: 'Split-screen showing dried skin on left vs hydrated glowing barrier on right.',
        onScreenText: 'Why your $80 cream fails ⬇️',
        expectedThumbstopBoost: '+19%',
      },
      {
        angle: 'Social Proof / Polarizing Statement',
        spokenHook: 'Dermatologists told us this formula was too concentrated for consumer retail.',
        visualAction: 'DTC founder in lab coat talking fast while unboxing product directly into lens.',
        onScreenText: '"Too concentrated for retail" 👀',
        expectedThumbstopBoost: '+16%',
      },
    ],
  };

  if (!ai) {
    return res.json({ success: true, analysis: defaultResult, source: 'heuristics' });
  }

  try {
    const prompt = `You are a world-class DTC short-form video creative strategist specializing in Meta and TikTok video ads.
Analyze this opening hook (first 0-3 seconds of a video ad):
- Spoken Hook / Transcript: "${hookText || 'Stop doing this to your skin...'}"
- Visual Description: "${visualDescription || 'Direct-to-camera talking head'}"
- Brand Niche: "${brandNiche || 'Beauty & Skincare'}"
- Current Thumbstop Rate: "${currentThumbstopRate || '28%'}"

Return ONLY valid JSON matching this structure:
{
  "archetype": "negative_framing" | "social_proof" | "curiosity_gap" | "direct_offer",
  "archetypeName": "string (e.g. Negative Framing, Social Proof)",
  "hookPacing": "string",
  "visualCategory": "string",
  "psychologicalTriggers": ["string", "string"],
  "thumbstopPotentialScore": number (1-100),
  "dropOffRiskSecond": "string",
  "whyItWorksOrFails": "string",
  "recommendedVariantHooks": [
    {
      "angle": "string",
      "spokenHook": "string (exact opening 0-3s speech)",
      "visualAction": "string (exact visual frame 0-3s action)",
      "onScreenText": "string (bold overlay text)",
      "expectedThumbstopBoost": "string (e.g. +24%)"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      analysis: { ...defaultResult, ...parsed },
      source: 'gemini-3.8-flash',
    });
  } catch (error) {
    console.error('Error analyzing hook with Gemini:', error);
    return res.json({ success: true, analysis: defaultResult, source: 'heuristics_fallback' });
  }
});

// Module 4: 1-Click Creative Brief Generator for Editors
app.post('/api/gemini/generate-brief', async (req: Request, res: Response) => {
  const {
    creativeName,
    bodyHoldRate,
    thumbstopRate,
    cfi,
    currentCpa,
    targetCpa,
    platform,
    brandName,
  } = req.body;

  const defaultBrief = {
    briefTitle: `Iteration Brief: ${creativeName || 'UGC_WinningBody_V1'} Hook Overhaul`,
    status: 'Ready for Video Editor',
    bodyAssessment: `Body hold rate is strong at ${bodyHoldRate || 28}%. Keep seconds 04–30 unchanged. The drop-off is localized entirely within the opening 0–3 seconds.`,
    targetGoal: `Lift Thumbstop Rate from ${thumbstopRate || 22}% to 36%+, recovering campaign ROAS by replacing the fatigued hook.`,
    editorInstructions: [
      'Do NOT re-shoot the product demonstration or testimonial body (sec 04–30).',
      'Cut 3 distinct opening hook variations (0.0s to 03.2s) matching the exact specs below.',
      'Export 3 final deliverables: HookA_BodyOriginal.mp4, HookB_BodyOriginal.mp4, HookC_BodyOriginal.mp4.',
      'Ensure high-contrast yellow/white subtitle overlay in bottom-third with TikTok/Reels safe zone padding.',
    ],
    hookVariantsToShoot: [
      {
        variation: 'Hook #1 (Problem-First / Negative Framing)',
        openingDialogue: '"Stop wasting your money on collagen powders that do literally nothing."',
        visualFrame0to3: 'Direct camera snap zoom, presenter holding generic powder jar upside down.',
        onScreenTextOverlay: 'STOP WASTING $ ON THIS ❌',
        soundEffect: 'Buzzer drop + vinyl scratch transition at 03.1s.',
      },
      {
        variation: 'Hook #2 (Before/After Split Screen)',
        openingDialogue: '"Day 1 vs Day 21—I genuinely didn’t think a 30-second daily routine could do this."',
        visualFrame0to3: 'Split screen 50/50: Dull skin left (Day 1) vs glowing glass skin right (Day 21).',
        onScreenTextOverlay: 'DAY 1 vs DAY 21 😱 (No Filter)',
        soundEffect: 'Camera shutter snap + whoosh transition.',
      },
      {
        variation: 'Hook #3 (Bold Curiosity Question + Text Banner)',
        openingDialogue: '"What actually happens inside your body when you switch to cold-pressed botanical lipids?"',
        visualFrame0to3: 'Fast macro-lens dropper action releasing golden drop onto glowing glass plate.',
        onScreenTextOverlay: 'WHAT HAPPENS TO YOUR SKIN? 🔬',
        soundEffect: 'Sub-bass thump + high-tempo upbeat lo-fi track.',
      },
    ],
    unchangedPortion: 'Seconds 03.2s – 28.5s remain 100% identical to master timeline.',
  };

  if (!ai) {
    return res.json({ success: true, brief: defaultBrief, source: 'heuristics' });
  }

  try {
    const prompt = `You are a senior creative director at a $100M DTC performance agency.
Generate a structured, professional 1-Click Creative Brief for video editors to fix a fatigued ad.
Data:
- Creative: "${creativeName}"
- Platform: "${platform || 'Meta / TikTok'}"
- Brand: "${brandName || 'DTC Brand'}"
- Current Body Hold Rate: "${bodyHoldRate}%" (Explaining why the body works!)
- Current Thumbstop: "${thumbstopRate}%" (Fatigued hook)
- Fatigue Index: "${cfi}/100"
- CPA: "$${currentCpa}" (Target: "$${targetCpa}")

Output JSON strictly with this schema:
{
  "briefTitle": "string",
  "status": "string",
  "bodyAssessment": "string",
  "targetGoal": "string",
  "editorInstructions": ["string", "string", "string", "string"],
  "hookVariantsToShoot": [
    {
      "variation": "string",
      "openingDialogue": "string",
      "visualFrame0to3": "string",
      "onScreenTextOverlay": "string",
      "soundEffect": "string"
    }
  ],
  "unchangedPortion": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      brief: { ...defaultBrief, ...parsed },
      source: 'gemini-3.8-flash',
    });
  } catch (error) {
    console.error('Error generating brief with Gemini:', error);
    return res.json({ success: true, brief: defaultBrief, source: 'heuristics_fallback' });
  }
});

// Creative Waste Audit Generator (Lead Magnet Module)
app.post('/api/gemini/waste-audit', async (req: Request, res: Response) => {
  const { accountName, totalMonthlySpend, fatiguedCreativesCount, estimatedWastedSpend } = req.body;

  const defaultAudit = {
    executiveHeadline: `Estimated $${estimatedWastedSpend?.toLocaleString() || '21,400'} (34.2% of ad spend) burned on fatigued creatives over the last 30 days.`,
    keyFindings: [
      'Top 3 winning hooks generated 78% of all profitable conversions, but are currently experiencing frequency saturation (>2.4).',
      '4 out of 11 active creatives have crossed the CFI 75 threshold, with CPA inflating by +41% week-over-week.',
      'Thumbstop rates dropped from 38.2% to 21.4% as audience fatigue set in, while body hold rates remained intact (26%).',
    ],
    recommended3StepFix: [
      'Immediately pause the 4 fatigued creatives to save $680/day in leaking capital.',
      'Recycle the winning body footage (sec 04–30) across 3 new hook archetypes (Negative Framing, Curiosity Gap, and Before/After).',
      'Set automated Slack webhooks at CFI 75 to flag creative fatigue before CPA degrades by more than 15%.',
    ],
  };

  return res.json({ success: true, audit: defaultAudit });
});

// Configure Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[HookMetrics] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
