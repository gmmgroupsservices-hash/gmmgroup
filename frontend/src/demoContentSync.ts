import { INITIAL_PROPERTIES } from "./data";
import type {
  AddOnItem,
  ContactDetails,
  FAQItem,
  FeatureStatItem,
  HeroContent,
  NavbarLabel,
  Property,
  ServiceItem,
  ShowcaseReel,
  TestimonialItem
} from "./types";

export const DEMO_CONTENT_STORAGE_KEY = "gmm_demo_site_content";
export const DEMO_CONTENT_MESSAGE_TYPE = "GMM_DEMO_CONTENT_SYNC";
export const DEMO_PREVIEW_READY_MESSAGE_TYPE = "GMM_DEMO_PREVIEW_READY";
export const DEMO_PREVIEW_SESSION_KEY = "gmm_demo_preview_enabled";

type AdminPropertyType = "Sale" | "Rent" | "Lease";
type AdminPropertyCategory = "Residential" | "Commercial" | "Plot" | "Villa" | "Apartment" | "Warehouse";

interface AdminMediaItem {
  id: string;
  url: string;
  isCoverOrPrimary?: boolean;
  type?: "image" | "video";
  title?: string;
}

interface AdminProperty {
  id: string;
  title: string;
  type: AdminPropertyType;
  category: AdminPropertyCategory;
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
  approvalType?: "RERA" | "CREDAI" | "Local Approval" | "None";
  approvalAuthority?: string;
  status?: "Published" | "Draft";
  images?: AdminMediaItem[];
  videos?: AdminMediaItem[];
}

export interface DemoSiteContent {
  properties?: Array<Property | AdminProperty>;
  services?: ServiceItem[];
  addons?: AddOnItem[];
  reels?: ShowcaseReel[];
  featureStats?: FeatureStatItem[];
  testimonials?: TestimonialItem[];
  faqs?: FAQItem[];
  contactDetails?: ContactDetails;
  heroContent?: HeroContent;
  navbarLabels?: NavbarLabel[];
  aiAdvisorConfig?: unknown;
  activities?: unknown[];
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80";

const isAdminProperty = (property: Property | AdminProperty): property is AdminProperty => {
  return "squareFeet" in property || "reraFlag" in property;
};

const formatPublicPrice = (price: number, type: AdminPropertyType) => {
  if (!Number.isFinite(price)) return "Rs 0";
  const suffix = type === "Rent" || type === "Lease" ? "/mo" : "";
  if (price >= 10000000) {
    const value = price / 10000000;
    return `Rs ${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2)} Crore${suffix}`;
  }
  if (price >= 100000) {
    const value = price / 100000;
    return `Rs ${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2)} Lakh${suffix}`;
  }
  return `Rs ${price.toLocaleString()}${suffix}`;
};

export const mapContentPropertiesToPublic = (properties: Array<Property | AdminProperty> | undefined): Property[] | null => {
  if (!Array.isArray(properties)) return null;

  return properties
    .filter((property) => property && (!("status" in property) || property.status !== "Draft"))
    .map((property) => {
      if (!isAdminProperty(property)) return property;

      const existing = INITIAL_PROPERTIES.find((item) => item.id === property.id);
      const imageUrls = Array.isArray(property.images)
        ? property.images.map((item) => item.url).filter(Boolean)
        : [];
      const videoUrls = Array.isArray(property.videos)
        ? property.videos.map((item) => item.url).filter(Boolean)
        : [];
      const typeMap: Record<AdminPropertyCategory, Property["type"]> = {
        Residential: existing?.type ?? "Apartment",
        Commercial: "Commercial",
        Plot: "Plot",
        Villa: "Villa",
        Apartment: "Apartment",
        Warehouse: existing?.type ?? "Commercial"
      };
      const listingCategory: Property["category"] =
        existing?.category === "Just Sold"
          ? "Just Sold"
          : property.type === "Rent" || property.type === "Lease"
            ? "Rent"
            : "Buy";

      return {
        id: property.id,
        title: property.title,
        price: existing?.price ?? formatPublicPrice(Number(property.price), property.type),
        numericPrice: Number(property.price) || existing?.numericPrice || 0,
        location: property.location,
        city: property.city,
        state: property.state,
        beds: Number(property.beds) || 0,
        baths: Number(property.baths) || 0,
        sqft: Number(property.squareFeet) || existing?.sqft || 0,
        type: typeMap[property.category] ?? existing?.type ?? "Apartment",
        imageUrl: imageUrls[0] || existing?.imageUrl || FALLBACK_IMAGE,
        imageUrls,
        videoUrl: videoUrls[0] || existing?.videoUrl,
        videoUrls,
        rera: Boolean(property.reraFlag),
        approvalType: property.approvalType ?? (property.reraFlag ? "RERA" : "None"),
        approvalAuthority: property.approvalAuthority,
        featured: Boolean(property.featured),
        description: property.description || existing?.description || "",
        highlights: existing?.highlights ?? [],
        amenities: existing?.amenities ?? [],
        category: listingCategory,
        valuation: existing?.valuation,
        investmentYield: existing?.investmentYield
      };
    });
};

export const readDemoContent = (): DemoSiteContent | null => {
  try {
    const raw = window.localStorage.getItem(DEMO_CONTENT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoSiteContent) : null;
  } catch {
    return null;
  }
};

export const writeDemoContent = (content: DemoSiteContent) => {
  window.localStorage.setItem(DEMO_CONTENT_STORAGE_KEY, JSON.stringify(content));
};

export const isPublished = <T extends { status?: string }>(item: T) => item.status !== "Draft";
