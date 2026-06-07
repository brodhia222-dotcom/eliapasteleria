import Link from "next/link";
import { priceFrom, formatARS, leadTimeLabel } from "@/lib/pricing";
import type { Product } from "@/lib/mockData";

export default function ProductCard({ product }: { product: Product }) {
  const isStock = product.leadTime.type === "stock";
  return (
    <div className="group">
      <Link href={`/productos/${product.slug}`}>
        <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-4">
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
          <div className="absolute top-3 left-3">
            <span
              className={`text-[10px] font-body font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full ${
                isStock ? "bg-sage text-white" : "bg-white/90 backdrop-blur-sm text-ink"
              }`}
            >
              {isStock ? "24/7" : leadTimeLabel(product)}
            </span>
          </div>
        </div>
      </Link>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/productos/${product.slug}`}>
            <h3 className="font-display text-xl font-semibold text-ink hover:text-teal transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="font-body text-sm text-ink-muted mt-0.5">{product.shortDescription}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-ink-muted font-body">Desde</p>
          <p className="font-display text-lg font-semibold text-teal">
            {formatARS(priceFrom(product))}
          </p>
        </div>
      </div>
      <Link
        href={`/encargo?producto=${product.slug}`}
        className="mt-3 inline-flex items-center gap-2 text-sm font-body font-medium text-teal hover:text-teal-d transition-colors"
      >
        Encargar →
      </Link>
    </div>
  );
}
