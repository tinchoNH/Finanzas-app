"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, X, Check, Edit2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Subcategoria = { id: string; nombre: string };
type Categoria = { id: string; nombre: string; icono: string; color: string; subcategorias: Subcategoria[] };
type Gasto = {
  id: string;
  user_id: string;
  categoria_id: string;
  subcategoria_id: string | null;
  monto: number;
  descripcion: string;
  fecha: string;
  mes: string;
  tiene_vencimiento: boolean;
  fecha_vencimiento: string | null;
  pagado: boolean;
  categoria?: { nombre: string; icono: string; color: string };
  subcategoria?: { nombre: string };
};

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function GastosPage() {
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth());
  const [anio, setAnio] = useState(now.getFullYear());
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [catFiltro, setCatFiltro] = useState("todas");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState({
    descripcion: "",
    monto: "",
    categoria_id: "",
    subcategoria_id: "",
    fecha: new Date().toISOString().split("T")[0],
    tiene_vencimiento: false,
    fecha_vencimiento: "",
    pagado: false,
  });

  const mesStr = `${anio}-${String(mes + 1).padStart(2, "0")}`;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setCurrentUserId(data.session.user.id);
    });
    cargarCategorias();
  }, []);

  useEffect(() => { cargarGastos(); }, [mesStr]);

  async function cargarCategorias() {
    const { data } = await supabase
      .from("categorias")
      .select("*, subcategorias(*)")
      .eq("activa", true)
      .order("orden");
    if (data) setCategorias(data as Categoria[]);
  }

  async function cargarGastos() {
    setLoading(true);
    const { data } = await supabase
      .from("gastos")
      .select("*, categoria:categorias(nombre,icono,color), subcategoria:subcategorias(nombre)")
      .eq("mes", mesStr)
      .order("fecha", { ascending: false });
    if (data) setGastos(data as Gasto[]);
    setLoading(false);
  }

  const subcatsFiltradas = categorias.find(c => c.id === form.categoria_id)?.subcategorias ?? [];

  function abrirEditar(g: Gasto) {
    setEditandoId(g.id);
    setForm({
      descripcion: g.descripcion,
      monto: String(g.monto),
      categoria_id: g.categoria_id,
      subcategoria_id: g.subcategoria_id ?? "",
      fecha: g.fecha,
      tiene_vencimiento: g.tiene_vencimiento,
      fecha_vencimiento: g.fecha_vencimiento ?? "",
      pagado: g.pagado,
    });
    setShowForm(true);
  }

  async function guardarGasto() {
    if (!form.monto || !form.categoria_id) return;
    const payload = {
      categoria_id: form.categoria_id,
      subcategoria_id: form.subcategoria_id || null,
      monto: parseFloat(form.monto),
      descripcion: form.descripcion.trim() || "-",
      fecha: form.fecha,
      tiene_vencimiento: form.tiene_vencimiento,
      fecha_vencimiento: form.tiene_vencimiento && form.fecha_vencimiento ? form.fecha_vencimiento : null,
      pagado: form.pagado,
    };

    if (editandoId) {
      const { data } = await supabase
        .from("gastos")
        .update(payload)
        .eq("id", editandoId)
        .select("*, categoria:categorias(nombre,icono,color), subcategoria:subcategorias(nombre)")
        .single();
      if (data) setGastos(prev => prev.map(g => g.id === editandoId ? data as Gasto : g));
    } else {
      const { data } = await supabase
        .from("gastos")
        .insert({ ...payload, user_id: currentUserId, mes: mesStr })
        .select("*, categoria:categorias(nombre,icono,color), subcategoria:subcategorias(nombre)")
        .single();
      if (data) setGastos(prev => [data as Gasto, ...prev]);
    }
    resetForm();
  }

  async function eliminarGasto(id: string) {
    if (!confirm("¿Eliminar este gasto?")) return;
    await supabase.from("gastos").delete().eq("id", id);
    setGastos(prev => prev.filter(g => g.id !== id));
  }

  async function togglePagado(g: Gasto) {
    await supabase.from("gastos").update({ pagado: !g.pagado }).eq("id", g.id);
    setGastos(prev => prev.map(x => x.id === g.id ? { ...x, pagado: !x.pagado } : x));
  }

  function resetForm() {
    setForm({
      descripcion: "", monto: "", categoria_id: "", subcategoria_id: "",
      fecha: new Date().toISOString().split("T")[0],
      tiene_vencimiento: false, fecha_vencimiento: "", pagado: false,
    });
    setEditandoId(null);
    setShowForm(false);
  }

  const gastosFiltrados = gastos.filter(g => {
    const matchBusqueda = g.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      (g.categoria?.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (g.subcategoria?.nombre || "").toLowerCase().includes(busqueda.toLowerCase());
    const matchCat = catFiltro === "todas" || g.categoria_id === catFiltro;
    return matchBusqueda && matchCat;
  });

  const totalFiltrado = gastosFiltrados.reduce((s, g) => s + g.monto, 0);
  const totalMes = gastos.reduce((s, g) => s + g.monto, 0);
  const pendientes = gastos.filter(g => !g.pagado).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Gastos</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            {MESES[mes]} {anio} · ${totalMes.toLocaleString("es-AR")} total
            {pendientes > 0 && <span className="ml-2" style={{ color: "#f59e0b" }}>· {pendientes} pendientes</span>}
          </p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white"
          style={{ backgroundColor: "#0ea5e9" }}>
          <Plus size={16} /> Nuevo gasto
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "#00000088" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: "#e2e8f0" }}>{editandoId ? "Editar Gasto" : "Nuevo Gasto"}</h2>
              <button onClick={resetForm} style={{ color: "#64748b" }}><X size={18} /></button>
            </div>

            <div>
              <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Descripción <span style={{ color: "#475569" }}>(opcional)</span></label>
              <input className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                placeholder="—"
                value={form.descripcion}
                onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && guardarGasto()} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Monto ($)</label>
                <input type="number" className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  placeholder="0"
                  value={form.monto}
                  onChange={e => setForm(p => ({ ...p, monto: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Fecha</label>
                <input type="date" className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  value={form.fecha}
                  onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Categoría</label>
                <select className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  value={form.categoria_id}
                  onChange={e => setForm(p => ({ ...p, categoria_id: e.target.value, subcategoria_id: "" }))}>
                  <option value="">Seleccionar...</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Subcategoría</label>
                <select className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  value={form.subcategoria_id}
                  onChange={e => setForm(p => ({ ...p, subcategoria_id: e.target.value }))}
                  disabled={!form.categoria_id}>
                  <option value="">Sin subcategoría</option>
                  {subcatsFiltradas.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox"
                  checked={form.tiene_vencimiento}
                  onChange={e => setForm(p => ({ ...p, tiene_vencimiento: e.target.checked }))} />
                <span className="text-sm" style={{ color: "#94a3b8" }}>Tiene fecha de vencimiento</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox"
                  checked={form.pagado}
                  onChange={e => setForm(p => ({ ...p, pagado: e.target.checked }))} />
                <span className="text-sm" style={{ color: "#94a3b8" }}>Ya pagado</span>
              </label>
            </div>

            {form.tiene_vencimiento && (
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Fecha de vencimiento</label>
                <input type="date" className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  value={form.fecha_vencimiento}
                  onChange={e => setForm(p => ({ ...p, fecha_vencimiento: e.target.value }))} />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={resetForm} className="flex-1 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "#334155", color: "#94a3b8" }}>Cancelar</button>
              <button onClick={guardarGasto}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: !form.monto || !form.categoria_id ? "#1e3a5f" : "#0ea5e9" }}>
                {editandoId ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg"
          style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <Search size={16} style={{ color: "#64748b" }} />
          <input className="flex-1 bg-transparent text-sm outline-none" style={{ color: "#e2e8f0" }}
            placeholder="Buscar..." value={busqueda}
            onChange={e => setBusqueda(e.target.value)} />
          {busqueda && (
            <button onClick={() => setBusqueda("")} style={{ color: "#64748b" }}><X size={14} /></button>
          )}
        </div>
        <select className="px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" }}
          value={catFiltro} onChange={e => setCatFiltro(e.target.value)}>
          <option value="todas">Todas las categorías</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>)}
        </select>
        <select className="px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" }}
          value={mes} onChange={e => setMes(Number(e.target.value))}>
          {MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <select className="px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" }}
          value={anio} onChange={e => setAnio(Number(e.target.value))}>
          {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <p style={{ color: "#64748b" }}>Cargando gastos...</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          {gastosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-4xl mb-3">💸</p>
              <p className="text-sm mb-1" style={{ color: "#64748b" }}>
                {busqueda || catFiltro !== "todas" ? "Sin resultados para el filtro aplicado" : `No hay gastos para ${MESES[mes]} ${anio}`}
              </p>
              {!busqueda && catFiltro === "todas" && (
                <button onClick={() => setShowForm(true)}
                  className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: "#0ea5e9" }}>+ Agregar el primero</button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #334155", backgroundColor: "#0f172a" }}>
                      {["Fecha", "Categoría", "Subcategoría", "Monto", "Vencimiento", "Estado", "Descripción", ""].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                          style={{ color: "#64748b" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gastosFiltrados.map((g) => (
                      <tr key={g.id} style={{ borderBottom: "1px solid #33415530" }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0f172a44")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#64748b" }}>
                          {new Date(g.fecha + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {g.categoria && (
                            <span className="px-2 py-0.5 rounded-full text-xs"
                              style={{ backgroundColor: (g.categoria.color || "#38bdf8") + "22", color: g.categoria.color || "#38bdf8" }}>
                              {g.categoria.icono} {g.categoria.nombre}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#94a3b8" }}>
                          {g.subcategoria?.nombre ?? "—"}
                        </td>
                        <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: "#e2e8f0" }}>
                          ${g.monto.toLocaleString("es-AR")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#64748b" }}>
                          {g.fecha_vencimiento
                            ? new Date(g.fecha_vencimiento + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => togglePagado(g)}>
                            {g.pagado
                              ? <span className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
                                  style={{ backgroundColor: "#14532d", color: "#22c55e" }}>
                                  <Check size={10} /> Pagado
                                </span>
                              : <span className="px-2 py-0.5 rounded-full text-xs"
                                  style={{ backgroundColor: "#450a0a", color: "#ef4444" }}>Pendiente</span>
                            }
                          </button>
                        </td>
                        <td className="px-4 py-3" style={{ color: "#64748b", maxWidth: "160px" }}>
                          <span className="block truncate text-xs">
                            {!g.descripcion || g.descripcion === g.subcategoria?.nombre ? "—" : g.descripcion}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => abrirEditar(g)} className="p-1.5 rounded-lg"
                              style={{ color: "#475569" }}
                              onMouseEnter={e => (e.currentTarget.style.color = "#38bdf8")}
                              onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => eliminarGasto(g.id)} className="p-1.5 rounded-lg"
                              style={{ color: "#475569" }}
                              onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                              onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 flex justify-between text-sm"
                style={{ borderTop: "1px solid #334155", color: "#64748b" }}>
                <span>
                  {gastosFiltrados.length} registro{gastosFiltrados.length !== 1 ? "s" : ""}
                  {gastosFiltrados.length !== gastos.length && ` (de ${gastos.length} total)`}
                </span>
                <span>Total filtrado: <strong style={{ color: "#e2e8f0" }}>${totalFiltrado.toLocaleString("es-AR")}</strong></span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
