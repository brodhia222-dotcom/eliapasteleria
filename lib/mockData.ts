// ============================================================================
// Elia Pastelería — DATOS EDITABLES DEL SITIO (seed)
// ----------------------------------------------------------------------------
// Este archivo es la ÚNICA fuente de datos del catálogo en la Fase 1 (mock).
// En la Fase 2 estos datos vivirán en Supabase; los componentes NO leen de
// acá directamente sino a través de `lib/data/*`, así la migración no los toca.
//
// Modelo de productos = discriminated union sobre `kind`:
//   - "stock"    → SIEMPRE disponible 24/7 (cookies y brownies). Sin seña.
//   - "standard" → a pedido con demora fija (porciones, tortas estándar, cajas)
//   - "custom"   → torta personalizada (3 tamaños + relleno + decoración)
//   - "addon"    → mesa dulce (paletas, macarons, cake pops)
// ============================================================================

export type ProductCategory =
  | "cookies"
  | "brownies"
  | "porciones"
  | "torta-estandar"
  | "torta-personalizada"
  | "cajas"
  | "mesa-dulce";

export type ProductKind = "stock" | "standard" | "custom" | "addon";

export type SizeKey = "s" | "m" | "l" | "xl";

/** Tiempo de anticipación necesario. `stock` = 24/7 sin demora. */
export type LeadTime = { type: "stock" } | { type: "leadHours"; hours: number };

export const LEAD_STANDARD_HOURS = 48; // tortas estandarizadas / porciones / cajas
export const LEAD_CUSTOM_HOURS = 120; // tortas personalizadas (5 días)

export interface ProductSize {
  key: SizeKey;
  label: string;
  portions: string;
  price: number;
}

/** Una variedad/sabor de cookie (el "listado de tipos de cookies"). */
export interface CookieVariety {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  pricePerDozen: number;
  available: boolean;
}

/** Opción con recargo: relleno o decoración de torta personalizada. */
export interface PricedOption {
  id: string;
  name: string;
  description?: string;
  priceDelta: number; // 0 = incluido
}

/** Tamaño de torta personalizada con precio base. */
export interface CakeTier {
  key: "s" | "m" | "l";
  label: string;
  portions: string;
  basePrice: number;
}

interface ProductBase {
  id: string;
  name: string;
  category: ProductCategory;
  kind: ProductKind;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  hoverImageUrl: string;
  leadingFeatures: string[];
  leadTime: LeadTime;
  requiresDeposit: boolean;
  available: boolean; // disponibilidad por defecto (la pastelera la edita en /admin)
  sortOrder: number;
}

export interface StockProduct extends ProductBase {
  kind: "stock";
  varieties?: CookieVariety[]; // cookies sí; brownies no
  unitLabel: string;
  unitPrice: number; // precio base cuando no hay varieties (brownies)
  minQty: number;
}

export interface StandardProduct extends ProductBase {
  kind: "standard";
  sizes: ProductSize[];
}

export interface CustomCakeProduct extends ProductBase {
  kind: "custom";
  tiers: CakeTier[];
  fillingOptions: PricedOption[];
  decorationOptions: PricedOption[];
}

export interface AddonProduct extends ProductBase {
  kind: "addon";
  unitLabel: string;
  unitPrice: number;
  minQty: number;
}

export type Product =
  | StockProduct
  | StandardProduct
  | CustomCakeProduct
  | AddonProduct;

// ============================================================================
// CATÁLOGO
// ============================================================================

const PLACEHOLDER = {
  cookie: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80",
  cookie2: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80",
  brownie: "https://images.unsplash.com/photo-1607920592519-bab4d4db3a2e?w=800&q=80",
  brownie2: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
  porcion: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
  porcion2: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
  torta: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80",
  torta2: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
  lemon: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80",
  cheesecake: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
  chocotorta: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80",
  caja: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",
  caja2: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=80",
  paletas: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&q=80",
  macarons: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&q=80",
  cakepops: "https://images.unsplash.com/photo-1612203985729-70726954388c?w=600&q=80",
};

// --- Tipos de cookies (siempre en stock 24/7) -------------------------------
export const COOKIE_VARIETIES: CookieVariety[] = [
  {
    id: "cookie-vainilla",
    name: "Vainilla clásica",
    description: "Galleta de manteca y vainilla decorada con glasé real.",
    imageUrl: PLACEHOLDER.cookie,
    pricePerDozen: 6000,
    available: true,
  },
  {
    id: "cookie-chocolate",
    name: "Chocolate chips",
    description: "Cookie tierna con chips de chocolate semiamargo.",
    imageUrl: PLACEHOLDER.cookie2,
    pricePerDozen: 6500,
    available: true,
  },
  {
    id: "cookie-limon",
    name: "Limón",
    description: "Masa cítrica con glasé de limón natural.",
    imageUrl: PLACEHOLDER.cookie,
    pricePerDozen: 6500,
    available: true,
  },
  {
    id: "cookie-dulce-leche",
    name: "Rellena de dulce de leche",
    description: "Dos tapas unidas con dulce de leche repostero.",
    imageUrl: PLACEHOLDER.cookie2,
    pricePerDozen: 7500,
    available: true,
  },
  {
    id: "cookie-red-velvet",
    name: "Red velvet",
    description: "Cookie red velvet con chips de chocolate blanco.",
    imageUrl: PLACEHOLDER.cookie,
    pricePerDozen: 7500,
    available: true,
  },
  {
    id: "cookie-avena",
    name: "Avena y pasas",
    description: "Avena, pasas y un toque de canela. La más sanota.",
    imageUrl: PLACEHOLDER.cookie2,
    pricePerDozen: 6000,
    available: true,
  },
];

export const CATALOG: Product[] = [
  // ----- STOCK 24/7 ---------------------------------------------------------
  {
    id: "cookies",
    name: "Cookies",
    category: "cookies",
    kind: "stock",
    slug: "cookies",
    shortDescription: "Galletas artesanales, siempre frescas y disponibles",
    description:
      "Nuestras cookies se hornean a diario y están SIEMPRE disponibles, sin necesidad de encargo previo. Elegí entre nuestras variedades de sabores. Se venden por docena.",
    imageUrl: PLACEHOLDER.cookie,
    hoverImageUrl: PLACEHOLDER.cookie2,
    leadingFeatures: [
      "Siempre disponibles · 24/7",
      "Recién horneadas",
      "Varias variedades de sabor",
      "Por docena (mínimo 1 docena)",
    ],
    leadTime: { type: "stock" },
    requiresDeposit: false,
    available: true,
    sortOrder: 1,
    varieties: COOKIE_VARIETIES,
    unitLabel: "docena",
    unitPrice: 6000,
    minQty: 1,
  },
  {
    id: "brownies",
    name: "Brownies",
    category: "brownies",
    kind: "stock",
    slug: "brownies",
    shortDescription: "Brownies húmedos de chocolate, siempre disponibles",
    description:
      "Brownies intensos de chocolate, húmedos por dentro. Al igual que las cookies, están SIEMPRE disponibles sin encargo previo. Se venden por docena.",
    imageUrl: PLACEHOLDER.brownie,
    hoverImageUrl: PLACEHOLDER.brownie2,
    leadingFeatures: [
      "Siempre disponibles · 24/7",
      "Chocolate intenso",
      "Húmedos por dentro",
      "Por docena",
    ],
    leadTime: { type: "stock" },
    requiresDeposit: false,
    available: true,
    sortOrder: 2,
    unitLabel: "docena",
    unitPrice: 9500,
    minQty: 1,
  },

  // ----- STANDARD (a pedido, 48 h) -----------------------------------------
  {
    id: "porciones",
    name: "Porciones de torta",
    category: "porciones",
    kind: "standard",
    slug: "porciones",
    shortDescription: "Porciones individuales de tortas de autor",
    description:
      "Porciones de tortas de autor con rellenos artesanales y decoración individual. Ideal para regalar o eventos íntimos. Se preparan a pedido con 48 hs de anticipación.",
    imageUrl: PLACEHOLDER.porcion,
    hoverImageUrl: PLACEHOLDER.porcion2,
    leadingFeatures: [
      "Rellenos artesanales",
      "Decoración individual",
      "Mínimo 6 unidades",
      "Listo en 48 hs",
    ],
    leadTime: { type: "leadHours", hours: LEAD_STANDARD_HOURS },
    requiresDeposit: false,
    available: true,
    sortOrder: 3,
    sizes: [
      { key: "s", label: "Set 6", portions: "6 porciones individuales", price: 19000 },
      { key: "m", label: "Set 12", portions: "12 porciones individuales", price: 36000 },
      { key: "l", label: "Set 18", portions: "18 porciones individuales", price: 52000 },
      { key: "xl", label: "Set 24", portions: "24 porciones individuales", price: 68000 },
    ],
  },
  {
    id: "torta-lemon-pie",
    name: "Lemon Pie",
    category: "torta-estandar",
    kind: "standard",
    slug: "lemon-pie",
    shortDescription: "Clásico lemon pie con merengue italiano",
    description:
      "Base crocante, crema de limón y merengue italiano flambeado. Una de nuestras tortas estandarizadas: receta fija, lista en 48 hs. Requiere seña del 50%.",
    imageUrl: PLACEHOLDER.lemon,
    hoverImageUrl: PLACEHOLDER.torta2,
    leadingFeatures: ["Receta clásica", "Merengue italiano", "Lista en 48 hs", "Seña 50%"],
    leadTime: { type: "leadHours", hours: LEAD_STANDARD_HOURS },
    requiresDeposit: true,
    available: true,
    sortOrder: 4,
    sizes: [
      { key: "s", label: "Chica", portions: "8 porciones", price: 22000 },
      { key: "m", label: "Mediana", portions: "12 porciones", price: 30000 },
      { key: "l", label: "Grande", portions: "16 porciones", price: 40000 },
    ],
  },
  {
    id: "torta-brownie",
    name: "Torta Brownie",
    category: "torta-estandar",
    kind: "standard",
    slug: "torta-brownie",
    shortDescription: "Torta húmeda de brownie y ganache",
    description:
      "Capas de brownie intenso con ganache de chocolate. Torta estandarizada de receta fija, lista en 48 hs. Requiere seña del 50%.",
    imageUrl: PLACEHOLDER.chocotorta,
    hoverImageUrl: PLACEHOLDER.torta,
    leadingFeatures: ["Chocolate intenso", "Ganache", "Lista en 48 hs", "Seña 50%"],
    leadTime: { type: "leadHours", hours: LEAD_STANDARD_HOURS },
    requiresDeposit: true,
    available: true,
    sortOrder: 5,
    sizes: [
      { key: "s", label: "Chica", portions: "8 porciones", price: 24000 },
      { key: "m", label: "Mediana", portions: "12 porciones", price: 33000 },
      { key: "l", label: "Grande", portions: "16 porciones", price: 44000 },
    ],
  },
  {
    id: "torta-cheesecake",
    name: "Cheesecake",
    category: "torta-estandar",
    kind: "standard",
    slug: "cheesecake",
    shortDescription: "Cheesecake cremoso con coulis de frutos rojos",
    description:
      "Cheesecake horneado, cremoso, con coulis de frutos rojos. Torta estandarizada, lista en 48 hs. Requiere seña del 50%.",
    imageUrl: PLACEHOLDER.cheesecake,
    hoverImageUrl: PLACEHOLDER.torta2,
    leadingFeatures: ["Cremoso", "Frutos rojos", "Lista en 48 hs", "Seña 50%"],
    leadTime: { type: "leadHours", hours: LEAD_STANDARD_HOURS },
    requiresDeposit: true,
    available: true,
    sortOrder: 6,
    sizes: [
      { key: "s", label: "Chica", portions: "8 porciones", price: 26000 },
      { key: "m", label: "Mediana", portions: "12 porciones", price: 35000 },
      { key: "l", label: "Grande", portions: "16 porciones", price: 46000 },
    ],
  },

  // ----- CUSTOM (torta personalizada, 5 días) ------------------------------
  {
    id: "torta-personalizada",
    name: "Torta personalizada",
    category: "torta-personalizada",
    kind: "custom",
    slug: "torta-personalizada",
    shortDescription: "Diseñá tu torta: tamaño, relleno y decoración",
    description:
      "Tu torta a medida. Elegí el tamaño, el relleno y el nivel de decoración. Se elabora completamente a pedido con 5 días de anticipación. Requiere seña del 50% para confirmar.",
    imageUrl: PLACEHOLDER.torta,
    hoverImageUrl: PLACEHOLDER.torta2,
    leadingFeatures: [
      "100% a tu medida",
      "Relleno y decoración a elección",
      "Lista en 5 días",
      "Seña 50%",
    ],
    leadTime: { type: "leadHours", hours: LEAD_CUSTOM_HOURS },
    requiresDeposit: true,
    available: true,
    sortOrder: 7,
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
  },

  // ----- CAJAS (a pedido, 48 h) --------------------------------------------
  {
    id: "cajas",
    name: "Cajas regalo",
    category: "cajas",
    kind: "standard",
    slug: "cajas",
    shortDescription: "Cajas curadas de cookies y porciones para regalar",
    description:
      "Cajas regalo con selección de cookies y porciones, packaging premium y tarjeta personalizada. Se preparan a pedido con 48 hs de anticipación.",
    imageUrl: PLACEHOLDER.caja,
    hoverImageUrl: PLACEHOLDER.caja2,
    leadingFeatures: [
      "Packaging premium",
      "Tarjeta personalizada",
      "Mix de sabores",
      "Listo en 48 hs",
    ],
    leadTime: { type: "leadHours", hours: LEAD_STANDARD_HOURS },
    requiresDeposit: false,
    available: true,
    sortOrder: 8,
    sizes: [
      { key: "s", label: "Caja Mini", portions: "6 cookies decoradas", price: 10000 },
      { key: "m", label: "Caja Clásica", portions: "12 cookies decoradas", price: 18000 },
      { key: "l", label: "Caja Especial", portions: "6 cookies + 4 porciones", price: 28000 },
      { key: "xl", label: "Caja Premium", portions: "12 cookies + 6 porciones", price: 45000 },
    ],
  },

  // ----- MESA DULCE (addons) -----------------------------------------------
  {
    id: "paletas",
    name: "Paletas de Chocolate",
    category: "mesa-dulce",
    kind: "addon",
    slug: "paletas",
    shortDescription: "Paletas de chocolate artesanal decoradas",
    description:
      "Paletas de chocolate artesanal con decoración personalizada, perfectas para recuerdos y souvenirs.",
    imageUrl: PLACEHOLDER.paletas,
    hoverImageUrl: PLACEHOLDER.paletas,
    leadingFeatures: ["Chocolate artesanal", "Decoración personalizada"],
    leadTime: { type: "leadHours", hours: LEAD_STANDARD_HOURS },
    requiresDeposit: false,
    available: true,
    sortOrder: 9,
    unitLabel: "unidad",
    unitPrice: 4500,
    minQty: 6,
  },
  {
    id: "macarons",
    name: "Macarons",
    category: "mesa-dulce",
    kind: "addon",
    slug: "macarons",
    shortDescription: "Macarons artesanales con ganache de sabores",
    description:
      "Macarons artesanales con ganache de sabores, decorados para combinar con cookies o porciones.",
    imageUrl: PLACEHOLDER.macarons,
    hoverImageUrl: PLACEHOLDER.macarons,
    leadingFeatures: ["Ganache de sabores", "Ideal mesa dulce"],
    leadTime: { type: "leadHours", hours: LEAD_STANDARD_HOURS },
    requiresDeposit: false,
    available: true,
    sortOrder: 10,
    unitLabel: "unidad",
    unitPrice: 2500,
    minQty: 12,
  },
  {
    id: "cake-pops",
    name: "Cake Pops",
    category: "mesa-dulce",
    kind: "addon",
    slug: "cake-pops",
    shortDescription: "Bocados de torta bañados en chocolate",
    description:
      "Cake pops de bizcochuelo y dulce de leche bañados en chocolate y decorados a tono con tu evento.",
    imageUrl: PLACEHOLDER.cakepops,
    hoverImageUrl: PLACEHOLDER.cakepops,
    leadingFeatures: ["Bocado individual", "Decoración a tono"],
    leadTime: { type: "leadHours", hours: LEAD_STANDARD_HOURS },
    requiresDeposit: false,
    available: true,
    sortOrder: 11,
    unitLabel: "unidad",
    unitPrice: 3000,
    minQty: 6,
  },
];

// Vistas derivadas (compatibilidad y conveniencia)
export const ADDON_PRODUCTS = CATALOG.filter(
  (p): p is AddonProduct => p.kind === "addon"
);

// ============================================================================
// FECHAS ESPECIALES (se calculan a la próxima ocurrencia en lib/data)
// ============================================================================

export interface SpecialDateDef {
  id: string;
  month: number; // 1-12
  day: number; // 1-31
  title: string;
  includes: string; // qué se ofrece ese día
  badge: string; // etiqueta corta
  color: string; // hex para el dot/badge
  ctaProductSlug?: string;
}

export const SPECIAL_DATE_DEFS: SpecialDateDef[] = [
  {
    id: "revolucion-mayo",
    month: 5,
    day: 25,
    title: "Día de la Revolución de Mayo",
    includes: "Pastelitos patrios y cookies con temática patria.",
    badge: "Fecha patria",
    color: "#6CA7D4",
    ctaProductSlug: "cookies",
  },
  {
    id: "dia-bandera",
    month: 6,
    day: 20,
    title: "Día de la Bandera",
    includes: "Pastelitos patrios y cajas celeste y blanco.",
    badge: "Fecha patria",
    color: "#6CA7D4",
    ctaProductSlug: "cajas",
  },
  {
    id: "dia-independencia",
    month: 7,
    day: 9,
    title: "Día de la Independencia",
    includes: "Pastelitos patrios y cookies temáticas.",
    badge: "Fecha patria",
    color: "#6CA7D4",
    ctaProductSlug: "cookies",
  },
  {
    id: "dia-amigo",
    month: 7,
    day: 20,
    title: "Día del Amigo",
    includes: "Cajas para regalar y cookies personalizadas.",
    badge: "Para regalar",
    color: "#E8A23D",
    ctaProductSlug: "cajas",
  },
  {
    id: "navidad",
    month: 12,
    day: 25,
    title: "Navidad",
    includes: "Cajas navideñas, cookies temáticas y mesa dulce.",
    badge: "Navidad",
    color: "#C0533F",
    ctaProductSlug: "cajas",
  },
  {
    id: "san-valentin",
    month: 2,
    day: 14,
    title: "San Valentín",
    includes: "Cajas románticas y cookies con corazones.",
    badge: "San Valentín",
    color: "#E8849B",
    ctaProductSlug: "cajas",
  },
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
  {
    id: "t1",
    name: "Sofía L.",
    neighborhood: "Palermo",
    text: "Pedí cookies para el cumpleaños de mi nena y fueron la estrella de la fiesta. El nivel de detalle es increíble, cada una era una obra de arte. Ya encargué las de Navidad.",
    stars: 5,
    imageUrl: PLACEHOLDER.cookie,
    occasion: "Cumpleaños infantil",
    productType: "Cookies",
  },
  {
    id: "t2",
    name: "Valentina M.",
    neighborhood: "Recoleta",
    text: "Regalé una caja especial para un baby shower y la mamá lloró de la emoción. El packaging es hermoso y las cookies adentro todavía más. 100% recomendable.",
    stars: 5,
    imageUrl: PLACEHOLDER.caja,
    occasion: "Baby shower",
    productType: "Caja Especial",
  },
  {
    id: "t3",
    name: "Camila R.",
    neighborhood: "San Isidro",
    text: "Encargué una torta personalizada para el cumpleaños de mi mamá y superó todas las expectativas. Riquísima, presentación impecable y la entrega puntual. Ya somos clientas fijas.",
    stars: 5,
    imageUrl: PLACEHOLDER.torta,
    occasion: "Cumpleaños familiar",
    productType: "Torta personalizada",
  },
];

export const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "¿Qué productos están siempre disponibles?",
    answer:
      "Las cookies y los brownies están siempre en stock (24/7): podés pedirlos sin anticipación. El resto de los productos se elabora a pedido.",
  },
  {
    id: "faq-2",
    question: "¿Con cuánta anticipación debo encargar una torta?",
    answer:
      "Las tortas estandarizadas (lemon pie, torta brownie, cheesecake, etc.) se preparan en 48 hs. Las tortas personalizadas requieren 5 días de anticipación. Porciones y cajas, 48 hs.",
  },
  {
    id: "faq-3",
    question: "¿Cómo es la seña de las tortas?",
    answer:
      "Todas las tortas (estandarizadas y personalizadas) requieren una seña del 50% para confirmar el pedido. El pedido NO queda confirmado hasta que la seña esté abonada. El saldo se paga antes de la entrega.",
  },
  {
    id: "faq-4",
    question: "¿Hacen envío o solo retiro?",
    answer:
      "Podés retirar por el local sin costo, o pedir envío a domicilio. El envío se hace a través de plataformas como Rappi o Uber; ante cualquier inconveniente durante el envío, la pastelería no se hace responsable, ya que el traslado lo realiza un tercero.",
  },
  {
    id: "faq-5",
    question: "¿Puedo personalizar el diseño de mi torta?",
    answer:
      "¡Sí! En la torta personalizada elegís tamaño, relleno y nivel de decoración. Podés enviarnos imágenes de referencia por WhatsApp para que capturemos tu idea.",
  },
  {
    id: "faq-6",
    question: "¿Qué rellenos tienen las tortas personalizadas?",
    answer:
      "Dulce de leche, chocolate/ganache, frutos rojos, maracuyá y tres leches. Algunos rellenos tienen un pequeño recargo. La decoración puede ser simple, temática o premium.",
  },
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
