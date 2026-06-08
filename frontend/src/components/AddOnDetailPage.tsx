import React, { useEffect } from "react";
import { ArrowRight, ArrowLeft, PhoneCall, ShieldCheck, CheckCircle2 } from "lucide-react";
import { ADD_ON_PAGE_MAP, type AddOnPageId } from "../addOnContent";

interface AddOnDetailPageProps {
  pageId: AddOnPageId;
}

const relatedPages = ["loans", "interior", "paints", "fencing"] as const;

export default function AddOnDetailPage({ pageId }: AddOnDetailPageProps) {
  const page = ADD_ON_PAGE_MAP[pageId];
  const Icon = page.icon;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pageId]);

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[520px] h-[520px] rounded-full bg-teal-500/10 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] rounded-full bg-cyan-500/10 blur-[150px]" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </a>
          <div className="flex flex-wrap items-center gap-2">
            {relatedPages.map((id) => (
              <a
                key={id}
                href={`/${id}`}
                className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
                  id === pageId
                    ? "bg-teal-500/15 border-teal-400/30 text-teal-200"
                    : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {ADD_ON_PAGE_MAP[id].title}
              </a>
            ))}
          </div>
        </div>
      </header>

      <section className="relative z-10 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${page.accent} p-8 sm:p-10 shadow-2xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-slate-950/55 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-teal-300" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-teal-300">{page.eyebrow}</p>
                      <h1 className="text-3xl sm:text-5xl font-display font-bold">{page.title}</h1>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
                    {page.description}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/919999999999?text=${encodeURIComponent(`I want details about ${page.title} from GMM Groups & Services.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-teal-blue px-5 py-3 text-sm font-semibold text-white"
                    >
                      <PhoneCall className="w-4 h-4" />
                      {page.cta}
                    </a>
                    <a
                      href="/"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      View All Services
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                    {page.bullets.map((bullet) => (
                      <div key={bullet} className="rounded-2xl bg-black/20 border border-white/5 p-4">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 mb-2" />
                        <p className="text-xs text-gray-200 leading-relaxed">{bullet}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4 text-teal-300" />
                  <h2 className="text-lg font-semibold">How it works</h2>
                </div>
                <div className="space-y-3">
                  {page.steps.map((step, index) => (
                    <div key={step} className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/5 p-4">
                      <span className="w-7 h-7 rounded-full bg-teal-500/15 border border-teal-400/20 text-teal-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">{step}</p>
                        <p className="text-xs text-gray-400 mt-1">Dedicated support from enquiry to completion.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <h2 className="text-lg font-semibold mb-3">Best for</h2>
                <p className="text-sm text-gray-300 leading-relaxed">
                  This page is ideal for clients who want a focused, service-specific experience with its own URL and enquiry flow.
                </p>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  You can share this route directly in marketing campaigns, WhatsApp messages, or QR codes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
