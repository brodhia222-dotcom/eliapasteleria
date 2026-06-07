"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getInitialBlockedDates } from "./data/calendar";
import { getInitialAvailability, availabilityKey } from "./data/stock";
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
  isAvailable: (productId: string, varietyId?: string | null) => boolean;
  setAvailable: (productId: string, varietyId: string | null, value: boolean) => void;
  toggle: (productId: string, varietyId?: string | null) => void;
}

export const useStockStore = create<StockStore>()(
  persist(
    (set, get) => ({
      availability: getInitialAvailability(),
      isAvailable: (productId, varietyId) => {
        const key = availabilityKey(productId, varietyId);
        const v = get().availability[key];
        return v === undefined ? true : v;
      },
      setAvailable: (productId, varietyId, value) =>
        set((state) => ({
          availability: {
            ...state.availability,
            [availabilityKey(productId, varietyId)]: value,
          },
        })),
      toggle: (productId, varietyId) =>
        set((state) => {
          const key = availabilityKey(productId, varietyId ?? null);
          const current = state.availability[key];
          return {
            availability: {
              ...state.availability,
              [key]: current === undefined ? false : !current,
            },
          };
        }),
    }),
    { name: "elia-stock" }
  )
);

// ============================================================================
// PEDIDO (estado del formulario multi-step)
// ============================================================================
interface OrderStore {
  // selección del producto principal
  selectedProductId: string | null;
  selectedSizeKey: string | null; // standard
  selectedTierKey: string | null; // custom
  selectedFillingId: string | null; // custom
  selectedDecorationId: string | null; // custom
  selectedVarietyId: string | null; // stock (cookies)
  qty: number; // cantidad (docenas para stock; 1 para tortas)
  selectedAddons: Record<string, number>;
  // entrega
  deliveryMethod: DeliveryMethod;
  shippingAddress: string;
  shippingDisclaimerAccepted: boolean;
  // contacto
  customerName: string;
  customerPhone: string;
  customerNeighborhood: string;
  customerMessage: string;
  // setters
  setProduct: (id: string) => void;
  setSize: (key: string) => void;
  setTier: (key: string) => void;
  setFilling: (id: string) => void;
  setDecoration: (id: string) => void;
  setVariety: (id: string) => void;
  setQty: (n: number) => void;
  setAddon: (id: string, qty: number) => void;
  setDelivery: (method: DeliveryMethod) => void;
  setShippingAddress: (value: string) => void;
  setDisclaimer: (value: boolean) => void;
  setCustomerField: (field: string, value: string) => void;
  resetOrder: () => void;
}

const INITIAL_ORDER = {
  selectedProductId: null,
  selectedSizeKey: null,
  selectedTierKey: null,
  selectedFillingId: null,
  selectedDecorationId: null,
  selectedVarietyId: null,
  qty: 1,
  selectedAddons: {} as Record<string, number>,
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
  setProduct: (id) =>
    set({
      selectedProductId: id,
      selectedSizeKey: null,
      selectedTierKey: null,
      selectedFillingId: null,
      selectedDecorationId: null,
      selectedVarietyId: null,
      qty: 1,
    }),
  setSize: (key) => set({ selectedSizeKey: key }),
  setTier: (key) => set({ selectedTierKey: key }),
  setFilling: (id) => set({ selectedFillingId: id }),
  setDecoration: (id) => set({ selectedDecorationId: id }),
  setVariety: (id) => set({ selectedVarietyId: id }),
  setQty: (n) => set({ qty: Math.max(1, n) }),
  setAddon: (id, qty) =>
    set((state) => ({
      selectedAddons:
        qty === 0
          ? Object.fromEntries(
              Object.entries(state.selectedAddons).filter(([k]) => k !== id)
            )
          : { ...state.selectedAddons, [id]: qty },
    })),
  setDelivery: (method) => set({ deliveryMethod: method }),
  setShippingAddress: (value) => set({ shippingAddress: value }),
  setDisclaimer: (value) => set({ shippingDisclaimerAccepted: value }),
  setCustomerField: (field, value) =>
    set({ [field]: value } as unknown as Partial<OrderStore>),
  resetOrder: () => set({ ...INITIAL_ORDER }),
}));
