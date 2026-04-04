-- ============================================
-- SEED - Categorías, Subcategorías y Tarjetas
-- ============================================

-- Limpiar datos previos
DELETE FROM subcategorias;
DELETE FROM categorias;
DELETE FROM distribucion_ingresos;

-- ============================================
-- CATEGORÍAS Y SUBCATEGORÍAS
-- ============================================

-- 1. GASTOS FIJOS
WITH cat AS (
  INSERT INTO categorias (nombre, icono, color, orden)
  VALUES ('Gastos fijos', '🏠', '#38bdf8', 1)
  RETURNING id
)
INSERT INTO subcategorias (categoria_id, nombre)
SELECT cat.id, sub FROM cat,
(VALUES
  ('Alquiler'), ('Aysa'), ('Alquiler / Aysa'), ('Edesur'), ('Metrogas'),
  ('Internet'), ('ABL'), ('Spotify'), ('HBO'), ('Psicólogo'),
  ('Alimento Pichus'), ('Pañales'), ('Crédito Anses')
) AS subs(sub);

-- 2. GASTOS DIARIOS
WITH cat AS (
  INSERT INTO categorias (nombre, icono, color, orden)
  VALUES ('Gastos Diarios', '🛒', '#22c55e', 2)
  RETURNING id
)
INSERT INTO subcategorias (categoria_id, nombre)
SELECT cat.id, sub FROM cat,
(VALUES
  ('Super Dia'), ('Super Chino'), ('Super Coto'), ('Carnicería'),
  ('Fiambrería'), ('Verdulería'), ('Panadería'), ('Farmacia'),
  ('Delivery'), ('Comida'), ('Kiosco'), ('Pañales'),
  ('Sube Tincho'), ('Sube Pau'), ('Celu Tincho'), ('Celu Pau'),
  ('Cabify'), ('Salidas'), ('Jardín'), ('Varios')
) AS subs(sub);

-- 3. TARJETAS
WITH cat AS (
  INSERT INTO categorias (nombre, icono, color, orden)
  VALUES ('Tarjetas', '💳', '#0ea5e9', 3)
  RETURNING id
)
INSERT INTO subcategorias (categoria_id, nombre)
SELECT cat.id, sub FROM cat,
(VALUES
  ('Master Pau'), ('Master Tincho'), ('Visa Pau'),
  ('Cecopay'), ('Visa Tincho - Personal')
) AS subs(sub);

-- 4. INGRESOS
WITH cat AS (
  INSERT INTO categorias (nombre, icono, color, orden)
  VALUES ('Ingresos', '💵', '#4ade80', 4)
  RETURNING id
)
INSERT INTO subcategorias (categoria_id, nombre)
SELECT cat.id, sub FROM cat,
(VALUES
  ('Sueldo Tincho'), ('Sueldo Pau'), ('Extra'), ('Aguinaldo')
) AS subs(sub);

-- 5. AHORRO
WITH cat AS (
  INSERT INTO categorias (nombre, icono, color, orden)
  VALUES ('Ahorro', '🐷', '#f59e0b', 5)
  RETURNING id
)
INSERT INTO subcategorias (categoria_id, nombre)
SELECT cat.id, sub FROM cat,
(VALUES ('Dólares'), ('Inversiones')) AS subs(sub);

-- 6. DEUDAS
WITH cat AS (
  INSERT INTO categorias (nombre, icono, color, orden)
  VALUES ('Deudas', '📋', '#ef4444', 6)
  RETURNING id
)
INSERT INTO subcategorias (categoria_id, nombre)
SELECT cat.id, sub FROM cat,
(VALUES ('Préstamo'), ('Mercedes')) AS subs(sub);

-- 7. PERSONALES
WITH cat AS (
  INSERT INTO categorias (nombre, icono, color, orden)
  VALUES ('Personales', '👤', '#a855f7', 7)
  RETURNING id
)
INSERT INTO subcategorias (categoria_id, nombre)
SELECT cat.id, sub FROM cat,
(VALUES ('Tincho'), ('Pau')) AS subs(sub);

-- ============================================
-- DISTRIBUCIÓN DE INGRESOS
-- ============================================
INSERT INTO distribucion_ingresos (nombre, porcentaje, color, orden) VALUES
  ('Gastos fijos',   40, '#38bdf8', 1),
  ('Tarjetas',       26, '#0ea5e9', 2),
  ('Gastos diarios', 15, '#22c55e', 3),
  ('Ahorro',         10, '#f59e0b', 4),
  ('Libre',           9, '#a855f7', 5);
