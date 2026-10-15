import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * Progressive enhancement layer for the Caripe documentary.
 *
 * Design rules this file obeys:
 *  1. NOTHING is hidden by CSS. Every element is readable at rest, so the page
 *     is complete if this script never runs, fails to load, or throws.
 *  2. With `prefers-reduced-motion: reduce` this function returns immediately.
 *     No pinning, no smooth scroll, no tweens: the document is 100% static.
 *  3. If anything throws after elements have been staged, `revealAll()` clears
 *     the inline styles GSAP applied so no copy can be left invisible.
 */

const MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Elements GSAP is allowed to stage as hidden before their reveal. */
const STAGED_SELECTOR = '[data-reveal]';

/** Pinning is desktop-only: on phones it fights the dynamic browser chrome. */
const PIN_QUERY = '(min-width: 48rem)';

/** Smooth scrolling is desktop-only for the same reason. */
const SMOOTH_QUERY = '(min-width: 48rem)';

function prefersReducedMotion(): boolean {
  return window.matchMedia(MOTION_QUERY).matches;
}

/** Pins anything declaring `data-pin`, using `data-pin-distance` as a
 *  viewport-height multiplier. Generic, so any scene can opt in from markup. */
function pinScenes(media: ReturnType<typeof gsap.matchMedia>): void {
  for (const scene of gsap.utils.toArray<HTMLElement>('[data-pin]')) {
    const multiplier = Number(scene.dataset.pinDistance ?? '0.7');

    media.add(PIN_QUERY, () => {
      const distance = () => Math.round(window.innerHeight * multiplier);

      const trigger = ScrollTrigger.create({
        trigger: scene,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      return () => trigger.kill();
    });
  }
}

/** The hero: the fog clears and the land settles while the scene is held. */
function animateHero(): void {
  const hero = document.querySelector<HTMLElement>('[data-scene="hero"]');
  if (!hero) return;

  const multiplier = Number(hero.dataset.pinDistance ?? '0.7');
  const distance = () => Math.round(window.innerHeight * multiplier);

  const mist = hero.querySelectorAll<HTMLElement>('[data-mist] .mist__layer');
  const ridges = hero.querySelectorAll<HTMLElement>('[data-ridge]');
  const content = hero.querySelectorAll<HTMLElement>('[data-hero-content]');

  const scene = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: () => `+=${distance()}`,
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  // The signature device: fog lifts out of the valley and dissolves, the nearer
  // layers rising fastest. This is what "Caripe seen through the fog" means.
  scene.to(
    mist,
    {
      autoAlpha: 0,
      yPercent: (_i, el) => -100 * Number((el as HTMLElement).dataset.depth ?? 0.4),
      stagger: 0.04,
      duration: 0.7,
    },
    0,
  );

  // The land settles as the fog leaves it. Pixel-based so it works on the SVG
  // roots without relying on getBBox percentages.
  scene.to(
    ridges,
    {
      y: (i) => -window.innerHeight * (0.012 + i * 0.018),
      duration: 0.7,
    },
    0,
  );

  // The prologue holds, then hands the screen over to chapter one.
  scene.to(content, { autoAlpha: 0, y: -56, duration: 0.45 }, 0.55);
}

/** Text, sources and plates fade in as they cross the reading line. */
function revealOnScroll(): void {
  for (const target of gsap.utils.toArray<HTMLElement>(STAGED_SELECTOR)) {
    gsap.from(target, {
      y: 26,
      autoAlpha: 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: target,
        start: 'top 88%',
        once: true,
      },
    });
  }
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

/** Marks the rail entry that matches the chapter currently on screen. */
function markActiveChapter(): void {
  for (const chapter of gsap.utils.toArray<HTMLElement>('[data-chapter]')) {
    const slug = chapter.dataset.chapter;
    if (!slug) continue;

    const link = document.querySelector<HTMLElement>(`[data-rail-link="${slug}"]`);
    if (!link) continue;

    ScrollTrigger.create({
      trigger: chapter,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => {
        if (self.isActive) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      },
    });
  }
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
    gsap.set(`${STAGED_SELECTOR}, [data-mist] .mist__layer, [data-hero-content]`, {
      clearProps: 'all',
    });
    ScrollTrigger.refresh();
  } catch {
    /* Nothing else we can safely do here. */
  }
}

export function initMotion(): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  if (prefersReducedMotion()) {
    // The document is already complete and static. Do nothing at all.
    root.dataset.motion = 'reduced';
    return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const media = gsap.matchMedia();

    // Smooth scrolling, wired to ScrollTrigger through the GSAP ticker.
    media.add(SMOOTH_QUERY, () => {
      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
        gestureOrientation: 'vertical',
        // Driven by gsap.ticker below, so Lenis must not run its own loop.
        autoRaf: false,
      });

      lenis.on('scroll', ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      bindAnchorScrolling(lenis);

      return () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    });

    pinScenes(media);
    animateHero();
    revealOnScroll();
    drawTimelines();
    trackProgress();
    markActiveChapter();

    // Web fonts change layout heights, which moves every pinned boundary.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

    root.dataset.motion = 'on';
  } catch (error) {
    console.error('[caripe] Scroll motion unavailable, falling back to static.', error);
    revealAll();
    root.dataset.motion = 'off';
  }
}
