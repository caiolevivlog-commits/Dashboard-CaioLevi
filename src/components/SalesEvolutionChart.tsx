import React, { useState } from 'react';
import { TrendingUp, DollarSign, Package } from 'lucide-react';
import { TimeMetric } from '../types/dashboard';
import { formatBRL, formatNumber } from '../utils/analytics';

interface SalesEvolutionChartProps {
  monthData: TimeMetric[];
  yearData: TimeMetric[];
}

export const SalesEvolutionChart: React.FC<SalesEvolutionChartProps> = ({
  monthData,
  yearData,
}) => {
  const [granularity, setGranularity] = useState<'month' | 'year'>('month');
  const [metric, setMetric] = useState<'faturamento' | 'quantidade'>('faturamento');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeData = granularity === 'month' ? monthData : yearData;

  const width = 800;
  const height = 260;
  const padding = { top: 20, right: 30, bottom: 40, left: 70 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const values = activeData.map(d => metric === 'faturamento' ? d.faturamento : d.quantidade);
  const maxValue = values.length > 0 ? Math.max(...values, 1) : 1;

  // Grid steps (4 horizontal guide lines)
  const steps = 4;
  const yTicks = Array.from({ length: steps + 1 }, (_, i) => (maxValue / steps) * i);

  // SVG coordinate calculations
  const points = activeData.map((d, index) => {
    const val = metric === 'faturamento' ? d.faturamento : d.quantidade;
    const x = activeData.length === 1
      ? padding.left + chartWidth / 2
      : padding.left + (index / (activeData.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - (val / maxValue) * chartHeight;
    return { x, y, data: d };
  });

  // Construct path string
  let pathD = '';
  let areaD = '';

  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;
    const bottomY = padding.top + chartHeight;
    areaD = `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }

  const activePoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-xl text-white">
      {/* Header with Granularity & Metric toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              Evolução das Vendas ao Longo do Tempo (Tradicional)
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Comportamento histórico da receita e volume de calçados vendidos
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Month / Year toggle */}
          <div className="flex items-center p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
            <button
              onClick={() => setGranularity('month')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                granularity === 'month'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Por Mês
            </button>
            <button
              onClick={() => setGranularity('year')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                granularity === 'year'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Por Ano
            </button>
          </div>

          {/* Metric toggle */}
          <div className="flex items-center p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
            <button
              onClick={() => setMetric('faturamento')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                metric === 'faturamento'
                  ? 'bg-neutral-800 text-emerald-400 shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              R$ Faturamento
            </button>
            <button
              onClick={() => setMetric('quantidade')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                metric === 'quantidade'
                  ? 'bg-neutral-800 text-cyan-400 shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Unidades
            </button>
          </div>
        </div>
      </div>

      {/* SVG Chart area */}
      <div className="mt-4 relative select-none">
        {activeData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs text-neutral-500">
            Nenhum dado temporal disponível.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto max-h-[300px]"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <defs>
                <linearGradient id="areaGradientDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Gridlines & Y-Axis Labels */}
              {yTicks.map((tick, i) => {
                const y = padding.top + chartHeight - (tick / maxValue) * chartHeight;
                return (
                  <g key={i}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={width - padding.right}
                      y2={y}
                      stroke="#262626"
                      strokeDasharray={i === 0 ? 'none' : '3 3'}
                    />
                    <text
                      x={padding.left - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[10px] fill-neutral-400 font-mono"
                    >
                      {metric === 'faturamento' ? formatBRL(tick).replace(',00', '') : formatNumber(tick)}
                    </text>
                  </g>
                );
              })}

              {/* Area fill */}
              {areaD && (
                <path d={areaD} fill="url(#areaGradientDark)" />
              )}

              {/* Main Line */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points & transparent hover targets */}
              {points.map((p, index) => {
                const isHovered = hoveredIndex === index;
                return (
                  <g key={index}>
                    {/* Visual dot */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 6 : 4}
                      className={`transition-all ${
                        isHovered
                          ? 'fill-indigo-400 stroke-black stroke-2 shadow-lg'
                          : 'fill-black stroke-indigo-400 stroke-2'
                      }`}
                    />

                    {/* X-axis labels */}
                    {(points.length <= 12 || index % Math.ceil(points.length / 10) === 0 || index === points.length - 1) && (
                      <text
                        x={p.x}
                        y={height - 15}
                        textAnchor="middle"
                        className="text-[10px] fill-neutral-400 font-medium"
                      >
                        {p.data.periodo}
                      </text>
                    )}

                    {/* Interactive hover column */}
                    <rect
                      x={p.x - 15}
                      y={padding.top}
                      width={30}
                      height={chartHeight + 10}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(index)}
                    />
                  </g>
                );
              })}

              {/* Vertical guideline on hover */}
              {activePoint && (
                <line
                  x1={activePoint.x}
                  y1={padding.top}
                  x2={activePoint.x}
                  y2={padding.top + chartHeight}
                  stroke="#818cf8"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              )}
            </svg>
          </div>
        )}

        {/* Floating Tooltip Box */}
        {activePoint && (
          <div
            className="absolute z-20 pointer-events-none bg-neutral-950 text-white rounded-lg p-2.5 shadow-2xl border border-neutral-700 text-xs transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${(activePoint.y / height) * 100 - 6}%`,
            }}
          >
            <div className="font-semibold text-indigo-400 border-b border-neutral-800 pb-1 mb-1">
              Período: {activePoint.data.periodo}
            </div>
            <div className="space-y-0.5 font-mono text-[11px]">
              <div>Faturamento: <strong className="text-white">{formatBRL(activePoint.data.faturamento)}</strong></div>
              <div>Volume: <strong className="text-cyan-400">{formatNumber(activePoint.data.quantidade)} pares</strong></div>
              <div>Vendas: <span className="text-neutral-400">{activePoint.data.totalVendas} transações</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
