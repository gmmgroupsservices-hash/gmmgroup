import { allowCors, ensureStateLoaded, getChatSuggestions } from "./_helpers.ts";

export default async function handler(req: any, res: any) {
  if (allowCors(req, res)) return;
  await ensureStateLoaded();

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const latestText = String(messages[messages.length - 1]?.text || "");
  const suggestions = getChatSuggestions(latestText);

  res.status(200).json({
    id: `msg-${Date.now()}`,
    role: "model",
    text: suggestions.length > 0
      ? `I found ${suggestions.length} matching GMM listing${suggestions.length > 1 ? "s" : ""} for your request.`
      : "I can help with villas, apartments, plots, commercial listings, and add-on services. Try mentioning a city, property type, or budget.",
    timestamp: new Date().toLocaleTimeString(),
    suggestedProperties: suggestions
  });
}
