import { BaseService } from "./base.service";
import { env } from "@/lib/env";
import {
  CompanyProfile,
  FinancialMetrics,
} from "@/types";

const BASE_URL = "https://financialmodelingprep.com/stable";

export class FinancialModelingPrepService extends BaseService {

  async getCompanyProfile(
    symbol: string,
    apiKey?: string
  ): Promise<CompanyProfile> {
    const key = apiKey || env.FMP_API_KEY;

    let data: any[] = [];
    try {
      data = await this.get<any[]>(
        `${BASE_URL}/profile`,
        {
          symbol,
          apikey: key,
        }
      );
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 402 || error?.message?.includes("402")) {
        throw new Error("FMP API Key requires premium or payment (Status 402). Please enter a valid key in Settings.");
      }
      if (status === 429 || error?.message?.includes("429")) {
        throw new Error("FMP API Rate Limit reached (Status 429). Please enter a valid personal key in Settings.");
      }
      if (status === 401 || status === 403) {
        throw new Error("Invalid FMP API Key (Status 401/403). Please verify the key entered in Settings.");
      }
      throw error;
    }

    // 1. If not found directly, try resolving it as a company name
    if (!data || data.length === 0 || !data[0]) {
      console.log(`Symbol ${symbol} not found directly. Attempting search-name lookup...`);
      try {
        const searchResults = await this.get<any[]>(
          `${BASE_URL}/search-name`,
          {
            query: symbol,
            apikey: key,
          }
        );

        if (searchResults && searchResults.length > 0 && searchResults[0].symbol) {
          const resolvedSymbol = searchResults[0].symbol;
          console.log(`Resolved ${symbol} to name-search ticker: ${resolvedSymbol}`);
          data = await this.get<any[]>(
            `${BASE_URL}/profile`,
            {
              symbol: resolvedSymbol,
              apikey: key,
            }
          );
        }
      } catch (err) {
        console.error("FMP search-name lookup failed:", err);
      }
    }

    // 2. If still not found, try search-symbol
    if (!data || data.length === 0 || !data[0]) {
      console.log(`Symbol ${symbol} not resolved via name. Attempting search-symbol lookup...`);
      try {
        const searchResults = await this.get<any[]>(
          `${BASE_URL}/search-symbol`,
          {
            query: symbol,
            apikey: key,
          }
        );

        if (searchResults && searchResults.length > 0 && searchResults[0].symbol) {
          const resolvedSymbol = searchResults[0].symbol;
          console.log(`Resolved ${symbol} to symbol-search ticker: ${resolvedSymbol}`);
          data = await this.get<any[]>(
            `${BASE_URL}/profile`,
            {
              symbol: resolvedSymbol,
              apikey: key,
            }
          );
        }
      } catch (err) {
        console.error("FMP search-symbol lookup failed:", err);
      }
    }

    // 3. Throw a clean user-facing error if it cannot be found or resolved
    if (!data || data.length === 0 || !data[0]) {
      throw new Error(
        `Unable to find company profile for "${symbol}". Please search using a valid ticker symbol (e.g. AAPL, MSFT, GOOGL) or correct name.`
      );
    }

    const company = data[0];

    return {
      symbol: company.symbol,
      companyName: company.companyName || symbol,
      industry: company.industry || "N/A",
      sector: company.sector || "N/A",
      description: company.description || "No description available.",
      ceo: company.ceo || "N/A",
      country: company.country || "N/A",
      exchange: company.exchange || "N/A",
      marketCap: company.marketCap || 0,
      website: company.website || "",
      image: company.image || "",
    };
  }

  async getFinancialMetrics(
    symbol: string,
    apiKey?: string
  ): Promise<FinancialMetrics> {
    const key = apiKey || env.FMP_API_KEY;

    let ratios: any[] = [];
    try {
      ratios = await this.get<any[]>(
        `${BASE_URL}/ratios-ttm`,
        {
          symbol,
          apikey: key,
        }
      );
    } catch (error: any) {
      const is402 =
        error?.response?.status === 402 ||
        error?.message?.includes("402") ||
        (error?.config?.url && error.message?.includes("status code 402"));

      if (is402) {
        console.log("FMP ratios-ttm requires premium. Falling back to free annual ratios...");
        try {
          ratios = await this.get<any[]>(
            `${BASE_URL}/ratios`,
            {
              symbol,
              limit: 1,
              apikey: key,
            }
          );
        } catch (fallbackError) {
          console.error("FMP annual ratios fallback failed:", fallbackError);
        }
      } else {
        const status = error?.response?.status;
        if (status === 429 || error?.message?.includes("429")) {
          throw new Error("FMP API Rate Limit reached (Status 429). Please enter a valid personal key in Settings.");
        }
        if (status === 401 || status === 403) {
          throw new Error("Invalid FMP API Key (Status 401/403). Please verify the key entered in Settings.");
        }
        throw error;
      }
    }

    let income: any[] = [];
    try {
      income = await this.get<any[]>(
        `${BASE_URL}/income-statement`,
        {
          symbol,
          limit: 1,
          apikey: key,
        }
      );
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 402 || error?.message?.includes("402")) {
        throw new Error("FMP API Key requires premium or payment (Status 402). Please enter a valid key in Settings.");
      }
      if (status === 429 || error?.message?.includes("429")) {
        throw new Error("FMP API Rate Limit reached (Status 429). Please enter a valid personal key in Settings.");
      }
      if (status === 401 || status === 403) {
        throw new Error("Invalid FMP API Key (Status 401/403). Please verify the key entered in Settings.");
      }
      throw error;
    }

    const r = ratios && ratios.length > 0 ? ratios[0] : {};

    return {
      revenue: income[0]?.revenue ?? 0,
      revenueGrowth: income[0]?.growthRevenue ?? 0,
      netIncome: income[0]?.netIncome ?? 0,
      eps: income[0]?.eps ?? 0,

      peRatio: r.priceEarningsRatioTTM ?? r.priceEarningsRatio ?? 0,

      profitMargin:
        r.netProfitMarginTTM ?? r.netProfitMargin ?? 0,

      currentRatio:
        r.currentRatioTTM ?? r.currentRatio ?? 0,

      debtToEquity:
        r.debtEquityRatioTTM ?? r.debtEquityRatio ?? 0,

      returnOnEquity:
        r.returnOnEquityTTM ?? r.returnOnEquity ?? 0,
    };
  }
}

export const fmpService =
  new FinancialModelingPrepService();