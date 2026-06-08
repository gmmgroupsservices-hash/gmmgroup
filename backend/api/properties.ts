import { allowCors, ensureStateLoaded, getPublicProperties } from "./_helpers";

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;
  try {
    await ensureStateLoaded();
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json(getPublicProperties());
  } catch (error) {
    console.error("[api/properties] Failed to build public properties:", error);
    res.status(200).json([]);
  }
}
