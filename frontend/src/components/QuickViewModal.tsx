import React, { useState } from "react";
import { X, MapPin, ShieldCheck, Mail, Phone, Calendar, Send, Compass, DollarSign } from "lucide-react";
import { Property, Lead } from "../types";

interface QuickViewModalProps {
  property: Property;
  onClose: () => void;
  onNewLead: (lead: Omit<Lead, "id" | "timestamp" | "status">) => Promise<void>;
}

export default function QuickViewModal({ property, onClose, onNewLead }: QuickViewModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Greetings! I am interested in holding a private executive walkthrough or valuation inspection for "${property.title}". Please connect me with the premier lead agent.`
  });

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
        message: formData.message,
        propertyTitle: property.title
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10">
      
      {/* Container Frame */}
      <div className="relative w-full max-w-5xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[85vh]">
        
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/15 blur-2xl rounded-full pointer-events-none" />

        {/* Global Exit */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black text-white w-9 h-9 rounded-full flex items-center justify-center border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Column 1: Cinematic Visuals & Highlights (Span 7) */}
        <div className="md:col-span-7 flex flex-col justify-between bg-black relative min-h-[300px] overflow-y-auto">
          <div className="relative aspect-video w-full">
            <img
              src={property.imageUrl}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            
            {/* Title Block Embedded */}
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] uppercase font-outfit tracking-widest text-teal-300 font-bold bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/10">
                {property.type} • {property.category}
              </span>
              <h2 className="text-2xl font-display font-bold text-white mt-2 drop-shadow-md">
                {property.title}
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            
            {/* Extended specifications layout */}
            <div className="grid grid-cols-3 gap-2 py-3 bg-white/5 rounded-xl border border-white/5 text-center text-xs">
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Acreage Block</p>
                <p className="font-semibold text-white mt-0.5">{property.sqft} sqft</p>
              </div>
              <div className="border-x border-white/5">
                <p className="text-[10px] text-gray-500 uppercase">Estimated ROI</p>
                <p className="font-semibold text-teal-400 mt-0.5">{property.investmentYield || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Price Code</p>
                <p className="font-semibold text-white mt-0.5">{property.price}</p>
              </div>
            </div>

            {/* Micro Location Details */}
            <div className="flex items-center space-x-1 text-gray-300 text-xs py-1">
              <MapPin className="w-4.5 h-4.5 text-teal-400" />
              <span>{property.location} ({property.city}, {property.state})</span>
            </div>

            {/* Long Rich Details */}
            <div className="space-y-1.5">
              <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold font-outfit">Sovereign Asset Overview</h4>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                {property.description}
              </p>
            </div>

            {/* Highlights bullet rows */}
            <div className="space-y-2 pt-1 border-t border-white/5">
              <h4 className="text-xs uppercase tracking-wider text-teal-300 font-bold font-outfit">Architectural Assets</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {property.highlights.map((h, i) => (
                  <li key={i} className="text-xs text-gray-400 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-2 pt-1 border-t border-white/5">
              <h4 className="text-xs uppercase tracking-wider text-sky-300 font-bold font-outfit">Private Club Privileges</h4>
              <div className="flex flex-wrap gap-1">
                {property.amenities.map((a, i) => (
                  <span key={i} className="text-[10px] bg-sky-500/10 text-sky-300 border border-sky-400/10 px-2.5 py-1 rounded-md">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Lead Acquisition Box (Span 5) */}
        <div className="md:col-span-5 bg-slate-900 border-t md:border-t-0 md:border-l border-white/5 p-6 flex flex-col justify-center overflow-y-auto">
          {submitted ? (
            <div className="text-center space-y-4 py-8 animate-fade-in-up">
              <div className="w-14 h-14 bg-gradient-teal-blue rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg text-white">Advisory Call Scheduled</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Thank you, <span className="text-teal-400 font-bold">{formData.name}</span>. GMM Groups & Services trust committee has logged your dynamic reference ID <span className="text-teal-300 font-mono">#{property.id}</span>.
              </p>
              <p className="text-[10px] text-gray-500 leading-normal">
                An executive relations specialist will verify your telephone registration code over secure encrypted lanes. Check your email inbox for authorization details.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-slate-800 text-white py-2 rounded-xl text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                Return to Portfolio
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[9px] uppercase tracking-widest text-teal-400 font-bold font-outfit">Instant pre-approval</span>
                <h3 className="font-display font-semibold text-base text-white">Arrange Private Inspection</h3>
              </div>
              
              <p className="text-xs text-gray-400 leading-normal">
                Execute a confidential portfolio request. Registered buyers receive complimentary concierge airport pickup and luxury transfer in Bangalore or Hyderabad.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase text-gray-500 tracking-wider">Confidential Buyer Name</span>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full bg-slate-950 border border-white/5 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase text-gray-500 tracking-wider">Email Communication Address</span>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. vikram@malhotra.in"
                      className="w-full bg-slate-950 border border-white/5 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase text-gray-500 tracking-wider">Secure Telephone Line</span>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 99000 00000"
                      className="w-full bg-slate-950 border border-white/5 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase text-gray-500 tracking-wider">Confidential Instruction Brief</span>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-400 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full glow-btn bg-gradient-teal-blue text-white py-3 rounded-xl text-xs font-semibold shadow-md flex items-center justify-center space-x-2 border border-teal-400/10 cursor-pointer disabled:opacity-55"
                >
                  <Send className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>{isSubmitting ? "Locking Portfolio Offer..." : "Submit Acquisition Pitch"}</span>
                </button>
              </form>

              <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 text-center mt-2">
                <p className="text-[9px] text-gray-500 italic block">
                  *GMM complies fully with statutory RERA legislation. All transactional funds are verified in compliance with RBI AML laws.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
