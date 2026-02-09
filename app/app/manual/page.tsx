import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { BookOpen, AlertCircle, Clock, Shield } from "lucide-react";

interface ArticleCardProps {
  title: string;
  content: string;
  icon: LucideIcon;
}

export default function ManualPage() {
  return (
    <div className="space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold font-chakra text-white tracking-tight">MANUAL</h1>
        <p className="text-xs text-text-muted uppercase tracking-widest">A Filosofia do Protocolo</p>
      </header>

      <div className="space-y-4">
        <ArticleCard
          icon={Clock}
          title="Regra dos 10 Minutos"
          content="A consistência vence a intensidade. 10 minutos diários valem mais que 1 hora semanal. O tendão precisa de estímulo frequente, não de tortura."
        />
        <ArticleCard
          icon={Shield}
          title="Janela de 6 Horas"
          content="Após um treino, seu tendão fica temporariamente mais fraco (catabolismo). Ele leva cerca de 6 horas para se reconstruir mais forte. Treinar antes disso é pedir lesão."
        />
        <ArticleCard
          icon={AlertCircle}
          title="Dor Boa vs Dor Ruim"
          content="Queimação muscular? Ótimo. Dor aguda ou pontada? Pare. Dor no tendão nota 3/10? Aceitável. Nota 5/10? Pare."
        />
      </div>

      <div className="text-center text-text-muted p-8 border border-dashed border-grid rounded-lg bg-blueprint/10">
        <BookOpen className="h-8 w-8 mx-auto mb-2 text-grid" />
        <p className="text-sm">Ebook Completo em Breve</p>
      </div>
    </div>
  );
}

function ArticleCard({ title, content, icon: Icon }: ArticleCardProps) {
  return (
    <Card className="bg-blueprint/20 border-grid">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="font-bold font-chakra text-white uppercase tracking-wide">{title}</h3>
        </div>
        <p className="text-sm text-text-muted leading-relaxed">
          {content}
        </p>
      </CardContent>
    </Card>
  );
}
