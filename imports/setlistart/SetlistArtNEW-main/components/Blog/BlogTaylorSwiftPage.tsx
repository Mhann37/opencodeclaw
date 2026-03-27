import React, { useEffect } from 'react';
import { BlogLayout, CtaButton } from './BlogLayout';

export const BlogTaylorSwiftPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Taylor Swift Setlist Poster — Eras Tour & Beyond | SetlistArt';

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };

    setMeta('description', 'Create a custom Taylor Swift setlist poster from the Eras Tour or any concert. Preview your design live and download a print-ready file instantly. A$7.99.');
    setMeta('keywords', 'Taylor Swift setlist poster, Eras Tour poster, Taylor Swift concert poster, Taylor Swift wall art, Taylor Swift print, Eras Tour setlist, Taylor Swift Vancouver, custom Swiftie gift, Taylor Swift memorabilia');

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', 'https://setlistart.ink/blog/taylor-swift-setlist-poster');

    return () => { document.title = 'SetlistArt'; };
  }, []);

  return (
    <BlogLayout bottomCtaLabel="Create Your Taylor Swift Setlist Poster →">
      <article>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-6 leading-tight">
          Taylor Swift Setlist Poster — Eras Tour and Every Show Before and After
        </h1>

        {/* Intro */}
        <p className="text-slate-300 leading-relaxed mb-4">
          The Eras Tour was, by any measure, unlike anything that had come before it. The highest-grossing concert
          tour in history. 149 shows across five continents. Ending on December 8, 2024, in Vancouver, British
          Columbia. For the Swifties who were there — whether in Glendale or Melbourne, London or Buenos Aires —
          it wasn't just a concert. It was a cultural event that felt personal in a way that few things at that
          scale ever do.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          The question every fan faced coming home was the same: how do you hold onto something that big? A{' '}
          <strong>Taylor Swift setlist poster</strong> is one answer — and one of the most meaningful ones.
        </p>

        {/* The setlist as art */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The Eras Tour setlist as a piece of art
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The <strong>Eras Tour setlist</strong> wasn't just long — it was architectural. Across most shows, Taylor
          played around 45 songs, moving through every album era from her self-titled debut through{' '}
          <em>The Tortured Poets Department</em>. <em>Cruel Summer</em> into Fearless. Reputation into Lover.
          folklore and evermore. Midnights and beyond.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          For fans, each section of the show triggered something different — a memory, a chapter of their lives, a
          specific feeling tied to a specific album. An <strong>Eras Tour poster</strong> built from your specific
          show doesn't just capture what she played. It captures the emotional arc of three-plus hours that felt
          like a lifetime compressed into one night.
        </p>

        {/* Every show was different */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Every Swiftie's show was different</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          This is what makes Eras Tour setlist posters so meaningful: the surprise songs changed every single
          night. Someone who saw the show in Sydney on February 23 heard different surprise songs than the fan at
          the Tokyo show. Someone at the London Wembley run in June got a different pair than the Melbourne crowd.
          The Vancouver finale had its own.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          That specificity — your city, your date, your surprise songs — is documented in your setlist. No one
          else got exactly what you got. A <strong>Taylor Swift concert poster</strong> from your night is the
          only memento that proves you were at that particular show, with that particular set, in that particular
          place.
        </p>

        {/* How to create */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          How to create your Taylor Swift setlist poster
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Go to SetlistArt and search "Taylor Swift". Add the city and year, and the full setlist — including
          surprise songs — will auto-populate from setlist.fm. Preview your{' '}
          <strong>Taylor Swift wall art</strong> live: choose a light theme for a Lover or Fearless-era feel, or
          go dark for Reputation or <em>The Tortured Poets Department</em>.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          Match your accent colour to your favourite era — gold for Fearless, purple for Speak Now, red for Red,
          deep blue for folklore. Pick your typography style and download. Four{' '}
          <strong>print-ready</strong> sizes at 300 DPI, delivered instantly for A$7.99. A4, A3, 6×8 and 11×14
          in — everything you need to frame it anywhere.
        </p>

        <CtaButton label="Create Your Taylor Swift Poster — A$7.99 →" />

        {/* Vancouver finale */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          The Vancouver finale — December 8, 2024
        </h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          A special mention for the last show. December 8, 2024. BC Place, Vancouver. The final Eras Tour concert
          ever, closing on <em>Karma</em>. For anyone who was inside that stadium that night, this is a show that
          deserves more than a memory — it deserves to be on a wall. And for fans who know the show through the
          Disney+ concert film and can sing every word — the{' '}
          <strong>Taylor Swift Vancouver</strong> setlist is the one they already know by heart. That poster
          belongs somewhere you'll see it every morning.
        </p>

        {/* Gift */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">The ultimate Swiftie gift</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          There is no more personal <strong>custom Swiftie gift</strong> than a poster specific to their show. Not
          an official Eras Tour print that anyone can order — the actual setlist from their night, their city,
          their surprise songs. Instant digital download means it works as a last-minute birthday or Christmas
          gift. Buy it, download it, print it, and frame it. <strong>Taylor Swift memorabilia</strong> doesn't get
          more personal than this.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-bold text-white mt-10 mb-3">The era is over. The memory isn't.</h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          The Eras Tour is done. But the feeling of being there doesn't have to live only in a phone camera roll.
          Make your <strong>Taylor Swift setlist poster</strong> and put it somewhere you'll see it every day.
          Visit setlistart.ink to get started.
        </p>
      </article>
    </BlogLayout>
  );
};
