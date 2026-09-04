// Keeps the research log pinned to its newest entry: every new entry scrolls down to it,
// unless the reader has scrolled up, in which case they're left where they are.
//
// The log renders oldest-first, so opening a job lands on entries from the start of the
// run instead of what just happened. Blazor has no scroll API, and a one-shot scroll from
// OnAfterRender wouldn't hold either: the browsing cards load their screenshots after the
// DOM settles, and every late image pushes the newest entry back below the fold. Hence the
// observers — they re-pin whenever the content's height actually changes.
//
// The log grows freely and the chat feed around it scrolls, so the scroller is resolved
// per call from the nearest scrolling ancestor rather than assumed to be the log box
// itself. scrollIntoView would look like the
// obvious tool here and is deliberately not used: it does nothing through the log panel's
// overflow:hidden wrapper, and it would target the bottom of the feed anyway, scrolling
// past the log into the summary and Q&A that sit below it.
window.koaiLogAutoscroll = (() => {
  const attached = new WeakMap();

  // How far the log's end may sit below the fold and still count as "not scrolled up" —
  // covers the sub-pixel drift and the odd half-visible row.
  const END_SLACK_PX = 60;

  function scrollParent(el) {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const overflowY = getComputedStyle(n).overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') && n.scrollHeight > n.clientHeight + 1)
        return n;
    }
    return document.scrollingElement || document.documentElement;
  }

  // How far the log's last entry sits below the scroller's bottom edge: positive means
  // it's off the fold, negative means it's above — the reader has scrolled past the log.
  function overflowBelow(el, parent) {
    const last = el.lastElementChild;
    if (!last) return 0;
    const isRoot = parent === document.scrollingElement || parent === document.documentElement;
    const viewTop = isRoot ? 0 : parent.getBoundingClientRect().top;
    return last.getBoundingClientRect().bottom - (viewTop + parent.clientHeight);
  }

  // allowUp is for opening a log, where landing on the end is the whole point. A new entry
  // arriving passes it as false: chasing the end upwards would drag a reader out of the
  // Q&A thread below the log, and down is the only direction growth ever needs.
  function toBottom(el, allowUp) {
    const parent = scrollParent(el);
    let delta = overflowBelow(el, parent);
    if (!allowUp) delta = Math.max(0, delta);
    const target = parent.scrollTop + delta;
    parent.scrollTop = Math.max(0, Math.min(target, parent.scrollHeight - parent.clientHeight));
  }

  // Following is derived from where the view sits rather than from tracking gestures:
  // only the reader having scrolled up — leaving the log's end below the fold — stops it.
  // Scrolling down past the log doesn't, because toBottom() won't pull them back up.
  function scrolledUpAway(el) {
    return overflowBelow(el, scrollParent(el)) > END_SLACK_PX;
  }

  return {
    // el: the log container whose children are the entries.
    attach(el) {
      if (!el || attached.has(el)) return;

      const state = { follow: true };

      // Switching to the summary tab, or closing the job, drops this container from the
      // page. The scroll listener below is the one thing that would outlive it: document
      // holds the callback, the callback holds the container, so the whole detached log
      // would sit in memory for the life of the page. Hence the liveness check on both
      // entry points — whichever fires first after the removal tears the rest down.
      const gone = () => {
        if (document.contains(el)) return false;
        state.observers.forEach(o => o.disconnect());
        document.removeEventListener('scroll', onScroll, { capture: true });
        attached.delete(el);
        return true;
      };

      // Capture phase: a scroll event doesn't bubble, and which element raises it depends
      // on the layout. Where the view sits is sampled here rather than in repin() because
      // by then the content has already grown and moved the log's end off screen.
      // Scrollers that don't hold the log (the sidebar, the history list) are skipped —
      // measuring on every scroll tick anywhere in the app would force a reflow each time.
      function onScroll(e) {
        if (gone()) return;
        const scroller = e.target;
        if (scroller === document || scroller === window || scroller.contains?.(el))
          state.follow = !scrolledUpAway(el);
      }
      document.addEventListener('scroll', onScroll, { capture: true, passive: true });

      const repin = () => {
        if (gone()) return;
        if (state.follow) toBottom(el, false);
      };

      const mutations = new MutationObserver(repin);
      mutations.observe(el, { childList: true, subtree: true });
      const resizes = new ResizeObserver(repin);
      resizes.observe(el);
      state.observers = [mutations, resizes];

      attached.set(el, state);
      toBottom(el, true);
    },

    // Re-arm following and jump to the newest entry — for opening another job into a
    // container that is already attached.
    pin(el) {
      const state = attached.get(el);
      if (!state) return;
      state.follow = true;
      toBottom(el, true);
    },

    // Back to the top of whatever scrolls el. The log and the summary share one scroller,
    // so without this the summary would open at the depth the log had been chased down to.
    toTop(el) {
      if (el) scrollParent(el).scrollTop = 0;
    }
  };
})();
