import React, { useState, useEffect, useCallback } from "react";
import { MessageSquare, ArrowUp, Layers, Heart, X, Sparkles, AlertCircle, Eye, ShieldCheck } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Filters from "./components/Filters";
import PropertyCard from "./components/PropertyCard";
import QuickViewModal from "./components/QuickViewModal";
import AIConcierge from "./components/AIConcierge";
import ServicesAndFeatures from "./components/ServicesAndFeatures";
import BusinessAddOns from "./components/BusinessAddOns";
import AddOnPages from "./components/AddOnPages";
import AddOnDetailPage from "./components/AddOnDetailPage";
import VideoReels from "./components/VideoReels";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import ContactAndFooter from "./components/ContactAndFooter";
import { getStateCode } from "./locationData";
import {
  Property,
  ServiceItem,
  AddOnItem,
  ShowcaseReel,
  FeatureStatItem,
  TestimonialItem,
  FAQItem,
  ContactDetails,
  HeroContent,
  NavbarLabel,
  SiteContent
} from "./types";
import { FEATURES_GRID, FAQS, INITIAL_PROPERTIES, REELS, SERVICES, TESTIMONIALS } from "./data";
import { ADD_ON_PAGE_MAP, type AddOnPageId } from "./addOnContent";
import {
  DEMO_CONTENT_MESSAGE_TYPE,
  DEMO_CONTENT_STORAGE_KEY,
  DEMO_PREVIEW_READY_MESSAGE_TYPE,
  DEMO_PREVIEW_SESSION_KEY,
  isPublished,
  mapContentPropertiesToPublic,
  readDemoContent,
  writeDemoContent,
  type DemoSiteContent
} from "./demoContentSync";
import { getPropertyMetrics } from "./propertyMetrics";

const API_BASE = import.meta.env.DEV ? (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "") : "";

const DEFAULT_HERO_CONTENT: HeroContent = {
  title: "Find Your Dream Property",
  subtitle: "The ultimate single-destination premium portal for certified lands, architectural villas, and institutional offices across Karnataka, Telangana, and Andhra Pradesh.",
  backgroundImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000",
  primaryButtonText: "Explore Properties",
  secondaryButtonText: "Contact Agent"
};

const DEFAULT_CONTACT_DETAILS: ContactDetails = {
  phone: "+91 80 4492 1000",
  whatsappNumber: "919999999999",
  whatsappButtonText: "GMM Services WhatsApp",
  email: "info@gmmgroups.in",
  address: "GMM Groups & Services, Lower Parel, Mumbai, Maharashtra, India",
  gmapsEmbedUrl: "",
  seoTitle: "GMM Groups & Services | Properties, Loans, Interiors & Add-ons",
  seoDescription: "GMM Groups & Services helps with premium properties, loans, interiors, paint works, fencing works, and business add-ons across India.",
  footerText: "© 2026 GMM Groups & Services Private Limited. India's Premier Sovereign Estate Marketplace. All Rights Reserved."
};

const DEFAULT_NAVBAR_LABELS: NavbarLabel[] = [
  { id: "nav-1", label: "Home", path: "home" },
  { id: "nav-2", label: "Services", path: "services" },
  { id: "nav-3", label: "Add-ons", path: "business-addons" },
  { id: "nav-4", label: "Properties", path: "listings" },
  { id: "nav-5", label: "Showcase", path: "reels" },
  { id: "nav-6", label: "AI Advisor", path: "ai-advisor" },
  { id: "nav-7", label: "Sovereign Stat", path: "about" },
  { id: "nav-8", label: "Contact", path: "contact" }
];

export default function App() {
  const normalizePathname = (value: string) => value.replace(/\/+$/, "") || "/";
  const [pathname, setPathname] = useState(() => normalizePathname(window.location.pathname));
  
  // Core Portfolio & Leads lists sync'd from Express API endpoints
  const [properties, setProperties] = useState<Property[]>([]);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES);
  const [addons, setAddons] = useState<AddOnItem[]>([]);
  const [reels, setReels] = useState<ShowcaseReel[]>(REELS);
  const [featureStats, setFeatureStats] = useState<FeatureStatItem[]>(FEATURES_GRID);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(TESTIMONIALS);
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQS);
  const [contactDetails, setContactDetails] = useState<ContactDetails>(DEFAULT_CONTACT_DETAILS);
  const [heroContent, setHeroContent] = useState<HeroContent>(DEFAULT_HERO_CONTENT);
  const [navbarLabels, setNavbarLabels] = useState<NavbarLabel[]>(DEFAULT_NAVBAR_LABELS);
  const [isDemoPreview] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.has("gmmDemo");
    if (requested) window.sessionStorage.setItem(DEMO_PREVIEW_SESSION_KEY, "1");
    return requested || window.sessionStorage.getItem(DEMO_PREVIEW_SESSION_KEY) === "1";
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state configurations
  const [activeTab, setActiveTab] = useState("All");
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

  useEffect(() => {
    const syncPath = () => setPathname(normalizePathname(window.location.pathname));
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      document.title = contactDetails.seoTitle || "GMM Groups & Services";
    } else {
      const routeId = pathname.slice(1) as AddOnPageId;
      const routePage = ADD_ON_PAGE_MAP[routeId];
      if (routePage) {
        document.title = `${routePage.title} | GMM Groups & Services`;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, contactDetails.seoTitle]);

  const applySiteContent = useCallback((siteData: DemoSiteContent) => {
    const mappedProperties = mapContentPropertiesToPublic(siteData.properties);
    if (mappedProperties) setProperties(mappedProperties);
    if (Array.isArray(siteData.services)) setServices(siteData.services.filter(isPublished));
    if (Array.isArray(siteData.addons)) setAddons(siteData.addons.filter(isPublished));
    if (Array.isArray(siteData.reels)) setReels(siteData.reels.filter(isPublished));
    if (Array.isArray(siteData.featureStats)) setFeatureStats(siteData.featureStats.filter(isPublished));
    if (Array.isArray(siteData.testimonials)) setTestimonials(siteData.testimonials.filter(isPublished));
    if (Array.isArray(siteData.faqs)) setFaqs(siteData.faqs.filter(isPublished));
    if (siteData.contactDetails) setContactDetails(siteData.contactDetails);
    if (siteData.heroContent) setHeroContent(siteData.heroContent);
    if (Array.isArray(siteData.navbarLabels)) setNavbarLabels(siteData.navbarLabels);
  }, []);

  const loadLatestContent = useCallback(async (options?: { showLoading?: boolean }) => {
    try {
      if (options?.showLoading) {
        setLoading(true);
      }
      setError(null);

      if (isDemoPreview) {
        const demoContent = readDemoContent();
        if (demoContent) {
          applySiteContent(demoContent);
          return;
        }
      }

      const [siteRes, propsRes] = await Promise.all([
        fetch(`${API_BASE}/api/site-content`, { cache: "no-store" }),
        fetch(`${API_BASE}/api/properties`, { cache: "no-store" })
      ]);

      let nextProperties: Property[] | null = null;

      if (siteRes.ok) {
        const siteData: SiteContent = await siteRes.json();
        applySiteContent(siteData as DemoSiteContent);
        nextProperties = mapContentPropertiesToPublic((siteData as DemoSiteContent).properties);
      }

      if (propsRes.ok) {
        const propsData = await propsRes.json();
        nextProperties = Array.isArray(propsData) ? (mapContentPropertiesToPublic(propsData) ?? nextProperties) : nextProperties;
      }

      setProperties(nextProperties ?? INITIAL_PROPERTIES);
    } catch (err) {
      console.warn("Backend endpoints unreachable. Falling back securely to static curated GMM catalog.", err);
      setError("Backend sync unavailable. Showing curated static GMM catalog.");
      setProperties(INITIAL_PROPERTIES);
      setServices(SERVICES);
      setAddons([]);
      setReels(REELS);
      setFeatureStats(FEATURES_GRID);
      setTestimonials(TESTIMONIALS);
      setFaqs(FAQS);
      setContactDetails(DEFAULT_CONTACT_DETAILS);
      setHeroContent(DEFAULT_HERO_CONTENT);
      setNavbarLabels(DEFAULT_NAVBAR_LABELS);
    } finally {
      if (options?.showLoading) {
        setLoading(false);
      }
    }
  }, [applySiteContent, isDemoPreview]);

  // 1. Initial State synchronized fetch
  useEffect(() => {
    void loadLatestContent({ showLoading: true });

    // Scroll to Top indicators setup
    const handleScrollBtn = () => {
      setShowToTopBtn(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScrollBtn);
    return () => window.removeEventListener("scroll", handleScrollBtn);
  }, [loadLatestContent]);

  useEffect(() => {
    const refresh = () => {
      void loadLatestContent();
    };

    const intervalId = window.setInterval(refresh, 20000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [loadLatestContent]);

  useEffect(() => {
    if (!isDemoPreview) return;

    const handleDemoMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; content?: DemoSiteContent } | null;
      if (!data || data.type !== DEMO_CONTENT_MESSAGE_TYPE || !data.content) return;
      writeDemoContent(data.content);
      applySiteContent(data.content);
      setLoading(false);
      setError(null);
    };

    const handleDemoStorage = (event: StorageEvent) => {
      if (event.key !== DEMO_CONTENT_STORAGE_KEY || !event.newValue) return;
      try {
        const content = JSON.parse(event.newValue) as DemoSiteContent;
        applySiteContent(content);
        setLoading(false);
        setError(null);
      } catch {
        // Ignore a malformed demo payload without breaking the public site.
      }
    };

    window.addEventListener("message", handleDemoMessage);
    window.addEventListener("storage", handleDemoStorage);
    window.opener?.postMessage({ type: DEMO_PREVIEW_READY_MESSAGE_TYPE }, "*");
    return () => {
      window.removeEventListener("message", handleDemoMessage);
      window.removeEventListener("storage", handleDemoStorage);
    };
  }, [isDemoPreview]);

  // Sync favorites back to localStorage on change
  useEffect(() => {
    localStorage.setItem("gmm_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const patchPropertyById = useCallback((id: string, patcher: (property: Property) => Property) => {
    setProperties((prev) => prev.map((property) => (property.id === id ? patcher(property) : property)));
    setQuickViewProperty((prev) => (prev?.id === id ? patcher(prev) : prev));
  }, []);

  const mergeEngagementProperty = useCallback((updatedProperty: Property) => {
    patchPropertyById(updatedProperty.id, (property) => ({
      ...property,
      viewCount: updatedProperty.viewCount,
      likeCount: updatedProperty.likeCount
    }));
  }, [patchPropertyById]);

  const sendEngagementEvent = useCallback(async (id: string, action: "view" | "like", liked?: boolean) => {
    if (isDemoPreview) return;

    try {
      const response = await fetch(`${API_BASE}/api/properties/${encodeURIComponent(id)}/${action}`, {
        method: "POST",
        headers: action === "like" ? { "Content-Type": "application/json" } : undefined,
        body: action === "like" ? JSON.stringify({ liked }) : undefined
      });

      if (!response.ok) return;
      const updatedProperty = await response.json();
      if (updatedProperty?.id) mergeEngagementProperty(updatedProperty);
    } catch (err) {
      console.warn(`Unable to sync property ${action}. Keeping local optimistic count.`, err);
    }
  }, [isDemoPreview, mergeEngagementProperty]);

  const handleOpenQuickView = useCallback((property: Property) => {
    setQuickViewProperty(property);

    const viewKey = `gmm_viewed_property_${property.id}`;
    if (sessionStorage.getItem(viewKey)) return;
    sessionStorage.setItem(viewKey, "1");

    patchPropertyById(property.id, (currentProperty) => {
      const metrics = getPropertyMetrics(currentProperty);
      return {
        ...currentProperty,
        viewCount: metrics.views + 1
      };
    });
    void sendEngagementEvent(property.id, "view");
  }, [patchPropertyById, sendEngagementEvent]);

  // Selections, likes & comparison drawer triggers
  const handleToggleFavorite = (id: string) => {
    const shouldLike = !favorites.includes(id);
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );

    patchPropertyById(id, (property) => {
      const metrics = getPropertyMetrics(property);
      return {
        ...property,
        likeCount: shouldLike ? metrics.likes + 1 : Math.max(0, metrics.likes - 1)
      };
    });
    void sendEngagementEvent(id, "like", shouldLike);
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
    
    // Check Search Text Lookups (Title, State, District, Locality matching)
    if (searchText) {
      const text = searchText.toLowerCase();
      if (
        !prop.title.toLowerCase().includes(text) &&
        !prop.location.toLowerCase().includes(text) &&
        !prop.type.toLowerCase().includes(text) &&
        !prop.city.toLowerCase().includes(text) &&
        !prop.state.toLowerCase().includes(text)
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
    if (selectedState && getStateCode(prop.state) !== getStateCode(selectedState)) return false;
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
        .filter((prop) => (!selectedState || getStateCode(prop.state) === getStateCode(selectedState)) && (!selectedCity || prop.city === selectedCity))
        .map((prop) => prop.location)
    )
  ).sort();

  if (pathname !== "/") {
    const routeId = pathname.slice(1) as AddOnPageId;
    const routePage = ADD_ON_PAGE_MAP[routeId];
    if (routePage) {
      return <AddOnDetailPage pageId={routeId} />;
    }
  }

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
        labels={navbarLabels}
      />

      {/* Immersive Cinematic Hero Introduction */}
      <Hero
        onExploreClick={() => handleScrollToSection("listings")}
        onContactClick={() => handleScrollToSection("contact")}
        heroContent={heroContent}
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
                      onQuickView={() => handleOpenQuickView(prop)}
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
                      onQuickView={() => handleOpenQuickView(prop)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Services and features grid section */}
      <ServicesAndFeatures services={services} featureStats={featureStats} />

      {/* Business add-ons pages section */}
      <BusinessAddOns addOns={addons} />

      {/* Dedicated add-on service pages */}
      <AddOnPages addOns={addons} />

      {/* Video Reels Walkthroughs */}
      <VideoReels reels={reels} />

      {/* GMM Smart AI Advisor - Gemini Grounding */}
      <AIConcierge onQuickViewProperty={handleOpenQuickView} />

      {/* Sovereign High-contrast testimonials */}
      <Testimonials testimonials={testimonials} />

      {/* GMM Admin Operational Portal Workspace (Interactive!) */}
      {/* accordion legal panel rules */}
      <FAQ faqs={faqs} />

      {/* Bottom map coordinators and contact escrows */}
      <ContactAndFooter contactDetails={contactDetails} />

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
                            handleOpenQuickView(prop);
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
                          <li className="flex justify-between">
                            <span>Approval Status:</span>
                            <span className="text-emerald-400 flex items-center gap-0.5">
                              {(prop.approvalType ?? (prop.rera ? "RERA" : "None")) !== "None" ? (
                                <>
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  {prop.approvalType === "Local Approval" ? (prop.approvalAuthority || "Local Approval") : (prop.approvalType ?? "RERA")}
                                </>
                              ) : (
                                "Pending"
                              )}
                            </span>
                          </li>
                        </ul>

                        <button
                          onClick={() => {
                            handleOpenQuickView(prop);
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
