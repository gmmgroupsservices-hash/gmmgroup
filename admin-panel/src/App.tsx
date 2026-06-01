/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import PropertyManager from './components/PropertyManager';
import ContentSectionsManager from './components/ContentSectionsManager';
import AIAdvisorPreview from './components/AIAdvisorPreview';

import {
  Property,
  ServiceItem,
  AddOnItem,
  ShowcaseReel,
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
const EMPTY_NAVBAR_LABELS: NavbarLabel[] = [];
const EMPTY_ACTIVITIES: RecentActivity[] = [];

export default function App() {
  // Navigation tabs
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Live content state loaded from and saved to backend
  const [properties, setProperties] = useState<Property[]>(EMPTY_PROPERTIES);
  const [services, setServices] = useState<ServiceItem[]>(EMPTY_SERVICES);
  const [addons, setAddons] = useState<AddOnItem[]>(EMPTY_ADDONS);
  const [reels, setReels] = useState<ShowcaseReel[]>(EMPTY_REELS);
  const [contactDetails, setContactDetails] = useState<ContactDetails>(EMPTY_CONTACT_DETAILS);
  const [heroContent, setHeroContent] = useState<HeroContent>(EMPTY_HERO_CONTENT);
  const [aiAdvisorConfig, setAiAdvisorConfig] = useState<AIAdvisorConfig>(EMPTY_AI_ADVISOR_CONFIG);
  const [navbarLabels, setNavbarLabels] = useState<NavbarLabel[]>(EMPTY_NAVBAR_LABELS);
  const [activities, setActivities] = useState<RecentActivity[]>(EMPTY_ACTIVITIES);

  useEffect(() => {
    let isCancelled = false;

    const loadContent = async () => {
      try {
        const response = await fetch('/api/admin/site-content');
        if (!response.ok) {
          throw new Error(`Failed to load admin content (${response.status})`);
        }

        const content = await response.json();
        if (isCancelled) return;

        const normalizedProperties = Array.isArray(content.properties)
          ? content.properties.map((prop: Property) => ({
              ...prop,
              images: Array.isArray(prop.images) ? prop.images : [],
              videos: Array.isArray(prop.videos) ? prop.videos : []
            }))
          : EMPTY_PROPERTIES;

        setProperties(normalizedProperties);
        setServices(Array.isArray(content.services) ? content.services : EMPTY_SERVICES);
        setAddons(Array.isArray(content.addons) ? content.addons : EMPTY_ADDONS);
        setReels(Array.isArray(content.reels) ? content.reels : EMPTY_REELS);
        setContactDetails(content.contactDetails ?? EMPTY_CONTACT_DETAILS);
        setHeroContent(content.heroContent ?? EMPTY_HERO_CONTENT);
        setAiAdvisorConfig(content.aiAdvisorConfig ?? EMPTY_AI_ADVISOR_CONFIG);
        setNavbarLabels(Array.isArray(content.navbarLabels) ? content.navbarLabels : EMPTY_NAVBAR_LABELS);
        setActivities(Array.isArray(content.activities) ? content.activities : EMPTY_ACTIVITIES);
      } catch (error) {
        console.error('Failed to load admin content from backend:', error);
      } finally {
        if (!isCancelled) setIsInitialized(true);
      }
    };

    void loadContent();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const controller = new AbortController();
    const persistContent = async () => {
      try {
        await fetch('/api/admin/site-content', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            properties,
            services,
            addons,
            reels,
            contactDetails,
            heroContent,
            aiAdvisorConfig,
            navbarLabels,
            activities
          }),
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
    contactDetails,
    heroContent,
    aiAdvisorConfig,
    navbarLabels,
    activities
  ]);

  // Activity logger helper
  const handleLogActivity = (
    type: 'property' | 'service' | 'addon' | 'media' | 'general' | 'seo',
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
              contactDetails={contactDetails}
              onSaveContactDetails={setContactDetails}
              navbarLabels={navbarLabels}
              onSaveNavbarLabels={setNavbarLabels}
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
