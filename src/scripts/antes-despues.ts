/**
 * The before/after slider.
 *
 * The page is complete without this file (two stacked figures). When it runs
 * it marks the section `data-ready` and reveals the control. The real range
 * input carries keyboard and screen-reader use; pointer and touch drags on the
 * frame write the same input, so there is a single source of truth.
 */
export function initAntesDespues(): void {
  const root = document.querySelector<HTMLElement>('[data-antes-despues]');
  const ctrl = root?.querySelector<HTMLElement>('[data-ctrl]');
  const range = root?.querySelector<HTMLInputElement>('[data-range]');
  if (!root || !ctrl || !range) return;

  const set = (value: number): void => {
    const v = Math.min(100, Math.max(0, Math.round(value)));
    range.value = String(v);
    root.style.setProperty('--p', String(v / 100));
    range.setAttribute('aria-valuetext', `${v} % de la obra de 1874 y ${100 - v} % de la fotografía de 2013`);
  };

  // The thumb is 2.75rem wide, so its centre travels between half a thumb
  // from each edge. The CSS uses the same inset for the divider and the clip.
  const fromPointer = (event: PointerEvent): void => {
    const rect = ctrl.getBoundingClientRect();
    const half = parseFloat(getComputedStyle(document.documentElement).fontSize) * 1.375;
    const span = rect.width - half * 2;
    if (span <= 0) return;
    set(((event.clientX - rect.left - half) / span) * 100);
  };

  set(Number(range.value));
  root.dataset.ready = '';
  ctrl.hidden = false;

  range.addEventListener('input', () => set(Number(range.value)));

  let dragging = false;
  ctrl.addEventListener('pointerdown', (event) => {
    dragging = true;
    ctrl.setPointerCapture(event.pointerId);
    range.focus({ preventScroll: true });
    fromPointer(event);
  });
  ctrl.addEventListener('pointermove', (event) => {
    if (dragging) fromPointer(event);
  });
  const stop = (): void => {
    dragging = false;
  };
  ctrl.addEventListener('pointerup', stop);
  ctrl.addEventListener('pointercancel', stop);
}
