import React from 'react';
import { TrendingUp, TrendingDown, Award, Sparkles, ShoppingBag, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { YoYComparison } from '../types/dashboard';
import { formatBRL, formatNumber, formatPercent } from '../utils/analytics';

interface YoYHighlightsProps {
  yoy: YoYComparison;
}

export const YoYHighlights: React.FC<YoYHighlightsProps> = ({ yoy }) => {
  const { topSeller, topProduct, currentYear, previousYear, totalRevenueGrowth, totalRevenueCurrent, totalRevenuePrevious } = yoy;

  const isOverallPositive = totalRevenueGrowth >= 0;

  // Mini circular progress ring for YoY visual representation
  const renderMiniCircular = (percent: number, isPos: boolean) => {
    const size = 38;
    const strokeWidth = 3.5;
    const r = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * r;
    const displayVal = Math.min(100, Math.abs(percent));
    const offset = circ - (displayVal / 100) * circ;
    const color = isPos ? '#10b981' : '#f43f5e';

    return (
      <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#262626"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className={`absolute text-[9px] font-bold font-mono ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPos ? '+' : '-'}{Math.round(displayVal)}%
        </span>
      </div>
    );
  };

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Destaques Comparativos ao Ano Anterior ({currentYear} vs {previousYear})
            </h3>
            <p className="text-xs text-neutral-400">
              Evolução Year-over-Year (YoY) de desempenho por vendedora e mix de produtos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-200 border border-neutral-700">
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
          <span>Base Anual: {previousYear} ➔ {currentYear}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        
        {/* 1. Destaque de Vendedora / Vendedor */}
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Destaque Comercial YoY
            </span>
            <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-base font-bold text-white block truncate">
                {topSeller?.nome || 'Nenhum vendedor'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold text-white tabular-nums">
                  {formatBRL(topSeller?.revenueCurrent || 0)}
                </span>
                <span className="text-xs text-neutral-400">em {currentYear}</span>
              </div>
            </div>
            {renderMiniCircular(topSeller?.growth || 0, (topSeller?.growth || 0) >= 0)}
          </div>

          {/* YoY Badge & Delta */}
          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <div className="text-neutral-400">
              Ano {previousYear}: <strong className="text-white tabular-nums">{formatBRL(topSeller?.revenuePrevious || 0)}</strong>
            </div>
            <div className={`flex items-center gap-0.5 font-bold tabular-nums ${
              (topSeller?.growth || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {(topSeller?.growth || 0) >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>{formatPercent(Math.abs(topSeller?.growth || 0))} YoY</span>
            </div>
          </div>
        </div>

        {/* 2. Destaque de Produto (Carro-Chefe) */}
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Produto Carro-Chefe YoY
            </span>
            <div className="w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-base font-bold text-white block truncate">
                {topProduct?.produto || 'Nenhum produto'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold text-white tabular-nums">
                  {formatBRL(topProduct?.revenueCurrent || 0)}
                </span>
                <span className="text-xs text-neutral-400">em {currentYear}</span>
              </div>
            </div>
            {renderMiniCircular(topProduct?.growth || 0, (topProduct?.growth || 0) >= 0)}
          </div>

          {/* YoY Badge & Delta */}
          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <div className="text-neutral-400">
              Ano {previousYear}: <strong className="text-white tabular-nums">{formatBRL(topProduct?.revenuePrevious || 0)}</strong>
            </div>
            <div className={`flex items-center gap-0.5 font-bold tabular-nums ${
              (topProduct?.growth || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {(topProduct?.growth || 0) >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>{formatPercent(Math.abs(topProduct?.growth || 0))} YoY</span>
            </div>
          </div>
        </div>

        {/* 3. Crescimento Geral da Operação */}
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Crescimento de Receita Total
            </span>
            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
              isOverallPositive ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}>
              {isOverallPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white tabular-nums">
                  {isOverallPositive ? `+${formatPercent(totalRevenueGrowth)}` : `${formatPercent(totalRevenueGrowth)}`}
                </span>
                <span className="text-xs font-medium text-neutral-400">vs {previousYear}</span>
              </div>
              <div className="text-xs text-neutral-300 mt-0.5 font-mono tabular-nums">
                {formatBRL(totalRevenueCurrent)} ({currentYear})
              </div>
            </div>
            {renderMiniCircular(totalRevenueGrowth, isOverallPositive)}
          </div>

          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
            <span>Volume total comercializado:</span>
            <span className="font-semibold text-white tabular-nums">
              {formatNumber(yoy.totalQuantityCurrent)} un. ({yoy.totalQuantityGrowth >= 0 ? '+' : ''}{formatPercent(yoy.totalQuantityGrowth)})
            </span>
          </div>
        </div>

      </div>

      {/* Comparative products horizontal strip */}
      <div className="mt-4 pt-4 border-t border-neutral-800">
        <span className="text-xs font-bold text-white block mb-2.5">
          Desempenho por Categoria de Calçado ({currentYear} vs {previousYear}):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {yoy.productsYoY.slice(0, 4).map((p) => {
            const isPos = p.growthRevenue >= 0;
            return (
              <div key={p.produto} className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs hover:border-neutral-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate">{p.produto}</span>
                  <span className={`font-bold tabular-nums text-[11px] ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPos ? '+' : ''}{formatPercent(p.growthRevenue)}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between text-[11px] text-neutral-400 font-mono">
                  <span className="text-white font-medium">{formatBRL(p.revenueCurrent)}</span>
                  <span className="text-neutral-500">vs {formatBRL(p.revenuePrevious)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
