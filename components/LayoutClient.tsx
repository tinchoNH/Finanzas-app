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
          <main className="flex-1 overflow-y-auto p-4 pt-14 md:p-8 md:pt-8" style={{ marginLeft: 0 }}>
            <div className="hidden md:block" style={{ width: "240px", position: "fixed" }} />
            <div className="md:ml-[240px]">
              {children}
            </div>
          </main>
        </div>
      )}
    </AuthGuard>
  );
}
