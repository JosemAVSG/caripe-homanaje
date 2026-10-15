/**
 * Site-level facts for the prologue and the closing colophon.
 *
 * Copy is neutral, professional Spanish. Only verified facts are stated here;
 * anything unknown is simply absent.
 */

export interface Fact {
  label: string;
  value: string;
}

export const site = {
  lang: 'es',

  /** Document title, used for <title> and social metadata. */
  metaTitle: 'Caripe · homenaje documental',

  description:
    'Un recorrido documental por Caripe del Guácharo, pueblo de montaña del estado Monagas, Venezuela: su historia, su cueva y las voces que lo recuerdan.',

  /** The name of the place. */
  title: 'Caripe',
  /** The full, official name. */
  fullTitle: 'Caripe del Guácharo',

  /** The epithet and who it is attributed to. */
  epithet: 'el Jardín del Oriente',
  epithetNote: 'Atribuido al poeta Segundo Torres, en la década de 1940.',

  standfirst:
    'Un pueblo entre la neblina, en la cordillera del Turimiquire. Esta es la historia de un lugar cuyo nombre quedó escrito en la taxonomía del mundo.',

  /** Orientation line above the title. */
  eyebrow: 'Venezuela · Estado Monagas · Municipio Caripe',

  /** Prompt to start scrolling. */
  scrollCue: 'Descender',

  facts: [
    { label: 'País', value: 'Venezuela' },
    { label: 'Estado', value: 'Monagas' },
    { label: 'Municipio', value: 'Caripe' },
    { label: 'Cordillera', value: 'Caripe · serranía del Turimiquire' },
    { label: 'Altitud', value: '≈ 800 – 1.000 m s. n. m.' },
    { label: 'Clima', value: 'Fresco y templado' },
  ] satisfies Fact[],

  colophon: {
    kicker: 'Colofón',
    thanks: 'Gracias a Caripe.',
    intro:
      'Este sitio es un homenaje documental a Caripe del Guácharo y a las personas que lo han habitado.',
    /** Honest, generic provenance — no invented citations, no fake URLs. */
    paragraphs: [
      'Fuentes: Wikipedia y prensa venezolana. Los datos históricos y naturalistas citados provienen de registros de acceso público y se reproducen sin alteraciones.',
      'Nota de edición: las voces testimoniales de esta versión son preliminares, escritas a la espera de su registro definitivo, y se señalan como tales en cada bloque. Los capítulos 02 a 04 están declarados en preparación: llevan documentación visual de su territorio, pero todavía no llevan texto.',
    ],

    /** Heading of the image-credit block. */
    creditsTitle: 'Fotografías',
    creditsIntro:
      'Todas las fotografías de este sitio provienen de Wikimedia Commons y se reproducen bajo la licencia que figura en cada ficha. Se indican siempre autor y licencia; el enlace conduce al archivo original.',
    /** What was done to the files, stated plainly: CC BY-SA requires it. */
    creditsChanges:
      'Las imágenes se han reescalado y recomprimido para la web, y en pantalla reciben un tratamiento tonal común para unificar el conjunto. Los documentos históricos se muestran completos, sin recortes. Ninguna fotografía se presenta aquí como algo distinto de lo que su ficha original declara.',

    /** Heading and note of the cartography-credit block, for the hero collage. */
    mapsTitle: 'Cartografía',
    mapsIntro:
      'Los mapas que abren el sitio provienen de Wikimedia Commons y se reproducen bajo la licencia que figura en cada ficha. Son cartografía de Venezuela, del norte de Sudamérica o del estado Monagas, y cada uno declara su fecha y su autoría. En la portada se muestran en blanco y negro, para que el papel y la cuadrícula sean la textura.',
  },

  /** Generic, honest footnote reused by every documentary block. */
  sourceFootnote:
    'Los datos históricos y naturalistas citados provienen de registros de acceso público.',
};
