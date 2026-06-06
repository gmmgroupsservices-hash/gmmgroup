import express from "express";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { config as loadEnv } from "dotenv";
import type { AdminAccount, PublicProperty, SiteContent } from "../types";
import {
  ADMIN_SESSION_TOKEN,
  createDefaultSiteContent,
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

loadEnv({ path: path.resolve(backendDir, ".env") });
loadEnv({ path: path.resolve(repoRoot, ".env") });

const app = express();
const allowedOriginPatterns = [
  /^https?:\/\/localhost(?::\d+)?$/i,
  /^https?:\/\/127\.0\.0\.1(?::\d+)?$/i,
  /^https:\/\/.*\.vercel\.app$/i
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

const statePublicId = (process.env.CLOUDINARY_STATE_PUBLIC_ID || "gmm/site-content-state").replace(/\.json$/i, "");

let stateReady = false;
let stateLoadPromise: Promise<void> | null = null;

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

const formatPrice = (price: number, kind: "Sale" | "Rent" | "Lease") => {
  if (!Number.isFinite(price)) return "Rs 0";
  const suffix = kind === "Rent" || kind === "Lease" ? "/mo" : "";
  if (price >= 10000000) return `Rs ${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 2)} Crore${suffix}`;
  if (price >= 100000) return `Rs ${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 2)} Lakh${suffix}`;
  return `Rs ${price.toLocaleString()}${suffix}`;
};

const toPublicProperty = (property: any): PublicProperty => {
  const imageUrls = Array.isArray(property.images) ? property.images.map((item: any) => item.url).filter(Boolean) : [];
  const videoUrls = Array.isArray(property.videos) ? property.videos.map((item: any) => item.url).filter(Boolean) : [];
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
    featured: Boolean(property.featured),
    description: property.description || "",
    highlights: [],
    amenities: [],
    category: property.type === "Rent" || property.type === "Lease" ? "Rent" : "Buy"
  };
};

const fetchCloudinaryState = async () => {
  const resource = await cloudinary.api.resource(statePublicId, {
    resource_type: "raw",
    type: "upload"
  });

  const response = await fetch(resource.secure_url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Cloudinary state fetch failed with ${response.status}`);
  }

  return response.json() as Promise<{ siteContent?: SiteContent; adminAccounts?: AdminAccount[] }>;
};

const persistCloudinaryState = async () => {
  if (!cloudinaryConfigured) return;

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

const ensureStateLoaded = async () => {
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
      // First run is allowed to start from defaults if the remote JSON does not exist yet.
    }

    stateReady = true;
  })();

  return stateLoadPromise;
};

const persistState = async () => {
  stateReady = true;
  await persistCloudinaryState();
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (typeof origin === "string" && allowedOriginPatterns.some((pattern) => pattern.test(origin))) {
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

app.get("/api/health", async (_req, res) => {
  await ensureStateLoaded();
  res.json({
    ok: true,
    service: "gmm-backend",
    persistence: cloudinaryConfigured ? "cloudinary" : "memory"
  });
});

app.get("/api/site-content", async (_req, res) => {
  await ensureStateLoaded();
  res.json(getSiteContent());
});

app.get("/api/properties", async (_req, res) => {
  await ensureStateLoaded();
  const publicProperties = getPublicProperties().map((property) => ({
    ...property,
    price: property.price?.includes("â") ? toPublicProperty(getSiteContent().properties?.find((item) => item.id === property.id) ?? property).price : property.price
  }));
  res.json(publicProperties);
});

app.post("/api/admin/login", async (req, res) => {
  await ensureStateLoaded();
  const { username, password } = req.body ?? {};
  const matchedAccount = getAdminAccounts().find((account) => account.username === username && account.password === password);

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

app.get("/api/admin/site-content", async (req, res) => {
  if (!requireAdminSession(req, res)) return;
  await ensureStateLoaded();
  res.json(getSiteContent());
});

app.put("/api/admin/site-content", async (req, res) => {
  if (!requireAdminSession(req, res)) return;
  await ensureStateLoaded();
  const nextContent = setSiteContent(req.body ?? {});
  await persistState();
  res.json(nextContent);
});

app.get("/api/admin/accounts", async (req, res) => {
  if (!requireAdminSession(req, res)) return;
  await ensureStateLoaded();
  res.json(
    getAdminAccounts().map((account) => ({
      id: account.id,
      username: account.username,
      role: account.role
    }))
  );
});

app.put("/api/admin/accounts", async (req, res) => {
  if (!requireAdminSession(req, res)) return;
  await ensureStateLoaded();

  const accounts = Array.isArray(req.body?.accounts) ? req.body.accounts : [];
  const normalizedAccounts = accounts
    .filter((account: any) => typeof account?.username === "string" && typeof account?.password === "string")
    .map(
      (account: any, index: number): AdminAccount => ({
        id: typeof account?.id === "string" && account.id ? account.id : `admin-${Date.now()}-${index}`,
        username: account.username.trim(),
        password: account.password,
        role: "administrator"
      })
    )
    .filter((account: AdminAccount) => account.username.length > 0 && account.password.length > 0);

  if (normalizedAccounts.length === 0) {
    return res.status(400).json({ error: "At least one admin account is required" });
  }

  setAdminAccounts(normalizedAccounts);
  await persistState();

  res.json({
    accounts: normalizedAccounts.map((account) => ({
      id: account.id,
      username: account.username,
      role: account.role
    }))
  });
});

app.post("/api/media/upload", async (req, res) => {
  try {
    if (!requireAdminSession(req, res)) return;
    await ensureStateLoaded();

    const { fileData, fileName, folder, mediaType } = req.body ?? {};

    if (!fileData || typeof fileData !== "string") {
      return res.status(400).json({ error: "fileData is required" });
    }

    if (!cloudinaryConfigured) {
      return res.status(500).json({
        error: "Cloudinary is not configured on the backend"
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
    res.status(500).json({
      error: "Cloudinary upload failed",
      details: error?.message || "Unknown upload error"
    });
  }
});

app.post("/api/chat", async (req, res) => {
  await ensureStateLoaded();

  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const latestText = String(messages[messages.length - 1]?.text || "").toLowerCase();
  const properties = getPublicProperties();

  const matches = properties.filter((property) => {
    const haystack = `${property.title} ${property.location} ${property.city} ${property.state} ${property.type} ${property.category}`.toLowerCase();
    return latestText.split(/\s+/).some((term) => term.length > 2 && haystack.includes(term));
  }).slice(0, 2);

  res.json({
    id: `msg-${Date.now()}`,
    role: "model",
    text: matches.length > 0
      ? `I found ${matches.length} matching GMM listing${matches.length > 1 ? "s" : ""} for your request.`
      : "I can help with villas, apartments, plots, commercial listings, and add-on services. Try mentioning a city, property type, or budget.",
    timestamp: new Date().toLocaleTimeString(),
    suggestedProperties: matches
  });
});

export default app;
