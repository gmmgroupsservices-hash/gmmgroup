import { allowCors, ensureStateLoaded, persistState } from "../../_helpers";
import { updatePropertyEngagement } from "../../../state";

const getPropertyId = (req: any) => {
  const queryId = req.query?.id;
  if (typeof queryId === "string" && queryId) return queryId;

  const match = String(req.url || "").match(/\/api\/properties\/([^/?#]+)\/like/i);
  return match ? decodeURIComponent(match[1]) : "";
};

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await ensureStateLoaded();
    const liked = req.body?.liked !== false;
    const property = updatePropertyEngagement(getPropertyId(req), liked ? "like" : "unlike");
    if (!property) return res.status(404).json({ error: "Property not found" });

    await persistState();
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json(property);
  } catch (error) {
    console.error("[api/properties/:id/like] Failed to record like:", error);
    res.status(500).json({ error: "Failed to record like" });
  }
}
