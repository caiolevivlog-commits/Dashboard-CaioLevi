import React from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { FilterState } from '../types/dashboard';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  availableSellers: string[];
  availableProducts: string[];
  availablePaymentMethods: string[];
  totalFiltered: number;
  totalOverall: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  availableSellers,
  availableProducts,
  availablePaymentMethods,
  totalFiltered,
  totalOverall,
}) => {
  const isFiltered =
    filters.busca !== '' ||
    filters.vendedor !== 'all' ||
    filters.produto !== 'all' ||
    filters.formaPagamento !== 'all' ||
    filters.periodoInicio !== '' ||
    filters.periodoFim !== '';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.busca}
            onChange={(e) => onFilterChange({ busca: e.target.value })}
            placeholder="Buscar por vendedor, produto, região..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Dropdown filters grid */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Seller filter */}
          <select
            value={filters.vendedor}
            onChange={(e) => onFilterChange({ vendedor: e.target.value })}
            className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          >
            <option value="all">Todos os Vendedores</option>
            {availableSellers.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          {/* Product filter */}
          <select
            value={filters.produto}
            onChange={(e) => onFilterChange({ produto: e.target.value })}
            className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          >
            <option value="all">Todos os Produtos</option>
            {availableProducts.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Payment filter */}
          <select
            value={filters.formaPagamento}
            onChange={(e) => onFilterChange({ formaPagamento: e.target.value })}
            className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          >
            <option value="all">Formas de Pagamento</option>
            {availablePaymentMethods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={filters.periodoInicio}
              onChange={(e) => onFilterChange({ periodoInicio: e.target.value })}
              className="text-xs bg-transparent border-0 text-slate-700 focus:outline-none"
              title="Data inicial"
            />
            <span className="text-xs text-slate-400">até</span>
            <input
              type="date"
              value={filters.periodoFim}
              onChange={(e) => onFilterChange({ periodoFim: e.target.value })}
              className="text-xs bg-transparent border-0 text-slate-700 focus:outline-none"
              title="Data final"
            />
          </div>

          {/* Clear button if filtered */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter status row */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Exibindo <strong className="text-slate-800 tabular-nums">{totalFiltered}</strong> de <span className="tabular-nums">{totalOverall}</span> transações
          </span>
          {isFiltered && (
            <span className="text-indigo-600 font-medium">· Filtros aplicados</span>
          )}
        </div>
      </div>
    </div>
  );
};
