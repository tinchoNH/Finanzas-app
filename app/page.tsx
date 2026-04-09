"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Wallet, CreditCard, RefreshCw } from "lucide-react";
import { supabase, getCuotaNumero } from "@/lib/supabase";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const MESES_CORTO = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

type GastoCuota = {
  id: string; descripcion: string; mes_inicio: string;
  cantidad_cuotas: number; monto_cuota: number; monto_total: number;
  tarjeta?: { nombre: string; color: string };
};
type Distribucion = { nombre: string; porcentaje: number; color: string };

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub: string; icon: any; color: string;
}) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs uppercase tracking-wider" style={{ color: "#64748b" }}>{label}</p>
        <div className="p-2 rounded-lg" style={{ backgroundColor: color + "22" }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color }}>{value}</p>
      <p className="text-xs" style={{ color: "#64748b" }}>{sub}</p>
    </div>
  );
}

export default function Dashboard() {
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth());
  const [anio, setAnio] = useState(now.getFullYear());
  const [totalGastos, setTotalGastos] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [distribucion, setDistribucion] = useState<Distribucion[]>([]);
  const [cuotasActivas, setCuotasActivas] = useState<GastoCuota[]>([]);
  const [historico, setHistorico] = useState<{ mes: string; ingresos: number; gastos: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const mesStr = `${anio}-${String(mes + 1).padStart(2, "0")}`;
  const [refreshing, setRefreshing] = useState(false);

  // Personal tarjeta names (loaded once, for filtering gastos)
  const personalNombresRef = useRef<Set<string>>(new Set());

  const recargarTodo = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([cargarDatosMes(), cargarHistorico(), cargarCuotas()]);
    setRefreshing(false);
  }, [mesStr]);

  useEffect(() => {
    // Cargar IDs personales de localStorage y nombres de tarjetas
    (async () => {
      try {
        const stored = localStorage.getItem("tarjetas_personales");
        if (stored) {
          const ids = new Set(JSON.parse(stored) as string[]);
          if (ids.size > 0) {
            const { data } = await supabase.from("tarjetas").select("id, nombre");
            if (data) {
              personalNombresRef.current = new Set(
                (data as any[]).filter(t => ids.has(t.id)).map(t => (t.nombre as string).trim().toLowerCase())
              );
            }
          }
        }
      } catch {}
    })();
    cargarDistribucion();
    cargarCuotas();
  }, []);

  useEffect(() => {
    cargarDatosMes();
    cargarHistorico();
  }, [mesStr]);

  async function cargarDistribucion() {
    const { data } = await supabase.from("distribucion_ingresos").select("*").order("orden");
    if (data && data.length > 0) setDistribucion(data as Distribucion[]);
    else setDistribucion([
      { nombre: "Gastos fijos", porcentaje: 40, color: "#38bdf8" },
      { nombre: "Tarjetas", porcentaje: 26, color: "#0ea5e9" },
      { nombre: "Gastos diarios", porcentaje: 15, color: "#22c55e" },
      { nombre: "Ahorro", porcentaje: 10, color: "#f59e0b" },
      { nombre: "Libre", porcentaje: 9, color: "#a855f7" },
    ]);
  }

  async function cargarCuotas() {
    const { data } = await supabase
      .from("gastos_cuotas")
      .select("*, tarjeta:tarjetas(nombre,color)")
      .eq("activo", true)
      .order("created_at", { ascending: false });
    if (data) setCuotasActivas(data as GastoCuota[]);
  }

  async function cargarDatosMes() {
    setLoading(true);

    const { data: gastos } = await supabase
      .from("gastos")
      .select("monto, categoria:categorias(nombre), subcategoria:subcategorias(nombre)")
      .eq("mes", mesStr);

    const todos = (gastos ?? []) as any[];
    const esPersonalTarjeta = (g: any) =>
      g.categoria?.nombre === "Tarjetas" &&
      personalNombresRef.current.has((g.subcategoria?.nombre ?? "").trim().toLowerCase());

    setTotalGastos(todos.filter(g => g.categoria?.nombre !== "Ingresos" && !esPersonalTarjeta(g)).reduce((s: number, g: any) => s + Number(g.monto), 0));
    setTotalIngresos(todos.filter((g: any) => g.categoria?.nombre === "Ingresos").reduce((s: number, g: any) => s + Number(g.monto), 0));

    setLoading(false);
  }


  async function cargarHistorico() {
    // Últimos 6 meses
    const meses: { mes: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(anio, mes - i, 1);
      const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      meses.push({ mes: str, label: MESES_CORTO[d.getMonth()] });
    }

    const historData = await Promise.all(meses.map(async ({ mes: m, label }) => {
      const { data: g } = await supabase
        .from("gastos")
        .select("monto, categoria:categorias(nombre), subcategoria:subcategorias(nombre)")
        .eq("mes", m);
      const todos = (g ?? []) as any[];
      const esPersonalTarjeta = (x: any) =>
        x.categoria?.nombre === "Tarjetas" &&
        personalNombresRef.current.has((x.subcategoria?.nombre ?? "").trim().toLowerCase());
      const gastos = todos.filter((x: any) => x.categoria?.nombre !== "Ingresos" && !esPersonalTarjeta(x)).reduce((s: number, x: any) => s + Number(x.monto), 0);
      const ingresos = todos.filter((x: any) => x.categoria?.nombre === "Ingresos").reduce((s: number, x: any) => s + Number(x.monto), 0);
      return { mes: label, ingresos, gastos };
    }));

    setHistorico(historData);
  }

  const disponible = totalIngresos - totalGastos;
  const ahorroEstimado = Math.round(totalIngresos * (distribucion.find(d => d.nombre === "Ahorro")?.porcentaje ?? 10) / 100);

  const mesActualStr = mesStr;
  const cuotasDelMes = cuotasActivas.map(c => {
    const num = getCuotaNumero(c.mes_inicio, mesActualStr);
    if (num < 1 || num > c.cantidad_cuotas) return null;
    const saldo = c.monto_cuota * (c.cantidad_cuotas - num);
    return { ...c, cuotaNum: num, saldo };
  }).filter(Boolean) as (GastoCuota & { cuotaNum: number; saldo: number })[];

  const totalCuotasMes = cuotasDelMes.reduce((s, c) => s + c.monto_cuota, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            {MESES[mes]} {anio}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={recargarTodo} disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: refreshing ? "#475569" : "#94a3b8" }}
            title="Actualizar datos">
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          </button>
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
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Ingresos del mes" icon={TrendingUp} color="#22c55e"
          value={`$${totalIngresos.toLocaleString("es-AR")}`}
          sub={loading ? "Cargando..." : `${MESES[mes]} ${anio}`} />
        <StatCard
          label="Gastos confirmados" icon={TrendingDown} color="#ef4444"
          value={`$${totalGastos.toLocaleString("es-AR")}`}
          sub={loading ? "Cargando..." : `${MESES[mes]} ${anio}`} />
        <StatCard
          label="Disponible" icon={Wallet} color="#38bdf8"
          value={`$${disponible.toLocaleString("es-AR")}`}
          sub={totalIngresos > 0 ? `${Math.round(disponible / totalIngresos * 100)}% del ingreso` : "—"} />
        <StatCard
          label="Cuotas activas" icon={CreditCard} color="#f59e0b"
          value={String(cuotasDelMes.length)}
          sub={`$${totalCuotasMes.toLocaleString("es-AR")} este mes`} />
      </div>

      {/* Gráfico barras histórico */}
      <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color: "#e2e8f0" }}>Ingresos vs Gastos — Últimos 6 meses</h2>
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#0c2d48", color: "#38bdf8" }}>Histórico</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={historico} barSize={28} barCategoryGap="35%">
            <XAxis dataKey="mes" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => v === 0 ? "$0" : `$${(v / 1000).toFixed(0)}k`}
              tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }}
              formatter={(v: any) => [`$${Number(v).toLocaleString("es-AR")}`, ""]} />
            <Bar dataKey="ingresos" fill="#22c55e" radius={[4, 4, 0, 0]} name="Ingresos" />
            <Bar dataKey="gastos" fill="#ef4444" radius={[4, 4, 0, 0]} name="Gastos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Dona + Ingresos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Distribución dona */}
        <div className="md:col-span-2 rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <h2 className="font-semibold mb-2" style={{ color: "#e2e8f0" }}>Distribución del ingreso</h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-auto" style={{ width: 200, height: 180, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distribucion} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    dataKey="porcentaje" paddingAngle={3}>
                    {distribucion.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }}
                    formatter={(_: any, __: any, props: any) => [
                      `${props.payload.porcentaje}% · $${Math.round(totalIngresos * props.payload.porcentaje / 100).toLocaleString("es-AR")}`,
                      props.payload.nombre
                    ]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {distribucion.map((d) => (
                <div key={d.nombre} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-sm" style={{ color: "#94a3b8" }}>{d.nombre}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium" style={{ color: d.color }}>{d.porcentaje}%</span>
                    <span className="text-xs ml-2" style={{ color: "#64748b" }}>
                      ${Math.round(totalIngresos * d.porcentaje / 100).toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info rápida */}
        <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <h2 className="font-semibold" style={{ color: "#e2e8f0" }}>Resumen rápido</h2>
          <div className="p-3 rounded-lg" style={{ backgroundColor: "#0f172a" }}>
            <p className="text-xs mb-1" style={{ color: "#64748b" }}>Cuotas activas este mes</p>
            <p className="text-xl font-bold" style={{ color: "#f59e0b" }}>
              ${totalCuotasMes.toLocaleString("es-AR")}
            </p>
            <p className="text-xs mt-1" style={{ color: "#64748b" }}>{cuotasDelMes.length} cuota{cuotasDelMes.length !== 1 ? "s" : ""} en {new Set(cuotasDelMes.map(c => c.tarjeta?.nombre)).size} tarjeta{new Set(cuotasDelMes.map(c => c.tarjeta?.nombre)).size !== 1 ? "s" : ""}</p>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: "#0f172a" }}>
            <p className="text-xs mb-1" style={{ color: "#64748b" }}>Balance del mes</p>
            <p className="text-xl font-bold" style={{ color: disponible >= 0 ? "#22c55e" : "#ef4444" }}>
              {disponible >= 0 ? "+" : ""}${disponible.toLocaleString("es-AR")}
            </p>
            <p className="text-xs mt-1" style={{ color: "#64748b" }}>
              {disponible >= 0 ? "Superávit ✓" : "⚠ Déficit"}
            </p>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: "#0f172a" }}>
            <p className="text-xs mb-1" style={{ color: "#64748b" }}>Ahorro potencial</p>
            <p className="text-xl font-bold" style={{ color: "#22c55e" }}>
              ${ahorroEstimado.toLocaleString("es-AR")}
            </p>
            <p className="text-xs mt-1" style={{ color: "#64748b" }}>
              {distribucion.find(d => d.nombre === "Ahorro")?.porcentaje ?? 10}% del ingreso
            </p>
          </div>
        </div>
      </div>

      {/* Tabla cuotas */}
      {cuotasDelMes.length > 0 && (
        <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: "#e2e8f0" }}>Cuotas activas — {MESES[mes]} {anio}</h2>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#0c2d48", color: "#38bdf8" }}>
              {cuotasDelMes.length} cuotas
            </span>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #334155" }}>
                {["Concepto", "Tarjeta", "Cuota", "Monto cuota", "Saldo pendiente", "Estado"].map(h => (
                  <th key={h} className="text-left pb-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#64748b" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cuotasDelMes.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #33415520" }}>
                  <td className="py-3 font-medium" style={{ color: "#e2e8f0" }}>{c.descripcion}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs"
                      style={{ backgroundColor: (c.tarjeta?.color || "#38bdf8") + "22", color: c.tarjeta?.color || "#38bdf8" }}>
                      {c.tarjeta?.nombre ?? "—"}
                    </span>
                  </td>
                  <td className="py-3" style={{ color: "#94a3b8" }}>{c.cuotaNum}/{c.cantidad_cuotas}</td>
                  <td className="py-3 font-medium" style={{ color: "#e2e8f0" }}>
                    ${c.monto_cuota.toLocaleString("es-AR")}
                  </td>
                  <td className="py-3" style={{ color: "#94a3b8" }}>
                    ${c.saldo.toLocaleString("es-AR")}
                  </td>
                  <td className="py-3">
                    {c.cuotaNum === c.cantidad_cuotas
                      ? <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: "#422006", color: "#f59e0b" }}>Última cuota</span>
                      : <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: "#1e1b4b", color: "#818cf8" }}>
                          {c.cantidad_cuotas - c.cuotaNum} restantes
                        </span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="mt-3 pt-3 flex justify-end" style={{ borderTop: "1px solid #334155" }}>
            <span className="text-sm" style={{ color: "#64748b" }}>
              Total cuotas este mes: <strong style={{ color: "#e2e8f0" }}>
                ${totalCuotasMes.toLocaleString("es-AR")}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
