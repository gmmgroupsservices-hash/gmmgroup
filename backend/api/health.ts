import { handleOptions, sendJson } from "./_helpers";

export default function handler(req: any, res: any) {
  if (handleOptions(req, res)) return;
  sendJson(req, res, 200, { ok: true, service: "gmm-backend" });
}
