# Elia Pastelería — Guía para Agentes IA

## Proyecto
Sitio web para pastelería artesanal especializada en **cookies decoradas y porciones de torta**.
Stack: Next.js 16.2.4 · Tailwind CSS v4 · Framer Motion · Zustand

> Esta versión de Next.js tiene breaking changes respecto al estándar. Leer `node_modules/next/dist/docs/` antes de escribir código nuevo.

## Arquitectura
- `app/` — Rutas (Next.js App Router). Cada carpeta = una página.
- `components/home/` — Secciones de la home (Hero, FeaturedProducts, HowItWorks, Testimonials, HomeCTA)
- `components/layout/` — Navbar + Footer
- `components/calendar/` — Componentes del calendario de encargos
- `lib/mockData.ts` — **TODOS los datos editables del sitio** (productos, testimonios, FAQ, fechas)
- `lib/store.ts` — Zustand store (estado del formulario multi-step)
- `app/encargo/` — Formulario de pedido (Step1Calendar → Step2Form → Step3Summary → SuccessScreen)
- `app/admin/` — Panel para gestionar fechas bloqueadas

## Cómo modificar el contenido
| Qué | Dónde |
|---|---|
| Productos (nombre, precio, fotos) | `lib/mockData.ts` → `CAKE_PRODUCTS` |
| Testimonios | `lib/mockData.ts` → `TESTIMONIALS` |
| Preguntas frecuentes | `lib/mockData.ts` → `FAQ_ITEMS` |
| Fechas bloqueadas | `lib/mockData.ts` → `getBlockedDatesForDemo()` |
| Fotos del hero (slideshow) | `components/home/Hero.tsx` → `SLIDES` |
| Fotos de la galería | `app/galeria/page.tsx` → `ROW_1`, `ROW_2` |
| Instagram | `app/galeria/page.tsx` + `components/layout/Footer.tsx` |
| WhatsApp | `app/nosotras/page.tsx` + `components/layout/Footer.tsx` |

## Design tokens (app/globals.css)
- Acento principal: `teal` (#00B2A9) — extraído del logo
- Fuentes: Cormorant Garamond (display) · DM Sans (body) · Great Vibes (accent)
- Fondo: `cream` (#FAFAF7) · Secciones alternadas: `cream-deep` (#F0EDE8)

## Rutas del sitio
| Ruta | Descripción |
|---|---|
| `/` | Home |
| `/productos` | Catálogo de productos |
| `/productos/[categoria]` | Detalle (cookies / porciones / cajas) |
| `/galeria` | Galería marquee infinito |
| `/encargo` | Formulario multi-step de pedido |
| `/nosotras` | Sobre mí |
| `/preguntas` | FAQ |
| `/admin` | Panel de fechas |

## Reglas de diseño (BrodhIA)
Ver `C:\Users\feded\.claude\projects\C--Users-feded\memory\feedback_design_principles.md`
