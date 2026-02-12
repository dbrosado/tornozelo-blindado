"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/shared/bottom-nav";
import { getSupabaseClient } from "@/lib/supabase-client";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (!data.session) {
        router.replace("/auth");
        return;
      }

      const fullName = (data.session.user.user_metadata?.full_name as string | undefined) || "";
      if (fullName) localStorage.setItem("tb_user_name", fullName);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/auth");
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <p className="text-sm text-[#A3A3A3]">Validando sessão...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white pb-24">
      <main className="container max-w-md mx-auto px-5 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}
