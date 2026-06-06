/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Menu, 
  PlusCircle, 
  Sparkles, 
  ExternalLink,
  CheckCircle,
  Clock,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onQuickAction: (actionType: string) => void;
  isSaving?: boolean;
  onLogout?: () => void;
  isDemoMode?: boolean;
  onPreviewFrontend?: () => void;
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  onQuickAction,
  isSaving = false,
  onLogout,
  isDemoMode = false,
  onPreviewFrontend
}: HeaderProps) {
  // Get formatted current date in local time or simple reader format
  const getFormattedDate = () => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <header 
      id="main-header"
      className="h-16 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30"
    >
      {/* Mobile Sidebar Toggle & Date */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-sidebar-toggle"
          tabIndex={0}
          className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex flex-col">
          <h2 className="text-sm font-semibold text-zinc-100 font-sans tracking-tight">GMM Content Admin</h2>
          <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3 h-3 text-zinc-500" />
            {getFormattedDate()} (UTC)
          </span>
        </div>
      </div>

      {/* Action panel & Buttons */}
      <div className="flex items-center gap-3">
        {/* Saving indicator status */}
        {isSaving ? (
          <div className="hidden md:flex items-center gap-1.5 text-zinc-400 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            SAVING DRAFT...
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 text-indigo-400 bg-indigo-950/20 px-3 py-1.5 rounded-full border border-indigo-900/30 text-[10px] font-mono">
            <CheckCircle className="w-3 h-3 text-indigo-400" />
            UP TO DATE (LOCAL)
          </div>
        )}

        {/* Rapid Shortcut Actions */}
        <div className="flex items-center gap-2">
          {isDemoMode && onPreviewFrontend ? (
            <button
              id="preview-frontend-btn"
              onClick={onPreviewFrontend}
              className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/15 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
              title="Open frontend demo preview"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview Frontend</span>
            </button>
          ) : null}

          {/* Add property shortcut button */}
          <button
            id="quick-add-property-btn"
            onClick={() => onQuickAction('add-property')}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-900/20 active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Property</span>
          </button>

          {/* Quick AI Advisor preview shortcut */}
          <button
            id="quick-ai-preview"
            onClick={() => onQuickAction('ai-playground')}
            className="bg-slate-900 border border-slate-800 text-zinc-350 hover:text-white hover:bg-slate-800 p-2 rounded-xl transition-all font-semibold text-xs flex items-center gap-1.5 active:scale-95"
            title="AI Advisor Playground"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span className="hidden sm:inline">Test AI</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-zinc-800 mx-1 hidden sm:block" />

        {/* User Badge Info display only */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden xl:block">
            <p className="text-xs font-semibold text-zinc-100 italic">GMM Partner</p>
            <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Super Administrator</p>
          </div>
          {onLogout ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
