// LEVEL SYSTEM - Based on TIME (months of consistent training)
// Each level represents a stage of ankle strength and stability

export type LevelId = 1 | 2 | 3 | 4 | 5;

export interface LevelInfo {
  id: LevelId;
  name: string;
  emoji: string;
  description: string;
  requiredDays: number; // Days from start date to unlock
  color: string; // Tailwind color class
  audioAnnouncement: string;
}

export const LEVELS: LevelInfo[] = [
  {
    id: 1,
    name: "Vidro Frágil",
    emoji: "🪟",
    description: "Começando a construir a base. Cada dia conta.",
    requiredDays: 0,
    color: "text-red-400",
    audioAnnouncement: "Nível 1: Vidro Frágil. Você está construindo sua base."
  },
  {
    id: 2,
    name: "Concreto Armado",
    emoji: "🧱",
    description: "Estabilidade básica adquirida. Continue firme.",
    requiredDays: 30, // 1 month
    color: "text-orange-400",
    audioAnnouncement: "Nível 2: Concreto Armado. Sua base está ficando sólida."
  },
  {
    id: 3,
    name: "Aço Temperado",
    emoji: "⚙️",
    description: "Controle e força em desenvolvimento. Impressionante.",
    requiredDays: 60, // 2 months
    color: "text-yellow-400",
    audioAnnouncement: "Nível 3: Aço Temperado. Você está evoluindo rápido."
  },
  {
    id: 4,
    name: "Diamante Polido",
    emoji: "💎",
    description: "Resistência consolidada. Poucos chegam aqui.",
    requiredDays: 120, // 4 months
    color: "text-cyan-400",
    audioAnnouncement: "Nível 4: Diamante Polido. Sua resiliência é admirável."
  },
  {
    id: 5,
    name: "Tornozelo de Titânio",
    emoji: "🛡️",
    description: "Blindagem completa. Você é referência.",
    requiredDays: 180, // 6 months
    color: "text-primary",
    audioAnnouncement: "Nível 5: Tornozelo de Titânio. Você conquistou a blindagem completa."
  }
];

export function getLevelByDays(daysSinceStart: number): LevelInfo {
  // Find the highest level the user qualifies for
  const qualifiedLevels = LEVELS.filter(l => daysSinceStart >= l.requiredDays);
  return qualifiedLevels[qualifiedLevels.length - 1] || LEVELS[0];
}

export function getProgressToNextLevel(daysSinceStart: number): { 
  currentLevel: LevelInfo; 
  nextLevel: LevelInfo | null; 
  progressPercent: number;
  daysToNext: number;
} {
  const currentLevel = getLevelByDays(daysSinceStart);
  const nextLevelIndex = LEVELS.findIndex(l => l.id === currentLevel.id) + 1;
  const nextLevel = LEVELS[nextLevelIndex] || null;

  if (!nextLevel) {
    return { currentLevel, nextLevel: null, progressPercent: 100, daysToNext: 0 };
  }

  const daysInCurrentLevel = daysSinceStart - currentLevel.requiredDays;
  const daysNeededForNext = nextLevel.requiredDays - currentLevel.requiredDays;
  const progressPercent = Math.min(100, Math.round((daysInCurrentLevel / daysNeededForNext) * 100));
  const daysToNext = nextLevel.requiredDays - daysSinceStart;

  return { currentLevel, nextLevel, progressPercent, daysToNext };
}
