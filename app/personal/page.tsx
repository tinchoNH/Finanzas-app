"use client";

import { useState, useEffect } from "react";
import { Loader2, TrendingUp, TrendingDown, Wallet, CreditCard } from "lucide-react";
import { supabase } from "@/lib/supabase";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function MiResumenPage() {
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth());
  const [anio, setAnio] = useState(now.getFullYear());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");

  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [totalCuotas, setTotalCuotas] = useState(0);
  const [cuotasActivas, setCuotasActivas] = useState<any[]>([]);
  const [gastosPorCat, setGastosPorCat] = useState<{ nombre: string; icono: string; color: string; total: number }[]>([]);

  const mesStr = `${anio}-${String(mes + 1).padStart(2, "0")}`;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUserId(data.session.user.id);
        const n = data.session.user.user_metadata?.nombre || data.session.user.email || "vos";
        setNombre(n.split(" ")[0]);
      }
    });
  }, []);

  useEffect(() => { if (userId) cargarDatos(); }, [userId, mesStr]);

  async function cargarDatos() {
    if (!userId) return;
    setLoading(true);

    const [{ data: ingresos }, { data: gastos }, { data: cuotas }, { data: tarjetas }] = await Promise.all([
      supabase.from("ingresos").select("monto").eq("mes", mesStr).eq("user_id", userId),
      supabase.from("gastos").select("monto, categoria:categorias(nombre,icono,color)").eq("mes", mesStr).eq("user_id", userId),
      supabase.from("gastos_cuotas").select("*, tarjeta:tarjetas(*)").eq("user_id", userId).eq("activo", true),
      supabase.from("tarjetas").select("id").eq("user_id", userId),
    ]);

    // Ingresos
    setTotalIngresos((ingresos ?? []).reduce((s: number, i: any) => s + Number(i.monto), 0));

    // Gastos
    const gastosData = (gastos ?? []) as any[];
    setTotalGastos(gastosData.reduce((s: number, g: any) => s + Number(g.monto), 0));

    // Gastos por categoría
    const porCat: Record<string, { nombre: string; icono: string; color: string; total: number }> = {};
    for (const g of gastosData) {
      const cat = g.categoria;
      if (!cat) continue;
      if (!porCat[cat.nombre]) porCat[cat.nombre] = { nombre: cat.nombre, icono: cat.icono || "", color: cat.color || "#a855f7", total: 0 };
      porCat[cat.nombre].total += Number(g.monto);
    }
    setGastosPorCat(Object.values(porCat).sort((a, b) => b.total - a.total));

    // Cuotas del mes
    const tarjetaIds = new Set((tarjetas ?? []).map((t: any) => t.id));
    const cuotasData = (cuotas ?? []) as any[];
    const [anioN, mesN] = mesStr.split("-").map(Number);
    const cuotasMes = cuotasData.filter(g => {
      const [anioI, mesI] = g.mes_inicio.split("-").map(Number);
      const num = (anioN - anioI) * 12 + (mesN - mesI) + 1;
      return num >= 1 && num <= g.cantidad_cuotas;
    });
    setCuotasActivas(cuotasMes);
    setTotalCuotas(cuotasMes.reduce((s: number, g: any) => s + Number(g.monto_cuota), 0));

    setLoading(false);
  }

  const disponible = totalIngresos - totalGastos;
  const maxCat = gastosPorCat.length > 0 ? gastosPorCat[0].total : 1;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={24} className="animate-spin" style={{ color: "#64748b" }} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Mi Resumen Personal</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>Hola {nombre} 👋 — {MESES[mes]} {anio}</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" }}
            value={mes} onChange={e => setMes(Number(e.target.value))}>
            {MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" }}
            value={anio} onChange={e => setAnio(Number(e.target.value))}>
            {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} style={{ color: "#22c55e" }} />
            <p className="text-xs" style={{ color: "#64748b" }}>Mis Ingresos</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#22c55e" }}>${totalIngresos.toLocaleString("es-AR")}</p>
        </div>
        <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} style={{ color: "#ef4444" }} />
            <p className="text-xs" style={{ color: "#64748b" }}>Mis Gastos</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#ef4444" }}>${totalGastos.toLocaleString("es-AR")}</p>
          {totalCuotas > 0 && (
            <p className="text-xs mt-1" style={{ color: "#64748b" }}>+ ${totalCuotas.toLocaleString("es-AR")} en cuotas</p>
          )}
        </div>
        <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={16} style={{ color: disponible >= 0 ? "#a855f7" : "#ef4444" }} />
            <p className="text-xs" style={{ color: "#64748b" }}>Disponible</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: disponible >= 0 ? "#a855f7" : "#ef4444" }}>
            ${disponible.toLocaleString("es-AR")}
          </p>
          <p className="text-xs mt-1" style={{ color: "#475569" }}>ingresos − gastos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gastos por categoría */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <div className="px-5 py-3" style={{ borderBottom: "1px solid #334155" }}>
            <h2 className="font-semibold" style={{ color: "#e2e8f0" }}>Gastos por categoría</h2>
          </div>
          {gastosPorCat.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm" style={{ color: "#64748b" }}>Sin gastos registrados</p>
              <a href="/personal/gastos" className="text-xs mt-1 block" style={{ color: "#a855f7" }}>→ Cargar en Mis Gastos</a>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {gastosPorCat.map(cat => (
                <div key={cat.nombre}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: "#94a3b8" }}>{cat.icono} {cat.nombre}</span>
                    <span style={{ color: "#e2e8f0" }}>${cat.total.toLocaleString("es-AR")}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: "#334155" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${(cat.total / maxCat) * 100}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cuotas del mes */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #334155" }}>
            <h2 className="font-semibold" style={{ color: "#e2e8f0" }}>
              <CreditCard size={14} className="inline mr-1" style={{ color: "#a855f7" }} />
              Cuotas activas {MESES[mes]}
            </h2>
            {totalCuotas > 0 && (
              <span className="text-sm font-bold" style={{ color: "#a855f7" }}>${totalCuotas.toLocaleString("es-AR")}</span>
            )}
          </div>
          {cuotasActivas.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm" style={{ color: "#64748b" }}>Sin cuotas activas</p>
              <a href="/personal/tarjetas" className="text-xs mt-1 block" style={{ color: "#a855f7" }}>→ Ver Mis Tarjetas</a>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "#33415530" }}>
              {cuotasActivas.map((g: any) => {
                const [anioI, mesI] = g.mes_inicio.split("-").map(Number);
                const [anioN, mesN] = mesStr.split("-").map(Number);
                const num = (anioN - anioI) * 12 + (mesN - mesI) + 1;
                return (
                  <div key={g.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#e2e8f0" }}>{g.descripcion}</p>
                      <p className="text-xs" style={{ color: "#64748b" }}>
                        {g.tarjeta?.nombre} · Cuota {num}/{g.cantidad_cuotas}
                      </p>
                    </div>
                    <p className="font-semibold" style={{ color: g.tarjeta?.color || "#a855f7" }}>
                      ${Number(g.monto_cuota).toLocaleString("es-AR")}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
