/**
 * Structured data for the documented families of Caripe.
 *
 * Everything here comes from the research report. Where the report says
 * "Wikipedia, sin cita" the source says so too, and every entry that carries
 * any doubt declares it in `uncertainty`. Nothing here invents a date, a source
 * or a kinship.
 *
 * Evidence levels, as the report uses them:
 *   a — corroborated by more than one documentary source.
 *   b — oral tradition or an unsourced clue (a hint, not a fact).
 *   c — no source at all.
 * Almost every milestone here is (b), and that is the finding, not a gap: the
 * documentary record of Caripe's families is oral. No family date found so far
 * is corroborated by more than one source, so level (a) is rare and level (c)
 * appears where a surname could not be traced past a single registry entry.
 *
 * Two negatives are published here on purpose, because a town's archive is read
 * by what it omits as much as by what it keeps:
 *   · Gamboa is ABSENT from the pre-1930 register, and the reason is documented:
 *     the decimista Ramón Gamboa Marcano was born in Sucre and Caripe adopted
 *     him. The family entered the valley through its singing, not its blood.
 *   · «Guzmán Zuniaga» could not be found as a lineage at all, only as one
 *     compound surname. It is kept and labelled (c) rather than dropped.
 *
 * Living people are never named here. Where a source is a civil registry, only
 * the surname is taken; no personal name, document number or address from a
 * data-broker site is reproduced.
 */

import { levels, type Level } from './evidence';

export { levels };
export type { Level };

export interface FamilyMilestone {
  /** Year as written by the report; `null` when the report gives no date. */
  year: string | null;
  event: string;
  source?: string;
  level: Level;
  /** Why the date or the attribution cannot be taken at face value. */
  uncertainty?: string;
}

export interface Family {
  id: string;
  name: string;
  /** Only when the report states it. */
  origin?: string;
  notes?: string;
  milestones: FamilyMilestone[];
}

export const families: Family[] = [
  {
    id: 'luongo',
    name: 'Familia Luongo',
    origin: 'Padula (Campania, Italia)',
    notes:
      'La mayoría de los hitos son tradición oral (nivel b). No se han hallado respaldos documentales para las fechas familiares.',
    milestones: [
      {
        year: '~1870',
        event:
          'Francesco Luongo Di Stefano llega a Caripe y establece la casa comercial "Luongo & Cía.".',
        source: 'Informe de investigación',
        level: 'b',
        uncertainty: 'Fecha aproximada, sin respaldo documental hallado.',
      },
      {
        year: null,
        event: 'Antonio Luongo Bianco, señalado como puente migratorio.',
        source: 'Informe de investigación',
        level: 'b',
        uncertainty: 'Sin fecha ni parentesco documentados.',
      },
      {
        year: '1933',
        event: 'Primera planta eléctrica: hermanos Luongo Cabello.',
        source: 'Wikipedia, sin cita',
        level: 'b',
        uncertainty: 'Wikipedia sin cita: indicio, no hecho corroborado.',
      },
      {
        year: '1945',
        event:
          'Primer acueducto y tomas públicas de agua, atribuidos a "Amedeo Luongo" (la misma fuente alterna "Amadeo").',
        source: 'Wikipedia, sin cita',
        level: 'b',
        uncertainty: 'Wikipedia sin cita. La identidad del autor de la obra no está documentada.',
      },
      {
        year: '1950',
        event: 'El 2 de enero, José Amadeo Luongo preside el Concejo Municipal.',
        source: 'Wikipedia, sin cita',
        level: 'b',
        uncertainty: 'Wikipedia sin cita, sin respaldo documental hallado.',
      },
      {
        year: null,
        event:
          'La frase "Raíces de Córcega y Padula se unen en Caripe" vincula a los Luongo con Padula y a los Simonpietri con Córcega.',
        source: 'Informe de investigación',
        level: 'b',
        uncertainty: 'Formulación de tradición oral, no un registro.',
      },
      {
        year: null,
        event: 'Contradicción sin resolver: la migración se sitúa a finales del siglo XIX o en la Primera Guerra Mundial.',
        source: 'Informe de investigación',
        level: 'b',
        uncertainty: 'No resuelto. Las versiones orales discrepan.',
      },
    ],
  },
  {
    id: 'bertucci',
    name: 'Familia Bertucci',
    origin: 'Córcega / Italia',
    notes:
      'Apellido registrado en Caripe antes de 1930 y presente en la vida del pueblo durante todo el siglo XX: hacienda, comercio, docencia. Ninguno de sus hitos llega al nivel (a); no se ha consultado directamente ningún archivo familiar.',
    milestones: [
      {
        year: null,
        event:
          'El apellido figura en el registro de apellidos de Caripe hasta 1930, levantado sobre libros civiles y eclesiásticos.',
        source: 'Caripe y los apellidos de su gente hasta 1.930 (Jorge Martínez R.)',
        level: 'b',
        uncertainty:
          'El registro es un blog que declara base documental, pero no se han consultado los libros originales.',
      },
      {
        year: '1890',
        event:
          'La hacienda Boquerón, en el sector Boquerón de Caripe, pasa de la familia Bertucci al corso Juan Mezzana Agostini, natural de Luri.',
        source: 'IAM Venezuela, citando el Catálogo del IPC (2006) y al historiador Edgar Rondón',
        level: 'b',
        uncertainty:
          'Una sola fuente secundaria. El catálogo del IPC no se ha consultado directamente. La fuente sitúa a veces esta hacienda en Maturín y a veces en Caripe.',
      },
      {
        year: null,
        event:
          'Don Juancho Bertucci y doña Brunilda donan los terrenos donde se levantaron el kínder y el Hotel El Guácharo.',
        source: 'Memoria de Caripe (Antonio Tepedino)',
        level: 'b',
        uncertainty: 'Memoria personal. No se han hallado los documentos de la donación.',
      },
      {
        year: '~1957',
        event: 'Juan José Bertucci aparece en una fotografía del Colegio Santo Ángel.',
        source: 'Memoria de Caripe',
        level: 'b',
        uncertainty: 'La fecha es la de la fotografía, no la de un documento.',
      },
    ],
  },
  {
    id: 'gamboa',
    name: 'Familia Gamboa',
    origin: 'Canchunchú, municipio Santa Catalina (Sucre)',
    notes:
      'La ausencia más elocuente del archivo: el apellido no aparece en el registro de apellidos de Caripe hasta 1930, y la razón está documentada. Ramón Gamboa Marcano no nació en Caripe sino en Sucre, y el pueblo lo adoptó como hijo. La familia entró al valle por la décima.',
    milestones: [
      {
        year: '1897',
        event:
          'El 11 de agosto nace Ramón Gamboa Marcano en Canchunchú, municipio Santa Catalina, distrito Bermúdez, estado Sucre.',
        source:
          'Rudy Mostacero, «La poética y el canto de la décima en la oralidad de Caripe», La Palabra n.º 42 (2022)',
        level: 'b',
        uncertainty:
          'Una sola fuente, aunque académica y arbitrada. La fecha no se ha cotejado con el registro civil.',
      },
      {
        year: null,
        event:
          'Ramón Gamboa Marcano queda señalado como galeronista y decimista, y como hijo adoptivo de Caripe.',
        source: 'Rudy Mostacero (2022); Caripe: historia cotidiana y oralidad (León y Mostacero, 1997)',
        level: 'b',
        uncertainty:
          'La condición de hijo adoptivo la afirma la fuente; no se ha hallado el acto que la formalice.',
      },
      {
        year: null,
        event: 'Se casa con Cleotilde García, de Caripe.',
        source: 'Rudy Mostacero (2022); registro familiar en FamilySearch',
        level: 'b',
        uncertainty: 'Sin fecha de matrimonio documentada.',
      },
      {
        year: '1929',
        event:
          'Nace en Caripe su hijo Antonio Ramón Gamboa García, que vivió hasta 2013 y fue hijo de Ramón y de Cleotilde García Caraballo.',
        source: 'Registro familiar en FamilySearch',
        level: 'b',
        uncertainty: 'Árbol colaborativo, sin imagen del acta consultada.',
      },
      {
        year: null,
        event:
          'Su hijo Tomás Gamboa sigue el oficio familiar y también es cantor.',
        source: 'Rudy Mostacero (2022)',
        level: 'b',
        uncertainty: 'Mención de pasada en el artículo, sin datos biográficos.',
      },
    ],
  },
  {
    id: 'guzman-zuniaga',
    name: 'Familia Guzmán Zuniaga',
    notes:
      'El único caso del archivo que no se pudo establecer como linaje. La investigación no halló «Guzmán Zuniaga» como familia, sino como un apellido compuesto de una sola persona, y por eso queda en nivel (c). Los dos apellidos por separado corren distinta suerte: Guzmán está registrado en Caripe antes de 1930; Zuniaga no aparece. La única pista de familia es una mención de los Zuniaga en el sector Concha de Coco.',
    milestones: [
      {
        year: null,
        event:
          'Guzmán figura en el registro de apellidos de Caripe hasta 1930.',
        source: 'Caripe y los apellidos de su gente hasta 1.930 (Jorge Martínez R.)',
        level: 'b',
        uncertainty: 'Blog con base documental declarada; los libros originales no se han consultado.',
      },
      {
        year: null,
        event:
          'Zuniaga no aparece en el registro de apellidos de Caripe hasta 1930.',
        source: 'Caripe y los apellidos de su gente hasta 1.930 (Jorge Martínez R.)',
        level: 'b',
        uncertainty:
          'La ausencia es un dato del registro, no una prueba de que la familia no estuviera. El registro es un blog.',
      },
      {
        year: null,
        event:
          'Se menciona a la familia Zuniaga en el sector Concha de Coco, sin más datos.',
        source: 'Mención en redes sociales locales',
        level: 'c',
        uncertainty:
          'Sin fuente comprobable. No se ha podido confirmar que exista un linaje Guzmán Zuniaga, ni cuándo llegó el apellido Zuniaga a Caripe.',
      },
    ],
  },
  {
    id: 'gonzalez',
    name: 'Familia González',
    notes:
      'Apellido registrado en Caripe antes de 1930, con presencia continua en la política municipal, la propiedad de la tierra, el comercio y la décima. Es el apellido con más fuentes distintas del grupo, aunque ninguna fecha familiar alcanza el nivel (a).',
    milestones: [
      {
        year: null,
        event:
          'El apellido figura en el registro de apellidos de Caripe hasta 1930, levantado sobre libros civiles y eclesiásticos.',
        source: 'Caripe y los apellidos de su gente hasta 1.930 (Jorge Martínez R.)',
        level: 'b',
        uncertainty: 'Blog con base documental declarada; los libros originales no se han consultado.',
      },
      {
        year: null,
        event:
          'Segundo Torres González queda señalado por Mostacero entre los cuatro grandes poetas tradicionales de Caripe.',
        source:
          'Rudy Mostacero, «La poética y el canto de la décima en la oralidad de Caripe», La Palabra n.º 42 (2022)',
        level: 'b',
        uncertainty: 'Fuente académica, única. La lista de los cuatro poetas es del propio autor.',
      },
      {
        year: null,
        event:
          'El general Manuel González queda señalado como terrateniente, en relación con el camino del Toco.',
        source: 'La Guanota, «El Camino del Toco»',
        level: 'b',
        uncertainty: 'Mención de pasada, sin fecha ni documento.',
      },
      {
        year: null,
        event:
          'Miguel González queda señalado como trabajador del molino de Cirigliano.',
        source: 'Memoria de Caripe',
        level: 'c',
        uncertainty: 'Sin fuente comprobable más allá de la memoria personal.',
      },
      {
        year: null,
        event:
          'Jesús Tamoy González y María Teresa González Pérez aparecen como presidentes del Concejo Municipal, en 1972 y 1985.',
        source: 'Wikipedia, sin cita',
        level: 'b',
        uncertainty: 'Wikipedia sin cita: indicio, no hecho corroborado.',
      },
    ],
  },
  {
    id: 'gil',
    name: 'Familia Gil',
    notes:
      'Apellido registrado en Caripe antes de 1930 y ligado al café: aparece en un registro de cafetaleros del pueblo y, ya en 2025, en la Expo Flor y Café. Es el caso más claro de un apellido que atraviesa el siglo sin una sola fecha documentada.',
    milestones: [
      {
        year: null,
        event:
          'El apellido figura en el registro de apellidos de Caripe hasta 1930, levantado sobre libros civiles y eclesiásticos.',
        source: 'Caripe y los apellidos de su gente hasta 1.930 (Jorge Martínez R.)',
        level: 'b',
        uncertainty: 'Blog con base documental declarada; los libros originales no se han consultado.',
      },
      {
        year: null,
        event:
          'Un Gil figura entre los cafetaleros de Caripe en el registro de cafetaleros del pueblo.',
        source: 'Registro de cafetaleros de Caripe',
        level: 'b',
        uncertainty:
          'Documento no consultado directamente. No consta la fecha ni el nombre completo.',
      },
      {
        year: null,
        event:
          'El apellido aparece en uso en registros civiles de Caripe, incluso en forma compuesta por matrimonio.',
        source: 'Registros civiles indexados',
        level: 'b',
        uncertainty:
          'Bases de datos de terceros, sin imagen del acta. No se reproduce ningún nombre.',
      },
      {
        year: '2025',
        event:
          'Un caficultor de apellido Gil figura en la Expo Flor y Café de Caripe.',
        source: 'Difusión del evento',
        level: 'b',
        uncertainty: 'Mención en redes, con el apellido pero sin más identificación.',
      },
    ],
  },
];