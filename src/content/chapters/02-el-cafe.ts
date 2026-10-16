import type { Chapter } from '../types';

/**
 * Chapter 02 — El café.
 *
 * The cultivated mountain. Every documentary beat states only sourced facts and
 * names its provenance in words, because a beat's `source` renders as a citation
 * line, not a link. Where the sources disagree, the disagreement is kept: the
 * Variedad Caripe is dated twice, because two credible sources date it
 * differently and neither has been established as the correct one.
 *
 * The closing testimony is a written stand-in marked `placeholder: true`. It
 * carries no name, date or figure — only a sensation — and the page says out
 * loud that it is preliminary.
 *
 * The chapter's own document is the drawn coffee branch, grown by the reader's
 * scroll; the gallery is photographic documentation of the valley it describes.
 */
export const chapter: Chapter = {
  slug: 'chapter-2-cafe',
  order: 2,
  title: 'El café',
  kicker: 'La montaña cultivada',
  tone: 'cafe',
  layout: 'band',
  decor: 'coffee-branches',
  lede: 'Fue la montaña cultivada: café en las laderas, mulas cargadas hacia el muelle, y una variedad que terminó llevando el nombre del pueblo.',

  lexicon: {
    term: 'Variedad Caripe',
    gloss: '«Cogollo Verde»',
    note: 'La primera variedad venezolana de café admitida en el catálogo mundial de World Coffee Research, en 2023. Es afín al Typica, de grano grande, y susceptible a la roya. El pueblo no solo le dio su nombre a un ave: también se lo dio a un café.',
  },

  timeline: [
    {
      date: '1799',
      label: 'Los primeros cafetos anotados',
      detail:
        'Humboldt registra cinco mil pies de cafetos en el conuco comunitario del valle. Es la mención más antigua que se conoce del café en Caripe.',
    },
    {
      date: 'Finales del siglo XIX',
      label: 'Las haciendas',
      detail:
        'Familias italianas y corsas se establecen en el valle e introducen métodos de cultivo más avanzados. Nacen las grandes haciendas cafetaleras.',
    },
    {
      date: '1925',
      label: 'La carretera al Muelle de Cariaco',
      detail:
        'Hasta entonces el café salía a lomo de mula por un camino de indios. La carretera cambia el comercio del valle.',
    },
    {
      date: 'Mediados del siglo XX',
      label: 'El petróleo vacía el campo',
      detail:
        'La mano de obra se desplaza a la industria petrolera. Muchas fincas cafetaleras se abandonan y el pueblo se vuelve hacia las hortalizas y, después, hacia el turismo.',
    },
    {
      date: '1956–1958',
      label: 'Se selecciona la Variedad Caripe',
      detail:
        'World Coffee Research fecha la identificación de la variedad en 1956; otras fuentes sitúan el inicio del programa de selección en 1958. Las dos fechas siguen en pie.',
    },
    {
      date: '2023',
      label: 'La Variedad Caripe entra al catálogo mundial',
      detail:
        'World Coffee Research la incorpora a su catálogo de variedades: la primera de Venezuela en figurar en él.',
    },
  ],

  beats: [
    {
      voice: 'documental',
      text: 'En 1799, Alexander von Humboldt anotó en su diario de viaje que en el valle de Caripe había un conuco comunitario con cinco mil pies de cafetos, «que prometían una hermosa cosecha». Es la mención más antigua que se conoce del café en el pueblo.',
      source: {
        label:
          'Humboldt, Viaje a las Regiones Equinocciales (1799), citado en el Boletín de la Academia Nacional de la Historia, 1982',
      },
    },
    {
      voice: 'documental',
      text: 'A finales del siglo XIX, familias italianas y corsas se establecieron en el valle. Con ellas llegaron métodos de cultivo más avanzados, y con ellas nacieron las grandes haciendas cafetaleras y los primeros comercios.',
      source: {
        label:
          'Historia local de Caripe; registro de la inmigración corsa en Venezuela',
      },
    },
    {
      voice: 'documental',
      text: 'Antes de que existiera carretera, el café salía del valle a hombros de hombres y a lomo de mulas, por un camino de indios hasta el Muelle de Cariaco. Allí se cambiaba por sal, pescado y kerosén, y de allí seguía por mar hacia Cumaná o La Guaira. En 1925 se construyó la carretera.',
      source: {
        label:
          'Gonzalo Martínez, manuscrito local sobre el café en Caripe (2002); estudios sobre el agrarismo en el oriente venezolano',
      },
    },
    {
      voice: 'documental',
      text: 'Hacia mediados del siglo XX, el auge petrolero desplazó la mano de obra del campo. Muchas fincas cafetaleras del valle se abandonaron, y el pueblo fue volviéndose hacia las hortalizas, los cítricos y, más tarde, el turismo.',
      source: {
        label: 'Reportajes sobre el café de Caripe (2022, 2024)',
      },
    },
    {
      voice: 'documental',
      text: 'En Caripe se seleccionó una variedad propia de café. Los caficultores la llaman «Cogollo Verde»; es afín al Typica, de grano grande, y susceptible a la roya. En 2023, World Coffee Research la incluyó en su catálogo mundial: la primera variedad venezolana en figurar en él.',
      source: {
        label: 'World Coffee Research, catálogo de variedades (2023)',
      },
    },
    {
      voice: 'documental',
      text: 'La caficultura que queda es mayoritariamente de sombra, cerca del noventa por ciento, entre los 950 y los 1.300 metros de altura, y sigue plantando Typica, Bourbon, Catuaí, Caturra y Mundo Novo.',
      source: {
        label: 'Reportajes sobre el café de Caripe (2024)',
      },
    },
    {
      // Placeholder voice: no name, no date, no figure. A sensation only.
      voice: 'testimonio',
      text: 'Ninguna fotografía me devuelve al pueblo tan rápido como el olor del café. Un patio de grano puestos a asolear se ve de lejos, como una sábana tendida; y cuando alguien tuesta cerca, yo vuelvo.',
      placeholder: true,
    },
  ],

  aside: [
    {
      photo: 'cafe-cerezas-colombia',
      caption:
        'Cerezas de café maduras entre las hojas, en Zapatoca, Santander, Colombia. No es Caripe: es un cafetal de montaña, como los del valle.',
      alt: 'Racimo de cerezas rojas de café sobre la rama, rodeado de hojas verdes y brillantes.',
    },
    {
      photo: 'cafe-recolector-tolima',
      caption:
        'Un recolector entre cafetos y plátanos, en Rioblanco, Tolima, Colombia. No es Caripe: es café de sombra en ladera.',
      alt: 'Un hombre agachado recoge café entre cafetos, con plataneras y una ladera de montaña al fondo.',
    },
    {
      photo: 'cafe-sombra-cachipay',
      caption:
        'Cafetos bajo el dosel del bosque, en Cachipay, Cundinamarca, Colombia. No es Caripe: es el café de sombra que aún domina el valle.',
      alt: 'Cafetos bajos creciendo bajo árboles altos cubiertos de musgo, en una finca de Cachipay.',
    },
  ],

  gallery: {
    label: 'Documentación visual · el valle cultivado',
    images: [
      {
        photo: 'montana-caripe',
        layout: 'feature',
        caption:
          'Ladera de montaña en Caripe, muy cerca del poblado de El Guácharo. La cordillera que el capítulo cuenta.',
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
        caption: 'Un «caballito volador», un odonato, fotografiado en Caripe, Monagas.',
        alt: 'Libélula (odonato) fotografiada en Caripe, estado Monagas.',
      },
    ],
  },

  sources: [
    {
      label: 'Humboldt, Viaje a las Regiones Equinocciales del Nuevo Continente (1799)',
    },
    {
      label: 'Gonzalo Martínez, manuscrito local sobre el café en Caripe (2002)',
    },
    {
      label: 'World Coffee Research, catálogo de variedades de café',
      url: 'https://varieties.worldcoffeeresearch.org/es/variedades/caripe',
    },
    {
      label: 'Reportajes sobre el café de Caripe (Perfect Daily Grind, 2024)',
    },
  ],
};
