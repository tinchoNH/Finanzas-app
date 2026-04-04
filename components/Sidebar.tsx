"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CreditCard, Receipt, PieChart, BarChart3, Tag, Download, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, section: "Principal" },
  { label: "Gastos", href: "/gastos", icon: Receipt, section: "Principal" },
  { label: "Tarjetas", href: "/tarjetas", icon: CreditCard, section: "Principal" },
  { label: "Presupuesto", href: "/presupuesto", icon: PieChart, section: "Principal" },
  { label: "Resumen", href: "/resumen", icon: BarChart3, section: "Análisis" },
  { label: "Categorías", href: "/categorias", icon: Tag, section: "Análisis" },
  { label: "Exportar", href: "/exportar", icon: Download, section: "Análisis" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [nombre, setNombre] = useState("...");
  const [inicial, setInicial] = useState("?");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const n = data.user.user_metadata?.nombre || data.user.email || "Usuario";
        setNombre(n);
        setInicial(n[0].toUpperCase());
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-full flex flex-col" style={{ width: "240px", backgroundColor: "#1e293b", borderRight: "1px solid #334155" }}>
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: "1px solid #334155" }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-lg font-bold" style={{ color: "#38bdf8" }}>Finanzas</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {["Principal", "Análisis"].map(section => (
          <div key={section} className="mb-2">
            <p className="px-5 mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>{section}</p>
            {navItems.filter(item => item.section === section).map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                  style={{ backgroundColor: isActive ? "#0ea5e9" : "transparent", color: isActive ? "#ffffff" : "#94a3b8" }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = "#334155"; e.currentTarget.style.color = "#e2e8f0"; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#94a3b8"; } }}>
                  <Icon size={16} />{item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 flex items-center gap-3" style={{ borderTop: "1px solid #334155" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: "#0ea5e9" }}>
          {inicial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "#e2e8f0" }}>{nombre}</p>
          <p className="text-xs" style={{ color: "#64748b" }}>Plan personal</p>
        </div>
        <button onClick={handleLogout} title="Cerrar sesión" style={{ color: "#475569" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
          onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
