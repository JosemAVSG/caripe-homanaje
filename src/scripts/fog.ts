/**
 * The fog layer.
 *
 * One `<canvas>` per scene paints a slow, low drifting haze over the
 * photograph — denser in the mountain chapters, nearly absent inside the cave.
 * It is a single layer, capped at a device-pixel-ratio of 2, and it stops
 * entirely when the scene is off screen, when the scene is far away, when the
 * document is hidden, or when the reader prefers reduced motion.
 *
 * Layout is measured only on `resize`; the drawing loop never reads layout. The
 * page is fully legible without this script: the CSS scrim already keeps the
 * text readable, so fog is only ever an addition.
 */

type Density = 'none' | 'light' | 'dense';

interface Blob {
  x: number;
  y: number;
  baseY: number;
  r: number;
  a: number;
  vx: number;
  phase: number;
}

interface FogItem {
  canvas: HTMLCanvasElement;
  scene: HTMLElement | null;
  ctx: CanvasRenderingContext2D;
  colour: string;
  w: number;
  h: number;
  blobs: Blob[];
  visible: boolean;
}

const SETTINGS: Record<Exclude<Density, 'none'>, { count: number; alpha: number; maxR: number; speed: number }> = {
  light: { count: 6, alpha: 0.11, maxR: 0.5, speed: 10 },
  dense: { count: 11, alpha: 0.17, maxR: 0.72, speed: 16 },
};

const MAX_DPR = 2;

/**
 * The haze's colour is its temperature, and the temperature follows the
 * chapter's own tone rather than a table here: a chapter written in `bruma`
 * gets cold fog, everything else gets the page's neutral green-white.
 *
 * `neutral` is the long-standing value — a green-cast white, which is what
 * mist over vegetation looks like. `cold` keeps the same lightness (luma 219
 * against 219) and moves the cast from green to blue, so the mountain's fog
 * reads as weather rather than as damp ground cover.
 */
const FOG_TONE: Record<string, string> = {
  neutral: '214, 222, 214',
  cold: '210, 220, 234',
};

const fogColour = (canvas: HTMLCanvasElement) => FOG_TONE[canvas.dataset.fogTone ?? 'neutral'] ?? FOG_TONE.neutral;

export function initFog(): () => void {
  if (typeof window === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const canvases = Array.from(document.querySelectorAll<HTMLCanvasElement>('canvas[data-fog]')).filter(
    (canvas) => (canvas.dataset.fog as Density) !== 'none',
  );
  if (!canvases.length) return () => {};

  const items: FogItem[] = [];

  for (const canvas of canvases) {
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;
    const density = (canvas.dataset.fog as Density) ?? 'light';
    const cfg = SETTINGS[density === 'dense' ? 'dense' : 'light'];

    const item: FogItem = {
      canvas,
      scene: canvas.closest<HTMLElement>('[data-scene], [data-chapter]'),
      ctx,
      colour: fogColour(canvas),
      w: 0,
      h: 0,
      blobs: [],
      visible: false,
    };

    item.blobs = Array.from({ length: cfg.count }, (_, i) => ({
      x: 0,
      y: 0,
      baseY: 0,
      r: 0,
      a: 0,
      vx: 0,
      phase: i * 0.7,
    }));

    items.push(item);
  }

  const measure = (item: FogItem) => {
    const rect = item.canvas.getBoundingClientRect();
    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    item.w = Math.max(1, rect.width);
    item.h = Math.max(1, rect.height);
    item.canvas.width = Math.round(item.w * dpr);
    item.canvas.height = Math.round(item.h * dpr);
    item.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const density = (item.canvas.dataset.fog as Density) ?? 'light';
    const cfg = SETTINGS[density === 'dense' ? 'dense' : 'light'];
    item.blobs.forEach((blob, i) => {
      blob.r = item.w * (cfg.maxR * (0.5 + Math.random() * 0.5));
      blob.baseY = item.h * (0.35 + Math.random() * 0.6);
      blob.y = blob.baseY;
      blob.a = cfg.alpha * (0.5 + Math.random() * 0.6);
      blob.vx = cfg.speed * (0.4 + Math.random() * 1.2);
      blob.x = (item.w / item.blobs.length) * i + Math.random() * 80;
      blob.phase = Math.random() * Math.PI * 2;
    });
  };

  for (const item of items) measure(item);

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const item = items.find((candidate) => candidate.canvas === entry.target);
        if (item) item.visible = entry.isIntersecting;
      }
    },
    { rootMargin: '20% 0px' },
  );
  for (const item of items) observer.observe(item.canvas);

  let onResize = () => {};
  let last = performance.now();
  let raf = 0;

  const draw = (item: FogItem, dt: number) => {
    const { ctx, w, h, blobs, colour } = item;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'screen';
    const t = performance.now() / 1000;
    for (const blob of blobs) {
      blob.x += blob.vx * dt;
      if (blob.x - blob.r > w) blob.x = -blob.r;
      blob.y = blob.baseY + Math.sin(t * 0.08 + blob.phase) * (h * 0.03);
      const g = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
      g.addColorStop(0, `rgba(${colour}, ${blob.a})`);
      g.addColorStop(0.6, `rgba(${colour}, ${blob.a * 0.4})`);
      g.addColorStop(1, `rgba(${colour}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (!document.hidden) {
      for (const item of items) {
        if (!item.visible) continue;
        if (item.scene?.classList.contains('is-far')) continue;
        draw(item, dt);
      }
    }
    raf = window.requestAnimationFrame(tick);
  };
  raf = window.requestAnimationFrame(tick);

  onResize = () => {
    for (const item of items) measure(item);
  };
  window.addEventListener('resize', onResize, { passive: true });

  return () => {
    window.cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    observer.disconnect();
  };
}
