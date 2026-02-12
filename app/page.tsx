"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase-client";

export default function Home() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseClient(), []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        router.replace("/app/today");
      } else {
        router.replace("/auth");
      }
    });

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
      <p className="text-sm text-[#A3A3A3]">Carregando...</p>
    </div>
  );
}
