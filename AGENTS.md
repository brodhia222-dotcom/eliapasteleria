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
- `components/layout/` — Navbar (con ícono de carrito), Footer, **MapEmbed**, **CartDrawer**
- `components/calendar/` — Calendario (BookingCalendar, CalendarCell, CalendarHeader)
- `components/catalog/CustomCakeModal.tsx` — modal de configuración de la torta personalizada
- `app/encargo/` — Checkout del carrito (Step1 fecha → Step2 datos/entrega → Step3 confirmar → SuccessScreen)
- `app/admin/` — Panel: pestañas Fechas / Fechas especiales / Stock

### Modelo y datos (clave)
- `lib/mockData.ts` — **datos editables**: `CATALOG` (lista plana de `CatalogItem`), `SPECIAL_DATE_DEFS`, `TESTIMONIALS`, `FAQ_ITEMS`.
  - `CatalogItem` = unión por `type`:
    - `"unit"` → cookies (cada variedad/sabor es un ítem) y brownies. 24/7, por docena, sin seña.
    - `"cake"` → torta clásica: se vende por **porción** (`slicePrice`) o **entera** (`sizes[]`). 48h, seña 50%.
    - `"custom"` → torta personalizada (`tiers` + `fillingOptions` + `decorationOptions`). 5 días, seña 50%.
  - `filter`: `"cookies" | "brownies" | "tortas"` (filtros del catálogo).
- `lib/cartStore.ts` — **carrito** (Zustand persist `elia-cart`): `CartLine[]`, `add/setQty/remove/clear`, `isOpen` (drawer) y helpers puros `cartTotal/cartDeposit/cartCount/cartRequiresDeposit/cartMaxLeadHours`.
- `lib/data/{products,calendar,specialDates,stock,orders}.ts` — acceso a datos. Hoy mock; Fase 2 = Supabase, sin tocar componentes.
- `lib/orderTypes.ts` — `Order` / `OrderItem` (forma final → tabla `orders`).
- `lib/orderUtils.ts` — `buildOrder(lines, customer)` arma el pedido desde el carrito.
- `lib/pricing.ts` — `calcCustomCakePrice`, `calcDeposit`, `priceFrom`, `leadTimeLabel`, `formatARS`.
- `lib/store.ts` — Zustand: `useCalendarStore`, `useStockStore` (por `itemId`), `useOrderStore` (solo datos cliente + entrega).
- `lib/siteConfig.ts` — datos del negocio (WhatsApp, email, dirección, `mapEmbedSrc`).
- `lib/whatsappUtils.ts` — `whatsappLink()` y `buildWhatsAppURL(order)`.

## Cómo modificar el contenido
| Qué | Dónde |
|---|---|
| Productos / variedades / precios / tamaños | `lib/mockData.ts` → `CATALOG` |
| Precio por porción y tamaños de torta | item `type:"cake"` (`slicePrice`, `sizes`) |
| Rellenos / decoración (torta personalizada) | item `type:"custom"` (`fillingOptions`, `decorationOptions`) |
| Fechas especiales (qué incluye, color) | `lib/mockData.ts` → `SPECIAL_DATE_DEFS` |
| Testimonios / FAQ | `lib/mockData.ts` |
| WhatsApp / email / dirección / Google Maps | `lib/siteConfig.ts` |
| Fotos del hero | `components/home/Hero.tsx` → `SLIDES` |

## Reglas de negocio
- Cookies y brownies: **siempre disponibles** (`type:"unit"`, sin seña, sin demora).
- Tortas (clásicas y personalizada): **seña 50%** (`requiresDeposit`), pedido `pending_deposit` hasta abonarla. La seña se calcula sobre el total de las tortas del carrito.
- Demoras: clásica 48h, personalizada 120h (5 días). El carrito calcula `cartMaxLeadHours` y el calendario lo valida vía `meetsLeadTime` / `minLeadHours`.
- Entrega: retiro (sin costo) o envío (disclaimer obligatorio: la pastelería no se responsabiliza por el envío de terceros).
- Sin pasarela de pago: el pedido se cierra y se coordina por WhatsApp.

## Design tokens (app/globals.css)
- Acento: `teal` (#00B2A9). Fondo `cream` / `cream-deep`. `sage` (#7A9A82) = disponible/24-7. `ink` / `ink-muted` texto.
- Fuentes: Cormorant Garamond (display) · DM Sans (body) · Great Vibes (accent)

## Rutas
| Ruta | Descripción |
|---|---|
| `/` | Home (con banner de próxima fecha especial) |
| `/productos` | Catálogo plano con filtros (Cookies/Brownies/Tortas) + agregar al carrito |
| `/encargo` | Checkout del carrito (fecha → datos/entrega → confirmar) |
| `/galeria`, `/nosotras`, `/preguntas` | — |
| `/admin` | Panel: fechas, fechas especiales, stock |
| `/tortas`, `/mesa-dulce`, `/productos/[slug]` | Redirigen a `/productos` (compat) |

## Reglas de diseño (BrodhIA)
Ver `C:\Users\feded\.claude\projects\C--Users-feded\memory\feedback_design_principles.md`
