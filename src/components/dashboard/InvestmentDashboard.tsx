"use client";

import { InvestmentReport } from "@/types";

import RecommendationCard from "./RecommendationCard";
import CompanyOverview from "./CompanyOverview";
import FinancialCards from "./FinancialCards";
import RevenueChart from "./RevenueChart";
import AIAnalysis from "./AIAnalysis";
import NewsSection from "./NewsSection";
import FinancialChart from "./FinancialChart";
import SentimentCard from "./SentimentCard";
import AIChat from "../chat/AIChat";

interface Props {
  report: InvestmentReport;
}

export default function InvestmentDashboard({ report }: Props) {
  return (
    <div className="space-y-8">

      {/* Top Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecommendationCard
          recommendation={report.recommendation}
        />

        <SentimentCard
          sentiment={report.recommendation.sentiment}
          score={report.recommendation.sentimentScore}
        />

        <CompanyOverview
          company={report.company}
        />
      </div>

      {/* Financial Metrics */}
      <FinancialCards
        financials={report.financials}
      />

      {/* Financial Chart */}
      <FinancialChart
        financials={report.financials}
      />

      {/* Charts + AI */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart
          revenue={report.financials.revenue}
        />

        <AIAnalysis
          recommendation={report.recommendation}
        />
      </div>

      {/* News */}
      <NewsSection
        news={report.news}
      />

      <AIChat report={report} />

    </div>
  );
}