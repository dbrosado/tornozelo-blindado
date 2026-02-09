"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, ArrowLeft, CheckCircle, Volume2, VolumeX, Timer, Mic } from "lucide-react";
import { useAppStore, AudioMode } from "@/lib/store";
import { LEVELS as WORKOUT_LEVELS } from "@/lib/data/workouts";
import { getStageById } from "@/lib/data/cultivation-system";
import { getExerciseVideoUrl } from "@/lib/data/exercise-videos";
import { speak, stopSpeaking } from "@/lib/tts";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type PlayerPhase = 'ready' | 'prep' | 'exercise' | 'rest' | 'finished';

const PREP_DURATION = 10;

// Check if exercise is a rest period
const isRestExercise = (exerciseName: string): boolean => {
  const lowerName = exerciseName.toLowerCase();
  return lowerName.includes('descanso') || lowerName.includes('rest') || lowerName.includes('recupera');
};

export default function SessionPage() {
  const router = useRouter();
  const { currentStageId, audioMode, setAudioMode, actions } = useAppStore();

  // State
  const [phase, setPhase] = useState<PlayerPhase>('ready');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedExercises, setCompletedExercises] = useState(0);

  // Refs
  const announcedStart = useRef(false);
  const announcedMiddle = useRef(false);
  const announcedEnd = useRef(false);
  const announcedNext = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Data
  const workoutLevel = Math.min(currentStageId, WORKOUT_LEVELS.length);
  const currentWorkout = WORKOUT_LEVELS.find(l => l.id === workoutLevel) || WORKOUT_LEVELS[0];
  const stageInfo = getStageById(currentStageId);
  const exercises = currentWorkout.exercises;
  const currentExercise = exercises[exerciseIndex];
  const nextExercise = exercises[exerciseIndex + 1];
  const totalExercises = exercises.length;

  // Get video URL for current exercise
  const videoUrl = currentExercise ? getExerciseVideoUrl(currentExercise.id) : undefined;

  const overallProgress = Math.round((exerciseIndex / totalExercises) * 100);

  // Helper to check if voice narration is enabled
  const isVoiceEnabled = audioMode === 'voice';

  const resetAnnouncements = useCallback(() => {
    announcedStart.current = false;
    announcedMiddle.current = false;
    announcedEnd.current = false;
    announcedNext.current = false;
  }, []);

  const startWorkout = useCallback(() => {
    resetAnnouncements();
    const firstExercise = exercises[0];
    const firstIsRest = firstExercise ? isRestExercise(firstExercise.name) : false;

    if (firstIsRest) {
      setPhase('rest');
      setTimeLeft(firstExercise?.duration || 30);
      if (isVoiceEnabled && firstExercise?.audio?.start) speak(firstExercise.audio.start);
    } else {
      setPhase('prep');
      setTimeLeft(PREP_DURATION);
      if (isVoiceEnabled && firstExercise) speak(`Preparando. Próximo exercício: ${firstExercise.name}. Você tem 10 segundos.`);
    }
  }, [isVoiceEnabled, exercises, resetAnnouncements]);

  const goToNextExercise = useCallback(() => {
    const nextIndex = exerciseIndex + 1;
    setCompletedExercises(prev => prev + 1);

    if (nextIndex >= totalExercises) {
      setPhase('finished');
      if (isVoiceEnabled) speak("Treino concluído! Parabéns pela dedicação.");
      return;
    }

    const next = exercises[nextIndex];
    const nextIsRest = next ? isRestExercise(next.name) : false;

    setExerciseIndex(nextIndex);
    resetAnnouncements();

    if (nextIsRest) {
      setPhase('rest');
      setTimeLeft(next?.duration || 30);
      if (isVoiceEnabled && next?.audio?.start) speak(next.audio.start);
      else if (isVoiceEnabled) speak("Descansa.");
    } else {
      setPhase('prep');
      setTimeLeft(PREP_DURATION);
      if (isVoiceEnabled && next) speak(`Próximo: ${next.name}. Prepare-se.`);
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
      if (isVoiceEnabled && !isPaused) speak("Pausado.");
    }
  }, [phase, startWorkout, isVoiceEnabled, isPaused]);

  // Toggle audio mode
  const toggleAudioMode = () => {
    const newMode: AudioMode = audioMode === 'voice' ? 'timer' : 'voice';
    setAudioMode(newMode);
    if (newMode === 'timer') {
      stopSpeaking();
    }
  };

  // Pause/play video when workout pauses
  useEffect(() => {
    if (videoRef.current) {
      if (isPaused || phase === 'ready' || phase === 'finished') {
        videoRef.current.pause();
      } else if (phase === 'exercise' || phase === 'prep') {
        videoRef.current.play().catch(() => {});
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
            if (isVoiceEnabled) speak("Começa!");
            return currentExercise?.duration || 30;
          }
          if (phase === 'exercise' || phase === 'rest') {
            goToNextExercise();
            return 0;
          }
          return 0;
        }

        if (phase === 'prep' && prev === 4 && isVoiceEnabled) speak("3, 2, 1, Vai!");

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
            if (!isRestExercise(nextExercise.name)) speak(`Próximo: ${nextExercise.name}.`);
          }

          if (!announcedEnd.current && prev === 5) {
            announcedEnd.current = true;
            if (isVoiceEnabled && currentExercise.audio?.end) speak(currentExercise.audio.end);
          }
        }

        if (phase === 'rest' && prev === 5 && isVoiceEnabled && currentExercise?.audio?.end) {
          speak(currentExercise.audio.end);
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
      <div className="h-full flex flex-col items-center justify-center space-y-8 min-h-[80vh] px-6 animate-in zoom-in duration-500 bg-zinc-950">
        <div className="relative">
          <div className="absolute inset-0 bg-volt/20 blur-3xl rounded-full" />
          <div className="relative text-volt mb-4 p-8 bg-zinc-900 rounded-full border border-volt/30 shadow-glow-volt animate-pulse">
            <CheckCircle className="h-24 w-24" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black font-chakra uppercase text-white tracking-widest leading-none">
            TREINO<br/>CONCLUÍDO
          </h1>
          <p className="text-sm text-zinc-400 font-mono uppercase tracking-widest">
            {completedExercises} de {totalExercises} exercícios
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full max-w-xs h-16 text-xl bg-volt text-zinc-950 font-bold uppercase tracking-wider shadow-glow-volt rounded-xl"
          onClick={handleFinish}
        >
          Avaliar Treino
        </motion.button>
      </div>
    );
  }

  const getPhaseStyles = () => {
    switch (phase) {
      case 'ready': return { label: 'PRONTO', text: 'text-zinc-500', glow: '' };
      case 'prep': return { label: 'PREPARAR', text: 'text-amber-400', glow: 'shadow-[0_0_30px_rgba(251,191,36,0.2)]' };
      case 'exercise': return { label: 'GO', text: 'text-volt', glow: 'shadow-[0_0_40px_rgba(163,230,53,0.3)]' };
      case 'rest': return { label: 'DESCANSO', text: 'text-cyan-400', glow: 'shadow-[0_0_30px_rgba(34,211,238,0.2)]' };
      default: return { label: '', text: '', glow: '' };
    }
  };

  const styles = getPhaseStyles();

  return (
    <div className="h-full flex flex-col justify-between py-4 min-h-[90vh] max-w-md mx-auto relative bg-zinc-950 overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950 to-zinc-950" />
        <motion.div 
          animate={{ opacity: phase === 'exercise' ? 0.1 : 0 }}
          className="absolute inset-0 bg-volt mix-blend-overlay"
        />
      </div>

      {/* Header */}
      <div className="space-y-4 z-10 px-4 pt-2">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-white/5 text-zinc-400">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-volt uppercase tracking-[0.2em]">
              {stageInfo.emoji} {currentWorkout.title}
            </span>
            <span className={cn("text-xs font-bold uppercase tracking-widest", styles.text)}>
              {styles.label}
            </span>
          </div>
          {/* Audio Mode Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleAudioMode} 
            className="hover:bg-white/5"
            title={audioMode === 'voice' ? 'Voz Narrando' : 'Apenas Timer'}
          >
            {audioMode === 'voice' ? (
              <Mic className="h-6 w-6 text-volt" />
            ) : (
              <Timer className="h-6 w-6 text-amber-400" />
            )}
          </Button>
        </div>

        {/* Audio Mode Indicator */}
        <div className="flex justify-center">
          <div className={cn(
            "text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border",
            audioMode === 'voice' 
              ? "bg-volt/10 border-volt/30 text-volt" 
              : "bg-amber-400/10 border-amber-400/30 text-amber-400"
          )}>
            {audioMode === 'voice' ? '🎙️ Voz Narrando' : '⏱️ Apenas Timer'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
            <span>Ex {exerciseIndex + 1}/{totalExercises}</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-volt shadow-[0_0_10px_rgba(163,230,53,0.5)]"
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
            <h2 className="text-xl sm:text-2xl font-black font-chakra leading-tight text-white tracking-tight uppercase drop-shadow-lg">
              {currentExercise?.name || 'Carregando...'}
            </h2>

            {/* Video Player */}
            {videoUrl && phase !== 'ready' && !isRestExercise(currentExercise?.name || '') && (
              <div className="relative w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-glass bg-zinc-900/50">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  loop
                  muted
                  playsInline
                  className="w-full aspect-[9/16] object-cover"
                  autoPlay={phase === 'exercise' || phase === 'prep'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent pointer-events-none" />
              </div>
            )}

            {phase !== 'ready' && currentExercise && !videoUrl && (
              <div className={cn(
                "p-4 rounded-2xl backdrop-blur-md border border-white/5 max-w-sm mx-auto shadow-glass",
                phase === 'rest' ? "bg-cyan-950/30" : "bg-zinc-900/60"
              )}>
                <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                  {currentExercise.instructions}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* The Core Timer */}
        <div className="relative py-4">
          <div className={cn(
            "absolute inset-0 blur-[60px] rounded-full transition-all duration-700 opacity-40",
            phase === 'prep' && "bg-amber-500",
            phase === 'exercise' && (timeLeft <= 10 ? "bg-red-500" : "bg-volt"),
            phase === 'rest' && "bg-cyan-500",
            isPaused && "opacity-10"
          )} />
          
          <motion.div 
            animate={{ scale: phase === 'exercise' ? [1, 1.02, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={cn(
              "relative text-[5rem] sm:text-[6rem] font-black font-mono tracking-tighter leading-none select-none transition-colors duration-300 drop-shadow-2xl",
              styles.text,
              timeLeft <= 10 && phase === 'exercise' && "text-red-500 animate-pulse"
            )}
          >
            {phase === 'ready' ? '00:00' : formatTime(timeLeft)}
          </motion.div>
        </div>

        {/* Next Exercise Preview */}
        {nextExercise && phase !== 'ready' && !isRestExercise(nextExercise.name) && (
          <div className="bg-zinc-900/80 border border-white/10 rounded-full px-4 py-2 flex items-center gap-3 backdrop-blur-sm">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Próximo</span>
            <div className="h-3 w-[1px] bg-zinc-700" />
            <span className="text-xs font-bold text-zinc-200">{nextExercise.name}</span>
          </div>
        )}
      </div>

      {/* Control Deck */}
      <div className="grid grid-cols-5 gap-4 px-4 pb-8 z-10 items-end">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={cn(
            "col-span-3 h-20 text-lg font-bold font-chakra uppercase tracking-widest rounded-2xl flex flex-col items-center justify-center gap-1 transition-all shadow-lg",
            phase === 'ready' || isPaused
              ? "bg-volt text-zinc-950 hover:bg-volt/90 shadow-glow-volt"
              : "bg-zinc-900 border border-volt text-volt hover:bg-volt/10"
          )}
          onClick={togglePause}
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
          className="col-span-2 h-20 text-base font-bold font-chakra uppercase tracking-widest rounded-2xl flex flex-col items-center justify-center gap-1 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white text-zinc-400 transition-colors disabled:opacity-30 backdrop-blur-md"
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
