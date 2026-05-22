"use client";

import { useState, useEffect } from "react";
import { Plus, ChevronDown, ChevronUp, CreditCard, Loader2, Edit2, Trash2, Info } from "lucide-react";
import { supabase, mesAString } from "@/lib/supabase";

const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const mesNombreANum: Record<string, number> = { "Enero":1,"Febrero":2,"Marzo":3,"Abril":4,"Mayo":5,"Junio":6,"Julio":7,"Agosto":8,"Septiembre":9,"Octubre":10,"Noviembre":11,"Diciembre":12 };

const formVacio = {
  tarjeta_id: "", descripcion: "", monto_total: "", cantidad_cuotas: "1",
  mes_inicio: meses[new Date().getMonth()], anio_inicio: String(new Date().getFullYear()),
};

export default function MisTarjetasPage() {
  const [mesIdx, setMesIdx]   = useState(new Date().getMonth());
  const [anio, setAnio]       = useState(String(new Date().getFullYear()));
  const [expandidas, setExpandidas] = useState<string[]>([]);
  const [showForm, setShowForm]     = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [userId, setUserId]     = useState<string | null>(null);
  const [tarjetas, setTarjetas] = useState<any[]>([]);
  const [gastosCuotas, setGastosCuotas] = useState<any[]>([]);
  const [pagosMes, setPagosMes]     = useState<Record<string, number>>({});
  const [pagosPorMes, setPagosPorMes] = useState<Record<string, Record<string, number>>>({});
  const [form, setForm] = useState({ ...formVacio });
  const [showFormTarjeta, setShowFormTarjeta] = useState(false);
  const [formTarjeta, setFormTarjeta] = useState({ nombre: "", tipo: "crédito", color: "#a855f7" });
  const [tieneCatTarjetas, setTieneCatTarjetas] = useState(true);
  const coloresTarjeta = ["#a855f7","#0ea5e9","#22c55e","#f59e0b","#ef4444","#ec4899","#f97316","#14b8a6"];

  const anioNum      = parseInt(anio);
  const mesStr       = `${anio}-${String(mesIdx + 1).padStart(2, "0")}`;
  const prevDate     = new Date(anioNum, mesIdx - 1, 1);
  const mesAnteriorStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUserId(data.session.user.id);
    });
  }, []);

  useEffect(() => { if (userId) cargar(); }, [userId]);
  useEffect(() => { if (tarjetas.length > 0 && userId) cargarPagos(); }, [mesStr, tarjetas]);

  async function cargar() {
    if (!userId) return;
    setLoading(true);
    const [{ data: tjs }, { data: gc }] = await Promise.all([
      supabase.from("tarjetas").select("*").eq("user_id", userId).order("nombre"),
      supabase.from("gastos_cuotas").select("*, tarjeta:tarjetas(*)").eq("user_id", userId).eq("activo", true),
    ]);
    if (tjs) { setTarjetas(tjs); setExpandidas(tjs.map((t: any) => t.id)); }
    if (gc) setGastosCuotas(gc);
    setLoading(false);
  }

  async function cargarPagos() {
    if (!userId) return;
    // Buscar la categoría personal "Tarjetas" del usuario
    const { data: cat } = await supabase
      .from("categorias")
      .select("id")
      .eq("nombre", "Tarjetas")
      .eq("user_id", userId)
      .limit(1);
    const catId = (cat as any)?.[0]?.id;
    setTieneCatTarjetas(!!catId);
    if (!catId) return;

    const mesesACargar: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(anioNum, mesIdx - i, 1);
      mesesACargar.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const { data: gastos } = await supabase
      .from("gastos")
      .select("monto, mes, subcategoria:subcategorias(nombre)")
      .eq("categoria_id", catId)
      .eq("user_id", userId)
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
    const d2 = new Date(anioNum, mesIdx - 2, 1);
    const m2Idx = d2.getMonth();
    const anio2 = d2.getFullYear();
    const m2Str = `${anio2}-${String(m2Idx + 1).padStart(2, "0")}`;
    const cuotas2 = gastosCuotas
      .filter(g => g.tarjeta_id === tarjetaId)
      .reduce((s: number, g: any) => { const c = getCuotaParaMes(g, m2Idx, anio2); return s + (c ? Number(g.monto_cuota) : 0); }, 0);
    const pagado2 = pagosPorMes[m2Str]?.[tarjetaId] ?? 0;
    const arrastrado2 = Math.max(0, cuotas2 - pagado2);
    const d1 = new Date(anioNum, mesIdx - 1, 1);
    const m1Idx = d1.getMonth();
    const anio1 = d1.getFullYear();
    const m1Str = `${anio1}-${String(m1Idx + 1).padStart(2, "0")}`;
    const cuotas1 = gastosCuotas
      .filter(g => g.tarjeta_id === tarjetaId)
      .reduce((s: number, g: any) => { const c = getCuotaParaMes(g, m1Idx, anio1); return s + (c ? Number(g.monto_cuota) : 0); }, 0);
    const pagado1 = pagosPorMes[m1Str]?.[tarjetaId] ?? 0;
    return Math.max(0, cuotas1 + arrastrado2 - pagado1);
  }

  async function guardarTarjeta() {
    if (!formTarjeta.nombre.trim() || !userId) return;
    const { data } = await supabase.from("tarjetas")
      .insert({ user_id: userId, nombre: formTarjeta.nombre.trim(), tipo: formTarjeta.tipo, color: formTarjeta.color })
      .select().single();
    if (data) { setTarjetas(prev => [...prev, data]); setExpandidas(prev => [...prev, data.id]); }
    setFormTarjeta({ nombre: "", tipo: "crédito", color: "#a855f7" });
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
    if (!form.tarjeta_id || !form.descripcion || !form.monto_total || !userId) return;
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
      const { data } = await supabase.from("gastos_cuotas")
        .insert({ user_id: userId, tarjeta_id: form.tarjeta_id, descripcion: form.descripcion, monto_total: monto, cantidad_cuotas: cuotas, monto_cuota: montoX, mes_inicio: mesIni, activo: true })
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

  const totalPersonal = tarjetas.reduce((s, t) => {
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
          <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Mis Tarjetas</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>Cuotas personales — {meses[mesIdx]} {anio}</p>
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
          <button onClick={abrirNuevo} className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium text-sm text-white" style={{ backgroundColor: "#a855f7" }}>
            <Plus size={16} /> <span className="hidden sm:inline">Cargar</span> gasto
          </button>
        </div>
      </div>

      {/* Banner si no tiene categoría Tarjetas */}
      {!tieneCatTarjetas && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "#1e1b4b", border: "1px solid #3730a3" }}>
          <Info size={16} style={{ color: "#818cf8", flexShrink: 0, marginTop: 2 }} />
          <p className="text-sm" style={{ color: "#a5b4fc" }}>
            Para registrar pagos, creá una categoría personal <strong>"Tarjetas"</strong> en{" "}
            <a href="/personal/categorias" style={{ color: "#c4b5fd", textDecoration: "underline" }}>Mis Categorías</a>{" "}
            con subcategorías que tengan el nombre exacto de cada tarjeta.
          </p>
        </div>
      )}

      {/* Total personal */}
      {tarjetas.length > 0 && (
        <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <p className="text-xs mb-1" style={{ color: "#64748b" }}>Total personal {meses[mesIdx]}</p>
          <p className="text-2xl font-bold" style={{ color: "#a855f7" }}>
            ${totalPersonal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      )}

      {/* Modal cargar gasto */}
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
                  placeholder="Ej: Zapatillas cuotas" value={form.descripcion}
                  onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Monto total ($)</label>
                <input type="number" className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  placeholder="60000" value={form.monto_total}
                  onChange={e => setForm(p => ({ ...p, monto_total: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Cantidad de cuotas</label>
                <input type="number" min={1} max={60} className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  placeholder="6" value={form.cantidad_cuotas}
                  onChange={e => setForm(p => ({ ...p, cantidad_cuotas: e.target.value }))} />
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
                  <p className="text-lg font-bold" style={{ color: "#a855f7" }}>${parseFloat(montoCuotaCalc).toLocaleString("es-AR")}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowForm(false); setEditandoId(null); }} className="flex-1 py-2 rounded-lg text-sm" style={{ backgroundColor: "#334155", color: "#94a3b8" }}>Cancelar</button>
              <button onClick={guardar} disabled={saving || !form.tarjeta_id || !form.descripcion || !form.monto_total}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
                style={{ backgroundColor: "#a855f7" }}>
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
              <h2 className="text-lg font-semibold" style={{ color: "#e2e8f0" }}>Nueva tarjeta personal</h2>
              <button onClick={() => setShowFormTarjeta(false)} style={{ color: "#64748b" }}>✕</button>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Nombre</label>
              <input className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                placeholder="Ej: Visa Personal" value={formTarjeta.nombre}
                onChange={e => setFormTarjeta(p => ({ ...p, nombre: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Tipo</label>
              <select className="w-full px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
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
          <p className="text-3xl mb-3">💳</p>
          <p className="text-sm" style={{ color: "#64748b" }}>No tenés tarjetas personales todavía.</p>
          <p className="text-xs mt-1" style={{ color: "#475569" }}>Creá la primera con el botón de arriba.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tarjetas.map(tarjeta => {
            const saldoArrastrado = getSaldoArrastrado(tarjeta.id);
            const gastosDelMes   = gastosCuotas
              .filter(g => g.tarjeta_id === tarjeta.id)
              .map(g => ({ ...g, cuota: getCuotaParaMes(g, mesIdx, anioNum) }))
              .filter(g => g.cuota !== null);
            const totalCuotas = gastosDelMes.reduce((s: number, g: any) => s + Number(g.monto_cuota), 0);
            const totalMes    = totalCuotas + saldoArrastrado;
            const pagado      = pagosMes[tarjeta.id] ?? 0;
            const isExp       = expandidas.includes(tarjeta.id);

            return (
              <div key={tarjeta.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: isExp ? "1px solid #334155" : "none" }}>
                  <button className="flex-1 flex items-center gap-3 text-left"
                    onClick={() => setExpandidas(prev => prev.includes(tarjeta.id) ? prev.filter(x => x !== tarjeta.id) : [...prev, tarjeta.id])}>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: (tarjeta.color || "#a855f7") + "22" }}>
                      <CreditCard size={18} style={{ color: tarjeta.color || "#a855f7" }} />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: "#e2e8f0" }}>{tarjeta.nombre}</p>
                      <p className="text-xs" style={{ color: "#64748b" }}>
                        {tarjeta.tipo} · {gastosDelMes.length} cuota{gastosDelMes.length !== 1 ? "s" : ""} este mes
                        {saldoArrastrado > 0 && <span style={{ color: "#f59e0b" }}> · +${saldoArrastrado.toLocaleString("es-AR")} arrastrado</span>}
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                      <p className="text-xs" style={{ color: "#64748b" }}>Total {meses[mesIdx]}</p>
                      <p className="font-bold text-lg" style={{ color: tarjeta.color || "#a855f7" }}>
                        ${totalMes.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <button onClick={() => setExpandidas(prev => prev.includes(tarjeta.id) ? prev.filter(x => x !== tarjeta.id) : [...prev, tarjeta.id])}>
                      {isExp ? <ChevronUp size={18} style={{ color: "#64748b" }} /> : <ChevronDown size={18} style={{ color: "#64748b" }} />}
                    </button>
                  </div>
                </div>

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
                          {saldoArrastrado > 0 && (
                            <tr style={{ borderTop: "1px solid #33415530", backgroundColor: "#451a0311" }}>
                              <td className="px-5 py-3 font-medium" style={{ color: "#f59e0b" }}>↩ Saldo pendiente {meses[prevDate.getMonth()]} {prevDate.getFullYear()}</td>
                              <td className="px-5 py-3 text-xs" style={{ color: "#64748b" }}>—</td>
                              <td className="px-5 py-3 text-xs" style={{ color: "#64748b" }}>—</td>
                              <td className="px-5 py-3 font-semibold" style={{ color: "#f59e0b" }}>
                                ${saldoArrastrado.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td colSpan={2} className="px-5 py-3">
                                <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: "#451a03", color: "#f59e0b" }}>Arrastrado</span>
                              </td>
                            </tr>
                          )}
                          {gastosDelMes.map((g: any) => (
                            <tr key={g.id} style={{ borderTop: "1px solid #33415530" }}>
                              <td className="px-5 py-3 font-medium" style={{ color: "#e2e8f0" }}>{g.descripcion}</td>
                              <td className="px-5 py-3 text-xs" style={{ color: "#64748b" }}>
                                {meses[parseInt(g.mes_inicio.split("-")[1]) - 1]} {g.mes_inicio.split("-")[0]}
                              </td>
                              <td className="px-5 py-3" style={{ color: "#94a3b8" }}>{g.cuota.numero}/{g.cantidad_cuotas}</td>
                              <td className="px-5 py-3 font-medium" style={{ color: tarjeta.color || "#a855f7" }}>
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
                                    onMouseEnter={e => (e.currentTarget.style.color = "#a855f7")}
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
                            <td colSpan={3} className="px-5 py-3 text-lg font-bold" style={{ color: tarjeta.color || "#a855f7" }}>
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

                    {(pagado > 0 || totalMes > 0) && (
                      <div className="px-5 py-3 flex items-center gap-6" style={{ borderTop: "1px solid #334155", backgroundColor: "#0f172a66" }}>
                        <div>
                          <p className="text-xs" style={{ color: "#64748b" }}>Total a pagar</p>
                          <p className="font-bold" style={{ color: tarjeta.color || "#a855f7" }}>${totalMes.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: "#64748b" }}>Pagado</p>
                          <p className="font-bold" style={{ color: "#22c55e" }}>${pagado.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: "#64748b" }}>{pagado >= totalMes ? "Saldo a favor" : "Pendiente"}</p>
                          <p className="font-bold" style={{ color: pagado >= totalMes ? "#22c55e" : "#ef4444" }}>
                            ${Math.abs(pagado - totalMes).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
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
    </div>
  );
}
