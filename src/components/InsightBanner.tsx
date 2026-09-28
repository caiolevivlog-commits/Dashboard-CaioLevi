import React, { useState } from 'react';
import { Sparkles, Check, Copy, TrendingUp, Award, ShoppingBag, CreditCard } from 'lucide-react';
import { DashboardInsights } from '../types/dashboard';

interface InsightBannerProps {
  insights: DashboardInsights;
  onRefreshAI?: () => void;
  isGenerating?: boolean;
}

export const InsightBanner: React.FC<InsightBannerProps> = ({
  insights,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(insights.conclusaoGeral);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-900/90 text-white rounded-xl p-6 shadow-2xl border border-neutral-800 relative overflow-hidden">
      {/* Decorative ambient backdrop glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-xs font-semibold tracking-wider uppercase text-indigo-300">
              Diagnóstico Estratégico do Período
            </h2>
            <span className="text-xs text-neutral-400 hidden sm:inline">· Síntese Automatizada de Calçados & Vendas</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-colors"
              title="Copiar conclusão textual"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Frase</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Primary Concluding Sentence */}
        <div className="bg-black/60 border border-neutral-800 rounded-lg p-4 my-2">
          <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
            "{insights.conclusaoGeral}"
          </p>
        </div>

        {/* 4 Structural Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-3 border-t border-neutral-800 text-xs">
          <div className="flex items-start gap-2 text-neutral-300">
            <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Destaque de Vendas:</span>
              <span className="text-neutral-300 leading-normal">{insights.destaqueVendedor}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-neutral-300">
            <ShoppingBag className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Mix de Produtos:</span>
              <span className="text-neutral-300 leading-normal">{insights.destaqueProduto}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-neutral-300">
            <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Trajetória Temporal:</span>
              <span className="text-neutral-300 leading-normal">{insights.destaqueTemporal}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-neutral-300">
            <CreditCard className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Forma de Pagamento:</span>
              <span className="text-neutral-300 leading-normal">{insights.destaquePagamento}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
