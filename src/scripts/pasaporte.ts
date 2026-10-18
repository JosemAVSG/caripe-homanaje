/**
 * The visit passport.
 *
 * A chapter earns its stamp when the reader reaches its end. The end is marked
 * by a zero-height sentinel inserted right after each chapter section (outside
 * the section's own grid, so no layout moves). Earned slugs persist in
 * localStorage; when storage is unavailable the passport still works for the
 * current visit. Nothing here touches scrolling, so Lenis and the documentary
 * auto-scroll are unaffected.
 */
const STORAGE_KEY = 'caripe:pasaporte:v1';
const TOAST_MS = 3600;

function load(known: Set<string>): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((s): s is string => typeof s === 'string' && known.has(s)));
    }
  } catch {
    // Blocked, full or corrupt storage: start empty.
  }
  return new Set();
}

function save(earned: Set<string>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned]));
  } catch {
    // Not persisted; the stamps still count for this visit.
  }
}

export function initPasaporte(): void {
  const root = document.querySelector<HTMLElement>('[data-pasaporte]');
  const toggle = root?.querySelector<HTMLButtonElement>('[data-toggle]');
  const panel = root?.querySelector<HTMLElement>('[data-panel]');
  const toast = root?.querySelector<HTMLElement>('[data-toast]');
  const count = root?.querySelector<HTMLElement>('[data-count]');
  if (!root || !toggle || !panel || !toast || !count) return;

  const items = new Map<string, HTMLElement>();
  for (const li of root.querySelectorAll<HTMLElement>('[data-stamp]')) {
    if (li.dataset.stamp) items.set(li.dataset.stamp, li);
  }
  if (!items.size) return;

  const earned = load(new Set(items.keys()));

  const paint = (slug: string, isNew: boolean): void => {
    const li = items.get(slug);
    if (!li) return;
    li.classList.add('is-earned');
    if (isNew) li.classList.add('is-new');
    const state = li.querySelector('[data-state]');
    if (state) state.textContent = 'sello obtenido';
  };

  const updateCount = (): void => {
    count.textContent = `${earned.size}/${items.size}`;
  };

  for (const slug of earned) paint(slug, false);
  updateCount();
  root.hidden = false;

  // -- Panel -------------------------------------------------------------

  const setOpen = (open: boolean): void => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setOpen(panel.hidden));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (!panel.hidden && event.target instanceof Node && !root.contains(event.target)) setOpen(false);
  });

  // The panel scrolls on its own; keep the wheel from also driving Lenis.
  panel.setAttribute('data-lenis-prevent', '');

  // -- Earning -----------------------------------------------------------

  let toastTimer = 0;
  const announce = (title: string): void => {
    window.clearTimeout(toastTimer);
    toast.textContent = `Sello: ${title}`;
    toast.classList.add('is-on');
    toastTimer = window.setTimeout(() => toast.classList.remove('is-on'), TOAST_MS);
  };

  const earn = (slug: string, title: string): void => {
    if (earned.has(slug)) return;
    earned.add(slug);
    save(earned);
    paint(slug, true);
    updateCount();
    announce(title);
  };

  if (!('IntersectionObserver' in window)) return;

  const titles = new Map<string, string>();
  for (const [slug, li] of items) {
    titles.set(slug, li.querySelector('.stamp__t')?.textContent?.trim() ?? slug);
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const slug = (entry.target as HTMLElement).dataset.pasaporteEnd;
      if (!entry.isIntersecting || !slug) continue;
      observer.unobserve(entry.target);
      earn(slug, titles.get(slug) ?? slug);
    }
  });

  for (const slug of items.keys()) {
    if (earned.has(slug)) continue;
    const section = document.getElementById(slug);
    if (!section) continue;
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.dataset.pasaporteEnd = slug;
    section.after(sentinel);
    observer.observe(sentinel);
  }
}
