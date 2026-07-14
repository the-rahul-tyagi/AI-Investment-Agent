"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Brain,
  PieChart as PieIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Layers
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";

interface Holding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  buyPrice: number;
  sector: string;
  currentPrice: number;
}

interface PortfolioAnalysis {
  "Diversification Score": number | string;
  "Risk Score": number | string;
  "Sector Allocation"?: Record<string, string | number>;
  "Strengths": string[];
  "Weaknesses": string[];
  "Missing Sectors": string[];
  "Portfolio Recommendation": string;
}

const SECTORS = [
  "Technology",
  "Financials",
  "Healthcare",
  "Consumer Cyclical",
  "Consumer Defensive",
  "Communication Services",
  "Industrials",
  "Energy",
  "Utilities",
  "Real Estate",
  "Basic Materials",
];

const COLORS = [
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#fbbf24", // amber
  "#ef4444", // red
  "#3b82f6", // blue
  "#f97316", // orange
  "#a855f7", // purple-mid
  "#14b8a6", // teal
  "#84cc16", // lime
];

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [shares, setShares] = useState<number | "">("");
  const [buyPrice, setBuyPrice] = useState<number | "">("");
  const [sector, setSector] = useState(SECTORS[0]);

  // AI Diagnostic states
  const [analysis, setAnalysis] = useState<PortfolioAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load holdings from local storage
  useEffect(() => {
    const saved = localStorage.getItem("portfolio_holdings");
    if (saved) {
      setHoldings(JSON.parse(saved));
    }
  }, []);

  // Save holdings to local storage
  const saveHoldings = (updated: Holding[]) => {
    setHoldings(updated);
    localStorage.setItem("portfolio_holdings", JSON.stringify(updated));
  };

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim() || !name.trim() || !shares || !buyPrice) return;

    // Simulate current price (adding random 5% to 20% growth/loss)
    const simulatedFluctuation = 0.95 + Math.random() * 0.25; // between -5% and +20%
    const currentPrice = Number((Number(buyPrice) * simulatedFluctuation).toFixed(2));

    const newHolding: Holding = {
      id: Date.now().toString(),
      symbol: symbol.trim().toUpperCase(),
      name: name.trim(),
      shares: Number(shares),
      buyPrice: Number(buyPrice),
      sector,
      currentPrice,
    };

    const updated = [...holdings, newHolding];
    saveHoldings(updated);

    // Reset inputs
    setSymbol("");
    setName("");
    setShares("");
    setBuyPrice("");
  };

  const handleDeleteHolding = (id: string) => {
    const updated = holdings.filter((h) => h.id !== id);
    saveHoldings(updated);
  };

  // Perform AI Analysis
  const handleAnalyzePortfolio = async () => {
    if (holdings.length === 0) return;
    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          holdings: holdings.map((h) => ({
            symbol: h.symbol,
            name: h.name,
            shares: h.shares,
            buyPrice: h.buyPrice,
            sector: h.sector,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Portfolio analysis failed.");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to analyze portfolio.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.buyPrice, 0);
  const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPct = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  // Prepare sector allocation chart data
  const sectorMap = holdings.reduce<Record<string, number>>((acc, h) => {
    const val = h.shares * h.currentPrice;
    acc[h.sector] = (acc[h.sector] || 0) + val;
    return acc;
  }, {});

  const sectorChartData = Object.keys(sectorMap).map((sec) => ({
    name: sec,
    value: Number(sectorMap[sec].toFixed(2)),
  }));

  // Clean score numeric values
  const getNumericScore = (val: string | number) => {
    if (typeof val === "number") return val;
    const num = parseInt(val, 10);
    return isNaN(num) ? 75 : num; // default fallback
  };

  return (
    <main className="container-custom py-12 space-y-8">
      {/* Page Header */}
      <div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
          💼 Portfolio Intelligence Tracker
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-black text-white tracking-tight">
          AI Portfolio Manager
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-3xl">
          Construct your portfolio, evaluate sector exposures, and run an advanced CFA-level multi-agent diagnostic on your investments.
        </p>
      </div>

      {/* Grid: Form + Summary Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Form */}
        <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-[#030712] p-6 shadow-xl border border-white/5 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2 mb-4">
              <Plus size={18} className="text-emerald-400" />
              Add Asset
            </h2>

            <form onSubmit={handleAddHolding} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Ticker Symbol
                </label>
                <input
                  type="text"
                  required
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. AAPL"
                  className="mt-1 w-full rounded-xl border border-white/5 bg-slate-900/60 p-3 text-sm text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Asset Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apple Inc."
                  className="mt-1 w-full rounded-xl border border-white/5 bg-slate-900/60 p-3 text-sm text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Shares
                  </label>
                  <input
                    type="number"
                    required
                    min="0.0001"
                    step="any"
                    value={shares}
                    onChange={(e) => setShares(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 10"
                    className="mt-1 w-full rounded-xl border border-white/5 bg-slate-900/60 p-3 text-sm text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Avg Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="any"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 175.50"
                    className="mt-1 w-full rounded-xl border border-white/5 bg-slate-900/60 p-3 text-sm text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Sector Classification
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/5 bg-slate-900/60 p-3 text-sm text-white outline-none focus:border-emerald-500"
                >
                  {SECTORS.map((sec) => (
                    <option key={sec} value={sec} className="bg-slate-950 text-white">
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 py-3 text-sm font-bold text-white transition shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Plus size={16} /> Add Asset
              </button>
            </form>
          </div>
        </div>

        {/* Portfolio Summary Overview */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-slate-900/40 p-5 border border-white/5">
              <p className="text-[10px] uppercase font-bold text-slate-500">Invested Cost</p>
              <h3 className="text-2xl sm:text-3xl font-black mt-2 text-white">
                ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>

            <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-slate-900/40 p-5 border border-white/5">
              <p className="text-[10px] uppercase font-bold text-slate-500">Total Portfolio Value</p>
              <h3 className="text-2xl sm:text-3xl font-black mt-2 text-white">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>

            <div className={`card-premium bg-gradient-to-br p-5 border border-white/5 ${
              totalGainLoss >= 0 ? "from-emerald-950/20 border-emerald-500/20" : "from-rose-950/20 border-rose-500/20"
            }`}>
              <p className="text-[10px] uppercase font-bold text-slate-500">Unrealized P&L</p>
              <h3 className={`text-2xl sm:text-3xl font-black mt-2 flex items-center gap-1.5 ${
                totalGainLoss >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}>
                {totalGainLoss >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                {totalGainLoss >= 0 ? "+" : ""}${Math.abs(totalGainLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className={`text-xs font-bold mt-1 ${totalGainLoss >= 0 ? "text-emerald-400/80" : "text-rose-400/80"}`}>
                {totalGainLoss >= 0 ? "+" : ""}{totalGainLossPct.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Allocation charts */}
          <div className="card-premium bg-[#0b0f19]/60 p-6 border border-white/5 flex-1 min-h-[220px] flex flex-col md:flex-row items-center justify-around gap-6">
            {holdings.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm flex flex-col items-center gap-2">
                <PieIcon size={40} className="text-slate-600" />
                <p>No holdings added yet. Sector exposure will display here.</p>
              </div>
            ) : (
              <>
                <div className="w-full md:w-1/2 h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {sectorChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, "Allocation"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers size={14} className="text-emerald-400" />
                    Sector Weighting
                  </h4>
                  <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-2 scrollbar-thin">
                    {sectorChartData.map((item, idx) => {
                      const pct = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                      return (
                        <div key={item.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                            <span className="text-slate-300 truncate max-w-[120px]">{item.name}</span>
                          </div>
                          <span className="font-bold text-white">{pct.toFixed(1)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Asset Table */}
      {holdings.length > 0 && (
        <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-[#030712] shadow-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Current Asset Allocations</h2>
              <p className="text-xs text-slate-400 mt-1">Individual stock positions in portfolio</p>
            </div>
            <button
              onClick={handleAnalyzePortfolio}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-5 py-3 font-bold text-white text-sm shadow-md shadow-emerald-500/25 transition cursor-pointer disabled:opacity-50"
            >
              <Brain size={16} />
              {loading ? "Diagnosing Portfolio..." : "AI Portfolio Diagnostic"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/2">
                  <th className="p-4">Ticker</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Sector</th>
                  <th className="p-4 text-right">Shares</th>
                  <th className="p-4 text-right">Avg Price</th>
                  <th className="p-4 text-right">Current Price</th>
                  <th className="p-4 text-right">P&L</th>
                  <th className="p-4 text-right">Allocation</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {holdings.map((h) => {
                  const cost = h.shares * h.buyPrice;
                  const value = h.shares * h.currentPrice;
                  const gain = value - cost;
                  const gainPct = cost > 0 ? (gain / cost) * 100 : 0;
                  const allocPct = totalValue > 0 ? (value / totalValue) * 100 : 0;

                  return (
                    <tr key={h.id} className="hover:bg-white/2 transition">
                      <td className="p-4 font-bold text-emerald-400">{h.symbol}</td>
                      <td className="p-4 font-semibold text-white max-w-[150px] truncate">{h.name}</td>
                      <td className="p-4">
                        <span className="rounded bg-white/5 border border-white/5 px-2 py-0.5 text-xs text-slate-300">
                          {h.sector}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium">{h.shares}</td>
                      <td className="p-4 text-right font-medium">${h.buyPrice.toFixed(2)}</td>
                      <td className="p-4 text-right font-medium">${h.currentPrice.toFixed(2)}</td>
                      <td className={`p-4 text-right font-bold ${gain >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        ${gain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="block text-[10px] font-medium opacity-80">{gainPct.toFixed(1)}%</span>
                      </td>
                      <td className="p-4 text-right font-bold text-white">{allocPct.toFixed(1)}%</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteHolding(h.id)}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg border border-transparent hover:border-rose-500/10 hover:bg-rose-500/5 transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="card-premium bg-rose-950/20 border-rose-500/20 p-5 flex items-center gap-3 text-rose-400">
          <AlertCircle size={20} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* loading Diagnostic skeleton */}
      {loading && (
        <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-[#030712] p-8 border border-white/5 space-y-6 animate-pulse">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="h-8 w-8 rounded-lg bg-white/5" />
            <div className="h-6 w-48 bg-white/5 rounded" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="h-32 bg-white/5 rounded-xl" />
            <div className="h-32 bg-white/5 rounded-xl" />
          </div>
          <div className="h-40 bg-white/5 rounded-xl" />
        </div>
      )}

      {/* AI Diagnostic Report */}
      {analysis && (
        <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-[#030712] p-6 sm:p-8 border border-white/5 shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="flex items-center justify-between border-b border-white/5 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">AI Portfolio Diagnostic Report</h2>
                <p className="text-xs text-slate-400 mt-0.5">CFFA Level III Portfolio Analysis diagnostics</p>
              </div>
            </div>
            <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
              Analysis Ready
            </span>
          </div>

          {/* Scores Overview */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Diversification Score progress bar */}
            <div className="card-premium bg-[#111827]/40 p-6 border border-white/5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Diversification Rating</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-emerald-400">
                    {analysis["Diversification Score"]}
                  </span>
                  <span className="text-slate-500 font-semibold text-sm">/ 100</span>
                </div>
              </div>
              <div className="mt-6">
                <div className="h-2 w-full bg-white/5 border border-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                    style={{ width: `${getNumericScore(analysis["Diversification Score"])}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  Exposure score based on sector diversity and holdings correlation.
                </p>
              </div>
            </div>

            {/* Risk Score */}
            <div className="card-premium bg-[#111827]/40 p-6 border border-white/5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Exposure Score</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-amber-400">
                    {analysis["Risk Score"]}
                  </span>
                  <span className="text-slate-500 font-semibold text-sm">/ 100</span>
                </div>
              </div>
              <div className="mt-6">
                <div className="h-2 w-full bg-white/5 border border-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-400 rounded-full"
                    style={{ width: `${getNumericScore(analysis["Risk Score"])}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  Aggressive beta indicator. Higher score suggests higher volatility.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Lists */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Strengths */}
            <div className="card-premium bg-slate-900/30 p-6 border-l-4 border-l-emerald-500 border-y-white/5 border-r-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                Strengths
              </h3>
              <ul className="space-y-3">
                {analysis.Strengths?.map((str, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-300 leading-relaxed flex gap-2">
                    <span className="text-emerald-400 font-black">•</span>
                    <span>{str}</span>
                  </li>
                )) || <p className="text-xs text-slate-500">None detected</p>}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="card-premium bg-slate-900/30 p-6 border-l-4 border-l-amber-500 border-y-white/5 border-r-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-400" />
                Weaknesses
              </h3>
              <ul className="space-y-3">
                {analysis.Weaknesses?.map((wk, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-300 leading-relaxed flex gap-2">
                    <span className="text-amber-400 font-black">•</span>
                    <span>{wk}</span>
                  </li>
                )) || <p className="text-xs text-slate-500">None detected</p>}
              </ul>
            </div>

            {/* Missing Sectors */}
            <div className="card-premium bg-slate-900/30 p-6 border-l-4 border-l-rose-500 border-y-white/5 border-r-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldAlert size={16} className="text-rose-400" />
                Under-represented
              </h3>
              <ul className="space-y-3">
                {analysis["Missing Sectors"]?.map((sec, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-300 leading-relaxed flex gap-2">
                    <span className="text-rose-400 font-black">•</span>
                    <span>{sec}</span>
                  </li>
                )) || <p className="text-xs text-slate-500">Fully diversified</p>}
              </ul>
            </div>
          </div>

          {/* Advisory Recommendation */}
          <div className="card-premium bg-[#111827]/40 p-6 border border-white/5 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Brain size={18} className="text-emerald-400" />
              Strategic Manager Recommendation
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-wrap">
              {analysis["Portfolio Recommendation"]}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
