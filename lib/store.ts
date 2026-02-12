import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { differenceInDays } from 'date-fns';
import {
  getCurrentStage,
  getCurrentSubLevel,
  calculateXpFromWorkout,
  isInProvacao,
  getProvacaoProgress,
  CultivationStage,
  SubLevel
} from './data/cultivation-system';

const STORE_KEYS = {
  lastWorkoutTime: 'last_workout_time',
  cultivationStorage: 'tornozelo-cultivation-storage',
} as const;

function getSafeDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getDaysSinceStartDate(startDate: string | null): number {
  const parsedStart = getSafeDate(startDate);
  if (!parsedStart) return 0;
  return differenceInDays(new Date(), parsedStart);
}

function safeLocalStorageSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures (private mode, quota exceeded, restricted storage)
  }
}

function safeLocalStorageRemoveItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage failures
  }
}

export type ReadinessStatus = 'green' | 'yellow' | 'red' | null;
export type DifficultyRating = 1 | 2 | 3; // Leve, Moderado, Difícil
export type AudioMode = 'voice' | 'timer'; // Voice narration or timer only

export interface UserProfile {
  goal: 'dor' | 'performance' | 'retorno';
  painBaseline: number; // 0-10
  level: 'iniciante' | 'intermediario' | 'avancado';
}

export interface PostWorkoutRating {
  date: string;
  difficulty: DifficultyRating;
  painLevel: number; // 0-10
  stability: number; // 0-10
  xpEarned: number;
  stageId: number;
  exercisesCompleted: number;
  totalExercises: number;
}

interface AppState {
  // User Journey
  startDate: string | null;

  // Cultivation System
  currentStageId: number;
  currentXp: number;
  totalXp: number;
  unlockedStages: number[]; // IDs of stages the user has unlocked

  // Session Tracking
  streak: number;
  bestStreak: number;
  totalSessions: number;
  lastSession: string | null;

  // Post-Workout Ratings
  postWorkoutRatings: PostWorkoutRating[];

  // Daily State
  readiness: {
    status: ReadinessStatus;
    checkInDate: string | null;
  };

  // Audio Mode
  audioMode: AudioMode;

  // Onboarding/Profile
  onboardingCompleted: boolean;
  profile: UserProfile | null;

  // Setters
  setReadiness: (status: ReadinessStatus) => void;
  setAudioMode: (mode: AudioMode) => void;

  // Actions
  actions: {
    completeSession: () => void;
    submitPostWorkout: (rating: Omit<PostWorkoutRating, 'date' | 'xpEarned'>) => void;
    resetProgress: () => void;
    resetTimer: () => void;
    forceUnlockStage: (stageId: number) => void;
    completeOnboarding: (profile: UserProfile) => void;
    getDaysSinceStart: () => number;
    getAverageDifficulty: () => number;
    isInProvacao: () => boolean;
    getProvacaoProgress: () => { currentDay: number; totalDays: number; isComplete: boolean };
    getCultivationInfo: () => {
      stage: CultivationStage;
      subLevel: SubLevel;
      progress: number;
      xpToNext: number;
      totalXp: number;
    };
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State - Começa na Semana da Provação (estágio 0)
      startDate: null,
      currentStageId: 0,  // Mudado de 1 para 0 (Provação)
      currentXp: 0,
      totalXp: 0,
      unlockedStages: [0], // Estágio 0 (Provação) desbloqueado por padrão
      streak: 0,
      bestStreak: 0,
      totalSessions: 0,
      lastSession: null,
      postWorkoutRatings: [],
      readiness: { status: null, checkInDate: null },
      audioMode: 'voice', // Default to voice narration
      onboardingCompleted: false,
      profile: null,

      // Setters
      setReadiness: (status) => set({ readiness: { status, checkInDate: new Date().toISOString() } }),
      setAudioMode: (mode) => set({ audioMode: mode }),

      // Actions
      actions: {
        completeSession: () => set((state) => {
          const now = new Date().toISOString();

          safeLocalStorageSetItem(STORE_KEYS.lastWorkoutTime, now);

          const startDate = state.startDate || now;
          const newStreak = state.streak + 1;
          const newTotal = state.totalSessions + 1;

          return {
            startDate,
            lastSession: now,
            streak: newStreak,
            bestStreak: Math.max(state.bestStreak, newStreak),
            totalSessions: newTotal
          };
        }),

        submitPostWorkout: (rating) => set((state) => {
          if (rating.totalExercises <= 0 || rating.exercisesCompleted < 0) {
            return state;
          }

          const safeCompletedExercises = Math.min(
            rating.exercisesCompleted,
            rating.totalExercises
          );

          const xpEarned = calculateXpFromWorkout(
            rating.difficulty,
            safeCompletedExercises,
            rating.totalExercises
          );

          const newRating: PostWorkoutRating = {
            ...rating,
            exercisesCompleted: safeCompletedExercises,
            date: new Date().toISOString(),
            xpEarned
          };

          const newTotalXp = state.totalXp + xpEarned;
          const newCurrentXp = state.currentXp + xpEarned;

          // Check if user qualifies for next stage
          const daysSinceStart = getDaysSinceStartDate(state.startDate);
          const newTotalSessions = state.totalSessions;
          const allRatings = [...state.postWorkoutRatings, newRating];
          const avgDifficulty = allRatings.reduce((sum, r) => sum + r.difficulty, 0) / allRatings.length;

          const newStage = getCurrentStage(daysSinceStart, newTotalSessions, avgDifficulty);

          // Unlock new stage if progressed
          const unlockedStages = state.unlockedStages.includes(newStage.id)
            ? state.unlockedStages
            : [...state.unlockedStages, newStage.id].sort((a, b) => a - b);

          return {
            postWorkoutRatings: allRatings,
            currentXp: newCurrentXp,
            totalXp: newTotalXp,
            currentStageId: newStage.id,
            unlockedStages
          };
        }),

        resetProgress: () => {
          safeLocalStorageRemoveItem(STORE_KEYS.lastWorkoutTime);
          safeLocalStorageRemoveItem(STORE_KEYS.cultivationStorage);

          set({
            startDate: null,
            currentStageId: 0,  // Volta para Provação
            currentXp: 0,
            totalXp: 0,
            unlockedStages: [0], // Só Provação desbloqueada
            streak: 0,
            bestStreak: 0,
            totalSessions: 0,
            lastSession: null,
            postWorkoutRatings: [],
            readiness: { status: null, checkInDate: null },
            onboardingCompleted: false,
            profile: null,
          });
          // Force page reload to reset hydration state
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        },

        resetTimer: () => {
          safeLocalStorageRemoveItem(STORE_KEYS.lastWorkoutTime);

          set({ lastSession: null });
        },

        forceUnlockStage: (stageId: number) => set((state) => ({
          unlockedStages: state.unlockedStages.includes(stageId)
            ? state.unlockedStages
            : [...state.unlockedStages, stageId].sort((a, b) => a - b)
        })),

        completeOnboarding: (profile) => set({
          onboardingCompleted: true,
          profile,
        }),

        getDaysSinceStart: () => {
          const state = get();

          return getDaysSinceStartDate(state.startDate);
        },

        getAverageDifficulty: () => {
          const state = get();
          if (state.postWorkoutRatings.length === 0) return 0;
          return state.postWorkoutRatings.reduce((sum, r) => sum + r.difficulty, 0) / state.postWorkoutRatings.length;
        },

        isInProvacao: () => {
          const state = get();

          const daysSinceStart = getDaysSinceStartDate(state.startDate);

          return isInProvacao(daysSinceStart, state.totalSessions);
        },

        getProvacaoProgress: () => {
          const state = get();
          return getProvacaoProgress(state.totalSessions);
        },

        getCultivationInfo: () => {
          const state = get();

          const daysSinceStart = getDaysSinceStartDate(state.startDate);

          const avgDifficulty = state.postWorkoutRatings.length > 0
            ? state.postWorkoutRatings.reduce((sum, r) => sum + r.difficulty, 0) / state.postWorkoutRatings.length
            : 0;

          const stage = getCurrentStage(daysSinceStart, state.totalSessions, avgDifficulty);
          const { subLevel, progress, xpToNext } = getCurrentSubLevel(stage, state.currentXp);

          return {
            stage,
            subLevel,
            progress,
            xpToNext,
            totalXp: state.totalXp
          };
        }
      },
    }),
    {
      name: 'tornozelo-cultivation-storage',
      partialize: (state) => ({
        startDate: state.startDate,
        currentStageId: state.currentStageId,
        currentXp: state.currentXp,
        totalXp: state.totalXp,
        unlockedStages: state.unlockedStages,
        streak: state.streak,
        bestStreak: state.bestStreak,
        totalSessions: state.totalSessions,
        lastSession: state.lastSession,
        postWorkoutRatings: state.postWorkoutRatings,
        readiness: state.readiness,
        audioMode: state.audioMode, // Persist audio mode
        onboardingCompleted: state.onboardingCompleted,
        profile: state.profile,
      })
    }
  )
);
