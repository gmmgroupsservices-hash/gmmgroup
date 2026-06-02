/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  Image, 
  FileText, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  ClipboardList,
  Flame,
  UserCheck,
  Check,
  Eye,
  Info
} from 'lucide-react';
import { Property, ServiceItem, AddOnItem, ShowcaseReel, RecentActivity } from '../types';

interface DashboardOverviewProps {
  properties: Property[];
  services: ServiceItem[];
  addons: AddOnItem[];
  reels: ShowcaseReel[];
  activities: RecentActivity[];
  onNavigate: (viewId: string) => void;
  onAddProperty: () => void;
  onAddService: () => void;
  onAddAddonChange: () => void;
}

export default function DashboardOverview({
  properties,
  services,
  addons,
  reels,
  activities,
  onNavigate,
  onAddProperty,
  onAddService,
  onAddAddonChange,
}: DashboardOverviewProps) {
  const [activityFilter, setActivityFilter] = useState<'all' | 'property' | 'service' | 'media' | 'general'>('all');

  // Compute stats
  const totalProperties = properties.length;
  const featuredProperties = properties.filter(p => p.featured).length;
  
  // Count media items
  const totalImages = properties.reduce((acc, p) => acc + (p.images?.length || 0), 0);
  const totalVideos = properties.reduce((acc, p) => acc + (p.videos?.length || 0), 0);
  const totalMedia = totalImages + totalVideos;

  // Counts of published/draft
  const publishedProperties = properties.filter(p => p.status === 'Published').length;
  const draftProperties = properties.filter(p => p.status === 'Draft').length;

  const publishedServices = services.filter(s => s.status === 'Published').length;
  const draftServices = services.filter(s => s.status === 'Draft').length;

  const publishedReels = reels.filter(r => r.status === 'Published').length;
  const draftReels = reels.filter(r => r.status === 'Draft').length;

  const totalPublished = publishedProperties + publishedServices + publishedReels + addons.filter(a => a.status === 'Published').length;
  const totalDraft = draftProperties + draftServices + draftReels + addons.filter(a => a.status === 'Draft').length;
  const grandTotalItems = totalPublished + totalDraft;

  // Filter activities
  const filteredActivities = activities
    .filter(act => activityFilter === 'all' || act.type === activityFilter)
    .slice(0, 8); // Top 8 relative logs

  const getRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'text-emerald-400 bg-emerald-950/40 ring-emerald-500/30';
      case 'publish': return 'text-sky-400 bg-sky-950/40 ring-sky-500/30';
      case 'update': return 'text-amber-400 bg-amber-950/40 ring-amber-500/30';
      case 'delete': return 'text-rose-400 bg-rose-950/40 ring-rose-500/30';
      default: return 'text-zinc-400 bg-zinc-900 ring-zinc-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Hero Grid Banner */}
      <div 
        id="dashboard-hero-card"
        className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0B1120]/40 p-6 md:p-8"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-mono tracking-wider px-2 py-0.5 rounded-full uppercase font-bold ring-1 ring-indigo-400/20">
                GMM GROUPS CONTROL HUB
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-display">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">GMM Administrator</span>
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl font-sans">
              Oversee properties, verify RERA compliance listings, update details, organize galleries, and manage home banner text easily from one dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              id="dash-add-prop-shortcut"
              onClick={onAddProperty}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 font-sans"
            >
              <Plus className="w-4 h-4" />
              Add PropertyListing
            </button>
            <button
              id="dash-view-prop-shortcut"
              onClick={() => onNavigate('properties')}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-zinc-300 font-semibold text-xs py-2.5 px-4 rounded-xl border border-slate-800 transition-all font-sans"
            >
              Manage Listings
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Core Counters Metrics - Grid Row */}
      <div id="stats-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Core Properties Card */}
        <div className="glass p-5 rounded-2xl flex items-center justify-between shadow-lg relative group transition-all duration-300">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-400 font-sans tracking-wide">Total Properties</span>
            <p className="text-3xl font-bold font-mono tracking-tight text-white">{totalProperties}</p>
            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
              Active stock database listings
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Featured Properties Card */}
        <div className="glass p-5 rounded-2xl flex items-center justify-between shadow-lg relative group transition-all duration-300">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-400 font-sans tracking-wide">Featured Items</span>
            <p className="text-3xl font-bold font-mono tracking-tight text-indigo-400">{featuredProperties}</p>
            <span className="text-[10px] text-zinc-500 font-mono">
              Highlighted on GMM homepage
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Total Media Uploads Card */}
        <div className="glass p-5 rounded-2xl flex items-center justify-between shadow-lg relative group transition-all duration-300">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-400 font-sans tracking-wide">Total Media Uploaded</span>
            <p className="text-3xl font-bold font-mono tracking-tight text-[#10B981]">{totalMedia}</p>
            <span className="text-[10px] text-zinc-500 font-mono">
              {totalImages} Photos &bull; {totalVideos} Video reels
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Image className="w-6 h-6" />
          </div>
        </div>

        {/* Status Ratio Coverage Card */}
        <div className="glass p-5 rounded-2xl flex items-center justify-between shadow-lg relative group transition-all duration-300">
          <div className="space-y-1 w-full">
            <span className="text-xs font-semibold text-zinc-400 font-sans tracking-wide block">Published vs Draft Items</span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-bold text-zinc-100">{publishedProperties}</span>
              <span className="text-xs text-zinc-400 font-mono">Published</span>
              <span className="text-zinc-650">/</span>
              <span className="text-2xl font-bold text-zinc-400">{draftProperties}</span>
              <span className="text-xs text-zinc-500 font-mono">Drafts</span>
            </div>
            {/* Minimal ratio progress indicator bar */}
            <div className="w-full bg-[#1e293b] h-1.5 rounded-full mt-2 overflow-hidden flex">
              <div 
                className="bg-indigo-500 h-full" 
                style={{ width: `${(publishedProperties / (totalProperties || 1)) * 100}%` }} 
              />
              <div 
                className="bg-zinc-600 h-full" 
                style={{ width: `${(draftProperties / (totalProperties || 1)) * 100}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Sections: Quick Actions + Analytics / Recent Activities */}
      <div id="analytics-split" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Quick Command Dock (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide font-sans flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              Quick Section Management
            </h3>
            <p className="text-xs text-zinc-400">
              Jump instantly to any section of the GMM Groups platform to adjust layout texts or properties.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => onNavigate('properties')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700 text-left text-xs text-zinc-300 transition-all font-sans"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Real Estate Listings (8 Max Photos)</span>
                </div>
                <ChevronRightSmall />
              </button>

              <button
                onClick={() => onNavigate('services')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700 text-left text-xs text-zinc-300 transition-all font-sans"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Core Business Services</span>
                </div>
                <ChevronRightSmall />
              </button>

              <button
                onClick={() => onNavigate('addons')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700 text-left text-xs text-zinc-300 transition-all font-sans"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Service Add-ons & Extras</span>
                </div>
                <ChevronRightSmall />
              </button>

              <button
                onClick={() => onNavigate('showcase')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700 text-left text-xs text-zinc-300 transition-all font-sans"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>Interactive Showcase & Reels</span>
                </div>
                <ChevronRightSmall />
              </button>

              <button
                onClick={() => onNavigate('ai-advisor')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700 text-left text-xs text-zinc-300 transition-all font-sans"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>AI Advisor Text</span>
                </div>
                <ChevronRightSmall />
              </button>

              <button
                onClick={() => onNavigate('general-content')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700 text-left text-xs text-zinc-300 transition-all font-sans"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  <span>Hero Text, Navbar Labels & Banners</span>
                </div>
                <ChevronRightSmall />
              </button>
            </div>
          </div>

          {/* Quick Metrics Breakdown Table */}
          <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-zinc-300 font-sans tracking-wide">DATABASE COUNTS</h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-zinc-900 text-zinc-400">
                <span>Properties in Stock</span>
                <span className="text-white font-bold">{totalProperties}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900 text-zinc-400">
                <span>Offered Services</span>
                <span className="text-white font-bold">{services.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900 text-zinc-400 font-sans">
                <span>Offered Add-ons</span>
                <span className="text-white font-mono font-bold">{addons.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900 text-zinc-400 font-sans">
                <span>Showcase Reels</span>
                <span className="text-white font-mono font-bold">{reels.length}</span>
              </div>
              <div className="flex justify-between py-1 text-zinc-400">
                <span>Total Items (Combined)</span>
                <span className="text-emerald-400 font-bold">{grandTotalItems}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Recent Activity Logs (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide font-sans flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-emerald-400" />
                  Recent Activity Logs
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Real-time recording of content alterations.
                </p>
              </div>

              {/* Activity Category Filters */}
              <div className="flex flex-wrap gap-1">
                {(['all', 'property', 'service', 'media', 'general'] as const).map(filter => (
                  <button
                    key={filter}
                    id={`filter-${filter}`}
                    onClick={() => setActivityFilter(filter)}
                    className={`text-[10px] px-2 py-1 rounded-md font-medium transition-all uppercase ${
                      activityFilter === filter
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List log items */}
            {filteredActivities.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs font-sans">
                No recent activities found for filter: "{activityFilter}"
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {filteredActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl flex items-start gap-3 hover:border-zinc-800/80 transition-colors"
                  >
                    <div className={`mt-0.5 text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full uppercase ring-1 ${getActionColor(act.action)}`}>
                      {act.action}
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <p className="text-xs text-zinc-200 font-sans leading-relaxed">{act.details}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
                          Type: {act.type}
                        </span>
                        <span className="text-zinc-700 text-sm">&middot;</span>
                        <span className="text-[10px] text-zinc-400">
                          {getRelativeTime(act.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-900 mt-4 flex justify-between items-center text-[10px] text-zinc-500 font-sans">
            <span>Showing up to 8 logged changes</span>
            <span className="text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live session tracker connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRightSmall() {
  return (
    <span className="bg-zinc-950 p-1 rounded-lg border border-zinc-800/80 text-zinc-500 group-hover:text-zinc-200 group-hover:border-zinc-700/80 transition-all">
      <ArrowRight className="w-3 h-3" />
    </span>
  );
}
