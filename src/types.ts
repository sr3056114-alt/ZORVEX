export type AccountType = 'REAL' | 'DEMO';

export type ChartType = 'Candles' | 'Area' | 'Bars' | 'Line';

export type TradeDirection = 'BUY' | 'SELL';

export interface AssetInfo {
  id: string;
  name: string;
  category: 'CURRENCIES' | 'CRYPTO' | 'COMMODITIES' | 'STOCKS';
  change24h: number;
  profit1m: number;
  profit5m: number;
  flags?: string;
  decimals?: number;
  basePrice: number;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface TradePosition {
  id: string;
  asset: string;
  direction: TradeDirection;
  amount: number;
  entryPrice: number;
  entryTime: number;
  expireTime: number;
  durationSecs: number;
  payoutRate: number;
  accountType: AccountType;
}

export interface ClosedTrade {
  id: string;
  asset: string;
  direction: TradeDirection;
  amount: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  entryTime: number;
  expireTime: number;
  durationSecs: number;
  isEarlySell?: boolean;
  refundAmount?: number;
  accountType: AccountType;
}

export interface PendingOrder {
  id: string;
  asset: string;
  direction: TradeDirection;
  amount: number;
  payoutRate: number;
  pendingType: 'TIME' | 'QUOTE';
  targetValue: string | number;
  createdAt: number;
}

export interface MarketSignal {
  id: string;
  pair: string;
  direction: TradeDirection;
  probability: number;
  timeframe: string;
}

export interface IndicatorConfig {
  id: string;
  name: string;
  period: number;
  color: string;
  visible: boolean;
}
