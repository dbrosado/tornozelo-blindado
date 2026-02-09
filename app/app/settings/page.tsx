"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { Trash2, Upload, Download, X, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const { currentStageId } = useAppStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const executeReset = () => {
    // Clear all localStorage
    localStorage.removeItem('last_workout_time');
    localStorage.removeItem('tornozelo-cultivation-storage');
    localStorage.clear();
    
    // Redirect to home
    window.location.href = '/app/today';
  };

  return (
    <div className="space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold font-chakra text-white tracking-tight">AJUSTES</h1>
        <p className="text-xs text-text-muted uppercase tracking-widest">Controle Total</p>
      </header>

      <Card className="bg-blueprint/20 border-grid">
        <CardHeader>
          <CardTitle className="text-white">Geral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-grid/50">
            <span className="text-sm text-text-muted">Tema Escuro</span>
            <span className="text-xs font-bold text-primary uppercase">Ativo</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-grid/50">
            <span className="text-sm text-text-muted">Nível Atual</span>
            <span className="text-xs font-bold text-white uppercase">Estágio {currentStageId}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blueprint/20 border-grid">
        <CardHeader>
          <CardTitle className="text-white">Dados (Offline)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="border-grid text-text-muted hover:bg-grid/20">
            <Upload className="h-4 w-4 mr-2" /> Exportar
          </Button>
          <Button variant="outline" className="border-grid text-text-muted hover:bg-grid/20">
            <Download className="h-4 w-4 mr-2" /> Importar
          </Button>
        </CardContent>
      </Card>

      <Card className="border-danger/30 bg-danger/5">
        <CardHeader>
          <CardTitle className="text-danger flex items-center gap-2">
            <Trash2 className="h-4 w-4" /> Zona de Perigo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <button 
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="w-full h-12 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            RESETAR TODO PROGRESSO
          </button>
          <p className="text-[10px] text-text-muted mt-3 text-center uppercase tracking-wider">
            Esta ação é irreversível.
          </p>
        </CardContent>
      </Card>

      <div className="text-center pt-8">
        <p className="text-[10px] text-text-muted/50 uppercase tracking-widest font-mono">
          Tornozelo Blindado v1.0.0 (MVP)
        </p>
      </div>

      {/* Custom Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-carbon border border-danger/30 rounded-2xl p-6 max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-danger/20 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-danger" />
                </div>
                <h3 className="text-lg font-bold text-white font-chakra">ATENÇÃO</h3>
              </div>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="p-1 text-text-muted hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-text-muted text-sm">
              Isso apagará <strong className="text-white">todo o seu histórico</strong> e recomeçará do Nível 1.
            </p>
            <p className="text-danger text-xs font-bold uppercase">
              Esta ação é irreversível!
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 h-12 px-4 bg-grid/30 hover:bg-grid/50 text-white font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={executeReset}
                className="flex-1 h-12 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
              >
                RESETAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
