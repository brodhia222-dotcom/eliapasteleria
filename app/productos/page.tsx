"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { getCatalogItems } from "@/lib/data/products";
import { CATALOG_FILTERS, type CatalogFilter, type CatalogItem, type CakeItem, type CustomCakeItem, type UnitItem } from "@/lib/mockData";
import { priceFrom, formatARS, leadTimeLabel } from "@/lib/pricing";
import { useCartStore } from "@/lib/cartStore";
import { useStockStore } from "@/lib/store";
import CustomCakeModal from "@/components/catalog/CustomCakeModal";

type Filter = CatalogFilter | "todos";

export default function ProductosPage() {
  const items = useMemo(() => getCatalogItems(), []);
  const [filter, setFilter] = useState<Filter>("todos");
  const [customItem, setCustomItem] = useState<CustomCakeItem | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const visible = filter === "todos" ? items : items.filter((i) => i.filter === filter);

  return (
    <div className="min-h-[100dvh] bg-cream pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-teal text-xs uppercase tracking-widest font-body mb-3">Catálogo</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink tracking-tight">
            Nuestros productos
          </h1>
          <p className="font-body text-ink-muted mt-2 max-w-lg text-sm">
            Cookies y brownies siempre disponibles, y tortas por porción o enteras.
            Agregá lo que quieras al carrito y hacé tu pedido.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap mb-8">
          <FilterChip label="Todos" active={filter === "todos"} onClick={() => setFilter("todos")} />
          {CATALOG_FILTERS.map((f) => (
            <FilterChip key={f.id} label={f.label} active={filter === f.id} onClick={() => setFilter(f.id)} />
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {visible.map((item) => (
            <Card key={item.id} item={item} mounted={mounted} onCustom={() => setCustomItem(item as CustomCakeItem)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {customItem && <CustomCakeModal item={customItem} onClose={() => setCustomItem(null)} />}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
        active ? "bg-teal text-white" : "bg-cream-deep text-ink hover:bg-teal/10"
      }`}
    >
      {label}
    </button>
  );
}

function Card({ item, mounted, onCustom }: { item: CatalogItem; mounted: boolean; onCustom: () => void }) {
  const isAvailable = useStockStore((s) => s.isAvailable);
  const available = !mounted || isAvailable(item.id);
  const isStock = item.leadHours <= 0;

  return (
    <div className="bg-surface rounded-2xl border border-black/5 overflow-hidden flex flex-col">
      <div className="relative aspect-square overflow-hidden">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2">
          <span
            className={`text-[9px] font-body font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${
              isStock ? "bg-sage text-white" : "bg-white/90 text-ink"
            }`}
          >
            {isStock ? "24/7" : leadTimeLabel(item.leadHours)}
          </span>
        </div>
        {!available && (
          <div className="absolute inset-0 bg-cream/70 flex items-center justify-center">
            <span className="text-xs font-body font-semibold text-ink bg-white px-3 py-1.5 rounded-full">
              Sin stock
            </span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="font-display text-base font-semibold text-ink leading-tight">{item.name}</p>
        <p className="font-body text-[11px] text-ink-muted mt-0.5 line-clamp-2">{item.description}</p>

        <div className="mt-auto pt-3">
          {item.type === "unit" && <UnitActions item={item} disabled={!available} />}
          {item.type === "cake" && <CakeActions item={item} disabled={!available} />}
          {item.type === "custom" && <CustomActions item={item} disabled={!available} onOpen={onCustom} />}
        </div>
      </div>
    </div>
  );
}

function UnitActions({ item, disabled }: { item: UnitItem; disabled: boolean }) {
  const add = useCartStore((s) => s.add);
  return (
    <>
      <p className="font-display text-base font-semibold text-teal mb-2">
        {formatARS(item.unitPrice)}{" "}
        <span className="font-body text-xs text-ink-muted font-normal">/ {item.unitLabel}</span>
      </p>
      <button
        onClick={() =>
          add({
            lineId: item.id,
            itemId: item.id,
            name: item.name,
            detail: `Por ${item.unitLabel}`,
            imageUrl: item.imageUrl,
            unitPrice: item.unitPrice,
            minQty: item.minQty,
            requiresDeposit: false,
            leadHours: item.leadHours,
          })
        }
        disabled={disabled}
        className="w-full bg-teal text-white font-medium py-2.5 rounded-full text-sm hover:bg-teal-d transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Agregar
      </button>
    </>
  );
}

function CakeActions({ item, disabled }: { item: CakeItem; disabled: boolean }) {
  const add = useCartStore((s) => s.add);
  const [showSizes, setShowSizes] = useState(false);

  function addSlice() {
    add({
      lineId: `${item.id}:slice`,
      itemId: item.id,
      name: `${item.name} (porción)`,
      detail: "Porción individual",
      imageUrl: item.imageUrl,
      unitPrice: item.slicePrice,
      minQty: 1,
      requiresDeposit: true,
      leadHours: item.leadHours,
    });
  }

  function addWhole(size: { key: string; label: string; portions: string; price: number }) {
    add({
      lineId: `${item.id}:whole:${size.key}`,
      itemId: item.id,
      name: `${item.name} (entera)`,
      detail: `Entera · ${size.label} (${size.portions})`,
      imageUrl: item.imageUrl,
      unitPrice: size.price,
      minQty: 1,
      requiresDeposit: true,
      leadHours: item.leadHours,
    });
    setShowSizes(false);
  }

  return (
    <>
      <p className="font-body text-[11px] text-ink-muted mb-2">
        Porción <span className="font-display text-sm font-semibold text-teal">{formatARS(item.slicePrice)}</span>
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={addSlice}
          disabled={disabled}
          className="bg-teal text-white font-medium py-2.5 rounded-full text-xs hover:bg-teal-d transition-colors active:scale-95 disabled:opacity-40"
        >
          Porción
        </button>
        <button
          onClick={() => setShowSizes((v) => !v)}
          disabled={disabled}
          className="border border-teal text-teal font-medium py-2.5 rounded-full text-xs hover:bg-teal/5 transition-colors active:scale-95 disabled:opacity-40"
        >
          Entera {showSizes ? "▴" : "▾"}
        </button>
      </div>
      {showSizes && (
        <div className="mt-2 space-y-1.5">
          {item.sizes.map((s) => (
            <button
              key={s.key}
              onClick={() => addWhole(s)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-black/8 hover:border-teal/50 transition-colors text-left"
            >
              <span className="font-body text-xs text-ink">{s.label} · {s.portions}</span>
              <span className="font-body text-xs font-semibold text-teal">{formatARS(s.price)}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function CustomActions({ item, disabled, onOpen }: { item: CustomCakeItem; disabled: boolean; onOpen: () => void }) {
  return (
    <>
      <p className="font-body text-[11px] text-ink-muted mb-2">
        Desde <span className="font-display text-sm font-semibold text-teal">{formatARS(priceFrom(item))}</span>
      </p>
      <button
        onClick={onOpen}
        disabled={disabled}
        className="w-full bg-ink text-white font-medium py-2.5 rounded-full text-sm hover:bg-ink/90 transition-colors active:scale-95 disabled:opacity-40"
      >
        Diseñar tu torta →
      </button>
    </>
  );
}
