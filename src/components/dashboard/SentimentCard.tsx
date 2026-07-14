import { Smile, Frown, Meh } from "lucide-react";

interface Props {
  sentiment: string;
  score: number;
}

export default function SentimentCard({
  sentiment,
  score,
}: Props) {
  const isBullish = sentiment.toLowerCase().includes("bull");
  const isBearish = sentiment.toLowerCase().includes("bear");

  const colorClass = isBullish
    ? "text-emerald-400"
    : isBearish
    ? "text-rose-400"
    : "text-amber-400";

  const glowClass = isBullish
    ? "glass-glow-emerald"
    : isBearish
    ? "glass-glow-rose"
    : "glass-glow-amber";

  // Normalize score for visual representation (assuming score can be 0-100 or -100 to 100)
  // If score is small (like -1 to 1), scale it
  const displayScore = Math.abs(score) <= 1 ? Math.round(score * 100) : score;
  
  // Calculate percentage for a gauge bar (ranging from -100 to 100, normalized to 0% to 100%)
  const percentage = Math.min(Math.max(((displayScore + 100) / 200) * 100, 0), 100);

  const Icon = isBullish ? Smile : isBearish ? Frown : Meh;

  return (
    <div className={`card-premium bg-gradient-to-br from-slate-900/60 to-slate-950/40 p-6 shadow-xl border border-white/5 flex flex-col justify-between ${glowClass}`}>
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Market News Sentiment
          </span>
          <span className={`text-xs font-semibold ${colorClass} bg-white/5 px-2.5 py-1 rounded-full border border-white/5 flex items-center gap-1`}>
            <Icon size={12} /> {sentiment}
          </span>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center">
          <span className={`text-5xl font-black tracking-tight ${colorClass}`}>
            {displayScore > 0 ? `+${displayScore}` : displayScore}
          </span>
          <span className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Sentiment Index
          </span>
        </div>
      </div>

      {/* Speedometer Gauge bar */}
      <div className="mt-6">
        <div className="relative h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/5">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 h-full w-[2px] bg-slate-600 z-10" />
          
          <div
            className={`h-full transition-all duration-1000 ${
              isBullish ? "bg-gradient-to-r from-emerald-600 to-emerald-400" : isBearish ? "bg-gradient-to-r from-rose-600 to-rose-400" : "bg-gradient-to-r from-amber-600 to-amber-400"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-500 uppercase">
          <span>Bearish</span>
          <span>Neutral</span>
          <span>Bullish</span>
        </div>
      </div>
    </div>
  );
}