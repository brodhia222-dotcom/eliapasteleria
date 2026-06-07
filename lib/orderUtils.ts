// ============================================================================
// Construcción de PEDIDOS desde la selección del usuario
// ----------------------------------------------------------------------------
// Centraliza la lógica que arma OrderItem[], total, seña y lead time a partir
// del estado del store. Lo usan Step1 (total estimado), Step3 (resumen +
// confirmación) y whatsappUtils.
// ============================================================================
import { getProductById, getAddons } from "./data/products";
import { calcCustomCakePrice, calcDeposit, leadHoursOf } from "./pricing";
import type { Order, OrderItem, DeliveryMethod } from "./orderTypes";

export interface OrderSelection {
  selectedProductId: string | null;
  selectedSizeKey: string | null;
  selectedTierKey: string | null;
  selectedFillingId: string | null;
  selectedDecorationId: string | null;
  selectedVarietyId: string | null;
  qty: number;
  selectedAddons: Record<string, number>;
}

export interface OrderCustomer {
  deliveryDate: string | null;
  deliveryMethod: DeliveryMethod;
  shippingAddress: string;
  shippingDisclaimerAccepted: boolean;
  customerName: string;
  customerPhone: string;
  customerNeighborhood: string;
  customerMessage: string;
}

const plural = (qty: number, label: string) => `${qty} ${label}${qty > 1 ? "s" : ""}`;

/** Item principal según el tipo de producto elegido. */
export function buildMainItem(sel: OrderSelection): OrderItem | null {
  const product = sel.selectedProductId ? getProductById(sel.selectedProductId) : undefined;
  if (!product) return null;

  if (product.kind === "stock") {
    const variety = product.varieties?.find((v) => v.id === sel.selectedVarietyId);
    // Si el producto tiene variedades, exigimos una elegida.
    if (product.varieties && product.varieties.length > 0 && !variety) return null;
    const unitPrice = variety ? variety.pricePerDozen : product.unitPrice;
    const qty = Math.max(sel.qty || product.minQty, product.minQty);
    return {
      productId: product.id,
      productName: product.name,
      kind: "stock",
      varietyId: variety?.id,
      varietyName: variety?.name,
      detail: `${variety ? variety.name + " · " : ""}${plural(qty, product.unitLabel)}`,
      qty,
      unitPrice,
      lineTotal: unitPrice * qty,
    };
  }

  if (product.kind === "standard") {
    const size = product.sizes.find((s) => s.key === sel.selectedSizeKey);
    if (!size) return null;
    return {
      productId: product.id,
      productName: product.name,
      kind: "standard",
      sizeKey: size.key,
      detail: `${size.label} — ${size.portions}`,
      qty: 1,
      unitPrice: size.price,
      lineTotal: size.price,
    };
  }

  if (product.kind === "custom") {
    const tier = product.tiers.find((t) => t.key === sel.selectedTierKey);
    if (!tier) return null;
    const filling = product.fillingOptions.find((f) => f.id === sel.selectedFillingId);
    const deco = product.decorationOptions.find((d) => d.id === sel.selectedDecorationId);
    const unitPrice = calcCustomCakePrice(product, {
      tierKey: sel.selectedTierKey,
      fillingId: sel.selectedFillingId,
      decorationId: sel.selectedDecorationId,
    });
    return {
      productId: product.id,
      productName: product.name,
      kind: "custom",
      tierKey: tier.key,
      fillingId: filling?.id,
      fillingName: filling?.name,
      decorationId: deco?.id,
      decorationName: deco?.name,
      detail: `${tier.label} — ${tier.portions}`,
      qty: 1,
      unitPrice,
      lineTotal: unitPrice,
    };
  }

  return null;
}

/** Items de mesa dulce (addons). */
export function buildAddonItems(sel: OrderSelection): OrderItem[] {
  const addons = getAddons();
  const items: OrderItem[] = [];
  for (const [id, qty] of Object.entries(sel.selectedAddons)) {
    if (qty <= 0) continue;
    const a = addons.find((x) => x.id === id);
    if (!a) continue;
    items.push({
      productId: a.id,
      productName: a.name,
      kind: "addon",
      detail: plural(qty, a.unitLabel),
      qty,
      unitPrice: a.unitPrice,
      lineTotal: a.unitPrice * qty,
    });
  }
  return items;
}

export function buildItems(sel: OrderSelection): OrderItem[] {
  const main = buildMainItem(sel);
  return [...(main ? [main] : []), ...buildAddonItems(sel)];
}

/** ¿Algún item del pedido requiere seña? (las tortas). */
export function orderRequiresDeposit(sel: OrderSelection): boolean {
  const product = sel.selectedProductId ? getProductById(sel.selectedProductId) : undefined;
  return !!product?.requiresDeposit;
}

/** Horas de anticipación que exige el pedido (el mayor de todos los items). */
export function leadHoursApplied(sel: OrderSelection): number {
  let max = 0;
  const ids = new Set<string>();
  if (sel.selectedProductId) ids.add(sel.selectedProductId);
  for (const [id, qty] of Object.entries(sel.selectedAddons)) if (qty > 0) ids.add(id);
  for (const id of ids) {
    const p = getProductById(id);
    if (p) max = Math.max(max, leadHoursOf(p.leadTime));
  }
  return max;
}

export interface OrderTotals {
  items: OrderItem[];
  total: number;
  requiresDeposit: boolean;
  depositAmount: number;
}

export function computeTotals(sel: OrderSelection): OrderTotals {
  const items = buildItems(sel);
  const total = items.reduce((s, i) => s + i.lineTotal, 0);
  const requiresDeposit = orderRequiresDeposit(sel);
  const depositAmount = requiresDeposit ? calcDeposit(total) : 0;
  return { items, total, requiresDeposit, depositAmount };
}

/** Arma el Order completo listo para confirmar. */
export function buildOrder(sel: OrderSelection, cust: OrderCustomer): Order {
  const { items, total, requiresDeposit, depositAmount } = computeTotals(sel);
  return {
    deliveryDate: cust.deliveryDate ?? "",
    items,
    deliveryMethod: cust.deliveryMethod,
    shippingAddress: cust.deliveryMethod === "shipping" ? cust.shippingAddress : undefined,
    shippingDisclaimerAccepted:
      cust.deliveryMethod === "shipping" ? cust.shippingDisclaimerAccepted : undefined,
    customerName: cust.customerName,
    customerPhone: cust.customerPhone,
    customerNeighborhood: cust.customerNeighborhood,
    customerMessage: cust.customerMessage,
    total,
    requiresDeposit,
    depositAmount,
    depositStatus: "pending",
    status: requiresDeposit ? "pending_deposit" : "confirmed",
    leadTimeHoursApplied: leadHoursApplied(sel),
  };
}
