"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email o contraseña incorrectos");
      setLoading(false);
    }
    // El AuthGuard detecta el SIGNED_IN y redirige automáticamente
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0f172a" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💰</div>
          <h1 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>Finanzas</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>Tincho &amp; Pau</p>
        </div>

        <div className="rounded-2xl p-8 space-y-5" style={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <h2 className="text-lg font-semibold text-center" style={{ color: "#e2e8f0" }}>Iniciar sesión</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs mb-1.5 block font-medium" style={{ color: "#94a3b8" }}>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                placeholder="tumail@gmail.com"
                onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
                onBlur={e => (e.target.style.borderColor = "#334155")}
              />
            </div>

            <div>
              <label className="text-xs mb-1.5 block font-medium" style={{ color: "#94a3b8" }}>Contraseña</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                placeholder="••••••••"
                onFocus={e => (e.target.style.borderColor = "#0ea5e9")}
                onBlur={e => (e.target.style.borderColor = "#334155")}
              />
            </div>

            {error && (
              <div className="px-4 py-2.5 rounded-xl text-sm" style={{ backgroundColor: "#450a0a", color: "#ef4444", border: "1px solid #ef444433" }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white disabled:opacity-60"
              style={{ backgroundColor: "#0ea5e9" }}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
