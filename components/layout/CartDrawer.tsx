"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCartStore,
  cartTotal,
  cartDeposit,
  cartRequiresDeposit,
} from "@/lib/cartStore";
import { formatARS } from "@/lib/pricing";

export default function CartDrawer() {
  const { lines, isOpen, close, setQty, remove, clear } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Evita scroll del body con el drawer abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const total = cartTotal(lines);
  const deposit = cartDeposit(lines);
  const hasDeposit = cartRequiresDeposit(lines);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-cream flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
              <p className="font-display text-xl font-semibold text-ink">Tu carrito</p>
              <button
                onClick={close}
                className="w-9 h-9 rounded-full flex items-center justify-center text-ink-muted hover:bg-cream-deep transition-colors"
                aria-label="Cerrar carrito"
              >
                ✕
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
                <span className="text-4xl">🛒</span>
                <p className="font-body text-ink-muted text-sm">Tu carrito está vacío.</p>
                <Link
                  href="/productos"
                  onClick={close}
                  className="inline-flex items-center gap-2 bg-teal text-white font-medium px-6 py-3 rounded-full text-sm hover:bg-teal-d transition-colors"
                >
                  Ver productos →
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {lines.map((l) => (
                    <div key={l.lineId} className="flex gap-3">
                      <img
                        src={l.imageUrl}
                        alt={l.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <p className="font-body text-sm font-medium text-ink truncate">{l.name}</p>
                          <button
                            onClick={() => remove(l.lineId)}
                            className="text-ink-muted/60 hover:text-red-500 transition-colors text-xs shrink-0"
                            aria-label="Quitar"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="font-body text-xs text-ink-muted">{l.detail}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setQty(l.lineId, l.qty - 1)}
                              className="w-6 h-6 rounded-full border border-black/10 text-ink-muted hover:border-teal hover:text-teal transition-colors text-sm leading-none"
                            >
                              −
                            </button>
                            <span className="w-5 text-center font-body text-sm text-ink">{l.qty}</span>
                            <button
                              onClick={() => setQty(l.lineId, l.qty + 1)}
                              className="w-6 h-6 rounded-full border border-black/10 text-ink-muted hover:border-teal hover:text-teal transition-colors text-sm leading-none"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-display text-sm font-semibold text-ink">
                            {formatARS(l.unitPrice * l.qty)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={clear}
                    className="text-xs text-ink-muted/60 hover:text-ink font-body underline underline-offset-2"
                  >
                    Vaciar carrito
                  </button>
                </div>

                <div className="border-t border-black/10 px-6 py-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-ink-muted">Total estimado</span>
                    <span className="font-display text-2xl font-semibold text-ink">{formatARS(total)}</span>
                  </div>
                  {hasDeposit && (
                    <div className="flex justify-between items-center text-amber-700">
                      <span className="font-body text-xs">Seña (50%) de las tortas</span>
                      <span className="font-body text-sm font-semibold">{formatARS(deposit)}</span>
                    </div>
                  )}
                  <Link
                    href="/encargo"
                    onClick={close}
                    className="block text-center w-full bg-teal text-white font-medium py-3.5 rounded-full hover:bg-teal-d transition-colors text-sm"
                  >
                    Continuar pedido →
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
