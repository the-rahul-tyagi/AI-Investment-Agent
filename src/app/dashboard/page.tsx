"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useInvestmentAnalysis } from "@/hooks/useInvestmentAnalysis";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useHistory } from "@/hooks/useHistory";
import InvestmentDashboard from "@/components/dashboard/InvestmentDashboard";
import { RefreshCw, Star, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function DashboardContent() {
  const searchParams = useSearchParams();
  const company = searchParams.get("company") ?? "";

  const {
    report,
    loading,
    error,
    analyze,
  } = useInvestmentAnalysis();

  const {
    add,
    watchlist,
  } = useWatchlist();

  const { add: addHistory } = useHistory();

  useEffect(() => {
    if (company) {
      analyze(company);
      addHistory(company);
    }
  }, [company]);
  
  if (loading) {
    return (
      <main className="container-custom py-24 flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-spin">
          <RefreshCw size={24} />
        </div>
        <div>
          <h3 className="font-extrabold text-white text-lg">Consulting AI Agents...</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            Fetching company metadata, trailing twelve month ratios, and latest market news indicators.
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container-custom py-24 flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle size={24} />
        </div>
        <div>
          <h3 className="font-extrabold text-white text-lg">Analysis Failed</h3>
          <p className="text-xs text-rose-400/80 mt-1 max-w-sm">
            {error || "An unexpected error occurred while analyzing the target ticker symbol."}
          </p>
        </div>
        <Link href="/" className="mt-2 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Search
        </Link>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="container-custom py-24 flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400">
          <AlertCircle size={24} />
        </div>
        <div>
          <h3 className="font-extrabold text-white text-lg">No Report Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Please select or search a valid ticker symbol from the homepage.
          </p>
        </div>
        <Link href="/" className="mt-2 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Search
        </Link>
      </main>
    );
  }

  const isSaved = watchlist.includes(report.company.symbol);

  return (
    <main className="container-custom py-12 space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Investment Research Workspace
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            {report.company.companyName} ({report.company.symbol})
          </h1>
        </div>

        <button
          onClick={() => add(report.company.symbol)}
          disabled={isSaved}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-sm shadow-md transition cursor-pointer ${
            isSaved
              ? "bg-slate-800 text-slate-400 border border-white/5 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10 border border-transparent"
          }`}
        >
          {isSaved ? (
            <>
              <CheckCircle size={15} className="text-emerald-400" /> Added to Watchlist
            </>
          ) : (
            <>
              <Star size={15} /> Add to Watchlist
            </>
          )}
        </button>
      </div>

      <InvestmentDashboard report={report} />
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <main className="container-custom py-24 flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-spin">
          <RefreshCw size={24} />
        </div>
        <h3 className="font-extrabold text-white text-lg">Loading Workspace...</h3>
      </main>
    }>
      <DashboardContent />
    </Suspense>
  );
}