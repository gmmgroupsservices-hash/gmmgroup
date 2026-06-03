import { getSiteContent } from "../state";
import { handleOptions, sendJson } from "./_helpers";

export default function handler(req: any, res: any) {
  if (handleOptions(req, res)) return;
  if (req.method !== "GET") {
    return sendJson(req, res, 405, { error: "Method not allowed" });
  }
  sendJson(req, res, 200, getSiteContent());
}
