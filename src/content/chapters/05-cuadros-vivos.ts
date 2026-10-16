import type { Chapter } from '../types';

/**
 * Chapter 05 — the living pictures and the viewpoint.
 *
 * Caripe's present as a destination: Holy Week staged in the plaza, and the
 * mirador reopened at the end of 2025. Every claim below comes from regional
 * press and the state government; where sources disagree the text says so
 * instead of picking one.
 *
 * There is no gallery yet. The photographs of the cuadros vivos and of the
 * mirador are to be supplied by the author, so the chapter reserves a frame
 * (`photo`) and nothing is invented to fill it. When the files exist, replace
 * `photo` with a `gallery` whose keys are registered in `credits.ts`.
 */
export const chapter: Chapter = {
  slug: 'chapter-5-cuadros-vivos',
  order: 5,
  title: 'Los cuadros vivos',
  kicker: 'El pueblo que se mira',
  tone: 'monte',
  layout: 'band',
  lede: 'Cada Semana Santa la plaza Bolívar se vuelve escenario, y desde finales de 2025 el pueblo tiene de nuevo su mirador. Caripe es conocido por lo que se ve de él y por lo que él mismo pone en escena.',

  lexicon: {
    term: 'Cuadros vivos',
    gloss: 'Escenas bíblicas inmóviles, representadas por vecinos',
    note: 'Una tradición cuaresmal que, según la prensa regional, viene de Málaga, España. En Caripe participan niños, jóvenes y adultos del pueblo, con trajes alegóricos.',
  },

  timeline: [
    {
      date: 'Domingo de Ramos',
      label: 'Bendición de las palmas',
      detail:
        'Una procesión con bendición de palmas que termina en la iglesia del Santo Ángel Custodio.',
    },
    {
      date: 'Jueves Santo',
      label: 'Los cuadros vivos',
      detail:
        'Las escenas se montan en la plaza Bolívar. En 2025 fueron «La creación de los mandamientos», «La Samaritana», la multiplicación de los panes y los peces, «Lázaro» y «La última cena».',
    },
    {
      date: 'Viernes Santo',
      label: 'El Viacrucis Monumental',
      detail: 'La Pasión y Muerte de Jesús, escenificada por el pueblo.',
    },
    {
      date: 'Sábado de Gloria',
      label: 'La resurrección',
      detail: 'Desde la medianoche se representa «La resurrección de Jesús».',
    },
  ],

  beats: [
    {
      voice: 'documental',
      text: 'Cada Semana Santa, miles de fieles se reúnen en la plaza Bolívar de Caripe para ver los cuadros vivos. La tradición, de origen malagueño, la replicó en las montañas del Turimiquire el padre Rafael Pérez Madueño.',
      source: { label: 'La Verdad de Monagas; La Prensa de Monagas (2025)' },
    },
    {
      voice: 'documental',
      text: 'Las fuentes no coinciden en el año en que empezó: una lo sitúa en 1967 y otra hacia 1970. La prensa reciente habla de más de sesenta años de historia.',
      source: { label: 'Registros locales y prensa regional' },
    },
    {
      voice: 'documental',
      text: 'La puesta en escena está a cargo de la Fundación Omar Aristimuño, con unos 350 colaboradores. Su director, Omar Aristimuño, renueva cada año los vestuarios, las luces y las escenografías. El gobernador Ernesto Luna declaró la manifestación Patrimonio Cultural del estado Monagas.',
      source: { label: 'La Verdad de Monagas (2025); El Periódico de Monagas' },
    },
    {
      voice: 'documental',
      text: 'El 31 de diciembre de 2025 se entregó la primera etapa del Complejo Turístico El Mirador de Caripe, en el sector El Banqueado: 5.900 metros cuadrados rehabilitados, con áreas de comida, parque infantil, cancha y puntos para fotografiarse. Entre sus atractivos hay un monumento a Guaicaipuro, unas alas metálicas y una mano gigante que se extiende sobre el valle.',
      source: { label: 'La Verdad de Monagas; Últimas Noticias (2025–2026)' },
    },
    {
      voice: 'documental',
      text: 'Una segunda etapa, con espacios para eventos y una zona de glamping, estaba prevista para el primer trimestre de 2026. No hemos confirmado que se haya entregado.',
      source: { label: 'La Verdad de Monagas (2026)' },
    },
  ],

  photo: {
    caption:
      'Pendiente: fotografías de los cuadros vivos en la plaza Bolívar y del mirador reinaugurado.',
  },

  sources: [
    {
      label: 'La Verdad de Monagas, cobertura de los cuadros vivos de Caripe (2025, 2026)',
      url: 'https://laverdaddemonagas.com/2025/04/18/caripe-cuadros-vivos-semana-santa/',
    },
    {
      label: 'La Prensa de Monagas, «Caripe renueva su fe con la majestuosa puesta en escena de los Cuadros Vivos»',
      url: 'https://laprensademonagas.com/caripe-renueva-su-fe-con-la-majestuosa-puesta-en-escena-de-los-cuadros-vivos/',
    },
    {
      label: 'La Verdad de Monagas, «Luna inaugura Mirador de Caripe para potenciar turismo en el Jardín de Oriente»',
      url: 'https://laverdaddemonagas.com/2026/01/01/luna-inaugura-mirador-de-caripe/',
    },
  ],
};
