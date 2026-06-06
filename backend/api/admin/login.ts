import { allowCors, ensureStateLoaded, getAdminAccounts, ADMIN_SESSION_TOKEN } from "../_helpers.ts";

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;
  await ensureStateLoaded();

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { username, password } = req.body ?? {};
  const matchedAccount = getAdminAccounts().find((account) => account.username === username && account.password === password);

  if (!matchedAccount) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.status(200).json({
    token: ADMIN_SESSION_TOKEN,
    user: {
      id: matchedAccount.id,
      username: matchedAccount.username,
      role: matchedAccount.role
    }
  });
}
