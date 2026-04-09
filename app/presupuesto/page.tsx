"use client";

import { useState, useEffect } from "react";
// recharts removido — ya no se usa el gráfico dona
import { Edit2, Save, X } from "lucide-react";
import { supabase, getCuotaNumero } from "@/lib/supabase";

type Distribucion = { id: string; nombre: string; porcentaje: number; color: string; orden: number };
type Gasto = { categoria_id: string; monto: number; categoria?: { nombre: string; icono: string } };
type CategoriaGasto = { nombre: string; icono: string; presupuestado: number; real: number; masEsMejor: boolean };
type EstConVenc = { concepto: string; categoria: string; subcategoria: string; icono: string; monto: number; dia: number };
type EstSinVenc = { categoria: string; icono: string; color: string; total: number };
type EstCuota   = { tarjeta: string; color: string; total: number };

const now = new Date();
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function PresupuestoPage() {
  const [distribucion, setDistribucion] = useState<Distribucion[]>([]);
  const [editando, setEditando] = useState(false);
  const [editTemp, setEditTemp] = useState<Distribucion[]>([]);
  const [saving, setSaving] = useState(false);
  const [gastosPorCat, setGastosPorCat] = useState<CategoriaGasto[]>([]);
  const [totalIngresos, setTotalIngresos] = useState(300000); // default hasta tener ingresos reales
  const [mes, setMes] = useState(now.getMonth());
  const [anio, setAnio] = useState(now.getFullYear());
  const [loading, setLoading] = useState(true);
  const [estConVenc, setEstConVenc] = useState<EstConVenc[]>([]);
  const [estSinVenc, setEstSinVenc] = useState<EstSinVenc[]>([]);
  const [estCuotas, setEstCuotas] = useState<EstCuota[]>([]);
  const [totalSueldos, setTotalSueldos] = useState(0);
  const [totalTarjetasCompartidas, setTotalTarjetasCompartidas] = useState(0);

  const mesStr = `${anio}-${String(mes + 1).padStart(2, "0")}`;
  const mesAnteriorStr = (() => {
    const d = new Date(anio, mes - 1, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  })();

  useEffect(() => {
    cargarDistribucion();
  }, []);

  useEffect(() => {
    cargarGastos();
    cargarIngresos();
    cargarEstimado();
  }, [mesStr]);

  async function cargarDistribucion() {
    const { data } = await supabase
      .from("distribucion_ingresos")
      .select("*")
      .order("orden");
    if (data && data.length > 0) {
      setDistribucion(data as Distribucion[]);
    }
    setLoading(false);
  }

  async function cargarIngresos() {
    // Ingresos del mes: gastos con categoría "Ingresos"
    const { data } = await supabase
      .from("gastos")
      .select("monto, categoria:categorias(nombre)")
      .eq("mes", mesStr);
    const ingresos = (data ?? []).filter((g: any) => g.categoria?.nombre === "Ingresos");
    if (ingresos.length > 0) {
      setTotalIngresos(ingresos.reduce((s: number, i: any) => s + Number(i.monto), 0));
    } else {
      setTotalIngresos(0);
    }
  }

  async function cargarGastos() {
    const masEsMejorSet = new Set(["Ingresos", "Personales", "Ahorro"]);

    const [{ data }, { data: prevData }] = await Promise.all([
      supabase.from("gastos").select("categoria_id, monto, categoria:categorias(nombre,icono), subcategoria:subcategorias(nombre)").eq("mes", mesStr),
      supabase.from("gastos").select("categoria_id, monto, categoria:categorias(nombre,icono), subcategoria:subcategorias(nombre)").eq("mes", mesAnteriorStr),
    ]);

    // Mapa actual
    const mapaActual: Record<string, { nombre: string; icono: string; real: number }> = {};
    for (const g of (data ?? []) as any[]) {
      const id = g.categoria_id;
      if (!mapaActual[id]) mapaActual[id] = { nombre: g.categoria?.nombre ?? "", icono: g.categoria?.icono ?? "📋", real: 0 };
      mapaActual[id].real += Number(g.monto);
    }

    // Mapa anterior
    const mapaAnterior: Record<string, { nombre: string; icono: string; total: number }> = {};
    for (const g of (prevData ?? []) as any[]) {
      const id = g.categoria_id;
      if (!mapaAnterior[id]) mapaAnterior[id] = { nombre: g.categoria?.nombre ?? "", icono: g.categoria?.icono ?? "📋", total: 0 };
      mapaAnterior[id].total += Number(g.monto);
    }

    // Merge ambos meses
    const allIds = new Set([...Object.keys(mapaActual), ...Object.keys(mapaAnterior)]);
    const resultado: CategoriaGasto[] = [...allIds].map(id => {
      const act = mapaActual[id];
      const ant = mapaAnterior[id];
      const nombre = act?.nombre ?? ant?.nombre ?? "";
      return {
        nombre,
        icono: act?.icono ?? ant?.icono ?? "📋",
        presupuestado: ant?.total ?? 0,
        real: act?.real ?? 0,
        masEsMejor: masEsMejorSet.has(nombre),
      };
    }).sort((a, b) => b.real - a.real);

    // Fila especial "Sueldos": subcategorías con "sueldo" en el nombre dentro de Ingresos
    const sueldoActual = ((data ?? []) as any[])
      .filter(g => g.categoria?.nombre === "Ingresos" && (g.subcategoria?.nombre ?? "").toLowerCase().includes("sueldo"))
      .reduce((s: number, g: any) => s + Number(g.monto), 0);
    const sueldoAnterior = ((prevData ?? []) as any[])
      .filter(g => g.categoria?.nombre === "Ingresos" && (g.subcategoria?.nombre ?? "").toLowerCase().includes("sueldo"))
      .reduce((s: number, g: any) => s + Number(g.monto), 0);

    if (sueldoActual > 0 || sueldoAnterior > 0) {
      const idxIngresos = resultado.findIndex(r => r.nombre === "Ingresos");
      resultado.splice(idxIngresos + 1, 0, {
        nombre: "Sueldos",
        icono: "💰",
        presupuestado: sueldoAnterior,
        real: sueldoActual,
        masEsMejor: true,
      });
    }

    // Guardar total sueldos para cumplimiento
    setTotalSueldos(sueldoActual);

    // Calcular tarjetas compartidas (excluir personales) para cumplimiento
    try {
      const stored = localStorage.getItem("tarjetas_personales");
      if (stored) {
        const ids = new Set(JSON.parse(stored) as string[]);
        if (ids.size > 0) {
          const { data: tjs } = await supabase.from("tarjetas").select("id, nombre");
          if (tjs) {
            const personalNombres = new Set(
              (tjs as any[]).filter(t => ids.has(t.id)).map(t => (t.nombre as string).trim().toLowerCase())
            );
            const totalTarjetas = ((data ?? []) as any[])
              .filter(g => g.categoria?.nombre === "Tarjetas")
              .reduce((s: number, g: any) => s + Number(g.monto), 0);
            const totalPersonal = ((data ?? []) as any[])
              .filter(g => g.categoria?.nombre === "Tarjetas" && personalNombres.has((g.subcategoria?.nombre ?? "").trim().toLowerCase()))
              .reduce((s: number, g: any) => s + Number(g.monto), 0);
            setTotalTarjetasCompartidas(totalTarjetas - totalPersonal);
          } else {
            setTotalTarjetasCompartidas(mapaActual[Object.keys(mapaActual).find(k => mapaActual[k].nombre === "Tarjetas") ?? ""]?.real ?? 0);
          }
        } else {
          setTotalTarjetasCompartidas(mapaActual[Object.keys(mapaActual).find(k => mapaActual[k].nombre === "Tarjetas") ?? ""]?.real ?? 0);
        }
      } else {
        setTotalTarjetasCompartidas(mapaActual[Object.keys(mapaActual).find(k => mapaActual[k].nombre === "Tarjetas") ?? ""]?.real ?? 0);
      }
    } catch {
      setTotalTarjetasCompartidas(resultado.find(r => r.nombre === "Tarjetas")?.real ?? 0);
    }

    setGastosPorCat(resultado);
  }

  async function cargarEstimado() {
    // Gastos del mes anterior — base del estimado
    const { data } = await supabase
      .from("gastos")
      .select("descripcion, monto, tiene_vencimiento, fecha_vencimiento, categoria:categorias(nombre,icono,color), subcategoria:subcategorias(nombre)")
      .eq("mes", mesAnteriorStr);

    const conVenc: EstConVenc[] = [];
    const sinVencMapa: Record<string, EstSinVenc> = {};

    for (const g of (data ?? []) as any[]) {
      const catNombre: string = g.categoria?.nombre ?? "Sin categoría";
      if (catNombre === "Ingresos" || catNombre === "Tarjetas") continue;

      if (g.tiene_vencimiento && g.fecha_vencimiento) {
        const dia = new Date(g.fecha_vencimiento + "T12:00:00").getDate();
        conVenc.push({ concepto: g.descripcion, categoria: catNombre, subcategoria: g.subcategoria?.nombre ?? "", icono: g.categoria?.icono ?? "📋", monto: Number(g.monto), dia });
      } else {
        if (!sinVencMapa[catNombre]) {
          sinVencMapa[catNombre] = { categoria: catNombre, icono: g.categoria?.icono ?? "📋", color: g.categoria?.color ?? "#64748b", total: 0 };
        }
        sinVencMapa[catNombre].total += Number(g.monto);
      }
    }

    // Cuotas activas para el mes del presupuesto
    const { data: cuotas } = await supabase
      .from("gastos_cuotas")
      .select("mes_inicio, cantidad_cuotas, monto_cuota, tarjeta:tarjetas(nombre,color)")
      .eq("activo", true);

    const cuotasMapa: Record<string, EstCuota> = {};
    for (const c of (cuotas ?? []) as any[]) {
      const num = getCuotaNumero(c.mes_inicio, mesStr);
      if (num >= 1 && num <= c.cantidad_cuotas) {
        const nombre: string = c.tarjeta?.nombre ?? "Tarjeta";
        if (!cuotasMapa[nombre]) cuotasMapa[nombre] = { tarjeta: nombre, color: c.tarjeta?.color ?? "#f59e0b", total: 0 };
        cuotasMapa[nombre].total += Number(c.monto_cuota);
      }
    }

    setEstConVenc(conVenc.sort((a, b) => a.dia - b.dia));
    setEstSinVenc(Object.values(sinVencMapa).sort((a, b) => b.total - a.total));
    setEstCuotas(Object.values(cuotasMapa));
  }

  function iniciarEdicion() {
    setEditTemp(distribucion.map(d => ({ ...d })));
    setEditando(true);
  }

  function cancelarEdicion() {
    setEditando(false);
    setEditTemp([]);
  }

  async function guardarEdicion() {
    const total = editTemp.reduce((s, d) => s + d.porcentaje, 0);
    if (total !== 100) return;
    setSaving(true);
    for (const d of editTemp) {
      await supabase.from("distribucion_ingresos").update({ porcentaje: d.porcentaje }).eq("id", d.id);
    }
    setDistribucion(editTemp);
    setEditando(false);
    setSaving(false);
  }

  const totalPct = editTemp.reduce((s, d) => s + d.porcentaje, 0);
  const pctOk = totalPct === 100;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p style={{ color: "#64748b" }}>Cargando presupuesto...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Presupuesto</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>Distribución del ingreso y seguimiento mensual</p>
        </div>
        <div className="flex gap-2">
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

      {/* Distribución del ingreso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: "#e2e8f0" }}>Distribución del ingreso</h2>
            {!editando ? (
              <button onClick={iniciarEdicion}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ backgroundColor: "#334155", color: "#94a3b8" }}>
                <Edit2 size={12} /> Editar %
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={cancelarEdicion}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs"
                  style={{ backgroundColor: "#334155", color: "#94a3b8" }}>
                  <X size={12} /> Cancelar
                </button>
                <button onClick={guardarEdicion} disabled={!pctOk || saving}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
                  style={{ backgroundColor: "#0ea5e9" }}>
                  <Save size={12} /> {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            )}
          </div>

          {totalIngresos === 0 && !editando ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-2xl mb-2">💰</p>
              <p className="text-xs text-center" style={{ color: "#64748b" }}>
                Sin ingresos cargados para {MESES[mes]} {anio}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(editando ? editTemp : distribucion).map((d, i) => {
                const monto = Math.round(totalIngresos * d.porcentaje / 100);
                return (
                  <div key={d.id} className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="flex-1 text-sm" style={{ color: "#94a3b8" }}>{d.nombre}</span>
                    {editando ? (
                      <div className="flex items-center gap-1">
                        <input type="number" min={0} max={100}
                          value={editTemp[i].porcentaje}
                          onChange={e => setEditTemp(prev => prev.map((x, j) => j === i ? { ...x, porcentaje: Number(e.target.value) } : x))}
                          className="w-14 px-2 py-1 rounded text-sm text-center"
                          style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }} />
                        <span className="text-xs" style={{ color: "#64748b" }}>%</span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium" style={{ color: d.color }}>{d.porcentaje}%</span>
                    )}
                    {totalIngresos > 0 && (
                      <span className="text-sm w-24 text-right" style={{ color: "#64748b" }}>${monto.toLocaleString("es-AR")}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {editando && (
            <div className="mt-3 p-2 rounded-lg text-xs text-center"
              style={{ backgroundColor: pctOk ? "#14532d" : "#450a0a", color: pctOk ? "#22c55e" : "#ef4444" }}>
              {pctOk ? "✓ Total: 100% — Perfecto" : `⚠ Total: ${totalPct}% — Debe sumar 100%`}
            </div>
          )}
        </div>

        {/* Cumplimiento de distribución */}
        <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <h2 className="font-semibold mb-1" style={{ color: "#e2e8f0" }}>Cumplimiento</h2>
          <p className="text-xs mb-4" style={{ color: "#64748b" }}>
            Base sueldos: <strong style={{ color: totalSueldos > 0 ? "#22c55e" : "#64748b" }}>
              {totalSueldos > 0 ? `$${totalSueldos.toLocaleString("es-AR")}` : "Sin datos"}
            </strong>
            {totalSueldos > 0 && totalSueldos !== totalIngresos && (
              <span className="ml-2" style={{ color: "#475569" }}>(Ingreso total: ${totalIngresos.toLocaleString("es-AR")})</span>
            )}
          </p>
          {totalSueldos > 0 ? (
            <div className="space-y-3">
              {(() => {
                const mapeo: Record<string, string[]> = {
                  "Gastos Fijos y Diarios": ["Gastos fijos", "Gastos Diarios"],
                  "Tarjetas": ["Tarjetas"],
                  "Personales": ["Personales"],
                  "Ahorro": ["Ahorro"],
                  "Deuda": [],
                };
                return distribucion.map(d => {
                  const presup = Math.round(totalSueldos * d.porcentaje / 100);
                  const cats = mapeo[d.nombre] ?? [d.nombre];
                  // Para Tarjetas usar total compartidas (excluye personales)
                  const real = d.nombre === "Tarjetas" ? totalTarjetasCompartidas : gastosPorCat.filter(g => cats.includes(g.nombre)).reduce((s, g) => s + g.real, 0);
                  const pctUso = presup > 0 ? Math.round(real / presup * 100) : 0;
                  const diff = presup - real;
                  const ok = real <= presup;
                  const color = d.porcentaje === 0 ? "#475569" : ok ? "#22c55e" : "#ef4444";
                  return (
                    <div key={d.id} className="p-3 rounded-lg" style={{ backgroundColor: "#0f172a" }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                          <span className="text-sm font-medium" style={{ color: "#e2e8f0" }}>{d.nombre}</span>
                          <span className="text-xs" style={{ color: "#475569" }}>{d.porcentaje}%</span>
                        </div>
                        {d.porcentaje > 0 && (
                          <span className="text-xs font-semibold" style={{ color }}>
                            {ok ? `✓ $${diff.toLocaleString("es-AR")} disponible` : `⚠ $${Math.abs(diff).toLocaleString("es-AR")} excedido`}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: "#64748b" }}>
                        <span>Límite: <strong style={{ color: "#94a3b8" }}>${presup.toLocaleString("es-AR")}</strong></span>
                        <span>Usado: <strong style={{ color }}>${real.toLocaleString("es-AR")}</strong></span>
                        {d.porcentaje > 0 && <span style={{ color }}>{pctUso}%</span>}
                      </div>
                      {d.porcentaje > 0 && (
                        <div className="h-1.5 rounded-full mt-2" style={{ backgroundColor: "#1e293b" }}>
                          <div className="h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(pctUso, 100)}%`, backgroundColor: color }} />
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-2xl mb-2">📊</p>
              <p className="text-xs text-center" style={{ color: "#64748b" }}>Sin ingresos para comparar</p>
            </div>
          )}
        </div>
      </div>

      {/* Gastos vs Presupuesto por categoría */}
      <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold" style={{ color: "#e2e8f0" }}>
            Gastos reales — {MESES[mes]} {anio}
          </h2>
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#14532d33", color: "#22c55e" }}>
            Presupuesto basado en mes anterior
          </span>
        </div>
        <p className="text-xs mb-5" style={{ color: "#64748b" }}>
          Comparación entre lo gastado y el mes anterior como referencia
        </p>

        {gastosPorCat.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-sm" style={{ color: "#64748b" }}>Sin gastos cargados para {MESES[mes]} {anio}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {gastosPorCat.map((p) => {
              const pct = p.presupuestado > 0 ? Math.round((p.real / p.presupuestado) * 100) : (p.real > 0 ? 100 : 0);
              const esIgual = pct >= 98 && pct <= 102;
              const diferencia = p.presupuestado - p.real;

              // Color según si "más es mejor" o "menos es mejor"
              let color: string;
              if (esIgual) {
                color = "#f59e0b"; // Naranja = igual
              } else if (p.masEsMejor) {
                color = pct > 100 ? "#22c55e" : "#ef4444"; // Más = verde
              } else {
                color = pct < 100 ? "#22c55e" : "#ef4444"; // Menos = verde
              }

              // Color de la diferencia
              let diffColor: string;
              if (esIgual) {
                diffColor = "#f59e0b";
              } else if (p.masEsMejor) {
                diffColor = diferencia <= 0 ? "#22c55e" : "#ef4444"; // Ganó más = verde
              } else {
                diffColor = diferencia >= 0 ? "#22c55e" : "#ef4444"; // Gastó menos = verde
              }

              const esSueldos = p.nombre === "Sueldos";

              return (
                <div key={p.nombre} className="p-4 rounded-lg" style={{ backgroundColor: "#0f172a", marginLeft: esSueldos ? "24px" : 0, borderLeft: esSueldos ? "3px solid #f59e0b" : "none" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: "#e2e8f0" }}>
                      {p.icono} {p.nombre}
                      {esSueldos && <span className="text-xs ml-2" style={{ color: "#64748b" }}>(solo sueldos)</span>}
                    </span>
                    <div className="flex items-center gap-4 text-sm">
                      <span style={{ color: "#64748b" }}>
                        Ref: <strong style={{ color: "#94a3b8" }}>${p.presupuestado.toLocaleString("es-AR")}</strong>
                      </span>
                      <span style={{ color: "#64748b" }}>
                        Real: <strong style={{ color }}>${p.real.toLocaleString("es-AR")}</strong>
                      </span>
                      <span className="text-xs" style={{ color: diffColor }}>
                        {diferencia === 0
                          ? "= Igual"
                          : diferencia > 0
                            ? `↓ $${diferencia.toLocaleString("es-AR")} menos`
                            : `↑ $${Math.abs(diferencia).toLocaleString("es-AR")} más`}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: "#1e293b" }}>
                    <div className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: "#475569" }}>0%</span>
                    <span className="text-xs" style={{ color }}>{pct}% del mes anterior</span>
                    <span className="text-xs" style={{ color: "#475569" }}>100%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {gastosPorCat.length > 0 && (
          <div className="mt-4 pt-4 flex justify-between" style={{ borderTop: "1px solid #334155" }}>
            <span className="text-sm font-semibold" style={{ color: "#94a3b8" }}>Totales</span>
            <div className="flex gap-6 text-sm">
              <span style={{ color: "#64748b" }}>
                Ref: <strong style={{ color: "#e2e8f0" }}>
                  ${gastosPorCat.reduce((s, p) => s + p.presupuestado, 0).toLocaleString("es-AR")}
                </strong>
              </span>
              <span style={{ color: "#64748b" }}>
                Real: <strong style={{ color: "#22c55e" }}>
                  ${gastosPorCat.reduce((s, p) => s + p.real, 0).toLocaleString("es-AR")}
                </strong>
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Estimado próximo mes */}
      {(() => {
        const totalConVenc = estConVenc.reduce((s, e) => s + e.monto, 0);
        const totalSinVenc = estSinVenc.reduce((s, e) => s + e.total, 0);
        const totalCuotas  = estCuotas.reduce((s, e) => s + e.total, 0);
        const totalEst     = totalConVenc + totalSinVenc + totalCuotas;
        const mesPrevNombre = MESES[new Date(anio, mes - 1, 1).getMonth()];

        if (estConVenc.length === 0 && estSinVenc.length === 0 && estCuotas.length === 0) return null;

        return (
          <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold" style={{ color: "#e2e8f0" }}>Estimado — {MESES[mes]} {anio}</h2>
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#0c2d48", color: "#38bdf8" }}>
                Basado en {mesPrevNombre}
              </span>
            </div>
            <p className="text-xs mb-5" style={{ color: "#64748b" }}>
              Con vencimiento ordenado por día · Sin vencimiento agrupado por categoría · Tarjetas según cuotas activas
            </p>

            {/* Bloque 1: Con vencimiento */}
            {estConVenc.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#475569" }}>
                  Con vencimiento
                </p>
                <div className="space-y-2">
                  {estConVenc.map((e, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ backgroundColor: "#0f172a" }}>
                      <div className="w-9 h-9 rounded-lg flex flex-col items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ backgroundColor: "#1e293b", color: "#38bdf8" }}>
                        {e.dia}
                        <span className="font-normal" style={{ color: "#475569", fontSize: "9px" }}>día</span>
                      </div>
                      <span className="text-sm flex-shrink-0" style={{ color: "#64748b" }}>{e.icono}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "#e2e8f0" }}>{e.concepto}</p>
                        <p className="text-xs" style={{ color: "#475569" }}>
                          {e.categoria}{e.subcategoria ? <span style={{ color: "#334155" }}> · </span> : ""}{e.subcategoria && <span style={{ color: "#64748b" }}>{e.subcategoria}</span>}
                        </p>
                      </div>
                      <span className="text-sm font-semibold flex-shrink-0" style={{ color: "#e2e8f0" }}>
                        ${e.monto.toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-2 text-xs" style={{ color: "#64748b" }}>
                  Subtotal: <strong className="ml-1" style={{ color: "#94a3b8" }}>${totalConVenc.toLocaleString("es-AR")}</strong>
                </div>
              </div>
            )}

            {/* Bloque 2: Sin vencimiento por categoría */}
            {estSinVenc.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#475569" }}>
                  Sin vencimiento fijo — aproximado por categoría
                </p>
                <div className="space-y-2">
                  {estSinVenc.map((e) => (
                    <div key={e.categoria} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ backgroundColor: "#0f172a" }}>
                      <span className="text-base flex-shrink-0">{e.icono}</span>
                      <span className="flex-1 text-sm" style={{ color: "#94a3b8" }}>{e.categoria}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 rounded-full w-20" style={{ backgroundColor: "#1e293b" }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${totalSinVenc > 0 ? Math.round(e.total / totalSinVenc * 100) : 0}%`, backgroundColor: e.color }} />
                        </div>
                        <span className="text-sm font-semibold w-28 text-right" style={{ color: "#e2e8f0" }}>
                          ${e.total.toLocaleString("es-AR")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-2 text-xs" style={{ color: "#64748b" }}>
                  Subtotal: <strong className="ml-1" style={{ color: "#94a3b8" }}>${totalSinVenc.toLocaleString("es-AR")}</strong>
                </div>
              </div>
            )}

            {/* Bloque 3: Tarjetas */}
            {estCuotas.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#475569" }}>
                  Tarjetas — cuotas activas
                </p>
                <div className="space-y-2">
                  {estCuotas.map((e) => (
                    <div key={e.tarjeta} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ backgroundColor: "#0f172a" }}>
                      <span className="text-base flex-shrink-0">💳</span>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
                        <span className="text-sm" style={{ color: "#94a3b8" }}>{e.tarjeta}</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: e.color }}>
                        ${e.total.toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-2 text-xs" style={{ color: "#64748b" }}>
                  Subtotal: <strong className="ml-1" style={{ color: "#94a3b8" }}>${totalCuotas.toLocaleString("es-AR")}</strong>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between pt-4" style={{ borderTop: "2px solid #334155" }}>
              <span className="font-semibold" style={{ color: "#e2e8f0" }}>Total estimado {MESES[mes]}</span>
              <span className="text-xl font-bold" style={{ color: "#38bdf8" }}>${totalEst.toLocaleString("es-AR")}</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
