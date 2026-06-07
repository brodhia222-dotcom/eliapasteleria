// ============================================================================
// Capa de acceso a FECHAS ESPECIALES
// ----------------------------------------------------------------------------
// Las defs (mes/día + qué incluye) viven en lib/mockData. Acá las resolvemos a
// la PRÓXIMA ocurrencia real (>= hoy) para mostrarlas y resaltarlas.
// En Fase 2 estas fechas vendrán de la tabla `special_dates` de Supabase.
// ============================================================================
import { SPECIAL_DATE_DEFS, type SpecialDateDef } from "../mockData";
import { toISODate } from "../calendarUtils";

export interface SpecialDate {
  id: string;
  date: string; // ISO YYYY-MM-DD (próxima ocurrencia)
  title: string;
  includes: string;
  badge: string;
  color: string;
}

/** Próxima ocurrencia (este año o el siguiente) de una def mes/día. */
function nextOccurrence(def: SpecialDateDef, from: Date): string {
  const year = from.getFullYear();
  const thisYear = new Date(year, def.month - 1, def.day);
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  const targetYear = thisYear >= start ? year : year + 1;
  return toISODate(targetYear, def.month - 1, def.day);
}

/** Todas las fechas especiales con su próxima ocurrencia, ordenadas. */
export function getSpecialDates(from: Date = new Date()): SpecialDate[] {
  return SPECIAL_DATE_DEFS.map((def) => ({
    id: def.id,
    date: nextOccurrence(def, from),
    title: def.title,
    includes: def.includes,
    badge: def.badge,
    color: def.color,
  })).sort((a, b) => a.date.localeCompare(b.date));
}

/** La fecha especial más próxima (para el banner del home). */
export function getNextSpecialDate(from: Date = new Date()): SpecialDate | null {
  return getSpecialDates(from)[0] ?? null;
}

/** Mapa fecha ISO → fecha especial, para resaltar el calendario. */
export function getSpecialDatesMap(from: Date = new Date()): Record<string, SpecialDate> {
  const map: Record<string, SpecialDate> = {};
  for (const sd of getSpecialDates(from)) map[sd.date] = sd;
  return map;
}
