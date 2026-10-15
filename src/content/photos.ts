import type { ImageMetadata } from 'astro';
import { getPhotoCredit, type PhotoCredit } from './credits';

/**
 * Resolves the credit registry onto the actual files in `src/assets/fotos/`.
 *
 * The registry is generated from the Wikimedia Commons API and knows file
 * *names*; Vite knows the image *modules*. This module is the single join
 * between them, so a photograph can never reach a page without its credit, and
 * a credit can never point at a file that does not exist.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/fotos/*.{jpg,jpeg,png,svg}',
  { eager: true },
);

const byFileName = new Map<string, ImageMetadata>();
for (const [path, module] of Object.entries(modules)) {
  const name = path.split('/').pop();
  if (name) byFileName.set(name, module.default);
}

export interface ResolvedPhoto {
  /** Registry key, as used by the content model. */
  id: string;
  /** The optimisable asset. */
  src: ImageMetadata;
  /** Author, licence and Commons page — never optional. */
  credit: PhotoCredit;
}

/** Resolve one archive key. Throws at build time when anything is missing. */
export function getPhoto(id: string): ResolvedPhoto {
  const credit = getPhotoCredit(id);
  const src = byFileName.get(credit.file);

  if (!src) {
    throw new Error(
      `[caripe] Credit "${id}" points at "${credit.file}", which is not in ` +
        'src/assets/fotos/. Re-run: node scripts/fetch-commons-photos.mjs',
    );
  }

  return { id, src, credit };
}

export { photoCredits, photoCreditById, getPhotoCredit } from './credits';
export type { PhotoCredit } from './credits';
