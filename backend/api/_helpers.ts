import path from "path";
import { config as loadEnv } from "dotenv";
import type { AdminAccount, PublicProperty } from "../types";
import {
  ADMIN_SESSION_TOKEN,
  getAdminAccounts,
  getPublicProperties,
  getSiteContent,
  setAdminAccounts,
  setSiteContent
} from "../state";

const cwd = process.cwd();
const runningFromBackendFolder = path.basename(cwd) === "backend";
const backendDir = runningFromBackendFolder ? cwd : path.resolve(cwd, "backend");
const repoRoot = runningFromBackendFolder ? path.resolve(cwd, "..") : cwd;
const DEMO_ADMIN_TOKEN = "gmm_demo_token";

loadEnv({ path: path.resolve(backendDir, ".env") });
loadEnv({ path: path.resolve(repoRoot, ".env") });

export const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_URL ||
  (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
);

let cloudinaryClientPromise: Promise<typeof import("cloudinary").v2> | null = null;

export const getCloudinaryClient = async () => {
  if (!cloudinaryConfigured) return null;
  if (!cloudinaryClientPromise) {
    cloudinaryClientPromise = import("cloudinary").then(({ v2 }) => {
      if (process.env.CLOUDINARY_URL) {
        v2.config({ secure: true });
      } else {
        v2.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          secure: true
        });
      }
      return v2;
    });
  }

  return cloudinaryClientPromise;
};

const statePublicId = (process.env.CLOUDINARY_STATE_PUBLIC_ID || "gmm/site-content-state").replace(/\.json$/i, "");

let stateReady = false;
let stateLoadPromise: Promise<void> | null = null;

const formatPrice = (price: number, kind: "Sale" | "Rent" | "Lease") => {
  if (!Number.isFinite(price)) return "Rs 0";
  const suffix = kind === "Rent" || kind === "Lease" ? "/mo" : "";
  if (price >= 10000000) return `Rs ${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 2)} Crore${suffix}`;
  if (price >= 100000) return `Rs ${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 2)} Lakh${suffix}`;
  return `Rs ${price.toLocaleString()}${suffix}`;
};

export const toCleanPublicProperties = (): PublicProperty[] => {
  return getSiteContent().properties.map((property) => {
    const imageUrls = Array.isArray(property.images) ? property.images.map((item) => item.url).filter(Boolean) : [];
    const videoUrls = Array.isArray(property.videos) ? property.videos.map((item) => item.url).filter(Boolean) : [];
    const typeMap: Record<string, PublicProperty["type"]> = {
      Residential: "Apartment",
      Commercial: "Commercial",
      Plot: "Plot",
      Villa: "Villa",
      Apartment: "Apartment",
      Warehouse: "Commercial"
    };

    return {
      id: property.id,
      title: property.title,
      price: formatPrice(Number(property.price), property.type),
      numericPrice: Number(property.price) || 0,
      location: property.location,
      city: property.city,
      state: property.state,
      beds: Number(property.beds) || 0,
      baths: Number(property.baths) || 0,
      sqft: Number(property.squareFeet) || 0,
      type: typeMap[property.category] || "Apartment",
      imageUrl: imageUrls[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      imageUrls,
      videoUrl: videoUrls[0],
      videoUrls,
      rera: Boolean(property.reraFlag),
      approvalType: property.approvalType ?? (property.reraFlag ? "RERA" : "None"),
      approvalAuthority: property.approvalAuthority,
      featured: Boolean(property.featured),
      description: property.description || "",
      highlights: [],
      amenities: [],
      category: property.type === "Rent" || property.type === "Lease" ? "Rent" : "Buy"
    };
  });
};

const fetchCloudinaryState = async () => {
  const cloudinary = await getCloudinaryClient();
  if (!cloudinary) {
    throw new Error("Cloudinary is not configured");
  }

  const resource = await cloudinary.api.resource(`${statePublicId}.json`, {
    resource_type: "raw"
  } as any);

  const response = await fetch(resource.secure_url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Cloudinary state fetch failed with ${response.status}`);
  }

  return response.json() as Promise<{ siteContent?: any; adminAccounts?: AdminAccount[] }>;
};

export const ensureStateLoaded = async () => {
  if (stateReady) return;
  if (stateLoadPromise) return stateLoadPromise;

  stateLoadPromise = (async () => {
    if (!cloudinaryConfigured) {
      stateReady = true;
      return;
    }

    try {
      const persisted = await fetchCloudinaryState();
      if (persisted?.siteContent) {
        setSiteContent(persisted.siteContent);
      }
      if (Array.isArray(persisted?.adminAccounts) && persisted.adminAccounts.length > 0) {
        setAdminAccounts(
          persisted.adminAccounts.filter(
            (account): account is AdminAccount =>
              typeof account?.id === "string" &&
              typeof account?.username === "string" &&
              typeof account?.password === "string" &&
              account.role === "administrator"
          )
        );
      }
    } catch {
      // If the remote state file does not exist yet, we simply use the seeded defaults.
    }

    stateReady = true;
  })();

  return stateLoadPromise;
};

export const persistState = async () => {
  if (!cloudinaryConfigured) return;
  const cloudinary = await getCloudinaryClient();
  if (!cloudinary) return;

  const payload = JSON.stringify(
    {
      siteContent: getSiteContent(),
      adminAccounts: getAdminAccounts()
    },
    null,
    2
  );

  const dataUri = `data:application/json;base64,${Buffer.from(payload, "utf-8").toString("base64")}`;

  await cloudinary.uploader.upload(dataUri, {
    resource_type: "raw",
    public_id: statePublicId,
    overwrite: true,
    invalidate: true,
    unique_filename: false,
    use_filename: false,
    format: "json"
  } as any);
};

export const allowCors = (req: any, res: any) => {
  const origin = req.headers?.origin;
  const allowedOriginPatterns = [
    /^https?:\/\/localhost(?::\d+)?$/i,
    /^https?:\/\/127\.0\.0\.1(?::\d+)?$/i,
    /^https:\/\/.*\.vercel\.app$/i
  ];

  if (typeof origin === "string" && allowedOriginPatterns.some((pattern) => pattern.test(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }

  return false;
};

export const requireAdminSession = (req: any, res: any) => {
  const header = String(req.headers?.authorization || "");
  const match = /^Bearer\s+(.+)$/i.exec(header);
  const token = match?.[1] || "";

  if (token !== ADMIN_SESSION_TOKEN && token !== DEMO_ADMIN_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }

  return true;
};

export const getVisibleAccounts = () =>
  getAdminAccounts().map((account) => ({
    id: account.id,
    username: account.username,
    role: account.role
  }));

export const saveSiteContent = async (payload: any) => {
  const nextContent = setSiteContent(payload ?? {});
  await persistState();
  return nextContent;
};

export const saveAdminAccounts = async (accounts: AdminAccount[]) => {
  setAdminAccounts(accounts);
  await persistState();
};

export const getChatSuggestions = (query: string) => {
  const normalized = query.toLowerCase();
  return toCleanPublicProperties()
    .filter((property) => {
      const haystack = `${property.title} ${property.location} ${property.city} ${property.state} ${property.type} ${property.category}`.toLowerCase();
      return normalized.split(/\s+/).some((term) => term.length > 2 && haystack.includes(term));
    })
    .slice(0, 2);
};

export { ADMIN_SESSION_TOKEN, getAdminAccounts, getPublicProperties, getSiteContent };
