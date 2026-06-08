/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { ArrowRight, ExternalLink, Layers, PencilLine, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { DEMO_CONTENT_MESSAGE_TYPE, type DemoSiteContent } from '../demoStorage';
import type { ContactDetails, HeroContent, NavbarLabel, Property, RecentActivity, ServiceItem, AddOnItem, ShowcaseReel, FeatureStatItem, TestimonialItem, FAQItem } from '../types';

interface LiveSiteMirrorProps {
  content: DemoSiteContent;
  frontendUrl: string;
  isDemoMode: boolean;
  onNavigate: (viewId: string) => void;
  onRefreshPreview: () => void;
  properties: Property[];
  services: ServiceItem[];
  addons: AddOnItem[];
  reels: ShowcaseReel[];
  featureStats: FeatureStatItem[];
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
  contactDetails: ContactDetails;
  heroContent: HeroContent;
  navbarLabels: NavbarLabel[];
  activities: RecentActivity[];
}

const previewSections = [
  { id: 'properties', label: 'Edit Property Listings', hint: 'Mirror card grid, media, approvals, and pricing.' },
  { id: 'services', label: 'Edit Business Services', hint: 'Loans, interiors, paint, fencing, and more.' },
  { id: 'addons', label: 'Edit Add-on Services', hint: 'Extra business offers and upsells.' },
  { id: 'showcase', label: 'Edit Media Gallery', hint: 'Reels, walkthroughs, and hero visuals.' },
  { id: 'general-content', label: 'Edit Home Text', hint: 'Hero banner, navbar labels, and page copy.' },
  { id: 'contact', label: 'Edit Contact/Footer', hint: 'WhatsApp, email, location, and footer text.' },
  { id: 'testimonials', label: 'Edit Testimonials', hint: 'Social proof shown on the public site.' },
  { id: 'faq', label: 'Edit FAQ', hint: 'Questions and answers shown on the site.' }
];

export default function LiveSiteMirror({
  content,
  frontendUrl,
  isDemoMode,
  onNavigate,
  onRefreshPreview,
  properties,
  services,
  addons,
  reels,
  featureStats,
  testimonials,
  faqs,
  contactDetails,
  heroContent,
  navbarLabels,
  activities
}: LiveSiteMirrorProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!isDemoMode) return;

    const sendContent = () => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: DEMO_CONTENT_MESSAGE_TYPE,
          content
        },
        '*'
      );
    };

    const handleLoad = () => {
      sendContent();
      window.setTimeout(sendContent, 400);
      window.setTimeout(sendContent, 1400);
    };

    const iframe = iframeRef.current;
    iframe?.addEventListener('load', handleLoad);
    sendContent();

    return () => {
      iframe?.removeEventListener('load', handleLoad);
    };
  }, [content, isDemoMode]);

  const statCards = [
    { label: 'Properties', value: properties.length.toString() },
    { label: 'Services', value: services.length.toString() },
    { label: 'Add-ons', value: addons.length.toString() },
    { label: 'Reels', value: reels.length.toString() },
    { label: 'FAQs', value: faqs.length.toString() },
    { label: 'Testimonials', value: testimonials.length.toString() }
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-indigo-950/30 p-6 md:p-8">
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <div className="absolute -top-10 right-10 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row">
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Live site mirror
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Frontend preview, directly inside admin
              </h1>
              <p className="max-w-2xl text-sm md:text-base text-zinc-300">
                This view mirrors the public site. Use the edit shortcuts to change content, and the preview updates from the same data source.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {statCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{card.label}</div>
                  <div className="mt-2 text-2xl font-black text-white">{card.value}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onRefreshPreview}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-slate-800"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh mirror
              </button>
              <button
                type="button"
                onClick={() => window.open(frontendUrl, '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                <ExternalLink className="h-4 w-4" />
                Open public site
              </button>
            </div>
          </div>

          <div className="w-full xl:w-[420px] rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Edit shortcuts</p>
                <p className="text-sm text-zinc-300">Jump straight to the section you want to change.</p>
              </div>
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>

            <div className="space-y-2">
              {previewSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => onNavigate(section.id)}
                  className="group w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-left transition hover:border-indigo-500/40 hover:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <PencilLine className="h-4 w-4 text-indigo-400" />
                      <span className="text-sm font-semibold text-white">{section.label}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-zinc-300" />
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">{section.hint}</p>
                </button>
              ))}
            </div>

            {!isDemoMode ? (
              <p className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                Live sync works best in demo mode or when the backend session is active.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-3 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between px-3 py-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Public frontend mirror</p>
              <p className="text-sm text-zinc-300">Rendered from the same content model as the live site.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-zinc-300">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              Mirror view
            </div>
          </div>
          <iframe
            ref={iframeRef}
            title="GMM frontend mirror"
            src={`${frontendUrl}?gmmDemo=1`}
            className="h-[78vh] w-full rounded-2xl border border-slate-800 bg-white"
            loading="eager"
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Current content snapshot</p>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <div className="flex items-start justify-between gap-4">
                <span className="text-zinc-500">Hero title</span>
                <span className="text-right font-medium text-white">{heroContent.title || 'Not set yet'}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-zinc-500">Navbar labels</span>
                <span className="text-right font-medium text-white">{navbarLabels.length}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-zinc-500">Media cards</span>
                <span className="text-right font-medium text-white">{reels.length + properties.length}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-zinc-500">Feature stats</span>
                <span className="text-right font-medium text-white">{featureStats.length}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-zinc-500">Last activity</span>
                <span className="text-right font-medium text-white">{activities[0]?.details ?? 'No activity yet'}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-zinc-500">Contact email</span>
                <span className="text-right font-medium text-white">{contactDetails.email || 'Not set yet'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Editing flow</p>
            <ol className="mt-3 space-y-2 text-sm text-zinc-300">
              <li>1. Open the section you want to change.</li>
              <li>2. Edit the content in the form.</li>
              <li>3. Save to sync the mirror and public site.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
