import React, { useState } from 'react';
import { Plus, Download, RefreshCw, TrendingUp, SlidersHorizontal, Search, X, Calendar, Filter } from 'lucide-react';
import { FilterState } from '../types/dashboard';

interface TopBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenImport: () => void;
  onResetData: () => void;
  onDownloadSample: () => void;
  totalRecords: number;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  availableSellers: string[];
  availableProducts: string[];
  availablePaymentMethods: string[];
  totalFiltered: number;
  firebaseConnected?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenImport,
  onResetData,
  onDownloadSample,
  totalRecords,
  filters,
  onFilterChange,
  onResetFilters,
  availableSellers,
  availableProducts,
  availablePaymentMethods,
  totalFiltered,
  firebaseConnected = true,
}) => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'sellers', label: 'Vendedores' },
    { id: 'products', label: 'Produtos' },
    { id: 'evolution', label: 'Evolução Temporal' },
    { id: 'table', label: 'Base de Transações' },
  ];

  // Count active filters
  const activeFiltersCount = [
    filters.busca.trim() !== '',
    filters.vendedor !== 'all',
    filters.produto !== 'all',
    filters.formaPagamento !== 'all',
    filters.periodoInicio !== '',
    filters.periodoFim !== '',
  ].filter(Boolean).length;

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Wordmark Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-emerald-500 flex items-center justify-center text-white shadow-lg ring-1 ring-indigo-400/40">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-white block leading-tight">
                  CAIO LEVI
                </span>
                {firebaseConnected && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 border border-emerald-700/60 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Firebase</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-neutral-400 font-medium tracking-tight">
                Painel Executivo Dashboard
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (dark segmented tabs) */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-neutral-800 text-white shadow-xs ring-1 ring-neutral-700'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions + Filter Button */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Top Bar "Filtro" Action */}
            <button
              onClick={() => setIsFilterPanelOpen(prev => !prev)}
              title="Abrir opções de filtro"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap ${
                isFilterPanelOpen || activeFiltersCount > 0
                  ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 shadow-2xs ring-1 ring-indigo-500/40'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white hover:border-neutral-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Filtro</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center ml-0.5">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <button
              onClick={onDownloadSample}
              title="Baixar planilha modelo em formato CSV"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              <span>Modelo Planilha</span>
            </button>

            <button
              onClick={onResetData}
              title="Restaurar dados de demonstração da planilha"
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors border border-transparent hover:border-neutral-800"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Prominent Plus Import Button */}
            <button
              onClick={onOpenImport}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap ring-1 ring-indigo-400/40"
            >
              <Plus className="w-4 h-4" />
              <span>Importar Documento</span>
            </button>
          </div>

        </div>
      </div>
      
      {/* Mobile nav strip */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-neutral-800 gap-1 scrollbar-none bg-neutral-950">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'text-neutral-400 bg-neutral-900 border border-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dropdown Filter Panel housed in the top bar */}
      {isFilterPanelOpen && (
        <div className="border-t border-neutral-800 bg-neutral-950/98 backdrop-blur-md p-4 transition-all animate-fade-in shadow-2xl">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Filter className="w-3.5 h-3.5 text-indigo-400" />
                <span>Painel de Filtros Avançados</span>
                <span className="text-neutral-400 font-normal">
                  · Exibindo <strong className="text-white tabular-nums">{totalFiltered}</strong> de {totalRecords} registros
                </span>
              </div>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={onResetFilters}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold inline-flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Limpar Todos os Filtros</span>
                  </button>
                )}
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
              {/* Search text */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={filters.busca}
                  onChange={(e) => onFilterChange({ busca: e.target.value })}
                  placeholder="Buscar vendedor, produto..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                />
              </div>

              {/* Seller */}
              <select
                value={filters.vendedor}
                onChange={(e) => onFilterChange({ vendedor: e.target.value })}
                className="px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                <option value="all">Todos os Vendedores</option>
                {availableSellers.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              {/* Product */}
              <select
                value={filters.produto}
                onChange={(e) => onFilterChange({ produto: e.target.value })}
                className="px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                <option value="all">Todos os Produtos</option>
                {availableProducts.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {/* Payment */}
              <select
                value={filters.formaPagamento}
                onChange={(e) => onFilterChange({ formaPagamento: e.target.value })}
                className="px-2.5 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
              >
                <option value="all">Todas Formas de Pagamento</option>
                {availablePaymentMethods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Date Range */}
              <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <input
                  type="date"
                  value={filters.periodoInicio}
                  onChange={(e) => onFilterChange({ periodoInicio: e.target.value })}
                  className="text-xs w-full bg-transparent border-0 text-white focus:outline-none"
                  title="Data início"
                />
                <span className="text-neutral-500">/</span>
                <input
                  type="date"
                  value={filters.periodoFim}
                  onChange={(e) => onFilterChange({ periodoFim: e.target.value })}
                  className="text-xs w-full bg-transparent border-0 text-white focus:outline-none"
                  title="Data fim"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active filter reminder strip when drawer is closed */}
      {!isFilterPanelOpen && activeFiltersCount > 0 && (
        <div className="bg-indigo-950/90 border-t border-indigo-900/60 px-4 py-1.5 text-xs flex items-center justify-between text-indigo-200">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="font-semibold text-white">Filtros ativos ({activeFiltersCount}):</span>
            <div className="flex items-center gap-2 text-indigo-300 truncate">
              {filters.busca && <span>Busca: "{filters.busca}"</span>}
              {filters.vendedor !== 'all' && <span>· Vendedor: {filters.vendedor}</span>}
              {filters.produto !== 'all' && <span>· Produto: {filters.produto}</span>}
              {filters.formaPagamento !== 'all' && <span>· Pagamento: {filters.formaPagamento}</span>}
              {(filters.periodoInicio || filters.periodoFim) && (
                <span>· Período: {filters.periodoInicio || 'Início'} até {filters.periodoFim || 'Fim'}</span>
              )}
            </div>
            <button
              onClick={onResetFilters}
              className="ml-auto text-xs text-indigo-400 hover:text-white underline font-semibold shrink-0"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
