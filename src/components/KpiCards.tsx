import React from 'react';
import { DollarSign, Package, ShoppingCart, Tag, ArrowUpRight } from 'lucide-react';
import { formatBRL, formatNumber } from '../utils/analytics';

interface KpiCardsProps {
  faturamentoTotal: number;
  quantidadeTotal: number;
  ticketMedio: number;
  precoMedioUnitario: number;
  totalVendas: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  faturamentoTotal,
  quantidadeTotal,
  ticketMedio,
  precoMedioUnitario,
  totalVendas,
}) => {
  // Helper for circular mini gauge SVG
  const renderCircularRing = (percent: number, strokeColor: string, trackColor = '#262626') => {
    const size = 44;
    const strokeWidth = 4.5;
    const r = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * r;
    const clampedPercent = Math.min(100, Math.max(0, percent));
    const offset = circ - (clampedPercent / 100) * circ;

    return (
      <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute text-[10px] font-bold font-mono text-white">
          {Math.round(clampedPercent)}%
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Faturamento Total (QUANTIDADE × PREÇO) */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-lg hover:border-emerald-500/50 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Faturamento Total
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight block">
              {formatBRL(faturamentoTotal)}
            </span>
            <div className="mt-1 flex items-center text-xs text-neutral-400 gap-1.5">
              <span className="font-mono text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                Σ (Qtd × Preço)
              </span>
              <span>·</span>
              <span className="text-neutral-400">Receita Bruta</span>
            </div>
          </div>
          {/* Circular progress visual */}
          {renderCircularRing(88, '#10b981')}
        </div>
      </div>

      {/* 2. Quantidade Total de Calçados Vendidos */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-lg hover:border-cyan-500/50 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Volume de Vendas
          </span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <Package className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">
                {formatNumber(quantidadeTotal)}
              </span>
              <span className="text-xs font-medium text-neutral-400">pares / un.</span>
            </div>
            <div className="mt-1 flex items-center text-xs text-neutral-400 gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              <span>{(quantidadeTotal / Math.max(1, totalVendas)).toFixed(1).replace('.', ',')} un. / pedido</span>
            </div>
          </div>
          {/* Circular progress visual */}
          {renderCircularRing(76, '#06b6d4')}
        </div>
      </div>

      {/* 3. Ticket Médio */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-lg hover:border-violet-500/50 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Ticket Médio
          </span>
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
            <ShoppingCart className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight block">
              {formatBRL(ticketMedio)}
            </span>
            <div className="mt-1 flex items-center text-xs text-neutral-400 gap-1.5">
              <span className="text-neutral-300 font-medium">{totalVendas} transações faturadas</span>
            </div>
          </div>
          {/* Circular progress visual */}
          {renderCircularRing(82, '#8b5cf6')}
        </div>
      </div>

      {/* 4. Preço Médio por Item */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-lg hover:border-amber-500/50 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Preço Médio Unitário
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Tag className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight block">
              {formatBRL(precoMedioUnitario)}
            </span>
            <div className="mt-1 flex items-center text-xs text-neutral-400 gap-1.5">
              <span className="text-neutral-400">Preço médio por par de calçado</span>
            </div>
          </div>
          {/* Circular progress visual */}
          {renderCircularRing(64, '#f59e0b')}
        </div>
      </div>
    </div>
  );
};
