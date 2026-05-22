"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronRight, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Subcategoria = { id: string; nombre: string };
type Categoria = { id: string; nombre: string; icono: string; color: string; orden: number; subcategorias: Subcategoria[] };

const coloresOpciones = ["#22c55e","#38bdf8","#f59e0b","#a855f7","#ef4444","#ec4899","#0ea5e9","#f97316","#14b8a6"];
const iconosOpciones = ["🛒","🏠","🚗","⚡","💊","🎭","💳","📱","🐾","✈️","🎓","💼","🏋️","🎮","🍕","💵","🐷","📋","👤","🛍️"];

export default function MisCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [expandidas, setExpandidas] = useState<string[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editandoSubId, setEditandoSubId] = useState<string | null>(null);
  const [editSubNombre, setEditSubNombre] = useState("");
  const [showFormCat, setShowFormCat] = useState(false);
  const [showFormSub, setShowFormSub] = useState<string | null>(null);
  const [nuevaCat, setNuevaCat] = useState({ nombre: "", icono: "🛒", color: "#22c55e" });
  const [nuevaSub, setNuevaSub] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUserId(data.session.user.id);
    });
  }, []);

  useEffect(() => { if (userId) cargar(); }, [userId]);

  async function cargar() {
    setLoading(true);
    const { data } = await supabase
      .from("categorias")
      .select("*, subcategorias(*)")
      .eq("user_id", userId)
      .eq("activa", true)
      .order("orden");
    if (data) setCategorias(data as Categoria[]);
    setLoading(false);
  }

  const toggleExpandida = (id: string) =>
    setExpandidas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const eliminarCategoria = async (id: string) => {
    await supabase.from("categorias").update({ activa: false }).eq("id", id);
    setCategorias(prev => prev.filter(c => c.id !== id));
  };

  const guardarEdicion = async (id: string) => {
    await supabase.from("categorias").update({ nombre: editNombre }).eq("id", id);
    setCategorias(prev => prev.map(c => c.id === id ? { ...c, nombre: editNombre } : c));
    setEditandoId(null);
  };

  const agregarCategoria = async () => {
    if (!nuevaCat.nombre.trim() || !userId) return;
    const { data } = await supabase
      .from("categorias")
      .insert({ ...nuevaCat, user_id: userId, orden: categorias.length + 1, activa: true })
      .select()
      .single();
    if (data) setCategorias(prev => [...prev, { ...data, subcategorias: [] }]);
    setNuevaCat({ nombre: "", icono: "🛒", color: "#22c55e" });
    setShowFormCat(false);
  };

  const agregarSubcategoria = async (catId: string) => {
    if (!nuevaSub.trim()) return;
    const { data } = await supabase
      .from("subcategorias")
      .insert({ categoria_id: catId, nombre: nuevaSub })
      .select()
      .single();
    if (data) {
      setCategorias(prev => prev.map(c =>
        c.id === catId ? { ...c, subcategorias: [...c.subcategorias, data] } : c
      ));
    }
    setNuevaSub("");
    setShowFormSub(null);
  };

  const eliminarSub = async (catId: string, subId: string) => {
    await supabase.from("subcategorias").delete().eq("id", subId);
    setCategorias(prev => prev.map(c =>
      c.id === catId ? { ...c, subcategorias: c.subcategorias.filter(s => s.id !== subId) } : c
    ));
  };

  const guardarEdicionSub = async (catId: string, subId: string) => {
    if (!editSubNombre.trim()) return;
    const cat = categorias.find(c => c.id === catId);
    const nombreAnterior = cat?.subcategorias.find(s => s.id === subId)?.nombre;
    await supabase.from("subcategorias").update({ nombre: editSubNombre.trim() }).eq("id", subId);
    // Si es subcategoría de la categoría personal "Tarjetas", sincronizar nombre en tarjetas del usuario
    if (cat?.nombre?.toLowerCase() === "tarjetas" && nombreAnterior && userId) {
      await supabase.from("tarjetas")
        .update({ nombre: editSubNombre.trim() })
        .ilike("nombre", nombreAnterior.trim())
        .eq("user_id", userId);
    }
    setCategorias(prev => prev.map(c =>
      c.id === catId
        ? { ...c, subcategorias: c.subcategorias.map(s => s.id === subId ? { ...s, nombre: editSubNombre.trim() } : s) }
        : c
    ));
    setEditandoSubId(null);
    setEditSubNombre("");
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p style={{ color: "#64748b" }}>Cargando categorías...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Mis Categorías</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            {categorias.length} categorías · {categorias.reduce((s, c) => s + c.subcategorias.length, 0)} subcategorías
          </p>
        </div>
        <button onClick={() => setShowFormCat(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white"
          style={{ backgroundColor: "#a855f7" }}>
          <Plus size={16} /> Nueva categoría
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "#1e1b4b", border: "1px solid #3730a3" }}>
        <Info size={16} style={{ color: "#818cf8", flexShrink: 0, marginTop: 2 }} />
        <p className="text-sm" style={{ color: "#a5b4fc" }}>
          Estas categorías son solo tuyas y no afectan las categorías compartidas. Para que el tracking de pagos funcione en
          <strong> Mis Tarjetas</strong>, creá una categoría llamada <strong>"Tarjetas"</strong> con subcategorías con el nombre exacto de cada tarjeta personal.
        </p>
      </div>

      {/* Modal nueva categoría */}
      {showFormCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "#00000088" }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: "#e2e8f0" }}>Nueva Categoría Personal</h2>
              <button onClick={() => setShowFormCat(false)} style={{ color: "#64748b" }}><X size={18} /></button>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Nombre</label>
              <input className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                placeholder="Ej: Ropa, Salidas" value={nuevaCat.nombre}
                onChange={e => setNuevaCat(p => ({ ...p, nombre: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && agregarCategoria()} />
            </div>
            <div>
              <label className="text-xs mb-2 block" style={{ color: "#64748b" }}>Ícono</label>
              <div className="flex flex-wrap gap-2">
                {iconosOpciones.map(ic => (
                  <button key={ic} onClick={() => setNuevaCat(p => ({ ...p, icono: ic }))}
                    className="w-9 h-9 rounded-lg text-lg flex items-center justify-center"
                    style={{ backgroundColor: nuevaCat.icono === ic ? "#334155" : "#0f172a", border: `1px solid ${nuevaCat.icono === ic ? "#a855f7" : "#334155"}` }}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs mb-2 block" style={{ color: "#64748b" }}>Color</label>
              <div className="flex gap-2 flex-wrap">
                {coloresOpciones.map(col => (
                  <button key={col} onClick={() => setNuevaCat(p => ({ ...p, color: col }))}
                    className="w-7 h-7 rounded-full"
                    style={{ backgroundColor: col, outline: nuevaCat.color === col ? "3px solid white" : "none", outlineOffset: "2px" }} />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowFormCat(false)} className="flex-1 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "#334155", color: "#94a3b8" }}>Cancelar</button>
              <button onClick={agregarCategoria} className="flex-1 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: "#a855f7" }}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      {categorias.length === 0 ? (
        <div className="rounded-xl p-10 text-center" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <p className="text-3xl mb-3">🏷️</p>
          <p className="text-sm" style={{ color: "#64748b" }}>No tenés categorías personales todavía.</p>
          <p className="text-xs mt-1" style={{ color: "#475569" }}>Creá la primera con el botón de arriba.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categorias.map((cat) => {
            const isExp = expandidas.includes(cat.id);
            const isEdit = editandoId === cat.id;
            return (
              <div key={cat.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <button onClick={() => toggleExpandida(cat.id)} style={{ color: "#64748b" }}>
                    {isExp ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                    style={{ backgroundColor: cat.color + "22" }}>{cat.icono}</div>
                  <div className="flex-1">
                    {isEdit ? (
                      <input autoFocus className="px-2 py-0.5 rounded text-sm"
                        style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                        value={editNombre} onChange={e => setEditNombre(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && guardarEdicion(cat.id)} />
                    ) : (
                      <p className="text-sm font-medium" style={{ color: "#e2e8f0" }}>{cat.nombre}</p>
                    )}
                    <p className="text-xs" style={{ color: "#64748b" }}>{cat.subcategorias.length} subcategorías</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <div className="flex items-center gap-1">
                    {isEdit ? (
                      <>
                        <button onClick={() => guardarEdicion(cat.id)} className="p-1.5 rounded-lg" style={{ color: "#22c55e" }}><Save size={14} /></button>
                        <button onClick={() => setEditandoId(null)} className="p-1.5 rounded-lg" style={{ color: "#64748b" }}><X size={14} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditandoId(cat.id); setEditNombre(cat.nombre); }}
                          className="p-1.5 rounded-lg" style={{ color: "#64748b" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}><Edit2 size={14} /></button>
                        <button onClick={() => eliminarCategoria(cat.id)}
                          className="p-1.5 rounded-lg" style={{ color: "#64748b" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}><Trash2 size={14} /></button>
                      </>
                    )}
                  </div>
                </div>
                {isExp && (
                  <div className="px-4 pb-3" style={{ borderTop: "1px solid #334155" }}>
                    <div className="pt-3 space-y-1">
                      {cat.subcategorias.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between px-3 py-2 rounded-lg group"
                          style={{ backgroundColor: "#0f172a" }}>
                          {editandoSubId === sub.id ? (
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                              <input autoFocus className="flex-1 px-2 py-0.5 rounded text-sm"
                                style={{ backgroundColor: "#1e293b", border: "1px solid #a855f7", color: "#e2e8f0" }}
                                value={editSubNombre}
                                onChange={e => setEditSubNombre(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") guardarEdicionSub(cat.id, sub.id); if (e.key === "Escape") setEditandoSubId(null); }} />
                              <button onClick={() => guardarEdicionSub(cat.id, sub.id)} className="p-1 rounded" style={{ color: "#22c55e" }}><Save size={13} /></button>
                              <button onClick={() => setEditandoSubId(null)} className="p-1 rounded" style={{ color: "#64748b" }}><X size={13} /></button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                <span className="text-sm" style={{ color: "#94a3b8" }}>{sub.nombre}</span>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditandoSubId(sub.id); setEditSubNombre(sub.nombre); }}
                                  className="p-1 rounded" style={{ color: "#64748b" }}
                                  onMouseEnter={e => (e.currentTarget.style.color = "#a855f7")}
                                  onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}><Edit2 size={12} /></button>
                                <button onClick={() => eliminarSub(cat.id, sub.id)}
                                  className="p-1 rounded" style={{ color: "#64748b" }}
                                  onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                                  onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}><X size={12} /></button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      {showFormSub === cat.id ? (
                        <div className="flex gap-2 pt-1">
                          <input autoFocus className="flex-1 px-3 py-1.5 rounded-lg text-sm"
                            style={{ backgroundColor: "#0f172a", border: "1px solid #a855f7", color: "#e2e8f0" }}
                            placeholder="Nueva subcategoría..." value={nuevaSub}
                            onChange={e => setNuevaSub(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && agregarSubcategoria(cat.id)} />
                          <button onClick={() => agregarSubcategoria(cat.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                            style={{ backgroundColor: "#a855f7" }}>Agregar</button>
                          <button onClick={() => setShowFormSub(null)}
                            className="px-3 py-1.5 rounded-lg text-xs"
                            style={{ backgroundColor: "#334155", color: "#94a3b8" }}>✕</button>
                        </div>
                      ) : (
                        <button onClick={() => setShowFormSub(cat.id)}
                          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg mt-1 w-full"
                          style={{ color: "#64748b", border: "1px dashed #334155" }}
                          onMouseEnter={e => { e.currentTarget.style.color = "#a855f7"; e.currentTarget.style.borderColor = "#a855f7"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#334155"; }}>
                          <Plus size={12} /> Agregar subcategoría
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
