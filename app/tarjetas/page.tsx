"use client";

import { useState, useEffect } from "react";
import { Plus, ChevronDown, ChevronUp, CreditCard, Loader2, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { supabase, mesAString } from "@/lib/supabase";

const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const mesNombreANum: Record<string, number> = { "Enero":1,"Febrero":2,"Marzo":3,"Abril":4,"Mayo":5,"Junio":6,"Julio":7,"Agosto":8,"Septiembre":9,"Octubre":10,"Noviembre":11,"Diciembre":12 };

const formVacio = {
  tarjeta_id: "", descripcion: "", monto_total: "", cantidad_cuotas: "1",
  mes_inicio: meses[new Date().getMonth()], anio_inicio: String(new Date().getFullYear()),
};

export default function TarjetasPage() {
  const [mesIdx, setMesIdx]   = useState(new Date().getMonth());
  const [anio, setAnio]       = useState(String(new Date().getFullYear()));
  const [expandidas, setExpandidas] = useState<string[]>([]);
  const [showForm, setShowForm]     = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [tarjetas, setTarjetas] = useState<any[]>([]);
  const [gastosCuotas, setGastosCuotas] = useState<any[]>([]);
  const [pagosMes, setPagosMes]     = useState<Record<string, number>>({});
  const [pagosPorMes, setPagosPorMes] = useState<Record<string, Record<string, number>>>({});
  const [personalIds, setPersonalIds] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ ...formVacio });
  const [showFormTarjeta, setShowFormTarjeta] = useState(false);
  const [formTarjeta, setFormTarjeta] = useState({ nombre: "", tipo: "crédito", color: "#0ea5e9" });
  const coloresTarjeta = ["#0ea5e9","#22c55e","#f59e0b","#a855f7","#ef4444","#ec4899","#f97316","#14b8a6"];

  const anioNum      = parseInt(anio);
  const mesStr       = `${anio}-${String(mesIdx + 1).padStart(2, "0")}`;
  const prevDate     = new Date(anioNum, mesIdx - 1, 1);
  const mesAnteriorStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

  // Cargar preferencia personal desde DB (es_personal) + fallback localStorage
  useEffect(() => {
    // fallback: sync desde localStorage a DB si hay datos viejos
    try {
      const stored = localStorage.getItem("tarjetas_personales");
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        if (ids.length > 0) {
          // migrar a DB
          ids.forEach(id => supabase.from("tarjetas").update({ es_personal: true }).eq("id", id).then(() => {}));
          localStorage.removeItem("tarjetas_personales");
        }
      }
    } catch {}
  }, []);

  useEffect(() => { cargar(); }, []);
  useEffect(() => { if (tarjetas.length > 0) cargarPagos(); }, [mesStr, tarjetas]);

  async function cargar() {
    setLoading(true);
    const [{ data: tjs }, { data: gc }] = await Promise.all([
      supabase.from("tarjetas").select("*").order("nombre"),
      supabase.from("gastos_cuotas").select("*, tarjeta:tarjetas(*)").eq("activo", true),
    ]);
    if (tjs) {
      setTarjetas(tjs);
      setExpandidas(tjs.map((t: any) => t.id));
      // Cargar personales desde DB
      const personales = new Set((tjs as any[]).filter(t => t.es_personal).map(t => t.id as string));
      setPersonalIds(personales);
    }
    if (gc) setGastosCuotas(gc);
    setLoading(false);
  }

  async function cargarPagos() {
    const { data: cat } = await supabase.from("categorias").select("id").eq("nombre", "Tarjetas").limit(1);
    const catId = (cat as any)?.[0]?.id;
    if (!catId) return;

    // Cargar 7 meses (actual + 6 anteriores) en una sola query
    const mesesACargar: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(anioNum, mesIdx - i, 1);
      mesesACargar.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const { data: gastos } = await supabase
      .from("gastos")
      .select("monto, mes, subcategoria:subcategorias(nombre)")
      .eq("categoria_id", catId)
      .in("mes", mesesACargar);

    const mapa: Record<string, Record<string, number>> = {};
    for (const g of (gastos ?? []) as any[]) {
      const mes = g.mes as string;
      const sub = (g.subcategoria?.nombre ?? "").trim().toLowerCase();
      const t = tarjetas.find((t: any) => t.nombre.trim().toLowerCase() === sub);
      if (t) {
        if (!mapa[mes]) mapa[mes] = {};
        mapa[mes][t.id] = (mapa[mes][t.id] ?? 0) + Number(g.monto);
      }
    }

    setPagosPorMes(mapa);
    setPagosMes(mapa[mesStr] ?? {});
  }

  function getCuotaParaMes(gasto: any, mIdx: number, anioN: number) {
    const [anioI, mesI] = gasto.mes_inicio.split("-").map(Number);
    const num = (anioN - anioI) * 12 + (mIdx + 1 - mesI) + 1;
    if (num < 1 || num > gasto.cantidad_cuotas) return null;
    return { numero: num, saldo: gasto.monto_cuota * (gasto.cantidad_cuotas - num), esUltima: num === gasto.cantidad_cuotas };
  }

  function getSaldoArrastrado(tarjetaId: string): number {
    // Nivel 2 (dos meses atrás): arrastrado simple sin encadenar más
    const d2 = new Date(anioNum, mesIdx - 2, 1);
    const m2Idx = d2.getMonth();
    const anio2 = d2.getFullYear();
    const m2Str = `${anio2}-${String(m2Idx + 1).padStart(2, "0")}`;
    const cuotas2 = gastosCuotas
      .filter(g => g.tarjeta_id === tarjetaId)
      .reduce((s: number, g: any) => {
        const c = getCuotaParaMes(g, m2Idx, anio2);
        return s + (c ? Number(g.monto_cuota) : 0);
      }, 0);
    const pagado2 = pagosPorMes[m2Str]?.[tarjetaId] ?? 0;
    const arrastrado2 = Math.max(0, cuotas2 - pagado2);

    // Nivel 1 (mes anterior): cuotas + arrastrado del nivel 2 - pagado
    const d1 = new Date(anioNum, mesIdx - 1, 1);
    const m1Idx = d1.getMonth();
    const anio1 = d1.getFullYear();
    const m1Str = `${anio1}-${String(m1Idx + 1).padStart(2, "0")}`;
    const cuotas1 = gastosCuotas
      .filter(g => g.tarjeta_id === tarjetaId)
      .reduce((s: number, g: any) => {
        const c = getCuotaParaMes(g, m1Idx, anio1);
        return s + (c ? Number(g.monto_cuota) : 0);
      }, 0);
    const pagado1 = pagosPorMes[m1Str]?.[tarjetaId] ?? 0;
    return Math.max(0, cuotas1 + arrastrado2 - pagado1);
  }

  function togglePersonal(id: string) {
    setPersonalIds(prev => {
      const next = new Set(prev);
      const esPersonal = !next.has(id);
      esPersonal ? next.add(id) : next.delete(id);
      // Guardar en DB
      supabase.from("tarjetas").update({ es_personal: esPersonal }).eq("id", id).then(() => {});
      return next;
    });
  }

  async function guardarTarjeta() {
    if (!formTarjeta.nombre.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("tarjetas").insert({ user_id: user.id, nombre: formTarjeta.nombre.trim(), tipo: formTarjeta.tipo, color: formTarjeta.color }).select().single();
    if (data) { setTarjetas(prev => [...prev, data]); setExpandidas(prev => [...prev, data.id]); }
    setFormTarjeta({ nombre: "", tipo: "crédito", color: "#0ea5e9" });
    setShowFormTarjeta(false);
  }

  function abrirNuevo() { setEditandoId(null); setForm({ ...formVacio }); setShowForm(true); }

  function abrirEditar(g: any) {
    const [anioInicio, mesInicio] = g.mes_inicio.split("-");
    setEditandoId(g.id);
    setForm({ tarjeta_id: g.tarjeta_id, descripcion: g.descripcion, monto_total: String(g.monto_total), cantidad_cuotas: String(g.cantidad_cuotas), mes_inicio: meses[parseInt(mesInicio) - 1], anio_inicio: anioInicio });
    setShowForm(true);
  }

  async function guardar() {
    if (!form.tarjeta_id || !form.descripcion || !form.monto_total) return;
    setSaving(true);
    const cuotas = parseInt(form.cantidad_cuotas) || 1;
    const monto  = parseFloat(form.monto_total);
    const mesIni = `${form.anio_inicio}-${String(mesNombreANum[form.mes_inicio] || 1).padStart(2, "0")}`;
    const montoX = Math.round(monto / cuotas * 100) / 100;

    if (editandoId) {
      const { data } = await supabase.from("gastos_cuotas")
        .update({ tarjeta_id: form.tarjeta_id, descripcion: form.descripcion, monto_total: monto, cantidad_cuotas: cuotas, monto_cuota: montoX, mes_inicio: mesIni })
        .eq("id", editandoId).select("*, tarjeta:tarjetas(*)").single();
      if (data) setGastosCuotas(prev => prev.map(g => g.id === editandoId ? data : g));
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("gastos_cuotas")
        .insert({ user_id: user!.id, tarjeta_id: form.tarjeta_id, descripcion: form.descripcion, monto_total: monto, cantidad_cuotas: cuotas, monto_cuota: montoX, mes_inicio: mesIni, activo: true })
        .select("*, tarjeta:tarjetas(*)").single();
      if (data) setGastosCuotas(prev => [data, ...prev]);
    }
    setShowForm(false); setEditandoId(null); setForm({ ...formVacio }); setSaving(false);
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar esta cuota?")) return;
    await supabase.from("gastos_cuotas").delete().eq("id", id);
    setGastosCuotas(prev => prev.filter(g => g.id !== id));
  }

  const mesInicioPreview = (() => {
    if (!form.mes_inicio || !form.anio_inicio) return null;
    const mesIni = `${form.anio_inicio}-${String(mesNombreANum[form.mes_inicio] || 1).padStart(2, "0")}`;
    const mesAct = mesAString(mesIdx, anioNum);
    const [anioI, mesI] = mesIni.split("-").map(Number);
    const [anioA, mesA] = mesAct.split("-").map(Number);
    const n = (anioA - anioI) * 12 + (mesA - mesI) + 1;
    const c = parseInt(form.cantidad_cuotas) || 1;
    if (n >= 1 && n <= c) return `Cuota ${n}/${c} en ${meses[mesIdx]} ${anio}`;
    if (n < 1) return `Empieza en ${form.mes_inicio} ${form.anio_inicio}`;
    return `Ya terminó (${c} cuotas)`;
  })();

  const montoCuotaCalc = form.monto_total && form.cantidad_cuotas
    ? (parseFloat(form.monto_total) / parseInt(form.cantidad_cuotas)).toFixed(2) : "0";

  // Total compartido: excluye tarjetas marcadas como personales, incluye saldo arrastrado
  const totalCompartido = tarjetas
    .filter(t => !personalIds.has(t.id))
    .reduce((s, t) => {
      const cuotasMes = gastosCuotas.filter(g => g.tarjeta_id === t.id).reduce((ss: number, g: any) => {
        const c = getCuotaParaMes(g, mesIdx, anioNum);
        return ss + (c ? Number(g.monto_cuota) : 0);
      }, 0);
      return s + cuotasMes + getSaldoArrastrado(t.id);
    }, 0);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={24} className="animate-spin" style={{ color: "#64748b" }} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Tarjetas</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>Cuotas — {meses[mesIdx]} {anio}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" }}
            value={mesIdx} onChange={e => setMesIdx(Number(e.target.value))}>
            {meses.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" }}
            value={anio} onChange={e => setAnio(e.target.value)}>
            {[2024, 2025, 2026, 2027].map(y => <option key={y}>{y}</option>)}
          </select>
          <button onClick={() => setShowFormTarjeta(true)} className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium text-sm text-white" style={{ backgroundColor: "#22c55e" }}>
            <Plus size={16} /> <span className="hidden sm:inline">Nueva</span> tarjeta
          </button>
          <button onClick={abrirNuevo} className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium text-sm text-white" style={{ backgroundColor: "#0ea5e9" }}>
            <Plus size={16} /> <span className="hidden sm:inline">Cargar</span> gasto
          </button>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "#00000088" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: "#e2e8f0" }}>{editandoId ? "Editar cuota" : "Cargar gasto con cuotas"}</h2>
              <button onClick={() => { setShowForm(false); setEditandoId(null); }} style={{ color: "#64748b" }}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Tarjeta</label>
                <select className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  value={form.tarjeta_id} onChange={e => setForm(p => ({ ...p, tarjeta_id: e.target.value }))}>
                  <option value="">Seleccioná...</option>
                  {tarjetas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Concepto</label>
                <input className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  placeholder="Ej: Easy cuotas" value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Monto total ($)</label>
                <input type="number" className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  placeholder="600000" value={form.monto_total} onChange={e => setForm(p => ({ ...p, monto_total: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Cantidad de cuotas</label>
                <input type="number" min={1} max={60} className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  placeholder="12" value={form.cantidad_cuotas} onChange={e => setForm(p => ({ ...p, cantidad_cuotas: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Mes y año de inicio</label>
                <div className="flex gap-2">
                  <select className="flex-1 px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                    value={form.mes_inicio} onChange={e => setForm(p => ({ ...p, mes_inicio: e.target.value }))}>
                    {meses.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <select className="w-28 px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                    value={form.anio_inicio} onChange={e => setForm(p => ({ ...p, anio_inicio: e.target.value }))}>
                    {[2022, 2023, 2024, 2025, 2026, 2027].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                {mesInicioPreview && (
                  <p className="text-xs mt-1.5 px-1" style={{ color: mesInicioPreview.startsWith("Cuota") ? "#22c55e" : "#f59e0b" }}>
                    → {mesInicioPreview}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <div className="p-3 rounded-lg" style={{ backgroundColor: "#0f172a" }}>
                  <p className="text-xs" style={{ color: "#64748b" }}>Monto por cuota</p>
                  <p className="text-lg font-bold" style={{ color: "#38bdf8" }}>${parseFloat(montoCuotaCalc).toLocaleString("es-AR")}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowForm(false); setEditandoId(null); }} className="flex-1 py-2 rounded-lg text-sm" style={{ backgroundColor: "#334155", color: "#94a3b8" }}>Cancelar</button>
              <button onClick={guardar} disabled={saving || !form.tarjeta_id || !form.descripcion || !form.monto_total}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
                style={{ backgroundColor: editandoId ? "#f59e0b" : "#0ea5e9" }}>
                {saving ? "Guardando..." : editandoId ? "Guardar cambios" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal nueva tarjeta */}
      {showFormTarjeta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "#00000088" }}>
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: "#e2e8f0" }}>Nueva tarjeta</h2>
              <button onClick={() => setShowFormTarjeta(false)} style={{ color: "#64748b" }}>✕</button>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Nombre</label>
              <input className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                placeholder="Ej: Visa Tincho" value={formTarjeta.nombre}
                onChange={e => setFormTarjeta(p => ({ ...p, nombre: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Tipo</label>
              <select className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                value={formTarjeta.tipo} onChange={e => setFormTarjeta(p => ({ ...p, tipo: e.target.value }))}>
                <option value="crédito">Crédito</option>
                <option value="débito">Débito</option>
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Color</label>
              <div className="flex gap-2 flex-wrap">
                {coloresTarjeta.map(c => (
                  <button key={c} onClick={() => setFormTarjeta(p => ({ ...p, color: c }))}
                    className="w-8 h-8 rounded-full" style={{ backgroundColor: c, outline: formTarjeta.color === c ? "3px solid white" : "none", outlineOffset: "2px" }} />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowFormTarjeta(false)} className="flex-1 py-2 rounded-lg text-sm" style={{ backgroundColor: "#334155", color: "#94a3b8" }}>Cancelar</button>
              <button onClick={guardarTarjeta} disabled={!formTarjeta.nombre.trim()}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: "#22c55e" }}>
                Crear tarjeta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tarjetas */}
      {tarjetas.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <p style={{ color: "#64748b" }}>No hay tarjetas cargadas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tarjetas.map(tarjeta => {
            const esPersonal     = personalIds.has(tarjeta.id);
            const saldoArrastrado = getSaldoArrastrado(tarjeta.id);
            const gastosDelMes   = gastosCuotas
              .filter(g => g.tarjeta_id === tarjeta.id)
              .map(g => ({ ...g, cuota: getCuotaParaMes(g, mesIdx, anioNum) }))
              .filter(g => g.cuota !== null);
            const totalCuotas = gastosDelMes.reduce((s: number, g: any) => s + Number(g.monto_cuota), 0);
            const totalMes    = totalCuotas + saldoArrastrado;
            const pagado      = pagosMes[tarjeta.id] ?? 0;
            const saldoPago   = pagado - totalMes;
            const isExp       = expandidas.includes(tarjeta.id);

            return (
              <div key={tarjeta.id} className="rounded-xl overflow-hidden"
                style={{ backgroundColor: "#1e293b", border: `1px solid ${esPersonal ? "#334155" : "#334155"}`, opacity: esPersonal ? 0.85 : 1 }}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: isExp ? "1px solid #334155" : "none" }}>
                  {/* Toggle personal */}
                  <button onClick={() => togglePersonal(tarjeta.id)} title={esPersonal ? "Incluir en total compartido" : "Marcar como personal (excluir del total)"}
                    className="p-1.5 rounded-lg mr-2 flex-shrink-0"
                    style={{ backgroundColor: esPersonal ? "#1e1b4b" : "transparent", color: esPersonal ? "#818cf8" : "#334155" }}
                    onMouseEnter={e => (e.currentTarget.style.color = esPersonal ? "#a5b4fc" : "#64748b")}
                    onMouseLeave={e => (e.currentTarget.style.color = esPersonal ? "#818cf8" : "#334155")}>
                    {esPersonal ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>

                  <button className="flex-1 flex items-center gap-3 text-left"
                    onClick={() => setExpandidas(prev => prev.includes(tarjeta.id) ? prev.filter(x => x !== tarjeta.id) : [...prev, tarjeta.id])}>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: (tarjeta.color || "#0ea5e9") + "22" }}>
                      <CreditCard size={18} style={{ color: tarjeta.color || "#0ea5e9" }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold" style={{ color: "#e2e8f0" }}>{tarjeta.nombre}</p>
                        {esPersonal && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#1e1b4b", color: "#818cf8" }}>Personal</span>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: "#64748b" }}>
                        {tarjeta.tipo} · {gastosDelMes.length} cuota{gastosDelMes.length !== 1 ? "s" : ""} este mes
                        {saldoArrastrado > 0 && <span style={{ color: "#f59e0b" }}> · +${saldoArrastrado.toLocaleString("es-AR")} arrastrado</span>}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-4 ml-4">
                    <button className="text-right" onClick={() => setExpandidas(prev => prev.includes(tarjeta.id) ? prev.filter(x => x !== tarjeta.id) : [...prev, tarjeta.id])}>
                      <p className="text-xs" style={{ color: "#64748b" }}>Total {meses[mesIdx]}</p>
                      <p className="font-bold text-lg" style={{ color: tarjeta.color || "#0ea5e9" }}>
                        ${totalMes.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </button>
                    <button onClick={() => setExpandidas(prev => prev.includes(tarjeta.id) ? prev.filter(x => x !== tarjeta.id) : [...prev, tarjeta.id])}>
                      {isExp ? <ChevronUp size={18} style={{ color: "#64748b" }} /> : <ChevronDown size={18} style={{ color: "#64748b" }} />}
                    </button>
                  </div>
                </div>

                {/* Contenido expandido */}
                {isExp && (
                  <>
                    {(gastosDelMes.length > 0 || saldoArrastrado > 0) ? (
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ backgroundColor: "#0f172a" }}>
                            {["Concepto", "Inicio", "Cuota", "Monto cuota", "Saldo restante", ""].map(h => (
                              <th key={h} className="text-left px-5 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {/* Fila de saldo arrastrado del mes anterior */}
                          {saldoArrastrado > 0 && (
                            <tr style={{ borderTop: "1px solid #33415530", backgroundColor: "#451a0311" }}>
                              <td className="px-5 py-3 font-medium" style={{ color: "#f59e0b" }}>
                                ↩ Saldo pendiente {meses[prevDate.getMonth()]} {prevDate.getFullYear()}
                              </td>
                              <td className="px-5 py-3 text-xs" style={{ color: "#64748b" }}>—</td>
                              <td className="px-5 py-3 text-xs" style={{ color: "#64748b" }}>—</td>
                              <td className="px-5 py-3 font-semibold" style={{ color: "#f59e0b" }}>
                                ${saldoArrastrado.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td colSpan={2} className="px-5 py-3">
                                <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: "#451a03", color: "#f59e0b" }}>
                                  Arrastrado
                                </span>
                              </td>
                            </tr>
                          )}
                          {/* Cuotas normales */}
                          {gastosDelMes.map((g: any) => (
                            <tr key={g.id} style={{ borderTop: "1px solid #33415530" }}>
                              <td className="px-5 py-3 font-medium" style={{ color: "#e2e8f0" }}>{g.descripcion}</td>
                              <td className="px-5 py-3 text-xs" style={{ color: "#64748b" }}>
                                {meses[parseInt(g.mes_inicio.split("-")[1]) - 1]} {g.mes_inicio.split("-")[0]}
                              </td>
                              <td className="px-5 py-3" style={{ color: "#94a3b8" }}>{g.cuota.numero}/{g.cantidad_cuotas}</td>
                              <td className="px-5 py-3 font-medium" style={{ color: tarjeta.color || "#0ea5e9" }}>
                                ${g.monto_cuota.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-5 py-3">
                                {g.cuota.esUltima
                                  ? <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: "#14532d", color: "#22c55e" }}>✓ Última cuota</span>
                                  : <span style={{ color: "#94a3b8" }}>${g.cuota.saldo.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>}
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-3 justify-end">
                                  <button onClick={e => { e.stopPropagation(); abrirEditar(g); }} style={{ color: "#475569" }}
                                    onMouseEnter={e => (e.currentTarget.style.color = "#38bdf8")}
                                    onMouseLeave={e => (e.currentTarget.style.color = "#475569")}><Edit2 size={14} /></button>
                                  <button onClick={e => { e.stopPropagation(); eliminar(g.id); }} style={{ color: "#475569" }}
                                    onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                                    onMouseLeave={e => (e.currentTarget.style.color = "#475569")}><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{ borderTop: "1px solid #334155", backgroundColor: "#0f172a44" }}>
                            <td colSpan={3} className="px-5 py-3 text-sm font-semibold" style={{ color: "#64748b" }}>Total cuotas {meses[mesIdx]}</td>
                            <td colSpan={3} className="px-5 py-3 text-lg font-bold" style={{ color: tarjeta.color || "#0ea5e9" }}>
                              ${totalMes.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    ) : (
                      <div className="px-5 py-4 text-center text-sm" style={{ color: "#475569" }}>
                        Sin cuotas activas en {meses[mesIdx]} {anio}
                      </div>
                    )}

                    {/* Resumen pago */}
                    {(pagado > 0 || totalMes > 0) && (
                      <div className="px-5 py-3 flex items-center gap-6" style={{ borderTop: "1px solid #334155", backgroundColor: "#0f172a66" }}>
                        <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "#475569" }}>Resumen pago {meses[mesIdx]}</span>
                        <div className="flex items-center gap-1.5 text-sm">
                          <span style={{ color: "#64748b" }}>Cuotas:</span>
                          <span className="font-semibold" style={{ color: "#e2e8f0" }}>${totalMes.toLocaleString("es-AR")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <span style={{ color: "#64748b" }}>Pagado:</span>
                          <span className="font-semibold" style={{ color: pagado > 0 ? "#22c55e" : "#475569" }}>
                            {pagado > 0 ? `$${pagado.toLocaleString("es-AR")}` : "Sin registrar"}
                          </span>
                        </div>
                        <div className="ml-auto">
                          {pagado === 0
                            ? <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "#1e1b4b", color: "#818cf8" }}>Pendiente</span>
                            : saldoPago >= 0
                              ? <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "#14532d", color: "#22c55e" }}>✓ ${saldoPago.toLocaleString("es-AR")} adelantado</span>
                              : <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "#450a0a", color: "#ef4444" }}>⚠ ${Math.abs(saldoPago).toLocaleString("es-AR")} pendiente</span>
                          }
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Total compartido */}
      {tarjetas.length > 0 && (
        <div className="rounded-xl p-5" style={{ backgroundColor: "#172554", border: "2px solid #1d4ed8" }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold" style={{ color: "#93c5fd" }}>Total cuotas compartidas — {meses[mesIdx]} {anio}</p>
              {personalIds.size > 0 && (
                <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                  {personalIds.size} tarjeta{personalIds.size > 1 ? "s" : ""} personal{personalIds.size > 1 ? "es" : ""} excluida{personalIds.size > 1 ? "s" : ""}
                </p>
              )}
            </div>
            <p className="text-2xl font-bold" style={{ color: "#38bdf8" }}>
              ${totalCompartido.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
