"use client";

import { useState, useEffect } from "react";
import { Settings, Shield, Key, Eye, EyeOff, Save, CheckCircle, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [googleKey, setGoogleKey] = useState("");
  const [fmpKey, setFmpKey] = useState("");
  const [gnewsKey, setGnewsKey] = useState("");
  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [showFmpKey, setShowFmpKey] = useState(false);
  const [showGnewsKey, setShowGnewsKey] = useState(false);

  // Investment settings
  const [riskTolerance, setRiskTolerance] = useState("Balanced");
  const [horizon, setHorizon] = useState("Long-term");
  const [model, setModel] = useState("gemini-flash-latest");

  useEffect(() => {
    setMounted(true);
    // Load settings from localStorage
    setGoogleKey(localStorage.getItem("settings_google_key") || "");
    setFmpKey(localStorage.getItem("settings_fmp_key") || "");
    setGnewsKey(localStorage.getItem("settings_gnews_key") || "");
    setRiskTolerance(localStorage.getItem("settings_risk_tolerance") || "Balanced");
    setHorizon(localStorage.getItem("settings_horizon") || "Long-term");
    setModel(localStorage.getItem("settings_model") || "gemini-flash-latest");
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("settings_google_key", googleKey);
    localStorage.setItem("settings_fmp_key", fmpKey);
    localStorage.setItem("settings_gnews_key", gnewsKey);
    localStorage.setItem("settings_risk_tolerance", riskTolerance);
    localStorage.setItem("settings_horizon", horizon);
    localStorage.setItem("settings_model", model);

    toast.success("Settings saved successfully!");
  };

  if (!mounted) return null;

  return (
    <main className="container-custom py-12 space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
          <Settings className="inline mr-1 animate-spin-slow" size={12} /> Configuration Control
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-black text-white tracking-tight">
          System Settings
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-2">
          Personalize the research engine, configure target risk appetites, and override server-side API keys.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Core preferences */}
        <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-[#030712] p-6 border border-white/5 shadow-xl space-y-6">
          <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Shield size={18} className="text-emerald-400" />
            Research Preferences
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Risk Profile</label>
              <select
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/5 bg-slate-900/60 p-3 text-sm text-white outline-none focus:border-emerald-500"
              >
                <option value="Conservative">Conservative (Capital Preservation)</option>
                <option value="Balanced">Balanced (Growth & Income)</option>
                <option value="Aggressive">Aggressive (High Volatility Growth)</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1.5">
                Influences AI recommendation criteria and portfolio diversification warnings.
              </p>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Investment Horizon</label>
              <select
                value={horizon}
                onChange={(e) => setHorizon(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/5 bg-slate-900/60 p-3 text-sm text-white outline-none focus:border-emerald-500"
              >
                <option value="Short-term">Short-term (1-12 months)</option>
                <option value="Medium-term">Medium-term (1-3 years)</option>
                <option value="Long-term">Long-term (3+ years)</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1.5">
                Adjusts context for the AI co-pilot and diagnostic advisor agent.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Gemini LLM Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/5 bg-slate-900/60 p-3 text-sm text-white outline-none focus:border-emerald-500"
              >
                <option value="gemini-flash-latest">Gemini 1.5 Flash (Fastest, Highly Efficient)</option>
                <option value="gemini-pro-latest">Gemini 1.5 Pro (Deep Analytical Reasoning)</option>
                <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental, State-of-the-Art)</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-[#030712] p-6 border border-white/5 shadow-xl space-y-6">
          <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Key size={18} className="text-emerald-400" />
            API Credentials (Overrides)
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            By default, the platform uses preconfigured server-side API keys. You can override them here. These are stored locally in your browser and never shared.
          </p>

          <div className="space-y-4">
            {/* Google Key */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Google Gemini API Key</label>
                <button
                  type="button"
                  onClick={() => setShowGoogleKey(!showGoogleKey)}
                  className="text-slate-500 hover:text-slate-300 transition p-1"
                >
                  {showGoogleKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <input
                type={showGoogleKey ? "text" : "password"}
                value={googleKey}
                onChange={(e) => setGoogleKey(e.target.value)}
                placeholder="AIzaSy..."
                className="mt-1 w-full rounded-xl border border-white/5 bg-slate-900/60 p-3 text-sm text-white outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* FMP Key */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Financial Modeling Prep API Key</label>
                <button
                  type="button"
                  onClick={() => setShowFmpKey(!showFmpKey)}
                  className="text-slate-500 hover:text-slate-300 transition p-1"
                >
                  {showFmpKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <input
                type={showFmpKey ? "text" : "password"}
                value={fmpKey}
                onChange={(e) => setFmpKey(e.target.value)}
                placeholder="fmp_api_key_..."
                className="mt-1 w-full rounded-xl border border-white/5 bg-slate-900/60 p-3 text-sm text-white outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* GNews Key */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">GNews API Key</label>
                <button
                  type="button"
                  onClick={() => setShowGnewsKey(!showGnewsKey)}
                  className="text-slate-500 hover:text-slate-300 transition p-1"
                >
                  {showGnewsKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <input
                type={showGnewsKey ? "text" : "password"}
                value={gnewsKey}
                onChange={(e) => setGnewsKey(e.target.value)}
                placeholder="gnews_api_key_..."
                className="mt-1 w-full rounded-xl border border-white/5 bg-slate-900/60 p-3 text-sm text-white outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex justify-center items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3 font-bold text-white text-sm transition shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          <Save size={16} /> Save Settings
        </button>
      </form>
    </main>
  );
}