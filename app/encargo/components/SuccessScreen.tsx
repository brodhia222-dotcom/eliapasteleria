"use client";
import { useEffect, useMemo } from "react";
import { useOrderStore, useCalendarStore } from "@/lib/store";
import { useCartStore } from "@/lib/cartStore";
import { formatDateES } from "@/lib/calendarUtils";
import { formatARS } from "@/lib/pricing";
import { buildOrder, type OrderCustomer } from "@/lib/orderUtils";
import { buildWhatsAppURL } from "@/lib/whatsappUtils";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function SuccessScreen() {
  const store = useOrderStore();
  const { selectedDate, setSelectedDate } = useCalendarStore();
  const cart = useCartStore();

  // Capturamos el pedido ANTES de vaciar el carrito (deps [] = primer render).
  const order = useMemo(() => {
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
    return buildOrder(cart.lines, customer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingDeposit = order.requiresDeposit;

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#00B2A9", "#7A9A82", "#F0EDE8", "#1A1A1A"],
    });
    // El pedido ya quedó capturado; vaciamos el carrito.
    cart.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleReset() {
    store.resetOrder();
    setSelectedDate(null);
  }

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center text-3xl mb-6">
        {pendingDeposit ? "⏳" : "🎂"}
      </div>
      <h2 className="font-display text-3xl font-semibold text-ink mb-3">
        {pendingDeposit ? "¡Pedido recibido!" : "¡Pedido confirmado!"}
      </h2>

      {selectedDate && (
        <>
          <p className="font-body text-ink-muted mb-1 text-sm">Fecha reservada:</p>
          <p className="font-display text-xl font-semibold text-teal mb-6">{formatDateES(selectedDate)}</p>
        </>
      )}

      {pendingDeposit ? (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 mb-6 text-left">
          <p className="text-xs text-amber-800 font-body leading-relaxed">
            {store.customerName ? `${store.customerName}, t` : "T"}u pedido quedó{" "}
            <strong>pendiente de seña</strong>. Para confirmar la reserva necesitamos la seña del
            50% (<strong>{formatARS(order.depositAmount)}</strong>). Te escribimos por WhatsApp para
            coordinar el pago. ¡Gracias!
          </p>
        </div>
      ) : (
        <p className="font-body text-ink-muted leading-relaxed mb-6 text-sm">
          {store.customerName ? `${store.customerName}, t` : "T"}u pedido fue registrado. Nos
          ponemos en contacto a la brevedad para coordinar la entrega.
        </p>
      )}

      <p className="font-body text-xs text-ink-muted/70 mb-6">
        Te enviamos la confirmación por email. También podés escribirnos por WhatsApp con el detalle.
      </p>

      <a
        href={buildWhatsAppURL(order)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-medium py-3.5 rounded-full hover:opacity-90 transition-opacity active:scale-95 text-sm mb-6"
      >
        Escribirnos por WhatsApp
      </a>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link
          href="/"
          onClick={handleReset}
          className="flex-1 text-center py-3 rounded-full border border-black/10 text-ink-muted font-body text-sm hover:border-ink hover:text-ink transition-colors"
        >
          Volver al inicio
        </Link>
        <Link
          href="/productos"
          onClick={handleReset}
          className="flex-1 text-center py-3 rounded-full bg-teal text-white font-medium text-sm hover:bg-teal-d transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
