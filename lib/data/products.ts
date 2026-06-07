// ============================================================================
// Capa de acceso a PRODUCTOS
// ----------------------------------------------------------------------------
// Fase 1: lee del catálogo mock (lib/mockData). Fase 2: estos cuerpos pasan a
// consultar Supabase, sin que los componentes que importan de acá cambien.
// ============================================================================
import {
  CATALOG,
  type Product,
  type StockProduct,
  type AddonProduct,
  type ProductCategory,
} from "../mockData";

export function getAllProducts(): Product[] {
  return [...CATALOG].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getProductById(id: string): Product | undefined {
  return CATALOG.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return CATALOG.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return getAllProducts().filter((p) => p.category === category);
}

/** Productos siempre disponibles 24/7 (cookies y brownies). */
export function getStockProducts(): StockProduct[] {
  return getAllProducts().filter((p): p is StockProduct => p.kind === "stock");
}

/** Mesa dulce (addons). */
export function getAddons(): AddonProduct[] {
  return getAllProducts().filter((p): p is AddonProduct => p.kind === "addon");
}

/** Categorías que el cliente puede encargar, en orden, para el selector. */
export const ORDER_CATEGORIES: { category: ProductCategory; label: string }[] = [
  { category: "cookies", label: "Cookies" },
  { category: "brownies", label: "Brownies" },
  { category: "porciones", label: "Porciones" },
  { category: "torta-estandar", label: "Tortas clásicas" },
  { category: "torta-personalizada", label: "Torta personalizada" },
  { category: "cajas", label: "Cajas regalo" },
];

/** Productos del catálogo público (sin addons), agrupados por categoría. */
export function getCatalogGroups(): {
  category: ProductCategory;
  label: string;
  products: Product[];
}[] {
  return ORDER_CATEGORIES.map(({ category, label }) => ({
    category,
    label,
    products: getProductsByCategory(category),
  })).filter((g) => g.products.length > 0);
}

/** Tortas (estandarizadas + personalizada) para la sección /tortas. */
export function getCakes(): Product[] {
  return getAllProducts().filter(
    (p) => p.category === "torta-estandar" || p.category === "torta-personalizada"
  );
}

/** Tres productos destacados para la home. */
export function getFeaturedProducts(): Product[] {
  const ids = ["cookies", "torta-personalizada", "cajas"];
  return ids
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);
}
