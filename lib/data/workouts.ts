// WORKOUT PROTOCOL - Tornozelo Blindado
// Inclui "Semana da Provação" (7 dias de 20 min) + 4 níveis de progressão

export interface ExerciseAudio {
  start?: string;
  middle?: string;
  end?: string;
}

export interface Exercise {
  id: string;
  name: string;
  instructions: string;
  duration: number; // in seconds
  type: 'timed' | 'reps' | 'isometric';
  audio?: ExerciseAudio;
  videoUrl?: string; // Path to demonstration video
}

export interface WorkoutBlock {
  name: string;
  duration: number; // total duration in seconds
  exercises: Exercise[];
}

export interface WorkoutLevel {
  id: number;
  title: string;
  description: string;
  duration: string;
  totalDuration: number; // total seconds
  exercises: Exercise[];
  blocks?: WorkoutBlock[]; // optional blocks for structured workouts
}

// ============================================================
// SEMANA DA PROVAÇÃO - 7 Dias de Treino Completo (20 minutos)
// Treina: Tendões + Ligamentos + Músculos
// 4 Blocos: Reset → Ativação → Estabilidade → Integração
// ============================================================

const SEMANA_PROVACAO: WorkoutLevel = {
  id: 0,
  title: "Semana da Provação",
  description: "7 dias de ritual completo: pé, panturrilha e conexão global",
  duration: "~20 min",
  totalDuration: 1200,
  blocks: [
    {
      name: "RESET",
      duration: 180, // 3 min
      exercises: [
        {
          id: "alfabeto-tornozelo",
          name: "Alfabeto do Tornozelo",
          instructions: "Pé no ar, desenhe as letras A-Z com a ponta do pé. Movimento vem do tornozelo, não do joelho.",
          duration: 60,
          type: "timed",
          audio: {
            start: "Pé no ar. Tornozelo relaxado. Começa: A, B, C... Desenha grande.",
            middle: "Capricha nos cantos. Cima, baixo, dentro, fora. Cada letra conta.",
            end: "Últimas letras. X, Y, Z. Troca o pé e repete mentalmente."
          }
        },
        {
          id: "knee-to-wall-bilateral",
          name: "Knee to Wall (Joelho na Parede)",
          instructions: "Pé a 10cm da parede. Joelho toca a parede sem levantar o calcanhar. Alterna os pés.",
          duration: 120,
          type: "timed",
          audio: {
            start: "Pé a 10 centímetros da parede. Calcanhar colado no chão. Joelho na parede, volta.",
            middle: "Alterna os pés. Sente o tornozelo abrindo. Dorsiflexão funcional.",
            end: "Últimas repetições. Tornozelo destravado. Pronto pro próximo bloco."
          }
        }
      ]
    },
    {
      name: "ATIVAÇÃO",
      duration: 300, // 5 min
      exercises: [
        {
          id: "short-foot",
          name: "Short Foot (Pé Curto)",
          instructions: "Em pé ou sentado, ativa o arco plantar 'encurtando' o pé sem dobrar os dedos. Mantém tensão.",
          duration: 60,
          type: "isometric",
          audio: {
            start: "Foco no arco. Puxa a bola do pé em direção ao calcanhar. Dedos relaxados.",
            middle: "Isso é o 'Hyperarch'. O interruptor que liga o glúteo. Mantém.",
            end: "Solta devagar. Isso é reprogramação neural."
          }
        },
        {
          id: "towel-curl",
          name: "Towel Curl (Puxar Toalha)",
          instructions: "Pé sobre a toalha. Agarra e puxa a toalha com os dedos. Trabalha musculatura intrínseca.",
          duration: 60,
          type: "timed",
          audio: {
            start: "Toalha no chão. Agarra com os dedos. Puxa pra você.",
            middle: "Dedos trabalhando. O 'segundo coração' do pé acorda.",
            end: "Última puxada. Isso prepara o pé pra carga."
          }
        },
        {
          id: "toe-raise",
          name: "Toe Raise (Levantar Dedos)",
          instructions: "Em pé, levanta a ponta dos pés mantendo calcanhar no chão. Trabalha tibial anterior.",
          duration: 60,
          type: "timed",
          audio: {
            start: "Calcanhar no chão. Levanta a ponta do pé. Canela ativa.",
            middle: "Tibial anterior é o freio do tornozelo. Fortalece ele.",
            end: "Queimou? Bom. Isso protege contra entorses."
          }
        },
        {
          id: "calf-raise-controlado",
          name: "Calf Raise Controlado",
          instructions: "Sobe na ponta dos pés em 3 segundos, desce em 3 segundos. Qualidade máxima.",
          duration: 120,
          type: "timed",
          audio: {
            start: "Sobe na ponta. Devagar. 3 segundos pra subir. 3 pra descer.",
            middle: "Tripé do pé: dedão, mindinho, calcanhar. Controle total.",
            end: "Último. Calcanhar bem alto. Desce controlando."
          }
        }
      ]
    },
    {
      name: "ESTABILIDADE",
      duration: 420, // 7 min
      exercises: [
        {
          id: "equilibrio-unipodal",
          name: "Equilíbrio Unipodal",
          instructions: "Fica em um pé só, 30 segundos cada lado. Pode fechar os olhos se for fácil demais.",
          duration: 60,
          type: "timed",
          audio: {
            start: "Um pé só. Estabiliza. Se precisar, parede do lado.",
            middle: "Troca o pé. O tornozelo corrige micro-desequilíbrios o tempo todo.",
            end: "Isso é propriocepção: seu tornozelo aprendendo a reagir."
          }
        },
        {
          id: "star-excursion",
          name: "Star Excursion (Estrela Simples)",
          instructions: "Apoio em um pé. Alcança com a perna livre em 3 direções: frente, lado, atrás. Troca.",
          duration: 180,
          type: "timed",
          audio: {
            start: "Apoio no pé direito. Estica a esquerda: frente, lado, atrás.",
            middle: "Quanto mais longe alcança, mais desafio pro tornozelo de apoio.",
            end: "Troca. Mesmo do outro lado. Controle total."
          }
        },
        {
          id: "mini-agachamento-unipodal",
          name: "Mini Agachamento Unipodal",
          instructions: "Apoio em um pé. Desce um pouco (mini agachamento). Joelho alinhado com pé. 90 seg cada lado.",
          duration: 180,
          type: "timed",
          audio: {
            start: "Apoio no pé direito. Desce um pouquinho. Joelho na linha do pé.",
            middle: "Pequena amplitude. O foco é estabilidade, não profundidade.",
            end: "Troca o lado. Mesmo padrão. Controle do tornozelo ao quadril."
          }
        }
      ]
    },
    {
      name: "INTEGRAÇÃO",
      duration: 300, // 5 min
      exercises: [
        {
          id: "integracao-escolha",
          name: "Escolha do Dia",
          instructions: "Escolha UMA opção: A) SL RDL (Terra Unilateral) B) Step-Down C) Leg Swing",
          duration: 30,
          type: "timed",
          audio: {
            start: "Bloco de integração. Escolha uma opção pra hoje. Próximo exercício vai guiar."
          }
        },
        {
          id: "sl-rdl-bilateral",
          name: "Single Leg RDL (Terra Unilateral)",
          instructions: "Apoio em uma perna. Desce o tronco enquanto a outra perna sobe atrás. Alterna.",
          duration: 270,
          type: "timed",
          audio: {
            start: "Apoio na direita. Desce devagar. Perna esquerda sobe atrás como contrapeso.",
            middle: "Sente glúteo e posterior trabalhando. Conexão pé-quadril ativa.",
            end: "Troca. Devagar. Isso é integração: todo o sistema junto."
          }
        }
      ]
    }
  ],
  exercises: [] // Will be populated from blocks
};

// Flatten blocks into exercises for the workout player
SEMANA_PROVACAO.exercises = SEMANA_PROVACAO.blocks?.flatMap(block => 
  block.exercises.map(ex => ({
    ...ex,
    name: `[${block.name}] ${ex.name}`
  }))
) || [];

// ============================================================
// NÍVEIS PROGRESSIVOS (Após a Semana da Provação)
// Focados especificamente em tendão e ligamento
// ============================================================

export const LEVELS: WorkoutLevel[] = [
  SEMANA_PROVACAO,
  {
    id: 1,
    title: "Reset & Analgesia",
    description: "Mobilidade básica e redução de dor",
    duration: "~8 min",
    totalDuration: 480,
    exercises: [
      {
        id: "alfabeto-dir",
        name: "Alfabeto Controlado - Direito",
        instructions: "Pé no ar, desenhe o alfabeto com o tornozelo. Movimento vindo do tornozelo, não do joelho.",
        duration: 60,
        type: "timed",
        audio: {
          start: "Pé direito no ar. Tornozelo relaxado, mas com controle. Começa desenhando o alfabeto.",
          middle: "Capricha nos cantos: cima, baixo, dentro, fora.",
          end: "Últimas letras. Cinco, quatro, três, dois, um. Troca o pé."
        }
      },
      {
        id: "alfabeto-esq",
        name: "Alfabeto Controlado - Esquerdo",
        instructions: "Mesmo movimento com o pé esquerdo. Traço amplo, sem pressa.",
        duration: 60,
        type: "timed",
        audio: {
          start: "Pé esquerdo agora. Desenha grande, como se estivesse escrevendo na parede.",
          middle: "Explora os ângulos que você evita no dia a dia.",
          end: "Controle primeiro, velocidade depois. Cinco, quatro, três, dois, um."
        }
      },
      {
        id: "knee-wall-dir",
        name: "Knee to Wall - Direito",
        instructions: "Pé a 10cm da parede. Calcanhar colado no chão. Joelho na parede e volta.",
        duration: 60,
        type: "timed",
        audio: {
          start: "Pé a uns 10 centímetros da parede. Calcanhar colado no chão.",
          middle: "Joelho segue na linha do segundo e terceiro dedo do pé. Sem levantar o calcanhar.",
          end: "Últimas repetições. Solta."
        }
      },
      {
        id: "knee-wall-esq",
        name: "Knee to Wall - Esquerdo",
        instructions: "Mesmo movimento com a perna esquerda. Qualidade maior que quantidade.",
        duration: 60,
        type: "timed",
        audio: {
          start: "Troca o lado. Mesmo padrão: joelho na parede, volta controlando.",
          middle: "Pensa: tornozelo abrindo, sem colapsar o arco.",
          end: "Qualidade maior que quantidade. Cinco, quatro, três, dois, um."
        }
      },
      {
        id: "iso-panturrilha-1",
        name: "Isometria Panturrilha - Série 1",
        instructions: "Sobe na ponta dos dois pés. Calcanhar alto. Trava. Mantém 30 segundos.",
        duration: 30,
        type: "isometric",
        audio: {
          start: "Sobe na ponta dos dois pés. Calcanhar alto. Travou.",
          middle: "Peso distribuído: dedão, mindinho e calcanhar. Tripé do pé.",
          end: "Segura firme. Três, dois, um. Descansa."
        }
      },
      {
        id: "descanso-1",
        name: "Descanso",
        instructions: "Desce devagar. Sacode leve. Respira.",
        duration: 30,
        type: "timed",
        audio: {
          start: "Desce devagar. Sacode leve. Respira.",
          end: "Próxima série. Mesmo alto, mesmo controle."
        }
      },
      {
        id: "iso-panturrilha-2",
        name: "Isometria Panturrilha - Série 2",
        instructions: "Sobe na ponta novamente. Segura 30 segundos.",
        duration: 30,
        type: "isometric",
        audio: {
          start: "Preparou. Sobe. Firmeza.",
          middle: "Você tá ensinando o pé a ficar confiável.",
          end: "Tá chegando. Não negocia agora. Três, dois, um."
        }
      },
      {
        id: "descanso-2",
        name: "Descanso",
        instructions: "Descansa 30 segundos.",
        duration: 30,
        type: "timed",
        audio: {
          start: "Respira. Sacode as pernas."
        }
      },
      {
        id: "iso-panturrilha-3",
        name: "Isometria Panturrilha - Série 3",
        instructions: "Última série de isometria. Dá tudo.",
        duration: 30,
        type: "isometric",
        audio: {
          start: "Última série. Dá tudo que você tem.",
          middle: "Segura esse alinhamento. Isso é revisão de base.",
          end: "Últimos segundos. Mantém alto. Três, dois, um. Finalizou."
        }
      }
    ]
  },
  {
    id: 2,
    title: "Ativação & Conexão",
    description: "Fortalecimento de arco e canela",
    duration: "~9 min",
    totalDuration: 540,
    exercises: [
      {
        id: "towel-curl",
        name: "Towel Curl Isométrico",
        instructions: "Pé na toalha. Levanta o arco, puxa a toalha sem agarrar com os dedos.",
        duration: 90,
        type: "isometric",
        audio: {
          start: "Pé na toalha. Agora: levanta o arco, puxa a toalha sem agarrar com os dedos.",
          middle: "É o pé encurtando, não os dedos enrolando. Tensão firme.",
          end: "Arco sobe, dedos relaxados. Solta."
        }
      },
      {
        id: "tibialis-raise",
        name: "Tibialis Raise na Parede",
        instructions: "Encosta o bumbum na parede. Pés à frente. Levanta a ponta do pé pra cima.",
        duration: 120,
        type: "timed",
        audio: {
          start: "Encosta o bumbum na parede. Pés à frente. Levanta a ponta do pé.",
          middle: "Canela queimando é normal. Dor aguda, não. Ponta lá em cima.",
          end: "Isso aqui é amortecedor do impacto. Últimas repetições."
        }
      },
      {
        id: "iso-soleo-1",
        name: "Isometria de Sóleo - Série 1",
        instructions: "Wall sit + ponta do pé. Joelho dobrado, foco no sóleo.",
        duration: 45,
        type: "isometric",
        audio: {
          start: "Desce no wall sit. Agora sobe na ponta do pé. Segura.",
          middle: "Joelho dobrado, foco aqui é sóleo. O guardião do tornozelo.",
          end: "Mantém o calcanhar alto. Três, dois, um. Desce."
        }
      },
      {
        id: "descanso-soleo-1",
        name: "Descanso",
        instructions: "Sai do wall sit. Solta perna. Respira.",
        duration: 45,
        type: "timed",
        audio: {
          start: "Sai do wall sit. Solta perna. Respira."
        }
      },
      {
        id: "iso-soleo-2",
        name: "Isometria de Sóleo - Série 2",
        instructions: "Mesma posição. Sóleo forte, tornozelo blindado.",
        duration: 45,
        type: "isometric",
        audio: {
          start: "Volta. Mesma altura, mesma calma.",
          middle: "Não precisa ser bonito. Precisa ser consistente.",
          end: "Segura mais um pouco. Três, dois, um."
        }
      },
      {
        id: "descanso-soleo-2",
        name: "Descanso",
        instructions: "Descansa 45 segundos.",
        duration: 45,
        type: "timed"
      },
      {
        id: "iso-soleo-3",
        name: "Isometria de Sóleo - Série 3",
        instructions: "Última série. Fecha com qualidade.",
        duration: 45,
        type: "isometric",
        audio: {
          start: "Última. Você tá treinando estabilidade, não espetáculo.",
          middle: "Isso é o que muda o jogo.",
          end: "Final. Desce controlando."
        }
      }
    ]
  },
  {
    id: 3,
    title: "Estabilidade & Reação",
    description: "Equilíbrio dinâmico e força unilateral",
    duration: "~8 min",
    totalDuration: 480,
    exercises: [
      {
        id: "caminhada-calcanhar",
        name: "Caminhada no Calcanhar",
        instructions: "Anda só no calcanhar. Ponta do pé lá em cima. Passos curtos.",
        duration: 60,
        type: "timed",
        audio: {
          start: "Anda só no calcanhar. Ponta do pé lá em cima.",
          middle: "Passos curtos, postura alta. Sente a canela trabalhando.",
          end: "Controle. E troca: agora ponta do pé."
        }
      },
      {
        id: "caminhada-ponta",
        name: "Caminhada na Ponta do Pé",
        instructions: "Agora na ponta. Calcanhar alto. Passos curtos, sem balançar.",
        duration: 60,
        type: "timed",
        audio: {
          start: "Agora na ponta do pé. Calcanhar bem alto.",
          middle: "Passos curtos, sem balançar. Tripé do pé ativo.",
          end: "Parou. Próximo: Estrela."
        }
      },
      {
        id: "star-excursion-dir",
        name: "Star Excursion - Direito",
        instructions: "Apoio no pé direito. Estica a perna esquerda em várias direções.",
        duration: 90,
        type: "timed",
        audio: {
          start: "Apoio no pé direito. Estica a perna esquerda, toca longe.",
          middle: "Frente, lado, atrás. Controla o tornozelo de apoio.",
          end: "Não deixa o joelho colapsar pra dentro. Troca."
        }
      },
      {
        id: "star-excursion-esq",
        name: "Star Excursion - Esquerdo",
        instructions: "Agora apoio no pé esquerdo. Mesmo padrão.",
        duration: 90,
        type: "timed",
        audio: {
          start: "Apoio no esquerdo. Estica a direita.",
          middle: "Quanto mais longe, mais desafio pro tornozelo.",
          end: "Controle total. Último alcance."
        }
      },
      {
        id: "calf-raise-dir",
        name: "Calf Raise Unilateral - Direito",
        instructions: "Elevação de panturrilha em um pé só. 3 segundos subindo, 3 descendo.",
        duration: 90,
        type: "timed",
        audio: {
          start: "Pé direito. Sobe em três segundos. Desce em três.",
          middle: "Controle máximo. Sem pressa.",
          end: "Força e controle. Última repetição."
        }
      },
      {
        id: "calf-raise-esq",
        name: "Calf Raise Unilateral - Esquerdo",
        instructions: "Mesmo exercício com o pé esquerdo.",
        duration: 90,
        type: "timed",
        audio: {
          start: "Pé esquerdo. Mesmo ritmo lento.",
          middle: "Isso aqui constrói força de verdade.",
          end: "Termina com controle."
        }
      }
    ]
  },
  {
    id: 4,
    title: "Integração & Performance",
    description: "Movimentos funcionais e pliometria leve",
    duration: "~10 min",
    totalDuration: 600,
    exercises: [
      {
        id: "single-leg-rdl-dir",
        name: "Single Leg RDL - Direito",
        instructions: "Apoio na perna direita. Desce o tronco enquanto a perna esquerda sobe atrás.",
        duration: 120,
        type: "timed",
        audio: {
          start: "Apoio na direita. Desce devagar. Perna esquerda sobe atrás.",
          middle: "Lento e controlado. Sente o glúteo e posterior trabalhando.",
          end: "Movimento conectado. Troca."
        }
      },
      {
        id: "single-leg-rdl-esq",
        name: "Single Leg RDL - Esquerdo",
        instructions: "Mesmo movimento com a perna esquerda de apoio.",
        duration: 120,
        type: "timed",
        audio: {
          start: "Apoio na esquerda agora. Desce devagar.",
          middle: "Todo o corpo trabalhando junto.",
          end: "Controle total. Encerrou."
        }
      },
      {
        id: "pogo-jumps-1",
        name: "Pogo Jumps - Série 1",
        instructions: "Saltos curtos na ponta do pé. Contato rápido com o chão.",
        duration: 30,
        type: "timed",
        audio: {
          start: "Saltinhos na ponta. Contato rápido. Tornozelo rígido.",
          middle: "Pensa em mola. Chão queima.",
          end: "Três, dois, um. Descansa."
        }
      },
      {
        id: "descanso-pogo-1",
        name: "Descanso",
        instructions: "Respira fundo. Próxima série em breve.",
        duration: 30,
        type: "timed"
      },
      {
        id: "pogo-jumps-2",
        name: "Pogo Jumps - Série 2",
        instructions: "Mesmos saltos. Mantém a qualidade.",
        duration: 30,
        type: "timed",
        audio: {
          start: "Segunda série. Mesma energia.",
          end: "Descansa."
        }
      },
      {
        id: "descanso-pogo-2",
        name: "Descanso",
        instructions: "Recupera o fôlego.",
        duration: 30,
        type: "timed"
      },
      {
        id: "pogo-jumps-3",
        name: "Pogo Jumps - Série 3",
        instructions: "Última série de saltos.",
        duration: 30,
        type: "timed",
        audio: {
          start: "Última série. Dá tudo.",
          end: "Finalizou os saltos."
        }
      },
      {
        id: "overcoming-iso",
        name: "Overcoming Isometric",
        instructions: "Empurra a parede com força máxima por 10 segundos. Repete 5 vezes.",
        duration: 150,
        type: "isometric",
        audio: {
          start: "Mãos na parede. Empurra com tudo. Dez segundos.",
          middle: "Tensão máxima. Todo o corpo engajado.",
          end: "Isso treina o sistema nervoso. Finalizou o protocolo."
        }
      }
    ]
  }
];

// Helper functions
export function getWorkoutByLevel(level: number): WorkoutLevel {
  return LEVELS.find(l => l.id === level) || LEVELS[0];
}

export function getTotalDuration(workout: WorkoutLevel): number {
  return workout.exercises.reduce((acc, ex) => acc + ex.duration, 0);
}

export function getSemanaDaProvacao(): WorkoutLevel {
  return SEMANA_PROVACAO;
}

export function isSemanaDaProvacao(levelId: number): boolean {
  return levelId === 0;
}
