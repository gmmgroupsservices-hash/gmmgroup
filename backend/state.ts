import {
  INITIAL_PROPERTIES as PUBLIC_INITIAL_PROPERTIES,
  SERVICES as PUBLIC_SERVICES,
  REELS as PUBLIC_REELS,
  FEATURES_GRID as PUBLIC_FEATURES_GRID,
  TESTIMONIALS as PUBLIC_TESTIMONIALS,
  FAQS as PUBLIC_FAQS
} from "./data.ts";
import type {
  AddOnItem,
  AdminAccount,
  AdminProperty,
  AIAdvisorConfig,
  ContactDetails,
  FAQItem,
  FeatureStatItem,
  HeroContent,
  NavbarLabel,
  PublicProperty,
  RecentActivity,
  ServiceItem,
  ShowcaseReel,
  SiteContent,
  TestimonialItem
} from "./types.ts";

export const ADMIN_SESSION_TOKEN = "gmm-admin-session";

let adminAccounts: AdminAccount[] = [
  {
    id: "admin-1",
    username: "gmmadmin",
    password: "gmmadmin123",
    role: "administrator"
  }
];

export const getAdminAccounts = () => adminAccounts;

export const setAdminAccounts = (accounts: AdminAccount[]) => {
  adminAccounts = accounts;
};

export const toAdminProperty = (property: PublicProperty): AdminProperty => {
  const inferredType: AdminProperty["type"] = property.category === "Rent" ? "Rent" : "Sale";
  const inferredCategory: AdminProperty["category"] =
    property.type === "Commercial"
      ? "Commercial"
      : property.type === "Plot"
        ? "Plot"
        : property.type === "Villa"
          ? "Villa"
          : property.type === "Apartment"
            ? "Apartment"
            : "Residential";

  return {
    id: property.id,
    title: property.title,
    type: inferredType,
    category: inferredCategory,
    state: property.state,
    city: property.city,
    location: property.location,
    price: property.numericPrice,
    beds: property.beds,
    baths: property.baths,
    squareFeet: property.sqft,
    description: property.description,
    featured: property.featured,
    reraFlag: property.rera,
    approvalType: property.approvalType ?? (property.rera ? "RERA" : "None"),
    approvalAuthority: property.approvalAuthority,
    status: "Published",
    images: property.imageUrl
      ? [
          {
            id: `img-${property.id}-cover`,
            url: property.imageUrl,
            isCoverOrPrimary: true,
            type: "image",
            title: `${property.title} Cover`
          }
        ]
      : [],
    videos: property.videoUrl
      ? [
          {
            id: `vid-${property.id}-walkthrough`,
            url: property.videoUrl,
            isCoverOrPrimary: true,
            type: "video",
            title: `${property.title} Walkthrough`
          }
        ]
      : [],
    createdAt: new Date().toISOString()
  };
};

const adminServices: ServiceItem[] = PUBLIC_SERVICES.map((service, index) => ({
  id: `srv-${index + 1}`,
  title: service.title,
  description: service.description,
  icon: service.icon,
  priceRange: "",
  status: "Published"
}));

const adminAddons: AddOnItem[] = [
  {
    id: "add-1",
    title: "Home Loans",
    description: "Loan assistance and bank coordination for property purchases and construction finance.",
    price: "",
    status: "Published"
  },
  {
    id: "add-2",
    title: "Interior Design",
    description: "Space planning, materials, and end-to-end interior fit-out coordination.",
    price: "",
    status: "Published"
  },
  {
    id: "add-3",
    title: "Paint Works",
    description: "Premium interior and exterior paint packages for residential and commercial projects.",
    price: "",
    status: "Published"
  },
  {
    id: "add-4",
    title: "Fencing Works",
    description: "Boundary fencing, gates, and site perimeter protection for plots and developments.",
    price: "",
    status: "Published"
  }
];

const adminReels: ShowcaseReel[] = PUBLIC_REELS.map((reel, index) => ({
  id: `reel-${index + 1}`,
  title: reel.title,
  videoUrl: reel.videoUrl,
  thumbnailUrl: "",
  views: reel.duration,
  status: "Published"
}));

const adminFeatureStats: FeatureStatItem[] = PUBLIC_FEATURES_GRID.map((feature, index) => ({
  id: `stat-${index + 1}`,
  stat: feature.stat,
  label: feature.label,
  description: feature.description,
  status: "Published"
}));

const adminTestimonials: TestimonialItem[] = PUBLIC_TESTIMONIALS.map((testimonial, index) => ({
  id: `testi-${index + 1}`,
  name: testimonial.name,
  role: testimonial.role,
  quote: testimonial.quote,
  avatar: testimonial.avatar,
  status: "Published"
}));

const adminFaqs: FAQItem[] = PUBLIC_FAQS.map((faq, index) => ({
  id: `faq-${index + 1}`,
  question: faq.question,
  answer: faq.answer,
  status: "Published"
}));

const adminContactDetails: ContactDetails = {
  phone: "+91 80 4492 1000",
  whatsappNumber: "+91 98765 43210",
  whatsappButtonText: "GMM Services WhatsApp",
  email: "info@gmmgroups.in",
  address: "GMM Groups & Services, Lower Parel, Mumbai, Maharashtra, India",
  gmapsEmbedUrl: "",
  seoTitle: "GMM Groups & Services | Properties, Loans, Interiors & Add-ons",
  seoDescription: "GMM Groups & Services helps with premium properties, loans, interiors, paint works, fencing works, and business add-ons across India.",
  footerText: "© 2026 GMM Groups & Services. All rights reserved."
};

const adminHero: HeroContent = {
  title: "Find Your Dream Property",
  subtitle:
    "The ultimate single-destination premium portal for certified lands, architectural villas, and institutional offices across Karnataka, Telangana, and Andhra Pradesh.",
  backgroundImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000",
  primaryButtonText: "Explore Properties",
  secondaryButtonText: "Contact Agent"
};

const adminAiConfig: AIAdvisorConfig = {
  bannerTitle: "GMM Smart AI Property Advisor",
  bannerSubtitle: "Ask anything about properties, documentation, loans, interiors, or add-ons.",
  systemPrompt:
    "You are the GMM Groups & Services property advisor. Help with properties, loans, interiors, paint works, fencing works, documentation, and WhatsApp contact. Keep responses concise, helpful, and professional.",
  welcomeMessage:
    "Welcome to GMM Groups & Services. I can help with properties, documentation, loans, interiors, and other business add-ons. How can I help you today?",
  suggestedQuestions: [
    "Tell me about the Hyderabad villas",
    "What add-ons can I manage?",
    "Can you help with home loans?",
    "How do I upload property videos?"
  ]
};

const adminNavbarLabels: NavbarLabel[] = [
  { id: "nav-1", label: "Home", path: "/" },
  { id: "nav-2", label: "Services", path: "/services" },
  { id: "nav-3", label: "Add-ons", path: "/business-addons" },
  { id: "nav-4", label: "Properties", path: "/listings" },
  { id: "nav-5", label: "Showcase", path: "/reels" },
  { id: "nav-6", label: "AI Advisor", path: "/ai-advisor" },
  { id: "nav-7", label: "Sovereign Stat", path: "/about" },
  { id: "nav-8", label: "Contact", path: "/contact" }
];

export const createDefaultSiteContent = (): Required<SiteContent> => ({
  properties: PUBLIC_INITIAL_PROPERTIES.map(toAdminProperty),
  services: [...adminServices],
  addons: [...adminAddons],
  reels: [...adminReels],
  featureStats: [...adminFeatureStats],
  testimonials: [...adminTestimonials],
  faqs: [...adminFaqs],
  contactDetails: { ...adminContactDetails },
  heroContent: { ...adminHero },
  aiAdvisorConfig: { ...adminAiConfig },
  navbarLabels: [...adminNavbarLabels],
  activities: [] as RecentActivity[]
});

let siteContent = createDefaultSiteContent();

export const getSiteContent = () => siteContent;

export const setSiteContent = (content: Partial<SiteContent>) => {
  const hasItems = <T,>(value: T[] | undefined | null) => Array.isArray(value) && value.length > 0;

  siteContent = {
    ...siteContent,
    ...content,
    properties: hasItems(content.properties) ? content.properties : siteContent.properties,
    services: hasItems(content.services) ? content.services : siteContent.services,
    addons: hasItems(content.addons) ? content.addons : siteContent.addons,
    reels: hasItems(content.reels) ? content.reels : siteContent.reels,
    featureStats: hasItems(content.featureStats) ? content.featureStats : siteContent.featureStats,
    testimonials: hasItems(content.testimonials) ? content.testimonials : siteContent.testimonials,
    faqs: hasItems(content.faqs) ? content.faqs : siteContent.faqs,
    navbarLabels: hasItems(content.navbarLabels) ? content.navbarLabels : siteContent.navbarLabels,
    activities: hasItems(content.activities) ? content.activities : siteContent.activities,
    contactDetails: content.contactDetails ?? siteContent.contactDetails,
    heroContent: content.heroContent ?? siteContent.heroContent,
    aiAdvisorConfig: content.aiAdvisorConfig ?? siteContent.aiAdvisorConfig
  };

  return siteContent;
};

export const getPublicProperties = (): PublicProperty[] => {
  return siteContent.properties.map((property) => {
    const existing = PUBLIC_INITIAL_PROPERTIES.find(item => item.id === property.id);
    const imageUrls = Array.isArray(property.images) ? property.images.map(image => image.url).filter(Boolean) : [];
    const videoUrls = Array.isArray(property.videos) ? property.videos.map(video => video.url).filter(Boolean) : [];
    const category: PublicProperty["category"] =
      property.type === "Rent" || property.type === "Lease" ? "Rent" : "Buy";
    const typeMap: Record<AdminProperty["category"], PublicProperty["type"]> = {
      Residential: existing?.type ?? "Apartment",
      Commercial: "Commercial",
      Plot: "Plot",
      Villa: "Villa",
      Apartment: "Apartment",
      Warehouse: existing?.type ?? "Commercial"
    };

    return {
      id: property.id,
      title: property.title,
      price: existing?.price ?? `₹${property.price.toLocaleString()}`,
      numericPrice: property.price,
      location: property.location,
      city: property.city,
      state: property.state,
      beds: property.beds,
      baths: property.baths,
      sqft: property.squareFeet,
      type: typeMap[property.category],
      imageUrl: imageUrls[0] || existing?.imageUrl || "",
      imageUrls,
      videoUrl: videoUrls[0] || existing?.videoUrl,
      videoUrls,
      rera: property.reraFlag,
      approvalType: property.approvalType ?? (property.reraFlag ? "RERA" : "None"),
      approvalAuthority: property.approvalAuthority,
      featured: property.featured,
      description: property.description,
      highlights: existing?.highlights ?? [],
      amenities: existing?.amenities ?? [],
      category,
      valuation: existing?.valuation,
      investmentYield: existing?.investmentYield
    };
  });
};

export const isAuthorized = (authorization?: string) =>
  authorization === `Bearer ${ADMIN_SESSION_TOKEN}`;
