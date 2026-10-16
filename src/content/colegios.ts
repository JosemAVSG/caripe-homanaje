import type { Level } from './evidence';

/**
 * The main schools of Caripe, stacked as layers of time.
 *
 * The section reads as a chronology and not as a flat list, because the
 * chronology is the thing worth saying: this town acquired its schools in the
 * second half of the twentieth century, one decade at a time. So each plantel
 * carries a `founded` year — shown large, in its own column — and the entries
 * are ordered by it, undated ones last.
 *
 * The rule here is the same one the families obey, and it is worth restating
 * because schools are the kind of thing a town website fills in from memory:
 * **nothing is published without saying how well it is backed.** Every fact
 * carries its level, and every doubt is written down beside it.
 *
 * The uncomfortable finding, kept rather than hidden: of the planteles the town
 * names first, the *existence, name and character* of each is documented, but
 * the **history is not**. No founding decree, no acta, no biography of "Miguel
 * Vecchio", "Martha Vecchio" or "Abraham Lincoln" was found. Every `founded`
 * year below rests on a single source, and one of those sources has since gone
 * offline. They are marked (b) and they say so — including the year, which is
 * the most fragile claim on this page and is marked as such in plain sight.
 *
 * Two negatives are published on purpose:
 *   · No source was found for the writer whose name the Julián Padrón carries.
 *   · Abraham Lincoln is the ONLY Caripe plantel with a photograph in the free
 *     archive. That is why one layer has a picture and three do not.
 *
 * Source abbreviations used in `source`:
 *   «Directorio»  Directorio de planteles del estado Monagas (códigos
 *                 estadístico y DEA por plantel) — codigosplanteles.info
 *   «Prensa»      Prensa regional de Monagas (El Periódico de Monagas,
 *                 La Prensa de Monagas)
 *   «Wikipedia»   es.wikipedia.org/wiki/Caripe — y, cuando es el caso, sin cita
 */

export interface SchoolFact {
  text: string;
  source?: string;
  level: Level;
  /** Why the fact cannot be taken at face value. */
  uncertainty?: string;
}

/**
 * The year the plantel was created, with the level of THAT claim.
 *
 * Kept apart from the facts because it is promoted to the layer's marker: a big
 * numeral in the margin is the loudest thing in the entry, so it must be the
 * best labelled, not the least.
 */
export interface SchoolFounded {
  /** What the year column shows, e.g. "1947". */
  label: string;
  /** Sort key for the chronology. `null` never appears — undated entries omit `founded` entirely. */
  value: number;
  level: Level;
  /** Why the year cannot be trusted as a fact. */
  note?: string;
}

export interface SchoolPhoto {
  /** Archive key in `credits.ts`; resolved through `getPhoto`. */
  photo: string;
  caption: string;
  alt: string;
}

export interface School {
  id: string;
  /** The name as the plantel is officially registered. */
  name: string;
  /** The short name people actually use, when it differs. */
  aka?: string;
  /** What kind of plantel it is. */
  kind: string;
  /** Where it stands, when the source gives it. */
  place?: string;
  /** Absent when no source gave a date — and the section shows that absence. */
  founded?: SchoolFounded;
  photo?: SchoolPhoto;
  facts: SchoolFact[];
}

/**
 * Ordered by `founded.value` where the component renders it; kept chronological
 * here as well so the file reads the way the page does.
 */
export const schools: School[] = [
  {
    id: 'abraham-lincoln',
    name: 'Grupo Escolar «Abraham Lincoln»',
    aka: 'el «Abraham Lincoln»',
    kind: 'Primaria · grupo escolar',
    place: 'Caripe',
    founded: {
      label: '1947',
      value: 1947,
      level: 'b',
      note: 'La fecha proviene de una publicación del propio plantel en redes sociales. No se halló acta ni decreto de creación.',
    },
    photo: {
      photo: 'grupo-escolar',
      caption:
        'El Grupo Escolar Abraham Lincoln, en Caripe. Es el único plantel del pueblo con fotografía en el archivo libre.',
      alt: 'Edificio del Grupo Escolar Abraham Lincoln, en Caripe, Venezuela.',
    },
    facts: [
      {
        text: 'Es el único plantel de Caripe del que se conserva fotografía en el archivo libre de Wikimedia Commons. De los demás colegios del pueblo no hay ninguna imagen de licencia libre.',
        source: 'Wikimedia Commons',
        level: 'b',
        uncertainty:
          'Es un negativo sobre un archivo, no sobre el mundo: puede haber fotografías fuera de Wikimedia Commons, y el archivo crece con el tiempo. Se estableció enumerando la categoría «Caripe» y barriendo el espacio de archivos del repositorio.',
      },
      {
        text: 'No se halló acta de creación, decreto ni ninguna biografía que ligue a Abraham Lincoln con Caripe.',
        level: 'c',
        uncertainty:
          'La ausencia de fuente no prueba que no exista; significa que este registro no la encontró. El plantel lleva el nombre y el pueblo lo usa, pero el porqué no está documentado.',
      },
    ],
  },
  {
    id: 'julian-padron',
    name: 'Liceo «Dr. Julián Padrón»',
    aka: 'el «Julián Padrón»',
    kind: 'Nacional · educación media',
    place: 'Caripe',
    founded: {
      label: '1960',
      value: 1960,
      level: 'b',
      note: 'Deducida del aniversario que el propio plantel celebra, no de un acta. El edificio actual es muy posterior y no debe fundirse con la fundación.',
    },
    facts: [
      {
        text: 'Su primera sede fue la casa de Yolanda Giliberti, en la esquina que hoy ocupa el Banco Caroní.',
        source: 'Memorias de Caripe',
        level: 'b',
        uncertainty: 'Tradición local recogida en un sitio de memorias, sin respaldo documental.',
      },
      {
        text: 'El edificio actual se levantó entre el 12 de diciembre de 1969 y 1970, diez años después de la fundación.',
        source: 'Publicaciones del plantel',
        level: 'b',
        uncertainty:
          'Fuente única, sin acta de obra. Es la fecha del edificio, no la del liceo.',
      },
      {
        text: 'Sus egresados se llaman «padroncistas» y el plantel tiene turno nocturno.',
        source: 'Prensa',
        level: 'b',
        uncertainty: 'El gentilicio y el turno aparecen en notas y redes del propio plantel.',
      },
      {
        text: 'Celebró su 64.º aniversario, y es ese aniversario —no un documento— lo que sitúa la fundación hacia 1960.',
        source: 'Prensa',
        level: 'b',
        uncertainty: 'Un aniversario no es un acta de fundación.',
      },
      {
        text: 'NO se halló ninguna fuente que diga que el liceo lleva el nombre del escritor venezolano Julián Padrón.',
        level: 'c',
        uncertainty:
          'El escritor existió (San Antonio de Maturín, 1910) y la coincidencia de nombre es exacta, pero la atribución es una inferencia. No se publica como hecho.',
      },
    ],
  },
  {
    id: 'miguel-vecchio',
    name: 'Liceo Nacional Bolivariano «Miguel Vecchio Marsiglia»',
    aka: 'el «Miguel Vecchio»',
    kind: 'Nacional · educación media general',
    place: 'Calle Junín, sector Concha de Coco, Caripe',
    founded: {
      label: '1980',
      value: 1980,
      level: 'b',
      note: 'Una sola fuente, la reseña del propio plantel, que ya no es accesible en línea. Sin acta ni decreto.',
    },
    facts: [
      {
        text: 'Figura en el directorio de planteles del estado con código estadístico 160095 y código DEA S1942D1604.',
        source: 'Directorio',
        level: 'a',
      },
      {
        text: 'Se inauguró durante el gobierno de Luis Herrera Campins, con el gobierno municipal presidido por Eduardo Pietrini, y su primer director fue el profesor Dino Brisigotti Nanni.',
        source: 'Reseña del plantel',
        level: 'b',
        uncertainty: 'Misma fuente única, hoy inaccesible. Ninguno de los tres nombres está corroborado.',
      },
      {
        text: 'Su terreno, de 7.767,50 m², provino de la Sucesión Luongo Cabello; sobre él se construyeron 5.350 m².',
        source: 'Reseña del plantel',
        level: 'b',
        uncertainty:
          'La vinculación con los Luongo no está corroborada: es la misma reseña inaccesible.',
      },
      {
        text: 'Su primera promoción de media general egresó en 2009-2010.',
        source: 'Reseña del plantel',
        level: 'b',
        uncertainty: 'Misma fuente única, hoy inaccesible.',
      },
      {
        text: 'Miguel Vecchio Marsiglia presidió el Concejo Municipal de Caripe.',
        source: 'Wikipedia, sin cita',
        level: 'b',
        uncertainty:
          'Wikipedia sin cita: indicio, no hecho. Confirma que la persona existió; no documenta su biografía.',
      },
    ],
  },
  {
    id: 'martha-vecchio',
    name: 'U. E. «Martha Vecchio»',
    aka: 'el «Martha Vecchio»',
    kind: 'Privado · educación inicial, primaria y media general',
    place: 'Avenida Guzmán Blanco N° 52, Caripe',
    facts: [
      {
        text: 'Colegio privado que ofrece educación inicial, primaria y media general mención ciencias.',
        source: 'Directorio',
        level: 'a',
      },
      {
        text: 'Ocupa la casa que fue sede del Colegio Santo Ángel, la «Casona Simonpietri Grande».',
        source: 'Memorias de Caripe',
        level: 'b',
        uncertainty: 'Tradición local recogida en un sitio de memorias, sin respaldo documental.',
      },
      {
        text: 'Se dice nombrado en honor a una maestra de las nuevas generaciones.',
        source: 'Memorias de Caripe',
        level: 'b',
        uncertainty: 'La atribución del nombre no está documentada: no se halló quién fue Martha Vecchio.',
      },
      {
        text: 'NO se halló fecha de fundación. Es el único plantel de este registro que no puede situarse en el tiempo.',
        level: 'c',
        uncertainty:
          'No es que la fecha sea dudosa: es que no apareció ninguna. Por eso este colegio cierra el recorrido y no se le asigna un lugar en la cronología.',
      },
    ],
  },
];
