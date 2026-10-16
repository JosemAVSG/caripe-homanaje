/**
 * The evidence vocabulary, shared by everything on this page that makes a
 * claim about the past.
 *
 * This is the spine of the documentary's honesty: no name, date or deed is
 * published without saying how well it is backed. One vocabulary for the
 * families, one for the schools, one for anything that comes later — the page
 * must not invent a second scale for a second subject.
 *
 *   a — corroborated by more than one documentary source.
 *   b — oral tradition or an unsourced clue (a hint, not a fact).
 *   c — no source at all.
 */
export type Level = 'a' | 'b' | 'c';

/** What each level means, spelled out for the reader. */
export const levels = {
  a: 'corroborado',
  b: 'tradición oral o indicio',
  c: 'sin fuente',
} as const;
