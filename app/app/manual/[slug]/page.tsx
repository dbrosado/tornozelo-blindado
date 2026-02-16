"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, useScroll } from "framer-motion";
import { ArrowLeft, Clock, BookOpen, Microscope, Footprints, Pill, Shield, Zap, HeartPulse, TrendingUp, Flame } from "lucide-react";
import { manualArticles, categoryLabels, categoryColors } from "@/lib/manual-content";
import { useEffect, useState, useRef } from "react";

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

export default function ArticlePage() {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    const article = manualArticles.find((a) => a.slug === slug);

    useEffect(() => {
        const handleScroll = () => {
            const el = document.documentElement;
            const scrollTop = el.scrollTop;
            const scrollHeight = el.scrollHeight - el.clientHeight;
            if (scrollHeight > 0) {
                setProgress((scrollTop / scrollHeight) * 100);
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-[#A3A3A3]">Artigo não encontrado.</p>
            </div>
        );
    }

    const IconComponent = iconMap[article.icon] || BookOpen;

    return (
        <>
            {/* Reading progress bar */}
            <div
                className="reading-progress"
                style={{ width: `${progress}%` }}
            />

            <div className="space-y-6 pb-28" ref={scrollRef}>
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[#A3A3A3] hover:text-white transition-colors -ml-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm">Voltar ao Manual</span>
                    </button>

                    <div className="flex items-start gap-4">
                        <div
                            className="neu-inset p-3.5 rounded-xl shrink-0"
                            style={{
                                boxShadow: `inset 4px 4px 8px rgba(0,0,0,0.6), inset -3px -3px 6px ${article.color}08`,
                            }}
                        >
                            <IconComponent
                                className="h-6 w-6"
                                style={{ color: article.color }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span
                                    className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                                    style={{
                                        color: categoryColors[article.category],
                                        background: `${categoryColors[article.category]}15`,
                                        border: `1px solid ${categoryColors[article.category]}30`,
                                    }}
                                >
                                    {categoryLabels[article.category]}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] text-[#666]">
                                    <Clock className="h-3 w-3" />
                                    {article.readTime}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold font-heading text-white leading-tight">
                                {article.title}
                            </h1>
                            <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
                                {article.subtitle}
                            </p>
                        </div>
                    </div>
                </motion.header>

                {/* Content Sections */}
                <div className="space-y-4">
                    {article.sections.map((section, i) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + i * 0.1 }}
                        >
                            <SectionCard content={section.content} color={article.color} />
                        </motion.div>
                    ))}
                </div>

                {/* Navigation */}
                <ArticleNavigation currentSlug={slug} />
            </div>
        </>
    );
}

function SectionCard({ content, color }: { content: string; color: string }) {
    const lines = content.trim().split("\n");
    const title = lines[0];
    const body = lines.slice(1).join("\n").trim();

    return (
        <div className="neu-card p-5 space-y-3">
            <h2
                className="text-sm font-bold font-heading tracking-tight"
                style={{ color }}
            >
                {title}
            </h2>
            <div className="text-[13px] text-[#C4C4C4] leading-[1.75] space-y-2.5">
                {body.split("\n\n").map((paragraph, i) => {
                    // Check if paragraph is a list
                    if (paragraph.startsWith("•") || paragraph.startsWith("✅") || paragraph.startsWith("❌")) {
                        return (
                            <div key={i} className="space-y-1.5">
                                {paragraph.split("\n").map((line, j) => {
                                    const trimmed = line.trim();
                                    if (!trimmed) return null;

                                    if (trimmed.startsWith("•")) {
                                        return (
                                            <div key={j} className="flex gap-2 pl-1">
                                                <span className="text-[10px] mt-1.5 shrink-0" style={{ color }}>●</span>
                                                <span>{renderBold(trimmed.slice(1).trim())}</span>
                                            </div>
                                        );
                                    }
                                    if (trimmed.startsWith("✅")) {
                                        return (
                                            <div key={j} className="flex gap-2 pl-1 text-[#10B981]">
                                                <span className="shrink-0">✅</span>
                                                <span className="text-[#C4C4C4]">{renderBold(trimmed.slice(1).trim())}</span>
                                            </div>
                                        );
                                    }
                                    if (trimmed.startsWith("❌")) {
                                        return (
                                            <div key={j} className="flex gap-2 pl-1 text-[#EF4444]">
                                                <span className="shrink-0">❌</span>
                                                <span className="text-[#C4C4C4]">{renderBold(trimmed.slice(1).trim())}</span>
                                            </div>
                                        );
                                    }
                                    return <p key={j}>{renderBold(trimmed)}</p>;
                                })}
                            </div>
                        );
                    }

                    // Check for numbered lists
                    if (/^\d+\./.test(paragraph.trim())) {
                        return (
                            <div key={i} className="space-y-1.5">
                                {paragraph.split("\n").map((line, j) => {
                                    const trimmed = line.trim();
                                    if (!trimmed) return null;
                                    const match = trimmed.match(/^(\d+)\.\s*(.*)/);
                                    if (match) {
                                        return (
                                            <div key={j} className="flex gap-2.5 pl-1">
                                                <span
                                                    className="text-[11px] font-bold font-heading mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                                                    style={{ color, background: `${color}15` }}
                                                >
                                                    {match[1]}
                                                </span>
                                                <span>{renderBold(match[2])}</span>
                                            </div>
                                        );
                                    }
                                    return <p key={j}>{renderBold(trimmed)}</p>;
                                })}
                            </div>
                        );
                    }

                    // Regular paragraph
                    return <p key={i}>{renderBold(paragraph.replace(/\n/g, " ").trim())}</p>;
                })}
            </div>
        </div>
    );
}

function renderBold(text: string) {
    // Split by patterns like "Timing:", "Protocolo:", "Evidência:", etc.
    const parts = text.split(/(\b[A-ZÁÉÍÓÚÀÂÊÔÃÇ][a-záéíóúàâêôãç]+(?:\s+[A-ZÁÉÍÓÚÀÂÊÔÃÇ][a-záéíóúàâêôãç]+)*:)/g);

    return parts.map((part, i) => {
        if (part.endsWith(":") && /^[A-ZÁÉÍÓÚÀÂÊÔÃÇ]/.test(part)) {
            return (
                <span key={i} className="text-white font-semibold">
                    {part}
                </span>
            );
        }
        return part;
    });
}

function ArticleNavigation({ currentSlug }: { currentSlug: string }) {
    const router = useRouter();
    const currentIndex = manualArticles.findIndex((a) => a.slug === currentSlug);
    const prev = currentIndex > 0 ? manualArticles[currentIndex - 1] : null;
    const next = currentIndex < manualArticles.length - 1 ? manualArticles[currentIndex + 1] : null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 pt-2"
        >
            {prev && (
                <button
                    onClick={() => {
                        window.scrollTo(0, 0);
                        router.push(`/app/manual/${prev.slug}`);
                    }}
                    className="flex-1 neu-card p-4 text-left hover:scale-[1.01] active:scale-[0.99] transition-transform"
                >
                    <span className="text-[10px] text-[#666] uppercase tracking-widest">← Anterior</span>
                    <p className="text-xs font-semibold font-heading text-white mt-1 truncate">
                        {prev.title}
                    </p>
                </button>
            )}
            {next && (
                <button
                    onClick={() => {
                        window.scrollTo(0, 0);
                        router.push(`/app/manual/${next.slug}`);
                    }}
                    className="flex-1 neu-card p-4 text-right hover:scale-[1.01] active:scale-[0.99] transition-transform"
                >
                    <span className="text-[10px] text-[#666] uppercase tracking-widest">Próximo →</span>
                    <p className="text-xs font-semibold font-heading text-white mt-1 truncate">
                        {next.title}
                    </p>
                </button>
            )}
        </motion.div>
    );
}
