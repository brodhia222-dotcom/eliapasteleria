"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { CustomCakeItem } from "@/lib/mockData";
import { calcCustomCakePrice, formatARS } from "@/lib/pricing";
import { useCartStore } from "@/lib/cartStore";

export default function CustomCakeModal({
  item,
  onClose,
}: {
  item: CustomCakeItem;
  onClose: () => void;
}) {
  const add = useCartStore((s) => s.add);
  const [tierKey, setTierKey] = useState(item.tiers[1]?.key ?? item.tiers[0].key);
  const [fillingId, setFillingId] = useState(item.fillingOptions[0].id);
  const [decorationId, setDecorationId] = useState(item.decorationOptions[0].id);

  const tier = item.tiers.find((t) => t.key === tierKey)!;
  const filling = item.fillingOptions.find((f) => f.id === fillingId)!;
  const deco = item.decorationOptions.find((d) => d.id === decorationId)!;
  const price = calcCustomCakePrice(item, { tierKey, fillingId, decorationId });

  function handleAdd() {
    add({
      lineId: `${item.id}:${tierKey}:${fillingId}:${decorationId}`,
      itemId: item.id,
      name: item.name,
      detail: `${tier.label} · ${filling.name} · ${deco.name}`,
      imageUrl: item.imageUrl,
      unitPrice: price,
      minQty: 1,
      requiresDeposit: true,
      leadHours: item.leadHours,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="relative bg-cream rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="relative h-40">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-t-3xl" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-ink hover:bg-white transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <h3 className="font-display text-2xl font-semibold text-ink mb-1">{item.name}</h3>
          <p className="font-body text-sm text-ink-muted mb-6">
            Elegí tamaño, relleno y decoración. Se prepara en 5 días y requiere seña del 50%.
          </p>

          {/* Tamaño */}
          <p className="text-xs text-ink-muted font-body uppercase tracking-wider mb-3">Tamaño</p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {item.tiers.map((t) => (
              <button
                key={t.key}
                onClick={() => setTierKey(t.key)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                  tierKey === t.key ? "border-teal bg-teal/5" : "border-black/8 hover:border-teal/40"
                }`}
              >
                <p className="font-body text-sm font-medium text-ink">{t.label}</p>
                <p className="font-body text-[11px] text-ink-muted leading-tight">{t.portions}</p>
                <p className="font-display text-sm font-semibold text-teal mt-1">{formatARS(t.basePrice)}</p>
              </button>
            ))}
          </div>

          <OptionGroup label="Relleno" options={item.fillingOptions} selectedId={fillingId} onSelect={setFillingId} />
          <OptionGroup label="Decoración" options={item.decorationOptions} selectedId={decorationId} onSelect={setDecorationId} />

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/10">
            <div>
              <p className="font-body text-xs text-ink-muted">Precio</p>
              <p className="font-display text-2xl font-semibold text-ink">{formatARS(price)}</p>
            </div>
            <button
              onClick={handleAdd}
              className="bg-teal text-white font-medium px-6 py-3.5 rounded-full hover:bg-teal-d transition-colors text-sm"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </motion.div>
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
  options: { id: string; name: string; description?: string; priceDelta: number }[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mb-5">
      <p className="text-xs text-ink-muted font-body uppercase tracking-wider mb-3">{label}</p>
      <div className="space-y-2">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onSelect(o.id)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 ${
              selectedId === o.id ? "border-teal bg-teal/5" : "border-black/8 hover:border-teal/40"
            }`}
          >
            <span>
              <span className="font-body text-sm font-medium text-ink">{o.name}</span>
              {o.description && (
                <span className="block font-body text-xs text-ink-muted">{o.description}</span>
              )}
            </span>
            <span className="font-body text-sm text-teal shrink-0">
              {o.priceDelta === 0 ? "Incluido" : `+${formatARS(o.priceDelta)}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
