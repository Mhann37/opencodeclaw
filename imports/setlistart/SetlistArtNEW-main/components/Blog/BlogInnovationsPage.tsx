import React, { useEffect } from 'react';
import { BlogLayout, CtaButton } from './BlogLayout';

export const BlogInnovationsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'How SetlistArt Bridges the Music and Art Worlds | SetlistArt';

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };

    setMeta('description', 'SetlistArt transforms raw setlist data into gallery-quality wall art. Explore how technology and design combine to create the most personal concert memento possible.');
    setMeta('keywords', 'setlist art innovation, music and art, concert poster design, digital music memorabilia, setlist print technology, music data as art, concert art maker');

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', 'https://setlistart.ink/blog/setlistart-bridging-music-and-art');

    return () => { document.title = 'SetlistArt'; };
  }, []);

  return (
    <BlogLayout bottomCtaLabel="Try SetlistArt — Create Your Poster →">
      <article>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-6 leading-tight">
          How SetlistArt Bridges the Music and Art Worlds
        </h1>

        {/* Intro */}
        <p className="text-slate-300 leading-relaxed mb-6">
          At its core, SetlistArt is doing something quietly unusual: turning data into art. A setlist is raw
          information — a list of song titles in a sequence, attached to a date and a place. What SetlistArt
          does is take that information and transform it into something visually considered, emotionally
          resonant, and worth putting on a wall. That transformation — from data to design to physical print —
          sits at a genuinely interesting intersection between the <strong>music and art worlds</strong>. And
          it's an intersection that didn't really exist in this form until recently.
        </p>

        {/* Data as art */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">When data becomes art</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The idea of turning data into visual art isn't new — data visualisation has been a discipline for
          decades. But most data visualisation is abstract: charts, graphs, infographics. What makes a{' '}
          <strong>setlist art</strong> poster different is that the data is already deeply human. A setlist
          isn't rows in a spreadsheet. It's a record of what an artist chose to play for a specific crowd,
          on a specific night — a sequence of decisions made in real time, shaped by the energy in the room.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          When you typeset that data with care — giving the artist name the visual weight it deserves, letting
          the songs breathe, choosing a single accent colour that sets the tone — you're not decorating data.
          You're giving it the presentation it was always worth having.
        </p>

        {/* How the technology works */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">How the technology works</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          SetlistArt connects to setlist.fm — the world's largest crowd-sourced concert database, with millions
          of setlists documented by fans at shows around the world for decades. When you search for your show,
          the system finds your exact setlist and pulls every song into the design engine automatically.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          The layout engine then handles the complexity that would otherwise require a graphic designer: it
          calculates the right font size and line spacing based on the number of songs in the setlist, ensuring
          the poster looks composed and balanced whether there were 10 songs or 35. It renders at full 300 DPI
          resolution across four standard print sizes — A4, A3, 6×8 inch and 11×14 inch — simultaneously.
          All of this is invisible to the user. You see your poster, live, in the browser, and adjust the
          design until it's right.
        </p>

        {/* Design philosophy */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">The design philosophy</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          SetlistArt was deliberately built to produce something that doesn't look like a traditional gig
          poster. Classic concert posters are illustrative — they evoke an artist through imagery, colour and
          graphic style. A SetlistArt poster is typographic: it lets the words do the work. This is a harder
          design problem, because there's nowhere to hide. The typography has to be right. The spacing has to
          be right. The hierarchy has to be clear. When it works, the result is a piece of{' '}
          <strong>concert poster design</strong> that looks as at home in a gallery as it does in a bedroom —
          because the minimalism is intentional, not incidental.
        </p>

        {/* What this means for fans */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">What this means for music fans</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          For the first time, anyone can turn any concert — any artist, any city, any date with a setlist on
          record — into gallery-quality wall art in under two minutes. No graphic design skills. No waiting
          days for a designer. No commissioning a print run. You search, preview, customise, and download.
          The{' '}
          <strong>digital music memorabilia</strong> is in your hands immediately, ready to print anywhere in
          the world.
        </p>

        <CtaButton label="Create Your Poster — Try It Free →" />

        {/* Why it matters */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Why this matters for music culture</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Concerts are ephemeral by design. They happen, and then they're gone. Recording them in some form
          is a deeply human impulse — hence the millions of entries on setlist.fm, the obsessive bootleg
          trading culture, the fans who photograph ticket stubs and post them years later. SetlistArt is a
          new form of that same impulse: not recording the sound, but recording the structure. The shape of
          the night. The arc of the show. Turned into something beautiful that you can live with.{' '}
          <strong>Music and art</strong> have always belonged together. SetlistArt just made it easier to
          bring them both home.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-bold text-white mt-10 mb-3">The show happened. Now make it permanent.</h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          Visit <strong>setlistart.ink</strong>, search your concert, and see what the intersection of music
          and art looks like when it's built specifically for the show you were at.
        </p>
      </article>
    </BlogLayout>
  );
};
