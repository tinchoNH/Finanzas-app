"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from "recharts";
import { supabase, getCuotaNumero } from "@/lib/supabase";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const MESES_CORTO = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

type Tarjeta = { id: string; nombre: string; color: string };
type GastoCuota = { id: string; descripcion: string; mes_inicio: string; cantidad_cuotas: number; monto_cuota: number; tarjeta_id: string; tarjeta?: Tarjeta };
type ResumenTarjeta = { tarjeta: string; color: string; totalCuotas: number; pagado: number };
type Tendencia = { mes: string; ingresos: number; gastos: number; ahorro: number };
type Categoria = { id: string; nombre: string; icono: string; color: string };
type GastoSubcat = { subcategoria_id: string | null; monto: number; subcategoria?: { nombre: string } };
type TendenciaSubcat = { mes: string; total: number };

export default function ResumenPage() {
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth());
  const [anio, setAnio] = useState(now.getFullYear());
  const [catFiltro, setCatFiltro] = useState("todas");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [resumenTarjetas, setResumenTarjetas] = useState<ResumenTarjeta[]>([]);
  const [tendencia, setTendencia] = useState<Tendencia[]>([]);
  const [resumenCats, setResumenCats] = useState<{ nombre: string; icono: string; color: string; total: number }[]>([]);
  const [gastosCat, setGastosCat] = useState<{ nombre: string; total: number; color: string }[]>([]);
  const [tendenciaCat, setTendenciaCat] = useState<TendenciaSubcat[]>([]);
  const [loading, setLoading] = useState(true);

  const mesStr = `${anio}-${String(mes + 1).padStart(2, "0")}`;

  useEffect(() => {
    supabase.from("categorias").select("id,nombre,icono,color").order("orden")
      .then(({ data }) => { if (data) setCategorias(data as Categoria[]) });
  }, []);

  useEffect(() => { cargarDatos(); }, [mesStr, catFiltro]);

  async function cargarDatos() {
    setLoading(true);
    if (catFiltro === "todas") {
      await Promise.all([cargarResumenTarjetas(), cargarTendencia(), cargarResumenCategorias()]);
    } else {
      await Promise.all([cargarGastosPorCategoria(), cargarTendenciaCategoria()]);
    }
    setLoading(false);
  }

  async function cargarResumenCategorias() {
    const { data } = await supabase
      .from("gastos")
      .select("monto, categoria_id, categoria:categorias(nombre,icono,color)")
      .eq("mes", mesStr);

    const mapa: Record<string, { nombre: string; icono: string; color: string; total: number }> = {};
    for (const g of (data ?? []) as any[]) {
      const id = g.categoria_id;
      if (!mapa[id]) mapa[id] = { nombre: g.categoria?.nombre ?? "", icono: g.categoria?.icono ?? "📋", color: g.categoria?.color ?? "#64748b", total: 0 };
      mapa[id].total += Number(g.monto);
    }
    setResumenCats(Object.values(mapa).sort((a, b) => b.total - a.total));
  }

  async function cargarResumenTarjetas() {
    // Calcular mes anterior
    const [anioN, mesN] = mesStr.split("-").map(Number);
    const prevDate = new Date(anioN, mesN - 2, 1);
    const mesAnteriorStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

    const [{ data: cuotas }, { data: tarjetas }, { data: catTarjeta }] = await Promise.all([
      supabase.from("gastos_cuotas").select("*, tarjeta:tarjetas(id,nombre,color)").eq("activo", true),
      supabase.from("tarjetas").select("id, nombre, color").order("nombre"),
      supabase.from("categorias").select("id").eq("nombre", "Tarjetas").limit(1),
    ]);

    if (!tarjetas || tarjetas.length === 0) { setResumenTarjetas([]); return; }

    // Cuotas del mes actual
    const cuotasPorTarjeta: Record<string, number> = {};
    for (const c of (cuotas ?? []) as GastoCuota[]) {
      const num = getCuotaNumero(c.mes_inicio, mesStr);
      if (num >= 1 && num <= c.cantidad_cuotas)
        cuotasPorTarjeta[c.tarjeta_id] = (cuotasPorTarjeta[c.tarjeta_id] ?? 0) + c.monto_cuota;
    }

    // Cuotas del mes anterior (para saldo arrastrado)
    const cuotasPrevPorTarjeta: Record<string, number> = {};
    for (const c of (cuotas ?? []) as GastoCuota[]) {
      const num = getCuotaNumero(c.mes_inicio, mesAnteriorStr);
      if (num >= 1 && num <= c.cantidad_cuotas)
        cuotasPrevPorTarjeta[c.tarjeta_id] = (cuotasPrevPorTarjeta[c.tarjeta_id] ?? 0) + c.monto_cuota;
    }

    const catId = (catTarjeta as any)?.[0]?.id;

    // Pagos del mes actual y anterior en paralelo
    let gastosT: any[] = [];
    let gastosAnt: any[] = [];
    if (catId) {
      const [{ data: gT }, { data: gA }] = await Promise.all([
        supabase.from("gastos").select("monto, subcategoria:subcategorias(nombre)").eq("mes", mesStr).eq("categoria_id", catId),
        supabase.from("gastos").select("monto, subcategoria:subcategorias(nombre)").eq("mes", mesAnteriorStr).eq("categoria_id", catId),
      ]);
      gastosT = (gT ?? []) as any[];
      gastosAnt = (gA ?? []) as any[];
    }

    const toMapaPagos = (rows: any[]) => {
      const m: Record<string, number> = {};
      for (const g of rows) {
        const nombreSub = (g.subcategoria?.nombre ?? "").trim().toLowerCase();
        const t = (tarjetas as Tarjeta[]).find(t => t.nombre.trim().toLowerCase() === nombreSub);
        if (t) m[t.id] = (m[t.id] ?? 0) + Number(g.monto);
      }
      return m;
    };

    const pagosPorTarjetaId     = toMapaPagos(gastosT);
    const pagosPrevPorTarjetaId = toMapaPagos(gastosAnt);

    // Saldo arrastrado: max(0, cuotasPrev - pagadoPrev)
    const saldoArrastradoPorTarjeta: Record<string, number> = {};
    for (const t of tarjetas as Tarjeta[]) {
      const prev    = cuotasPrevPorTarjeta[t.id] ?? 0;
      const pagPrev = pagosPrevPorTarjetaId[t.id] ?? 0;
      saldoArrastradoPorTarjeta[t.id] = Math.max(0, prev - pagPrev);
    }

    setResumenTarjetas(
      (tarjetas as Tarjeta[])
        .filter(t => (cuotasPorTarjeta[t.id] ?? 0) > 0 || (saldoArrastradoPorTarjeta[t.id] ?? 0) > 0)
        .map(t => ({
          tarjeta: t.nombre,
          color: t.color,
          totalCuotas: (cuotasPorTarjeta[t.id] ?? 0) + (saldoArrastradoPorTarjeta[t.id] ?? 0),
          pagado: pagosPorTarjetaId[t.id] ?? 0,
        }))
    );
  }

  async function cargarTendencia() {
    const mesesData = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(anio, mes - (5 - i), 1);
      return { str: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: MESES_CORTO[d.getMonth()] };
    });
    const resultado = await Promise.all(mesesData.map(async ({ str, label }) => {
      const { data: g } = await supabase.from("gastos").select("monto, categoria:categorias(nombre)").eq("mes", str);
      const todos = (g ?? []) as any[];
      const gastos = todos.filter((x: any) => x.categoria?.nombre !== "Ingresos").reduce((s: number, x: any) => s + Number(x.monto), 0);
      const ingresos = todos.filter((x: any) => x.categoria?.nombre === "Ingresos").reduce((s: number, x: any) => s + Number(x.monto), 0);
      return { mes: label, ingresos, gastos, ahorro: Math.max(0, ingresos - gastos) };
    }));
    setTendencia(resultado);
  }

  async function cargarGastosPorCategoria() {
    const cat = categorias.find(c => c.id === catFiltro);
    if (!cat) return;
    const { data } = await supabase
      .from("gastos")
      .select("monto, subcategoria:subcategorias(nombre)")
      .eq("mes", mesStr)
      .eq("categoria_id", catFiltro);
    const mapa: Record<string, number> = {};
    for (const g of (data ?? []) as any[]) {
      const nombre = (g.subcategoria as any)?.nombre ?? "Sin subcategoría";
      mapa[nombre] = (mapa[nombre] ?? 0) + Number(g.monto);
    }
    setGastosCat(
      Object.entries(mapa)
        .map(([nombre, total]) => ({ nombre, total, color: cat.color }))
        .sort((a, b) => b.total - a.total)
    );
  }

  async function cargarTendenciaCategoria() {
    const mesesData = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(anio, mes - (5 - i), 1);
      return { str: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: MESES_CORTO[d.getMonth()] };
    });
    const resultado = await Promise.all(mesesData.map(async ({ str, label }) => {
      const { data } = await supabase.from("gastos").select("monto").eq("mes", str).eq("categoria_id", catFiltro);
      const total = (data ?? []).reduce((s: number, x: any) => s + Number(x.monto), 0);
      return { mes: label, total };
    }));
    setTendenciaCat(resultado);
  }

  const totalCuotas = resumenTarjetas.reduce((s, r) => s + r.totalCuotas, 0);
  const totalPagado = resumenTarjetas.reduce((s, r) => s + r.pagado, 0);
  const diferencia = totalPagado - totalCuotas;
  const catSeleccionada = categorias.find(c => c.id === catFiltro);
  const totalCatMes = gastosCat.reduce((s, g) => s + g.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Resumen</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            {MESES[mes]} {anio}{catSeleccionada ? ` · ${catSeleccionada.icono} ${catSeleccionada.nombre}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
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
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32"><p style={{ color: "#64748b" }}>Cargando...</p></div>
      ) : catFiltro === "todas" ? (
        <>
          {/* Resumen por categorías */}
          <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ color: "#e2e8f0" }}>Gastos por categoría — {MESES[mes]} {anio}</h2>
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#0c2d48", color: "#38bdf8" }}>
                Total: ${resumenCats.reduce((s, c) => s + c.total, 0).toLocaleString("es-AR")}
              </span>
            </div>
            {resumenCats.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: "#64748b" }}>Sin gastos cargados para {MESES[mes]} {anio}</p>
            ) : (
              <div className="space-y-2">
                {resumenCats.map(c => {
                  const totalGeneral = resumenCats.reduce((s, x) => s + x.total, 0);
                  const pct = totalGeneral > 0 ? Math.round(c.total / totalGeneral * 100) : 0;
                  return (
                    <div key={c.nombre}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm" style={{ color: "#94a3b8" }}>{c.icono} {c.nombre}</span>
                        <span className="text-sm font-medium" style={{ color: "#e2e8f0" }}>
                          ${c.total.toLocaleString("es-AR")} <span className="text-xs" style={{ color: "#64748b" }}>({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: "#0f172a" }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: c.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Resumen tarjetas */}
          <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
            <h2 className="font-semibold mb-4" style={{ color: "#e2e8f0" }}>Cuotas activas por tarjeta</h2>
            {resumenTarjetas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-3xl mb-2">💳</p>
                <p className="text-sm" style={{ color: "#64748b" }}>Sin cuotas activas para {MESES[mes]} {anio}</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155" }}>
                    {["Tarjeta", "Cuotas del mes", "Pago registrado", "Estado"].map(h => (
                      <th key={h} className="text-left pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resumenTarjetas.map((r) => {
                    const saldo = r.pagado - r.totalCuotas;
                    return (
                      <tr key={r.tarjeta} style={{ borderBottom: "1px solid #33415520" }}>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                            <span className="font-medium" style={{ color: "#e2e8f0" }}>{r.tarjeta}</span>
                          </div>
                        </td>
                        <td className="py-3" style={{ color: "#94a3b8" }}>${r.totalCuotas.toLocaleString("es-AR")}</td>
                        <td className="py-3 font-medium" style={{ color: r.pagado > 0 ? "#22c55e" : "#64748b" }}>
                          {r.pagado > 0 ? `$${r.pagado.toLocaleString("es-AR")}` : "Sin registrar"}
                        </td>
                        <td className="py-3">
                          {r.pagado === 0
                            ? <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: "#1e1b4b", color: "#818cf8" }}>Pendiente</span>
                            : saldo >= 0
                              ? <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: "#14532d", color: "#22c55e" }}>✓ ${saldo.toLocaleString("es-AR")} adelantado</span>
                              : <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: "#450a0a", color: "#ef4444" }}>⚠ ${Math.abs(saldo).toLocaleString("es-AR")} pendiente</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: "2px solid #334155" }}>
                    <td className="py-3 font-bold" style={{ color: "#e2e8f0" }}>TOTAL</td>
                    <td className="py-3 font-bold" style={{ color: "#e2e8f0" }}>${totalCuotas.toLocaleString("es-AR")}</td>
                    <td className="py-3 font-bold" style={{ color: "#22c55e" }}>{totalPagado > 0 ? `$${totalPagado.toLocaleString("es-AR")}` : "—"}</td>
                    <td className="py-3">
                      {totalCuotas > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{ backgroundColor: diferencia >= 0 ? "#14532d" : "#450a0a", color: diferencia >= 0 ? "#22c55e" : "#ef4444" }}>
                          {diferencia >= 0 ? `✓ +$${diferencia.toLocaleString("es-AR")}` : `⚠ -$${Math.abs(diferencia).toLocaleString("es-AR")}`}
                        </span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
              <h2 className="font-semibold mb-4" style={{ color: "#e2e8f0" }}>Tendencia — últimos 6 meses</h2>
              {tendencia.every(t => t.gastos === 0 && t.ingresos === 0) ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <p className="text-xs text-center" style={{ color: "#64748b" }}>Sin datos históricos todavía</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={tendencia}>
                      <XAxis dataKey="mes" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={v => v === 0 ? "$0" : `$${(v/1000).toFixed(0)}k`} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }}
                        formatter={(v: any) => [`$${Number(v).toLocaleString("es-AR")}`, ""]} />
                      <Line type="monotone" dataKey="ingresos" stroke="#22c55e" strokeWidth={2} dot={false} name="Ingresos" />
                      <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} dot={false} name="Gastos" />
                      <Line type="monotone" dataKey="ahorro" stroke="#38bdf8" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Ahorro" />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex gap-4 mt-2">
                    {[{ label: "Ingresos", color: "#22c55e" }, { label: "Gastos", color: "#ef4444" }, { label: "Ahorro", color: "#38bdf8" }].map(l => (
                      <div key={l.label} className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 rounded inline-block" style={{ backgroundColor: l.color }} />
                        <span className="text-xs" style={{ color: "#64748b" }}>{l.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
              <h2 className="font-semibold mb-4" style={{ color: "#e2e8f0" }}>Cuotas por tarjeta — {MESES[mes]}</h2>
              {resumenTarjetas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <p className="text-xs text-center" style={{ color: "#64748b" }}>Sin cuotas este mes</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={resumenTarjetas} layout="vertical" barSize={14}>
                    <XAxis type="number" tickFormatter={v => v === 0 ? "$0" : `$${(v/1000).toFixed(0)}k`} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="tarjeta" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }}
                      formatter={(v: any) => [`$${Number(v).toLocaleString("es-AR")}`, "Cuotas"]} />
                    <Bar dataKey="totalCuotas" name="Cuotas" radius={[0, 4, 4, 0]}>
                      {resumenTarjetas.map((r, i) => <Cell key={i} fill={r.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Vista por categoría */
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#64748b" }}>Total {MESES[mes]}</p>
              <p className="text-2xl font-bold" style={{ color: catSeleccionada?.color ?? "#38bdf8" }}>
                ${totalCatMes.toLocaleString("es-AR")}
              </p>
              <p className="text-xs mt-1" style={{ color: "#64748b" }}>{gastosCat.length} subcategorías</p>
            </div>
            <div className="col-span-2 rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
              <h2 className="font-semibold mb-3" style={{ color: "#e2e8f0" }}>
                {catSeleccionada?.icono} {catSeleccionada?.nombre} — desglose por subcategoría
              </h2>
              {gastosCat.length === 0 ? (
                <p className="text-sm" style={{ color: "#64748b" }}>Sin gastos en esta categoría para {MESES[mes]} {anio}</p>
              ) : (
                <div className="space-y-2">
                  {gastosCat.map(g => {
                    const pct = totalCatMes > 0 ? Math.round(g.total / totalCatMes * 100) : 0;
                    return (
                      <div key={g.nombre}>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: "#94a3b8" }}>{g.nombre}</span>
                          <span style={{ color: "#e2e8f0" }}>${g.total.toLocaleString("es-AR")} <span style={{ color: "#64748b" }}>({pct}%)</span></span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ backgroundColor: "#0f172a" }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: catSeleccionada?.color ?? "#38bdf8" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Tendencia categoría */}
          <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
            <h2 className="font-semibold mb-4" style={{ color: "#e2e8f0" }}>
              Tendencia {catSeleccionada?.nombre} — últimos 6 meses
            </h2>
            {tendenciaCat.every(t => t.total === 0) ? (
              <div className="flex flex-col items-center justify-center h-32">
                <p className="text-xs" style={{ color: "#64748b" }}>Sin datos históricos para esta categoría</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={tendenciaCat} barSize={28}>
                  <XAxis dataKey="mes" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => v === 0 ? "$0" : `$${(v/1000).toFixed(0)}k`} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }}
                    formatter={(v: any) => [`$${Number(v).toLocaleString("es-AR")}`, catSeleccionada?.nombre ?? ""]} />
                  <Bar dataKey="total" fill={catSeleccionada?.color ?? "#38bdf8"} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}
