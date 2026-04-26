"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getBlockedDatesForDemo } from "./mockData";

export type DateBlockReason = "admin" | "order";

interface CalendarStore {
  blockedDates: Record<string, DateBlockReason>;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  blockDate: (date: string, reason: DateBlockReason) => void;
  unblockDate: (date: string) => void;
  isBlocked: (date: string) => boolean;
  getBlockReason: (date: string) => DateBlockReason | null;
}

interface OrderStore {
  selectedCategoryId: string | null;
  selectedSizeKey: string | null;
  selectedAddons: Record<string, number>;
  customerName: string;
  customerPhone: string;
  customerNeighborhood: string;
  customerMessage: string;
  setCategory: (id: string) => void;
  setSize: (key: string) => void;
  setAddon: (id: string, qty: number) => void;
  setCustomerField: (field: string, value: string) => void;
  resetOrder: () => void;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      blockedDates: Object.fromEntries(
        getBlockedDatesForDemo().map((d) => [d, "admin" as DateBlockReason])
      ),
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
    { name: "arts-cakes-calendar" }
  )
);

export const useOrderStore = create<OrderStore>()((set) => ({
  selectedCategoryId: null,
  selectedSizeKey: null,
  selectedAddons: {},
  customerName: "",
  customerPhone: "",
  customerNeighborhood: "",
  customerMessage: "",
  setCategory: (id) => set({ selectedCategoryId: id, selectedSizeKey: null }),
  setSize: (key) => set({ selectedSizeKey: key }),
  setAddon: (id, qty) =>
    set((state) => ({
      selectedAddons:
        qty === 0
          ? Object.fromEntries(
              Object.entries(state.selectedAddons).filter(([k]) => k !== id)
            )
          : { ...state.selectedAddons, [id]: qty },
    })),
  setCustomerField: (field, value) => set({ [field]: value } as any),
  resetOrder: () =>
    set({
      selectedCategoryId: null,
      selectedSizeKey: null,
      selectedAddons: {},
      customerName: "",
      customerPhone: "",
      customerNeighborhood: "",
      customerMessage: "",
    }),
}));
