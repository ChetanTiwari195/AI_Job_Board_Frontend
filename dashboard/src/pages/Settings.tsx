import React, { useState, useEffect } from 'react';
import { Save, ExternalLink, CheckCircle2, AlertCircle, Link2, Clock, Check } from 'lucide-react';
import { getSettings, updateSettings, type UserSettings } from '../services/api';

// ── Inline alert ───────────────────────────────────────────────────────────
const Alert: React.FC<{ type: 'success' | 'error'; msg: string }> = ({ type, msg }) => {
  const isSuccess = type === 'success';
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, border: `1px solid var(--s-${isSuccess ? 'success' : 'danger'}-border)`, background: `var(--s-${isSuccess ? 'success' : 'danger'}-bg)`, color: `var(--s-${isSuccess ? 'success' : 'danger'}-text)`, fontSize: 14, fontWeight: 300, marginBottom: 20, animationName: "fadeUp", animationDuration: "0.2s", animationFillMode: "forwards" }}>
      {isSuccess ? <CheckCircle2 size={16} style={{ flexShrink: 0, color: "var(--s-success)" }} /> : <AlertCircle size={16} style={{ flexShrink: 0, color: "var(--s-danger)" }} />}
      {msg}
    </div>
  );
};

// ── Settings card ──────────────────────────────────────────────────────────
const SettingsCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }> = ({ icon, title, subtitle, children }) => (
  <div className="card" style={{ padding: 28, marginBottom: 20 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--border-subtle)" }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(37,99,235,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 400, color: "var(--text-primary)", letterSpacing: "-0.2px" }}>{title}</div>
        <div style={{ fontSize: 13, fontWeight: 300, color: "var(--text-muted)", marginTop: 2 }}>{subtitle}</div>
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

  const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 400, color: "var(--text-muted)", letterSpacing: "0.1px", textTransform: "uppercase", marginBottom: 8 };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ paddingBottom: 20, borderBottom: "1px solid var(--border-subtle)", marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 300, color: "var(--text-primary)", letterSpacing: "-0.64px", margin: 0, fontFeatureSettings: '"ss01"' }}>Settings</h1>
        <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)", margin: "4px 0 0" }}>Configure search sources, automation triggers, and scraping intervals</p>
      </div>

      {successMsg && <Alert type="success" msg={successMsg} />}
      {errorMsg && <Alert type="error" msg={errorMsg} />}

      {/* HiringCafe card */}
      <SettingsCard icon={<Link2 size={18} />} title="HiringCafe Search Feed" subtitle="Connect your personalized filter URL to fetch target postings">
        {/* Setup box */}
        <div style={{ background: "rgba(83,58,253,0.04)", border: "1px solid rgba(83,58,253,0.12)", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 400, color: "var(--primary)", letterSpacing: "0.1px", textTransform: "uppercase", marginBottom: 10 }}>Setup instructions</div>
          <ol style={{ fontSize: 13, fontWeight: 300, color: "var(--text-secondary)", paddingLeft: 16, margin: 0, display: "flex", flexDirection: "column", gap: 6, lineHeight: 1.5 }}>
            <li>Visit <a href="https://hiringcafe.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 400 }}>hiringcafe.com <ExternalLink size={10} style={{ display: "inline", verticalAlign: "middle" }} /></a></li>
            <li>Set your role, location, remote, and seniority filters.</li>
            <li>Copy the resulting URL from your browser's address bar.</li>
            <li>Paste it below and click "Save Preferences".</li>
          </ol>
        </div>

        <label style={labelStyle}>Search URL</label>
        <textarea
          value={settings.hiringcafe_url || ''}
          onChange={e => setSettings({ ...settings, hiringcafe_url: e.target.value || null })}
          placeholder="https://hiringcafe.com/?searchState=…"
          rows={3}
          className="s-input"
          style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 12, lineHeight: 1.6, resize: "vertical" }}
        />
        <p style={{ fontSize: 12, fontWeight: 300, color: "var(--text-muted)", marginTop: 6 }}>
          The background scraper queries this endpoint at regular intervals.
        </p>
      </SettingsCard>

      {/* Automation card */}
      <SettingsCard icon={<Clock size={18} />} title="Automation & Sources" subtitle="Manage frequency and connected platforms">
        <label style={labelStyle}>Refresh Interval (hours)</label>
        <input
          type="number" value={settings.scraper_interval_hours}
          onChange={e => setSettings({ ...settings, scraper_interval_hours: parseInt(e.target.value) || 6 })}
          min={1} max={168}
          className="s-input"
          style={{ maxWidth: 160, fontSize: 15 }}
        />
        <p style={{ fontSize: 12, fontWeight: 300, color: "var(--text-muted)", marginTop: 6, marginBottom: 24 }}>
          Default: 6 hours. Lower intervals fetch fresher listings more frequently.
        </p>

        <label style={labelStyle}>Job Board Connectors</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 440 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-primary)" }}>HiringCafe</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 400, color: "var(--s-success)", background: "var(--s-success-bg)", border: "1px solid var(--s-success-border)", padding: "3px 8px", borderRadius: 9999 }}>
              <Check size={10} /> Active
            </span>
          </div>
          {["Greenhouse Direct", "Lever Direct"].map(name => (
            <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", opacity: 0.55 }}>
              <span style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)" }}>{name}</span>
              <span style={{ fontSize: 11, fontWeight: 300, color: "var(--text-muted)", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", padding: "3px 8px", borderRadius: 9999 }}>Coming soon</span>
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Save button */}
      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary" style={{ fontSize: 14, padding: "10px 24px" }}>
          {isSaving
            ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Saving…</>
            : <><Save size={14} /> Save Preferences</>
          }
        </button>
      </div>
    </div>
  );
};
