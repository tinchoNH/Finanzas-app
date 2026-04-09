-- ============================================
-- SCHEMA - App Finanzas Personales
-- Ejecutar en Supabase → SQL Editor
-- ============================================

-- USUARIOS (usa auth de Supabase)
create table if not exists usuarios (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  nombre text not null,
  created_at timestamp with time zone default now()
);

-- CATEGORÍAS
create table if not exists categorias (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  icono text default '📦',
  color text default '#64748b',
  orden int default 0,
  activa boolean default true,
  created_at timestamp with time zone default now()
);

-- SUBCATEGORÍAS
create table if not exists subcategorias (
  id uuid default gen_random_uuid() primary key,
  categoria_id uuid references categorias(id) on delete cascade not null,
  nombre text not null,
  created_at timestamp with time zone default now()
);

-- TARJETAS
create table if not exists tarjetas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references usuarios(id) on delete cascade not null,
  nombre text not null,
  tipo text default 'crédito',
  color text default '#0ea5e9',
  created_at timestamp with time zone default now()
);

-- GASTOS SIMPLES (sin cuotas)
create table if not exists gastos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references usuarios(id) on delete cascade not null,
  categoria_id uuid references categorias(id) not null,
  subcategoria_id uuid references subcategorias(id),
  monto numeric(12,2) not null,
  descripcion text not null,
  fecha date not null,
  mes text not null, -- formato "2026-03"
  tiene_vencimiento boolean default false,
  fecha_vencimiento date,
  pagado boolean default false,
  created_at timestamp with time zone default now()
);

-- GASTOS CON CUOTAS (tarjetas)
create table if not exists gastos_cuotas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references usuarios(id) on delete cascade not null,
  tarjeta_id uuid references tarjetas(id) on delete cascade not null,
  descripcion text not null,
  monto_total numeric(12,2) not null,
  cantidad_cuotas int not null default 1,
  monto_cuota numeric(12,2) not null,
  mes_inicio text not null, -- formato "2026-01"
  activo boolean default true,
  created_at timestamp with time zone default now()
);

-- PAGOS DE TARJETAS
create table if not exists pagos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references usuarios(id) on delete cascade not null,
  tarjeta_id uuid references tarjetas(id) on delete cascade not null,
  mes text not null, -- formato "2026-03"
  monto_pagado numeric(12,2) not null,
  fecha_pago date not null,
  notas text,
  created_at timestamp with time zone default now()
);

-- INGRESOS
create table if not exists ingresos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references usuarios(id) on delete cascade not null,
  tipo text not null, -- "Sueldo Tincho", "Sueldo Pau", "Extra"
  monto numeric(12,2) not null,
  fecha_esperada text not null, -- "1° del mes"
  mes text not null, -- "2026-03"
  recurrente boolean default true,
  created_at timestamp with time zone default now()
);

-- PRESUPUESTO MENSUAL
create table if not exists presupuesto_mensual (
  id uuid default gen_random_uuid() primary key,
  mes text not null,
  categoria_id uuid references categorias(id) on delete cascade not null,
  monto_presupuestado numeric(12,2) not null,
  created_at timestamp with time zone default now(),
  unique(mes, categoria_id)
);

-- DISTRIBUCIÓN DE INGRESOS (%)
create table if not exists distribucion_ingresos (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  porcentaje int not null,
  color text not null,
  orden int default 0,
  created_at timestamp with time zone default now()
);

-- DEUDAS
create table if not exists deudas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references usuarios(id) on delete cascade not null,
  nombre text not null,
  tipo text not null default 'cuotas', -- 'cuotas' o 'libre'
  monto_total numeric(12,2) not null,
  cuotas_total int, -- NULL si es libre
  interes_mensual numeric(5,2), -- % mensual, NULL si es libre
  monto_cuota numeric(12,2), -- monto fijo por cuota, NULL si es libre
  cuotas_detalle jsonb, -- array de montos por cuota [419971.92, 348987.47, ...]
  fecha_inicio date not null default now(),
  activa boolean default true,
  notas text,
  created_at timestamp with time zone default now()
);

-- HISTORIAL DE CAMBIOS
create table if not exists historial (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references usuarios(id) on delete cascade not null,
  tabla text not null,
  registro_id uuid not null,
  accion text not null, -- CREATE, UPDATE, DELETE
  cambios jsonb,
  created_at timestamp with time zone default now()
);

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Categorías base
insert into categorias (nombre, icono, color, orden) values
  ('Alimentación', '🛒', '#22c55e', 1),
  ('Vivienda', '🏠', '#38bdf8', 2),
  ('Transporte', '🚗', '#f59e0b', 3),
  ('Servicios', '⚡', '#a855f7', 4),
  ('Salud', '💊', '#ef4444', 5),
  ('Ocio', '🎭', '#ec4899', 6),
  ('Tarjetas', '💳', '#0ea5e9', 7)
on conflict do nothing;

-- Distribución de ingresos default
insert into distribucion_ingresos (nombre, porcentaje, color, orden) values
  ('Gastos fijos', 40, '#ef4444', 1),
  ('Tarjetas', 26, '#f59e0b', 2),
  ('Variables', 15, '#38bdf8', 3),
  ('Ahorro', 10, '#22c55e', 4),
  ('Libre', 9, '#a855f7', 5)
on conflict do nothing;

-- ============================================
-- RLS (Row Level Security)
-- ============================================
alter table usuarios enable row level security;
alter table gastos enable row level security;
alter table gastos_cuotas enable row level security;
alter table pagos enable row level security;
alter table ingresos enable row level security;
alter table tarjetas enable row level security;
alter table presupuesto_mensual enable row level security;
alter table deudas enable row level security;
alter table historial enable row level security;

-- Políticas: cada usuario solo ve sus datos
create policy "usuarios_propios" on gastos for all using (auth.uid() = user_id);
create policy "usuarios_propios" on gastos_cuotas for all using (auth.uid() = user_id);
create policy "usuarios_propios" on pagos for all using (auth.uid() = user_id);
create policy "usuarios_propios" on ingresos for all using (auth.uid() = user_id);
create policy "usuarios_propios" on tarjetas for all using (auth.uid() = user_id);
create policy "usuarios_propios" on deudas for all using (auth.uid() = user_id);
create policy "usuarios_propios" on historial for all using (auth.uid() = user_id);

-- Usuarios: solo puede ver/editar su propio registro
create policy "usuarios_propios" on usuarios for all using (auth.uid() = id);

-- Categorías y distribución son compartidas (sin RLS)
create policy "publico" on categorias for all using (true);
create policy "publico" on subcategorias for all using (true);
create policy "publico" on presupuesto_mensual for all using (true);
create policy "publico" on distribucion_ingresos for all using (true);
