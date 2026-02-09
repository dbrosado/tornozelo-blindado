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
        <h1 className="text-2xl font-bold font-chakra text-white tracking-tight">PROGRESSO</h1>
        <p className="text-xs text-text-muted uppercase tracking-widest">Sua Jornada</p>
      </header>

      {/* Cultivation Card */}
      <CultivationCard />

      {/* Streak Card */}
      <Card className="bg-blueprint/20 border-primary/30">
        <CardContent className="p-6 flex items-center justify-between">
           <div>
              <div className="text-xs text-text-muted uppercase tracking-widest mb-1">Sequência Atual</div>
              <div className="text-4xl font-black font-chakra text-primary">{streak} <span className="text-sm font-normal text-text-muted">dias</span></div>
           </div>
           <TrendingUp className="h-10 w-10 text-primary/50" />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blueprint/20 border-grid">
          <CardContent className="p-4">
             <div className="flex items-center gap-2 mb-2 text-text-muted">
               <Zap className="h-4 w-4" /> <span className="text-[10px] uppercase font-bold">XP Total</span>
             </div>
             <div className="text-2xl font-bold font-chakra text-primary">{totalXp}</div>
          </CardContent>
        </Card>
        <Card className="bg-blueprint/20 border-grid">
          <CardContent className="p-4">
             <div className="flex items-center gap-2 mb-2 text-text-muted">
               <Calendar className="h-4 w-4" /> <span className="text-[10px] uppercase font-bold">Sessões</span>
             </div>
             <div className="text-2xl font-bold font-chakra text-white">{totalSessions}</div>
          </CardContent>
        </Card>
        <Card className="bg-blueprint/20 border-grid">
          <CardContent className="p-4">
             <div className="flex items-center gap-2 mb-2 text-text-muted">
               <Flame className="h-4 w-4" /> <span className="text-[10px] uppercase font-bold">Melhor Streak</span>
             </div>
             <div className="text-2xl font-bold font-chakra text-warning">{bestStreak}</div>
          </CardContent>
        </Card>
        <Card className="bg-blueprint/20 border-grid">
          <CardContent className="p-4">
             <div className="flex items-center gap-2 mb-2 text-text-muted">
               <Calendar className="h-4 w-4" /> <span className="text-[10px] uppercase font-bold">Último Treino</span>
             </div>
             <div className="text-sm font-bold font-chakra text-white">{lastWorkoutDate}</div>
          </CardContent>
        </Card>
      </div>

      {/* Provação Status */}
      {inProvacao && (
        <Card className="bg-gradient-to-br from-red-950/50 to-orange-950/30 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-widest text-red-400 flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Semana da Provação
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               <div className="flex justify-between text-sm">
                  <span className="text-white">Dia {provacaoProgress.currentDay} de 7</span>
                  <span className="text-red-400 font-bold">{Math.round((provacaoProgress.currentDay / 7) * 100)}%</span>
               </div>
               <div className="w-full bg-grid/30 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-500"
                    style={{ width: `${(provacaoProgress.currentDay / 7) * 100}%` }}
                  />
               </div>
               <p className="text-xs text-red-300/80 bg-red-950/50 p-3 rounded border border-red-500/20">
                 <AlertCircle className="h-3 w-3 inline mr-1" />
                 Complete 7 dias consecutivos de treino para concluir a Provação e avançar para o Estágio 1.
               </p>
             </div>
          </CardContent>
        </Card>
      )}

      {/* Level Info (after Provação) */}
      {!inProvacao && (
        <Card className="bg-blueprint/20 border-grid">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-widest text-text-muted">
              Estágio Atual: {currentStageId}
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               <p className="text-xs text-text-muted bg-blueprint/50 p-3 rounded border border-grid/50">
                 <AlertCircle className="h-3 w-3 inline mr-1" />
                 Continue treinando para acumular XP e subir de estágio.
               </p>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
