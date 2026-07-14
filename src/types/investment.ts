export interface CompanyProfile {
  symbol: string;
  companyName: string;
  industry: string;
  sector: string;
  description: string;
  ceo: string;
  country: string;
  exchange: string;
  marketCap: number;
  website: string;
  image: string;
}

export interface FinancialMetrics {
  revenue: number;
  revenueGrowth: number;
  netIncome: number;
  eps: number;
  peRatio: number;
  profitMargin: number;
  currentRatio: number;
  debtToEquity: number;
  returnOnEquity: number;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  source: string;
  publishedAt: string;
}

export interface Recommendation {
  decision: "BUY" | "HOLD" | "SELL";
  confidence: number;
  score: number;
  summary: string;
  pros: string[];
  cons: string[];
  risks: string[];
  sentiment: string;
  sentimentScore: number;
}

export interface InvestmentReport {
  company: CompanyProfile;
  financials: FinancialMetrics;
  news: NewsArticle[];
  recommendation: Recommendation;
}