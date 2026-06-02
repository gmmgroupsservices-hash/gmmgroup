/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Briefcase, 
  Layers,
  Settings, 
  MessageSquareCode, 
  Sparkles,
  Clapperboard,
  Menu,
  X,
  PhoneCall,
  HelpCircle
  ,
  KeyRound
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ currentView, setCurrentView, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'properties', label: 'Property Listings', icon: Building2 },
    { id: 'services', label: 'Business Services', icon: Briefcase },
    { id: 'addons', label: 'Add-on Services', icon: Layers },
    { id: 'showcase', label: 'Media Gallery', icon: Clapperboard },
    { id: 'stats', label: 'Trust Stats', icon: Sparkles },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareCode },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'ai-advisor', label: 'AI Advisor Text', icon: Sparkles },
    { id: 'general-content', label: 'Home Page Text', icon: Settings },
    { id: 'contact', label: 'Contact & Footer', icon: PhoneCall },
    { id: 'admin-access', label: 'Admin Access', icon: KeyRound },
  ];

  const handleNav = (viewId: string) => {
    setCurrentView(viewId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          id="mobile-backdrop"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 w-64 bg-[#0B1120] border-r border-slate-850 flex flex-col z-50 lg:sticky lg:translate-x-0 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div id="sidebar-header" className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 accent-bg flex items-center justify-center font-bold text-white tracking-wider shadow-lg shadow-indigo-500/10">
              G
            </div>
            <div>
              <p className="font-bold text-white tracking-wide text-sm font-sans">GMM Admin</p>
              <p className="text-[10px] text-zinc-450 font-mono tracking-wider">CONTENT MENU</p>
            </div>
          </div>
          <button 
            id="close-sidebar-btn"
            className="lg:hidden text-zinc-400 hover:text-white p-1 rounded-md hover:bg-slate-900 transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav id="sidebar-nav" className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-800/60 text-indigo-400 border-l-2 border-indigo-500 pl-3'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-slate-800/30'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div id="sidebar-footer" className="p-4 border-t border-slate-800 bg-[#0B1120]">
          <div className="flex items-center gap-3 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/40">
            <div className="w-8 h-8 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-400 font-bold text-xs ring-1 ring-indigo-500/30">
              SD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-zinc-200 truncate font-sans">Sakshi Desai</p>
              <p className="text-[10px] text-zinc-500 truncate font-mono">sakshidesai314@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
