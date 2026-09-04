// Applies the general settings' colour scheme and UI scale to the document.
//
// This runs from <head>, before the first paint, so the app opens in the OS scheme rather
// than flashing dark on its way to the stored preference — which .NET can only push once
// the database is open, several hundred ms in.
//
// "Auto" is resolved here rather than in the stylesheet: data-theme is always stamped as a
// concrete light/dark, which keeps koai.css down to one set of light overrides instead of
// repeating them under a prefers-color-scheme query. The media listener below is what
// makes Auto live — the OS can flip the app mid-session with no round trip through .NET.
//
// --ui-zoom drives a zoom on <html>. The type scale alone wouldn't cover it: a good deal
// of the UI sets px sizes inline, and zoom is the one lever that scales those too. On the
// root element the initial containing block is divided by the zoom, so the shell still
// fills the window exactly — the same thing browser page zoom does.
window.koaiAppearance = (() => {
  const THEMES = ['auto', 'light', 'dark'];
  const media = window.matchMedia('(prefers-color-scheme: light)');
  let preference = 'auto';

  function stamp() {
    const scheme = preference === 'auto' ? (media.matches ? 'light' : 'dark') : preference;
    document.documentElement.dataset.theme = scheme;

    // Lets the WebView render native form controls and scrollbars to match, instead of
    // leaving them dark over a light page.
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = preference === 'auto' ? 'light dark' : scheme;
  }

  media.addEventListener('change', () => { if (preference === 'auto') stamp(); });
  stamp();

  return {
    apply(theme, scale) {
      preference = THEMES.includes(theme) ? theme : 'auto';
      stamp();

      const zoom = Number(scale);
      document.documentElement.style.setProperty('--ui-zoom', zoom > 0 ? String(zoom) : '1');
    }
  };
})();
