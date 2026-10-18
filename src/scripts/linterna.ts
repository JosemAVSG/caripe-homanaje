/**
 * The lantern in the cave section.
 *
 * Writes the light's position to `--lx` / `--ly` on the stage, at most once per
 * animation frame. The section is a plain gallery in the markup; this file arms
 * the darkness (`data-dark`) only when motion is allowed and the stage exists.
 *
 * On a touch screen a vertical drag has to keep scrolling the page, so the
 * lantern also rides the middle of the viewport as the reader scrolls: going
 * down the page is going down the cave. A sideways drag still steers it.
 */
const FOUND_CLASS = 'is-found';

export function initLinterna(): void {
  const root = document.querySelector<HTMLElement>('[data-linterna]');
  const stage = root?.querySelector<HTMLElement>('[data-stage]');
  if (!root || !stage) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const items = Array.from(stage.querySelectorAll<HTMLElement>('[data-item]'));
  const count = root.querySelector<HTMLElement>('[data-count]');
  const found = root.querySelector<HTMLElement>('[data-found]');
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  let x = 0.5;
  let y = 0.15;
  let pointerY: number | null = null;
  let frame = 0;
  let visible = false;
  let lit = 0;

  /** Light a card for good once the lantern has passed over its centre. */
  const markFound = (rect: DOMRect, item: HTMLElement, px: number, py: number): void => {
    if (item.classList.contains(FOUND_CLASS)) return;
    const radius = parseFloat(stage.style.getPropertyValue('--lr')) * 16 || 192;
    const dx = rect.left + rect.width / 2 - px;
    const dy = rect.top + rect.height / 2 - py;
    if (Math.hypot(dx, dy) > radius * 0.7) return;
    item.classList.add(FOUND_CLASS);
    lit += 1;
    if (found) found.textContent = String(lit);
  };

  const paint = (): void => {
    frame = 0;
    const box = stage.getBoundingClientRect();
    const px = box.left + x * box.width;
    const py = pointerY ?? (coarse ? window.innerHeight / 2 : box.top + y * box.height);
    stage.style.setProperty('--lx', `${px - box.left}px`);
    stage.style.setProperty('--ly', `${py - box.top}px`);
    for (const item of items) markFound(item.getBoundingClientRect(), item, px, py);
  };

  const schedule = (): void => {
    if (!frame) frame = requestAnimationFrame(paint);
  };

  const radius = (): void => {
    stage.style.setProperty('--lr', `${Math.min(14, Math.max(8, window.innerWidth / 16 * 0.22))}rem`);
  };

  stage.addEventListener('pointermove', (event) => {
    const box = stage.getBoundingClientRect();
    x = (event.clientX - box.left) / box.width;
    pointerY = event.clientY;
    schedule();
  });
  stage.addEventListener('pointerleave', () => {
    pointerY = null;
  });

  // The lantern follows focus, so tabbing through the cards lights each one.
  for (const item of items) {
    item.addEventListener('focus', () => {
      const rect = item.getBoundingClientRect();
      const box = stage.getBoundingClientRect();
      x = (rect.left + rect.width / 2 - box.left) / box.width;
      pointerY = rect.top + rect.height / 2;
      markFound(rect, item, rect.left + rect.width / 2, pointerY);
      schedule();
    });
  }

  // Only spend frames on scroll while the stage is on screen.
  const watcher = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule();
  });
  watcher.observe(stage);
  window.addEventListener(
    'scroll',
    () => {
      if (visible && (coarse || pointerY === null)) schedule();
    },
    { passive: true },
  );
  window.addEventListener('resize', () => {
    radius();
    schedule();
  });

  radius();
  root.dataset.dark = '';
  if (count) count.hidden = false;
  schedule();
}
