"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import AuthGuard from "./AuthGuard";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <AuthGuard>
      {isLogin ? (
        <>{children}</>
      ) : (
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8" style={{ marginLeft: "240px" }}>
            {children}
          </main>
        </div>
      )}
    </AuthGuard>
  );
}
