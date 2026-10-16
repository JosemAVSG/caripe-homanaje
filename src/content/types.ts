/**
 * Content model for the Caripe documentary.
 *
 * The site speaks with two voices and the data model says so explicitly.
 * Every piece of narration is a `Beat`, and every beat declares its `voice`.
 * Rendering maps `voice` to a visual variant, so adding narration is adding
 * data — never editing markup.
 */

/** The two narrative registers the documentary alternates between. */
export type Voice = 'documental' | 'testimonio';

/** A factual, sourced reference. `url` is optional on purpose: the project
 *  deliberately avoids inventing links. */
export interface Source {
  label: string;
  url?: string;
}

/** Historical narration. Sober, sourced, third person. */
export interface DocumentaryBeat {
  voice: 'documental';
  text: string;
  source?: Source;
}

/** Living memory. First person, from someone who grew up in Caripe. */
export interface TestimonyBeat {
  voice: 'testimonio';
  text: string;
  attribution?: string;
  /**
   * Marks a written stand-in still awaiting its real, recorded counterpart.
   * Rendered as a discreet editorial note rather than silently passed off
   * as a collected source.
   */
  placeholder?: boolean;
}

export type Beat = DocumentaryBeat | TestimonyBeat;

/**
 * The chapter's single quotation, set large and alone.
 *
 * It is a statement, not another beat: it stands on its own, before the
 * narration, and the letters that form it are the same device the hero uses.
 * `placeholder` carries the testimony contract here too — a written stand-in
 * says so on the page.
 */
export interface Statement {
  text: string;
  attribution?: string;
  /** Marks a written stand-in still awaiting its recorded counterpart. */
  placeholder?: boolean;
}

/** A dated milestone drawn on the chapter's timeline. */
export interface Milestone {
  date: string;
  label: string;
  detail?: string;
}

/** A term worth stopping at. */
export interface LexiconEntry {
  term: string;
  /** Language tag for `term`, used for correct pronunciation/screen readers. */
  lang?: string;
  gloss: string;
  note?: string;
}

/** Reserved space for a photograph that does not exist yet. */
export interface PhotoSlot {
  caption: string;
  credit?: string;
}

/**
 * One photograph from the verified Wikimedia Commons archive.
 *
 * The image itself is never referenced by path: `photo` is a key into the
 * generated credit registry in `src/content/credits.ts`, which carries the
 * author, the licence and the original Commons page. A key that has no credit
 * record fails the build rather than shipping an uncredited image.
 */
export interface ChapterImage {
  /** Key into the registry exported by `src/content/credits.ts`. */
  photo: string;
  /** Visible caption: what the photograph actually shows. */
  caption: string;
  /** Honest alternative text. Describes the image, never the wish. */
  alt: string;
  /** `feature` takes the full width of the photograph column. */
  layout?: 'feature' | 'grid';
}

/**
 * A historical document — lithograph, plate, engraving — shown as evidence
 * beside the narration rather than as illustration.
 */
export interface EvidencePlate extends ChapterImage {
  /** Date or medium tag, e.g. "Litografía · 1874". */
  label?: string;
}

/** A chapter's photographic documentation. */
export interface ChapterGallery {
  /** Small kicker above the grid, e.g. "El ave y la cueva". */
  label?: string;
  images: ChapterImage[];
}

/** Visual temperature of a chapter. */
export type Tone = 'monte' | 'cafe' | 'bruma';

/** The chapter's composition. Each one is a different geometry, not a
 *  reordering of the same blocks. See ChapterSection.astro. */
export type ChapterLayout = 'stage' | 'band' | 'mist' | 'fork';

export interface Chapter {
  /** Stable id; doubles as the DOM id and the rail anchor. */
  slug: string;
  /** Sort order, ascending. Order is shown by position, never by a numeral. */
  order: number;
  title: string;
  kicker?: string;
  /** Opening line, set larger than the body. */
  lede?: string;
  tone?: Tone;
  /**
   * The composition this chapter is staged in. Defaults to `stage`, the
   * original two-column geometry: the photograph held on the left while the
   * text scrolls past it. The other three are genuinely different geometries,
   * not a reordering of the same blocks — see `ChapterSection.astro`.
   */
  layout?: ChapterLayout;
  /**
   * A drawn layer that belongs to this chapter's subject and is grown by the
   * reader's own scroll. Today there is one: the coffee plate, drawn in line
   * and grown branch by branch. It is ornament with a subject — the plant the
   * chapter is about — never a decoration borrowed from elsewhere.
   */
  decor?: 'coffee-branches' | 'cloud-banks';
  beats: Beat[];
  /** The chapter's own quotation, set large. Omitted when there is none. */
  statement?: Statement;
  lexicon?: LexiconEntry;
  timeline?: Milestone[];
  /** Historical documents, staged as the chapter's evidence row. */
  plates?: EvidencePlate[];
  /** Photographs from the verified archive, staged as a figure grid. */
  gallery?: ChapterGallery;
  /** Reserved frame for a chapter whose photography does not exist yet. */
  photo?: PhotoSlot;
  /** Chapter-level provenance, rendered as the source note. */
  sources?: Source[];
  /** Marks a structural stub that carries no verified content yet. */
  pending?: boolean;
  /** What a pending chapter is reserved for. Never a factual claim. */
  pendingNote?: string;
}
