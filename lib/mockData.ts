export type ProductCategory = "cookies" | "porciones" | "cajas";
export type SizeKey = "s" | "m" | "l" | "xl";

export interface CakeSize {
  key: SizeKey;
  label: string;
  portions: string;
  price: number;
}

export interface CakeProduct {
  id: string;
  name: string;
  category: ProductCategory;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  hoverImageUrl: string;
  sizes: CakeSize[];
  leadingFeatures: string[];
}

export interface AddonProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  unitLabel: string;
  unitPrice: number;
  minQty: number;
}

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

export const CAKE_PRODUCTS: CakeProduct[] = [
  {
    id: "cookies-1",
    name: "Cookies Decoradas",
    category: "cookies",
    slug: "cookies",
    shortDescription: "Galletas de manteca pintadas a mano con glasé real",
    description:
      "Galletas de manteca artesanales decoradas con glasé real (royal icing) pintado a mano. Disponibles en diseños básicos, temáticos o premium con pintura detallada. Perfectas para cumpleaños, baby showers, casamientos y cualquier celebración.",
    imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80",
    hoverImageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80",
    sizes: [
      { key: "s", label: "Básica", portions: "Diseño 1 color · por docena", price: 6000 },
      { key: "m", label: "Temática", portions: "Diseño temático · por docena", price: 9000 },
      { key: "l", label: "Premium", portions: "Pintadas a mano · por docena", price: 13000 },
      { key: "xl", label: "Premium XL", portions: "Detalle máximo · por docena", price: 18000 },
    ],
    leadingFeatures: [
      "Glasé real artesanal",
      "Pintadas a mano",
      "Diseños 100% personalizables",
      "Mínimo 1 docena",
    ],
  },
  {
    id: "porciones-1",
    name: "Porciones de Torta",
    category: "porciones",
    slug: "porciones",
    shortDescription: "Porciones individuales de tortas de autor decoradas",
    description:
      "Porciones de tortas de autor con rellenos artesanales y decoración individual. Cada porción es única, elaborada con los mismos cuidados que una torta entera. Ideal para regalar, eventos íntimos o cuando querés variedad sin encargar una torta completa.",
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
    hoverImageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    sizes: [
      { key: "s", label: "Set 6", portions: "6 porciones individuales", price: 19000 },
      { key: "m", label: "Set 12", portions: "12 porciones individuales", price: 36000 },
      { key: "l", label: "Set 18", portions: "18 porciones individuales", price: 52000 },
      { key: "xl", label: "Set 24", portions: "24 porciones individuales", price: 68000 },
    ],
    leadingFeatures: [
      "Rellenos artesanales a elección",
      "Decoración individual por porción",
      "Mínimo 6 unidades",
      "Sabores mixtos disponibles",
    ],
  },
  {
    id: "cajas-1",
    name: "Cajas Especiales",
    category: "cajas",
    slug: "cajas",
    shortDescription: "Cajas curadas de cookies y porciones para regalar",
    description:
      "Cajas regalo armadas con la mejor selección de cookies decoradas y porciones de torta. Diseñadas para impresionar: con packaging premium, cinta y tarjeta personalizada. El regalo perfecto para cualquier ocasión.",
    imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",
    hoverImageUrl: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=80",
    sizes: [
      { key: "s", label: "Caja Mini", portions: "6 cookies decoradas", price: 10000 },
      { key: "m", label: "Caja Clásica", portions: "12 cookies decoradas", price: 18000 },
      { key: "l", label: "Caja Especial", portions: "6 cookies + 4 porciones", price: 28000 },
      { key: "xl", label: "Caja Premium", portions: "12 cookies + 6 porciones", price: 45000 },
    ],
    leadingFeatures: [
      "Packaging premium incluido",
      "Tarjeta personalizada",
      "Mix de sabores a elección",
      "Ideal para regalar",
    ],
  },
];

export const ADDON_PRODUCTS: AddonProduct[] = [
  {
    id: "paletas",
    name: "Paletas de Chocolate",
    description: "Paletas de chocolate artesanal con decoración personalizada, perfectas para recuerdos y souvenirs.",
    imageUrl: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&q=80",
    unitLabel: "unidad",
    unitPrice: 4500,
    minQty: 6,
  },
  {
    id: "macarons",
    name: "Macarons",
    description: "Macarons artesanales con ganache de sabores, decorados para combinar con cookies o porciones.",
    imageUrl: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&q=80",
    unitLabel: "unidad",
    unitPrice: 2500,
    minQty: 12,
  },
  {
    id: "brownies",
    name: "Brownies Decorados",
    description: "Brownies húmedos con cobertura de glasé decorativa, personalizables por docena.",
    imageUrl: "https://images.unsplash.com/photo-1607920592519-bab4d4db3a2e?w=600&q=80",
    unitLabel: "docena",
    unitPrice: 9500,
    minQty: 1,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Sofía L.",
    neighborhood: "Palermo",
    text: "Pedí cookies para el cumpleaños de mi nena y fueron la estrella de la fiesta. El nivel de detalle es increíble, cada una era una obra de arte. Ya encargué las de Navidad.",
    stars: 5,
    imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
    occasion: "Cumpleaños infantil",
    productType: "Cookies Premium",
  },
  {
    id: "t2",
    name: "Valentina M.",
    neighborhood: "Recoleta",
    text: "Regalé una caja especial para un baby shower y la mamá lloró de la emoción. El packaging es hermoso y las cookies adentro todavía más. 100% recomendable.",
    stars: 5,
    imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80",
    occasion: "Baby shower",
    productType: "Caja Especial",
  },
  {
    id: "t3",
    name: "Camila R.",
    neighborhood: "San Isidro",
    text: "Encargué porciones para el cumpleaños de mi mamá y superaron todas las expectativas. Riquísimas, presentación impecable y la entrega puntual. Ya somos clientas fijas.",
    stars: 5,
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80",
    occasion: "Cumpleaños familiar",
    productType: "Porciones de Torta",
  },
];

export const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "¿Con cuánta anticipación debo hacer el pedido?",
    answer:
      "Para cookies decoradas y porciones, necesito un mínimo de 5 días de anticipación. Para cajas especiales con diseños elaborados, el mínimo es 7 días. En fechas especiales (Navidad, San Valentín, etc.) se recomienda reservar con 15 días.",
  },
  {
    id: "faq-2",
    question: "¿Cuál es la cantidad mínima de cookies?",
    answer:
      "El pedido mínimo es de 1 docena (12 cookies). Para cookies temáticas o premium, el mínimo es el mismo pero el precio varía según el nivel de detalle. Las cajas regalo no tienen mínimo de docenas, ya que son unidades cerradas.",
  },
  {
    id: "faq-3",
    question: "¿Hacen delivery o solo retiro?",
    answer:
      "Ofrecemos ambas opciones. El retiro es sin costo adicional. El delivery tiene un costo según la zona y distancia. Coordinamos los detalles por WhatsApp una vez confirmado el pedido.",
  },
  {
    id: "faq-4",
    question: "¿Puedo traer una imagen de referencia para el diseño?",
    answer:
      "¡Sí, es fundamental! Cuanto más detalle nos des sobre el diseño que imaginás, mejor podemos capturar tu visión. Podés enviar referencias por WhatsApp o subirlas en el formulario de encargo.",
  },
  {
    id: "faq-5",
    question: "¿Cómo se hace el pago?",
    answer:
      "Solicitamos una seña del 50% para confirmar la fecha en el calendario. El saldo restante se abona antes de la entrega. Aceptamos Mercado Pago, transferencia bancaria y efectivo.",
  },
  {
    id: "faq-6",
    question: "¿Qué sabores de relleno tienen las porciones?",
    answer:
      "Trabajamos con una variedad de rellenos: dulce de leche, chocolate, maracuyá, frutos rojos, vainilla y limón. También podemos hacer combinaciones. Consultamos tus preferencias al confirmar el pedido.",
  },
];

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
