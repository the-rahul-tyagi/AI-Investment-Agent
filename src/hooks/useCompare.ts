"use client";

import { useState } from "react";
import { InvestmentReport } from "@/types";

export function useCompare() {
  const [left, setLeft] = useState<InvestmentReport | null>(null);
  const [right, setRight] = useState<InvestmentReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function compare(company1: string, company2: string) {
    setLoading(true);
    setError("");

    try {
      const googleKey = localStorage.getItem("settings_google_key") || "";
      const fmpKey = localStorage.getItem("settings_fmp_key") || "";
      const gnewsKey = localStorage.getItem("settings_gnews_key") || "";
      const modelName = localStorage.getItem("settings_model") || "";

      const response = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-google-key": googleKey,
          "x-fmp-key": fmpKey,
          "x-gnews-key": gnewsKey,
          "x-model-name": modelName,
        },
        body: JSON.stringify({
          company1,
          company2,
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || "Comparison failed");
      }

      const data = await response.json();

      setLeft(data.report1);
      setRight(data.report2);
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "";
      if (msg.includes("429")) {
        setError(
          "Rate limit exceeded (FMP API limit reached). Please go to Settings and enter your own free Financial Modeling Prep API Key to compare stocks."
        );
      } else {
        setError(msg || "Unable to compare companies.");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    left,
    right,
    loading,
    error,
    compare,
  };
}