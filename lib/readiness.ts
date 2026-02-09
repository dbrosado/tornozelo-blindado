export type ReadinessStatus = 'green' | 'yellow' | 'red';

export interface ReadinessInput {
  pain: number; // 0-10
  instability: number; // 0-10
  recentFall: boolean; // "Quase-virei" last 7 days
  microTest: 'firm' | 'shaky' | 'unstable';
}

export interface ReadinessOutput {
  status: ReadinessStatus;
  planMod: 'full' | 'reduced' | 'reset';
  message: string;
}

export function calculateReadiness(input: ReadinessInput): ReadinessOutput {
  const { pain, instability, recentFall, microTest } = input;

  // RULE 1: Pain > 5 -> RED
  if (pain > 5) {
    return { 
      status: 'red', 
      planMod: 'reset',
      message: 'Dor alta detectada. Ativando protocolo de analgesia.'
    };
  }

  // RULE 2: Pain 4-5 -> YELLOW
  if (pain >= 4) {
    return { 
      status: 'yellow', 
      planMod: 'reduced',
      message: 'Atenção à dor moderada. Carga reduzida.'
    };
  }

  // RULE 3: Instability >= 7 OR MicroTest Unstable -> YELLOW (or RED depending on pain)
  // If pain is low (0-3) but strict instability -> Yellow
  if (instability >= 7 || microTest === 'unstable') {
    return { 
      status: 'yellow', 
      planMod: 'reduced',
      message: 'Instabilidade alta. Foco em controle, sem impacto.'
    };
  }
  
  // RULE 4: Recent Fall -> Yellow Caution if not already red
  if (recentFall) {
     return {
       status: 'yellow',
       planMod: 'reduced',
       message: 'Histórico recente de instabilidade. Vamos com cautela.'
     };
  }

  // DEFAULT: GREEN
  return { 
    status: 'green', 
    planMod: 'full',
    message: 'Sinal verde. Treino completo liberado.' 
  };
}
