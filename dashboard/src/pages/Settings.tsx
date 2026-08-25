import React, { useState, useEffect } from 'react';
import { Save, ExternalLink, CheckCircle2, AlertCircle, Link2, Clock, Check } from 'lucide-react';
import { getSettings, updateSettings, type UserSettings } from '../services/api';

// ── Inline alert ───────────────────────────────────────────────────────────
const Alert: React.FC<{ type: 'success' | 'error'; msg: string }> = ({ type, msg }) => {
  const isSuccess = type === 'success';
  return (
    <div className={`animate-fade-in flex items-center gap-2.5 px-4 py-3 rounded-lg border text-sm font-light mb-5 ${isSuccess ? 'border-[var(--s-success-border)] bg-[var(--s-success-bg)] text-[var(--s-success-text)]' : 'border-[var(--s-danger-border)] bg-[var(--s-danger-bg)] text-[var(--s-danger-text)]'}`}>
      {isSuccess ? <CheckCircle2 size={16} className="shrink-0 text-[var(--s-success)]" /> : <AlertCircle size={16} className="shrink-0 text-[var(--s-danger)]" />}
      {msg}
    </div>
  );
};

// ── Settings card ──────────────────────────────────────────────────────────
const SettingsCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }> = ({ icon, title, subtitle, children }) => (
  <div className="card p-7 mb-5">
    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[var(--border-subtle)]">
      <div className="w-[38px] h-[38px] rounded-md bg-blue-600/10 flex items-center justify-center text-[var(--primary)] shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-base font-normal text-[var(--text-primary)] tracking-tight">{title}</div>
        <div className="text-[13px] font-light text-[var(--text-muted)] mt-0.5">{subtitle}</div>
      </div>
    </div>
    {children}
  </div>
);

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({ hiringcafe_url: null, scraper_interval_hours: 6 });
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error);
  }, []);

  const handleSave = async () => {
    setIsSaving(true); setSuccessMsg(null); setErrorMsg(null);
    try {
      setSettings(await updateSettings(settings));
      setSuccessMsg('Preferences saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      setErrorMsg('Failed to save settings. Make sure the backend server is reachable.');
    } finally { setIsSaving(false); }
  };

  return (
    <div className="py-7 px-8 max-w-[800px] mx-auto">
      {/* Header */}
      <div className="pb-5 border-b border-[var(--border-subtle)] mb-7">
        <h1 className="text-[26px] font-light text-[var(--text-primary)] tracking-tight m-0 [font-feature-settings:'ss01']">Settings</h1>
        <p className="text-sm font-light text-[var(--text-muted)] mt-1 mb-0">Configure search sources, automation triggers, and scraping intervals</p>
      </div>

      {successMsg && <Alert type="success" msg={successMsg} />}
      {errorMsg && <Alert type="error" msg={errorMsg} />}

      {/* HiringCafe card */}
      <SettingsCard icon={<Link2 size={18} />} title="HiringCafe Search Feed" subtitle="Connect your personalized filter URL to fetch target postings">
        {/* Setup box */}
        <div className="bg-indigo-600/5 border border-indigo-600/10 rounded-lg py-4 px-5 mb-5">
          <div className="text-[11px] font-normal text-[var(--primary)] tracking-wide uppercase mb-2.5">Setup instructions</div>
          <ol className="text-[13px] font-light text-[var(--text-secondary)] pl-4 m-0 flex flex-col gap-1.5 leading-relaxed">
            <li>Visit <a href="https://hiringcafe.com" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] no-underline font-normal">hiringcafe.com <ExternalLink size={10} className="inline align-middle" /></a></li>
            <li>Set your role, location, remote, and seniority filters.</li>
            <li>Copy the resulting URL from your browser's address bar.</li>
            <li>Paste it below and click "Save Preferences".</li>
          </ol>
        </div>

        <label className="block text-[11px] font-normal text-[var(--text-muted)] tracking-wide uppercase mb-2">Search URL</label>
        <textarea
          value={settings.hiringcafe_url || ''}
          onChange={e => setSettings({ ...settings, hiringcafe_url: e.target.value || null })}
          placeholder="https://hiringcafe.com/?searchState=…"
          rows={3}
          className="s-input font-mono text-xs leading-relaxed resize-y"
        />
        <p className="text-xs font-light text-[var(--text-muted)] mt-1.5">
          The background scraper queries this endpoint at regular intervals.
        </p>
      </SettingsCard>

      {/* Automation card */}
      <SettingsCard icon={<Clock size={18} />} title="Automation & Sources" subtitle="Manage frequency and connected platforms">
        <label className="block text-[11px] font-normal text-[var(--text-muted)] tracking-wide uppercase mb-2">Refresh Interval (hours)</label>
        <input
          type="number" value={settings.scraper_interval_hours}
          onChange={e => setSettings({ ...settings, scraper_interval_hours: parseInt(e.target.value) || 6 })}
          min={1} max={168}
          className="s-input max-w-[160px] text-[15px]"
        />
        <p className="text-xs font-light text-[var(--text-muted)] mt-1.5 mb-6">
          Default: 6 hours. Lower intervals fetch fresher listings more frequently.
        </p>

        <label className="block text-[11px] font-normal text-[var(--text-muted)] tracking-wide uppercase mb-2">Job Board Connectors</label>
        <div className="flex flex-col gap-2 max-w-[440px]">
          <div className="flex items-center justify-between py-2.5 px-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <span className="text-sm font-normal text-[var(--text-primary)]">HiringCafe</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-normal text-[var(--s-success)] bg-[var(--s-success-bg)] border border-[var(--s-success-border)] py-0.5 px-2 rounded-full">
              <Check size={10} /> Active
            </span>
          </div>
          {["Greenhouse Direct", "Lever Direct"].map(name => (
            <div key={name} className="flex items-center justify-between py-2.5 px-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] opacity-55">
              <span className="text-sm font-light text-[var(--text-muted)]">{name}</span>
              <span className="text-[11px] font-light text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] py-0.5 px-2 rounded-full">Coming soon</span>
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Save button */}
      <div className="flex justify-end pt-2">
        <button onClick={handleSave} disabled={isSaving} className="btn-primary text-sm py-2.5 px-6">
          {isSaving
            ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
            : <><Save size={14} /> Save Preferences</>
          }
        </button>
      </div>
    </div>
  );
};
