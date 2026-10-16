import type { Chapter } from '../types';

/**
 * Chapter 03 — structural stub.
 *
 * `beats` is intentionally empty: this chapter carries NO verified content yet.
 * `pendingNote` describes the territory it is reserved for, as a plan rather
 * than a claim. Replace with real beats once research and sources exist.
 *
 * The gallery documents the landscape the chapter is reserved for; captions
 * describe the photographs only, and claim nothing the chapter has yet to earn.
 */
export const chapter: Chapter = {
  slug: 'chapter-3-neblina',
  order: 3,
  title: 'La neblina',
  kicker: 'En preparación',
  tone: 'bruma',
  layout: 'mist',
  decor: 'cloud-banks',
  pending: true,
  pendingNote:
    'Territorio reservado para el clima de montaña, el paisaje y el apelativo «el Jardín del Oriente». Pendiente de investigación, fuentes y voces.',
  beats: [],

  gallery: {
    label: 'Documentación visual · el paisaje',
    images: [
      {
        photo: 'vista-desde-el-peru',
        layout: 'feature',
        caption:
          'Caripe visto desde El Perú, con el Cerro Negro al fondo. El valle y la montaña que le dan nombre al apelativo.',
        alt: 'Panorámica del pueblo de Caripe en su valle, con el Cerro Negro al fondo.',
      },
      {
        photo: 'vista-desde-el-peru-01',
        caption: 'Otra vista de Caripe desde El Perú.',
        alt: 'Panorámica de Caripe tomada desde el sector El Perú, en el municipio Caripe.',
      },
      {
        photo: 'cerro-negro',
        caption: 'El Cerro Negro, en el Parque Nacional Alejandro de Humboldt.',
        alt: 'Cumbre del Cerro Negro, en el estado Monagas.',
      },
      {
        photo: 'mirador-de-caripe',
        caption: 'El mirador de Caripe.',
        alt: 'Mirador de Caripe, en el estado Monagas.',
      },
      {
        photo: 'paisaje-pueblo',
        caption: 'Paisaje de Caripe, la tierra de la Cueva del Guácharo.',
        alt: 'Paisaje del municipio Caripe, en el estado Monagas.',
      },
      {
        photo: 'mapa-municipio',
        caption: 'Mapa del municipio Caripe, en el estado Monagas.',
        alt: 'Mapa que delimita el municipio Caripe dentro del estado Monagas, Venezuela.',
      },
    ],
  },
};
