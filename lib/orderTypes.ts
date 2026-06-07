// ============================================================================
// Tipos de dominio del PEDIDO (forma final que mapea a la tabla `orders`)
// ============================================================================
import type { ProductKind } from "./mockData";

export type DeliveryMethod = "pickup" | "shipping";

export type DepositStatus = "pending" | "paid";

export type OrderStatus =
  | "draft" // armándose en el cliente
  | "pending_deposit" // enviado, esperando seña (tortas)
  | "confirmed" // seña abonada / producto de stock sin seña
  | "in_production"
  | "ready"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  kind: ProductKind;
  // selección según kind:
  sizeKey?: string; // standard
  tierKey?: string; // custom
  fillingId?: string; // custom
  fillingName?: string;
  decorationId?: string; // custom
  decorationName?: string;
  varietyId?: string; // cookies (stock)
  varietyName?: string;
  detail?: string; // texto legible del tamaño/porciones
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id?: string;
  deliveryDate: string; // ISO YYYY-MM-DD
  items: OrderItem[];
  deliveryMethod: DeliveryMethod;
  shippingAddress?: string;
  shippingDisclaimerAccepted?: boolean;
  customerName: string;
  customerPhone: string;
  customerNeighborhood: string;
  customerMessage: string;
  total: number;
  requiresDeposit: boolean;
  depositAmount: number; // 50% si requiresDeposit
  depositStatus: DepositStatus;
  status: OrderStatus;
  leadTimeHoursApplied: number; // 0 | 48 | 120
  createdAt?: string;
}
