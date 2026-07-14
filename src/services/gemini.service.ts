import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "@/lib/env";

export function getGeminiModel(apiKey?: string, modelName?: string) {
  return new ChatGoogleGenerativeAI({
    apiKey: apiKey || env.GOOGLE_API_KEY,
    model: modelName || "gemini-flash-latest",
    temperature: 0.2,
  });
}

export const gemini = getGeminiModel();