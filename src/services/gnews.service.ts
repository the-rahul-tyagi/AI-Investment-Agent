import { BaseService } from "./base.service";
import { env } from "@/lib/env";
import { NewsArticle } from "@/types";

const BASE_URL = "https://gnews.io/api/v4";

interface GNewsResponse {
  articles: {
    title: string;
    description: string;
    url: string;
    image: string;
    source: {
      name: string;
    };
    publishedAt: string;
  }[];
}

export class GNewsService extends BaseService {
  async getCompanyNews(
    company: string,
    apiKey?: string
  ): Promise<NewsArticle[]> {
    const token = apiKey || env.GNEWS_API_KEY;

    console.log("Calling GNews with:", {
      q: company,
      lang: "en",
      max: 10,
      token: token,
    });

    const data = await this.get<GNewsResponse>(
      `${BASE_URL}/search`,
      {
        q: company,
        lang: "en",
        max: 10,
        token: token,
      }
    );

    return data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image,
      source: article.source.name,
      publishedAt: article.publishedAt,
    }));
  }
}

export const gnewsService = new GNewsService();