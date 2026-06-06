import { allowCors, ensureStateLoaded, getSiteContent } from "./_helpers.ts";

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;
  await ensureStateLoaded();
  res.status(200).json(getSiteContent());
}
