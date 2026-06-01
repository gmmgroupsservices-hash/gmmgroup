import React, { useState } from "react";
import { Send, MapPin, Mail, Phone, ShieldCheck, Landmark, Github, Linkedin, MessageSquare, Compass } from "lucide-react";
import { Lead } from "../types";

interface ContactAndFooterProps {
  onNewLead: (lead: Omit<Lead, "id" | "timestamp" | "status">) => Promise<void>;
}

export default function ContactAndFooter({ onNewLead }: ContactAndFooterProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyInterest: "General Luxury Portfolio",
    message: ""
  });

  const [activeCoordinate, setActiveCoordinate] = useState<"BLR" | "HYD" | "VZG">("BLR");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    try {
      await onNewLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message || "Requested exclusive call callback",
        propertyTitle: formData.propertyInterest
      });
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", propertyInterest: "General Luxury Portfolio", message: "" });
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const coordinates = {
    BLR: {
      title: "GMM Karnataka Corporate Center",
      details: "4th Floor Obsidian Tower, Indiranagar Micro-corridor, Bangalore, 560038.",
      phone: "+91 80 4492 1000",
      lat: "12.9716° N",
      lon: "77.5946° E"
    },
    HYD: {
      title: "GMM Telangana Sovereign Suite",
      details: "Road No. 36 Private Hillock, Jubilee Hills Precinct, Hyderabad, 500033.",
      phone: "+91 40 6602 4500",
      lat: "17.4265° N",
      lon: "78.4111° E"
    },
    VZG: {
      title: "GMM Andhra Development Sluice",
      details: "Main Beach Promenade Road, Rushikonda Seashores, Vizag, 530045.",
      phone: "+91 891 2248 100",
      lat: "17.7819° N",
      lon: "83.3768° E"
    }
  };

  return (
    <footer id="contact" className="bg-gray-950 border-t border-white/5 relative z-10 pt-24 pb-8">
      
      {/* Decorative glow background */}
      <div className="absolute top-0 left-1/3 w-[300px] h-[300px] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row 1: Heading and Form section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mb-20 border-b border-white/5 pb-16">
          
          {/* Column A: Contact form feedback (Span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/10 block w-fit font-outfit">
                confidential lead registry
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mb-2">
                Initiate Private <span className="text-gradient">Brokerage Contact</span>
              </h2>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Connect with GMM's executive trust members. All data logged here remains strictly private and escapes index trackers.
              </p>

              {submitted ? (
                <div className="bg-teal-500/10 border border-teal-500/25 rounded-2xl p-6 text-teal-300 space-y-2 animate-fade-in-up">
                  <span className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center text-sm font-bold">✓</span>
                  <p className="text-sm font-bold text-white mt-2">Registration Completed Confidentially</p>
                  <p className="text-xs text-gray-400 leading-normal">
                    We have secure-logged your call request. A senior vice-president registrar will make a clean handshake contact within 10 minutes. 
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Confidential Name</span>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Samir Reddy"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Secure Email</span>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. samir@reddy.in"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-teal-300 focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Telephone Line</span>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-teal-300 focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Primary Estate Group</span>
                    <select
                      value={formData.propertyInterest}
                      onChange={(e) => setFormData({ ...formData, propertyInterest: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
                    >
                      <option value="General Luxury Portfolio">General Luxury Portfolio</option>
                      <option value="Jubilee Hills Villas">Jubilee Hills Villas (TS)</option>
                      <option value="Whitefield Sky Penthouses">Whitefield Penthouses (KA)</option>
                      <option value="Vizag beachfront Plots">Vizag beachfront Plots (AP)</option>
                      <option value="Institutional Commercial Tower">Commercial Office Towers</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Confidential Brief</span>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g., Interested in private syndication"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full glow-btn bg-gradient-teal-blue text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 border border-teal-500/10 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-white animate-pulse" />
                    <span>{isSubmitting ? "Locking Secure Portals..." : "Register Secure Callback Request"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column B: Interactive dark vector mapping Simulator (Span 7) */}
          <div className="lg:col-span-7 bg-slate-900 border border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-2 right-2 animate-pulse text-[9px] font-mono text-teal-400 bg-teal-400/5 px-2 py-0.5 rounded border border-teal-500/10">
              ● GLOBAL ASSET GROUND NODE
            </div>

            <div className="space-y-4">
              <h3 className="font-display font-medium text-white text-base">
                Interactive Coordinates Map
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Select your geographical region of choice to center GMM's corporate offices and localized audit support registries:
              </p>

              {/* Mappings selection tags */}
              <div className="flex gap-2 border-b border-white/5 pb-4">
                {(["BLR", "HYD", "VZG"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveCoordinate(key)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider cursor-pointer border transition-all ${
                      activeCoordinate === key
                        ? "bg-slate-950 border-teal-400/40 text-teal-300"
                        : "bg-slate-950/40 border-transparent text-gray-500 hover:text-white"
                    }`}
                  >
                    {key === "BLR" ? "Bangalore (KA)" : key === "HYD" ? "Hyderabad (TS)" : "Vizag (AP)"}
                  </button>
                ))}
              </div>

              {/* Vector representation area */}
              <div className="h-44 bg-slate-950 rounded-2xl relative overflow-hidden border border-white/5 flex items-center justify-center">
                {/* Tech grid */}
                <div className="absolute inset-0 tech-grid opacity-20" />
                
                {/* Simulated radar scan line */}
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-teal-400/30 animate-pulse bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-md" style={{ animationDuration: "2.5s" }} />

                {/* Simulated Geographic elements */}
                <div className="relative z-10 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full border border-teal-500/25 flex items-center justify-center mx-auto bg-teal-500/5 relative">
                    <span className="w-3 h-3 bg-teal-400 rounded-full animate-ping absolute" />
                    <Compass className="w-5 h-5 text-teal-300 animate-spin-slow" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">{coordinates[activeCoordinate].title}</p>
                    <p className="text-[10px] text-teal-400 font-mono mt-0.5">
                      LAT: {coordinates[activeCoordinate].lat} • LND: {coordinates[activeCoordinate].lon}
                    </p>
                  </div>
                </div>

                {/* Coordinate indicators */}
                <span className="absolute bottom-2 left-3 text-[9px] font-mono text-gray-600">GMM MAP ENGINE V2</span>
              </div>

              {/* Office Details Info */}
              <div className="space-y-1 text-xs pt-2">
                <p className="text-gray-300 leading-normal flex items-start gap-1">
                  <MapPin className="w-4.5 h-4.5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>{coordinates[activeCoordinate].details}</span>
                </p>
                <p className="text-gray-400 flex items-center space-x-1 pl-5">
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span>Representative Phone: {coordinates[activeCoordinate].phone}</span>
                </p>
              </div>
            </div>

            <p className="text-[9px] text-gray-500 leading-normal border-t border-white/5 pt-3 mt-4">
              *Private site maps and plot developmental details can be requested dynamically inside the GMM AI chat console.
            </p>
          </div>

        </div>

        {/* Row 2: Multi-column descriptive footer list */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-b border-white/5 pb-12 text-xs leading-relaxed">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Landmark className="w-6 h-6 text-teal-400" />
              <span className="font-display font-bold text-lg text-white">GMM</span>
            </div>
            <p className="text-[11px] text-gray-500 font-light">
              Pristine verifications, architectural luxury, and direct corporate escrow compliance. Representing India's premier high-value real estate sectors.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded w-fit border border-emerald-500/15">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full RERA Certified Catalog</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-display font-medium text-white text-xs uppercase tracking-widest text-teal-300">Corridors Portfolio</h4>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><span className="hover:text-teal-300 transition-colors cursor-pointer">Karnataka Whitefield Suites</span></li>
              <li><span className="hover:text-teal-300 transition-colors cursor-pointer">Telangana Jubilee Hills Villas</span></li>
              <li><span className="hover:text-teal-300 transition-colors cursor-pointer">Andhra Coastal Plot layouts</span></li>
              <li><span className="hover:text-teal-300 transition-colors cursor-pointer">Obsidian Technical HQs</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-display font-medium text-white text-xs uppercase tracking-widest text-teal-300">Security & Legal</h4>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><span className="hover:text-teal-300 transition-colors cursor-pointer">Clean Title Deeds verification</span></li>
              <li><span className="hover:text-teal-300 transition-colors cursor-pointer">Institutional Escrow Protocols</span></li>
              <li><span className="hover:text-teal-300 transition-colors cursor-pointer">Four-phase Land Registry Audit</span></li>
              <li><span className="hover:text-teal-300 transition-colors cursor-pointer">RERA Statutory compliance specs</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-display font-medium text-white text-xs uppercase tracking-widest text-teal-300">Corporate Coordinates</h4>
            <p className="text-gray-400">
              Karnataka: Indiranagar Obsidian Suite, Bangalore.<br/>
              Telangana: Road No. 36 Private Gated, Hyderabad.<br/>
              Email: info@gmmgroups.in
            </p>
            <div className="flex space-x-2 pt-1 text-gray-400">
              <span className="p-2 bg-slate-900 border border-white/5 rounded-lg hover:text-teal-400 cursor-pointer"><Github className="w-4 h-4" /></span>
              <span className="p-2 bg-slate-900 border border-white/5 rounded-lg hover:text-teal-400 cursor-pointer"><Linkedin className="w-4 h-4" /></span>
              <span className="p-2 bg-slate-900 border border-white/5 rounded-lg hover:text-teal-400 cursor-pointer"><MessageSquare className="w-4 h-4" /></span>
            </div>
          </div>

        </div>

        {/* Row 3: Signature disclaimers and copyrights */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-500 leading-normal border-t border-white/[0.02] pt-8 text-center sm:text-left gap-4">
          <p>© 2026 GMM Groups & Services Private Limited. India's Premier Sovereign Estate Marketplace. All Rights Reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-300 cursor-pointer">Reserve Protocol</span>
            <span className="hover:text-gray-300 cursor-pointer">Privacy Escrows</span>
            <span className="hover:text-gray-300 cursor-pointer" onClick={() => {
              const el = document.getElementById("admin");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}>Operator Gate</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
