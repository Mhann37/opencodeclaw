import React, { useEffect, useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import { Song, ConcertDetails, DesignConfig, PrintSize, FontStyle } from '../../types';
import { CanvasPreview } from '../CanvasPreview';
import { ACCENT_COLORS } from '../../constants';
import { Download, ChevronLeft, Type, Palette, Layout, Sun, Loader2, CheckCircle } from 'lucide-react';
import { renderSetlistToCanvas } from '../../services/layoutEngine';

// Native file download helper to avoid dependency issues
const saveAs = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

interface Props {
  songs: Song[];
  details: ConcertDetails;
  onBack: () => void;
  songsFromApi?: boolean;
}

export const Visualizer: React.FC<Props> = ({ songs, details, onBack, songsFromApi }) => {
  const [config, setConfig] = useState<DesignConfig>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment') === 'success') {
        try {
          const saved = localStorage.getItem('setlistart_pending_purchase');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.config) return parsed.config;
          }
        } catch {}
      }
    }
    return {
      size: PrintSize.A3,
      fontStyle: FontStyle.MODERN,
      isDarkMode: true,
      accentColor: ACCENT_COLORS[1],
      showBorder: true,
    };
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fulfilment mode toggle via URL: ?mode=fulfilment
  const isFulfilmentMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const mode = new URLSearchParams(window.location.search).get('mode');
    return (mode ?? '').toLowerCase() === 'fulfilment';
  }, []);

  // Detect payment success from Stripe redirect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      setPaymentSuccess(true);
      // Clear saved state now that we've successfully returned
      try { localStorage.removeItem('setlistart_pending_purchase'); } catch {}
      // Clean up the URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const handleCanvasReady = (canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const zip = new JSZip();
      const sizes = Object.values(PrintSize);
      const tempCanvas = document.createElement('canvas');

      for (const size of sizes) {
        const tempConfig = { ...config, size: size as PrintSize };
        renderSetlistToCanvas(tempCanvas, songs, details, tempConfig);

        const blob = await new Promise<Blob | null>((resolve) =>
          tempCanvas.toBlob(resolve, 'image/jpeg', 0.95)
        );

        if (blob) {
          zip.file(`setlist-${details.artist}-${size}.jpg`, blob);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${details.artist}-setlist-print-pack.zip`);

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'download_setlist_zip', {
          event_category: 'engagement',
          event_label: details.artist || 'unknown',
          value: songs.length,
        });
      }
    } catch (e) {
      console.error('Export failed', e);
      alert('Failed to create export zip.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCheckout = async () => {
    if (isCheckingOut) return;
    setIsCheckingOut(true);

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_stripe_checkout', {
        event_category: 'engagement',
        event_label: details.artist || 'unknown',
        value: songs.length,
      });
    }

    try {
      const res = await fetch('/api/create-checkout-session', { method: 'POST' });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to start checkout');
      }

      // Save state to localStorage so it can be restored after Stripe redirect
      try {
        localStorage.setItem('setlistart_pending_purchase', JSON.stringify({
          details,
          songs,
          songsFromApi: songsFromApi || false,
          config,
        }));
      } catch {}

      window.location.href = data.url;
    } catch (e: any) {
      console.error('Checkout failed', e);
      alert(e.message || 'Unable to start checkout. Please try again.');
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[100dvh] w-full bg-slate-50 overflow-y-auto lg:overflow-hidden">
      {/* LEFT PANEL: Controls */}
      <div className="w-full lg:w-96 bg-white border-r border-slate-200 flex flex-col z-10 shadow-xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <h2 className="text-xl font-bold">Design Studio</h2>
          <button onClick={onBack} className="text-slate-400 hover:text-white" disabled={isExporting}>
            <ChevronLeft />
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto p-6 space-y-8 ${isExporting ? 'opacity-60 pointer-events-none' : ''}`}>
          {/* Theme Mode */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sun className="w-3 h-3" /> Theme
            </label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setConfig({ ...config, isDarkMode: false })}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  !config.isDarkMode ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setConfig({ ...config, isDarkMode: true })}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  config.isDarkMode ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Type className="w-3 h-3" /> Typography
            </label>

            <div className="grid grid-cols-2 gap-2">
              {Object.values(FontStyle).map((style) => (
                <button
                  key={style}
                  onClick={() => setConfig({ ...config, fontStyle: style as FontStyle })}
                  className={`px-3 py-2 text-sm border rounded-lg transition-all text-left text-slate-900 ${
                    config.fontStyle === style
                      ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Palette className="w-3 h-3" /> Accent Color
            </label>
            <div className="flex flex-wrap gap-3">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setConfig({ ...config, accentColor: color })}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    config.accentColor === color ? 'border-slate-900 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Layout Options */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layout className="w-3 h-3" /> Options
            </label>
            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
              <input
                type="checkbox"
                checked={config.showBorder}
                onChange={(e) => setConfig({ ...config, showBorder: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span className="text-sm font-medium text-slate-700">Show Decorative Border</span>
            </label>
          </div>

          <div className="p-4 bg-blue-50 text-blue-800 text-xs rounded-lg leading-relaxed">
            <strong>Designer Note:</strong> Your poster is looking great — customise the colours, font and style until it's perfect.
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-200 bg-white">
          {!isFulfilmentMode && (
            <div className="mb-4 border-t border-slate-200 pt-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <span className="text-green-400">✔</span> Instant download
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <span className="text-green-400">✔</span> 4 sizes included
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <span className="text-green-400">✔</span> Personal use forever
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <span className="text-green-400">✔</span> Secure payment
                </span>
              </div>
            </div>
          )}
          {!isFulfilmentMode && (
            <div className="mb-3 text-center">
              <p className="text-white text-lg font-semibold mb-1">Your poster is ready.</p>
              <p className="text-slate-400 text-sm mb-4">Download your full print-ready pack — all sizes included.</p>
            </div>
          )}

          {isFulfilmentMode ? (
            <button
              onClick={handleExport}
              disabled={isExporting}
              className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-bold shadow-lg transition-all transform active:translate-y-0 ${
                isExporting
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-1'
              }`}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Preparing files…</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Generate ZIP (Fulfilment)</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-bold shadow-lg transition-all transform active:translate-y-0 ${
                isCheckingOut
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 text-white hover:-translate-y-1'
              }`}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Redirecting…</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download for A$7.99 →</span>
                </>
              )}
            </button>
          )}

          {!isFulfilmentMode && (
            <p className="text-xs text-slate-500 text-center mt-2">
              ✓ Instant download &nbsp;✓ 4 sizes included &nbsp;✓ 300 DPI print-ready
            </p>
          )}

          <p className="text-center text-xs text-slate-400 mt-3">
            {isFulfilmentMode
              ? 'Fulfilment mode: generate the high-res ZIP for this order.'
              : 'Secure checkout via Stripe. No account needed.'}
          </p>

          {/* Footer Links */}
          <div className="mt-4 flex gap-4 justify-center text-xs text-slate-400">
            <a href="/terms" className="hover:text-slate-300 transition-colors">Terms &amp; Conditions</a>
            <span className="text-slate-500">•</span>
            <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Canvas Preview */}
      <div className="flex-1 bg-slate-200/50 relative flex flex-col min-h-0">
        {/* Payment success banner */}
        {paymentSuccess && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
            <div className="relative z-10 bg-white border border-slate-200 rounded-2xl shadow-2xl px-8 py-8 max-w-md w-[90%] text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <p className="text-slate-900 text-lg font-bold mb-2">Payment confirmed</p>
              <p className="text-slate-600 text-sm mb-6">Your high-res files are ready to download.</p>
              <button
                onClick={() => { setPaymentSuccess(false); handleExport(); }}
                disabled={isExporting}
                className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-bold shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing files…</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download Your Print Pack</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Export overlay */}
        {isExporting && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
            <div className="relative z-10 bg-white/90 border border-slate-200 rounded-2xl shadow-2xl px-6 py-5 max-w-sm w-[90%] text-center">
              <div className="flex items-center justify-center mb-3">
                <Loader2 className="w-5 h-5 animate-spin text-slate-700" />
              </div>
              <p className="text-slate-900 font-semibold">Generating your print pack</p>
              <p className="text-slate-600 text-sm mt-1">Rendering high-res files and zipping them up…</p>
            </div>
          </div>
        )}

        <div className="flex-1 p-6 lg:p-12 overflow-hidden flex flex-col items-center justify-center">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Setlist. Reimagined.</h2>
            <p className="text-sm text-slate-600 mt-1">A clean, printable record of the night.</p>
          </div>

          <CanvasPreview songs={songs} details={details} config={config} onCanvasReady={handleCanvasReady} />

          {songsFromApi && (
            <p className="text-xs text-slate-500 mt-4">
              Setlist data from{' '}
              <a href="https://www.setlist.fm" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">
                setlist.fm
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
