// ============================================================================
// Cálculo de precios y seña
// ============================================================================
import type { CustomCakeProduct, Product, LeadTime } from "./mockData";

export const DEPOSIT_RATE = 0.5;

/** Seña (50%) redondeada a peso. */
export function calcDeposit(total: number): number {
  return Math.round(total * DEPOSIT_RATE);
}

/** Precio de una torta personalizada = tamaño + relleno + decoración. */
export function calcCustomCakePrice(
  product: CustomCakeProduct,
  sel: {
    tierKey?: string | null;
    fillingId?: string | null;
    decorationId?: string | null;
  }
): number {
  const tier = product.tiers.find((t) => t.key === sel.tierKey);
  const filling = product.fillingOptions.find((f) => f.id === sel.fillingId);
  const deco = product.decorationOptions.find((d) => d.id === sel.decorationId);
  return (
    (tier?.basePrice ?? 0) +
    (filling?.priceDelta ?? 0) +
    (deco?.priceDelta ?? 0)
  );
}

/** Horas de anticipación que exige un producto (0 si está siempre en stock). */
export function leadHoursOf(leadTime: LeadTime): number {
  return leadTime.type === "stock" ? 0 : leadTime.hours;
}

/** Etiqueta legible de la demora de un producto. */
export function leadTimeLabel(product: Product): string {
  if (product.leadTime.type === "stock") return "Siempre disponible · 24/7";
  const h = product.leadTime.hours;
  if (h <= 48) return "Listo en 48 hs";
  const days = Math.round(h / 24);
  return `Listo en ${days} días`;
}

/** Precio "desde" de un producto (el mínimo entre sus variantes). */
export function priceFrom(product: Product): number {
  switch (product.kind) {
    case "stock": {
      const vs = product.varieties?.map((v) => v.pricePerDozen) ?? [];
      return vs.length ? Math.min(...vs) : product.unitPrice;
    }
    case "standard":
      return Math.min(...product.sizes.map((s) => s.price));
    case "custom":
      return Math.min(...product.tiers.map((t) => t.basePrice));
    case "addon":
      return product.unitPrice;
  }
}

/** Formato de moneda argentina. */
export function formatARS(n: number): string {
  return `$${n.toLocaleString("es-AR")}`;
}
