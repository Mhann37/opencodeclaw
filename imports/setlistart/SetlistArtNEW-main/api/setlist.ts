export const config = { runtime: "edge" };

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

type SetlistFmSong = {
  name?: string;
  cover?: { name?: string };
};

type SetlistFmSet = {
  encore?: number;
  song?: SetlistFmSong[];
};

type SetlistFmDetailResponse = {
  id: string;
  eventDate?: string;
  venue?: {
    name?: string;
    city?: { name?: string };
  };
  sets?: {
    set?: SetlistFmSet[];
  };
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const id = (url.searchParams.get("id") ?? "").trim();

  if (!id) {
    return json({ error: "Missing required param: id" }, 400, "no-store");
  }

  const apiKey = (process.env.SETLISTFM_API_KEY ?? "").trim();
  if (!apiKey) {
    return json({ error: "SETLISTFM_API_KEY missing" }, 500, "no-store");
  }

  const upstream = await fetch(
    `https://api.setlist.fm/rest/1.0/setlist/${encodeURIComponent(id)}`,
    {
      headers: {
        Accept: "application/json",
        "x-api-key": apiKey,
      },
    }
  );

  if (!upstream.ok) {
    const body = await upstream.text().catch(() => "");
    return json(
      {
        error: "setlist.fm detail request failed",
        status: upstream.status,
        body: body.slice(0, 300),
        id,
      },
      502,
      "no-store"
    );
  }

  const sl = (await upstream.json()) as SetlistFmDetailResponse;

  const sets = Array.isArray(sl.sets?.set) ? sl.sets!.set! : [];

  const songs = sets.flatMap((setObj) => {
    const songsArr = Array.isArray(setObj.song) ? setObj.song : [];
    const isEncore = setObj.encore != null;

    return songsArr
      .map((s) => {
        const title = (s?.name ?? "").trim();
        if (!title) return null;

        const originalArtist = (s?.cover?.name ?? "").trim();
        const type = originalArtist ? "cover" : isEncore ? "encore" : "original";

        return {
          id: crypto.randomUUID(),
          title,
          type,
          originalArtist: originalArtist || undefined,
        };
      })
      .filter(Boolean) as any[];
  });

  // ✅ Cache successful responses at the Vercel edge
  return json(
    {
      id: sl.id,
      date: sl.eventDate,
      venue: sl.venue?.name,
      city: sl.venue?.city?.name,
      songs,
    },
    200,
    "public, s-maxage=600, stale-while-revalidate=86400"
  );
}
