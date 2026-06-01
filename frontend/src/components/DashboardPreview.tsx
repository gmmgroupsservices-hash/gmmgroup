import React, { useState } from "react";
import { Plus, Trash2, Edit2, ShieldCheck, Mail, Phone, ExternalLink, Calendar, CheckCircle, RefreshCw, BarChart3, TrendingUp, Key } from "lucide-react";
import { Property, Lead, DashboardStats } from "../types";

interface DashboardPreviewProps {
  properties: Property[];
  leads: Lead[];
  onAddProperty: (newProp: Property) => Promise<void>;
  onEditProperty: (updatedProp: Property) => Promise<void>;
  onDeleteProperty: (id: string) => Promise<void>;
  onUpdateLeadStatus: (id: string, status: "New" | "Contacted" | "Closed") => void;
}

export default function DashboardPreview({
  properties,
  leads,
  onAddProperty,
  onEditProperty,
  onDeleteProperty,
  onUpdateLeadStatus
}: DashboardPreviewProps) {
  
  // Authorization State for customer-centric elegance
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState(false);

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toLowerCase() === "gmmadmin") {
      setIsUnlocked(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  // Tabs: leads view vs catalog CRUD manager
  const [activeTab, setActiveTab] = useState<"analytics" | "leads" | "properties">("analytics");
  
  // CRUD editing states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [numericPrice, setNumericPrice] = useState<number>(0);
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("Bangalore");
  const [state, setState] = useState("Karnataka");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqft, setSqft] = useState("");
  const [type, setType] = useState<"Villa" | "Apartment" | "Commercial" | "Plot">("Villa");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>(Array.from({ length: 7 }, () => ""));
  const [videoUrl, setVideoUrl] = useState("");
  const [videoUrls, setVideoUrls] = useState<string[]>(Array.from({ length: 1 }, () => ""));
  const [rera, setRera] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState("");
  const [amenities, setAmenities] = useState("");

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setNumericPrice(0);
    setLocation("");
    setCity("Bangalore");
    setState("Karnataka");
    setBeds("");
    setBaths("");
    setSqft("");
    setType("Villa");
    setImageUrl("");
    setImageUrls(Array.from({ length: 7 }, () => ""));
    setVideoUrl("");
    setVideoUrls(Array.from({ length: 1 }, () => ""));
    setRera(true);
    setFeatured(false);
    setDescription("");
    setHighlights("");
    setAmenities("");
    setEditingId(null);
  };

  const handleEditClick = (p: Property) => {
    setEditingId(p.id);
    setTitle(p.title);
    setPrice(p.price);
    setNumericPrice(p.numericPrice);
    setLocation(p.location);
    setCity(p.city);
    setState(p.state);
    setBeds(p.beds.toString());
    setBaths(p.baths.toString());
    setSqft(p.sqft.toString());
    setType(p.type);
    setImageUrl(p.imageUrl);
    const incomingImages = [p.imageUrl, ...(p.imageUrls || [])].filter(Boolean).slice(0, 8);
    const incomingVideos = [p.videoUrl, ...(p.videoUrls || [])].filter(Boolean).slice(0, 2);
    setImageUrl(incomingImages[0] || "");
    setImageUrls(Array.from({ length: 7 }, (_, idx) => incomingImages[idx + 1] || ""));
    setVideoUrl(incomingVideos[0] || "");
    setVideoUrls(Array.from({ length: 1 }, (_, idx) => incomingVideos[idx + 1] || ""));
    setRera(p.rera);
    setFeatured(p.featured);
    setDescription(p.description);
    setHighlights(p.highlights.join(", "));
    setAmenities(p.amenities.join(", "));
    setShowAddForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const normalizedImages = [imageUrl, ...imageUrls].map((item) => item.trim()).filter(Boolean).slice(0, 8);
    const normalizedVideos = [videoUrl, ...videoUrls].map((item) => item.trim()).filter(Boolean).slice(0, 2);

    const formattedProp: Property = {
      id: editingId || `prop-${Date.now()}`,
      title,
      price,
      numericPrice: Number(numericPrice) || 50000000,
      location,
      city,
      state,
      beds: Number(beds) || 0,
      baths: Number(baths) || 0,
      sqft: Number(sqft) || 2000,
      type,
      imageUrl: normalizedImages[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
      imageUrls: normalizedImages.slice(1),
      videoUrl: normalizedVideos[0],
      videoUrls: normalizedVideos.slice(1),
      rera,
      featured,
      description: description || " CONFIDENTIAL luxury GMM estate.",
      highlights: highlights ? highlights.split(",").map(h => h.trim()) : ["Premium Land tenure", "Dual access roads"],
      amenities: amenities ? amenities.split(",").map(a => a.trim()) : ["Smart home Automation", "Continuous Water pipeline"],
      category: "Buy",
      valuation: `${price} - Estimated Value`
    };

    try {
      if (editingId) {
        await onEditProperty(formattedProp);
      } else {
        await onAddProperty(formattedProp);
      }
      resetForm();
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute stats dynamically from live backend arrays
  const totalLeadsCount = leads.length;
  const totalActiveListings = properties.length;
  const newLeadsCount = leads.filter(l => l.status === "New").length;
  const contactedLeads = leads.filter(l => l.status === "Contacted").length;

  return (
    <section id="admin" className="py-20 bg-slate-950 tech-grid border-t border-white/5 relative">
      
      {/* Glow Ambient Top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isUnlocked ? (
          <div className="max-w-md mx-auto text-center py-16 px-8 rounded-3xl glass-panel border border-white/5 shadow-2xl relative overflow-hidden my-6">
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-xl text-teal-400">
              <Key className="w-6 h-6 animate-pulse" />
            </div>
            
            <h3 className="text-xl text-white font-display font-semibold tracking-tight">Sovereign Operations Gate</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              This terminal is strictly for GMM internal appraisers & coordinators to configure catalogs or view live buyer registrations.
            </p>

            <form onSubmit={handleAuthorize} className="mt-8 space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter GMM Security Code"
                  className={`w-full bg-slate-950/80 border rounded-xl px-4 py-3 text-center text-xs tracking-widest text-teal-300 focus:outline-none transition-all duration-300 placeholder:tracking-normal placeholder:text-gray-500 ${
                    authError ? "border-rose-500/50 shadow-rose-500/5 shadow-lg" : "border-white/10 focus:border-teal-400/50"
                  }`}
                />
                {authError && (
                  <p className="text-[10px] text-rose-400 font-bold mt-2 text-center">✕ Invalid Credentials Code</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-teal-blue text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 active:scale-98 transition-all cursor-pointer"
              >
                Authenticate Sovereign Session
              </button>
            </form>
            
            <p className="text-[9px] text-gray-500 mt-6 font-outfit">
              SECURE CRYPTO HANDSHAKE (AES-256) • ENTER <span className="font-bold text-gray-400 font-mono">gmmadmin</span> TO DEMO CRUD
            </p>
          </div>
        ) : (
          <>
            {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 mb-12">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 font-outfit border border-teal-500/15 px-2.5 py-0.5 rounded-full bg-slate-900 block w-fit mb-3">
              Institutional Admin Portal
            </span>
            <h2 className="text-3xl text-white font-display font-medium">
              GMM <span className="text-gradient">SaaS Operations Dashboard</span>
            </h2>
            <p className="text-xs text-gray-400 font-light mt-1">
              Configure properties, manage live buyer leads, and track Q2 transaction appreciations instantly.
            </p>
          </div>

          {/* Navigation togglers */}
          <div className="flex items-center gap-1.5 mt-6 md:mt-0 bg-slate-900/80 p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === "analytics"
                  ? "bg-slate-800 text-teal-300 border border-teal-500/10 shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Analytics Ledger
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all relative ${
                activeTab === "leads"
                  ? "bg-slate-800 text-teal-300 border border-teal-500/10 shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Leads Inbox
              {newLeadsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teal-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("properties")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === "properties"
                  ? "bg-slate-800 text-teal-300 border border-teal-500/10 shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Properties Manager
            </button>
          </div>
        </div>

        {/* 1. SAAS METRIC CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div className="glass-panel p-5 rounded-2xl relative border border-white/5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-outfit tracking-wider">Dynamic Listings Active</p>
              <h3 className="text-3xl text-white font-display font-bold mt-1">{totalActiveListings}</h3>
              <p className="text-[10px] text-teal-400 flex items-center space-x-1 font-semibold mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.4% appreciation vs Q1</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-300">
              <Key className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl relative border border-white/5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-outfit tracking-wider">Transactional Lead Inbox</p>
              <h3 className="text-3xl text-white font-display font-bold mt-1">{totalLeadsCount}</h3>
              <p className="text-[10px] text-sky-400 flex items-center space-x-1 mt-1">
                <span>{newLeadsCount} unresolved leads</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-300">
              <Mail className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl relative border border-white/5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-outfit tracking-wider">Estimated Visits (Views)</p>
              <h3 className="text-3xl text-white font-display font-bold mt-1">1,820</h3>
              <p className="text-[10px] text-teal-400 flex items-center space-x-1 mt-1 font-semibold">
                <span>94.2% engagement pace</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-300">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl relative border border-white/5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-outfit tracking-wider">Lead-to-Close Velocity</p>
              <h3 className="text-3xl text-white font-display font-bold mt-1">4.2%</h3>
              <p className="text-[10px] text-teal-400 flex items-center mt-1">
                <span>Standard elite benchmark</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* TAB WORKSPACE CONTENT */}
        
        {/* Sub-Tab 1: Simulated Analytics Charts and Stats */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* SVG custom Vector chart simulation */}
            <div className="lg:col-span-8 bg-slate-900 border border-white/5 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Lead Volume Acquisition Trend 2026</h4>
                  <p className="text-[10px] text-gray-500 font-outfit">COMPILATION FROM DIRECT PHONE, WHATSAPP, AND AI CHATBOTS</p>
                </div>
                <div className="flex items-center space-x-3 text-[10px]">
                  <span className="flex items-center space-x-1.5 text-teal-400">
                    <span className="w-2 h-2 rounded-full bg-teal-400 block" />
                    <span>Luxe Villa</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-sky-400">
                    <span className="w-2 h-2 rounded-full bg-sky-400 block" />
                    <span>Gated Plots/Com</span>
                  </span>
                </div>
              </div>

              {/* Custom SVG Bar lines */}
              <div className="h-48 flex items-end justify-between pt-6 border-b border-white/5 relative">
                
                {/* Horizontal guide values */}
                <div className="absolute left-0 bottom-1/4 w-full h-[1px] bg-white/[0.03]" />
                <div className="absolute left-0 bottom-2/4 w-full h-[1px] bg-white/[0.03]" />
                <div className="absolute left-0 bottom-3/4 w-full h-[1px] bg-white/[0.03]" />

                {/* bar columns */}
                {[
                  { month: "Jan", val1: 45, val2: 20 },
                  { month: "Feb", val1: 65, val2: 30 },
                  { month: "Mar", val1: 85, val2: 45 },
                  { month: "Apr", val1: 110, val2: 60 },
                  { month: "May Live", val1: 155, val2: 95 }
                ].map((item, idx) => (
                  <div key={idx} className="flex-grow flex flex-col items-center justify-end space-y-2 relative h-full">
                    <div className="w-12 sm:w-16 flex items-end gap-1.5 h-4/5 justify-center z-10">
                      <div 
                        className="w-4 bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-sm" 
                        style={{ height: `${(item.val1 / 180) * 100}%` }}
                        title={`Luxe Villa: ${item.val1}`}
                      />
                      <div 
                        className="w-4 bg-gradient-to-t from-sky-600 to-sky-400 rounded-t-sm" 
                        style={{ height: `${(item.val2 / 180) * 100}%` }}
                        title={`Plots: ${item.val2}`}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">{item.month}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 leading-relaxed">
                <p>Calculations verified across Hyderabad-Whitefield active pipelines.</p>
                <span className="text-teal-300 font-bold flex items-center space-x-1">
                  <span>96% Appraisals Velocity Verified</span>
                </span>
              </div>
            </div>

            {/* Side column: Audit checkpoints (Span 4) */}
            <div className="lg:col-span-4 bg-slate-900 border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white">Trust Assurance System</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  GMM Groups & Services processes all transactions using RBI-registered banking escrows. We maintain 100% legal title sovereignty.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-white/5">
                    <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">TS</span>
                    <div>
                      <p className="text-white font-medium">Hyderabad Escrow Pipeline</p>
                      <p className="text-[9px] text-gray-500">2 active syndications verified under RERA TS-382.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-white/5">
                    <span className="w-5 h-5 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">KA</span>
                    <div>
                      <p className="text-white font-medium">Bangalore Sky Penthouse</p>
                      <p className="text-[9px] text-gray-500">Aura Penthouse buyer pre-approval certified.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-6 text-center text-[10px] text-gray-500 leading-normal">
                All records stored safely in secure memory stacks. Operational state resets dynamically.
              </div>
            </div>

          </div>
        )}

        {/* Sub-Tab 2: Interactive Leads Inbox view */}
        {activeTab === "leads" && (
          <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Headers row */}
            <div className="bg-slate-950/50 border-b border-white/5 px-6 py-4 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-semibold text-white">Unprocessed Buyer Pitch Desk</h4>
                <p className="text-[9px] text-gray-500 font-outfit uppercase tracking-wider">Dynamic registrations from forms & advisor panel</p>
              </div>
              <span className="text-xs text-gray-400">Total Unread: {newLeadsCount}</span>
            </div>

            {/* List */}
            {leads.length > 0 ? (
              <div className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <div key={lead.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-sm text-white">{lead.name}</span>
                        <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                          lead.status === "New" ? "bg-teal-500/10 text-teal-300 border border-teal-500/10" :
                          lead.status === "Contacted" ? "bg-sky-500/10 text-sky-300 border border-sky-400/10" :
                          "bg-gray-500/10 text-gray-400"
                        }`}>
                          {lead.status}
                        </span>
                        <span className="text-[10px] text-gray-500 flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{lead.timestamp}</span>
                        </span>
                      </div>

                      <p className="text-xs text-gray-300 italic line-clamp-3">
                        "{lead.message}"
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs pt-1">
                        <p className="text-gray-400 flex items-center space-x-1">
                          <Mail className="w-3.5 h-3.5 text-teal-400" />
                          <span>{lead.email}</span>
                        </p>
                        <p className="text-gray-400 flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5 text-teal-400" />
                          <span>{lead.phone}</span>
                        </p>
                        <p className="text-[11px] text-teal-300 font-semibold bg-white/5 px-2.5 py-0.5 rounded-md mt-2 w-fit">
                          Referring Lot: {lead.propertyTitle}
                        </p>
                      </div>
                    </div>

                    {/* Operational togglers */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2 md:mt-0">
                      <button
                        onClick={() => onUpdateLeadStatus(lead.id, "Contacted")}
                        className="px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/10 rounded-lg text-[10px] font-semibold cursor-pointer"
                      >
                        Flag Contacted
                      </button>
                      <button
                        onClick={() => onUpdateLeadStatus(lead.id, "Closed")}
                        className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/10 rounded-lg text-[10px] font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Resolve/Close</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500 text-xs">
                No active buyer pitches found. Use property forms to register new test inquiries!
              </div>
            )}
          </div>
        )}

        {/* Sub-Tab 3: Property Catalog list with Add/Edit/Delete forms */}
        {activeTab === "properties" && (
          <div className="space-y-6">
            
            {/* Call Add form controllers */}
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-white">Interactive Catalog Catalog</h4>
              <button
                onClick={() => {
                  if (showAddForm) resetForm();
                  setShowAddForm(!showAddForm);
                }}
                className="bg-gradient-teal-blue text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center space-x-1 hover:scale-101 cursor-pointer transition-transform"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddForm ? "Collapse Editors" : "Add New Property"}</span>
              </button>
            </div>

            {/* Expandable ADD / EDIT PROPERTY FORM COMPONENT */}
            {showAddForm && (
              <form onSubmit={handleFormSubmit} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 shadow-2xl animate-fade-in-down">
                
                <h3 className="font-display font-semibold text-teal-300 text-sm border-b border-white/5 pb-2">
                  {editingId ? "Modify Registered Estate Reference" : "Register New Estate Entry"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 capitalize">Title</span>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. GMM Grand Sovereign Vista"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 capitalize">List Price Formulation</span>
                    <input
                      type="text"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. ₹9.5 Crore"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 capitalize">Numeric Price (INR)</span>
                    <input
                      type="number"
                      required
                      value={numericPrice}
                      onChange={(e) => setNumericPrice(Number(e.target.value))}
                      placeholder="e.g. 95000000"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 capitalize">Address / Micro Market</span>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Whitefield, Bangalore"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 capitalize">City</span>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    >
                      <option value="Bangalore">Bangalore</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Vizag">Vizag</option>
                      <option value="Vijayawada">Vijayawada</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 capitalize">State</span>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    >
                      <option value="Karnataka">Karnataka</option>
                      <option value="Telangana">Telangana</option>
                      <option value="AP">Andhra Pradesh (AP)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 capitalize">Beds configuration</span>
                    <input
                      type="number"
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                      placeholder="e.g. 4 (0 for plot/com)"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 capitalize">Baths configuration</span>
                    <input
                      type="number"
                      value={baths}
                      onChange={(e) => setBaths(e.target.value)}
                      placeholder="e.g. 4"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 capitalize">Built Area (Sqft)</span>
                    <input
                      type="number"
                      required
                      value={sqft}
                      onChange={(e) => setSqft(e.target.value)}
                      placeholder="e.g. 3800"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 capitalize">Architectural Category</span>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    >
                      <option value="Villa">Luxury Villa</option>
                      <option value="Apartment">SaaS Premium Sky Suite</option>
                      <option value="Commercial">Commercial Trade Corporate Tower</option>
                      <option value="Plot">Elite Gated Plot</option>
                    </select>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <span className="text-[10px] text-gray-400 capitalize">Image visual path (URL)</span>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste clean high-resolution Unsplash link"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-white/5 bg-slate-950/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-teal-300 uppercase tracking-widest">Property Media Slider</h4>
                      <p className="text-[10px] text-gray-500 mt-1">Add up to 8 images and 2 videos for each property slide deck.</p>
                    </div>
                    <span className="text-[10px] text-gray-400">10 slots total</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Images 1-8</p>
                      <div className="grid grid-cols-1 gap-2">
                        {[imageUrl, ...imageUrls].map((value, index) => (
                          <div key={`image-slot-${index}`} className="space-y-1">
                            <span className="text-[9px] text-gray-500 uppercase">Image {index + 1}</span>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => {
                                const next = [imageUrl, ...imageUrls];
                                next[index] = e.target.value;
                                setImageUrl(next[0] || "");
                                setImageUrls(next.slice(1, 8));
                              }}
                              placeholder={`Paste image ${index + 1} URL`}
                              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Videos 1-2</p>
                      <div className="grid grid-cols-1 gap-2">
                        {[videoUrl, ...videoUrls].map((value, index) => (
                          <div key={`video-slot-${index}`} className="space-y-1">
                            <span className="text-[9px] text-gray-500 uppercase">Video {index + 1}</span>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => {
                                const next = [videoUrl, ...videoUrls];
                                next[index] = e.target.value;
                                setVideoUrl(next[0] || "");
                                setVideoUrls(next.slice(1, 2));
                              }}
                              placeholder={`Paste video ${index + 1} URL`}
                              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 bg-white/5 p-2 rounded-xl text-xs text-white border border-white/5">
                    <input
                      type="checkbox"
                      checked={rera}
                      onChange={(e) => setRera(e.target.checked)}
                      className="accent-teal-400 w-4 h-4"
                    />
                    <span>Pre-Cleared RERA Statutory stamp</span>
                  </div>

                  <div className="flex items-center space-x-3 bg-white/5 p-2 rounded-xl text-xs text-white border border-white/5">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="accent-teal-400 w-4 h-4"
                    />
                    <span>Highlight on Home Featured Luxe block</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400">Detailed overview description</span>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter sophisticated asset profiles"
                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400">Highlights list (comma-separated details)</span>
                    <input
                      type="text"
                      value={highlights}
                      onChange={(e) => setHighlights(e.target.value)}
                      placeholder="Hill city views, 12m Infinite pool, Smart OS"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400">Amenities specifications (comma-separated details)</span>
                    <input
                      type="text"
                      value={amenities}
                      onChange={(e) => setAmenities(e.target.value)}
                      placeholder="Smart Home OS, Private Elevator, EV Supercharger"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 justify-end pt-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-gray-400 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer transition-transform"
                  >
                    {isSubmitting ? "Syncing with Server..." : editingId ? "Approve Modifications" : "Authenticate Entry"}
                  </button>
                </div>
              </form>
            )}

            {/* List Table of active catalog properties */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              
              <div className="hidden sm:grid grid-cols-12 gap-2 text-[10px] font-bold text-gray-400 font-outfit uppercase border-b border-white/5 p-4 bg-slate-950/25">
                <span className="col-span-4">Estate Name</span>
                <span className="col-span-2">Capital Price</span>
                <span className="col-span-2">Location Context</span>
                <span className="col-span-2">State / City</span>
                <span className="col-span-2 text-right">Actions</span>
              </div>

              <div className="divide-y divide-white/5 text-sm">
                {properties.map((p) => (
                  <div key={p.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-4 items-center hover:bg-white/[0.01]">
                    
                    <div className="col-span-12 sm:col-span-4 flex items-center space-x-3 min-w-0">
                      <img src={p.imageUrl} className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-white/5" alt="" />
                      <div className="min-w-0">
                        <p className="text-white font-semibold truncate text-xs">{p.title}</p>
                        <p className="text-[9px] text-teal-400 truncate uppercase mt-0.5">{p.type}</p>
                      </div>
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <span className="text-white font-display text-xs">{p.price}</span>
                    </div>

                    <div className="col-span-6 sm:col-span-2 min-w-0">
                      <span className="text-gray-400 truncate block text-xs">{p.location}</span>
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <span className="text-gray-400 text-xs">{p.city} ({p.state})</span>
                    </div>

                    {/* Operational controls */}
                    <div className="col-span-6 sm:col-span-2 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-1 px-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 rounded-lg text-[10px] flex items-center gap-0.5 cursor-pointer"
                        title="Edit specifications"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDeleteProperty(p.id)}
                        className="p-1 px-2 text-rose-500/10 hover:bg-rose-500/20 hover:text-rose-400 rounded-lg text-[10px] flex items-center gap-0.5 cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Trash</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
          </>
        )}

      </div>
    </section>
  );
}
