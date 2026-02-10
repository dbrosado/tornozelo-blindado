"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { Download, Upload, Trash2, AlertTriangle } from "lucide-react";

type AppSnapshot = ReturnType<typeof useAppStore.getState>;
type PersistedBackup = Pick<
  AppSnapshot,
  | "startDate"
  | "currentStageId"
  | "currentXp"
  | "totalXp"
  | "unlockedStages"
  | "streak"
  | "bestStreak"
  | "totalSessions"
  | "lastSession"
  | "postWorkoutRatings"
  | "readiness"
  | "audioMode"
>;

const MAX_BACKUP_FILE_SIZE_BYTES = 1024 * 1024;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isPostWorkoutRating(
  value: unknown
): value is AppSnapshot["postWorkoutRatings"][number] {
  if (!value || typeof value !== "object") return false;

  const rating = value as Record<string, unknown>;

  return (
    typeof rating.date === "string" &&
    (rating.difficulty === 1 || rating.difficulty === 2 || rating.difficulty === 3) &&
    isFiniteNumber(rating.painLevel) &&
    isFiniteNumber(rating.stability) &&
    isFiniteNumber(rating.xpEarned) &&
    isFiniteNumber(rating.stageId) &&
    isFiniteNumber(rating.exercisesCompleted) &&
    isFiniteNumber(rating.totalExercises)
  );
}

function sanitizeBackup(raw: unknown): PersistedBackup | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const data = raw as Record<string, unknown>;
  const readinessData =
    data.readiness && typeof data.readiness === "object"
      ? (data.readiness as Record<string, unknown>)
      : {};

  const unreadinessStatus = readinessData.status;
  const readinessStatus =
    unreadinessStatus === "green" || unreadinessStatus === "yellow" || unreadinessStatus === "red"
      ? unreadinessStatus
      : null;

  const unlockedStages = Array.isArray(data.unlockedStages)
    ? data.unlockedStages
      .filter((stage): stage is number => Number.isInteger(stage) && stage >= 0)
      .sort((a, b) => a - b)
    : [0];

  const postWorkoutRatings = Array.isArray(data.postWorkoutRatings)
    ? data.postWorkoutRatings.filter(isPostWorkoutRating)
    : [];

  const currentStageId = isFiniteNumber(data.currentStageId)
    ? Math.max(0, Math.trunc(data.currentStageId))
    : 0;

  return {
    startDate: typeof data.startDate === "string" ? data.startDate : null,
    currentStageId,
    currentXp: isFiniteNumber(data.currentXp) ? Math.max(0, data.currentXp) : 0,
    totalXp: isFiniteNumber(data.totalXp) ? Math.max(0, data.totalXp) : 0,
    unlockedStages: unlockedStages.length > 0 ? unlockedStages : [0],
    streak: isFiniteNumber(data.streak) ? Math.max(0, Math.trunc(data.streak)) : 0,
    bestStreak: isFiniteNumber(data.bestStreak) ? Math.max(0, Math.trunc(data.bestStreak)) : 0,
    totalSessions: isFiniteNumber(data.totalSessions) ? Math.max(0, Math.trunc(data.totalSessions)) : 0,
    lastSession: typeof data.lastSession === "string" ? data.lastSession : null,
    postWorkoutRatings,
    readiness: {
      status: readinessStatus,
      checkInDate: typeof readinessData.checkInDate === "string" ? readinessData.checkInDate : null,
    },
    audioMode: data.audioMode === "timer" ? "timer" : "voice",
  };
}

export default function SettingsPage() {
  const { actions } = useAppStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleExport = () => {
    try {
      const state = useAppStore.getState();
      const backup: PersistedBackup = {
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
        audioMode: state.audioMode,
      };

      const data = JSON.stringify(backup, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tornozelo-blindado-backup.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Nao foi possivel exportar os dados agora.");
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (file.size > MAX_BACKUP_FILE_SIZE_BYTES) {
        alert("Arquivo muito grande. Use um backup de ate 1MB.");
        return;
      }

      const reader = new FileReader();

      reader.onerror = () => {
        alert("Erro ao ler arquivo de backup.");
      };

      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content !== "string") {
          alert("Arquivo invalido. Tente outro backup.");
          return;
        }

        try {
          const data = JSON.parse(content);
          const sanitized = sanitizeBackup(data);
          if (!sanitized) {
            alert("Backup invalido. Estrutura de dados nao reconhecida.");
            return;
          }

          useAppStore.setState(sanitized);
          alert("Dados importados com sucesso!");
        } catch {
          alert("Erro ao importar dados. Verifique o arquivo.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (confirmText !== "RESETAR") return;
    actions.resetProgress();
    setShowConfirm(false);
    setConfirmText("");
    alert("Progresso resetado.");
  };

  return (
    <div className="space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-semibold font-heading text-white tracking-tight">AJUSTES</h1>
        <p className="text-xs text-[#A3A3A3] uppercase tracking-widest">Configuracoes do App</p>
      </header>

      {/* Data Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase text-[#A3A3A3]">Dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" fullWidth onClick={handleExport} className="justify-start gap-3">
            <Download className="h-4 w-4 text-[#10B981]" /> Exportar Dados
          </Button>
          <Button variant="outline" fullWidth onClick={handleImport} className="justify-start gap-3">
            <Upload className="h-4 w-4 text-[#3B82F6]" /> Importar Dados
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/30">
        <CardHeader>
          <CardTitle className="text-sm uppercase text-red-500 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Zona Perigosa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showConfirm ? (
            <Button variant="destructive" fullWidth onClick={() => setShowConfirm(true)} className="gap-2">
              <Trash2 className="h-4 w-4" /> Resetar Todo Progresso
            </Button>
          ) : (
            <div className="space-y-4 modal-content">
              <div className="neu-inset p-4 rounded-xl border border-red-500/20">
                <p className="text-xs text-red-300 text-center mb-3">
                  <strong>ACAO IRREVERSIVEL</strong><br />
                  Todos os dados serao apagados permanentemente. Digite RESETAR para confirmar.
                </p>
                <input
                  type="text"
                  placeholder="RESETAR"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  className="w-full h-12 px-4 bg-[#0A0A0A] border border-red-500/30 rounded-[14px] text-white text-center font-heading font-semibold uppercase placeholder:text-red-500/30 focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => { setShowConfirm(false); setConfirmText(""); }}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  disabled={confirmText !== "RESETAR"}
                  onClick={handleReset}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* App Info */}
      <div className="text-center space-y-1">
        <p className="text-xs text-[#666666]">Tornozelo Blindado</p>
        <p className="text-[10px] text-[#444444]">Protocolo de Reabilitacao</p>
      </div>
    </div>
  );
}
