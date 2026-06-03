import { getSiteContent, isAuthorized, setSiteContent } from "../../state";
import { getJsonBody, handleOptions, sendJson } from "../_helpers";

export default function handler(req: any, res: any) {
  if (handleOptions(req, res)) return;
  if (!isAuthorized(req.headers?.authorization)) {
    return sendJson(req, res, 401, { error: "Unauthorized" });
  }

  if (req.method === "GET") {
    return sendJson(req, res, 200, getSiteContent());
  }

  if (req.method === "PUT") {
    return sendJson(req, res, 200, setSiteContent(getJsonBody(req)));
  }

  sendJson(req, res, 405, { error: "Method not allowed" });
}
