import React from "react";
import * as Icons from "lucide-react";
import { SERVICES, FEATURES_GRID } from "../data";

export default function ServicesAndFeatures() {
  return (
    <section id="services" className="py-24 relative overflow-hidden bg-gray-950">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-10 w-[300px] h-[300px] rounded-full bg-teal-500/5 blur-[100px]" />
      <div className="absolute bottom-0 right-10 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row 1: Services Cards Heading */}
        <div className="text-center max-w-3xl mx-auto border-b border-white/5 pb-12 mb-16">
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 px-3 py-1 bg-teal-500/10 rounded-full border border-teal-500/10 block w-fit mx-auto mb-4 font-outfit">
            GMM Sovereign Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl text-white font-display font-medium">
            White-Glove <span className="text-gradient">Real Estate Solutions</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light mt-2 max-w-xl mx-auto leading-relaxed">
            Every step is protected by legal expertise, dynamic fintech credit systems, and statutory title clearings tailored to premium demands.
          </p>
        </div>

        {/* Row 2: Services Grid list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {SERVICES.map((s, i) => {
            // Dynamically select matching Lucide React icons
            let IconComponent = Icons.ShieldAlert;
            if (s.icon === "Coins") IconComponent = Icons.Coins;
            if (s.icon === "ShieldCheck") IconComponent = Icons.ShieldCheck;
            if (s.icon === "Compass") IconComponent = Icons.Compass;

            return (
              <div 
                key={i} 
                className="glass-card p-6 rounded-2xl relative border border-white/5 group hover:border-teal-500/20 hover:shadow-lg transition-all"
              >
                {/* Accent glow on card hover */}
                <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-teal-400 to-transparent scale-0 group-hover:scale-100 transition-all duration-500" />
                
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-300 flex items-center justify-center mb-4">
                  <IconComponent className="w-5 h-5 text-teal-300 shadow-inner animate-pulse-subtle" />
                </div>

                <h3 className="font-display font-semibold text-white tracking-tight mb-2 text-sm group-hover:text-teal-300 transition-colors">
                  {s.title}
                </h3>
                
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Row 3: High-contrast features grid Section */}
        <div id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 border border-white/5 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-3xl pointer-events-none" />

          <div className="lg:col-span-4 space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 font-outfit">Sovereign Performance</span>
            <h3 className="text-2xl sm:text-3xl font-display font-medium text-white">Trust Locked In Numbers</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              We coordinate transaction clearings across India's premium tech sectors. Our client ledger contains elite family offices, technology unicorn co-founders, and state executives.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:pl-6 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0">
            {FEATURES_GRID.map((f, i) => (
              <div key={i} className="space-y-1.5 p-4 rounded-xl bg-slate-950/45 border border-white/5">
                <span className="text-2xl sm:text-3xl font-display font-extrabold text-white block bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-teal-400">
                  {f.stat}
                </span>
                <span className="text-xs text-teal-300 font-semibold block uppercase tracking-wide">
                  {f.label}
                </span>
                <p className="text-[10px] text-gray-500 leading-normal">
                  {f.description}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
