export const config = { runtime: "edge" };

type SetlistFmSetlist = {
  id: string;
  eventDate?: string; // dd-MM-yyyy
  venue?: { name?: string };
  city?: { name?: string };
};

type SetlistFmSearchResponse = {
  setlist?: SetlistFmSetlist[];
  total?: number;
  page?: number;
  itemsPerPage?: number;
  message?: string;
};

function json(
  data: any,
  status = 200,
  cacheControl: string = "no-store"
) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": cacheControl,
    },
  });
}

const clean = (v: string | null) => (v ?? "").trim();

async function callSetlistFm(endpoint: URL, apiKey: string) {
  const upstream = await fetch(endpoint.toString(), {
    headers: {
      Accept: "application/json",
      "x-api-key": apiKey,
    },
  });

  if (!upstream.ok) {
    const body = await upstream.text().catch(() => "");
    return {
      ok: false as const,
      status: upstream.status,
      body: body.slice(0, 500),
      data: null as any,
    };
  }

  const data = (await upstream.json()) as SetlistFmSearchResponse;
  return { ok: true as const, status: upstream.status, body: "", data };
}

function buildEndpoint(params: { artist: string; city?: string; year?: string }) {
  const endpoint = new URL("https://api.setlist.fm/rest/1.0/search/setlists");
  endpoint.searchParams.set("artistName", params.artist);

  // Only include these filters if provided
  if (params.city) endpoint.searchParams.set("cityName", params.city);
  if (params.year) endpoint.searchParams.set("year", params.year);

  // First page is enough; user chooses from candidates
  endpoint.searchParams.set("p", "1");
  return endpoint;
}

export default async function handler(req: Request) {
  const url = new URL(req.url);

  const artist = clean(url.searchParams.get("artist"));
  const city = clean(url.searchParams.get("city"));
  const year = clean(url.searchParams.get("year"));

  // ✅ Only artist is required
  if (!artist) {
    return json({ error: "Missing required param: artist" }, 400, "no-store");
  }

  const apiKey = clean(process.env.SETLISTFM_API_KEY ?? "");
  if (!apiKey) {
    return json(
      { error: "Server misconfigured: SETLISTFM_API_KEY missing" },
      500,
      "no-store"
    );
  }

  // 1) Try with the most specific query first (includes year if provided)
  const endpoint1 = buildEndpoint({ artist, city: city || undefined, year: year || undefined });
  const r1 = await callSetlistFm(endpoint1, apiKey);

  if (!r1.ok) {
    return json(
      { error: "setlist.fm request failed", status: r1.status, body: r1.body },
      502,
      "no-store"
    );
  }

  const setlists1 = Array.isArray(r1.data?.setlist) ? r1.data.setlist : [];

  // 2) If year was provided but no results, fallback without year
  let setlists = setlists1;
  if (setlists.length === 0 && year) {
    const endpoint2 = buildEndpoint({ artist, city: city || undefined });
    const r2 = await callSetlistFm(endpoint2, apiKey);

    if (!r2.ok) {
      return json(
        { error: "setlist.fm request failed", status: r2.status, body: r2.body },
        502,
        "no-store"
      );
    }

    setlists = Array.isArray(r2.data?.setlist) ? r2.data.setlist : [];
  }

  // Map into the shape your UI expects
  const results = setlists.map((s) => ({
    id: s.id,
    date: s.eventDate || year || "",
    venue: s.venue?.name || "Unknown venue",
    city: s.city?.name || city || "Unknown city",
  }));

  // ✅ Cache successful responses at the Vercel edge
  // - Same searches across users now get served from edge cache
  return json(
    { results },
    200,
    "public, s-maxage=600, stale-while-revalidate=86400"
  );
}
