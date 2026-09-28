import * as XLSX from 'xlsx';
import { SaleRecord } from '../types/dashboard';

export interface ColumnMapping {
  data: string;
  vendedor: string;
  produto: string;
  quantidade: string;
  preco: string;
  formaPagamento: string;
  regiao?: string;
  faturamento?: string;
}

export interface ParseResult {
  records: SaleRecord[];
  headers: string[];
  detectedMapping: Partial<ColumnMapping>;
  sampleRows: Record<string, any>[];
  errors: string[];
}

// Clean Brazilian or standard numeric representations
export function parseNumberValue(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  
  let s = String(val).trim();
  if (!s) return 0;

  // Remove currency symbols and non-numeric except , . -
  s = s.replace(/[R$\s]/g, '');

  // Handle Brazilian format: "1.250,50" -> "1250.50"
  if (s.includes(',') && s.includes('.')) {
    // If dot comes before comma: 1.250,50
    if (s.indexOf('.') < s.lastIndexOf(',')) {
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      // 1,250.50 (US style)
      s = s.replace(/,/g, '');
    }
  } else if (s.includes(',')) {
    // Only comma e.g. "150,00"
    s = s.replace(',', '.');
  }

  const num = parseFloat(s);
  return isNaN(num) ? 0 : num;
}

// Parse various date strings or Excel serial numbers into YYYY-MM-DD
export function parseDateValue(val: any): string {
  if (!val) return new Date().toISOString().split('T')[0];

  // Excel serial number date
  if (typeof val === 'number') {
    const d = XLSX.SSF.parse_date_code(val);
    if (d) {
      const month = String(d.m).padStart(2, '0');
      const day = String(d.d).padStart(2, '0');
      return `${d.y}-${month}-${day}`;
    }
  }

  const s = String(val).trim();

  // Pattern DD/MM/YYYY or DD-MM-YYYY
  const brMatch = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (brMatch) {
    const day = brMatch[1].padStart(2, '0');
    const month = brMatch[2].padStart(2, '0');
    let year = brMatch[3];
    if (year.length === 2) year = '20' + year;
    return `${year}-${month}-${day}`;
  }

  // ISO pattern YYYY-MM-DD
  const isoMatch = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, '0');
    const day = isoMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(s);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return new Date().toISOString().split('T')[0];
}

// Automatic heuristic header matching
export function detectColumnMapping(headers: string[]): Partial<ColumnMapping> {
  const norm = (h: string) => h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  const mapping: Partial<ColumnMapping> = {};

  const patterns = {
    vendedor: ['vendedor', 'vendedora', 'seller', 'consultor', 'consultora', 'representante', 'funcionario', 'atendente', 'nomevendedor'],
    produto: ['produto', 'item', 'product', 'descricao', 'mercadoria', 'artigo', 'servico'],
    quantidade: ['quantidade', 'qtd', 'quant', 'volume', 'qty', 'unidades', 'itens'],
    preco: ['preco', 'precounitario', 'unitario', 'unitprice', 'valorunitario', 'valordoproduto', 'precounit', 'price'],
    faturamento: ['faturamento', 'total', 'valortotal', 'subtotal', 'receita', 'revenuetotal'],
    formaPagamento: ['formapagamento', 'formadepagamento', 'pagamento', 'meiopagamento', 'metodo', 'tipopagamento', 'payment', 'paymentmethod'],
    data: ['data', 'datavenda', 'datadavenda', 'date', 'dia', 'periodo', 'fechamento'],
    regiao: ['regiao', 'uf', 'estado', 'filial', 'cidade', 'setor']
  };

  headers.forEach(h => {
    const cleaned = norm(h);
    for (const [key, aliases] of Object.entries(patterns)) {
      if (!(mapping as any)[key]) {
        for (const alias of aliases) {
          if (cleaned === alias || cleaned.includes(alias)) {
            (mapping as any)[key] = h;
            break;
          }
        }
      }
    }
  });

  // Fallbacks if not matched yet
  if (!mapping.vendedor) {
    const fallback = headers.find(h => norm(h).includes('nome') || norm(h).includes('rep'));
    if (fallback) mapping.vendedor = fallback;
  }
  if (!mapping.preco && !mapping.faturamento) {
    const fallback = headers.find(h => norm(h).includes('valor'));
    if (fallback) mapping.preco = fallback;
  }

  return mapping;
}

export function parseRawDataToRecords(
  rows: Record<string, any>[],
  customMapping?: Partial<ColumnMapping>
): ParseResult {
  const errors: string[] = [];
  if (!rows || rows.length === 0) {
    return { records: [], headers: [], detectedMapping: {}, sampleRows: [], errors: ['Nenhum dado encontrado no documento.'] };
  }

  const headers = Object.keys(rows[0] || {});
  const mapping = { ...detectColumnMapping(headers), ...customMapping };

  const records: SaleRecord[] = [];

  rows.forEach((row, idx) => {
    // Extract fields
    const dataRaw = mapping.data ? row[mapping.data] : null;
    const vendedorRaw = mapping.vendedor ? row[mapping.vendedor] : 'Vendedor Não Identificado';
    const produtoRaw = mapping.produto ? row[mapping.produto] : `Item ${idx + 1}`;
    const qtdRaw = mapping.quantidade ? row[mapping.quantidade] : 1;
    const precoRaw = mapping.preco ? row[mapping.preco] : null;
    const faturamentoRaw = mapping.faturamento ? row[mapping.faturamento] : null;
    const pagamentoRaw = mapping.formaPagamento ? row[mapping.formaPagamento] : 'Não Informado';
    const regiaoRaw = mapping.regiao ? row[mapping.regiao] : undefined;

    const quantidade = Math.max(1, Math.round(parseNumberValue(qtdRaw)));
    let preco = parseNumberValue(precoRaw);
    let faturamento = parseNumberValue(faturamentoRaw);

    // Reconcile price and revenue
    if (preco <= 0 && faturamento > 0) {
      preco = faturamento / quantidade;
    } else if (faturamento <= 0 && preco > 0) {
      faturamento = quantidade * preco;
    } else if (preco > 0 && faturamento > 0) {
      // User provided both, ensure math is coherent or prioritize Qtd * Preco
      faturamento = quantidade * preco;
    } else {
      // Default price fallback if missing
      preco = 100.00;
      faturamento = quantidade * preco;
    }

    const data = parseDateValue(dataRaw);
    const vendedor = String(vendedorRaw || 'Vendedor Desconhecido').trim();
    const produto = String(produtoRaw || 'Produto Geral').trim();
    const formaPagamento = normalizePaymentMethod(String(pagamentoRaw || 'Cartão de Crédito').trim());

    if (vendedor && produto) {
      records.push({
        id: `IMP-${Date.now().toString(36)}-${(idx + 1).toString().padStart(3, '0')}`,
        data,
        vendedor,
        produto,
        quantidade,
        preco,
        faturamento,
        formaPagamento,
        regiao: regiaoRaw ? String(regiaoRaw).trim() : undefined
      });
    }
  });

  return {
    records,
    headers,
    detectedMapping: mapping,
    sampleRows: rows.slice(0, 5),
    errors
  };
}

function normalizePaymentMethod(val: string): string {
  const v = val.toLowerCase();
  if (v.includes('pix')) return 'Pix';
  if (v.includes('crédito') || v.includes('credito') || v.includes('credit')) return 'Cartão de Crédito';
  if (v.includes('débito') || v.includes('debito') || v.includes('debit')) return 'Cartão de Débito';
  if (v.includes('boleto')) return 'Boleto Bancário';
  if (v.includes('dinheiro') || v.includes('cash')) return 'Dinheiro';
  if (v.includes('transferência') || v.includes('ted') || v.includes('doc')) return 'Transferência';
  return val || 'Outros';
}

export async function parseFile(file: File): Promise<ParseResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    if (extension === 'csv' || extension === 'txt' || extension === 'tsv') {
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          // Use XLSX for universal CSV/TSV handling with delimiter detection
          const workbook = XLSX.read(content, { type: 'string' });
          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];
          const json = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });
          resolve(parseRawDataToRecords(json));
        } catch (err: any) {
          reject(new Error(`Erro ao ler arquivo de texto: ${err.message}`));
        }
      };
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo'));
      reader.readAsText(file);
    } else {
      // Excel binary
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];
          const json = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });
          resolve(parseRawDataToRecords(json));
        } catch (err: any) {
          reject(new Error(`Erro ao processar planilha Excel: ${err.message}`));
        }
      };
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo'));
      reader.readAsArrayBuffer(file);
    }
  });
}
