import Link from "next/link";
import { CAKE_PRODUCTS } from "@/lib/mockData";

export default function ProductosPage() {
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
            Cookies decoradas, porciones de torta y cajas regalo elaboradas artesanalmente para cada ocasión.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CAKE_PRODUCTS.map((product) => (
            <div key={product.id} className="group">
              <Link href={`/productos/${product.slug}`}>
                <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-5">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
                  />
                  <img
                    src={product.hoverImageUrl}
                    alt={`${product.name} — detalle`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 scale-105"
                  />
                </div>
              </Link>
              <div className="mb-3">
                <Link href={`/productos/${product.slug}`}>
                  <h2 className="font-display text-2xl font-semibold text-ink hover:text-teal transition-colors">
                    {product.name}
                  </h2>
                </Link>
                <p className="font-body text-sm text-teal mt-1">
                  {product.shortDescription}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {product.sizes.map((size) => (
                  <div
                    key={size.key}
                    className="border border-black/8 rounded-xl p-3"
                  >
                    <p className="font-body text-xs text-ink-muted">{size.portions}</p>
                    <p className="font-display text-base font-semibold text-teal">
                      ${size.price.toLocaleString("es-AR")}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href={`/encargo?categoria=${product.id}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-body font-medium text-teal hover:text-teal-d transition-colors"
              >
                Encargar →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
