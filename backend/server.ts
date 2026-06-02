import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";
import { config as loadEnv } from "dotenv";
import {
  INITIAL_PROPERTIES as PUBLIC_INITIAL_PROPERTIES,
  SERVICES as PUBLIC_SERVICES,
  REELS as PUBLIC_REELS,
  FEATURES_GRID as PUBLIC_FEATURES_GRID,
  TESTIMONIALS as PUBLIC_TESTIMONIALS,
  FAQS as PUBLIC_FAQS
} from "./data";
import type {
  PublicProperty,
  Lead,
  AdminProperty,
  ServiceItem as AdminServiceItem,
  AddOnItem as AdminAddOnItem,
  ShowcaseReel as AdminShowcaseReel,
  FeatureStatItem as AdminFeatureStatItem,
  TestimonialItem as AdminTestimonialItem,
  FAQItem as AdminFAQItem,
  ContactDetails as AdminContactDetails,
  HeroContent as AdminHeroContent,
  AIAdvisorConfig as AdminAIAdvisorConfig,
  NavbarLabel as AdminNavbarLabel,
  RecentActivity as AdminRecentActivity,
  SiteContent as AdminSiteContent,
  AdminAccount
} from "./types";

const cwd = process.cwd();
const runningFromBackendFolder = path.basename(cwd) === "backend";
const backendDir = runningFromBackendFolder ? cwd : path.resolve(cwd, "backend");
const repoRoot = runningFromBackendFolder ? path.resolve(cwd, "..") : cwd;

loadEnv({ path: path.resolve(backendDir, ".env") });
loadEnv({ path: path.resolve(repoRoot, ".env") });

const ADMIN_SESSION_TOKEN = "gmm-admin-session";
let adminAccounts: AdminAccount[] = [
  {
    id: "admin-1",
    username: "gmmadmin",
    password: "gmmadmin123",
    role: "administrator"
  }
];

const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_URL ||
  (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
);

if (cloudinaryConfigured) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({ secure: true });
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
  }
}

// Seed server-side state in memory so CRUD persists during dev-session
const toAdminProperty = (property: PublicProperty): AdminProperty => {
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

const formatPublicPrice = (price: number, type: AdminProperty["type"]) => {
  if (!Number.isFinite(price)) return "₹0";
  const suffix = type === "Rent" || type === "Lease" ? "/mo" : "";
  if (price >= 10000000) {
    const value = price / 10000000;
    const formatted = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);
    return `₹${formatted} Crore${suffix}`;
  }
  if (price >= 100000) {
    const value = price / 100000;
    const formatted = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);
    return `₹${formatted} Lakh${suffix}`;
  }
  return `₹${price.toLocaleString()}${suffix}`;
};

const toPublicProperty = (property: AdminProperty): PublicProperty => {
  const existing = properties.find(item => item.id === property.id);
  const imageUrls = Array.isArray(property.images) ? property.images.map(image => image.url).filter(Boolean) : [];
  const videoUrls = Array.isArray(property.videos) ? property.videos.map(video => video.url).filter(Boolean) : [];
  const adminTypeMap: Record<AdminProperty["category"], PublicProperty["type"]> = {
    Residential: existing?.type ?? "Apartment",
    Commercial: "Commercial",
    Plot: "Plot",
    Villa: "Villa",
    Apartment: "Apartment",
    Warehouse: existing?.type ?? "Commercial"
  };
  const category: PublicProperty["category"] =
    property.type === "Rent" ? "Rent" : property.type === "Lease" ? "Rent" : "Buy";

  return {
    id: property.id,
    title: property.title,
    price: existing?.price ?? formatPublicPrice(property.price, property.type),
    numericPrice: property.price,
    location: property.location,
    city: property.city,
    state: property.state,
    beds: property.beds,
    baths: property.baths,
    sqft: property.squareFeet,
    type: adminTypeMap[property.category],
    imageUrl: imageUrls[0] || existing?.imageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    imageUrls,
    videoUrl: videoUrls[0] || existing?.videoUrl,
    videoUrls,
    rera: property.reraFlag,
    featured: property.featured,
    description: property.description || existing?.description || "",
    highlights: existing?.highlights ?? [],
    amenities: existing?.amenities ?? [],
    category,
    valuation: existing?.valuation,
    investmentYield: existing?.investmentYield
  };
};

const ADMIN_SERVICES: AdminServiceItem[] = PUBLIC_SERVICES.map((service, index) => ({
  id: `srv-${index + 1}`,
  title: service.title,
  description: service.description,
  icon: service.icon,
  priceRange: "",
  status: "Published"
}));

const ADMIN_ADDONS: AdminAddOnItem[] = [
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

const ADMIN_REELS: AdminShowcaseReel[] = PUBLIC_REELS.map((reel, index) => ({
  id: `reel-${index + 1}`,
  title: reel.title,
  videoUrl: reel.videoUrl,
  thumbnailUrl: "",
  views: reel.duration,
  status: "Published"
}));

const ADMIN_FEATURE_STATS: AdminFeatureStatItem[] = PUBLIC_FEATURES_GRID.map((feature, index) => ({
  id: `stat-${index + 1}`,
  stat: feature.stat,
  label: feature.label,
  description: feature.description,
  status: "Published"
}));

const ADMIN_TESTIMONIALS: AdminTestimonialItem[] = PUBLIC_TESTIMONIALS.map((testimonial, index) => ({
  id: `testi-${index + 1}`,
  name: testimonial.name,
  role: testimonial.role,
  quote: testimonial.quote,
  avatar: testimonial.avatar,
  status: "Published"
}));

const ADMIN_FAQS: AdminFAQItem[] = PUBLIC_FAQS.map((faq, index) => ({
  id: `faq-${index + 1}`,
  question: faq.question,
  answer: faq.answer,
  status: "Published"
}));

const ADMIN_CONTACT_DETAILS: AdminContactDetails = {
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

const ADMIN_HERO: AdminHeroContent = {
  title: "Find Your Dream Property",
  subtitle:
    "The ultimate single-destination premium portal for certified lands, architectural villas, and institutional offices across Karnataka, Telangana, and Andhra Pradesh.",
  backgroundImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000",
  primaryButtonText: "Explore Properties",
  secondaryButtonText: "Contact Agent"
};

const ADMIN_AI_CONFIG: AdminAIAdvisorConfig = {
  bannerTitle: "GMM Smart AI Property Advisor",
  bannerSubtitle: "Ask anything about properties, documentation, loans, interiors, or add-ons.",
  systemPrompt:
    'You are the GMM Groups & Services property advisor. Help with properties, loans, interiors, paint works, fencing works, documentation, and WhatsApp contact. Keep responses concise, helpful, and professional.',
  welcomeMessage:
    "Welcome to GMM Groups & Services. I can help with properties, documentation, loans, interiors, and other business add-ons. How can I help you today?",
  suggestedQuestions: [
    "Tell me about the Hyderabad villas",
    "What add-ons can I manage?",
    "Can you help with home loans?",
    "How do I upload property videos?"
  ]
};

const ADMIN_NAVBAR_LABELS: AdminNavbarLabel[] = [
  { id: "nav-1", label: "Home", path: "/" },
  { id: "nav-2", label: "Services", path: "/services" },
  { id: "nav-3", label: "Add-ons", path: "/business-addons" },
  { id: "nav-4", label: "Properties", path: "/listings" },
  { id: "nav-5", label: "Showcase", path: "/reels" },
  { id: "nav-6", label: "AI Advisor", path: "/ai-advisor" },
  { id: "nav-7", label: "Sovereign Stat", path: "/about" },
  { id: "nav-8", label: "Contact", path: "/contact" }
];

const ADMIN_ACTIVITIES: AdminRecentActivity[] = [];

let properties: PublicProperty[] = [...PUBLIC_INITIAL_PROPERTIES];
let leads: Lead[] = [
  {
    id: "lead-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@techcorp.com",
    phone: "+91 98860 12345",
    message: "Interested in the Aura Horizon Penthouse in Whitefield. Want to schedule a virtual video tour this weekend.",
    propertyTitle: "Aura Horizon Penthouse",
    timestamp: new Date(Date.now() - 4 * 3600000).toLocaleString(),
    status: "New"
  },
  {
    id: "lead-2",
    name: "Sanjana Reddy",
    email: "sanjana.reddy@investments.in",
    phone: "+91 99000 54321",
    message: "Requested pre-approval valuation and land registration verification details for GMM Lumina Sky Mansion.",
    propertyTitle: "GMM Lumina Sky Mansion",
    timestamp: new Date(Date.now() - 12 * 3600000).toLocaleString(),
    status: "Contacted"
  }
];

const createDefaultAdminSiteContent = (): AdminSiteContent => ({
  properties: PUBLIC_INITIAL_PROPERTIES.map(toAdminProperty),
  services: [...ADMIN_SERVICES],
  addons: [...ADMIN_ADDONS],
  reels: [...ADMIN_REELS],
  featureStats: [...ADMIN_FEATURE_STATS],
  testimonials: [...ADMIN_TESTIMONIALS],
  faqs: [...ADMIN_FAQS],
  contactDetails: { ...ADMIN_CONTACT_DETAILS },
  heroContent: { ...ADMIN_HERO },
  aiAdvisorConfig: { ...ADMIN_AI_CONFIG },
  navbarLabels: [...ADMIN_NAVBAR_LABELS],
  activities: [...ADMIN_ACTIVITIES]
});

const isBlankAdminSiteContent = (content: AdminSiteContent) =>
  content.properties.length === 0 &&
  content.services.length === 0 &&
  content.addons.length === 0 &&
  content.reels.length === 0 &&
  content.featureStats.length === 0 &&
  content.testimonials.length === 0 &&
  content.faqs.length === 0 &&
  !content.heroContent.title &&
  !content.contactDetails.email &&
  !content.aiAdvisorConfig.bannerTitle &&
  content.navbarLabels.length === 0;

let siteContent: AdminSiteContent = createDefaultAdminSiteContent();

const app = express();
const allowedOriginPatterns = [
  /^https?:\/\/localhost(?::\d+)?$/i,
  /^https?:\/\/127\.0\.0\.1(?::\d+)?$/i,
  /^https:\/\/.*\.vercel\.app$/i
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (typeof origin === "string" && allowedOriginPatterns.some(pattern => pattern.test(origin))) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json({ limit: "100mb" }));

const PORT = Number(process.env.BACKEND_PORT) || 3000;

const getBearerToken = (req: express.Request) => {
  const header = req.headers.authorization || "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match?.[1] || "";
};

const requireAdminSession = (req: express.Request, res: express.Response) => {
  const token = getBearerToken(req);
  if (token !== ADMIN_SESSION_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
};

// Lazy initialize Gemini API client to prevent startup failure if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
      console.warn("GEMINI_API_KEY environment variable is not configured. Falling back to rule-based smart concierge model.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'gmm-groups-app',
        }
      }
    });
  }
  return aiClient;
}

// REST API - Properties
app.get("/api/properties", (req, res) => {
  res.json(properties);
});

app.post("/api/properties", (req, res) => {
  const newPropObject = req.body as PublicProperty;
  if (!newPropObject.id) {
    newPropObject.id = `prop-${Date.now()}`;
  }
  properties.unshift(newPropObject);
  res.status(201).json(newPropObject);
});

app.put("/api/properties/:id", (req, res) => {
  const { id } = req.params;
  const index = properties.findIndex(p => p.id === id);
  if (index !== -1) {
    properties[index] = { ...properties[index], ...req.body };
    res.json(properties[index]);
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

app.delete("/api/properties/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = properties.length;
  properties = properties.filter(p => p.id !== id);
  if (properties.length < initialLength) {
    res.json({ success: true, id });
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

app.get("/api/admin/site-content", (req, res) => {
  if (!requireAdminSession(req, res)) return;
  if (isBlankAdminSiteContent(siteContent)) {
    siteContent = createDefaultAdminSiteContent();
  }
  res.json(siteContent);
});

app.get("/api/admin/accounts", (req, res) => {
  if (!requireAdminSession(req, res)) return;
  res.json(
    adminAccounts.map(account => ({
      id: account.id,
      username: account.username,
      role: account.role
    }))
  );
});

app.put("/api/admin/accounts", (req, res) => {
  if (!requireAdminSession(req, res)) return;
  const accounts = Array.isArray(req.body?.accounts) ? req.body.accounts : [];

  const normalizedAccounts = accounts
    .filter((account: any) => typeof account?.username === "string" && typeof account?.password === "string")
    .map((account: any, index: number): AdminAccount => ({
      id: typeof account?.id === "string" && account.id ? account.id : `admin-${Date.now()}-${index}`,
      username: account.username.trim(),
      password: account.password,
      role: "administrator"
    }))
    .filter(account => account.username.length > 0 && account.password.length > 0);

  if (normalizedAccounts.length === 0) {
    return res.status(400).json({ error: "At least one admin account is required" });
  }

  adminAccounts = normalizedAccounts;
  res.json({
    accounts: adminAccounts.map(account => ({
      id: account.id,
      username: account.username,
      role: account.role
    }))
  });
});

app.put("/api/admin/site-content", (req, res) => {
  if (!requireAdminSession(req, res)) return;
  siteContent = {
    ...siteContent,
    ...req.body,
    properties: Array.isArray(req.body.properties) ? req.body.properties : siteContent.properties,
    services: Array.isArray(req.body.services) ? req.body.services : siteContent.services,
    addons: Array.isArray(req.body.addons) ? req.body.addons : siteContent.addons,
    reels: Array.isArray(req.body.reels) ? req.body.reels : siteContent.reels,
    featureStats: Array.isArray(req.body.featureStats) ? req.body.featureStats : siteContent.featureStats,
    testimonials: Array.isArray(req.body.testimonials) ? req.body.testimonials : siteContent.testimonials,
    faqs: Array.isArray(req.body.faqs) ? req.body.faqs : siteContent.faqs,
    navbarLabels: Array.isArray(req.body.navbarLabels) ? req.body.navbarLabels : siteContent.navbarLabels,
    activities: Array.isArray(req.body.activities) ? req.body.activities : siteContent.activities,
    contactDetails: req.body.contactDetails ?? siteContent.contactDetails,
    heroContent: req.body.heroContent ?? siteContent.heroContent,
    aiAdvisorConfig: req.body.aiAdvisorConfig ?? siteContent.aiAdvisorConfig
  };
  if (Array.isArray(siteContent.properties)) {
    properties = siteContent.properties.map(toPublicProperty);
  }
  res.json(siteContent);
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body ?? {};

  const matchedAccount = adminAccounts.find(account => account.username === username && account.password === password);
  if (!matchedAccount) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    token: ADMIN_SESSION_TOKEN,
    user: {
      id: matchedAccount.id,
      username: matchedAccount.username,
      role: matchedAccount.role
    }
  });
});

app.get("/api/site-content", (req, res) => {
  res.json(siteContent);
});

app.post("/api/media/upload", async (req, res) => {
  try {
    if (!requireAdminSession(req, res)) return;

    const { fileData, fileName, folder, mediaType } = req.body ?? {};

    if (!fileData || typeof fileData !== "string") {
      return res.status(400).json({ error: "fileData is required" });
    }

    if (!cloudinaryConfigured) {
      return res.status(500).json({
        error: "Cloudinary is not configured on the backend",
        hint: "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your backend environment."
      });
    }

    const resourceType = mediaType === "video" ? "video" : "image";
    const safeFolder = typeof folder === "string" && folder.trim() ? folder.trim() : "gmm";
    const publicId = typeof fileName === "string" && fileName.trim()
      ? path.parse(fileName.trim()).name.replace(/\s+/g, "-").toLowerCase()
      : `${resourceType}-${Date.now()}`;

    const uploadResult = await cloudinary.uploader.upload(fileData, {
      folder: safeFolder,
      public_id: publicId,
      resource_type: resourceType,
      overwrite: false,
      unique_filename: true
    });

    res.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type,
      bytes: uploadResult.bytes,
      format: uploadResult.format,
      originalFilename: uploadResult.original_filename
    });
  } catch (error: any) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).json({
      error: "Cloudinary upload failed",
      details: error?.message || "Unknown upload error"
    });
  }
});

// REST API - Leads
app.get("/api/leads", (req, res) => {
  res.json(leads);
});

app.post("/api/leads", (req, res) => {
  const { name, email, phone, message, propertyTitle } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    name,
    email,
    phone: phone || "+91 Contact Pending",
    message: message || "Requested a callback for luxury listings.",
    propertyTitle: propertyTitle || "General Brokerage Client",
    timestamp: new Date().toLocaleString(),
    status: "New"
  };
  leads.unshift(newLead);
  res.status(201).json(newLead);
});

// AI Chatbot with property grounding and context
app.post("/api/chat", async (req, res) => {
  const { messages, userProfile } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid dynamic message payload" });
  }

  const latestMessage = messages[messages.length - 1]?.text || "Hello";

  // Check if we have standard Gemini client
  const ai = getGeminiClient();
  if (!ai) {
    // Elegant simulation fallback for zero API key configured
    // This allows testing the AI Advisor gracefully in any mock/preview deployment!
    setTimeout(() => {
      let matchedProps: PublicProperty[] = [];
      const textLower = latestMessage.toLowerCase();
      
      // Look for custom matches in active inventory
      if (textLower.includes("bangalore") || textLower.includes("karnataka")) {
        matchedProps = properties.filter(p => p.state === "Karnataka" || p.city.toLowerCase().includes("bangalore"));
      } else if (textLower.includes("hyderabad") || textLower.includes("telangana") || textLower.includes("jubilee") || textLower.includes("gachibowli")) {
        matchedProps = properties.filter(p => p.state === "Telangana" || p.city.toLowerCase().includes("hyderabad"));
      } else if (textLower.includes("vizag") || textLower.includes("ap") || textLower.includes("andhra") || textLower.includes("plot")) {
        matchedProps = properties.filter(p => p.state === "AP" || p.type === "Plot");
      } else if (textLower.includes("villa") || textLower.includes("luxury house")) {
        matchedProps = properties.filter(p => p.type === "Villa");
      } else if (textLower.includes("commercial") || textLower.includes("office") || textLower.includes("hq")) {
        matchedProps = properties.filter(p => p.type === "Commercial");
      }

      let answer = `Greetings! I am GMM's Property Advisor. Based on your prompt, here are our executive insights.
      
We represent the most exceptional properties across India. ${matchedProps.length > 0 ? `I highly recommend looking at **${matchedProps[0].title}** located in *${matchedProps[0].location}* with an asking of *${matchedProps[0].price}*.` : "Our portfolio includes pristine villas in Jubilee Hills & Indiranagar, premium beachfront developmental lands in Vizag, and obsidian technical commercial hubs in Gachibowli."}

*Note: For absolute precision, please note that the live Gemini API key is not currently declared in your secrets panel. You can easily add ` + "`GEMINI_API_KEY`" + ` in your **Settings > Secrets** workspace to unlock full cognitive reasoning capabilities and dynamic grounding.*`;

      res.json({
        id: `msg-${Date.now()}`,
        role: "model",
        text: answer,
        timestamp: new Date().toLocaleTimeString(),
        suggestedProperties: matchedProps.slice(0, 2)
      });
    }, 1000);
    return;
  }

  try {
    // Format property catalog to insert as contextual grounding inside the system prompt
    const inventoryContext = properties.map((p, i) => `${i+1}. [${p.id}] ${p.title} - ${p.price}, located at ${p.location} (${p.city}, ${p.state}). Type: ${p.type}. Specs: ${p.beds} BHK baths: ${p.baths}. Area: ${p.sqft} sqft. Features: ${p.highlights.join(", ")}. Amenities: ${p.amenities.join(", ")}. RERA: ${p.rera ? "Yes" : "No"}. Category: ${p.category}. Description: ${p.description}`).join("\n\n");

    const systemInstruction = `You are "GMM Property Advisor", an elite, senior real estate investment advisor representing GMM Groups & Services (India). 
You cater to ultra-high-net-worth investors, family offices, tech founders, and premium home-buyers.
Your tone is highly professional, sophisticated, and analytical. You speak with extreme market competence.
You strictly answer queries based on our active GMM portfolio listed below.

Here is GMM's Active Premium Catalog:
${inventoryContext}

Rules:
1. Always recommend real properties from the active GMM catalog above when the customer expresses interest in buying, renting, plots, villas or commercial office spaces in India (Bangalore, Hyderabad, Andhra Pradesh).
2. Highlight specific metrics like location prominence (Whitefield tech corridors, Jubilee Hills hilltops), RERA safety stamps, and projected architectural assets.
3. Keep answers high-end, sophisticated, concise and formatting elegant using clean markdown with bold points.
4. If the user asks general questions about Indian real estate, answer them using your knowledge but anchor them back to our stellar GMM advisory practices.`;

    // Construct history for generateContent
    const queryResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: "user", parts: [{ text: `Hello, what properties do you have?` }] },
        { role: "model", parts: [{ text: `Welcome to GMM Groups & Services. I am your Property Advisor. We manage an ultra-premium portfolio of RERA-cleared luxury villas, architectural penthouses, beachfront plots, and commercial headquarters in Bangalore, Hyderabad, and Andhra Pradesh. How may I assist your structural investment goals today?` }] },
        ...messages.map((m: any) => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const botAnswerText = queryResponse.text || "I apologize, custom network constraints prevented a response. How can I guide you regarding our Jubilee Hills or Whitefield assets?";

    // Post-process the response to find which properties from our list we should recommend as structured floating visual cards
    let suggestedProperties: PublicProperty[] = [];
    const answerLower = botAnswerText.toLowerCase();
    properties.forEach(p => {
      // Check if property title, location or id is mentioned in the bot response
      if (
        answerLower.includes(p.title.toLowerCase()) || 
        answerLower.includes(p.id.toLowerCase()) ||
        (answerLower.includes(p.location.toLowerCase()) && suggestedProperties.length < 2)
      ) {
        suggestedProperties.push(p);
      }
    });

    // Fallback if no specific mentioned but user requested a city/type
    if (suggestedProperties.length === 0) {
      if (answerLower.includes("bangalore") || answerLower.includes("karnataka")) {
        suggestedProperties = properties.filter(p => p.state === "Karnataka").slice(0, 2);
      } else if (answerLower.includes("hyderabad") || answerLower.includes("telangana")) {
        suggestedProperties = properties.filter(p => p.state === "Telangana").slice(0, 2);
      } else if (answerLower.includes("villa")) {
        suggestedProperties = properties.filter(p => p.type === "Villa").slice(0, 2);
      }
    }

    res.json({
      id: `msg-${Date.now()}`,
      role: "model",
      text: botAnswerText,
      timestamp: new Date().toLocaleTimeString(),
      suggestedProperties: suggestedProperties.slice(0, 2)
    });

  } catch (error: any) {
    console.error("Gemini chatbot error:", error);
    res.status(500).json({ error: "Cognitive services are momentarily busy. Please try your advisory prompt again." });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for lightning-fast development serving
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: path.resolve(repoRoot, "frontend"),
      configFile: path.resolve(repoRoot, "frontend", "vite.config.ts"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static compiled assets in production
    const distPath = path.join(repoRoot, "frontend", "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[GMM Server] Booted successfully. Running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
