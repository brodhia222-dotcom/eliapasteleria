# Elia Pastelería — Guía para Agentes IA

## Proyecto
Sitio web de pedidos para una pastelería artesanal. Los clientes encargan y a la
pastelera le llegan los pedidos; ella gestiona días disponibles y stock.
Stack: Next.js 16.2.4 · Tailwind CSS v4 · Framer Motion · GSAP · Zustand

> Esta versión de Next.js tiene breaking changes respecto al estándar. Leer `node_modules/next/dist/docs/` antes de escribir código nuevo.

## Estado por fases
- **Fase 1 (HECHA):** modelo de datos + UX, todo con datos mock y estado en
  `localStorage` (Zustand). Sin backend.
- **Fase 2 (PENDIENTE):** Supabase (Postgres + Auth) + Resend (emails). La capa
  `lib/data/*` está pensada para migrar sin tocar componentes. La seña del 50% se
  maneja como estado de pedido (`pending_deposit`), coordinación manual (sin MP).

## Arquitectura
- `app/` — Rutas (App Router). Cada carpeta = una página.
- `components/home/` — Secciones de la home (Hero, **SpecialDateBanner**, FeaturedProducts, HowItWorks, Testimonials, HomeCTA)
- `components/layout/` — Navbar, Footer, **MapEmbed** (iframe de Google Maps / placeholder)
- `components/calendar/` — Calendario (BookingCalendar, CalendarCell, CalendarHeader)
- `components/catalog/ProductCard.tsx` — card de producto reutilizable
- `app/encargo/` — Formulario multi-step (Step1Calendar → Step2Form → Step3Summary → SuccessScreen)
- `app/admin/` — Panel: pestañas Fechas / Fechas especiales / Stock

### Capa de datos (clave)
- `lib/mockData.ts` — **datos editables**: `CATALOG` (discriminated union por `kind`), `COOKIE_VARIETIES`, `SPECIAL_DATE_DEFS`, `TESTIMONIALS`, `FAQ_ITEMS`.
  - `kind`: `"stock"` (cookies/brownies 24/7) · `"standard"` (porciones, tortas clásicas, cajas, 48h) · `"custom"` (torta personalizada, 5 días, relleno+decoración) · `"addon"` (mesa dulce).
- `lib/data/{products,calendar,specialDates,stock,orders}.ts` — acceso a datos. Hoy leen mock; en Fase 2 leerán Supabase. Los componentes importan de acá, NO de mockData.
- `lib/orderTypes.ts` — tipos `Order` / `OrderItem` (forma final → tabla `orders`).
- `lib/orderUtils.ts` — arma `OrderItem[]`, total, seña y lead time desde la selección.
- `lib/pricing.ts` — `calcCustomCakePrice`, `calcDeposit`, `priceFrom`, `leadTimeLabel`, `formatARS`.
- `lib/store.ts` — Zustand: `useCalendarStore`, `useStockStore`, `useOrderStore`.
- `lib/siteConfig.ts` — datos del negocio (WhatsApp, email, dirección, `mapEmbedSrc`).
- `lib/whatsappUtils.ts` — `whatsappLink()` y `buildWhatsAppURL(order)`.

## Cómo modificar el contenido
| Qué | Dónde |
|---|---|
| Productos / precios / tamaños | `lib/mockData.ts` → `CATALOG` |
| Variedades de cookies | `lib/mockData.ts` → `COOKIE_VARIETIES` |
| Rellenos / decoración (torta personalizada) | `CATALOG` → producto `torta-personalizada` |
| Fechas especiales (qué incluye, color) | `lib/mockData.ts` → `SPECIAL_DATE_DEFS` |
| Testimonios / FAQ | `lib/mockData.ts` |
| WhatsApp / email / dirección / Google Maps | `lib/siteConfig.ts` |
| Fechas bloqueadas demo | `lib/mockData.ts` → `getBlockedDatesForDemo()` |
| Fotos del hero | `components/home/Hero.tsx` → `SLIDES` |

## Reglas de negocio
- Cookies y brownies: **siempre disponibles** (`kind: "stock"`, sin seña, sin demora).
- Tortas (estándar y personalizada): **seña 50%** (`requiresDeposit`), pedido `pending_deposit` hasta abonarla.
- Demoras: estándar 48h, personalizada 120h (5 días). El calendario las valida vía `meetsLeadTime` / `minLeadHours`.
- Entrega: retiro (sin costo) o envío (disclaimer obligatorio: la pastelería no se responsabiliza por el envío de terceros).

## Design tokens (app/globals.css)
- Acento: `teal` (#00B2A9). Fondo `cream` / `cream-deep`. `sage` (#7A9A82) = disponible. `ink` / `ink-muted` texto.
- Fuentes: Cormorant Garamond (display) · DM Sans (body) · Great Vibes (accent)

## Rutas
| Ruta | Descripción |
|---|---|
| `/` | Home (con banner de próxima fecha especial) |
| `/productos` | Catálogo completo agrupado por categoría |
| `/productos/[slug]` | Detalle por producto (variedades / tamaños / personalización) |
| `/tortas` | Tortas clásicas (48h) + personalizada (5 días) |
| `/mesa-dulce` | Addons |
| `/encargo` | Formulario multi-step (acepta `?producto=<slug>`) |
| `/galeria`, `/nosotras`, `/preguntas` | — |
| `/admin` | Panel: fechas, fechas especiales, stock |

## Reglas de diseño (BrodhIA)
Ver `C:\Users\feded\.claude\projects\C--Users-feded\memory\feedback_design_principles.md`
