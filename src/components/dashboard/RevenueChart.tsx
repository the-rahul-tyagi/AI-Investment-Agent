"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface Props {
  revenue: number;
}

export default function RevenueChart({
  revenue,
}: Props) {

  const formatBillions = (value: number) => {
    return `$${(value / 1e9).toFixed(1)}B`;
  };

  const data = [
    {
      year: "2022",
      revenue: revenue * 0.82,
    },
    {
      year: "2023",
      revenue: revenue * 0.90,
    },
    {
      year: "TTM",
      revenue: revenue,
    },
  ];

  return (
    <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-[#030712] p-6 shadow-xl border border-white/5">
      <div className="mb-6">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-400" />
          Revenue Trend
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Historical growth trajectory (USD)
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.03} />

            <XAxis dataKey="year" stroke="#4b5563" fontSize={11} tickLine={false} />

            <YAxis stroke="#4b5563" fontSize={11} tickLine={false} tickFormatter={formatBillions} />

            <Tooltip
              contentStyle={{ backgroundColor: "#0b0f19", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff" }}
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}