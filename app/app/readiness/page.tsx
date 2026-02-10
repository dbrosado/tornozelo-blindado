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
        <label className="text-sm font-semibold font-heading uppercase tracking-widest text-[#A3A3A3]">{label}</label>
        <span className="text-4xl font-extrabold font-heading text-[#10B981]">{value}</span>
      </div>
      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-[#666666] uppercase">
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
        <div className="text-xs font-semibold font-heading text-[#A3A3A3] uppercase tracking-widest">Passo {step} de 4</div>
        <div className="h-1.5 w-full neu-inset rounded-full overflow-hidden">
          <div className="h-full gradient-primary transition-all duration-300 rounded-full" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </div>

      {/* Content Steps */}
      <div className="flex-1 flex flex-col justify-center space-y-8 animate-in slide-in-from-right-8 duration-300" key={step}>

        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold font-heading text-white mb-4">Nivel de Dor Agora?</h2>
            <RangeInput value={pain} onChange={setPain} label="Dor" />
            <p className="text-sm text-[#A3A3A3] text-center mt-4">
              0 = Zero dor <br /> 10 = Hospital
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-semibold font-heading text-white mb-4">Sensacao de Instabilidade?</h2>
            <RangeInput value={instability} onChange={setInstability} label="Instabilidade" />
            <p className="text-sm text-[#A3A3A3] text-center mt-4">
              0 = Tornozelo de aco <br /> 10 = Gelatina
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-semibold font-heading text-white mb-6">Historico Recente</h2>
            <p className="text-sm text-[#A3A3A3] mb-6">Voce teve algum episodio de &quot;quase virar&quot; ou falseio nos ultimos 7 dias?</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`h-32 text-xl font-heading font-semibold rounded-[14px] transition-all cursor-pointer ${recentFall === false ? "gradient-primary text-[#0A0A0A] shadow-glow-primary" : "neu-button text-white"}`}
                onClick={() => setRecentFall(false)}
              >
                NAO
              </button>
              <button
                className={`h-32 text-xl font-heading font-semibold rounded-[14px] transition-all cursor-pointer ${recentFall === true ? "gradient-danger text-white" : "neu-button text-white"}`}
                onClick={() => setRecentFall(true)}
              >
                SIM
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-2xl font-semibold font-heading text-white mb-2">Micro-Teste</h2>
            <p className="text-sm text-[#A3A3A3] mb-6 neu-inset p-4 rounded-xl">
              Fique em um pe so por 10 segundos (pode usar parede por perto). Como foi?
            </p>
            <div className="space-y-3">
              <button
                className={`w-full h-16 text-lg flex items-center px-6 font-semibold rounded-[14px] transition-all cursor-pointer ${microTest === 'firm' ? "gradient-primary text-[#0A0A0A] shadow-glow-primary" : "neu-button text-white"}`}
                onClick={() => setMicroTest('firm')}
              >
                <CheckCircle className="mr-3 h-5 w-5" /> Firme (Facil)
              </button>
              <button
                className={`w-full h-16 text-lg flex items-center px-6 font-semibold rounded-[14px] transition-all cursor-pointer ${microTest === 'shaky' ? "gradient-warm text-[#0A0A0A]" : "neu-button text-white"}`}
                onClick={() => setMicroTest('shaky')}
              >
                <AlertTriangle className="mr-3 h-5 w-5" /> Tremido (Esforco)
              </button>
              <button
                className={`w-full h-16 text-lg flex items-center px-6 font-semibold rounded-[14px] transition-all cursor-pointer ${microTest === 'unstable' ? "gradient-danger text-white" : "neu-button text-white"}`}
                onClick={() => setMicroTest('unstable')}
              >
                <AlertTriangle className="mr-3 h-5 w-5" /> Instavel (Apoiei)
              </button>
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
          className="flex-1"
          size="lg"
          disabled={(step === 3 && recentFall === null) || (step === 4 && microTest === null)}
          onClick={step === 4 ? handleFinish : nextStep}
        >
          {step === 4 ? "Gerar Plano" : "Proximo"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

    </div>
  );
}
