"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { supabase, getCuotaNumero } from "@/lib/supabase";
import { utils as XLSXUtils, write as XLSXWrite, WorkSheet } from "xlsx";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

type ExportOption = { id: string; titulo: string; descripcion: string; icono: string; color: string };

const opciones: ExportOption[] = [
  { id: "gastos",      titulo: "Gastos del período",      descripcion: "Todos los gastos con categoría, subcategoría y fecha",         icono: "📋", color: "#22c55e" },
  { id: "cuotas",      titulo: "Cuotas de tarjetas",      descripcion: "Desglose de cuotas activas por tarjeta en cada mes",           icono: "💳", color: "#0ea5e9" },
  { id: "ingresos",    titulo: "Ingresos del período",    descripcion: "Todos los ingresos registrados en el rango seleccionado",       icono: "💰", color: "#a855f7" },
  { id: "resumen",     titulo: "Resumen por categoría",   descripcion: "Totales agrupados por categoría para cada mes",                 icono: "📊", color: "#f59e0b" },
  { id: "historico",   titulo: "Historial completo",      descripcion: "Todos los datos: gastos, cuotas e ingresos en una sola hoja",   icono: "📁", color: "#ef4444" },
];

// Genera array de strings "YYYY-MM" entre mesDesde y mesHasta del año
function generarMeses(mesDesde: number, mesHasta: number, anio: number): string[] {
  const meses: string[] = [];
  for (let m = mesDesde; m <= mesHasta; m++) {
    meses.push(`${anio}-${String(m + 1).padStart(2, "0")}`);
  }
  return meses;
}

export default function ExportarPage() {
  const now = new Date();
  const [mesDesde, setMesDesde] = useState(0);
  const [mesHasta, setMesHasta] = useState(now.getMonth());
  const [anio, setAnio] = useState(now.getFullYear());
  const [seleccionados, setSeleccionados] = useState<string[]>(["gastos"]);
  const [exportando, setExportando] = useState(false);
  const [exportado, setExportado] = useState(false);
  const [progreso, setProgreso] = useState("");

  const toggleSeleccion = (id: string) => {
    setSeleccionados(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  async function handleExportar() {
    if (seleccionados.length === 0) return;
    setExportando(true);
    setExportado(false);

    const rango = generarMeses(mesDesde, mesHasta, anio);
    const wb = XLSXUtils.book_new();
    let sheetsAgregadas = 0;

    try {
      if (seleccionados.includes("gastos") || seleccionados.includes("historico")) {
        setProgreso("Cargando gastos...");
        const { data } = await supabase
          .from("gastos")
          .select("fecha, descripcion, monto, pagado, tiene_vencimiento, fecha_vencimiento, mes, categoria:categorias(nombre), subcategoria:subcategorias(nombre)")
          .in("mes", rango)
          .order("mes")
          .order("fecha");

        const filas = (data ?? []).map((g: any) => ({
          "Mes":            g.mes,
          "Fecha":          g.fecha,
          "Descripción":    g.descripcion,
          "Categoría":      g.categoria?.nombre ?? "",
          "Subcategoría":   g.subcategoria?.nombre ?? "",
          "Monto":          Number(g.monto),
          "Pagado":         g.pagado ? "Sí" : "No",
          "Tiene Venc.":    g.tiene_vencimiento ? "Sí" : "No",
          "Fecha Venc.":    g.fecha_vencimiento ?? "",
        }));

        if (seleccionados.includes("gastos") || filas.length > 0) {
          const ws = XLSXUtils.json_to_sheet(filas);
          ajustarColumnas(ws, filas);
          XLSXUtils.book_append_sheet(wb, ws, "Gastos"); sheetsAgregadas++;
        }
      }

      if (seleccionados.includes("cuotas") || seleccionados.includes("historico")) {
        setProgreso("Cargando cuotas...");
        const { data } = await supabase
          .from("gastos_cuotas")
          .select("descripcion, monto_total, cantidad_cuotas, monto_cuota, mes_inicio, activo, tarjeta:tarjetas(nombre)")
          .eq("activo", true);

        const filas: any[] = [];
        for (const mes of rango) {
          for (const c of (data ?? []) as any[]) {
            const num = getCuotaNumero(c.mes_inicio, mes);
            if (num >= 1 && num <= c.cantidad_cuotas) {
              filas.push({
                "Mes":              mes,
                "Tarjeta":          c.tarjeta?.nombre ?? "",
                "Descripción":      c.descripcion,
                "Cuota":            `${num}/${c.cantidad_cuotas}`,
                "Monto Cuota":      Number(c.monto_cuota),
                "Monto Total":      Number(c.monto_total),
                "Cuotas Restantes": c.cantidad_cuotas - num,
                "Saldo Pendiente":  Number(c.monto_cuota) * (c.cantidad_cuotas - num),
              });
            }
          }
        }

        if (seleccionados.includes("cuotas") || filas.length > 0) {
          const ws = XLSXUtils.json_to_sheet(filas);
          ajustarColumnas(ws, filas);
          XLSXUtils.book_append_sheet(wb, ws, "Cuotas"); sheetsAgregadas++;
        }
      }

      if (seleccionados.includes("ingresos") || seleccionados.includes("historico")) {
        setProgreso("Cargando ingresos...");
        const { data } = await supabase
          .from("ingresos")
          .select("mes, tipo, monto, fecha_esperada, recurrente")
          .in("mes", rango)
          .order("mes");

        const filas = (data ?? []).map((i: any) => ({
          "Mes":             i.mes,
          "Tipo":            i.tipo,
          "Monto":           Number(i.monto),
          "Fecha Esperada":  i.fecha_esperada,
          "Recurrente":      i.recurrente ? "Sí" : "No",
        }));

        if (seleccionados.includes("ingresos") || filas.length > 0) {
          const ws = XLSXUtils.json_to_sheet(filas);
          ajustarColumnas(ws, filas);
          XLSXUtils.book_append_sheet(wb, ws, "Ingresos"); sheetsAgregadas++;
        }
      }

      if (seleccionados.includes("resumen")) {
        setProgreso("Generando resumen...");
        const { data: gastos } = await supabase
          .from("gastos")
          .select("mes, monto, categoria:categorias(nombre)")
          .in("mes", rango);

        // Agrupar por mes + categoría
        const mapa: Record<string, Record<string, number>> = {};
        for (const g of (gastos ?? []) as any[]) {
          const cat = g.categoria?.nombre ?? "Sin categoría";
          if (!mapa[g.mes]) mapa[g.mes] = {};
          mapa[g.mes][cat] = (mapa[g.mes][cat] ?? 0) + Number(g.monto);
        }

        const filas: any[] = [];
        for (const mes of rango) {
          const cats = mapa[mes] ?? {};
          const totalMes = Object.values(cats).reduce((s, v) => s + v, 0);
          for (const [cat, monto] of Object.entries(cats).sort((a, b) => b[1] - a[1])) {
            filas.push({ "Mes": mes, "Categoría": cat, "Total": monto, "% del mes": totalMes > 0 ? `${Math.round(monto / totalMes * 100)}%` : "0%" });
          }
          if (Object.keys(cats).length > 0) {
            filas.push({ "Mes": mes, "Categoría": "─── TOTAL ───", "Total": totalMes, "% del mes": "100%" });
          }
        }

        const ws = XLSXUtils.json_to_sheet(filas);
        ajustarColumnas(ws, filas);
        XLSXUtils.book_append_sheet(wb, ws, "Resumen por Categoría"); sheetsAgregadas++;
      }

      if (sheetsAgregadas === 0) {
        const ws = XLSXUtils.aoa_to_sheet([["Sin datos para el período seleccionado"]]);
        XLSXUtils.book_append_sheet(wb, ws, "Sin datos");
      }

      // Descargar via Blob (compatible con Next.js / browser)
      setProgreso("Descargando...");
      const nombreArchivo = `finanzas_${MESES[mesDesde].toLowerCase()}-${MESES[mesHasta].toLowerCase()}_${anio}.xlsx`;
      const wbout = XLSXWrite(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportado(true);
      setTimeout(() => setExportado(false), 4000);
    } catch (e) {
      console.error("Error exportando:", e);
      alert("Error al generar el archivo. Revisá la consola.");
    } finally {
      setExportando(false);
      setProgreso("");
    }
  }

  function ajustarColumnas(ws: WorkSheet, data: any[]) {
    if (data.length === 0) return;
    const cols = Object.keys(data[0]);
    ws["!cols"] = cols.map(col => ({
      wch: Math.max(col.length, ...data.map(row => String(row[col] ?? "").length)) + 2,
    }));
  }

  const cantMeses = mesHasta - mesDesde + 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Exportar</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>Descargá tus datos en formato Excel</p>
      </div>

      {/* Período */}
      <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
        <h2 className="font-semibold mb-4" style={{ color: "#e2e8f0" }}>Período</h2>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Desde</label>
            <select className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
              value={mesDesde} onChange={e => setMesDesde(Number(e.target.value))}>
              {MESES.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Hasta</label>
            <select className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
              value={mesHasta} onChange={e => setMesHasta(Number(e.target.value))}>
              {MESES.map((m, i) => <option key={m} value={i} disabled={i < mesDesde}>{m}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Año</label>
            <select className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
              value={anio} onChange={e => setAnio(Number(e.target.value))}>
              {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#0c2d48", color: "#38bdf8", flexShrink: 0 }}>
            {cantMeses} {cantMeses === 1 ? "mes" : "meses"}
          </div>
        </div>
      </div>

      {/* Opciones */}
      <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color: "#e2e8f0" }}>¿Qué querés exportar?</h2>
          <button onClick={() => setSeleccionados(seleccionados.length === opciones.length ? [] : opciones.map(o => o.id))}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: "#334155", color: "#94a3b8" }}>
            {seleccionados.length === opciones.length ? "Deseleccionar todo" : "Seleccionar todo"}
          </button>
        </div>

        <div className="space-y-3">
          {opciones.map(op => {
            const activo = seleccionados.includes(op.id);
            return (
              <button key={op.id} onClick={() => toggleSeleccion(op.id)}
                className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                style={{
                  backgroundColor: activo ? op.color + "11" : "#0f172a",
                  border: `1px solid ${activo ? op.color + "55" : "#334155"}`,
                }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: op.color + "22" }}>
                  {op.icono}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "#e2e8f0" }}>{op.titulo}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{op.descripcion}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{ backgroundColor: "#1e293b", color: "#64748b", border: "1px solid #334155" }}>
                    <FileSpreadsheet size={10} /> Excel (.xlsx)
                  </span>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: activo ? op.color : "#334155" }}>
                    {activo && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Botón exportar */}
      <div className="rounded-xl p-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: "#e2e8f0" }}>
              {seleccionados.length === 0
                ? "Seleccioná al menos una opción"
                : `${seleccionados.length} reporte${seleccionados.length > 1 ? "s" : ""} seleccionado${seleccionados.length > 1 ? "s" : ""}`}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
              {MESES[mesDesde]} a {MESES[mesHasta]} {anio} · se generará un archivo .xlsx
            </p>
          </div>

          <button onClick={handleExportar}
            disabled={seleccionados.length === 0 || exportando}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40"
            style={{
              backgroundColor: exportado ? "#22c55e" : "#0ea5e9",
              minWidth: "180px", justifyContent: "center",
            }}>
            {exportando ? (
              <><span className="animate-spin inline-block">⏳</span> {progreso || "Generando..."}</>
            ) : exportado ? (
              <><CheckCircle2 size={16} /> ¡Descargado!</>
            ) : (
              <><Download size={16} /> Exportar Excel</>
            )}
          </button>
        </div>

        {exportado && (
          <div className="mt-3 p-3 rounded-lg text-sm"
            style={{ backgroundColor: "#14532d33", border: "1px solid #22c55e44", color: "#22c55e" }}>
            ✓ Archivo descargado: <strong>finanzas_{MESES[mesDesde].toLowerCase()}-{MESES[mesHasta].toLowerCase()}_{anio}.xlsx</strong>
          </div>
        )}
      </div>
    </div>
  );
}
