"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInHours, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    actions
  } = useAppStore();

  const [isLocked, setIsLocked] = useState(false);
  const [unlockTime, setUnlockTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [userName] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("tb_user_name") || "" : ""
  );

  const today = format(new Date(), "EEEE, d MMM", { locale: ptBR });
  const readinessStatus = readiness?.status;

  const inProvacao = useMemo(() => actions.isInProvacao(), [actions]);
  const provacaoProgress = useMemo(() => actions.getProvacaoProgress(), [actions]);

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

  const stageInfo = useMemo(() => getStageById(currentStageId), [currentStageId]);

  const workoutLevelId = useMemo(() => {
    if (inProvacao || currentStageId === 0) return 0;
    return Math.min(currentStageId, WORKOUT_LEVELS.length - 1);
  }, [currentStageId, inProvacao]);

  const currentWorkout = useMemo(() => getWorkoutByLevel(workoutLevelId), [workoutLevelId]);

  const getReadinessInfo = () => {
    switch (readinessStatus) {
      case 'green':
        return { label: 'Sinal Verde', desc: 'Volume total liberado.', icon: CheckCircle2, color: 'text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10' };
      case 'yellow':
        return { label: 'Sinal Amarelo', desc: 'Cuidado. Reduza intensidade.', icon: AlertTriangle, color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' };
      case 'red':
        return { label: 'Sinal Vermelho', desc: 'Apenas mobilidade hoje.', icon: AlertTriangle, color: 'text-red-500 border-red-500/30 bg-red-500/10' };
      default:
        return { label: 'Faca o Check-in', desc: 'Como esta seu tornozelo hoje?', icon: CircleDot, color: 'text-[#A3A3A3] border-[#333333] bg-[#1A1A1A] hover:bg-[#222222] hover:border-[#444444]' };
    }
  };

  const readinessInfo = getReadinessInfo();
  const ReadinessIcon = readinessInfo.icon;

  // LOCKOUT VIEW
  if (isLocked) {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold font-heading text-white tracking-tight">
              {userName ? `Tornozelo Blindado • ${userName}` : "Tornozelo Blindado"}
            </h1>
            <p className="text-xs text-[#A3A3A3] uppercase tracking-widest mt-1">{today}</p>
          </div>
          <CultivationBadge />
        </header>

        <CultivationCard />

        <div className="neu-card p-6 space-y-4 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 neu-inset rounded-full">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold font-heading text-amber-500">Recuperacao</h3>
              <p className="text-xs text-[#A3A3A3]">O tendao esta absorvendo o treino</p>
            </div>
          </div>

          <div className="text-center py-4">
            <p className="text-4xl font-extrabold font-heading text-amber-500 tracking-tighter animate-pulse">{timeRemaining}</p>
            <p className="text-xs text-[#666666] mt-2 uppercase tracking-wide">
              Proximo treino liberado as {unlockTime ? format(unlockTime, "HH:mm") : "--:--"}
            </p>
          </div>

          <div className="neu-inset rounded-xl p-3">
            <p className="text-[11px] text-[#A3A3A3] text-center leading-relaxed">
              <strong>Lei dos 10 Minutos:</strong> Treinos curtos, espacados de 6h, maximizam a sintese de colageno.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="neu-card p-4 text-center">
            <Flame className="h-5 w-5 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-extrabold font-heading text-white">{streak}</p>
            <p className="text-[10px] text-[#666666] uppercase tracking-wider">Dias Seguidos</p>
          </div>
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="neu-card p-4 text-center cursor-pointer"
            onClick={() => router.push('/app/manual')}
          >
            <BookOpen className="h-5 w-5 mx-auto mb-2 text-[#10B981]" />
            <p className="text-lg font-semibold font-heading text-white">Manual</p>
            <p className="text-[10px] text-[#666666] uppercase tracking-wider">Conhecimento</p>
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
          <h1 className="text-2xl font-extrabold font-heading text-white tracking-tight">
            {userName ? `Tornozelo Blindado • ${userName}` : "Tornozelo Blindado"}
          </h1>
          <p className="text-xs text-[#A3A3A3] uppercase tracking-widest mt-1">{today}</p>
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
          "w-full flex items-center gap-3 p-4 rounded-[14px] border transition-all cursor-pointer",
          "shadow-neu-soft",
          readinessInfo.color
        )}
      >
        <ReadinessIcon className="h-5 w-5" />
        <div className="text-left">
          <p className="font-semibold font-heading text-sm">{readinessInfo.label}</p>
          <p className="text-xs opacity-80">{readinessInfo.desc}</p>
        </div>
      </motion.button>

      {/* Today's Workout Card */}
      <div className={cn(
        "neu-card p-6 space-y-4",
        inProvacao && "border-red-500/30"
      )}>
        {inProvacao && (
          <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-red-950/30 to-transparent pointer-events-none" />
        )}
        <div className="relative flex items-start justify-between">
          <div>
            <h3 className="text-xl font-extrabold font-heading text-white tracking-tight">
              {currentWorkout.title}
            </h3>
            {inProvacao ? (
              <p className="text-xs text-red-400 font-semibold uppercase tracking-widest flex items-center gap-1 mt-1">
                <Zap className="h-3 w-3" />
                Dia {provacaoProgress.currentDay} de {provacaoProgress.totalDays} - Ritual
              </p>
            ) : (
              <p className="text-xs text-[#10B981] font-semibold uppercase tracking-widest mt-1">
                {stageInfo.emoji} Estagio {stageInfo.id} - {currentWorkout.exercises.length} exercicios
              </p>
            )}
          </div>
        </div>

        {/* Workout Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="neu-inset rounded-xl p-3 text-center">
            <p className="text-xl font-extrabold font-heading text-white">{currentWorkout.duration}</p>
            <p className="text-[10px] text-[#666666] uppercase tracking-wider">Min</p>
          </div>
          <div className="neu-inset rounded-xl p-3 text-center">
            <p className="text-xl font-extrabold font-heading text-white">{currentWorkout.exercises.length}</p>
            <p className="text-[10px] text-[#666666] uppercase tracking-wider">Exercicios</p>
          </div>
          <div className="neu-inset rounded-xl p-3 text-center">
            <p className={cn(
              "text-xl font-extrabold font-heading uppercase",
              inProvacao ? "text-red-500" : "text-[#10B981]"
            )}>
              {inProvacao ? "ALTO" : "ON"}
            </p>
            <p className="text-[10px] text-[#666666] uppercase tracking-wider">Impacto</p>
          </div>
        </div>

        {/* Provacao Special Message */}
        {inProvacao && (
          <div className="neu-inset rounded-xl p-3 border border-red-500/20">
            <p className="text-[11px] text-red-300 text-center leading-relaxed">
              <strong>Semana da Provacao:</strong> 7 dias consecutivos. Sem atalhos.
            </p>
          </div>
        )}

        {/* Start Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/app/session')}
          disabled={readinessStatus === null}
          className={cn(
            "w-full h-14 text-lg font-semibold font-heading uppercase rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer",
            readinessStatus === null
              ? "bg-[#1A1A1A] text-[#666666] cursor-not-allowed shadow-neu-inset"
              : inProvacao
                ? "gradient-danger text-white shadow-neu-soft"
                : "gradient-primary text-[#0A0A0A] shadow-glow-primary"
          )}
        >
          <Play className="h-5 w-5 fill-current" />
          {inProvacao ? "COMECAR PROVACAO" : "COMECAR TREINO"}
        </motion.button>

        {readinessStatus === null && (
          <p className="text-[10px] text-amber-500 text-center flex items-center justify-center gap-1 opacity-80">
            <AlertTriangle className="h-3 w-3" />
            Faca o check-in de prontidao primeiro
          </p>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/app/library')}
          className="neu-card p-4 text-center cursor-pointer"
        >
          <TrendingUp className="h-5 w-5 mx-auto mb-2 text-[#10B981]" />
          <p className="text-sm font-semibold font-heading text-white">Biblioteca</p>
          <p className="text-[10px] text-[#666666] uppercase tracking-wider">Todos os niveis</p>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/app/manual')}
          className="neu-card p-4 text-center cursor-pointer"
        >
          <BookOpen className="h-5 w-5 mx-auto mb-2 text-[#3B82F6]" />
          <p className="text-sm font-semibold font-heading text-white">Manual</p>
          <p className="text-[10px] text-[#666666] uppercase tracking-wider">Conhecimento</p>
        </motion.button>
      </div>
    </div>
  );
}
