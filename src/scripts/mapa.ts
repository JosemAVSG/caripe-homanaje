/**
 * The entry-room plan.
 *
 * Every label is already in the markup, so the page is complete without this
 * file. When it runs it marks the section `data-ready`, shows one label at a
 * time and keeps each pin's `aria-expanded` in step. Pins are real buttons:
 * click, Enter and Space come for free; the arrow keys walk between pins.
 */
export function initMapa(): void {
  const root = document.querySelector<HTMLElement>('[data-mapa]');
  if (!root) return;

  const pins = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-pin]'));
  const fichas = Array.from(root.querySelectorAll<HTMLElement>('[data-ficha]'));
  if (!pins.length || pins.length !== fichas.length) return;

  const show = (id: string): void => {
    for (const ficha of fichas) ficha.hidden = ficha.dataset.ficha !== id;
    for (const pin of pins) pin.setAttribute('aria-expanded', String(pin.dataset.pin === id));
  };

  root.dataset.ready = '';
  show(pins[0].dataset.pin ?? '');

  for (const [i, pin] of pins.entries()) {
    pin.addEventListener('click', () => show(pin.dataset.pin ?? ''));
    pin.addEventListener('keydown', (event) => {
      const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      pins[(i + step + pins.length) % pins.length].focus();
    });
  }
}
