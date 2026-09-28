import React, { useState } from 'react';
import { CreditCard, QrCode, FileText, Banknote, DollarSign } from 'lucide-react';
import { PaymentMetric } from '../types/dashboard';
import { formatBRL, formatPercent } from '../utils/analytics';

interface PaymentMethodChartProps {
  payments: PaymentMetric[];
  onSelectPayment?: (paymentName: string) => void;
  selectedPayment?: string;
}

const PAYMENT_COLORS: Record<string, string> = {
  'Pix': '#10b981', // emerald-500
  'Cartão de Crédito': '#8b5cf6', // violet-500
  'Boleto Bancário': '#f59e0b', // amber-500
  'Cartão de Débito': '#06b6d4', // cyan-500
  'Dinheiro': '#84cc16', // lime-500
  'Transferência': '#ec4899', // pink-500
};

export const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({
  payments,
  onSelectPayment,
  selectedPayment,
}) => {
  const [hoveredPayment, setHoveredPayment] = useState<string | null>(null);

  const totalRevenue = payments.reduce((acc, p) => acc + p.faturamento, 0);

  // Donut SVG geometry
  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const getMethodIcon = (forma: string) => {
    const f = forma.toLowerCase();
    if (f.includes('pix')) return <QrCode className="w-3.5 h-3.5 text-emerald-400" />;
    if (f.includes('crédito') || f.includes('débito')) return <CreditCard className="w-3.5 h-3.5 text-violet-400" />;
    if (f.includes('boleto')) return <FileText className="w-3.5 h-3.5 text-amber-400" />;
    if (f.includes('dinheiro')) return <Banknote className="w-3.5 h-3.5 text-lime-400" />;
    return <DollarSign className="w-3.5 h-3.5 text-neutral-400" />;
  };

  const activeHoverItem = payments.find(p => p.forma === hoveredPayment);

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 shadow-xl text-white">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Distribuição por Forma de Pagamento
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Participação de cada meio de pagamento no faturamento total
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Donut */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-[180px] h-[180px] flex items-center justify-center">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90"
            >
              {/* Background circle track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#1c1917"
                strokeWidth={strokeWidth}
              />

              {/* Segments */}
              {payments.map((p) => {
                const strokeDasharray = `${(p.percentual / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += p.percentual;

                const color = PAYMENT_COLORS[p.forma] || '#94a3b8';
                const isHovered = hoveredPayment === p.forma;
                const isSelected = selectedPayment === p.forma;

                return (
                  <circle
                    key={p.forma}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={isHovered || isSelected ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredPayment(p.forma)}
                    onMouseLeave={() => setHoveredPayment(null)}
                    onClick={() => onSelectPayment && onSelectPayment(p.forma === selectedPayment ? 'all' : p.forma)}
                  />
                );
              })}
            </svg>

            {/* Donut Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider truncate max-w-[120px]">
                {activeHoverItem ? activeHoverItem.forma : 'Faturamento Total'}
              </span>
              <span className="text-sm font-bold text-white tabular-nums">
                {activeHoverItem ? formatBRL(activeHoverItem.faturamento) : formatBRL(totalRevenue)}
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 tabular-nums">
                {activeHoverItem ? formatPercent(activeHoverItem.percentual) : '100%'}
              </span>
            </div>
          </div>
        </div>

        {/* Legend and tabular breakdown */}
        <div className="md:col-span-7 space-y-2">
          {payments.map((p) => {
            const color = PAYMENT_COLORS[p.forma] || '#94a3b8';
            const isHovered = hoveredPayment === p.forma;
            const isSelected = selectedPayment === p.forma;

            return (
              <div
                key={p.forma}
                onMouseEnter={() => setHoveredPayment(p.forma)}
                onMouseLeave={() => setHoveredPayment(null)}
                onClick={() => onSelectPayment && onSelectPayment(p.forma === selectedPayment ? 'all' : p.forma)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500 shadow-sm'
                    : isHovered
                    ? 'border-neutral-700 bg-neutral-800'
                    : 'border-neutral-800 bg-neutral-950/70 hover:bg-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex items-center gap-1.5">
                      {getMethodIcon(p.forma)}
                      <span className="text-xs font-bold text-white">
                        {p.forma}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-white tabular-nums">
                      {formatBRL(p.faturamento)}
                    </div>
                  </div>
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/80">
                  <div className="flex items-center gap-1.5">
                    <span>{p.quantidadeVendas} transações</span>
                    <span>·</span>
                    <span>Ticket: {formatBRL(p.ticketMedio)}</span>
                  </div>
                  <span className="font-semibold text-emerald-400 tabular-nums">
                    {formatPercent(p.percentual)}
                  </span>
                </div>
              </div>
            );
          })}

          {payments.length === 0 && (
            <div className="py-6 text-center text-xs text-neutral-500">
              Nenhuma transação com forma de pagamento registrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
