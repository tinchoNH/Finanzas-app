-- Supabase import SQL
-- Generated from gastos_app.xlsx

-- Clean existing data
DELETE FROM pagos;
DELETE FROM gastos_cuotas;
DELETE FROM gastos;
DELETE FROM ingresos WHERE recurrente = false OR mes != to_char(now(), 'YYYY-MM');

-- ============================================================
-- INGRESOS
-- ============================================================
INSERT INTO ingresos (user_id, tipo, monto, fecha_esperada, mes, recurrente)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  'Aguinaldo',
  606000.0,
  'variable',
  '2026-01',
  false
);
INSERT INTO ingresos (user_id, tipo, monto, fecha_esperada, mes, recurrente)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  'Sueldo Pau',
  1600000.0,
  '5 del mes',
  '2026-01',
  false
);
INSERT INTO ingresos (user_id, tipo, monto, fecha_esperada, mes, recurrente)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  'Sueldo Tincho',
  1323825.0,
  '1 del mes',
  '2026-01',
  false
);
INSERT INTO ingresos (user_id, tipo, monto, fecha_esperada, mes, recurrente)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  'Sueldo Pau',
  1825000.0,
  '5 del mes',
  '2026-02',
  false
);
INSERT INTO ingresos (user_id, tipo, monto, fecha_esperada, mes, recurrente)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  'Sueldo Tincho',
  1425000.0,
  '1 del mes',
  '2026-02',
  false
);
INSERT INTO ingresos (user_id, tipo, monto, fecha_esperada, mes, recurrente)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  'Extra',
  1600000.0,
  'variable',
  '2026-02',
  false
);
INSERT INTO ingresos (user_id, tipo, monto, fecha_esperada, mes, recurrente)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  'Sueldo Pau',
  1911000.0,
  '5 del mes',
  '2026-03',
  false
);
INSERT INTO ingresos (user_id, tipo, monto, fecha_esperada, mes, recurrente)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  'Sueldo Tincho',
  1492667.0,
  '1 del mes',
  '2026-03',
  false
);
INSERT INTO ingresos (user_id, tipo, monto, fecha_esperada, mes, recurrente)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  'Extra',
  900000.0,
  'variable',
  '2026-03',
  false
);

-- ============================================================
-- GASTOS
-- ============================================================
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Ahorro' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Dólares' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Ahorro' LIMIT 1) LIMIT 1),
  118800.0,
  '80 Dolares',
  '2026-01-02',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'ABL' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  146667.67,
  'Anual',
  '2026-01-06',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Alquiler' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  1118355.0,
  'Alquiler',
  '2026-01-06',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Panadería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  7600.0,
  'Panadería',
  '2026-01-03',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Comida' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  3100.0,
  'Almuerzo oficina',
  '2026-01-05',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  9700.0,
  'Super Chino',
  '2026-01-09',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Comida' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  3000.0,
  'Almuerzo',
  '2026-01-14',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Carnicería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  116000.0,
  'Carnicería',
  '2026-01-07',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Fiambrería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  17084.0,
  'Fiambrería',
  '2026-01-03',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Fiambrería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  2268.0,
  'Fiambrería',
  '2026-01-13',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Panadería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  3000.0,
  'Panadería',
  '2026-01-02',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Panadería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  16400.0,
  'Panadería',
  '2026-01-03',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  34400.0,
  'Super Chino',
  '2026-01-02',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  24400.0,
  'Super Chino',
  '2026-01-02',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  4500.0,
  'Super Chino',
  '2026-01-02',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  10300.0,
  'Super Chino',
  '2026-01-02',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  3700.0,
  'Super Chino',
  '2026-01-02',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  12300.0,
  'Super Chino',
  '2026-01-12',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  2800.0,
  'Super Chino',
  '2026-01-18',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  2100.0,
  'Super Chino',
  '2026-01-27',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  2900.0,
  'Super Chino',
  '2026-01-30',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  8100.0,
  'Super Chino',
  '2026-01-29',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  33214.0,
  'Super Dia',
  '2026-01-05',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  37900.0,
  'Super Dia',
  '2026-01-07',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  17100.0,
  'Super Dia',
  '2026-01-13',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  9700.0,
  'Super Dia',
  '2026-01-16',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  22490.0,
  'Super Dia',
  '2026-01-21',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  25190.0,
  'Super Dia',
  '2026-01-25',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  8320.0,
  'Super Dia',
  '2026-01-25',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  10228.0,
  'Super Dia',
  '2026-01-29',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Verdulería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  2800.0,
  'Verdulería',
  '2026-01-15',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Verdulería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  3800.0,
  'Verdulería',
  '2026-01-21',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Verdulería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  2025.0,
  'Verdulería',
  '2026-01-25',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Verdulería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  3780.0,
  'Verdulería',
  '2026-01-29',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  5600.0,
  'Super Chino',
  '2026-01-17',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Crédito Anses' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  48793.11,
  'Crédito Anses',
  '2026-01-02',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Edesur' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  45640.23,
  'Edesur',
  '2026-01-02',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Internet' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  27259.99,
  'Internet',
  '2026-01-14',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Metrogas' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  4516.2,
  'Metrogas',
  '2026-01-13',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Psicólogo' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  40500.0,
  'Psicólogo',
  '2026-01-05',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Spotify' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  5726.14,
  'Spotify',
  '2026-01-07',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Sube Tincho' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  8000.0,
  'Sube Tincho',
  '2026-01-05',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Sube Tincho' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  3000.0,
  'Sube Tincho',
  '2026-01-15',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Personales' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Pau' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Personales' LIMIT 1) LIMIT 1),
  219000.0,
  'Pau',
  '2026-01-02',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Personales' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Tincho' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Personales' LIMIT 1) LIMIT 1),
  219000.0,
  'Tincho',
  '2026-01-02',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Cecopay' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1) LIMIT 1),
  63719.11,
  'Total',
  '2026-01-02',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Master Pau' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1) LIMIT 1),
  606000.0,
  'pendiente 113.759',
  '2026-01-02',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Master Tincho' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1) LIMIT 1),
  165811.83,
  'Total',
  '2026-01-07',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Visa Pau' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1) LIMIT 1),
  150000.0,
  'Pendiente $156.445',
  '2026-01-05',
  '2026-01',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Personales' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Pau' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Personales' LIMIT 1) LIMIT 1),
  220000.0,
  'Pau',
  '2026-02-03',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Personales' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Tincho' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Personales' LIMIT 1) LIMIT 1),
  220000.0,
  'Tincho',
  '2026-02-03',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Sube Tincho' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  5000.0,
  'Sube Tincho',
  '2026-02-01',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Master Tincho' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1) LIMIT 1),
  150000.0,
  'mitad',
  '2026-02-05',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Cecopay' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1) LIMIT 1),
  63389.9,
  'Cecopay',
  '2026-02-03',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Crédito Anses' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  48787.08,
  'Crédito Anses',
  '2026-02-02',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Master Pau' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1) LIMIT 1),
  210000.0,
  'mitad',
  '2026-03-02',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Psicólogo' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  32400.0,
  'Psicólogo',
  '2026-02-05',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Edesur' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  30596.26,
  'Edesur',
  '2026-02-02',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Visa Pau' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1) LIMIT 1),
  150000.0,
  'mitad',
  '2026-02-05',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Ahorro' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Dólares' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Ahorro' LIMIT 1) LIMIT 1),
  161590.0,
  '110 dolares',
  '2026-02-02',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Metrogas' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  4466.22,
  'Metrogas',
  '2026-02-06',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Alquiler' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  1090900.0,
  'Alquiler',
  '2026-02-09',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Aysa' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  30626.0,
  'Aysa',
  '2026-02-09',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Spotify' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  5730.76,
  'Spotify',
  '2026-02-09',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Internet' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  27260.0,
  'Internet',
  '2026-02-10',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Salidas' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  34500.0,
  'Dino la Rural',
  '2026-02-01',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  2200.0,
  'Super Chino',
  '2026-02-01',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Fiambrería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  15000.0,
  'Fiambrería',
  '2026-02-01',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Salidas' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  7170.0,
  'Mostaza',
  '2026-02-01',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Salidas' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  6000.0,
  'Fichinis Dino',
  '2026-02-01',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  21939.5,
  'Super Dia',
  '2026-02-01',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Panadería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  11000.0,
  'Panadería',
  '2026-02-01',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  36856.5,
  'Super Dia',
  '2026-02-04',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Sube Pau' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  5000.0,
  'Sube Pau',
  '2026-02-05',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Farmacia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  32239.19,
  'Farmacia',
  '2026-02-06',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  25429.5,
  'Super Dia',
  '2026-02-06',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Cabify' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  7370.93,
  'Cabify',
  '2026-02-06',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Cabify' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  9653.67,
  'Cabify',
  '2026-02-06',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  45277.5,
  'Super Dia',
  '2026-02-07',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Celu Pau' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  7000.0,
  'Celu Pau',
  '2026-02-07',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  4500.0,
  'Super Chino',
  '2026-02-08',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  6200.0,
  'Super Chino',
  '2026-02-08',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  19000.0,
  'Super Chino',
  '2026-02-09',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  42210.0,
  'Super Dia',
  '2026-02-10',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  8400.0,
  'Super Chino',
  '2026-02-10',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Carnicería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  22000.0,
  'Carnicería',
  '2026-02-11',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Verdulería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  6400.0,
  'Verdulería',
  '2026-02-11',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  31300.0,
  'Super Chino',
  '2026-02-13',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Carnicería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  60275.0,
  'Carnicería',
  '2026-02-13',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Kiosco' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  8000.0,
  'Kiosco',
  '2026-02-13',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Jardín' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  26000.0,
  'Cooperadora Nico',
  '2026-02-13',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  3400.0,
  'Super Chino',
  '2026-02-14',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  12700.0,
  'Super Chino',
  '2026-02-14',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  13198.0,
  'Super Dia',
  '2026-02-15',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  1000.0,
  'Super Chino',
  '2026-02-16',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  21235.0,
  'Super Dia',
  '2026-02-16',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  20700.0,
  'Super Dia',
  '2026-02-22',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  9300.0,
  'Super Chino',
  '2026-02-22',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  30600.0,
  'Super Chino',
  '2026-02-23',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  3000.0,
  'Super Chino',
  '2026-02-24',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  668.0,
  'Super Dia',
  '2026-02-25',
  '2026-02',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Cecopay' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1) LIMIT 1),
  63655.79,
  'Cecopay',
  '2026-02-27',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Crédito Anses' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  48708.81,
  'Crédito Anses',
  '2026-03-02',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Master Pau' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1) LIMIT 1),
  637441.0,
  'Queda para abril a favor',
  '2026-03-02',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Pañales' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  49000.0,
  'Pañales',
  '2026-02-27',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Personales' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Pau' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Personales' LIMIT 1) LIMIT 1),
  220000.0,
  'Pau',
  '2026-03-02',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Personales' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Tincho' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Personales' LIMIT 1) LIMIT 1),
  220000.0,
  'Tincho',
  '2026-03-02',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Psicólogo' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  25500.0,
  'Psicólogo',
  '2026-03-05',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Alquiler' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  1090900.0,
  'Alquiler',
  '2026-03-05',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Aysa' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  30400.0,
  'Aysa',
  '2026-03-05',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Edesur' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  28446.39,
  'Edesur',
  '2026-03-04',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Visa Pau' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1) LIMIT 1),
  428164.0,
  'total',
  '2026-03-05',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Master Tincho' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1) LIMIT 1),
  373286.78,
  'total',
  '2026-03-05',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Ahorro' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Dólares' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Ahorro' LIMIT 1) LIMIT 1),
  169420.0,
  '118 Dolares',
  '2026-03-06',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Salidas' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  40000.0,
  'Cena Alejo',
  '2026-02-27',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  3500.0,
  'Super Chino',
  '2026-02-28',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Jardín' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  21800.0,
  'Delantales',
  '2026-02-28',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  21696.0,
  'Super Dia',
  '2026-02-28',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  149772.5,
  'Super Dia',
  '2026-02-28',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Jardín' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  7200.0,
  'Tostado',
  '2026-03-03',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  14400.0,
  'Super Chino',
  '2026-03-03',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Jardín' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  7800.0,
  'Tostado',
  '2026-03-04',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  2600.0,
  'Super Chino',
  '2026-03-05',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  4050.0,
  'Super Dia',
  '2026-03-05',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Varios' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  4500.0,
  'Sahumerios',
  '2026-03-05',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  6186.0,
  'Super Dia',
  '2026-03-05',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Jardín' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  14400.0,
  'Tostado',
  '2026-03-06',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Varios' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  13800.0,
  'Regalo Rafa',
  '2026-03-07',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Sube Tincho' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  5000.0,
  'Sube Tincho',
  '2026-03-08',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Coto' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  71955.11,
  'Super Coto',
  '2026-03-09',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Farmacia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  5046.5,
  'Farmacia',
  '2026-03-10',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Jardín' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  3500.0,
  'Aplique para sabana',
  '2026-03-10',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Varios' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  5000.0,
  'Ferreteria',
  '2026-03-10',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Metrogas' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  4744.56,
  'FV 20/03',
  '2026-03-11',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Internet' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  30759.99,
  'FV 21/3',
  '2026-03-11',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  23900.0,
  'Super Chino',
  '2026-03-12',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Kiosco' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  7500.0,
  'Kiosco',
  '2026-03-12',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Farmacia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  10190.0,
  'Farmacia',
  '2026-03-12',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  5200.0,
  'Super Chino',
  '2026-03-12',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Alimento Pichus' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos fijos' LIMIT 1) LIMIT 1),
  27189.0,
  'Alimento Pichus',
  '2026-03-13',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  3500.0,
  'Super Chino',
  '2026-03-14',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Sube Tincho' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  4000.0,
  'Sube Tincho',
  '2026-03-16',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Jardín' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  12419.0,
  'Jardín',
  '2026-03-18',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Carnicería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  21385.0,
  'Carnicería',
  '2026-03-18',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  5900.0,
  'Super Chino',
  '2026-03-18',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Verdulería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  2700.0,
  'Verdulería',
  '2026-03-17',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Verdulería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  6500.0,
  'Maple',
  '2026-03-14',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Pañales' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  40300.0,
  'Pañales',
  '2026-03-18',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Verdulería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  3500.0,
  'Verdulería',
  '2026-03-19',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Delivery' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  42000.0,
  'Pizzas con Hueso',
  '2026-03-19',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  12000.0,
  'Super Chino',
  '2026-03-20',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  11534.0,
  'Super Chino',
  '2026-03-21',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Sube Tincho' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  5000.0,
  'Sube Tincho',
  '2026-03-22',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  18828.0,
  'Super Dia',
  '2026-03-22',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Carnicería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  18270.0,
  'Carnicería',
  '2026-03-24',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  7799.2,
  'Super Dia',
  '2026-03-24',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Sube Pau' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  5000.0,
  'Sube Pau',
  '2026-03-26',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Celu Pau' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  8000.0,
  'Celu Pau',
  '2026-03-25',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Carnicería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  38500.0,
  'Carnicería',
  '2026-03-27',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Comida' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  10000.0,
  'Comida',
  '2026-03-27',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  19400.0,
  'Super Chino',
  '2026-03-27',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Verdulería' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  10000.0,
  'Verdulería',
  '2026-03-27',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%pau%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Cecopay' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Tarjetas' LIMIT 1) LIMIT 1),
  63389.8,
  'Cecopay',
  '2026-04-01',
  '2026-04',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  1600.0,
  'Super Chino',
  '2026-03-30',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Dia' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  11315.0,
  'Super Dia',
  '2026-03-30',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  15500.0,
  'Super Chino',
  '2026-03-28',
  '2026-03',
  false,
  true
);
INSERT INTO gastos (user_id, categoria_id, subcategoria_id, monto, descripcion, fecha, mes, tiene_vencimiento, pagado)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1),
  (SELECT id FROM subcategorias WHERE nombre = 'Super Chino' AND categoria_id = (SELECT id FROM categorias WHERE nombre = 'Gastos Diarios' LIMIT 1) LIMIT 1),
  4900.0,
  'Super Chino',
  '2026-03-28',
  '2026-03',
  false,
  true
);

-- ============================================================
-- GASTOS_CUOTAS
-- ============================================================
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Camara de Seguridad',
  117849.0,
  6,
  19641.5,
  '2025-11',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Goteros perros',
  43599.99,
  3,
  14533.33,
  '2025-11',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Super chino',
  25668.0,
  1,
  25668.0,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Baradero',
  606000.0,
  1,
  606000.0,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Super dia',
  31741.0,
  1,
  31741.0,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Cabify',
  12935.0,
  1,
  12935.0,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Farmacity',
  9240.0,
  1,
  9240.0,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'BBVA Seguro Hogas',
  37100.0,
  1,
  37100.0,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Colombraro',
  27552.0,
  3,
  9184.0,
  '2025-12',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Limite Vertical',
  131140.14,
  3,
  43713.38,
  '2025-12',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Bazar (Arbolito)',
  82000.0,
  3,
  27333.33,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Correa Kimba',
  18368.0,
  1,
  18368.0,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Alimento Perros',
  50890.0,
  1,
  50890.0,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Regalo Navidad Nico',
  64990.0,
  2,
  32495.0,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Cervezas Navidad',
  25200.0,
  1,
  25200.0,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Mostaza',
  41400.0,
  1,
  41400.0,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Sube',
  659.5,
  1,
  659.5,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Seguro de Vida',
  11102.0,
  1,
  11102.0,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Impuestos',
  8999.8,
  1,
  8999.8,
  '2026-01',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Cecopay' LIMIT 1),
  'Easy 1',
  414437.64,
  12,
  34536.47,
  '2025-09',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Cecopay' LIMIT 1),
  'Easy 2',
  164974.5,
  6,
  27495.75,
  '2025-11',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Cecopay' LIMIT 1),
  'Impuestos',
  24000.0,
  12,
  2000.0,
  '2025-09',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Tincho' LIMIT 1),
  'Lentes',
  78000.0,
  3,
  26000.0,
  '2025-11',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Tincho' LIMIT 1),
  'Campera Pau',
  166350.0,
  12,
  13862.5,
  '2025-08',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Tincho' LIMIT 1),
  'Colchones',
  2267087.94,
  18,
  125949.33,
  '2025-04',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Saldo anterior',
  113758.83,
  1,
  113758.83,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Super DIa',
  60146.35,
  1,
  60146.35,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Farmacity',
  51743.2,
  1,
  51743.2,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Super Chino',
  10600.0,
  1,
  10600.0,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Birras año nuevo',
  40303.0,
  1,
  40303.0,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Asado año nuevo',
  45690.0,
  1,
  45690.0,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Mimo - Dif Regalo',
  3000.0,
  1,
  3000.0,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Cuspide Martin',
  22700.0,
  1,
  22700.0,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Farmacity',
  17188.5,
  1,
  17188.5,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Impuestos',
  29800.0,
  1,
  29800.0,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Saldo Anterior',
  169327.0,
  1,
  169327.0,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Ojotas Tincho',
  27000.0,
  1,
  27000.0,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Seguro de Vida',
  11101.25,
  1,
  11101.25,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'BBVA Seguro Hogas',
  37859.27,
  1,
  37859.27,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Impuestos',
  21891.0,
  1,
  21891.0,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Tincho' LIMIT 1),
  'Los Rodriguez (TC Tincho)',
  88200.0,
  1,
  88200.0,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Tincho' LIMIT 1),
  'PAÑALES',
  60934.3,
  1,
  60934.3,
  '2026-02',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Saldo Pendiente',
  204571.38,
  1,
  204571.38,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Reserva Hospedaje',
  160577.01,
  1,
  160577.01,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Panaderia',
  22000.0,
  1,
  22000.0,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Sanguches',
  30250.0,
  1,
  30250.0,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'cabify',
  8721.74,
  1,
  8721.74,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Coto',
  55181.1,
  1,
  55181.1,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Fotos Dinos',
  32097.0,
  1,
  32097.0,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'El Globito',
  41400.0,
  1,
  41400.0,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Farmacity',
  14579.33,
  1,
  14579.33,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Pau' LIMIT 1),
  'Impuestos',
  44722.06,
  1,
  44722.06,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Saldo anterior',
  229904.23,
  1,
  229904.23,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Seguro de Vida',
  12766.42,
  1,
  12766.42,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'BBVA Seguro Hogas',
  38567.83,
  1,
  38567.83,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Alimento Perros',
  61587.0,
  1,
  61587.0,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Visa Pau' LIMIT 1),
  'Impuestos',
  28400.0,
  1,
  28400.0,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Tincho' LIMIT 1),
  'Saldo Anterior',
  138996.13,
  1,
  138996.13,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Tincho' LIMIT 1),
  'CELULAR PAU',
  617998.32,
  9,
  68666.48,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Tincho' LIMIT 1),
  'cabify',
  14800.0,
  1,
  14800.0,
  '2026-03',
  true
);
INSERT INTO gastos_cuotas (user_id, tarjeta_id, descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Master Tincho' LIMIT 1),
  'impuerto',
  11044.35,
  1,
  11044.35,
  '2026-03',
  true
);

-- ============================================================
-- PAGOS
-- ============================================================
INSERT INTO pagos (user_id, tarjeta_id, mes, monto_pagado, fecha_pago, notas)
VALUES (
  (SELECT id FROM usuarios WHERE email ILIKE '%tincho%' LIMIT 1),
  (SELECT id FROM tarjetas WHERE nombre = 'Cecopay' LIMIT 1),
  '2026-03',
  10619.85,
  '2026-03-01',
  NULL
);

-- End of import