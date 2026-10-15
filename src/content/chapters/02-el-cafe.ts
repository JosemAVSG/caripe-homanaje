import type { Chapter } from '../types';

/**
 * Chapter 02 — structural stub.
 *
 * `beats` is intentionally empty: this chapter carries NO verified content yet.
 * `pendingNote` describes the territory it is reserved for, as a plan rather
 * than a claim. Replace with real beats once research and sources exist.
 *
 * The gallery is documentation of that territory, not narration: each caption
 * describes only what the photograph shows, and the pending note says out loud
 * that the chapter itself is still unwritten.
 */
export const chapter: Chapter = {
  slug: 'chapter-2-cafe',
  order: 2,
  number: '02',
  title: 'El café',
  kicker: 'En preparación',
  tone: 'cafe',
  pending: true,
  pendingNote:
    'Territorio reservado para la montaña cultivada: el café, el trabajo de la cordillera y la vida cotidiana del pueblo. Pendiente de investigación, fuentes y voces.',
  beats: [],

  gallery: {
    label: 'Documentación visual · la montaña cultivada',
    images: [
      {
        photo: 'montana-caripe',
        layout: 'feature',
        caption:
          'Ladera de montaña en Caripe, muy cerca del poblado de El Guácharo. La cordillera que el capítulo todavía debe contar.',
        alt: 'Ladera de montaña cubierta de vegetación en Caripe, cerca del poblado de El Guácharo.',
      },
      {
        photo: 'finca-montana-01',
        caption: 'Finca de montaña en Caripe, cerca del Fangal.',
        alt: 'Finca de montaña en Caripe, cerca del Fangal, en el estado Monagas.',
      },
      {
        photo: 'finca-montana-02',
        caption: 'Segunda vista de la finca de montaña, cerca del Fangal.',
        alt: 'Otra vista de la finca de montaña en Caripe, cerca del Fangal.',
      },
      {
        photo: 'cerro-negro-sabana',
        caption: 'El Cerro Negro visto desde Sabana de Piedra.',
        alt: 'El Cerro Negro, en el estado Monagas, visto desde Sabana de Piedra.',
      },
      {
        photo: 'orquidea-cattleya',
        caption:
          'Orquídeas del género Cattleya en las adyacencias de la Cueva del Guácharo.',
        alt: 'Orquídeas Cattleya en las inmediaciones de la Cueva del Guácharo, Caripe.',
      },
      {
        photo: 'caballito-volador',
        caption: 'Un «caballito volador» —un odonato— fotografiado en Caripe, Monagas.',
        alt: 'Libélula (odonato) fotografiada en Caripe, estado Monagas.',
      },
    ],
  },
};
