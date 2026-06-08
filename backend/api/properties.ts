import { createDefaultPublicSiteContent } from "../publicDefaults";

const allowCors = (req: any, res: any) => {
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

const getCloudinaryCloudName = () => {
  if (typeof process.env.CLOUDINARY_CLOUD_NAME === "string" && process.env.CLOUDINARY_CLOUD_NAME.trim()) {
    return process.env.CLOUDINARY_CLOUD_NAME.trim();
  }

  const url = process.env.CLOUDINARY_URL || "";
  const match = /^cloudinary:\/\/[^@]+@([^/?#]+)$/i.exec(url);
  return match?.[1] || "";
};

const statePublicId = (process.env.CLOUDINARY_STATE_PUBLIC_ID || "gmm/site-content-state").replace(/\.json$/i, "");

const loadPersistedSiteContent = async () => {
  const cloudName = getCloudinaryCloudName();
  if (!cloudName) return null;

  const response = await fetch(
    `https://res.cloudinary.com/${encodeURIComponent(cloudName)}/raw/upload/${statePublicId}.json`,
    { cache: "no-store" }
  );

  if (!response.ok) return null;

  const persisted = await response.json().catch(() => null);
  return persisted?.siteContent ?? null;
};

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;
  try {
    const persistedSiteContent = await loadPersistedSiteContent();
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json(persistedSiteContent?.properties ?? createDefaultPublicSiteContent().properties);
  } catch (error) {
    console.error("[api/properties] Failed to build public properties:", error);
    res.status(200).json(createDefaultPublicSiteContent().properties);
  }
}
