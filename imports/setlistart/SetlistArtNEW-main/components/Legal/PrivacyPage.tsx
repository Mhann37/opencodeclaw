import React from 'react';
import { Music2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
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
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: February 2026</p>

        <div className="space-y-10 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              SetlistArt (<strong className="text-white">setlistart.ink</strong>) is committed to protecting your
              privacy. This policy explains what personal information we collect, how we use it, and your rights
              under the <strong className="text-white">Australian Privacy Act 1988</strong> and the Australian
              Privacy Principles (APPs).
            </p>
            <p className="mt-3">
              No account registration is required to use SetlistArt. You can create and preview your poster
              entirely without providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. What Data We Collect</h2>

            <h3 className="text-base font-semibold text-slate-200 mb-2">Email address</h3>
            <p>
              If you purchase a download, your email address is collected by{' '}
              <strong className="text-white">Stripe</strong> during the checkout process. This is used solely for
              payment processing and sending your order confirmation receipt. SetlistArt itself does not receive or
              store your email address or any payment card details.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mt-5 mb-2">Usage and analytics data</h3>
            <p>
              Anonymous usage data — such as pages visited, session duration, and general geographic region — may
              be collected via <strong className="text-white">Google Analytics</strong>. This data cannot be used
              to identify you personally. It is used only to understand how visitors use the site and to improve
              the product.
            </p>

            <h3 className="text-base font-semibold text-slate-200 mt-5 mb-2">Concert details you enter</h3>
            <p>
              Artist names, venues, cities, dates, and song lists that you enter into the tool are processed
              entirely in your browser and are not transmitted to or stored by SetlistArt's servers. This
              information is temporarily stored in your browser's local storage only to restore your design after
              a Stripe payment redirect, and is cleared immediately afterwards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Data</h2>
            <ul className="space-y-2 list-disc list-inside text-slate-400">
              <li>To process your payment securely via Stripe</li>
              <li>To send your order confirmation and receipt (via Stripe)</li>
              <li>To improve the site and user experience via anonymous analytics</li>
            </ul>
            <p className="mt-4">
              We do not use your data for advertising, profiling, or any purpose beyond what is described above.
              We do not sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Third Parties</h2>

            <div className="space-y-5">
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-1">Stripe</h3>
                <p className="text-sm">
                  Payment processing is handled entirely by Stripe. When you click "Download Your Artwork," you
                  are redirected to a Stripe-hosted checkout page. Stripe's own privacy policy governs the data
                  you provide there. We encourage you to review it at{' '}
                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-400 underline hover:text-brand-300">
                    stripe.com/privacy
                  </a>.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-1">setlist.fm</h3>
                <p className="text-sm">
                  When you search for a concert, SetlistArt queries the setlist.fm API on your behalf to retrieve
                  setlist data. Your personal information is not shared with setlist.fm as part of this query.
                  Setlist data is provided for informational purposes and attributed accordingly.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-1">Google Analytics</h3>
                <p className="text-sm">
                  We may use Google Analytics to collect anonymous usage statistics. No personally identifiable
                  information is shared with Google Analytics. You can opt out of Google Analytics tracking by
                  using the{' '}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-400 underline hover:text-brand-300">
                    Google Analytics Opt-out Browser Add-on
                  </a>.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Retention</h2>
            <p>
              SetlistArt does not maintain a customer database. We do not store your personal information on our
              servers. Stripe retains transaction data in accordance with their own privacy policy and applicable
              legal and financial record-keeping obligations. For information about how long Stripe retains your
              data, please refer to{' '}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-400 underline hover:text-brand-300">
                stripe.com/privacy
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Your Rights</h2>
            <p>
              Under the Australian Privacy Act 1988, you have the right to:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-slate-400">
              <li>Request access to any personal information we hold about you</li>
              <li>Request that we correct any inaccurate personal information</li>
              <li>Make a complaint if you believe we have breached the Australian Privacy Principles</li>
            </ul>
            <p className="mt-4">
              As SetlistArt does not store personal data on its own servers, payment-related data requests should
              be directed to Stripe. For any other privacy enquiries, contact us at{' '}
              <a href="mailto:setlistart@gmail.com" className="text-brand-400 underline hover:text-brand-300">
                setlistart@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Cookies</h2>
            <p>
              SetlistArt may use cookies for anonymous analytics purposes only (via Google Analytics). We do not
              use advertising cookies, tracking pixels, or any cookies that identify you personally across other
              websites. You can manage or disable cookies through your browser settings at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Contact</h2>
            <p>
              For any privacy-related queries or to exercise your rights under the Australian Privacy Act, please
              contact us at{' '}
              <a href="mailto:setlistart@gmail.com" className="text-brand-400 underline hover:text-brand-300">
                setlistart@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Changes to This Policy</h2>
            <p>
              This Privacy Policy may be updated from time to time to reflect changes in our practices or legal
              obligations. The current version will always be available at{' '}
              <a href="/privacy" className="text-brand-400 underline hover:text-brand-300">
                setlistart.ink/privacy
              </a>.
              We encourage you to review this page periodically.
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
