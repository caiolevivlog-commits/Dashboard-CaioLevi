/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { KpiCards } from './components/KpiCards';
import { InsightBanner } from './components/InsightBanner';
import { YoYHighlights } from './components/YoYHighlights';
import { SellerRankingChart } from './components/SellerRankingChart';
import { ProductComparisonChart } from './components/ProductComparisonChart';
import { SalesEvolutionChart } from './components/SalesEvolutionChart';
import { PaymentMethodChart } from './components/PaymentMethodChart';
import { SalesDataTable } from './components/SalesDataTable';
import { ImportModal } from './components/ImportModal';
import { INITIAL_SALES_DATA, generateSampleCsv } from './data/initialSalesData';
import { SaleRecord, FilterState } from './types/dashboard';
import {
  calculateSummaryMetrics,
  calculateSellerRankings,
  calculateProductComparison,
  calculateTimeEvolution,
  calculatePaymentDistribution,
  generateStrategicInsights,
  calculateYoYComparison,
} from './utils/analytics';
import { testFirestoreConnection } from './firebase';
import {
  subscribeToSales,
  addSaleToFirestore,
  deleteSaleFromFirestore,
  batchSaveSalesToFirestore,
  seedInitialSalesIfEmpty,
} from './services/salesService';

export default function App() {
  // Product migration map
  const migrateProduct = (prod: string): string => {
    const p = prod.trim();
    if (p.toLowerCase() === 'produto a') return 'Tênis';
    if (p.toLowerCase() === 'produto b') return 'Sandália';
    if (p.toLowerCase() === 'produto c') return 'Chinelo';
    if (p.toLowerCase() === 'produto d') return 'Rasteirinhas';
    if (p.toLowerCase() === 'produto e') return 'Sapatilhas';
    return prod;
  };

  // Load initial data from localStorage if available, or fallback to INITIAL_SALES_DATA
  const [salesData, setSalesData] = useState<SaleRecord[]>(() => {
    try {
      const stored = localStorage.getItem('vendas_bi_dataset_calcados') || localStorage.getItem('vendas_bi_dataset');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: SaleRecord) => ({
            ...item,
            produto: migrateProduct(item.produto)
          }));
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_SALES_DATA;
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);

  const [filters, setFilters] = useState<FilterState>({
    periodoInicio: '',
    periodoFim: '',
    vendedor: 'all',
    produto: 'all',
    formaPagamento: 'all',
    busca: '',
  });

  // Initialize and synchronize with Firestore in real-time
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initFirestore() {
      try {
        await testFirestoreConnection();
        await seedInitialSalesIfEmpty();

        unsubscribe = subscribeToSales(
          (records) => {
            if (records && records.length > 0) {
              setSalesData(records);
            }
            setIsFirestoreConnected(true);
          },
          (err) => {
            console.warn('Firestore subscription error:', err);
          }
        );
      } catch (err) {
        console.warn('Firestore initialization warning:', err);
      }
    }

    initFirestore();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Save to local storage as client-side cache
  useEffect(() => {
    try {
      localStorage.setItem('vendas_bi_dataset_calcados', JSON.stringify(salesData));
    } catch {
      // ignore
    }
  }, [salesData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Unique filter options
  const availableSellers = useMemo(() => {
    return Array.from(new Set(salesData.map((s) => s.vendedor))).sort();
  }, [salesData]);

  const availableProducts = useMemo(() => {
    return Array.from(new Set(salesData.map((s) => s.produto))).sort();
  }, [salesData]);

  const availablePaymentMethods = useMemo(() => {
    return Array.from(new Set(salesData.map((s) => s.formaPagamento))).sort();
  }, [salesData]);

  // Filtering engine
  const filteredData = useMemo(() => {
    return salesData.filter((item) => {
      // Search term
      if (filters.busca.trim()) {
        const query = filters.busca.toLowerCase();
        const match =
          item.vendedor.toLowerCase().includes(query) ||
          item.produto.toLowerCase().includes(query) ||
          item.formaPagamento.toLowerCase().includes(query) ||
          (item.regiao && item.regiao.toLowerCase().includes(query));
        if (!match) return false;
      }

      // Seller filter
      if (filters.vendedor !== 'all' && item.vendedor !== filters.vendedor) {
        return false;
      }

      // Product filter
      if (filters.produto !== 'all' && item.produto !== filters.produto) {
        return false;
      }

      // Payment filter
      if (filters.formaPagamento !== 'all' && item.formaPagamento !== filters.formaPagamento) {
        return false;
      }

      // Date range
      if (filters.periodoInicio && item.data < filters.periodoInicio) {
        return false;
      }
      if (filters.periodoFim && item.data > filters.periodoFim) {
        return false;
      }

      return true;
    });
  }, [salesData, filters]);

  // Analytical aggregates
  const summaryMetrics = useMemo(() => calculateSummaryMetrics(filteredData), [filteredData]);
  const sellerMetrics = useMemo(() => calculateSellerRankings(filteredData), [filteredData]);
  const productMetrics = useMemo(() => calculateProductComparison(filteredData), [filteredData]);
  const monthEvolution = useMemo(() => calculateTimeEvolution(filteredData, 'month'), [filteredData]);
  const yearEvolution = useMemo(() => calculateTimeEvolution(filteredData, 'year'), [filteredData]);
  const paymentMetrics = useMemo(() => calculatePaymentDistribution(filteredData), [filteredData]);
  const insights = useMemo(() => generateStrategicInsights(filteredData), [filteredData]);
  const yoyMetrics = useMemo(() => calculateYoYComparison(salesData), [salesData]);

  // Handlers
  const handleImportComplete = (records: SaleRecord[], mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      setSalesData(records);
      batchSaveSalesToFirestore(records, 'replace').catch(console.error);
      showToast(`${records.length} transações importadas e sincronizadas no Firebase.`);
    } else {
      setSalesData((prev) => [...prev, ...records]);
      batchSaveSalesToFirestore(records, 'append').catch(console.error);
      showToast(`${records.length} novas transações adicionadas e sincronizadas no Firebase.`);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar a base de dados de vendas de demonstração?')) {
      setSalesData(INITIAL_SALES_DATA);
      batchSaveSalesToFirestore(INITIAL_SALES_DATA, 'replace').catch(console.error);
      setFilters({
        periodoInicio: '',
        periodoFim: '',
        vendedor: 'all',
        produto: 'all',
        formaPagamento: 'all',
        busca: '',
      });
      showToast('Dados de demonstração restaurados no Firebase.');
    }
  };

  const handleDownloadSample = () => {
    const csvContent = generateSampleCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'planilha_modelo_vendas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Planilha modelo (.csv) baixada.');
  };

  const handleExportFilteredCsv = () => {
    const header = 'Data;Vendedor;Produto;Quantidade;Preco_Unitario;Faturamento;Forma_Pagamento;Regiao\n';
    const rows = filteredData
      .map(
        (s) =>
          `${s.data};${s.vendedor};${s.produto};${s.quantidade};${s.preco.toFixed(2).replace('.', ',')};${s.faturamento.toFixed(2).replace('.', ',')};${s.formaPagamento};${s.regiao || 'Geral'}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_vendas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Relatório analítico exportado.');
  };

  const handleAddRecord = (record: Omit<SaleRecord, 'id' | 'faturamento'>) => {
    const newRecord: SaleRecord = {
      ...record,
      id: `MAN-${Date.now().toString(36)}`,
      faturamento: record.quantidade * record.preco,
    };
    setSalesData((prev) => [newRecord, ...prev]);
    addSaleToFirestore(newRecord).catch(console.error);
    showToast('Nova venda cadastrada e gravada no Firebase.');
  };

  const handleDeleteRecord = (id: string) => {
    setSalesData((prev) => prev.filter((r) => r.id !== id));
    deleteSaleFromFirestore(id).catch(console.error);
    showToast('Registro excluído do Firebase.');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col text-white selection:bg-indigo-600 selection:text-white">
      {/* Top Bar with Brand, Tabs, Filter option and Import Action Button */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenImport={() => setIsImportModalOpen(true)}
        onResetData={handleResetData}
        onDownloadSample={handleDownloadSample}
        totalRecords={salesData.length}
        filters={filters}
        onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
        onResetFilters={() =>
          setFilters({
            periodoInicio: '',
            periodoFim: '',
            vendedor: 'all',
            produto: 'all',
            formaPagamento: 'all',
            busca: '',
          })
        }
        availableSellers={availableSellers}
        availableProducts={availableProducts}
        availablePaymentMethods={availablePaymentMethods}
        totalFiltered={filteredData.length}
        firebaseConnected={isFirestoreConnected}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Tab-driven Content Views */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 1. O PRIMEIRO A APARECER NA TELA INICIAL: RANKING DE VENDEDORES (GRÁFICO CIRCULAR) */}
            <SellerRankingChart
              sellers={sellerMetrics}
              selectedSeller={filters.vendedor}
              defaultView="circular"
              onSelectSeller={(sellerName) =>
                setFilters((prev) => ({ ...prev, vendedor: sellerName }))
              }
            />

            {/* 2. Destaques de Vendedor(a) e Produtos Comparados ao Ano Anterior (Clean & Funcional) */}
            <YoYHighlights yoy={yoyMetrics} />

            {/* 3. Textual Strategic Insights (Requirement: Ao menos um insight textual) */}
            <InsightBanner insights={insights} />

            {/* 4. KPI Cards (Requirement: Faturamento total no período = QUANTIDADE × PREÇO) */}
            <KpiCards
              faturamentoTotal={summaryMetrics.faturamentoTotal}
              quantidadeTotal={summaryMetrics.quantidadeTotal}
              ticketMedio={summaryMetrics.ticketMedio}
              precoMedioUnitario={summaryMetrics.precoMedioUnitario}
              totalVendas={summaryMetrics.totalVendas}
            />

            {/* 5. Comparativo de Produtos & Distribuição por Pagamento */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ProductComparisonChart
                  products={productMetrics}
                  selectedProduct={filters.produto}
                  onSelectProduct={(productName) =>
                    setFilters((prev) => ({ ...prev, produto: productName }))
                  }
                />
              </div>
              <div className="lg:col-span-5">
                <PaymentMethodChart
                  payments={paymentMetrics}
                  selectedPayment={filters.formaPagamento}
                  onSelectPayment={(paymentName) =>
                    setFilters((prev) => ({ ...prev, formaPagamento: paymentName }))
                  }
                />
              </div>
            </div>

            {/* 6. Evolução das Vendas ao Longo do Tempo */}
            <SalesEvolutionChart
              monthData={monthEvolution}
              yearData={yearEvolution}
            />

            {/* 7. Base de Vendas preview */}
            <SalesDataTable
              records={filteredData}
              onAddRecord={handleAddRecord}
              onDeleteRecord={handleDeleteRecord}
              onExportCsv={handleExportFilteredCsv}
            />
          </div>
        )}

        {activeTab === 'sellers' && (
          <div className="space-y-6">
            <SellerRankingChart
              sellers={sellerMetrics}
              selectedSeller={filters.vendedor}
              onSelectSeller={(sellerName) =>
                setFilters((prev) => ({ ...prev, vendedor: sellerName }))
              }
            />
            <SalesDataTable
              records={filteredData}
              onAddRecord={handleAddRecord}
              onDeleteRecord={handleDeleteRecord}
              onExportCsv={handleExportFilteredCsv}
            />
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <ProductComparisonChart
              products={productMetrics}
              selectedProduct={filters.produto}
              onSelectProduct={(productName) =>
                setFilters((prev) => ({ ...prev, produto: productName }))
              }
            />
            <SalesDataTable
              records={filteredData}
              onAddRecord={handleAddRecord}
              onDeleteRecord={handleDeleteRecord}
              onExportCsv={handleExportFilteredCsv}
            />
          </div>
        )}

        {activeTab === 'evolution' && (
          <div className="space-y-6">
            <SalesEvolutionChart
              monthData={monthEvolution}
              yearData={yearEvolution}
            />
            <SalesDataTable
              records={filteredData}
              onAddRecord={handleAddRecord}
              onDeleteRecord={handleDeleteRecord}
              onExportCsv={handleExportFilteredCsv}
            />
          </div>
        )}

        {activeTab === 'table' && (
          <div className="space-y-6">
            <SalesDataTable
              records={filteredData}
              onAddRecord={handleAddRecord}
              onDeleteRecord={handleDeleteRecord}
              onExportCsv={handleExportFilteredCsv}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-black py-6 mt-12 text-center text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-white font-medium">
            CAIO LEVI · Painel Executivo Dashboard
          </span>
          <span className="font-mono text-[11px] text-neutral-500">
            Fórmula: Faturamento = Quantidade × Preço Unitário
          </span>
        </div>
      </footer>

      {/* Document Importer Modal (Triggered by the '+' Import Button) */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
        onDownloadSample={handleDownloadSample}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-neutral-700 flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
