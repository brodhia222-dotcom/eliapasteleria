// ============================================================================
// Capa de acceso a DISPONIBILIDAD / STOCK (editable por la pastelera)
// Fase 1: override en `useStockStore` (localStorage). Fase 2: tabla
// `product_availability` en Supabase.
// ============================================================================
import { CATALOG } from "../mockData";

/** Disponibilidad inicial (semilla) a partir de los defaults del catálogo. */
export function getInitialAvailability(): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const item of CATALOG) map[item.id] = item.available;
  return map;
}
