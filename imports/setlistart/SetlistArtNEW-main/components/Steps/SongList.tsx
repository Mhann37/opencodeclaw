import React, { useState, useEffect } from 'react';
import { Song, ConcertDetails } from '../../types';
import { searchSetlists, getSetlistById, ConcertCandidate } from '../../services/setlistService';
import { Plus, X, Search, Loader2, ArrowRight, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { track } from '../../services/track';

interface Props {
  songs: Song[];
  details: ConcertDetails;
  onUpdateSongs: (songs: Song[]) => void;
  onUpdateDetails: (patch: Partial<ConcertDetails>) => void;
  onSongsFromApi: (value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export const SongList: React.FC<Props> = ({
  songs,
  details,
  onUpdateSongs,
  onUpdateDetails,
  onSongsFromApi,
  onNext,
  onBack
}) => {
  const [newSongTitle, setNewSongTitle] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<ConcertCandidate[] | null>(null);
  const [songsFromApi, setSongsFromApi] = useState(false);
  const [fetchSuccessCount, setFetchSuccessCount] = useState<number | null>(null);

  useEffect(() => {
    if (fetchSuccessCount === null) return;
    const timer = setTimeout(() => setFetchSuccessCount(null), 3000);
    return () => clearTimeout(timer);
  }, [fetchSuccessCount]);

  const markFromApi = (value: boolean) => {
    setSongsFromApi(value);
    onSongsFromApi(value);
  };

  const addSong = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newSongTitle.trim()) return;
    onUpdateSongs([...songs, { id: crypto.randomUUID(), title: newSongTitle.trim() }]);
    setNewSongTitle('');
    markFromApi(false);
  };

  const removeSong = (id: string) => {
    onUpdateSongs(songs.filter((s) => s.id !== id));
  };

  const handleClearAndSearchAgain = () => {
    onUpdateSongs([]);
    onUpdateDetails({
      venue: '',
      eventDate: '',
      // keep artist/city/year so user can tweak and refetch
    });
    setFetchError(null);
    setCandidates(null);
    markFromApi(false);

    track('clear_setlist', {
      artist: details.artist || '',
      city: details.city || '',
      year: details.year || ''
    });
  };

  const handleFetch = async () => {
    setIsFetching(true);
    setFetchError(null);
    setCandidates(null);

    track('fetch_setlist_click', {
      artist: details.artist || '(blank)',
      city: details.city || '(blank)',
      year: details.year || '(blank)',
    });

    try {
      const results = await searchSetlists(details);

      track('fetch_setlist_results', { count: results?.length ?? 0 });

      if (!results || results.length === 0) {
        const artist = details.artist?.trim() || "that artist";
        const city = details.city?.trim() || "that city";
        const year = (details.year ?? "").trim();

        const context = year
          ? `${artist} in ${city} (${year})`
          : `${artist} in ${city}`;

        throw new Error(
          `No setlists found for ${context}. Try:\n` +
          `• Check spelling\n` +
          `• Remove the year (or try a different year)\n` +
          `• Try a nearby city\n` +
          `• Or add songs manually below`
        );
      }

      if (results.length === 1) {
        const picked = results[0];
        const detail = await getSetlistById(picked.id);

        onUpdateDetails({
          venue: detail.venue,
          city: detail.city,
          eventDate: detail.date,
        });

        if (!detail.songs || detail.songs.length === 0) {
          setFetchError(
            `Found show at ${detail.venue}, but the setlist is empty on setlist.fm.`
          );
        } else {
          onUpdateSongs(detail.songs);
          markFromApi(true);
          setFetchSuccessCount(detail.songs.length);
          track('setlist_loaded', {
            mode: 'single_result',
            songs: detail.songs.length
          });
        }

        return;
      }

      setCandidates(results);
      track('setlist_candidates_shown', { count: results.length });

    } catch (err: any) {
      const httpStatus = err?.httpStatus;
      let msg = err?.message || 'Could not fetch setlist. Try adding manually.';

      if (httpStatus === 429) {
        msg =
          "SetlistArt is being rate-limited by setlist.fm right now.\n" +
          "Please wait ~60 seconds and try again.";
      }

      setFetchError(msg);
      track('fetch_setlist_error', { message: msg });
    } finally {
      setIsFetching(false);
    }
  };

  const selectCandidate = async (result: ConcertCandidate) => {
    setIsFetching(true);
    setFetchError(null);

    track('fetch_setlist_select_candidate', { id: result.id });

    try {
      const detail = await getSetlistById(result.id);

      onUpdateDetails({
        venue: detail.venue,
        city: detail.city,
        eventDate: detail.date,
      });

      if (!detail.songs || detail.songs.length === 0) {
        if (!confirm(
          `The setlist for ${detail.venue} appears to be empty on setlist.fm. Select anyway?`
        )) {
          return;
        }
      }

      const loadedSongs = detail.songs || [];
      onUpdateSongs(loadedSongs);
      setCandidates(null);
      markFromApi(true);
      if (loadedSongs.length > 0) setFetchSuccessCount(loadedSongs.length);

      track('setlist_loaded', {
        mode: 'candidate_pick',
        songs: loadedSongs.length
      });

    } catch (err: any) {
      const msg =
        err?.message ||
        'Could not load that setlist. Try another result or add manually.';
      setFetchError(msg);
      track('fetch_setlist_error', { message: msg });
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Setlist</h2>
          <p className="text-slate-400 text-sm">
            {details.artist} • {details.city} • {details.year}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <p className="text-xs text-slate-400 mb-1">Pull your exact show setlist instantly.</p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleFetch}
              disabled={isFetching}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isFetching
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-900/20'
              }`}
            >
              {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{isFetching ? 'Fetching...' : 'Fetch from setlist.fm'}</span>
            </button>

            {songs.length > 0 && (
              <button
                onClick={handleClearAndSearchAgain}
                disabled={isFetching}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                title="Clear current setlist so you can fetch another one"
              >
                Clear &amp; search again
              </button>
            )}
          </div>
          {fetchSuccessCount !== null && (
            <p className="text-sm text-green-400 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle className="w-4 h-4" />
              {fetchSuccessCount} songs added from setlist.fm
            </p>
          )}
        </div>
      </div>

      {fetchError && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 text-red-400 text-sm rounded-lg whitespace-pre-line">
          {fetchError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-slate-900 rounded-xl border border-slate-800 shadow-inner mb-6 p-4">
        {songs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600">
            <p className="text-center">No songs yet — search your concert above and we'll load the setlist in seconds.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {songs.map((song, index) => (
              <li
                key={song.id}
                className="flex items-center group bg-slate-800 hover:bg-slate-700/50 border border-transparent hover:border-slate-600 rounded-lg p-3 transition-all"
              >
                <span className="text-slate-500 font-mono text-sm w-8 text-center">
                  {index + 1}
                </span>

                <input
                  className="flex-1 bg-transparent border-none focus:ring-0 font-medium text-slate-200 placeholder-slate-500"
                  value={song.title}
                  onChange={(e) => {
                    const newSongs = [...songs];
                    newSongs[index].title = e.target.value;
                    onUpdateSongs(newSongs);
                  }}
                />

                <button
                  onClick={() => removeSong(song.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {songsFromApi && songs.length > 0 && (
          <p className="text-xs text-slate-500 mt-3 text-center">
            Setlist data from{' '}
            <a href="https://www.setlist.fm" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">
              setlist.fm
            </a>
          </p>
        )}
      </div>

      <div className="flex space-x-4 mb-8">
        <form onSubmit={addSong} className="flex-1 flex space-x-2">
          <input
            type="text"
            value={newSongTitle}
            onChange={(e) => setNewSongTitle(e.target.value)}
            placeholder="Type a song title and press Enter..."
            className="flex-1 px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
        <button onClick={onBack} className="text-slate-500 hover:text-white font-medium transition-colors">
          Back
        </button>

        <button
          onClick={onNext}
          disabled={songs.length === 0}
          className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-bold text-white transition-all ${
            songs.length === 0
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-brand-600 hover:bg-brand-500 transform hover:scale-[1.02]'
          }`}
        >
          <span>Visualise Setlist</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {candidates && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setCandidates(null)}
          />
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 flex flex-col max-h-[80%]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Which Concert?</h3>
              <button
                onClick={() => setCandidates(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-2 overflow-y-auto">
              {candidates.map((result) => (
                <button
                  key={result.id}
                  onClick={() => selectCandidate(result)}
                  className="w-full text-left p-4 hover:bg-slate-800 rounded-xl transition-all group border border-transparent hover:border-slate-700"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center text-brand-400 text-sm font-semibold">
                      <Calendar className="w-4 h-4 mr-2" />
                      {result.date}
                    </div>
                    <span className="text-xs bg-slate-800 group-hover:bg-slate-700 text-slate-400 px-2 py-1 rounded">
                      Tap to load
                    </span>
                  </div>

                  <div className="flex items-center text-white font-medium text-lg mb-1">
                    <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                    {result.venue}
                  </div>

                  <div className="text-sm text-slate-500 ml-6">
                    {result.city}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
