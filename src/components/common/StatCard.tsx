import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

export default function StatCard({
  icon: Icon,
  value,
  label,
}: StatCardProps) {
  return (
    <div className="card-premium flex flex-col items-center p-8 text-center bg-[#0b0f19]/60 hover:border-emerald-500/20">
      <div className="mb-5 rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/20">
        <Icon
          size={24}
          className="text-emerald-400"
        />
      </div>

      <h2 className="text-4xl font-black text-white tracking-tight">
        {value}
      </h2>

      <p className="mt-2 text-sm text-slate-400 font-semibold tracking-wide">
        {label}
      </p>
    </div>
  );
}