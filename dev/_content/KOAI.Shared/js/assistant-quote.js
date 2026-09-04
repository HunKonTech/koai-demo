// What the user has highlighted inside one chat message, and the two offers to quote it: a pill
// that follows the selection, and the message's own context menu.
//
// Blazor cannot see a selection: it is browser state that lives outside the component tree and
// changes without any event the framework tracks. So this script watches it and tells the view
// when the answer changes — once per settled selection, never per caret move, and never mid-drag.
//
// Addressed by element id rather than by a captured reference: the feed is a list that grows,
// and @ref would mean one field per message for a value only ever read on a click.
window.koaiAssistantQuote = (() => {
  // Every message bubble carries `assistant-msg-<id>` and nothing else in the document does, so
  // this is both "is the selection inside a message" and "which message".
  const MESSAGE = '[id^="assistant-msg-"]';
  const ID_PREFIX = 'assistant-msg-';

  // The controls that act on a selection. Pressing one is not the user moving on — it is the one
  // press during which the highlight has to survive, so it must not clear what is remembered.
  const AFFORDANCE = '[data-koai-quote]';

  // Above the highlight normally; underneath it when the highlight starts too close to the top of
  // the window for a pill to fit there. The gap itself is in the stylesheet, with the transform.
  const NO_ROOM_ABOVE = 64;

  // The pill is centred on the highlight, so this much of it would hang off a window edge if the
  // highlight sat right against one.
  const EDGE_MARGIN = 72;

  let view = null;        // the AssistantView that asked to be told
  let remembered = null;  // {elementId, text} — outlives the click that collapses the selection
  let announced = null;   // what the view was last told, so an unchanged answer is not re-sent
  let pressedQuote = false; // the last press landed on a control that acts on the highlight
  let frame = 0;

  const enclosing = (node) => {
    const el = node instanceof Element ? node : node && node.parentElement;
    return el && el.closest ? el.closest(MESSAGE) : null;
  };

  // The highlighted text, but only when the whole selection sits inside one single message. A
  // selection dragged out of a bubble and on across the feed would otherwise be quoted under that
  // one message's name, carrying half the conversation with it.
  function reading() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const host = enclosing(range.startContainer);
    if (!host || host !== enclosing(range.endContainer)) return null;

    const text = (selection.toString() || '').trim();
    if (!text) return null;

    return { host, text, rect: range.getBoundingClientRect() };
  }

  // The text is compared but never sent: it is what tells one highlight from the next, and the view
  // reads the live highlight again at the click anyway. Sending it would be a copy of the passage
  // marshalled across on every drag, to be thrown away.
  function same(a, b) {
    if (!a || !b) return a === b;
    return a.messageId === b.messageId && a.text === b.text && a.below === b.below &&
           Math.round(a.x) === Math.round(b.x) && Math.round(a.y) === Math.round(b.y);
  }

  function announce(state) {
    if (!view || same(state, announced)) return;
    announced = state;

    const call = state
      ? view.invokeMethodAsync('OnSelectionOffered', state.messageId, state.x, state.y, state.below)
      : view.invokeMethodAsync('OnSelectionWithdrawn');

    // The view being gone is the ordinary way this ends — the conversation was closed while a
    // selection was still standing. There is nothing to recover, and nothing worth logging.
    if (call && call.catch) call.catch(() => {});
  }

  function settle() {
    const found = reading();
    if (!found) {
      // The highlight is gone. What was remembered of it outlives that only when the press that
      // took it away was a press on one of the controls that acts on it — that press is on its way
      // to asking for the passage. Any other way of losing it means the user has moved on, and
      // answering the next "quote what I highlighted" with it would quote something they are no
      // longer looking at.
      if (!pressedQuote) remembered = null;
      announce(null);
      return;
    }

    pressedQuote = false;
    remembered = { elementId: found.host.id, text: found.text };

    const rect = found.rect;
    const below = rect.top < NO_ROOM_ABOVE;
    const centre = rect.left + rect.width / 2;

    announce({
      messageId: found.host.id.slice(ID_PREFIX.length),
      text: found.text,
      x: Math.min(Math.max(centre, EDGE_MARGIN), window.innerWidth - EDGE_MARGIN),
      y: below ? rect.bottom : rect.top,
      below,
    });
  }

  // Selections are dragged, and a drag is a stream of events. Coalescing them into a frame is what
  // keeps this one interop call per settled selection rather than one per pixel of movement.
  //
  // Re-requested rather than guarded by a flag: a window with no frames to draw — minimised, or a
  // background tab — never runs the callback, and a flag would then be stuck set and every later
  // selection silently ignored. The end of a gesture calls settle() outright for the same reason.
  function schedule() {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => { frame = 0; settle(); });
  }

  function onPointerDown(e) {
    // Pressing one of these is not the user moving on: it is the click the highlight has to survive,
    // and on some engines the press collapses it before the click is ever delivered.
    pressedQuote = !!(e.target && e.target.closest && e.target.closest(AFFORDANCE));

    // A right-click is how the context menu opens. Landing inside a highlight keeps it — which is
    // the highlight the menu is about to offer — and landing outside collapses it, which settle()
    // then reads as the user having moved on.
    if (e.button === 2 || pressedQuote) return;

    remembered = null;
    announce(null);
  }

  // A pointer or a key coming back up is a gesture finishing, and the selection it leaves behind is
  // the final one — worth reading straight away rather than waiting for a frame that a window with
  // nothing to draw will never run. Everything else is a stream, and goes through the frame.
  const listeners = [
    ['selectionchange', schedule, false, () => document],
    ['pointerup', settle, false, () => document],
    ['keyup', settle, false, () => document],
    ['pointerdown', onPointerDown, true, () => document],
    ['scroll', schedule, true, () => document],
    ['resize', schedule, false, () => window],
  ];

  return {
    // Starts telling `dotNetRef` what is highlighted. Idempotent: watching twice
    // replaces the first watcher rather than doubling every event.
    watch(dotNetRef) {
      this.unwatch();
      view = dotNetRef;
      for (const [name, handler, capture, target] of listeners) {
        target().addEventListener(name, handler, capture);
      }
    },

    unwatch() {
      for (const [name, handler, capture, target] of listeners) {
        target().removeEventListener(name, handler, capture);
      }
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      view = null;
      announced = null;
      remembered = null;
      pressedQuote = false;
    },

    // Returns the highlighted text if the whole selection sits inside `el`, and "" otherwise —
    // including the ordinary case of nothing being selected at all, which the caller reads as
    // "quote the message as a whole".
    //
    // Falls back to the last highlight seen in that same element, because pressing a button is
    // enough to collapse a selection on some engines: without the fallback, "quote what I
    // highlighted" would reliably quote everything but.
    selectionIn(elementId) {
      const found = reading();
      if (found) return found.host.id === elementId ? found.text : '';
      return remembered && remembered.elementId === elementId ? remembered.text : '';
    },

    // Called once the highlight has been quoted: it has been acted on, so it stops being offered.
    consume() {
      const selection = window.getSelection();
      if (selection && selection.removeAllRanges) selection.removeAllRanges();
      remembered = null;
      pressedQuote = false;
      announce(null);
    },

    // Puts `text` on the clipboard. Written here rather than through a platform service because
    // only the MAUI head has one, and the chat is the same chat in the browser heads.
    async copyText(text) {
      if (!text) return false;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch {
        // Denied or unavailable — the old command below still works in a WebView.
      }

      const staging = document.createElement('textarea');
      staging.value = text;
      staging.setAttribute('readonly', '');
      staging.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(staging);
      staging.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      staging.remove();
      return copied;
    },
  };
})();
