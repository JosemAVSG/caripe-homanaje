import type { Level } from './evidence';

/**
 * The main schools of Caripe, as far as they can be documented.
 *
 * The rule here is the same one the families obey, and it is worth restating
 * because schools are the kind of thing a town website fills in from memory:
 * **nothing is published without saying how well it is backed.** Every fact
 * carries its level, and every doubt is written down beside it.
 *
 * The uncomfortable finding, kept rather than hidden: of the three schools the
 * town names first, the *existence, name and character* of each is documented,
 * but the **history is not**. No founding decree, no acta, no biography of
 * "Miguel Vecchio" or "Martha Vecchio" was found. The dates below that do
 * exist rest on a single source, and one of those sources has since gone
 * offline. They are marked (b) and they say so.
 *
 * The negative is part of the record too: the third entry below states, in
 * public, that no source was found for the name it carries.
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
  facts: SchoolFact[];
}

export const schools: School[] = [
  {
    id: 'miguel-vecchio',
    name: 'Liceo Nacional Bolivariano «Miguel Vecchio Marsiglia»',
    aka: 'el «Miguel Vecchio»',
    kind: 'Nacional · educación media general',
    place: 'Calle Junín, sector Concha de Coco, Caripe',
    facts: [
      {
        text: 'Figura en el directorio de planteles del estado con código estadístico 160095 y código DEA S1942D1604.',
        source: 'Directorio',
        level: 'a',
      },
      {
        text: 'Su terreno, de 7.767,50 m², provino de la Sucesión Luongo Cabello; sobre él se construyeron 5.350 m².',
        source: 'Reseña del plantel',
        level: 'b',
        uncertainty:
          'Una sola fuente, y la reseña ya no es accesible en línea. La vinculación con los Luongo no está corroborada.',
      },
      {
        text: 'Fundado en 1980, durante el gobierno de Luis Herrera Campins; primer director, el profesor Dino Brisigotti Nanni.',
        source: 'Reseña del plantel',
        level: 'b',
        uncertainty:
          'Una sola fuente, hoy inaccesible, y sin acta ni decreto. El año no está corroborado.',
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
        uncertainty:
          'Tradición local recogida en un sitio de memorias, sin respaldo documental.',
      },
      {
        text: 'Se dice nombrado en honor a una maestra de las nuevas generaciones.',
        source: 'Memorias de Caripe',
        level: 'b',
        uncertainty:
          'La atribución del nombre no está documentada: no se halló quién fue Martha Vecchio.',
      },
    ],
  },
  {
    id: 'julian-padron',
    name: 'Liceo «Dr. Julián Padrón»',
    aka: 'el «Julián Padrón»',
    kind: 'Nacional · educación media',
    place: 'Caripe',
    facts: [
      {
        text: 'Sus egresados se llaman «padroncistas» y el plantel tiene turno nocturno.',
        source: 'Prensa',
        level: 'b',
        uncertainty: 'El gentilicio y el turno aparecen en notas y redes del propio plantel.',
      },
      {
        text: 'Celebró su 64.º aniversario, lo que situaría su fundación hacia 1960.',
        source: 'Prensa',
        level: 'b',
        uncertainty:
          'Un aniversario no es un acta de fundación. La fecha del edificio (1969-1970) es otra cosa y no debe fundirse con ella.',
      },
      {
        text: 'NO se halló ninguna fuente que diga que el liceo lleva el nombre del escritor venezolano Julián Padrón.',
        level: 'c',
        uncertainty:
          'El escritor existió y la coincidencia de nombre es exacta, pero la atribución es una inferencia. No se publica como hecho.',
      },
    ],
  },
];
