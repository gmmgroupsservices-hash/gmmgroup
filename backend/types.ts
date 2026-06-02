export interface PublicProperty {
  id: string;
  title: string;
  price: string;
  numericPrice: number;
  location: string;
  city: string;
  state: string;
  beds: number;
  baths: number;
  sqft: number;
  type: "Villa" | "Apartment" | "Commercial" | "Plot";
  imageUrl: string;
  imageUrls?: string[];
  videoUrl?: string;
  videoUrls?: string[];
  rera: boolean;
  featured: boolean;
  description: string;
  highlights: string[];
  amenities: string[];
  category: "Buy" | "Rent" | "Just Sold";
  valuation?: string;
  investmentYield?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyTitle: string;
  timestamp: string;
  status: "New" | "Contacted" | "Closed";
}

export interface MediaItem {
  id: string;
  url: string;
  isCoverOrPrimary: boolean;
  type: "image" | "video";
  title?: string;
}

export type PropertyType = "Sale" | "Rent" | "Lease";
export type PropertyCategory = "Residential" | "Commercial" | "Plot" | "Villa" | "Apartment" | "Warehouse";

export interface AdminProperty {
  id: string;
  title: string;
  type: PropertyType;
  category: PropertyCategory;
  state: string;
  city: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  squareFeet: number;
  description: string;
  featured: boolean;
  reraFlag: boolean;
  status: "Published" | "Draft";
  images: MediaItem[];
  videos: MediaItem[];
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  priceRange?: string;
  status: "Published" | "Draft";
}

export interface AddOnItem {
  id: string;
  title: string;
  description: string;
  price?: string;
  status: "Published" | "Draft";
}

export interface ShowcaseReel {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  views?: string;
  status: "Published" | "Draft";
}

export interface FeatureStatItem {
  id: string;
  stat: string;
  label: string;
  description: string;
  status: "Published" | "Draft";
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  status: "Published" | "Draft";
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  status: "Published" | "Draft";
}

export interface ContactDetails {
  phone: string;
  whatsappNumber: string;
  whatsappButtonText: string;
  email: string;
  address: string;
  gmapsEmbedUrl: string;
  seoTitle: string;
  seoDescription: string;
  footerText: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

export interface AIAdvisorConfig {
  bannerTitle: string;
  bannerSubtitle: string;
  systemPrompt: string;
  welcomeMessage: string;
  suggestedQuestions: string[];
}

export interface NavbarLabel {
  id: string;
  label: string;
  path: string;
}

export interface RecentActivity {
  id: string;
  type: "property" | "service" | "addon" | "media" | "general" | "seo" | "testimonial" | "faq";
  action: "create" | "update" | "delete" | "publish" | "unpublish";
  details: string;
  timestamp: string;
}

export interface AdminAccount {
  id: string;
  username: string;
  password: string;
  role: "administrator";
}

export interface SiteContent {
  properties?: AdminProperty[];
  services?: ServiceItem[];
  addons?: AddOnItem[];
  reels?: ShowcaseReel[];
  featureStats?: FeatureStatItem[];
  testimonials?: TestimonialItem[];
  faqs?: FAQItem[];
  contactDetails?: ContactDetails;
  heroContent?: HeroContent;
  aiAdvisorConfig?: AIAdvisorConfig;
  navbarLabels?: NavbarLabel[];
  activities?: RecentActivity[];
}
