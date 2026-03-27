import React, { useRef, useState } from 'react';
import { ConcertDetails } from '../../types';
import { ArrowRight, MapPin, Calendar, Mic2, HelpCircle } from 'lucide-react';

const POPULAR_ARTISTS = ['Taylor Swift', 'Bad Bunny', 'Billie Eilish', 'Coldplay', 'Olivia Dean'];

interface Props {
  initialData: ConcertDetails;
  onNext: (data: ConcertDetails) => void;
}

export const DetailsInput: React.FC<Props> = ({ initialData, onNext }) => {
  const [formData, setFormData] = useState<ConcertDetails>(initialData);
  const [error, setError] = useState<string | null>(null);
  const cityRef = useRef<HTMLInputElement>(null);

  const handleChipClick = (artist: string) => {
    setFormData(prev => ({ ...prev, artist }));
    cityRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const artist = formData.artist.trim();
    const y = String(formData.year ?? '').trim();

    if (!artist) {
      setError("Artist name is required.");
      return;
    }

    if (y.length > 0 && (isNaN(Number(y)) || y.length !== 4)) {
      setError("If provided, year must be a 4-digit number.");
      return;
    }
    setError(null);
    onNext(formData);
  };

  return (
    <div className="max-w-md mx-auto w-full animate-fade-in-up">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white">Find Your Show</h2>
        <p className="text-slate-400">Type your artist and we'll do the rest.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">
        <p className="text-xs text-slate-500 text-center mb-4 tracking-wide">
          <span className="text-brand-500 font-semibold">① Find Your Show</span>
          {' → ② Design → ③ Download'}
        </p>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-sm font-semibold text-slate-400">Artist Name</label>
            <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" title="Spelling must match setlist.fm exactly for best results" />
          </div>
          <div className="relative">
            <Mic2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              placeholder="e.g. Taylor Swift, Bad Bunny, Billie Eilish..."
              autoFocus
            />
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-1">Start typing — we'll find your show automatically.</p>
          <p className="text-xs text-slate-500 mt-3 mb-1">Popular right now:</p>
          <div className="overflow-x-auto flex flex-nowrap pb-1 mt-1">
            {POPULAR_ARTISTS.map((artist) => (
              <button
                key={artist}
                type="button"
                onClick={() => handleChipClick(artist)}
                className="text-xs bg-slate-800 text-slate-300 rounded-full px-3 py-1 mr-2 whitespace-nowrap cursor-pointer hover:bg-slate-700"
              >
                {artist}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                ref={cityRef}
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                placeholder="London"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1 ml-1">e.g. London, Sydney, New York</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">Year</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                maxLength={4}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                placeholder="2023"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-900/50 text-red-400 text-sm rounded-lg font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg shadow-brand-900/20"
        >
          <span>Next: Add Songs</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
