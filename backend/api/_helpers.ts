export const setCors = (req: any, res: any) => {
  const origin = req.headers?.origin;
  if (typeof origin === "string") {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

export const handleOptions = (req: any, res: any) => {
  setCors(req, res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
};

export const getJsonBody = (req: any) => {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
};

export const sendJson = (req: any, res: any, status: number, payload: unknown) => {
  setCors(req, res);
  res.status(status).json(payload);
};
