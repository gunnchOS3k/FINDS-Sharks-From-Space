export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const ALLOW_HOSTS = new Set([
      "finds-web.pages.dev",   // replace later with actual domain
      "localhost:5173",
      "localhost:3000"
    ]);
    let allowOrigin = "";
    try { const host = new URL(origin).host; if (ALLOW_HOSTS.has(host)) allowOrigin = origin; } catch {}
    const cors = {
      "Access-Control-Allow-Origin": allowOrigin || "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "content-type",
      "Vary": "Origin",
      "Access-Control-Max-Age": "86400"
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return new Response("POST only", { status: 405, headers: cors });

    const { region = "NYC", n = 200 } = await request.json().catch(() => ({}));
    const prompt = [
      'Return a valid JSON object exactly like:',
      '{ "hotspots":[{ "lat": number, "lon": number, "score": number }]}',
      `for region="${region}" with ${n} points.`,
      'No markdown—JSON only.'
    ].join(" ");

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + env.GEMINI_API_KEY;

    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }]}] })
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ error: res.status, detail: text }), { status: res.status, headers: { "content-type": "application/json", ...cors }});
    }

    const gl = await res.json();
    const text = gl?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    let payload;
    try { payload = JSON.parse(text); } catch { payload = { raw: text }; }

    // Optional: cache to R2
    if (env.FIND_BUCKET) {
      const key = `runs/${Date.now()}-${region}-${n}.json`;
      await env.FIND_BUCKET.put(key, JSON.stringify(payload), { httpMetadata: { contentType: "application/json" }});
    }

    return new Response(JSON.stringify(payload), { headers: { "content-type": "application/json", ...cors }});
  }
};
