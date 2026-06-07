// ============================================================================
// Elia Pastelería — DATOS EDITABLES DEL SITIO (seed)
// ----------------------------------------------------------------------------
// Única fuente del catálogo en Fase 1. En Fase 2 esto vivirá en Supabase y los
// componentes seguirán leyendo desde `lib/data/*` (no de acá directamente).
//
// El catálogo es una lista plana de ítems comprables (CatalogItem):
//   - "unit"  → cookies (por variedad) y brownies. Siempre en stock 24/7, por docena.
//   - "cake"  → tortas clásicas: se venden por PORCIÓN o TORTA ENTERA (con tamaños).
//   - "custom"→ torta personalizada (tamaño + relleno + decoración).
// Filtros del catálogo: Cookies · Brownies · Tortas.
// ============================================================================

export type CatalogFilter = "cookies" | "brownies" | "tortas";

export const LEAD_STOCK_HOURS = 0; // cookies / brownies (24/7)
export const LEAD_STANDARD_HOURS = 48; // tortas clásicas
export const LEAD_CUSTOM_HOURS = 120; // torta personalizada (5 días)

export interface ProductSize {
  key: string;
  label: string;
  portions: string;
  price: number;
}

export interface PricedOption {
  id: string;
  name: string;
  description?: string;
  priceDelta: number; // 0 = incluido
}

export interface CakeTier {
  key: string;
  label: string;
  portions: string;
  basePrice: number;
}

interface ItemBase {
  id: string;
  filter: CatalogFilter;
  name: string;
  description: string;
  imageUrl: string;
  leadHours: number;
  requiresDeposit: boolean;
  available: boolean;
  sortOrder: number;
}

/** Cookies (por variedad) y brownies: por docena, 24/7. */
export interface UnitItem extends ItemBase {
  type: "unit";
  unitLabel: string; // "docena"
  unitPrice: number;
  minQty: number;
  requiresDeposit: false;
}

/** Torta clásica: porción o torta entera (con tamaños). Requiere seña. */
export interface CakeItem extends ItemBase {
  type: "cake";
  filter: "tortas";
  slicePrice: number; // precio por porción
  sizes: ProductSize[]; // tamaños de torta entera
  requiresDeposit: true;
}

/** Torta personalizada: tamaño + relleno + decoración. Requiere seña. */
export interface CustomCakeItem extends ItemBase {
  type: "custom";
  filter: "tortas";
  tiers: CakeTier[];
  fillingOptions: PricedOption[];
  decorationOptions: PricedOption[];
  requiresDeposit: true;
}

export type CatalogItem = UnitItem | CakeItem | CustomCakeItem;

// ----------------------------------------------------------------------------
// Imágenes placeholder (se reemplazan por fotos reales más adelante)
// ----------------------------------------------------------------------------
const IMG = {
  cookieChoc: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80",
  cookieDeco: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80",
  cookiePlain: "https://images.unsplash.com/photo-1590080876281-3c8e8b3a3a3a?w=800&q=80",
  cookieStack: "https://images.unsplash.com/photo-1592151450073-9b3b3a3a3a3a?w=800&q=80",
  brownie: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
  lemonPie: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80",
  chocoCake: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80",
  cheesecake: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
  customCake: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80",
};

// Imágenes de cookies que sabemos que cargan bien (reutilizamos 2 estables)
const COOKIE_A = IMG.cookieChoc;
const COOKIE_B = IMG.cookieDeco;

// ============================================================================
// CATÁLOGO
// ============================================================================
export const CATALOG: CatalogItem[] = [
  // ----- COOKIES (24/7, por docena) ----------------------------------------
  {
    id: "cookie-vainilla", type: "unit", filter: "cookies",
    name: "Cookies de vainilla", description: "Clásicas de manteca y vainilla, decoradas con glasé real.",
    imageUrl: COOKIE_B, unitLabel: "docena", unitPrice: 6000, minQty: 1,
    leadHours: LEAD_STOCK_HOURS, requiresDeposit: false, available: true, sortOrder: 1,
  },
  {
    id: "cookie-chocolate", type: "unit", filter: "cookies",
    name: "Cookies de chocolate", description: "Tiernas con chips de chocolate semiamargo.",
    imageUrl: COOKIE_A, unitLabel: "docena", unitPrice: 6500, minQty: 1,
    leadHours: LEAD_STOCK_HOURS, requiresDeposit: false, available: true, sortOrder: 2,
  },
  {
    id: "cookie-limon", type: "unit", filter: "cookies",
    name: "Cookies de limón", description: "Masa cítrica con glasé de limón natural.",
    imageUrl: COOKIE_B, unitLabel: "docena", unitPrice: 6500, minQty: 1,
    leadHours: LEAD_STOCK_HOURS, requiresDeposit: false, available: true, sortOrder: 3,
  },
  {
    id: "cookie-ddl", type: "unit", filter: "cookies",
    name: "Cookies rellenas de dulce de leche", description: "Dos tapas unidas con dulce de leche repostero.",
    imageUrl: COOKIE_A, unitLabel: "docena", unitPrice: 7500, minQty: 1,
    leadHours: LEAD_STOCK_HOURS, requiresDeposit: false, available: true, sortOrder: 4,
  },
  {
    id: "cookie-red-velvet", type: "unit", filter: "cookies",
    name: "Cookies red velvet", description: "Red velvet con chips de chocolate blanco.",
    imageUrl: COOKIE_B, unitLabel: "docena", unitPrice: 7500, minQty: 1,
    leadHours: LEAD_STOCK_HOURS, requiresDeposit: false, available: true, sortOrder: 5,
  },
  {
    id: "cookie-avena", type: "unit", filter: "cookies",
    name: "Cookies de avena y pasas", description: "Avena, pasas y un toque de canela.",
    imageUrl: COOKIE_A, unitLabel: "docena", unitPrice: 6000, minQty: 1,
    leadHours: LEAD_STOCK_HOURS, requiresDeposit: false, available: true, sortOrder: 6,
  },

  // ----- BROWNIES (24/7, por docena) ---------------------------------------
  {
    id: "brownies-clasico", type: "unit", filter: "brownies",
    name: "Brownies clásicos", description: "Húmedos, de chocolate intenso. Siempre disponibles.",
    imageUrl: IMG.brownie, unitLabel: "docena", unitPrice: 9500, minQty: 1,
    leadHours: LEAD_STOCK_HOURS, requiresDeposit: false, available: true, sortOrder: 7,
  },
  {
    id: "brownies-nuez", type: "unit", filter: "brownies",
    name: "Brownies con nuez", description: "El clásico con nueces tostadas.",
    imageUrl: IMG.brownie, unitLabel: "docena", unitPrice: 10500, minQty: 1,
    leadHours: LEAD_STOCK_HOURS, requiresDeposit: false, available: true, sortOrder: 8,
  },

  // ----- TORTAS CLÁSICAS (porción o entera, 48 h, seña 50%) ----------------
  {
    id: "torta-lemon-pie", type: "cake", filter: "tortas",
    name: "Lemon Pie", description: "Base crocante, crema de limón y merengue italiano.",
    imageUrl: IMG.lemonPie,
    slicePrice: 4500,
    sizes: [
      { key: "s", label: "Chica", portions: "8 porciones", price: 22000 },
      { key: "m", label: "Mediana", portions: "12 porciones", price: 30000 },
      { key: "l", label: "Grande", portions: "16 porciones", price: 40000 },
    ],
    leadHours: LEAD_STANDARD_HOURS, requiresDeposit: true, available: true, sortOrder: 9,
  },
  {
    id: "torta-brownie", type: "cake", filter: "tortas",
    name: "Torta Brownie", description: "Capas de brownie intenso con ganache de chocolate.",
    imageUrl: IMG.chocoCake,
    slicePrice: 5000,
    sizes: [
      { key: "s", label: "Chica", portions: "8 porciones", price: 24000 },
      { key: "m", label: "Mediana", portions: "12 porciones", price: 33000 },
      { key: "l", label: "Grande", portions: "16 porciones", price: 44000 },
    ],
    leadHours: LEAD_STANDARD_HOURS, requiresDeposit: true, available: true, sortOrder: 10,
  },
  {
    id: "torta-cheesecake", type: "cake", filter: "tortas",
    name: "Cheesecake", description: "Cheesecake cremoso con coulis de frutos rojos.",
    imageUrl: IMG.cheesecake,
    slicePrice: 5000,
    sizes: [
      { key: "s", label: "Chica", portions: "8 porciones", price: 26000 },
      { key: "m", label: "Mediana", portions: "12 porciones", price: 35000 },
      { key: "l", label: "Grande", portions: "16 porciones", price: 46000 },
    ],
    leadHours: LEAD_STANDARD_HOURS, requiresDeposit: true, available: true, sortOrder: 11,
  },

  // ----- TORTA PERSONALIZADA (5 días, seña 50%) ----------------------------
  {
    id: "torta-personalizada", type: "custom", filter: "tortas",
    name: "Torta personalizada", description: "Diseñá tu torta: tamaño, relleno y decoración a elección.",
    imageUrl: IMG.customCake,
    tiers: [
      { key: "s", label: "Chica", portions: "10 a 15 porciones", basePrice: 35000 },
      { key: "m", label: "Mediana", portions: "20 a 25 porciones", basePrice: 50000 },
      { key: "l", label: "Grande", portions: "30 a 40 porciones", basePrice: 72000 },
    ],
    fillingOptions: [
      { id: "fill-ddl", name: "Dulce de leche", priceDelta: 0 },
      { id: "fill-choco", name: "Chocolate / ganache", priceDelta: 2000 },
      { id: "fill-frutos", name: "Frutos rojos", priceDelta: 4000 },
      { id: "fill-maracuya", name: "Maracuyá", priceDelta: 4000 },
      { id: "fill-tres-leches", name: "Tres leches", priceDelta: 3000 },
    ],
    decorationOptions: [
      { id: "deco-simple", name: "Simple", description: "Cobertura lisa y detalles mínimos", priceDelta: 0 },
      { id: "deco-tematica", name: "Temática", description: "Diseño temático con apliques", priceDelta: 8000 },
      { id: "deco-premium", name: "Premium", description: "Modelado, flores y detalle máximo", priceDelta: 18000 },
    ],
    leadHours: LEAD_CUSTOM_HOURS, requiresDeposit: true, available: true, sortOrder: 12,
  },
];

export const CATALOG_FILTERS: { id: CatalogFilter; label: string }[] = [
  { id: "cookies", label: "Cookies" },
  { id: "brownies", label: "Brownies" },
  { id: "tortas", label: "Tortas" },
];

// ============================================================================
// FECHAS ESPECIALES (próxima ocurrencia se calcula en lib/data/specialDates)
// ============================================================================
export interface SpecialDateDef {
  id: string;
  month: number; // 1-12
  day: number; // 1-31
  title: string;
  includes: string;
  badge: string;
  color: string; // hex
}

export const SPECIAL_DATE_DEFS: SpecialDateDef[] = [
  { id: "revolucion-mayo", month: 5, day: 25, title: "Día de la Revolución de Mayo", includes: "Pastelitos patrios y cookies con temática patria.", badge: "Fecha patria", color: "#6CA7D4" },
  { id: "dia-bandera", month: 6, day: 20, title: "Día de la Bandera", includes: "Pastelitos patrios y cookies celeste y blanco.", badge: "Fecha patria", color: "#6CA7D4" },
  { id: "dia-independencia", month: 7, day: 9, title: "Día de la Independencia", includes: "Pastelitos patrios y cookies temáticas.", badge: "Fecha patria", color: "#6CA7D4" },
  { id: "dia-amigo", month: 7, day: 20, title: "Día del Amigo", includes: "Cookies y brownies para regalar.", badge: "Para regalar", color: "#E8A23D" },
  { id: "navidad", month: 12, day: 25, title: "Navidad", includes: "Cookies temáticas y tortas navideñas.", badge: "Navidad", color: "#C0533F" },
  { id: "san-valentin", month: 2, day: 14, title: "San Valentín", includes: "Cookies con corazones y tortas para dos.", badge: "San Valentín", color: "#E8849B" },
];

// ============================================================================
// CONTENIDO EDITORIAL
// ============================================================================
export interface Testimonial {
  id: string;
  name: string;
  neighborhood: string;
  text: string;
  stars: number;
  imageUrl: string;
  occasion: string;
  productType: string;
}

export const TESTIMONIALS: Testimonial[] = [
  { id: "t1", name: "Sofía L.", neighborhood: "Palermo", text: "Pedí cookies para el cumpleaños de mi nena y fueron la estrella de la fiesta. El nivel de detalle es increíble.", stars: 5, imageUrl: COOKIE_B, occasion: "Cumpleaños infantil", productType: "Cookies" },
  { id: "t2", name: "Valentina M.", neighborhood: "Recoleta", text: "Los brownies son adictivos y siempre los tienen listos. Pedí también una torta brownie y voló.", stars: 5, imageUrl: IMG.brownie, occasion: "Merienda", productType: "Brownies" },
  { id: "t3", name: "Camila R.", neighborhood: "San Isidro", text: "Encargué una torta personalizada para el cumple de mi mamá y superó todas las expectativas. Riquísima e impecable.", stars: 5, imageUrl: IMG.customCake, occasion: "Cumpleaños familiar", productType: "Torta personalizada" },
];

export const FAQ_ITEMS = [
  { id: "faq-1", question: "¿Qué productos están siempre disponibles?", answer: "Las cookies y los brownies están siempre en stock (24/7): podés pedirlos sin anticipación. Las tortas se elaboran a pedido." },
  { id: "faq-2", question: "¿Con cuánta anticipación debo encargar una torta?", answer: "Las tortas clásicas (lemon pie, torta brownie, cheesecake) se preparan en 48 hs. Las tortas personalizadas requieren 5 días de anticipación." },
  { id: "faq-3", question: "¿Cómo es la seña de las tortas?", answer: "Todas las tortas (clásicas y personalizadas) requieren una seña del 50% para confirmar el pedido. El pedido NO queda confirmado hasta que la seña esté abonada. El saldo se paga antes de la entrega." },
  { id: "faq-4", question: "¿Hacen envío o solo retiro?", answer: "Podés retirar por el local sin costo, o pedir envío a domicilio. El envío se hace a través de plataformas como Rappi o Uber; ante cualquier inconveniente durante el envío, la pastelería no se hace responsable, ya que el traslado lo realiza un tercero." },
  { id: "faq-5", question: "¿Puedo comprar tortas por porción?", answer: "¡Sí! Las tortas clásicas se pueden pedir por porción o enteras (en distintos tamaños). Elegís la opción al agregarlas al carrito." },
  { id: "faq-6", question: "¿Cómo hago el pedido?", answer: "Agregás lo que quieras al carrito, elegís fecha de entrega y completás tus datos. El pedido nos llega y coordinamos el pago y la entrega por WhatsApp." },
];

/** Fechas bloqueadas de ejemplo para la demo (offset desde hoy). */
export function getBlockedDatesForDemo(): string[] {
  const today = new Date();
  const blocked: string[] = [];
  const offsets = [3, 7, 11, 18, 23];
  for (const offset of offsets) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    blocked.push(d.toISOString().split("T")[0]);
  }
  return blocked;
}
