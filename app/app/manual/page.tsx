"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Microscope,
  Footprints,
  Pill,
  Shield,
  Zap,
  HeartPulse,
  TrendingUp,
  Flame,
  ChevronRight,
  Brain,
  GraduationCap,
} from "lucide-react";
import { manualArticles, categoryLabels, categoryColors, type ManualArticle } from "@/lib/manual-content";

const iconMap: Record<string, React.ElementType> = {
  Microscope,
  Footprints,
  Pill,
  Shield,
  Zap,
  HeartPulse,
  TrendingUp,
  Flame,
};

const categories = [
  { key: "science" as const, label: "Ciência", icon: Brain, desc: "Fundamentos científicos" },
  { key: "protocol" as const, label: "Protocolos", icon: GraduationCap, desc: "Como aplicar na prática" },
  { key: "nutrition" as const, label: "Nutrição", icon: Pill, desc: "Suplementação e dieta" },
  { key: "safety" as const, label: "Segurança", icon: Shield, desc: "Auto-regulação e sinais" },
];

export default function ManualPage() {
  const router = useRouter();

  return (
    <div className="space-y-7 pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <div className="flex items-center gap-3">
          <div className="neu-inset p-2.5 rounded-xl">
            <BookOpen className="h-5 w-5 text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
              MANUAL
            </h1>
            <p className="text-[11px] text-[#A3A3A3] uppercase tracking-widest">
              Conheça a ciência por trás do protocolo
            </p>
          </div>
        </div>
      </motion.header>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="neu-card p-5 space-y-3 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            background: "radial-gradient(ellipse at top right, #10B981 0%, transparent 60%)",
          }}
        />
        <div className="relative">
          <h2 className="text-sm font-bold font-heading text-white">
            Base Científica Completa
          </h2>
          <p className="text-xs text-[#A3A3A3] mt-1.5 leading-relaxed">
            Todo o conteúdo deste manual é baseado em pesquisa científica sobre fisiologia tendínea,
            otimização do sistema nervoso central, e biomecânica do tornozelo. Entender a ciência
            por trás de cada exercício transforma a execução e acelera resultados.
          </p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-[10px] text-[#666]">
              <BookOpen className="h-3 w-3" />
              <span>{manualArticles.length} artigos</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#666]">
              <Clock className="h-3 w-3" />
              <span>~60 min de leitura total</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Sections */}
      {categories.map((cat, catIndex) => {
        const articlesInCategory = manualArticles.filter(
          (a) => a.category === cat.key
        );
        if (articlesInCategory.length === 0) return null;

        return (
          <motion.section
            key={cat.key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + catIndex * 0.08 }}
            className="space-y-3"
          >
            {/* Category Header */}
            <div className="flex items-center gap-2.5 px-1">
              <cat.icon
                className="h-4 w-4"
                style={{ color: categoryColors[cat.key] }}
              />
              <div>
                <h3
                  className="text-xs font-bold font-heading uppercase tracking-wider"
                  style={{ color: categoryColors[cat.key] }}
                >
                  {cat.label}
                </h3>
                <p className="text-[10px] text-[#555]">{cat.desc}</p>
              </div>
            </div>

            {/* Articles */}
            <div className="space-y-2.5">
              {articlesInCategory.map((article, i) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  index={i}
                  onPress={() => router.push(`/app/manual/${article.slug}`)}
                />
              ))}
            </div>
          </motion.section>
        );
      })}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="neu-inset p-4 rounded-xl text-center space-y-2"
      >
        <GraduationCap className="h-5 w-5 mx-auto text-[#444]" />
        <p className="text-[11px] text-[#555] leading-relaxed max-w-[280px] mx-auto">
          Conteúdo baseado em pesquisa de Keith Baar, Jill Cook, e fisiologia do esporte.
          Fontes disponíveis no NotebookLM.
        </p>
      </motion.div>
    </div>
  );
}

function ArticleCard({
  article,
  index,
  onPress,
}: {
  article: ManualArticle;
  index: number;
  onPress: () => void;
}) {
  const IconComponent = iconMap[article.icon] || BookOpen;

  return (
    <motion.button
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.06 }}
      onClick={onPress}
      className="w-full flex items-center gap-3.5 p-4 neu-card cursor-pointer text-left group"
    >
      <div
        className="neu-inset p-3 rounded-xl shrink-0 transition-all duration-300 group-hover:scale-105"
        style={{
          boxShadow: `inset 4px 4px 8px rgba(0,0,0,0.6), inset -3px -3px 6px ${article.color}06`,
        }}
      >
        <IconComponent
          className="h-5 w-5"
          style={{ color: article.color }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-heading font-semibold text-sm text-white truncate">
            {article.title}
          </h3>
        </div>
        <p className="text-[11px] text-[#888] truncate">{article.subtitle}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span
            className="text-[9px] font-semibold uppercase tracking-widest px-1.5 py-px rounded-full"
            style={{
              color: categoryColors[article.category],
              background: `${categoryColors[article.category]}10`,
            }}
          >
            {categoryLabels[article.category]}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[#555]">
            <Clock className="h-2.5 w-2.5" />
            {article.readTime}
          </span>
          <span className="text-[10px] text-[#555]">
            {article.sections.length} seções
          </span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 text-[#444] shrink-0 group-hover:text-white transition-colors" />
    </motion.button>
  );
}
