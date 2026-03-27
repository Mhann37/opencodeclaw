import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export const Landing: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="w-full">
      {/* HERO */}
      <div className="flex flex-col items-center justify-center max-w-3xl mx-auto text-center px-6 pt-16 pb-10 animate-fade-in">
        <p className="text-xl md:text-2xl font-semibold text-slate-300 mb-2 text-center">
          Remember this night?
        </p>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
          Turn your concert into <span className="text-brand-500">wall art</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-4 max-w-2xl leading-relaxed">
          In 2 minutes, create a personalised 300 DPI poster pack from any concert.
        </p>

        <p className="text-sm text-slate-400 text-center mb-6">🌍 Over 1,000 setlists visualised by concert fans worldwide.</p>

        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-brand-600 rounded-lg hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-brand-500"
        >
          Turn My Concert Into Art
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <img
          src="/lifestyle-mockup.png"
          alt="SetlistArt concert poster in a silver frame on a wooden surface"
          className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl mt-10 mb-6"
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-500 text-sm font-medium w-full">
          <div className="flex flex-col items-center bg-slate-900/40 border border-slate-800 rounded-xl p-5">
            <span className="block text-slate-200 text-lg font-bold mb-1">300 DPI</span>
            Print-ready quality
          </div>
          <div className="flex flex-col items-center bg-slate-900/40 border border-slate-800 rounded-xl p-5">
            <span className="block text-slate-200 text-lg font-bold mb-1">A3 / A4 / 6×8 / 11×14</span>
            Sizes included
          </div>
          <div className="flex flex-col items-center bg-slate-900/40 border border-slate-800 rounded-xl p-5">
            <span className="block text-slate-200 text-lg font-bold mb-1">Instant</span>
            Live preview in-browser
          </div>
        </div>
      </div>

      {/* SEO CONTENT */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4">
            A modern concert memory you’ll actually frame
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            SetlistArt helps you create a <strong>personalised concert setlist poster</strong> with clean typography and
            a balanced layout designed for modern homes, studios and offices. Add the band name, venue, city, date and
            setlist, then preview your <strong>custom gig poster</strong> instantly. When you’re happy with your design,
            download the <strong>high-resolution print files</strong> to print at home or at any print shop.
          </p>

          <h3 className="text-xl font-bold text-white mb-3">How it works</h3>
          <ol className="grid md:grid-cols-3 gap-4 mb-8">
            <li className="bg-slate-950/40 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-200 font-bold mb-1">1) Create</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Enter your concert details and setlist (or build it manually).
              </p>
            </li>
            <li className="bg-slate-950/40 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-200 font-bold mb-1">2) Preview</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                See your setlist artwork live in the design studio.
              </p>
            </li>
            <li className="bg-slate-950/40 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-200 font-bold mb-1">3) Download</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Love your design? Download the high-res artwork file instantly.
              </p>
            </li>
          </ol>

          <h3 className="text-xl font-bold text-white mb-3">What you receive</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            Every download includes <strong>four high-resolution JPG files</strong> (300 DPI), sized and ready to print:
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 mb-8">
            <li className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 text-slate-300">
              <strong className="text-white">A4</strong> (210 × 297 mm)
            </li>
            <li className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 text-slate-300">
              <strong className="text-white">A3</strong> (297 × 420 mm)
            </li>
            <li className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 text-slate-300">
              <strong className="text-white">6 × 8 in</strong>
            </li>
            <li className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 text-slate-300">
              <strong className="text-white">11 × 14 in</strong>
            </li>
          </ul>

          <h3 className="text-xl font-bold text-white mb-3">
            A music lover gift that doesn’t look like merch
          </h3>
          <p className="text-slate-300 leading-relaxed mb-10">
            A setlist print is a subtle, meaningful reminder of an unforgettable night—perfect for anniversaries,
            birthdays, first concerts and “we were there” moments. Print it anywhere and frame it like a gallery piece.
          </p>

          <h3 className="text-xl font-bold text-white mb-4">Frequently asked questions</h3>
          <div className="space-y-3">
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5">
              <p className="text-white font-bold">Is this a physical print?</p>
              <p className="text-slate-400 text-sm mt-1">
                No—SetlistArt is <strong>digital download only</strong>. You’ll receive print-ready files you can print
                anywhere.
              </p>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5">
              <p className="text-white font-bold">Can I preview before ordering?</p>
              <p className="text-slate-400 text-sm mt-1">
                Yes. You can build and preview your setlist poster on SetlistArt before purchasing.
              </p>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5">
              <p className="text-white font-bold">What sizes are included?</p>
              <p className="text-slate-400 text-sm mt-1">
                Every order includes <strong>A3, A4, 6×8 and 11×14</strong> files (300 DPI).
              </p>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5">
              <p className="text-white font-bold">Where do I find the setlist?</p>
              <p className="text-slate-400 text-sm mt-1">
                We automatically search{' '}
                <a href="https://www.setlist.fm" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-200">setlist.fm</a>
                {' '}for your concert — just enter the artist, city and year. You can also add songs manually.
              </p>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5">
              <p className="text-white font-bold">Is the tool free to use?</p>
              <p className="text-slate-400 text-sm mt-1">
                Yes. Creating and previewing your poster is completely free. You only pay if you choose to download the final high-resolution print files.
              </p>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5">
              <p className="text-white font-bold">Are you affiliated with any artists or venues?</p>
              <p className="text-slate-400 text-sm mt-1">
                No. SetlistArt is an independent design product and is not affiliated with any artist, venue or event.
              </p>
            </div>
          </div>

          <div className="mt-10 text-xs text-slate-500 leading-relaxed">
            SetlistArt is an independent project. Digital downloads are intended for personal use.
            <br />
            Setlist data powered by{' '}
            <a href="https://www.setlist.fm" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">
              setlist.fm
            </a>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-10 flex gap-4 justify-center text-xs text-slate-500">
          <a href="/terms" className="hover:text-slate-300 transition-colors">Terms &amp; Conditions</a>
          <span className="text-slate-600">•</span>
          <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};
