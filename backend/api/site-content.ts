import { allowCors, ensureStateLoaded, getSiteContent } from "./_helpers";

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;
  try {
    await ensureStateLoaded();
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json(getSiteContent());
  } catch (error) {
    console.error("[api/site-content] Failed to build site content:", error);
    res.status(200).json({});
  }
}
