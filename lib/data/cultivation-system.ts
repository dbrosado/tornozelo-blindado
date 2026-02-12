// SAGA DA ASCENSÃO DO TENDÃO - Sistema de Cultivo Wuxia/Manhwa
// Inclui SEMANA DA PROVAÇÃO (7 dias) + 10 Estágios de Progressão
// Baseado em Keith Baar (Mecanobiologia), Movement System e Protocolo Tornozelo Blindado

export type SubLevelTier = 'early' | 'mid' | 'peak';
export type SubLevelNumber = 1 | 2 | 3;

export interface SubLevel {
  tier: SubLevelTier;
  number: SubLevelNumber;
  displayName: string; // "Early I", "Mid II", "Peak III"
  xpRequired: number;
}

export interface CultivationStage {
  id: number; // 0-10 (0 = Semana da Provação)
  realm: string; // "A Provação"
  name: string; // "Semana da Provação"
  emoji: string;
  description: string;
  lore: string; // Texto imersivo
  color: string; // Tailwind class
  bgGlow: string; // Glow color
  requirements: {
    minDays: number; // Dias desde o início do programa
    minSessions: number; // Sessões completadas
    avgDifficulty: number; // Média mínima de dificuldade (1-3)
  };
  subLevels: SubLevel[];
  isProvacao?: boolean; // Marca a Semana da Provação
}

// Sub-níveis padrão (9 por estágio)
const createSubLevels = (baseXp: number): SubLevel[] => {
  const tiers: SubLevelTier[] = ['early', 'mid', 'peak'];
  const numbers: SubLevelNumber[] = [1, 2, 3];
  const tierNames = { early: 'Inicial', mid: 'Médio', peak: 'Pico' };
  
  return tiers.flatMap((tier, tierIdx) => 
    numbers.map((num, numIdx) => ({
      tier,
      number: num,
      displayName: `${tierNames[tier]} ${['I', 'II', 'III'][numIdx]}`,
      xpRequired: baseXp * (tierIdx * 3 + numIdx + 1)
    }))
  );
};

// Sub-níveis especiais para Semana da Provação (7 dias)
const createProvacaoSubLevels = (): SubLevel[] => {
  const days = [1, 2, 3, 4, 5, 6, 7];
  return days.map((day, idx) => ({
    tier: idx < 3 ? 'early' : idx < 5 ? 'mid' : 'peak',
    number: ((idx % 3) + 1) as SubLevelNumber,
    displayName: `Dia ${day}`,
    xpRequired: day * 100
  }));
};

export const CULTIVATION_STAGES: CultivationStage[] = [
  // ═══════════════════════════════════════════════════════════════
  // ESTÁGIO 0: A PROVAÇÃO (7 Dias Iniciais)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 0,
    realm: "A Provação",
    name: "Semana da Provação",
    emoji: "🔥",
    description: "7 dias de ritual completo: Reset, Ativação, Estabilidade, Integração",
    lore: "Antes de ascender, todo guerreiro deve provar seu comprometimento. São 7 dias de treino ininterrupto. 20 minutos diários. Sem desculpas. Sobreviva a esta semana e seu corpo saberá que você fala sério.",
    color: "text-red-500",
    bgGlow: "rgba(239, 68, 68, 0.4)",
    requirements: { minDays: 0, minSessions: 0, avgDifficulty: 0 },
    subLevels: createProvacaoSubLevels(),
    isProvacao: true
  },

  // ═══════════════════════════════════════════════════════════════
  // ESTÁGIO 1-3: DESPERTAR DO MORTAL
  // ═══════════════════════════════════════════════════════════════
  {
    id: 1,
    realm: "Despertar do Mortal",
    name: "Refinamento da Medula",
    emoji: "🌙",
    description: "Saúde celular, analgesia e conexão neural",
    lore: "Você completou a Provação. Agora, o verdadeiro cultivo começa. Os tendões que antes eram frágeis começam a despertar.",
    color: "text-slate-400",
    bgGlow: "rgba(148, 163, 184, 0.3)",
    requirements: { minDays: 7, minSessions: 7, avgDifficulty: 0 },
    subLevels: createSubLevels(100)
  },
  {
    id: 2,
    realm: "Despertar do Mortal",
    name: "Abertura dos Meridianos",
    emoji: "💫",
    description: "Ativação do Sóleo e Tibial Anterior",
    lore: "Os meridianos do tornozelo começam a pulsar. O Qi flui onde antes havia estagnação.",
    color: "text-zinc-300",
    bgGlow: "rgba(212, 212, 216, 0.3)",
    requirements: { minDays: 21, minSessions: 17, avgDifficulty: 1.5 },
    subLevels: createSubLevels(150)
  },
  {
    id: 3,
    realm: "Despertar do Mortal",
    name: "Condensação do Qi",
    emoji: "🌀",
    description: "Transição para carga lenta (HSR)",
    lore: "O Qi bruto se condensa em poder utilizável. Suas fibras de colágeno se alinham como soldados em formação.",
    color: "text-cyan-400",
    bgGlow: "rgba(34, 211, 238, 0.3)",
    requirements: { minDays: 37, minSessions: 27, avgDifficulty: 1.8 },
    subLevels: createSubLevels(200)
  },

  // ═══════════════════════════════════════════════════════════════
  // ESTÁGIO 4-6: FUNDAÇÃO DO GUERREIRO
  // ═══════════════════════════════════════════════════════════════
  {
    id: 4,
    realm: "Fundação do Guerreiro",
    name: "Forja de Cobre",
    emoji: "🥉",
    description: "Força unilateral e controle",
    lore: "O cobre é maleável, mas resistente. Você aprende a distribuir o peso em uma só perna sem colapsar.",
    color: "text-orange-400",
    bgGlow: "rgba(251, 146, 60, 0.3)",
    requirements: { minDays: 52, minSessions: 37, avgDifficulty: 2.0 },
    subLevels: createSubLevels(250)
  },
  {
    id: 5,
    realm: "Fundação do Guerreiro",
    name: "Forja de Ferro",
    emoji: "⚔️",
    description: "Resistência de força e pliometria extensiva",
    lore: "O ferro não quebra fácil. A cada repetição, seu tendão ganha densidade e resiliência.",
    color: "text-gray-400",
    bgGlow: "rgba(156, 163, 175, 0.4)",
    requirements: { minDays: 67, minSessions: 52, avgDifficulty: 2.2 },
    subLevels: createSubLevels(300)
  },
  {
    id: 6,
    realm: "Fundação do Guerreiro",
    name: "Temperamento de Aço",
    emoji: "🛡️",
    description: "Absorção de impacto e deceleração",
    lore: "O aço é forjado no fogo e temperado na água. Você aprende a frear o impacto, a absorver o choque.",
    color: "text-blue-400",
    bgGlow: "rgba(96, 165, 250, 0.3)",
    requirements: { minDays: 97, minSessions: 67, avgDifficulty: 2.3 },
    subLevels: createSubLevels(400)
  },

  // ═══════════════════════════════════════════════════════════════
  // ESTÁGIO 7-8: MESTRE DO FLUXO
  // ═══════════════════════════════════════════════════════════════
  {
    id: 7,
    realm: "Mestre do Fluxo",
    name: "Núcleo Dourado",
    emoji: "🌟",
    description: "Reatividade e rigidez (Stiffness)",
    lore: "No centro do seu ser, um núcleo dourado se forma. Seus tendões agem como molas de aço.",
    color: "text-yellow-400",
    bgGlow: "rgba(250, 204, 21, 0.4)",
    requirements: { minDays: 127, minSessions: 87, avgDifficulty: 2.5 },
    subLevels: createSubLevels(500)
  },
  {
    id: 8,
    realm: "Mestre do Fluxo",
    name: "Alma Nascente",
    emoji: "👁️",
    description: "Pliometria intensiva e potência unilateral",
    lore: "Uma nova consciência emerge. Você sente cada fibra, cada contração. O corpo obedece ao pensamento.",
    color: "text-purple-400",
    bgGlow: "rgba(192, 132, 252, 0.4)",
    requirements: { minDays: 157, minSessions: 107, avgDifficulty: 2.7 },
    subLevels: createSubLevels(600)
  },

  // ═══════════════════════════════════════════════════════════════
  // ESTÁGIO 9-10: A DIVINDADE
  // ═══════════════════════════════════════════════════════════════
  {
    id: 9,
    realm: "A Divindade",
    name: "Transformação Celestial",
    emoji: "⚡",
    description: "Overcoming Isometrics e Overspeed",
    lore: "Os céus tremem. Você transcende os limites mortais, treinando mais rápido que a gravidade permite.",
    color: "text-sky-300",
    bgGlow: "rgba(125, 211, 252, 0.5)",
    requirements: { minDays: 187, minSessions: 137, avgDifficulty: 2.9 },
    subLevels: createSubLevels(750)
  },
  {
    id: 10,
    realm: "A Divindade",
    name: "Ascensão Imortal",
    emoji: "🔱",
    description: "Complexo de Potência (French Contrast)",
    lore: "Você alcançou o topo do cultivo mortal. Seu tornozelo é titânio divino. Poucos mortais pisaram onde você pisa.",
    color: "text-primary",
    bgGlow: "rgba(16, 185, 129, 0.5)",
    requirements: { minDays: 372, minSessions: 207, avgDifficulty: 3.0 },
    subLevels: createSubLevels(1000)
  }
];

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES DE CÁLCULO
// ═══════════════════════════════════════════════════════════════

export function getStageById(id: number): CultivationStage {
  return CULTIVATION_STAGES.find(s => s.id === id) || CULTIVATION_STAGES[0];
}

export function getProvacaoStage(): CultivationStage {
  return CULTIVATION_STAGES[0];
}

export function isInProvacao(daysSinceStart: number, totalSessions: number): boolean {
  return daysSinceStart < 7 || totalSessions < 7;
}

export function getCurrentStage(
  daysSinceStart: number,
  totalSessions: number,
  avgDifficulty: number
): CultivationStage {
  // Durante a Semana da Provação, sempre retorna estágio 0
  if (isInProvacao(daysSinceStart, totalSessions)) {
    return CULTIVATION_STAGES[0];
  }
  
  // Após a Provação, encontra o estágio mais alto que o usuário qualifica
  for (let i = CULTIVATION_STAGES.length - 1; i >= 0; i--) {
    const stage = CULTIVATION_STAGES[i];
    const { minDays, minSessions, avgDifficulty: reqDiff } = stage.requirements;
    
    if (daysSinceStart >= minDays && 
        totalSessions >= minSessions && 
        avgDifficulty >= reqDiff) {
      return stage;
    }
  }
  return CULTIVATION_STAGES[1]; // Retorna estágio 1 se passou da Provação
}

export function getCurrentSubLevel(
  stage: CultivationStage,
  currentXp: number
): { subLevel: SubLevel; progress: number; xpToNext: number } {
  const subLevels = stage.subLevels;
  
  for (let i = subLevels.length - 1; i >= 0; i--) {
    if (currentXp >= subLevels[i].xpRequired) {
      const current = subLevels[i];
      const next = subLevels[i + 1];
      
      if (next) {
        const xpInLevel = currentXp - current.xpRequired;
        const xpNeeded = next.xpRequired - current.xpRequired;
        const progress = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
        return { subLevel: current, progress, xpToNext: xpNeeded - xpInLevel };
      }
      
      return { subLevel: current, progress: 100, xpToNext: 0 };
    }
  }
  
  const first = subLevels[0];
  const progress = Math.round((currentXp / first.xpRequired) * 100);
  return { subLevel: first, progress, xpToNext: first.xpRequired - currentXp };
}

export function calculateXpFromWorkout(
  difficulty: number, // 1-3 (Leve, Moderado, Difícil)
  completedExercises: number,
  totalExercises: number
): number {
  const completionRate = completedExercises / totalExercises;
  const baseXp = 50;
  const difficultyBonus = difficulty * 20; // 20, 40, 60
  const completionBonus = Math.round(completionRate * 30);
  
  return baseXp + difficultyBonus + completionBonus;
}

export function canUnlockStage(
  targetStage: CultivationStage,
  daysSinceStart: number,
  totalSessions: number,
  avgDifficulty: number
): { canUnlock: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const req = targetStage.requirements;
  
  if (daysSinceStart < req.minDays) {
    reasons.push(`Faltam ${req.minDays - daysSinceStart} dias`);
  }
  if (totalSessions < req.minSessions) {
    reasons.push(`Faltam ${req.minSessions - totalSessions} sessões`);
  }
  if (avgDifficulty < req.avgDifficulty) {
    reasons.push(`Dificuldade média ${avgDifficulty.toFixed(1)} < ${req.avgDifficulty}`);
  }
  
  return { canUnlock: reasons.length === 0, reasons };
}

// Realms agrupados (incluindo Provação)
export const REALMS = [
  { name: "A Provação", stages: [0], color: "text-red-500" },
  { name: "Despertar do Mortal", stages: [1, 2, 3], color: "text-slate-400" },
  { name: "Fundação do Guerreiro", stages: [4, 5, 6], color: "text-orange-400" },
  { name: "Mestre do Fluxo", stages: [7, 8], color: "text-yellow-400" },
  { name: "A Divindade", stages: [9, 10], color: "text-primary" }
];

// Dias restantes na Provação
export function getProvacaoProgress(totalSessions: number): {
  currentDay: number;
  totalDays: number;
  isComplete: boolean;
} {
  // Começa em 0% (dia 0/7) e só avança após completar sessões.
  const currentDay = Math.min(totalSessions, 7);
  return {
    currentDay,
    totalDays: 7,
    isComplete: totalSessions >= 7
  };
}
