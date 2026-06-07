// ============================================================================
// Tipos de dominio del PEDIDO (forma final → tabla `orders` en Fase 2)
// ============================================================================
export type DeliveryMethod = "pickup" | "shipping";

export type DepositStatus = "pending" | "paid";

export type OrderStatus =
  | "draft"
  | "pending_deposit" // tortas: esperando seña
  | "confirmed" // stock sin seña / seña abonada
  | "in_production"
  | "ready"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  itemId: string;
  name: string;
  detail: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  requiresDeposit: boolean;
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
  depositAmount: number;
  depositStatus: DepositStatus;
  status: OrderStatus;
  leadTimeHoursApplied: number;
  createdAt?: string;
}
