import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  Send, 
  Check, 
  ShieldAlert, 
  Pause, 
  Play, 
  ExternalLink,
  MessageSquare,
  Wand2
} from 'lucide-react';
import { SlackAlert, CreativeAd } from '../types';

interface SlackAlertsModalProps {
  alerts: SlackAlert[];
  creatives: CreativeAd[];
  onClose: () => void;
  onOpenBriefGenerator: (creative: CreativeAd) => void;
  onTogglePauseAd: (creativeId: string) => void;
  onSendCustomAlert: (title: string, message: string) => void;
}

export const SlackAlertsModal: React.FC<SlackAlertsModalProps> = ({
  alerts,
  creatives,
  onClose,
  onOpenBriefGenerator,
  onTogglePauseAd,
  onSendCustomAlert,
}) => {
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T00/B00/growth-alerts');
  const [cfiThreshold, setCfiThreshold] = useState('75');
  const [testSent, setTestSent] = useState(false);

  const handleSendTestWebhook = () => {
    onSendCustomAlert(
      '🚨 [FATIGUE ALERT] Creative Saturation Triggered',
      'Ad UGC_HydraSerum_SplitFace_V3 crossed CFI 86 (Frequency: 2.74, Thumbstop dropped -45%). Recommend rotating 0-3s hook immediately.'
    );
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Real-Time Slack / Teams Fatigue Alerts
              </h3>
              <p className="text-xs text-slate-400">
                Instant anomaly notifications when high-budget ads enter fatigue status (CFI &ge; {cfiThreshold})
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

        {/* Webhook Configuration Strip */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Incoming Webhook URL</label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Alert Trigger Threshold</label>
              <select
                value={cfiThreshold}
                onChange={(e) => setCfiThreshold(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="70">CFI &ge; 70 (Early Warning)</option>
                <option value="75">CFI &ge; 75 (Standard Fatigue)</option>
                <option value="80">CFI &ge; 80 (Critical Burn Only)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400 text-[11px]">
              Channel: <strong className="text-slate-200">#growth-media-buyers</strong>
            </span>
            <button
              onClick={handleSendTestWebhook}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all"
            >
              {testSent ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              <span>{testSent ? 'Simulated Alert Sent!' : 'Send Test Alert'}</span>
            </button>
          </div>
        </div>

        {/* Live Alerts Stream */}
        <div className="p-5 overflow-y-auto space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Recent Anomaly Notifications ({alerts.length})</span>
            <span className="text-[10px] text-slate-500">Auto-generated by HookMetrics Engine</span>
          </h4>

          {alerts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No creative fatigue alerts recorded in this time window.
            </div>
          ) : (
            alerts.map((alert) => {
              const matchedCreative = creatives.find((c) => c.id === alert.creativeId);

              return (
                <div
                  key={alert.id}
                  className="bg-slate-950 border border-rose-500/30 rounded-xl p-4 space-y-2.5 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{alert.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            CFI: {alert.cfi}/100
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 whitespace-nowrap font-mono">
                      {alert.timestamp}
                    </div>
                  </div>

                  {/* Actions inside alert notification */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Frequency: <strong className="text-amber-400">{alert.frequency.toFixed(2)}x</strong></span>
                      <span>•</span>
                      <span>Thumbstop Drop: <strong className="text-rose-400">-{alert.thumbstopDropPct}%</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      {matchedCreative && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenBriefGenerator(matchedCreative);
                          }}
                          className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold text-[11px]"
                        >
                          <Wand2 className="w-3 h-3" />
                          <span>1-Click Brief</span>
                        </button>
                      )}

                      <button
                        onClick={() => onTogglePauseAd(alert.creativeId)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                          alert.paused
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-rose-600/80 hover:bg-rose-600 text-white'
                        }`}
                      >
                        {alert.paused ? 'Paused in Ad Manager' : 'Pause Ad'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
