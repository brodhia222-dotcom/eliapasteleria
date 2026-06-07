// ============================================================================
// Capa de acceso a DISPONIBILIDAD / STOCK
// ----------------------------------------------------------------------------
// La pastelera puede marcar qué productos (y qué variedades de cookies) están
// disponibles. Fase 1: el override lo guarda `useStockStore` (localStorage),
// partiendo de los defaults del catálogo. Fase 2: tabla `product_availability`.
// ============================================================================
import { CATALOG } from "../mockData";

/** Clave estable para un producto, o una variedad dentro de un producto. */
export function availabilityKey(productId: string, varietyId?: string | null): string {
  return varietyId ? `${productId}:${varietyId}` : productId;
}

/** Disponibilidad inicial (semilla) a partir de los defaults del catálogo. */
export function getInitialAvailability(): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const p of CATALOG) {
    map[availabilityKey(p.id)] = p.available;
    if (p.kind === "stock" && p.varieties) {
      for (const v of p.varieties) {
        map[availabilityKey(p.id, v.id)] = v.available;
      }
    }
  }
  return map;
}
