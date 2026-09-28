export interface SaleRecord {
  id: string;
  data: string; // ISO YYYY-MM-DD
  vendedor: string;
  produto: string;
  quantidade: number;
  preco: number;
  faturamento: number; // quantidade * preco
  formaPagamento: 'Cartão de Crédito' | 'Pix' | 'Boleto Bancário' | 'Cartão de Débito' | 'Dinheiro' | string;
  regiao?: string;
  observacoes?: string;
}

export interface FilterState {
  periodoInicio: string;
  periodoFim: string;
  vendedor: string;
  produto: string;
  formaPagamento: string;
  busca: string;
}

export interface SellerMetric {
  nome: string;
  faturamento: number;
  quantidade: number;
  totalVendas: number;
  ticketMedio: number;
  participacaoFaturamento: number; // 0 to 100
}

export interface ProductMetric {
  produto: string;
  faturamento: number;
  quantidade: number;
  precoMedio: number;
  totalVendas: number;
  participacaoFaturamento: number; // 0 to 100
}

export interface TimeMetric {
  periodo: string; // e.g. "Jan/25", "2025"
  chave: string; // sort key
  faturamento: number;
  quantidade: number;
  totalVendas: number;
  ticketMedio: number;
}

export interface PaymentMetric {
  forma: string;
  faturamento: number;
  quantidadeVendas: number;
  percentual: number; // 0 to 100
  ticketMedio: number;
}

export interface DashboardInsights {
  conclusaoGeral: string;
  destaqueVendedor: string;
  destaqueProduto: string;
  destaqueTemporal: string;
  destaquePagamento: string;
}

export interface YoYComparison {
  currentYear: string;
  previousYear: string;
  totalRevenueCurrent: number;
  totalRevenuePrevious: number;
  totalRevenueGrowth: number;
  totalQuantityCurrent: number;
  totalQuantityPrevious: number;
  totalQuantityGrowth: number;
  topSeller: {
    nome: string;
    revenueCurrent: number;
    revenuePrevious: number;
    growth: number;
    quantityCurrent: number;
    quantityPrevious: number;
  } | null;
  topProduct: {
    produto: string;
    revenueCurrent: number;
    revenuePrevious: number;
    growth: number;
    quantityCurrent: number;
    quantityPrevious: number;
  } | null;
  productsYoY: {
    produto: string;
    revenueCurrent: number;
    revenuePrevious: number;
    growthRevenue: number;
    quantityCurrent: number;
    quantityPrevious: number;
    growthQuantity: number;
  }[];
  sellersYoY: {
    nome: string;
    revenueCurrent: number;
    revenuePrevious: number;
    growthRevenue: number;
    quantityCurrent: number;
    quantityPrevious: number;
  }[];
}

