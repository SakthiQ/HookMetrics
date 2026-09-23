import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  UploadCloud, 
  Database, 
  Cpu, 
  ShoppingBag, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';
import { AdAccount } from '../types';

interface IntegrationsTabProps {
  account: AdAccount;
  onOpenIngestModal: () => void;
}

export const IntegrationsTab: React.FC<IntegrationsTabProps> = ({ account, onOpenIngestModal }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('2 minutes ago');

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync('Just now');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
            Module 1 Architecture & Data Connectors
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Media Ingestion, FFmpeg Scene Splitting & True ROAS Sync
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated polling of Meta Marketing API, TikTok Ads API, and Shopify webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{isSyncing ? 'Syncing APIs...' : 'Force Refresh APIs'}</span>
          </button>
          <button
            onClick={onOpenIngestModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>+ Ingest New Creative</span>
          </button>
        </div>
      </div>

      {/* Connected Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Meta Ads */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/20">
                f
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Meta Marketing API</h3>
                <div className="text-[11px] text-slate-400">App ID: 9482710492810</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Scope:</span>
              <span className="font-mono text-indigo-300 text-[11px]">ads_read, ads_management</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Synced Creatives:</span>
              <span className="font-semibold text-white">18 Video Ads</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Milestones Extracted:</span>
              <span className="text-emerald-400 font-semibold">3s, 25%, 50%, 75%, 100%</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Last Webhook Event:</span>
              <span className="text-slate-400 font-mono">{lastSync}</span>
            </div>
          </div>
        </div>

        {/* TikTok Ads */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-slate-700 text-white flex items-center justify-center font-bold text-lg shadow">
                🎵
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">TikTok Ads API</h3>
                <div className="text-[11px] text-slate-400">Partner App: HookMetrics-Prod</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Scope:</span>
              <span className="font-mono text-indigo-300 text-[11px]">ad_read, report_sync</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Synced Creatives:</span>
              <span className="font-semibold text-white">12 Spark Ads</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Milestones Extracted:</span>
              <span className="text-emerald-400 font-semibold">2s, 6s, 100% Views</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Last Webhook Event:</span>
              <span className="text-slate-400 font-mono">{lastSync}</span>
            </div>
          </div>
        </div>

        {/* Shopify Webhook (True ROAS Reconciliation) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Shopify True ROAS</h3>
                <div className="text-[11px] text-slate-400">Store: glowlab-official.myshopify</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Attribution Model:</span>
              <span className="text-white font-medium">Triple Whale / 1P Pixel Sync</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Attribution Divergence:</span>
              <span className="text-amber-400 font-mono font-bold">-14.2%</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Platform Inflation Flag:</span>
              <span className="text-slate-300">Anchors CFI on Thumbstop/Freq</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Real-time Orders:</span>
              <span className="text-emerald-400 font-mono">1,482 orders/week</span>
            </div>
          </div>
        </div>
      </div>

      {/* FFmpeg & Whisper NLP Pipeline Overview */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Automated Video Processing & Hook Extraction Pipeline
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="font-bold text-indigo-400 mb-1">1. Video Ingestion</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When new creative IDs are registered in Meta/TikTok campaigns, raw MP4s are downloaded to worker storage.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="font-bold text-indigo-400 mb-1">2. 0–3s Frame Slicing</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              FFmpeg cuts keyframes at 0.0s, 0.5s, 1.0s, 1.5s, 2.0s, 2.5s, 3.0s to detect rapid pattern interrupts and transitions.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="font-bold text-indigo-400 mb-1">3. Whisper NLP Audio</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Audio track is converted to text with exact millisecond timestamps to isolate the spoken hook archetype.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="font-bold text-indigo-400 mb-1">4. Gemini AI Classification</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Gemini classifies the hook into Negative Framing, Social Proof, Curiosity Gap, or Direct Offer with pacing scores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
