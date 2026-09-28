import React, { useState } from 'react';
import { Award, DollarSign, Package, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { SellerMetric } from '../types/dashboard';
import { formatBRL, formatNumber, formatPercent } from '../utils/analytics';

interface SellerRankingChartProps {
  sellers: SellerMetric[];
  onSelectSeller?: (sellerName: string) => void;
  selectedSeller?: string;
  defaultView?: 'circular' | 'traditional';
}

const SELLER_COLORS = ['#f59e0b', '#8b5cf6', '#06b6d4', '#10b981', '#ec4899', '#3b82f6'];

export const SellerRankingChart: React.FC<SellerRankingChartProps> = ({
  sellers,
  onSelectSeller,
  selectedSeller,
  defaultView = 'circular',
}) => {
  const [metricType, setMetricType] = useState<'faturamento' | 'quantidade'>('faturamento');
  const [viewFormat, setViewFormat] = useState<'traditional' | 'circular'>(defaultView);
  const [hoveredSeller, setHoveredSeller] = useState<string | null>(null);

  const sortedSellers = [...sellers].sort((a, b) => {
    if (metricType === 'quantidade') {
      return b.quantidade - a.quantidade;
    }
    return b.faturamento - a.faturamento;
  });

  const totalVal = sortedSellers.reduce(
    (acc, s) => acc + (metricType === 'quantidade' ? s.quantidade : s.faturamento),
    0
  );

  const maxVal = sortedSellers.length > 0
    ? (metricType === 'quantidade' ? sortedSellers[0].quantidade : sortedSellers[0].faturamento)
    : 1;

  // Donut geometry for circular mode
  const size = 210;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const activeHoverItem = sortedSellers.find(s => s.nome === hoveredSeller);

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/40 shadow-xs">
          1º
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="w-6 h-6 rounded-md bg-slate-300/20 text-slate-200 font-bold text-xs flex items-center justify-center border border-slate-400/40 shadow-xs">
          2º
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="w-6 h-6 rounded-md bg-amber-700/20 text-amber-500 font-bold text-xs flex items-center justify-center border border-amber-600/40 shadow-xs">
          3º
        </span>
      );
    }
    return (
      <span className="w-6 h-6 rounded-md bg-neutral-800 text-neutral-400 font-semibold text-xs flex items-center justify-center">
        {index + 1}º
      </span>
    );
  };

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-xl text-white">
      {/* Header and Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Ranking de Vendedoras / Vendedores (Gráfico Circular)
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Distribuição circular de faturamento e market share por vendedora
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View mode toggle: Circular vs Traditional */}
          <div className="flex items-center p-1 bg-neutral-950 border border-neutral-800 rounded-lg shrink-0">
            <button
              onClick={() => setViewFormat('traditional')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewFormat === 'traditional'
                  ? 'bg-neutral-800 text-white shadow-xs ring-1 ring-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3 h-3 text-amber-400" />
              <span>Tradicional</span>
            </button>
            <button
              onClick={() => setViewFormat('circular')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewFormat === 'circular'
                  ? 'bg-neutral-800 text-white shadow-xs ring-1 ring-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <PieIcon className="w-3 h-3 text-violet-400" />
              <span>Circular</span>
            </button>
          </div>

          {/* Metric toggle: R$ vs Qtd */}
          <div className="flex items-center p-1 bg-neutral-950 border border-neutral-800 rounded-lg shrink-0">
            <button
              onClick={() => setMetricType('faturamento')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                metricType === 'faturamento'
                  ? 'bg-neutral-800 text-amber-400 shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3 h-3" />
              <span>R$</span>
            </button>
            <button
              onClick={() => setMetricType('quantidade')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                metricType === 'quantidade'
                  ? 'bg-neutral-800 text-cyan-400 shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Package className="w-3 h-3" />
              <span>Unid.</span>
            </button>
          </div>
        </div>
      </div>

      {viewFormat === 'traditional' ? (
        /* Traditional Ranking Bars */
        <div className="mt-4 space-y-3">
          {sortedSellers.map((seller, idx) => {
            const currentVal = metricType === 'quantidade' ? seller.quantidade : seller.faturamento;
            const percentageOfLeader = maxVal > 0 ? (currentVal / maxVal) * 100 : 0;
            const isSelected = selectedSeller === seller.nome;
            const color = SELLER_COLORS[idx % SELLER_COLORS.length];

            return (
              <div
                key={seller.nome}
                onClick={() => onSelectSeller && onSelectSeller(seller.nome === selectedSeller ? 'all' : seller.nome)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-950/40 ring-1 ring-amber-500 shadow-sm'
                    : 'border-neutral-800 bg-neutral-950/80 hover:bg-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {getRankBadge(idx)}
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-white truncate block">
                        {seller.nome}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                        <span>{seller.totalVendas} vendas</span>
                        <span>·</span>
                        <span>Ticket médio: {formatBRL(seller.ticketMedio)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-white tabular-nums">
                      {metricType === 'quantidade'
                        ? `${formatNumber(seller.quantidade)} un.`
                        : formatBRL(seller.faturamento)}
                    </div>
                    <div className="text-[11px] font-medium text-amber-400 tabular-nums">
                      {formatPercent(seller.participacaoFaturamento)} da receita
                    </div>
                  </div>
                </div>

                {/* Progress track */}
                <div className="mt-2.5 w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: color,
                      width: `${Math.max(4, percentageOfLeader)}%`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Circular / Donut Mode for Sellers */
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* SVG Donut Circle */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-[190px] h-[190px] flex items-center justify-center">
              <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
              >
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#1c1917"
                  strokeWidth={strokeWidth}
                />

                {sortedSellers.map((s, idx) => {
                  const share = totalVal > 0
                    ? ((metricType === 'quantidade' ? s.quantidade : s.faturamento) / totalVal) * 100
                    : 0;
                  const strokeDasharray = `${(share / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                  accumulatedPercent += share;

                  const color = SELLER_COLORS[idx % SELLER_COLORS.length];
                  const isHovered = hoveredSeller === s.nome;
                  const isSelected = selectedSeller === s.nome;

                  return (
                    <circle
                      key={s.nome}
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="none"
                      stroke={color}
                      strokeWidth={isHovered || isSelected ? strokeWidth + 5 : strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredSeller(s.nome)}
                      onMouseLeave={() => setHoveredSeller(null)}
                      onClick={() => onSelectSeller && onSelectSeller(s.nome === selectedSeller ? 'all' : s.nome)}
                    />
                  );
                })}
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-3">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider truncate max-w-[120px]">
                  {activeHoverItem ? activeHoverItem.nome : 'Market Share'}
                </span>
                <span className="text-sm font-bold text-white tabular-nums">
                  {activeHoverItem
                    ? (metricType === 'quantidade' ? `${formatNumber(activeHoverItem.quantidade)} un.` : formatBRL(activeHoverItem.faturamento))
                    : (metricType === 'quantidade' ? `${formatNumber(totalVal)} un.` : formatBRL(totalVal))}
                </span>
                <span className="text-[11px] font-semibold text-amber-400 tabular-nums">
                  {activeHoverItem ? formatPercent(activeHoverItem.participacaoFaturamento) : '100%'}
                </span>
              </div>
            </div>
          </div>

          {/* Seller Legend List */}
          <div className="md:col-span-7 space-y-2">
            {sortedSellers.map((s, idx) => {
              const color = SELLER_COLORS[idx % SELLER_COLORS.length];
              const isHovered = hoveredSeller === s.nome;
              const isSelected = selectedSeller === s.nome;

              return (
                <div
                  key={s.nome}
                  onMouseEnter={() => setHoveredSeller(s.nome)}
                  onMouseLeave={() => setHoveredSeller(null)}
                  onClick={() => onSelectSeller && onSelectSeller(s.nome === selectedSeller ? 'all' : s.nome)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-950/40 ring-1 ring-amber-500 shadow-sm'
                      : isHovered
                      ? 'border-neutral-700 bg-neutral-800'
                      : 'border-neutral-800 bg-neutral-950/70 hover:bg-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-bold text-white">
                        {s.nome}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-white tabular-nums">
                        {metricType === 'quantidade' ? `${formatNumber(s.quantidade)} un.` : formatBRL(s.faturamento)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/80">
                    <span>{s.totalVendas} transações faturadas</span>
                    <span className="font-semibold text-amber-400 tabular-nums">
                      {formatPercent(s.participacaoFaturamento)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {sortedSellers.length === 0 && (
        <div className="py-8 text-center text-xs text-neutral-500">
          Nenhum vendedor encontrado com os filtros atuais.
        </div>
      )}
    </div>
  );
};
