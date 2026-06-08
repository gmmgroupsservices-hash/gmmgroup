import {
  DEMO_ACTIVITIES,
  DEMO_ADDONS,
  DEMO_AI,
  DEMO_CONTACT,
  DEMO_FAQS,
  DEMO_FEATURE_STATS,
  DEMO_HERO,
  DEMO_NAVBAR,
  DEMO_PROPERTIES,
  DEMO_REELS,
  DEMO_SERVICES,
  DEMO_TESTIMONIALS
} from './demoContent';
import type {
  AIAdvisorConfig,
  AddOnItem,
  ContactDetails,
  FAQItem,
  FeatureStatItem,
  HeroContent,
  NavbarLabel,
  Property,
  RecentActivity,
  ServiceItem,
  ShowcaseReel,
  TestimonialItem
} from './types';

export const DEMO_ADMIN_TOKEN = 'gmm_demo_token';
export const DEMO_CONTENT_STORAGE_KEY = 'gmm_demo_site_content';
export const DEMO_CONTENT_MESSAGE_TYPE = 'GMM_DEMO_CONTENT_SYNC';
export const DEMO_PREVIEW_READY_MESSAGE_TYPE = 'GMM_DEMO_PREVIEW_READY';

export interface DemoSiteContent {
  properties: Property[];
  services: ServiceItem[];
  addons: AddOnItem[];
  reels: ShowcaseReel[];
  featureStats: FeatureStatItem[];
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
  contactDetails: ContactDetails;
  heroContent: HeroContent;
  aiAdvisorConfig: AIAdvisorConfig;
  navbarLabels: NavbarLabel[];
  activities: RecentActivity[];
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const isBlankContent = (content: Partial<DemoSiteContent> | null | undefined) =>
  !content ||
  (!Array.isArray(content.properties) || content.properties.length === 0) &&
  (!Array.isArray(content.services) || content.services.length === 0) &&
  (!Array.isArray(content.addons) || content.addons.length === 0) &&
  (!Array.isArray(content.reels) || content.reels.length === 0) &&
  (!Array.isArray(content.featureStats) || content.featureStats.length === 0) &&
  (!Array.isArray(content.testimonials) || content.testimonials.length === 0) &&
  (!Array.isArray(content.faqs) || content.faqs.length === 0) &&
  !content.contactDetails &&
  !content.heroContent &&
  !content.aiAdvisorConfig &&
  !content.navbarLabels &&
  !content.activities;

export const createDemoContent = (): DemoSiteContent => ({
  properties: clone(DEMO_PROPERTIES),
  services: clone(DEMO_SERVICES),
  addons: clone(DEMO_ADDONS),
  reels: clone(DEMO_REELS),
  featureStats: clone(DEMO_FEATURE_STATS),
  testimonials: clone(DEMO_TESTIMONIALS),
  faqs: clone(DEMO_FAQS),
  contactDetails: clone(DEMO_CONTACT),
  heroContent: clone(DEMO_HERO),
  aiAdvisorConfig: clone(DEMO_AI),
  navbarLabels: clone(DEMO_NAVBAR),
  activities: clone(DEMO_ACTIVITIES)
});

const normalizeContent = (content: Partial<DemoSiteContent> | null | undefined): DemoSiteContent => {
  const defaults = createDemoContent();
  if (isBlankContent(content)) return defaults;
  return {
    properties: Array.isArray(content?.properties) ? content.properties : defaults.properties,
    services: Array.isArray(content?.services) ? content.services : defaults.services,
    addons: Array.isArray(content?.addons) ? content.addons : defaults.addons,
    reels: Array.isArray(content?.reels) ? content.reels : defaults.reels,
    featureStats: Array.isArray(content?.featureStats) ? content.featureStats : defaults.featureStats,
    testimonials: Array.isArray(content?.testimonials) ? content.testimonials : defaults.testimonials,
    faqs: Array.isArray(content?.faqs) ? content.faqs : defaults.faqs,
    contactDetails: content?.contactDetails ?? defaults.contactDetails,
    heroContent: content?.heroContent ?? defaults.heroContent,
    aiAdvisorConfig: content?.aiAdvisorConfig ?? defaults.aiAdvisorConfig,
    navbarLabels: Array.isArray(content?.navbarLabels) ? content.navbarLabels : defaults.navbarLabels,
    activities: Array.isArray(content?.activities) ? content.activities : defaults.activities
  };
};

export const readDemoContent = (): DemoSiteContent => {
  if (typeof window === 'undefined') return createDemoContent();

  try {
    const saved = window.localStorage.getItem(DEMO_CONTENT_STORAGE_KEY);
    return saved ? normalizeContent(JSON.parse(saved) as Partial<DemoSiteContent>) : createDemoContent();
  } catch {
    return createDemoContent();
  }
};

export const writeDemoContent = (content: DemoSiteContent) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DEMO_CONTENT_STORAGE_KEY, JSON.stringify(normalizeContent(content)));
};
