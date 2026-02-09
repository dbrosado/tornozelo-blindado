"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, ArrowLeft, CheckCircle, Volume2, VolumeX } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { LEVELS as WORKOUT_LEVELS } from "@/lib/data/workouts";
import { getStageById } from "@/lib/data/cultivation-system";
import { speak, stopSpeaking } from "@/lib/tts";
import { cn } from "@/lib/utils";

type PlayerPhase = 'ready' | 'prep' | 'exercise' | 'rest' | 'finished';

const PREP_DURATION = 10; // 10 seconds to get ready before each exercise

// Check if exercise is a rest period
const isRestExercise = (exerciseName: string): boolean => {
  const lowerName = exerciseName.toLowerCase();
  return lowerName.includes('descanso') || lowerName.includes('rest') || lowerName.includes('recupera');
};

export default function SessionPage() {
  const router = useRouter();
  const { currentStageId, actions } = useAppStore();

  // State
  const [phase, setPhase] = useState<PlayerPhase>('ready');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [completedExercises, setCompletedExercises] = useState(0);

  // Refs to track announcements
  const announcedStart = useRef(false);
  const announcedMiddle = useRef(false);
  const announcedEnd = useRef(false);
  const announcedNext = useRef(false);

  // Get workout data - map stage to workout level
  const workoutLevel = Math.min(currentStageId, WORKOUT_LEVELS.length);
  const currentWorkout = WORKOUT_LEVELS.find(l => l.id === workoutLevel) || WORKOUT_LEVELS[0];
  const stageInfo = getStageById(currentStageId);
  const exercises = currentWorkout.exercises;
  const currentExercise = exercises[exerciseIndex];
  const nextExercise = exercises[exerciseIndex + 1];
  const totalExercises = exercises.length;

  // Progress calculation
  const overallProgress = Math.round((exerciseIndex / totalExercises) * 100);

  // Reset announcement flags
  const resetAnnouncements = useCallback(() => {
    announcedStart.current = false;
    announcedMiddle.current = false;
    announcedEnd.current = false;
    announcedNext.current = false;
  }, []);

  // Start Workout - User clicks Play
  const startWorkout = useCallback(() => {
    resetAnnouncements();

    // Check if first exercise is a rest (unlikely but handle it)
    const firstExercise = exercises[0];
    const firstIsRest = firstExercise ? isRestExercise(firstExercise.name) : false;

    if (firstIsRest) {
      // Start rest immediately
      setPhase('rest');
      setTimeLeft(firstExercise?.duration || 30);
      if (audioEnabled && firstExercise?.audio?.start) {
        speak(firstExercise.audio.start);
      }
    } else {
      // Normal exercise - show prep countdown
      setPhase('prep');
      setTimeLeft(PREP_DURATION);
      if (audioEnabled && firstExercise) {
        speak(`Preparando. Próximo exercício: ${firstExercise.name}. Você tem 10 segundos.`);
      }
    }
  }, [audioEnabled, exercises, resetAnnouncements]);

  // Move to next exercise
  const goToNextExercise = useCallback(() => {
    const nextIndex = exerciseIndex + 1;
    setCompletedExercises(prev => prev + 1);

    if (nextIndex >= totalExercises) {
      // Workout complete!
      setPhase('finished');
      if (audioEnabled) {
        speak("Treino concluído! Parabéns pela dedicação.");
      }
      return;
    }

    // Get next exercise info
    const next = exercises[nextIndex];
    const nextIsRest = next ? isRestExercise(next.name) : false;

    setExerciseIndex(nextIndex);
    resetAnnouncements();

    if (nextIsRest) {
      // REST: Start immediately without prep countdown
      setPhase('rest');
      setTimeLeft(next?.duration || 30);
      if (audioEnabled && next?.audio?.start) {
        speak(next.audio.start);
      } else if (audioEnabled) {
        speak("Descansa.");
      }
    } else {
      // EXERCISE: Show 10-second prep countdown
      setPhase('prep');
      setTimeLeft(PREP_DURATION);
      if (audioEnabled && next) {
        speak(`Próximo: ${next.name}. Prepare-se.`);
      }
    }
  }, [exerciseIndex, totalExercises, exercises, audioEnabled, resetAnnouncements]);

  // Skip current exercise
  const skipExercise = useCallback(() => {
    stopSpeaking();
    goToNextExercise();
  }, [goToNextExercise]);

  // Toggle Pause
  const togglePause = useCallback(() => {
    if (phase === 'ready') {
      startWorkout();
    } else if (phase !== 'finished') {
      setIsPaused(prev => !prev);
      if (audioEnabled && !isPaused) {
        speak("Pausado.");
      }
    }
  }, [phase, startWorkout, audioEnabled, isPaused]);

  // Main Timer Effect
  useEffect(() => {
    // Don't run timer if not in active phase or paused
    if (phase === 'ready' || phase === 'finished' || isPaused) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        // Time's up
        if (prev <= 1) {
          // PREP phase ended -> Start EXERCISE
          if (phase === 'prep') {
            setPhase('exercise');
            announcedStart.current = false;

            if (audioEnabled) {
              speak("Começa!");
            }

            // Return exercise duration
            return currentExercise?.duration || 30;
          }

          // EXERCISE or REST phase ended -> Go to next
          if (phase === 'exercise' || phase === 'rest') {
            goToNextExercise();
            return 0;
          }

          return 0;
        }

        // During PREP phase - countdown announcement
        if (phase === 'prep' && prev === 4 && audioEnabled) {
          speak("3, 2, 1, Vai!");
        }

        // During EXERCISE phase - audio cues
        if (phase === 'exercise' && currentExercise) {
          const duration = currentExercise.duration;

          // Start cue (at the beginning)
          if (!announcedStart.current && prev >= duration - 1) {
            announcedStart.current = true;
            if (audioEnabled && currentExercise.audio?.start) {
              speak(currentExercise.audio.start);
            }
          }

          // Middle cue (halfway through)
          const midPoint = Math.floor(duration / 2);
          if (!announcedMiddle.current && prev <= midPoint && prev > midPoint - 2) {
            announcedMiddle.current = true;
            if (audioEnabled && currentExercise.audio?.middle) {
              speak(currentExercise.audio.middle);
            }
          }

          // Announce next exercise 8 seconds before end
          if (!announcedNext.current && prev === 8 && nextExercise && audioEnabled) {
            announcedNext.current = true;
            // Don't announce "next" if it's just a rest
            if (!isRestExercise(nextExercise.name)) {
              speak(`Próximo: ${nextExercise.name}.`);
            }
          }

          // End cue (last 5 seconds)
          if (!announcedEnd.current && prev === 5) {
            announcedEnd.current = true;
            if (audioEnabled && currentExercise.audio?.end) {
              speak(currentExercise.audio.end);
            }
          }
        }

        // During REST phase - announce when ending
        if (phase === 'rest' && prev === 5 && audioEnabled && currentExercise?.audio?.end) {
          speak(currentExercise.audio.end);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isPaused, currentExercise, nextExercise, audioEnabled, goToNextExercise]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Finish and go to post-workout questionnaire
  const handleFinish = () => {
    actions.completeSession();
    router.push(`/app/post-workout?completed=${completedExercises}&total=${totalExercises}`);
  };

  // FINISHED SCREEN
  if (phase === 'finished') {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 min-h-[80vh] px-6 animate-in zoom-in duration-500">
        <div className="text-primary mb-4 p-6 bg-primary/10 rounded-full border border-primary/20 animate-pulse">
          <CheckCircle className="h-24 w-24" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black font-chakra uppercase text-white tracking-widest leading-none">
            TREINO CONCLUÍDO
          </h1>
          <p className="text-sm text-text-muted font-mono uppercase tracking-widest">
            {completedExercises} de {totalExercises} exercícios
          </p>
        </div>
        <Button
          size="lg"
          className="w-full max-w-xs h-16 text-xl bg-primary hover:bg-primary/90 text-carbon font-bold uppercase tracking-wider shadow-lg shadow-primary/20"
          onClick={handleFinish}
        >
          Avaliar Treino
        </Button>
      </div>
    );
  }

  // Get phase display info
  const getPhaseDisplay = () => {
    switch (phase) {
      case 'ready':
        return { label: 'PRONTO PARA COMEÇAR', color: 'text-text-muted', timerColor: 'text-text-muted' };
      case 'prep':
        return { label: 'PREPARE-SE', color: 'text-warning', timerColor: 'text-warning' };
      case 'exercise':
        return { label: 'EM EXECUÇÃO', color: 'text-primary', timerColor: timeLeft <= 10 ? 'text-danger' : 'text-white' };
      case 'rest':
        return { label: 'DESCANSANDO', color: 'text-cyan-400', timerColor: 'text-cyan-400' };
      default:
        return { label: '', color: '', timerColor: '' };
    }
  };

  const phaseDisplay = getPhaseDisplay();

  return (
    <div className="h-full flex flex-col justify-between py-4 min-h-[90vh] max-w-md mx-auto relative bg-carbon overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none z-0" />
      <div className={cn(
        "absolute inset-0 transition-colors duration-500 pointer-events-none z-0",
        phase === 'prep' && "bg-warning/5",
        phase === 'exercise' && "bg-primary/5",
        phase === 'rest' && "bg-cyan-500/5"
      )} />

      {/* Header */}
      <div className="space-y-4 z-10 px-4">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-grid/20">
            <ArrowLeft className="h-6 w-6 text-text-muted" />
          </Button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
              {stageInfo.emoji} {currentWorkout.title}
            </span>
            <span className={cn("text-xs font-bold uppercase tracking-widest", phaseDisplay.color)}>
              {phaseDisplay.label}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setAudioEnabled(!audioEnabled)} className="hover:bg-grid/20">
            {audioEnabled ? <Volume2 className="h-6 w-6 text-primary" /> : <VolumeX className="h-6 w-6 text-text-muted" />}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-text-muted uppercase tracking-widest">
            <span>Exercício {exerciseIndex + 1}/{totalExercises}</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="w-full bg-grid/30 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 px-6 z-10">

        {/* Current Exercise Info */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500" key={`${exerciseIndex}-${phase}`}>
          <h2 className="text-2xl sm:text-3xl font-black font-chakra leading-tight text-white tracking-tight uppercase">
            {currentExercise?.name || 'Carregando...'}
          </h2>

          {phase !== 'ready' && currentExercise && (
            <div className={cn(
              "border p-4 rounded-xl backdrop-blur-sm max-w-sm mx-auto",
              phase === 'rest' ? "bg-cyan-500/10 border-cyan-500/30" : "bg-blueprint/30 border-grid/50"
            )}>
              <p className="text-base text-text-muted leading-relaxed">
                {currentExercise.instructions}
              </p>
            </div>
          )}
        </div>

        {/* Big Timer */}
        <div className="relative my-4">
          {/* Glow Effect */}
          <div className={cn(
            "absolute inset-0 blur-3xl rounded-full transition-all duration-500",
            phase === 'prep' && "bg-warning/30",
            phase === 'exercise' && (timeLeft <= 10 ? "bg-danger/30" : "bg-primary/20"),
            phase === 'rest' && "bg-cyan-500/30",
            isPaused && "opacity-30"
          )} />

          <div className={cn(
            "relative text-[7rem] sm:text-[8rem] font-black font-chakra tabular-nums tracking-tighter leading-none select-none transition-colors duration-300",
            phaseDisplay.timerColor,
            timeLeft <= 10 && phase === 'exercise' && "animate-pulse"
          )}>
            {phase === 'ready' ? '--:--' : formatTime(timeLeft)}
          </div>
        </div>

        {/* Next Exercise Preview */}
        {nextExercise && phase !== 'ready' && !isRestExercise(nextExercise.name) && (
          <div className="bg-grid/20 border border-grid/30 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-xs text-text-muted uppercase tracking-wider">Próximo:</span>
            <span className="text-xs font-bold text-white">{nextExercise.name}</span>
          </div>
        )}

        {/* Phase indicator for exercise */}
        {phase === 'exercise' && currentExercise && (
          <div className="text-[10px] text-text-muted uppercase tracking-widest">
            {currentExercise.type === 'isometric' ? '💪 Isometria - Segure firme!' : currentExercise.type === 'reps' ? '🔄 Repetições' : '⏱️ Tempo'}
          </div>
        )}

        {/* Rest indicator */}
        {phase === 'rest' && (
          <div className="text-[10px] text-cyan-400 uppercase tracking-widest">
            😮‍💨 Respire fundo! Recupere as forças.
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-5 gap-3 px-4 pb-6 z-10 items-end">

        {/* Play/Pause Button */}
        <Button
          className={cn(
            "col-span-3 h-20 text-lg font-bold font-chakra uppercase tracking-widest rounded-2xl flex flex-col gap-1 shadow-xl transition-all active:scale-[0.98]",
            phase === 'ready'
              ? "bg-primary text-carbon hover:bg-primary/90"
              : isPaused
                ? "bg-primary text-carbon hover:bg-primary/90"
                : "bg-carbon border-2 border-primary text-primary hover:bg-primary/10"
          )}
          onClick={togglePause}
        >
          {phase === 'ready' ? (
            <>
              <Play className="h-8 w-8 fill-current" />
              <span className="text-sm">INICIAR</span>
            </>
          ) : isPaused ? (
            <>
              <Play className="h-8 w-8 fill-current" />
              <span className="text-sm">CONTINUAR</span>
            </>
          ) : (
            <>
              <Pause className="h-8 w-8" />
              <span className="text-sm">PAUSAR</span>
            </>
          )}
        </Button>

        {/* Skip Button */}
        <Button
          variant="outline"
          className="col-span-2 h-20 text-base font-bold font-chakra uppercase tracking-widest rounded-2xl flex flex-col gap-1 border-grid bg-blueprint/20 hover:bg-grid/30 hover:text-white transition-colors disabled:opacity-30"
          onClick={skipExercise}
          disabled={phase === 'ready'}
        >
          <SkipForward className="h-7 w-7" />
          <span className="text-sm">PULAR</span>
        </Button>
      </div>
    </div>
  );
}
