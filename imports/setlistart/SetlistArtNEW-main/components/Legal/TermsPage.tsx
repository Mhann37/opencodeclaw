import React from 'react';
import { Music2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Music2 className="w-6 h-6 text-brand-500" />
            <span className="text-lg font-black tracking-tight text-white">SetlistArt</span>
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 pb-20">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: February 2026</p>

        <div className="space-y-10 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              SetlistArt (<strong className="text-white">setlistart.ink</strong>) is an independent project operated
              by an individual based in Australia. By accessing or using SetlistArt, or by purchasing a digital
              download, you agree to be bound by these Terms &amp; Conditions. If you do not agree to these terms,
              please do not use the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. The Product</h2>
            <p>
              SetlistArt provides a free online tool that allows you to create personalised concert setlist poster
              artwork. You may customise the design with your artist name, venue, date and setlist, then preview it
              live in your browser at no charge.
            </p>
            <p className="mt-3">
              Upon payment, you will receive a pack of <strong className="text-white">four high-resolution JPG
              files</strong> (300 DPI) in the following sizes: A4 (210 × 297 mm), A3 (297 × 420 mm), 6 × 8 in,
              and 11 × 14 in. Files are delivered digitally and are available for immediate download. No physical
              product is produced or shipped.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Pricing</h2>
            <p>
              All prices are displayed in Australian Dollars (AUD) and include any applicable taxes. Payment is
              processed securely by <strong className="text-white">Stripe</strong>. SetlistArt does not store or
              have access to your payment card details at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Digital Downloads &amp; Refunds</h2>
            <p>
              Under Australian Consumer Law (ACL), you are entitled to a remedy if a product has a major fault.
              However, because digital files are delivered immediately upon payment and cannot be "returned" in the
              traditional sense, <strong className="text-white">all sales are final once the download has been
              initiated</strong>.
            </p>
            <p className="mt-3">
              Refunds are not available for change of mind.
            </p>
            <p className="mt-3">
              If you experience a technical fault that prevents you from accessing or downloading your files, please
              contact us at <a href="mailto:setlistart@gmail.com" className="text-brand-400 underline hover:text-brand-300">setlistart@gmail.com</a> and
              we will resolve the issue promptly at no additional charge.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Intellectual Property</h2>
            <p>
              The SetlistArt layout engine, poster designs, software, and visual assets are the intellectual
              property of SetlistArt. Setlist data is sourced from the setlist.fm API and is attributed accordingly.
            </p>
            <p className="mt-3">
              Files purchased through SetlistArt are licensed for{' '}
              <strong className="text-white">personal, non-commercial use only</strong>. You may print your
              purchased files for personal display or as a personal gift. You may not:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-slate-400">
              <li>Resell or redistribute the files or printed copies for commercial gain</li>
              <li>Claim the designs as your own original work</li>
              <li>Sub-license, re-licence or transfer the files to third parties for commercial purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Acceptable Use</h2>
            <p>
              The free SetlistArt tool may not be used for any unlawful purpose or in violation of any applicable
              laws. SetlistArt is not affiliated with any artist, band, venue, record label, event promoter or
              ticketing company. All artist names and concert details are entered by the user.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Disclaimer</h2>
            <p>
              SetlistArt is an independent design tool and is provided "as is." Setlist accuracy depends entirely on
              the data available on setlist.fm and the information entered by the user. SetlistArt is not responsible
              for errors, omissions or inaccuracies in setlist data. We make no warranties regarding the suitability
              of the product for any particular purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Changes to These Terms</h2>
            <p>
              We may update these Terms &amp; Conditions at any time without prior notice. The current version will
              always be available at{' '}
              <a href="/terms" className="text-brand-400 underline hover:text-brand-300">setlistart.ink/terms</a>.
              Continued use of the site or purchase of a download after any changes constitutes your acceptance of
              the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Contact</h2>
            <p>
              For any queries relating to these terms, please contact us at{' '}
              <a href="mailto:setlistart@gmail.com" className="text-brand-400 underline hover:text-brand-300">
                setlistart@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Governing Law</h2>
            <p>
              These Terms &amp; Conditions are governed by and construed in accordance with the laws of Australia.
              Any disputes arising in connection with these terms shall be subject to the jurisdiction of the
              Australian courts.
            </p>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-14 pt-8 border-t border-slate-800">
          <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to SetlistArt
          </a>
        </div>
      </main>
    </div>
  );
};
