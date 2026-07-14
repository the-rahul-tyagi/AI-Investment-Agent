"use client";

import { useRouter } from "next/navigation";
import CompanySearch from "../search/CompanySearch";
import { Sparkles, TrendingUp } from "lucide-react";

export default function Hero() {
  const router = useRouter();

  const handleSuggestClick = (company: string) => {
    router.push(`/dashboard?company=${encodeURIComponent(company)}`);
  };

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-dots">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] sm:h-[700px] sm:w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute left-1/4 bottom-10 h-72 w-72 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="container-custom relative">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-xs sm:text-sm font-bold text-emerald-400">
            <Sparkles size={14} className="animate-pulse" />
            AI-Powered Investment Intelligence
          </div>

          <h1 className="text-5xl font-black leading-none tracking-tight sm:text-7xl text-white">
            Make Smarter
            <span className="gradient-text-emerald block sm:inline"> Financial </span>
            Decisions
          </h1>

          <p className="mx-auto max-w-3xl text-base sm:text-lg leading-relaxed text-slate-400 font-medium">
            Analyze any public company using real-time market data, latest financial news, competitor comparisons, and advanced AI-reasoned investment advice.
          </p>

          <div className="pt-4">
            <CompanySearch />
          </div>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-1 flex items-center gap-1">
              <TrendingUp size={12} /> Popular:
            </span>
            {[
              { label: "Apple", symbol: "AAPL" },
              { label: "Microsoft", symbol: "MSFT" },
              { label: "NVIDIA", symbol: "NVDA" },
              { label: "Amazon", symbol: "AMZN" },
              { label: "Tesla", symbol: "TSLA" },
              { label: "Meta", symbol: "META" },
            ].map((company) => (
              <button
                key={company.symbol}
                onClick={() => handleSuggestClick(company.symbol)}
                className="rounded-full border border-white/5 bg-[#0b0f19]/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-300 transition duration-200 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5 cursor-pointer shadow-sm"
              >
                {company.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}