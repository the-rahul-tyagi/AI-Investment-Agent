"use client";

import { useState } from "react";
import { useCompare } from "@/hooks/useCompare";
import { ArrowRight, Layers, HelpCircle, Check, Sparkles, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { InvestmentReport } from "@/types";

export default function ComparePage() {
  const [company1, setCompany1] = useState("AAPL");
  const [company2, setCompany2] = useState("MSFT");

  const {
    compare,
    left,
    right,
    loading,
    error,
  } = useCompare();

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company1.trim() || !company2.trim()) return;
    compare(company1.trim(), company2.trim());
  };

  // Helper to determine the winner of a metric
  // If lowerIsBetter is true (e.g. PE ratio, Debt to Equity), lower values win
  const getWinner = (
    val1: number | undefined,
    val2: number | undefined,
    lowerIsBetter = false
  ): "left" | "right" | "draw" | null => {
    if (val1 === undefined || val2 === undefined) return null;
    if (val1 === val2) return "draw";
    if (lowerIsBetter) {
      return val1 < val2 ? "left" : "right";
    }
    return val1 > val2 ? "left" : "right";
  };

  const getDecisionBadge = (report: InvestmentReport) => {
    const dec = report.recommendation.decision;
    if (dec === "BUY") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (dec === "SELL") return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };

  const leftPEWinner = getWinner(left?.financials.peRatio, right?.financials.peRatio, true);
  const leftDebtWinner = getWinner(left?.financials.debtToEquity, right?.financials.debtToEquity, true);
  const leftRevenueWinner = getWinner(left?.financials.revenue, right?.financials.revenue);
  const leftGrowthWinner = getWinner(left?.financials.revenueGrowth, right?.financials.revenueGrowth);
  const leftMarginWinner = getWinner(left?.financials.profitMargin, right?.financials.profitMargin);
  const leftRoeWinner = getWinner(left?.financials.returnOnEquity, right?.financials.returnOnEquity);
  const leftScoreWinner = getWinner(left?.recommendation.score, right?.recommendation.score);
  const leftConfidenceWinner = getWinner(left?.recommendation.confidence, right?.recommendation.confidence);

  return (
    <main className="container-custom py-12 space-y-8">
      {/* Header */}
      <div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
          <Layers className="inline mr-1" size={12} /> Asset Comparison Matrix
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-black text-white tracking-tight">
          Compare Companies
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-3xl">
          Conduct a side-by-side analysis of key metrics, balance sheet liquidity, valuations, and AI recommendation decisions.
        </p>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleCompare} className="card-premium bg-gradient-to-br from-[#0b0f19] to-[#030712] p-5 shadow-xl border border-white/5 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">First Ticker</label>
            <input
              value={company1}
              onChange={(e) => setCompany1(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/5 bg-slate-900/60 p-3 text-sm text-white font-extrabold outline-none focus:border-emerald-500"
              placeholder="e.g. AAPL"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Second Ticker</label>
            <input
              value={company2}
              onChange={(e) => setCompany2(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/5 bg-slate-900/60 p-3 text-sm text-white font-extrabold outline-none focus:border-emerald-500"
              placeholder="e.g. MSFT"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto shrink-0 flex justify-center items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3 font-bold text-white text-sm transition shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="animate-spin" size={14} /> Comparing...
            </>
          ) : (
            <>
              Compare Assets <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="card-premium bg-rose-950/20 border-rose-500/20 p-5 flex items-center gap-3 text-rose-400">
          <AlertCircle size={20} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Comparison Grid */}
      {left && right && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Side-by-Side Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Card */}
            <div className={`card-premium bg-gradient-to-br from-slate-900/40 to-[#0b0f19] p-6 border border-white/5 shadow-xl`}>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-white">{left.company.companyName}</h2>
                  <p className="text-xs text-slate-400 mt-1">{left.company.sector} • {left.company.industry}</p>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded border uppercase tracking-wider ${getDecisionBadge(left)}`}>
                  {left.recommendation.decision}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed line-clamp-3">
                {left.recommendation.summary}
              </p>
            </div>

            {/* Right Card */}
            <div className={`card-premium bg-gradient-to-br from-slate-900/40 to-[#0b0f19] p-6 border border-white/5 shadow-xl`}>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-white">{right.company.companyName}</h2>
                  <p className="text-xs text-slate-400 mt-1">{right.company.sector} • {right.company.industry}</p>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded border uppercase tracking-wider ${getDecisionBadge(right)}`}>
                  {right.recommendation.decision}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed line-clamp-3">
                {right.recommendation.summary}
              </p>
            </div>
          </div>

          {/* Matrix Comparison Table */}
          <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-[#030712] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black text-white">Comparative Matrix</h2>
              <p className="text-xs text-slate-400 mt-1">Winning metrics highlighted with green borders and indicators</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/2">
                    <th className="p-4">Metrics Evaluated</th>
                    <th className="p-4 text-center font-extrabold text-emerald-400">{left.company.symbol}</th>
                    <th className="p-4 text-center font-extrabold text-cyan-400">{right.company.symbol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                  {/* Sector */}
                  <tr>
                    <td className="p-4 text-slate-400">Sector</td>
                    <td className="p-4 text-center text-white">{left.company.sector}</td>
                    <td className="p-4 text-center text-white">{right.company.sector}</td>
                  </tr>

                  {/* Recommendation Decision */}
                  <tr>
                    <td className="p-4 text-slate-400">AI Decision</td>
                    <td className="p-4 text-center">
                      <span className={`text-xs font-black px-2 py-0.5 rounded border uppercase tracking-wider ${getDecisionBadge(left)}`}>
                        {left.recommendation.decision}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-xs font-black px-2 py-0.5 rounded border uppercase tracking-wider ${getDecisionBadge(right)}`}>
                        {right.recommendation.decision}
                      </span>
                    </td>
                  </tr>

                  {/* Recommendation Score */}
                  <tr className="hover:bg-white/2">
                    <td className="p-4 text-slate-400">Recommendation Score</td>
                    <td className={`p-4 text-center ${leftScoreWinner === "left" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      {left.recommendation.score}
                    </td>
                    <td className={`p-4 text-center ${leftScoreWinner === "right" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      {right.recommendation.score}
                    </td>
                  </tr>

                  {/* Model Confidence */}
                  <tr className="hover:bg-white/2">
                    <td className="p-4 text-slate-400">Model Confidence</td>
                    <td className={`p-4 text-center ${leftConfidenceWinner === "left" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      {left.recommendation.confidence}%
                    </td>
                    <td className={`p-4 text-center ${leftConfidenceWinner === "right" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      {right.recommendation.confidence}%
                    </td>
                  </tr>

                  {/* Revenue */}
                  <tr className="hover:bg-white/2">
                    <td className="p-4 text-slate-400">Revenue (USD)</td>
                    <td className={`p-4 text-center ${leftRevenueWinner === "left" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      ${left.financials.revenue.toLocaleString()}
                    </td>
                    <td className={`p-4 text-center ${leftRevenueWinner === "right" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      ${right.financials.revenue.toLocaleString()}
                    </td>
                  </tr>

                  {/* Revenue Growth */}
                  <tr className="hover:bg-white/2">
                    <td className="p-4 text-slate-400">Revenue Growth</td>
                    <td className={`p-4 text-center ${leftGrowthWinner === "left" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      {(left.financials.revenueGrowth * 100).toFixed(2)}%
                    </td>
                    <td className={`p-4 text-center ${leftGrowthWinner === "right" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      {(right.financials.revenueGrowth * 100).toFixed(2)}%
                    </td>
                  </tr>

                  {/* PE Ratio */}
                  <tr className="hover:bg-white/2">
                    <td className="p-4 text-slate-400">Price/Earnings (P/E)</td>
                    <td className={`p-4 text-center ${leftPEWinner === "left" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      {left.financials.peRatio.toFixed(2)}x
                    </td>
                    <td className={`p-4 text-center ${leftPEWinner === "right" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      {right.financials.peRatio.toFixed(2)}x
                    </td>
                  </tr>

                  {/* EPS */}
                  <tr className="hover:bg-white/2">
                    <td className="p-4 text-slate-400">Earnings Per Share (EPS)</td>
                    <td className="p-4 text-center">{left.financials.eps.toFixed(2)}</td>
                    <td className="p-4 text-center">{right.financials.eps.toFixed(2)}</td>
                  </tr>

                  {/* Profit Margin */}
                  <tr className="hover:bg-white/2">
                    <td className="p-4 text-slate-400">Profit Margin</td>
                    <td className={`p-4 text-center ${leftMarginWinner === "left" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      {(left.financials.profitMargin * 100).toFixed(2)}%
                    </td>
                    <td className={`p-4 text-center ${leftMarginWinner === "right" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      {(right.financials.profitMargin * 100).toFixed(2)}%
                    </td>
                  </tr>

                  {/* Return on Equity (ROE) */}
                  <tr className="hover:bg-white/2">
                    <td className="p-4 text-slate-400">Return on Equity (ROE)</td>
                    <td className={`p-4 text-center ${leftRoeWinner === "left" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      {(left.financials.returnOnEquity * 100).toFixed(2)}%
                    </td>
                    <td className={`p-4 text-center ${leftRoeWinner === "right" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      {(right.financials.returnOnEquity * 100).toFixed(2)}%
                    </td>
                  </tr>

                  {/* Debt to Equity */}
                  <tr className="hover:bg-white/2">
                    <td className="p-4 text-slate-400">Debt to Equity Ratio</td>
                    <td className={`p-4 text-center ${leftDebtWinner === "left" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      {left.financials.debtToEquity.toFixed(2)}
                    </td>
                    <td className={`p-4 text-center ${leftDebtWinner === "right" ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                      {right.financials.debtToEquity.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}