import type { Song, ConcertDetails } from "../types";

export interface ConcertCandidate {
  id: string;
  date: string;
  venue: string;
  city: string;
}

export interface ConcertDetail extends ConcertCandidate {
  songs: Song[];
}

const clean = (v: any) => String(v ?? "").trim();

/**
 * Search setlists.
 * - artist is required
 * - city and year are optional
 * - if year is provided but yields no results, retry without year
 */
export const searchSetlists = async (
  details: ConcertDetails
): Promise<ConcertCandidate[]> => {
  const artist = clean(details.artist);
  const city = clean(details.city);
  const year = clean(details.year);

  if (!artist) {
    throw new Error("Artist is required to search setlists.");
  }

  const fetchOnce = async (params: Record<string, string>) => {
  const qs = new URLSearchParams(params);
  const res = await fetch(`/api/setlists?${qs.toString()}`);
  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    const status = res.status;
    const upstreamStatus = payload?.status; // from our API when setlist.fm fails
    const message =
      payload?.error ||
      (status === 429 ? "Rate limited. Please try again shortly." : "Unable to fetch setlists.");

    const err: any = new Error(message);
    err.httpStatus = status;
    err.upstreamStatus = upstreamStatus;
    throw err;
  }

  const results = Array.isArray(payload?.results) ? payload.results : [];
  return results as ConcertCandidate[];
};

  // 1) Try with year (if provided)
  const paramsWithYear: Record<string, string> = { artist };
  if (city) paramsWithYear.city = city;
  if (year) paramsWithYear.year = year;

  let results = await fetchOnce(paramsWithYear);

  // 2) If no results AND year was provided, retry without year
  if (results.length === 0 && year) {
    const paramsNoYear: Record<string, string> = { artist };
    if (city) paramsNoYear.city = city;

    results = await fetchOnce(paramsNoYear);
  }

  return results;
};

export const getSetlistById = async (id: string): Promise<ConcertDetail> => {
  const res = await fetch(`/api/setlist?id=${encodeURIComponent(id)}`);
  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    const extra = payload?.status ? ` (status ${payload.status})` : "";
    const body = payload?.body ? `: ${payload.body}` : "";
    throw new Error((payload?.error || "Unable to fetch setlist details") + extra + body);
  }

  return payload as ConcertDetail;
};
