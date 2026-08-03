export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: { type: "method_not_allowed", message: "Use POST." } });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { type: "config_error", message: "Server API key not set." } });
  }
  const prompt = req.body && req.body.prompt;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: { type: "bad_request", message: "Body must be { prompt: string }." } });
  }

  const intent = (req.body && req.body.intent) || "untagged";
  const MAX_TOKENS_DEFAULT = 8000;
  const MAX_TOKENS_BY_INTENT = { blueprint: 16000, blueprint_retry: 16000 };
  const maxTokens = MAX_TOKENS_BY_INTENT[intent] || MAX_TOKENS_DEFAULT;

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    console.error("[ask-leo-proxy] upstream call failed:", { intent, error: err && err.message });
    return res.status(502).json({
      error: { type: "upstream_error", message: "Could not reach the AI service." },
    });
  }
}
