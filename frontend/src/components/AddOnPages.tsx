import React from "react";
import { ArrowRight, HandCoins, Hammer, Paintbrush, BrickWall, CheckCircle2, PhoneCall, ShieldCheck } from "lucide-react";
import { AddOnItem } from "../types";

type AddOnPageId = "loans" | "interior" | "paints" | "fencing";

type AddOnPage = {
  id: AddOnPageId;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
  bullets: string[];
  steps: string[];
  cta: string;
};

const defaultPages: AddOnPage[] = [
  {
    id: "loans",
    eyebrow: "Financial Support",
    title: "Home Loans",
    description: "A dedicated page for loan assistance, pre-approval support, and lender coordination tied to your property search.",
    accent: "from-emerald-500/20 via-teal-500/10 to-cyan-500/5",
    icon: HandCoins,
    bullets: ["Eligibility review", "Pre-approval support", "Bank comparison", "EMI guidance"],
    steps: ["Share your budget", "Check eligibility", "Review offers", "Move to approval"],
    cta: "Start Loan Enquiry"
  },
  {
    id: "interior",
    eyebrow: "Design Support",
    title: "Interior Design",
    description: "A service page for space planning, premium styling, and turnkey interiors for homes and investment properties.",
    accent: "from-violet-500/20 via-fuchsia-500/10 to-indigo-500/5",
    icon: Hammer,
    bullets: ["Space planning", "Modular kitchen concepts", "Luxury finishes", "Turnkey execution"],
    steps: ["Book a consultation", "Share floor plan", "Approve concept", "Begin execution"],
    cta: "View Interior Options"
  },
  {
    id: "paints",
    eyebrow: "Finish Works",
    title: "Paint Works",
    description: "A dedicated page for interior and exterior paint packages, waterproofing, texture finishes, and color planning.",
    accent: "from-sky-500/20 via-cyan-500/10 to-blue-500/5",
    icon: Paintbrush,
    bullets: ["Exterior coatings", "Interior palette planning", "Waterproofing", "Premium textures"],
    steps: ["Choose finish type", "Confirm palette", "Schedule site visit", "Complete painting"],
    cta: "Explore Paint Packages"
  },
  {
    id: "fencing",
    eyebrow: "Boundary Works",
    title: "Fencing Works",
    description: "A service page for compound walls, boundary protection, gate works, and perimeter design for plots and developments.",
    accent: "from-orange-500/20 via-amber-500/10 to-yellow-500/5",
    icon: BrickWall,
    bullets: ["Boundary walls", "Gate and grill works", "Perimeter security", "Layout fencing"],
    steps: ["Inspect site", "Select fencing type", "Approve drawings", "Install boundary"],
    cta: "Open Fencing Inquiry"
  }
];

interface AddOnPagesProps {
  addOns?: AddOnItem[];
}

export default function AddOnPages({ addOns }: AddOnPagesProps) {
  const mergedPages = defaultPages.map((page) => {
    const override = addOns?.find((item) => item.id === page.id);
    return {
      ...page,
      title: override?.title ?? page.title,
      description: override?.description ?? page.description
    };
  });

  return (
    <section id="addon-pages" className="py-24 relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[480px] h-[480px] rounded-full bg-teal-500/5 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] rounded-full bg-sky-500/5 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 bg-teal-500/10 border border-teal-500/10 px-2.5 py-1 rounded-full block w-fit mx-auto mb-3 font-outfit">
            Extra Pages
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Dedicated Pages for <span className="text-gradient">Business Add-Ons</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-3 leading-relaxed">
            Each add-on gets a separate page-style section so customers can explore loans, interiors, paints, and fencing independently.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {mergedPages.map((page) => {
            const Icon = page.icon;

            return (
              <article
                key={page.id}
                id={page.id}
                className="relative rounded-3xl border border-white/10 bg-slate-900/80 overflow-hidden shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${page.accent} opacity-60 pointer-events-none`} />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-5 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-teal-300" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-teal-300">{page.eyebrow}</p>
                        <h3 className="text-2xl font-display font-bold text-white">{page.title}</h3>
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 leading-relaxed">
                      {page.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {page.bullets.map((item) => (
                        <span key={item} className="text-[10px] bg-black/25 border border-white/10 text-gray-200 px-3 py-1.5 rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>

                    <a
                      href={`https://wa.me/919999999999?text=${encodeURIComponent(`I want details about ${page.title} from GMM Groups & Services.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-teal-blue px-5 py-3 text-sm font-semibold text-white"
                    >
                      <PhoneCall className="w-4 h-4" />
                      {page.cta}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="lg:col-span-7 p-6 sm:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-black/20 border border-white/5 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <ShieldCheck className="w-4 h-4 text-teal-300" />
                          <h4 className="text-sm font-semibold text-white">What’s included</h4>
                        </div>
                        <ul className="space-y-2">
                          {page.steps.map((step) => (
                            <li key={step} className="flex items-start gap-2 text-sm text-gray-300">
                              <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl bg-black/20 border border-white/5 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <ShieldCheck className="w-4 h-4 text-sky-300" />
                          <h4 className="text-sm font-semibold text-white">Best for</h4>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          This page is ideal for visitors who want a focused service experience instead of one generic add-ons page.
                        </p>
                        <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                          You can later turn each section into a separate routed page if you want full URLs like `/loans`, `/interior-design`, and so on.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/5 bg-black/15 p-4 flex items-center justify-between gap-4">
                      <p className="text-sm text-gray-300">
                        Need a brochure, site visit, or quote for this add-on?
                      </p>
                      <a
                        href={`https://wa.me/919999999999?text=${encodeURIComponent(`Please share a quote for ${page.title}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                      >
                        Get Quote
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
