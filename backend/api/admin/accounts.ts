import type { AdminAccount } from "../../types";
import {
  allowCors,
  ensureStateLoaded,
  getVisibleAccounts,
  requireAdminSession,
  saveAdminAccounts
} from "../_helpers";

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;
  if (!requireAdminSession(req, res)) return;
  await ensureStateLoaded();

  if (req.method === "GET") {
    res.status(200).json(getVisibleAccounts());
    return;
  }

  if (req.method === "PUT") {
    const accounts = Array.isArray(req.body?.accounts) ? req.body.accounts : [];
    const normalizedAccounts = accounts
      .filter((account: any) => typeof account?.username === "string" && typeof account?.password === "string")
      .map(
        (account: any, index: number): AdminAccount => ({
          id: typeof account?.id === "string" && account.id ? account.id : `admin-${Date.now()}-${index}`,
          username: account.username.trim(),
          password: account.password,
          role: "administrator"
        })
      )
      .filter((account: AdminAccount) => account.username.length > 0 && account.password.length > 0);

    if (normalizedAccounts.length === 0) {
      res.status(400).json({ error: "At least one admin account is required" });
      return;
    }

    await saveAdminAccounts(normalizedAccounts);
    res.status(200).json(getVisibleAccounts());
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
