"use client";
import { useState } from "react";
import { useOrderStore, useCalendarStore } from "@/lib/store";
import { formatDateES } from "@/lib/calendarUtils";
import { formatARS } from "@/lib/pricing";
import { buildOrder, type OrderSelection, type OrderCustomer } from "@/lib/orderUtils";
import { buildWhatsAppURL } from "@/lib/whatsappUtils";
import { createOrder } from "@/lib/data/orders";

interface Props {
  onConfirm: () => void;
  onBack: () => void;
}

export default function Step3Summary({ onConfirm, onBack }: Props) {
  const store = useOrderStore();
  const { selectedDate, blockDate } = useCalendarStore();
  const [submitting, setSubmitting] = useState(false);

  const selection: OrderSelection = {
    selectedProductId: store.selectedProductId,
    selectedSizeKey: store.selectedSizeKey,
    selectedTierKey: store.selectedTierKey,
    selectedFillingId: store.selectedFillingId,
    selectedDecorationId: store.selectedDecorationId,
    selectedVarietyId: store.selectedVarietyId,
    qty: store.qty,
    selectedAddons: store.selectedAddons,
  };
  const customer: OrderCustomer = {
    deliveryDate: selectedDate,
    deliveryMethod: store.deliveryMethod,
    shippingAddress: store.shippingAddress,
    shippingDisclaimerAccepted: store.shippingDisclaimerAccepted,
    customerName: store.customerName,
    customerPhone: store.customerPhone,
    customerNeighborhood: store.customerNeighborhood,
    customerMessage: store.customerMessage,
  };

  const order = buildOrder(selection, customer);
  const isShipping = order.deliveryMethod === "shipping";
  const waURL = selectedDate ? buildWhatsAppURL(order) : "#";

  async function handleConfirm() {
    if (!selectedDate || submitting) return;
    setSubmitting(true);
    try {
      await createOrder(order);
      blockDate(selectedDate, "order");
      onConfirm();
    } catch {
      setSubmitting(false);
      alert("No pudimos registrar el pedido. Probá de nuevo o escribinos por WhatsApp.");
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-2xl font-semibold text-ink mb-2">
        Resumen del pedido
      </h2>
      <p className="text-sm text-ink-muted font-body mb-8">
        Revisá los detalles antes de confirmar.
      </p>

      {/* Summary card */}
      <div className="bg-surface border border-black/5 rounded-2xl p-6 mb-6 space-y-4">
        <Row label="Fecha de entrega" value={selectedDate ? formatDateES(selectedDate) : "—"} highlight />

        <div className="pt-3 border-t border-black/8 space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between gap-4">
              <div>
                <p className="font-body text-sm font-medium text-ink">{item.productName}</p>
                <p className="font-body text-xs text-ink-muted">{item.detail}</p>
                {item.fillingName && (
                  <p className="font-body text-xs text-ink-muted">Relleno: {item.fillingName}</p>
                )}
                {item.decorationName && (
                  <p className="font-body text-xs text-ink-muted">Decoración: {item.decorationName}</p>
                )}
              </div>
              <p className="font-body text-sm text-ink shrink-0">{formatARS(item.lineTotal)}</p>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-black/8 flex justify-between items-center">
          <p className="font-body text-sm text-ink-muted">Total estimado</p>
          <p className="font-display text-2xl font-semibold text-ink">{formatARS(order.total)}</p>
        </div>
        {order.requiresDeposit && (
          <div className="flex justify-between items-center">
            <p className="font-body text-sm text-amber-700">Seña (50%) para confirmar</p>
            <p className="font-display text-lg font-semibold text-amber-700">
              {formatARS(order.depositAmount)}
            </p>
          </div>
        )}

        <div className="pt-3 border-t border-black/8 space-y-1">
          <Row label="Entrega" value={isShipping ? "Envío a domicilio" : "Retiro en el local"} />
          {isShipping && <Row label="Dirección" value={order.shippingAddress || "—"} />}
          <Row label="Nombre" value={order.customerName} />
          <Row label="WhatsApp" value={`+54 ${order.customerPhone}`} />
          <Row label="Barrio" value={order.customerNeighborhood} />
        </div>
      </div>

      {/* Aviso de seña / estado */}
      {order.requiresDeposit ? (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 mb-6">
          <p className="text-xs text-amber-800 font-body leading-relaxed">
            <strong>Seña del 50% ({formatARS(order.depositAmount)})</strong> para confirmar la
            reserva. <strong>El pedido no queda confirmado hasta que la seña esté abonada.</strong>{" "}
            El saldo se paga antes de la entrega. Coordinamos el pago por WhatsApp.
          </p>
        </div>
      ) : (
        <div className="bg-sage/10 border border-sage/30 rounded-xl p-4 mb-6">
          <p className="text-xs text-ink-muted font-body leading-relaxed">
            Cookies y brownies están siempre disponibles. Confirmá tu pedido y coordinamos
            la entrega por WhatsApp.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <a
          href={waURL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white font-medium py-4 rounded-full hover:opacity-90 transition-opacity active:scale-95 text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Enviar mi pedido por WhatsApp
        </a>

        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full bg-teal text-white font-medium py-4 rounded-full transition-all duration-300 hover:bg-teal-d active:scale-95 disabled:opacity-50"
        >
          {submitting
            ? "Registrando..."
            : order.requiresDeposit
            ? "Confirmar (queda pendiente de seña) →"
            : "Confirmar pedido →"}
        </button>

        <button
          onClick={onBack}
          className="w-full text-center text-sm text-ink-muted font-body hover:text-ink transition-colors pt-1"
        >
          ← Volver a mis datos
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <p className="font-body text-sm text-ink-muted shrink-0">{label}</p>
      <p className={`font-body text-sm text-right ${highlight ? "font-semibold text-teal" : "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}
