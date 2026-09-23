import React from 'react';
import { 
  DollarSign, 
  Eye, 
  Gauge, 
  TrendingDown, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { CreativeAd, AdAccount } from '../types';
import { getThumbstopBenchmark } from '../utils/analytics';

interface KpiMetricsStripProps {
  creatives: CreativeAd[];
  account: AdAccount;
  onFilterByStatus?: (status: 'all' | 'scaling' | 'warning' | 'fatigued') => void;
}

export const KpiMetricsStrip: React.FC<KpiMetricsStripProps> = ({ creatives, account, onFilterByStatus }) => {
  const totalSpend = creatives.reduce((acc, c) => acc + c.spend, 0);
  const totalWastedSpend = creatives.reduce((acc, c) => acc + (c.wastedSpend || 0), 0);
  const wastedPct = totalSpend > 0 ? ((totalWastedSpend / totalSpend) * 100).toFixed(1) : '0';

  const totalImpressions = creatives.reduce((acc, c) => acc + c.impressions, 0);
  const total3sViews = creatives.reduce((acc, c) => acc + c.views_3s, 0);
  const total100pViews = creatives.reduce((acc, c) => acc + c.views_100p, 0);

  const blendedThumbstop = totalImpressions > 0 ? ((total3sViews / totalImpressions) * 100).toFixed(1) : '0.0';
  const blendedHoldRate = total3sViews > 0 ? ((total100pViews / total3sViews) * 100).toFixed(1) : '0.0';

  const scalingCount = creatives.filter((c) => c.healthStatus === 'scaling').length;
  const warningCount = creatives.filter((c) => c.healthStatus === 'warning').length;
  const fatiguedCount = creatives.filter((c) => c.healthStatus === 'fatigued').length;

  const thumbstopBenchmark = getThumbstopBenchmark(Number(blendedThumbstop));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
      {/* 1. Tracked Spend & Wasted Fatigue Spend */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            Wasted Fatigue Spend
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
            {wastedPct}% Leaking
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-rose-400 tracking-tight font-mono">
            ${totalWastedSpend.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">
            of ${(totalSpend / 1000).toFixed(1)}k total
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>Target Wasted Spend: &lt;5%</span>
          <span className="text-rose-400 font-medium">Over budget</span>
        </div>
      </div>

      {/* 2. Blended Thumbstop Rate (0-3s Efficiency) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative overflow-hidden hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            Thumbstop Rate (0–3s)
          </span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${thumbstopBenchmark.badgeBg}`}>
            {thumbstopBenchmark.label}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white tracking-tight font-mono">
            {blendedThumbstop}%
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-0.5">
            <span className="text-indigo-400">Target: 35%+</span>
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>Benchmark: 25%–35% Avg</span>
          <span className={thumbstopBenchmark.color}>
            {Number(blendedThumbstop) >= 35 ? '+3.4% above avg' : '-2.8% vs Top Tier'}
          </span>
        </div>
      </div>

      {/* 3. Hold Rate (Body Quality sec 04-30) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative overflow-hidden hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            Hold Rate (Body Quality)
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">
            100% / 3s Views
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-400 tracking-tight font-mono">
            {blendedHoldRate}%
          </span>
          <span className="text-xs text-slate-400">completion rate</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>Verdict: Script Body is Sound</span>
          <span className="text-slate-300 font-medium">Iterate Hooks Only</span>
        </div>
      </div>

      {/* 4. Creative Health Triage */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative overflow-hidden hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Creative Health Status
          </span>
          <span className="text-[10px] text-slate-400">{creatives.length} Active Creatives</span>
        </div>
        
        {/* Visual Pill Matrix */}
        <div className="grid grid-cols-3 gap-1.5 my-1">
          <button 
            onClick={() => onFilterByStatus?.('scaling')}
            className="flex flex-col items-center p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 transition-colors"
          >
            <span className="text-sm font-black font-mono">{scalingCount}</span>
            <span className="text-[9px] uppercase font-bold text-emerald-400">Scaling</span>
          </button>
          
          <button 
            onClick={() => onFilterByStatus?.('warning')}
            className="flex flex-col items-center p-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 transition-colors"
          >
            <span className="text-sm font-black font-mono">{warningCount}</span>
            <span className="text-[9px] uppercase font-bold text-amber-400">Warning</span>
          </button>
          
          <button 
            onClick={() => onFilterByStatus?.('fatigued')}
            className="flex flex-col items-center p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition-colors"
          >
            <span className="text-sm font-black font-mono">{fatiguedCount}</span>
            <span className="text-[9px] uppercase font-bold text-rose-400">Fatigued</span>
          </button>
        </div>

        <div className="mt-1 text-[10px] text-slate-400 text-center">
          {fatiguedCount > 0 ? (
            <span className="text-rose-400 font-semibold">{fatiguedCount} ads require hook rotation</span>
          ) : (
            <span className="text-emerald-400 font-medium">All creatives within healthy CFI</span>
          )}
        </div>
      </div>

      {/* 5. Shopify True ROAS Attribution Divergence */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative overflow-hidden hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            Shopify True ROAS Sync
          </span>
          <span className="text-[10px] font-mono px-1 py-0.5 bg-slate-800 text-slate-300 rounded">
            Live Webhook
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white tracking-tight font-mono">
            {account.shopifySynced ? `${account.attributionDivergencePct}%` : 'N/A'}
          </span>
          <span className="text-xs text-amber-400 font-medium">Attribution Gap</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>Platform ROAS inflated</span>
          <span className="text-amber-400 font-semibold">True ROAS: 2.18x</span>
        </div>
      </div>
    </div>
  );
};
