"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Edit2, Trash2, ChevronDown, ChevronUp, Landmark, HandCoins, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Deuda = {
  id: string;
  user_id: string;
  nombre: string;
  tipo: "cuotas" | "libre";
  monto_total: number;
  cuotas_total: number | null;
  interes_mensual: number | null;
  monto_cuota: number | null;
  cuotas_detalle: number[] | null;
  fecha_inicio: string;
  activa: boolean;
  notas: string | null;
  created_at: string;
};

type PagoDeuda = {
  id: string;
  monto: number;
  descripcion: string;
  fecha: string;
  mes: string;
};

const formVacio = {
  nombre: "",
  tipo: "cuotas" as "cuotas" | "libre",
  monto_total: "",
  cuotas_total: "",
  interes_mensual: "",
  monto_cuota: "",
  fecha_inicio: new Date().toISOString().split("T")[0],
  notas: "",
  cuotasDetalle: [] as string[],
};

export default function DeudasPage() {
  const [deudas, setDeudas] = useState<Deuda[]>([]);
  const [pagosMap, setPagosMap] = useState<Record<string, PagoDeuda[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [expandidas, setExpandidas] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ ...formVacio });

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setLoading(true);

    const { data: deudasData } = await supabase
      .from("deudas")
      .select("*")
      .eq("activa", true)
      .order("created_at", { ascending: false });

    const deudasList = (deudasData ?? []) as Deuda[];
    setDeudas(deudasList);

    // Buscar categoría "Deudas" o "Deuda" (flexible)
    const { data: catData } = await supabase
      .from("categorias")
      .select("id, nombre, subcategorias(id, nombre)")
      .in("nombre", ["Deudas", "Deuda"])
      .limit(1);

    const cat = (catData as any)?.[0];
    if (cat) {
      // Map subcategoria nombre (lowercase) → id
      const subMap: Record<string, string> = {};
      const subIdToNombre: Record<string, string> = {};
      for (const sub of cat.subcategorias ?? []) {
        const key = sub.nombre.trim().toLowerCase();
        subMap[key] = sub.id;
        subIdToNombre[sub.id] = sub.nombre;
      }

      // Traer todos los gastos de esa categoría
      const { data: gastosData } = await supabase
        .from("gastos")
        .select("id, monto, descripcion, fecha, mes, subcategoria_id")
        .eq("categoria_id", cat.id)
        .order("fecha", { ascending: true });

      const allGastos = (gastosData ?? []) as any[];

      const map: Record<string, PagoDeuda[]> = {};
      for (const d of deudasList) {
        const deudaKey = d.nombre.trim().toLowerCase();
        // Match exacto primero, luego parcial (subcategoria contiene nombre deuda o viceversa)
        let subId = subMap[deudaKey];
        if (!subId) {
          const match = Object.entries(subMap).find(([subKey]) =>
            subKey.includes(deudaKey) || deudaKey.includes(subKey)
          );
          if (match) subId = match[1];
        }

        if (subId) {
          map[d.id] = allGastos
            .filter((g: any) => g.subcategoria_id === subId)
            .map((g: any) => ({ id: g.id, monto: Number(g.monto), descripcion: g.descripcion, fecha: g.fecha, mes: g.mes }));
        } else {
          map[d.id] = [];
        }
      }
      setPagosMap(map);
    } else {
      // No se encontró categoría Deudas/Deuda
      const map: Record<string, PagoDeuda[]> = {};
      for (const d of deudasList) map[d.id] = [];
      setPagosMap(map);
    }

    setLoading(false);
  }

  function toggleExpand(id: string) {
    setExpandidas(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function abrirNuevo() {
    setEditandoId(null);
    setForm({ ...formVacio, cuotasDetalle: [] });
    setShowForm(true);
  }

  function abrirEditar(d: Deuda) {
    setEditandoId(d.id);
    setForm({
      nombre: d.nombre,
      tipo: d.tipo,
      monto_total: String(d.monto_total),
      cuotas_total: d.cuotas_total ? String(d.cuotas_total) : "",
      interes_mensual: d.interes_mensual ? String(d.interes_mensual) : "",
      monto_cuota: d.monto_cuota ? String(d.monto_cuota) : "",
      fecha_inicio: d.fecha_inicio,
      notas: d.notas ?? "",
      cuotasDetalle: d.cuotas_detalle ? d.cuotas_detalle.map(String) : [],
    });
    setShowForm(true);
  }

  // Cuando cambia cantidad de cuotas, ajustar array de detalle
  function handleCuotasTotalChange(val: string) {
    const n = parseInt(val) || 0;
    const prev = form.cuotasDetalle;
    const next = Array.from({ length: n }, (_, i) => prev[i] ?? "");
    setForm({ ...form, cuotas_total: val, cuotasDetalle: next });
  }

  function handleCuotaDetalleChange(idx: number, val: string) {
    const next = [...form.cuotasDetalle];
    next[idx] = val;
    setForm({ ...form, cuotasDetalle: next });
  }

  async function guardar() {
    if (!form.nombre.trim() || !form.monto_total) return;
    setSaving(true);

    const isCuotas = form.tipo === "cuotas";
    const cuotasDetalle = isCuotas && form.cuotasDetalle.length > 0
      ? form.cuotasDetalle.map(v => parseFloat(v) || 0)
      : null;

    const payload: any = {
      nombre: form.nombre.trim(),
      tipo: form.tipo,
      monto_total: parseFloat(form.monto_total),
      cuotas_total: isCuotas && form.cuotas_total ? parseInt(form.cuotas_total) : null,
      interes_mensual: isCuotas && form.interes_mensual ? parseFloat(form.interes_mensual) : null,
      monto_cuota: isCuotas && form.monto_cuota ? parseFloat(form.monto_cuota) : null,
      cuotas_detalle: cuotasDetalle,
      fecha_inicio: form.fecha_inicio,
      notas: form.notas.trim() || null,
    };

    if (editandoId) {
      const { data } = await supabase.from("deudas").update(payload).eq("id", editandoId).select().single();
      if (data) setDeudas(prev => prev.map(d => d.id === editandoId ? data as Deuda : d));
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setSaving(false); return; }
      payload.user_id = user.id;
      const { data } = await supabase.from("deudas").insert(payload).select().single();
      if (data) setDeudas(prev => [data as Deuda, ...prev]);
    }

    setShowForm(false);
    setEditandoId(null);
    setForm({ ...formVacio });
    setSaving(false);
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar esta deuda?")) return;
    await supabase.from("deudas").update({ activa: false }).eq("id", id);
    setDeudas(prev => prev.filter(d => d.id !== id));
  }

  // Helpers
  function getTotalPagado(deudaId: string): number {
    return (pagosMap[deudaId] ?? []).reduce((s, p) => s + p.monto, 0);
  }

  function getMontoTotalConDetalle(d: Deuda): number {
    if (d.cuotas_detalle && d.cuotas_detalle.length > 0) {
      return d.cuotas_detalle.reduce((s, v) => s + v, 0);
    }
    return d.monto_total;
  }

  function getSaldoRestante(d: Deuda): number {
    return Math.max(0, getMontoTotalConDetalle(d) - getTotalPagado(d.id));
  }

  function getProgreso(d: Deuda): number {
    const total = getMontoTotalConDetalle(d);
    if (total <= 0) return 100;
    return Math.min(100, (getTotalPagado(d.id) / total) * 100);
  }

  function getCuotasPagadas(d: Deuda): number {
    return (pagosMap[d.id] ?? []).length;
  }

  // Totales
  const totalDeuda = deudas.reduce((s, d) => s + getMontoTotalConDetalle(d), 0);
  const totalPagado = deudas.reduce((s, d) => s + getTotalPagado(d.id), 0);
  const totalRestante = totalDeuda - totalPagado;

  // Suma de cuotas detalle en el form
  const sumaCuotasForm = form.cuotasDetalle.reduce((s, v) => s + (parseFloat(v) || 0), 0);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={24} className="animate-spin" style={{ color: "#64748b" }} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Deudas</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Total: ${totalDeuda.toLocaleString("es-AR")} &middot; Pagado: ${totalPagado.toLocaleString("es-AR")} &middot; Restante: ${totalRestante.toLocaleString("es-AR")}
          </p>
        </div>
        <button onClick={abrirNuevo} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "#8b5cf6" }}>
          <Plus size={16} /> Nueva deuda
        </button>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <p className="text-xs font-medium mb-1" style={{ color: "#64748b" }}>Total deuda</p>
          <p className="text-xl font-bold" style={{ color: "#e2e8f0" }}>${totalDeuda.toLocaleString("es-AR")}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <p className="text-xs font-medium mb-1" style={{ color: "#64748b" }}>Total pagado</p>
          <p className="text-xl font-bold" style={{ color: "#22c55e" }}>${totalPagado.toLocaleString("es-AR")}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <p className="text-xs font-medium mb-1" style={{ color: "#64748b" }}>Saldo restante</p>
          <p className="text-xl font-bold" style={{ color: "#ef4444" }}>${totalRestante.toLocaleString("es-AR")}</p>
        </div>
      </div>

      {/* Barra de progreso general */}
      {totalDeuda > 0 && (
        <div className="rounded-xl p-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: "#94a3b8" }}>Progreso general</span>
            <span style={{ color: "#e2e8f0" }}>{((totalPagado / totalDeuda) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full rounded-full h-3" style={{ backgroundColor: "#334155" }}>
            <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (totalPagado / totalDeuda) * 100)}%`, backgroundColor: "#8b5cf6" }} />
          </div>
        </div>
      )}

      {/* Lista de deudas */}
      {deudas.length === 0 ? (
        <div className="text-center py-12 rounded-xl" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <Landmark size={40} className="mx-auto mb-3" style={{ color: "#334155" }} />
          <p style={{ color: "#64748b" }}>No hay deudas registradas</p>
          <p className="text-sm mt-1" style={{ color: "#475569" }}>Cargá una deuda desde el botón "Nueva deuda"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deudas.map(d => {
            const pagado = getTotalPagado(d.id);
            const totalConDetalle = getMontoTotalConDetalle(d);
            const restante = getSaldoRestante(d);
            const progreso = getProgreso(d);
            const pagos = pagosMap[d.id] ?? [];
            const expanded = expandidas.has(d.id);
            const isCuotas = d.tipo === "cuotas";
            const tieneDetalle = d.cuotas_detalle && d.cuotas_detalle.length > 0;

            return (
              <div key={d.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
                {/* Header de la deuda */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {isCuotas ? <Landmark size={16} style={{ color: "#8b5cf6" }} /> : <HandCoins size={16} style={{ color: "#f59e0b" }} />}
                        <h3 className="font-semibold" style={{ color: "#e2e8f0" }}>{d.nombre}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{
                          backgroundColor: isCuotas ? "#8b5cf620" : "#f59e0b20",
                          color: isCuotas ? "#8b5cf6" : "#f59e0b",
                        }}>
                          {isCuotas ? "Cuotas" : "Libre"}
                        </span>
                      </div>

                      <div className="flex gap-4 text-sm mt-2 flex-wrap" style={{ color: "#94a3b8" }}>
                        <span>Total: <strong style={{ color: "#e2e8f0" }}>${totalConDetalle.toLocaleString("es-AR")}</strong></span>
                        {isCuotas && d.cuotas_total && (
                          <span>Cuotas: <strong style={{ color: "#e2e8f0" }}>{getCuotasPagadas(d)}/{d.cuotas_total}</strong></span>
                        )}
                        {isCuotas && d.interes_mensual && d.interes_mensual > 0 && (
                          <span>Interés: <strong style={{ color: "#e2e8f0" }}>{d.interes_mensual}%</strong></span>
                        )}
                      </div>

                      {d.notas && (
                        <p className="text-xs mt-2" style={{ color: "#64748b" }}>{d.notas}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button onClick={() => abrirEditar(d)} className="p-1.5 rounded-lg hover:bg-slate-700" style={{ color: "#64748b" }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => eliminar(d.id)} className="p-1.5 rounded-lg hover:bg-slate-700" style={{ color: "#64748b" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: "#22c55e" }}>Pagado: ${pagado.toLocaleString("es-AR")}</span>
                      <span style={{ color: "#ef4444" }}>Restante: ${restante.toLocaleString("es-AR")}</span>
                    </div>
                    <div className="w-full rounded-full h-2.5" style={{ backgroundColor: "#334155" }}>
                      <div className="h-2.5 rounded-full transition-all duration-500" style={{
                        width: `${progreso}%`,
                        backgroundColor: progreso >= 100 ? "#22c55e" : "#8b5cf6",
                      }} />
                    </div>
                    <p className="text-xs text-right mt-1" style={{ color: "#64748b" }}>{progreso.toFixed(1)}%</p>
                  </div>

                  {/* Detalle cuota por cuota */}
                  {isCuotas && tieneDetalle && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium mb-1" style={{ color: "#94a3b8" }}>Detalle de cuotas</p>
                      {d.cuotas_detalle!.map((monto, idx) => {
                        const cuotaNum = idx + 1;
                        const estaPagada = cuotaNum <= pagos.length;
                        return (
                          <div key={idx} className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs" style={{
                            backgroundColor: estaPagada ? "#22c55e10" : "#0f172a",
                            border: `1px solid ${estaPagada ? "#22c55e30" : "#334155"}`,
                          }}>
                            <div className="flex items-center gap-2">
                              {estaPagada ? (
                                <Check size={12} style={{ color: "#22c55e" }} />
                              ) : (
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#334155", display: "inline-block" }} />
                              )}
                              <span style={{ color: estaPagada ? "#22c55e" : "#94a3b8" }}>
                                Cuota {cuotaNum}/{d.cuotas_detalle!.length}
                              </span>
                            </div>
                            <span className="font-medium" style={{ color: estaPagada ? "#22c55e" : "#e2e8f0" }}>
                              ${monto.toLocaleString("es-AR")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Historial de pagos (expandible) */}
                {pagos.length > 0 && (
                  <>
                    <button onClick={() => toggleExpand(d.id)} className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium" style={{ borderTop: "1px solid #334155", color: "#94a3b8" }}>
                      <span>Historial de pagos ({pagos.length})</span>
                      {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {expanded && (
                      <div className="px-4 pb-3">
                        <table className="w-full text-sm">
                          <thead>
                            <tr style={{ color: "#64748b" }}>
                              <th className="text-left py-1 text-xs font-medium">Fecha</th>
                              <th className="text-left py-1 text-xs font-medium">Descripcion</th>
                              <th className="text-right py-1 text-xs font-medium">Monto</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pagos.map(p => (
                              <tr key={p.id} style={{ borderTop: "1px solid #1e293b" }}>
                                <td className="py-1.5 text-xs" style={{ color: "#94a3b8" }}>{new Date(p.fecha + "T12:00:00").toLocaleDateString("es-AR")}</td>
                                <td className="py-1.5 text-xs" style={{ color: "#e2e8f0" }}>{p.descripcion}</td>
                                <td className="py-1.5 text-xs text-right font-medium" style={{ color: "#22c55e" }}>${p.monto.toLocaleString("es-AR")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}

                {pagos.length === 0 && (
                  <div className="px-4 pb-3 text-xs" style={{ borderTop: "1px solid #334155", color: "#475569", paddingTop: "8px" }}>
                    Sin pagos registrados. Cargalos desde Gastos con categoría "Deudas".
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal formulario */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: "#e2e8f0" }}>
              {editandoId ? "Editar deuda" : "Nueva deuda"}
            </h2>

            <div className="space-y-3">
              {/* Nombre */}
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "#94a3b8" }}>Nombre / Acreedor</label>
                <input
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: Préstamo Banco, Deuda Juan"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "#94a3b8" }}>Tipo</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setForm({ ...form, tipo: "cuotas" })}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: form.tipo === "cuotas" ? "#8b5cf620" : "#0f172a",
                      border: `1px solid ${form.tipo === "cuotas" ? "#8b5cf6" : "#334155"}`,
                      color: form.tipo === "cuotas" ? "#8b5cf6" : "#94a3b8",
                    }}
                  >
                    Cuotas fijas
                  </button>
                  <button
                    onClick={() => setForm({ ...form, tipo: "libre" })}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: form.tipo === "libre" ? "#f59e0b20" : "#0f172a",
                      border: `1px solid ${form.tipo === "libre" ? "#f59e0b" : "#334155"}`,
                      color: form.tipo === "libre" ? "#f59e0b" : "#94a3b8",
                    }}
                  >
                    Libre / Informal
                  </button>
                </div>
              </div>

              {/* Monto total */}
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "#94a3b8" }}>Monto original del préstamo</label>
                <input
                  type="number"
                  value={form.monto_total}
                  onChange={e => setForm({ ...form, monto_total: e.target.value })}
                  placeholder="1600000"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                />
              </div>

              {/* Campos solo para tipo cuotas */}
              {form.tipo === "cuotas" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: "#94a3b8" }}>Cantidad cuotas</label>
                      <input
                        type="number"
                        value={form.cuotas_total}
                        onChange={e => handleCuotasTotalChange(e.target.value)}
                        placeholder="6"
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                        style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: "#94a3b8" }}>Interés mensual %</label>
                      <input
                        type="number"
                        step="0.01"
                        value={form.interes_mensual}
                        onChange={e => setForm({ ...form, interes_mensual: e.target.value })}
                        placeholder="0"
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                        style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                      />
                    </div>
                  </div>

                  {/* Detalle cuota por cuota */}
                  {form.cuotasDetalle.length > 0 && (
                    <div>
                      <label className="text-xs font-medium mb-2 block" style={{ color: "#94a3b8" }}>
                        Monto de cada cuota
                        {sumaCuotasForm > 0 && (
                          <span style={{ color: "#64748b" }}> (suma: ${sumaCuotasForm.toLocaleString("es-AR")})</span>
                        )}
                      </label>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {form.cuotasDetalle.map((val, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-xs w-14 text-right flex-shrink-0" style={{ color: "#64748b" }}>
                              Cuota {idx + 1}
                            </span>
                            <input
                              type="number"
                              value={val}
                              onChange={e => handleCuotaDetalleChange(idx, e.target.value)}
                              placeholder="0"
                              className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none"
                              style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Fecha inicio */}
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "#94a3b8" }}>Fecha inicio</label>
                <input
                  type="date"
                  value={form.fecha_inicio}
                  onChange={e => setForm({ ...form, fecha_inicio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                />
              </div>

              {/* Notas */}
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "#94a3b8" }}>Notas (opcional)</label>
                <textarea
                  value={form.notas}
                  onChange={e => setForm({ ...form, notas: e.target.value })}
                  placeholder="Detalles adicionales..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowForm(false); setEditandoId(null); }} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "#334155", color: "#94a3b8" }}>
                Cancelar
              </button>
              <button onClick={guardar} disabled={saving} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "#8b5cf6" }}>
                {saving ? "Guardando..." : editandoId ? "Guardar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
