type TrackParams = Record<string, any>;

export function track(eventName: string, params?: TrackParams) {
  try {
    const gtag = (globalThis as any)?.gtag;
    if (typeof gtag !== 'function') return;
    // microtask keeps analytics from ever interfering with UI flow
    queueMicrotask(() => {
      try {
        gtag('event', eventName, params || {});
      } catch {
        // ignore
      }
    });
  } catch {
    // ignore
  }
}
