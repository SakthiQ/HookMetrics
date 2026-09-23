import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  Wand2, 
  Layers, 
  Scissors, 
  TrendingDown, 
  FileText,
  Clock,
  ArrowRight,
  Activity
} from 'lucide-react';
import { CreativeAd, FramePoint } from '../types';
import { getThumbstopBenchmark } from '../utils/analytics';
import { CfiTrendChart } from './CfiTrendChart';

interface VideoPlayerModalProps {
  creative: CreativeAd | null;
  onClose: () => void;
  onOpenBriefGenerator: (creative: CreativeAd) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  creative,
  onClose,
  onOpenBriefGenerator,
}) => {
  if (!creative) return null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSecond, setCurrentSecond] = useState<number>(0);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeAnalyticsView, setActiveAnalyticsView] = useState<'cfi_trend' | 'retention' | 'split'>('cfi_trend');

  // Playback timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSecond((prev) => {
          if (prev >= creative.durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          const next = Number((prev + 0.2).toFixed(1));
          
          // Map to 0-3s frames if within range
          if (next <= 3.0) {
            const frameIdx = Math.min(
              creative.frames_0_to_3s.length - 1,
              Math.floor(next / 0.5)
            );
            setSelectedFrameIndex(frameIdx);
          }
          return next;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, creative.durationSeconds, creative.frames_0_to_3s.length]);

  const activeFrame: FramePoint = creative.frames_0_to_3s[selectedFrameIndex] || creative.frames_0_to_3s[0];
  const thumbstopBench = getThumbstopBenchmark(creative.thumbstopRate);

  // Find steepest drop-off cliff in 0-3s
  const steepestDrop = [...creative.frames_0_to_3s].sort((a, b) => b.instantDropOffPct - a.instantDropOffPct)[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Flame className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white tracking-tight">{creative.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                  {creative.platform.toUpperCase()} • {creative.format}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${thumbstopBench.badgeBg}`}>
                  Thumbstop: {creative.thumbstopRate}%
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${
                    creative.cfi >= 75
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : creative.cfi >= 50
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  CFI: {creative.cfi}/100 ({creative.healthStatus.toUpperCase()})
                </span>
              </div>
              <p className="text-[11px] text-slate-400">30-Day Fatigue Decay Pattern (CFI) & 0–3s Frame-by-Frame Decomposition</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenBriefGenerator(creative);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow transition-all"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Generate Brief</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
          {/* Left Column: Video Simulation Player & 0-3s Scrubber */}
          <div className="lg:col-span-5 space-y-4">
            {/* Phone Aspect Ratio Player Frame */}
            <div className="relative aspect-[9/16] max-h-[380px] sm:max-h-[420px] mx-auto w-full max-w-[240px] sm:max-w-[260px] bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between">
              {/* Active Frame or Video Background */}
              <img
                src={activeFrame?.thumbnailUrl || creative.thumbnailUrl}
                alt="Ad frame"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
              />

              {/* Overlays (Safe Zones for Meta / TikTok) */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>

              {/* Top Meta/TikTok UI Simulation */}
              <div className="relative z-10 p-3 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur px-2 py-0.5 rounded-full border border-white/10 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  {creative.platform === 'tiktok' ? 'TikTok Ad' : 'Reels Ad'}
                </div>
                <div className="text-[11px] font-mono bg-black/60 px-2 py-0.5 rounded text-indigo-300 font-bold">
                  {currentSecond.toFixed(1)}s / {creative.durationSeconds}s
                </div>
              </div>

              {/* Dynamic On-Screen Text Overlay (Extracted by Vision AI) */}
              <div className="relative z-10 px-3 text-center my-auto">
                {activeFrame?.onScreenText && (
                  <div className="inline-block bg-yellow-400 text-black font-black text-xs sm:text-sm px-2.5 py-1 rounded shadow-lg uppercase tracking-tight transform -rotate-1 border border-black animate-bounce">
                    {activeFrame.onScreenText}
                  </div>
                )}
                {activeFrame?.patternInterrupt && (
                  <div className="mt-2 inline-flex items-center gap-1 bg-rose-600/90 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    ⚡️ PATTERN INTERRUPT
                  </div>
                )}
              </div>

              {/* Bottom Simulation Controls */}
              <div className="relative z-10 p-3 space-y-2">
                {/* Spoken subtitle snippet */}
                <div className="bg-black/70 backdrop-blur text-white text-[11px] p-2 rounded-lg border border-white/10 text-left">
                  <div className="text-[9px] font-mono text-indigo-400 uppercase font-bold">Whisper Transcript:</div>
                  <div className="italic text-slate-200 line-clamp-2">
                    {activeFrame?.audioSpoken || `"${creative.hookSpokenText}"`}
                  </div>
                </div>

                {/* Scrubber bar */}
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = clickX / rect.width;
                    const sec = Number((pct * creative.durationSeconds).toFixed(1));
                    setCurrentSecond(sec);
                    if (sec <= 3) {
                      setSelectedFrameIndex(Math.min(creative.frames_0_to_3s.length - 1, Math.floor(sec / 0.5)));
                    }
                  }}
                >
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(currentSecond / creative.durationSeconds) * 100}%` }}
                  ></div>
                </div>

                {/* Player Play/Pause Controls */}
                <div className="flex items-center justify-between text-white pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-black" />}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentSecond(0);
                        setSelectedFrameIndex(0);
                      }}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Rewind to 0.0s"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Clip 0–3s Indicator */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center text-xs">
              <span className="text-slate-400">Current Isolation: </span>
              <strong className="text-indigo-400 font-mono">
                {currentSecond <= 3.0 ? `Second ${currentSecond.toFixed(1)}s (Hook Phase)` : `Second ${currentSecond.toFixed(1)}s (Body Demonstration)`}
              </strong>
            </div>
          </div>

          {/* Right Column: 0-3s Frame Scrubber & Second-by-Second Drop-off Curve */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Dedicated 0–3 Second Frame Isolation Strip (Module 2) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    0–3 Second Frame Scrubber (Where 70%+ Drop Occurs)
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Click frame to preview</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {creative.frames_0_to_3s.map((frame, idx) => {
                  const isSelected = selectedFrameIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedFrameIndex(idx);
                        setCurrentSecond(frame.second);
                      }}
                      className={`p-1.5 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center ${
                        isSelected
                          ? 'bg-indigo-950 border-indigo-500 ring-2 ring-indigo-500/30'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[10px] font-mono font-bold text-indigo-400">
                        {frame.second.toFixed(1)}s
                      </div>
                      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden my-1 bg-slate-900 relative">
                        <img src={frame.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                        {frame.instantDropOffPct > 20 && (
                          <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-rose-500"></div>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-300 font-semibold">
                        {frame.cumulativeRetention}%
                      </div>
                      <div className="text-[9px] text-rose-400 font-mono">
                        -{frame.instantDropOffPct}%
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Frame Detail Callout */}
              <div className="mt-2.5 bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    Frame at {activeFrame?.second.toFixed(1)}s:
                    <span className="text-slate-300 font-normal">{activeFrame?.visualSummary}</span>
                  </span>
                  <span className="font-mono text-rose-400 font-bold">
                    Drop-off: -{activeFrame?.instantDropOffPct}%
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] flex items-center justify-between">
                  <span>Text Overlay: <strong className="text-yellow-400">{activeFrame?.onScreenText || 'None'}</strong></span>
                  <span>Cumulative Retention: <strong className="text-emerald-400 font-mono">{activeFrame?.cumulativeRetention}%</strong></span>
                </div>
              </div>
            </div>

            {/* 2. Visual Analytics Section: 30-Day CFI Trend (Recharts) & Second-by-Second Retention */}
            <div className="space-y-3">
              {/* Analytics View Selector Tab Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveAnalyticsView('cfi_trend')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeAnalyticsView === 'cfi_trend'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>30-Day Fatigue Trend (CFI)</span>
                  </button>

                  <button
                    onClick={() => setActiveAnalyticsView('retention')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeAnalyticsView === 'retention'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>0–30s Drop-off Curve</span>
                  </button>

                  <button
                    onClick={() => setActiveAnalyticsView('split')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeAnalyticsView === 'split'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                    title="View Both Macro Fatigue Trend and Micro Retention Curve"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Dual View</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 font-mono hidden md:block">
                  {activeAnalyticsView === 'cfi_trend' && 'Decay Formula: 0.45(ΔCPA) + 0.35(ΔThumbstop) + 0.20(Freq)'}
                  {activeAnalyticsView === 'retention' && 'Scrubber needle syncs with player position'}
                  {activeAnalyticsView === 'split' && 'Macro 30-Day CFI & Micro 0–30s Retention'}
                </div>
              </div>

              {/* View A: 30-Day Composite Fatigue Index (CFI) Trend Chart (Recharts) */}
              {(activeAnalyticsView === 'cfi_trend' || activeAnalyticsView === 'split') && (
                <div className="space-y-3">
                  <CfiTrendChart creative={creative} />
                </div>
              )}

              {/* View B: Second-by-Second Drop-off Curve Chart (0s to 30s) */}
              {(activeAnalyticsView === 'retention' || activeAnalyticsView === 'split') && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-rose-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Second-by-Second Retention Curve vs Industry Benchmark
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1 text-indigo-400 font-medium">
                        <span className="w-2.5 h-1 bg-indigo-500 rounded"></span> This Ad
                      </span>
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <span className="w-2.5 h-1 bg-slate-600 rounded"></span> Benchmark
                      </span>
                    </div>
                  </div>

                  {/* Retention Curve SVG Chart */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative">
                    <div className="h-36 w-full relative flex items-end">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="0" y1="0" x2="500" y2="0" stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1="0" y1="40" x2="500" y2="40" stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1="0" y1="80" x2="500" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1="0" y1="120" x2="500" y2="120" stroke="#334155" />

                        {/* Hook Zone Shading (First 10% = 0 to 3s) */}
                        <rect x="0" y="0" width="60" height="120" fill="rgba(99, 102, 241, 0.08)" />
                        <line x1="60" y1="0" x2="60" y2="120" stroke="#6366f1" strokeDasharray="2 2" />
                        <text x="5" y="15" fill="#818cf8" fontSize="9" fontWeight="bold">0–3s HOOK ZONE</text>

                        {/* Benchmark Curve */}
                        <path
                          d="M 0 0 C 60 70, 150 90, 500 108"
                          fill="none"
                          stroke="#475569"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />

                        {/* Actual Ad Curve */}
                        <path
                          d={`M 0 0 C 30 55, 60 ${120 - (creative.thumbstopRate * 1.2)}, 150 95, 500 ${120 - (creative.holdRate * 0.4)}`}
                          fill="none"
                          stroke={creative.thumbstopRate < 25 ? '#f43f5e' : '#6366f1'}
                          strokeWidth="3"
                        />

                        {/* Current Scrubber Needle */}
                        {currentSecond > 0 && (
                          <line
                            x1={(currentSecond / creative.durationSeconds) * 500}
                            y1="0"
                            x2={(currentSecond / creative.durationSeconds) * 500}
                            y2="120"
                            stroke="#e2e8f0"
                            strokeWidth="2"
                          />
                        )}
                      </svg>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-900">
                      <span>0s (Start)</span>
                      <span className="text-indigo-400 font-bold">3s (Hook Cutoff)</span>
                      <span>10s</span>
                      <span>20s</span>
                      <span>{creative.durationSeconds}s (End)</span>
                    </div>
                  </div>

                  {/* Cliff Diagnosis Callout */}
                  <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-300">Drop-off Cliff Identified at {steepestDrop?.second.toFixed(1)}s</div>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        Viewers dropped sharply by <strong className="text-rose-400">-{steepestDrop?.instantDropOffPct}%</strong> during the transition from text overlay to speaker face. However, once viewers cross second 03, retention stabilizes with a <strong className="text-emerald-400">{creative.holdRate}% Body Hold Rate</strong>. 
                        <span className="block mt-1 text-slate-400 font-medium">
                          Verdict: Body footage is high-converting. Keep seconds 04–30 and shoot 3 new opening hooks.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* Modal Bottom Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Wasted Spend to Recover: <strong className="text-rose-400 font-mono">${(creative.wastedSpend || 0).toLocaleString()}</strong>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenBriefGenerator(creative);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
                <span>Iterate Creative (1-Click Brief Generator)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
