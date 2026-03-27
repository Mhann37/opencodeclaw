import React, { useEffect } from 'react';
import { BlogLayout, CtaButton } from './BlogLayout';

export const BlogBadBunnyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Bad Bunny Setlist Poster — Custom Concert Print | SetlistArt';

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };

    setMeta('description', 'Create a custom Bad Bunny setlist poster from any of his concerts. Search your show, preview your design live, and download print-ready files instantly. A$7.99.');
    setMeta('keywords', 'Bad Bunny setlist poster, Bad Bunny concert poster, Bad Bunny wall art, Bad Bunny print, Un Verano Sin Ti tour, Most Wanted tour, Chambea, Bad Bunny memorabilia, concierto Bad Bunny');

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', 'https://setlistart.ink/blog/bad-bunny-setlist-poster');

    return () => { document.title = 'SetlistArt'; };
  }, []);

  return (
    <BlogLayout bottomCtaLabel="Create Your Bad Bunny Setlist Poster →">
      <article>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-6 leading-tight">
          Bad Bunny Setlist Poster — Commemorate the Concert Nobody Forgets
        </h1>

        {/* Intro */}
        <p className="text-slate-300 leading-relaxed mb-4">
          ¿Fuiste al concierto? If you were at a Bad Bunny show — <strong>Un Verano Sin Ti</strong>,{' '}
          <strong>Most Wanted</strong>, it doesn't matter which — you know what it feels like when an entire
          stadium becomes one. The bass from <em>Tití Me Preguntó</em> hitting your chest. The crowd screaming
          every word to <em>Me Porto Bonito</em> without being prompted. The collective energy of 50,000 people
          who all know every lyric to every song.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          The show ends. The lights come on. And what do you have? A{' '}
          <strong>Bad Bunny setlist poster</strong> gives that night a permanent home — on your wall, exactly as
          it happened, exactly as you lived it.
        </p>

        {/* Why Bad Bunny shows make great posters */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Why Bad Bunny shows make iconic setlist posters
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Bad Bunny's discography spans Latin trap, reggaeton, experimental pop, and sounds that are genuinely
          hard to categorise — which is part of why his shows feel so complete. A setlist from a{' '}
          <strong>concierto Bad Bunny</strong> moves through eras in a way that maps his entire trajectory: the
          earliest mixtape energy, the <em>YHLQMDLG</em> classics, the <em>Un Verano Sin Ti</em> deep cuts, the
          newer material from <em>Nadie Sabe Lo Que Va a Pasar Mañana</em>.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          Songs like <em>Ojitos Lindos</em>, <em>Neverita</em>, <em>Efecto</em> and <em>Chambea</em> take on a
          completely different weight live, in a crowd of people who know every word in every language. A{' '}
          <strong>Bad Bunny concert poster</strong> captures exactly which of those songs you heard — on the exact
          night, in the exact city, in the order they were played.
        </p>

        {/* How to create */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          How to create your Bad Bunny setlist poster
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Head to SetlistArt and type "Bad Bunny" in the search. Add the city and year of your show, and the
          setlist will auto-populate from setlist.fm — the database has comprehensive coverage of Bad Bunny
          concerts across all his tours, from smaller early shows to stadium runs.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          From there, preview your <strong>Bad Bunny wall art</strong> live. Try a dark background with a bright
          accent colour — yellow, lime green, or white works particularly well for his bold visual world. Choose
          your typography (Bold is a strong choice for this aesthetic), toggle the border, and download your full
          print-ready pack for A$7.99. Four sizes at 300 DPI, instantly.
        </p>

        <CtaButton label="Create Your Bad Bunny Poster — A$7.99 →" />

        {/* Design tips */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Design tips for a Bad Bunny poster</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Bad Bunny's visual aesthetic is maximalist and vibrant. Don't go subtle. A dark background with bold
          typography and a bright accent colour — yellow or lime green — gives you a{' '}
          <strong>Bad Bunny print</strong> that looks punchy and alive. The artist name should feel large and
          commanding at the top. The songs should read like a list you could run through at full speed. That
          energy, that forward momentum — that's what makes a great Bad Bunny setlist poster.
        </p>

        {/* Gift */}
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">
          Un regalo perfecto — the perfect gift for a Bad Bunny fan
        </h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          For the fan in your life who spent months trying to get tickets. Who flew cross-country — or crossed an
          ocean — to be in that stadium. Who knows every word to every track on{' '}
          <em>Un Verano Sin Ti</em>. A setlist poster from their exact show is the most personal thing you can
          give them — specific to their night, their city, their songs. Instant digital download means you can
          order it and print it without waiting. <em>Un regalo perfecto.</em>
        </p>

        {/* Closing */}
        <h3 className="text-xl font-bold text-white mt-10 mb-3">Ese concierto merece estar en tu pared.</h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          Whether it was Un Verano Sin Ti in San Juan or Most Wanted in Madrid — that concert deserves to be on
          your wall. Create your <strong>Bad Bunny setlist poster</strong> at setlistart.ink and keep the memory
          somewhere you'll see it every day.
        </p>
      </article>
    </BlogLayout>
  );
};
