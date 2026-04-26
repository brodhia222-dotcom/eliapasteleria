import { CAKE_PRODUCTS, ADDON_PRODUCTS } from "./mockData";
import { formatDateES } from "./calendarUtils";

const WA_NUMBER = "5491100000000";

interface OrderDetails {
  selectedDate: string;
  selectedCategoryId: string;
  selectedSizeKey: string;
  selectedAddons: Record<string, number>;
  customerName: string;
  customerPhone: string;
  customerNeighborhood: string;
  customerMessage: string;
}

export function buildWhatsAppURL(order: OrderDetails): string {
  const product = CAKE_PRODUCTS.find((p) => p.id === order.selectedCategoryId);
  const size = product?.sizes.find((s) => s.key === order.selectedSizeKey);

  const addonLines = Object.entries(order.selectedAddons)
    .map(([id, qty]) => {
      const addon = ADDON_PRODUCTS.find((a) => a.id === id);
      return addon ? `• ${addon.name}: ${qty} ${addon.unitLabel}` : "";
    })
    .filter(Boolean)
    .join("\n");

  const message = [
    `¡Hola! Quiero hacer un encargo:`,
    ``,
    `📅 Fecha de entrega: ${formatDateES(order.selectedDate)}`,
    `🎂 Torta: ${product?.name ?? "—"} — ${size?.portions ?? "—"} (${size?.label ?? "—"})`,
    addonLines ? `🍪 Mesa dulce:\n${addonLines}` : "",
    ``,
    `👤 Nombre: ${order.customerName}`,
    `📍 Barrio: ${order.customerNeighborhood}`,
    order.customerMessage ? `💬 Descripción del diseño: ${order.customerMessage}` : "",
  ]
    .filter((line) => line !== undefined && line !== "")
    .join("\n");

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
