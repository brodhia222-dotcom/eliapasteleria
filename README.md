# Elia Pastelería — Sitio Web

Sitio web para pastelería artesanal especializada en **cookies decoradas y porciones de torta**. Construido como demo/plantilla por [BrodhIA](https://github.com/FedericoDiTata).

---

## Stack técnico

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 16.2.4 | Framework (App Router) |
| React | 19.2.4 | UI |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Estilos (design tokens en `globals.css`) |
| Framer Motion | 12.x | Animaciones (scroll, entrada, hover) |
| Zustand | 5.x | Estado global (formulario de encargo) |
| canvas-confetti | 1.9.x | Efecto celebración al completar encargo |

---

## Correr en desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

```bash
npm run build   # build de producción
npm run start   # servidor de producción local
```

---

## Identidad visual

| Token | Valor | Uso |
|---|---|---|
| `teal` | `#00B2A9` | Acento principal (extraído del logo) |
| `teal-d` | `#008E86` | Hover / estado oscuro |
| `cream` | `#FAFAF7` | Fondo principal |
| `cream-deep` | `#F0EDE8` | Fondo secciones alternadas |
| `ink` | `#1A1A1A` | Texto principal |
| `surface` | `#FFFFFF` | Fondo de cards |

**Fuentes:** Cormorant Garamond (display) · DM Sans (body) · Great Vibes (accent)

Para cambiar la paleta completa del sitio: editar `app/globals.css` → bloque `@theme inline {}`.

---

## Estructura del proyecto

```
elia-pasteleria/
├── app/
│   ├── page.tsx                # Home
│   ├── layout.tsx              # Layout raíz (Navbar + Footer + fuentes)
│   ├── globals.css             # Design tokens + keyframes globales
│   ├── galeria/page.tsx        # Galería con marquee infinito
│   ├── productos/              # Catálogo de cookies y porciones
│   │   ├── page.tsx
│   │   └── [categoria]/page.tsx  # cookies / porciones / cajas
│   ├── encargo/                # Formulario multi-step de pedido
│   │   ├── page.tsx
│   │   └── components/
│   ├── nosotras/page.tsx       # Sobre mí
│   ├── preguntas/page.tsx      # FAQ
│   ├── mesa-dulce/page.tsx     # Adicionales
│   └── admin/page.tsx          # Panel de fechas bloqueadas
│
├── components/
│   ├── home/                   # Secciones de la home
│   │   ├── Hero.tsx            # Slideshow automático (5 slides, Ken Burns)
│   │   ├── FeaturedProducts.tsx
│   │   ├── HowItWorks.tsx      # 3 pasos animados
│   │   ├── Testimonials.tsx
│   │   └── HomeCTA.tsx
│   ├── layout/
│   │   ├── Navbar.tsx          # Transparente en hero, sólido en el resto
│   │   └── Footer.tsx
│   └── calendar/               # Calendario de encargos
│
└── lib/
    ├── mockData.ts             # ⭐ DATOS EDITABLES — ver abajo
    ├── store.ts                # Zustand store del formulario
    ├── calendarUtils.ts
    └── whatsappUtils.ts
```

---

## Cómo modificar el contenido

### Productos (cookies, porciones, cajas)
**Archivo:** `lib/mockData.ts` → array `CAKE_PRODUCTS`

```ts
{
  id: "cookies-1",
  name: "Cookies Decoradas",
  category: "cookies",           // "cookies" | "porciones" | "cajas"
  slug: "cookies",
  imageUrl: "https://...",
  hoverImageUrl: "https://...", // imagen que aparece en hover
  sizes: [
    { key: "s", label: "Media docena", portions: "6 cookies", price: 4800 },
  ],
  leadingFeatures: ["Royal icing pintado a mano", ...],
}
```

### Testimonios
**Archivo:** `lib/mockData.ts` → array `TESTIMONIALS`

### Preguntas frecuentes
**Archivo:** `lib/mockData.ts` → array `FAQ_ITEMS`

### Fechas bloqueadas en el calendario
**Archivo:** `lib/mockData.ts` → función `getBlockedDatesForDemo()`
También se pueden gestionar desde `/admin`.

### Fotos del slideshow (Hero)
**Archivo:** `components/home/Hero.tsx` → array `SLIDES`

### Fotos de la Galería
**Archivo:** `app/galeria/page.tsx` → arrays `ROW_1` y `ROW_2`

### Instagram y WhatsApp
- Instagram: `app/galeria/page.tsx` + `components/layout/Footer.tsx`
- WhatsApp: `app/nosotras/page.tsx` + `components/layout/Footer.tsx`

---

## Secciones del sitio

| Ruta | Descripción |
|---|---|
| `/` | Home completa |
| `/productos` | Catálogo de productos |
| `/productos/cookies` | Detalle cookies decoradas |
| `/productos/porciones` | Detalle porciones de torta |
| `/productos/cajas` | Detalle cajas regalo |
| `/galeria` | Galería con marquee infinito (3 filas) |
| `/encargo` | Formulario multi-step: fecha → datos → confirmación |
| `/nosotras` | Página "Sobre mí" |
| `/preguntas` | Preguntas frecuentes |
| `/admin` | Panel de gestión de fechas |
