import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initFog } from './fog';
import { initDocumentary } from './documentary';
import { initFormingText } from './letters';

/**
 * The scene engine.
 *
 * One chapter is one scene. `position: sticky` in the markup holds the
 * photograph; this file only *describes* the scroll, publishing it as the CSS
 * custom property `--p` (0 → 1) on each scene so the beats can light up as the
 * reader passes. The moving parts, in order of importance:
 *
 *   · `--p` per scene, written by a scrubbed ScrollTrigger;
 *   · a staggered entrance for headers and blocks (`[data-reveal-group]`);
 *   · a slow drift on the hero photograph;
 *   · a drawn timeline rule and the reading-progress signals;
 *   · the fog layer and the "Ver como documental" control, each in its own file.
 *
 * Design rules this file obeys:
 *  1. NOTHING is hidden by CSS. Every element is readable at rest, so the page
 *     is complete if this script never runs, fails to load, or throws.
 *  2. `prefers-reduced-motion: reduce` skips ALL of the above — no pinning, no
 *     smoothing, no beats — but still wires the passive time indicator, so the
 *     reading signal survives.
 *  3. If anything throws after elements have been staged, `revealAll()` clears
 *     the inline styles GSAP applied so no copy can be left invisible.
 */

const MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Elements GSAP is allowed to stage as hidden before their reveal. */
const REVEAL_SELECTOR = '[data-reveal]';

/** A group staggers its own `[data-reveal]` descendants. */
const GROUP_SELECTOR = '[data-reveal-group]';

/** Smooth scrolling is desktop-only: on phones it fights the browser chrome. */
const SMOOTH_QUERY = '(min-width: 48rem)';

function prefersReducedMotion(): boolean {
  return window.matchMedia(MOTION_QUERY).matches;
}

/** Every scene, hero included, publishes a short label for the time bar. */
function trackTimeIndicator(): void {
  const text = document.querySelector<HTMLElement>('[data-time-text]');
  if (!text) return;

  const scenes = gsap.utils.toArray<HTMLElement>('[data-scene]');
  if (!scenes.length) return;

  // A thin band across the middle of the viewport decides which scene is
  // "now". It reads data, never guesses, and works without any motion.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const label = (entry.target as HTMLElement).dataset.time;
        if (label && text.textContent !== label) text.textContent = label;
      }
    },
    { rootMargin: '-45% 0px -45% 0px' },
  );

  for (const scene of scenes) observer.observe(scene);
}

/**
 * Writes `--p` for each chapter scene from the scroll, through a scrubbed
 * ScrollTrigger. `--p` is declared `1` in the markup so beats are legible with
 * no script; here it is driven down to 0 and back up across the scene.
 */
function trackScenes(): void {
  for (const scene of gsap.utils.toArray<HTMLElement>('[data-chapter]')) {
    const state = { p: 0 };
    const apply = () => scene.style.setProperty('--p', state.p.toFixed(4));

    gsap.to(state, {
      p: 1,
      ease: 'none',
      onUpdate: apply,
      scrollTrigger: {
        trigger: scene,
        start: 'top 85%',
        end: 'bottom 60%',
        scrub: 0.4,
        invalidateOnRefresh: true,
        onRefresh: apply,
      },
    });

    // Until the trigger has measured itself, the scene starts unrevealed on
    // purpose. `revealAll()` is the safety net if anything throws.
    apply();
  }
}

/**
 * Reveals each beat from its own position in the viewport.
 *
 * A beat's legibility depends on where *it* is on screen, not on how far the
 * reader has travelled through the scene, so this is deliberately decoupled
 * from `trackScenes()`: one scrubbed trigger per beat writes `--beat-o` (0 → 1)
 * on that element. `Beat.astro` turns it into opacity and a short rise. The
 * value settles at exactly 1 past `end`, with no `transition` competing with
 * it, so a beat the reader is looking at is always fully legible.
 */
function trackBeats(): void {
  for (const beat of gsap.utils.toArray<HTMLElement>('.beat')) {
    const state = { o: 0 };
    const apply = () => beat.style.setProperty('--beat-o', state.o.toFixed(4));

    gsap.to(state, {
      o: 1,
      ease: 'none',
      onUpdate: apply,
      scrollTrigger: {
        trigger: beat,
        start: 'top 88%',
        end: 'top 66%',
        scrub: 0.35,
        invalidateOnRefresh: true,
        onRefresh: apply,
      },
    });

    // Until the trigger has measured itself, the beat stays staged. This writes
    // the current state, so a beat already in range on load is not left hidden.
    apply();
  }
}

/**
 * Grows the chapters' drawn plates.
 *
 * Same contract as `trackBeats()`: a plate is grown by where the plate is,
 * never by how far the reader has travelled through the scene it sits in. A
 * scrubbed trigger on the plate's own box writes its property (0 → 1) and the
 * drawing reads it.
 *
 * Three plates obey this, and each is a different kind of document:
 * `CoffeeBranches.astro` writes `--grow` and draws a plant upward as the café
 * is read; `CloudBanks.astro` writes `--desc` and brings cloud down into the
 * valley of the neblina; `ForkedRoad.astro` writes `--route` and draws a road
 * that forks, one branch leaving the screen and one stopping. None is a
 * substitute for another, and all three declare their property at 1 in the
 * markup, so with no script, or when this never runs, the plate ships already
 * finished rather than invisible.
 *
 * This is the single list. `revealAll()` reads it too rather than repeating
 * the selectors: with two plates a second copy was harmless, with three it is
 * a plate that can be left half-drawn by a failure nobody would trace back
 * here.
 */
const PLATE_TRIGGERS: Array<[selector: string, property: string]> = [
  ['[data-branches]', '--grow'],
  ['[data-neblina]', '--desc'],
  ['[data-fork]', '--route'],
];

function trackPlates(): void {
  for (const [selector, property] of PLATE_TRIGGERS) {
    for (const plate of gsap.utils.toArray<HTMLElement>(selector)) {
      const state = { p: 0 };
      const apply = () => plate.style.setProperty(property, state.p.toFixed(4));

      gsap.to(state, {
        p: 1,
        ease: 'none',
        onUpdate: apply,
        scrollTrigger: {
          trigger: plate,
          // Begins the moment the plate's box enters from below, and is drawing
          // while the plate is on screen, not long before it arrives.
          start: 'top bottom',
          end: 'bottom 62%',
          scrub: 0.4,
          invalidateOnRefresh: true,
          onRefresh: apply,
        },
      });

      apply();
    }
  }
}

/**
 * The full-screen scenes.
 *
 * Holding the photographs and covering one with the next is pure CSS
 * (`position: sticky`, see `ChapterSection.astro` and `ChapterGallery.astro`).
 * This only adds depth on top, by scrubbing three things:
 *
 *   · a chapter's cover settles from a slow zoom while it is held, then drifts
 *     up and darkens as the text rises over it; its title lifts away;
 *   · a gallery is one pinned screen: each photograph dissolves into the next
 *     while its caption fades in and out, with time to read between them;
 *   · the full-bleed band does the same.
 *
 * Nothing is hidden by CSS: each tween starts from the resting state's
 * neighbour and ends at rest, so with no script the screens are complete.
 */
function trackCinema(): void {
  const media = gsap.matchMedia();

  media.add('(min-width: 1px)', () => {
    // -- Chapter covers -----------------------------------------------------
    for (const scene of gsap.utils.toArray<HTMLElement>('.scene--cover')) {
      const cover = scene.querySelector<HTMLElement>('[data-cover]');
      const photo = scene.querySelector<HTMLElement>('[data-cover-media]');
      const title = scene.querySelector<HTMLElement>('[data-cover-title]');
      const veil = scene.querySelector<HTMLElement>('[data-cover-veil]');
      const hold = scene.querySelector<HTMLElement>('[data-cover-hold]');
      const content = scene.querySelector<HTMLElement>('[data-story], [data-content]');
      if (!cover || !photo || !hold || !content) continue;

      // Arrives from below and is held: the photograph settles from a zoom.
      gsap.fromTo(
        photo,
        { scale: 1.3 },
        {
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            trigger: scene,
            start: 'top bottom',
            end: () => `top+=${hold.offsetHeight} top`,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        },
      );

      // The text rises over it: the photograph goes under, dark and slightly up.
      const cover2 = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: content,
          start: 'top bottom',
          end: 'top top',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
      cover2.to(photo, { yPercent: -7 }, 0);
      if (veil) cover2.to(veil, { opacity: 0.7 }, 0);
      if (title) cover2.to(title, { yPercent: -14, opacity: 0.1 }, 0);
    }

    // -- Photograph reels -----------------------------------------------------
    // One pinned screen per chapter gallery, played as a slow sequence. Slot i
    // spans one unit of timeline time:
    //   i .. i+0.35      the photograph dissolves in over the previous one,
    //                    which stays fully opaque beneath it (no dark dip);
    //   i+0.35 .. i+0.55 its caption fades in;
    //   i+0.55 .. i+0.85 held still, slowly drifting, while it is read;
    //   i+0.85 .. i+1    its caption fades out, before the next dissolve begins.
    // The last photograph keeps its caption to the end.
    for (const reel of gsap.utils.toArray<HTMLElement>('[data-reel]')) {
      const panels = gsap.utils.toArray<HTMLElement>('[data-reel-panel]', reel);
      if (panels.length < 2) continue;

      reel.classList.add('is-pinned');

      const images = panels.map((panel) => panel.querySelector<HTMLElement>('[data-fb]'));
      const captions = panels.map((panel) => panel.querySelector<HTMLElement>('figcaption'));

      gsap.set(panels.slice(1), { autoAlpha: 0 });
      gsap.set(captions, { autoAlpha: 0, y: 18 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: reel,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        const last = i === panels.length - 1;

        if (i > 0) {
          tl.to(panel, { autoAlpha: 1, ease: 'power1.inOut', duration: 0.35 }, i);
          // Once the new photograph fully covers it, the old one can go.
          tl.set(panels[i - 1], { autoAlpha: 0 }, i + 0.35);
        }

        const img = images[i];
        if (img) {
          tl.fromTo(
            img,
            { scale: 1.12 },
            { scale: 1.0, duration: last ? 1 : 1.35 },
            i,
          );
        }

        const cap = captions[i];
        if (cap) {
          tl.to(cap, { autoAlpha: 1, y: 0, ease: 'power1.out', duration: 0.2 }, i + (i === 0 ? 0.05 : 0.35));
          if (!last) tl.to(cap, { autoAlpha: 0, y: -12, ease: 'power1.in', duration: 0.15 }, i + 0.85);
        }
      });

      // Pad the end so the last photograph rests on screen before it leaves.
      tl.to({}, { duration: 0.35 }, panels.length);
    }

    // -- The story: the chapter's words, told over its photographs -----------
    // One pinned screen. Photographs are grouped; each group holds the beats
    // told over it, one per unit of timeline time, in turn:
    //   photograph dissolves in over the previous one (0.35, none for the first)
    //   beat i:  fades up (0.2) at +0.35, is read, fades out (0.15) at +0.9
    //   caption: fades in with the group's first beat, out at the group's end.
    // The previous photograph stays opaque beneath the arriving one, so the
    // dissolve never dips dark. The last beat keeps its place to the end.
    for (const story of gsap.utils.toArray<HTMLElement>('[data-story]')) {
      const panels = gsap.utils.toArray<HTMLElement>('[data-story-panel]', story);
      if (!panels.length) continue;

      story.classList.add('is-pinned');
      gsap.set(panels.slice(1), { autoAlpha: 0 });
      gsap.set(story.querySelectorAll('[data-story-beat], [data-story-caption]'), {
        autoAlpha: 0,
        y: 22,
      });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: story,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });

      let t = 0;
      panels.forEach((panel, gi) => {
        const beats = gsap.utils.toArray<HTMLElement>('[data-story-beat]', panel);
        const caption = panel.querySelector<HTMLElement>('[data-story-caption]');
        const img = panel.querySelector<HTMLElement>('[data-fb]');
        const dur = Math.max(1, beats.length);
        const lastGroup = gi === panels.length - 1;

        if (gi > 0) {
          tl.to(panel, { autoAlpha: 1, ease: 'power1.inOut', duration: 0.35 }, t);
          tl.set(panels[gi - 1], { autoAlpha: 0 }, t + 0.35);
        }
        if (img) tl.fromTo(img, { scale: 1.1 }, { scale: 1.0, duration: dur + (lastGroup ? 0.35 : 0) }, t);

        const first = t + (gi === 0 ? 0.05 : 0.35);
        if (caption) {
          tl.to(caption, { autoAlpha: 1, y: 0, ease: 'power1.out', duration: 0.2 }, first);
          if (!lastGroup) tl.to(caption, { autoAlpha: 0, y: -10, ease: 'power1.in', duration: 0.15 }, t + dur - 0.15);
        }

        beats.forEach((beat, bi) => {
          const at = t + bi + (gi === 0 && bi === 0 ? 0.05 : 0.35);
          const lastBeat = lastGroup && bi === beats.length - 1;
          tl.to(beat, { autoAlpha: 1, y: 0, ease: 'power1.out', duration: 0.2 }, at);
          if (!lastBeat) {
            // Leaves just before the next beat (or the next photograph) arrives.
            tl.to(beat, { autoAlpha: 0, y: -14, ease: 'power1.in', duration: 0.15 }, t + bi + 0.85);
          }
        });

        t += dur;
      });

      // Rest on the last beat before the stage lets go.
      tl.to({}, { duration: 0.35 }, t);
    }

    // -- The full-bleed band --------------------------------------------------
    for (const band of gsap.utils.toArray<HTMLElement>('[data-band]')) {
      const img = band.querySelector<HTMLElement>('[data-band-img]');
      if (!img) continue;
      gsap.fromTo(
        img,
        { scale: 1.25, yPercent: -5 },
        {
          scale: 1.04,
          yPercent: 5,
          ease: 'none',
          scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
        },
      );
    }
  });
}

/** Headers and blocks rise in once, together, a beat apart. */
function revealGroups(): void {
  for (const group of gsap.utils.toArray<HTMLElement>(GROUP_SELECTOR)) {
    const items = gsap.utils.toArray<HTMLElement>(REVEAL_SELECTOR, group);
    if (!items.length) continue;

    gsap.from(items, {
      y: 26,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.07,
      scrollTrigger: { trigger: group, start: 'top 84%', once: true },
    });
  }
}

/** The hero photograph drifts against the scroll — one slow moving picture. */
function driftHero(): void {
  const photo = document.querySelector<HTMLElement>('[data-hero-photo]');
  const hero = document.querySelector<HTMLElement>('[data-scene="hero"]');
  if (!photo || !hero) return;

  gsap.set(photo, { scale: 1.12 });
  gsap.fromTo(
    photo,
    { yPercent: -4 },
    {
      yPercent: 4,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    },
  );
}

/** The timeline rule is literally drawn by the scroll, one axis per layout. */
function drawTimelines(): void {
  const media = gsap.matchMedia();

  for (const timeline of gsap.utils.toArray<HTMLElement>('[data-timeline]')) {
    const line = timeline.querySelector<HTMLElement>('[data-timeline-line]');
    if (!line) continue;

    media.add('(min-width: 48rem)', () => {
      const tween = gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: timeline,
            start: 'top 78%',
            end: 'bottom 88%',
            scrub: 0.5,
          },
        },
      );
      return () => tween.kill();
    });

    media.add('(max-width: 47.99rem)', () => {
      const tween = gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: timeline,
            start: 'top 82%',
            end: 'bottom 92%',
            scrub: 0.5,
          },
        },
      );
      return () => tween.kill();
    });
  }
}

/** Reading progress: the top bar on small screens, the rail on large ones. */
function trackProgress(): void {
  const fill = (selector: string, axis: 'x' | 'y') => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;

    const from = axis === 'x' ? { scaleX: 0 } : { scaleY: 0 };
    const to = axis === 'x' ? { scaleX: 1 } : { scaleY: 1 };

    gsap.fromTo(el, from, {
      ...to,
      ease: 'none',
      transformOrigin: axis === 'x' ? 'left center' : 'top center',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });
  };

  fill('[data-progress-fill]', 'x');
  fill('[data-rail-fill]', 'y');
}

/**
 * Marks the rail entry that matches the chapter currently on screen.
 *
 * Reads each chapter's live box on every scroll tick instead of caching trigger
 * offsets: lazy images, fonts and reveals move the chapters after the offsets
 * were measured, and a stale offset leaves the wrong dot lit (or none) as the
 * reader crosses into a later chapter. Between chapters, where the full-bleed
 * band sits, nothing is lit — the same behaviour the cached triggers had.
 */
function markActiveChapter(): void {
  const entries = gsap.utils
    .toArray<HTMLElement>('[data-chapter]')
    .map((chapter) => ({
      chapter,
      link: document.querySelector<HTMLElement>(`[data-rail-link="${chapter.dataset.chapter}"]`),
    }))
    .filter((entry): entry is { chapter: HTMLElement; link: HTMLElement } => entry.link !== null);

  if (!entries.length) return;

  let active: HTMLElement | null = null;

  const update = () => {
    const line = window.innerHeight * 0.45;
    let next: HTMLElement | null = null;

    for (const { chapter, link } of entries) {
      const box = chapter.getBoundingClientRect();
      if (box.top <= line && box.bottom > line) {
        next = link;
        break;
      }
    }

    if (next === active) return;
    active?.removeAttribute('aria-current');
    next?.setAttribute('aria-current', 'true');
    active = next;
  };

  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update, onRefresh: update });
  update();
}

/**
 * Scenes more than a viewport away are marked `is-far`, which lets the fog
 * layer skip per-frame work for anything the reader cannot see yet.
 */
function markFarScenes(): void {
  const scenes = gsap.utils.toArray<HTMLElement>('[data-scene]');
  if (!scenes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle('is-far', !entry.isIntersecting);
      }
    },
    { rootMargin: '120% 0px' },
  );

  for (const scene of scenes) observer.observe(scene);
}

/** Anchor links ride the smooth scroller when it is available. */
function bindAnchorScrolling(lenis: Lenis): void {
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href')?.slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { duration: 1.1 });

      // Move focus too, so keyboard users land where the viewport did.
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: true });
    });
  }
}

/** Safety net: undo any inline staging so no content can be left hidden. */
function revealAll(): void {
  try {
    gsap.set(REVEAL_SELECTOR, { clearProps: 'all' });
    for (const scene of document.querySelectorAll<HTMLElement>('[data-chapter]')) {
      scene.style.setProperty('--p', '1');
      scene.classList.remove('is-far');
    }
    for (const scene of document.querySelectorAll<HTMLElement>('[data-scene]')) {
      scene.classList.remove('is-far');
    }
    // Beats carry their own reveal variable; drive it to 1 so none can be left
    // hidden if an error interrupts the scroll setup.
    for (const beat of document.querySelectorAll<HTMLElement>('.beat')) {
      beat.style.setProperty('--beat-o', '1');
    }
    // The drawn plates grow from their own scroll variables; a failure here
    // must leave a finished plate, never a half-drawn one. Driven from
    // PLATE_TRIGGERS so adding a plate cannot add a way to leave it hidden.
    for (const [selector, property] of PLATE_TRIGGERS) {
      for (const plate of document.querySelectorAll<HTMLElement>(selector)) {
        plate.style.setProperty(property, '1');
      }
    }
    // A run of forming text must be readable even if its script never ran:
    // cancel every instance's guard and let its letters settle, still and
    // present.
    const guards = (window as unknown as { __caripeFormingGuards?: Map<Element, number> })
      .__caripeFormingGuards;
    if (guards) {
      for (const timer of guards.values()) window.clearTimeout(timer);
      guards.clear();
    }
    for (const instance of document.querySelectorAll<HTMLElement>('[data-forming]')) {
      if (instance.dataset.forming !== 'done') instance.dataset.forming = 'idle';
    }
    // A pinned reel must fall back to its plain run of full-screen photographs.
    for (const reel of document.querySelectorAll<HTMLElement>('[data-reel]')) {
      reel.classList.remove('is-pinned');
      gsap.set(reel.querySelectorAll('[data-reel-panel], [data-reel-panel] figcaption, [data-fb]'), {
        clearProps: 'all',
      });
    }
    for (const story of document.querySelectorAll<HTMLElement>('[data-story]')) {
      story.classList.remove('is-pinned');
      gsap.set(story.querySelectorAll('[data-story-panel], [data-story-beat], [data-story-caption], [data-fb]'), {
        clearProps: 'all',
      });
    }
    ScrollTrigger.refresh();
  } catch {
    /* Nothing else we can safely do here. */
  }
}

export function initMotion(): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  if (prefersReducedMotion()) {
    // No motion. The document is already complete and static; keep only the
    // passive time indicator, which does not move anything.
    root.dataset.motion = 'reduced';
    trackTimeIndicator();
    return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    // The title's own entrance runs per instance, independent of the scroll.
    initFormingText();

    // The smooth scroller, when the layout wants one. It is held in a variable
    // so playback can freeze it (see `initDocumentary` below) without fighting.
    let lenis: Lenis | null = null;
    const media = gsap.matchMedia();

    media.add(SMOOTH_QUERY, () => {
      const instance = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
        gestureOrientation: 'vertical',
        // Driven by gsap.ticker below, so Lenis must not run its own loop.
        autoRaf: false,
      });
      lenis = instance;

      instance.on('scroll', ScrollTrigger.update);
      const raf = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // Anything else that moves the page — a restored position, a native
      // jump, a harness calling scrollTo — must be adopted rather than snapped
      // back to Lenis's own target. Lenis only resyncs when it is idle, so
      // while it is smoothing it would otherwise cancel an external scroll.
      const adoptNativeScroll = () => {
        if (Math.abs(window.scrollY - instance.scroll) > 2) {
          instance.scrollTo(window.scrollY, { immediate: true, force: true });
        }
      };
      window.addEventListener('scroll', adoptNativeScroll, { passive: true });

      bindAnchorScrolling(instance);

      return () => {
        window.removeEventListener('scroll', adoptNativeScroll);
        gsap.ticker.remove(raf);
        instance.destroy();
        lenis = null;
      };
    });

    trackScenes();
    trackBeats();
    trackPlates();
    revealGroups();
    trackCinema();
    driftHero();
    drawTimelines();
    trackProgress();
    markActiveChapter();
    markFarScenes();
    trackTimeIndicator();

    initFog();

    initDocumentary({
      getScroll: () => window.scrollY,
      scrollTo: (y, { immediate }) => {
        // `force` lets the autonomous scroll move Lenis even while it is
        // stopped for playback; without Lenis it is a plain scroll.
        if (lenis) lenis.scrollTo(y, { immediate, force: true });
        else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
      },
      onPlay: () => lenis?.stop(),
      onPause: () => lenis?.start(),
    });

    // Web fonts change layout heights, which moves every measured boundary.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

    root.dataset.motion = 'on';
  } catch (error) {
    console.error('[caripe] Scroll motion unavailable, falling back to static.', error);
    revealAll();
    root.dataset.motion = 'off';
  }
}
