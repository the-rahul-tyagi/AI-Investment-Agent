import {
  BrainCircuit,
  Building2,
  Newspaper,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Company Research",
    description:
      "Analyze company profile, business model, industry, management, and market position.",
  },
  {
    icon: Newspaper,
    title: "Latest News",
    description:
      "Fetch recent news, earnings reports, acquisitions, and market updates.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Assessment",
    description:
      "Evaluate financial, operational, competitive, and macroeconomic risks.",
  },
  {
    icon: BrainCircuit,
    title: "AI Recommendation",
    description:
      "Receive a clear Invest, Watch, or Pass recommendation with detailed reasoning.",
  },
];

export default function Features() {
  return (
    <section className="py-24">
      <div className="container-custom">
        <div className="text-center">
          <h2 className="text-5xl font-bold">
            Everything an Investor Needs
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-slate-400">
            Our AI combines financial analysis, market news,
            competitor research, and reasoning to generate
            transparent investment recommendations.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="card-premium p-8 bg-[#0b0f19]/60 hover:border-emerald-500/20"
              >
                <div className="mb-6 inline-flex rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/20">
                  <Icon
                    size={24}
                    className="text-emerald-400"
                  />
                </div>

                <h3 className="mb-4 text-xl font-bold text-white tracking-tight">
                  {feature.title}
                </h3>

                <p className="leading-relaxed text-sm text-slate-400 font-medium">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}