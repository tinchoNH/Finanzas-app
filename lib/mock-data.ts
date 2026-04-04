export const ingresos = [
  { id: "1", tipo: "Sueldo Tincho", monto: 180000, fecha: "1° del mes", recurrente: true },
  { id: "2", tipo: "Sueldo Pau", monto: 120000, fecha: "5° del mes", recurrente: true },
];

export const vencimientos = [
  { id: "1", concepto: "Cecopay", monto: 64032, dia: 10, tipo: "tarjeta" },
  { id: "2", concepto: "Sueldo Pau 💵", monto: 120000, dia: 5, tipo: "ingreso" },
  { id: "3", concepto: "Master Pau", monto: 633741, dia: 15, tipo: "tarjeta" },
  { id: "4", concepto: "Alquiler / Aysa", monto: 1118355, dia: 6, tipo: "fijo" },
  { id: "5", concepto: "Master Tincho", monto: 373318, dia: 20, tipo: "tarjeta" },
  { id: "6", concepto: "Edesur", monto: 0, dia: 25, tipo: "fijo" },
];

export const cuotasActivas = [
  { id: "1", concepto: "Easy 1", tarjeta: "Cecopay", cuotaActual: 7, cuotasTotal: 12, montoCuota: 34536.47, saldo: 172682.35, pagada: false },
  { id: "2", concepto: "Easy 2", tarjeta: "Cecopay", cuotaActual: 5, cuotasTotal: 6, montoCuota: 27495.75, saldo: 27495.75, pagada: false },
  { id: "3", concepto: "Impuestos", tarjeta: "Cecopay", cuotaActual: 7, cuotasTotal: 12, montoCuota: 2000, saldo: 10000, pagada: false },
  { id: "4", concepto: "Cámara de Seguridad", tarjeta: "Master Pau", cuotaActual: 5, cuotasTotal: 6, montoCuota: 19641.5, saldo: 19641.5, pagada: false },
  { id: "5", concepto: "Campera Pau", tarjeta: "Master Tincho", cuotaActual: 8, cuotasTotal: 12, montoCuota: 13862.5, saldo: 55450, pagada: false },
  { id: "6", concepto: "Colchones", tarjeta: "Master Tincho", cuotaActual: 11, cuotasTotal: 18, montoCuota: 125949.33, saldo: 881645.58, pagada: false },
  { id: "7", concepto: "Colombraro", tarjeta: "Visa Pau", cuotaActual: 4, cuotasTotal: 3, montoCuota: 9184, saldo: 0, pagada: false },
  { id: "8", concepto: "Límite Vertical", tarjeta: "Visa Pau", cuotaActual: 4, cuotasTotal: 3, montoCuota: 43713.38, saldo: 0, pagada: false },
];

export const historico = [
  { mes: "Oct", ingresos: 280000, gastos: 210000 },
  { mes: "Nov", ingresos: 280000, gastos: 230000 },
  { mes: "Dic", ingresos: 310000, gastos: 280000 },
  { mes: "Ene", ingresos: 300000, gastos: 220000 },
  { mes: "Feb", ingresos: 300000, gastos: 240000 },
  { mes: "Mar", ingresos: 300000, gastos: 245000 },
];

export const distribucion = [
  { nombre: "Gastos fijos", porcentaje: 40, monto: 120000, color: "#38bdf8" },
  { nombre: "Tarjetas", porcentaje: 26, monto: 78000, color: "#0ea5e9" },
  { nombre: "Gastos diarios", porcentaje: 15, monto: 45000, color: "#22c55e" },
  { nombre: "Ahorro", porcentaje: 10, monto: 30000, color: "#f59e0b" },
  { nombre: "Libre", porcentaje: 9, monto: 27000, color: "#a855f7" },
];

export const presupuesto = [
  { categoria: "Gastos fijos", icono: "🏠", presupuestado: 1200000, real: 1118355 },
  { categoria: "Gastos diarios", icono: "🛒", presupuestado: 300000, real: 245000 },
  { categoria: "Tarjetas", icono: "💳", presupuestado: 1500000, real: 1469650 },
  { categoria: "Ahorro", icono: "🐷", presupuestado: 120000, real: 118800 },
  { categoria: "Personales", icono: "👤", presupuestado: 50000, real: 30000 },
];

export const categorias = [
  {
    nombre: "Gastos fijos", icono: "🏠", color: "#38bdf8",
    subcategorias: ["Alquiler", "Aysa", "Alquiler / Aysa", "Edesur", "Metrogas", "Internet", "ABL", "Spotify", "HBO", "Psicólogo", "Alimento Pichus", "Pañales", "Crédito Anses"]
  },
  {
    nombre: "Gastos Diarios", icono: "🛒", color: "#22c55e",
    subcategorias: ["Super Dia", "Super Chino", "Super Coto", "Carnicería", "Fiambrería", "Verdulería", "Panadería", "Farmacia", "Delivery", "Comida", "Kiosco", "Pañales", "Sube Tincho", "Sube Pau", "Celu Tincho", "Celu Pau", "Cabify", "Salidas", "Jardín", "Varios"]
  },
  {
    nombre: "Tarjetas", icono: "💳", color: "#0ea5e9",
    subcategorias: ["Master Pau", "Master Tincho", "Visa Pau", "Cecopay", "Visa Tincho - Personal"]
  },
  {
    nombre: "Ingresos", icono: "💵", color: "#22c55e",
    subcategorias: ["Sueldo Tincho", "Sueldo Pau", "Extra", "Aguinaldo"]
  },
  {
    nombre: "Ahorro", icono: "🐷", color: "#f59e0b",
    subcategorias: ["Dólares", "Inversiones"]
  },
  {
    nombre: "Deudas", icono: "📋", color: "#ef4444",
    subcategorias: ["Préstamo", "Mercedes"]
  },
  {
    nombre: "Personales", icono: "👤", color: "#a855f7",
    subcategorias: ["Tincho", "Pau"]
  },
];

export const tarjetas = [
  { id: "1", nombre: "Cecopay", tipo: "crédito", color: "#0ea5e9" },
  { id: "2", nombre: "Master Pau", tipo: "crédito", color: "#a855f7" },
  { id: "3", nombre: "Master Tincho", tipo: "crédito", color: "#f59e0b" },
  { id: "4", nombre: "Visa Pau", tipo: "crédito", color: "#22c55e" },
  { id: "5", nombre: "Visa Tincho - Personal", tipo: "crédito", color: "#ef4444" },
];
