"use client";
import BookingCalendar from "@/components/calendar/BookingCalendar";
import { CAKE_PRODUCTS, ADDON_PRODUCTS, type SizeKey } from "@/lib/mockData";
import { useOrderStore } from "@/lib/store";
import { useCalendarStore } from "@/lib/store";

interface Props {
  onNext: () => void;
}

export default function Step1Calendar({ onNext }: Props) {
  const {
    selectedCategoryId,
    selectedSizeKey,
    selectedAddons,
    setCategory,
    setSize,
    setAddon,
  } = useOrderStore();
  const { selectedDate } = useCalendarStore();

  const selectedProduct = CAKE_PRODUCTS.find((p) => p.id === selectedCategoryId);
  const selectedSizeObj = selectedProduct?.sizes.find((s) => s.key === selectedSizeKey);

  const addonsTotal = Object.entries(selectedAddons).reduce((sum, [id, qty]) => {
    const addon = ADDON_PRODUCTS.find((a) => a.id === id);
    return sum + (addon?.unitPrice ?? 0) * qty;
  }, 0);

  const total = (selectedSizeObj?.price ?? 0) + addonsTotal;
  const canContinue = !!selectedDate && !!selectedCategoryId && !!selectedSizeKey;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left: Calendar */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink mb-2">
          Elegí la fecha de entrega
        </h2>
        <p className="text-sm text-ink-muted font-body mb-6">
          Las fechas en gris ya están ocupadas.
        </p>
        <BookingCalendar />
      </div>

      {/* Right: Product selector */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink mb-2">
          Elegí tu torta
        </h2>
        <p className="text-sm text-ink-muted font-body mb-6">
          Seleccioná la categoría y el tamaño.
        </p>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CAKE_PRODUCTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setCategory(p.id)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                selectedCategoryId === p.id
                  ? "bg-teal text-white"
                  : "bg-cream-deep text-ink hover:bg-teal/10"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Size selector */}
        {selectedProduct && (
          <div className="mb-6">
            <p className="text-xs text-ink-muted font-body uppercase tracking-wider mb-3">
              Tamaño
            </p>
            <div className="grid grid-cols-2 gap-2">
              {selectedProduct.sizes.map((size) => (
                <button
                  key={size.key}
                  onClick={() => setSize(size.key)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                    selectedSizeKey === size.key
                      ? "border-teal bg-teal/5"
                      : "border-black/8 hover:border-teal/40"
                  }`}
                >
                  <p className="font-body text-sm font-medium text-ink">{size.label}</p>
                  <p className="font-body text-xs text-ink-muted">{size.portions}</p>
                  <p className="font-display text-base font-semibold text-teal mt-1">
                    ${size.price.toLocaleString("es-AR")}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Addons */}
        <div className="mb-8">
          <p className="text-xs text-ink-muted font-body uppercase tracking-wider mb-3">
            Mesa dulce (opcional)
          </p>
          <div className="space-y-2">
            {ADDON_PRODUCTS.map((addon) => {
              const qty = selectedAddons[addon.id] ?? 0;
              return (
                <div
                  key={addon.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-black/8"
                >
                  <div>
                    <p className="font-body text-sm font-medium text-ink">{addon.name}</p>
                    <p className="font-body text-xs text-ink-muted">
                      ${addon.unitPrice.toLocaleString("es-AR")} / {addon.unitLabel}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAddon(addon.id, Math.max(0, qty - 1))}
                      disabled={qty === 0}
                      className="w-7 h-7 rounded-full border border-black/10 text-ink-muted hover:border-teal hover:text-teal transition-colors disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-body text-sm text-ink">{qty}</span>
                    <button
                      onClick={() => setAddon(addon.id, qty + 1)}
                      className="w-7 h-7 rounded-full border border-black/10 text-ink-muted hover:border-teal hover:text-teal transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total */}
        {total > 0 && (
          <div className="flex items-center justify-between mb-6 py-3 border-t border-black/8">
            <p className="font-body text-sm text-ink-muted">Total estimado</p>
            <p className="font-display text-2xl font-semibold text-ink">
              ${total.toLocaleString("es-AR")}
            </p>
          </div>
        )}

        <button
          onClick={onNext}
          disabled={!canContinue}
          className="w-full bg-teal text-white font-medium py-4 rounded-full transition-all duration-300 hover:bg-teal-d active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {!selectedDate
            ? "Primero elegí una fecha"
            : !selectedCategoryId || !selectedSizeKey
            ? "Elegí torta y tamaño"
            : "Continuar →"}
        </button>
      </div>
    </div>
  );
}
