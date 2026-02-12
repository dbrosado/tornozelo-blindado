"use client";

import { Clock, Timer, Heart, ShieldAlert, Activity, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const articles = [
  { title: "Regra dos 10 Minutos", desc: "Por que treinos curtos vencem treinos longos para tendoes.", icon: Timer, color: "#10B981" },
  { title: "Janela de 6 Horas", desc: "A ciencia da janela ouro para sintese de colageno.", icon: Clock, color: "#3B82F6" },
  { title: "Dor Boa vs Dor Ruim", desc: "Como diferenciar adaptacao de lesao.", icon: Heart, color: "#F59E0B" },
  { title: "Progressao Inteligente", desc: "Quando avancar e quando recuar.", icon: Activity, color: "#10B981" },
  { title: "Sinais de Alerta", desc: "Quando parar imediatamente.", icon: ShieldAlert, color: "#EF4444" },
];

export default function ManualPage() {

  return (
    <div className="space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-semibold font-heading text-white tracking-tight">MANUAL</h1>
        <p className="text-xs text-[#A3A3A3] uppercase tracking-widest">Conheca o Protocolo</p>
      </header>

      <div className="space-y-3">
        {articles.map((article, i) => (
          <motion.button
            key={article.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="w-full flex items-center gap-4 p-5 neu-card cursor-pointer text-left"
          >
            <div className="neu-inset p-3 rounded-xl shrink-0">
              <article.icon className="h-5 w-5" style={{ color: article.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-sm text-white">{article.title}</h3>
              <p className="text-xs text-[#A3A3A3] mt-0.5 truncate">{article.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="neu-inset p-4 rounded-xl text-center">
        <BookOpen className="h-5 w-5 mx-auto text-[#A3A3A3] mb-2" />
        <p className="text-xs text-[#666666]">
          Mais artigos serao adicionados conforme voce avanca no protocolo.
        </p>
      </div>
    </div>
  );
}
