/**
 * The opening collage: an editorial plate of historical cartography with one
 * living photograph of Caripe at its centre.
 *
 * The composition says what the documentary says: the reader first meets the
 * territory at every scale — the world, the country, the state, the terrain —
 * and then the place itself, in the one frame that is actually moving.
 *
 * Credits come from `collage-credits.ts` (generated from the Commons API); the
 * captions here are authored copy that describes **only what the image shows**.
 * Every old map is of Venezuela or South America and says so; the single
 * photograph is a real, named place in Caripe.
 */
import type { PhotoCredit } from './credits';
import { getCollageCredit, type CollageCredit } from './collage-credits';
import { resolvePhotoCredit, type ResolvedPhoto } from './photos';

/** Named slots of the six-column, two-row band. Placement lives in CSS. */
export type CollageSlot =
  | 'living'
  | 'guiana-blaeu'
  | 'guiana-sanson'
  | 'orinoco'
  | 'venezuela-pinkerton'
  | 'monagas'
  | 'buja';

export interface CollageCell {
  /** Grid slot; the CSS maps this name onto a `grid-area`. */
  slot: CollageSlot;
  /** Key into the generated collage credit registry. */
  photo: string;
  /** 'photo' is the living cell; 'map' is historical cartography. */
  kind: 'map' | 'photo';
  /** Visible caption: what the image actually shows. Never a claim. */
  caption: string;
  /** Honest alternative text. */
  alt: string;
}

/**
 * Read in the order the eye crosses the band. The living cell anchors it; the
 * maps run from the widest view to the closest terrain.
 */
export const collageCells: CollageCell[] = [
  {
    slot: 'living',
    photo: 'hacienda-teresen-caripe',
    kind: 'photo',
    caption: 'Una vieja hacienda de café en Teresen, en el municipio Caripe.',
    alt: 'Vieja hacienda de café en Teresen, en el municipio Caripe del estado Monagas.',
  },
  {
    slot: 'guiana-blaeu',
    photo: 'map-guiana-blaeu-1635',
    kind: 'map',
    caption: 'La Guayana y el norte de Sudamérica en un mapa de 1635.',
    alt: 'Mapa impreso de la Guayana y el norte de Sudamérica, de 1635.',
  },
  {
    slot: 'guiana-sanson',
    photo: 'map-guiana-sanson-1656',
    kind: 'map',
    caption: 'El noroeste de Sudamérica en un mapa de 1656.',
    alt: 'Mapa impreso del noroeste de Sudamérica, de 1656.',
  },
  {
    slot: 'orinoco',
    photo: 'map-orinoco-1732',
    kind: 'map',
    caption: 'El valle y el delta del Orinoco en un mapa de 1732.',
    alt: 'Mapa impreso del valle y el delta del río Orinoco, de 1732.',
  },
  {
    slot: 'venezuela-pinkerton',
    photo: 'map-venezuela-pinkerton-1818',
    kind: 'map',
    caption: 'Venezuela, Guayana y Surinam en un mapa de 1818.',
    alt: 'Mapa impreso del nordeste de Sudamérica de 1818, con Venezuela, Guayana y Surinam.',
  },
  {
    slot: 'monagas',
    photo: 'map-monagas-mintur-2015',
    kind: 'map',
    caption: 'Mapa turístico del estado Monagas, de 2015.',
    alt: 'Mapa turístico impreso del estado Monagas y de la ciudad de Maturín, de 2015.',
  },
  {
    slot: 'buja',
    photo: 'map-hoja-7644-san-jose-de-buja-1979',
    kind: 'map',
    caption: 'Hoja topográfica de San José de Buja, escala 1:100.000, de 1979.',
    alt: 'Hoja topográfica impresa de San José de Buja, estado Monagas, a escala 1:100.000, de 1979.',
  },
];

/** The living cell: the one frame in the collage that is actually in motion. */
export const livingCell: CollageCell = collageCells.find((cell) => cell.kind === 'photo')!;

export interface ResolvedCollage {
  cell: CollageCell;
  image: ResolvedPhoto;
  credit: CollageCredit;
}

/** Resolve one collage cell onto its file and credit, failing loudly at build. */
export function getCollageCell(cell: CollageCell): ResolvedCollage {
  const credit = getCollageCredit(cell.photo);
  return { cell, image: resolvePhotoCredit(credit), credit };
}

/** Every cell, resolved. */
export const resolvedCollage: ResolvedCollage[] = collageCells.map(getCollageCell);

/** The old maps only, for the cartography credit block in the colophon. */
export const collageMaps: CollageCredit[] = collageCells
  .filter((cell) => cell.kind === 'map')
  .map((cell) => getCollageCredit(cell.photo));

/** The living photograph, for the photographic credit block in the colophon. */
export const collagePhotographs: CollageCredit[] = collageCells
  .filter((cell) => cell.kind === 'photo')
  .map((cell) => getCollageCredit(cell.photo));

export type { PhotoCredit };
