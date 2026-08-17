import React, { useState, useEffect } from 'react';
import { Save, ExternalLink, CheckCircle2, AlertCircle, Link2, Clock, Check } from 'lucide-react';
import { getSettings, updateSettings, type UserSettings } from '../services/api';

export const Settings: React.FC = () => {
    const [settings, setSettings] = useState<UserSettings>({
        hiringcafe_url: null,
        scraper_interval_hours: 6
    });
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await getSettings();
                setSettings(data);
            } catch (err) {
                console.error("Failed to load settings", err);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setSuccessMsg(null);
        setErrorMsg(null);
        try {
            const updated = await updateSettings(settings);
            setSettings(updated);
            setSuccessMsg('Preferences saved successfully!');
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            setErrorMsg('Failed to save settings. Make sure the backend server is reachable.');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/60">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Settings
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Configure search sources, automation triggers, and scraping intervals
                    </p>
                </div>
            </div>

            {/* Notifications */}
            {successMsg && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center gap-3 text-sm text-emerald-700 dark:text-emerald-300 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <p>{successMsg}</p>
                </div>
            )}

            {errorMsg && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-center gap-3 text-sm text-rose-700 dark:text-rose-300 animate-fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <p>{errorMsg}</p>
                </div>
            )}

            <div className="space-y-6">
                {/* HiringCafe URL Configuration Card */}
                <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                            <Link2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                HiringCafe Search Feed
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Connect your personalized filter URL to fetch target postings
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl p-4 space-y-2">
                        <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            Setup instructions:
                        </h4>
                        <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                            <li>Visit <a href="https://hiringcafe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1">hiringcafe.com <ExternalLink className="w-3 h-3" /></a></li>
                            <li>Set your custom role, location, remote, and seniority filters.</li>
                            <li>Copy the resulting URL from your browser's address bar.</li>
                            <li>Paste it below and click "Save Preferences".</li>
                        </ol>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Search URL
                        </label>
                        <textarea
                            value={settings.hiringcafe_url || ''}
                            onChange={(e) => setSettings({ ...settings, hiringcafe_url: e.target.value || null })}
                            placeholder="https://hiringcafe.com/?searchState=..."
                            rows={3}
                            className="w-full bg-slate-50 dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all leading-relaxed"
                        />
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                            The background scraper queries this endpoint at regular intervals.
                        </p>
                    </div>
                </div>

                {/* Scraper Configuration Card */}
                <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Automation & Sources
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Manage frequency and connected platforms
                            </p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Refresh Interval (hours)
                            </label>
                            <input 
                                type="number" 
                                value={settings.scraper_interval_hours}
                                onChange={(e) => setSettings({ ...settings, scraper_interval_hours: parseInt(e.target.value) || 6 })}
                                min={1}
                                max={168}
                                className="w-full max-w-xs bg-slate-50 dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                                Default: 6 hours. Lower intervals fetch fresher listings more frequently.
                            </p>
                        </div>

                        <div className="pt-2">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                                Job Board Connectors
                            </label>
                            <div className="space-y-2 max-w-md">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0c1220] border border-slate-200/80 dark:border-slate-800">
                                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">HiringCafe</span>
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/40">
                                        <Check className="w-3 h-3" /> Active
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-[#0c1220]/50 border border-slate-200/50 dark:border-slate-800/50 opacity-60">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Greenhouse Direct</span>
                                    <span className="text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                        Coming Soon
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-[#0c1220]/50 border border-slate-200/50 dark:border-slate-800/50 opacity-60">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Lever Direct</span>
                                    <span className="text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                        Coming Soon
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all duration-150 disabled:opacity-50 cursor-pointer"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
