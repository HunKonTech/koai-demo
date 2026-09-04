// Keeps a textarea's highlight backdrop aligned with the textarea itself.
//
// A <textarea> can't render styled spans, so the directive highlights are painted on a
// div sitting behind it with identical typography and transparent text. The one thing
// CSS can't keep in sync is scrolling: once the text is taller than the box, the
// textarea scrolls but the backdrop doesn't, and the marks drift off their words.
window.koaiDirectiveHighlighter = (() => {
  const attached = new WeakMap();

  function sync(textarea, backdrop) {
    backdrop.scrollTop = textarea.scrollTop;
    backdrop.scrollLeft = textarea.scrollLeft;
  }

  return {
    attach(textarea, backdrop) {
      if (!textarea || !backdrop || attached.has(textarea)) return;

      const onScroll = () => sync(textarea, backdrop);
      textarea.addEventListener('scroll', onScroll, { passive: true });
      attached.set(textarea, onScroll);
      sync(textarea, backdrop);
    },

    detach(textarea) {
      const onScroll = attached.get(textarea);
      if (!onScroll) return;
      textarea.removeEventListener('scroll', onScroll);
      attached.delete(textarea);
    }
  };
})();
