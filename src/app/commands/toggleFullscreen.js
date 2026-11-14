export const toggleFullscreen = (app) => async () => {
  const { fullscreen } = app.services;
  if (!fullscreen) return;
  try {
    await fullscreen.toggle();
  } catch {
    return;
  }
};