import { fmpService } from "./financialModelingPrep.service";
import { gnewsService } from "./gnews.service";
import { analyzeInvestment } from "@/agents/investment.agent";
import { InvestmentReport, NewsArticle } from "@/types";

export class InvestmentService {
  async analyze(
    symbol: string,
    googleKey?: string,
    fmpKey?: string,
    gnewsKey?: string,
    modelName?: string
  ): Promise<InvestmentReport> {

    console.log("START:", symbol);

    console.log("Fetching profile...");
    const company = await fmpService.getCompanyProfile(symbol, fmpKey);
    console.log("Profile OK");

    console.log("Fetching financials...");
    const financials = await fmpService.getFinancialMetrics(company.symbol, fmpKey);
    console.log("Financials OK");

    console.log("Fetching news...");
    let news: NewsArticle[] = [];

    try {
      news = await gnewsService.getCompanyNews(company.symbol, gnewsKey);
    } catch (err) {
      console.log("GNews unavailable, continuing without news.");
    }
    console.log("News OK");

    console.log("Calling Gemini...");
    const recommendation = await analyzeInvestment(
      company,
      financials,
      news,
      googleKey,
      modelName
    );
    console.log("Gemini OK");

    return {
      company,
      financials,
      news,
      recommendation,
    };
  }
}

export const investmentService = new InvestmentService();