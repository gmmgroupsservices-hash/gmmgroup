import React, { useState } from "react";
import { ArrowRight, Paintbrush, Hammer, HandCoins, BrickWall, ShieldCheck, CheckCircle2, PhoneCall } from "lucide-react";
import { AddOnItem } from "../types";

type AddOnId = "loans" | "interior" | "paints" | "fencing";

type DefaultAddOn = AddOnItem & {
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  details: string[];
  cta: string;
};

const defaultAddOns: DefaultAddOn[] = [
  {
    id: "loans" as AddOnId,
    title: "Home Loans",
    icon: HandCoins,
    accent: "from-emerald-500/20 to-teal-500/10",
    details: [
      "Loan eligibility review",
      "Pre-approval assistance",
      "Bank comparison support",
      "EMI planning and guidance"
    ],
    description: "Get guided support for home loans, refinancing, and pre-approval workflows tied to your property search.",
    cta: "Explore Loans"
  },
  {
    id: "interior" as AddOnId,
    title: "Interior Design",
    icon: Hammer,
    accent: "from-violet-500/20 to-indigo-500/10",
    details: [
      "Space planning",
      "Modular kitchen concepts",
      "Luxury finishes",
      "Turnkey execution"
    ],
    description: "From layout ideas to premium finishing, we can connect interior concepts to the home you choose.",
    cta: "View Interiors"
  },
  {
    id: "paints" as AddOnId,
    title: "Paint Works",
    icon: Paintbrush,
    accent: "from-sky-500/20 to-cyan-500/10",
    details: [
      "Exterior paint",
      "Interior theme palettes",
      "Waterproof coatings",
      "Premium texture finishes"
    ],
    description: "Refresh homes and commercial spaces with color planning, premium coatings, and long-life finish options.",
    cta: "See Paints"
  },
  {
    id: "fencing" as AddOnId,
    title: "Fencing Works",
    icon: BrickWall,
    accent: "from-orange-500/20 to-amber-500/10",
    details: [
      "Compound wall fencing",
      "Property boundary security",
      "Gate and grill works",
      "Perimeter design consultation"
    ],
    description: "Secure and define your asset with fencing solutions for residential, commercial, and plotted layouts.",
    cta: "Open Fencing"
  }
] as const;

interface BusinessAddOnsProps {
  addOns?: AddOnItem[];
}

export default function BusinessAddOns({ addOns }: BusinessAddOnsProps) {
  const [active, setActive] = useState<AddOnId>("loans");

  const sourceAddOns: DefaultAddOn[] = defaultAddOns.map((base) => {
    const override = addOns?.find((item) => item.id === base.id);
    return {
      ...base,
      title: override?.title ?? base.title,
      description: override?.description ?? base.description,
      cta: override?.cta ?? base.cta
    };
  });
  const activeItem = sourceAddOns.find((item) => item.id === active) ?? sourceAddOns[0];
  const ActiveIcon = activeItem.icon;

  return (
    <section id="business-addons" className="py-24 relative overflow-hidden bg-slate-950/80">
      <div className="absolute top-0 left-1/4 w-[420px] h-[420px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[380px] h-[380px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 bg-teal-500/10 border border-teal-500/10 px-2.5 py-1 rounded-full block w-fit mx-auto mb-3 font-outfit">
            Business Add-Ons
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Extra Services for Your <span className="text-gradient">Property Journey</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-3 leading-relaxed">
            Separate service pages for loans, interior works, paints, and fencing so users can explore each add-on independently.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-3">
            {sourceAddOns.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`w-full text-left rounded-2xl border transition-all duration-300 p-4 ${
                    isActive
                      ? "bg-white/5 border-teal-500/25 shadow-lg shadow-teal-500/5"
                      : "bg-slate-900/70 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.accent} flex items-center justify-center border border-white/5`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${activeItem.accent} opacity-40 pointer-events-none`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                      <ActiveIcon className="w-6 h-6 text-teal-300" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-white">{activeItem.title}</h3>
                      <p className="text-xs text-gray-400">Dedicated service page</p>
                    </div>
                  </div>
                  <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-teal-blue text-white text-xs font-semibold">
                    <PhoneCall className="w-4 h-4" />
                    Enquire Now
                  </button>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
                  {activeItem.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  {activeItem.details.map((detail) => (
                    <div key={detail} className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/20 px-4 py-3">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <span className="text-sm text-gray-200">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
                  <a
                    href={`#${activeItem.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-teal-blue px-5 py-3 text-sm font-semibold text-white"
                  >
                    {activeItem.cta}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <p className="text-xs text-gray-400">
                    Each service can be expanded into its own full page later if you want separate routes.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {sourceAddOns.map((item) => (
                <div
                  key={item.id}
                  id={item.id}
                  className="rounded-2xl border border-white/5 bg-slate-900/60 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
