import { SaleRecord } from '../types/dashboard';

export const INITIAL_SALES_DATA: SaleRecord[] = [
  // 2025 - Q1
  { id: 'REC-001', data: '2025-01-05', vendedor: 'Carlos Mendes', produto: 'Sandália', quantidade: 14, preco: 320.00, faturamento: 4480.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-002', data: '2025-01-09', vendedor: 'Mariana Souza', produto: 'Tênis', quantidade: 28, preco: 150.00, faturamento: 4200.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sul' },
  { id: 'REC-003', data: '2025-01-14', vendedor: 'Roberto Lima', produto: 'Rasteirinhas', quantidade: 8, preco: 490.00, faturamento: 3920.00, formaPagamento: 'Boleto Bancário', regiao: 'Nordeste' },
  { id: 'REC-004', data: '2025-01-18', vendedor: 'Juliana Ramos', produto: 'Chinelo', quantidade: 45, preco: 85.00, faturamento: 3825.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-005', data: '2025-01-22', vendedor: 'Lucas Fernandes', produto: 'Sapatilhas', quantidade: 16, preco: 210.00, faturamento: 3360.00, formaPagamento: 'Cartão de Débito', regiao: 'Centro-Oeste' },
  { id: 'REC-006', data: '2025-01-27', vendedor: 'Carlos Mendes', produto: 'Rasteirinhas', quantidade: 12, preco: 490.00, faturamento: 5880.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sudeste' },

  { id: 'REC-007', data: '2025-02-03', vendedor: 'Mariana Souza', produto: 'Sandália', quantidade: 22, preco: 320.00, faturamento: 7040.00, formaPagamento: 'Pix', regiao: 'Sul' },
  { id: 'REC-008', data: '2025-02-08', vendedor: 'Roberto Lima', produto: 'Tênis', quantidade: 35, preco: 150.00, faturamento: 5250.00, formaPagamento: 'Cartão de Crédito', regiao: 'Nordeste' },
  { id: 'REC-009', data: '2025-02-14', vendedor: 'Juliana Ramos', produto: 'Rasteirinhas', quantidade: 15, preco: 490.00, faturamento: 7350.00, formaPagamento: 'Boleto Bancário', regiao: 'Sudeste' },
  { id: 'REC-010', data: '2025-02-19', vendedor: 'Carlos Mendes', produto: 'Chinelo', quantidade: 60, preco: 85.00, faturamento: 5100.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-011', data: '2025-02-24', vendedor: 'Lucas Fernandes', produto: 'Sandália', quantidade: 18, preco: 320.00, faturamento: 5760.00, formaPagamento: 'Cartão de Crédito', regiao: 'Centro-Oeste' },

  { id: 'REC-012', data: '2025-03-02', vendedor: 'Mariana Souza', produto: 'Rasteirinhas', quantidade: 20, preco: 490.00, faturamento: 9800.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sul' },
  { id: 'REC-013', data: '2025-03-07', vendedor: 'Carlos Mendes', produto: 'Tênis', quantidade: 40, preco: 150.00, faturamento: 6000.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-014', data: '2025-03-12', vendedor: 'Roberto Lima', produto: 'Sapatilhas', quantidade: 25, preco: 210.00, faturamento: 5250.00, formaPagamento: 'Cartão de Débito', regiao: 'Nordeste' },
  { id: 'REC-015', data: '2025-03-18', vendedor: 'Juliana Ramos', produto: 'Sandália', quantidade: 30, preco: 320.00, faturamento: 9600.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-016', data: '2025-03-24', vendedor: 'Lucas Fernandes', produto: 'Tênis', quantidade: 32, preco: 150.00, faturamento: 4800.00, formaPagamento: 'Boleto Bancário', regiao: 'Centro-Oeste' },

  // 2025 - Q2
  { id: 'REC-017', data: '2025-04-04', vendedor: 'Carlos Mendes', produto: 'Sandália', quantidade: 28, preco: 320.00, faturamento: 8960.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sudeste' },
  { id: 'REC-018', data: '2025-04-10', vendedor: 'Mariana Souza', produto: 'Chinelo', quantidade: 55, preco: 85.00, faturamento: 4675.00, formaPagamento: 'Pix', regiao: 'Sul' },
  { id: 'REC-019', data: '2025-04-15', vendedor: 'Roberto Lima', produto: 'Rasteirinhas', quantidade: 14, preco: 490.00, faturamento: 6860.00, formaPagamento: 'Cartão de Crédito', regiao: 'Nordeste' },
  { id: 'REC-020', data: '2025-04-22', vendedor: 'Juliana Ramos', produto: 'Tênis', quantidade: 48, preco: 150.00, faturamento: 7200.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-021', data: '2025-04-28', vendedor: 'Lucas Fernandes', produto: 'Sapatilhas', quantidade: 22, preco: 210.00, faturamento: 4620.00, formaPagamento: 'Cartão de Débito', regiao: 'Centro-Oeste' },

  { id: 'REC-022', data: '2025-05-06', vendedor: 'Mariana Souza', produto: 'Sandália', quantidade: 35, preco: 320.00, faturamento: 11200.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sul' },
  { id: 'REC-023', data: '2025-05-12', vendedor: 'Carlos Mendes', produto: 'Rasteirinhas', quantidade: 22, preco: 490.00, faturamento: 10780.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-024', data: '2025-05-17', vendedor: 'Roberto Lima', produto: 'Chinelo', quantidade: 65, preco: 85.00, faturamento: 5525.00, formaPagamento: 'Boleto Bancário', regiao: 'Nordeste' },
  { id: 'REC-025', data: '2025-05-23', vendedor: 'Juliana Ramos', produto: 'Sapatilhas', quantidade: 30, preco: 210.00, faturamento: 6300.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-026', data: '2025-05-29', vendedor: 'Lucas Fernandes', produto: 'Sandália', quantidade: 25, preco: 320.00, faturamento: 8000.00, formaPagamento: 'Cartão de Crédito', regiao: 'Centro-Oeste' },

  { id: 'REC-027', data: '2025-06-03', vendedor: 'Carlos Mendes', produto: 'Tênis', quantidade: 50, preco: 150.00, faturamento: 7500.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-028', data: '2025-06-09', vendedor: 'Mariana Souza', produto: 'Rasteirinhas', quantidade: 24, preco: 490.00, faturamento: 11760.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sul' },
  { id: 'REC-029', data: '2025-06-15', vendedor: 'Roberto Lima', produto: 'Sandália', quantidade: 32, preco: 320.00, faturamento: 10240.00, formaPagamento: 'Pix', regiao: 'Nordeste' },
  { id: 'REC-030', data: '2025-06-21', vendedor: 'Juliana Ramos', produto: 'Chinelo', quantidade: 70, preco: 85.00, faturamento: 5950.00, formaPagamento: 'Boleto Bancário', regiao: 'Sudeste' },
  { id: 'REC-031', data: '2025-06-27', vendedor: 'Lucas Fernandes', produto: 'Rasteirinhas', quantidade: 18, preco: 490.00, faturamento: 8820.00, formaPagamento: 'Pix', regiao: 'Centro-Oeste' },

  // 2025 - Q3
  { id: 'REC-032', data: '2025-07-04', vendedor: 'Carlos Mendes', produto: 'Sandália', quantidade: 38, preco: 320.00, faturamento: 12160.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sudeste' },
  { id: 'REC-033', data: '2025-07-11', vendedor: 'Mariana Souza', produto: 'Tênis', quantidade: 55, preco: 150.00, faturamento: 8250.00, formaPagamento: 'Pix', regiao: 'Sul' },
  { id: 'REC-034', data: '2025-07-16', vendedor: 'Roberto Lima', produto: 'Sapatilhas', quantidade: 28, preco: 210.00, faturamento: 5880.00, formaPagamento: 'Cartão de Débito', regiao: 'Nordeste' },
  { id: 'REC-035', data: '2025-07-22', vendedor: 'Juliana Ramos', produto: 'Rasteirinhas', quantidade: 26, preco: 490.00, faturamento: 12740.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sudeste' },
  { id: 'REC-036', data: '2025-07-28', vendedor: 'Lucas Fernandes', produto: 'Chinelo', quantidade: 80, preco: 85.00, faturamento: 6800.00, formaPagamento: 'Pix', regiao: 'Centro-Oeste' },

  { id: 'REC-037', data: '2025-08-05', vendedor: 'Carlos Mendes', produto: 'Rasteirinhas', quantidade: 30, preco: 490.00, faturamento: 14700.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-038', data: '2025-08-12', vendedor: 'Mariana Souza', produto: 'Sandália', quantidade: 42, preco: 320.00, faturamento: 13440.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sul' },
  { id: 'REC-039', data: '2025-08-18', vendedor: 'Roberto Lima', produto: 'Tênis', quantidade: 60, preco: 150.00, faturamento: 9000.00, formaPagamento: 'Boleto Bancário', regiao: 'Nordeste' },
  { id: 'REC-040', data: '2025-08-25', vendedor: 'Juliana Ramos', produto: 'Sapatilhas', quantidade: 35, preco: 210.00, faturamento: 7350.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-041', data: '2025-08-30', vendedor: 'Lucas Fernandes', produto: 'Sandália', quantidade: 30, preco: 320.00, faturamento: 9600.00, formaPagamento: 'Cartão de Crédito', regiao: 'Centro-Oeste' },

  { id: 'REC-042', data: '2025-09-03', vendedor: 'Mariana Souza', produto: 'Rasteirinhas', quantidade: 28, preco: 490.00, faturamento: 13720.00, formaPagamento: 'Pix', regiao: 'Sul' },
  { id: 'REC-043', data: '2025-09-09', vendedor: 'Carlos Mendes', produto: 'Sandália', quantidade: 45, preco: 320.00, faturamento: 14400.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sudeste' },
  { id: 'REC-044', data: '2025-09-15', vendedor: 'Roberto Lima', produto: 'Chinelo', quantidade: 95, preco: 85.00, faturamento: 8075.00, formaPagamento: 'Pix', regiao: 'Nordeste' },
  { id: 'REC-045', data: '2025-09-21', vendedor: 'Juliana Ramos', produto: 'Tênis', quantidade: 62, preco: 150.00, faturamento: 9300.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sudeste' },
  { id: 'REC-046', data: '2025-09-27', vendedor: 'Lucas Fernandes', produto: 'Sapatilhas', quantidade: 38, preco: 210.00, faturamento: 7980.00, formaPagamento: 'Boleto Bancário', regiao: 'Centro-Oeste' },

  // 2025 - Q4
  { id: 'REC-047', data: '2025-10-04', vendedor: 'Carlos Mendes', produto: 'Rasteirinhas', quantidade: 34, preco: 490.00, faturamento: 16660.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sudeste' },
  { id: 'REC-048', data: '2025-10-10', vendedor: 'Mariana Souza', produto: 'Sandália', quantidade: 48, preco: 320.00, faturamento: 15360.00, formaPagamento: 'Pix', regiao: 'Sul' },
  { id: 'REC-049', data: '2025-10-17', vendedor: 'Roberto Lima', produto: 'Sapatilhas', quantidade: 42, preco: 210.00, faturamento: 8820.00, formaPagamento: 'Cartão de Débito', regiao: 'Nordeste' },
  { id: 'REC-050', data: '2025-10-23', vendedor: 'Juliana Ramos', produto: 'Chinelo', quantidade: 110, preco: 85.00, faturamento: 9350.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-051', data: '2025-10-29', vendedor: 'Lucas Fernandes', produto: 'Tênis', quantidade: 70, preco: 150.00, faturamento: 10500.00, formaPagamento: 'Cartão de Crédito', regiao: 'Centro-Oeste' },

  { id: 'REC-052', data: '2025-11-05', vendedor: 'Carlos Mendes', produto: 'Sandália', quantidade: 55, preco: 320.00, faturamento: 17600.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-053', data: '2025-11-12', vendedor: 'Mariana Souza', produto: 'Rasteirinhas', quantidade: 38, preco: 490.00, faturamento: 18620.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sul' },
  { id: 'REC-054', data: '2025-11-18', vendedor: 'Roberto Lima', produto: 'Tênis', quantidade: 75, preco: 150.00, faturamento: 11250.00, formaPagamento: 'Boleto Bancário', regiao: 'Nordeste' },
  { id: 'REC-055', data: '2025-11-24', vendedor: 'Juliana Ramos', produto: 'Sandália', quantidade: 44, preco: 320.00, faturamento: 14080.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-056', data: '2025-11-28', vendedor: 'Lucas Fernandes', produto: 'Rasteirinhas', quantidade: 30, preco: 490.00, faturamento: 14700.00, formaPagamento: 'Cartão de Crédito', regiao: 'Centro-Oeste' },

  { id: 'REC-057', data: '2025-12-03', vendedor: 'Carlos Mendes', produto: 'Rasteirinhas', quantidade: 42, preco: 490.00, faturamento: 20580.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-058', data: '2025-12-08', vendedor: 'Mariana Souza', produto: 'Sandália', quantidade: 60, preco: 320.00, faturamento: 19200.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sul' },
  { id: 'REC-059', data: '2025-12-14', vendedor: 'Juliana Ramos', produto: 'Tênis', quantidade: 90, preco: 150.00, faturamento: 13500.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-060', data: '2025-12-18', vendedor: 'Roberto Lima', produto: 'Sapatilhas', quantidade: 50, preco: 210.00, faturamento: 10500.00, formaPagamento: 'Boleto Bancário', regiao: 'Nordeste' },
  { id: 'REC-061', data: '2025-12-22', vendedor: 'Lucas Fernandes', produto: 'Sandália', quantidade: 45, preco: 320.00, faturamento: 14400.00, formaPagamento: 'Cartão de Crédito', regiao: 'Centro-Oeste' },
  { id: 'REC-062', data: '2025-12-27', vendedor: 'Carlos Mendes', produto: 'Tênis', quantidade: 80, preco: 150.00, faturamento: 12000.00, formaPagamento: 'Pix', regiao: 'Sudeste' },

  // 2026 - Q1
  { id: 'REC-063', data: '2026-01-08', vendedor: 'Carlos Mendes', produto: 'Sandália', quantidade: 50, preco: 320.00, faturamento: 16000.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-064', data: '2026-01-14', vendedor: 'Mariana Souza', produto: 'Rasteirinhas', quantidade: 36, preco: 490.00, faturamento: 17640.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sul' },
  { id: 'REC-065', data: '2026-01-20', vendedor: 'Roberto Lima', produto: 'Chinelo', quantidade: 120, preco: 85.00, faturamento: 10200.00, formaPagamento: 'Pix', regiao: 'Nordeste' },
  { id: 'REC-066', data: '2026-01-26', vendedor: 'Juliana Ramos', produto: 'Sapatilhas', quantidade: 48, preco: 210.00, faturamento: 10080.00, formaPagamento: 'Cartão de Débito', regiao: 'Sudeste' },

  { id: 'REC-067', data: '2026-02-04', vendedor: 'Mariana Souza', produto: 'Sandália', quantidade: 56, preco: 320.00, faturamento: 17920.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sul' },
  { id: 'REC-068', data: '2026-02-11', vendedor: 'Carlos Mendes', produto: 'Rasteirinhas', quantidade: 40, preco: 490.00, faturamento: 19600.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-069', data: '2026-02-17', vendedor: 'Roberto Lima', produto: 'Tênis', quantidade: 85, preco: 150.00, faturamento: 12750.00, formaPagamento: 'Boleto Bancário', regiao: 'Nordeste' },
  { id: 'REC-070', data: '2026-02-23', vendedor: 'Lucas Fernandes', produto: 'Chinelo', quantidade: 130, preco: 85.00, faturamento: 11050.00, formaPagamento: 'Pix', regiao: 'Centro-Oeste' },

  { id: 'REC-071', data: '2026-03-05', vendedor: 'Carlos Mendes', produto: 'Sandália', quantidade: 62, preco: 320.00, faturamento: 19840.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sudeste' },
  { id: 'REC-072', data: '2026-03-12', vendedor: 'Mariana Souza', produto: 'Tênis', quantidade: 95, preco: 150.00, faturamento: 14250.00, formaPagamento: 'Pix', regiao: 'Sul' },
  { id: 'REC-073', data: '2026-03-18', vendedor: 'Juliana Ramos', produto: 'Rasteirinhas', quantidade: 44, preco: 490.00, faturamento: 21560.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sudeste' },
  { id: 'REC-074', data: '2026-03-24', vendedor: 'Roberto Lima', produto: 'Sapatilhas', quantidade: 54, preco: 210.00, faturamento: 11340.00, formaPagamento: 'Pix', regiao: 'Nordeste' },
  { id: 'REC-075', data: '2026-03-29', vendedor: 'Lucas Fernandes', produto: 'Sandália', quantidade: 48, preco: 320.00, faturamento: 15360.00, formaPagamento: 'Cartão de Crédito', regiao: 'Centro-Oeste' },

  // 2026 - Q2 & Q3 (up to current)
  { id: 'REC-076', data: '2026-04-06', vendedor: 'Carlos Mendes', produto: 'Rasteirinhas', quantidade: 46, preco: 490.00, faturamento: 22540.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-077', data: '2026-04-14', vendedor: 'Mariana Souza', produto: 'Sandália', quantidade: 65, preco: 320.00, faturamento: 20800.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sul' },
  { id: 'REC-078', data: '2026-04-20', vendedor: 'Juliana Ramos', produto: 'Chinelo', quantidade: 140, preco: 85.00, faturamento: 11900.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-079', data: '2026-04-26', vendedor: 'Lucas Fernandes', produto: 'Tênis', quantidade: 90, preco: 150.00, faturamento: 13500.00, formaPagamento: 'Boleto Bancário', regiao: 'Centro-Oeste' },

  { id: 'REC-080', data: '2026-05-08', vendedor: 'Carlos Mendes', produto: 'Sandália', quantidade: 70, preco: 320.00, faturamento: 22400.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sudeste' },
  { id: 'REC-081', data: '2026-05-15', vendedor: 'Mariana Souza', produto: 'Rasteirinhas', quantidade: 50, preco: 490.00, faturamento: 24500.00, formaPagamento: 'Pix', regiao: 'Sul' },
  { id: 'REC-082', data: '2026-05-22', vendedor: 'Roberto Lima', produto: 'Sapatilhas', quantidade: 60, preco: 210.00, faturamento: 12600.00, formaPagamento: 'Cartão de Débito', regiao: 'Nordeste' },
  { id: 'REC-083', data: '2026-05-28', vendedor: 'Juliana Ramos', produto: 'Sandália', quantidade: 58, preco: 320.00, faturamento: 18560.00, formaPagamento: 'Pix', regiao: 'Sudeste' },

  { id: 'REC-084', data: '2026-06-05', vendedor: 'Carlos Mendes', produto: 'Rasteirinhas', quantidade: 52, preco: 490.00, faturamento: 25480.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sudeste' },
  { id: 'REC-085', data: '2026-06-12', vendedor: 'Mariana Souza', produto: 'Tênis', quantidade: 110, preco: 150.00, faturamento: 16500.00, formaPagamento: 'Pix', regiao: 'Sul' },
  { id: 'REC-086', data: '2026-06-19', vendedor: 'Lucas Fernandes', produto: 'Sandália', quantidade: 55, preco: 320.00, faturamento: 17600.00, formaPagamento: 'Cartão de Crédito', regiao: 'Centro-Oeste' },
  { id: 'REC-087', data: '2026-06-25', vendedor: 'Roberto Lima', produto: 'Chinelo', quantidade: 150, preco: 85.00, faturamento: 12750.00, formaPagamento: 'Boleto Bancário', regiao: 'Nordeste' },

  { id: 'REC-088', data: '2026-07-07', vendedor: 'Carlos Mendes', produto: 'Sandália', quantidade: 75, preco: 320.00, faturamento: 24000.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-089', data: '2026-07-15', vendedor: 'Mariana Souza', produto: 'Rasteirinhas', quantidade: 55, preco: 490.00, faturamento: 26950.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sul' },
  { id: 'REC-090', data: '2026-07-22', vendedor: 'Juliana Ramos', produto: 'Tênis', quantidade: 115, preco: 150.00, faturamento: 17250.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-091', data: '2026-07-29', vendedor: 'Lucas Fernandes', produto: 'Sapatilhas', quantidade: 65, preco: 210.00, faturamento: 13650.00, formaPagamento: 'Cartão de Débito', regiao: 'Centro-Oeste' },

  { id: 'REC-092', data: '2026-08-04', vendedor: 'Mariana Souza', produto: 'Sandália', quantidade: 78, preco: 320.00, faturamento: 24960.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sul' },
  { id: 'REC-093', data: '2026-08-11', vendedor: 'Carlos Mendes', produto: 'Rasteirinhas', quantidade: 58, preco: 490.00, faturamento: 28420.00, formaPagamento: 'Pix', regiao: 'Sudeste' },
  { id: 'REC-094', data: '2026-08-18', vendedor: 'Roberto Lima', produto: 'Tênis', quantidade: 120, preco: 150.00, faturamento: 18000.00, formaPagamento: 'Boleto Bancário', regiao: 'Nordeste' },
  { id: 'REC-095', data: '2026-08-25', vendedor: 'Juliana Ramos', produto: 'Sandália', quantidade: 68, preco: 320.00, faturamento: 21760.00, formaPagamento: 'Pix', regiao: 'Sudeste' },

  { id: 'REC-096', data: '2026-09-02', vendedor: 'Carlos Mendes', produto: 'Sandália', quantidade: 82, preco: 320.00, faturamento: 26240.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sudeste' },
  { id: 'REC-097', data: '2026-09-09', vendedor: 'Mariana Souza', produto: 'Rasteirinhas', quantidade: 60, preco: 490.00, faturamento: 29400.00, formaPagamento: 'Pix', regiao: 'Sul' },
  { id: 'REC-098', data: '2026-09-16', vendedor: 'Juliana Ramos', produto: 'Chinelo', quantidade: 165, preco: 85.00, faturamento: 14025.00, formaPagamento: 'Cartão de Crédito', regiao: 'Sudeste' },
  { id: 'REC-099', data: '2026-09-22', vendedor: 'Lucas Fernandes', produto: 'Tênis', quantidade: 125, preco: 150.00, faturamento: 18750.00, formaPagamento: 'Pix', regiao: 'Centro-Oeste' },
  { id: 'REC-100', data: '2026-09-26', vendedor: 'Roberto Lima', produto: 'Sapatilhas', quantidade: 72, preco: 210.00, faturamento: 15120.00, formaPagamento: 'Boleto Bancário', regiao: 'Nordeste' }
];

export function generateSampleCsv(): string {
  const header = 'Data;Vendedor;Produto;Quantidade;Preco_Unitario;Forma_Pagamento;Regiao\n';
  const rows = INITIAL_SALES_DATA.slice(0, 30).map(s => 
    `${s.data};${s.vendedor};${s.produto};${s.quantidade};${s.preco.toFixed(2).replace('.', ',')};${s.formaPagamento};${s.regiao || 'Geral'}`
  ).join('\n');
  return header + rows;
}
