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

export const DEMO_PROPERTIES: Property[] = [
  {
    id: 'demo-prop-1',
    title: 'GMM Lumina Sky Mansion',
    type: 'Sale',
    category: 'Villa',
    state: 'Telangana',
    city: 'Hyderabad',
    location: 'Jubilee Hills',
    price: 85000000,
    beds: 5,
    baths: 6,
    squareFeet: 6800,
    description: 'Architectural villa with private pool, smart home systems, and premium security.',
    featured: true,
    reraFlag: true,
    status: 'Published',
    images: [],
    videos: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-prop-2',
    title: 'Aura Horizon Penthouse',
    type: 'Sale',
    category: 'Apartment',
    state: 'Karnataka',
    city: 'Bangalore',
    location: 'Whitefield',
    price: 48000000,
    beds: 4,
    baths: 4,
    squareFeet: 4200,
    description: 'Sky-level penthouse with panoramic city views and a premium lifestyle fit-out.',
    featured: true,
    reraFlag: true,
    status: 'Published',
    images: [],
    videos: [],
    createdAt: new Date().toISOString()
  }
];

export const DEMO_SERVICES: ServiceItem[] = [
  { id: 'demo-srv-1', title: 'Sovereign Asset Brokerage', description: 'Discreet acquisition support for premium buyers.', icon: 'ShieldAlert', status: 'Published' },
  { id: 'demo-srv-2', title: 'Fintech Mortgage Optimization', description: 'Loan assistance and pre-approval support.', icon: 'Coins', status: 'Published' }
];

export const DEMO_ADDONS: AddOnItem[] = [
  { id: 'demo-add-1', title: 'Home Loans', description: 'Loan assistance and bank coordination.', status: 'Published' },
  { id: 'demo-add-2', title: 'Interior Design', description: 'Space planning and fit-out coordination.', status: 'Published' }
];

export const DEMO_REELS: ShowcaseReel[] = [
  { id: 'demo-reel-1', title: 'Inside a premium GMM estate', videoUrl: '', thumbnailUrl: '', views: '0 views', status: 'Published' }
];

export const DEMO_FEATURE_STATS: FeatureStatItem[] = [
  { id: 'demo-stat-1', stat: '₹1,200 Cr+', label: 'Portfolio Value', description: 'Demo portfolio value.', status: 'Published' }
];

export const DEMO_TESTIMONIALS: TestimonialItem[] = [
  { id: 'demo-testi-1', name: 'Client Name', role: 'Founder', quote: 'Great service and clean process.', avatar: '', status: 'Published' }
];

export const DEMO_FAQS: FAQItem[] = [
  { id: 'demo-faq-1', question: 'What does GMM do?', answer: 'Real estate advisory and business add-ons.', status: 'Published' }
];

export const DEMO_CONTACT: ContactDetails = {
  phone: '+91 80 4492 1000',
  whatsappNumber: '+91 98765 43210',
  whatsappButtonText: 'GMM Services WhatsApp',
  email: 'info@gmmgroups.in',
  address: 'GMM Groups & Services, Lower Parel, Mumbai, Maharashtra, India',
  gmapsEmbedUrl: '',
  seoTitle: 'GMM Groups & Services',
  seoDescription: 'Premium properties and add-ons.',
  footerText: '© 2026 GMM Groups & Services. All rights reserved.'
};

export const DEMO_HERO: HeroContent = {
  title: 'Find Your Dream Property',
  subtitle: 'Premium properties across India.',
  backgroundImage: '',
  primaryButtonText: 'Explore Properties',
  secondaryButtonText: 'Contact Agent'
};

export const DEMO_AI: AIAdvisorConfig = {
  bannerTitle: 'GMM AI Advisor',
  bannerSubtitle: 'Demo advisor text.',
  systemPrompt: 'Demo prompt.',
  welcomeMessage: 'Welcome to GMM demo mode.',
  suggestedQuestions: ['Tell me about properties', 'Show add-ons']
};

export const DEMO_NAVBAR: NavbarLabel[] = [
  { id: 'demo-nav-1', label: 'Home', path: '/' },
  { id: 'demo-nav-2', label: 'Properties', path: '/listings' },
  { id: 'demo-nav-3', label: 'Contact', path: '/contact' }
];

export const DEMO_ACTIVITIES: RecentActivity[] = [
  { id: 'demo-act-1', type: 'general', action: 'update', details: 'Demo content loaded', timestamp: new Date().toISOString() }
];
