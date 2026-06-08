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

const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error("Timed out")), ms));

const getCloudinaryConfig = () => {
  const cloudName =
    (typeof process.env.CLOUDINARY_CLOUD_NAME === "string" && process.env.CLOUDINARY_CLOUD_NAME.trim()) ||
    (() => {
      const url = process.env.CLOUDINARY_URL || "";
      const match = /^cloudinary:\/\/[^@]+@([^/?#]+)$/i.exec(url);
      return match?.[1] || "";
    })();

  const apiKey = process.env.CLOUDINARY_API_KEY || "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "";
  const statePublicId = (process.env.CLOUDINARY_STATE_PUBLIC_ID || "gmm/site-content-state").replace(/\.json$/i, "");

  return { cloudName, apiKey, apiSecret, statePublicId };
};

const buildAuthHeader = (apiKey: string, apiSecret: string) =>
  `Basic ${Buffer.from(`${apiKey}:${apiSecret}`, "utf-8").toString("base64")}`;

const fetchPersistedSiteContent = async () => {
  const { cloudName, apiKey, apiSecret, statePublicId } = getCloudinaryConfig();
  if (!cloudName || !apiKey || !apiSecret) return null;

  const resourceResponse = await Promise.race([
    fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/resources/raw/upload/${encodeURIComponent(statePublicId)}.json`,
      {
        headers: { Authorization: buildAuthHeader(apiKey, apiSecret) },
        cache: "no-store"
      }
    ),
    timeout(4000)
  ]) as Response;

  if (!resourceResponse.ok) return null;
  const resource = await resourceResponse.json().catch(() => null);
  const secureUrl = resource?.secure_url;
  if (typeof secureUrl !== "string" || !secureUrl) return null;

  const stateResponse = await Promise.race([fetch(secureUrl, { cache: "no-store" }), timeout(4000)]) as Response;
  if (!stateResponse.ok) return null;

  const persisted = await stateResponse.json().catch(() => null);
  return persisted?.siteContent ?? null;
};

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;

  try {
    const siteContent = await fetchPersistedSiteContent();
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json(siteContent ?? {});
  } catch (error) {
    console.error("[api/site-content] Failed to build site content:", error);
    res.status(200).json({});
  }
}
