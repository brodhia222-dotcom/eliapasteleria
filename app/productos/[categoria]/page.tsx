import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProducts, getProductBySlug } from "@/lib/data/products";
import { formatARS, leadTimeLabel } from "@/lib/pricing";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ categoria: p.slug }));
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const product = getProductBySlug(categoria);
  if (!product) notFound();

  const isStock = product.leadTime.type === "stock";

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
            <div className="rounded-2xl overflow-hidden aspect-[4/5] relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span
                  className={`text-[11px] font-body font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full ${
                    isStock ? "bg-sage text-white" : "bg-white/90 text-ink"
                  }`}
                >
                  {isStock ? "Siempre disponible · 24/7" : leadTimeLabel(product)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-teal text-xs uppercase tracking-widest font-body mb-3">
              {isStock ? "En stock" : "A pedido"}
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

            {/* Detalle según el tipo de producto */}
            {product.kind === "stock" && product.varieties && (
              <Section title="Variedades disponibles">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.varieties.map((v) => (
                    <div key={v.id} className="border border-black/8 rounded-xl overflow-hidden">
                      <div className="aspect-[3/2] overflow-hidden">
                        <img src={v.imageUrl} alt={v.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <p className="font-body text-sm font-medium text-ink">{v.name}</p>
                        <p className="font-body text-xs text-ink-muted">{v.description}</p>
                        <p className="font-display text-base font-semibold text-teal mt-1">
                          {formatARS(v.pricePerDozen)} / docena
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {product.kind === "stock" && !product.varieties && (
              <Section title="Precio">
                <p className="font-display text-2xl font-semibold text-teal">
                  {formatARS(product.unitPrice)} / {product.unitLabel}
                </p>
              </Section>
            )}

            {product.kind === "standard" && (
              <Section title="Precios y presentaciones">
                <div className="grid grid-cols-2 gap-2">
                  {product.sizes.map((size) => (
                    <div key={size.key} className="border border-black/8 rounded-xl p-4">
                      <p className="font-body text-sm font-medium text-ink">{size.label}</p>
                      <p className="font-body text-xs text-ink-muted">{size.portions}</p>
                      <p className="font-display text-lg font-semibold text-teal mt-1">
                        {formatARS(size.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {product.kind === "custom" && (
              <>
                <Section title="Tamaños">
                  <div className="grid grid-cols-3 gap-2">
                    {product.tiers.map((t) => (
                      <div key={t.key} className="border border-black/8 rounded-xl p-3">
                        <p className="font-body text-sm font-medium text-ink">{t.label}</p>
                        <p className="font-body text-[11px] text-ink-muted leading-tight">{t.portions}</p>
                        <p className="font-display text-sm font-semibold text-teal mt-1">
                          {formatARS(t.basePrice)}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
                <Section title="Rellenos">
                  <OptionList options={product.fillingOptions} />
                </Section>
                <Section title="Decoración">
                  <OptionList options={product.decorationOptions} />
                </Section>
              </>
            )}

            {product.kind === "addon" && (
              <Section title="Precio">
                <p className="font-display text-2xl font-semibold text-teal">
                  {formatARS(product.unitPrice)} / {product.unitLabel}
                </p>
                <p className="font-body text-xs text-ink-muted mt-1">
                  Pedido mínimo: {product.minQty} {product.unitLabel}s
                </p>
              </Section>
            )}

            {product.requiresDeposit && (
              <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 mb-8">
                <p className="text-xs text-amber-800 font-body leading-relaxed">
                  Esta torta requiere una <strong>seña del 50%</strong> para confirmar el
                  pedido. El saldo se abona antes de la entrega.
                </p>
              </div>
            )}

            <Link
              href={`/encargo?producto=${product.slug}`}
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="text-xs text-ink-muted font-body uppercase tracking-wider mb-4">{title}</p>
      {children}
    </div>
  );
}

function OptionList({
  options,
}: {
  options: { id: string; name: string; description?: string; priceDelta: number }[];
}) {
  return (
    <ul className="space-y-2">
      {options.map((o) => (
        <li
          key={o.id}
          className="flex items-center justify-between border border-black/8 rounded-xl px-4 py-2.5"
        >
          <span>
            <span className="font-body text-sm text-ink">{o.name}</span>
            {o.description && (
              <span className="block font-body text-xs text-ink-muted">{o.description}</span>
            )}
          </span>
          <span className="font-body text-sm text-teal shrink-0">
            {o.priceDelta === 0 ? "Incluido" : `+${formatARS(o.priceDelta)}`}
          </span>
        </li>
      ))}
    </ul>
  );
}
