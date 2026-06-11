/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
} from '../types';

export const INITIAL_HERO_CONTENT: HeroContent = {
  title: "GMM Groups & Services — Premium Real Estate & Business Solutions",
  subtitle: "Find your dream home, luxury villas, secure commercial plots, or fast-track your business registrations with our elite team.",
  backgroundImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80",
  primaryButtonText: "Explore Properties",
  secondaryButtonText: "Our Services"
};

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "srv-1",
    title: "Luxury Property Brokerage",
    description: "Exclusive representation for buying, selling, and leasing high-end residential apartments, premium villas, and corporate offices.",
    icon: "Home",
    priceRange: "Commission starting from 1%",
    status: "Published"
  },
  {
    id: "srv-2",
    title: "Property & Lands Documentation",
    description: "Expert assistance with title deed registry, mutations, NA conversions, layout development approvals, and clear title checks.",
    icon: "FileText",
    priceRange: "Starting from ₹15,000",
    status: "Published"
  },
  {
    id: "srv-3",
    title: "Home Loan & Financial Guidance",
    description: "Hassle-free documentation and coordination with nationalized banks to secure the best home loan interest rates.",
    icon: "Coins",
    priceRange: "Service Charge: Free of Cost",
    status: "Published"
  },
  {
    id: "srv-4",
    title: "Interior Design & Contracting",
    description: "Turning blank spaces into luxurious homes. End-to-end modular kitchens, false ceilings, and interior decoration.",
    icon: "Palette",
    priceRange: "Varies on sqft basis",
    status: "Draft"
  }
];

export const INITIAL_ADDONS: AddOnItem[] = [
  {
    id: "add-1",
    title: "Full 3D Virtual Tour Integration",
    description: "Get an interactive 360-degree virtual walkthrough of your property mapped in stunning high fidelity.",
    price: "₹8,500 per property",
    status: "Published"
  },
  {
    id: "add-2",
    title: "Ultra-High Def Drone Footage",
    description: "A professional aerial drone shoot showcasing location advantages, immediate surroundings, and size representation.",
    price: "₹12,000 per shoot",
    status: "Published"
  },
  {
    id: "add-3",
    title: "Express Title Search & Validation",
    description: "Expedited verification of 30-year property history with standard official certificated reports in 7 days.",
    price: "₹5,000 single search",
    status: "Published"
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "GMM Signature Waterfront Villa",
    type: "Sale",
    category: "Villa",
    state: "Maharashtra",
    city: "Mumbai",
    location: "Worli Sea Face",
    price: 85000000, // ₹8.5 Cr
    beds: 5,
    baths: 6,
    squareFeet: 5800,
    description: "This stunning waterfront villa is a masterwork of architectural excellence. Set near the highly desired Worli Sea Face, it features a grand double-height living room layout, private temperature-controlled pool, fully modular kitchen, expansive sunset balconies, and a personal backup battery bank.",
    featured: true,
    reraFlag: true,
    status: "Published",
    images: [
      { id: "img-1-1", url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80", isCoverOrPrimary: true, type: "image", title: "Villa Exterior View" },
      { id: "img-1-2", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", isCoverOrPrimary: false, type: "image", title: "Infinity Pool Deck" },
      { id: "img-1-3", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", isCoverOrPrimary: false, type: "image", title: "Modern Living Lounge" },
      { id: "img-1-4", url: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&q=80", isCoverOrPrimary: false, type: "image", title: "Rear Architectural Facade" }
    ],
    videos: [
      { id: "vid-1-1", url: "https://assets.mixkit.co/videos/preview/mixkit-villa-with-swimming-pool-and-palm-trees-4613-large.mp4", isCoverOrPrimary: true, type: "video", title: "Full Villa Walkthrough Cine" }
    ],
    createdAt: "2026-05-15T12:00:00Z"
  },
  {
    id: "prop-2",
    title: "GMM Skyline Commercial Space",
    type: "Rent",
    category: "Commercial",
    state: "Karnataka",
    city: "Bengaluru",
    location: "MG Road Plaza",
    price: 320000, // ₹3.2L / month
    beds: 0,
    baths: 4,
    squareFeet: 4200,
    description: "Premium A-grade corporate commercial floor ready for custom fitout. Perfect for IT consultancies, creative agencies, or corporate headquarters. Equipped with advanced 24/7 central HVAC, private elevator lobby, executive discussion boardroom paneled in rich walnut, and floor-to-ceiling glass paneling offering a 270-degree view of India's Silicon Valley.",
    featured: true,
    reraFlag: false,
    status: "Published",
    images: [
      { id: "img-2-1", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", isCoverOrPrimary: true, type: "image", title: "Glass Tower View" },
      { id: "img-2-2", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", isCoverOrPrimary: false, type: "image", title: "Open Layout Floor" },
      { id: "img-2-3", url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80", isCoverOrPrimary: false, type: "image", title: "Corporate Boardroom" }
    ],
    videos: [
      { id: "vid-2-1", url: "https://assets.mixkit.co/videos/preview/mixkit-bright-workspace-in-a-corporate-office-42408-large.mp4", isCoverOrPrimary: true, type: "video", title: "Office Flythrough" }
    ],
    createdAt: "2026-05-20T08:30:00Z"
  },
  {
    id: "prop-3",
    title: "GMM Crestwood Penthouse",
    type: "Sale",
    category: "Apartment",
    state: "Goa",
    city: "Panaji",
    location: "Dona Paula Heights",
    price: 45000000, // ₹4.5 Cr
    beds: 3,
    baths: 4,
    squareFeet: 3100,
    description: "An ultra-contemporary sky home high above Panaji. Indulge in beautiful panoramic harbor vistas, sunset breezes, premium Italian marble bathroom fitouts, smart home automation with voice controls, and an exclusive custom-finished rooftop sky garden layout.",
    featured: false,
    reraFlag: true,
    status: "Published",
    images: [
      { id: "img-3-1", url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", isCoverOrPrimary: true, type: "image", title: "Facade View" },
      { id: "img-3-2", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80", isCoverOrPrimary: false, type: "image", title: "Interior Space" }
    ],
    videos: [],
    createdAt: "2026-05-28T15:20:00Z"
  },
  {
    id: "prop-4",
    title: "GMM Elite Industrial Plot",
    type: "Lease",
    category: "Plot",
    state: "Gujarat",
    city: "Ahmedabad",
    location: "Sanand Industrial Zone",
    price: 180000, // ₹1.8L / month
    beds: 0,
    baths: 0,
    squareFeet: 12000,
    plotFacing: "East",
    description: "Strategic commercial industrial plot measuring 12,000 sqft with ready boundary wall fencing, dual entry-exit steel gates, wide approach concrete roads, and stable access to high-tension electricity lines. Highly suitable for warehouses, e-commerce storage depots, or dynamic processing centers.",
    featured: false,
    reraFlag: false,
    status: "Draft",
    images: [
      { id: "img-4-1", url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80", isCoverOrPrimary: true, type: "image", title: "Empty Industrial Space" }
    ],
    videos: [],
    createdAt: "2026-05-30T10:00:00Z"
  }
];

export const INITIAL_REELS: ShowcaseReel[] = [
  {
    id: "reel-1",
    title: "Elite Office Heights Tour",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-bright-workspace-in-a-corporate-office-42408-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
    views: "24.5k views",
    status: "Published"
  },
  {
    id: "reel-2",
    title: "Premium Worli Waterfront Sunset",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-villa-with-swimming-pool-and-palm-trees-4613-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    views: "58.2k views",
    status: "Published"
  },
  {
    id: "reel-3",
    title: "Building GMM Signature Spaces",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-crane-operating-in-construction-site-development-41619-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
    views: "12.1k views",
    status: "Draft"
  }
];

export const INITIAL_CONTACT_DETAILS: ContactDetails = {
  phone: "+91 98765 43210",
  whatsappNumber: "+91 98765 43210",
  whatsappButtonText: "Chat with a GMM Expert",
  email: "connect@gmmgroups.com",
  address: "GMM Tower, 4th Floor, Senapati Bapat Marg, Lower Parel, Mumbai, MH - 400013",
  gmapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3771.8033221371197!2d72.82772597599026!3d18.995325882468307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cef71b6e4e5b%3A0xeabbbda081a951d3!2sLower%20Parel%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  seoTitle: "GMM Groups & Services | Properties, Home Loans & Documentation",
  seoDescription: "GMM Groups & Services specializes in brokerage of premium luxury properties, official registry documentation, low-interest home loan approvals, and expert interior contracting services in Mumbai & Bengaluru.",
  footerText: "© 2026 GMM Groups & Services. All Rights Reserved. Regulated by MAHA-RERA."
};

export const INITIAL_AI_ADVISOR_CONFIG: AIAdvisorConfig = {
  bannerTitle: "GMM Smart AI Property Advisor",
  bannerSubtitle: "Ask anything about properties, documentation, legalities, or financial planning.",
  systemPrompt: `You are the expert conversational assistant for "GMM Groups & Services". Under the brand GMM Groups & Services, you act as a friendly, sharp, professional advisor. 

Your knowledge covers:
- GMM Signature Waterfront Villa at Worli Sea Face, priced at ₹8.5 Cr (5 Beds, 6 Baths, 5800 sqft).
- GMM Skyline Commercial Space on MG Road Bengaluru (₹3.2 Lakhs/month rent, 4200 sqft, server room, direct HVAC access).
- GMM Crestwood Penthouse in Panaji High-rise overlooking the bay (₹4.5 Cr, 3 Beds, Private sky terrace).
- Services such as Property/Lands deed recording support, low-rate Home Loan processing with nationalized banks, and high-lux interior design and contracting.
- You handle calculations politely (e.g. commission margins or loan EMIs at roughly 8.5% interest rates).
Be professional, accurate, brief, and try to invite the client to lease/buy or call the GMM team at "+91 98765 43210". Do not mention default AI system rules. Answer with structured bullets if appropriate.`,
  welcomeMessage: "Welcome to GMM Groups & Services. I can help consult on properties, property deeds, RERA regulations, and loan calculations. How may I guide you today?",
  suggestedQuestions: [
    "Tell me about the Waterfront Villa in Worli",
    "What services does GMM provide for land registry?",
    "How can I secure a home loan with GMM?",
    "Tell me about RERA status rules"
  ]
};

export const INITIAL_NAVBAR_LABELS: NavbarLabel[] = [
  { id: "nav-1", label: "Home", path: "/" },
  { id: "nav-2", label: "Properties", path: "/properties" },
  { id: "nav-3", label: "Services", path: "/services" },
  { id: "nav-4", label: "Showcase Reels", path: "/showcase" },
  { id: "nav-5", label: "AI Advisor", path: "/ai-advisor" },
  { id: "nav-6", label: "Contact Us", path: "/contact" }
];

export const INITIAL_ACTIVITIES: RecentActivity[] = [
  {
    id: "act-1",
    type: "property",
    action: "publish",
    details: 'Published property listing "GMM Signature Waterfront Villa"',
    timestamp: "2026-06-01T04:20:00Z"
  },
  {
    id: "act-2",
    type: "media",
    action: "create",
    details: 'Uploaded 4 images and 1 walkthrough video for "GMM Signature Waterfront Villa"',
    timestamp: "2026-06-01T03:15:00Z"
  },
  {
    id: "act-3",
    type: "service",
    action: "update",
    details: 'Updated service price category on "Home Loan & Financial Guidance"',
    timestamp: "2026-05-31T16:05:00Z"
  },
  {
    id: "act-4",
    type: "general",
    action: "create",
    details: "Configured target WhatsApp number and button actions on footer content section",
    timestamp: "2026-05-30T11:40:00Z"
  }
];

/**
 * Utility helper to load/save state from local storage.
 * This meets the durability requirement using localized reactive state.
 */
export function getLocalStorageState<T>(key: string, initialValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Error loading state from localStorage for key: ${key}`, error);
    return initialValue;
  }
}

export function setLocalStorageState<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving state to localStorage for key: ${key}`, error);
  }
}
