"use client";
import Link from "next/link";
import BookingCalendar from "@/components/calendar/BookingCalendar";
import { useCalendarStore } from "@/lib/store";
import {
  useCartStore,
  cartTotal,
  cartDeposit,
  cartRequiresDeposit,
  cartMaxLeadHours,
} from "@/lib/cartStore";
import { formatARS, leadTimeLabel } from "@/lib/pricing";

interface Props {
  onNext: () => void;
}

export default function Step1Calendar({ onNext }: Props) {
  const { selectedDate } = useCalendarStore();
  const { lines, open } = useCartStore();

  const total = cartTotal(lines);
  const deposit = cartDeposit(lines);
  const hasDeposit = cartRequiresDeposit(lines);
  const minLead = cartMaxLeadHours(lines);
  const canContinue = lines.length > 0 && !!selectedDate;

  if (lines.length === 0) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <span className="text-4xl">🛒</span>
        <h2 className="font-display text-2xl font-semibold text-ink mt-4 mb-2">
          Tu carrito está vacío
        </h2>
        <p className="font-body text-sm text-ink-muted mb-6">
          Agregá cookies, brownies o tortas antes de elegir la fecha de entrega.
        </p>
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 bg-teal text-white font-medium px-7 py-3.5 rounded-full hover:bg-teal-d transition-colors text-sm"
        >
          Ver productos →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Calendario */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink mb-2">
          Elegí la fecha de entrega
        </h2>
        <p className="text-sm text-ink-muted font-body mb-6">
          {minLead > 0
            ? `${leadTimeLabel(minLead)}. Las fechas en gris no están disponibles.`
            : "Las fechas en gris no están disponibles."}
        </p>
        <BookingCalendar minLeadHours={minLead} />
      </div>

      {/* Resumen del carrito */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-semibold text-ink">Tu pedido</h2>
          <button
            onClick={open}
            className="text-sm font-body text-teal hover:text-teal-d underline underline-offset-4"
          >
            Editar
          </button>
        </div>

        <div className="bg-surface border border-black/5 rounded-2xl p-5 space-y-3 mb-6">
          {lines.map((l) => (
            <div key={l.lineId} className="flex justify-between gap-3">
              <div className="min-w-0">
                <p className="font-body text-sm font-medium text-ink truncate">
                  {l.qty > 1 ? `${l.qty}× ` : ""}{l.name}
                </p>
                <p className="font-body text-xs text-ink-muted">{l.detail}</p>
              </div>
              <p className="font-body text-sm text-ink shrink-0">{formatARS(l.unitPrice * l.qty)}</p>
            </div>
          ))}

          <div className="pt-3 border-t border-black/8 flex justify-between items-center">
            <span className="font-body text-sm text-ink-muted">Total estimado</span>
            <span className="font-display text-2xl font-semibold text-ink">{formatARS(total)}</span>
          </div>
          {hasDeposit && (
            <div className="flex justify-between items-center text-amber-700">
              <span className="font-body text-xs">Seña (50%) de las tortas</span>
              <span className="font-body text-sm font-semibold">{formatARS(deposit)}</span>
            </div>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={!canContinue}
          className="w-full bg-teal text-white font-medium py-4 rounded-full transition-all duration-300 hover:bg-teal-d active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {!selectedDate ? "Primero elegí una fecha" : "Continuar →"}
        </button>
      </div>
    </div>
  );
}
