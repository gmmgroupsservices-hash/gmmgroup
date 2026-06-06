import { allowCors, cloudinaryConfigured, ensureStateLoaded } from "./_helpers.ts";

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;
  await ensureStateLoaded();
  res.status(200).json({
    ok: true,
    service: "gmm-backend",
    persistence: cloudinaryConfigured ? "cloudinary" : "memory"
  });
}
