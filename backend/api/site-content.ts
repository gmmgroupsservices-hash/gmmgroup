import { allowCors, ensureStateLoaded, getSiteContent } from "./_helpers.ts";

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;
  try {
    await ensureStateLoaded();
    res.status(200).json(getSiteContent());
  } catch (error) {
    console.error("[api/site-content] Falling back after load failure:", error);
    res.status(200).json(getSiteContent());
  }
}
