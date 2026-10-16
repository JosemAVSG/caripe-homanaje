import type { Chapter } from '../types';

/**
 * Chapter 06 — structural stub.
 *
 * `beats` is intentionally empty: this chapter carries NO verified content yet.
 * `pendingNote` describes the territory it is reserved for, as a plan rather
 * than a claim. Replace with real beats once research and sources exist.
 *
 * The gallery is the village itself — public space and buildings — documented
 * without narration, since the voices this chapter needs have not been recorded
 * yet. The Abraham Lincoln photograph is not here: it belongs to the schools
 * register, where the one school the archive can show stands in its own year.
 */
export const chapter: Chapter = {
  slug: 'chapter-6-partir',
  order: 6,
  title: 'Quedarse o partir',
  kicker: 'En preparación',
  tone: 'monte',
  layout: 'fork',
  decor: 'forked-road',
  pending: true,
  pendingNote:
    'Territorio reservado para la migración: la memoria de quienes se fueron y de quienes se quedaron. Pendiente de voces y registro.',
  beats: [],

  gallery: {
    label: 'Documentación visual · el pueblo',
    images: [
      {
        photo: 'casas-estilo-alpino',
        layout: 'feature',
        caption:
          'Casas de estilo alpino en Caripe, una de las señas de identidad del casco del pueblo.',
        alt: 'Viviendas de estilo alpino en Caripe, estado Monagas, Venezuela.',
      },
      {
        photo: 'plaza-bolivar',
        caption: 'La plaza Bolívar de Caripe.',
        alt: 'Plaza Bolívar de Caripe, con la estatua de Simón Bolívar.',
      },
      {
        photo: 'estatua-bolivar',
        caption: 'La estatua de Simón Bolívar en la plaza de Caripe.',
        alt: 'Estatua de Simón Bolívar en Caripe, Venezuela.',
      },
      {
        photo: 'iglesia-santo-angel',
        caption: 'La iglesia del Santo Ángel Custodio.',
        alt: 'Iglesia del Santo Ángel Custodio, en Caripe, Venezuela.',
      },
    ],
  },
};
