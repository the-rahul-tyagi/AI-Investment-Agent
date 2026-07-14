"use client";

import { useState, useCallback } from "react";
import { InvestmentReport } from "@/types";

export function useInvestmentAnalysis() {
  const [report, setReport] = useState<InvestmentReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = useCallback(async (company: string) => {
    try {
      setLoading(true);
      setError("");

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
        body: JSON.stringify({
          company,
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || "Analysis failed");
      }

      const data = await response.json();

      setReport(data);
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "";
      if (msg.includes("429")) {
        setError(
          "Rate limit exceeded (FMP API limit reached). Please go to Settings and enter your own free Financial Modeling Prep API Key to continue analyzing stocks."
        );
      } else {
        setError(msg || "Unable to analyze company.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    report,
    loading,
    error,
    analyze,
  };
}