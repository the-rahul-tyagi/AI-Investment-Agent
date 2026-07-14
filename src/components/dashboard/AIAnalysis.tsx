import { Recommendation } from "@/types";
import { CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";

interface Props {
  recommendation: Recommendation;
}

export default function AIAnalysis({
  recommendation,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-3 lg:col-span-2">

      {/* Pros Card */}
      <div className="card-premium bg-gradient-to-br from-slate-900/60 to-[#0b0f19] p-6 border-l-4 border-l-emerald-500 shadow-lg border-y-white/5 border-r-white/5 flex flex-col hover:border-emerald-500/25">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={18} />
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider">
            Pros / Strengths
          </h2>
        </div>

        <ul className="space-y-3 flex-1">
          {recommendation.pros.map((pro, index) => (
            <li key={index} className="flex gap-2 text-sm leading-relaxed text-slate-300">
              <span className="text-emerald-400 font-black">•</span>
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons Card */}
      <div className="card-premium bg-gradient-to-br from-slate-900/60 to-[#0b0f19] p-6 border-l-4 border-l-amber-500 shadow-lg border-y-white/5 border-r-white/5 flex flex-col hover:border-amber-500/25">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <AlertCircle size={18} />
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider">
            Cons / Weaknesses
          </h2>
        </div>

        <ul className="space-y-3 flex-1">
          {recommendation.cons.map((con, index) => (
            <li key={index} className="flex gap-2 text-sm leading-relaxed text-slate-300">
              <span className="text-amber-400 font-black">•</span>
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risks Card */}
      <div className="card-premium bg-gradient-to-br from-slate-900/60 to-[#0b0f19] p-6 border-l-4 border-l-rose-600 shadow-lg border-y-white/5 border-r-white/5 flex flex-col hover:border-rose-600/25">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
            <ShieldAlert size={18} />
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider">
            Key Risks
          </h2>
        </div>

        <ul className="space-y-3 flex-1">
          {recommendation.risks.map((risk, index) => (
            <li key={index} className="flex gap-2 text-sm leading-relaxed text-slate-300">
              <span className="text-rose-400 font-black">•</span>
              <span>{risk}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}