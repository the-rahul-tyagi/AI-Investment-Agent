import { z } from "zod";

const envSchema = z.object({
  GOOGLE_API_KEY: z.string().min(1),
  FMP_API_KEY: z.string().min(1),
  GNEWS_API_KEY: z.string().min(1),
  ALPHA_VANTAGE_API_KEY: z.string().optional(),
});

export const env = envSchema.parse({
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  FMP_API_KEY: process.env.FMP_API_KEY,
  GNEWS_API_KEY: process.env.GNEWS_API_KEY,
  ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
});