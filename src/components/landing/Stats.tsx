import Section from "@/components/common/Section";
import SectionHeader from "@/components/common/SectionHeader";
import StatCard from "@/components/common/StatCard";
import {
  BrainCircuit,
  Building2,
  Newspaper,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    icon: Building2,
    value: "10K+",
    label: "Companies",
  },
  {
    icon: Newspaper,
    value: "1M+",
    label: "News Articles",
  },
  {
    icon: BrainCircuit,
    value: "AI",
    label: "Multi-Agent Analysis",
  },
  {
    icon: TrendingUp,
    value: "24/7",
    label: "Market Monitoring",
  },
];

export default function Stats() {
  return (
    <Section>
      <SectionHeader
        title="Trusted AI Research"
        subtitle="Built to analyze companies using financial data, market news, and intelligent reasoning."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </div>
    </Section>
  );
}