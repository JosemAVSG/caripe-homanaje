import type { Chapter } from '../types';

/**
 * Chapter 03 — La neblina.
 *
 * The chapter the mountain's weather wrote: the low cloud, the cold, the cloud
 * forest and the birds that live inside it. Every documentary beat states only
 * sourced facts, and where the sources disagree the disagreement is kept as the
 * finding. The altitude of the town and the height of Cerro Negro are published
 * as ranges, because no single figure is agreed on, and that is the honest way
 * to print them.
 *
 * The cita is the author's own memory of reading the weather. This is the
 * chapter that composition was built for: in the `mist` layout the words
 * condense out of the fog before the heading arrives, so no written stand-in is
 * needed here. The voice is the real one.
 *
 * There is no timeline: a chronology of weather has no milestones, and the seam
 * belongs to the chapters that have dates to lay on it.
 */
export const chapter: Chapter = {
  slug: 'chapter-3-neblina',
  order: 3,
  title: 'La neblina',
  kicker: 'El clima de la montaña',
  tone: 'bruma',
  layout: 'mist',
  decor: 'cloud-banks',
  lede: 'La montaña no es el escenario del pueblo: es su clima. Aquí la niebla es un dato de la vida diaria.',

  statement: {
    text: 'Yo nací aquí y viví veintidós años entre esta neblina. Uno aprende a leer el día por el color de la bruma: si baja hasta el valle va a llover; si se queda arriba, todavía hay tiempo.',
    placeholder: true,
  },

  lexicon: {
    term: 'Selva nublada',
    gloss: '«bosque nuboso»',
    note: 'El piso de bosque que vive dentro de la niebla, por encima del pueblo. Es el que rodea la cueva y el que alberga las plantas endémicas del macizo del Turimiquire.',
  },

  beats: [
    {
      voice: 'documental',
      text: 'Caripe está en el macizo del Turimiquire, en el oriente de Venezuela. El pueblo ocupa un valle estrecho de la cordillera, y su altitud no tiene una cifra única: Humboldt la midió cerca de los 975 metros, la Encyclopædia Britannica de 1911 le dio 803, y los registros locales hablan de 800 a 928. La cifra que se repite es una franja, no un número.',
      source: {
        label:
          'Altimetría comparada: Humboldt (1799), Encyclopædia Britannica (1911), registros geográficos locales',
      },
    },
    {
      voice: 'documental',
      text: 'Las cumbres que la rodean tampoco se ponen de acuerdo. El pico Turimiquire, la mayor del macizo, ronda los 2.600 metros. El Cerro Negro, dentro del parque, se cita entre los 2.280 y los 2.430 según la fuente. Es una montaña cuyas medidas todavía se discuten.',
      source: {
        label: 'Registros orográficos del macizo del Turimiquire',
      },
    },
    {
      voice: 'documental',
      text: 'Hace frío en el valle, y los números lo dicen: entre 12 y 24 grados, con una media cercana a los 21. Bajo la roca, la cueva mantiene una temperatura casi constante, entre 19 y 21 grados, con la humedad cerca del cien por ciento.',
      source: {
        label:
          'Estimaciones climáticas regionales; zonas de vida de Holdridge según INPARQUES',
      },
    },
    {
      voice: 'documental',
      text: 'Por encima del pueblo, el parque reúne tres pisos de bosque húmedo: premontano, muy húmedo premontano y muy húmedo montano bajo. Allí crecen laureles, copeyes, helechos arborescentes, aráceas y orquídeas. Del macizo se han descrito además plantas endémicas: un anthurium, un centropogon y un solanum llevan el nombre de Caripe o de Monagas.',
      source: {
        label: 'INPARQUES; registros botánicos del macizo del Turimiquire',
      },
    },
    {
      voice: 'documental',
      text: 'El parque registra 367 especies de aves y está declarado Área Importante para las Aves. Tres de ellas están amenazadas: el atrapamoscas de Caripe, que lleva el nombre del pueblo, el colibrí de Berlepsch y la diglosa venezolana.',
      source: {
        label:
          'Libro Rojo de la Fauna Venezolana, 4.ª edición; BirdLife International',
      },
    },
  ],

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
        caption:
          'El Cerro Negro, en el Parque Nacional El Guácharo. El Monumento Natural Alejandro de Humboldt protege la cueva dentro del mismo parque.',
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

  sources: [
    {
      label: 'INPARQUES, Parque Nacional El Guácharo',
      url: 'https://www.inparques.gob.ve/cms/main/verGaleria/96',
    },
    {
      label: 'Sociedad Venezolana de Espeleología',
      url: 'https://sve-espeleologia.org.ve/',
    },
    {
      label:
        'Humboldt, Viaje a las Regiones Equinocciales del Nuevo Continente (1799)',
    },
    {
      label: 'Libro Rojo de la Fauna Venezolana, 4.ª edición',
    },
  ],
};
