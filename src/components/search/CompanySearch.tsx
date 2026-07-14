"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";

interface CompanySearchProps {
  placeholder?: string;
}

export default function CompanySearch({
  placeholder = "Search Apple, Microsoft, NVIDIA...",
}: CompanySearchProps) {
  const router = useRouter();

  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSearch() {
    const value = company.trim();

    if (!value) return;

    setLoading(true);

    router.push(
      `/dashboard?company=${encodeURIComponent(value)}`
    );
  }

  return (
    <div className="mx-auto mt-10 flex w-full max-w-4xl flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder={placeholder}
          className="h-16 w-full rounded-2xl border border-slate-700 bg-slate-900 pl-14 pr-5 text-lg text-white outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-8 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
      >
        <Sparkles size={18} />

        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </div>
  );
}