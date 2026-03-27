import React, { useEffect } from 'react';
import { BlogLayout, CtaButton } from './BlogLayout';

export const BlogGeneralPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Concert Setlist Poster — Create Yours Instantly | SetlistArt';

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };

    setMeta('description', 'Turn any concert into a print-ready setlist poster in minutes. Search your show, preview your design live, and download a 300 DPI artwork file. A$7.99 instant download.');
    setMeta('keywords', 'concert setlist poster, setlist poster, custom setlist print, gig poster, concert poster maker, digital download, print ready, wall art, concert memory, music fan gift');

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', 'https://setlistart.ink/blog/concert-setlist-poster');

    return () => { document.title = 'SetlistArt'; };
  }, []);

  return (
    <BlogLayout bottomCtaLabel="Create Your Setlist Poster →">
      <article>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-6 leading-tight">
          Concert Setlist Poster: The Best Way to Remember a Live Show
        </h1>

        {/* Intro */}
        <p className="text-slate-300 leading-relaxed mb-6">
          The t-shirt fades. The tour hoodie ends up at the back of the wardrobe. But a framed setlist on your wall?
          That stays. There's something about standing in a crowd, watching a band play every song from memory, that
          deserves better than a crumpled ticket stub. A <strong>concert setlist poster</strong> captures that exact
          night — every song, in order, with the artist, venue, city and date — as a piece of{' '}
          <strong>wall art</strong> you'll actually want to look at. It's the most personal way to hold onto a
          concert memory, and it takes about two minutes to make.
        </p>

        {/* What is a setlist poster */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">What is a concert setlist poster?</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          A <strong>setlist poster</strong> is a designed print that documents the exact songs a band or artist played
          at a specific show. It features the artist name prominently, followed by the full setlist in the order it
          was performed, alongside the venue name, city and date. Unlike generic concert merchandise, a{' '}
          <strong>custom setlist print</strong> is specific to one night — your night. Over the past few years, it's
          become one of the most popular forms of music fan wall art, cherished by collectors and casual fans alike
          for how precisely it captures a personal memory.
        </p>

        {/* Why it beats merch */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Why a setlist poster beats regular concert merch</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Merch is generic. Your tour hoodie is identical to the one the person three rows back bought. A{' '}
          <strong>setlist poster</strong>, on the other hand, is a document of exactly what you experienced — the
          specific songs they played, in the city you were in, on the night you were there. It belongs on a wall,
          in a frame, where people ask about it.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          It works equally well as a <strong>music fan gift</strong>. For a partner who was there with you. For a
          friend who's been talking about that show for months. For a parent who finally got to see their favourite
          artist. Unlike a t-shirt that shrinks or fades, a framed <strong>gig poster</strong> is a conversation
          piece that only gets more meaningful with time — the kind of thing you find years later and feel
          immediately transported back.
        </p>

        {/* How SetlistArt works */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">How SetlistArt works</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Creating your custom setlist print takes about two minutes. Search for your concert — type in the artist
          name, city and year — and SetlistArt automatically pulls the setlist from setlist.fm, populating every
          song that was played in order. From there, you preview your poster live in the browser.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          Choose between dark and light themes. Pick an accent colour that suits the artist's vibe. Select a
          typography style — bold and graphic, or clean and modern. Toggle a decorative border on or off. When
          you're happy, download the <strong>print-ready</strong> file pack for A$7.99. Every order includes four
          high-resolution JPG files at <strong>300 DPI</strong>, sized for A3, A4, 6×8 inch and 11×14 inch — ready
          to print anywhere, any time.
        </p>

        {/* What makes great design */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">What makes a great setlist poster design</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          A great <strong>concert poster maker</strong> keeps things clean. The artist name carries the most visual
          weight. The songs are clearly listed, legible and evenly spaced. The design feels balanced whether there
          were 12 songs or 30. SetlistArt's layout engine handles all of this automatically — adjusting font size
          and spacing based on your setlist length so the poster always looks deliberate and well-composed, never
          cramped or floating. The result is something that looks like it was designed specifically for that show.
        </p>

        <CtaButton label="Create Your Poster — A$7.99 →" />

        {/* Gift idea */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Perfect for gifts</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          A <strong>setlist poster</strong> makes an instant, meaningful gift for any <strong>music fan</strong>.
          It's specific — not just a poster of the artist, but a poster of the exact concert they attended. That
          level of specificity is what makes it genuinely personal. It works for birthdays, anniversaries,
          Christmas, or as a spontaneous "remember when we saw them?" surprise. And because it's an instant{' '}
          <strong>digital download</strong>, you can buy it and print it locally even if you left it to the last
          minute.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-bold text-white mt-10 mb-3">Make the memory permanent</h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          Whatever concert you're thinking of right now, it deserves to be on a wall. Type in the details, preview
          your design, and hold the memory in your hands. Visit{' '}
          <strong>setlistart.ink</strong> to get started.
        </p>
      </article>
    </BlogLayout>
  );
};
