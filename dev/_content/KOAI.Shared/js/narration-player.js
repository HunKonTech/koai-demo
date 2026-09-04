window.koaiNarrationPlayer = (() => {
  const handlers = new WeakMap();
  const objectUrls = new WeakMap();
  const webAudio = new WeakMap();

  function finite(value, fallback = 0) {
    return Number.isFinite(value) ? value : fallback;
  }

  function clampRate(rate) {
    return Math.max(1, Math.min(2, Number(rate) || 1));
  }

  function notify(audio, dotNet) {
    if (!dotNet) return;
    const duration = audioDuration(audio);
    dotNet.invokeMethodAsync(
      "OnAudioStateChanged",
      finite(audio.currentTime),
      duration,
      !audio.paused,
      duration > 0
    );
  }

  function audioDuration(audio) {
    const nativeDuration = finite(audio.duration, 0);
    if (nativeDuration > 0) return nativeDuration;
    const state = webAudio.get(audio);
    return finite(state?.duration, 0);
  }

  function notifyState(audio, state) {
    if (!state?.dotNet) return;
    state.dotNet.invokeMethodAsync(
      "OnAudioStateChanged",
      currentBufferTime(state),
      finite(state.buffer?.duration, 0),
      Boolean(state.playing),
      Boolean(state.buffer)
    );
  }

  function clampTime(audio, seconds) {
    const duration = audioDuration(audio);
    const max = duration > 0 ? duration : Number.MAX_SAFE_INTEGER;
    return Math.max(0, Math.min(max, seconds));
  }

  function clampBufferTime(state, seconds) {
    const duration = finite(state.buffer?.duration, 0);
    return Math.max(0, Math.min(duration, Number(seconds) || 0));
  }

  function currentBufferTime(state) {
    if (!state?.buffer) return 0;
    if (!state.playing) return clampBufferTime(state, state.offset);
    return clampBufferTime(
      state,
      state.offset + (state.context.currentTime - state.startedAt) * state.rate
    );
  }

  function ensureAudioContext(state) {
    if (state.context) return state.context;
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) throw new Error("Web Audio API is not available.");
    state.context = new AudioContextCtor();
    return state.context;
  }

  function clearTicker(state) {
    if (state?.ticker) {
      window.clearInterval(state.ticker);
      state.ticker = null;
    }
    if (state?.scheduler) {
      window.clearInterval(state.scheduler);
      state.scheduler = null;
    }
  }

  function stopSource(state, keepPosition) {
    if (keepPosition) state.offset = currentBufferTime(state);
    if (state?.source) {
      const source = state.source;
      state.source = null;
      source.onended = null;
      try { source.stop(); } catch { }
    }
    if (state?.sources) {
      state.sources.forEach((source) => {
        source.onended = null;
        try { source.stop(); } catch { }
      });
      state.sources.clear();
    }
  }

  function resetWebAudio(audio) {
    const state = webAudio.get(audio);
    if (!state) return;
    clearTicker(state);
    stopSource(state, false);
    state.playing = false;
    state.offset = 0;
    state.buffer = null;
    state.duration = 0;
    state.nativeSource = false;
  }

  // The media element is the only web path that time-stretches the way the desktop
  // player does (AVAudioUnitTimePitch): faster speech, same voice. Everything else
  // here exists for the case where the element refuses the file.
  function supportsPitchPreservation(audio) {
    return "preservesPitch" in audio
      || "webkitPreservesPitch" in audio
      || "mozPreservesPitch" in audio;
  }

  function setNativePitchPreserving(audio, rate) {
    const nextRate = clampRate(rate);
    audio.preservesPitch = true;
    audio.webkitPreservesPitch = true;
    audio.mozPreservesPitch = true;
    audio.playbackRate = nextRate;
  }

  // Decodes the blob the element could not play (or could not play without shifting
  // the pitch) so playback can continue through Web Audio.
  async function switchToWebAudioFallback(audio, state) {
    if (!state) return false;
    if (state.buffer) return true;
    const url = objectUrls.get(audio);
    if (!url) return false;

    try {
      const context = ensureAudioContext(state);
      const encoded = await fetch(url).then((response) => response.arrayBuffer());
      state.buffer = await context.decodeAudioData(encoded);
      state.duration = finite(state.buffer.duration, state.duration);
      state.nativeSource = false;
      state.offset = clampBufferTime(state, finite(audio.currentTime, 0));
      state.playing = false;
      try { audio.pause(); } catch { }
      notifyState(audio, state);
      return true;
    } catch {
      state.buffer = null;
      return false;
    }
  }

  // Web Audio has no time-stretcher of its own, so the buffer is re-assembled from
  // short overlapping grains: the grains are read faster than they are played, which
  // shortens the audio while every grain keeps its original pitch.
  async function startBufferPlayback(audio, state, rate) {
    const context = ensureAudioContext(state);
    if (context.state === "suspended") await context.resume();
    if (!state.buffer) return;

    state.rate = clampRate(rate ?? state.rate);
    stopSource(state, false);
    clearTicker(state);

    state.startedAt = context.currentTime;
    state.playing = true;
    state.sources = state.sources || new Set();
    state.nextOutputTime = context.currentTime + 0.02;
    state.nextInputTime = clampBufferTime(state, state.offset);

    const schedule = () => schedulePitchPreservedGrains(state);
    schedule();
    state.scheduler = window.setInterval(schedule, 40);
    state.ticker = window.setInterval(() => updatePlaybackState(audio, state), 250);
    notifyState(audio, state);
  }

  function schedulePitchPreservedGrains(state) {
    if (!state.playing || !state.buffer) return;
    const context = state.context;
    const duration = state.buffer.duration;
    const horizon = context.currentTime + 0.35;
    const grainDuration = 0.08;
    const outputHop = 0.035;
    const inputHop = outputHop * state.rate;
    const fade = 0.012;

    while (state.nextOutputTime < horizon && state.nextInputTime < duration) {
      const source = context.createBufferSource();
      const gain = context.createGain();
      const grainStart = state.nextOutputTime;
      const inputStart = state.nextInputTime;
      const actualDuration = Math.min(grainDuration, duration - inputStart);
      if (actualDuration <= 0.01) break;

      source.buffer = state.buffer;
      source.playbackRate.value = 1;
      source.connect(gain);
      gain.connect(context.destination);
      gain.gain.setValueAtTime(0, grainStart);
      gain.gain.linearRampToValueAtTime(1, grainStart + Math.min(fade, actualDuration / 3));
      gain.gain.setValueAtTime(1, grainStart + Math.max(fade, actualDuration - fade));
      gain.gain.linearRampToValueAtTime(0, grainStart + actualDuration);

      source.onended = () => state.sources?.delete(source);
      state.sources.add(source);
      source.start(grainStart, inputStart, actualDuration);

      state.nextOutputTime += outputHop;
      state.nextInputTime += inputHop;
    }
  }

  function updatePlaybackState(audio, state) {
    const current = currentBufferTime(state);
    const duration = finite(state.buffer?.duration, 0);
    if (duration > 0 && current >= duration - 0.03) {
      stopSource(state, false);
      clearTicker(state);
      state.offset = 0;
      state.playing = false;
    }
    notifyState(audio, state);
  }

  return {
    attach(audio, dotNet) {
      this.detach(audio);
      const listener = (event) => {
        if (event?.type === "error") {
          // The element cannot demux this container. Decode it ourselves rather than
          // leaving the panel stuck on an episode that never becomes playable.
          void switchToWebAudioFallback(audio, webAudio.get(audio));
          return;
        }
        notify(audio, dotNet);
      };
      const events = ["loadedmetadata", "durationchange", "timeupdate", "play", "pause", "ended", "error"];
      events.forEach((event) => audio.addEventListener(event, listener));
      handlers.set(audio, { listener, events });
      webAudio.set(audio, { dotNet, buffer: null, source: null, sources: new Set(), context: null, offset: 0, rate: 1, startedAt: 0, playing: false, ticker: null, scheduler: null, nativeSource: false, duration: 0 });
      notify(audio, dotNet);
    },

    detach(audio) {
      const existing = handlers.get(audio);
      if (existing) {
        existing.events.forEach((event) => audio.removeEventListener(event, existing.listener));
        handlers.delete(audio);
      }
      resetWebAudio(audio);
      webAudio.delete(audio);
      revokeObjectUrl(audio);
    },

    setSource(audio, source) {
      if (audio.getAttribute("src") === source) return;
      resetWebAudio(audio);
      audio.pause();
      revokeObjectUrl(audio);
      setNativePitchPreserving(audio, 1);
      audio.setAttribute("src", source);
      audio.load();
    },

    async setSourceFromStream(audio, streamRef, mimeType) {
      const state = webAudio.get(audio);
      audio.pause();
      revokeObjectUrl(audio);
      let buffer;
      try {
        buffer = await streamRef.arrayBuffer();
      } catch {
        return;
      }

      if (state) {
        resetWebAudio(audio);
        // Blob metadata is enough for WAV, which is what the renderers emit; the
        // estimate only fills in until the element reports its own duration.
        state.duration = estimateAudioDuration(buffer, mimeType);
        state.offset = 0;
        state.rate = 1;
        state.nativeSource = true;
      }

      const blob = new Blob([buffer], { type: mimeType || "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      objectUrls.set(audio, url);
      setNativePitchPreserving(audio, 1);
      audio.setAttribute("src", url);
      audio.load();
      notify(audio, state?.dotNet);
    },

    async play(audio, rate) {
      const state = webAudio.get(audio);
      const nextRate = clampRate(rate);
      if (state?.buffer) {
        await startBufferPlayback(audio, state, nextRate);
        return;
      }

      // A browser without preservesPitch would raise the voice as it speeds up, which
      // is exactly what the grain player is here to avoid.
      if (nextRate > 1.001 && !supportsPitchPreservation(audio)
        && await switchToWebAudioFallback(audio, state)) {
        await startBufferPlayback(audio, state, nextRate);
        return;
      }

      setNativePitchPreserving(audio, nextRate);
      try {
        await audio.play();
      } catch (error) {
        if (!await switchToWebAudioFallback(audio, state)) throw error;
        await startBufferPlayback(audio, state, nextRate);
        return;
      }
      notify(audio, state?.dotNet);
    },

    pause(audio) {
      const state = webAudio.get(audio);
      if (state?.buffer) {
        state.offset = currentBufferTime(state);
        state.playing = false;
        clearTicker(state);
        stopSource(state, false);
        notifyState(audio, state);
        return;
      }
      audio.pause();
      notify(audio, state?.dotNet);
    },

    seek(audio, seconds) {
      const state = webAudio.get(audio);
      if (state?.buffer) {
        const wasPlaying = state.playing;
        stopSource(state, false);
        clearTicker(state);
        state.playing = false;
        state.offset = clampBufferTime(state, seconds);
        if (wasPlaying) {
          void startBufferPlayback(audio, state, state.rate);
        } else {
          notifyState(audio, state);
        }
        return;
      }
      audio.currentTime = clampTime(audio, Number(seconds) || 0);
      notify(audio, state?.dotNet);
    },

    skip(audio, delta) {
      const state = webAudio.get(audio);
      if (state?.buffer) {
        this.seek(audio, currentBufferTime(state) + (Number(delta) || 0));
        return;
      }
      audio.currentTime = clampTime(audio, finite(audio.currentTime) + (Number(delta) || 0));
      notify(audio, state?.dotNet);
    },

    setRate(audio, rate) {
      const nextRate = clampRate(rate);
      const state = webAudio.get(audio);
      if (state?.buffer) {
        const wasPlaying = state.playing;
        state.offset = currentBufferTime(state);
        stopSource(state, false);
        clearTicker(state);
        state.playing = false;
        state.rate = nextRate;
        if (wasPlaying) {
          void startBufferPlayback(audio, state, nextRate);
          return;
        }
        notifyState(audio, state);
        return;
      }

      if (nextRate > 1.001 && !supportsPitchPreservation(audio)) {
        const wasPlaying = !audio.paused;
        void switchToWebAudioFallback(audio, state).then((ready) => {
          if (ready && wasPlaying) void startBufferPlayback(audio, state, nextRate);
          else if (!ready) setNativePitchPreserving(audio, nextRate);
        });
        return;
      }

      setNativePitchPreserving(audio, nextRate);
      notify(audio, state?.dotNet);
    }
  };

  function estimateAudioDuration(buffer, mimeType) {
    if (String(mimeType || "").toLowerCase().includes("wav"))
      return estimateWavDuration(buffer);
    return 0;
  }

  function estimateWavDuration(buffer) {
    if (!buffer || buffer.byteLength < 44) return 0;
    const view = new DataView(buffer);
    if (readAscii(view, 0, 4) !== "RIFF" || readAscii(view, 8, 4) !== "WAVE")
      return 0;

    let offset = 12;
    let byteRate = 0;
    let dataSize = 0;
    while (offset + 8 <= view.byteLength) {
      const id = readAscii(view, offset, 4);
      const size = view.getUint32(offset + 4, true);
      const body = offset + 8;
      if (id === "fmt " && size >= 16)
        byteRate = view.getUint32(body + 8, true);
      if (id === "data") {
        dataSize = size;
        break;
      }
      offset = body + size + (size % 2);
    }

    return byteRate > 0 && dataSize > 0 ? dataSize / byteRate : 0;
  }

  function readAscii(view, offset, length) {
    let result = "";
    for (let i = 0; i < length; i += 1)
      result += String.fromCharCode(view.getUint8(offset + i));
    return result;
  }

  function revokeObjectUrl(audio) {
    const existing = objectUrls.get(audio);
    if (!existing) return;
    URL.revokeObjectURL(existing);
    objectUrls.delete(audio);
  }
})();
