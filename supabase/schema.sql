-- ============================================================================
-- Elia Pastelería — Esquema Supabase (Fase 2)
-- ----------------------------------------------------------------------------
-- Pegar y ejecutar en: Supabase → SQL Editor → New query → Run.
-- Define tablas + RLS. La pastelera (usuario autenticado) gestiona todo;
-- el público solo puede LEER catálogo/fechas e INSERTAR pedidos.
-- ============================================================================

-- Fechas bloqueadas (calendario) ---------------------------------------------
create table if not exists public.blocked_dates (
  id          uuid primary key default gen_random_uuid(),
  date        date not null unique,
  reason      text not null check (reason in ('admin','order')),
  order_id    uuid,
  created_at  timestamptz not null default now()
);

-- Fechas especiales (destacadas) ---------------------------------------------
create table if not exists public.special_dates (
  id                uuid primary key default gen_random_uuid(),
  date              date not null,
  title             text not null,
  includes          text not null,
  badge             text,
  color             text,
  cta_product_slug  text,
  active            boolean not null default true,
  created_at        timestamptz not null default now()
);

-- Catálogo de productos ------------------------------------------------------
create table if not exists public.products (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  name                text not null,
  short_description   text,
  description         text,
  category            text not null check (category in
                        ('cookies','brownies','porciones','torta-estandar',
                         'torta-personalizada','cajas','mesa-dulce')),
  kind                text not null check (kind in ('stock','standard','custom','addon')),
  image_url           text,
  hover_image_url     text,
  leading_features    text[] default '{}',
  lead_time_hours     int,            -- null = stock 24/7
  requires_deposit    boolean not null default false,
  unit_price          numeric,        -- stock/addon
  unit_label          text,
  min_qty             int default 1,
  sizes               jsonb default '[]'::jsonb,   -- ProductSize[]
  tiers               jsonb default '[]'::jsonb,   -- CakeTier[]
  filling_options     jsonb default '[]'::jsonb,   -- PricedOption[]
  decoration_options  jsonb default '[]'::jsonb,   -- PricedOption[]
  varieties           jsonb default '[]'::jsonb,   -- CookieVariety[]
  available           boolean not null default true,
  sort_order          int not null default 0
);

-- Disponibilidad / stock (override editable a diario) ------------------------
create table if not exists public.product_availability (
  product_id  uuid not null references public.products(id) on delete cascade,
  variety_id  text not null default '',   -- '' = el producto entero
  available   boolean not null default true,
  updated_at  timestamptz not null default now(),
  primary key (product_id, variety_id)
);

-- Pedidos --------------------------------------------------------------------
create table if not exists public.orders (
  id                            uuid primary key default gen_random_uuid(),
  delivery_date                 date not null,
  items                         jsonb not null,         -- OrderItem[]
  delivery_method               text not null check (delivery_method in ('pickup','shipping')),
  shipping_address              text,
  shipping_disclaimer_accepted  boolean,
  customer_name                 text not null,
  customer_phone                text not null,
  customer_neighborhood         text,
  customer_message              text,
  total                         numeric not null default 0,
  requires_deposit              boolean not null default false,
  deposit_amount                numeric not null default 0,
  deposit_status                text not null default 'pending' check (deposit_status in ('pending','paid')),
  status                        text not null default 'pending_deposit' check (status in
                                  ('draft','pending_deposit','confirmed','in_production',
                                   'ready','delivered','cancelled')),
  lead_time_hours_applied       int not null default 0,
  created_at                    timestamptz not null default now()
);

create index if not exists orders_delivery_date_idx on public.orders(delivery_date);
create index if not exists orders_status_idx on public.orders(status);

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.blocked_dates        enable row level security;
alter table public.special_dates        enable row level security;
alter table public.products             enable row level security;
alter table public.product_availability enable row level security;
alter table public.orders               enable row level security;

-- Lectura pública del catálogo y del calendario
create policy "public read blocked_dates"  on public.blocked_dates        for select using (true);
create policy "public read special_dates"  on public.special_dates        for select using (true);
create policy "public read products"       on public.products             for select using (true);
create policy "public read availability"   on public.product_availability for select using (true);

-- Escritura solo para la pastelera (usuario autenticado)
create policy "admin write blocked_dates"  on public.blocked_dates        for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write special_dates"  on public.special_dates        for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write products"       on public.products             for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write availability"   on public.product_availability for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Pedidos: cualquiera puede crear; solo la pastelera lee/edita.
-- (El alta real se hace desde el server con la service_role key, que saltea RLS.)
create policy "public insert orders" on public.orders for insert with check (true);
create policy "admin read orders"    on public.orders for select using (auth.role() = 'authenticated');
create policy "admin update orders"  on public.orders for update using (auth.role() = 'authenticated');
create policy "admin delete orders"  on public.orders for delete using (auth.role() = 'authenticated');
