import Link from "next/link";
import { ADDON_PRODUCTS } from "@/lib/mockData";

export default function MesaDulcePage() {
  return (
    <div className="min-h-[100dvh] bg-cream pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="text-teal text-xs uppercase tracking-widest font-body mb-3">
            Adicionales
          </p>
          <h1 className="font-display text-5xl font-semibold text-ink tracking-tight">
            Mesa dulce
          </h1>
          <p className="font-body text-ink-muted mt-3 max-w-lg">
            Completá tu evento con detalles artesanales que combinan perfectamente con la torta.
            Podés pedirlos junto con tu torta o de forma independiente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {ADDON_PRODUCTS.map((addon) => (
            <div key={addon.id} className="group">
              <div className="rounded-2xl overflow-hidden aspect-square mb-4">
                <img
                  src={addon.imageUrl}
                  alt={addon.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h2 className="font-display text-xl font-semibold text-ink mb-2">
                {addon.name}
              </h2>
              <p className="font-body text-sm text-ink-muted mb-3 leading-relaxed">
                {addon.description}
              </p>
              <p className="font-display text-lg font-semibold text-teal">
                ${addon.unitPrice.toLocaleString("es-AR")} / {addon.unitLabel}
              </p>
              {addon.minQty > 1 && (
                <p className="text-xs text-ink-muted font-body mt-1">
                  Mínimo: {addon.minQty} {addon.unitLabel}s
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-cream-deep rounded-2xl p-8 text-center">
          <p className="font-accent italic text-ink/70 text-lg mb-2">
            "Cada detalle importa."
          </p>
          <p className="font-body text-sm text-ink-muted mb-6">
            Los adicionales de mesa dulce se coordinan en el mismo proceso que tu torta.
          </p>
          <Link
            href="/encargo"
            className="inline-flex items-center gap-2 bg-teal text-white font-medium px-7 py-3.5 rounded-full hover:bg-teal-d transition-all duration-300 active:scale-95"
          >
            Hacer un encargo →
          </Link>
        </div>
      </div>
    </div>
  );
}
