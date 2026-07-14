import { CompanyProfile } from "./company";
import { FinancialMetrics } from "./financial";
import { NewsArticle } from "./news";

export interface InvestmentReport {
  company: CompanyProfile;

  financials: FinancialMetrics;

  news: NewsArticle[];

  recommendation: "INVEST" | "WATCH" | "PASS";

  confidence: number;

  summary: string;

  pros: string[];

  cons: string[];

  risks: string[];
}