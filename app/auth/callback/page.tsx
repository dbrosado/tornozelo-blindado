"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseClient(), []);

  useEffect(() => {
    async function finishLogin() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          router.replace(`/auth?error=${encodeURIComponent(error.message)}`);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const userName =
          (data.session.user.user_metadata?.full_name as string | undefined) ||
          (data.session.user.email?.split("@")[0] ?? "");
        if (userName) localStorage.setItem("tb_user_name", userName);
        router.replace("/app/today");
        return;
      }

      router.replace("/auth");
    }

    finishLogin();
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
      <p className="text-sm text-[#A3A3A3]">Concluindo login...</p>
    </div>
  );
}
