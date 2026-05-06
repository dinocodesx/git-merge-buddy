import { Zap, X } from "lucide-react";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { PRICING_FEATURES } from "@/constants/pricing";
import { PricingFeature } from "@/types/Pricing";

const FeatureCell = ({
  value,
  isHighlighted = false,
}: {
  value: boolean | string;
  isHighlighted?: boolean;
}) => {
  const content = () => {
    if (value === true) {
      return (
        <Zap size={20} className="mx-auto text-primary" fill="currentColor" />
      );
    }
    if (value === "Partial") {
      return <span className="text-xs">PARTIAL</span>;
    }
    if (typeof value === "string") {
      return <span className="text-xs uppercase">{value}</span>;
    }
    return <X size={20} className="mx-auto opacity-20" />;
  };

  return (
    <td
      className={`p-6 text-center ${isHighlighted ? "border-x-4 border-primary/20 bg-primary/5" : ""}`}
    >
      {content()}
    </td>
  );
};

const FeatureRow = ({
  feature,
  index,
}: {
  feature: PricingFeature;
  index: number;
}) => (
  <tr
    className={`border-b-2 border-primary/10 ${index % 2 === 0 ? "bg-zinc-900/50" : ""}`}
  >
    <td className="p-6">
      <div className="font-bold uppercase text-sm md:text-base">
        {feature.name}
      </div>
      <div className="text-[10px] opacity-40 font-work mt-1 lowercase">
        {feature.detail}
      </div>
    </td>
    <FeatureCell value={feature.solo} />
    <FeatureCell value={feature.pro} isHighlighted />
    <FeatureCell value={feature.enterprise} />
  </tr>
);

export default function PricingPage() {
  return (
    <div className="bg-zinc-900 min-h-screen py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-8xl tracking-tighter text-primary uppercase font-space font-bold">
            Compare Plans
          </h1>
          <p className="text-xl opacity-60 text-white font-work uppercase">
            Detailed breakdown of engineering capabilities.
          </p>
        </div>

        <div className="bg-black border-4 border-primary shadow-brutal overflow-x-auto">
          <table className="w-full text-left font-space border-collapse">
            <thead>
              <tr className="bg-primary text-black border-b-4 border-black">
                <th className="p-6 text-xl">Capability & Context</th>
                <th className="p-6 text-xl text-center">Solo ($5)</th>
                <th className="p-6 text-xl text-center bg-black text-primary">
                  Pro ($20)
                </th>
                <th className="p-6 text-xl text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {PRICING_FEATURES.map((f, i) => (
                <FeatureRow key={f.name} feature={f} index={i} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center pt-8">
          <BrutalButton size="lg" as="a" href="#waitlist">
            Secure Your License
          </BrutalButton>
        </div>
      </div>
    </div>
  );
}
