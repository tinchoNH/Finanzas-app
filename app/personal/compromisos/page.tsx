"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X, HandCoins, ArrowUpCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Compromiso = {
  id: string;
  user_id: string;
  descripcion: string;
  persona: string;
  monto_cuota: number;
  cantidad_cuotas: number;
  mes_inicio: string;
  tipo: string; // 'le_debo' | 'me_cubre'
  activo: boolean;
};

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function cuotaDelMes(c: Compromiso, mesStr: string): number | null {
  const [anioI, mesI] = c.mes_inicio.split("-").map(Number);
  const [anioN, mesN] = mesStr.split("-").map(Number);
  const num = (anioN - anioI) * 12 + (mesN - mesI) + 1;
  if (num >= 1 && num <= c.cantidad_cuotas) return num;
  return null;
}

export default function CompromisosPage() {
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth());
  const [anio, setAnio] = useState(now.getFullYear());
  const [compromisos, setCompromisos] = useState<Compromiso[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    descripcion: "",
    persona: "",
    monto_cuota: "",
    cantidad_cuotas: "1",
    mes_inicio: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    tipo: "le_debo",
  });

  const mesStr = `${anio}-${String(mes + 1).padStart(2, "0")}`;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUserId(data.session.user.id);
    });
  }, []);

  useEffect(() => { if (userId) cargar(); }, [userId]);

  async function cargar(showLoader = true) {
    if (!userId) return;
    if (showLoader) setLoading(true);
    const { data } = await supabase
      .from("compromisos_personales")
      .select("*")
      .eq("user_id", userId)
      .eq("activo", true)
      .order("created_at", { ascending: false });
    if (data) setCompromisos(data as Compromiso[]);
    if (showLoader) setLoading(false);
  }

  // Filtra los compromisos activos para el mes seleccionado
  const compromisosMes = compromisos.filter(c => cuotaDelMes(c, mesStr) !== null);
  const leDebo = compromisosMes.filter(c => c.tipo === "le_debo");
  const meCubre = compromisosMes.filter(c => c.tipo === "me_cubre");
  const totalDebo = leDebo.reduce((s, c) => s + Number(c.monto_cuota), 0);
  const totalCubre = meCubre.reduce((s, c) => s + Number(c.monto_cuota), 0);

  // Agrupar por persona para resumen
  const porPersonaDebo: Record<string, number> = {};
  leDebo.forEach(c => { porPersonaDebo[c.persona] = (porPersonaDebo[c.persona] || 0) + Number(c.monto_cuota); });
  const porPersonaCubre: Record<string, number> = {};
  meCubre.forEach(c => { porPersonaCubre[c.persona] = (porPersonaCubre[c.persona] || 0) + Number(c.monto_cuota); });

  async function guardar() {
    if (!form.descripcion.trim() || !form.monto_cuota || !form.persona.trim() || !userId) return;
    setGuardando(true);
    setErrorMsg(null);

    const payload = {
      user_id: userId,
      descripcion: form.descripcion.trim(),
      persona: form.persona.trim(),
      monto_cuota: parseFloat(form.monto_cuota),
      cantidad_cuotas: parseInt(form.cantidad_cuotas) || 1,
      mes_inicio: form.mes_inicio,
      tipo: form.tipo,
      activo: true,
    };
    const { data, error } = await supabase
      .from("compromisos_personales")
      .insert(payload)
      .select()
      .single();

    setGuardando(false);

    if (error) {
      setErrorMsg("Error: " + error.message + " | code: " + error.code);
      return;
    }
    resetForm();
    await cargar(false);
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar este compromiso?")) return;
    await supabase.from("compromisos_personales").update({ activo: false }).eq("id", id);
    setCompromisos(prev => prev.filter(c => c.id !== id));
  }

  function resetForm() {
    setForm({
      descripcion: "", persona: "",
      monto_cuota: "", cantidad_cuotas: "1",
      mes_inicio: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
      tipo: "le_debo",
    });
    setShowForm(false);
  }

  const formValido = form.descripcion.trim() && form.monto_cuota && form.persona.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Compromisos</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            {MESES[mes]} {anio} ·{" "}
            <span style={{ color: "#ef4444" }}>Debo: ${totalDebo.toLocaleString("es-AR")}</span>
            {totalCubre > 0 && <> · <span style={{ color: "#22c55e" }}>Me cubren: ${totalCubre.toLocaleString("es-AR")}</span></>}
          </p>
        </div>
        <button onClick={() => { setErrorMsg(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white"
          style={{ backgroundColor: "#a855f7" }}>
          <Plus size={16} /> Nuevo compromiso
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <p className="text-xs mb-1" style={{ color: "#64748b" }}>Le debo a otros</p>
          <p className="text-2xl font-bold" style={{ color: "#ef4444" }}>${totalDebo.toLocaleString("es-AR")}</p>
          <p className="text-xs mt-1" style={{ color: "#475569" }}>
            {Object.entries(porPersonaDebo).map(([p, m]) => `${p}: $${m.toLocaleString("es-AR")}`).join(" · ") || "—"}
          </p>
        </div>
        <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <p className="text-xs mb-1" style={{ color: "#64748b" }}>Me cubren</p>
          <p className="text-2xl font-bold" style={{ color: "#22c55e" }}>${totalCubre.toLocaleString("es-AR")}</p>
          <p className="text-xs mt-1" style={{ color: "#475569" }}>
            {Object.entries(porPersonaCubre).map(([p, m]) => `${p}: $${m.toLocaleString("es-AR")}`).join(" · ") || "—"}
          </p>
        </div>
        <div className="rounded-xl px-5 py-4 col-span-2 md:col-span-1" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <p className="text-xs mb-1" style={{ color: "#64748b" }}>Impacto neto</p>
          <p className="text-2xl font-bold" style={{ color: totalDebo - totalCubre > 0 ? "#ef4444" : "#22c55e" }}>
            ${(totalDebo - totalCubre).toLocaleString("es-AR")}
          </p>
          <p className="text-xs mt-1" style={{ color: "#475569" }}>debo − me cubren</p>
        </div>
      </div>

      {/* Selector mes/año */}
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
              <h2 className="text-lg font-semibold" style={{ color: "#e2e8f0" }}>Nuevo compromiso</h2>
              <button onClick={resetForm} style={{ color: "#64748b" }}><X size={18} /></button>
            </div>

            {/* Tipo */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "le_debo", label: "Le debo a alguien", color: "#ef4444" },
                { value: "me_cubre", label: "Alguien me cubre", color: "#22c55e" },
              ].map(opt => (
                <button key={opt.value} onClick={() => setForm(p => ({ ...p, tipo: opt.value }))}
                  className="py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    border: `2px solid ${form.tipo === opt.value ? opt.color : "#334155"}`,
                    backgroundColor: form.tipo === opt.value ? opt.color + "22" : "transparent",
                    color: form.tipo === opt.value ? opt.color : "#94a3b8",
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>
                {form.tipo === "le_debo" ? "¿A quién le debés?" : "¿Quién te cubre?"}
              </label>
              <input className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                placeholder="Ej: Pau, Mi vieja, Facu..."
                value={form.persona}
                onChange={e => setForm(p => ({ ...p, persona: e.target.value }))} />
            </div>

            <div>
              <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Descripción</label>
              <input className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                placeholder="Ej: Finde en el río, Cuota 3 silla bici..."
                value={form.descripcion}
                onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Monto por cuota ($)</label>
                <input type="number" className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  placeholder="0" value={form.monto_cuota}
                  onChange={e => setForm(p => ({ ...p, monto_cuota: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Cuotas</label>
                <input type="number" min="1" className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  placeholder="1" value={form.cantidad_cuotas}
                  onChange={e => setForm(p => ({ ...p, cantidad_cuotas: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Mes inicio</label>
                <input type="month" className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                  value={form.mes_inicio}
                  onChange={e => setForm(p => ({ ...p, mes_inicio: e.target.value }))} />
              </div>
            </div>

            {form.monto_cuota && form.cantidad_cuotas && parseInt(form.cantidad_cuotas) > 0 && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: "#0f172a", color: "#64748b" }}>
                Total: <strong style={{ color: "#e2e8f0" }}>
                  ${(parseFloat(form.monto_cuota) * parseInt(form.cantidad_cuotas)).toLocaleString("es-AR")}
                </strong>
                {" "}en {form.cantidad_cuotas} cuota{parseInt(form.cantidad_cuotas) !== 1 ? "s" : ""}
              </p>
            )}

            {errorMsg && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: "#450a0a", color: "#ef4444" }}>
                ⚠ {errorMsg}
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={resetForm} className="flex-1 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "#334155", color: "#94a3b8" }}>Cancelar</button>
              <button onClick={guardar} disabled={!formValido || guardando}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: formValido && !guardando ? "#a855f7" : "#4c1d95aa" }}>
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listas */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <p style={{ color: "#64748b" }}>Cargando...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Le debo */}
          <CompromisosTabla
            items={leDebo}
            mesStr={mesStr}
            titulo="Lo que debo"
            icono={<HandCoins size={14} className="inline mr-1" style={{ color: "#ef4444" }} />}
            colorTotal="#ef4444"
            emptyMsg="Sin deudas para este mes 🙌"
            onEliminar={eliminar}
          />

          {/* Me cubren */}
          <CompromisosTabla
            items={meCubre}
            mesStr={mesStr}
            titulo="Lo que me cubren"
            icono={<ArrowUpCircle size={14} className="inline mr-1" style={{ color: "#22c55e" }} />}
            colorTotal="#22c55e"
            emptyMsg="Sin compromisos de cobertura para este mes"
            onEliminar={eliminar}
          />
        </div>
      )}
    </div>
  );
}

function CompromisosTabla({
  items, mesStr, titulo, icono, colorTotal, emptyMsg, onEliminar,
}: {
  items: Compromiso[];
  mesStr: string;
  titulo: string;
  icono: React.ReactNode;
  colorTotal: string;
  emptyMsg: string;
  onEliminar: (id: string) => void;
}) {
  const total = items.reduce((s, c) => s + Number(c.monto_cuota), 0);

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #334155" }}>
        <h2 className="font-semibold" style={{ color: "#e2e8f0" }}>{icono}{titulo}</h2>
        {total > 0 && <span className="text-sm font-bold" style={{ color: colorTotal }}>${total.toLocaleString("es-AR")}</span>}
      </div>
      {items.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm" style={{ color: "#64748b" }}>{emptyMsg}</p>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: "#33415530" }}>
          {items.map(c => {
            const [anioI, mesI] = c.mes_inicio.split("-").map(Number);
            const [anioN, mesN] = mesStr.split("-").map(Number);
            const num = (anioN - anioI) * 12 + (mesN - mesI) + 1;
            const restantes = c.cantidad_cuotas - num;
            return (
              <div key={c.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "#e2e8f0" }}>{c.descripcion}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                    {c.tipo === "le_debo" ? "A: " : "De: "}
                    <span style={{ color: "#94a3b8" }}>{c.persona}</span>
                    {" · "}Cuota {num}/{c.cantidad_cuotas}
                    {restantes > 0 && <span style={{ color: "#475569" }}> · quedan {restantes}</span>}
                    {restantes === 0 && <span style={{ color: "#22c55e" }}> · última cuota</span>}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold" style={{ color: colorTotal }}>
                    ${Number(c.monto_cuota).toLocaleString("es-AR")}
                  </p>
                  <button onClick={() => onEliminar(c.id)} className="p-1.5 rounded-lg"
                    style={{ color: "#475569" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
