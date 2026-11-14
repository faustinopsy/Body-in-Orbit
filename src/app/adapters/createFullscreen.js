export function createFullscreen(doc = document) {
  const root = doc.documentElement;
  return {
    isSupported: () => Boolean(doc.fullscreenEnabled && root.requestFullscreen),
    toggle: () => (doc.fullscreenElement ? doc.exitFullscreen() : root.requestFullscreen()),
    onChange(listener) {
      const handler = () => listener(Boolean(doc.fullscreenElement));
      doc.addEventListener('fullscreenchange', handler);
      return () => doc.removeEventListener('fullscreenchange', handler);
    },
  };
}