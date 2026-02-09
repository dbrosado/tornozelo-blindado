"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInHours, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { CultivationCard, CultivationBadge } from "@/components/ui/cultivation-progress";
import { useAppStore } from "@/lib/store";
import { getStageById } from "@/lib/data/cultivation-system";
import { LEVELS as WORKOUT_LEVELS, getWorkoutByLevel } from "@/lib/data/workouts";
import { cn } from "@/lib/utils";
import {
  Play, AlertTriangle, Clock, Flame, TrendingUp, BookOpen,
  CheckCircle2, CircleDot, Zap
} from "lucide-react";
import { motion } from "framer-motion";

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

  // Readiness Styles (Obsidian)
  const getReadinessInfo = () => {
    switch (readinessStatus) {
      case 'green':
        return { label: 'Sinal Verde', desc: 'Volume total liberado.', icon: CheckCircle2, color: 'text-volt border-volt/30 bg-volt/10 shadow-glow-volt' };
      case 'yellow':
        return { label: 'Sinal Amarelo', desc: 'Cuidado. Reduza intensidade.', icon: AlertTriangle, color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' };
      case 'red':
        return { label: 'Sinal Vermelho', desc: 'Apenas mobilidade hoje.', icon: AlertTriangle, color: 'text-red-500 border-red-500/30 bg-red-500/10' };
      default:
        return { label: 'Faça o Check-in', desc: 'Como está seu tornozelo hoje?', icon: CircleDot, color: 'text-zinc-400 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700' };
    }
  };

  const readinessInfo = getReadinessInfo();
  const ReadinessIcon = readinessInfo.icon;

  // LOCKOUT VIEW - Recovery Mode
  if (isLocked) {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black font-chakra uppercase text-white tracking-tight">
              Tornozelo Blindado
            </h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-mono">{today}</p>
          </div>
          <CultivationBadge />
        </header>

        <CultivationCard />

        <div className="bg-zinc-900/60 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 space-y-4 shadow-glass">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-full">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-chakra text-amber-500 uppercase">Recuperação</h3>
              <p className="text-xs text-zinc-400">O tendão está absorvendo o treino</p>
            </div>
          </div>

          <div className="text-center py-4">
            <p className="text-4xl font-black font-mono text-amber-500 tracking-tighter animate-pulse">{timeRemaining}</p>
            <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">
              Próximo treino liberado às {unlockTime ? format(unlockTime, "HH:mm") : "--:--"}
            </p>
          </div>

          <div className="bg-zinc-950/50 rounded-lg p-3 border border-white/5">
            <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
              💡 <strong>Lei dos 10 Minutos:</strong> Treinos curtos, espaçados de 6h, maximizam a síntese de colágeno.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 text-center">
            <Flame className="h-5 w-5 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-black font-chakra text-white">{streak}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Dias Seguidos</p>
          </div>
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 text-center cursor-pointer hover:bg-zinc-800/50 transition-colors"
            onClick={() => router.push('/app/manual')}
          >
            <BookOpen className="h-5 w-5 mx-auto mb-2 text-volt" />
            <p className="text-lg font-bold font-chakra text-white uppercase">Manual</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Conhecimento</p>
          </motion.div>
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
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-mono">{today}</p>
        </div>
        <CultivationBadge />
      </header>

      {/* Cultivation Progress Card */}
      <CultivationCard />

      {/* Readiness Check */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push('/app/readiness')}
        className={cn(
          "w-full flex items-center gap-3 p-4 rounded-xl border transition-all",
          readinessInfo.color
        )}
      >
        <ReadinessIcon className="h-5 w-5" />
        <div className="text-left">
          <p className="font-bold uppercase text-sm">{readinessInfo.label}</p>
          <p className="text-xs opacity-80">{readinessInfo.desc}</p>
        </div>
      </motion.button>

      {/* Today's Workout Card */}
      <div className={cn(
        "rounded-2xl p-6 space-y-4 border shadow-glass backdrop-blur-md",
        inProvacao 
          ? "bg-gradient-to-br from-red-950/80 to-zinc-900 border-red-500/30"
          : "bg-zinc-900/60 border-white/10"
      )}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-black font-chakra text-white uppercase tracking-tight">
              {currentWorkout.title}
            </h3>
            {inProvacao ? (
              <p className="text-xs text-red-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                <Zap className="h-3 w-3" />
                Dia {provacaoProgress.currentDay} de {provacaoProgress.totalDays} • Ritual
              </p>
            ) : (
              <p className="text-xs text-volt font-bold uppercase tracking-widest mt-1">
                {stageInfo.emoji} Estágio {stageInfo.id} • {currentWorkout.exercises.length} exercícios
              </p>
            )}
          </div>
        </div>

        {/* Workout Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-zinc-950/50 border border-white/5 rounded-lg p-3 text-center">
            <p className="text-xl font-black font-chakra text-white">{currentWorkout.duration}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Min</p>
          </div>
          <div className="bg-zinc-950/50 border border-white/5 rounded-lg p-3 text-center">
            <p className="text-xl font-black font-chakra text-white">{currentWorkout.exercises.length}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Exercícios</p>
          </div>
          <div className="bg-zinc-950/50 border border-white/5 rounded-lg p-3 text-center">
            <p className={cn(
              "text-xl font-black font-chakra uppercase",
              inProvacao ? "text-red-500" : "text-volt"
            )}>
              {inProvacao ? "ALTO" : "ON"}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Impacto</p>
          </div>
        </div>

        {/* Provação Special Message */}
        {inProvacao && (
          <div className="bg-red-950/30 border border-red-500/20 rounded-lg p-3">
            <p className="text-[11px] text-red-300 text-center leading-relaxed">
              🔥 <strong>Semana da Provação:</strong> 7 dias consecutivos. Sem atalhos.
            </p>
          </div>
        )}

        {/* Start Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/app/session')}
          disabled={readinessStatus === null}
          className={cn(
            "w-full h-14 text-lg font-bold uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg",
            readinessStatus === null 
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              : inProvacao 
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-red-900/50"
                : "bg-volt text-zinc-950 shadow-glow-volt hover:bg-volt/90"
          )}
        >
          <Play className="h-5 w-5 fill-current" />
          {inProvacao ? "COMEÇAR PROVAÇÃO" : "COMEÇAR TREINO"}
        </motion.button>

        {readinessStatus === null && (
          <p className="text-[10px] text-amber-500 text-center flex items-center justify-center gap-1 opacity-80">
            <AlertTriangle className="h-3 w-3" />
            Faça o check-in de prontidão primeiro
          </p>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/app/library')}
          className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 text-center hover:bg-zinc-800/50 transition-colors backdrop-blur-sm"
        >
          <TrendingUp className="h-5 w-5 mx-auto mb-2 text-volt" />
          <p className="text-sm font-bold font-chakra text-white uppercase">Biblioteca</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Todos os níveis</p>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/app/manual')}
          className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 text-center hover:bg-zinc-800/50 transition-colors backdrop-blur-sm"
        >
          <BookOpen className="h-5 w-5 mx-auto mb-2 text-volt" />
          <p className="text-sm font-bold font-chakra text-white uppercase">Manual</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Conhecimento</p>
        </motion.button>
      </div>
    </div>
  );
}
