import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="card card-hover h-full p-8">
      <div className="mb-6 inline-flex rounded-2xl bg-emerald-500/15 p-4">
        <Icon
          size={30}
          className="text-emerald-400"
        />
      </div>

      <h3 className="mb-4 text-xl font-semibold">
        {title}
      </h3>

      <p className="leading-7 text-slate-400">
        {description}
      </p>
    </div>
  );
}