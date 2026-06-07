import { SITE } from "./siteConfig";
import { formatDateES } from "./calendarUtils";
import { formatARS } from "./pricing";
import type { Order } from "./orderTypes";

/** Link de WhatsApp genérico (opcionalmente con mensaje pre-cargado). */
export function whatsappLink(text?: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Link de WhatsApp con el detalle completo de un pedido. */
export function buildWhatsAppURL(order: Order): string {
  const lines: string[] = ["¡Hola! Quiero hacer un pedido:", ""];

  if (order.deliveryDate) {
    lines.push(`📅 Fecha de entrega: ${formatDateES(order.deliveryDate)}`, "");
  }

  lines.push("🧾 Pedido:");
  for (const item of order.items) {
    const qtyLabel = item.qty > 1 ? `${item.qty}× ` : "";
    lines.push(`• ${qtyLabel}${item.name} — ${item.detail} (${formatARS(item.lineTotal)})`);
  }

  lines.push("", `💰 Total estimado: ${formatARS(order.total)}`);
  if (order.requiresDeposit) {
    lines.push(`🔖 Seña (50%): ${formatARS(order.depositAmount)} — el pedido se confirma con la seña.`);
  }

  lines.push(
    "",
    `🚚 Entrega: ${order.deliveryMethod === "shipping" ? "Envío a domicilio" : "Retiro en el local"}`
  );
  if (order.deliveryMethod === "shipping" && order.shippingAddress) {
    lines.push(`   Dirección: ${order.shippingAddress}`);
  }

  lines.push("", `👤 Nombre: ${order.customerName}`, `📍 Barrio: ${order.customerNeighborhood}`);
  if (order.customerMessage) lines.push(`💬 Notas: ${order.customerMessage}`);

  return whatsappLink(lines.join("\n"));
}
