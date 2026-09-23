import React, { useState, useMemo } from 'react';
import { 
  mockAccounts, 
  mockCreatives, 
  mockAlerts 
} from './data/mockData';
import { 
  CreativeAd, 
  AdAccount, 
  PlatformType, 
  SlackAlert,
  CreativeHealthStatus
} from './types';

// Components
import { Header } from './components/Header';
import { KpiMetricsStrip } from './components/KpiMetricsStrip';
import { FatigueRadarTab } from './components/FatigueRadarTab';
import { HookLeaderboardTab } from './components/HookLeaderboardTab';
import { ClientReportTab } from './components/ClientReportTab';
import { IntegrationsTab } from './components/IntegrationsTab';

// Modals
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { BriefGeneratorModal } from './components/BriefGeneratorModal';
import { WasteAuditModal } from './components/WasteAuditModal';
import { IngestModal } from './components/IngestModal';
import { SlackAlertsModal } from './components/SlackAlertsModal';

export default function App() {
  // Accounts & Selection
  const [accounts, setAccounts] = useState<AdAccount[]>(mockAccounts);
  const [selectedAccount, setSelectedAccount] = useState<AdAccount>(mockAccounts[0]);

  // Filters & Timeframe
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('all');
  const [timeWindow, setTimeWindow] = useState<'7d' | '14d' | '30d'>('7d');
  const [activeTab, setActiveTab] = useState<'radar' | 'leaderboard' | 'audit' | 'integrations'>('radar');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scaling' | 'warning' | 'fatigued'>('all');

  // Creative Dataset
  const [creatives, setCreatives] = useState<CreativeAd[]>(mockCreatives);
  const [alerts, setAlerts] = useState<SlackAlert[]>(mockAlerts);

  // Modals
  const [activeVideoAd, setActiveVideoAd] = useState<CreativeAd | null>(null);
  const [activeBriefAd, setActiveBriefAd] = useState<CreativeAd | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState<boolean>(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState<boolean>(false);

  // Filtered creatives for current selected account and platform
  const accountCreatives = useMemo(() => {
    return creatives.filter((c) => {
      if (c.adAccountId !== selectedAccount.id) return false;
      if (selectedPlatform !== 'all' && c.platform !== selectedPlatform) return false;
      return true;
    });
  }, [creatives, selectedAccount.id, selectedPlatform]);

  const fatiguedCount = useMemo(() => {
    return accountCreatives.filter((c) => c.healthStatus === 'fatigued').length;
  }, [accountCreatives]);

  // Actions
  const handleTogglePauseAd = (creativeId: string) => {
    setCreatives((prev) =>
      prev.map((c) => {
        if (c.id === creativeId) {
          const isFatigued = c.healthStatus === 'fatigued';
          // Mark as paused / recovered
          return {
            ...c,
            healthStatus: isFatigued ? ('warning' as CreativeHealthStatus) : c.healthStatus,
            cfi: Math.max(20, c.cfi - 25),
          };
        }
        return c;
      })
    );

    // Update alert status
    setAlerts((prev) =>
      prev.map((a) => (a.creativeId === creativeId ? { ...a, paused: true } : a))
    );
  };

  const handleAddCreative = (newCreative: CreativeAd) => {
    setCreatives((prev) => [newCreative, ...prev]);
  };

  const handleSendCustomAlert = (title: string, message: string) => {
    const newAlert: SlackAlert = {
      id: `al_${Date.now()}`,
      creativeId: creatives[0]?.id || 'custom',
      creativeName: creatives[0]?.name || 'Ad Asset',
      brandName: selectedAccount.name,
      severity: 'critical',
      timestamp: 'Just now',
      cfi: 86,
      frequency: 2.74,
      thumbstopDropPct: 45,
      title,
      message,
      paused: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Navigation Header */}
      <Header
        accounts={accounts}
        selectedAccount={selectedAccount}
        onSelectAccount={setSelectedAccount}
        selectedPlatform={selectedPlatform}
        onSelectPlatform={setSelectedPlatform}
        timeWindow={timeWindow}
        onSelectTimeWindow={setTimeWindow}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        fatiguedCount={fatiguedCount}
        onOpenAudit={() => setIsAuditModalOpen(true)}
        onOpenIngest={() => setIsIngestModalOpen(true)}
        onOpenAlerts={() => setIsAlertsModalOpen(true)}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Executive KPI Metrics Strip */}
        <KpiMetricsStrip
          creatives={accountCreatives}
          account={selectedAccount}
          onFilterByStatus={(status) => {
            setStatusFilter(status);
            setActiveTab('radar');
          }}
        />

        {/* Tab 1: Fatigue Radar & Live Triage */}
        {activeTab === 'radar' && (
          <FatigueRadarTab
            creatives={accountCreatives}
            statusFilter={statusFilter}
            onSetStatusFilter={setStatusFilter}
            onOpenVideoLab={(ad) => setActiveVideoAd(ad)}
            onOpenBriefGenerator={(ad) => setActiveBriefAd(ad)}
            onTogglePauseAd={handleTogglePauseAd}
          />
        )}

        {/* Tab 2: Hook Leaderboard & Archetypes (0-3s) */}
        {activeTab === 'leaderboard' && (
          <HookLeaderboardTab
            creatives={accountCreatives}
            onOpenVideoLab={(ad) => setActiveVideoAd(ad)}
            onOpenBriefGenerator={(ad) => setActiveBriefAd(ad)}
          />
        )}

        {/* Tab 3: Client White-Label Report */}
        {activeTab === 'audit' && (
          <ClientReportTab
            account={selectedAccount}
            creatives={accountCreatives}
            onOpenBriefGenerator={(ad) => setActiveBriefAd(ad)}
          />
        )}

        {/* Tab 4: Module 1 Ingestion & Architecture */}
        {activeTab === 'integrations' && (
          <IntegrationsTab
            account={selectedAccount}
            onOpenIngestModal={() => setIsIngestModalOpen(true)}
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">HookMetrics Engine</span>
            <span>•</span>
            <span>The Video Ad Hook & Creative Fatigue Intelligence System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Continuous 0–3s Milestone Isolation</span>
            <span>•</span>
            <span>Composite Fatigue Index (CFI)</span>
            <span>•</span>
            <span>Attribution True ROAS Sync</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activeVideoAd && (
        <VideoPlayerModal
          creative={activeVideoAd}
          onClose={() => setActiveVideoAd(null)}
          onOpenBriefGenerator={(creative) => {
            setActiveVideoAd(null);
            setActiveBriefAd(creative);
          }}
        />
      )}

      {activeBriefAd && (
        <BriefGeneratorModal
          creative={activeBriefAd}
          onClose={() => setActiveBriefAd(null)}
          onSendToSlackAlerts={handleSendCustomAlert}
        />
      )}

      {isAuditModalOpen && (
        <WasteAuditModal
          account={selectedAccount}
          creatives={accountCreatives}
          onClose={() => setIsAuditModalOpen(false)}
          onOpenBriefGenerator={(creative) => {
            setIsAuditModalOpen(false);
            setActiveBriefAd(creative);
          }}
        />
      )}

      {isIngestModalOpen && (
        <IngestModal
          currentAccount={selectedAccount}
          onClose={() => setIsIngestModalOpen(false)}
          onAddCreative={handleAddCreative}
        />
      )}

      {isAlertsModalOpen && (
        <SlackAlertsModal
          alerts={alerts}
          creatives={accountCreatives}
          onClose={() => setIsAlertsModalOpen(false)}
          onOpenBriefGenerator={(creative) => {
            setIsAlertsModalOpen(false);
            setActiveBriefAd(creative);
          }}
          onTogglePauseAd={handleTogglePauseAd}
          onSendCustomAlert={handleSendCustomAlert}
        />
      )}
    </div>
  );
}
