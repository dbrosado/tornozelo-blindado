// lib/manual-content.ts
// All content sourced from: Athletic Performance Science: Power, Speed, and CNS Optimization (NotebookLM)

export interface ManualSection {
    id: string;
    content: string; // markdown-like string rendered in JSX
}

export interface ManualArticle {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    icon: string; // lucide icon name
    color: string;
    category: "science" | "protocol" | "safety" | "nutrition";
    readTime: string;
    sections: ManualSection[];
}

export const manualArticles: ManualArticle[] = [
    // ─────────────────────────────────────────────
    // 1. A CIÊNCIA DO TENDÃO
    // ─────────────────────────────────────────────
    {
        id: "tendon-science",
        slug: "ciencia-do-tendao",
        title: "A Ciência do Tendão",
        subtitle: "Entenda como seu tendão se adapta, se repara e fica mais forte.",
        icon: "Microscope",
        color: "#3B82F6",
        category: "science",
        readTime: "8 min",
        sections: [
            {
                id: "continuum",
                content: `O Modelo Contínuo de Patologia do Tendão

Para tratar e fortalecer um tendão, você precisa entender em qual estágio ele se encontra. Existe um espectro chamado "Continuum de Patologia Tendínea":

• Tendinopatia Reativa
Resposta aguda a uma sobrecarga (ex: uma corrida intensa sem preparo). O tendão retém água, se espessa para reduzir o estresse. Está inchado e dolorido, mas estruturalmente intacto. O tratamento envolve reduzir carga e usar isométricos.

• Tendinopatia Degenerativa
Estado crônico com morte celular e desorganização da matriz. É aqui que entra o conceito mais importante:

"Trate a Rosquinha, Não o Buraco."
Em tendões degenerativos, uma porção do tecido está essencialmente morta (o buraco). Você não consegue regenerar esse núcleo. A reabilitação visa fortalecer o tecido saudável ao redor (a rosquinha) para compensar o núcleo silencioso.`
            },
            {
                id: "viscoelasticity",
                content: `Viscoelasticidade: Como o Tendão Responde à Carga

Tendões são viscoelásticos — se comportam tanto como sólido quanto como fluido.

• Em Movimentos Rápidos (saltar, correr): O tendão age como um lençol rígido. A carga "desvia" da área danificada, protegendo-a mas sem estimulá-la a se reparar.

• Em Contrações Isométricas Longas: O músculo encurta lentamente enquanto o tendão se alonga (fenômeno de "creep"). Isso força a carga a passar pela área lesionada, fornecendo o sinal mecânico necessário para o reparo.

É por isso que segurar isométricos por 30-45 segundos é tão eficaz para tendões — o tempo permite que as fibras saudáveis relaxem e a carga se redistribua para onde é mais necessária.`
            },
            {
                id: "mechanotransduction",
                content: `Mecanotransdução: Células Sentem Carga

Os tenócitos (células do tendão) são mecanossensíveis — eles detectam forças mecânicas e respondem produzindo colágeno novo.

Porém, essas células são "refratárias" como um adolescente — após serem estimuladas, elas se desligam e precisam de 6 a 8 horas de descanso para ficar responsivas novamente.

O sinal molecular para síntese de colágeno atinge o pico após apenas 10 minutos de atividade. Continuar carregando o tendão além de 10 minutos adiciona desgaste sem estimular mais reparo.

Implicação prática: Sessões curtas (10 min) duas vezes ao dia são superiores a uma sessão longa. Isso fornece dois sinais anabólicos distintos por dia.`
            },
            {
                id: "spring",
                content: `O Tendão como Mola Biológica

Nos movimentos mais rápidos do esporte (sprint, saltos), o músculo não encurta e alonga rapidamente como muitos pensam. O que acontece é:

1. O músculo contrai isometricamente (mantém o mesmo comprimento), criando um pilar rígido.
2. O tendão estica e recua elasticamente, armazenando e liberando energia.

Este é o Ciclo Alongamento-Encurtamento (SSC). É o mesmo mecanismo usado por cangurus para pular — eles usam energia elástica dos tendões, não apenas esforço muscular.

O tendão de Aquiles tem uma propriedade especial: ele é complacente (flexível) perto do músculo para protegê-lo, e mais rígido perto do osso para transmitir força eficientemente. A rigidez ideal é um equilíbrio — se o tendão é muito flexível, potência é perdida. Se é muito rígido em relação à força do músculo, lesões musculares ocorrem.`
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 2. BIOMECÂNICA DO TORNOZELO
    // ─────────────────────────────────────────────
    {
        id: "ankle-biomechanics",
        slug: "biomecanica-do-tornozelo",
        title: "Biomecânica do Tornozelo",
        subtitle: "Como o tornozelo funciona e por que ele é a base de toda performance.",
        icon: "Footprints",
        color: "#10B981",
        category: "science",
        readTime: "10 min",
        sections: [
            {
                id: "ankle-system",
                content: `O Tornozelo Não é uma Dobradiça Simples

O tornozelo é parte de um sistema complexo projetado para absorver e produzir força através de rotação e "torção" do membro inferior.

A "Pista" da Força:
Movimentos atléticos envolvem uma pista de ações articulares:

• Absorção de Força → Pronação (achatamento do arco), rotação interna da tíbia, rotação interna do quadril.
• Produção de Força → Supinação (arco rígido como alavanca), rotação externa da tíbia, rotação externa do quadril.

O Mecanismo de Mola:
O pé e tornozelo funcionam como uma mola biológica. O uso eficiente do colapso e recuo do arco (pronação/supinação) pode reduzir o custo metabólico da corrida em aproximadamente 17%.

Torção e Mediopé:
Restrições frequentemente ocorrem não apenas na articulação do tornozelo, mas no mediopé. Se o mediopé não consegue "abrir" (supinar) ou ceder (pronar), a força é transferida ineficientemente para cima na cadeia, para o joelho ou quadril.`
            },
            {
                id: "muscles",
                content: `Os Músculos e Suas Funções

Gastrocnêmio ("O Motor de Potência")
Cruza tanto o joelho quanto o tornozelo. Composto por 50-60% de fibras rápidas (fast-twitch), é responsável pela potência explosiva (sprint, saltos). Fica "insuficiente" quando o joelho está dobrado.

Sóleo ("O Pilar de Resistência")
Cruza apenas o tornozelo. Predominantemente lento (apenas 10-30% fast-twitch), é crucial para resistência e estabilidade. Funciona como um "segundo coração", bombeando sangue de volta pela perna. Assume a carga principal quando o joelho está dobrado.

Tendão de Aquiles
Conecta os músculos da panturrilha ao calcanhar. É um tecido mecânico variável: complacente perto do músculo para protegê-lo, e mais rígido perto do osso.

Músculos Fibulares (Peroneais)
Estabilizam o tornozelo contra inversão (torcer para fora). Após uma entorse, esses músculos frequentemente contraem como mecanismo neuroprotetor, limitando a amplitude de movimento.

Tibial Anterior
Na frente da canela, é o principal dorsiflexor e atua como "freio excêntrico" para absorver impacto e prevenir "foot slap" durante a marcha.`
            },
            {
                id: "fascia",
                content: `Fáscia e Músculos Intrínsecos do Pé

A Conexão Pé-Glúteo:
O corpo opera via "biotensegridade", onde a tensão é contínua. A Linha Posterior Superficial da fáscia conecta a fáscia plantar (base do pé) até os glúteos e cabeça.

O "Interruptor":
Um arco ativo e rígido (às vezes chamado de "HiperArco") funciona como um interruptor neurológico. Ativar o arco através do dedão cria tensão que reflexivamente ativa o glúteo máximo, estabilizando a perna de baixo para cima.

Tensão Neuroprotetora:
Fáscia e músculos podem desenvolver rigidez ("pontos gatilho") como resposta protetora a traumas passados (como uma entorse de tornozelo) ou estresse repetitivo. Esta rigidez altera a biomecânica e deve ser liberada para restaurar opções de movimento.`
            },
            {
                id: "hip-connection",
                content: `A Conexão Quadril-Tornozelo

O quadril e o tornozelo estão intimamente conectados por movimentos acoplados de torção.

Rotação Interna do Quadril:
Crítica para absorção de força. Quando o quadril flexiona (aterrissar um salto, agachar fundo), a cabeça do fêmur deve rotar internamente. Se falta rotação interna, a pessoa não absorve força no quadril, forçando joelho ou lombar a compensar.

Movimentos Acoplados:
• Absorção → quadril rota internamente, tíbia rota internamente, pé prona.
• Propulsão → quadril rota externamente, tíbia rota externamente, pé supina.

O Problema da "Bota de Caminhada":
Se o tornozelo/mediopé está rígido e não consegue supinar ou pronar, isso desorganiza toda a cadeia. Um pé "preso" em pronação pode impedir o joelho e quadril de rotarem externamente para produzir potência. Um arco alto rígido reduz absorção de choque, enviando ondas para joelho e quadril.

Teste da Mesa: Usado para avaliar se o pé permite que o joelho rode para fora (supinar). Se limitado, o atleta fica "preso na absorção" e não consegue transicionar para propulsão eficientemente.`
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 3. COLÁGENO E NUTRIÇÃO
    // ─────────────────────────────────────────────
    {
        id: "collagen-nutrition",
        slug: "colageno-e-nutricao",
        title: "Colágeno e Nutrição",
        subtitle: "O protocolo nutricional que dobra a síntese de colágeno nos seus tendões.",
        icon: "Pill",
        color: "#8B5CF6",
        category: "nutrition",
        readTime: "6 min",
        sections: [
            {
                id: "vitamin-c",
                content: `O Papel da Vitamina C

Vitamina C é um cofator obrigatório para a enzima prolil hidroxilase. Esta enzima é necessária para criar moléculas de colágeno estáveis e exportá-las da célula para a matriz do tendão.

Sem Vitamina C, a síntese de colágeno essencialmente para (semelhante ao escorbuto). É por isso que suplementar com Vitamina C é inegociável para saúde tendínea.`
            },
            {
                id: "baar-protocol",
                content: `O Protocolo Baar-Shaw

Este é o protocolo nutricional gold-standard para tendões, baseado em pesquisa clínica:

Ingestão: Consumir 15g de colágeno hidrolisado (ou gelatina) combinado com 50-500mg de Vitamina C.

Timing: Tomar 30 a 60 minutos ANTES do treino.

Por quê antes? Tendões têm pouca irrigação sanguínea. Eles funcionam como esponjas — o exercício espreme o fluido para fora, e o relaxamento suga fluido para dentro. Ao elevar os aminoácidos no sangue (glicina, prolina) e Vitamina C antes da carga, você garante que o fluido absorvido pelo tendão durante o exercício é rico em nutrientes.

Evidência: Em um ensaio clínico randomizado, este protocolo específico (15g gelatina + Vit C, 1h antes da atividade) resultou em DOBRO da taxa de síntese de colágeno comparado ao exercício sozinho.`
            },
            {
                id: "inflammation",
                content: `O Papel da Inflamação

Contrário à crença popular, inflamação não é inerentemente ruim — é um mecanismo essencial para adaptação e reparo.

Necessária para Crescimento: Inflamação é absolutamente essencial para adaptação. Estudos que bloquearam células inflamatórias mostraram capacidade diminuída de hipertrofiar o músculo.

Carga Mecânica como Anti-inflamatório: Em vez de usar anti-inflamatórios químicos (ibuprofeno, diclofenaco) ou gelo, que podem enfraquecer os tecidos e bloquear a adaptação, a carga mecânica controlada funciona como anti-inflamatório. O movimento "espreme" fluido dos tecidos danificados (como uma esponja), reduzindo inchaço prejudicial enquanto estimula reparo.

Crônica vs. Aguda: Inflamação aguda cura. Inflamação crônica de baixo grau é destrutiva. Esta pode ser agravada por desequilíbrios dietéticos, como alta proporção de Ômega-6 para Ômega-3.`
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 4. ISOMÉTRICOS: A PRIMEIRA LINHA DE DEFESA
    // ─────────────────────────────────────────────
    {
        id: "isometrics-protocol",
        slug: "isometricos",
        title: "Isométricos: Linha de Defesa",
        subtitle: "A ferramenta mais poderosa para alívio de dor e remodelação tendínea.",
        icon: "Shield",
        color: "#10B981",
        category: "protocol",
        readTime: "7 min",
        sections: [
            {
                id: "why-isometrics",
                content: `Por Que Isométricos Funcionam

Exercícios isométricos são críticos por duas razões: Analgesia (alívio de dor) e Relaxamento de Estresse.

O Mecanismo (Stress Relaxation/Creep):
Tendões são viscoelásticos. Quando você faz um movimento rápido (como pular), o tendão age como um lençol rígido, e a carga "desvia" da área danificada.

Durante uma contração isométrica longa, o músculo encurta enquanto o tendão lentamente se alonga (creep). Isso causa o relaxamento das fibras saudáveis, forçando a carga a viajar através da área danificada/lesionada, fornecendo o sinal mecânico necessário para reparo.`
            },
            {
                id: "isometric-protocol",
                content: `Protocolo Isométrico para Tendões

Intensidade: Pesada, aproximadamente 70-80% da Contração Voluntária Máxima (CVM).

Duração: 30 a 45 segundos. Pesquisas indicam que o relaxamento de estresse do tendão se maximiza em torno de 30 segundos.

Volume: 3 a 5 séries com 2 minutos de descanso entre séries.

Frequência: Pode ser feito diariamente ou duas vezes ao dia para alívio de dor e remodelação.`
            },
            {
                id: "ballistic-iso",
                content: `Isométricos Balísticos para Velocidade

"Isométricos balísticos" (empurrar contra um objeto imóvel por durações muito curtas) treinam o sistema nervoso a recrutar unidades motoras rapidamente, melhorando a Taxa de Desenvolvimento de Força (RFD) para sprint.

O Treino de 72 Segundos:
Um protocolo minimalista para saúde/força tendínea usando isométricos de superação máxima (empurrar contra objeto imóvel).

Protocolo: 3 séries de 3 repetições, segurando por 4 segundos em esforço máximo.

Total = 36 segundos de trabalho real. Máximo retorno com investimento mínimo de tempo.`
            },
            {
                id: "exercises",
                content: `Exercícios Isométricos Chave

Ankle Iso Push: Empurrar a bola do pé contra um objeto imóvel (como uma barra carregada no rack) com esforço máximo por 3-5 segundos. Constrói produção de força máxima e rigidez.

Elevação de Panturrilha Isométrica: Segurar a posição de elevação (perna única) por 30-45 segundos. Usado para remodelação tendínea e alívio de dor.

Spanish Squat Isométrico: Segurando com faixas para estabilizar os joelhos, manter posição agachada. Alvo no tendão patelar.`
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 5. SISTEMA NERVOSO CENTRAL (SNC)
    // ─────────────────────────────────────────────
    {
        id: "cns-optimization",
        slug: "sistema-nervoso-central",
        title: "SNC e Performance",
        subtitle: "Como o sistema nervoso central comanda a força, velocidade e potência.",
        icon: "Zap",
        color: "#F59E0B",
        category: "science",
        readTime: "9 min",
        sections: [
            {
                id: "neural-drive",
                content: `Drive Neural e Codificação de Taxa

O Sistema Nervoso Central (SNC) — cérebro e medula espinhal — inicia todo movimento voluntário. Para contrair um músculo, o córtex motor gera um sinal elétrico (potencial de ação) que viaja pela medula e nervos até o músculo.

A força de uma contração muscular não é determinada pelo tamanho do sinal, mas pela frequência dos sinais enviados. Isso é a Codificação de Taxa (Rate Coding).

Uma pessoa média envia ~50 potenciais de ação por segundo. Um atleta de elite pode enviar perto de 100 por segundo. Essa frequência alta permite contrações mais rápidas e poderosas.

Fadiga do SNC: É uma redução na produção de força muscular devido à diminuição do input neural, não apenas cansaço muscular. Quando o SNC está fatigado, o atleta pode dar 100% de esforço mas produzir apenas 90% do output potencial.`
            },
            {
                id: "motor-recruitment",
                content: `Recrutamento de Unidades Motoras

Músculos são compostos por unidades motoras (um nervo e as fibras que inerva).

Princípio do Tamanho de Henneman:
O corpo recruta unidades pequenas (slow-twitch) primeiro para tarefas leves. Conforme a demanda aumenta, unidades motoras maiores (fast-twitch) são recrutadas.

Recrutamento Seletivo: Atletas altamente treinados em potência podem "pular" essa ordem, ativando fibras fast-twitch quase imediatamente para movimentos explosivos.

Princípio "Tudo ou Nada": Quando um nervo dispara, cada fibra naquela unidade motora contrai. Para recrutar todas as fibras, especialmente as de alta threshold, atletas devem levantar cargas pesadas até a falha OU mover cargas leves com INTENÇÃO MÁXIMA.`
            },
            {
                id: "rfd",
                content: `Taxa de Desenvolvimento de Força (RFD)

RFD é a capacidade de gerar força rapidamente. É crítica porque movimentos esportivos ocorrem rápido demais para o corpo gerar força máxima.

A Restrição de Tempo:
Leva 0.75 a 3.0 segundos para gerar força máxima. Mas o contato com o solo no sprint (velocidade máxima) é ~0.1 segundo, e na aceleração ~0.2 segundos.

Implicação: Como não há tempo para produzir força máxima em movimentos rápidos, o treino deve focar em produzir o máximo de força possível na menor janela de tempo.

Colágeno e Rigidez: Tendões mais rígidos, melhorados por cargas pesadas e suplementação específica (como colágeno hidrolisado), contribuem para RFD mais rápida ao transmitir força do músculo ao osso mais eficientemente.`
            },
            {
                id: "power",
                content: `Potência e Treino Explosivo

Potência = Força × Velocidade. Para maximizar potência, atletas frequentemente treinam com cargas submáximas movidas em velocidade máxima.

Esforço Dinâmico: Mover 60-70% de 1RM o mais rápido possível para trabalhar o sistema nervoso sem fadiga excessiva.

Intenção: Mover a barra com velocidade máxima (intenção) produz output de potência significativamente maior (637 watts vs. 228 watts) do que levantar complacentemente.

Potenciação Pós-Ativação (PAP): Realizar um levantamento pesado (alto recrutamento neuromuscular) imediatamente antes de um movimento explosivo (como um salto) "acelera" o sistema nervoso, permitindo maior output de potência no segundo movimento.`
            },
            {
                id: "high-low",
                content: `Modelo de Treino Alta/Baixa do SNC

Para gerenciar fadiga neural, atletas de elite frequentemente alternam:

Dias ALTO SNC:
• Sprints (>95% esforço)
• Levantamentos pesados
• Pliometria intensiva

Dias BAIXO SNC:
• Corridas tempo
• Pliometria extensiva
• Mobilidade e trabalho aeróbico

Isso garante que o sistema nervoso se recupere completamente entre sessões de alta produção, preservando a qualidade do treino.`
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 6. DOR BOA vs DOR RUIM
    // ─────────────────────────────────────────────
    {
        id: "pain-management",
        slug: "dor-boa-vs-dor-ruim",
        title: "Dor Boa vs Dor Ruim",
        subtitle: "Aprenda a interpretar os sinais do seu corpo corretamente.",
        icon: "HeartPulse",
        color: "#EF4444",
        category: "safety",
        readTime: "5 min",
        sections: [
            {
                id: "acceptable-pain",
                content: `Dor Aceitável no Treino

Dor durante o exercício é permitida se permanecer abaixo de 3-4/10 na escala de dor E não resultar em perda de função.

Use esta escala:
0 = Sem dor
1-3 = Desconforto leve, aceitável
4-5 = Moderada, reduza a carga
6-7 = Significativa, pare e modifique
8-10 = Severa, pare imediatamente

A regra de ouro: Se a dor altera o padrão de movimento (você começa a mancar ou compensar), a carga é excessiva.`
            },
            {
                id: "24h-test",
                content: `O Teste de 24 Horas (Latência)

Tendões têm uma resposta latente à carga. Você pode se sentir bem durante o treino mas experienciar uma "crise" no dia seguinte.

✅ Sinal BOM: A dor retorna ao nível base em 24 horas. Isso indica que o tendão está se adaptando à carga aplicada.

❌ Sinal RUIM: Dor ou rigidez é PIOR 24 horas após a sessão. Isso indica que a carga excedeu a capacidade do tendão.

Ação: Se a dor base aumentou, reduza a carga na próxima sessão. Se a dor base está estável, mantenha ou aumente levemente a carga.`
            },
            {
                id: "stop-signs",
                content: `Quando Parar Imediatamente

Pare o exercício e procure avaliação profissional se experienciar:

• Dor aguda e repentina (sensação de "estalo")
• Inchaço rápido e significativo
• Incapacidade de suportar peso
• Dor que piora progressivamente durante o exercício
• Dormência ou formigamento
• Dor noturna que impede o sono
• Dor que persiste acima de 5/10 por mais de 48 horas após treino

Lembre: A diferença entre adaptação e lesão é frequentemente uma questão de dosagem, não do exercício em si.`
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 7. PROGRESSÃO INTELIGENTE
    // ─────────────────────────────────────────────
    {
        id: "smart-progression",
        slug: "progressao-inteligente",
        title: "Progressão Inteligente",
        subtitle: "A ciência por trás de quando avançar, manter ou recuar.",
        icon: "TrendingUp",
        color: "#10B981",
        category: "protocol",
        readTime: "8 min",
        sections: [
            {
                id: "overload",
                content: `Sobrecarga Progressiva

O princípio fundamental do treino é que o exercício em si NÃO é anabólico (construtor) — é um estressor catabólico. O treinamento induz fadiga, dano tecidual, estresse metabólico e depleção de reservas energéticas.

A adaptação ocorre DEPOIS do treino, durante a fase de recuperação.

Supercompensação é o processo fisiológico onde o corpo, após se recuperar de um estressor, retorna a um nível de aptidão SUPERIOR ao baseline inicial.

Se o próximo estímulo ocorre durante o pico de supercompensação → performance melhora.
Se o estímulo chega cedo demais → risco de overtraining.
Se chega tarde demais → a adaptação regride.`
            },
            {
                id: "10-percent-rule",
                content: `A Regra dos 10%

Para evitar lesões (especialmente lesões por estresse ósseo e canelite), a carga total de trabalho não deve aumentar mais que 10% semana a semana.

Para Tendões Especificamente:
Tendões se adaptam diferentemente dos músculos. Para fortalecer tendões (rigidez) e estimular síntese de colágeno, são necessárias:
• Cargas pesadas (acima de 70% de intensidade)
• Isométricos mantidos por ~30 segundos para induzir creep viscoelástico
• Sessões curtas de 10 minutos de carga focada, duas vezes ao dia`
            },
            {
                id: "hsr",
                content: `Resistência Lenta Pesada (Heavy Slow Resistance)

Depois de gerenciar a dor com isométricos, o tendão precisa ser carregado para construir rigidez e capacidade de armazenar energia.

Por quê: Movimentos rápidos aumentam rigidez mas podem criar tendões frágeis se não balanceados. Movimentos lentos e pesados quebram crosslinks na junção músculo-tendão, melhorando complacência e saúde.

Protocolo:
• 3-4 séries de 6-15 repetições
• 3 segundos excêntrico (descida) / 3 segundos concêntrico (subida)
• Maximiza o tempo sob tensão

Progressão: Comece com cargas de 15RM e progrida ao longo de 12 semanas para cargas de 6RM mais pesadas.

BFR (Restrição de Fluxo Sanguíneo): Para quem não tolera cargas pesadas (ex: pós-cirurgia), BFR permite hipertrofia e adaptações tendíneas usando 20-30% de 1RM criando estresse metabólico.`
            },
            {
                id: "deload",
                content: `Deload e Recuperação

Deloading é uma redução planejada no estresse de treino para permitir que a fadiga se dissipe e adaptações se manifestem.

Implementação: Uma semana de deload geralmente envolve queda de 15-20% em intensidade ou volume.

Taxas de Dissipação das Adaptações:
• Aeróbico/Força: Longa duração. Pode manter por ~30 dias sem treinar.
• Capacidade Anaeróbia: Dura ~18 dias.
• Velocidade Máxima: Regride muito rápido, frequentemente em 5 dias.
• Fadiga: Se dissipa mais rápido que fitness. Tapering permite que a fadiga caia enquanto fitness permanece, revelando performance de pico.

Dose Mínima Efetiva: Profissionais buscam estimular adaptação com a dose mínima necessária, em vez de destruir o corpo. Para manter força, apenas uma série pesada por semana pode bastar em períodos de estresse.`
            },
            {
                id: "overtraining",
                content: `Sinais de Overtraining

Sinais de Sobrecarga Não-Funcional:
• Fadiga persistente durando semanas a meses
• Diminuição de performance (ex: queda no salto vertical durando >72h)
• Frequência cardíaca de repouso elevada e HRV diminuída
• Distúrbios de humor e problemas de sono

Evite "Volume Lixo": Uma causa comum de fadiga é o volume excessivo de intensidade moderada que fatiga o corpo sem direcionar adaptação específica.

Teste de Prontidão: Métricas objetivas como HRV, força de preensão ou altura do salto vertical podem rastrear prontidão. Queda >10% na altura do salto ou na força de preensão indica fadiga significativa do SNC.`
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 8. AQUECIMENTO E PREPARAÇÃO
    // ─────────────────────────────────────────────
    {
        id: "warmup-preparation",
        slug: "aquecimento-e-preparacao",
        title: "Aquecimento e Preparação",
        subtitle: "A ciência da preparação de movimento e ativação pré-treino.",
        icon: "Flame",
        color: "#F97316",
        category: "protocol",
        readTime: "7 min",
        sections: [
            {
                id: "modern-warmup",
                content: `A Ciência do Aquecimento Moderno

Preparação de movimento moderna foca em:
1. Elevar a temperatura corporal para otimizar função enzimática
2. Mobilizar articulações através de amplitudes ativas
3. Ativar e preparar o sistema nervoso sem fatigá-lo

O Período Refratário do Tecido Conectivo:
Tecidos conectivos (tendões, ligamentos, cartilagem, osso) param de responder ao estímulo de exercício após cerca de 5-10 minutos. Carga continuada além desse prazo resulta em desgaste sem mais sinalização anabólica.

Portanto, a dose mínima efetiva de 5-10 minutos de carga direcionada é ótima para saúde do tecido conectivo.`
            },
            {
                id: "static-vs-dynamic",
                content: `Estático vs. Dinâmico/Isométrico

Alongamento estático antes de atividades de potência é geralmente desaconselhado porque pode:

• Anular os fusos musculares e Órgãos Tendinosos de Golgi (OTGs)
• Amortecer o arco reflexo espinhal necessário para movimentos explosivos reativos
• Potencialmente aumentar risco de lesão

Por outro lado, isométricos e movimentos dinâmicos mantêm a rigidez necessária e capacidade reflexiva.

A ativação do SNC deve ser progressiva: aumentando gradualmente a velocidade e intensidade dos sinais neurais durante o aquecimento.`
            },
            {
                id: "ramping",
                content: `Séries de Rampa e Sequências de Ativação

Séries de Rampa:
Em vez de séries estáticas (3 séries de 10 no mesmo peso), rampa envolve aumentar progressivamente a intensidade. Para saltos/sprints, pode parecer esforços a 40%, 60%, 80% e finalmente 100%.

Isso prepara gradualmente as vias neurais e protege tecidos de picos repentinos de carga.

Potenciação Pós-Ativação (PAP): Um movimento de força pesado (ex: terra barra hexagonal pesada) é seguido imediatamente por um movimento explosivo similar (ex: salto vertical). O levantamento pesado "acelera" o sistema nervoso, permitindo um salto mais explosivo subsequente.

Ativação Corretiva:
Em vez de exercícios de cadeia aberta (clamshells), atletas devem usar drills como torção de membro inferior onde o pé está ancorado e o quadril rota. Isso integra ativação glútea com mecânica adequada do pé (pronação/supinação).`
            },
            {
                id: "tissue-quality",
                content: `Qualidade Tecidual e Liberação Miofascial

Como a Liberação Miofascial Funciona:
NÃO é "quebrando" tecido cicatricial com um rolo de espuma. Funciona alterando o input do sistema nervoso para o músculo.

"Rigidez" frequentemente é tensão neuroprotetora — o corpo protegendo uma área devido a trauma passado ou ameaça percebida. Comprimir o tecido (rolo de espuma) estimula mecanorreceptores, sinalizando o cérebro para reduzir tônus e permitir relaxamento muscular.

Creep Viscoelástico: Durante holds longos ou carga lenta, água é espremida do tecido (como uma esponja), e após relaxamento, fluido rico em nutrientes é sugado de volta. Este processo reduz rigidez na unidade músculo-tendão e estimula reparo de colágeno.

Orientação Tecidual: Às vezes músculos parecem "tensos" não porque são curtos, mas porque estão "longos e esticados" (orientação excêntrica). Alongar mais é contraproducente — a solução é reposicionar para restaurar relação comprimento-tensão neutra.`
            },
        ],
    },
];

export const categoryLabels: Record<ManualArticle["category"], string> = {
    science: "Ciência",
    protocol: "Protocolo",
    safety: "Segurança",
    nutrition: "Nutrição",
};

export const categoryColors: Record<ManualArticle["category"], string> = {
    science: "#3B82F6",
    protocol: "#10B981",
    safety: "#EF4444",
    nutrition: "#8B5CF6",
};
