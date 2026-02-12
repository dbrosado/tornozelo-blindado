"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase-client";
import { useAppStore } from "@/lib/store";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const completeOnboarding = useAppStore((s) => s.actions.completeOnboarding);

  const [goal, setGoal] = useState<"dor" | "performance" | "retorno">("dor");
  const [painBaseline, setPainBaseline] = useState(3);
  const [level, setLevel] = useState<"iniciante" | "intermediario" | "avancado">("iniciante");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    completeOnboarding({ goal, painBaseline, level });

    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase.auth.updateUser({
        data: {
          goal,
          pain_baseline: painBaseline,
          level,
        },
      });
    }

    router.push("/app/today");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-md rounded-2xl border border-[#2A2A2A] bg-[#111111] p-6 shadow-xl">
        <h1 className="text-2xl font-extrabold font-heading tracking-tight">Configuração Inicial</h1>
        <p className="text-sm text-[#A3A3A3] mt-1">Leva 30 segundos.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="text-xs text-[#A3A3A3] uppercase tracking-wider">Objetivo</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as typeof goal)}
              className="mt-1 w-full rounded-xl bg-[#1A1A1A] border border-[#333] px-3 py-2 text-sm"
            >
              <option value="dor">Reduzir dor</option>
              <option value="performance">Performance</option>
              <option value="retorno">Retornar ao treino</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-[#A3A3A3] uppercase tracking-wider">Dor atual (0 a 10)</label>
            <input
              type="range"
              min={0}
              max={10}
              value={painBaseline}
              onChange={(e) => setPainBaseline(Number(e.target.value))}
              className="mt-2 w-full"
            />
            <p className="text-sm text-[#A3A3A3] mt-1">{painBaseline}/10</p>
          </div>

          <div>
            <label className="text-xs text-[#A3A3A3] uppercase tracking-wider">Nível atual</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as typeof level)}
              className="mt-1 w-full rounded-xl bg-[#1A1A1A] border border-[#333] px-3 py-2 text-sm"
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl font-semibold bg-[#10B981] text-[#0A0A0A] disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Começar"}
          </button>
        </form>
      </div>
    </div>
  );
}
