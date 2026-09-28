import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, X, CheckCircle, AlertTriangle, Download, ArrowRight } from 'lucide-react';
import { parseFile, parseRawDataToRecords, ColumnMapping, ParseResult } from '../utils/importer';
import { SaleRecord } from '../types/dashboard';
import { formatBRL } from '../utils/analytics';
import * as XLSX from 'xlsx';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (records: SaleRecord[], mode: 'replace' | 'append') => void;
  onDownloadSample: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
  onDownloadSample,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  
  // Parse state
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [activeTab, setActiveTab] = useState<'file' | 'paste'>('file');
  const [pastedText, setPastedText] = useState('');
  
  // Custom manual mappings
  const [customMapping, setCustomMapping] = useState<Partial<ColumnMapping>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await parseFile(file);
      if (result.records.length === 0) {
        setErrorMessage('Nenhum registro válido pôde ser extraído deste arquivo.');
      } else {
        setParseResult(result);
        setCustomMapping(result.detectedMapping);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao processar o arquivo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleProcessPasted = () => {
    if (!pastedText.trim()) {
      setErrorMessage('Cole os dados tabulados ou CSV na caixa de texto.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const workbook = XLSX.read(pastedText, { type: 'string' });
      const sheetName = workbook.SheetNames[0];
      const json = XLSX.utils.sheet_to_json<Record<string, any>>(workbook.Sheets[sheetName], { defval: '' });
      const result = parseRawDataToRecords(json);
      if (result.records.length === 0) {
        setErrorMessage('Não foi possível identificar linhas e colunas válidas no texto colado.');
      } else {
        setParseResult(result);
        setCustomMapping(result.detectedMapping);
      }
    } catch (err: any) {
      setErrorMessage(`Erro ao interpretar texto colado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (!parseResult || parseResult.records.length === 0) return;
    onImportComplete(parseResult.records, importMode);
    onClose();
  };

  const handleResetModal = () => {
    setParseResult(null);
    setErrorMessage(null);
    setPastedText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto text-white">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 w-full max-w-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Importar Planilha de Calçados & Vendas
              </h3>
              <p className="text-xs text-neutral-400">
                Formatos compatíveis: .xlsx, .xls, .csv, .tsv ou colagem de tabela
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-lg flex items-center gap-2.5 text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!parseResult ? (
            <>
              {/* Mode Tabs */}
              <div className="flex items-center gap-2 p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('file')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    activeTab === 'file'
                      ? 'bg-neutral-800 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Carregar Arquivo (.xlsx / .csv)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    activeTab === 'paste'
                      ? 'bg-neutral-800 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Colar Células de Tabela
                </button>
              </div>

              {activeTab === 'file' ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-indigo-500 bg-indigo-950/30'
                      : 'border-neutral-750 hover:border-indigo-500/80 bg-neutral-950/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv,.tsv,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3 border border-indigo-500/30">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    Arraste sua planilha aqui ou <span className="text-indigo-400 underline">clique para selecionar</span>
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Excel (.xlsx, .xls) ou Texto delimitado (.csv com ponto-e-vírgula ou vírgula)
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={6}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Copie as colunas da sua planilha (Data, Vendedor, Produto, Quantidade, Preço, Forma de Pagamento) e cole aqui..."
                    className="w-full p-3 text-xs font-mono bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    onClick={handleProcessPasted}
                    disabled={loading || !pastedText.trim()}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    Interpretar Dados Colados
                  </button>
                </div>
              )}

              {/* Sample helper bar */}
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white block">Precisa de um modelo pronto?</span>
                  <span className="text-neutral-400">Baixe um exemplo com as colunas formatadas (Data, Vendedor, Produto, Qtd, Preço).</span>
                </div>
                <button
                  type="button"
                  onClick={onDownloadSample}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white rounded-lg font-medium shadow-2xs hover:bg-neutral-800 transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Modelo CSV</span>
                </button>
              </div>
            </>
          ) : (
            /* Preview and Column Mapper step */
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-800/80 p-3 rounded-xl text-emerald-300 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>
                    <strong className="text-white">{parseResult.records.length} transações</strong> detectadas e validadas com sucesso!
                  </span>
                </div>
                <button
                  onClick={handleResetModal}
                  className="text-xs text-emerald-300 font-semibold underline hover:text-white"
                >
                  Trocar Arquivo
                </button>
              </div>

              {/* Detected columns badge checklist */}
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
                <span className="font-semibold text-neutral-300 block mb-2">
                  Mapeamento Automático de Colunas:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                    <span className="text-neutral-400 block">Vendedor(a):</span>
                    <strong className="text-indigo-400 truncate block">
                      {parseResult.detectedMapping.vendedor || 'Padrão / Automático'}
                    </strong>
                  </div>
                  <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                    <span className="text-neutral-400 block">Calçado:</span>
                    <strong className="text-cyan-400 truncate block">
                      {parseResult.detectedMapping.produto || 'Padrão / Automático'}
                    </strong>
                  </div>
                  <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                    <span className="text-neutral-400 block">Quantidade:</span>
                    <strong className="text-emerald-400 truncate block">
                      {parseResult.detectedMapping.quantidade || 'Padrão / Automático'}
                    </strong>
                  </div>
                  <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                    <span className="text-neutral-400 block">Preço Unitário:</span>
                    <strong className="text-amber-400 truncate block">
                      {parseResult.detectedMapping.preco || 'Calculado'}
                    </strong>
                  </div>
                  <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                    <span className="text-neutral-400 block">Data:</span>
                    <strong className="text-neutral-200 truncate block">
                      {parseResult.detectedMapping.data || 'Padrão / Hoje'}
                    </strong>
                  </div>
                  <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                    <span className="text-neutral-400 block">Forma Pagamento:</span>
                    <strong className="text-violet-400 truncate block">
                      {parseResult.detectedMapping.formaPagamento || 'Automático'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Sample parsed table preview */}
              <div>
                <span className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Prévia dos Primeiros Registros (Qtd × Preço = Faturamento):
                </span>
                <div className="border border-neutral-800 rounded-lg overflow-x-auto max-h-44 text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-950 text-neutral-400 font-semibold sticky top-0">
                      <tr>
                        <th className="p-2">Data</th>
                        <th className="p-2">Vendedor</th>
                        <th className="p-2">Calçado</th>
                        <th className="p-2 text-right">Qtd</th>
                        <th className="p-2 text-right">Preço</th>
                        <th className="p-2 text-right">Faturamento</th>
                        <th className="p-2">Pagamento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-neutral-300">
                      {parseResult.records.slice(0, 5).map((r, i) => (
                        <tr key={i} className="hover:bg-neutral-850">
                          <td className="p-2 font-mono">{r.data}</td>
                          <td className="p-2 font-medium text-white">{r.vendedor}</td>
                          <td className="p-2 text-cyan-300">{r.produto}</td>
                          <td className="p-2 text-right font-mono">{r.quantidade}</td>
                          <td className="p-2 text-right font-mono">{formatBRL(r.preco)}</td>
                          <td className="p-2 text-right font-mono font-bold text-white">{formatBRL(r.faturamento)}</td>
                          <td className="p-2">{r.formaPagamento}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mode Selector */}
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-neutral-300">Ação ao importar:</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-indigo-500"
                    />
                    <span>Substituir base existente</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-indigo-500"
                    />
                    <span>Acrescentar aos dados atuais</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Cancelar
          </button>

          {parseResult && (
            <button
              onClick={handleConfirmImport}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors"
            >
              <span>Confirmar & Atualizar Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
