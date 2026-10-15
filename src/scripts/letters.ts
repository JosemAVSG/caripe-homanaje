import gsap from 'gsap';

/**
 * The hero title entrance: every letter condenses out of the fog.
 *
 * This file only *writes* state. The choreography itself is CSS in
 * `Hero.astro`, reacting to one custom property per letter (`--t`, 0 → 1,
 * registered with `@property`). Three guarantees are kept here:
 *
 *  1. This script never hides the title on its own. The title is armed in the
 *     document head, before first paint, and a guard disarms it — back to a
 *     plain, still, readable title — if this script does not take charge.
 *  2. Only letters currently in motion carry `is-moving`, so a letter that has
 *     settled at either end costs nothing to keep on screen.
 *  3. Under `prefers-reduced-motion: reduce` this returns immediately, and the
 *     letters are simply present from the first frame.
 */

/** The head script stores its guard time-out under this key on `window`. */
const GUARD_KEY = '__caripeLettersGuard';

const clamp01 = (value: number): number => (value < 0 ? 0 : value > 1 ? 1 : value);

interface Letter {
  el: HTMLElement;
  /** When this letter's condensation begins, as timeline progress (0 → 1). */
  delay: number;
  /** Last value written, so writing a settled letter is a no-op. */
  last: number;
  moving: boolean;
}

export function initHeroLetters(): void {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.documentElement;
  const title = document.querySelector<HTMLElement>('[data-letters]');
  if (!title) return;

  const elements = Array.from(title.querySelectorAll<HTMLElement>('.l'));
  if (!elements.length) return;

  // The script is in charge now, so the head guard can stand down.
  const scope = window as unknown as Record<string, number | undefined>;
  const pending = scope[GUARD_KEY];
  if (pending) window.clearTimeout(pending);
  root.dataset.letters = 'ready';

  // The choreography window, read from the markup rather than hard-coded twice.
  const start = Number.parseFloat(title.dataset.start ?? '0.05');
  const spread = Number.parseFloat(title.dataset.spread ?? '0.62');
  const dur = Math.max(0.0001, Number.parseFloat(title.dataset.dur ?? '0.32'));

  const scene = title.closest<HTMLElement>('[data-scene]') ?? title;

  const letters: Letter[] = elements.map((el) => ({
    el,
    delay: start + clamp01(Number.parseFloat(el.dataset.d ?? '0')) * spread,
    last: -1,
    moving: false,
  }));

  const write = (letter: Letter, t: number): void => {
    const next = clamp01(t);
    if (next === letter.last) return;
    letter.last = next;
    letter.el.style.setProperty('--t', next.toFixed(4));

    const moving = next > 0 && next < 1;
    if (moving !== letter.moving) {
      letter.moving = moving;
      letter.el.classList.toggle('is-moving', moving);
    }
  };

  const state = { p: 0 };

  const timeline = gsap.timeline({
    paused: true,
    onUpdate: () => {
      const p = state.p;
      scene.style.setProperty('--p', p.toFixed(4));
      for (const letter of letters) write(letter, (p - letter.delay) / dur);
    },
    onComplete: () => {
      scene.style.setProperty('--p', '1');
      for (const letter of letters) {
        letter.last = -1;
        write(letter, 1);
      }
      root.dataset.letters = 'done';
    },
  });

  timeline.to(state, { p: 1, duration: 1.9, ease: 'power2.inOut' }, 0);

  // A glyph condenses into the real face, not into the fallback metric.
  Promise.resolve(document.fonts?.ready).then(() => {
    if (root.dataset.letters === 'idle') return;
    timeline.play(0);
  });
}
