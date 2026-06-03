import { getAdminAccounts, isAuthorized, setAdminAccounts } from "../../state";
import { getJsonBody, handleOptions, sendJson } from "../_helpers";
import type { AdminAccount } from "../../types";

const publicAccounts = () =>
  getAdminAccounts().map(account => ({
    id: account.id,
    username: account.username,
    role: account.role
  }));

export default function handler(req: any, res: any) {
  if (handleOptions(req, res)) return;
  if (!isAuthorized(req.headers?.authorization)) {
    return sendJson(req, res, 401, { error: "Unauthorized" });
  }

  if (req.method === "GET") {
    return sendJson(req, res, 200, publicAccounts());
  }

  if (req.method === "PUT") {
    const accounts = Array.isArray(getJsonBody(req)?.accounts) ? getJsonBody(req).accounts : [];
    const normalized = accounts
      .filter((account: any) => typeof account?.username === "string" && typeof account?.password === "string")
      .map((account: any, index: number): AdminAccount => ({
        id: typeof account?.id === "string" && account.id ? account.id : `admin-${Date.now()}-${index}`,
        username: account.username.trim(),
        password: account.password,
        role: "administrator"
      }))
      .filter(account => account.username.length > 0 && account.password.length > 0);

    if (normalized.length === 0) {
      return sendJson(req, res, 400, { error: "At least one admin account is required" });
    }

    setAdminAccounts(normalized);
    return sendJson(req, res, 200, { accounts: publicAccounts() });
  }

  sendJson(req, res, 405, { error: "Method not allowed" });
}
