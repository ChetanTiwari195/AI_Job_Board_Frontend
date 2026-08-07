import React, { useState, useEffect } from 'react';
import { Save, ExternalLink, CheckCircle, AlertCircle, Link2, Clock } from 'lucide-react';
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
            setSuccessMsg('Settings saved successfully!');
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            setErrorMsg('Failed to save settings. Make sure the backend is running.');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100">Settings</h1>
                <p className="text-gray-400 mt-1">Manage your job board preferences</p>
            </div>

            {successMsg && (
                <div className="mb-6 p-4 bg-green-900/50 border border-green-500/50 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <p className="text-green-200">{successMsg}</p>
                </div>
            )}

            {errorMsg && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-200">{errorMsg}</p>
                </div>
            )}

            <div className="space-y-6">
                {/* HiringCafe URL Configuration */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-pink-500/20 rounded-lg">
                            <Link2 className="w-5 h-5 text-pink-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-200">HiringCafe Search URL</h3>
                            <p className="text-sm text-gray-500">Your personalized job search feed</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-400 mb-2">How to get your URL:</h4>
                            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                                <li>Go to <a href="https://hiringcafe.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">hiringcafe.com <ExternalLink className="w-3 h-3 inline" /></a></li>
                                <li>Set your filters (location, department, seniority, etc.)</li>
                                <li>Copy the full URL from your browser's address bar</li>
                                <li>Paste it below and save</li>
                            </ol>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Search URL</label>
                            <textarea
                                value={settings.hiringcafe_url || ''}
                                onChange={(e) => setSettings({ ...settings, hiringcafe_url: e.target.value || null })}
                                placeholder="https://hiringcafe.com/?searchState=..."
                                rows={3}
                                className="w-full bg-gray-950 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-600 transition-all font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                The scraper will use this URL to find jobs matching your filters. You can update it anytime.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scraper Configuration */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Clock className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-200">Scraper Configuration</h3>
                            <p className="text-sm text-gray-500">Control automatic job fetching</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Refresh Interval (hours)</label>
                            <input 
                                type="number" 
                                value={settings.scraper_interval_hours}
                                onChange={(e) => setSettings({ ...settings, scraper_interval_hours: parseInt(e.target.value) || 6 })}
                                min={1}
                                max={168}
                                className="w-full bg-gray-950 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2 text-gray-200 transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Jobs will be automatically refreshed at this interval. Default: every 6 hours.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Active Sources</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 text-gray-300">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900" />
                                    HiringCafe
                                </label>
                                <label className="flex items-center gap-3 text-gray-500 cursor-not-allowed">
                                    <input type="checkbox" disabled className="w-4 h-4 rounded bg-gray-800 border-gray-700" />
                                    Greenhouse (Coming Soon)
                                </label>
                                <label className="flex items-center gap-3 text-gray-500 cursor-not-allowed">
                                    <input type="checkbox" disabled className="w-4 h-4 rounded bg-gray-800 border-gray-700" />
                                    Lever (Coming Soon)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </div>
        </div>
    );
};
