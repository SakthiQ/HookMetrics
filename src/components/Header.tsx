import React from 'react';
import { 
  Flame, 
  Activity, 
  AlertTriangle, 
  UploadCloud, 
  FileSpreadsheet, 
  Bell, 
  ChevronDown,
  Sparkles,
  TrendingDown,
  Layers
} from 'lucide-react';
import { AdAccount, PlatformType } from '../types';

interface HeaderProps {
  accounts: AdAccount[];
  selectedAccount: AdAccount;
  onSelectAccount: (account: AdAccount) => void;
  selectedPlatform: PlatformType;
  onSelectPlatform: (platform: PlatformType) => void;
  timeWindow: '7d' | '14d' | '30d';
  onSelectTimeWindow: (w: '7d' | '14d' | '30d') => void;
  activeTab: 'radar' | 'leaderboard' | 'audit' | 'integrations';
  onChangeTab: (tab: 'radar' | 'leaderboard' | 'audit' | 'integrations') => void;
  fatiguedCount: number;
  onOpenAudit: () => void;
  onOpenIngest: () => void;
  onOpenAlerts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  accounts,
  selectedAccount,
  onSelectAccount,
  selectedPlatform,
  onSelectPlatform,
  timeWindow,
  onSelectTimeWindow,
  activeTab,
  onChangeTab,
  fatiguedCount,
  onOpenAudit,
  onOpenIngest,
  onOpenAlerts,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
      {/* Top Banner with Platform Notification */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-rose-950/60 border-b border-indigo-500/20 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Hook AI v2.4 Live
          </span>
          <span className="hidden sm:inline text-slate-400">
            Frame-by-frame 0-3s isolation active • Dynamic Fatigue Formula (w1: 0.45, w2: 0.35, w3: 0.20)
          </span>
        </div>
        <div className="flex items-center gap-3">
          {fatiguedCount > 0 && (
            <button 
              onClick={onOpenAlerts}
              className="flex items-center gap-1.5 text-rose-400 font-semibold hover:text-rose-300 transition-colors animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{fatiguedCount} High-Spend Ad{fatiguedCount > 1 ? 's' : ''} Fatigued</span>
            </button>
          )}
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Attribution Sync: <strong className="text-emerald-400">Shopify Connected</strong></span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Product Vision */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">Hook<span className="text-indigo-400">Metrics</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700">
                  Growth Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Video Ad Hook & Creative Fatigue Intelligence</p>
            </div>
          </div>

          {/* Account Switcher */}
          <div className="relative group">
            <div className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 cursor-pointer transition-all">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  {selectedAccount.name}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedAccount.brandNiche} • ${selectedAccount.monthlySpend.toLocaleString()}/mo
                </div>
              </div>
            </div>
            
            {/* Account dropdown */}
            <div className="absolute left-0 mt-1 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/80 py-1.5 hidden group-hover:block z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Connected Brand Account
              </div>
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => onSelectAccount(acc)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                    acc.id === selectedAccount.id ? 'bg-indigo-500/10 text-indigo-300 font-medium' : 'text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-medium text-white">{acc.name}</div>
                    <div className="text-[10px] text-slate-400">{acc.brandNiche}</div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">${(acc.monthlySpend / 1000).toFixed(0)}k/mo</span>
                </button>
              ))}
              <div className="border-t border-slate-800 my-1 pt-1">
                <button
                  onClick={onOpenIngest}
                  className="w-full text-left px-3 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  + Connect New Meta/TikTok Account
                </button>
              </div>
            </div>
          </div>

          {/* Time Window & Platform Controls */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            {/* Platform Selector */}
            <div className="flex bg-slate-900 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => onSelectPlatform('all')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedPlatform === 'all' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onSelectPlatform('meta')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedPlatform === 'meta' ? 'bg-blue-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Meta
              </button>
              <button
                onClick={() => onSelectPlatform('tiktok')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedPlatform === 'tiktok' ? 'bg-neutral-800 text-rose-400 font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                TikTok
              </button>
            </div>

            {/* Time Window */}
            <div className="flex bg-slate-900 rounded-lg p-0.5 text-xs">
              {(['7d', '14d', '30d'] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => onSelectTimeWindow(w)}
                  className={`px-2 py-1 rounded-md transition-all ${
                    timeWindow === w ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {w.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions Strip */}
          <div className="flex items-center gap-2">
            {/* Waste Audit Lead Magnet */}
            <button
              onClick={onOpenAudit}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/40 text-rose-300 hover:text-rose-200 hover:border-rose-400 transition-all shadow-sm"
              title="Generate 24h Creative Waste Audit for DTC clients"
            >
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              <span>Waste Audit Lead Magnet</span>
            </button>

            {/* Notifications / Anomaly Alerts */}
            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Slack / Teams Webhook Alerts"
            >
              <Bell className="w-4 h-4" />
              {fatiguedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow">
                  {fatiguedCount}
                </span>
              )}
            </button>

            {/* Ingest / Sync Creatives */}
            <button
              onClick={onOpenIngest}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync Ad Creatives</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 border-t border-slate-800/80 -mb-px overflow-x-auto text-xs font-medium">
          <button
            onClick={() => onChangeTab('radar')}
            className={`py-2.5 px-4 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'radar'
                ? 'border-indigo-500 text-indigo-400 font-semibold bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Fatigue Radar & Live Triage
            {fatiguedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold">
                {fatiguedCount} alert{fatiguedCount > 1 ? 's' : ''}
              </span>
            )}
          </button>

          <button
            onClick={() => onChangeTab('leaderboard')}
            className={`py-2.5 px-4 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'border-indigo-500 text-indigo-400 font-semibold bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Hook Leaderboard & Archetypes (0-3s)
          </button>

          <button
            onClick={() => onChangeTab('audit')}
            className={`py-2.5 px-4 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-indigo-500 text-indigo-400 font-semibold bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Client White-Label Report
          </button>

          <button
            onClick={() => onChangeTab('integrations')}
            className={`py-2.5 px-4 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'integrations'
                ? 'border-indigo-500 text-indigo-400 font-semibold bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Module 1: Ingestion & Webhooks
          </button>
        </div>
      </div>
    </header>
  );
};
