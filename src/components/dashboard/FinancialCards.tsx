import { FinancialMetrics } from "@/types";
import { DollarSign, Percent, TrendingUp, TrendingDown, Activity, Wallet, ShieldAlert, BadgeDollarSign } from "lucide-react";

interface Props {
  financials: FinancialMetrics;
}

function formatRevenue(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

interface CardProps {
  title: string;
  value: string | number;
  subValue?: string;
  subValueColor?: string;
  icon: any;
  description: string;
}

function MetricCard({
  title,
  value,
  subValue,
  subValueColor = "text-slate-400",
  icon: Icon,
  description,
}: CardProps) {
  return (
    <div className="card-premium bg-gradient-to-br from-[#0b0f19] to-[#111827]/40 p-5 border border-white/5 flex flex-col justify-between hover:border-emerald-500/30">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">{title}</p>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400">
            <Icon size={16} />
          </div>
        </div>

        <h3 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight">
          {value}
        </h3>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
        <p className="text-[10px] text-slate-500 font-medium">{description}</p>
        {subValue && (
          <span className={`text-xs font-bold ${subValueColor}`}>
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
}

export default function FinancialCards({
  financials,
}: Props) {
  const isGrowthPositive = financials.revenueGrowth >= 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Revenue"
        value={`$${formatRevenue(financials.revenue)}`}
        subValue={formatPercent(financials.revenueGrowth)}
        subValueColor={isGrowthPositive ? "text-emerald-400" : "text-rose-400"}
        icon={BadgeDollarSign}
        description="Total top-line sales"
      />

      <MetricCard
        title="Net Income"
        value={`$${formatRevenue(financials.netIncome)}`}
        icon={DollarSign}
        description="Bottom-line earnings"
      />

      <MetricCard
        title="EPS"
        value={financials.eps.toFixed(2)}
        icon={Activity}
        description="Earnings Per Share"
      />

      <MetricCard
        title="P/E Ratio"
        value={financials.peRatio.toFixed(2)}
        icon={Wallet}
        description="Valuation Multiple"
      />

      <MetricCard
        title="Profit Margin"
        value={formatPercent(financials.profitMargin)}
        icon={Percent}
        description="Earnings relative to sales"
      />

      <MetricCard
        title="ROE"
        value={formatPercent(financials.returnOnEquity)}
        icon={TrendingUp}
        description="Return on Equity"
      />

      <MetricCard
        title="Debt to Equity"
        value={financials.debtToEquity.toFixed(2)}
        icon={ShieldAlert}
        description="Leverage indicator"
      />

      <MetricCard
        title="Current Ratio"
        value={financials.currentRatio.toFixed(2)}
        icon={Activity}
        description="Short-term liquidity"
      />
    </div>
  );
}