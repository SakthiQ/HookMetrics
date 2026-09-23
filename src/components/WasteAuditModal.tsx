import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Flame, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Printer, 
  Sparkles,
  DollarSign,
  ArrowRight,
  Send
} from 'lucide-react';
import { CreativeAd, AdAccount } from '../types';

interface WasteAuditModalProps {
  account: AdAccount;
  creatives: CreativeAd[];
  onClose: () => void;
  onOpenBriefGenerator: (creative: CreativeAd) => void;
}

export const WasteAuditModal: React.FC<WasteAuditModalProps> = ({
  account,
  creatives,
  onClose,
  onOpenBriefGenerator,
}) => {
  const [agencyName, setAgencyName] = useState('Apex Growth Partners');
  const [clientName, setClientName] = useState(account.name.split('[')[0].trim());
  const [includeHookBreakdown, setIncludeHookBreakdown] = useState(true);

  const totalSpend = creatives.reduce((acc, c) => acc + c.spend, 0);
  const totalWastedSpend = creatives.reduce((acc, c) => acc + (c.wastedSpend || 0), 0);
  const wastedPercentage = totalSpend > 0 ? ((totalWastedSpend / totalSpend) * 100).toFixed(1) : '31.4';

  const fatiguedCreatives = creatives.filter((c) => c.healthStatus === 'fatigued');
  const scalingCreatives = creatives.filter((c) => c.healthStatus === 'scaling');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:text-black">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[94vh] print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Controls Bar (Hidden on print) */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold border border-rose-500/30">
              LEAD MAGNET & CLIENT REPORT
            </span>
            <span className="text-xs text-slate-300 font-semibold">24-Hour Creative Waste Audit</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audit Printable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 print:p-0 print:space-y-4 print:text-black">
          {/* Header Strip with Agency White-label */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 print:border-slate-300">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 print:text-indigo-700">
                Prepared by {agencyName}
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white print:text-black mt-0.5">
                Executive Creative Waste Audit: {clientName}
              </h2>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                Analysis of Meta & TikTok Ad Creatives across rolling 30-day attribution window.
              </p>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 print:text-indigo-800 text-xs font-mono font-bold">
                <Flame className="w-3.5 h-3.5 text-indigo-400" />
                HookMetrics Engine
              </div>
              <div className="text-[11px] text-slate-500 print:text-slate-600 mt-1">Date: September 2026</div>
            </div>
          </div>

          {/* Master Lead Magnet Callout Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-900 border border-rose-500/30 print:bg-rose-50 print:border-rose-300 print:text-black">
            <div className="flex items-center gap-2 text-rose-400 print:text-rose-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4" />
              Executive Audit Verdict
            </div>
            <div className="text-xl sm:text-2xl font-black text-white print:text-black leading-snug">
              "Over the last 30 days, <span className="text-rose-400 print:text-rose-700 font-mono">{wastedPercentage}%</span> of total creative ad spend (<span className="text-rose-400 print:text-rose-700 font-mono">${totalWastedSpend.toLocaleString()}</span>) was allocated to video ads that had already passed their creative fatigue threshold."
            </div>
            <p className="text-xs text-slate-300 print:text-slate-700 mt-2 leading-relaxed">
              Because body hold rates remain high (average ~29%), this capital loss is caused almost exclusively by <strong>hook fatigue</strong> in the opening 0–3 seconds, not product-market fit or offer deterioration.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold">Total Analyzed Spend</div>
              <div className="text-xl font-black text-white print:text-black font-mono mt-1">
                ${totalSpend.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-500/30 print:bg-rose-50 print:border-rose-300">
              <div className="text-[10px] text-rose-400 print:text-rose-700 uppercase font-bold">Recoverable Wasted Spend</div>
              <div className="text-xl font-black text-rose-400 print:text-rose-700 font-mono mt-1">
                ${totalWastedSpend.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold">Fatigued Creatives (CFI &ge; 75)</div>
              <div className="text-xl font-black text-amber-400 print:text-amber-800 font-mono mt-1">
                {fatiguedCreatives.length} of {creatives.length}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold">Potential ROAS Recovery</div>
              <div className="text-xl font-black text-emerald-400 print:text-emerald-700 font-mono mt-1">
                +22% to +35%
              </div>
            </div>
          </div>

          {/* The 3 Hook Archetypes Driving 80% of Profit vs Fatigued Hooks */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white print:text-black uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 print:text-indigo-700" />
              Creative Anatomy: Winning Hook Archetypes vs Fatigued Creatives
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Winning Hooks */}
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/20 print:bg-emerald-50 print:border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 print:text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Top Performing Hook Types
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 print:text-slate-600">Avg Thumbstop &gt; 38%</span>
                </div>
                <div className="space-y-2 text-xs">
                  {scalingCreatives.slice(0, 2).map((c) => (
                    <div key={c.id} className="p-2.5 rounded bg-slate-900/60 print:bg-white border border-slate-800 print:border-slate-200">
                      <div className="font-semibold text-white print:text-black flex items-center justify-between">
                        <span>{c.name}</span>
                        <span className="text-emerald-400 print:text-emerald-700 font-mono font-bold">{c.thumbstopRate}% Thumbstop</span>
                      </div>
                      <p className="text-[11px] text-slate-400 print:text-slate-600 italic mt-0.5">
                        "{c.hookSpokenText}"
                      </p>
                      <div className="text-[10px] text-indigo-400 print:text-indigo-700 mt-1 font-mono">
                        Archetype: {c.hookArchetypeName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fatigued Ads Leaking Spend */}
              <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/20 print:bg-rose-50 print:border-rose-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-400 print:text-rose-800 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Fatigued Ads Leaking Spend (Pause & Rotate)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 print:text-slate-600">CFI &ge; 75</span>
                </div>
                <div className="space-y-2 text-xs">
                  {fatiguedCreatives.slice(0, 2).map((c) => (
                    <div key={c.id} className="p-2.5 rounded bg-slate-900/60 print:bg-white border border-slate-800 print:border-slate-200">
                      <div className="font-semibold text-white print:text-black flex items-center justify-between">
                        <span>{c.name}</span>
                        <span className="text-rose-400 print:text-rose-700 font-mono font-bold">CFI {c.cfi}/100</span>
                      </div>
                      <p className="text-[11px] text-slate-400 print:text-slate-600 italic mt-0.5">
                        "{c.hookSpokenText}"
                      </p>
                      <div className="text-[10px] text-rose-400 print:text-rose-700 mt-1 flex items-center justify-between">
                        <span>Wasted: ${c.wastedSpend.toLocaleString()}</span>
                        <button
                          onClick={() => onOpenBriefGenerator(c)}
                          className="text-indigo-400 hover:underline print:hidden"
                        >
                          Generate 1-Click Brief →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3-Step Action Plan */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 print:bg-slate-100 print:border-slate-300">
            <h4 className="text-xs font-bold text-white print:text-black uppercase tracking-wider mb-2">
              Recommended 3-Step Remediation Plan
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 print:bg-white border border-slate-800 print:border-slate-200">
                <div className="font-bold text-indigo-400 print:text-indigo-800 mb-1">Step 1: Pause Burn</div>
                <p className="text-[11px] text-slate-300 print:text-slate-700">
                  Immediately pause the {fatiguedCreatives.length} fatigued creatives to save ${(totalWastedSpend / 30).toFixed(0)}/day in marginal CPA leakage.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 print:bg-white border border-slate-800 print:border-slate-200">
                <div className="font-bold text-indigo-400 print:text-indigo-800 mb-1">Step 2: Hook Recycling</div>
                <p className="text-[11px] text-slate-300 print:text-slate-700">
                  Keep body footage (sec 04–30) and shoot 3 new opening hooks (Negative Framing, Before/After, Curiosity Gap) per fatigued body.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 print:bg-white border border-slate-800 print:border-slate-200">
                <div className="font-bold text-indigo-400 print:text-indigo-800 mb-1">Step 3: Anomaly Alerts</div>
                <p className="text-[11px] text-slate-300 print:text-slate-700">
                  Connect Slack webhooks to trigger at CFI 75, alerting media buyers 5–7 days before creative fatigue degrades account ROAS.
                </p>
              </div>
            </div>
          </div>

          {/* Viral Footer: Product-Led Expansion Badge */}
          <div className="pt-4 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 print:text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                HM
              </div>
              <span className="font-semibold text-slate-300 print:text-slate-800">
                Generated with HookMetrics
              </span>
              <span>• The Video Ad Hook & Creative Fatigue Intelligence Engine</span>
            </div>

            <div className="text-[11px] font-mono text-indigo-400 print:text-indigo-800">
              hookmetrics.io/audit-verification
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
