"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase-client";

type Mode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseClient(), []);

  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });

        if (error) throw error;

        const sessionUser = data.session?.user;
        if (sessionUser) {
          const userName =
            (sessionUser.user_metadata?.full_name as string | undefined) ||
            (sessionUser.email?.split("@")[0] ?? name.trim());
          localStorage.setItem("tb_user_name", userName);
          router.push("/app/today");
          return;
        }

        setMessage(
          "Conta criada, mas ainda sem sessão. No Supabase desative 'Confirm email' para entrar sem verificar e-mail."
        );
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const userName =
        (data.user.user_metadata?.full_name as string | undefined) ||
        (data.user.email?.split("@")[0] ?? "");

      localStorage.setItem("tb_user_name", userName);
      router.push("/app/today");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro inesperado.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setMessage("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao iniciar login com Google.";
      setMessage(errorMessage);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-md rounded-2xl border border-[#2A2A2A] bg-[#111111] p-6 shadow-xl">
        <h1 className="text-2xl font-extrabold font-heading tracking-tight">Tornozelo Blindado</h1>
        <p className="text-sm text-[#A3A3A3] mt-1">
          {mode === "signup" ? "Crie sua conta para começar" : "Entre na sua conta"}
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-11 rounded-xl font-semibold border border-[#333] bg-[#1A1A1A] text-white disabled:opacity-60"
          >
            Entrar com Google
          </button>
        </div>

        <div className="my-4 text-center text-xs text-[#666] uppercase tracking-wider">ou</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-xs text-[#A3A3A3] uppercase tracking-wider">Nome</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl bg-[#1A1A1A] border border-[#333] px-3 py-2 text-sm"
                placeholder="Seu nome"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-[#A3A3A3] uppercase tracking-wider">E-mail</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl bg-[#1A1A1A] border border-[#333] px-3 py-2 text-sm"
              placeholder="voce@email.com"
            />
          </div>

          <div>
            <label className="text-xs text-[#A3A3A3] uppercase tracking-wider">Senha</label>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl bg-[#1A1A1A] border border-[#333] px-3 py-2 text-sm"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl font-semibold bg-[#10B981] text-[#0A0A0A] disabled:opacity-60"
          >
            {loading ? "Processando..." : mode === "signup" ? "Criar conta" : "Entrar"}
          </button>
        </form>

        <button
          onClick={() => setMode((m) => (m === "signup" ? "login" : "signup"))}
          className="mt-4 text-sm text-[#A3A3A3] hover:text-white"
        >
          {mode === "signup"
            ? "Já tem conta? Clique para entrar"
            : "Não tem conta? Clique para criar"}
        </button>

        {message && <p className="mt-4 text-sm text-amber-400">{message}</p>}
      </div>
    </div>
  );
}
