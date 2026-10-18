import { AssetInfo } from './types';

export type AssetCategory = 'CURRENCIES' | 'CRYPTO' | 'COMMODITIES' | 'STOCKS';
export type Asset = AssetInfo;

export const TRADING_ASSETS: AssetInfo[] = [
  { id: 'EURUSD_OTC', name: 'EUR/USD (OTC)', category: 'CURRENCIES', change24h: 0.18, profit1m: 92, profit5m: 87, flags: 'eu_us', decimals: 5, basePrice: 1.08420 },
  { id: 'GBPUSD_OTC', name: 'GBP/USD (OTC)', category: 'CURRENCIES', change24h: -0.24, profit1m: 90, profit5m: 85, flags: 'gb_us', decimals: 5, basePrice: 1.29150 },
  { id: 'USDJPY_OTC', name: 'USD/JPY (OTC)', category: 'CURRENCIES', change24h: 0.42, profit1m: 89, profit5m: 84, flags: 'us_jp', decimals: 3, basePrice: 154.680 },
  { id: 'AUDUSD_OTC', name: 'AUD/USD (OTC)', category: 'CURRENCIES', change24h: -0.11, profit1m: 88, profit5m: 83, flags: 'au_us', decimals: 5, basePrice: 0.65430 },
  { id: 'USDCAD_OTC', name: 'USD/CAD (OTC)', category: 'CURRENCIES', change24h: 0.05, profit1m: 87, profit5m: 82, flags: 'us_ca', decimals: 5, basePrice: 1.39120 },
  { id: 'EURJPY_OTC', name: 'EUR/JPY (OTC)', category: 'CURRENCIES', change24h: 0.31, profit1m: 88, profit5m: 83, flags: 'eu_jp', decimals: 3, basePrice: 167.720 },
  
  // CRYPTO
  { id: 'BTCUSD', name: 'BTC/USD', category: 'CRYPTO', change24h: 2.45, profit1m: 91, profit5m: 88, flags: 'btc', decimals: 2, basePrice: 68420.50 },
  { id: 'ETHUSD', name: 'ETH/USD', category: 'CRYPTO', change24h: 1.82, profit1m: 89, profit5m: 85, flags: 'eth', decimals: 2, basePrice: 2540.20 },
  { id: 'SOLUSD', name: 'SOL/USD', category: 'CRYPTO', change24h: 4.12, profit1m: 87, profit5m: 82, flags: 'sol', decimals: 2, basePrice: 178.45 },
  
  // COMMODITIES
  { id: 'GOLD_OTC', name: 'Gold (OTC)', category: 'COMMODITIES', change24h: 0.65, profit1m: 93, profit5m: 89, flags: 'gold', decimals: 2, basePrice: 2735.80 },
  { id: 'SILVER_OTC', name: 'Silver (OTC)', category: 'COMMODITIES', change24h: -0.40, profit1m: 86, profit5m: 80, flags: 'silver', decimals: 3, basePrice: 33.720 },
  { id: 'BRENT_CRUDE', name: 'Brent Crude', category: 'COMMODITIES', change24h: 1.15, profit1m: 85, profit5m: 80, flags: 'oil', decimals: 2, basePrice: 74.50 },
  
  // STOCKS
  { id: 'AAPL_OTC', name: 'Apple (OTC)', category: 'STOCKS', change24h: 0.88, profit1m: 89, profit5m: 84, flags: 'aapl', decimals: 2, basePrice: 231.40 },
  { id: 'TSLA_OTC', name: 'Tesla (OTC)', category: 'STOCKS', change24h: 3.20, profit1m: 90, profit5m: 86, flags: 'tsla', decimals: 2, basePrice: 218.70 },
  { id: 'NVDA_OTC', name: 'Nvidia (OTC)', category: 'STOCKS', change24h: 2.10, profit1m: 92, profit5m: 87, flags: 'nvda', decimals: 2, basePrice: 139.80 },
];

export const TIMEFRAMES = [
  { label: '5s', ms: 5000 },
  { label: '10s', ms: 10000 },
  { label: '15s', ms: 15000 },
  { label: '30s', ms: 30000 },
  { label: '1m', ms: 60000 },
  { label: '2m', ms: 120000 },
  { label: '5m', ms: 300000 },
  { label: '10m', ms: 600000 },
  { label: '15m', ms: 900000 },
  { label: '30m', ms: 1800000 },
  { label: '1h', ms: 3600000 },
  { label: '1d', ms: 86400000 },
];

export const DURATION_PRESETS = [
  { label: '00:05', secs: 5 },
  { label: '00:15', secs: 15 },
  { label: '00:30', secs: 30 },
  { label: '01:00', secs: 60 },
  { label: '02:00', secs: 120 },
  { label: '05:00', secs: 300 },
  { label: '15:00', secs: 900 },
  { label: '30:00', secs: 1800 },
  { label: '01:00:00', secs: 3600 },
];

export const ASSETS = TRADING_ASSETS;
