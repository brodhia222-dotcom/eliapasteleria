"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getInitialBlockedDates } from "./data/calendar";
import { getInitialAvailability } from "./data/stock";
import type { DeliveryMethod } from "./orderTypes";

export type DateBlockReason = "admin" | "order";

// ============================================================================
// CALENDARIO
// ============================================================================
interface CalendarStore {
  blockedDates: Record<string, DateBlockReason>;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  blockDate: (date: string, reason: DateBlockReason) => void;
  unblockDate: (date: string) => void;
  isBlocked: (date: string) => boolean;
  getBlockReason: (date: string) => DateBlockReason | null;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      blockedDates: getInitialBlockedDates(),
      selectedDate: null,
      setSelectedDate: (date) => set({ selectedDate: date }),
      blockDate: (date, reason) =>
        set((state) => ({
          blockedDates: { ...state.blockedDates, [date]: reason },
        })),
      unblockDate: (date) =>
        set((state) => {
          const next = { ...state.blockedDates };
          delete next[date];
          return { blockedDates: next };
        }),
      isBlocked: (date) => date in get().blockedDates,
      getBlockReason: (date) => get().blockedDates[date] ?? null,
    }),
    { name: "elia-calendar" }
  )
);

// ============================================================================
// STOCK / DISPONIBILIDAD (editable por la pastelera)
// ============================================================================
interface StockStore {
  availability: Record<string, boolean>;
  isAvailable: (itemId: string) => boolean;
  setAvailable: (itemId: string, value: boolean) => void;
  toggle: (itemId: string) => void;
}

export const useStockStore = create<StockStore>()(
  persist(
    (set, get) => ({
      availability: getInitialAvailability(),
      isAvailable: (itemId) => {
        const v = get().availability[itemId];
        return v === undefined ? true : v;
      },
      setAvailable: (itemId, value) =>
        set((state) => ({ availability: { ...state.availability, [itemId]: value } })),
      toggle: (itemId) =>
        set((state) => {
          const current = state.availability[itemId];
          return {
            availability: {
              ...state.availability,
              [itemId]: current === undefined ? false : !current,
            },
          };
        }),
    }),
    { name: "elia-stock" }
  )
);

// ============================================================================
// DATOS DEL CLIENTE Y ENTREGA (el carrito vive en cartStore)
// ============================================================================
interface OrderStore {
  deliveryMethod: DeliveryMethod;
  shippingAddress: string;
  shippingDisclaimerAccepted: boolean;
  customerName: string;
  customerPhone: string;
  customerNeighborhood: string;
  customerMessage: string;
  setDelivery: (method: DeliveryMethod) => void;
  setShippingAddress: (value: string) => void;
  setDisclaimer: (value: boolean) => void;
  setCustomerField: (field: string, value: string) => void;
  resetOrder: () => void;
}

const INITIAL_ORDER = {
  deliveryMethod: "pickup" as DeliveryMethod,
  shippingAddress: "",
  shippingDisclaimerAccepted: false,
  customerName: "",
  customerPhone: "",
  customerNeighborhood: "",
  customerMessage: "",
};

export const useOrderStore = create<OrderStore>()((set) => ({
  ...INITIAL_ORDER,
  setDelivery: (method) => set({ deliveryMethod: method }),
  setShippingAddress: (value) => set({ shippingAddress: value }),
  setDisclaimer: (value) => set({ shippingDisclaimerAccepted: value }),
  setCustomerField: (field, value) =>
    set({ [field]: value } as unknown as Partial<OrderStore>),
  resetOrder: () => set({ ...INITIAL_ORDER }),
}));
