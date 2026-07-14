import { gemini } from "@/services/gemini.service";

export async function analyzePortfolio(data: unknown) {
  const prompt = `
You are a CFA Level III Portfolio Manager.

Analyze this portfolio.

Provide:

- Diversification Score
- Risk Score
- Sector Allocation
- Strengths
- Weaknesses
- Missing Sectors
- Portfolio Recommendation

Return ONLY JSON.

Portfolio:

${JSON.stringify(data, null, 2)}
`;

  const response = await gemini.invoke(prompt);

  const text =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  return JSON.parse(
    text.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
  );
}