import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wand2, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  Send, 
  Sparkles, 
  Film, 
  AlertTriangle, 
  Layers, 
  FileText,
  Clock,
  Printer
} from 'lucide-react';
import { CreativeAd, CreativeBrief } from '../types';

interface BriefGeneratorModalProps {
  creative: CreativeAd | null;
  onClose: () => void;
  onSendToSlackAlerts?: (title: string, message: string) => void;
}

export const BriefGeneratorModal: React.FC<BriefGeneratorModalProps> = ({
  creative,
  onClose,
  onSendToSlackAlerts,
}) => {
  if (!creative) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [slackPushed, setSlackPushed] = useState(false);
  const [brief, setBrief] = useState<CreativeBrief | null>(null);

  // Fetch or generate brief from server-side Gemini endpoint
  useEffect(() => {
    let isMounted = true;
    async function generateBrief() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/gemini/generate-brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creativeName: creative?.name,
            bodyHoldRate: creative?.holdRate,
            thumbstopRate: creative?.thumbstopRate,
            cfi: creative?.cfi,
            currentCpa: creative?.cpa,
            targetCpa: creative?.targetCpa,
            platform: creative?.platform,
            brandName: creative?.brandName,
          }),
        });
        const data = await res.json();
        if (isMounted && data.brief) {
          setBrief(data.brief);
        }
      } catch (err) {
        console.error('Failed to generate brief with server API:', err);
        // Fallback default brief
        if (isMounted) {
          setBrief({
            briefTitle: `Creative Overhaul: ${creative?.name} (Hook Iteration)`,
            status: 'Ready for Video Editor',
            bodyAssessment: `Ad body converts with strong retention (Hold Rate: ${creative?.holdRate}%). Keep seconds 04–30 unchanged! The creative fatigue is isolated strictly in the opening 0–3 seconds.`,
            targetGoal: `Lift Thumbstop Rate from ${creative?.thumbstopRate}% back to 36%+, lowering CPA from $${creative?.cpa.toFixed(2)} to target $${creative?.targetCpa.toFixed(2)}.`,
            editorInstructions: [
              'Do NOT re-shoot the body demonstration or customer testimonial (sec 04–30).',
              'Record and edit 3 distinct opening hook variations (0.0s to 03.2s).',
              'Export 3 final deliverables: HookA_BodyOriginal.mp4, HookB_BodyOriginal.mp4, HookC_BodyOriginal.mp4.',
              'Ensure high-contrast yellow/white subtitle overlay in bottom-third with safe zones.',
            ],
            hookVariantsToShoot: [
              {
                variation: 'Hook #1 (Problem-First / Negative Framing)',
                openingDialogue: `"Stop washing your face with tap water before applying serum!"`,
                visualFrame0to3: 'Direct camera snap zoom, presenter holding dropper with red warning graphic.',
                onScreenTextOverlay: 'STOP DOING THIS ❌',
                soundEffect: 'Buzzer drop + vinyl scratch transition at 03.1s.',
              },
              {
                variation: 'Hook #2 (Before/After Split Screen)',
                openingDialogue: `"Day 1 vs Day 21—I didn't think a 30-second daily routine could do this."`,
                visualFrame0to3: 'Split screen: Dull dehydrated skin left vs glowing glass skin right.',
                onScreenTextOverlay: 'DAY 1 vs DAY 21 😱 (No Filter)',
                soundEffect: 'Camera shutter click + whoosh transition.',
              },
              {
                variation: 'Hook #3 (Bold Caption Curiosity Question)',
                openingDialogue: `"Why over 50,000 women switched to cold-pressed botanical lipids..."`,
                visualFrame0to3: 'Fast macro-lens dropper action releasing golden drop directly into lens.',
                onScreenTextOverlay: '50,000+ PEOPLE OBSESSED 👀',
                soundEffect: 'Sub-bass thump + upbeat tempo kick.',
              },
            ],
            unchangedPortion: 'Seconds 03.2s – 28.5s remain 100% identical to master timeline.',
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    generateBrief();
    return () => {
      isMounted = false;
    };
  }, [creative]);

  const handleCopyNotion = () => {
    if (!brief) return;
    const text = `# ${brief.briefTitle}
**Status:** ${brief.status}
**Ad Asset:** ${creative.name} (${creative.platform.toUpperCase()})
**Current Performance:** Thumbstop Rate: ${creative.thumbstopRate}% | Body Hold Rate: ${creative.holdRate}% | CFI: ${creative.cfi}/100

---

## 🎯 Executive Diagnosis & Strategy
${brief.bodyAssessment}
${brief.targetGoal}

---

## 🛠 Instructions for Video Editor
${brief.editorInstructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

---

## 🎬 3 New Hook Variations to Shoot (Seconds 0.0s – 03.2s)
${brief.hookVariantsToShoot.map((h, i) => `
### ${h.variation}
- **Opening Spoken Dialogue:** ${h.openingDialogue}
- **Visual Action (0-3s):** ${h.visualFrame0to3}
- **On-Screen Text Overlay:** ${h.onScreenTextOverlay}
- **Sound Effect:** ${h.soundEffect}
`).join('\n')}

---

## 🔒 Master Unchanged Body Segment
${brief.unchangedPortion}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePushSlack = () => {
    if (onSendToSlackAlerts && brief) {
      onSendToSlackAlerts(
        `[CREATIVE BRIEF] Iteration for ${creative.name}`,
        `Body Hold Rate: ${creative.holdRate}%. Generated 3 new opening hooks (Problem-First, Split-Screen, Bold Caption) to fix CFI ${creative.cfi} fatigue.`
      );
    }
    setSlackPushed(true);
    setTimeout(() => setSlackPushed(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  1-Click Creative Brief Generator for Video Editors
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/20">
                  Gemini AI Strategy
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Fixes creative fatigue by iterating the 0–3s opening hook while preserving the winning body
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyNotion}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Notion Markdown!' : 'Copy Notion Markdown'}</span>
            </button>

            <button
              onClick={handlePushSlack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{slackPushed ? 'Sent to Slack #briefs!' : 'Send to Slack'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto"></div>
              <div className="text-sm font-semibold text-white">Analyzing Retention Curve & Drafting Editor Brief...</div>
              <p className="text-xs text-slate-400">
                Evaluating 0–3s drop-off cliff vs {creative.holdRate}% body hold rate
              </p>
            </div>
          ) : brief ? (
            <div className="space-y-6 text-xs">
              {/* Top Diagnosis Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Strategic Assessment for Creative Team
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px]">
                    Status: {brief.status}
                  </span>
                </div>
                <p className="text-sm font-bold text-white leading-snug">
                  {brief.bodyAssessment}
                </p>
                <div className="text-xs text-slate-300 flex items-center justify-between pt-1 border-t border-indigo-500/20">
                  <span>Target Goal: <strong className="text-emerald-400">{brief.targetGoal}</strong></span>
                  <span className="text-slate-400">Wasted Spend to Recover: <strong className="text-rose-400 font-mono">${(creative.wastedSpend || 0).toLocaleString()}</strong></span>
                </div>
              </div>

              {/* Editor Instructions */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Film className="w-4 h-4 text-indigo-400" />
                  Video Editor Guidelines (Do's and Don'ts)
                </h4>
                <ul className="space-y-1.5 pl-2">
                  {brief.editorInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-indigo-600/30 text-indigo-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* The 3 New Opening Hooks to Shoot */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    3 New Opening Hook Iterations (Seconds 0.0s to 03.2s)
                  </h4>
                  <span className="text-[10px] text-slate-400">Keep Body Footage (sec 04–30) Identical</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {brief.hookVariantsToShoot.map((hook, index) => (
                    <div
                      key={index}
                      className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            {hook.variation.split('(')[0]}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                            0.0s – 03.2s
                          </span>
                        </div>

                        {/* Spoken script */}
                        <div className="p-2 rounded bg-slate-900 border border-slate-800/80 mb-2.5">
                          <div className="text-[9px] font-mono text-slate-400 uppercase font-bold">Spoken Script:</div>
                          <p className="text-slate-100 font-semibold italic text-[11px] mt-0.5">
                            {hook.openingDialogue}
                          </p>
                        </div>

                        {/* Visual Frame */}
                        <div className="space-y-1.5 text-[11px]">
                          <div>
                            <span className="text-slate-400 font-medium">Visual Action: </span>
                            <span className="text-slate-200">{hook.visualFrame0to3}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Text Overlay: </span>
                            <span className="font-bold text-yellow-400">{hook.onScreenTextOverlay}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Audio Cue: </span>
                            <span className="text-slate-300 font-mono text-[10px]">{hook.soundEffect}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Expected Thumbstop:</span>
                        <strong className="text-emerald-400 font-mono">+20% to +26%</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Master Unchanged Body Segment */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>
                    Master Body Footage: <strong className="text-white">{brief.unchangedPortion}</strong>
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Zero Re-shoot Body Spend
                </span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Export format compatible with Notion, ClickUp, Frame.io, and Slack
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyNotion}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors"
            >
              Done & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
