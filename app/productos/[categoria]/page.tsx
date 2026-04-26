import { notFound } from "next/navigation";
import Link from "next/link";
import { CAKE_PRODUCTS } from "@/lib/mockData";

const VALID_SLUGS = ["cookies", "porciones", "cajas"];

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ categoria: slug }));
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  if (!VALID_SLUGS.includes(categoria)) notFound();

  const product = CAKE_PRODUCTS.find((p) => p.slug === categoria);
  if (!product) notFound();

  return (
    <div className="min-h-[100dvh] bg-cream pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/productos"
          className="inline-flex items-center gap-1 text-sm text-ink-muted font-body hover:text-ink transition-colors mb-8"
        >
          ← Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="md:sticky md:top-28">
            <div className="rounded-2xl overflow-hidden aspect-[4/5]">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <p className="text-teal text-xs uppercase tracking-widest font-body mb-3">
              Productos
            </p>
            <h1 className="font-display text-4xl font-semibold text-ink mb-4 tracking-tight">
              {product.name}
            </h1>
            <p className="font-body text-ink-muted leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="mb-8">
              <p className="text-xs text-ink-muted font-body uppercase tracking-wider mb-4">
                Lo que incluye
              </p>
              <ul className="space-y-2">
                {product.leadingFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 font-body text-sm text-ink">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <p className="text-xs text-ink-muted font-body uppercase tracking-wider mb-4">
                Precios y presentaciones
              </p>
              <div className="grid grid-cols-2 gap-2">
                {product.sizes.map((size) => (
                  <div key={size.key} className="border border-black/8 rounded-xl p-4">
                    <p className="font-body text-sm font-medium text-ink">{size.label}</p>
                    <p className="font-body text-xs text-ink-muted">{size.portions}</p>
                    <p className="font-display text-lg font-semibold text-teal mt-1">
                      ${size.price.toLocaleString("es-AR")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={`/encargo?categoria=${product.id}`}
              className="inline-flex items-center gap-2 bg-teal text-white font-medium px-8 py-4 rounded-full hover:bg-teal-d transition-all duration-300 active:scale-95"
            >
              Hacer mi encargo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
