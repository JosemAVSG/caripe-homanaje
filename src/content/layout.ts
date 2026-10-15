/**
 * Which archive photograph carries which fixed slot on the page.
 *
 * The hero and the full-bleed band take one photograph each. The chapters no
 * longer show those two, so no picture appears twice on the page. Captions are
 * copied verbatim from the chapter galleries: they describe what each
 * photograph shows, and nothing here adds a claim that the archive does not
 * already carry.
 */
export interface StagePhoto {
  /** Key into the registry exported by `src/content/credits.ts`. */
  photo: string;
  /** Visible caption: what the photograph actually shows. */
  caption: string;
  /** Honest alternative text. Describes the image, never the wish. */
  alt: string;
}

/** The full-bleed photograph that opens the site. */
export const heroPhoto: StagePhoto = {
  photo: 'vista-desde-el-peru',
  caption:
    'Caripe visto desde El Perú, con el Cerro Negro al fondo. El valle y la montaña que le dan nombre al apelativo.',
  alt: 'Panorámica del pueblo de Caripe en su valle, con el Cerro Negro al fondo.',
};

/** The full-bleed photograph that breaks the run of chapters in the middle. */
export const bandPhoto: StagePhoto = {
  photo: 'paisaje-pueblo',
  caption: 'Paisaje de Caripe, la tierra de la Cueva del Guácharo.',
  alt: 'Paisaje del municipio Caripe, en el estado Monagas.',
};

/** Photographs consumed by the fixed slots, so the chapters never repeat them. */
export const reservedPhotos: string[] = [heroPhoto.photo, bandPhoto.photo];
