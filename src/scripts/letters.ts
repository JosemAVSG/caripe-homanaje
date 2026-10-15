import gsap from 'gsap';

/**
 * Forming text: every glyph of a forming instance condenses out of the fog.
 *
 * This file only *writes* state. The choreography is CSS in
 * `FormingText.astro`, reacting to one custom property per letter (`--t`,
 * 0 → 1, registered with `@property`). Three guarantees are kept here:
 *
 *  1. This script never hides a letter on its own. Each instance arms itself
 *     from its own place in the document (`FormingText.astro`), and the guard
 *     disarms it — back to plain, still, readable text — if the instance never
 *     gets taken over. The gate is per element, so several instances on one
 *     page (a hero title, a chapter's cita) are independent.
 *  2. Only letters currently in motion carry `is-moving`, so a letter that has
 *     settled at either end costs nothing to keep on screen.
 *  3. Under `prefers-reduced-motion: reduce` this returns immediately, and the
 *     letters are simply present from the first frame.
 */

declare global {
  interface Window {
    /** Guard timers, one per forming instance, where both the arming script
     *  (`FormingText.astro`) and this module can reach them. */
    __caripeFormingGuards?: Map<Element, number>;
  }
}

const clamp01 = (value: number): number => (value < 0 ? 0 : value > 1 ? 1 : value);

interface Letter {
  el: HTMLElement;
  /** When this letter's condensation begins, as timeline progress (0 → 1). */
  delay: number;
  /** Last value written, so writing a settled letter is a no-op. */
  last: number;
  moving: boolean;
}

interface Tuning {
  start: number;
  spread: number;
  dur: number;
}

/** The three numbers an instance publishes on itself, or the hero's defaults. */
function tuningOf(root: HTMLElement): { start: number; spread: number; dur: number } {
  return {
    start: Number(root.dataset.start ?? 0.05),
    spread: Number(root.dataset.spread ?? 0.62),
    dur: Math.max(0.0001, Number(root.dataset.dur ?? 0.32)),
  };
}

export function initFormingText(): void {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-forming]'));
  if (!roots.length) return;

  const guards: Map<Element, number> | undefined = window.__caripeFormingGuards;
  const timelines: gsap.core.Timeline[] = [];

  for (const root of roots) {
    const gate = root.dataset.forming;
    // Never armed, disarmed by the guard, or already finished: the letters are
    // plain and readable, and touching them here could only make that worse.
    if (gate !== 'armed' && gate !== 'ready') continue;

    const elements = Array.from(root.querySelectorAll<HTMLElement>('.l'));
    if (!elements.length) continue;

    // This instance is in the script's charge now: its own guard can stand down.
    const guard = guards?.get(root);
    if (guard !== undefined) {
      window.clearTimeout(guard);
      guards?.delete(root);
    }

    const scene = root.closest<HTMLElement>('[data-scene]') ?? root;
    const { start, spread, dur } = tuningOf(root);

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
        // The instance's scene publishes the same progress the chapters do.
        scene.style.setProperty('--p', p.toFixed(4));
        for (const letter of letters) write(letter, (p - letter.delay) / dur);
      },
      onComplete: () => {
        scene.style.setProperty('--p', '1');
        for (const letter of letters) {
          letter.last = -1;
          write(letter, 1);
        }
        root.dataset.forming = 'done';
      },
    });

    timeline.to(state, { p: 1, duration: 1.9, ease: 'power2.inOut' }, 0);
    timelines.push(timeline);
  }

  if (!timelines.length) return;

  // A glyph condenses into the real face, not into the fallback metric.
  Promise.resolve(document.fonts?.ready).then(() => {
    for (const timeline of timelines) timeline.play(0);
  });
}
