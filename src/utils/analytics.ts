import { SaleRecord, SellerMetric, ProductMetric, TimeMetric, PaymentMetric, DashboardInsights, YoYComparison } from '../types/dashboard';

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 0
  }).format(value || 0);
}

export function formatPercent(value: number): string {
  return `${(value || 0).toFixed(1).replace('.', ',')}%`;
}

export function calculateSummaryMetrics(records: SaleRecord[]) {
  const totalVendas = records.length;
  if (totalVendas === 0) {
    return {
      faturamentoTotal: 0,
      quantidadeTotal: 0,
      ticketMedio: 0,
      precoMedioUnitario: 0,
      totalVendas: 0
    };
  }

  const faturamentoTotal = records.reduce((acc, r) => acc + (r.quantidade * r.preco), 0);
  const quantidadeTotal = records.reduce((acc, r) => acc + r.quantidade, 0);
  const ticketMedio = totalVendas > 0 ? faturamentoTotal / totalVendas : 0;
  const precoMedioUnitario = quantidadeTotal > 0 ? faturamentoTotal / quantidadeTotal : 0;

  return {
    faturamentoTotal,
    quantidadeTotal,
    ticketMedio,
    precoMedioUnitario,
    totalVendas
  };
}

export function calculateSellerRankings(
  records: SaleRecord[],
  sortBy: 'faturamento' | 'quantidade' = 'faturamento'
): SellerMetric[] {
  const totalRevenue = records.reduce((acc, r) => acc + (r.quantidade * r.preco), 0);
  const map = new Map<string, { faturamento: number; quantidade: number; totalVendas: number }>();

  records.forEach(r => {
    const prev = map.get(r.vendedor) || { faturamento: 0, quantidade: 0, totalVendas: 0 };
    const rev = r.quantidade * r.preco;
    map.set(r.vendedor, {
      faturamento: prev.faturamento + rev,
      quantidade: prev.quantidade + r.quantidade,
      totalVendas: prev.totalVendas + 1
    });
  });

  const list: SellerMetric[] = [];
  map.forEach((val, nome) => {
    list.push({
      nome,
      faturamento: val.faturamento,
      quantidade: val.quantidade,
      totalVendas: val.totalVendas,
      ticketMedio: val.totalVendas > 0 ? val.faturamento / val.totalVendas : 0,
      participacaoFaturamento: totalRevenue > 0 ? (val.faturamento / totalRevenue) * 100 : 0
    });
  });

  return list.sort((a, b) => {
    if (sortBy === 'quantidade') {
      return b.quantidade - a.quantidade;
    }
    return b.faturamento - a.faturamento;
  });
}

export function calculateProductComparison(records: SaleRecord[]): ProductMetric[] {
  const totalRevenue = records.reduce((acc, r) => acc + (r.quantidade * r.preco), 0);
  const map = new Map<string, { faturamento: number; quantidade: number; totalVendas: number }>();

  records.forEach(r => {
    const prev = map.get(r.produto) || { faturamento: 0, quantidade: 0, totalVendas: 0 };
    const rev = r.quantidade * r.preco;
    map.set(r.produto, {
      faturamento: prev.faturamento + rev,
      quantidade: prev.quantidade + r.quantidade,
      totalVendas: prev.totalVendas + 1
    });
  });

  const list: ProductMetric[] = [];
  map.forEach((val, produto) => {
    list.push({
      produto,
      faturamento: val.faturamento,
      quantidade: val.quantidade,
      precoMedio: val.quantidade > 0 ? val.faturamento / val.quantidade : 0,
      totalVendas: val.totalVendas,
      participacaoFaturamento: totalRevenue > 0 ? (val.faturamento / totalRevenue) * 100 : 0
    });
  });

  return list.sort((a, b) => b.faturamento - a.faturamento);
}

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function calculateTimeEvolution(
  records: SaleRecord[],
  granularity: 'month' | 'year' = 'month'
): TimeMetric[] {
  const map = new Map<string, { periodo: string; faturamento: number; quantidade: number; totalVendas: number }>();

  records.forEach(r => {
    const [year, month] = r.data.split('-');
    let key = '';
    let label = '';

    if (granularity === 'year') {
      key = year;
      label = year;
    } else {
      key = `${year}-${month}`;
      const mIdx = parseInt(month, 10) - 1;
      label = `${MONTH_NAMES[mIdx] || month}/${year.slice(2)}`;
    }

    const prev = map.get(key) || { periodo: label, faturamento: 0, quantidade: 0, totalVendas: 0 };
    const rev = r.quantidade * r.preco;
    map.set(key, {
      periodo: label,
      faturamento: prev.faturamento + rev,
      quantidade: prev.quantidade + r.quantidade,
      totalVendas: prev.totalVendas + 1
    });
  });

  const sortedKeys = Array.from(map.keys()).sort();

  return sortedKeys.map(key => {
    const val = map.get(key)!;
    return {
      periodo: val.periodo,
      chave: key,
      faturamento: val.faturamento,
      quantidade: val.quantidade,
      totalVendas: val.totalVendas,
      ticketMedio: val.totalVendas > 0 ? val.faturamento / val.totalVendas : 0
    };
  });
}

export function calculatePaymentDistribution(records: SaleRecord[]): PaymentMetric[] {
  const totalRevenue = records.reduce((acc, r) => acc + (r.quantidade * r.preco), 0);
  const map = new Map<string, { faturamento: number; quantidadeVendas: number }>();

  records.forEach(r => {
    const prev = map.get(r.formaPagamento) || { faturamento: 0, quantidadeVendas: 0 };
    const rev = r.quantidade * r.preco;
    map.set(r.formaPagamento, {
      faturamento: prev.faturamento + rev,
      quantidadeVendas: prev.quantidadeVendas + 1
    });
  });

  const list: PaymentMetric[] = [];
  map.forEach((val, forma) => {
    list.push({
      forma,
      faturamento: val.faturamento,
      quantidadeVendas: val.quantidadeVendas,
      percentual: totalRevenue > 0 ? (val.faturamento / totalRevenue) * 100 : 0,
      ticketMedio: val.quantidadeVendas > 0 ? val.faturamento / val.quantidadeVendas : 0
    });
  });

  return list.sort((a, b) => b.faturamento - a.faturamento);
}

export function generateStrategicInsights(records: SaleRecord[]): DashboardInsights {
  if (records.length === 0) {
    return {
      conclusaoGeral: 'Nenhuma transação encontrada no período selecionado. Importe uma planilha ou redefina os filtros.',
      destaqueVendedor: 'Aguardando dados.',
      destaqueProduto: 'Aguardando dados.',
      destaqueTemporal: 'Aguardando dados.',
      destaquePagamento: 'Aguardando dados.'
    };
  }

  const summary = calculateSummaryMetrics(records);
  const sellers = calculateSellerRankings(records, 'faturamento');
  const products = calculateProductComparison(records);
  const payments = calculatePaymentDistribution(records);
  const timeMetrics = calculateTimeEvolution(records, 'month');

  const topSeller = sellers[0];
  const topProductByRev = products[0];
  const topProductByQty = [...products].sort((a, b) => b.quantidade - a.quantidade)[0];
  const topPayment = payments[0];

  // Calculate growth between first and last recorded months if available
  let trendText = '';
  if (timeMetrics.length >= 2) {
    const firstMonth = timeMetrics[0];
    const lastMonth = timeMetrics[timeMetrics.length - 1];
    const peakMonth = [...timeMetrics].sort((a, b) => b.faturamento - a.faturamento)[0];

    const growth = firstMonth.faturamento > 0
      ? ((lastMonth.faturamento - firstMonth.faturamento) / firstMonth.faturamento) * 100
      : 0;

    const sign = growth >= 0 ? '+' : '';
    trendText = `Pico histórico atingido em ${peakMonth.periodo} (${formatBRL(peakMonth.faturamento)}) com variação de ${sign}${growth.toFixed(1).replace('.', ',')}% entre o início e o fechamento do período analisado.`;
  } else {
    trendText = 'Série temporal concentrada em um único período com faturamento constante.';
  }

  // Two leading products share
  const top2Share = products.slice(0, 2).reduce((acc, p) => acc + p.participacaoFaturamento, 0);

  // General concluding sentence (satisfying "Ao menos um insight textual (uma frase de conclusão sobre o que os dados mostram)")
  const conclusaoGeral = `${topProductByRev?.produto || 'O produto principal'} lidera a receita com ${formatPercent(topProductByRev?.participacaoFaturamento || 0)} do faturamento total (${formatBRL(topProductByRev?.faturamento || 0)}), impulsionado pelo desempenho de ${topSeller?.nome || 'nossa equipe'} (responsável por ${formatPercent(topSeller?.participacaoFaturamento || 0)} das vendas), enquanto o método ${topPayment?.forma || 'Pix'} domina ${formatPercent(topPayment?.percentual || 0)} das transações financeiras.`;

  const destaqueVendedor = `${topSeller?.nome || 'N/A'} lidera o ranking geral com faturamento de ${formatBRL(topSeller?.faturamento || 0)} (${topSeller?.quantidade || 0} unidades e ticket médio de ${formatBRL(topSeller?.ticketMedio || 0)}).`;

  const destaqueProduto = topProductByRev?.produto === topProductByQty?.produto
    ? `${topProductByRev?.produto} é o carro-chefe absoluto tanto em faturamento (${formatBRL(topProductByRev?.faturamento)}) quanto em volume (${formatNumber(topProductByRev?.quantidade)} un.).`
    : `${topProductByRev?.produto} lidera em faturamento (${formatBRL(topProductByRev?.faturamento)}), enquanto ${topProductByQty?.produto} domina o volume físico (${formatNumber(topProductByQty?.quantidade)} un.). Os 2 maiores produtos concentram ${formatPercent(top2Share)} de toda a receita.`;

  const destaqueTemporal = trendText;

  const destaquePagamento = `${topPayment?.forma} é a forma de pagamento predominante com ${formatPercent(topPayment?.percentual)} do volume monetário (${formatBRL(topPayment?.faturamento)}), evidenciando rápida liquidação de caixa.`;

  return {
    conclusaoGeral,
    destaqueVendedor,
    destaqueProduto,
    destaqueTemporal,
    destaquePagamento
  };
}

export function calculateYoYComparison(records: SaleRecord[]): YoYComparison {
  // Extract all distinct years
  const yearsSet = new Set<string>();
  records.forEach(r => {
    const y = r.data.split('-')[0];
    if (y) yearsSet.add(y);
  });

  const sortedYears = Array.from(yearsSet).sort().reverse();
  const currentYear = sortedYears[0] || new Date().getFullYear().toString();
  const previousYear = sortedYears[1] || (parseInt(currentYear, 10) - 1).toString();

  const currentRecords = records.filter(r => r.data.startsWith(currentYear));
  const previousRecords = records.filter(r => r.data.startsWith(previousYear));

  const totalRevenueCurrent = currentRecords.reduce((acc, r) => acc + (r.quantidade * r.preco), 0);
  const totalRevenuePrevious = previousRecords.reduce((acc, r) => acc + (r.quantidade * r.preco), 0);
  const totalRevenueGrowth = totalRevenuePrevious > 0
    ? ((totalRevenueCurrent - totalRevenuePrevious) / totalRevenuePrevious) * 100
    : 0;

  const totalQuantityCurrent = currentRecords.reduce((acc, r) => acc + r.quantidade, 0);
  const totalQuantityPrevious = previousRecords.reduce((acc, r) => acc + r.quantidade, 0);
  const totalQuantityGrowth = totalQuantityPrevious > 0
    ? ((totalQuantityCurrent - totalQuantityPrevious) / totalQuantityPrevious) * 100
    : 0;

  // Sellers YoY
  const sellerCurrentMap = new Map<string, { rev: number; qty: number }>();
  currentRecords.forEach(r => {
    const prev = sellerCurrentMap.get(r.vendedor) || { rev: 0, qty: 0 };
    sellerCurrentMap.set(r.vendedor, {
      rev: prev.rev + (r.quantidade * r.preco),
      qty: prev.qty + r.quantidade
    });
  });

  const sellerPreviousMap = new Map<string, { rev: number; qty: number }>();
  previousRecords.forEach(r => {
    const prev = sellerPreviousMap.get(r.vendedor) || { rev: 0, qty: 0 };
    sellerPreviousMap.set(r.vendedor, {
      rev: prev.rev + (r.quantidade * r.preco),
      qty: prev.qty + r.quantidade
    });
  });

  const allSellers = Array.from(new Set([...sellerCurrentMap.keys(), ...sellerPreviousMap.keys()]));
  const sellersYoY = allSellers.map(nome => {
    const curr = sellerCurrentMap.get(nome) || { rev: 0, qty: 0 };
    const prev = sellerPreviousMap.get(nome) || { rev: 0, qty: 0 };
    const growthRevenue = prev.rev > 0 ? ((curr.rev - prev.rev) / prev.rev) * 100 : (curr.rev > 0 ? 100 : 0);
    return {
      nome,
      revenueCurrent: curr.rev,
      revenuePrevious: prev.rev,
      growthRevenue,
      quantityCurrent: curr.qty,
      quantityPrevious: prev.qty
    };
  }).sort((a, b) => b.revenueCurrent - a.revenueCurrent);

  const topSeller = sellersYoY.length > 0 ? {
    nome: sellersYoY[0].nome,
    revenueCurrent: sellersYoY[0].revenueCurrent,
    revenuePrevious: sellersYoY[0].revenuePrevious,
    growth: sellersYoY[0].growthRevenue,
    quantityCurrent: sellersYoY[0].quantityCurrent,
    quantityPrevious: sellersYoY[0].quantityPrevious
  } : null;

  // Products YoY
  const productCurrentMap = new Map<string, { rev: number; qty: number }>();
  currentRecords.forEach(r => {
    const prev = productCurrentMap.get(r.produto) || { rev: 0, qty: 0 };
    productCurrentMap.set(r.produto, {
      rev: prev.rev + (r.quantidade * r.preco),
      qty: prev.qty + r.quantidade
    });
  });

  const productPreviousMap = new Map<string, { rev: number; qty: number }>();
  previousRecords.forEach(r => {
    const prev = productPreviousMap.get(r.produto) || { rev: 0, qty: 0 };
    productPreviousMap.set(r.produto, {
      rev: prev.rev + (r.quantidade * r.preco),
      qty: prev.qty + r.quantidade
    });
  });

  const allProducts = Array.from(new Set([...productCurrentMap.keys(), ...productPreviousMap.keys()]));
  const productsYoY = allProducts.map(produto => {
    const curr = productCurrentMap.get(produto) || { rev: 0, qty: 0 };
    const prev = productPreviousMap.get(produto) || { rev: 0, qty: 0 };
    const growthRevenue = prev.rev > 0 ? ((curr.rev - prev.rev) / prev.rev) * 100 : (curr.rev > 0 ? 100 : 0);
    const growthQuantity = prev.qty > 0 ? ((curr.qty - prev.qty) / prev.qty) * 100 : (curr.qty > 0 ? 100 : 0);
    return {
      produto,
      revenueCurrent: curr.rev,
      revenuePrevious: prev.rev,
      growthRevenue,
      quantityCurrent: curr.qty,
      quantityPrevious: prev.qty,
      growthQuantity
    };
  }).sort((a, b) => b.revenueCurrent - a.revenueCurrent);

  const topProduct = productsYoY.length > 0 ? {
    produto: productsYoY[0].produto,
    revenueCurrent: productsYoY[0].revenueCurrent,
    revenuePrevious: productsYoY[0].revenuePrevious,
    growth: productsYoY[0].growthRevenue,
    quantityCurrent: productsYoY[0].quantityCurrent,
    quantityPrevious: productsYoY[0].quantityPrevious
  } : null;

  return {
    currentYear,
    previousYear,
    totalRevenueCurrent,
    totalRevenuePrevious,
    totalRevenueGrowth,
    totalQuantityCurrent,
    totalQuantityPrevious,
    totalQuantityGrowth,
    topSeller,
    topProduct,
    productsYoY,
    sellersYoY
  };
}

