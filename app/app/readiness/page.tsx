"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { calculateReadiness } from "@/lib/readiness";
import { CheckCircle, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";

interface RangeInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  max?: number;
}

function RangeInput({ value, onChange, label, max = 10 }: RangeInputProps) {
  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between items-end">
        <label className="text-sm font-bold uppercase tracking-widest text-text-muted">{label}</label>
        <span className="text-4xl font-black font-chakra text-primary">{value}</span>
      </div>
      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-3 bg-grid rounded-lg appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-[10px] text-text-muted uppercase">
        <span>Sem {label}</span>
        <span>Extremo</span>
      </div>
    </div>
  );
}

export default function ReadinessPage() {
  const router = useRouter();
  const { setReadiness } = useAppStore();
  const [step, setStep] = useState(1);
  const [pain, setPain] = useState(0);
  const [instability, setInstability] = useState(0);
  const [recentFall, setRecentFall] = useState<boolean | null>(null);
  const [microTest, setMicroTest] = useState<'firm' | 'shaky' | 'unstable' | null>(null);

  const handleFinish = () => {
    if (recentFall === null || microTest === null) return;

    const result = calculateReadiness({
      pain,
      instability,
      recentFall,
      microTest
    });

    setReadiness(result.status);
    router.push("/app/today");
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="h-full flex flex-col justify-between py-6 min-h-[80vh] px-4 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-xs font-bold text-text-muted uppercase tracking-widest">Passo {step} de 4</div>
        <div className="h-1 w-full bg-grid/30 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
      </div>

      {/* Content Steps */}
      <div className="flex-1 flex flex-col justify-center space-y-8 animate-in slide-in-from-right-8 duration-300" key={step}>

        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold font-chakra text-white mb-4">Nível de Dor Agora?</h2>
            <RangeInput value={pain} onChange={setPain} label="Dor" />
            <p className="text-sm text-text-muted text-center mt-4">
              0 = Zero dor <br /> 10 = Hospital
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold font-chakra text-white mb-4">Sensação de Instabilidade?</h2>
            <RangeInput value={instability} onChange={setInstability} label="Instabilidade" />
            <p className="text-sm text-text-muted text-center mt-4">
              0 = Tornozelo de aço <br /> 10 = Gelatina
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold font-chakra text-white mb-6">Histórico Recente</h2>
            <p className="text-sm text-text-muted mb-6">Você teve algum episódio de &quot;quase virar&quot; ou falseio nos últimos 7 dias?</p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={recentFall === false ? "default" : "outline"}
                className={recentFall === false ? "bg-primary text-carbon h-32 text-xl font-chakra font-bold" : "h-32 text-xl font-chakra bg-blueprint/20 border-grid hover:bg-grid/20 text-white"}
                onClick={() => setRecentFall(false)}
              >
                NÃO
              </Button>
              <Button
                variant={recentFall === true ? "destructive" : "outline"}
                className={recentFall === true ? "h-32 text-xl font-chakra font-bold" : "h-32 text-xl font-chakra bg-blueprint/20 border-grid hover:bg-grid/20 text-white"}
                onClick={() => setRecentFall(true)}
              >
                SIM
              </Button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-2xl font-bold font-chakra text-white mb-2">Micro-Teste</h2>
            <p className="text-sm text-text-muted mb-6 bg-blueprint/40 p-4 rounded-lg border border-grid">
              Fique em um pé só por 10 segundos (pode usar parede por perto). Como foi?
            </p>
            <div className="space-y-3">
              <Button
                fullWidth
                className={microTest === 'firm' ? "bg-primary text-carbon h-16 text-lg justify-start px-6 font-bold" : "bg-blueprint/20 border border-grid h-16 text-lg justify-start px-6 hover:bg-grid/20 text-white"}
                onClick={() => setMicroTest('firm')}
              >
                <CheckCircle className="mr-3 h-5 w-5" /> Firme (Fácil)
              </Button>
              <Button
                fullWidth
                className={microTest === 'shaky' ? "bg-warning text-carbon h-16 text-lg justify-start px-6 font-bold" : "bg-blueprint/20 border border-grid h-16 text-lg justify-start px-6 hover:bg-grid/20 text-white"}
                onClick={() => setMicroTest('shaky')}
              >
                <AlertTriangle className="mr-3 h-5 w-5" /> Tremido (Esforço)
              </Button>
              <Button
                fullWidth
                className={microTest === 'unstable' ? "bg-danger text-white h-16 text-lg justify-start px-6 font-bold" : "bg-blueprint/20 border border-grid h-16 text-lg justify-start px-6 hover:bg-grid/20 text-white"}
                onClick={() => setMicroTest('unstable')}
              >
                <AlertTriangle className="mr-3 h-5 w-5" /> Instável (Apoiei)
              </Button>
            </div>
          </>
        )}

      </div>

      {/* Footer Nav */}
      <div className="flex gap-4 pt-6">
        {step > 1 && (
          <Button variant="ghost" className="flex-1" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        )}
        <Button
          className="flex-1 bg-primary text-carbon font-bold"
          size="lg"
          disabled={(step === 3 && recentFall === null) || (step === 4 && microTest === null)}
          onClick={step === 4 ? handleFinish : nextStep}
        >
          {step === 4 ? "Gerar Plano" : "Próximo"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

    </div>
  );
}
