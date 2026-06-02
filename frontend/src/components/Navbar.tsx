import React, { useState, useEffect } from "react";
import { Menu, X, Heart, Layers, MessageSquare, ShieldCheck, User } from "lucide-react";
import gmmLogo from "../assets/gmm logo-01.png";
import { NavbarLabel } from "../types";

interface NavbarProps {
  favoritesCount: number;
  compareCount: number;
  onOpenFavorites: () => void;
  onOpenCompare: () => void;
  onScrollToSection: (sectionId: string) => void;
  labels?: NavbarLabel[];
}

export default function Navbar({
  favoritesCount,
  compareCount,
  onOpenFavorites,
  onOpenCompare,
  onScrollToSection,
  labels
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Simple active section highlights
      const sections = ["home", "services", "business-addons", "listings", "reels", "ai-advisor", "about", "contact"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaultMenuItems: NavbarLabel[] = [
    { label: "Home", id: "home" },
    { label: "Services", id: "services" },
    { label: "Add-ons", id: "business-addons" },
    { label: "Properties", id: "listings" },
    { label: "Showcase", id: "reels" },
    { label: "AI Advisor", id: "ai-advisor" },
    { label: "Sovereign Stat", id: "about" },
    { label: "Contact", id: "contact" }
  ];
  const menuItems = defaultMenuItems.map((item) => {
    const override = labels?.find((label) => label.path === item.id || label.id === item.id);
    return {
      ...item,
      label: override?.label ?? item.label
    };
  });

  const handleNavClick = (id: string) => {
    onScrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      id="gmm-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-gray-950/75 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick("home")}
            className="flex items-center cursor-pointer group rounded-2xl bg-slate-950/25 backdrop-blur-md border border-white/10 p-2 shadow-md"
          >
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm ring-1 ring-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 bg-white">
              <img
                src={gmmLogo}
                alt="GMM Groups & Services logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all duration-300 ${
                  activeSection === item.id
                    ? "text-teal-300 bg-teal-500/10 border border-teal-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions Left & Right */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Favorites Icon */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-xl border border-white/5 hover:border-teal-500/20 hover:bg-white/5 text-gray-300 hover:text-teal-400 transition-all duration-300"
              title="Saved Properties"
            >
              <Heart className="w-4.5 h-4.5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Compare Drawer Toggle */}
            <button
              onClick={onOpenCompare}
              className="relative p-2 rounded-xl border border-white/5 hover:border-teal-500/20 hover:bg-white/5 text-gray-300 hover:text-teal-400 transition-all duration-300"
              title="Compare Properties"
            >
              <Layers className="w-4.5 h-4.5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Premium WhatsApp Slogan CTA */}
            <a
              href="https://wa.me/919999999999?text=I%20am%20interested%20in%20exclusive%20GMM%20properties."
              target="_blank"
              rel="noreferrer"
              className="glow-btn bg-gradient-teal-blue text-white px-5 py-2 rounded-xl text-xs font-semibold tracking-wide hover:shadow-cyan-500/20 shadow-md flex items-center space-x-2 border border-teal-400/20 hover:scale-103 active:scale-97 transition-all duration-300"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact GMM</span>
            </a>
          </div>

          {/* Mobile Navigation Toggles */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Quick favorites for mobile */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 text-gray-300 hover:text-teal-400"
            >
              <Heart className="w-4.5 h-4.5" />
              {favoritesCount > 0 && (
                <span className="absolute top-0 right-0 bg-teal-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">-</span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sliding Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-gray-950/95 backdrop-blur-xl border-b border-white/10 py-5 px-4 shadow-2xl transition-all duration-300">
          <div className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? "text-teal-300 bg-teal-500/10 border-l-2 border-teal-400"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenCompare(); }}
                className="flex items-center space-x-2 text-xs text-gray-300 hover:text-teal-300"
              >
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Compare Slots ({compareCount})</span>
              </button>
              
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
                className="bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Direct WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
