import React, { useState } from 'react';
import { ArrowUpDown, Plus, Download, Trash2 } from 'lucide-react';
import { SaleRecord } from '../types/dashboard';
import { formatBRL, formatNumber } from '../utils/analytics';

interface SalesDataTableProps {
  records: SaleRecord[];
  onAddRecord: (record: Omit<SaleRecord, 'id' | 'faturamento'>) => void;
  onDeleteRecord: (id: string) => void;
  onExportCsv: () => void;
}

export const SalesDataTable: React.FC<SalesDataTableProps> = ({
  records,
  onAddRecord,
  onDeleteRecord,
  onExportCsv,
}) => {
  const [sortField, setSortField] = useState<keyof SaleRecord>('data');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [showAddModal, setShowAddModal] = useState(false);

  // New record form state
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    vendedor: 'Carlos Mendes',
    produto: 'Sandália',
    quantidade: 10,
    preco: 320.00,
    formaPagamento: 'Pix',
    regiao: 'Sudeste'
  });

  const handleSort = (field: keyof SaleRecord) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sorted = [...records].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecord(formData);
    setShowAddModal(false);
  };

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl shadow-xl overflow-hidden text-white">
      {/* Header action bar */}
      <div className="p-5 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">
            Base Analítica de Transações
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Registros detalhados com cálculo de faturamento (Qtd × Preço)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-950 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Venda</span>
          </button>
        </div>
      </div>

      {/* Table viewport */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-semibold select-none">
              <th
                onClick={() => handleSort('data')}
                className="py-3 px-4 cursor-pointer hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Data</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('vendedor')}
                className="py-3 px-4 cursor-pointer hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Vendedor(a)</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('produto')}
                className="py-3 px-4 cursor-pointer hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Calçado / Produto</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('quantidade')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Quantidade</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('preco')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Preço Unitário</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('faturamento')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Faturamento (Qtd × Preço)</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('formaPagamento')}
                className="py-3 px-4 cursor-pointer hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Forma de Pagamento</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-500" />
                </div>
              </th>
              <th className="py-3 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-neutral-300">
            {paginated.map((r) => (
              <tr key={r.id} className="hover:bg-neutral-800/50 transition-colors">
                <td className="py-2.5 px-4 font-mono text-[11px] text-neutral-400 whitespace-nowrap">
                  {r.data.split('-').reverse().join('/')}
                </td>
                <td className="py-2.5 px-4 font-medium text-white whitespace-nowrap">
                  {r.vendedor}
                </td>
                <td className="py-2.5 px-4 whitespace-nowrap">
                  <span className="font-semibold text-cyan-300">
                    {r.produto}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-neutral-200">
                  {formatNumber(r.quantidade)}
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-neutral-300">
                  {formatBRL(r.preco)}
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold text-white">
                  {formatBRL(r.faturamento)}
                </td>
                <td className="py-2.5 px-4 whitespace-nowrap text-neutral-300">
                  {r.formaPagamento}
                </td>
                <td className="py-2.5 px-4 text-center">
                  <button
                    onClick={() => onDeleteRecord(r.id)}
                    title="Excluir lançamento"
                    className="p-1 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-neutral-500">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
        <div>
          Mostrando{' '}
          <strong className="text-white tabular-nums">
            {records.length > 0 ? (page - 1) * pageSize + 1 : 0}
          </strong>{' '}
          a{' '}
          <strong className="text-white tabular-nums">
            {Math.min(page * pageSize, records.length)}
          </strong>{' '}
          de <strong className="text-white tabular-nums">{records.length}</strong> registros
        </div>

        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200"
          >
            <option value={10}>10 por pág.</option>
            <option value={15}>15 por pág.</option>
            <option value={25}>25 por pág.</option>
            <option value={50}>50 por pág.</option>
          </select>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 bg-neutral-800 text-white rounded disabled:opacity-40 hover:bg-neutral-700 font-medium"
            >
              Anterior
            </button>
            <span className="px-2 font-mono tabular-nums text-white">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-2.5 py-1 bg-neutral-800 text-white rounded disabled:opacity-40 hover:bg-neutral-700 font-medium"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      {/* Add sale modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 rounded-xl shadow-2xl border border-neutral-800 w-full max-w-md p-6 text-white">
            <h3 className="text-base font-bold text-white mb-1">
              Adicionar Lançamento de Venda
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              O faturamento será calculado automaticamente (Quantidade × Preço).
            </p>

            <form onSubmit={handleSubmitNew} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Data da Venda</label>
                <input
                  type="date"
                  required
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Vendedor(a)</label>
                <input
                  type="text"
                  required
                  value={formData.vendedor}
                  onChange={(e) => setFormData({ ...formData, vendedor: e.target.value })}
                  placeholder="Nome do Vendedor(a)"
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Produto</label>
                <input
                  type="text"
                  required
                  value={formData.produto}
                  onChange={(e) => setFormData({ ...formData, produto: e.target.value })}
                  placeholder="Ex: Tênis, Sandália, Chinelo, Rasteirinhas"
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Preço Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: Math.max(0.01, parseFloat(e.target.value) || 0) })}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-400">Faturamento Previsto:</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">
                  {formatBRL(formData.quantidade * formData.preco)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Forma de Pagamento</label>
                <select
                  value={formData.formaPagamento}
                  onChange={(e) => setFormData({ ...formData, formaPagamento: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Pix">Pix</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Boleto Bancário">Boleto Bancário</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Transferência">Transferência</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs"
                >
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
