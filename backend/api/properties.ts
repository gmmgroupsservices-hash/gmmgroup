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

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80";

const formatPublicPrice = (price: number, type: string) => {
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
  return `Rs ${price.toLocaleString("en-IN")}${suffix}`;
};

const mapPropertyForWebsite = (property: any) => {
  if (property && !("squareFeet" in property) && "imageUrl" in property) return property;

  const imageUrls = Array.isArray(property?.images)
    ? property.images.map((item: any) => item?.url).filter(Boolean)
    : [];
  const videoUrls = Array.isArray(property?.videos)
    ? property.videos.map((item: any) => item?.url).filter(Boolean)
    : [];
  const typeMap: Record<string, string> = {
    Residential: "Apartment",
    Commercial: "Commercial",
    Plot: "Plot",
    Villa: "Villa",
    Apartment: "Apartment",
    Warehouse: "Commercial"
  };

  return {
    id: property?.id || "",
    title: property?.title || "GMM Property",
    price: formatPublicPrice(Number(property?.price), property?.type),
    numericPrice: Number(property?.price) || 0,
    location: property?.location || "",
    city: property?.city || "",
    state: property?.state || "",
    beds: Number(property?.beds) || 0,
    baths: Number(property?.baths) || 0,
    sqft: Number(property?.squareFeet) || 0,
    type: typeMap[property?.category] || "Apartment",
    plotFacing: property?.category === "Plot" ? property?.plotFacing || "" : "",
    imageUrl: imageUrls[0] || FALLBACK_IMAGE,
    imageUrls,
    videoUrl: videoUrls[0],
    videoUrls,
    rera: Boolean(property?.reraFlag),
    approvalType: property?.approvalType ?? (property?.reraFlag ? "RERA" : "None"),
    approvalAuthority: property?.approvalAuthority,
    viewCount: Number(property?.viewCount) || 0,
    likeCount: Number(property?.likeCount) || 0,
    featured: Boolean(property?.featured),
    description: property?.description || "",
    highlights: [],
    amenities: [],
    category: property?.type === "Rent" || property?.type === "Lease" ? "Rent" : "Buy"
  };
};

const fetchPersistedProperties = async () => {
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
  return Array.isArray(persisted?.siteContent?.properties) ? persisted.siteContent.properties : null;
};

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;

  try {
    const properties = await fetchPersistedProperties();
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json((properties ?? []).map(mapPropertyForWebsite));
  } catch (error) {
    console.error("[api/properties] Failed to build public properties:", error);
    res.status(200).json([]);
  }
}
