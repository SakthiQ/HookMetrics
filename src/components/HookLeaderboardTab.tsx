import React, { useState } from 'react';
import { 
  Flame, 
  Trophy, 
  Eye, 
  TrendingUp, 
  Sparkles, 
  Play, 
  Layers, 
  Target, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Wand2
} from 'lucide-react';
import { CreativeAd, HookArchetype, VisualFormat } from '../types';
import { getThumbstopBenchmark } from '../utils/analytics';

interface HookLeaderboardTabProps {
  creatives: CreativeAd[];
  onOpenVideoLab: (creative: CreativeAd) => void;
  onOpenBriefGenerator: (creative: CreativeAd) => void;
}

export const HookLeaderboardTab: React.FC<HookLeaderboardTabProps> = ({
  creatives,
  onOpenVideoLab,
  onOpenBriefGenerator,
}) => {
  const [selectedArchetype, setSelectedArchetype] = useState<HookArchetype | 'all'>('all');
  const [selectedFormat, setSelectedFormat] = useState<VisualFormat | 'all'>('all');

  // Compute Archetype Statistics
  const archetypeDefinitions: {
    id: HookArchetype;
    name: string;
    description: string;
    typicalHookStarters: string;
    psychologicalDriver: string;
  }[] = [
    {
      id: 'negative_framing',
      name: 'Negative Framing',
      description: 'Warns the viewer against a common mistake, dangerous trend, or wasted spend.',
      typicalHookStarters: '"Stop doing this...", "The biggest mistake...", "Never apply this..."',
      psychologicalDriver: 'Loss Aversion & Ego Threat (2.4x stronger than gain curiosity)',
    },
    {
      id: 'social_proof',
      name: 'Social Proof',
      description: 'Validates demand using herd behavior, customer counts, or dermatologist backing.',
      typicalHookStarters: '"Why over 50,000 people...", "Sold out 4 times...", "Dermatologists warned us..."',
      psychologicalDriver: 'Bandwagon Effect & Risk Reduction',
    },
    {
      id: 'curiosity_gap',
      name: 'Curiosity Gap',
      description: 'Piques skepticism followed by an instant visual demonstration or thermal proof.',
      typicalHookStarters: '"I didn\'t believe this worked until...", "What actually happens when..."',
      psychologicalDriver: 'Information Gap Theory & Contrast',
    },
    {
      id: 'direct_offer',
      name: 'Direct Offer',
      description: 'Leads with promotional discount, free shipping, or bundle incentive.',
      typicalHookStarters: '"Get 40% off during our...", "Buy 2 get 1 free flash sale..."',
      psychologicalDriver: 'Transactional Urgency & Price Discount',
    },
  ];

  // Compute stats per archetype
  const archetypeStats = archetypeDefinitions.map((arch) => {
    const matching = creatives.filter((c) => c.hookArchetype === arch.id);
    const count = matching.length;
    const totalSpend = matching.reduce((acc, c) => acc + c.spend, 0);
    const avgThumbstop = count > 0 ? matching.reduce((acc, c) => acc + c.thumbstopRate, 0) / count : 0;
    const avgHoldRate = count > 0 ? matching.reduce((acc, c) => acc + c.holdRate, 0) / count : 0;
    const avgRoas = count > 0 ? matching.reduce((acc, c) => acc + c.roas, 0) / count : 0;
    const scalingCount = matching.filter((c) => c.healthStatus === 'scaling').length;
    const winRate = count > 0 ? Math.round((scalingCount / count) * 100) : 0;

    return {
      ...arch,
      count,
      totalSpend,
      avgThumbstop: Number(avgThumbstop.toFixed(1)),
      avgHoldRate: Number(avgHoldRate.toFixed(1)),
      avgRoas: Number(avgRoas.toFixed(2)),
      winRate,
    };
  });

  // Filtered Leaderboard
  const leaderboardCreatives = creatives
    .filter((c) => {
      if (selectedArchetype !== 'all' && c.hookArchetype !== selectedArchetype) return false;
      if (selectedFormat !== 'all' && c.format !== selectedFormat) return false;
      return true;
    })
    .sort((a, b) => b.thumbstopRate - a.thumbstopRate);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold text-[11px] border border-amber-500/30 flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              0–3s Hook Intelligence
            </span>
            <span className="text-xs text-slate-400">Ranked by Thumbstop Efficiency (Continuous 3s Views / Impressions)</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Winning Opening Hooks & Structural Archetype Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            70%+ of drop-off occurs before second 03. Analyze which structural hooks stop the scroll and keep the winning body intact.
          </p>
        </div>

        {/* Global Benchmark Indicator */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Top Tier Benchmark</div>
            <div className="text-lg font-black text-emerald-400 font-mono">&gt;35.0%</div>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Poor Threshold</div>
            <div className="text-lg font-black text-rose-400 font-mono">&lt;25.0%</div>
          </div>
        </div>
      </div>

      {/* Module 2: The 4 Structural Archetypes Performance Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Structural Hook Archetype Breakdown (NLP Classified)
          </h3>
          <span className="text-xs text-slate-400">Click an archetype card to filter leaderboard</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {archetypeStats.map((arch) => {
            const isSelected = selectedArchetype === arch.id;
            return (
              <div
                key={arch.id}
                onClick={() => setSelectedArchetype(isSelected ? 'all' : arch.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-950/40 ring-2 ring-indigo-500/20'
                    : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white truncate">{arch.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
                      {arch.count} ads
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                    {arch.description}
                  </p>

                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 mb-3">
                    <div className="text-[10px] text-slate-500 font-mono">Example Script:</div>
                    <div className="text-[11px] text-slate-300 italic truncate">{arch.typicalHookStarters}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Avg Thumbstop</div>
                      <div className={`text-base font-black font-mono ${
                        arch.avgThumbstop >= 35 ? 'text-emerald-400' : arch.avgThumbstop >= 25 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {arch.avgThumbstop}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Win Rate</div>
                      <div className="text-base font-black font-mono text-indigo-300">
                        {arch.winRate}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Avg ROAS: <strong className="text-white">{arch.avgRoas}x</strong></span>
                    <span>Spend: <strong className="text-slate-300">${(arch.totalSpend / 1000).toFixed(1)}k</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-300">Active Filters:</span>
          {selectedArchetype !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Archetype: {selectedArchetype.replace('_', ' ')}
              <button onClick={() => setSelectedArchetype('all')} className="hover:text-white ml-1">×</button>
            </span>
          )}
          {selectedFormat !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Format: {selectedFormat}
              <button onClick={() => setSelectedFormat('all')} className="hover:text-white ml-1">×</button>
            </span>
          )}
          {selectedArchetype === 'all' && selectedFormat === 'all' && (
            <span className="text-xs text-slate-400">All Archetypes & Formats</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Formats</option>
            <option value="Direct-to-camera UGC">Direct-to-camera UGC</option>
            <option value="Split-screen">Split-screen</option>
            <option value="Product Demo">Product Demo</option>
            <option value="Text Banner Overlay">Text Banner Overlay</option>
            <option value="Green Screen Reaction">Green Screen Reaction</option>
          </select>

          {(selectedArchetype !== 'all' || selectedFormat !== 'all') && (
            <button
              onClick={() => {
                setSelectedArchetype('all');
                setSelectedFormat('all');
              }}
              className="text-indigo-400 hover:text-indigo-300 text-xs underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Leaderboard Table View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-semibold">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4 min-w-[280px]">Opening Hook (0–3s Spoken & Visual)</th>
                <th className="py-3 px-4">Archetype & Format</th>
                <th className="py-3 px-4 text-right">Thumbstop Rate (0–3s)</th>
                <th className="py-3 px-4 text-right">Body Hold Rate</th>
                <th className="py-3 px-4 text-right">CPA / ROAS</th>
                <th className="py-3 px-4 text-right">Creative Health</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leaderboardCreatives.map((creative, index) => {
                const bench = getThumbstopBenchmark(creative.thumbstopRate);
                return (
                  <tr key={creative.id} className="hover:bg-slate-800/40 transition-colors group">
                    {/* Rank */}
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-mono font-black text-xs ${
                        index === 0
                          ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                          : index === 1
                          ? 'bg-slate-300 text-black'
                          : index === 2
                          ? 'bg-amber-700 text-white'
                          : 'text-slate-500'
                      }`}>
                        {index + 1}
                      </span>
                    </td>

                    {/* Opening Hook Description */}
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <div 
                          onClick={() => onOpenVideoLab(creative)}
                          className="w-16 h-12 rounded-lg bg-slate-950 flex-shrink-0 overflow-hidden relative cursor-pointer border border-slate-800 group-hover:border-indigo-500"
                        >
                          <img
                            src={creative.thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-3.5 h-3.5 fill-white text-white" />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="font-bold text-white hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => onOpenVideoLab(creative)}>
                            {creative.name}
                          </div>
                          <p className="text-slate-300 italic text-[11px] line-clamp-2 mt-0.5">
                            "{creative.hookSpokenText}"
                          </p>
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                            <span>Visual: {creative.hookVisualCategory.split(':')[0]}</span>
                            <span>•</span>
                            <span>{creative.pacing}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Archetype & Format */}
                    <td className="py-4 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono font-medium">
                        {creative.hookArchetypeName.split('(')[0]}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-1">{creative.format}</div>
                    </td>

                    {/* Thumbstop Rate */}
                    <td className="py-4 px-4 text-right">
                      <div className="font-black font-mono text-white text-sm">
                        {creative.thumbstopRate}%
                      </div>
                      <span className={`inline-block text-[10px] px-1.5 py-0.2 rounded border mt-0.5 ${bench.badgeBg}`}>
                        {bench.label}
                      </span>
                    </td>

                    {/* Body Hold Rate */}
                    <td className="py-4 px-4 text-right">
                      <div className="font-black font-mono text-emerald-400 text-sm">
                        {creative.holdRate}%
                      </div>
                      <div className="text-[10px] text-slate-500">sec 04–30</div>
                    </td>

                    {/* CPA / ROAS */}
                    <td className="py-4 px-4 text-right">
                      <div className="font-mono text-white font-bold">
                        ${creative.cpa.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono">{creative.roas.toFixed(2)}x ROAS</div>
                    </td>

                    {/* Creative Health Status */}
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        creative.healthStatus === 'scaling'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : creative.healthStatus === 'warning'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {creative.healthStatus === 'scaling' && '🟢 Scaling'}
                        {creative.healthStatus === 'warning' && '🟡 Warning'}
                        {creative.healthStatus === 'fatigued' && '🔴 Fatigued'}
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">CFI: {creative.cfi}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenVideoLab(creative)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Inspect 0-3s frames & drop-off"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenBriefGenerator(creative)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] flex items-center gap-1 shadow transition-colors"
                          title="Generate editor brief for this ad"
                        >
                          <Wand2 className="w-3 h-3" />
                          <span>Brief</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
