"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BarChart2, BookOpen, Settings, List } from "lucide-react";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Hoje", icon: Home, path: "/app/today" },
    { label: "Progresso", icon: BarChart2, path: "/app/progress" },
    { label: "Biblioteca", icon: List, path: "/app/library" },
    { label: "Manual", icon: BookOpen, path: "/app/manual" },
    { label: "Ajustes", icon: Settings, path: "/app/settings" },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 px-4 py-3 rounded-2xl neu-card" style={{ background: '#1A1A1A' }}>
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-200 relative min-w-[48px] min-h-[44px] cursor-pointer",
                isActive ? "text-[#10B981]" : "text-[#A3A3A3] hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute -top-1 w-8 h-1 rounded-full gradient-primary" />
              )}

              <item.icon
                className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={cn(
                "text-[10px] font-heading font-semibold tracking-wide transition-opacity duration-200",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
