import { Recommendation } from "@/types";
import { TrendingUp, TrendingDown, AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";

interface Props {
  recommendation: Recommendation;
}

export default function RecommendationCard({
  recommendation,
}: Props) {
  const isBuy = recommendation.decision === "BUY";
  const isSell = recommendation.decision === "SELL";
  const isHold = recommendation.decision === "HOLD";

  const colorClass = isBuy
    ? "text-emerald-400 font-extrabold"
    : isSell
    ? "text-rose-400 font-extrabold"
    : "text-amber-400 font-extrabold";

  const bgGradient = isBuy
    ? "from-emerald-500/10 to-cyan-500/5 border-emerald-500/20 glass-glow-emerald"
    : isSell
    ? "from-rose-500/10 to-pink-500/5 border-rose-500/20 glass-glow-rose"
    : "from-amber-500/10 to-yellow-500/5 border-amber-500/20 glass-glow-amber";

  const Icon = isBuy ? TrendingUp : isSell ? TrendingDown : AlertCircle;

  return (
    <div className={`card-premium bg-gradient-to-br p-6 shadow-xl ${bgGradient} flex flex-col justify-between`}>
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            AI Recommendation
          </span>
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            isBuy ? "bg-emerald-500/10 text-emerald-400" : isSell ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"
          }`}>
            <Icon size={18} />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <h2 className={`text-4xl sm:text-5xl font-black tracking-tight ${colorClass}`}>
            {recommendation.decision}
          </h2>
          <span className="text-sm font-semibold text-slate-400">
            Score: <span className="text-white font-bold">{recommendation.score}</span>/100
          </span>
        </div>

        {/* Confidence Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs font-medium text-slate-400">
            <span>Model Confidence</span>
            <span className="text-white font-bold">{recommendation.confidence}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${
                isBuy ? "from-emerald-500 to-cyan-400" : isSell ? "from-rose-500 to-pink-500" : "from-amber-500 to-yellow-400"
              }`}
              style={{ width: `${recommendation.confidence}%` }}
            />
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm sm:text-base leading-relaxed text-slate-300 font-medium border-t border-white/5 pt-4">
        {recommendation.summary}
      </p>
    </div>
  );
}