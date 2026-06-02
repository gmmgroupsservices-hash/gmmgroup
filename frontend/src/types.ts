export interface Property {
  id: string;
  title: string;
  price: string; // formatted price, e.g. "₹4.5 Crore" or "₹1.2 Lakh/mo"
  numericPrice: number; // in INR for filtering/sorting
  location: string;
  city: string;
  state: "AP" | "Telangana" | "Karnataka" | string;
  beds: number;
  baths: number;
  sqft: number;
  type: "Villa" | "Apartment" | "Commercial" | "Plot";
  imageUrl: string;
  imageUrls?: string[];
  videoUrl?: string; // high-quality visual snippet url
  videoUrls?: string[];
  rera: boolean;
  featured: boolean;
  description: string;
  highlights: string[];
  amenities: string[];
  category: "Buy" | "Rent" | "Just Sold";
  valuation?: string; // Estimated home value for valuation tab
  investmentYield?: string; // For premium SaaS vibe
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

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  suggestedProperties?: Property[]; // Optional properties appended by AI recommendation
}

export interface DashboardStats {
  totalLeads: number;
  activeListings: number;
  totalViews: number;
  conversionRate: number; // e.g. 4.2%
}

export interface ServiceItem {
  id?: string;
  title: string;
  description: string;
  icon: string;
  priceRange?: string;
  status?: "Published" | "Draft";
}

export interface AddOnItem {
  id?: string;
  title: string;
  description: string;
  price?: string;
  cta?: string;
  status?: "Published" | "Draft";
}

export interface ShowcaseReel {
  id?: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  views?: string;
  status?: "Published" | "Draft";
}

export interface FeatureStatItem {
  id?: string;
  stat: string;
  label: string;
  description: string;
  status?: "Published" | "Draft";
}

export interface TestimonialItem {
  id?: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  status?: "Published" | "Draft";
}

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  status?: "Published" | "Draft";
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

export interface NavbarLabel {
  id?: string;
  label: string;
  path?: string;
}

export interface SiteContent {
  properties?: Property[];
  services?: ServiceItem[];
  addons?: AddOnItem[];
  reels?: ShowcaseReel[];
  featureStats?: FeatureStatItem[];
  testimonials?: TestimonialItem[];
  faqs?: FAQItem[];
  contactDetails?: ContactDetails;
  heroContent?: HeroContent;
  navbarLabels?: NavbarLabel[];
}
