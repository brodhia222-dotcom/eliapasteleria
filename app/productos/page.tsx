import Link from "next/link";
import { getCatalogGroups, getAddons } from "@/lib/data/products";
import ProductCard from "@/components/catalog/ProductCard";

export default function ProductosPage() {
  const groups = getCatalogGroups();
  const addons = getAddons();

  return (
    <div className="min-h-[100dvh] bg-cream pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="text-teal text-xs uppercase tracking-widest font-body mb-3">
            Catálogo
          </p>
          <h1 className="font-display text-5xl font-semibold text-ink tracking-tight">
            Nuestros productos
          </h1>
          <p className="font-body text-ink-muted mt-3 max-w-lg">
            Cookies y brownies siempre disponibles, porciones, tortas y cajas regalo
            elaboradas artesanalmente para cada ocasión.
          </p>
        </div>

        {groups.map((group) => (
          <section key={group.category} className="mb-16">
            <h2 className="font-display text-2xl font-semibold text-ink mb-6">
              {group.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}

        {/* Mesa dulce */}
        <section className="mb-4">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold text-ink">Mesa dulce</h2>
            <Link
              href="/mesa-dulce"
              className="text-sm text-ink-muted hover:text-teal transition-colors font-body underline underline-offset-4"
            >
              Ver mesa dulce →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {addons.map((addon) => (
              <ProductCard key={addon.id} product={addon} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
