"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Trash2, ArrowRight, TrendingUp, TrendingDown, RefreshCw, Layers } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { InvestmentReport } from "@/types";

function WatchlistCard({ symbol, onRemove }: { symbol: string; onRemove: () => void }) {
  const router = useRouter();
  const [report, setReport] = useState<InvestmentReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        setError(false);
        const googleKey = localStorage.getItem("settings_google_key") || "";
        const fmpKey = localStorage.getItem("settings_fmp_key") || "";
        const gnewsKey = localStorage.getItem("settings_gnews_key") || "";
        const modelName = localStorage.getItem("settings_model") || "";

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-google-key": googleKey,
            "x-fmp-key": fmpKey,
            "x-gnews-key": gnewsKey,
            "x-model-name": modelName,
          },
          body: JSON.stringify({ company: symbol }),
        });

        if (!response.ok) throw new Error();
        const data = await response.json();
        setReport(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [symbol]);

  if (loading) {
    return (
      <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-slate-900/40 p-5 border border-white/5 h-[180px] flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-6 w-20 bg-white/5 rounded" />
          <div className="h-6 w-12 bg-white/5 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-3 w-2/3 bg-white/5 rounded" />
        </div>
        <div className="h-8 w-full bg-white/5 rounded-lg" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-slate-900/40 p-5 border border-red-500/10 h-[180px] flex flex-col justify-between text-slate-400">
        <div>
          <div className="flex justify-between">
            <span className="font-extrabold text-white">{symbol}</span>
            <button onClick={onRemove} className="text-slate-500 hover:text-rose-400 cursor-pointer">
              <Trash2 size={14} />
            </button>
          </div>
          <p className="text-xs text-rose-400 mt-2">Could not retrieve stock info.</p>
        </div>
        <button
          onClick={onRemove}
          className="text-xs font-bold text-rose-400/80 hover:text-rose-400 border border-rose-500/20 rounded-lg py-1.5 px-3 bg-rose-500/5 hover:bg-rose-500/10 transition cursor-pointer text-center"
        >
          Remove Ticker
        </button>
      </div>
    );
  }

  const { company, financials, recommendation } = report;
  const isBuy = recommendation.decision === "BUY";
  const isSell = recommendation.decision === "SELL";
  
  const recColor = isBuy
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : isSell
    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
    : "bg-amber-500/10 text-amber-400 border-amber-500/20";

  return (
    <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-slate-900/40 p-5 border border-white/5 flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300">
      <div>
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2">
            {company.image && (
              <img src={company.image} alt={company.companyName} className="h-7 w-7 rounded bg-white p-0.5 object-contain" />
            )}
            <div>
              <span className="font-extrabold text-white block text-sm sm:text-base leading-none">{company.symbol}</span>
              <span className="text-[10px] text-slate-500 truncate max-w-[120px] block mt-1">{company.companyName}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${recColor}`}>
              {recommendation.decision}
            </span>
            <button
              onClick={onRemove}
              className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-white/5 transition cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-y border-white/5 py-2.5 my-3">
          <div>
            <p className="text-[9px] uppercase font-bold text-slate-500">P/E Ratio</p>
            <p className="font-semibold text-slate-300 mt-0.5">{financials.peRatio.toFixed(2)}x</p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold text-slate-500">Revenue</p>
            <p className="font-semibold text-slate-300 mt-0.5">
              ${new Intl.NumberFormat("en-US", { notation: "compact" }).format(financials.revenue)}
            </p>
          </div>
        </div>
      </div>

      <Link
        href={`/dashboard?company=${company.symbol}`}
        className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white py-2 text-xs font-bold transition text-center cursor-pointer"
      >
        View Analysis Dashboard <ArrowRight size={12} />
      </Link>
    </div>
  );
}

export default function WatchlistPage() {
  const { watchlist, remove } = useWatchlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="container-custom py-12 space-y-8">
      <div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
          ⭐ Asset Monitor List
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-black text-white tracking-tight">
          Watchlist
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-3xl">
          Keep track of targeted companies, monitor their valuation metrics, and access instant AI research updates.
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-[#030712] p-12 border border-white/5 text-center flex flex-col items-center justify-center gap-4 max-w-xl mx-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400">
            <Star size={22} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Your Watchlist is Empty</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Find target companies on the home page and add them to your watchlist to monitor metrics.
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition cursor-pointer"
          >
            Search Companies
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {watchlist.map((symbol) => (
            <WatchlistCard
              key={symbol}
              symbol={symbol}
              onRemove={() => remove(symbol)}
            />
          ))}
        </div>
      )}
    </main>
  );
}