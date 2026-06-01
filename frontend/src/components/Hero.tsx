import React, { useState } from "react";
import { Play, ArrowRight, ShieldCheck, Award, MessageSquare } from "lucide-react";

interface HeroProps {
  onExploreClick: () => void;
  onContactClick: () => void;
}

export default function Hero({ onExploreClick, onContactClick }: HeroProps) {
  const [showTourVideo, setShowTourVideo] = useState(false);

  return (
    <header id="home" className="relative min-h-[88vh] flex items-center justify-center overflow-hidden pt-24 bg-gray-950">
      
      {/* High-resolution Cinematic Luxury Real Estate Visuals */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/20 via-gray-940/70 to-gray-950 z-10" />
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"
          alt="GMM Sovereign Estate Background"
          className="w-full h-full object-cover scale-105 animate-pulse-subtle"
          style={{ animationDuration: "12s" }}
        />
        {/* Ambient Moving Tech Grids */}
        <div className="absolute inset-0 tech-grid opacity-30 z-5" />
      </div>

      {/* Floating Cinematic Particle Glow Rings */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-10">
        
        {/* Dynamic Launch Label */}
        <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-teal-500/20 text-xs font-semibold mb-6 animate-fade-in-down">
          <Award className="w-3.5 h-3.5 text-teal-400 animate-spin-slow" />
          <span className="text-teal-300 font-outfit uppercase tracking-widest text-[10px]">
            Sovereign Estate Portfolio 2026
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
        </div>

        {/* Big Displays Title */}
        <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none mb-6">
          <span className="block text-white">Find Your Dream Property</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-teal-400 to-sky-400 font-extrabold mt-1">
            With GMM Groups & Services
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed font-outfit font-light mb-10">
          The ultimate single-destination premium portal for certified lands, 
          architectural villas, and institutional offices across Karnataka, Telangana, and Andhra Pradesh.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto glow-btn bg-gradient-teal-blue text-white font-medium px-8 py-3.5 rounded-xl text-sm tracking-wide shadow-xl shadow-teal-500/10 flex items-center justify-center space-x-2 border border-teal-400/20 hover:scale-103 active:scale-97 cursor-pointer transition-all duration-300"
          >
            <span>Explore Properties</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={onContactClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-medium border border-white/10 hover:border-teal-500/30 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center space-x-2 hover:scale-103 active:scale-97 cursor-pointer transition-all duration-300"
          >
            <MessageSquare className="w-4 h-4 text-teal-400" />
            <span>Contact Agent</span>
          </button>

          {/* Watch Tour Play CTA */}
          <button
            onClick={() => setShowTourVideo(true)}
            className="w-full sm:w-auto px-6 py-3.5 text-xs text-teal-200 hover:text-white flex items-center justify-center space-x-2 group focus:outline-none"
          >
            <span className="w-9 h-9 rounded-full bg-teal-500/25 group-hover:bg-teal-500/40 flex items-center justify-center transition-all duration-300">
              <Play className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
            </span>
            <span className="font-outfit font-semibold tracking-wider uppercase">Watch Estate Tour</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto pt-8">
          <div className="text-center rounded-2xl bg-slate-950/55 border border-white/5 px-4 py-4">
            <p className="text-xl sm:text-3xl font-display font-medium text-white">₹1,200 Cr+</p>
            <p className="text-[10px] text-teal-400 uppercase tracking-wider font-outfit mt-1.5">Transaction Value</p>
          </div>
          <div className="text-center rounded-2xl bg-slate-950/55 border border-white/5 px-4 py-4">
            <p className="text-xl sm:text-3xl font-display font-medium text-white">100%</p>
            <p className="text-[10px] text-teal-400 uppercase tracking-wider font-outfit mt-1.5">RERA Registered</p>
          </div>
          <div className="text-center rounded-2xl bg-slate-950/55 border border-white/5 px-4 py-4">
            <p className="text-xl sm:text-3xl font-display font-medium text-white">150+</p>
            <p className="text-[10px] text-teal-400 uppercase tracking-wider font-outfit mt-1.5">Founders Advisory</p>
          </div>
          <div className="text-center rounded-2xl bg-slate-950/55 border border-white/5 px-4 py-4">
            <p className="text-xl sm:text-3xl font-display font-medium text-white">&lt;48 HR</p>
            <p className="text-[10px] text-teal-400 uppercase tracking-wider font-outfit mt-1.5">Title Verification</p>
          </div>
        </div>
      </div>

      {/* Cinematic Walkthrough Video Tour Modal Overlay */}
      {showTourVideo && (
        <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-gray-950">
            <button
              onClick={() => setShowTourVideo(false)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center z-10 font-bold transition-all"
            >
              ×
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" /* high quality default, or mixkit preview source */
              title="GMM Real Estate Cinematic Private Tour"
              allow="autoplay; encrypted-media"
            ></iframe>
          </div>
        </div>
      )}
    </header>
  );
}
