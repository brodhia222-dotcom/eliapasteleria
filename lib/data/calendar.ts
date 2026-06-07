// ============================================================================
// Capa de acceso al CALENDARIO (días habilitados / bloqueados)
// ----------------------------------------------------------------------------
// Fase 1: el estado lo mantiene `useCalendarStore` (Zustand + localStorage),
// y acá sólo proveemos el seed inicial. Fase 2: estas funciones consultarán y
// escribirán en la tabla `blocked_dates` de Supabase.
// ============================================================================
import { getBlockedDatesForDemo } from "../mockData";
import type { DateBlockReason } from "../store";

/** Fechas bloqueadas iniciales (semilla). */
export function getInitialBlockedDates(): Record<string, DateBlockReason> {
  return Object.fromEntries(
    getBlockedDatesForDemo().map((d) => [d, "admin" as DateBlockReason])
  );
}
