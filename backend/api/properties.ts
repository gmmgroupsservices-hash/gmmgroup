import { allowCors, ensureStateLoaded, toCleanPublicProperties } from "./_helpers.ts";

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;
  await ensureStateLoaded();
  res.status(200).json(toCleanPublicProperties());
}
