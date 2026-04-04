-- ============================================
-- MIGRACIÓN: RLS compartido + usuarios + tarjetas + ingresos
-- Ejecutar en Supabase → SQL Editor
-- ============================================

-- 1. Trigger para auto-crear usuario en tabla 'usuarios' al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.usuarios (id, email, nombre)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Insertar usuarios existentes en auth.users que no estén en la tabla
insert into public.usuarios (id, email, nombre)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'nombre', split_part(email, '@', 1))
from auth.users
on conflict (id) do nothing;

-- 3. Habilitar RLS en usuarios también
alter table usuarios enable row level security;

-- 4. Eliminar políticas restrictivas anteriores (una a la vez por si alguna no existe)
drop policy if exists "usuarios_propios" on gastos;
drop policy if exists "usuarios_propios" on gastos_cuotas;
drop policy if exists "usuarios_propios" on pagos;
drop policy if exists "usuarios_propios" on ingresos;
drop policy if exists "usuarios_propios" on tarjetas;
drop policy if exists "usuarios_propios" on historial;
drop policy if exists "auth_compartido" on gastos;
drop policy if exists "auth_compartido" on gastos_cuotas;
drop policy if exists "auth_compartido" on pagos;
drop policy if exists "auth_compartido" on ingresos;
drop policy if exists "auth_compartido" on tarjetas;
drop policy if exists "auth_compartido" on historial;
drop policy if exists "auth_compartido" on usuarios;

-- 5. Crear políticas compartidas: cualquier usuario autenticado ve y modifica todo
create policy "auth_compartido" on gastos
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth_compartido" on gastos_cuotas
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth_compartido" on pagos
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth_compartido" on ingresos
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth_compartido" on tarjetas
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth_compartido" on historial
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth_compartido" on usuarios
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 6. Insertar las 5 tarjetas usando el primer usuario disponible
insert into tarjetas (user_id, nombre, tipo, color)
select
  u.id,
  t.nombre,
  'crédito',
  t.color
from
  (select id from usuarios limit 1) u
  cross join (values
    ('Cecopay',              '#0ea5e9'),
    ('Master Pau',           '#a855f7'),
    ('Master Tincho',        '#f59e0b'),
    ('Visa Pau',             '#22c55e'),
    ('Visa Tincho - Personal','#ef4444')
  ) as t(nombre, color)
where not exists (select 1 from tarjetas where nombre = t.nombre);

-- 7. Insertar ingresos recurrentes para el mes actual
-- (Ejecutar una vez; después se pueden agregar desde la app)
insert into ingresos (user_id, tipo, monto, fecha_esperada, mes, recurrente)
select
  (select id from usuarios limit 1),
  i.tipo,
  i.monto,
  i.fecha_esperada,
  to_char(now(), 'YYYY-MM'),
  true
from (values
  ('Sueldo Tincho', 180000::numeric, '1° del mes'),
  ('Sueldo Pau',    120000::numeric, '5° del mes')
) as i(tipo, monto, fecha_esperada);

-- ============================================
-- Verificar resultados
-- ============================================
select 'usuarios' as tabla, count(*) from usuarios
union all
select 'tarjetas', count(*) from tarjetas
union all
select 'ingresos', count(*) from ingresos
union all
select 'categorias', count(*) from categorias;
