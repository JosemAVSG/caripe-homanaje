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
 * For this family every milestone is (b): the regional context is the only
 * thing that could reach level (a), and no family date qualifies.
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
  surnames: string;
  /** Only when the report states it. */
  origin?: string;
  notes?: string;
  milestones: FamilyMilestone[];
}

export const families: Family[] = [
  {
    id: 'luongo',
    name: 'Familia Luongo',
    surnames: 'Luongo',
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
];