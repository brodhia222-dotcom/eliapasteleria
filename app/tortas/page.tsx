import Link from "next/link";
import { getProductsByCategory } from "@/lib/data/products";
import ProductCard from "@/components/catalog/ProductCard";

export default function TortasPage() {
  const clasicas = getProductsByCategory("torta-estandar");
  const personalizadas = getProductsByCategory("torta-personalizada");

  return (
    <div className="min-h-[100dvh] bg-cream pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="text-teal text-xs uppercase tracking-widest font-body mb-3">
            Tortas
          </p>
          <h1 className="font-display text-5xl font-semibold text-ink tracking-tight">
            Nuestras tortas
          </h1>
          <p className="font-body text-ink-muted mt-3 max-w-xl">
            Tortas clásicas de receta fija listas en 48 hs, o una torta totalmente
            personalizada a tu medida con 5 días de anticipación. Todas las tortas
            requieren una seña del 50% para confirmar.
          </p>
        </div>

        {/* Tortas clásicas */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl font-semibold text-ink">Tortas clásicas</h2>
            <span className="text-xs font-body font-medium px-3 py-1 rounded-full bg-cream-deep text-ink-muted">
              Listas en 48 hs
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {clasicas.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Tortas personalizadas */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl font-semibold text-ink">Torta personalizada</h2>
            <span className="text-xs font-body font-medium px-3 py-1 rounded-full bg-cream-deep text-ink-muted">
              5 días de anticipación
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {personalizadas.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 bg-cream-deep rounded-2xl p-8 text-center">
            <p className="font-accent italic text-ink/70 text-lg mb-2">
              "Tu idea, nuestra torta."
            </p>
            <p className="font-body text-sm text-ink-muted mb-6 max-w-lg mx-auto">
              Elegí tamaño, relleno y nivel de decoración. Contanos qué imaginás y lo
              hacemos realidad.
            </p>
            <Link
              href="/encargo?producto=torta-personalizada"
              className="inline-flex items-center gap-2 bg-teal text-white font-medium px-7 py-3.5 rounded-full hover:bg-teal-d transition-all duration-300 active:scale-95"
            >
              Diseñar mi torta →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
