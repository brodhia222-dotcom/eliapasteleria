"use client";
import { useEffect, useMemo, useState } from "react";
import BookingCalendar from "@/components/calendar/BookingCalendar";
import { useOrderStore, useCalendarStore, useStockStore } from "@/lib/store";
import { getCatalogGroups, getProductById, getProductBySlug, getAddons } from "@/lib/data/products";
import { buildMainItem, computeTotals, type OrderSelection } from "@/lib/orderUtils";
import { leadHoursOf, leadTimeLabel, formatARS } from "@/lib/pricing";
import type { ProductCategory } from "@/lib/mockData";

interface Props {
  onNext: () => void;
}

export default function Step1Calendar({ onNext }: Props) {
  const store = useOrderStore();
  const { selectedDate } = useCalendarStore();
  const { isAvailable } = useStockStore();

  const groups = useMemo(() => getCatalogGroups(), []);
  const addons = useMemo(() => getAddons(), []);

  const selectedProduct = store.selectedProductId
    ? getProductById(store.selectedProductId)
    : undefined;

  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(
    selectedProduct?.category ?? null
  );
  const activeGroup = groups.find((g) => g.category === activeCategory);
  const productsInCat = activeGroup?.products ?? [];

  function chooseCategory(cat: ProductCategory) {
    setActiveCategory(cat);
    const prods = groups.find((g) => g.category === cat)?.products ?? [];
    if (prods[0]) store.setProduct(prods[0].id);
  }

  // Preselección por deep-link: /encargo?producto=<slug>
  useEffect(() => {
    if (store.selectedProductId) return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("producto") || params.get("categoria");
    if (!ref) return;
    const p = getProductBySlug(ref) || getProductById(ref);
    if (p) {
      setActiveCategory(p.category);
      store.setProduct(p.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const { total, requiresDeposit, depositAmount } = computeTotals(selection);
  const mainItemValid = buildMainItem(selection) !== null;
  const minLeadHours = selectedProduct ? leadHoursOf(selectedProduct.leadTime) : 0;
  const canContinue = !!selectedDate && mainItemValid;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left: Calendar */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink mb-2">
          Elegí la fecha de entrega
        </h2>
        <p className="text-sm text-ink-muted font-body mb-6">
          {selectedProduct
            ? leadTimeLabel(selectedProduct) + ". Las fechas en gris no están disponibles."
            : "Las fechas en gris no están disponibles."}
        </p>
        <BookingCalendar minLeadHours={minLeadHours} />
      </div>

      {/* Right: Product selector */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink mb-2">
          Elegí tu pedido
        </h2>
        <p className="text-sm text-ink-muted font-body mb-6">
          Seleccioná qué querés y las opciones.
        </p>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {groups.map((g) => (
            <button
              key={g.category}
              onClick={() => chooseCategory(g.category)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                activeCategory === g.category
                  ? "bg-teal text-white"
                  : "bg-cream-deep text-ink hover:bg-teal/10"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Sub-selector de producto (cuando la categoría tiene varios) */}
        {productsInCat.length > 1 && (
          <div className="mb-6">
            <p className="text-xs text-ink-muted font-body uppercase tracking-wider mb-3">
              Elegí cuál
            </p>
            <div className="flex flex-wrap gap-2">
              {productsInCat.map((p) => {
                const avail = isAvailable(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => avail && store.setProduct(p.id)}
                    disabled={!avail}
                    className={`px-4 py-2 rounded-full text-sm font-body transition-all duration-200 ${
                      store.selectedProductId === p.id
                        ? "bg-ink text-white"
                        : "border border-black/10 text-ink hover:border-teal/50"
                    } ${!avail ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Disponibilidad / demora */}
        {selectedProduct && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span
              className={`text-xs font-body font-medium px-3 py-1.5 rounded-full ${
                selectedProduct.leadTime.type === "stock"
                  ? "bg-sage/15 text-sage"
                  : "bg-cream-deep text-ink-muted"
              }`}
            >
              {leadTimeLabel(selectedProduct)}
            </span>
            {requiresDeposit && (
              <span className="text-xs font-body font-medium px-3 py-1.5 rounded-full bg-amber-100 text-amber-800">
                Requiere seña del 50%
              </span>
            )}
          </div>
        )}

        {/* Opciones según el tipo de producto */}
        {selectedProduct?.kind === "stock" && (
          <StockOptions
            product={selectedProduct}
            isAvailable={isAvailable}
            varietyId={store.selectedVarietyId}
            qty={store.qty}
            onVariety={store.setVariety}
            onQty={store.setQty}
          />
        )}

        {selectedProduct?.kind === "standard" && (
          <div className="mb-6">
            <p className="text-xs text-ink-muted font-body uppercase tracking-wider mb-3">
              Tamaño
            </p>
            <div className="grid grid-cols-2 gap-2">
              {selectedProduct.sizes.map((size) => (
                <button
                  key={size.key}
                  onClick={() => store.setSize(size.key)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                    store.selectedSizeKey === size.key
                      ? "border-teal bg-teal/5"
                      : "border-black/8 hover:border-teal/40"
                  }`}
                >
                  <p className="font-body text-sm font-medium text-ink">{size.label}</p>
                  <p className="font-body text-xs text-ink-muted">{size.portions}</p>
                  <p className="font-display text-base font-semibold text-teal mt-1">
                    {formatARS(size.price)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedProduct?.kind === "custom" && (
          <div className="mb-6 space-y-6">
            {/* Tamaño */}
            <div>
              <p className="text-xs text-ink-muted font-body uppercase tracking-wider mb-3">
                Tamaño
              </p>
              <div className="grid grid-cols-3 gap-2">
                {selectedProduct.tiers.map((tier) => (
                  <button
                    key={tier.key}
                    onClick={() => store.setTier(tier.key)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      store.selectedTierKey === tier.key
                        ? "border-teal bg-teal/5"
                        : "border-black/8 hover:border-teal/40"
                    }`}
                  >
                    <p className="font-body text-sm font-medium text-ink">{tier.label}</p>
                    <p className="font-body text-[11px] text-ink-muted leading-tight">
                      {tier.portions}
                    </p>
                    <p className="font-display text-sm font-semibold text-teal mt-1">
                      {formatARS(tier.basePrice)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Relleno */}
            <OptionGroup
              label="Relleno"
              options={selectedProduct.fillingOptions}
              selectedId={store.selectedFillingId}
              onSelect={store.setFilling}
            />

            {/* Decoración */}
            <OptionGroup
              label="Decoración"
              options={selectedProduct.decorationOptions}
              selectedId={store.selectedDecorationId}
              onSelect={store.setDecoration}
            />
          </div>
        )}

        {/* Addons / Mesa dulce */}
        <div className="mb-8">
          <p className="text-xs text-ink-muted font-body uppercase tracking-wider mb-3">
            Mesa dulce (opcional)
          </p>
          <div className="space-y-2">
            {addons.map((addon) => {
              const qty = store.selectedAddons[addon.id] ?? 0;
              return (
                <div
                  key={addon.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-black/8"
                >
                  <div>
                    <p className="font-body text-sm font-medium text-ink">{addon.name}</p>
                    <p className="font-body text-xs text-ink-muted">
                      {formatARS(addon.unitPrice)} / {addon.unitLabel} · mín {addon.minQty}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        store.setAddon(addon.id, qty === 0 ? 0 : Math.max(0, qty === addon.minQty ? 0 : qty - 1))
                      }
                      disabled={qty === 0}
                      className="w-7 h-7 rounded-full border border-black/10 text-ink-muted hover:border-teal hover:text-teal transition-colors disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-body text-sm text-ink">{qty}</span>
                    <button
                      onClick={() =>
                        store.setAddon(addon.id, qty === 0 ? addon.minQty : qty + 1)
                      }
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
          <div className="mb-6 py-3 border-t border-black/8 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-body text-sm text-ink-muted">Total estimado</p>
              <p className="font-display text-2xl font-semibold text-ink">
                {formatARS(total)}
              </p>
            </div>
            {requiresDeposit && (
              <div className="flex items-center justify-between">
                <p className="font-body text-xs text-amber-700">Seña (50%) para confirmar</p>
                <p className="font-body text-sm font-semibold text-amber-700">
                  {formatARS(depositAmount)}
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onNext}
          disabled={!canContinue}
          className="w-full bg-teal text-white font-medium py-4 rounded-full transition-all duration-300 hover:bg-teal-d active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {!selectedDate
            ? "Primero elegí una fecha"
            : !mainItemValid
            ? "Completá tu elección"
            : "Continuar →"}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function StockOptions({
  product,
  isAvailable,
  varietyId,
  qty,
  onVariety,
  onQty,
}: {
  product: import("@/lib/mockData").StockProduct;
  isAvailable: (productId: string, varietyId?: string | null) => boolean;
  varietyId: string | null;
  qty: number;
  onVariety: (id: string) => void;
  onQty: (n: number) => void;
}) {
  const hasVarieties = !!product.varieties && product.varieties.length > 0;
  return (
    <div className="mb-6 space-y-5">
      {hasVarieties && (
        <div>
          <p className="text-xs text-ink-muted font-body uppercase tracking-wider mb-3">
            Variedad
          </p>
          <div className="grid grid-cols-2 gap-2">
            {product.varieties!.map((v) => {
              const avail = isAvailable(product.id, v.id);
              return (
                <button
                  key={v.id}
                  onClick={() => avail && onVariety(v.id)}
                  disabled={!avail}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                    varietyId === v.id
                      ? "border-teal bg-teal/5"
                      : "border-black/8 hover:border-teal/40"
                  } ${!avail ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <p className="font-body text-sm font-medium text-ink">{v.name}</p>
                  <p className="font-display text-sm font-semibold text-teal mt-0.5">
                    {formatARS(v.pricePerDozen)} / docena
                  </p>
                  {!avail && (
                    <p className="text-[10px] text-red-500 font-body mt-0.5">Sin stock</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs text-ink-muted font-body uppercase tracking-wider mb-3">
          Cantidad ({product.unitLabel}s)
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onQty(Math.max(product.minQty, qty - 1))}
            disabled={qty <= product.minQty}
            className="w-9 h-9 rounded-full border border-black/10 text-ink-muted hover:border-teal hover:text-teal transition-colors disabled:opacity-30"
          >
            −
          </button>
          <span className="w-8 text-center font-display text-lg font-semibold text-ink">
            {qty}
          </span>
          <button
            onClick={() => onQty(qty + 1)}
            className="w-9 h-9 rounded-full border border-black/10 text-ink-muted hover:border-teal hover:text-teal transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionGroup({
  label,
  options,
  selectedId,
  onSelect,
}: {
  label: string;
  options: import("@/lib/mockData").PricedOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-xs text-ink-muted font-body uppercase tracking-wider mb-3">
        {label}
      </p>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 ${
              selectedId === opt.id
                ? "border-teal bg-teal/5"
                : "border-black/8 hover:border-teal/40"
            }`}
          >
            <span>
              <span className="font-body text-sm font-medium text-ink">{opt.name}</span>
              {opt.description && (
                <span className="block font-body text-xs text-ink-muted">
                  {opt.description}
                </span>
              )}
            </span>
            <span className="font-body text-sm text-teal shrink-0">
              {opt.priceDelta === 0 ? "Incluido" : `+${formatARS(opt.priceDelta)}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
