"use client";

import { useMemo } from "react";
import { differenceInDays } from "date-fns";
import { useAppStore } from "@/lib/store";
import {
  getCurrentStage,
  getCurrentSubLevel,
  CULTIVATION_STAGES,
  isInProvacao as checkInProvacao,
  getProvacaoProgress as getProvacao
} from "@/lib/data/cultivation-system";
import { cn } from "@/lib/utils";
import { Zap, Calendar, Target, Lock, Flame } from "lucide-react";

export function CultivationCard() {
  const {
    startDate,
    currentXp,
    totalSessions,
    postWorkoutRatings
  } = useAppStore();

  const cultivationInfo = useMemo(() => {
    const daysSinceStart = startDate
      ? differenceInDays(new Date(), new Date(startDate))
      : 0;

    const avgDifficulty = postWorkoutRatings.length > 0
      ? postWorkoutRatings.reduce((sum, r) => sum + r.difficulty, 0) / postWorkoutRatings.length
      : 0;

    const inProvacao = checkInProvacao(daysSinceStart, totalSessions);
    const provacaoProgress = getProvacao(totalSessions);

    const stage = getCurrentStage(daysSinceStart, totalSessions, avgDifficulty);
    const { subLevel, progress, xpToNext } = getCurrentSubLevel(stage, currentXp);

    const nextStage = CULTIVATION_STAGES.find(s => s.id === stage.id + 1);

    return {
      stage,
      subLevel,
      progress,
      xpToNext,
      nextStage,
      daysSinceStart,
      avgDifficulty: avgDifficulty.toFixed(1),
      inProvacao,
      provacaoProgress
    };
  }, [startDate, currentXp, totalSessions, postWorkoutRatings]);

  const { stage, subLevel, progress, xpToNext, nextStage, daysSinceStart, inProvacao, provacaoProgress } = cultivationInfo;

  // Special styling for Provação
  const cardStyle = inProvacao
    ? {
        background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.4) 0%, rgba(154, 52, 18, 0.3) 100%)',
        boxShadow: `0 0 50px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)`
      }
    : {
        boxShadow: `0 0 40px ${stage.bgGlow}, inset 0 1px 0 rgba(255,255,255,0.05)`
      };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5",
        inProvacao 
          ? "border-red-500/40" 
          : "border-grid/50 bg-gradient-to-br from-blueprint/40 to-carbon"
      )}
      style={cardStyle}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      
      {/* Fire Animation for Provação */}
      {inProvacao && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />
      )}

      {/* Content */}
      <div className="relative space-y-4">

        {/* Header: Stage Info */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{stage.emoji}</span>
              <div>
                <p className={cn("text-[10px] font-bold uppercase tracking-widest", stage.color)}>
                  {stage.realm}
                </p>
                <h3 className="text-lg font-black font-chakra text-white uppercase tracking-tight leading-none">
                  {stage.name}
                </h3>
              </div>
            </div>
          </div>

          {/* Stage Number Badge */}
          {inProvacao ? (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-xs font-bold uppercase text-red-400">
              <Flame className="h-3 w-3" />
              <span>Dia {provacaoProgress.currentDay}/7</span>
            </div>
          ) : (
            <div className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold uppercase",
              stage.color,
              "border-current/30 bg-current/10"
            )}>
              <span>Estágio {stage.id}</span>
            </div>
          )}
        </div>

        {/* Lore Text */}
        <p className="text-xs text-text-muted italic leading-relaxed line-clamp-2">
          &quot;{stage.lore}&quot;
        </p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-muted uppercase tracking-wider">
              {inProvacao ? `Dia ${provacaoProgress.currentDay}` : subLevel.displayName}
            </span>
            <span className={cn("font-bold", inProvacao ? "text-red-400" : stage.color)}>
              {inProvacao 
                ? `${Math.round((provacaoProgress.currentDay / 7) * 100)}%`
                : `${progress}%`
              }
            </span>
          </div>

          <div className="relative h-3 bg-grid/30 rounded-full overflow-hidden">
            {/* Sub-level markers */}
            <div className="absolute inset-0 flex">
              {[...Array(inProvacao ? 7 : 9)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-r border-grid/30 last:border-r-0"
                />
              ))}
            </div>

            {/* Progress fill */}
            <div
              className={cn(
                "absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out",
                inProvacao 
                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                  : "bg-gradient-to-r from-current to-current/70"
              )}
              style={{
                width: inProvacao 
                  ? `${(provacaoProgress.currentDay / 7) * 100}%`
                  : `${progress}%`,
                color: inProvacao ? undefined : stage.bgGlow.replace('0.3', '1').replace('0.4', '1').replace('0.5', '1')
              }}
            />
          </div>

          {!inProvacao && xpToNext > 0 && (
            <p className="text-[10px] text-text-muted text-center">
              <Zap className="inline h-3 w-3 text-warning mr-1" />
              {xpToNext} XP para próximo nível
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-grid/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-black font-chakra text-white">
              <Calendar className="h-4 w-4 text-primary" />
              {daysSinceStart}
            </div>
            <p className="text-[9px] text-text-muted uppercase tracking-wider">Dias</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-black font-chakra text-white">
              <Target className="h-4 w-4 text-warning" />
              {totalSessions}
            </div>
            <p className="text-[9px] text-text-muted uppercase tracking-wider">Sessões</p>
          </div>
          <div className="text-center">
            <div className={cn(
              "flex items-center justify-center gap-1 text-lg font-black font-chakra",
              inProvacao ? "text-red-400" : "text-primary"
            )}>
              <Zap className="h-4 w-4" />
              {currentXp}
            </div>
            <p className="text-[9px] text-text-muted uppercase tracking-wider">XP Total</p>
          </div>
        </div>

        {/* Next Stage Preview */}
        {nextStage && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-grid/10 border border-grid/20">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Próximo: {nextStage.name}</p>
                <p className="text-[10px] text-text-muted/70">
                  {inProvacao 
                    ? `${7 - provacaoProgress.currentDay} dias restantes na Provação`
                    : nextStage.requirements.minDays - daysSinceStart > 0
                      ? `${nextStage.requirements.minDays - daysSinceStart} dias restantes`
                      : 'Requisito de dias atingido!'
                  }
                </p>
              </div>
            </div>
            <span className="text-xl">{nextStage.emoji}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact badge for header
export function CultivationBadge() {
  const { startDate, totalSessions, postWorkoutRatings } = useAppStore();

  const { stage, inProvacao, currentDay } = useMemo(() => {
    const daysSinceStart = startDate
      ? differenceInDays(new Date(), new Date(startDate))
      : 0;
    const avgDifficulty = postWorkoutRatings.length > 0
      ? postWorkoutRatings.reduce((sum, r) => sum + r.difficulty, 0) / postWorkoutRatings.length
      : 0;
    
    const inProv = checkInProvacao(daysSinceStart, totalSessions);
    const provProgress = getProvacao(totalSessions);
    
    return {
      stage: getCurrentStage(daysSinceStart, totalSessions, avgDifficulty),
      inProvacao: inProv,
      currentDay: provProgress.currentDay
    };
  }, [startDate, totalSessions, postWorkoutRatings]);

  if (inProvacao) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-xs font-bold uppercase text-red-400">
        <Flame className="h-3 w-3" />
        <span>Dia {currentDay}/7</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-bold uppercase",
      stage.color,
      "border-current/30 bg-current/10"
    )}>
      <span>{stage.emoji}</span>
      <span className="hidden sm:inline">{stage.name}</span>
      <span className="sm:hidden">Lv.{stage.id}</span>
    </div>
  );
}
