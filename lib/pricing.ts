// ============================================================================
// Cálculo de precios y seña
// ============================================================================
import type { CatalogItem, CustomCakeItem } from "./mockData";

export const DEPOSIT_RATE = 0.5;

/** Seña (50%) redondeada a peso. */
export function calcDeposit(total: number): number {
  return Math.round(total * DEPOSIT_RATE);
}

/** Precio de una torta personalizada = tamaño + relleno + decoración. */
export function calcCustomCakePrice(
  item: CustomCakeItem,
  sel: { tierKey?: string | null; fillingId?: string | null; decorationId?: string | null }
): number {
  const tier = item.tiers.find((t) => t.key === sel.tierKey);
  const filling = item.fillingOptions.find((f) => f.id === sel.fillingId);
  const deco = item.decorationOptions.find((d) => d.id === sel.decorationId);
  return (tier?.basePrice ?? 0) + (filling?.priceDelta ?? 0) + (deco?.priceDelta ?? 0);
}

/** Precio "desde" de un ítem del catálogo (el mínimo entre sus variantes). */
export function priceFrom(item: CatalogItem): number {
  switch (item.type) {
    case "unit":
      return item.unitPrice;
    case "cake":
      return item.slicePrice; // la porción es lo más barato
    case "custom":
      return Math.min(...item.tiers.map((t) => t.basePrice));
  }
}

/** Etiqueta legible de la anticipación requerida. */
export function leadTimeLabel(leadHours: number): string {
  if (leadHours <= 0) return "Siempre disponible · 24/7";
  if (leadHours <= 48) return "Listo en 48 hs";
  const days = Math.round(leadHours / 24);
  return `Listo en ${days} días`;
}

/** Formato de moneda argentina. */
export function formatARS(n: number): string {
  return `$${n.toLocaleString("es-AR")}`;
}
