"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { TrendingUp, Calendar, Zap, AlertCircle, Flame } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CultivationCard } from "@/components/ui/cultivation-progress";

export default function ProgressPage() {
  const { streak, bestStreak, currentStageId, lastSession, totalSessions, totalXp, actions } = useAppStore();

  const lastWorkoutDate = lastSession
    ? format(new Date(lastSession), "d 'de' MMMM", { locale: ptBR })
    : "Nenhum";

  const inProvacao = actions.isInProvacao();
  const provacaoProgress = actions.getProvacaoProgress();

  return (
    <div className="space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-semibold font-heading text-white tracking-tight">PROGRESSO</h1>
        <p className="text-xs text-[#A3A3A3] uppercase tracking-widest">Sua Jornada</p>
      </header>

      <CultivationCard />

      {/* Streak Card */}
      <Card className="border-[#10B981]/30">
        <CardContent className="p-6 flex items-center justify-between">
           <div>
              <div className="text-xs text-[#A3A3A3] uppercase tracking-widest mb-1">Sequencia Atual</div>
              <div className="text-4xl font-extrabold font-heading text-[#10B981]">{streak} <span className="text-sm font-normal text-[#A3A3A3]">dias</span></div>
           </div>
           <div className="neu-inset p-3 rounded-full">
             <TrendingUp className="h-8 w-8 text-[#10B981]/50" />
           </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
             <div className="flex items-center gap-2 mb-2 text-[#A3A3A3]">
               <Zap className="h-4 w-4" /> <span className="text-[10px] uppercase font-semibold font-heading">XP Total</span>
             </div>
             <div className="text-2xl font-semibold font-heading text-[#10B981]">{totalXp}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
             <div className="flex items-center gap-2 mb-2 text-[#A3A3A3]">
               <Calendar className="h-4 w-4" /> <span className="text-[10px] uppercase font-semibold font-heading">Sessoes</span>
             </div>
             <div className="text-2xl font-semibold font-heading text-white">{totalSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
             <div className="flex items-center gap-2 mb-2 text-[#A3A3A3]">
               <Flame className="h-4 w-4" /> <span className="text-[10px] uppercase font-semibold font-heading">Melhor Streak</span>
             </div>
             <div className="text-2xl font-semibold font-heading text-amber-500">{bestStreak}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
             <div className="flex items-center gap-2 mb-2 text-[#A3A3A3]">
               <Calendar className="h-4 w-4" /> <span className="text-[10px] uppercase font-semibold font-heading">Ultimo Treino</span>
             </div>
             <div className="text-sm font-semibold font-heading text-white">{lastWorkoutDate}</div>
          </CardContent>
        </Card>
      </div>

      {/* Provacao Status */}
      {inProvacao && (
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-widest text-red-400 flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Semana da Provacao
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               <div className="flex justify-between text-sm">
                  <span className="text-white">Dia {provacaoProgress.currentDay} de 7</span>
                  <span className="text-red-400 font-semibold">{Math.round((provacaoProgress.currentDay / 7) * 100)}%</span>
               </div>
               <div className="w-full neu-inset h-3 rounded-full overflow-hidden">
                  <div
                    className="gradient-danger h-full transition-all duration-500 rounded-full"
                    style={{ width: `${(provacaoProgress.currentDay / 7) * 100}%` }}
                  />
               </div>
               <p className="text-xs text-red-300/80 neu-inset p-3 rounded-xl border border-red-500/20">
                 <AlertCircle className="h-3 w-3 inline mr-1" />
                 Complete 7 dias consecutivos de treino para concluir a Provacao e avancar para o Estagio 1.
               </p>
             </div>
          </CardContent>
        </Card>
      )}

      {/* Level Info (after Provacao) */}
      {!inProvacao && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-widest text-[#A3A3A3]">
              Estagio Atual: {currentStageId}
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               <p className="text-xs text-[#A3A3A3] neu-inset p-3 rounded-xl">
                 <AlertCircle className="h-3 w-3 inline mr-1" />
                 Continue treinando para acumular XP e subir de estagio.
               </p>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
