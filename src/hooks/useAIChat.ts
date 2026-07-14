"use client";

import { useState } from "react";
import { InvestmentReport } from "@/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useAIChat(report: InvestmentReport) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(question: string) {
    if (!question.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const googleKey = localStorage.getItem("settings_google_key") || "";
      const fmpKey = localStorage.getItem("settings_fmp_key") || "";
      const gnewsKey = localStorage.getItem("settings_gnews_key") || "";
      const modelName = localStorage.getItem("settings_model") || "";

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-google-key": googleKey,
          "x-fmp-key": fmpKey,
          "x-gnews-key": gnewsKey,
          "x-model-name": modelName,
        },
        body: JSON.stringify({
          question,
          report,
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        role: "assistant",
        content: data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return {
    messages,
    loading,
    sendMessage,
  };
}