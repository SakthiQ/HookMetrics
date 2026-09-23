import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Filter, 
  Flame, 
  HelpCircle, 
  Layers, 
  Play, 
  PlusCircle, 
  RotateCw, 
  Search, 
  ShieldAlert, 
  Sliders, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  Wand2, 
  X 
} from 'lucide-react';
import { CreativeAd, CreativeHealthStatus } from '../types';
import { getThumbstopBenchmark } from '../utils/analytics';

interface FatigueRadarTabProps {
  creatives: CreativeAd[];
  statusFilter: 'all' | 'scaling' | 'warning' | 'fatigued';
  onSetStatusFilter: (status: 'all' | 'scaling' | 'warning' | 'fatigued') => void;
  onOpenVideoLab: (creative: CreativeAd) => void;
  onOpenBriefGenerator: (creative: CreativeAd) => void;
  onTogglePauseAd: (creativeId: string) => void;
}

export const FatigueRadarTab: React.FC<FatigueRadarTabProps> = ({
  creatives,
  statusFilter,
  onSetStatusFilter,
  onOpenVideoLab,
  onOpenBriefGenerator,
  onTogglePauseAd,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'cfi_desc' | 'wasted_desc' | 'spend_desc' | 'thumbstop_desc'>('cfi_desc');

  // Filter creatives
  const filteredCreatives = creatives
    .filter((c) => {
      if (statusFilter !== 'all' && c.healthStatus !== statusFilter) return false;
      if (selectedFormat !== 'all' && c.format !== selectedFormat) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.hookSpokenText.toLowerCase().includes(q) ||
          c.hookArchetypeName.toLowerCase().includes(q) ||
          c.adCopy.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'cfi_desc') return b.cfi - a.cfi;
      if (sortBy === 'wasted_desc') return (b.wastedSpend || 0) - (a.wastedSpend || 0);
      if (sortBy === 'spend_desc') return b.spend - a.spend;
      if (sortBy === 'thumbstop_desc') return b.thumbstopRate - a.thumbstopRate;
      return 0;
    });

  const getStatusBadge = (status: CreativeHealthStatus, cfi: number) => {
    switch (status) {
      case 'scaling':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            🟢 Scaling (CFI: {cfi})
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            🟡 Fatigue Warning (CFI: {cfi})
          </span>
        );
      case 'fatigued':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
            🔴 Fatigued (CFI: {cfi})
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Mathematical Model Explainer & Interactive Fatigue Radar Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono text-[11px] font-bold border border-indigo-500/30">
                FORMULA: CFI = 0.45(ΔCPA) + 0.35(ΔThumbstop) + 0.20(Freq/2.2)
              </span>
              <span className="text-xs text-slate-400">• Threshold: CFI ≥ 75 = Fatigue Alert</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Dynamic Creative Fatigue Radar & Action Center
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Monitors real-time decay across rolling 7-day, 14-day, and 30-day windows. When creatives pass CFI 75, media buyers receive automated warnings to iterate the 0–3s opening hook before audience saturation destroys account ROAS.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <div className="text-right pr-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Wasted in Queue</div>
              <div className="text-lg font-black text-rose-400 font-mono">
                ${creatives.reduce((acc, c) => acc + (c.wastedSpend || 0), 0).toLocaleString()}
              </div>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <button
              onClick={() => {
                const firstFatigued = creatives.find((c) => c.healthStatus === 'fatigued');
                if (firstFatigued) onOpenBriefGenerator(firstFatigued);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>1-Click Fix Fatigued</span>
            </button>
          </div>
        </div>

        {/* CFI Gauge Distribution Visual Strip */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-emerald-500/10">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <div>
              <div className="font-semibold text-slate-200">Scaling (CFI 0–49)</div>
              <div className="text-[11px] text-slate-400">High hook retention, stable CPA, low frequency (&lt;2.0)</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-amber-500/10">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
            <div>
              <div className="font-semibold text-slate-200">Fatigue Warning (CFI 50–74)</div>
              <div className="text-[11px] text-slate-400">Freq &gt; 2.2, Thumbstop drop &gt; 15%, CPA trending upward</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-rose-500/10">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse"></div>
            <div>
              <div className="font-semibold text-slate-200">Fatigued (CFI 75–100)</div>
              <div className="text-[11px] text-slate-400">Marginal CPA &gt; 35% above target. Pause or rotate hook immediately</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => onSetStatusFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'all' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({creatives.length})
            </button>
            <button
              onClick={() => onSetStatusFilter('fatigued')}
              className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === 'fatigued' ? 'bg-rose-600 text-white font-semibold shadow' : 'text-rose-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              Fatigued ({creatives.filter((c) => c.healthStatus === 'fatigued').length})
            </button>
            <button
              onClick={() => onSetStatusFilter('warning')}
              className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === 'warning' ? 'bg-amber-600 text-white font-semibold shadow' : 'text-amber-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Warning ({creatives.filter((c) => c.healthStatus === 'warning').length})
            </button>
            <button
              onClick={() => onSetStatusFilter('scaling')}
              className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === 'scaling' ? 'bg-emerald-600 text-white font-semibold shadow' : 'text-emerald-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Scaling ({creatives.filter((c) => c.healthStatus === 'scaling').length})
            </button>
          </div>

          {/* Format Selector */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Formats</option>
            <option value="Direct-to-camera UGC">Direct-to-camera UGC</option>
            <option value="Split-screen">Split-screen</option>
            <option value="Product Demo">Product Demo</option>
            <option value="Text Banner Overlay">Text Banner Overlay</option>
            <option value="Green Screen Reaction">Green Screen Reaction</option>
          </select>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search hook transcript or ad name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-8 pr-3 py-1.5 rounded-lg w-52 sm:w-64 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="cfi_desc">Sort: Highest Fatigue Index (CFI)</option>
            <option value="wasted_desc">Sort: Most Wasted Spend ($)</option>
            <option value="spend_desc">Sort: Highest Total Spend</option>
            <option value="thumbstop_desc">Sort: Highest Thumbstop Rate</option>
          </select>
        </div>
      </div>

      {/* Creatives List Grid */}
      {filteredCreatives.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No creatives found</h3>
          <p className="text-xs text-slate-400 mt-1">Try relaxing your search query or status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCreatives.map((creative) => {
            const thumbstopBench = getThumbstopBenchmark(creative.thumbstopRate);
            const isFatigued = creative.healthStatus === 'fatigued';
            const isWarning = creative.healthStatus === 'warning';

            return (
              <div
                key={creative.id}
                className={`bg-slate-900/90 border rounded-2xl p-4 sm:p-5 transition-all relative overflow-hidden ${
                  isFatigued
                    ? 'border-rose-500/40 hover:border-rose-500/60 shadow-lg shadow-rose-950/20'
                    : isWarning
                    ? 'border-amber-500/30 hover:border-amber-500/50'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Visual Top Glow for Fatigued Ads */}
                {isFatigued && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600"></div>
                )}

                <div className="flex flex-col lg:flex-row gap-5 items-start">
                  {/* Left: Video Thumbnail & Quick Play */}
                  <div className="w-full sm:w-48 lg:w-44 flex-shrink-0 relative group rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src={creative.thumbnailUrl}
                      alt={creative.name}
                      className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Platform Tag */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                      {creative.platform}
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-mono text-slate-300">
                      {creative.durationSeconds}s
                    </div>

                    {/* Hover Play / Inspect Button */}
                    <button
                      onClick={() => onOpenVideoLab(creative)}
                      className="absolute inset-0 bg-indigo-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white font-medium text-xs"
                    >
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 ml-0.5 fill-white" />
                      </div>
                      <span>Inspect 0-3s Hook</span>
                    </button>
                  </div>

                  {/* Middle: Hook Breakdown & Metric Intelligence */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Header line with status badge and name */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                          {creative.name}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {creative.format}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(creative.healthStatus, creative.cfi)}
                      </div>
                    </div>

                    {/* Spoken Hook Transcription Quote (Module 2) */}
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 relative">
                      <div className="flex items-center justify-between gap-2 mb-1 text-[11px]">
                        <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          0–3s Spoken Opening (Whisper NLP):
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {creative.hookArchetypeName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium italic">
                        "{creative.hookSpokenText}"
                      </p>
                      <div className="mt-1.5 flex items-center gap-3 text-[10px] text-slate-400">
                        <span>Pacing: <strong className="text-slate-300">{creative.pacing}</strong></span>
                        <span>•</span>
                        <span>Pattern Interrupt: <strong className={creative.patternInterrupt ? 'text-emerald-400' : 'text-slate-400'}>{creative.patternInterrupt ? 'Yes (Zoom/SFX)' : 'None'}</strong></span>
                      </div>
                    </div>

                    {/* Key Metrics Strip for this Creative */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {/* Thumbstop Rate */}
                      <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span>Thumbstop (0–3s)</span>
                          <span className={thumbstopBench.color}>{thumbstopBench.label}</span>
                        </div>
                        <div className="text-sm font-black font-mono text-white mt-0.5 flex items-baseline gap-1.5">
                          {creative.thumbstopRate}%
                          <span className={`text-[10px] font-normal ${creative.thumbstopRate < 25 ? 'text-rose-400' : 'text-slate-400'}`}>
                            (was {creative.thumbstop_avg_30d}%)
                          </span>
                        </div>
                      </div>

                      {/* Body Hold Rate */}
                      <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400">Body Hold Rate</div>
                        <div className="text-sm font-black font-mono text-emerald-400 mt-0.5">
                          {creative.holdRate}%
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            (sec 04–30 solid)
                          </span>
                        </div>
                      </div>

                      {/* CPA & Target CPA */}
                      <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span>CPA Trend</span>
                          <span className="text-[10px] text-slate-400">Goal: ${creative.targetCpa}</span>
                        </div>
                        <div className={`text-sm font-black font-mono mt-0.5 ${creative.cpa > creative.targetCpa * 1.2 ? 'text-rose-400' : 'text-slate-200'}`}>
                          ${creative.cpa.toFixed(2)}
                          <span className="text-[10px] font-normal text-slate-400 ml-1">
                            (7d: ${creative.cpa_7d.toFixed(1)})
                          </span>
                        </div>
                      </div>

                      {/* Frequency & Spend */}
                      <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span>Frequency</span>
                          <span>Spend</span>
                        </div>
                        <div className="text-sm font-black font-mono text-white mt-0.5 flex items-center justify-between">
                          <span className={creative.frequency_7d >= 2.2 ? 'text-amber-400' : 'text-slate-200'}>
                            {creative.frequency_7d.toFixed(2)}x
                          </span>
                          <span className="text-slate-300">${(creative.spend / 1000).toFixed(1)}k</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions & Wasted Spend Diagnostic */}
                  <div className="w-full lg:w-56 flex-shrink-0 flex flex-col justify-between self-stretch bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 space-y-3">
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Creative Fatigue Index</div>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className={`text-2xl font-black font-mono ${
                          isFatigued ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {creative.cfi}
                          <span className="text-xs text-slate-500 font-normal">/100</span>
                        </span>
                        {creative.wastedSpend > 0 && (
                          <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                            -${creative.wastedSpend.toLocaleString()} burnt
                          </span>
                        )}
                      </div>

                      {/* Progress meter */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isFatigued
                              ? 'bg-rose-500'
                              : isWarning
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, creative.cfi)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      {isFatigued || isWarning ? (
                        <button
                          onClick={() => onOpenBriefGenerator(creative)}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>1-Click Iterate Hook Brief</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenVideoLab(creative)}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Inspect 0-3s Frames</span>
                        </button>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenVideoLab(creative)}
                          className="flex-1 py-1.5 px-2 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-800 text-center transition-colors"
                        >
                          Drop-off Curve
                        </button>
                        <button
                          onClick={() => onTogglePauseAd(creative.id)}
                          className="py-1.5 px-2.5 rounded-md bg-slate-900 hover:bg-rose-900/30 text-rose-400 text-[11px] font-medium border border-slate-800 hover:border-rose-500/30 transition-colors"
                          title="Simulate pausing in ad manager"
                        >
                          Pause
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
