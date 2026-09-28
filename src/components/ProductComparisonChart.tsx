import React, { useState } from 'react';
import { Package, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { ProductMetric } from '../types/dashboard';
import { formatBRL, formatNumber, formatPercent } from '../utils/analytics';

interface ProductComparisonChartProps {
  products: ProductMetric[];
  onSelectProduct?: (productName: string) => void;
  selectedProduct?: string;
}

const PRODUCT_COLORS: Record<string, string> = {
  'Tênis': '#06b6d4', // cyan-500
  'TENIS': '#06b6d4',
  'Sandália': '#8b5cf6', // violet-500
  'SANDALIA': '#8b5cf6',
  'Chinelo': '#10b981', // emerald-500
  'CHINELO': '#10b981',
  'Rasteirinhas': '#f59e0b', // amber-500
  'RASTEIRINHAS': '#f59e0b',
  'Sapatilhas': '#ec4899', // pink-500
  'SAPATILHAS': '#ec4899',
};

const PALETTE = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

export const ProductComparisonChart: React.FC<ProductComparisonChartProps> = ({
  products,
  onSelectProduct,
  selectedProduct,
}) => {
  const [chartType, setChartType] = useState<'circular' | 'traditional'>('circular');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const totalRevenue = products.reduce((acc, p) => acc + p.faturamento, 0);
  const maxRevenue = products.length > 0 ? Math.max(...products.map(p => p.faturamento)) : 1;

  // Donut geometry for Circular Mode
  const size = 210;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  const activeHoverItem = products.find(p => p.produto === hoveredProduct);

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-xl text-white">
      {/* Header and Toggle between Circular and Traditional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Vendas por Produto (Tênis, Sandália, Chinelo, Rasteirinhas...)
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Comparativo de receita bruta, unidades e participação no mix comercial
          </p>
        </div>

        {/* View mode toggle: Circular vs Traditional */}
        <div className="flex items-center p-1 bg-neutral-950 border border-neutral-800 rounded-lg shrink-0">
          <button
            onClick={() => setChartType('circular')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              chartType === 'circular'
                ? 'bg-neutral-800 text-white shadow-xs ring-1 ring-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Gráfico Circular</span>
          </button>
          <button
            onClick={() => setChartType('traditional')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              chartType === 'traditional'
                ? 'bg-neutral-800 text-white shadow-xs ring-1 ring-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tradicional (Barras)</span>
          </button>
        </div>
      </div>

      {chartType === 'circular' ? (
        /* Circular / Donut View */
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
                {/* Background track */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#1c1917"
                  strokeWidth={strokeWidth}
                />

                {/* Donut Segments */}
                {products.map((p, idx) => {
                  const strokeDasharray = `${(p.participacaoFaturamento / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                  accumulatedPercent += p.participacaoFaturamento;

                  const color = PRODUCT_COLORS[p.produto] || PALETTE[idx % PALETTE.length];
                  const isHovered = hoveredProduct === p.produto;
                  const isSelected = selectedProduct === p.produto;

                  return (
                    <circle
                      key={p.produto}
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="none"
                      stroke={color}
                      strokeWidth={isHovered || isSelected ? strokeWidth + 5 : strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredProduct(p.produto)}
                      onMouseLeave={() => setHoveredProduct(null)}
                      onClick={() => onSelectProduct && onSelectProduct(p.produto === selectedProduct ? 'all' : p.produto)}
                    />
                  );
                })}
              </svg>

              {/* Center information */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-3">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider truncate max-w-[120px]">
                  {activeHoverItem ? activeHoverItem.produto : 'Faturamento Total'}
                </span>
                <span className="text-sm font-bold text-white tabular-nums">
                  {activeHoverItem ? formatBRL(activeHoverItem.faturamento) : formatBRL(totalRevenue)}
                </span>
                <span className="text-[11px] font-semibold text-cyan-400 tabular-nums">
                  {activeHoverItem ? formatPercent(activeHoverItem.participacaoFaturamento) : '100%'}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Product Legend */}
          <div className="md:col-span-7 space-y-2">
            {products.map((p, idx) => {
              const color = PRODUCT_COLORS[p.produto] || PALETTE[idx % PALETTE.length];
              const isHovered = hoveredProduct === p.produto;
              const isSelected = selectedProduct === p.produto;

              return (
                <div
                  key={p.produto}
                  onMouseEnter={() => setHoveredProduct(p.produto)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => onSelectProduct && onSelectProduct(p.produto === selectedProduct ? 'all' : p.produto)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/40 ring-1 ring-cyan-500 shadow-sm'
                      : isHovered
                      ? 'border-neutral-700 bg-neutral-800'
                      : 'border-neutral-800 bg-neutral-950/70 hover:bg-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-bold text-white">
                        {p.produto}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-white tabular-nums">
                        {formatBRL(p.faturamento)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/80">
                    <div className="flex items-center gap-2">
                      <span>{formatNumber(p.quantidade)} pares</span>
                      <span>·</span>
                      <span>Média: {formatBRL(p.precoMedio)}</span>
                    </div>
                    <span className="font-semibold text-cyan-400 tabular-nums">
                      {formatPercent(p.participacaoFaturamento)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* Traditional Bar Chart View */
        <div className="mt-4 space-y-3">
          {products.map((item, idx) => {
            const revPercent = maxRevenue > 0 ? (item.faturamento / maxRevenue) * 100 : 0;
            const isSelected = selectedProduct === item.produto;
            const color = PRODUCT_COLORS[item.produto] || PALETTE[idx % PALETTE.length];

            return (
              <div
                key={item.produto}
                onClick={() => onSelectProduct && onSelectProduct(item.produto === selectedProduct ? 'all' : item.produto)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/40 ring-1 ring-cyan-500 shadow-sm'
                    : 'border-neutral-800 bg-neutral-950/80 hover:bg-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs tracking-wider text-black font-mono shadow-xs"
                      style={{ backgroundColor: color }}
                    >
                      {item.produto.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white">
                        {item.produto}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <span>Preço médio: <strong className="text-neutral-200">{formatBRL(item.precoMedio)}</strong></span>
                        <span>·</span>
                        <span>{item.totalVendas} pedidos</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                    <div className="text-sm font-bold text-white tabular-nums">
                      {formatBRL(item.faturamento)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <span className="font-semibold text-neutral-200 tabular-nums">{formatNumber(item.quantidade)} un.</span>
                      <span className="text-neutral-600">|</span>
                      <span className="text-cyan-400 font-medium tabular-nums">{formatPercent(item.participacaoFaturamento)} do mix</span>
                    </div>
                  </div>
                </div>

                {/* Traditional Bar Progress */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-neutral-400 mb-1 font-medium">
                    <span>Proporção frente ao produto líder</span>
                    <span className="tabular-nums font-mono text-white">{revPercent.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: color,
                        width: `${Math.max(4, revPercent)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {products.length === 0 && (
        <div className="py-8 text-center text-xs text-neutral-500">
          Nenhum produto cadastrado para os filtros ativos.
        </div>
      )}
    </div>
  );
};
