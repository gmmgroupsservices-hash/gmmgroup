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

const DEMO_CREATED_AT = '2026-06-01T00:00:00.000Z';

const image = (propertyId: string, title: string, url: string) => [
  {
    id: `img-${propertyId}-cover`,
    url,
    isCoverOrPrimary: true,
    type: 'image' as const,
    title: `${title} Cover`
  }
];

const video = (propertyId: string, title: string, url?: string) =>
  url
    ? [
        {
          id: `vid-${propertyId}-walkthrough`,
          url,
          isCoverOrPrimary: true,
          type: 'video' as const,
          title: `${title} Walkthrough`
        }
      ]
    : [];

export const DEMO_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'GMM Lumina Sky Mansion',
    type: 'Sale',
    category: 'Villa',
    state: 'Telangana',
    city: 'Hyderabad',
    location: 'Jubilee Hills, Hyderabad',
    price: 85000000,
    beds: 5,
    baths: 6,
    squareFeet: 6800,
    description:
      "An architectural masterpiece in Hyderabad's premier quarter. Featuring double-height ceilings, a private glass pool cascading over the hillside, state-of-the-art automation by Crestron, and custom Italian marble flooring throughout.",
    featured: true,
    reraFlag: true,
    status: 'Published',
    images: image('prop-1', 'GMM Lumina Sky Mansion', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200'),
    videos: video('prop-1', 'GMM Lumina Sky Mansion', 'https://assets.mixkit.co/videos/preview/mixkit-luxury-home-with-swimming-pool-and-lights-at-night-41584-large.mp4'),
    createdAt: DEMO_CREATED_AT
  },
  {
    id: 'prop-2',
    title: 'Aura Horizon Penthouse',
    type: 'Sale',
    category: 'Apartment',
    state: 'Karnataka',
    city: 'Bangalore',
    location: 'Whitefield, Bangalore',
    price: 48000000,
    beds: 4,
    baths: 4,
    squareFeet: 4200,
    description:
      "Soaring high above India's tech hub, this penthouse offers an immersive sky-loft experience. Wrapped in floor-to-ceiling high-performance glazing, it boasts a 360-degree view of Bangalore's shimmering horizon.",
    featured: true,
    reraFlag: true,
    status: 'Published',
    images: image('prop-2', 'Aura Horizon Penthouse', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200'),
    videos: video('prop-2', 'Aura Horizon Penthouse', 'https://assets.mixkit.co/videos/preview/mixkit-modern-interior-design-of-a-luxury-living-room-34289-large.mp4'),
    createdAt: DEMO_CREATED_AT
  },
  {
    id: 'prop-3',
    title: 'The GMM Vista Sovereign Estates',
    type: 'Sale',
    category: 'Villa',
    state: 'Karnataka',
    city: 'Bangalore',
    location: 'Indiranagar, Bangalore',
    price: 120000000,
    beds: 6,
    baths: 7,
    squareFeet: 8500,
    description:
      'Nestled in the lush lanes of Indiranagar, these boutique villas combine mid-century modernist tropical styling with sovereign security assets. Handcrafted teakwood columns meet ultra-clear monolithic smart-tinting glass panels.',
    featured: true,
    reraFlag: true,
    status: 'Published',
    images: image('prop-3', 'The GMM Vista Sovereign Estates', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'),
    videos: video('prop-3', 'The GMM Vista Sovereign Estates', 'https://assets.mixkit.co/videos/preview/mixkit-gorgeous-house-surrounded-by-trees-at-sunset-41585-large.mp4'),
    createdAt: DEMO_CREATED_AT
  },
  {
    id: 'prop-4',
    title: 'GMM TechPark Obsidian HQ',
    type: 'Sale',
    category: 'Commercial',
    state: 'Telangana',
    city: 'Hyderabad',
    location: 'Gachibowli, Hyderabad',
    price: 350000000,
    beds: 0,
    baths: 8,
    squareFeet: 22000,
    description:
      'A premier futuristic commercial corporate tower headquarters. Designed for high-frequency trading firms, deep tech startups, or family offices demanding sovereign technical grade connectivity and bulletproof secure zones.',
    featured: false,
    reraFlag: true,
    status: 'Published',
    images: image('prop-4', 'GMM TechPark Obsidian HQ', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'),
    videos: [],
    createdAt: DEMO_CREATED_AT
  },
  {
    id: 'prop-5',
    title: 'Marina Boulevard Horizon Plots',
    type: 'Sale',
    category: 'Plot',
    state: 'AP',
    city: 'Vizag',
    location: 'Rushikonda Beach, Vizag',
    price: 35000000,
    beds: 0,
    baths: 0,
    squareFeet: 4500,
    description:
      "Prime beach-facing premium developmental high-value lands in Andhra Pradesh's burgeoning executive capital. Pre-approved for instant multi-elevation luxury villa development with direct private beach slipway permissions.",
    featured: false,
    reraFlag: true,
    status: 'Published',
    images: image('prop-5', 'Marina Boulevard Horizon Plots', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200'),
    videos: [],
    createdAt: DEMO_CREATED_AT
  },
  {
    id: 'prop-6',
    title: 'Nova Crest Elite Executive Suites',
    type: 'Rent',
    category: 'Apartment',
    state: 'Karnataka',
    city: 'Bangalore',
    location: 'Koramangala, Bangalore',
    price: 250000,
    beds: 2,
    baths: 3,
    squareFeet: 1950,
    description:
      'High-contrast urban elegance meets tech-nomad luxury. Fully furnished with bespoke Scandinavian custom oak cabinetry, sub-zero premium cooling stacks, and high-frequency noise-dampening acoustic panels.',
    featured: false,
    reraFlag: true,
    status: 'Published',
    images: image('prop-6', 'Nova Crest Elite Executive Suites', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200'),
    videos: video('prop-6', 'Nova Crest Elite Executive Suites', 'https://assets.mixkit.co/videos/preview/mixkit-inside-a-tastefully-decorated-living-room-34288-large.mp4'),
    createdAt: DEMO_CREATED_AT
  },
  {
    id: 'prop-7',
    title: 'Nagarjuna Luxury Sovereign Plots',
    type: 'Sale',
    category: 'Plot',
    state: 'AP',
    city: 'Vijayawada',
    location: 'Vijayawada Smart Layout, Vijayawada',
    price: 19000000,
    beds: 0,
    baths: 0,
    squareFeet: 3600,
    description:
      "Premium investment-ready dynamic plots in AP's heartland district. Fully integrated urban high-efficiency master development with wide solar-illuminated avenues, private parks, and advanced smart automated security infrastructure.",
    featured: false,
    reraFlag: true,
    status: 'Published',
    images: image('prop-7', 'Nagarjuna Luxury Sovereign Plots', 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&q=80&w=1200'),
    videos: [],
    createdAt: DEMO_CREATED_AT
  },
  {
    id: 'prop-8',
    title: 'GMM Cyber Oasis Duplex',
    type: 'Rent',
    category: 'Apartment',
    state: 'Telangana',
    city: 'Hyderabad',
    location: 'HITEC City, Hyderabad',
    price: 380000,
    beds: 3,
    baths: 4,
    squareFeet: 3100,
    description:
      "An ultra-contemporary sky duplex catering to the elite tech executive. Nested in the heart of Hyderabad's cybersecurity hub. Features dynamic smart glass partitions, private fitness deck, and premium sub-zero kitchen suites.",
    featured: false,
    reraFlag: true,
    status: 'Published',
    images: image('prop-8', 'GMM Cyber Oasis Duplex', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'),
    videos: [],
    createdAt: DEMO_CREATED_AT
  },
  {
    id: 'prop-9',
    title: 'Symphony Hills Royal Villa',
    type: 'Sale',
    category: 'Villa',
    state: 'Telangana',
    city: 'Hyderabad',
    location: 'Jubilee Hills, Hyderabad',
    price: 72000000,
    beds: 4,
    baths: 5,
    squareFeet: 5200,
    description:
      'Elegant contemporary villa featuring a private internal water cascade, dual master dressing halls, a state-of-the-art solar roof matrix, and security airlocks.',
    featured: false,
    reraFlag: true,
    status: 'Published',
    images: image('prop-9', 'Symphony Hills Royal Villa', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1200'),
    videos: [],
    createdAt: DEMO_CREATED_AT
  }
];

export const DEMO_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    icon: 'ShieldAlert',
    title: 'Sovereign Asset Brokerage',
    description:
      "Discreet advisory & acquisition representation for India's high-net-worth families, tech-founders, and elite institutional offices.",
    priceRange: '',
    status: 'Published'
  },
  {
    id: 'srv-2',
    icon: 'Coins',
    title: 'Fintech Mortgage Optimization',
    description:
      'Proprietory real-time pre-approval integrations providing optimal structural lending formulas from partner premium banking consortia.',
    priceRange: '',
    status: 'Published'
  },
  {
    id: 'srv-3',
    icon: 'ShieldCheck',
    title: 'GMM Trust Verification (RERA)',
    description:
      'Stringent structural, statutory and clean tenure verification. Every villa, plot, and commercial landmark carries pre-approved GMM Trust seal.',
    priceRange: '',
    status: 'Published'
  },
  {
    id: 'srv-4',
    icon: 'Compass',
    title: 'AI-Powered Location Synergy',
    description:
      'Advanced model simulations compiling micro-market insights, historic land growth rates, infra corridors, and regional air-quality matrices.',
    priceRange: '',
    status: 'Published'
  }
];

export const DEMO_ADDONS: AddOnItem[] = [
  {
    id: 'loans',
    title: 'Home Loans',
    description: 'Get guided support for home loans, refinancing, and pre-approval workflows tied to your property search.',
    price: '',
    status: 'Published'
  },
  {
    id: 'interior',
    title: 'Interior Design',
    description: 'From layout ideas to premium finishing, we can connect interior concepts to the home you choose.',
    price: '',
    status: 'Published'
  },
  {
    id: 'paints',
    title: 'Paint Works',
    description: 'Refresh homes and commercial spaces with color planning, premium coatings, and long-life finish options.',
    price: '',
    status: 'Published'
  },
  {
    id: 'fencing',
    title: 'Fencing Works',
    description: 'Secure and define your asset with fencing solutions for residential, commercial, and plotted layouts.',
    price: '',
    status: 'Published'
  }
];

export const DEMO_REELS: ShowcaseReel[] = [
  {
    id: 'reel-1',
    title: 'Inside the GMM 12 Cr Sovereignty Estate',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-home-with-swimming-pool-and-lights-at-night-41584-large.mp4',
    thumbnailUrl: '',
    views: '45s',
    status: 'Published'
  },
  {
    id: 'reel-2',
    title: 'Walking Tour: WHITEFIELD AURA Penthouse',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-interior-design-of-a-luxury-living-room-34289-large.mp4',
    thumbnailUrl: '',
    views: '30s',
    status: 'Published'
  },
  {
    id: 'reel-3',
    title: 'Sovereign Gachibowli HQ Obsidian Tour',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-gorgeous-house-surrounded-by-trees-at-sunset-41585-large.mp4',
    thumbnailUrl: '',
    views: '55s',
    status: 'Published'
  }
];

export const DEMO_FEATURE_STATS: FeatureStatItem[] = [
  {
    id: 'stat-1',
    stat: 'Rs 1,200 Cr+',
    label: 'Sovereign Portfolio Value Managed',
    description: 'Direct premium property assets under persistent strategic advisory across Bangalore, Hyderabad, and coastal executive sectors.',
    status: 'Published'
  },
  {
    id: 'stat-2',
    stat: '150+',
    label: 'Ultra-High Net Worth Clients',
    description: 'Trusted partners including multi-family offices, public leaders, and trailblazing tech unicorns.',
    status: 'Published'
  },
  {
    id: 'stat-3',
    stat: '100% RERA',
    label: 'Clean Statutory Clearances',
    description: 'A total guarantee of absolute clean, conflict-free land titles, zero litigation, and speed-approved clearances.',
    status: 'Published'
  },
  {
    id: 'stat-4',
    stat: '<0.01%',
    label: 'Friction Rate Transactions',
    description: 'High-velocity paperwork pipelines executing with white-glove banking handshakes and zero downtime.',
    status: 'Published'
  }
];

export const DEMO_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'testi-1',
    name: 'Dr. K. Srinivas Rao',
    role: 'Founder, Peak Horizon Tech',
    quote:
      'GMM Groups & Services redefined real estate procurement for me. Their advisory was incredibly data-centric, high-trust, and completely professional.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    status: 'Published'
  },
  {
    id: 'testi-2',
    name: 'Anjali Deshmukh',
    role: 'Managing Director, Vista Family Office',
    quote:
      "Finding high-value plots and commercial units in Telangana/AP with clean records is challenging. GMM's RERA transparency and verification process helped our expansion.",
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    status: 'Published'
  },
  {
    id: 'testi-3',
    name: 'Vikramjit Banerjee',
    role: 'Co-Founder, CoreStack Unicorn',
    quote:
      'The GMM Smart AI Concierge suggested Lumina Sky Mansion based on my commute and preferences. The closing process was fast and smooth.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    status: 'Published'
  }
];

export const DEMO_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What makes GMM Groups & Services different from standard real estate brokers?',
    answer:
      'We are a full-scale digital prime-brokerage, blending investment banking rigor with modern tech. We verify every property, coordinate advisory, and support clean transaction workflows.',
    status: 'Published'
  },
  {
    id: 'faq-2',
    question: 'Do you offer property transactions across AP, Telangana, and Karnataka?',
    answer:
      'Yes. Our core premium corridors include Hyderabad, Bangalore, Vizag, Vijayawada, and other expanding premium sectors.',
    status: 'Published'
  },
  {
    id: 'faq-3',
    question: 'How does the GMM Smart AI Property Advisor work?',
    answer:
      'The advisor reads your criteria, commute habits, investment needs, and property preferences to help shortlist suitable listings and add-on services.',
    status: 'Published'
  },
  {
    id: 'faq-4',
    question: 'What are your verification steps for premium Land Plots?',
    answer:
      'Every land plot goes through legal registry audit, satellite coordinate mapping, RERA checks, zoning review, and title deed validation.',
    status: 'Published'
  },
  {
    id: 'faq-5',
    question: 'Can we trade, sell, or liquidate our luxury assets through your network?',
    answer:
      'Yes. GMM supports private off-market sales, buyer matching, and confidential liquidation through verified premium buyer networks.',
    status: 'Published'
  }
];

export const DEMO_CONTACT: ContactDetails = {
  phone: '+91 80 4492 1000',
  whatsappNumber: '919999999999',
  whatsappButtonText: 'GMM Services WhatsApp',
  email: 'info@gmmgroups.in',
  address: 'GMM Groups & Services, Lower Parel, Mumbai, Maharashtra, India',
  gmapsEmbedUrl: '',
  seoTitle: 'GMM Groups & Services | Properties, Loans, Interiors & Add-ons',
  seoDescription:
    'GMM Groups & Services helps with premium properties, loans, interiors, paint works, fencing works, and business add-ons across India.',
  footerText: "2026 GMM Groups & Services Private Limited. India's Premier Estate Marketplace. All Rights Reserved."
};

export const DEMO_HERO: HeroContent = {
  title: 'Find Your Dream Property',
  subtitle:
    'The ultimate single-destination premium portal for certified lands, architectural villas, and institutional offices across Karnataka, Telangana, and Andhra Pradesh.',
  backgroundImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
  primaryButtonText: 'Explore Properties',
  secondaryButtonText: 'Contact Agent'
};

export const DEMO_AI: AIAdvisorConfig = {
  bannerTitle: 'GMM Smart AI Property Advisor',
  bannerSubtitle: 'Ask anything about properties, documentation, loans, interiors, or add-ons.',
  systemPrompt:
    'You are the GMM Groups & Services property advisor. Help with properties, loans, interiors, paint works, fencing works, documentation, and WhatsApp contact. Keep responses concise, helpful, and professional.',
  welcomeMessage:
    'Welcome to GMM Groups & Services. I can help with properties, documentation, loans, interiors, and other business add-ons. How can I help you today?',
  suggestedQuestions: [
    'Tell me about the Hyderabad villas',
    'What add-ons can I manage?',
    'Can you help with home loans?',
    'How do I upload property videos?'
  ]
};

export const DEMO_NAVBAR: NavbarLabel[] = [
  { id: 'home', label: 'Home', path: 'home' },
  { id: 'services', label: 'Services', path: 'services' },
  { id: 'business-addons', label: 'Add-ons', path: 'business-addons' },
  { id: 'listings', label: 'Properties', path: 'listings' },
  { id: 'reels', label: 'Showcase', path: 'reels' },
  { id: 'ai-advisor', label: 'AI Advisor', path: 'ai-advisor' },
  { id: 'about', label: 'Sovereign Stat', path: 'about' },
  { id: 'contact', label: 'Contact', path: 'contact' }
];

export const DEMO_ACTIVITIES: RecentActivity[] = [
  {
    id: 'demo-act-1',
    type: 'general',
    action: 'update',
    details: 'Full frontend content mirror loaded for demo admin',
    timestamp: DEMO_CREATED_AT
  }
];
