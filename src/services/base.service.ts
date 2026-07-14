import axios, { AxiosInstance } from "axios";

export class BaseService {
  protected client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 10000,
    });
  }

  protected async get<T>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    try {
      const response = await this.client.get<T>(url, {
        params,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("========== AXIOS ERROR ==========");
        console.error("URL:", error.config?.url);
        console.error("Params:", error.config?.params);
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);
        console.error("Message:", error.message);
        console.error("=================================");

        const code = error.code;
        if (code === "ENOTFOUND" || code === "EAI_AGAIN" || !error.response) {
          throw new Error("Network Connection Error: Unable to reach the financial server. Please verify you are connected to the internet.");
        }
      } else {
        console.error(error);
      }

      throw error;
    }
  }
}