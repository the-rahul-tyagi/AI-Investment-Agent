"use client";

import { useState, useRef, useEffect } from "react";
import { InvestmentReport } from "@/types";
import { useAIChat } from "@/hooks/useAIChat";
import { Bot, User, Send, Sparkles, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  report: InvestmentReport;
}

const QUICK_SUGGESTIONS = [
  "What are the major growth drivers?",
  "Tell me about the valuation risks.",
  "Is the balance sheet healthy?",
  "What does the news sentiment indicate?",
];

export default function AIChat({ report }: Props) {
  const [question, setQuestion] = useState("");
  const { messages, loading, sendMessage } = useAIChat(report);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(textToSend = question) {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    if (trimmed === question) {
      setQuestion("");
    }
    
    await sendMessage(trimmed);
  }

  return (
    <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-[#030712] p-6 shadow-xl border border-white/5 flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Bot size={22} className="text-emerald-400" />
          AI Investment Co-Pilot
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Ask complex questions about {report.company.companyName}'s financials and outlook
        </p>
      </div>

      {/* Messages List */}
      <div className="flex-1 min-h-[300px] max-h-[450px] overflow-y-auto space-y-4 pr-2 border-y border-white/5 py-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
              <Sparkles size={20} />
            </div>
            <h3 className="font-bold text-white mb-1">Begin Consultation</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Ask questions about valuation multipliers, balance sheet health, or risks mentioned in the report.
            </p>
          </div>
        )}

        {messages.map((message, index) => {
          const isUser = message.role === "user";
          return (
            <div
              key={index}
              className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              {/* Avatar */}
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-bold ${
                isUser
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-white/5 border-white/10 text-white"
              }`}>
                {isUser ? <User size={14} /> : <Bot size={14} />}
              </div>

              {/* Message Bubble */}
              <div className={`rounded-2xl p-4 text-sm leading-relaxed border ${
                isUser
                  ? "bg-emerald-600/90 text-white border-emerald-500/25 shadow-md shadow-emerald-600/10 rounded-tr-none"
                  : "bg-white/5 text-slate-200 border-white/5 rounded-tl-none"
              }`}>
                {isUser ? (
                  <p className="whitespace-pre-wrap font-medium">{message.content}</p>
                ) : (
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/5">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white animate-pulse">
              <Bot size={14} />
            </div>
            <div className="rounded-2xl rounded-tl-none p-4 text-sm bg-white/5 border border-white/5 flex items-center gap-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {QUICK_SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(suggestion)}
              className="text-xs font-semibold rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5 transition cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              handleSend();
            }
          }}
          placeholder={`Ask about ${report.company.symbol}...`}
          disabled={loading}
          className="flex-1 rounded-xl border border-white/5 bg-[#0b0f19]/80 p-3 text-sm text-white outline-none transition focus:border-emerald-500 disabled:opacity-50"
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || !question.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}