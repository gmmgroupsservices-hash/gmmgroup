import { allowCors, ensureStateLoaded, toCleanPublicProperties } from "./_helpers.ts";

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;
  try {
    await ensureStateLoaded();
    res.status(200).json(toCleanPublicProperties());
  } catch (error) {
    console.error("[api/properties] Falling back after load failure:", error);
    res.status(200).json(toCleanPublicProperties());
  }
}
