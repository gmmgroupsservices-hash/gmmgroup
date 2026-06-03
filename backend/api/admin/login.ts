import { ADMIN_SESSION_TOKEN, getAdminAccounts } from "../../state";
import { getJsonBody, handleOptions, sendJson } from "../_helpers";

export default function handler(req: any, res: any) {
  if (handleOptions(req, res)) return;
  if (req.method !== "POST") {
    return sendJson(req, res, 405, { error: "Method not allowed" });
  }

  const { username, password } = getJsonBody(req);
  const matchedAccount = getAdminAccounts().find(
    account => account.username === username && account.password === password
  );

  if (!matchedAccount) {
    return sendJson(req, res, 401, { error: "Invalid credentials" });
  }

  sendJson(req, res, 200, {
    token: ADMIN_SESSION_TOKEN,
    user: {
      id: matchedAccount.id,
      username: matchedAccount.username,
      role: matchedAccount.role
    }
  });
}
