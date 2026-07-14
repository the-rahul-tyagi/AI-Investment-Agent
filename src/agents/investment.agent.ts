import { getGeminiModel } from "@/services/gemini.service";
import {
  CompanyProfile,
  FinancialMetrics,
  NewsArticle,
  Recommendation,
} from "@/types";

export async function analyzeInvestment(
  company: CompanyProfile,
  financials: FinancialMetrics,
  news: NewsArticle[],
  apiKey?: string,
  modelName?: string
): Promise<Recommendation> {
  const prompt = `
You are a senior Wall Street investment analyst.

Analyze the following company.

Return ONLY valid JSON.

Schema:

{
  "decision":"BUY | HOLD | SELL",
  "confidence":0,
  "score":0,
  "summary":"",
  "pros":[],
  "cons":[],
  "risks":[],
  "sentiment":"Bullish | Neutral | Bearish",
  "sentimentScore":0
}

Company:

${JSON.stringify(company, null, 2)}

Financial Metrics:

${JSON.stringify(financials, null, 2)}

Latest News:

${JSON.stringify(news.slice(0, 5), null, 2)}
`;

  const model = getGeminiModel(apiKey, modelName);
  const response = await model.invoke(prompt);

  const text =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}