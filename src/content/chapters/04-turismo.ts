import type { Chapter } from '../types';

/**
 * Chapter 04 — Caripe as a destination.
 *
 * The valley that stopped growing coffee for export learned to receive
 * visitors. Facts come from the municipal reference on Wikipedia and from
 * travel and press pages; none is a firsthand record. Opening hours, prices and
 * lodging are deliberately left out: they change, and a documentary should not
 * quote them.
 *
 * There is no gallery yet. Every photograph already in the archive is used by
 * another chapter, and the page never shows a picture twice, so this chapter
 * reserves a frame (`photo`) until new files are supplied and credited.
 */
export const chapter: Chapter = {
  slug: 'chapter-4-turismo',
  order: 4,
  title: 'El jardín de oriente',
  kicker: 'Lo que el pueblo ofrece',
  tone: 'monte',
  layout: 'mist',
  lede: 'Cuando el café dejó de sostener el valle, quedó lo que la montaña ya tenía: una cueva, cerros, saltos de agua y un clima fresco. Hoy el turismo es, con el café, parte esencial de la economía de Caripe.',

  lexicon: {
    term: 'Jardín de Oriente',
    gloss: 'El apelativo de Caripe',
    note: 'Se lo dio el poeta Segundo Torres en la década de 1940.',
  },

  beats: [
    {
      voice: 'documental',
      text: 'El principal atractivo es el Parque Nacional El Guácharo, a unos doce kilómetros del pueblo y establecido el 27 de mayo de 1975. Su cueva es la más larga de Venezuela, con más de diez kilómetros de galerías, y una de sus escenas más esperadas es la salida de los guácharos al caer la tarde.',
      source: { label: 'Wikipedia, Parque Nacional Cueva del Guácharo; Minec' },
    },
    {
      voice: 'documental',
      text: 'Arriba, en Sabana de Piedra, está el Cerro Negro, de unos 2.280 metros, uno de los puntos más altos de Monagas. Hay senderos hacia él, hacia el Chorrerón —la cascada más alta del estado— y hacia La Paila.',
      source: { label: 'Guías de viaje de Caripe (Minube; Mi mundo por el mundo)' },
    },
    {
      voice: 'documental',
      text: 'En el pueblo, el mercado de los sábados, el casco con sus casas antiguas, los monumentos al guácharo y la iglesia, y desde finales de 2025 el Mirador de Caripe, reabierto sobre el valle.',
      source: { label: 'Guías de viaje de Caripe; La Verdad de Monagas (2026)' },
    },
    {
      voice: 'documental',
      text: 'El clima es de bosque húmedo premontano: entre 12 y 24 grados de media anual y lluvias marcadas de mayo a noviembre. Dentro de la cueva la temperatura ronda los 19 grados.',
      source: { label: 'Wikipedia, Municipio Caripe' },
    },
  ],

  photo: {
    caption:
      'Pendiente: fotografías del turismo en Caripe (cascadas, senderos, mercado, posadas).',
  },

  sources: [
    {
      label: 'Wikipedia, Municipio Caripe',
      url: 'https://es.wikipedia.org/wiki/Municipio_Caripe',
    },
    {
      label: 'Minec, «La Cueva del Guácharo es el principal atractivo turístico de Monagas»',
      url: 'http://www.minec.gob.ve/la-cueva-del-guacharo-es-el-principal-atractivo-turistico-de-monagas/',
    },
    {
      label: 'Mi mundo por el mundo, «Caripe: turismo en el jardín del oriente venezolano»',
      url: 'https://mimundoporelmundo.com.ar/caripe-turismo/',
    },
    {
      label: 'Minube, «Qué ver en Caripe: 6 rincones ocultos por descubrir»',
      url: 'https://www.minube.com/tips/actualidad/encantos-ocultos-de-caripe-lugares-que-ver-y-disfrutar',
    },
  ],
};
