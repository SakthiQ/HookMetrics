import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Check, 
  Layers, 
  Sparkles, 
  ShoppingBag, 
  Key, 
  RefreshCw, 
  FileVideo, 
  FileSpreadsheet, 
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { CreativeAd, AdAccount, HookArchetype, VisualFormat } from '../types';

interface IngestModalProps {
  currentAccount: AdAccount;
  onClose: () => void;
  onAddCreative: (newCreative: CreativeAd) => void;
}

export const IngestModal: React.FC<IngestModalProps> = ({
  currentAccount,
  onClose,
  onAddCreative,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'meta' | 'tiktok' | 'shopify'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Upload Form State
  const [adName, setAdName] = useState('');
  const [hookSpoken, setHookSpoken] = useState('');
  const [adFormat, setAdFormat] = useState<VisualFormat>('Direct-to-camera UGC');
  const [platform, setPlatform] = useState<'meta' | 'tiktok'>('meta');
  const [adCopy, setAdCopy] = useState('');
  const [spend, setSpend] = useState('12500');

  // API connector states
  const [metaConnected, setMetaConnected] = useState(true);
  const [tiktokConnected, setTiktokConnected] = useState(true);
  const [shopifyConnected, setShopifyConnected] = useState(currentAccount.shopifySynced);

  const handleSimulatedUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adName.trim() || !hookSpoken.trim()) return;

    setIsProcessing(true);

    // Call server AI endpoint to classify hook archetype and pacing
    let archetype: HookArchetype = 'negative_framing';
    let archetypeName = 'Negative Framing (Problem Callout)';
    let pacing = 'Fast-cut (<0.8s cuts)';

    try {
      const res = await fetch('/api/gemini/analyze-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hookText: hookSpoken,
          visualDescription: `${adFormat} video creative`,
          brandNiche: currentAccount.brandNiche,
        }),
      });
      const data = await res.json();
      if (data?.analysis) {
        archetype = data.analysis.archetype || 'negative_framing';
        archetypeName = data.analysis.archetypeName || 'Negative Framing';
        pacing = data.analysis.hookPacing || 'Fast-cut';
      }
    } catch (err) {
      console.warn('AI analysis fallback:', err);
    }

    // Create realistic new ad entry
    const newAd: CreativeAd = {
      id: `cr_user_${Date.now()}`,
      name: adName.trim(),
      adAccountId: currentAccount.id,
      brandName: currentAccount.name.split('[')[0].trim(),
      platform,
      format: adFormat,
      durationSeconds: 28,
      thumbnailUrl:
        platform === 'tiktok'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      adCopy: adCopy || 'Test ad creative synced via HookMetrics automated ingest pipeline.',
      spend: Number(spend) || 12000,
      impressions: 280000,
      clicks: 8400,
      conversions: 290,
      cpa: 41.37,
      targetCpa: 32.0,
      roas: 2.1,
      shopifyRoas: 1.85,
      frequency_7d: 2.31,
      cpa_7d: 43.5,
      cpa_avg_30d: 33.2,
      thumbstop_7d: 24.2,
      thumbstop_avg_30d: 36.0,
      views_3s: 67760,
      views_25p: 44000,
      views_50p: 31000,
      views_75p: 24000,
      views_100p: 19650,
      thumbstopRate: 24.2,
      holdRate: 29.0,
      cfi: 72,
      healthStatus: 'warning',
      wastedSpend: 1500,
      daysActive: 19,
      hookSpokenText: hookSpoken.trim(),
      hookArchetype: archetype,
      hookArchetypeName: archetypeName,
      hookVisualCategory: `${adFormat} with highlighted text overlay`,
      pacing,
      patternInterrupt: true,
      frames_0_to_3s: [
        {
          second: 0.0,
          thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          visualSummary: 'Frame 0.0s opening shot',
          onScreenText: 'WATCH THIS 🚨',
          audioSpoken: hookSpoken.slice(0, 30),
          instantDropOffPct: 0,
          cumulativeRetention: 100,
          patternInterrupt: true,
        },
        {
          second: 1.0,
          thumbnailUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80',
          visualSummary: 'Frame 1.0s fast cut',
          onScreenText: 'COMMON MISTAKE',
          audioSpoken: hookSpoken.slice(30, 60) || '...',
          instantDropOffPct: 22,
          cumulativeRetention: 78,
        },
        {
          second: 2.0,
          thumbnailUrl: 'https://images.unsplash.com/photo-1512290900672-1f02a0a8e83b?auto=format&fit=crop&w=300&q=80',
          visualSummary: 'Frame 2.0s product reveal',
          onScreenText: 'WHAT ACTUALLY WORKS',
          audioSpoken: '...absorbs in 30 seconds',
          instantDropOffPct: 18,
          cumulativeRetention: 60,
        },
        {
          second: 3.0,
          thumbnailUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80',
          visualSummary: 'Frame 3.0s transition to body demonstration',
          onScreenText: 'Step 1 of routine',
          audioSpoken: 'Listen closely...',
          instantDropOffPct: 10,
          cumulativeRetention: 50,
        },
      ],
      retentionCurve: [
        { second: 0, retentionRate: 100, industryBenchmark: 100 },
        { second: 1, retentionRate: 78, industryBenchmark: 68 },
        { second: 2, retentionRate: 60, industryBenchmark: 44 },
        { second: 3, retentionRate: 50, industryBenchmark: 32 },
        { second: 10, retentionRate: 35, industryBenchmark: 22 },
        { second: 28, retentionRate: 20, industryBenchmark: 11 },
      ],
      decayHistory: [
        { date: 'Day -14', thumbstopRate: 36.0, cpa: 33.2, frequency: 1.15, cfi: 20 },
        { date: 'Day -7', thumbstopRate: 29.5, cpa: 38.0, frequency: 1.80, cfi: 51 },
        { date: 'Today', thumbstopRate: 24.2, cpa: 43.5, frequency: 2.31, cfi: 72 },
      ],
    };

    setTimeout(() => {
      onAddCreative(newAd);
      setIsProcessing(false);
      setSuccessMessage(`Creative "${newAd.name}" decomposed into 0–3s frames & ingested successfully!`);
      setTimeout(() => {
        onClose();
      }, 1400);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Module 1: Ingestion Pipeline & Media Sync
              </h3>
              <p className="text-xs text-slate-400">
                Sync ad assets, 0–3s watch milestones, and Shopify true attribution
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileVideo className="w-3.5 h-3.5" />
            Direct Video / MP4 Ingest
          </button>

          <button
            onClick={() => setActiveTab('meta')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'meta'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Meta Marketing API
          </button>

          <button
            onClick={() => setActiveTab('tiktok')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'tiktok'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-neutral-200"></span>
            TikTok Ads API
          </button>

          <button
            onClick={() => setActiveTab('shopify')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'shopify'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            Shopify True ROAS Sync
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 font-medium animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'upload' && (
            <form onSubmit={handleSimulatedUpload} className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-dashed border-slate-700 text-center hover:border-indigo-500/60 transition-colors">
                <FileVideo className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <div className="text-white font-bold text-xs">Drag and drop short-form video MP4 or H.264 file</div>
                <div className="text-slate-500 text-[11px] mt-0.5">FFmpeg worker will automatically slice seconds 0.0s to 03.0s and extract audio</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Creative Ad Asset Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., UGC_Founder_ProblemHook_V1"
                    value={adName}
                    onChange={(e) => setAdName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Platform & Format</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="meta">Meta Ads</option>
                      <option value="tiktok">TikTok Ads</option>
                    </select>

                    <select
                      value={adFormat}
                      onChange={(e) => setAdFormat(e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Direct-to-camera UGC">Direct UGC</option>
                      <option value="Split-screen">Split-screen</option>
                      <option value="Product Demo">Product Demo</option>
                      <option value="Text Banner Overlay">Text Banner</option>
                      <option value="Green Screen Reaction">Green Screen</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Spoken Opening Hook Transcript (0–3 Seconds)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g., Stop doing this to your skin! Dermatologists warned us this formula was too concentrated..."
                  value={hookSpoken}
                  onChange={(e) => setHookSpoken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Ad Copy / Headline</label>
                <input
                  type="text"
                  placeholder="e.g., Clinical peptide formula repairs 94% of barrier damage in 48 hours."
                  value={adCopy}
                  onChange={(e) => setAdCopy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Running Whisper NLP & Frame Splitting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Ingest & Run Hook Decomposition</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'meta' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    f
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Meta Marketing API (v20.0)</div>
                    <div className="text-slate-400 text-[11px]">Synced: 7 Active Campaigns, 24 Video Ads</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Connected & Token Active
                  </span>
                  <button
                    onClick={() => alert('Meta token refresh verified!')}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Sync latest daily metrics"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-400 text-[11px] space-y-1">
                <div>• Auto-fetches: 3-second continuous video views, 25%, 50%, 75%, 100% video milestone completions.</div>
                <div>• Polls daily spend, clicks, impressions, and frequency at 06:00 UTC.</div>
              </div>
            </div>
          )}

          {activeTab === 'tiktok' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black border border-slate-700 text-white flex items-center justify-center font-bold text-lg">
                    🎵
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">TikTok Ads API (Marketing Partner)</div>
                    <div className="text-slate-400 text-[11px]">Synced: Spark Ads + Direct Video Ingestion</div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Connected
                </span>
              </div>
            </div>
          )}

          {activeTab === 'shopify' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Shopify Orders & Revenue Webhook</div>
                    <div className="text-slate-400 text-[11px]">True ROAS & Attribution Divergence Detection</div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Active (-14.2% divergence flagged)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs leading-relaxed">
                Correlates platform ad metrics against actual store revenue to detect attribution divergence. When Meta/TikTok report a $2.80 ROAS while Shopify reports $2.10, HookMetrics anchors creative fatigue on platform-relative trends (Thumbstop % drop + frequency saturation) rather than flawed platform ROAS.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
