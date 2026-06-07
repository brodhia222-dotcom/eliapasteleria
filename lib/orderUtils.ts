// ============================================================================
// Construcción del PEDIDO a partir del carrito
// ============================================================================
import type { CartLine } from "./cartStore";
import {
  cartTotal,
  cartDeposit,
  cartRequiresDeposit,
  cartMaxLeadHours,
} from "./cartStore";
import type { Order, OrderItem, DeliveryMethod } from "./orderTypes";

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

export function linesToItems(lines: CartLine[]): OrderItem[] {
  return lines.map((l) => ({
    itemId: l.itemId,
    name: l.name,
    detail: l.detail,
    qty: l.qty,
    unitPrice: l.unitPrice,
    lineTotal: l.unitPrice * l.qty,
    requiresDeposit: l.requiresDeposit,
  }));
}

/** Arma el Order completo listo para confirmar. */
export function buildOrder(lines: CartLine[], cust: OrderCustomer): Order {
  const requiresDeposit = cartRequiresDeposit(lines);
  return {
    deliveryDate: cust.deliveryDate ?? "",
    items: linesToItems(lines),
    deliveryMethod: cust.deliveryMethod,
    shippingAddress: cust.deliveryMethod === "shipping" ? cust.shippingAddress : undefined,
    shippingDisclaimerAccepted:
      cust.deliveryMethod === "shipping" ? cust.shippingDisclaimerAccepted : undefined,
    customerName: cust.customerName,
    customerPhone: cust.customerPhone,
    customerNeighborhood: cust.customerNeighborhood,
    customerMessage: cust.customerMessage,
    total: cartTotal(lines),
    requiresDeposit,
    depositAmount: cartDeposit(lines),
    depositStatus: "pending",
    status: requiresDeposit ? "pending_deposit" : "confirmed",
    leadTimeHoursApplied: cartMaxLeadHours(lines),
  };
}
