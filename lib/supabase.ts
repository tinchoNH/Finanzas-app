import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── Tipos ───────────────────────────────────────────────────

export type Categoria = {
  id: string
  nombre: string
  icono: string
  color: string
  orden: number
  activa: boolean
}

export type Subcategoria = {
  id: string
  categoria_id: string
  nombre: string
}

export type Tarjeta = {
  id: string
  user_id: string
  nombre: string
  tipo: string
  color: string
}

export type Gasto = {
  id: string
  user_id: string
  categoria_id: string
  subcategoria_id: string | null
  monto: number
  descripcion: string
  fecha: string
  mes: string
  tiene_vencimiento: boolean
  fecha_vencimiento: string | null
  pagado: boolean
  created_at: string
  categoria?: Categoria
  subcategoria?: Subcategoria
}

export type GastoCuota = {
  id: string
  user_id: string
  tarjeta_id: string
  descripcion: string
  monto_total: number
  cantidad_cuotas: number
  monto_cuota: number
  mes_inicio: string
  activo: boolean
  tarjeta?: Tarjeta
}

export type Pago = {
  id: string
  user_id: string
  tarjeta_id: string
  mes: string
  monto_pagado: number
  fecha_pago: string
  notas: string | null
}

export type Ingreso = {
  id: string
  user_id: string
  tipo: string
  monto: number
  fecha_esperada: string
  mes: string
  recurrente: boolean
}

export type Deuda = {
  id: string
  user_id: string
  nombre: string
  tipo: 'cuotas' | 'libre'
  monto_total: number
  cuotas_total: number | null
  interes_mensual: number | null
  monto_cuota: number | null
  fecha_inicio: string
  activa: boolean
  notas: string | null
  created_at: string
}

export type DistribucionIngreso = {
  id: string
  nombre: string
  porcentaje: number
  color: string
  orden: number
}

// ─── Helpers de mes ──────────────────────────────────────────

export function mesAString(mes: number, anio: number): string {
  return `${anio}-${String(mes + 1).padStart(2, '0')}`
}

export function getCuotaNumero(mesInicio: string, mesActual: string): number {
  const [anioI, mesI] = mesInicio.split('-').map(Number)
  const [anioA, mesA] = mesActual.split('-').map(Number)
  return (anioA - anioI) * 12 + (mesA - mesI) + 1
}

// ─── Queries ─────────────────────────────────────────────────

export async function getCategorias() {
  const { data } = await supabase
    .from('categorias')
    .select('*, subcategorias(*)')
    .eq('activa', true)
    .order('orden')
  return data ?? []
}

export async function getGastos(mes: string) {
  const { data } = await supabase
    .from('gastos')
    .select('*, categoria:categorias(*), subcategoria:subcategorias(*)')
    .eq('mes', mes)
    .order('fecha', { ascending: false })
  return data ?? []
}

export async function getGastosCuotas() {
  const { data } = await supabase
    .from('gastos_cuotas')
    .select('*, tarjeta:tarjetas(*)')
    .eq('activo', true)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getTarjetas() {
  const { data } = await supabase
    .from('tarjetas')
    .select('*')
    .order('nombre')
  return data ?? []
}

export async function getIngresos(mes: string) {
  const { data } = await supabase
    .from('ingresos')
    .select('*')
    .eq('mes', mes)
    .order('fecha_esperada')
  return data ?? []
}

export async function getPagos(mes: string) {
  const { data } = await supabase
    .from('pagos')
    .select('*, tarjeta:tarjetas(*)')
    .eq('mes', mes)
  return data ?? []
}

export async function getDistribucion() {
  const { data } = await supabase
    .from('distribucion_ingresos')
    .select('*')
    .order('orden')
  return data ?? []
}

export async function getPresupuesto(mes: string) {
  const { data } = await supabase
    .from('presupuesto_mensual')
    .select('*, categoria:categorias(*)')
    .eq('mes', mes)
  return data ?? []
}
