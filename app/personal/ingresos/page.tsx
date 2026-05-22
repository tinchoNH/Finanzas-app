"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Ingreso = {
  id: string;
  user_id: string;
  tipo: string;
  monto: number;
  fecha_esperada: string;
  mes: string;
  recurrente: boolean;
};

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function MisIngresosPage() {
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth());
  const [anio, setAnio] = useState(now.getFullYear());
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    tipo: "",
    monto: "",
    fecha_esperada: new Date().toISOString().split("T")[0],
    recurrente: false,
  });

  const mesStr = `${anio}-${String(mes + 1).padStart(2, "0")}`;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUserId(data.session.user.id);
    });
  }, []);

  useEffect(() => { if (userId) cargarIngresos(); }, [userId, mesStr]);

  async function cargarIngresos() {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from("ingresos")
      .select("*")
      .eq("mes", mesStr)
      .eq("user_id", userId)
      .order("fecha_esperada");
    if (data) setIngresos(data as Ingreso[]);
    setLoading(false);
  }

  async function guardarIngreso() {
    if (!form.tipo.trim() || !form.monto || !userId) return;
    const { data } = await supabase
      .from("ingresos")
      .insert({
        user_id: userId,
        tipo: form.tipo.trim(),
        monto: parseFloat(form.monto),
        fecha_esperada: form.fecha_esperada,
        mes: mesStr,
        recurrente: form.recurrente,
      })
      .select()
      .single();
    if (data) setIngresos(prev => [...prev, data as Ingreso]);
    resetForm();
  }

  async function eliminarIngreso(id: string) {
    if (!confirm("¿Eliminar este ingreso?")) return;
    await supabase.from("ingresos").delete().eq("id", id);
    setIngresos(prev => prev.filter(i => i.id !== id));
  }

  function resetForm() {
    setForm({ tipo: "", monto: "", fecha_esperada: new Date().toISOString().split("T")[0], recurrente: false });
    setShowForm(false);
  }

  const totalMes = ingresos.reduce((s, i) => s + i.monto, 0);
  const recurrentes = ingresos.filter(i => i.recurrente).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Mis Ingresos</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            {MESES[mes]} {anio} ·{" "}
            <span style={{ color: "#22c55e" }}>Total: ${totalMes.toLocaleString("es-AR")}</span>
          </p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white"
          style={{ backgroundColor: "#22c55e" }}>
          <Plus size={16} /> Nuevo ingreso
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <p className="text-xs mb-1" style={{ color: "#64748b" }}>Total {MESES[mes]}</p>
          <p className="text-2xl font-bold" style={{ color: "#22c55e" }}>${totalMes.toLocaleString("es-AR")}</p>
          <p className="text-xs mt-1" style={{ color: "#475569" }}>{ingresos.length} ingreso{ingresos.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <p className="text-xs mb-1" style={{ color: "#64748b" }}>Recurrentes</p>
          <p className="text-2xl font-bold" style={{ color: "#38bdf8" }}>{recurrentes}</p>
          <p className="text-xs mt-1" style={{ color: "#475569" }}>ingresos fijos</p>
        </div>
      </div>

      {/* Filtros de mes/año */}
      <div className="flex gap-3">
        <select className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" }}
          value={mes} onChange={e => setMes(Number(e.target.value))}>
          {MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <select className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" }}
          value={anio} onChange={e => setAnio(Number(e.target.value))}>
          {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "#00000088" }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: "#e2e8f0" }}>Nuevo ingreso personal</h2>
              <button onClick={resetForm} style={{ color: "#64748b" }}><X size={18} /></button>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Tipo de ingreso</label>
              <input className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                placeholder="Ej: Sueldo, Freelance, Alquiler"
                value={form.tipo}
                onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Monto ($)</label>
                <input type="number" className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  placeholder="0" value={form.monto}
                  onChange={e => setForm(p => ({ ...p, monto: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Fecha esperada</label>
                <input type="date" className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  value={form.fecha_esperada}
                  onChange={e => setForm(p => ({ ...p, fecha_esperada: e.target.value }))} />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.recurrente}
                onChange={e => setForm(p => ({ ...p, recurrente: e.target.checked }))} />
              <span className="text-sm" style={{ color: "#94a3b8" }}>Ingreso recurrente (se repite todos los meses)</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button onClick={resetForm} className="flex-1 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "#334155", color: "#94a3b8" }}>Cancelar</button>
              <button onClick={guardarIngreso}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: !form.tipo.trim() || !form.monto ? "#14532d66" : "#22c55e" }}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <p style={{ color: "#64748b" }}>Cargando...</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #334155" }}>
            <h2 className="font-semibold" style={{ color: "#e2e8f0" }}>💵 Ingresos — {MESES[mes]} {anio}</h2>
            <span className="text-sm font-bold" style={{ color: "#22c55e" }}>${totalMes.toLocaleString("es-AR")}</span>
          </div>
          {ingresos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-sm" style={{ color: "#64748b" }}>Sin ingresos para {MESES[mes]} {anio}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #334155", backgroundColor: "#0f172a" }}>
                      {["Fecha esperada", "Tipo", "Monto", "Recurrente", ""].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                          style={{ color: "#64748b" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ingresos.map(i => (
                      <tr key={i.id} style={{ borderBottom: "1px solid #33415530" }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0f172a44")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#64748b" }}>
                          {new Date(i.fecha_esperada + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}
                        </td>
                        <td className="px-4 py-3 font-medium" style={{ color: "#e2e8f0" }}>{i.tipo}</td>
                        <td className="px-4 py-3 font-semibold" style={{ color: "#22c55e" }}>
                          ${i.monto.toLocaleString("es-AR")}
                        </td>
                        <td className="px-4 py-3">
                          {i.recurrente ? (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs w-fit"
                              style={{ backgroundColor: "#1e3a5f", color: "#38bdf8" }}>
                              <RefreshCw size={10} /> Recurrente
                            </span>
                          ) : (
                            <span className="text-xs" style={{ color: "#475569" }}>—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => eliminarIngreso(i.id)} className="p-1.5 rounded-lg"
                            style={{ color: "#475569" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 flex justify-between text-sm"
                style={{ borderTop: "1px solid #334155", color: "#64748b" }}>
                <span>{ingresos.length} ingreso{ingresos.length !== 1 ? "s" : ""}</span>
                <span>Total: <strong style={{ color: "#22c55e" }}>${totalMes.toLocaleString("es-AR")}</strong></span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
