"use client";
import { useEffect } from "react";
import { useOrderStore, useCalendarStore } from "@/lib/store";
import { formatDateES } from "@/lib/calendarUtils";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function SuccessScreen() {
  const { customerName, resetOrder } = useOrderStore();
  const { selectedDate, setSelectedDate } = useCalendarStore();

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#D4673A", "#F1EBE2", "#7A9A82", "#1C1C1C"],
    });
  }, []);

  function handleReset() {
    resetOrder();
    setSelectedDate(null);
  }

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center text-3xl mb-6">
        🎂
      </div>
      <h2 className="font-display text-3xl font-semibold text-ink mb-3">
        ¡Pedido recibido!
      </h2>
      {selectedDate && (
        <p className="font-body text-ink-muted mb-2 text-sm">
          Fecha reservada:
        </p>
      )}
      {selectedDate && (
        <p className="font-display text-xl font-semibold text-teal mb-6">
          {formatDateES(selectedDate)}
        </p>
      )}
      <p className="font-body text-ink-muted leading-relaxed mb-8 text-sm">
        {customerName ? `${customerName}, t` : "T"}u pedido fue registrado.
        Nos vamos a poner en contacto con vos a la brevedad para coordinar todos los detalles.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link
          href="/"
          onClick={handleReset}
          className="flex-1 text-center py-3 rounded-full border border-black/10 text-ink-muted font-body text-sm hover:border-ink hover:text-ink transition-colors"
        >
          Volver al inicio
        </Link>
        <Link
          href="/encargo"
          onClick={handleReset}
          className="flex-1 text-center py-3 rounded-full bg-teal text-white font-medium text-sm hover:bg-teal-d transition-colors"
        >
          Nuevo encargo
        </Link>
      </div>
    </div>
  );
}
