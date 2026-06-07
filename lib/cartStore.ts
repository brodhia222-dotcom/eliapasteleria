"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEPOSIT_RATE } from "./pricing";

/** Una línea del carrito (un producto con su configuración). */
export interface CartLine {
  lineId: string; // único por configuración (mismo lineId = se suma cantidad)
  itemId: string;
  name: string;
  detail: string; // "Docena", "Porción", "Entera · Mediana", "Mediana · DDL · Premium"
  imageUrl: string;
  unitPrice: number;
  qty: number;
  minQty: number;
  requiresDeposit: boolean;
  leadHours: number;
}

interface CartStore {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  setQty: (lineId: string, qty: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (line) =>
        set((state) => {
          const step = line.qty ?? line.minQty ?? 1;
          const existing = state.lines.find((l) => l.lineId === line.lineId);
          if (existing) {
            return {
              isOpen: true,
              lines: state.lines.map((l) =>
                l.lineId === line.lineId ? { ...l, qty: l.qty + step } : l
              ),
            };
          }
          return {
            isOpen: true,
            lines: [...state.lines, { ...line, qty: step }],
          };
        }),
      setQty: (lineId, qty) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              l.lineId === lineId ? { ...l, qty: Math.max(l.minQty, qty) } : l
            )
            .filter((l) => l.qty > 0),
        })),
      remove: (lineId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.lineId !== lineId) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "elia-cart",
      partialize: (state) => ({ lines: state.lines }),
    }
  )
);

// --- Helpers de totales (puros) ---------------------------------------------
export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.qty, 0);
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
}

export function cartRequiresDeposit(lines: CartLine[]): boolean {
  return lines.some((l) => l.requiresDeposit);
}

/** Seña = 50% del total de las líneas que la requieren (las tortas). */
export function cartDeposit(lines: CartLine[]): number {
  const depositBase = lines
    .filter((l) => l.requiresDeposit)
    .reduce((s, l) => s + l.unitPrice * l.qty, 0);
  return Math.round(depositBase * DEPOSIT_RATE);
}

/** Anticipación requerida por el carrito (la mayor de sus líneas). */
export function cartMaxLeadHours(lines: CartLine[]): number {
  return lines.reduce((max, l) => Math.max(max, l.leadHours), 0);
}
