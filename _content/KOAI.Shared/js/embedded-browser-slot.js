// Reports the on-screen rectangle of the embedded-browser dock area back to .NET
// so the native WebView can be positioned over it (instead of a full-screen modal).
//
// The rectangle is getBoundingClientRect() in CSS pixels relative to the app
// viewport, which maps 1:1 onto MAUI device-independent units for the overlay.
window.koaiEmbeddedBrowserSlot = (function () {
    let element = null;
    let dotnet = null;
    let resizeObserver = null;
    let rafPending = false;
    let last = null;

    function report() {
        rafPending = false;
        if (!element || !dotnet) return;

        const r = element.getBoundingClientRect();
        const next = { x: r.left, y: r.top, w: r.width, h: r.height };

        // Skip sub-pixel jitter to avoid a flood of interop calls while scrolling.
        if (last &&
            Math.abs(last.x - next.x) < 0.5 &&
            Math.abs(last.y - next.y) < 0.5 &&
            Math.abs(last.w - next.w) < 0.5 &&
            Math.abs(last.h - next.h) < 0.5) {
            return;
        }
        last = next;

        try {
            dotnet.invokeMethodAsync('OnBoundsChanged', next.x, next.y, next.w, next.h);
        } catch {
            // .NET reference disposed mid-scroll — stop() will clean up.
        }
    }

    function schedule() {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(report);
    }

    function start(el, dotnetRef) {
        stop();
        element = el;
        dotnet = dotnetRef;
        last = null;

        resizeObserver = new ResizeObserver(schedule);
        resizeObserver.observe(element);

        window.addEventListener('scroll', schedule, true); // capture: catch inner scrollers too
        window.addEventListener('resize', schedule);

        schedule();
    }

    function stop() {
        if (resizeObserver) { resizeObserver.disconnect(); resizeObserver = null; }
        window.removeEventListener('scroll', schedule, true);
        window.removeEventListener('resize', schedule);
        element = null;
        dotnet = null;
        last = null;
        rafPending = false;
    }

    return { start, stop, refresh: schedule };
})();
