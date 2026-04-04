import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "@/components/LayoutClient";

export const metadata: Metadata = {
  title: "Finanzas Personales",
  description: "Gestión de gastos e ingresos — Tincho & Pau",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ backgroundColor: "#0f172a", color: "#e2e8f0" }}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
