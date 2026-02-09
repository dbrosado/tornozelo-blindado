"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import {
  REALMS,
  canUnlockStage,
  getStageById
} from "@/lib/data/cultivation-system";
import { cn } from "@/lib/utils";
import { Lock, Unlock, ChevronRight, AlertTriangle, Zap, Star } from "lucide-react";

export default function LibraryPage() {
  const router = useRouter();
  const {
    unlockedStages,
    startDate,
    totalSessions,
    postWorkoutRatings,
    currentStageId,
    actions
  } = useAppStore();

  const daysSinceStart = useMemo(() => {
    if (!startDate) return 0;
    return differenceInDays(new Date(), new Date(startDate));
  }, [startDate]);

  const avgDifficulty = useMemo(() => {
    if (postWorkoutRatings.length === 0) return 0;
    return postWorkoutRatings.reduce((sum, r) => sum + r.difficulty, 0) / postWorkoutRatings.length;
  }, [postWorkoutRatings]);

  const handleStageClick = (stageId: number) => {
    if (unlockedStages.includes(stageId)) {
      // Navigate to workout with this stage
      router.push(`/app/session?stage=${stageId}`);
    }
  };

  const handleForceUnlock = (stageId: number) => {
    if (confirm(`⚠️ AVISO DE SEGURANÇA\n\nDesbloquear estágios avançados sem a preparação adequada pode causar lesão no tendão.\n\nVocê tem certeza que quer pular para o Estágio ${stageId}?`)) {
      actions.forceUnlockStage(stageId);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-black font-chakra uppercase text-white tracking-tight">
          Biblioteca de Treinos
        </h1>
        <p className="text-xs text-text-muted uppercase tracking-widest">
          Saga da Ascensão do Tendão • 10 Estágios
        </p>
      </header>

      {/* Realms */}
      {REALMS.map((realm) => (
        <div key={realm.name} className="space-y-3">
          {/* Realm Header */}
          <div className="flex items-center gap-2">
            <div className={cn("h-px flex-1 bg-gradient-to-r from-transparent to-current opacity-30", realm.color)} />
            <h2 className={cn("text-sm font-bold uppercase tracking-widest", realm.color)}>
              {realm.name}
            </h2>
            <div className={cn("h-px flex-1 bg-gradient-to-l from-transparent to-current opacity-30", realm.color)} />
          </div>

          {/* Stages in this Realm */}
          <div className="space-y-2">
            {realm.stages.map((stageId) => {
              const stage = getStageById(stageId);
              const isUnlocked = unlockedStages.includes(stageId);
              const isCurrent = stageId === currentStageId;
              const { canUnlock, reasons } = canUnlockStage(stage, daysSinceStart, totalSessions, avgDifficulty);

              return (
                <div
                  key={stageId}
                  className={cn(
                    "relative rounded-xl border p-4 transition-all",
                    isUnlocked
                      ? "bg-blueprint/30 border-grid/50 hover:border-primary/30 cursor-pointer"
                      : "bg-grid/10 border-grid/20 opacity-60",
                    isCurrent && "border-primary/50 ring-1 ring-primary/30"
                  )}
                  onClick={() => isUnlocked && handleStageClick(stageId)}
                >
                  <div className="flex items-center gap-4">
                    {/* Stage Icon */}
                    <div className={cn(
                      "text-3xl w-12 h-12 flex items-center justify-center rounded-xl",
                      isUnlocked ? "bg-grid/30" : "bg-grid/10"
                    )}>
                      {isUnlocked ? stage.emoji : <Lock className="h-5 w-5 text-text-muted" />}
                    </div>

                    {/* Stage Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted">Estágio {stageId}</span>
                        {isCurrent && (
                          <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded-full font-bold uppercase">
                            Atual
                          </span>
                        )}
                      </div>
                      <h3 className={cn(
                        "font-bold font-chakra uppercase truncate",
                        isUnlocked ? "text-white" : "text-text-muted"
                      )}>
                        {stage.name}
                      </h3>
                      <p className="text-[11px] text-text-muted line-clamp-1">
                        {stage.description}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="shrink-0">
                      {isUnlocked ? (
                        <ChevronRight className="h-5 w-5 text-text-muted" />
                      ) : canUnlock ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            actions.forceUnlockStage(stageId);
                          }}
                        >
                          <Unlock className="h-4 w-4 mr-1" />
                          Liberar
                        </Button>
                      ) : (
                        <Lock className="h-5 w-5 text-text-muted" />
                      )}
                    </div>
                  </div>

                  {/* Requirements (if locked) */}
                  {!isUnlocked && reasons.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-grid/20">
                      <p className="text-[10px] text-text-muted mb-1 uppercase tracking-wider">
                        Requisitos:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {reasons.map((reason, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-1 bg-grid/20 rounded text-text-muted"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>

                      {/* Override Button for advanced users */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2 text-xs text-warning/70 hover:text-warning"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleForceUnlock(stageId);
                        }}
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Desbloquear mesmo assim (Atleta avançado)
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="bg-grid/10 rounded-xl p-4 space-y-2">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Legenda</h4>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-text-muted">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center bg-primary/20 rounded">
              <Star className="h-3 w-3 text-primary" />
            </div>
            <span>Estágio atual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center bg-grid/30 rounded">
              <Lock className="h-3 w-3 text-text-muted" />
            </div>
            <span>Bloqueado</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-warning" />
            <span>Dias + Sessões + Dificuldade</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning/60" />
            <span>Override disponível</span>
          </div>
        </div>
      </div>
    </div>
  );
}
