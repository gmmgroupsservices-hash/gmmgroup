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
