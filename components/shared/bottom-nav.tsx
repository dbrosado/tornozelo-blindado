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
    <nav className="fixed bottom-0 left-0 right-0 z-50 py-3 px-6 bg-carbon/90 border-t border-grid backdrop-blur-xl">
      <div className="max-w-md mx-auto flex justify-between items-center relative">
        {/* Active Indicator Glow/Bar could go here */}
        
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-300 relative group",
                isActive ? "text-primary -translate-y-1" : "text-muted-foreground hover:text-white"
              )}
            >
              {/* Active Glow */}
              {isActive && (
                 <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 opacity-50"></div>
              )}
              
              <item.icon 
                className={cn("h-6 w-6 relative z-10 transition-transform duration-300", isActive && "scale-110")} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn("text-[10px] font-chakra font-bold tracking-wider relative z-10", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
