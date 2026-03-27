export const config = { runtime: "edge" };

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const secretKey = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  if (!secretKey) {
    return json({ error: "Server misconfigured: STRIPE_SECRET_KEY missing" }, 500);
  }

  const origin = new URL(req.url).origin;

  // Use the Stripe API directly via fetch (Edge Runtime compatible — no Node SDK needed)
  const body = new URLSearchParams({
    "mode": "payment",
    "line_items[0][price_data][currency]": "aud",
    "line_items[0][price_data][product_data][name]": "SetlistArt Custom Poster — Digital Download",
    "line_items[0][price_data][unit_amount]": "799", // A$7.99
    "line_items[0][quantity]": "1",
    "success_url": `${origin}?payment=success`,
    "cancel_url": `${origin}?payment=cancelled`,
  });

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const session = await stripeRes.json();

  if (!stripeRes.ok) {
    console.error("Stripe error:", session);
    return json({ error: session?.error?.message || "Failed to create checkout session" }, 502);
  }

  return json({ url: session.url });
}
