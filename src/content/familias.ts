/**
 * Structured family data for the Luongo family based solely on research report.
 * Only verifiable details included. Uncertainty is explicitly marked.
 */
export interface TimelineMilestone {
  year: string | null;
  event: string;
  source?: string;
  level: 'a' | 'b' | 'c';
  uncertainty?: string;
}

export interface Family {
  id: string;
  name: string;
  surnames: string;
  origin?: string;
  notes?: string;
  milestones: TimelineMilestone[];
}

export const families: Family[] = [
  {
    id: 'luongo',
    name: 'Familia Luongo',
    surnames: 'Luongo',
    origin: 'Padula (Campania, Italia)',
    notes:
      'Mayoría de hitos: tradición oral (nivel b). No se han hallado respaldos documentales para las fechas familiares. El único nivel (a) posible es contexto regional, no fechas familiares. "Wikipedia sin cita" debe tomarse como indicio.',
    milestones: [
      {
        year: '~1870',
        event: 'Francesco Luongo Di Stefano llega a Caripe (~1870). Origen Padula (Campania). Casa comercial "Luongo & Cía."',
        source: 'Informe de investigación',
        level: 'b',
        uncertainty: 'Fecha aproximada. No se ha hallado respaldo documental.',
      },
      {
        year: null,
        event: 'Antonio Luongo Bianco: puente migratorio',
        source: 'Informe de investigación',
        level: 'b',
        uncertainty: 'Identidad y cronología no documentadas.',
      },
      {
        year: '1933',
        event: 'Primera planta eléctrica (Hermanos Luongo Cabello)',
        source: 'Wikipedia (sin cita)',
        level: 'b',
        uncertainty: 'Wikipedia sin cita. No corroborado documentalmente.',
      },
      {
        year: '1945',
        event: 'Primer acueducto y tomas públicas de agua ("Amedeo/Amedeo Luongo")',
        source: 'Wikipedia (sin cita)',
        level: 'b',
        uncertainty: 'Wikipedia sin cita. Posible identidad poco clara (Amedeo/Amadeo).',
      },
      {
        year: '1950-01-02',
        event: 'Presidente del Concejo Municipal José Amadeo Luongo (2 de enero de 1950)',
        source: 'Wikipedia (sin cita)',
        level: 'b',
        uncertainty: 'Wikipedia sin cita. No se ha hallado respaldo documental.',
      },
      {
        year: null,
        event: 'Raíces de Córcega y Padula se unen en Caripe (vínculo Luongo–Padula y Simonpietri–Córcega)',
        source: 'Informe de investigación',
        level: 'b',
        uncertainty: 'Afirmación interpretativa/tradición oral.',
      },
      {
        year: null,
        event: 'Conflicto cronológico: finales del siglo XIX vs Primera Guerra Mundial (no resuelto)',
        source: 'Informe de investigación',
        level: 'b',
        uncertainty: 'No resuelto. Contraposición entre versiones orales.',
      },
    ],
  },
];