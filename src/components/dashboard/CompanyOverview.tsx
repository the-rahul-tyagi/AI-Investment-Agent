import { CompanyProfile } from "@/types";
import { Globe, User, Building, Landmark, MapPin } from "lucide-react";

interface Props {
  company: CompanyProfile;
}

export default function CompanyOverview({
  company,
}: Props) {
  return (
    <div className="card-premium lg:col-span-2 bg-[#0b0f19]/60 p-6 border border-white/5 flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-4">
            {company.image ? (
              <img
                src={company.image}
                alt={company.companyName}
                className="h-14 w-14 rounded-2xl bg-white p-1 object-contain shadow-md"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                {company.symbol}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {company.companyName}
                </h2>
                <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400 uppercase">
                  {company.symbol}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {company.industry}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
              <Building size={12} /> {company.sector}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
              <Landmark size={12} /> {company.exchange}
            </span>
          </div>
        </div>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
          {company.description}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/5 pt-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-slate-400">
            <User size={14} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500">CEO</p>
            <p className="font-semibold text-white truncate max-w-[120px] sm:max-w-none">{company.ceo || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-slate-400">
            <MapPin size={14} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500">Country</p>
            <p className="font-semibold text-white">{company.country || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-slate-400">
            <Globe size={14} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500">Website</p>
            {company.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-400 hover:underline break-all truncate max-w-[200px]"
              >
                {company.website.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            ) : (
              <p className="font-semibold text-slate-400">N/A</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}