"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, ArrowLeft, CheckCircle, Timer, Mic } from "lucide-react";
import { useAppStore, AudioMode } from "@/lib/store";
import { LEVELS as WORKOUT_LEVELS } from "@/lib/data/workouts";
import { getStageById } from "@/lib/data/cultivation-system";
import { getExerciseVideoUrl } from "@/lib/data/exercise-videos";
import { speak, stopSpeaking } from "@/lib/tts";
import { playBeep, playCountdownBeep, playGoBeep, playCompleteBeep, playRestBeep, playFinishFanfare } from "@/lib/sounds";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { isSameDay } from "date-fns";

type PlayerPhase = 'ready' | 'prep' | 'exercise' | 'rest' | 'finished';

const PREP_DURATION = 10;
const FALLBACK_EXERCISE_DURATION = 30;

function getExerciseDuration(duration: number | undefined): number {
  if (typeof duration !== "number" || !Number.isFinite(duration)) {
    return FALLBACK_EXERCISE_DURATION;
  }
  return Math.max(1, Math.trunc(duration));
}

async function tryPlayVideo(video: HTMLVideoElement): Promise<void> {
  try {
    await video.play();
  } catch {
    // Ignore autoplay restrictions and unsupported playback errors.
  }
}

const isRestExercise = (exerciseName: string): boolean => {
  const lowerName = exerciseName.toLowerCase();
  return lowerName.includes('descanso') || lowerName.includes('rest') || lowerName.includes('recupera');
};

export default function SessionPage() {
  const router = useRouter();
  const { currentStageId, audioMode, setAudioMode, actions, readiness } = useAppStore();

  const [phase, setPhase] = useState<PlayerPhase>('ready');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const announcedStart = useRef(false);
  const announcedMiddle = useRef(false);
  const announcedEnd = useRef(false);
  const announcedNext = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const workoutLevel = Math.min(currentStageId, WORKOUT_LEVELS.length);
  const currentWorkout = WORKOUT_LEVELS.find(l => l.id === workoutLevel) || WORKOUT_LEVELS[0];
  const stageInfo = getStageById(currentStageId);
  const exercises = currentWorkout.exercises;
  const currentExercise = exercises[exerciseIndex];
  const nextExercise = exercises[exerciseIndex + 1];
  const totalExercises = exercises.length;

  const videoUrl = currentExercise ? getExerciseVideoUrl(currentExercise.id) : undefined;
  const overallProgress = Math.round((exerciseIndex / totalExercises) * 100);
  const isVoiceEnabled = audioMode === 'voice';

  const resetAnnouncements = useCallback(() => {
    announcedStart.current = false;
    announcedMiddle.current = false;
    announcedEnd.current = false;
    announcedNext.current = false;
  }, []);

  const startWorkout = useCallback(() => {
    if (totalExercises === 0) {
      setSessionError("Treino indisponivel no momento. Reabra o app e tente novamente.");
      return;
    }

    setSessionError(null);
    resetAnnouncements();
    const firstExercise = exercises[0];
    const firstIsRest = firstExercise ? isRestExercise(firstExercise.name) : false;

    if (firstIsRest) {
      setPhase('rest');
      setTimeLeft(getExerciseDuration(firstExercise?.duration));
      playRestBeep();
      if (isVoiceEnabled && firstExercise?.audio?.start) speak(firstExercise.audio.start);
    } else {
      setPhase('prep');
      setTimeLeft(PREP_DURATION);
      playBeep(600, 150);
      if (isVoiceEnabled && firstExercise) speak(`Preparando. Proximo exercicio: ${firstExercise.name}. Voce tem 10 segundos.`);
    }
  }, [isVoiceEnabled, exercises, resetAnnouncements, totalExercises]);

  const goToNextExercise = useCallback(() => {
    const nextIndex = exerciseIndex + 1;
    setCompletedExercises(prev => prev + 1);
    playCompleteBeep();

    if (nextIndex >= totalExercises) {
      setPhase('finished');
      playFinishFanfare();
      if (isVoiceEnabled) speak("Treino concluido! Parabens pela dedicacao.");
      return;
    }

    const next = exercises[nextIndex];
    const nextIsRest = next ? isRestExercise(next.name) : false;

    setExerciseIndex(nextIndex);
    resetAnnouncements();

    if (nextIsRest) {
      setPhase('rest');
      setTimeLeft(getExerciseDuration(next?.duration));
      playRestBeep();
      if (isVoiceEnabled && next?.audio?.start) speak(next.audio.start);
      else if (isVoiceEnabled) speak("Descansa.");
    } else {
      setPhase('prep');
      setTimeLeft(PREP_DURATION);
      playBeep(600, 150);
      if (isVoiceEnabled && next) speak(`Proximo: ${next.name}. Prepare-se.`);
    }
  }, [exerciseIndex, totalExercises, exercises, isVoiceEnabled, resetAnnouncements]);

  const skipExercise = useCallback(() => {
    stopSpeaking();
    goToNextExercise();
  }, [goToNextExercise]);

  const togglePause = useCallback(() => {
    if (phase === 'ready') {
      startWorkout();
    } else if (phase !== 'finished') {
      setIsPaused(prev => !prev);
      if (!isPaused) {
        playBeep(400, 100);
        if (isVoiceEnabled) speak("Pausado.");
      } else {
        playBeep(600, 100);
      }
    }
  }, [phase, startWorkout, isVoiceEnabled, isPaused]);

  const toggleAudioMode = () => {
    const newMode: AudioMode = audioMode === 'voice' ? 'timer' : 'voice';
    setAudioMode(newMode);
    if (newMode === 'timer') {
      stopSpeaking();
    }
    playBeep(800, 100);
  };

  useEffect(() => {
    const isReadyToday = readiness?.checkInDate
      ? isSameDay(new Date(readiness.checkInDate), new Date()) && readiness.status !== null
      : false;

    if (!isReadyToday) {
      router.replace("/app/readiness");
    }
  }, [readiness?.checkInDate, readiness?.status, router]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPaused || phase === 'ready' || phase === 'finished') {
        videoRef.current.pause();
      } else if (phase === 'exercise' || phase === 'prep') {
        void tryPlayVideo(videoRef.current);
      }
    }
  }, [isPaused, phase]);

  useEffect(() => {
    if (phase === 'ready' || phase === 'finished' || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (phase === 'prep') {
            setPhase('exercise');
            announcedStart.current = false;
            playGoBeep();
            if (isVoiceEnabled) speak("Comeca!");
            return getExerciseDuration(currentExercise?.duration);
          }
          if (phase === 'exercise' || phase === 'rest') {
            goToNextExercise();
            return 0;
          }
          return 0;
        }

        if (phase === 'prep' && prev <= 4 && prev > 1) {
          playCountdownBeep();
          if (prev === 4 && isVoiceEnabled) speak("3, 2, 1, Vai!");
        }

        if (phase === 'exercise' && currentExercise) {
          const duration = currentExercise.duration;
          if (!announcedStart.current && prev >= duration - 1) {
            announcedStart.current = true;
            if (isVoiceEnabled && currentExercise.audio?.start) speak(currentExercise.audio.start);
          }

          const midPoint = Math.floor(duration / 2);
          if (!announcedMiddle.current && prev <= midPoint && prev > midPoint - 2) {
            announcedMiddle.current = true;
            if (isVoiceEnabled && currentExercise.audio?.middle) speak(currentExercise.audio.middle);
          }

          if (!announcedNext.current && prev === 8 && nextExercise && isVoiceEnabled) {
            announcedNext.current = true;
            if (!isRestExercise(nextExercise.name)) speak(`Proximo: ${nextExercise.name}.`);
          }

          if (!announcedEnd.current && prev === 5) {
            announcedEnd.current = true;
            playBeep(500, 100);
            if (isVoiceEnabled && currentExercise.audio?.end) speak(currentExercise.audio.end);
          }

          if (prev <= 3 && prev > 0) {
            playCountdownBeep();
          }
        }

        if (phase === 'rest' && prev === 5) {
          playBeep(500, 100);
          if (isVoiceEnabled && currentExercise?.audio?.end) speak(currentExercise.audio.end);
        }

        if (phase === 'rest' && prev <= 3 && prev > 0) {
          playCountdownBeep();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isPaused, currentExercise, nextExercise, isVoiceEnabled, goToNextExercise]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    actions.completeSession();
    router.push(`/app/post-workout?completed=${completedExercises}&total=${totalExercises}`);
  };

  // FINISHED SCREEN
  if (phase === 'finished') {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 min-h-[80vh] px-6 modal-content bg-[#0A0A0A]">
        <div className="relative">
          <div className="absolute inset-0 bg-[#10B981]/15 blur-3xl rounded-full" />
          <div className="relative text-[#10B981] mb-4 p-8 neu-card rounded-full border-[#10B981]/30">
            <CheckCircle className="h-24 w-24" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold font-heading uppercase text-white tracking-widest leading-none">
            TREINO<br />CONCLUIDO
          </h1>
          <p className="text-sm text-[#A3A3A3] uppercase tracking-widest">
            {completedExercises} de {totalExercises} exercicios
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full max-w-xs h-16 text-xl gradient-primary text-[#0A0A0A] font-semibold font-heading uppercase tracking-wider shadow-glow-primary rounded-2xl cursor-pointer"
          onClick={handleFinish}
        >
          Avaliar Treino
        </motion.button>
      </div>
    );
  }

  const getPhaseStyles = () => {
    switch (phase) {
      case 'ready': return { label: 'PRONTO', text: 'text-[#666666]', glow: '' };
      case 'prep': return { label: 'PREPARAR', text: 'text-amber-400', glow: '' };
      case 'exercise': return { label: 'GO', text: 'text-[#10B981]', glow: 'shadow-glow-primary' };
      case 'rest': return { label: 'DESCANSO', text: 'text-[#3B82F6]', glow: 'shadow-glow-accent' };
      default: return { label: '', text: '', glow: '' };
    }
  };

  const styles = getPhaseStyles();

  return (
    <div className="h-full flex flex-col justify-between py-4 min-h-[90vh] max-w-md mx-auto relative bg-[#0A0A0A] overflow-hidden">

      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,26,26,0.5),transparent_70%)]" />
        <motion.div
          animate={{ opacity: phase === 'exercise' ? 0.05 : 0 }}
          className="absolute inset-0 bg-[#10B981] mix-blend-overlay"
        />
      </div>

      {/* Header */}
      <div className="space-y-4 z-10 px-4 pt-2">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-[#A3A3A3]">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold font-heading text-[#10B981] uppercase tracking-[0.2em]">
              {stageInfo.emoji} {currentWorkout.title}
            </span>
            <span className={cn("text-xs font-semibold font-heading uppercase tracking-widest", styles.text)}>
              {styles.label}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAudioMode}
            title={audioMode === 'voice' ? 'Voz Narrando' : 'Apenas Timer'}
          >
            {audioMode === 'voice' ? (
              <Mic className="h-6 w-6 text-[#10B981]" />
            ) : (
              <Timer className="h-6 w-6 text-amber-400" />
            )}
          </Button>
        </div>

        {sessionError && (
          <div className="neu-card border border-red-500/30 p-3 text-center">
            <p className="text-xs text-red-300">{sessionError}</p>
          </div>
        )}

        {/* Audio Mode Indicator */}
        <div className="flex justify-center">
          <div className={cn(
            "text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border",
            audioMode === 'voice'
              ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]"
              : "bg-amber-400/10 border-amber-400/30 text-amber-400"
          )}>
            {audioMode === 'voice' ? 'Voz Narrando' : 'Timer + Bips'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-[#666666] uppercase tracking-widest">
            <span>Ex {exerciseIndex + 1}/{totalExercises}</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="w-full neu-inset h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 px-6 z-10">

        <AnimatePresence mode="wait">
          <motion.div
            key={`${exerciseIndex}-${phase}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 w-full"
          >
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading leading-tight text-white tracking-tight uppercase">
              {currentExercise?.name || 'Carregando...'}
            </h2>

            {/* Video Player */}
            {videoUrl && phase !== 'ready' && !isRestExercise(currentExercise?.name || '') && (
              <div className="relative w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-[#333333] neu-card bg-[#0A0A0A]">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  loop
                  muted
                  playsInline
                  className="w-full aspect-[9/16] object-cover"
                  autoPlay={phase === 'exercise' || phase === 'prep'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 to-transparent pointer-events-none" />
              </div>
            )}

            {phase !== 'ready' && currentExercise && !videoUrl && (
              <div className={cn(
                "p-4 rounded-[14px] neu-inset max-w-sm mx-auto",
                phase === 'rest' ? "border border-[#3B82F6]/20" : ""
              )}>
                <p className="text-sm text-[#A3A3A3] leading-relaxed">
                  {currentExercise.instructions}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* The Core Timer */}
        <div className="relative py-4">
          <div className={cn(
            "absolute inset-0 blur-[60px] rounded-full transition-all duration-700 opacity-20",
            phase === 'prep' && "bg-amber-500",
            phase === 'exercise' && (timeLeft <= 10 ? "bg-red-500" : "bg-[#10B981]"),
            phase === 'rest' && "bg-[#3B82F6]",
            isPaused && "opacity-5"
          )} />

          <motion.div
            animate={{ scale: phase === 'exercise' ? [1, 1.02, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={cn(
              "relative text-[5rem] sm:text-[6rem] font-extrabold font-heading tracking-tighter leading-none select-none transition-colors duration-300",
              styles.text,
              timeLeft <= 10 && phase === 'exercise' && "text-red-500 animate-pulse"
            )}
          >
            {phase === 'ready' ? '00:00' : formatTime(timeLeft)}
          </motion.div>
        </div>

        {/* Next Exercise Preview */}
        {nextExercise && phase !== 'ready' && !isRestExercise(nextExercise.name) && (
          <div className="neu-inset rounded-full px-4 py-2 flex items-center gap-3">
            <span className="text-[10px] text-[#666666] uppercase tracking-wider">Proximo</span>
            <div className="h-3 w-[1px] bg-[#333333]" />
            <span className="text-xs font-semibold text-white">{nextExercise.name}</span>
          </div>
        )}
      </div>

      {/* Control Deck */}
      <div className="grid grid-cols-5 gap-4 px-4 pb-8 z-10 items-end">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={cn(
            "col-span-3 h-20 text-lg font-semibold font-heading uppercase tracking-widest rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer",
            phase === 'ready' || isPaused
              ? "gradient-primary text-[#0A0A0A] shadow-glow-primary"
              : "neu-card border-[#10B981]/30 text-[#10B981]"
          )}
          onClick={togglePause}
          disabled={totalExercises === 0}
        >
          {phase === 'ready' ? (
            <>
              <Play className="h-6 w-6 fill-current" />
              <span className="text-xs">INICIAR</span>
            </>
          ) : isPaused ? (
            <>
              <Play className="h-6 w-6 fill-current" />
              <span className="text-xs">RETOMAR</span>
            </>
          ) : (
            <>
              <Pause className="h-6 w-6" />
              <span className="text-xs">PAUSAR</span>
            </>
          )}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="col-span-2 h-20 text-base font-semibold font-heading uppercase tracking-widest rounded-2xl flex flex-col items-center justify-center gap-1 neu-button text-[#A3A3A3] disabled:opacity-30 cursor-pointer"
          onClick={skipExercise}
          disabled={phase === 'ready'}
        >
          <SkipForward className="h-6 w-6" />
          <span className="text-xs">PULAR</span>
        </motion.button>
      </div>
    </div>
  );
}
