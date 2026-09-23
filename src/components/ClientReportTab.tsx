import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  TrendingDown, 
  ShieldAlert, 
  AlertTriangle,
  Wand2,
  ExternalLink
} from 'lucide-react';
import { CreativeAd, AdAccount } from '../types';

interface ClientReportTabProps {
  account: AdAccount;
  creatives: CreativeAd[];
  onOpenBriefGenerator: (creative: CreativeAd) => void;
}

export const ClientReportTab: React.FC<ClientReportTabProps> = ({
  account,
  creatives,
  onOpenBriefGenerator,
}) => {
  const [agencyName, setAgencyName] = useState('Apex Digital Performance Agency');
  const [reportTitle, setReportTitle] = useState('Weekly Creative Fatigue & Hook Strategy Teardown');
  const [copiedLink, setCopiedLink] = useState(false);

  const totalSpend = creatives.reduce((acc, c) => acc + c.spend, 0);
  const totalWastedSpend = creatives.reduce((acc, c) => acc + (c.wastedSpend || 0), 0);
  const wastedPercentage = totalSpend > 0 ? ((totalWastedSpend / totalSpend) * 100).toFixed(1) : '0';

  const fatiguedCreatives = creatives.filter((c) => c.healthStatus === 'fatigued');
  const scalingCreatives = creatives.filter((c) => c.healthStatus === 'scaling');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
            Client-Facing White-Label Deliverable
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Weekly Creative Intelligence & Fatigue Teardown
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cuts agency creative reporting time from 8 hours to 15 minutes with automated hook analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Live Client Link'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export / Print PDF</span>
          </button>
        </div>
      </div>

      {/* The White-Label Paper Canvas */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 print:p-0 print:border-none print:bg-white print:text-black">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-6 print:border-slate-300">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 print:text-indigo-700 mb-1">
              <span>{agencyName}</span>
              <span>•</span>
              <span className="text-slate-400 print:text-slate-600">Client: {account.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white print:text-black tracking-tight">
              {reportTitle}
            </h1>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
              Reporting Window: Rolling 30 Days • Platform Sync: Meta Ads + TikTok Ads + Shopify
            </p>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 print:text-indigo-800 text-xs font-mono font-bold">
              <Flame className="w-3.5 h-3.5 text-indigo-400" />
              HookMetrics Intelligence
            </div>
            <div className="text-[11px] text-slate-500 print:text-slate-600 mt-1">
              Generated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 print:bg-slate-100 print:border-slate-300">
            <div className="text-[10px] uppercase font-bold text-slate-400 print:text-slate-600">Total Tracked Ad Spend</div>
            <div className="text-2xl font-black text-white print:text-black font-mono mt-1">
              ${totalSpend.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Active across {creatives.length} video variations</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 print:bg-rose-50 print:border-rose-300">
            <div className="text-[10px] uppercase font-bold text-rose-400 print:text-rose-700">Wasted Fatigue Spend</div>
            <div className="text-2xl font-black text-rose-400 print:text-rose-700 font-mono mt-1">
              ${totalWastedSpend.toLocaleString()} ({wastedPercentage}%)
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{fatiguedCreatives.length} ads past fatigue threshold</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 print:bg-emerald-50 print:border-emerald-300">
            <div className="text-[10px] uppercase font-bold text-emerald-400 print:text-emerald-700">Recommended Hook Lift</div>
            <div className="text-2xl font-black text-emerald-400 print:text-emerald-700 font-mono mt-1">
              +$18.4k Net ROAS
            </div>
            <div className="text-[11px] text-slate-400 mt-1">By iterating 0-3s openings only</div>
          </div>
        </div>

        {/* Strategic Analysis & Recommendations */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white print:text-black uppercase tracking-wider">
            Agency Strategic Observations & Action Plan
          </h3>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 print:bg-slate-50 print:border-slate-300">
            <div className="flex items-start gap-2.5 text-xs text-slate-300 print:text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white print:text-black">1. Body Quality is Proven: </strong>
                Average hold rate on seconds 04–30 is currently holding at 29.4%, proving that our core product demonstration, offer mechanics, and customer testimonials convert profitably when viewers stay.
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-300 print:text-slate-700">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white print:text-black">2. Hook Degradation on High-Spend Ads: </strong>
                The top-spending creative ({fatiguedCreatives[0]?.name || 'UGC_HydraSerum_SplitFace_V3'}) experienced a 45% drop in thumbstop efficiency as audience frequency crossed 2.74x.
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-300 print:text-slate-700">
              <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white print:text-black">3. Next Week Creative Sprint: </strong>
                We have drafted 3 new opening hooks (Negative Framing, Before/After Split Screen, and Bold Caption) for video editors. Zero re-shoot of product demonstration footage required.
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Creative Health Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white print:text-black uppercase tracking-wider">
            Creative Portfolio Performance Matrix
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-slate-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 print:bg-slate-200 print:text-slate-700 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Creative Name</th>
                  <th className="py-2.5 px-3">Hook Archetype</th>
                  <th className="py-2.5 px-3 text-right">Thumbstop (0-3s)</th>
                  <th className="py-2.5 px-3 text-right">Hold Rate</th>
                  <th className="py-2.5 px-3 text-right">Frequency</th>
                  <th className="py-2.5 px-3 text-right">CPA</th>
                  <th className="py-2.5 px-3 text-right">Fatigue Index</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 print:divide-slate-200">
                {creatives.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-semibold text-white print:text-black">{c.name}</td>
                    <td className="py-3 px-3 text-slate-300 print:text-slate-700">{c.hookArchetypeName.split('(')[0]}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white print:text-black">{c.thumbstopRate}%</td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400 print:text-emerald-700 font-semibold">{c.holdRate}%</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300 print:text-slate-700">{c.frequency_7d.toFixed(2)}x</td>
                    <td className="py-3 px-3 text-right font-mono text-white print:text-black">${c.cpa.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span className={c.cfi >= 75 ? 'text-rose-400 print:text-rose-700' : c.cfi >= 50 ? 'text-amber-400' : 'text-emerald-400'}>
                        {c.cfi}/100
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onOpenBriefGenerator(c)}
                        className="px-2 py-1 rounded bg-indigo-600/80 hover:bg-indigo-600 text-white text-[10px] font-semibold print:hidden"
                      >
                        Brief
                      </button>
                      <span className="hidden print:inline text-[10px] text-slate-600">
                        {c.healthStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Viral Footer: Generated with HookMetrics */}
        <div className="pt-6 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 print:text-slate-600">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
              HM
            </div>
            <div>
              <span className="font-bold text-white print:text-black">Powered by HookMetrics</span>
              <span className="ml-2 text-[11px] text-slate-500 print:text-slate-600">
                The Video Ad Hook & Creative Fatigue Engine
              </span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-indigo-400 print:text-indigo-800">
            Agency Partner Certified • hookmetrics.io
          </div>
        </div>
      </div>
    </div>
  );
};
