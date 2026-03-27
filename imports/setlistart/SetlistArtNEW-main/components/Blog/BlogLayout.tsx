import React from 'react';
import { Music2 } from 'lucide-react';

interface BlogLayoutProps {
  children: React.ReactNode;
  bottomCtaLabel: string;
}

export const CtaButton: React.FC<{ label: string }> = ({ label }) => (
  <div className="my-10 text-center">
    <a
      href="/"
      className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-all shadow-lg hover:shadow-brand-500/25"
    >
      {label}
    </a>
  </div>
);

export const BlogLayout: React.FC<BlogLayoutProps> = ({ children, bottomCtaLabel }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
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
      <main className="max-w-3xl mx-auto px-6 py-12 pb-6">
        {children}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-all shadow-lg hover:shadow-brand-500/25"
          >
            {bottomCtaLabel}
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© SetlistArt · setlistart.ink</span>
          <div className="flex gap-4">
            <a href="/terms" className="hover:text-slate-300 transition-colors">Terms &amp; Conditions</a>
            <span>·</span>
            <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
