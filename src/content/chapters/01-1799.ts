import type { Chapter } from '../types';

/**
 * Chapter 01 — 1799.
 *
 * Every documentary beat below states only verified facts. Testimony beats are
 * written stand-ins marked `placeholder: true`; they carry no invented names,
 * dates or figures and are rendered with a discreet editorial note until the
 * real recorded voice replaces them.
 *
 * `plates` are the chapter's evidence: period documents, in the public domain,
 * shown beside the narration they corroborate. `gallery` is contemporary
 * documentation of the cave and the bird, each image referenced by its key in
 * the generated credit registry.
 */
export const chapter: Chapter = {
  slug: 'chapter-1-1799',
  order: 1,
  title: '1799',
  kicker: 'La cueva y el nombre',
  tone: 'monte',
  lede: 'Un naturalista alemán entró en una cueva del oriente de Venezuela, y el nombre del pueblo quedó escrito en la taxonomía del mundo.',

  // The chapter's opening voice, set large and alone before the narration. It
  // is the first testimony this file used to carry inside `beats`; keeping it
  // in one place only is the point, so it is not repeated further down.
  statement: {
    text: 'Yo nací aquí y viví veintidós años entre esta neblina. Uno aprende a leer el día por el color de la bruma: si baja hasta el valle va a llover; si se queda arriba, todavía hay tiempo.',
    placeholder: true,
  },

  lexicon: {
    term: 'Steatornis caripensis',
    lang: 'la',
    gloss: '«ave grasa de Caripe»',
    note: 'El género nombra al ave grasa; la especie, al lugar. El pueblo y el pájaro comparten nombre.',
  },

  timeline: [
    {
      date: '18 de septiembre de 1799',
      label: 'Humboldt y Bonpland en la cueva',
      detail:
        'Alexander von Humboldt y Aimé Bonpland visitan la Cueva del Guácharo durante su recorrido por Venezuela.',
    },
    {
      date: '15 de julio de 1949',
      label: 'Monumento Natural Alejandro de Humboldt',
      detail:
        'La cueva es declarada monumento natural. Es el primer monumento natural de Venezuela.',
    },
    {
      date: '27 de mayo de 1975',
      label: 'Parque Nacional El Guácharo',
      detail:
        'Se crea el parque nacional con 62.700 hectáreas, administrado por INPARQUES.',
    },
  ],

  plates: [
    {
      photo: 'bellermann-cueva-1874',
      label: 'Bellermann · 1874',
      caption:
        '«Cueva del Guácharo», obra de Ferdinand Bellermann fechada en 1874: la misma boca de cueva que Humboldt y Bonpland recorrieron en 1799, dibujada tres cuartos de siglo después.',
      alt: 'Obra del siglo XIX que representa la boca de la Cueva del Guácharo entre paredes de roca y vegetación tropical.',
    },
    {
      photo: 'humboldt-plate-1811',
      label: 'Humboldt · 1811',
      caption:
        'Lámina de la «Recueil d’observations de zoologie et d’anatomie comparée» de Humboldt y Bonpland (1811): cabeza, pata, mandíbula inferior y una pluma del Steatornis caripensis.',
      alt: 'Lámina zoológica del siglo XIX con dibujos anatómicos numerados del guácharo —cabeza, pata, mandíbula inferior y una pluma— junto a otras aves del mismo orden.',
    },
    {
      photo: 'iconographia-1872',
      label: 'Iconographia Zoologica · 1872',
      caption:
        'Grabado del guácharo publicado en 1872 en la «Iconographia Zoologica», conservada en la Universidad de Ámsterdam.',
      alt: 'Grabado decimonónico del guácharo, con el plumaje y el pico dibujados en detalle.',
    },
  ],

  beats: [
    {
      voice: 'documental',
      text: 'El 18 de septiembre de 1799, Alexander von Humboldt y Aimé Bonpland visitaron la Cueva del Guácharo.',
      source: { label: 'Relato de la expedición de 1799' },
    },
    {
      voice: 'documental',
      text: 'Los pueblos indígenas chaimas usaban la cueva como templo y extraían la grasa de los pichones. De esa práctica proviene el nombre que el ave comparte con el pueblo.',
      source: { label: 'Registros históricos de la región' },
    },
    {
      voice: 'documental',
      text: 'El ave que habita la cueva lleva el nombre del lugar: Steatornis caripensis, literalmente «ave grasa de Caripe». Es la razón por la que un pueblo de Monagas figura en la taxonomía mundial.',
      source: { label: 'Nomenclatura zoológica' },
    },
    {
      voice: 'documental',
      text: 'La Cueva del Guácharo es la mayor caverna de Venezuela. Su desarrollo conocido ronda los 10,2 kilómetros y el recorrido turístico abarca alrededor de 1,2 kilómetros. En su interior habita una colonia de aproximadamente 10.000 guácharos.',
      source: { label: 'Registros espeleológicos' },
    },
    {
      voice: 'documental',
      text: 'El 15 de julio de 1949, la cueva fue declarada Monumento Natural Alejandro de Humboldt. Fue el primer monumento natural del país.',
      source: { label: 'Declaratoria de 1949' },
    },
    {
      // Placeholder voice: keep it free of proper nouns, dates and figures.
      voice: 'testimonio',
      text: 'Entré a la cueva por primera vez con la escuela. No he vuelto a sentir un frío así, ni un silencio que pesara tanto. Cuando salí, la neblina seguía en el valle, como si no nos hubiera esperado.',
      placeholder: true,
    },
    {
      voice: 'documental',
      text: 'El 27 de mayo de 1975 se creó el Parque Nacional El Guácharo, con 62.700 hectáreas, bajo la administración de INPARQUES.',
      source: { label: 'Creación del parque, 1975' },
    },
  ],

  gallery: {
    label: 'El ave y la cueva',
    images: [
      {
        photo: 'guacharo-caripe',
        layout: 'feature',
        caption:
          'El guácharo, fotografiado en Caripe. Del ave viene el nombre que comparten el pueblo y la cueva.',
        alt: 'Guácharo (Steatornis caripensis) fotografiado en Caripe, Venezuela.',
      },
      {
        photo: 'cueva-entrada-2013',
        caption: 'La entrada de la Cueva del Guácharo, fotografiada en 2013.',
        alt: 'Boca de la Cueva del Guácharo abierta en la roca, con vegetación en los bordes.',
      },
      {
        photo: 'cueva-entrada-techo-2013',
        caption: 'El techo de la entrada, moldeado por el agua a lo largo de milenios.',
        alt: 'Techo rocoso de la entrada de la cueva, de superficie ondulada.',
      },
      {
        photo: 'cueva-entrada-blmurch',
        caption: 'El umbral de la cueva. La boca es el único punto por donde entra la luz.',
        alt: 'Entrada de la Cueva del Guácharo, con la luz del exterior sobre la roca.',
      },
      {
        photo: 'cueva-interior-2014-01',
        caption: 'Salón interior: estalactitas, cortinas y columnas de calcita.',
        alt: 'Interior iluminado de la cueva, con formaciones de calcita en el techo y columnas.',
      },
      {
        photo: 'cueva-interior-2014-03',
        caption: 'Coladas y cortinas de calcita sobre la pared de un salón.',
        alt: 'Formaciones laminares de calcita sobre una pared del interior de la cueva.',
      },
      {
        photo: 'cueva-interior-profundo',
        caption: 'Muy adentro de la cueva, donde ya no llega ninguna luz.',
        alt: 'Galería profunda del interior de la cueva, iluminada artificialmente.',
      },
      {
        photo: 'parque-nacional-guacharo',
        caption:
          'Una entrada iluminada del Parque Nacional El Guácharo, entre los estados Monagas y Sucre.',
        alt: 'Entrada iluminada de la cueva en el Parque Nacional El Guácharo.',
      },
      {
        photo: 'entrada-parque-nacional',
        caption: 'El acceso al Parque Nacional El Guácharo, fotografiado en 2014.',
        alt: 'Entrada del Parque Nacional El Guácharo, en el estado Monagas.',
      },
    ],
  },

  sources: [{ label: 'Wikipedia' }, { label: 'Prensa venezolana' }],
};
