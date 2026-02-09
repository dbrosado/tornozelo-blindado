"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, TrendingUp } from "lucide-react";
import { useAppStore, DifficultyRating } from "@/lib/store";
import { cn } from "@/lib/utils";

const DIFFICULTY_OPTIONS: { value: DifficultyRating; label: string; emoji: string; color: string; description: string }[] = [
  { value: 1, label: "Leve", emoji: "🌱", color: "bg-primary/20 border-primary text-primary", description: "Consegui fazer tudo sem esforço" },
  { value: 2, label: "Moderado", emoji: "💪", color: "bg-warning/20 border-warning text-warning", description: "Foi desafiador mas completei" },
  { value: 3, label: "Difícil", emoji: "🔥", color: "bg-danger/20 border-danger text-danger", description: "Quase no meu limite" },
];

export default function PostWorkoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { actions, currentStageId } = useAppStore();

  // Get workout data from URL params
  const parsedCompleted = Number.parseInt(searchParams.get('completed') || '9', 10);
  const parsedTotal = Number.parseInt(searchParams.get('total') || '9', 10);
  const exercisesCompleted = Number.isNaN(parsedCompleted) ? 9 : parsedCompleted;
  const totalExercises = Number.isNaN(parsedTotal) || parsedTotal <= 0 ? 9 : parsedTotal;

  // Form state
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
    if (step === 2) return true; // Pain can be 0
    if (step === 3) return true;
    return false;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit and celebrate
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

  // Confetti celebration screen
  if (showConfetti) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-carbon px-6">
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

        <div className="text-center space-y-6 animate-in zoom-in-50 duration-500">
          <div className="text-7xl animate-bounce">🎉</div>
          <h1 className="text-3xl font-black font-chakra text-white uppercase tracking-wider">
            XP Conquistado!
          </h1>
          <p className="text-4xl font-black font-chakra text-primary">
            +{50 + (difficulty || 1) * 20 + Math.round((exercisesCompleted / totalExercises) * 30)} XP
          </p>
          <p className="text-text-muted">Seu tendão está mais forte!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-carbon">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-grid/30">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5 text-text-muted" />
        </Button>
        <div className="text-center">
          <span className="text-xs text-primary font-bold uppercase tracking-widest">Feedback</span>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Pergunta {step}/3</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2">
        <div className="w-full bg-grid/30 h-1 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500"
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
              <h2 className="text-2xl font-black font-chakra text-white uppercase tracking-tight">
                Como foi o treino?
              </h2>
              <p className="text-text-muted text-sm">
                Sua resposta ajuda a calibrar a progressão
              </p>
            </div>

            <div className="space-y-3">
              {DIFFICULTY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDifficulty(option.value)}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 transition-all duration-300 text-left",
                    difficulty === option.value
                      ? option.color + " scale-[1.02]"
                      : "bg-blueprint/20 border-grid/30 hover:border-grid/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{option.emoji}</span>
                    <div>
                      <p className="font-bold text-lg text-white">{option.label}</p>
                      <p className="text-xs text-text-muted">{option.description}</p>
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
              <h2 className="text-2xl font-black font-chakra text-white uppercase tracking-tight">
                Sentiu dor?
              </h2>
              <p className="text-text-muted text-sm">
                0 = Nenhuma dor • 10 = Dor intensa
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
                  className="w-full h-3 bg-grid/30 rounded-full appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-primary 
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:shadow-primary/30"
                />
                <div className="flex justify-between mt-2 text-xs text-text-muted">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              <div className={cn(
                "p-4 rounded-xl border text-center transition-all",
                painLevel === 0
                  ? "bg-primary/10 border-primary/30"
                  : painLevel <= 3
                    ? "bg-primary/10 border-primary/30"
                    : painLevel <= 6
                      ? "bg-warning/10 border-warning/30"
                      : "bg-danger/10 border-danger/30"
              )}>
                <p className="text-4xl font-black font-chakra">{painLevel}</p>
                <p className="text-sm text-text-muted mt-1">
                  {painLevel === 0 && "Perfeito! Sem dor."}
                  {painLevel > 0 && painLevel <= 3 && "Desconforto mínimo."}
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
              <h2 className="text-2xl font-black font-chakra text-white uppercase tracking-tight">
                Estabilidade do tornozelo?
              </h2>
              <p className="text-text-muted text-sm">
                0 = Muito instável • 10 = Firme como rocha
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
                  className="w-full h-3 bg-grid/30 rounded-full appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-primary 
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:shadow-primary/30"
                />
                <div className="flex justify-between mt-2 text-xs text-text-muted">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              <div className={cn(
                "p-4 rounded-xl border text-center transition-all",
                stability >= 8
                  ? "bg-primary/10 border-primary/30"
                  : stability >= 5
                    ? "bg-warning/10 border-warning/30"
                    : "bg-danger/10 border-danger/30"
              )}>
                <p className="text-4xl font-black font-chakra">{stability}</p>
                <p className="text-sm text-text-muted mt-1">
                  {stability >= 8 && "Excelente! Tornozelo firme."}
                  {stability >= 5 && stability < 8 && "Boa evolução. Continue assim."}
                  {stability < 5 && "Foco em estabilidade no próximo treino."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="p-6">
        <Button
          className="w-full h-16 text-lg font-bold font-chakra uppercase tracking-widest bg-primary hover:bg-primary/90 text-carbon rounded-2xl disabled:opacity-50"
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {step < 3 ? 'Próximo' : 'Finalizar'}
          <TrendingUp className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
