/**
 * "El camino del café": order four steps.
 *
 * The true order is the order of the static list in the markup, so the page is
 * complete without this file. When it runs it builds shuffled cards from that
 * list and marks the section `data-ready`. Three ways to move a card: drag it
 * (mouse), tap one card and then another to swap them (touch, keyboard), or
 * use the arrows on each card. Reduced motion keeps the static list.
 */
export function initRetoCafe(): void {
  const root = document.querySelector<HTMLElement>('[data-reto]');
  if (!root) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const board = root.querySelector<HTMLOListElement>('[data-board]');
  const feedback = root.querySelector<HTMLElement>('[data-feedback]');
  const check = root.querySelector<HTMLButtonElement>('[data-check]');
  const reveal = root.querySelector<HTMLButtonElement>('[data-reveal]');
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-static] li')).map(
    (li) => li.textContent?.trim() ?? '',
  );
  if (!board || !feedback || !check || !reveal || steps.length < 2) return;

  // Cards hold the index of their step in the true order.
  let order = shuffle(steps.length);
  let selected = -1; // position of the selected card, or -1
  let dragFrom = -1;
  let solved = false;

  const say = (text: string): void => {
    feedback.textContent = text;
  };

  const move = (from: number, to: number): void => {
    const [item] = order.splice(from, 1);
    order.splice(to, 0, item);
  };

  const swap = (a: number, b: number): void => {
    [order[a], order[b]] = [order[b], order[a]];
  };

  const render = (focusPos = -1, focusKind = 'pick'): void => {
    board.replaceChildren();
    order.forEach((stepIndex, pos) => {
      const li = document.createElement('li');
      li.className = 'rcard';
      if (!solved) li.draggable = true;
      if (pos === selected) li.classList.add('is-selected');
      if (solved || inPlace.has(stepIndex)) li.classList.add('is-ok');
      li.dataset.pos = String(pos);

      const pick = document.createElement('button');
      pick.type = 'button';
      pick.className = 'rcard__pick';
      pick.dataset.kind = 'pick';
      pick.disabled = solved;
      pick.setAttribute('aria-pressed', String(pos === selected));
      const n = document.createElement('span');
      n.className = 'rcard__n';
      n.textContent = `${pos + 1}.`;
      const txt = document.createElement('span');
      txt.className = 'rcard__txt';
      txt.textContent = steps[stepIndex];
      pick.append(n, txt);
      if (solved || inPlace.has(stepIndex)) {
        const mark = document.createElement('span');
        mark.className = 'rcard__mark';
        mark.textContent = 'En su sitio';
        pick.append(mark);
      }
      li.append(pick);

      if (!solved) {
        const arrows = document.createElement('div');
        arrows.className = 'rcard__move';
        for (const [kind, label, glyph, delta] of [
          ['up', 'Subir', '▲', -1],
          ['down', 'Bajar', '▼', 1],
        ] as const) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'rcard__btn';
          b.dataset.kind = kind;
          b.dataset.delta = String(delta);
          b.setAttribute('aria-label', `${label}: ${steps[stepIndex]}`);
          b.textContent = glyph;
          b.disabled = pos + delta < 0 || pos + delta >= order.length;
          arrows.append(b);
        }
        li.append(arrows);
      }
      board.append(li);
    });
    if (focusPos >= 0) {
      const target = board.querySelector<HTMLButtonElement>(
        `[data-pos="${focusPos}"] [data-kind="${focusKind}"]:not(:disabled)`,
      ) ?? board.querySelector<HTMLButtonElement>(`[data-pos="${focusPos}"] [data-kind="pick"]`);
      target?.focus();
    }
  };

  // Steps found in place at the last check; cleared as soon as anything moves.
  let inPlace = new Set<number>();
  const changed = (): void => {
    inPlace = new Set();
    selected = -1;
  };

  const posOf = (el: Element): number => Number(el.closest<HTMLElement>('[data-pos]')?.dataset.pos ?? -1);

  board.addEventListener('click', (event) => {
    if (solved) return;
    const btn = (event.target as Element).closest<HTMLButtonElement>('button');
    if (!btn) return;
    const pos = posOf(btn);
    if (pos < 0) return;

    if (btn.dataset.kind === 'pick') {
      if (selected < 0) {
        selected = pos;
        render(pos);
        say('Paso elegido. Toca otro para intercambiarlos, o toca el mismo para soltarlo.');
      } else if (selected === pos) {
        selected = -1;
        render(pos);
        say('');
      } else {
        const from = selected;
        changed();
        swap(from, pos);
        render(pos);
        say(`Intercambiados: ahora están en los lugares ${Math.min(from, pos) + 1} y ${Math.max(from, pos) + 1}.`);
      }
      return;
    }

    const delta = Number(btn.dataset.delta);
    changed();
    move(pos, pos + delta);
    render(pos + delta, btn.dataset.kind);
    say(`Paso movido al lugar ${pos + delta + 1} de ${order.length}.`);
  });

  // Mouse drag: drop a card on another to put it in that place.
  board.addEventListener('dragstart', (event) => {
    dragFrom = posOf(event.target as Element);
    (event.target as Element).closest('.rcard')?.classList.add('is-dragging');
    event.dataTransfer?.setData('text/plain', String(dragFrom));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  });
  board.addEventListener('dragover', (event) => {
    if (dragFrom < 0) return;
    event.preventDefault();
    for (const c of board.querySelectorAll('.is-over')) c.classList.remove('is-over');
    (event.target as Element).closest('.rcard')?.classList.add('is-over');
  });
  board.addEventListener('drop', (event) => {
    event.preventDefault();
    const to = posOf(event.target as Element);
    const from = dragFrom;
    dragFrom = -1;
    if (from < 0 || to < 0 || from === to) return render();
    changed();
    move(from, to);
    render();
    say(`Paso movido al lugar ${to + 1} de ${order.length}.`);
  });
  board.addEventListener('dragend', () => {
    dragFrom = -1;
    render();
  });

  const finish = (text: string): void => {
    solved = true;
    selected = -1;
    root.dataset.solved = '';
    check.disabled = true;
    reveal.hidden = true;
    render();
    say(text);
  };

  check.addEventListener('click', () => {
    inPlace = new Set(order.filter((stepIndex, pos) => stepIndex === pos));
    selected = -1;
    const right = inPlace.size;
    if (right === order.length) {
      finish('Eso es: ese fue el camino del café. Más abajo está la ficha del recorrido.');
      return;
    }
    render();
    say(
      right === 0
        ? 'Todavía ninguno está en su sitio. Piensa por dónde sale el café del valle y vuelve a probar.'
        : `${right} de ${order.length} en su sitio. Mueve los demás y vuelve a comprobar.`,
    );
    reveal.hidden = false;
  });

  reveal.addEventListener('click', () => {
    order = steps.map((_, i) => i);
    finish('Esta es la ruta, en orden. Más abajo está la ficha del recorrido.');
  });

  root.dataset.ready = '';
  render();
}

/** Fisher-Yates over 0..n-1, retried until the result is not already solved. */
function shuffle(n: number): number[] {
  const out = Array.from({ length: n }, (_, i) => i);
  do {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
  } while (out.every((v, i) => v === i));
  return out;
}
