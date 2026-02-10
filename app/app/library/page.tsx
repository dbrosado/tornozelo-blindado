"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { getStageById, REALMS, CULTIVATION_STAGES } from "@/lib/data/cultivation-system";
import { LEVELS as WORKOUT_LEVELS, getWorkoutByLevel } from "@/lib/data/workouts";
import { cn } from "@/lib/utils";
import { Lock, ChevronRight, Unlock, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function LibraryPage() {
  const router = useRouter();
  const { currentStageId, actions } = useAppStore();
  const [expandedRealm, setExpandedRealm] = useState<number | null>(null);
  const [overrideMode, setOverrideMode] = useState(false);

  const handleStageClick = (stageId: number) => {
    if (stageId <= currentStageId || overrideMode) {
      if (overrideMode) {
        actions.forceUnlockStage(stageId);
        useAppStore.setState({ currentStageId: stageId });
      }
      router.push('/app/today');
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold font-heading text-white tracking-tight">BIBLIOTECA</h1>
          <p className="text-xs text-[#A3A3A3] uppercase tracking-widest">Explorar Estagios</p>
        </div>
        <Button
          variant={overrideMode ? "default" : "ghost"}
          size="sm"
          onClick={() => setOverrideMode(!overrideMode)}
          className="text-xs"
        >
          {overrideMode ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
          {overrideMode ? "Livre" : "Normal"}
        </Button>
      </header>

      {REALMS.map((realm, realmIdx) => {
        const stages = realm.stages.map(sId => getStageById(sId));
        const isExpanded = expandedRealm === realmIdx;

        return (
          <Card key={realm.name} className={cn("overflow-hidden", isExpanded && "border-[#10B981]/30")}>
            <button
              className="w-full text-left p-5 flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedRealm(isExpanded ? null : realmIdx)}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-xl", isExpanded ? "gradient-primary" : "neu-inset")}>
                  <Layers className={cn("h-5 w-5", isExpanded ? "text-[#0A0A0A]" : "text-[#A3A3A3]")} />
                </div>
                <div>
                  <h3 className={cn("font-heading font-semibold text-sm", realm.color)}>{realm.name}</h3>
                  <p className="text-[10px] text-[#666666] uppercase tracking-wider">
                    {stages.length} estagios
                  </p>
                </div>
              </div>
              <ChevronRight className={cn(
                "h-5 w-5 text-[#A3A3A3] transition-transform duration-300",
                isExpanded && "rotate-90 text-[#10B981]"
              )} />
            </button>

            {isExpanded && (
              <CardContent className="space-y-2 pb-4">
                {stages.map((stage, i) => {
                  const isUnlocked = stage.id <= currentStageId || overrideMode;
                  const isCurrent = stage.id === currentStageId;
                  const workout = stage.id < WORKOUT_LEVELS.length ? getWorkoutByLevel(stage.id) : null;

                  return (
                    <motion.button
                      key={stage.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleStageClick(stage.id)}
                      disabled={!isUnlocked}
                      className={cn(
                        "w-full flex items-center gap-3 p-4 rounded-[14px] text-left transition-all cursor-pointer",
                        isUnlocked
                          ? isCurrent
                            ? "neu-card border-[#10B981]/30"
                            : "neu-button"
                          : "bg-[#0A0A0A]/50 opacity-40 cursor-not-allowed",
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-heading font-bold shrink-0",
                        isCurrent ? "gradient-primary text-[#0A0A0A]" : isUnlocked ? "neu-inset text-[#A3A3A3]" : "bg-[#0A0A0A] text-[#333333]"
                      )}>
                        {isUnlocked ? stage.emoji : <Lock className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-heading font-semibold text-sm truncate",
                          isCurrent ? "text-[#10B981]" : isUnlocked ? "text-white" : "text-[#666666]"
                        )}>
                          {stage.name}
                        </p>
                        {workout && isUnlocked && (
                          <p className="text-[10px] text-[#666666] truncate">
                            {workout.exercises.length} exercicios - {workout.duration} min
                          </p>
                        )}
                        {!isUnlocked && (
                          <p className="text-[10px] text-[#444444]">
                            Requer estagio {stage.id}
                          </p>
                        )}
                      </div>
                      {isUnlocked && <ChevronRight className="h-4 w-4 text-[#A3A3A3] shrink-0" />}
                    </motion.button>
                  );
                })}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
