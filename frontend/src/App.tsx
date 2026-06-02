import React, { useState, useEffect } from "react";
import { MessageSquare, ArrowUp, Layers, Heart, X, Sparkles, AlertCircle, Eye, ShieldCheck } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Filters from "./components/Filters";
import PropertyCard from "./components/PropertyCard";
import QuickViewModal from "./components/QuickViewModal";
import AIConcierge from "./components/AIConcierge";
import ServicesAndFeatures from "./components/ServicesAndFeatures";
import BusinessAddOns from "./components/BusinessAddOns";
import VideoReels from "./components/VideoReels";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import ContactAndFooter from "./components/ContactAndFooter";
import { Property } from "./types";
import { INITIAL_PROPERTIES } from "./data";

export default function App() {
  
  // Core Portfolio & Leads lists sync'd from Express API endpoints
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state configurations
  const [activeTab, setActiveTab] = useState("Buy");
  const [searchText, setSearchText] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedBudget, setSelectedBudget] = useState<number>(0);
  const [selectedBeds, setSelectedBeds] = useState<number>(0);

  // Favorite saving lists persisted inside Client's LocalStorage entries
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("gmm_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Comparison arrays (maximum 3 slots for visual safety)
  const [comparingIds, setComparingIds] = useState<string[]>([]);
  
  // Modal overlay toggles
  const [quickViewProperty, setQuickViewProperty] = useState<Property | null>(null);
  const [showFavoritesDrawer, setShowFavoritesDrawer] = useState(false);
  const [showCompareDrawer, setShowCompareDrawer] = useState(false);
  const [showToTopBtn, setShowToTopBtn] = useState(false);

  // 1. Initial State synchronized fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const propsRes = await fetch("/api/properties");

        if (!propsRes.ok) throw new Error("API sync interrupted");

        const propsData = await propsRes.json();

        setProperties(propsData);
      } catch (err) {
        console.warn("Backend endpoints unreachable. Falling back securely to static curated GMM catalog.", err);
        // Secure fallbacks to prevent screen breakage in environments without server-side routing instant starts!
        setProperties(INITIAL_PROPERTIES);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Scroll to Top indicators setup
    const handleScrollBtn = () => {
      setShowToTopBtn(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScrollBtn);
    return () => window.removeEventListener("scroll", handleScrollBtn);
  }, []);

  // Sync favorites back to localStorage on change
  useEffect(() => {
    localStorage.setItem("gmm_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Selections & Comparison Drawer triggers
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleToggleCompare = (id: string) => {
    setComparingIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((cId) => cId !== id);
      }
      if (prev.length >= 3) {
        alert("Maximum of 3 luxury properties can be compared simultaneously for layout safety.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleResetFilters = () => {
    setSearchText("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedLocation("");
    setSelectedType("");
    setSelectedBudget(0);
    setSelectedBeds(0);
  };

  // 5. Compute filtered listings dynamically
  const filteredProperties = properties.filter((prop) => {
    
    // Check Search Text Lookups (Title, Location, City matching)
    if (searchText) {
      const text = searchText.toLowerCase();
      if (
        !prop.title.toLowerCase().includes(text) &&
        !prop.location.toLowerCase().includes(text) &&
        !prop.type.toLowerCase().includes(text) &&
        !prop.city.toLowerCase().includes(text)
      ) {
        return false;
      }
    }

    // Check Buy/Rent/Just Sold state mappings based on matching Active Tab
    if (activeTab === "Buy") {
      if (prop.category !== "Buy") return false;
    } else if (activeTab === "Rent") {
      if (prop.category !== "Rent") return false;
    } else if (activeTab === "Just Sold") {
      if (prop.category !== "Just Sold") return false;
    }

    // Dropdown configurations
    if (selectedState && prop.state !== selectedState) return false;
    if (selectedCity && prop.city !== selectedCity) return false;
    if (selectedLocation && prop.location !== selectedLocation) return false;
    if (selectedType && prop.type !== selectedType) return false;
    if (selectedBudget && prop.numericPrice > selectedBudget) return false;
    
    const bedsNumber = Number(selectedBeds);
    if (bedsNumber) {
      if (bedsNumber === 5) {
        if (prop.beds < 5) return false;
      } else {
        if (prop.beds !== bedsNumber) return false;
      }
    }

    return true;
  });

  // Split calculations into Featured (latest on home first) and common listings block
  const featuredProperties = filteredProperties.filter((p) => p.featured);
  const commonProperties = filteredProperties.filter((p) => !p.featured);
  const locationOptions = Array.from<string>(
    new Set(
      properties
        .filter((prop) => (!selectedState || prop.state === selectedState) && (!selectedCity || prop.city === selectedCity))
        .map((prop) => prop.location)
    )
  ).sort();

  return (
    <div className="bg-gray-950 font-sans text-gray-200 min-h-screen relative selection:bg-teal-500 selection:text-slate-950">
      
      {/* Dynamic Background Noise/SaaS grids */}
      <div className="fixed inset-0 tech-grid opacity-10 pointer-events-none z-0" />

      {/* Primary Sticky Header */}
      <Navbar
        favoritesCount={favorites.length}
        compareCount={comparingIds.length}
        onOpenFavorites={() => setShowFavoritesDrawer(true)}
        onOpenCompare={() => setShowCompareDrawer(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Immersive Cinematic Hero Introduction */}
      <Hero
        onExploreClick={() => handleScrollToSection("listings")}
        onContactClick={() => handleScrollToSection("contact")}
      />

      {/* Interactive Geoplot Search TABS Engine */}
      <Filters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchText={searchText}
        setSearchText={setSearchText}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        locationOptions={locationOptions}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedBudget={selectedBudget}
        setSelectedBudget={setSelectedBudget}
        selectedBeds={selectedBeds}
        setSelectedBeds={setSelectedBeds}
        onResetFilters={handleResetFilters}
      />

      {/* CORE PROPERTY LISTINGS SYSTEM - DIRECTORY VIEW */}
      <main id="listings" className="py-24 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 mb-12">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 font-outfit">Active Ledger</span>
            <h2 className="text-3xl text-white font-display font-medium mt-1">
              Prime Sovereign Land <span className="text-gradient">&amp; Villa Listings</span>
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-light mt-2 max-w-sm md:text-right md:mt-0">
            Click quick filters above to swap between custom high-value buy, rent, or recently liquidated transaction codes.
          </p>
        </div>

        {/* Loading / Error fallbacks */}
        {loading && properties.length === 0 ? (
          <div className="p-12 text-center text-teal-400 font-semibold space-y-4">
            <span className="inline-block w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin mr-2" />
            <p className="text-xs text-gray-400">Synchronizing GMM trust ledger secure indices...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/[0.01] border border-white/5 max-w-xl mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
            <h3 className="font-display text-white font-semibold">No Properties Found</h3>
            <p className="text-xs text-gray-400 leading-relaxed mt-1">
              Your specific filter combination returned zero active sovereign lots. Try expanding your budget ceiling or selecting another geographical micro-market.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-teal-400 cursor-pointer"
            >
              Reset Filters Ledger
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Subsection A: Featured Luxe Estates */}
            {featuredProperties.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-amber-300">
                    GMM Elite Showpieces
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  {featuredProperties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      isFavorite={favorites.includes(prop.id)}
                      isComparing={comparingIds.includes(prop.id)}
                      onToggleFavorite={() => handleToggleFavorite(prop.id)}
                      onToggleCompare={() => handleToggleCompare(prop.id)}
                      onQuickView={() => setQuickViewProperty(prop)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Subsection B: General Active Lots Portfolio */}
            {commonProperties.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-white/[0.03]">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-teal-300">
                    Active Catalog Portfolio
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  {commonProperties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      isFavorite={favorites.includes(prop.id)}
                      isComparing={comparingIds.includes(prop.id)}
                      onToggleFavorite={() => handleToggleFavorite(prop.id)}
                      onToggleCompare={() => handleToggleCompare(prop.id)}
                      onQuickView={() => setQuickViewProperty(prop)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Services and features grid section */}
      <ServicesAndFeatures />

      {/* Business add-ons pages section */}
      <BusinessAddOns />

      {/* Video Reels Walkthroughs */}
      <VideoReels />

      {/* GMM Smart AI Advisor - Gemini Grounding */}
      <AIConcierge onQuickViewProperty={(p) => setQuickViewProperty(p)} />

      {/* Sovereign High-contrast testimonials */}
      <Testimonials />

      {/* GMM Admin Operational Portal Workspace (Interactive!) */}
      {/* accordion legal panel rules */}
      <FAQ />

      {/* Bottom map coordinators and contact escrows */}
      <ContactAndFooter />

      {/* DYNAMIC COMPONENT FLOATS & OVERLAY SIDEBAR DRAWER METRICS */}
      
      {/* Overlays A: Favorites Sidebar Drawer */}
      {showFavoritesDrawer && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-white/10 shadow-2xl z-50 flex flex-col justify-between p-6 overflow-y-auto animate-fade-in-right">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2 text-teal-300">
                <Heart className="w-5 h-5 text-teal-400 fill-teal-400" />
                <h3 className="font-display font-semibold text-base text-white">Confidential Saved Lots</h3>
              </div>
              <button
                onClick={() => setShowFavoritesDrawer(false)}
                className="p-1 px-2 text-xs bg-slate-800 text-gray-400 hover:text-white rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Below are your private selected luxury assets stored inside local client memory stacks:
            </p>

            <div className="space-y-4">
              {favorites.length > 0 ? (
                favorites.map((favId) => {
                  const prop = properties.find((p) => p.id === favId);
                  if (!prop) return null;

                  return (
                    <div
                      key={favId}
                      className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 flex items-center justify-between shadow-lg"
                    >
                      <div className="min-w-0 flex-grow pr-2">
                        <p className="text-white text-xs font-semibold truncate">{prop.title}</p>
                        <p className="text-[10px] text-teal-400 mt-0.5">{prop.price} • {prop.location}</p>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <button
                          onClick={() => {
                            setQuickViewProperty(prop);
                            setShowFavoritesDrawer(false);
                          }}
                          className="p-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 rounded-lg text-xs"
                          title="Inspect Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleFavorite(favId)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs"
                          title="Trash entry"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-500 text-xs">
                  Your portfolio saved book is empty. Click private hearts over listings cards to add items.
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 text-center mt-8">
            <button
              onClick={() => {
                setShowFavoritesDrawer(false);
                handleScrollToSection("contact");
              }}
              className="w-full bg-gradient-teal-blue text-slate-950 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Consult Broker Regarding Selections
            </button>
          </div>
        </div>
      )}

      {/* Overlays B: Multi Property comparison Drawer metrics (floating footer shelf) */}
      {showCompareDrawer && (
        <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-white/10 shadow-2xl z-50 p-6 max-h-[92vh] overflow-y-auto animate-fade-in-up">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2 text-sky-400">
                <Layers className="w-5 h-5 text-sky-300" />
                <h3 className="font-display font-semibold text-base text-white">Compare Sovereign Lots ({comparingIds.length}/3)</h3>
              </div>
              <button
                onClick={() => setShowCompareDrawer(false)}
                className="px-3 py-1 bg-slate-800 text-gray-400 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                × Hide comparison
              </button>
            </div>

            {comparingIds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {comparingIds.map((cId) => {
                  const prop = properties.find((p) => p.id === cId);
                  if (!prop) return null;

                  return (
                    <div key={cId} className="bg-slate-950/60 p-5 rounded-2xl border border-white/10 relative shadow-xl">
                      <button
                        onClick={() => handleToggleCompare(cId)}
                        className="absolute top-3 right-3 bg-slate-800 text-gray-400 hover:text-white w-6 h-6 rounded-md flex items-center justify-center text-xs border border-white/5"
                      >
                        ×
                      </button>

                      <div className="space-y-3 pt-2">
                        <img src={prop.imageUrl} className="w-full h-24 object-cover rounded-xl" alt="" />
                        
                        <div>
                          <p className="text-[10px] text-teal-400 uppercase tracking-widest font-bold">{prop.type}</p>
                          <h4 className="text-white text-xs font-bold line-clamp-1 mt-0.5">{prop.title}</h4>
                        </div>

                        <ul className="text-[11px] text-gray-400 space-y-1.5 border-t border-white/5 pt-2 font-light">
                          <li className="flex justify-between"><span>Registry Value:</span> <span className="text-white font-semibold">{prop.price}</span></li>
                          <li className="flex justify-between"><span>Micro Corridor:</span> <span className="text-white truncate max-w-[120px]">{prop.location}</span></li>
                          <li className="flex justify-between"><span>Sq.Ft Area:</span> <span className="text-white">{prop.sqft}</span></li>
                          <li className="flex justify-between"><span>BHK Beds:</span> <span className="text-white">{prop.beds || "Plot"}</span></li>
                          <li className="flex justify-between"><span>RERA Safe Stamp:</span> <span className="text-emerald-400 flex items-center gap-0.5">{prop.rera ? <ShieldCheck className="w-3.5 h-3.5" /> : "Pending"}{prop.rera ? "Yes" : "No"}</span></li>
                        </ul>

                        <button
                          onClick={() => {
                            setQuickViewProperty(prop);
                            setShowCompareDrawer(false);
                          }}
                          className="w-full bg-slate-900 border border-white/5 text-gray-200 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer"
                        >
                          Show Full Audit Specs
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 text-xs">
                Comparison registry shelf is vacant. Flag compare selectors over listing cards to view metrics side-by-side.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlays C: Quick inspect walkthrough modal */}
      {quickViewProperty && (
        <QuickViewModal
          property={quickViewProperty}
          onClose={() => setQuickViewProperty(null)}
        />
      )}

      {/* Floating Dynamic Action Keys */}
      
      {/* Scroll to Top */}
      {showToTopBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl z-40 shadow-xl border border-teal-400/20 hover:scale-110 transition-all cursor-pointer"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5 text-slate-950 font-extrabold" />
        </button>
      )}

      {/* Floating WhatsApp Quick Slogan */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 p-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl z-40 shadow-xl border border-emerald-400/20 hover:scale-110 transition-all flex items-center space-x-1.5 group text-xs text-slate-950 font-bold"
        title="Direct WhatsApp Helpline"
      >
        <MessageSquare className="w-5 h-5 text-slate-950" />
        <span className="hidden md:inline text-slate-950">GMM Services WhatsApp</span>
      </a>

    </div>
  );
}
