/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LogIn, LockKeyhole, LoaderCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import PropertyManager from './components/PropertyManager';
import ContentSectionsManager from './components/ContentSectionsManager';
import AIAdvisorPreview from './components/AIAdvisorPreview';
import AdminAccessManager from './components/AdminAccessManager';
import {
  DEMO_ADMIN_TOKEN,
  DEMO_CONTENT_MESSAGE_TYPE,
  DEMO_PREVIEW_READY_MESSAGE_TYPE,
  type DemoSiteContent,
  readDemoContent,
  writeDemoContent
} from './demoStorage';

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
  AIAdvisorConfig,
  NavbarLabel,
  RecentActivity
} from './types';

const EMPTY_HERO_CONTENT: HeroContent = {
  title: '',
  subtitle: '',
  backgroundImage: '',
  primaryButtonText: '',
  secondaryButtonText: ''
};

const EMPTY_CONTACT_DETAILS: ContactDetails = {
  phone: '',
  whatsappNumber: '',
  whatsappButtonText: '',
  email: '',
  address: '',
  gmapsEmbedUrl: '',
  seoTitle: '',
  seoDescription: '',
  footerText: ''
};

const EMPTY_AI_ADVISOR_CONFIG: AIAdvisorConfig = {
  bannerTitle: '',
  bannerSubtitle: '',
  systemPrompt: '',
  welcomeMessage: '',
  suggestedQuestions: [] as string[]
};

const EMPTY_PROPERTIES: Property[] = [];
const EMPTY_SERVICES: ServiceItem[] = [];
const EMPTY_ADDONS: AddOnItem[] = [];
const EMPTY_REELS: ShowcaseReel[] = [];
const EMPTY_FEATURE_STATS: FeatureStatItem[] = [];
const EMPTY_TESTIMONIALS: TestimonialItem[] = [];
const EMPTY_FAQS: FAQItem[] = [];
const EMPTY_NAVBAR_LABELS: NavbarLabel[] = [];
const EMPTY_ACTIVITIES: RecentActivity[] = [];
const API_BASE = import.meta.env.DEV ? (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '') : '';
const FRONTEND_PREVIEW_URL = (
  import.meta.env.VITE_FRONTEND_URL ??
  (import.meta.env.DEV ? 'http://localhost:5173' : 'https://gmmgroup.vercel.app')
).replace(/\/$/, '');
const ADMIN_STORAGE_KEY = 'gmm_admin_token';

export default function App() {
  // Navigation tabs
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [adminToken, setAdminToken] = useState<string>(() => localStorage.getItem(ADMIN_STORAGE_KEY) ?? '');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => localStorage.getItem(ADMIN_STORAGE_KEY) === DEMO_ADMIN_TOKEN);
  const [loginUsername, setLoginUsername] = useState('gmmadmin');
  const [loginPassword, setLoginPassword] = useState('gmmadmin123');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const previewWindowRef = useRef<Window | null>(null);

  // Live content state loaded from and saved to backend
  const [properties, setProperties] = useState<Property[]>(EMPTY_PROPERTIES);
  const [services, setServices] = useState<ServiceItem[]>(EMPTY_SERVICES);
  const [addons, setAddons] = useState<AddOnItem[]>(EMPTY_ADDONS);
  const [reels, setReels] = useState<ShowcaseReel[]>(EMPTY_REELS);
  const [featureStats, setFeatureStats] = useState<FeatureStatItem[]>(EMPTY_FEATURE_STATS);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(EMPTY_TESTIMONIALS);
  const [faqs, setFaqs] = useState<FAQItem[]>(EMPTY_FAQS);
  const [contactDetails, setContactDetails] = useState<ContactDetails>(EMPTY_CONTACT_DETAILS);
  const [heroContent, setHeroContent] = useState<HeroContent>(EMPTY_HERO_CONTENT);
  const [aiAdvisorConfig, setAiAdvisorConfig] = useState<AIAdvisorConfig>(EMPTY_AI_ADVISOR_CONFIG);
  const [navbarLabels, setNavbarLabels] = useState<NavbarLabel[]>(EMPTY_NAVBAR_LABELS);
  const [activities, setActivities] = useState<RecentActivity[]>(EMPTY_ACTIVITIES);
  const [hasLoadedContent, setHasLoadedContent] = useState(false);

  const buildCurrentContent = (): DemoSiteContent => ({
    properties,
    services,
    addons,
    reels,
    featureStats,
    testimonials,
    faqs,
    contactDetails,
    heroContent,
    aiAdvisorConfig,
    navbarLabels,
    activities
  });

  const postDemoContentToPreview = (content: DemoSiteContent) => {
    const previewWindow = previewWindowRef.current;
    if (!previewWindow || previewWindow.closed) return;
    previewWindow.postMessage(
      {
        type: DEMO_CONTENT_MESSAGE_TYPE,
        content
      },
      '*'
    );
  };

  const handlePreviewFrontend = () => {
    const content = buildCurrentContent();
    writeDemoContent(content);
    const url = `${FRONTEND_PREVIEW_URL}${FRONTEND_PREVIEW_URL.includes('?') ? '&' : '?'}gmmDemo=1`;
    const previewWindow = window.open(url, 'gmm-demo-frontend-preview');
    if (!previewWindow) return;
    previewWindowRef.current = previewWindow;
    setTimeout(() => postDemoContentToPreview(content), 500);
    setTimeout(() => postDemoContentToPreview(content), 1400);
    setTimeout(() => postDemoContentToPreview(content), 3200);
  };

  const clearAdminSession = () => {
    setAdminToken('');
    setIsDemoMode(false);
    setIsInitialized(false);
    setHasLoadedContent(false);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  const setDemoSession = () => {
    setAdminToken(DEMO_ADMIN_TOKEN);
    setIsDemoMode(true);
    setLoginError('');
    localStorage.setItem(ADMIN_STORAGE_KEY, DEMO_ADMIN_TOKEN);
    setIsAuthChecking(true);
  };

  useEffect(() => {
    let isCancelled = false;

    const normalizeProperty = (prop: Property): Property => ({
      ...prop,
      images: Array.isArray(prop.images) ? prop.images : [],
      videos: Array.isArray(prop.videos) ? prop.videos : []
    });

    const isBlankContent = (content: any) =>
      !content ||
      (!Array.isArray(content.properties) || content.properties.length === 0) &&
      (!Array.isArray(content.services) || content.services.length === 0) &&
      (!Array.isArray(content.addons) || content.addons.length === 0) &&
      (!Array.isArray(content.reels) || content.reels.length === 0) &&
      (!Array.isArray(content.featureStats) || content.featureStats.length === 0) &&
      (!Array.isArray(content.testimonials) || content.testimonials.length === 0) &&
      (!Array.isArray(content.faqs) || content.faqs.length === 0);

    const loadFallbackContent = async () => {
      const response = await fetch(`${API_BASE}/api/properties`);
      const propsData = response.ok ? await response.json() : [];

      return {
        properties: Array.isArray(propsData) ? propsData.map(normalizeProperty) : EMPTY_PROPERTIES,
        services: EMPTY_SERVICES,
        addons: EMPTY_ADDONS,
        reels: EMPTY_REELS,
        featureStats: EMPTY_FEATURE_STATS,
        testimonials: EMPTY_TESTIMONIALS,
        faqs: EMPTY_FAQS,
        contactDetails: EMPTY_CONTACT_DETAILS,
        heroContent: EMPTY_HERO_CONTENT,
        aiAdvisorConfig: EMPTY_AI_ADVISOR_CONFIG,
        navbarLabels: EMPTY_NAVBAR_LABELS,
        activities: EMPTY_ACTIVITIES
      };
    };

    const loadContent = async () => {
      if (!adminToken) {
        if (!isCancelled) {
          setIsAuthChecking(false);
          setIsInitialized(false);
        }
        return;
      }

      if (adminToken === DEMO_ADMIN_TOKEN) {
        const content = readDemoContent();
        if (isCancelled) return;
        setProperties(content.properties);
        setServices(content.services);
        setAddons(content.addons);
        setReels(content.reels);
        setFeatureStats(content.featureStats);
        setTestimonials(content.testimonials);
        setFaqs(content.faqs);
        setContactDetails(content.contactDetails);
        setHeroContent(content.heroContent);
        setAiAdvisorConfig(content.aiAdvisorConfig);
        setNavbarLabels(content.navbarLabels);
        setActivities(content.activities);
        setHasLoadedContent(true);
        setIsInitialized(true);
        setIsAuthChecking(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/admin/site-content`, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });
        if (!response.ok) {
          if (response.status === 401) {
            clearAdminSession();
            setLoginError('Session expired. Please sign in again.');
          }
          throw new Error(`Failed to load admin content (${response.status})`);
        }

        let content = await response.json();
        if (isBlankContent(content)) {
          content = await loadFallbackContent();
        }
        if (isCancelled) return;

        const normalizedProperties = Array.isArray(content.properties)
          ? content.properties.map(normalizeProperty)
          : EMPTY_PROPERTIES;

        setProperties(normalizedProperties);
        setServices(Array.isArray(content.services) ? content.services : EMPTY_SERVICES);
        setAddons(Array.isArray(content.addons) ? content.addons : EMPTY_ADDONS);
        setReels(Array.isArray(content.reels) ? content.reels : EMPTY_REELS);
        setFeatureStats(Array.isArray(content.featureStats) ? content.featureStats : EMPTY_FEATURE_STATS);
        setTestimonials(Array.isArray(content.testimonials) ? content.testimonials : EMPTY_TESTIMONIALS);
        setFaqs(Array.isArray(content.faqs) ? content.faqs : EMPTY_FAQS);
        setContactDetails(content.contactDetails ?? EMPTY_CONTACT_DETAILS);
        setHeroContent(content.heroContent ?? EMPTY_HERO_CONTENT);
        setAiAdvisorConfig(content.aiAdvisorConfig ?? EMPTY_AI_ADVISOR_CONFIG);
        setNavbarLabels(Array.isArray(content.navbarLabels) ? content.navbarLabels : EMPTY_NAVBAR_LABELS);
        setActivities(Array.isArray(content.activities) ? content.activities : EMPTY_ACTIVITIES);
        setHasLoadedContent(true);
      } catch (error) {
        console.error('Failed to load admin content from backend:', error);
      } finally {
        if (!isCancelled) setIsInitialized(true);
        if (!isCancelled) setIsAuthChecking(false);
      }
    };

    void loadContent();

    return () => {
      isCancelled = true;
    };
  }, [adminToken]);

  useEffect(() => {
    if (!isInitialized || !hasLoadedContent || !adminToken) return;

    const isEmptyPropertySet = properties.length === 0 &&
      services.length === 0 &&
      addons.length === 0 &&
      reels.length === 0 &&
      featureStats.length === 0 &&
      testimonials.length === 0 &&
      faqs.length === 0 &&
      !heroContent.title &&
      !contactDetails.email &&
      !aiAdvisorConfig.bannerTitle &&
      navbarLabels.length === 0;

    if (isEmptyPropertySet) return;

    const contentPayload = buildCurrentContent();

    if (isDemoMode) {
      writeDemoContent(contentPayload);
      postDemoContentToPreview(contentPayload);
      return;
    }

    const controller = new AbortController();
    const persistContent = async () => {
      try {
        await fetch(`${API_BASE}/api/admin/site-content`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(contentPayload),
          signal: controller.signal
        });
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Failed to persist admin content:', error);
        }
      }
    };

    void persistContent();

    return () => {
      controller.abort();
    };
  }, [
    isInitialized,
    properties,
    services,
    addons,
    reels,
    featureStats,
    testimonials,
    faqs,
    contactDetails,
    heroContent,
    aiAdvisorConfig,
    navbarLabels,
    activities,
    hasLoadedContent,
    adminToken,
    isDemoMode
  ]);

  useEffect(() => {
    if (!isDemoMode) return;

    const handlePreviewReady = (event: MessageEvent) => {
      const data = event.data as { type?: string } | null;
      if (!data || data.type !== DEMO_PREVIEW_READY_MESSAGE_TYPE) return;
      postDemoContentToPreview(buildCurrentContent());
    };

    window.addEventListener('message', handlePreviewReady);
    return () => window.removeEventListener('message', handlePreviewReady);
  }, [
    isDemoMode,
    properties,
    services,
    addons,
    reels,
    featureStats,
    testimonials,
    faqs,
    contactDetails,
    heroContent,
    aiAdvisorConfig,
    navbarLabels,
    activities
  ]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) return;

    setIsLoggingIn(true);
    setLoginError('');
    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword
        })
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const payload = await response.json();
      if (!payload?.token) {
        throw new Error('Missing session token');
      }

      localStorage.setItem(ADMIN_STORAGE_KEY, payload.token);
      setAdminToken(payload.token);
      setIsDemoMode(false);
      setIsAuthChecking(true);
    } catch (error) {
      setLoginError('Invalid username or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDemoLogin = () => {
    setDemoSession();
  };

  // Activity logger helper
  const handleLogActivity = (
    type: 'property' | 'service' | 'addon' | 'media' | 'general' | 'seo' | 'testimonial' | 'faq',
    action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish',
    details: string
  ) => {
    const newAct: RecentActivity = {
      id: `act-${Date.now()}`,
      type,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newAct, ...prev]);

    // Simulate standard draft-save feedback flash in header
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  // State trigger to force child component editors to boot into 'create' mode
  const [triggerCount, setTriggerCount] = useState(0);

  // Header quick launcher callback
  const handleHeaderQuickAction = (actionType: string) => {
    if (actionType === 'add-property') {
      setCurrentView('properties');
      setTriggerCount(prev => prev + 1);
      // Let the UI render and capture trigger actions
      setTimeout(() => {
        const addBtn = document.getElementById('add-new-property-btn');
        if (addBtn) addBtn.click();
      }, 100);
    } else if (actionType === 'ai-playground') {
      setCurrentView('ai-advisor');
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
        <div className="flex items-center gap-3 text-zinc-300">
          <LoaderCircle className="w-5 h-5 animate-spin text-indigo-400" />
          <span className="text-sm">Checking admin session...</span>
        </div>
      </div>
    );
  }

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-300">
              <LockKeyhole className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Admin Access</p>
              <h1 className="text-2xl font-bold text-white">GMM Content Admin</h1>
            </div>
          </div>

          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            Sign in with your admin credentials to manage properties, media, testimonials, FAQ, and homepage content.
          </p>

          <form className="space-y-4" onSubmit={handleAdminLogin}>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-zinc-500">Username</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-zinc-500">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>

            {loginError ? (
              <p className="text-sm text-rose-400">{loginError}</p>
            ) : null}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-3 text-sm font-semibold text-white transition-all"
            >
              {isLoggingIn ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              Sign in
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-300 transition-all"
            >
              Open Demo Panel
            </button>
          </form>

          <p className="mt-5 text-[11px] text-zinc-500 leading-relaxed">
            Default credentials are `gmmadmin` / `gmmadmin123`. You can change or add admins after signing in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Sidebar navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main workspace layout */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        
        {/* Header toolbar */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onQuickAction={handleHeaderQuickAction}
          isSaving={isSaving}
          onLogout={clearAdminSession}
          isDemoMode={isDemoMode}
          onPreviewFrontend={handlePreviewFrontend}
        />

        {/* Content body wrapper with fluid boundaries */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-8 pb-16">
          
          {/* View Dispatcher Switch */}
          {currentView === 'dashboard' && (
            <DashboardOverview
              properties={properties}
              services={services}
              addons={addons}
              reels={reels}
              activities={activities}
              onNavigate={setCurrentView}
              onAddProperty={() => handleHeaderQuickAction('add-property')}
              onAddService={() => setCurrentView('services')}
              onAddAddonChange={() => setCurrentView('addons')}
            />
          )}

          {currentView === 'properties' && (
            <div key={`prop-manager-wrap-${triggerCount}`} className="w-full">
              <PropertyManager
                properties={properties}
                onSaveProperty={(updatedProp) => {
                  setProperties(prev => {
                    const exists = prev.some(p => p.id === updatedProp.id);
                    if (exists) {
                      return prev.map(p => p.id === updatedProp.id ? updatedProp : p);
                    } else {
                      return [updatedProp, ...prev];
                    }
                  });
                }}
                onDeleteProperty={(id) => {
                  setProperties(prev => prev.filter(p => p.id !== id));
                }}
                onLogActivity={(type, action, details) => {
                  handleLogActivity(type, action as any, details);
                }}
              />
            </div>
          )}

          {/* Reuse ContentSectionsManager for tab sections */}
          {(currentView === 'services' || 
          currentView === 'addons' || 
          currentView === 'showcase' || 
          currentView === 'stats' ||
          currentView === 'testimonials' ||
          currentView === 'faq' ||
          currentView === 'general-content' || 
          currentView === 'contact') && (
            <ContentSectionsManager
              currentTab={currentView as any}
              heroContent={heroContent}
              onSaveHeroContent={setHeroContent}
              services={services}
              onSaveService={(item) => {
                setServices(prev => {
                  const exists = prev.some(s => s.id === item.id);
                  if (exists) return prev.map(s => s.id === item.id ? item : s);
                  return [item, ...prev];
                });
              }}
              onDeleteService={(id) => {
                setServices(prev => prev.filter(s => s.id !== id));
              }}
              addons={addons}
              onSaveAddon={(item) => {
                setAddons(prev => {
                  const exists = prev.some(a => a.id === item.id);
                  if (exists) return prev.map(a => a.id === item.id ? item : a);
                  return [item, ...prev];
                });
              }}
              onDeleteAddon={(id) => {
                setAddons(prev => prev.filter(a => a.id !== id));
              }}
              reels={reels}
              onSaveReel={(item) => {
                setReels(prev => {
                  const exists = prev.some(r => r.id === item.id);
                  if (exists) return prev.map(r => r.id === item.id ? item : r);
                  return [item, ...prev];
                });
              }}
              onDeleteReel={(id) => {
                setReels(prev => prev.filter(r => r.id !== id));
              }}
              featureStats={featureStats}
              onSaveFeatureStat={(item) => {
                setFeatureStats(prev => {
                  const exists = prev.some(s => s.id === item.id);
                  if (exists) return prev.map(s => s.id === item.id ? item : s);
                  return [item, ...prev];
                });
              }}
              onDeleteFeatureStat={(id) => {
                setFeatureStats(prev => prev.filter(s => s.id !== id));
              }}
              testimonials={testimonials}
              onSaveTestimonial={(item) => {
                setTestimonials(prev => {
                  const exists = prev.some(t => t.id === item.id);
                  if (exists) return prev.map(t => t.id === item.id ? item : t);
                  return [item, ...prev];
                });
              }}
              onDeleteTestimonial={(id) => {
                setTestimonials(prev => prev.filter(t => t.id !== id));
              }}
              faqs={faqs}
              onSaveFaq={(item) => {
                setFaqs(prev => {
                  const exists = prev.some(f => f.id === item.id);
                  if (exists) return prev.map(f => f.id === item.id ? item : f);
                  return [item, ...prev];
                });
              }}
              onDeleteFaq={(id) => {
                setFaqs(prev => prev.filter(f => f.id !== id));
              }}
              contactDetails={contactDetails}
              onSaveContactDetails={setContactDetails}
              navbarLabels={navbarLabels}
              onSaveNavbarLabels={setNavbarLabels}
              onLogActivity={(type, action, details) => {
                handleLogActivity(type, action as any, details);
              }}
            />
          )}

          {currentView === 'admin-access' && (
            <AdminAccessManager
              onLogActivity={(type, action, details) => {
                handleLogActivity(type, action as any, details);
              }}
            />
          )}

          {currentView === 'ai-advisor' && (
            <AIAdvisorPreview
              config={aiAdvisorConfig}
              onSaveConfig={setAiAdvisorConfig}
              properties={properties}
              services={services}
              onLogActivity={(type, action, details) => {
                handleLogActivity(type, action as any, details);
              }}
            />
          )}

        </main>
      </div>

    </div>
  );
}
