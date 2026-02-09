"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInHours, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { CultivationCard, CultivationBadge } from "@/components/ui/cultivation-progress";
import { useAppStore } from "@/lib/store";
import { getStageById } from "@/lib/data/cultivation-system";
import { LEVELS as WORKOUT_LEVELS, getWorkoutByLevel, isSemanaDaProvacao } from "@/lib/data/workouts";
import { cn } from "@/lib/utils";
import {
  Play, AlertTriangle, Clock, Flame, TrendingUp, BookOpen,
  CheckCircle2, CircleDot, Zap
} from "lucide-react";

const LOCKOUT_HOURS = 6;

export default function TodayPage() {
  const router = useRouter();
  const {
    readiness,
    streak,
    currentStageId,
    totalSessions,
    actions
  } = useAppStore();

  const [isLocked, setIsLocked] = useState(false);
  const [unlockTime, setUnlockTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState("");

  const today = format(new Date(), "EEEE, d MMM", { locale: ptBR });
  const readinessStatus = readiness?.status;

  // Check if in Provação
  const inProvacao = useMemo(() => actions.isInProvacao(), [actions, totalSessions]);
  const provacaoProgress = useMemo(() => actions.getProvacaoProgress(), [actions, totalSessions]);

  // Check lockout and timer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkLockout = () => {
      const lastWorkout = localStorage.getItem("last_workout_time");
      if (!lastWorkout) {
        setIsLocked(false);
        return;
      }

      const lastWorkoutDate = new Date(lastWorkout);
      const now = new Date();
      const hoursDiff = differenceInHours(now, lastWorkoutDate);

      if (hoursDiff < LOCKOUT_HOURS) {
        setIsLocked(true);
        const unlock = new Date(lastWorkoutDate.getTime() + LOCKOUT_HOURS * 60 * 60 * 1000);
        setUnlockTime(unlock);

        const minsLeft = differenceInMinutes(unlock, now);
        const hours = Math.floor(minsLeft / 60);
        const mins = minsLeft % 60;
        setTimeRemaining(`${hours}h ${mins}m`);
      } else {
        setIsLocked(false);
        setUnlockTime(null);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get current stage and workout info
  const stageInfo = useMemo(() => getStageById(currentStageId), [currentStageId]);
  
  // Map stage to workout level
  const workoutLevelId = useMemo(() => {
    if (inProvacao || currentStageId === 0) return 0;
    return Math.min(currentStageId, WORKOUT_LEVELS.length - 1);
  }, [currentStageId, inProvacao]);
  
  const currentWorkout = useMemo(() => getWorkoutByLevel(workoutLevelId), [workoutLevelId]);

  // Readiness text
  const getReadinessInfo = () => {
    switch (readinessStatus) {
      case 'green':
        return { label: 'Sinal Verde', desc: 'Volume total liberado.', icon: CheckCircle2, color: 'text-primary border-primary/30 bg-primary/10' };
      case 'yellow':
        return { label: 'Sinal Amarelo', desc: 'Cuidado. Reduza intensidade.', icon: AlertTriangle, color: 'text-warning border-warning/30 bg-warning/10' };
      case 'red':
        return { label: 'Sinal Vermelho', desc: 'Apenas mobilidade hoje.', icon: AlertTriangle, color: 'text-danger border-danger/30 bg-danger/10' };
      default:
        return { label: 'Faça o Check-in', desc: 'Como está seu tornozelo hoje?', icon: CircleDot, color: 'text-text-muted border-grid/30 bg-grid/10' };
    }
  };

  const readinessInfo = getReadinessInfo();
  const ReadinessIcon = readinessInfo.icon;

  // LOCKOUT VIEW - Recovery Mode
  if (isLocked) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black font-chakra uppercase text-white tracking-tight">
              Tornozelo Blindado
            </h1>
            <p className="text-xs text-text-muted uppercase tracking-widest mt-1">{today}</p>
          </div>
          <CultivationBadge />
        </header>

        {/* Cultivation Card */}
        <CultivationCard />

        {/* Lockout Card */}
        <div className="bg-blueprint/30 border border-warning/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning/10 rounded-full">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-chakra text-warning uppercase">Recuperação</h3>
              <p className="text-xs text-text-muted">O tendão está absorvendo o treino</p>
            </div>
          </div>

          <div className="text-center py-4">
            <p className="text-4xl font-black font-chakra text-warning">{timeRemaining}</p>
            <p className="text-xs text-text-muted mt-2">
              Próximo treino liberado às {unlockTime ? format(unlockTime, "HH:mm") : "--:--"}
            </p>
          </div>

          <div className="bg-grid/20 rounded-lg p-3">
            <p className="text-[11px] text-text-muted text-center leading-relaxed">
              💡 <strong>Lei dos 10 Minutos:</strong> Treinos curtos, espaçados de 6h, maximizam a síntese de colágeno.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blueprint/20 border border-grid/30 rounded-xl p-4 text-center">
            <Flame className="h-5 w-5 mx-auto mb-2 text-warning" />
            <p className="text-2xl font-black font-chakra text-white">{streak}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Dias Seguidos</p>
          </div>
          <div 
            className="bg-blueprint/20 border border-grid/30 rounded-xl p-4 text-center cursor-pointer hover:bg-grid/30 transition-colors"
            onClick={() => router.push('/app/manual')}
          >
            <BookOpen className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-lg font-bold font-chakra text-white uppercase">Manual</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Conhecimento</p>
          </div>
        </div>
      </div>
    );
  }

  // Main View
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-chakra uppercase text-white tracking-tight">
            Tornozelo Blindado
          </h1>
          <p className="text-xs text-text-muted uppercase tracking-widest mt-1">{today}</p>
        </div>
        <CultivationBadge />
      </header>

      {/* Cultivation Progress Card */}
      <CultivationCard />

      {/* Readiness Check */}
      <button
        onClick={() => router.push('/app/readiness')}
        className={cn(
          "w-full flex items-center gap-3 p-4 rounded-xl border transition-all hover:scale-[1.01]",
          readinessInfo.color
        )}
      >
        <ReadinessIcon className="h-5 w-5" />
        <div className="text-left">
          <p className="font-bold uppercase text-sm">{readinessInfo.label}</p>
          <p className="text-xs opacity-80">{readinessInfo.desc}</p>
        </div>
      </button>

      {/* Today's Workout Card */}
      <div className={cn(
        "rounded-2xl p-6 space-y-4 border",
        inProvacao 
          ? "bg-gradient-to-br from-red-950/50 to-orange-950/30 border-red-500/30"
          : "bg-blueprint/30 border-grid/50"
      )}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-black font-chakra text-white uppercase tracking-tight">
              {currentWorkout.title}
            </h3>
            {inProvacao ? (
              <p className="text-xs text-red-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Dia {provacaoProgress.currentDay} de {provacaoProgress.totalDays} • Ritual Completo
              </p>
            ) : (
              <p className="text-xs text-primary font-bold uppercase tracking-widest">
                {stageInfo.emoji} Estágio {stageInfo.id} • {currentWorkout.exercises.length} exercícios
              </p>
            )}
          </div>
        </div>

        {/* Workout Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-grid/20 rounded-lg p-3 text-center">
            <p className="text-xl font-black font-chakra text-white">{currentWorkout.duration}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Min</p>
          </div>
          <div className="bg-grid/20 rounded-lg p-3 text-center">
            <p className="text-xl font-black font-chakra text-white">{currentWorkout.exercises.length}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Exercícios</p>
          </div>
          <div className="bg-grid/20 rounded-lg p-3 text-center">
            <p className={cn(
              "text-xl font-black font-chakra uppercase",
              inProvacao ? "text-red-400" : "text-primary"
            )}>
              {inProvacao ? "ALTO" : "ON"}
            </p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Impacto</p>
          </div>
        </div>

        {/* Provação Special Message */}
        {inProvacao && (
          <div className="bg-red-950/50 border border-red-500/20 rounded-lg p-3">
            <p className="text-[11px] text-red-300 text-center leading-relaxed">
              🔥 <strong>Semana da Provação:</strong> 7 dias consecutivos de treino completo. 
              Prove seu comprometimento. Não há atalhos.
            </p>
          </div>
        )}

        {/* Start Button */}
        <Button
          onClick={() => router.push('/app/session')}
          disabled={readinessStatus === null}
          className={cn(
            "w-full h-14 text-lg font-bold uppercase",
            inProvacao && "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500"
          )}
        >
          <Play className="mr-2 h-5 w-5" />
          {inProvacao ? "COMEÇAR PROVAÇÃO" : "COMEÇAR TREINO"}
        </Button>

        {readinessStatus === null && (
          <p className="text-[10px] text-warning text-center flex items-center justify-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Faça o check-in de prontidão primeiro
          </p>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => router.push('/app/library')}
          className="bg-blueprint/20 border border-grid/30 rounded-xl p-4 text-center hover:bg-grid/30 transition-colors"
        >
          <TrendingUp className="h-5 w-5 mx-auto mb-2 text-primary" />
          <p className="text-sm font-bold font-chakra text-white uppercase">Biblioteca</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Todos os níveis</p>
        </button>
        <button
          onClick={() => router.push('/app/manual')}
          className="bg-blueprint/20 border border-grid/30 rounded-xl p-4 text-center hover:bg-grid/30 transition-colors"
        >
          <BookOpen className="h-5 w-5 mx-auto mb-2 text-primary" />
          <p className="text-sm font-bold font-chakra text-white uppercase">Manual</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Conhecimento</p>
        </button>
      </div>
    </div>
  );
}
