import {
  allowCors,
  ensureStateLoaded,
  getSiteContent,
  requireAdminSession,
  saveSiteContent
} from "../_helpers.ts";

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;
  if (!requireAdminSession(req, res)) return;
  await ensureStateLoaded();

  if (req.method === "GET") {
    res.status(200).json(getSiteContent());
    return;
  }

  if (req.method === "PUT") {
    const nextContent = await saveSiteContent(req.body ?? {});
    res.status(200).json(nextContent);
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
