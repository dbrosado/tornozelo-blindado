"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, TrendingUp } from "lucide-react";
import { useAppStore, DifficultyRating } from "@/lib/store";
import { cn } from "@/lib/utils";

const DIFFICULTY_OPTIONS: { value: DifficultyRating; label: string; emoji: string; color: string; description: string }[] = [
  { value: 1, label: "Leve", emoji: "🌱", color: "bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]", description: "Consegui fazer tudo sem esforco" },
  { value: 2, label: "Moderado", emoji: "💪", color: "bg-amber-500/15 border-amber-500/40 text-amber-500", description: "Foi desafiador mas completei" },
  { value: 3, label: "Dificil", emoji: "🔥", color: "bg-red-500/15 border-red-500/40 text-red-500", description: "Quase no meu limite" },
];

function PostWorkoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { actions, currentStageId } = useAppStore();

  const parsedCompleted = Number.parseInt(searchParams.get('completed') || '9', 10);
  const parsedTotal = Number.parseInt(searchParams.get('total') || '9', 10);
  const exercisesCompleted = Number.isNaN(parsedCompleted) ? 9 : parsedCompleted;
  const totalExercises = Number.isNaN(parsedTotal) || parsedTotal <= 0 ? 9 : parsedTotal;

  const [difficulty, setDifficulty] = useState<DifficultyRating | null>(null);
  const [painLevel, setPainLevel] = useState(0);
  const [stability, setStability] = useState(7);
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);

  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        delay: `${((i * 11) % 15) / 10}s`,
        icon: ['✨', '🌟', '💪', '🔥', '⚡'][i % 5],
      })),
    []
  );

  const canProceed = () => {
    if (step === 1) return difficulty !== null;
    if (step === 2) return true;
    if (step === 3) return true;
    return false;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (difficulty !== null) {
        actions.submitPostWorkout({
          difficulty,
          painLevel,
          stability,
          stageId: currentStageId,
          exercisesCompleted,
          totalExercises
        });
        setShowConfetti(true);
        setTimeout(() => {
          router.push('/app/today');
        }, 2500);
      }
    }
  };

  // Confetti celebration
  if (showConfetti) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute animate-[fall_3s_ease-in-out_forwards]"
              style={{
                left: piece.left,
                top: `-20px`,
                animationDelay: piece.delay,
              }}
            >
              <span className="text-2xl">{piece.icon}</span>
            </div>
          ))}
        </div>

        <div className="text-center space-y-6 modal-content">
          <div className="text-7xl animate-bounce">🎉</div>
          <h1 className="text-3xl font-extrabold font-heading text-white uppercase tracking-wider">
            XP Conquistado!
          </h1>
          <p className="text-4xl font-extrabold font-heading text-[#10B981]">
            +{50 + (difficulty || 1) * 20 + Math.round((exercisesCompleted / totalExercises) * 30)} XP
          </p>
          <p className="text-[#A3A3A3]">Seu tendao esta mais forte!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#333333]/30">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5 text-[#A3A3A3]" />
        </Button>
        <div className="text-center">
          <span className="text-xs text-[#10B981] font-semibold font-heading uppercase tracking-widest">Feedback</span>
          <p className="text-[10px] text-[#A3A3A3] uppercase tracking-wider">Pergunta {step}/3</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2">
        <div className="w-full neu-inset h-1.5 rounded-full overflow-hidden">
          <div
            className="gradient-primary h-full transition-all duration-500 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">

        {/* Question 1: Difficulty */}
        {step === 1 && (
          <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <div className="text-center space-y-2">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-2xl font-extrabold font-heading text-white uppercase tracking-tight">
                Como foi o treino?
              </h2>
              <p className="text-[#A3A3A3] text-sm">
                Sua resposta ajuda a calibrar a progressao
              </p>
            </div>

            <div className="space-y-3">
              {DIFFICULTY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDifficulty(option.value)}
                  className={cn(
                    "w-full p-4 rounded-[14px] border-2 transition-all duration-300 text-left cursor-pointer",
                    difficulty === option.value
                      ? option.color + " scale-[1.02]"
                      : "neu-card border-transparent hover:border-[#333333]"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{option.emoji}</span>
                    <div>
                      <p className="font-semibold font-heading text-lg text-white">{option.label}</p>
                      <p className="text-xs text-[#A3A3A3]">{option.description}</p>
                    </div>
                    {difficulty === option.value && (
                      <Sparkles className="ml-auto h-5 w-5" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 2: Pain Level */}
        {step === 2 && (
          <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <div className="text-center space-y-2">
              <div className="text-5xl mb-4">
                {painLevel === 0 ? '😌' : painLevel <= 3 ? '🙂' : painLevel <= 6 ? '😐' : '😣'}
              </div>
              <h2 className="text-2xl font-extrabold font-heading text-white uppercase tracking-tight">
                Sentiu dor?
              </h2>
              <p className="text-[#A3A3A3] text-sm">
                0 = Nenhuma dor - 10 = Dor intensa
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative pt-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-[#A3A3A3]">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              <div className={cn(
                "p-4 rounded-[14px] border text-center transition-all",
                painLevel === 0
                  ? "bg-[#10B981]/10 border-[#10B981]/30"
                  : painLevel <= 3
                    ? "bg-[#10B981]/10 border-[#10B981]/30"
                    : painLevel <= 6
                      ? "bg-amber-500/10 border-amber-500/30"
                      : "bg-red-500/10 border-red-500/30"
              )}>
                <p className="text-4xl font-extrabold font-heading">{painLevel}</p>
                <p className="text-sm text-[#A3A3A3] mt-1">
                  {painLevel === 0 && "Perfeito! Sem dor."}
                  {painLevel > 0 && painLevel <= 3 && "Desconforto minimo."}
                  {painLevel > 3 && painLevel <= 6 && "Dor moderada. Fique atento."}
                  {painLevel > 6 && "⚠️ Considere reduzir intensidade."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Question 3: Stability */}
        {step === 3 && (
          <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <div className="text-center space-y-2">
              <div className="text-5xl mb-4">
                {stability >= 8 ? '🏰' : stability >= 5 ? '🏠' : '🏚️'}
              </div>
              <h2 className="text-2xl font-extrabold font-heading text-white uppercase tracking-tight">
                Estabilidade do tornozelo?
              </h2>
              <p className="text-[#A3A3A3] text-sm">
                0 = Muito instavel - 10 = Firme como rocha
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative pt-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={stability}
                  onChange={(e) => setStability(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-[#A3A3A3]">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              <div className={cn(
                "p-4 rounded-[14px] border text-center transition-all",
                stability >= 8
                  ? "bg-[#10B981]/10 border-[#10B981]/30"
                  : stability >= 5
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-red-500/10 border-red-500/30"
              )}>
                <p className="text-4xl font-extrabold font-heading">{stability}</p>
                <p className="text-sm text-[#A3A3A3] mt-1">
                  {stability >= 8 && "Excelente! Tornozelo firme."}
                  {stability >= 5 && stability < 8 && "Boa evolucao. Continue assim."}
                  {stability < 5 && "Foco em estabilidade no proximo treino."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="p-6">
        <Button
          className="w-full h-16 text-lg"
          size="lg"
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {step < 3 ? 'Proximo' : 'Finalizar'}
          <TrendingUp className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default function PostWorkoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center space-y-4">
          <div className="text-5xl animate-pulse">💪</div>
          <p className="text-[#A3A3A3]">Carregando...</p>
        </div>
      </div>
    }>
      <PostWorkoutContent />
    </Suspense>
  );
}
