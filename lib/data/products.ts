// ============================================================================
// Capa de acceso a PRODUCTOS (catálogo plano de ítems)
// Fase 1: lee del mock. Fase 2: Supabase, sin tocar componentes.
// ============================================================================
import { CATALOG, CATALOG_FILTERS, type CatalogItem, type CatalogFilter } from "../mockData";

export { CATALOG_FILTERS };
export type { CatalogFilter };

export function getCatalogItems(): CatalogItem[] {
  return [...CATALOG].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getItemById(id: string): CatalogItem | undefined {
  return CATALOG.find((i) => i.id === id);
}

export function getItemsByFilter(filter: CatalogFilter): CatalogItem[] {
  return getCatalogItems().filter((i) => i.filter === filter);
}

/** La torta personalizada (ítem custom), si existe. */
export function getCustomCake(): CatalogItem | undefined {
  return CATALOG.find((i) => i.type === "custom");
}

/** Tres ítems destacados para la home. */
export function getFeaturedItems(): CatalogItem[] {
  const ids = ["cookie-chocolate", "brownies-clasico", "torta-personalizada"];
  return ids
    .map((id) => getItemById(id))
    .filter((i): i is CatalogItem => i !== undefined);
}
