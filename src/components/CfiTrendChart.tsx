import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  Flame,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { CreativeAd } from '../types';
import { generate30DayCfiTrend, DailyCfiTrendPoint } from '../utils/analytics';

interface CfiTrendChartProps {
  creative: CreativeAd;
}

export const CfiTrendChart: React.FC<CfiTrendChartProps> = ({ creative }) => {
  const [showThumbstop, setShowThumbstop] = useState(true);
  const [showCpa, setShowCpa] = useState(false);
  const [showFrequency, setShowFrequency] = useState(false);

  // Generate 30 daily points
  const trendData = useMemo(() => {
    return generate30DayCfiTrend(creative);
  }, [creative]);

  // Derived statistics for summary indicators
  const stats = useMemo(() => {
    if (!trendData || trendData.length === 0) {
      return {
        startCfi: 0,
        endCfi: 0,
        deltaCfi: 0,
        warningDay: null as number | null,
        fatiguedDay: null as number | null,
        daysInFatigue: 0,
        velocityLabel: 'Stable',
        velocityColor: 'text-emerald-400',
      };
    }

    const startCfi = trendData[0].cfi;
    const endCfi = trendData[trendData.length - 1].cfi;
    const deltaCfi = endCfi - startCfi;

    const warningPoint = trendData.find((p) => p.cfi >= 50);
    const fatiguedPoint = trendData.find((p) => p.cfi >= 75);

    const daysInFatigue = trendData.filter((p) => p.cfi >= 75).length;
    const daysInWarning = trendData.filter((p) => p.cfi >= 50 && p.cfi < 75).length;

    let velocityLabel = 'Stable Scaling';
    let velocityColor = 'text-emerald-400';
    if (deltaCfi >= 45) {
      velocityLabel = 'Rapid Decay (Severe Hook Burn)';
      velocityColor = 'text-rose-400';
    } else if (deltaCfi >= 25) {
      velocityLabel = 'Accelerating Saturation';
      velocityColor = 'text-amber-400';
    } else if (deltaCfi > 10) {
      velocityLabel = 'Moderate Creep';
      velocityColor = 'text-indigo-300';
    }

    return {
      startCfi,
      endCfi,
      deltaCfi,
      warningDay: warningPoint ? warningPoint.day : null,
      fatiguedDay: fatiguedPoint ? fatiguedPoint.day : null,
      daysInFatigue,
      daysInWarning,
      velocityLabel,
      velocityColor,
    };
  }, [trendData]);

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DailyCfiTrendPoint = payload[0].payload;
      const isFatigued = data.cfi >= 75;
      const isWarning = data.cfi >= 50 && data.cfi < 75;

      return (
        <div className="bg-slate-900/95 border border-slate-700/90 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[210px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-semibold text-white font-mono">{data.formattedDate}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                isFatigued
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : isWarning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {data.status}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                Fatigue Index (CFI):
              </span>
              <span className={`font-mono font-bold text-sm ${
                data.cfi >= 75 ? 'text-rose-400' : data.cfi >= 50 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {data.cfi} <span className="text-[10px] text-slate-500 font-normal">/ 100</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                Thumbstop (0–3s):
              </span>
              <span className="font-mono font-semibold text-teal-300">{data.thumbstopRate}%</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                CPA:
              </span>
              <span className="font-mono font-semibold text-sky-300">${data.cpa.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                Frequency:
              </span>
              <span className="font-mono font-semibold text-purple-300">{data.frequency}x</span>
            </div>
          </div>

          {isFatigued && (
            <div className="pt-1.5 border-t border-slate-800 text-[10px] text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              <span>Audience fatigued — spend burned past threshold</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3.5">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              30-Day Composite Fatigue Index (CFI) Decay Trajectory
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Real-time tracking of audience saturation, Thumbstop drop-off, and CPA degradation.
          </p>
        </div>

        {/* Metric Overlay Toggles */}
        <div className="flex items-center flex-wrap gap-1.5 text-[10px]">
          <span className="text-slate-500 font-mono text-[10px] mr-1 hidden sm:inline">Overlay:</span>
          
          <button
            onClick={() => setShowThumbstop(!showThumbstop)}
            className={`px-2 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 border ${
              showThumbstop
                ? 'bg-teal-500/15 text-teal-300 border-teal-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            <span>Thumbstop %</span>
          </button>

          <button
            onClick={() => setShowCpa(!showCpa)}
            className={`px-2 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 border ${
              showCpa
                ? 'bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span>CPA ($)</span>
          </button>

          <button
            onClick={() => setShowFrequency(!showFrequency)}
            className={`px-2 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 border ${
              showFrequency
                ? 'bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            <span>Frequency</span>
          </button>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 relative">
        {/* Legend Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-900 text-[10px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-indigo-400 font-semibold">
              <span className="w-2.5 h-1.5 bg-indigo-500 rounded"></span>
              CFI (0–100)
            </span>
            {showThumbstop && (
              <span className="flex items-center gap-1 text-teal-400 font-semibold">
                <span className="w-2.5 h-1 bg-teal-400 rounded"></span>
                Thumbstop Rate %
              </span>
            )}
            {showCpa && (
              <span className="flex items-center gap-1 text-sky-400 font-semibold">
                <span className="w-2.5 h-1 bg-sky-400 rounded"></span>
                CPA ($)
              </span>
            )}
            {showFrequency && (
              <span className="flex items-center gap-1 text-purple-400 font-semibold">
                <span className="w-2.5 h-1 bg-purple-400 rounded"></span>
                Frequency (x)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 border-t border-dashed border-amber-400"></span>
              <span className="text-amber-400 font-mono">50</span> Warning
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 border-t border-dashed border-rose-500"></span>
              <span className="text-rose-400 font-mono">75</span> Fatigued
            </span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 12, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="cfiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={creative.cfi >= 75 ? '#f43f5e' : creative.cfi >= 50 ? '#f59e0b' : '#6366f1'}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={creative.cfi >= 75 ? '#f43f5e' : creative.cfi >= 50 ? '#f59e0b' : '#6366f1'}
                    stopOpacity={0.0}
                  />
                </linearGradient>
                <linearGradient id="thumbstopGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

              <XAxis
                dataKey="dateLabel"
                stroke="#64748b"
                tick={{ fontSize: 10, fill: '#64748b' }}
                interval={4}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                stroke="#64748b"
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickLine={false}
                ticks={[0, 25, 50, 75, 100]}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Threshold Lines */}
              <ReferenceLine
                y={50}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                strokeWidth={1.2}
                label={{
                  value: 'Warning (50)',
                  position: 'right',
                  fill: '#f59e0b',
                  fontSize: 9,
                  fontWeight: 'bold',
                }}
              />
              <ReferenceLine
                y={75}
                stroke="#f43f5e"
                strokeDasharray="3 3"
                strokeWidth={1.2}
                label={{
                  value: 'Fatigued (75)',
                  position: 'right',
                  fill: '#f43f5e',
                  fontSize: 9,
                  fontWeight: 'bold',
                }}
              />

              {/* Primary CFI Area & Line */}
              <Area
                type="monotone"
                dataKey="cfi"
                name="Fatigue Index (CFI)"
                stroke={creative.cfi >= 75 ? '#f43f5e' : creative.cfi >= 50 ? '#f59e0b' : '#6366f1'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#cfiGradient)"
              />

              {/* Secondary Overlays */}
              {showThumbstop && (
                <Line
                  type="monotone"
                  dataKey="thumbstopRate"
                  name="Thumbstop Rate"
                  stroke="#14b8a6"
                  strokeWidth={1.8}
                  dot={false}
                />
              )}

              {showCpa && (
                <Line
                  type="monotone"
                  dataKey="cpa"
                  name="CPA ($)"
                  stroke="#38bdf8"
                  strokeWidth={1.8}
                  strokeDasharray="4 3"
                  dot={false}
                />
              )}

              {showFrequency && (
                <Line
                  type="monotone"
                  dataKey="frequency"
                  name="Frequency"
                  stroke="#c084fc"
                  strokeWidth={1.8}
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Timeline Markers */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-900">
          <span>Day 1 (Launch)</span>
          {stats.warningDay && (
            <span className="text-amber-400 font-semibold">
              Day {stats.warningDay}: Crossed Warning (50)
            </span>
          )}
          {stats.fatiguedDay && (
            <span className="text-rose-400 font-semibold">
              Day {stats.fatiguedDay}: Critical Fatigue (75)
            </span>
          )}
          <span className="text-slate-400">Day 30 (Today)</span>
        </div>
      </div>

      {/* Diagnostic Callout Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/90">
          <div className="text-[10px] text-slate-400 font-medium">30-Day CFI Shift</div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-base font-bold font-mono ${stats.deltaCfi > 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {stats.deltaCfi >= 0 ? `+${stats.deltaCfi}` : stats.deltaCfi} pts
            </span>
            <span className="text-[10px] text-slate-500 font-mono">({stats.startCfi} → {stats.endCfi})</span>
          </div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/90">
          <div className="text-[10px] text-slate-400 font-medium">Decay Velocity</div>
          <div className={`text-xs font-bold mt-1 line-clamp-1 ${stats.velocityColor}`}>
            {stats.velocityLabel}
          </div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/90">
          <div className="text-[10px] text-slate-400 font-medium">Terminal Days</div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-base font-bold font-mono ${stats.daysInFatigue > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {stats.daysInFatigue} days
            </span>
            <span className="text-[10px] text-slate-500">at CFI &gt; 75</span>
          </div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/90">
          <div className="text-[10px] text-slate-400 font-medium">Action Directive</div>
          <div className="text-xs font-semibold text-indigo-300 mt-1 line-clamp-1">
            {creative.healthStatus === 'fatigued' ? 'Rotate 0-3s Opening' : creative.healthStatus === 'warning' ? 'Prep 3 Variants' : 'Scale Budget 20%'}
          </div>
        </div>
      </div>
    </div>
  );
};
