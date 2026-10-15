/**
 * "Ver como documental" — the auto-playback state machine.
 *
 * The control walks through three labels and never guesses:
 *   idle    → "Ver como documental"  (aria-pressed=false)
 *   playing → "Pausa"                (aria-pressed=true)
 *   ended   → "Volver a ver"         (aria-pressed=false)
 *
 * It advances the page at 0.4 viewport-heights per second at 1×, and offers
 * 2× and 0.5×. Any manual scroll — wheel, touch or keyboard — stops playback
 * immediately: the reader is always the one in charge. Playback never runs for
 * a reader who asked for reduced motion (see the guard below), and the elapsed
 * time is clamped on every frame so a hidden tab cannot leap down the page.
 *
 * Scrolling itself is delegated to the caller through `hooks`: when Lenis owns
 * the scroller the two must not fight, so this module never touches `window`
 * directly. It asks the owner to move, and the owner decides how.
 */

export interface DocumentaryHooks {
  /** Current scroll position, in pixels. */
  getScroll: () => number;
  /** Move the document to `y`. The owner decides how (Lenis or native). */
  scrollTo: (y: number, options: { immediate: boolean }) => void;
  /** Playback started: the owner may freeze its smooth scroller. */
  onPlay: () => void;
  /** Playback stopped or ended: the owner may release its smooth scroller. */
  onPause: () => void;
}

/** Viewport-heights scrolled per second at 1×. */
const VIEWPORTS_PER_SECOND = 0.4;

/** The speed cycle offered by the speed button. */
const SPEEDS = [1, 2, 0.5] as const;

/** Longest frame we will ever honour, in seconds: a hidden tab cannot leap. */
const MAX_STEP_SECONDS = 0.05;

/** How close to the bottom counts as "the end", in pixels. */
const END_EPSILON = 2;

const LABELS = {
  idle: 'Ver como documental',
  playing: 'Pausa',
  ended: 'Volver a ver',
} as const;

type State = keyof typeof LABELS;

/** Keys that mean the reader is scrolling by hand. */
const SCROLL_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' ',
  'Spacebar',
]);

export function initDocumentary(hooks: DocumentaryHooks): void {
  if (typeof window === 'undefined') return;

  // A reader who asked for less motion gets no auto-playback at all. The bar
  // already explains this in markup; nothing here should override that.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const playButton = document.querySelector<HTMLButtonElement>('[data-doc-play]');
  const playText = document.querySelector<HTMLElement>('[data-doc-play-text]');
  const speedButton = document.querySelector<HTMLButtonElement>('[data-doc-speed]');
  const speedText = document.querySelector<HTMLElement>('[data-doc-speed-text]');
  if (!playButton || !playText || !speedButton || !speedText) return;

  let state: State = 'idle';
  let speedIndex = 0;
  let frameId = 0;
  let last = 0;

  const maxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  const render = () => {
    playText.textContent = LABELS[state];
    playButton.setAttribute('aria-pressed', state === 'playing' ? 'true' : 'false');
  };

  const stop = (next: State) => {
    state = next;
    if (frameId) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    }
    hooks.onPause();
    render();
  };

  const frame = (now: number) => {
    // Clamp first, always: a hidden tab or a long frame must never be honoured
    // as real elapsed time.
    const step = Math.min(MAX_STEP_SECONDS, (now - last) / 1000);
    last = now;

    if (!document.hidden) {
      const limit = maxScroll();
      const next =
        hooks.getScroll() +
        window.innerHeight * VIEWPORTS_PER_SECOND * SPEEDS[speedIndex] * step;

      if (next >= limit - END_EPSILON) {
        hooks.scrollTo(limit, { immediate: true });
        stop('ended');
        return;
      }

      hooks.scrollTo(next, { immediate: true });
    }

    frameId = window.requestAnimationFrame(frame);
  };

  const start = () => {
    state = 'playing';
    hooks.onPlay();
    render();
    last = performance.now();
    frameId = window.requestAnimationFrame(frame);
  };

  playButton.addEventListener('click', () => {
    if (state === 'playing') {
      stop('idle');
      return;
    }
    if (state === 'ended') {
      // "Volver a ver": back to the top, then play again from the beginning.
      hooks.scrollTo(0, { immediate: true });
    }
    start();
  });

  speedButton.addEventListener('click', () => {
    speedIndex = (speedIndex + 1) % SPEEDS.length;
    speedText.textContent = `${SPEEDS[speedIndex]}×`;
  });

  // Manual input ends playback. The scroll never fights the reader.
  const interrupt = () => {
    if (state === 'playing') stop('idle');
  };

  window.addEventListener('wheel', interrupt, { passive: true });
  window.addEventListener('touchstart', interrupt, { passive: true });
  window.addEventListener('touchmove', interrupt, { passive: true });
  window.addEventListener(
    'keydown',
    (event) => {
      if (state !== 'playing') return;
      // Keys pressed on the control itself belong to the control, not the page.
      if ((event.target as Element | null)?.closest?.('[data-doc-bar]')) return;
      if (SCROLL_KEYS.has(event.key)) interrupt();
    },
    { passive: true },
  );

  render();
}
