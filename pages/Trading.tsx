import { io } from 'socket.io-client';
import { useToast } from '../src/components/Toast';
import MiniChart from '../src/components/MiniChart';
import DepositWithdrawalModal from '../src/components/DepositWithdrawalModal';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

import { db, auth } from '../src/firebase';
import { doc, setDoc, updateDoc, collection, onSnapshot, query, orderBy, limit, addDoc } from 'firebase/firestore';


import { useNavigate } from 'react-router-dom';
import { useBalance } from '../App';
import { 
  Bell, ChevronDown, ChevronUp, Camera, Plus, Minus, BarChart2, HelpCircle, User, Trophy, 
  ShoppingBag, MoreHorizontal, Settings, Volume2, Users, LogOut, Menu,
  PenTool, Compass, Clock, ArrowUp, ArrowDown, ArrowUpCircle, ArrowDownCircle,
  Grid, LineChart, Info, PlaySquare, X, Search, Star, Check, GraduationCap, Send, Eye, EyeOff, RefreshCw, Maximize, Scan, Megaphone, TrendingUp, TrendingDown,
  Pencil, LayoutGrid } from 'lucide-react';
import { createChart, ColorType, IChartApi, ISeriesApi, Time, CandlestickSeries, AreaSeries, BarSeries, LineSeries, IPriceLine, HistogramSeries } from 'lightweight-charts';
import AccountView from '../src/components/views/AccountView';
import TournamentView from '../src/components/views/TournamentView';
import HistoryView from '../src/components/views/HistoryView';
import SupportView from '../src/components/views/SupportView';
import MarketView from '../src/components/views/MarketView';
import MoreView from '../src/components/views/MoreView';
import { IndicatorEngine, IndicatorSettings, getDefaultIndicatorSettings, INDICATOR_REGISTRY } from '../src/utils/IndicatorEngine';
import { IndicatorSettingsDrawer } from '../src/components/IndicatorSettingsDrawer';
import { ChartDrawingOverlay, DrawingShape, DrawingPoint } from '../src/components/ChartDrawingOverlay';
import { DrawingsMenu, IndicatorsMenu, TimeframePopup, ChartTypePopup, ChartMenuType } from "../src/components/views/ChartToolMenus";
import FullscreenModal from '../src/components/views/FullscreenModal';
import PromotionDashboard from '../src/components/views/PromotionDashboard';
import OnboardingTutorialModal, { TutorialStep } from '../src/components/OnboardingTutorialModal';
import { ExchangeFormModal } from '../src/components/ExchangeFormModal';
import { CURRENCIES, getCurrencyByCode, CurrencyInfo } from '../src/data/currencies';
import { PairInformationModal } from '../src/components/PairInformationModal';
import { useLanguage } from '../src/context/LanguageContext';
import { QuotexTradeClosedPopup, ClosedTradeData } from '../src/components/QuotexTradeClosedPopup';


export type AssetInfo = {
  id: string;
  name: string;
  category: 'CURRENCIES' | 'CRYPTO' | 'COMMODITIES' | 'STOCKS';
  change24h: number;
  profit1m: number;
  profit5m: number;
  flags: string;
};

const currencyToFlag: Record<string, string> = {
  AUD: 'au', BRL: 'br', CAD: 'ca', CHF: 'ch', COP: 'co',
  EUR: 'eu', GBP: 'gb', IDR: 'id', INR: 'in', JPY: 'jp',
  MXN: 'mx', NGN: 'ng', NZD: 'nz', PHP: 'ph', PKR: 'pk',
  USD: 'us', ZAR: 'za', DZD: 'dz', BDT: 'bd', ARS: 'ar',
  EGP: 'eg',
};

const cryptoTickers: Record<string, string> = {
  'Axie Infinity (OTC)': 'axs',
  'Binance Coin (OTC)': 'bnb',
  'Ethereum Classic (OTC)': 'etc',
  'Solana (OTC)': 'sol',
  'Zcash (OTC)': 'zec',
  'Ripple (OTC)': 'xrp',
  'Toncoin (OTC)': 'ton',
  'Dash (OTC)': 'dash',
  'Polkadot (OTC)': 'dot',
  'Avalanche (OTC)': 'avax',
  'Bitcoin Cash (OTC)': 'bch',
  'Trump (OTC)': 'maga', 
  'Cosmos (OTC)': 'atom',
  'Bitcoin (OTC)': 'btc',
  'Ethereum (OTC)': 'eth',
  'Chainlink (OTC)': 'link',
  'Litecoin (OTC)': 'ltc',
};

const stockToFlag: Record<string, string> = {
  'Nikkei 225': 'jp',
  'S&P/ASX 200': 'au',
  'FTSE China A50 Index': 'cn',
  'CAC 40': 'fr',
  'FTSE 100': 'gb',
  'Hong Kong 50': 'hk',
  'IBEX 35': 'es',
  'EURO STOXX 50': 'eu',
};

const CommodityIcon = ({ name }: { name: string }) => {
  if (name.includes('Crude') || name.includes('Brent')) {


  return (
      <div className="w-[18px] h-[18px] rounded-full z-10 bg-[#1f2937] border border-[#1f2631] flex items-center justify-center shadow-[1px_0_4px_rgba(0,0,0,0.4)]">
        <div className="w-1.5 h-2 bg-white rounded-full rounded-t-[100%]"></div>
      </div>
    );
  }
  if (name.includes('Gold')) {
    return (
      <div className="w-[18px] h-[18px] rounded-full z-10 bg-[#f59e0b] border border-[#1f2631] flex flex-col items-center justify-center gap-[1px] shadow-[1px_0_4px_rgba(0,0,0,0.4)]">
        <div className="w-1 h-1 bg-white rounded-full"></div>
        <div className="flex gap-[1px]">
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    );
  }
  if (name.includes('Silver')) {
    return (
      <div className="w-[18px] h-[18px] rounded-full z-10 bg-[#9ca3af] border border-[#1f2631] flex flex-col items-center justify-center gap-[1px] shadow-[1px_0_4px_rgba(0,0,0,0.4)]">
        <div className="w-1 h-1 bg-white rounded-full"></div>
        <div className="flex gap-[1px]">
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    );
  }
  return <div className="w-[18px] h-[18px] rounded-full z-10 bg-gray-500 border border-[#1f2631] shadow-[1px_0_4px_rgba(0,0,0,0.4)]"></div>;
};

const CryptoIcon = ({ symbol, name }: { symbol: string, name: string }) => {
  const [error, setError] = useState(false);
  if (error || !symbol) {
    return <div className="w-[18px] h-[18px] rounded-full z-10 flex items-center justify-center bg-[var(--hover-bg)] text-[10px] font-bold border border-[#1f2631] text-[var(--text-primary)] shadow-[1px_0_4px_rgba(0,0,0,0.4)]">{name[0]}</div>;
  }
  return <img src={`https://assets.coincap.io/assets/icons/${symbol}@2x.png`} onError={() => setError(true)} className="w-[18px] h-[18px] rounded-full object-cover z-10 bg-[var(--bg-panel)] border border-[#1f2631] shadow-[1px_0_4px_rgba(0,0,0,0.4)]" alt={name} />
};

export const AssetIcon = ({ asset }: { asset: AssetInfo }) => {
  if (asset.category === 'CURRENCIES') {
    const match = asset.name.match(/^([A-Z]{3})\/([A-Z]{3})/);
    if (match) {
      const base = currencyToFlag[match[1]];
      const quote = currencyToFlag[match[2]];
      if (base && quote) {
        return (
          <div className="flex items-center shrink-0 mr-1.5">
            <img src={`https://flagcdn.com/w40/${base}.png`} className="w-[18px] h-[18px] rounded-full object-cover z-10 shadow-[1px_0_4px_rgba(0,0,0,0.4)] border border-[#1f2631]" alt={match[1]} />
            <img src={`https://flagcdn.com/w40/${quote}.png`} className="w-[18px] h-[18px] rounded-full object-cover -ml-[7px] z-0 border border-[#1f2631]" alt={match[2]} />
          </div>
        );
      }
    }
  } else if (asset.category === 'STOCKS') {
    const flag = stockToFlag[asset.name];
    if (flag) {
      return (
        <div className="flex items-center shrink-0 mr-2 opacity-80">
          <img src={`https://flagcdn.com/w40/${flag}.png`} className="w-[14px] h-[14px] rounded-full object-cover border border-[#1f2631]" alt={asset.name} />
        </div>
      );
    }
  } else if (asset.category === 'COMMODITIES') {
    return (
      <div className="flex items-center shrink-0 mr-1.5">
        <CommodityIcon name={asset.name} />
        <img src={`https://flagcdn.com/w40/us.png`} className="w-[18px] h-[18px] rounded-full object-cover -ml-[7px] z-0 border border-[#1f2631]" alt="US" />
      </div>
    );
  } else if (asset.category === 'CRYPTO') {
    const symbol = cryptoTickers[asset.name];
    return (
      <div className="flex items-center shrink-0 mr-1.5">
        <CryptoIcon symbol={symbol} name={asset.name} />
        <img src={`https://flagcdn.com/w40/us.png`} className="w-[18px] h-[18px] rounded-full object-cover -ml-[7px] z-0 border border-[#1f2631]" alt="US" />
      </div>
    );
  }
  return <span className="text-lg tracking-[-0.2em] mr-1">{asset.flags}</span>;
};

export const QUOTEX_ASSETS: AssetInfo[] = [
  // Currencies
  { id: 'nzd_jpy_otc', name: 'NZD/JPY (OTC)', category: 'CURRENCIES', change24h: 2.88, profit1m: 98, profit5m: 98, flags: '🇳🇿🇯🇵' },
  { id: 'usd_zar_otc', name: 'USD/ZAR (OTC)', category: 'CURRENCIES', change24h: -0.03, profit1m: 98, profit5m: 98, flags: '🇺🇸🇿🇦' },
  { id: 'usd_pkr_otc', name: 'USD/PKR (OTC)', category: 'CURRENCIES', change24h: -0.42, profit1m: 98, profit5m: 98, flags: '🇺🇸🇵🇰' },
  { id: 'nzd_chf_otc', name: 'NZD/CHF (OTC)', category: 'CURRENCIES', change24h: -1.18, profit1m: 98, profit5m: 98, flags: '🇳🇿🇨🇭' },
  { id: 'usd_dzd_otc', name: 'USD/DZD (OTC)', category: 'CURRENCIES', change24h: 0, profit1m: 96, profit5m: 98, flags: '🇺🇸🇩🇿' },
  { id: 'usd_idr_otc', name: 'USD/IDR (OTC)', category: 'CURRENCIES', change24h: -0.4, profit1m: 95, profit5m: 98, flags: '🇺🇸🇮🇩' },
  { id: 'usd_php_otc', name: 'USD/PHP (OTC)', category: 'CURRENCIES', change24h: 0, profit1m: 93, profit5m: 93, flags: '🇺🇸🇵🇭' },
  { id: 'usd_bdt_otc', name: 'USD/BDT (OTC)', category: 'CURRENCIES', change24h: -1.88, profit1m: 92, profit5m: 88, flags: '🇺🇸🇧🇩' },
  { id: 'usd_mxn_otc', name: 'USD/MXN (OTC)', category: 'CURRENCIES', change24h: 0.01, profit1m: 91, profit5m: 97, flags: '🇺🇸🇲🇽' },
  { id: 'nzd_cad_otc', name: 'NZD/CAD (OTC)', category: 'CURRENCIES', change24h: -2.86, profit1m: 89, profit5m: 89, flags: '🇳🇿🇨🇦' },
  { id: 'usd_brl_otc', name: 'USD/BRL (OTC)', category: 'CURRENCIES', change24h: -1.43, profit1m: 88, profit5m: 94, flags: '🇺🇸🇧🇷' },
  { id: 'cad_chf_otc', name: 'CAD/CHF (OTC)', category: 'CURRENCIES', change24h: -1.39, profit1m: 77, profit5m: 77, flags: '🇨🇦🇨🇭' },
  { id: 'usd_ars_otc', name: 'USD/ARS (OTC)', category: 'CURRENCIES', change24h: -0.06, profit1m: 77, profit5m: 77, flags: '🇺🇸🇦🇷' },
  { id: 'usd_cop_otc', name: 'USD/COP (OTC)', category: 'CURRENCIES', change24h: 0.75, profit1m: 77, profit5m: 77, flags: '🇺🇸🇨🇴' },
  { id: 'usd_egp_otc', name: 'USD/EGP (OTC)', category: 'CURRENCIES', change24h: -0.52, profit1m: 77, profit5m: 77, flags: '🇺🇸🇪🇬' },
  { id: 'usd_inr_otc', name: 'USD/INR (OTC)', category: 'CURRENCIES', change24h: -0.14, profit1m: 77, profit5m: 81, flags: '🇺🇸🇮🇳' },
  { id: 'usd_ngn_otc', name: 'USD/NGN (OTC)', category: 'CURRENCIES', change24h: 0, profit1m: 77, profit5m: 85, flags: '🇺🇸🇳🇬' },
  { id: 'gbp_nzd_otc', name: 'GBP/NZD (OTC)', category: 'CURRENCIES', change24h: -2.04, profit1m: 76, profit5m: 78, flags: '🇬🇧🇳🇿' },
  { id: 'aud_nzd_otc', name: 'AUD/NZD (OTC)', category: 'CURRENCIES', change24h: 0.88, profit1m: 74, profit5m: 72, flags: '🇦🇺🇳🇿' },
  { id: 'eur_nzd_otc', name: 'EUR/NZD (OTC)', category: 'CURRENCIES', change24h: -3.15, profit1m: 56, profit5m: 65, flags: '🇪🇺🇳🇿' },
  { id: 'eur_jpy', name: 'EUR/JPY', category: 'CURRENCIES', change24h: -0.02, profit1m: 55, profit5m: 80, flags: '🇪🇺🇯🇵' },
  { id: 'eur_usd', name: 'EUR/USD', category: 'CURRENCIES', change24h: 0.04, profit1m: 55, profit5m: 90, flags: '🇪🇺🇺🇸' },
  { id: 'gbp_jpy', name: 'GBP/JPY', category: 'CURRENCIES', change24h: -0.1, profit1m: 55, profit5m: 90, flags: '🇬🇧🇯🇵' },
  { id: 'nzd_usd_otc', name: 'NZD/USD (OTC)', category: 'CURRENCIES', change24h: 1.11, profit1m: 55, profit5m: 66, flags: '🇳🇿🇺🇸' },
  { id: 'usd_jpy', name: 'USD/JPY', category: 'CURRENCIES', change24h: -0.06, profit1m: 55, profit5m: 88, flags: '🇺🇸🇯🇵' },
  { id: 'aud_jpy', name: 'AUD/JPY', category: 'CURRENCIES', change24h: -0.52, profit1m: 50, profit5m: 90, flags: '🇦🇺🇯🇵' },
  { id: 'cad_jpy', name: 'CAD/JPY', category: 'CURRENCIES', change24h: -0.16, profit1m: 50, profit5m: 70, flags: '🇨🇦🇯🇵' },
  { id: 'chf_jpy', name: 'CHF/JPY', category: 'CURRENCIES', change24h: -0.11, profit1m: 50, profit5m: 90, flags: '🇨🇭🇯🇵' },
  { id: 'eur_aud', name: 'EUR/AUD', category: 'CURRENCIES', change24h: 0.5, profit1m: 50, profit5m: 85, flags: '🇪🇺🇦🇺' },
  { id: 'aud_chf', name: 'AUD/CHF', category: 'CURRENCIES', change24h: -0.41, profit1m: 35, profit5m: 70, flags: '🇦🇺🇨🇭' },
  { id: 'eur_cad', name: 'EUR/CAD', category: 'CURRENCIES', change24h: 0.14, profit1m: 35, profit5m: 80, flags: '🇪🇺🇨🇦' },
  { id: 'eur_chf', name: 'EUR/CHF', category: 'CURRENCIES', change24h: 0.09, profit1m: 35, profit5m: 70, flags: '🇪🇺🇨🇭' },
  { id: 'gbp_usd', name: 'GBP/USD', category: 'CURRENCIES', change24h: -0.04, profit1m: 35, profit5m: 85, flags: '🇬🇧🇺🇸' },
  { id: 'usd_cad', name: 'USD/CAD', category: 'CURRENCIES', change24h: 0.1, profit1m: 35, profit5m: 85, flags: '🇺🇸🇨🇦' },
  { id: 'aud_cad', name: 'AUD/CAD', category: 'CURRENCIES', change24h: -0.37, profit1m: 33, profit5m: 88, flags: '🇦🇺🇨🇦' },
  { id: 'aud_usd', name: 'AUD/USD', category: 'CURRENCIES', change24h: -0.46, profit1m: 30, profit5m: 70, flags: '🇦🇺🇺🇸' },
  { id: 'gbp_aud', name: 'GBP/AUD', category: 'CURRENCIES', change24h: 0.42, profit1m: 30, profit5m: 75, flags: '🇬🇧🇦🇺' },
  { id: 'eur_gbp', name: 'EUR/GBP', category: 'CURRENCIES', change24h: 0.09, profit1m: 20, profit5m: 70, flags: '🇪🇺🇬🇧' },
  { id: 'gbp_cad', name: 'GBP/CAD', category: 'CURRENCIES', change24h: 0.05, profit1m: 20, profit5m: 70, flags: '🇬🇧🇨🇦' },
  { id: 'gbp_chf', name: 'GBP/CHF', category: 'CURRENCIES', change24h: 0, profit1m: 20, profit5m: 70, flags: '🇬🇧🇨🇭' },
  { id: 'usd_chf', name: 'USD/CHF', category: 'CURRENCIES', change24h: 0.05, profit1m: 20, profit5m: 75, flags: '🇺🇸🇨🇭' },
  
  // Crypto
  { id: 'axie_infinity_otc', name: 'Axie Infinity (OTC)', category: 'CRYPTO', change24h: -25.25, profit1m: 92, profit5m: 92, flags: '🪙🇺🇸' },
  { id: 'binance_coin_otc', name: 'Binance Coin (OTC)', category: 'CRYPTO', change24h: -3.09, profit1m: 92, profit5m: 87, flags: '🔶🇺🇸' },
  { id: 'eth_classic_otc', name: 'Ethereum Classic (OTC)', category: 'CRYPTO', change24h: 24, profit1m: 92, profit5m: 79, flags: '⟠🇺🇸' },
  { id: 'solana_otc', name: 'Solana (OTC)', category: 'CRYPTO', change24h: -13.06, profit1m: 92, profit5m: 91, flags: '◎🇺🇸' },
  { id: 'zcash_otc', name: 'Zcash (OTC)', category: 'CRYPTO', change24h: -5.01, profit1m: 92, profit5m: 88, flags: 'ⓩ🇺🇸' },
  { id: 'ripple_otc', name: 'Ripple (OTC)', category: 'CRYPTO', change24h: -3.25, profit1m: 91, profit5m: 68, flags: '✕🇺🇸' },
  { id: 'toncoin_otc', name: 'Toncoin (OTC)', category: 'CRYPTO', change24h: -8.9, profit1m: 89, profit5m: 80, flags: '💎🇺🇸' },
  { id: 'dash_otc', name: 'Dash (OTC)', category: 'CRYPTO', change24h: -1.41, profit1m: 84, profit5m: 75, flags: 'Đ🇺🇸' },
  { id: 'polkadot_otc', name: 'Polkadot (OTC)', category: 'CRYPTO', change24h: -7.46, profit1m: 83, profit5m: 83, flags: '🟣🇺🇸' },
  { id: 'avalanche_otc', name: 'Avalanche (OTC)', category: 'CRYPTO', change24h: 6.8, profit1m: 81, profit5m: 58, flags: '🔺🇺🇸' },
  { id: 'bitcoin_cash_otc', name: 'Bitcoin Cash (OTC)', category: 'CRYPTO', change24h: -15.48, profit1m: 79, profit5m: 66, flags: '₿🇺🇸' },
  { id: 'trump_otc', name: 'Trump (OTC)', category: 'CRYPTO', change24h: -5.41, profit1m: 76, profit5m: 60, flags: '🇺🇸🇺🇸' },
  { id: 'cosmos_otc', name: 'Cosmos (OTC)', category: 'CRYPTO', change24h: -2.84, profit1m: 75, profit5m: 57, flags: '🌌🇺🇸' },
  { id: 'bitcoin_otc', name: 'Bitcoin (OTC)', category: 'CRYPTO', change24h: 12.4, profit1m: 71, profit5m: 74, flags: '₿🇺🇸' },
  { id: 'ethereum_otc', name: 'Ethereum (OTC)', category: 'CRYPTO', change24h: 9.21, profit1m: 45, profit5m: 46, flags: '⟠🇺🇸' },
  { id: 'chainlink_otc', name: 'Chainlink (OTC)', category: 'CRYPTO', change24h: 8.02, profit1m: 37, profit5m: 21, flags: '🔗🇺🇸' },
  { id: 'litecoin_otc', name: 'Litecoin (OTC)', category: 'CRYPTO', change24h: 1.72, profit1m: 30, profit5m: 36, flags: 'Ł🇺🇸' },

  // Commodities
  { id: 'ukbrent_otc', name: 'UKBrent (OTC)', category: 'COMMODITIES', change24h: -3.26, profit1m: 92, profit5m: 79, flags: '🛢️🇺🇸' },
  { id: 'uscrude_otc', name: 'USCrude (OTC)', category: 'COMMODITIES', change24h: -0.88, profit1m: 92, profit5m: 92, flags: '🛢️🇺🇸' },
  { id: 'gold', name: 'Gold', category: 'COMMODITIES', change24h: -0.9, profit1m: 40, profit5m: 40, flags: '🥇🇺🇸' },
  { id: 'silver', name: 'Silver', category: 'COMMODITIES', change24h: -3.49, profit1m: 20, profit5m: 40, flags: '🥈🇺🇸' },

  // Stocks
  { id: 'nikkei_225', name: 'Nikkei 225', category: 'STOCKS', change24h: -3.65, profit1m: 32, profit5m: 40, flags: '🇯🇵' },
  { id: 'sp_asx_200', name: 'S&P/ASX 200', category: 'STOCKS', change24h: -0.68, profit1m: 20, profit5m: 20, flags: '🇦🇺' },
  { id: 'ftse_china_a50', name: 'FTSE China A50 Index', category: 'STOCKS', change24h: 0, profit1m: 20, profit5m: 20, flags: '🇨🇳' },
  { id: 'cac_40', name: 'CAC 40', category: 'STOCKS', change24h: -0.76, profit1m: 20, profit5m: 20, flags: '🇫🇷' },
  { id: 'ftse_100', name: 'FTSE 100', category: 'STOCKS', change24h: -0.13, profit1m: 20, profit5m: 20, flags: '🇬🇧' },
  { id: 'hong_kong_50', name: 'Hong Kong 50', category: 'STOCKS', change24h: 0.74, profit1m: 20, profit5m: 20, flags: '🇭🇰' },
  { id: 'ibex_35', name: 'IBEX 35', category: 'STOCKS', change24h: -0.21, profit1m: 20, profit5m: 20, flags: '🇪🇸' },
  { id: 'euro_stoxx_50', name: 'EURO STOXX 50', category: 'STOCKS', change24h: -0.81, profit1m: 20, profit5m: 20, flags: '🇪🇺' },
];

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type BinaryPosition = {
  id: string;
  type: 'UP' | 'DOWN';
  amount: number;
  entryPrice: number;
  entryTime: number;
  expireTime: number;
  asset: string;
  payoutRate: number;
  line?: IPriceLine;
  priceHistory?: number[];
  sellDecayPoints?: number[];
};

const generateSellDecay = (): number[] => {
  const steps: number[] = [0.40];
  let cur = 0.40;
  while (cur > 0.01) {
    const drop = 0.015 + Math.random() * 0.025;
    cur = Math.max(0, cur - drop);
    steps.push(Number(cur.toFixed(3)));
  }
  steps.push(0);
  return steps;
};

type TradeHistoryItem = BinaryPosition & {
  exitPrice: number;
  pnl: number;
  timestamp: number;
  priceHistory?: number[];
};

// UUID generator for Quotex Trade ID (Images 1 & 3)
const generateTradeUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Format Quotex Timestamp: YYYY-MM-DD HH:mm:ss.ms (Image 1)
const formatQuotexTimestamp = (ms: number, isClose: boolean = false) => {
  const d = new Date(ms);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const YYYY = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const DD = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  const msPart = isClose ? '000' : pad(Math.floor(d.getMilliseconds() / 10));
  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}.${msPart}`;
};

// 12 AM to 12 PM session reset filter (Image 2 logic)
const isWithinSessionWindow = (timestamp: number) => {
  const now = new Date();
  const tradeDate = new Date(timestamp);
  
  // If trade is not from today (past midnight), it is expired and hidden
  if (now.toDateString() !== tradeDate.toDateString()) return false;
  
  const currentHour = now.getHours();
  const tradeHour = tradeDate.getHours();
  
  // Morning session: 12:00 AM (0:00) to 12:00 PM (11:59:59)
  // Afternoon/Evening session: 12:00 PM (12:00) to 12:00 AM (23:59:59)
  // Trades from 12 AM - 12 PM disappear after 12 PM ("12am se 12 pm tak dikhe uske baad hat jaye")
  if (currentHour < 12) {
    return tradeHour < 12;
  } else {
    return tradeHour >= 12;
  }
};

// Mini Sparkline Chart Component (Image 3)
const MiniTradeSparkline = ({ 
  entryPrice, 
  priceHistory, 
  currentPrice,
  isLight = false
}: { 
  entryPrice: number; 
  priceHistory?: number[]; 
  currentPrice: number; 
  isLight?: boolean;
}) => {
  const prices = (priceHistory && priceHistory.length > 1) 
    ? priceHistory 
    : [entryPrice, entryPrice, currentPrice];

  const minP = Math.min(...prices, entryPrice);
  const maxP = Math.max(...prices, entryPrice);
  const range = (maxP - minP) || (entryPrice * 0.0002) || 0.0001;
  const padding = range * 0.2;
  const plotMin = minP - padding;
  const plotMax = maxP + padding;
  const plotRange = plotMax - plotMin;

  const width = 230;
  const height = 65;

  const getY = (val: number) => Math.max(5, Math.min(height - 5, height - ((val - plotMin) / plotRange) * height));
  const getX = (idx: number, total: number) => (idx / Math.max(1, total - 1)) * (width - 24) + 12;

  const entryY = getY(entryPrice);

  const points = prices.map((p, idx) => `${getX(idx, prices.length).toFixed(1)},${getY(p).toFixed(1)}`).join(' L ');
  const pathD = `M ${points}`;

  return (
    <div className={`relative w-full h-[65px] rounded-lg overflow-hidden my-2 select-none shadow-inner ${
      isLight ? 'bg-[#f1f4f9] border border-[#dbe2ea]' : 'bg-[#141b27] border border-[#232d3f]'
    }`}>
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Subtle grid lines */}
        <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke={isLight ? '#e2e8f0' : '#1e2736'} strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke={isLight ? '#e2e8f0' : '#1e2736'} strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke={isLight ? '#e2e8f0' : '#1e2736'} strokeWidth="0.5" strokeDasharray="3 3" />
        
        {/* Horizontal Entry Line (Green line from Image 3) */}
        <line 
          x1="12" 
          y1={entryY} 
          x2={width - 12} 
          y2={entryY} 
          stroke="#00c26f" 
          strokeWidth="1.2" 
        />
        
        {/* Entry Dot on green line */}
        <circle 
          cx="12" 
          cy={entryY} 
          r="3" 
          fill="#00c26f" 
          stroke={isLight ? '#f1f4f9' : '#ffffff'} 
          strokeWidth="1.5" 
        />

        {/* Dynamic Blue Price Line from Image 3 */}
        <path 
          d={pathD} 
          fill="none" 
          stroke="#1e88e5" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Live Current Price Dot */}
        <circle 
          cx={getX(prices.length - 1, prices.length)} 
          cy={getY(prices[prices.length - 1])} 
          r="2.5" 
          fill="#0284c7" 
        />
      </svg>
    </div>
  );
};

const MAX_CANDLES = 1000;



const mapAssetToBinance = (asset: AssetInfo) => {
  const id = asset.id.toLowerCase();
  if (id === 'eur_usd') return 'EURUSDT';
  if (id === 'gbp_usd') return 'GBPUSDT';
  if (id === 'usd_jpy') return 'USDJPY';
  if (id.includes('bitcoin') && !id.includes('cash')) return 'BTCUSDT';
  if (id.includes('ethereum') && !id.includes('classic')) return 'ETHUSDT';
  if (id.includes('solana')) return 'SOLUSDT';
  return null;
};

const mapAssetToYahoo = (asset: AssetInfo) => {
  const id = asset.id.toLowerCase();
  if (id === 'eur_usd') return 'EURUSD=X';
  if (id === 'gbp_usd') return 'GBPUSD=X';
  if (id.includes('bitcoin') && !id.includes('cash')) return 'BTC-USD';
  if (id.includes('ethereum') && !id.includes('classic')) return 'ETH-USD';
  return null;
};

const fetchWithTimeout = async (url: string, timeout = 3000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};




const TradeResultOverlay = ({ trade, chart, series, onClose, currency }: { trade: TradeHistoryItem, chart: any, series: any, onClose: () => void, currency: string }) => {
   const [pos, setPos] = useState({ x: -1000, y: -1000 });
   
   useEffect(() => {
      let raf: number;
      const updatePos = () => {
         if (!chart || !series) return;
         try {
           const y = series.priceToCoordinate(trade.exitPrice);
           let x = chart.timeScale().timeToCoordinate(Math.floor(trade.expireTime / 1000));
           if (x === null) {
              x = chart.timeScale().width() - 65;
           }
           if (y !== null) {
              setPos({ x, y });
           }
         } catch(e) {}
         raf = requestAnimationFrame(updatePos);
      };
      updatePos();
      return () => cancelAnimationFrame(raf);
   }, [chart, series, trade]);

   if (pos.x === -1000) return null;

   const isWin = trade.pnl > 0;
   const isTie = trade.pnl === 0;
   
   const bgColor = (isWin || isTie) ? '#0ba259' : '#e33f4a';
   const displayAmount = isWin ? `+${(trade.amount + trade.pnl).toFixed(2)}` : '0.00';
   
   return (
      <div className="absolute z-50 pointer-events-none" style={{ left: pos.x, top: pos.y }}>
        <div className="absolute w-2.5 h-2.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-10 shadow-sm" style={{ border: `2.5px solid ${bgColor}` }}></div>
        
        <div 
          className="absolute flex flex-col justify-center rounded px-3 py-1.5 text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)] pointer-events-auto transition-all duration-75"
          style={{
             backgroundColor: bgColor,
             right: 15,
             top: -24,
             minWidth: '110px'
          }}
        >
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px]" style={{ borderLeftColor: bgColor }}></div>
          
          <div className="absolute top-[6px] right-[6px] cursor-pointer opacity-80 hover:opacity-100 p-[2px]" onClick={onClose}>
             <X size={12} strokeWidth={3} />
          </div>
          
          <div className="text-[10px] font-bold opacity-90 uppercase mb-0 pr-4 leading-none tracking-wider text-white">RESULT (P/L)</div>
          
          <div className="text-[20px] font-black tracking-tight leading-none whitespace-nowrap mt-1.5">
             {isWin ? '+' : ''}{currency}{(isWin || isTie ? trade.amount + trade.pnl : 0).toFixed(2)}
          </div>
        </div>
      </div>
   );
};

export const getAssetBasePrice = (asset: { id?: string; name?: string }): number => {
  const str = ((asset?.id || '') + ' ' + (asset?.name || '')).toLowerCase();
  if (str.includes('nikkei')) return 38540.0;
  if (str.includes('btc') || str.includes('bitcoin')) return 67450.0;
  if (str.includes('eth') || str.includes('ethereum')) return 2645.0;
  if (str.includes('sol') || str.includes('solana')) return 152.0;
  if (str.includes('gold') || str.includes('xau')) return 2685.0;
  if (str.includes('crude') || str.includes('oil')) return 71.8;
  if (str.includes('jpy')) return 152.4;
  if (str.includes('inr')) return 84.15;
  if (str.includes('pkr')) return 278.4;
  if (str.includes('brl')) return 5.62;
  if (str.includes('mxn')) return 19.35;
  if (str.includes('zar')) return 17.8;
  if (str.includes('egp')) return 48.6;
  if (str.includes('gbp')) return 1.298;
  if (str.includes('aud')) return 0.665;
  if (str.includes('cad')) return 1.385;
  if (str.includes('chf')) return 0.865;
  if (str.includes('eur')) return 1.086;
  if (str.includes('aapl') || str.includes('apple')) return 232.0;
  if (str.includes('tsla') || str.includes('tesla')) return 224.0;
  return 100.0;
};

const socket = io('/', { transports: ['websocket', 'polling'] });
const generateInitialCandles = (endPrice: number, timeframe: number = 60000) => {
  const candles: any[] = [];
  const now = Math.floor(Date.now() / timeframe) * timeframe;
  let currentClose = endPrice;
  const volBase = (endPrice * 0.003) * Math.sqrt(timeframe / 60000);
  let trend = 0;
  for (let i = 0; i < 200; i++) {
    if (i % 15 === 0) trend = (Math.random() - 0.5) * (volBase * 1.5);
    const close = currentClose;
    const open = close - (Math.random() - 0.5) * volBase - trend;
    const high = Math.max(open, close) + Math.random() * volBase;
    const low = Math.min(open, close) - Math.random() * volBase;
    candles.unshift({
      time: Math.floor((now - i * timeframe) / 1000),
      open,
      high,
      low,
      close,
      volume: Math.random() * 100 + 50,
    });
    currentClose = open;
  }
  return candles;
};

export default function Trading() {
  const { showToast } = useToast();
  const [hideBalance, setHideBalance] = useState(() => localStorage.getItem('hideBalance') === 'true');
  const [isRefreshing, setIsRefreshing] = useState(false);
    const THEMES = {
    'Light Mode': {
      bg: 'bg-[var(--bg-main)]',
      panelBg: 'bg-[var(--bg-panel)]',
      border: 'border-[var(--border-color)]',
      text: 'text-[var(--text-primary)]',
      textMuted: 'text-[var(--text-muted)]',
      inputBg: 'bg-white',
      hover: 'hover:bg-[var(--hover-bg)]'
    },
    'Twilight': {
      bg: 'bg-[var(--bg-main)]',
      panelBg: 'bg-[var(--bg-panel)]',
      border: 'border-[var(--border-color)]',
      text: 'text-[var(--text-primary)]',
      textMuted: 'text-[var(--text-muted)]',
      inputBg: 'bg-transparent',
      hover: 'hover:bg-[var(--hover-bg)]'
    },
    'Full Night': {
      bg: 'bg-[var(--bg-main)]',
      panelBg: 'bg-[var(--bg-panel)]',
      border: 'border-[var(--border-color)]',
      text: 'text-[var(--text-primary)]',
      textMuted: 'text-[var(--text-muted)]',
      inputBg: 'bg-transparent',
      hover: 'hover:bg-[var(--hover-bg)]'
    }
  };
  const navigate = useNavigate();
  const { addBonus, currency, setCurrency, convertCurrency, balance, setBalance, accountType, setAccountType, demoBalance, liveBalance, setDemoBalance, setLiveBalance } = useBalance();
  const [currentView, setCurrentView] = useState<'TRADE' | 'SUPPORT' | 'ACCOUNT' | 'TOURNAMENTS' | 'MARKET' | 'MORE' | 'deposit' | 'withdrawal' | 'deposit_history' | 'withdrawal_history' | 'trade_history'>('TRADE');
  const [isChartLoading, setIsChartLoading] = useState(true);

  


  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>('WELCOME');
  const { t, language, timezone, formatTimeInTimezone } = useLanguage();

  const chooseTradingAsset = (asset: AssetInfo) => {
    setSelectedAsset(asset);
    setOpenAssets(prev => {
      if (prev.find(a => a.id === asset.id)) return prev;
      const newAssets = [...prev];
      if (newAssets.length < 7) {
        return [...newAssets, asset];
      } else {
        const replaceIdx = newAssets.findIndex(a => a.id === selectedAsset.id);
        if (replaceIdx >= 0) newAssets[replaceIdx] = asset;
        else newAssets[newAssets.length - 1] = asset;
        return newAssets;
      }
    });
  };

  useEffect(() => {
    // Launch interactive tutorial only when a new user registers on the platform
    const isNewUserRegistered = localStorage.getItem('start_onboarding_tutorial_on_mount') === 'true';
    if (isNewUserRegistered) {
      localStorage.removeItem('start_onboarding_tutorial_on_mount');
      setAccountType('DEMO');
      setTutorialStep('WELCOME');
      setIsOnboardingOpen(true);
    }
  }, []);
  const [chartLayout, setChartLayout] = useState('1'); // '1', '2v', '2h', '3', '4', '5', '6'
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isPromotionOpen, setIsPromotionOpen] = useState(false);
  const [isJoinUsOpen, setIsJoinUsOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState({ instagram: '', facebook: '', youtube: '' });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'settings'), (snap) => {
      const data: Record<string, string> = {};
      snap.docs.forEach(d => { data[d.id] = d.data().value; });
      setSocialLinks({
        instagram: data['social_instagram'] || '',
        facebook: data['social_facebook'] || '',
        youtube: data['social_youtube'] || ''
      });
    }, (err) => console.warn('Trading.tsx settings err:', err));
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFocusMode(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

    const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const [themeMode, setThemeMode] = useState<'Light Mode' | 'Twilight' | 'Full Night'>(() => {
    return (localStorage.getItem('themeMode') as any) || 'Full Night';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    
    // Update global CSS variables by toggling class on root
    document.documentElement.classList.remove('theme-light', 'theme-twilight', 'theme-full-night', 'dark');
    if (themeMode === 'Light Mode') {
      document.documentElement.classList.add('theme-light');
    } else if (themeMode === 'Twilight') {
      document.documentElement.classList.add('theme-twilight', 'dark');
    } else {
      document.documentElement.classList.add('theme-full-night', 'dark');
    }
  }, [themeMode]);
    const [appSettings, setAppSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('appSettings');
      return saved ? JSON.parse(saved) : {
        gridOpacity: 10,
        showVerticalGridLines: true,
        showHorizontalGridLines: true,
        autoScrolling: false,
        oneClickTrade: false,
        performanceMode: true,
        shortOrderLabel: true,
        hideTradeResults: true,
        upColor: '#0ba259',
        downColor: '#e33f4a',
        bgImage: null,
    drawingColor: "#1e88e5"
      };
    } catch {
      return {
        gridOpacity: 10,
        showVerticalGridLines: true,
        showHorizontalGridLines: true,
        autoScrolling: false,
        oneClickTrade: false,
        performanceMode: true,
        shortOrderLabel: true,
        hideTradeResults: true,
        upColor: '#0ba259',
        downColor: '#e33f4a',
        bgImage: null
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
  }, [appSettings]);

  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn('Trading.tsx snapshot err:', err));
    return () => unsub();
  }, []);
  const [showDemoTopup, setShowDemoTopup] = useState(false);
  const [selectedDepositMethod, setSelectedDepositMethod] = useState<string | null>(null);
  const [selectedWithdrawalMethod, setSelectedWithdrawalMethod] = useState<string | null>(null);
  const [transactionAmount, setTransactionAmount] = useState("100");
  const [isPendingTrade, setIsPendingTrade] = useState(false);
  const [pendingTradeType, setPendingTradeType] = useState<'QUOTE' | 'TIME'>('QUOTE');
  const [pendingQuote, setPendingQuote] = useState("0.88849");
  const [pendingTime, setPendingTime] = useState("12:00");
  const [pendingPeriod, setPendingPeriod] = useState("M1");
  const [newDemoBalance, setNewDemoBalance] = useState("10000");
  const [openChartMenu, setOpenChartMenu] = useState<ChartMenuType>(null);
  const [pendingConfirmTrade, setPendingConfirmTrade] = useState<'UP' | 'DOWN' | null>(null);
  const [dontAskConfirmAgain, setDontAskConfirmAgain] = useState(false);

  // Quotex Top-Left Trade Popups (Images 4, 5, 6)
  interface QuotexToast {
    id: string;
    message: string;
    type: 'success' | 'error';
    createdAt: number;
  }
  const [quotexToasts, setQuotexToasts] = useState<QuotexToast[]>([]);

  const addQuotexToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setQuotexToasts(prev => [...prev.slice(-4), { id, message, type, createdAt: Date.now() }]);
    setTimeout(() => {
      setQuotexToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  const dismissQuotexToast = (id: string) => {
    setQuotexToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (chartRef.current) {
      try {
        chartRef.current.timeScale().applyOptions({
          fixRightEdge: !!appSettings.autoScrolling,
        });
        if (appSettings.autoScrolling) {
          chartRef.current.timeScale().scrollToRealTime();
        }
      } catch (e) {}
    }
  }, [appSettings.autoScrolling]);

  useEffect(() => {
    if (chartRef.current) {
      try {
        chartRef.current.applyOptions({
          crosshair: {
            mode: 0,
          },
        });
      } catch (e) {}
    }
  }, [appSettings.performanceMode]);
  const defaultAsset = QUOTEX_ASSETS.find(a => a.id === 'nikkei_225') || QUOTEX_ASSETS[0];
  const [chartConfigs, setChartConfigs] = useState(
    [...Array(6)].map((_, i) => ({
      id: i,
      asset: defaultAsset,
      timeframe: "1m",
      chartType: "Candles",
      drawings: [] as DrawingShape[]
    }))
  );
  const [activeChartIdx, setActiveChartIdx] = useState(0);

  const selectedTimeframe = chartConfigs[activeChartIdx].timeframe;
  const setSelectedTimeframe = (tf: string) => setChartConfigs(prev => { const n = [...prev]; n[activeChartIdx] = { ...n[activeChartIdx], timeframe: tf }; return n; });

  const selectedChartType = chartConfigs[activeChartIdx].chartType;
  const setSelectedChartType = (ct: string) => setChartConfigs(prev => { const n = [...prev]; n[activeChartIdx] = { ...n[activeChartIdx], chartType: ct }; return n; });

  const activeDrawings = chartConfigs[activeChartIdx].drawings;
  const setActiveDrawings = (action: React.SetStateAction<DrawingShape[]>) => {
    setChartConfigs(prev => {
      const next = [...prev];
      const nextDrawings = typeof action === 'function' ? action(next[activeChartIdx].drawings) : action;
      next[activeChartIdx] = { ...next[activeChartIdx], drawings: nextDrawings };
      return next;
    });
  };

  // Synchronized Zoom Level across all charts (Requirement 3)
  const [sharedZoomSpan, setSharedZoomSpan] = useState<number>(22);
  const sharedZoomSpanRef = useRef<number>(22);

  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);
  const [indicatorSettings, setIndicatorSettings] = useState<Record<string, IndicatorSettings>>(() => ({}));
  const [editingIndicator, setEditingIndicator] = useState<string | null>(null);
  const [hiddenIndicators, setHiddenIndicators] = useState<Record<string, boolean>>({});

  const handleAddIndicator = (name: string) => {
    setActiveIndicators(prev => {
      if (prev.includes(name)) return prev;
      return [...prev, name];
    });
    setIndicatorSettings(prev => {
      if (prev[name]) return prev;
      return { ...prev, [name]: getDefaultIndicatorSettings(name) };
    });
  };

  const handleUpdateIndicatorSettings = (newSettings: IndicatorSettings, indName?: string) => {
    const key = indName || newSettings.name || editingIndicator;
    if (!key) return;
    setIndicatorSettings(prev => ({
      ...prev,
      [key]: { ...newSettings, name: key }
    }));
  };

  const handleDeleteIndicator = (name: string) => {
    setActiveIndicators(prev => prev.filter(i => i !== name));
    if (editingIndicator === name) setEditingIndicator(null);
  };

  const handleToggleIndicatorVisibility = (name: string) => {
    setHiddenIndicators(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  const [marketControls, setMarketControls] = useState<Record<string, any>>({});

  useEffect(() => {
    const unsubControls = onSnapshot(collection(db, 'marketControls'), (snap) => {
      const controls: Record<string, any> = {};
      snap.docs.forEach(d => { controls[d.id] = d.data(); });
      setMarketControls(controls);
      (window as any).marketControls = controls;
    }, (err) => console.warn('Trading.tsx snapshot err:', err));
    return () => unsubControls();
  }, []);
  const [crosshairPoint, setCrosshairPoint] = useState<DrawingPoint | null>(null);
  const [activeDrawingId, setActiveDrawingId] = useState<string | null>(null);
  const handleUpdateDrawingPoint = useCallback((id: string, idx: number, point: DrawingPoint) => {
    setActiveDrawings((prev: DrawingShape[]) => prev.map((d: DrawingShape) => {
      if (d.id === id) {
        const newPoints = [...d.points];
        newPoints[idx] = point;
        return { ...d, points: newPoints };
      }
      return d;
    }));
  }, [activeChartIdx]);
  const [pendingDrawing, setPendingDrawing] = useState<string | null>(null);
  const pendingDrawingRef = useRef<string | null>(null);
  const drawingStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const selectedAsset = chartConfigs[activeChartIdx].asset;
  const initialBasePrice = getAssetBasePrice(selectedAsset || QUOTEX_ASSETS[0]);
  const latestPriceRef = useRef<number>(initialBasePrice);
  const setSelectedAsset = (asset: AssetInfo) => setChartConfigs(prev => { const n = [...prev]; n[activeChartIdx] = { ...n[activeChartIdx], asset }; return n; });

  // Loader hide effect - Exactly 0.20s (200ms) Zorvex center loader logic restored
  useEffect(() => {
    setIsChartLoading(true);
    const timer = setTimeout(() => {
      setIsChartLoading(false);
    }, 200); // exactly 0.20 second (200ms)
    return () => clearTimeout(timer);
  }, [selectedAsset, activeChartIdx]);
  
  // Modal State
  const [openAssets, setOpenAssets] = useState<AssetInfo[]>([
    QUOTEX_ASSETS.find(a => a.id === 'nikkei_225') || QUOTEX_ASSETS[0],
    QUOTEX_ASSETS.find(a => a.id === 'usd_zar_otc') || QUOTEX_ASSETS[1],
    QUOTEX_ASSETS.find(a => a.id === 'usd_pkr_otc') || QUOTEX_ASSETS[2],
    QUOTEX_ASSETS.find(a => a.id === 'nzd_chf_otc') || QUOTEX_ASSETS[3],
    QUOTEX_ASSETS.find(a => a.id === 'uscrude_otc') || QUOTEX_ASSETS[4],
    QUOTEX_ASSETS.find(a => a.id === 'usd_cad_otc') || QUOTEX_ASSETS[5],
    QUOTEX_ASSETS.find(a => a.id === 'aud_usd_otc') || QUOTEX_ASSETS[6]
  ]);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isPairInfoOpen, setIsPairInfoOpen] = useState(false);
  const [assetTab, setAssetTab] = useState<'CURRENCIES' | 'CRYPTO' | 'COMMODITIES' | 'STOCKS'>('CURRENCIES');
  const [searchQuery, setSearchQuery] = useState('');

  // Close modals when switching to multi-chart mode (User Request 3: No popups in multi-chart)
  useEffect(() => {
    if (chartLayout !== '1') {
      setIsAssetModalOpen(false);
      setIsPairInfoOpen(false);
    }
  }, [chartLayout]);

  const [timeframe, setTimeframe] = useState<number>(60000); // 1m

  const handleTimeframeSelect = (tf: string) => {
    setSelectedTimeframe(tf);
    setOpenChartMenu(null);
    const msMap: Record<string, number> = {
      '5s': 5000, '10s': 10000, '15s': 15000, '30s': 30000,
      '1m': 60000, '2m': 120000, '3m': 180000, '5m': 300000,
      '10m': 600000, '15m': 900000, '30m': 1800000, '1h': 3600000,
      '4h': 14400000, '1d': 86400000
    };
    if (msMap[tf]) {
      setTimeframe(msMap[tf]);
    }
  };

  const currentCurrencyInfo = useMemo(() => getCurrencyByCode(currency), [currency]);
  const currentCurrencyCode = useMemo(() => {
    const saved = localStorage.getItem('rajadhan_currency_code');
    if (saved) return saved;
    return currentCurrencyInfo.code;
  }, [currentCurrencyInfo, currency]);
  const minBet = currentCurrencyInfo.minBet;
  const isINR = currentCurrencyInfo.code === 'INR';
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);

  const [durationSecs, setDurationSecs] = useState<number>(60);
  const [investment, setInvestment] = useState<number>(() => {
    const cur = localStorage.getItem('rajadhan_currency') || '$';
    const info = getCurrencyByCode(cur);
    return info.minBet;
  });
  const [positions, setPositions] = useState<BinaryPosition[]>([]);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);
  const [tradeResultNotification, setTradeResultNotification] = useState<TradeHistoryItem | null>(null);
  const [tutorialClosedTrade, setTutorialClosedTrade] = useState<TradeHistoryItem | null>(null);
  const tutorialTradeIdRef = useRef<string | null>(null);
  const [activeTab, setActiveTab] = useState<'TRADES' | 'ORDERS' | 'CLOSED'>('TRADES');
  const [expandedTrades, setExpandedTrades] = useState<Record<string, boolean>>({});
  const [tick, setTick] = useState(0);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showInvestmentPresets, setShowInvestmentPresets] = useState(false);
  const [marketSentiment, setMarketSentiment] = useState({ up: 55, down: 45 });
  const [globalSentiment, setGlobalSentiment] = useState({ up: 92, down: 8 });
  const [payoutFluctuation, setPayoutFluctuation] = useState(0);

  // Closed Trade Popup on Chart (Requirement 2 & Image 2)
  const [closedTradePopup, setClosedTradePopup] = useState<ClosedTradeData | null>(null);
  const closedTradeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showClosedTradePopup = useCallback((trade: TradeHistoryItem & { refundAmount?: number; isEarlySell?: boolean }) => {
    if (chartLayout !== '1') return; // User Request 3: Do not open closed trade popup in multiple charts
    const durationSeconds = Math.max(5, Math.round(((trade.expireTime || Date.now()) - (trade.entryTime || Date.now())) / 1000));
    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    const durationStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (closedTradeTimerRef.current) {
      clearTimeout(closedTradeTimerRef.current);
    }

    setClosedTradePopup({
      id: trade.id,
      asset: trade.asset,
      type: trade.type,
      amount: trade.amount,
      pnl: trade.pnl,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice || latestPriceRef.current || trade.entryPrice,
      refundAmount: trade.refundAmount,
      durationStr,
      closedAt: trade.timestamp || Date.now(),
      isEarlySell: trade.isEarlySell
    });

    closedTradeTimerRef.current = setTimeout(() => {
      setClosedTradePopup(null);
    }, 7000);
  }, []);

  // Interactive Crosshair state (Requirement 3)
  const [mouseCrosshair, setMouseCrosshair] = useState<{
    x: number;
    y: number;
    price: number;
    time: number;
    formattedTime: string;
  } | null>(null);

  // Hovered Candle OHLC (Requirement 4 & Image 3)
  const [hoveredCandle, setHoveredCandle] = useState<{ open: number; high: number; low: number; close: number; time?: any } | null>(null);
  const hoverDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [activeCandle, setActiveCandle] = useState<{ open: number; high: number; low: number; close: number } | null>(null);

  const currentAssetDecimals = useMemo(() => {
    const nameLower = selectedAsset.name.toLowerCase();
    const isCrypto = nameLower.includes('crypto') || nameLower.includes('bitcoin') || nameLower.includes('btc');
    const isLargePrice = nameLower.includes('nikkei') || nameLower.includes('jpy') || nameLower.includes('crude');
    const baseP = getAssetBasePrice(selectedAsset);
    if (isCrypto || isLargePrice || baseP >= 100) return 2;
    return ((selectedAsset as any)?.decimals ?? 5);
  }, [selectedAsset]);

  const activeCandleOhlc = useMemo(() => {
    if (hoveredCandle) return hoveredCandle;
    if (activeCandle) return activeCandle;
    const curP = latestPriceRef.current || getAssetBasePrice(selectedAsset);
    return { open: curP, high: curP, low: curP, close: curP };
  }, [hoveredCandle, activeCandle, selectedAsset]);

  // Enforce minimum bet when currency changes
  useEffect(() => {
    if (investment < minBet) {
      setInvestment(minBet);
    }
  }, [minBet]);

  // Update market sentiment and payout rate periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketSentiment(prev => {
        // Randomly drift by -15% to +15% every second for visible fluctuation
        let drift = Math.floor(Math.random() * 31) - 15;
        let newUp = prev.up + drift;
        if (newUp > 85) newUp = 85;
        if (newUp < 15) newUp = 15;
        return { up: newUp, down: 100 - newUp };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  

  // Global Sentiment (Analytics sidebar) logic
  useEffect(() => {
    const globalInterval = setInterval(() => {
      setGlobalSentiment(prev => {
        // Drastic jumps every 30s
        const isMajorSwing = Math.random() > 0.5; // Actually, this runs every 30s, so it should just pick a new target
        const newUp = Math.floor(Math.random() * 80) + 10; // Between 10 and 90
        return { up: newUp, down: 100 - newUp };
      });
    }, 30000); // 30 seconds
    
    const jitterInterval = setInterval(() => {
      setGlobalSentiment(prev => {
        let drift = Math.floor(Math.random() * 5) - 2; // small drift -2 to +2
        let newUp = prev.up + drift;
        if (newUp > 95) newUp = 95;
        if (newUp < 5) newUp = 5;
        return { up: newUp, down: 100 - newUp };
      });
    }, 1000); // 1 second jitter
    
    return () => { clearInterval(globalInterval); clearInterval(jitterInterval); };
  }, []);

  // Listen to Firestore Market Controls
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'instruments'), (snap) => {
      const controls: any = {};
      snap.docs.forEach(doc => {
        if (doc.data().candleForce) {
          controls[doc.id] = doc.data();
        }
      });
      (window as any).marketControls = controls;
    }, (err) => console.warn('market controls error', err));
    return () => unsub();
  }, []);


  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const indicatorsRef = useRef<Map<string, any[]>>(new Map());
  const indicatorPriceLinesRef = useRef<Map<string, IPriceLine>>(new Map());
  const priceScaleDragRef = useRef({ isDragging: false, startY: 0, accumulated: 0 });
  const futureSeriesRef = useRef<ISeriesApi<any> | null>(null);
  
  const stateRef = useRef({
    price: initialBasePrice,
    candles: generateInitialCandles(initialBasePrice, 60000),
    isRealTime: false,
    isLoading: true,
  });

  // Derived Values
  const activePayoutRate = useMemo(() => {
     const tick2m = Math.floor(tick / 120);
     const baseChar = selectedAsset.id.charCodeAt(0) || 1;
     const isNikkei = selectedAsset.id === 'nikkei_225' || selectedAsset.name.toLowerCase().includes('nikkei 225');
     
     const base1 = isNikkei ? 90 : 85 + (baseChar % 10);
     const p1 = Math.min(98, Math.max(85, Math.round(base1 + Math.sin(tick2m * 0.5 + baseChar) * 8)));
     
     const baseChar2 = selectedAsset.id.length > 1 ? selectedAsset.id.charCodeAt(1) : 2;
     const base5 = isNikkei ? 90 : 85 + (baseChar2 % 10);
     const p5 = Math.min(98, Math.max(85, Math.round(base5 + Math.cos(tick2m * 0.3 + baseChar2) * 8)));
     
     const basePayout = durationSecs < 300 ? (p1 / 100) : (p5 / 100);
     // Since p1/p5 are already fluctuating nicely between 85 and 98, we can just use them directly, 
     // or add the minor payoutFluctuation. We'll just return basePayout directly to match the modal perfectly.
     return basePayout;
  }, [selectedAsset, durationSecs, tick]);

  const getAssetPayouts = (asset: AssetInfo) => {
     const tick2m = Math.floor(tick / 120);
     const baseChar = asset.id.charCodeAt(0) || 1;
     const isNikkei = asset.id === 'nikkei_225' || asset.name.toLowerCase().includes('nikkei 225');
     
     const base1 = isNikkei ? 90 : 85 + (baseChar % 10);
     const p1 = Math.min(98, Math.max(85, Math.round(base1 + Math.sin(tick2m * 0.5 + baseChar) * 8)));
     
     const baseChar2 = asset.id.length > 1 ? asset.id.charCodeAt(1) : 2;
     const base5 = isNikkei ? 90 : 85 + (baseChar2 % 10);
     const p5 = Math.min(98, Math.max(85, Math.round(base5 + Math.cos(tick2m * 0.3 + baseChar2) * 8)));
     
     return { p1, p5 };
  };
  
  const filteredAssets = useMemo(() => {
    return QUOTEX_ASSETS.filter(a => 
      a.category === assetTab && 
      a.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [assetTab, searchQuery]);

  const sortedEnrichedAssets = useMemo(() => {
    const tick2m = Math.floor(tick / 120);
    
    // First, enrich with p1 and p5
    const enriched = filteredAssets.map(asset => {
        const baseChar = asset.id.charCodeAt(0) || 1;
        
        // Nikkei 225 override to be between 85 and 98
        const isNikkei = asset.id === 'nikkei_225' || asset.name.toLowerCase().includes('nikkei 225');
        
        const base1 = isNikkei ? 90 : 85 + (baseChar % 10);
        const p1 = Math.min(98, Math.max(85, Math.round(base1 + Math.sin(tick2m * 0.5 + baseChar) * 8)));
        
        const baseChar2 = asset.id.length > 1 ? asset.id.charCodeAt(1) : 2;
        const base5 = isNikkei ? 90 : 85 + (baseChar2 % 10);
        const p5 = Math.min(98, Math.max(85, Math.round(base5 + Math.cos(tick2m * 0.3 + baseChar2) * 8)));
        
        return { ...asset, p1, p5 };
    });

    // Sort descending by highest percentage (p1)
    enriched.sort((a, b) => b.p1 - a.p1);

    // Now calculate 24h change based on position (Top gets +, Bottom gets -)
    return enriched.map((asset, index) => {
        // Let's say top 50% gets positive 24h change, bottom 50% gets negative
        const isPos = index < Math.ceil(enriched.length / 2);
        
        // Let's make the change value somewhat tied to their p1 percentage so it looks natural
        // Top #1 might have +3.45%, bottom might have -2.15%
        const baseChange = isPos ? (asset.p1 - 85) * 0.15 : -((98 - asset.p1) * 0.15);
        const currentChange = parseFloat(baseChange.toFixed(2));
        
        return { ...asset, currentChange, isPos };
    });
  }, [filteredAssets, tick]);

  // UI Tick for timers & pending orders
  useEffect(() => {
    const uiInterval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(uiInterval);
  }, []);

  // Process Pending Orders
  useEffect(() => {
     if (pendingOrders.length === 0) return;
     const nowStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
     const price = latestPriceRef.current;
     let ordersToExecute = [];
     
     const remaining = pendingOrders.filter(order => {
        let shouldExecute = false;
        if (order.pendingType === 'QUOTE' && Math.abs(price - parseFloat(order.quote)) < 0.0005) {
           shouldExecute = true;
        } else if (order.pendingType === 'TIME' && order.time === nowStr) {
           shouldExecute = true;
        }
        
        if (shouldExecute) {
           ordersToExecute.push(order);
           return false;
        }
        return true;
     });
     
     if (ordersToExecute.length > 0) {
        setPendingOrders(remaining);
        ordersToExecute.forEach(order => {
           window.dispatchEvent(new CustomEvent('execute_pending_order', { detail: order }));
        });
     }
  }, [tick, pendingOrders]);

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const basePrice = getAssetBasePrice(selectedAsset);
    const precision = basePrice >= 1000 ? 2 : (basePrice >= 10 ? 3 : 5);
    const minMove = basePrice >= 1000 ? 0.01 : (basePrice >= 10 ? 0.001 : 0.00001);

    const chart = createChart(chartContainerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: appSettings.bgImage ? 'transparent' : (themeMode === 'Light Mode' ? '#ffffff' : (themeMode === 'Twilight' ? '#222733' : '#12161f')) },
        textColor: themeMode === 'Light Mode' ? '#1f2937' : '#e2e8f0',
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: {
          time: true,
          price: true,
        },
        axisDoubleClickReset: {
          time: true,
          price: true,
        },
      },
      handleScroll: {
        mouseWheel: false, // Allows mouse wheel to smoothly zoom chart via handleScale without page scrolling
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      grid: {
        vertLines: { color: !appSettings.showVerticalGridLines ? 'transparent' : (themeMode === 'Light Mode' ? `rgba(0,0,0,${appSettings.gridOpacity / 100})` : `rgba(255, 255, 255, ${appSettings.gridOpacity / 100})`) },
        horzLines: { color: !appSettings.showHorizontalGridLines ? 'transparent' : (themeMode === 'Light Mode' ? `rgba(0,0,0,${appSettings.gridOpacity / 100})` : `rgba(255, 255, 255, ${appSettings.gridOpacity / 100})`) },
      },
      crosshair: {
        mode: 0,
        vertLine: { 
          visible: true,
          labelVisible: true,
          color: themeMode === 'Light Mode' ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.55)', 
          width: 1, 
          style: 2,
          labelBackgroundColor: '#1e88e5'
        },
        horzLine: { 
          visible: true,
          labelVisible: true,
          color: themeMode === 'Light Mode' ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.55)', 
          width: 1, 
          style: 2,
          labelBackgroundColor: '#1e88e5'
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: themeMode === 'Light Mode' ? '#f0f0f0' : '#2a303d',
        borderVisible: false,
        rightOffset: 10,
        barSpacing: 36, // Prominently zoomed-in appearance matching Image 4
        minBarSpacing: 18, // Caps max zoom out to Image 1 level (~55-60 candles)
        maxBarSpacing: 80,
      },
      rightPriceScale: {
        borderColor: themeMode === 'Light Mode' ? '#ffffff' : '#2a303d',
        borderVisible: false,
        autoScale: true,
        scaleMargins: {
          top: 0.18, // 18% top margin protects upper boundary (Image 2)
          bottom: 0.22, // 22% bottom margin protects lower boundary (Image 3)
        },
      },
    });

    let isClampingZoom = false;
    const handleLogicalRangeClamp = (range: any) => {
      if (!range || isClampingZoom) return;
      const MAX_SPAN = 58; // Hard zoom-out limit matching Image 1
      const span = range.to - range.from;
      if (span > MAX_SPAN + 0.5) {
        isClampingZoom = true;
        try {
          chart.timeScale().setVisibleLogicalRange({
            from: range.to - MAX_SPAN,
            to: range.to
          });
        } catch (_) {}
        setTimeout(() => { isClampingZoom = false; }, 30);
      }
    };
    chart.timeScale().subscribeVisibleLogicalRangeChange(handleLogicalRangeClamp);

    let series: ISeriesApi<any>;

    if (selectedChartType === 'Area') {
      series = chart.addSeries(AreaSeries, {
        lineColor: '#1e88e5',
        topColor: 'rgba(30, 136, 229, 0.4)',
        bottomColor: 'rgba(30, 136, 229, 0.0)',
        lineWidth: 2,
        priceFormat: { type: 'price', precision, minMove },
      });
    } else if (selectedChartType === 'Bars') {
      series = chart.addSeries(BarSeries, {
        upColor: appSettings.upColor,
        downColor: appSettings.downColor,
        priceFormat: { type: 'price', precision, minMove },
      });
    } else {
      series = chart.addSeries(CandlestickSeries, {
        upColor: appSettings.upColor,
        downColor: appSettings.downColor,
        borderVisible: false,
        wickUpColor: appSettings.upColor,
        wickDownColor: appSettings.downColor,
        priceFormat: { type: 'price', precision, minMove },
      });
    }

    series.applyOptions({
      priceLineColor: '#1e88e5',
      priceLineWidth: 2,
      priceLineVisible: true,
      lastValueVisible: true,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    // User Requirement 3: Invisible time guide series to extend bottom time scale numbers into the future ahead of current market price
    const futureSeries = chart.addSeries(LineSeries, {
      color: 'transparent',
      lineVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
      baseLineVisible: false,
      autoscaleInfoProvider: () => null,
    });
    futureSeriesRef.current = futureSeries;
    
    const crosshairHandler = (param: any) => {
      if (param.point && seriesRef.current && chartRef.current) {
         const price = seriesRef.current.coordinateToPrice(param.point.y);
         const time = param.time || chartRef.current.timeScale().coordinateToTime(param.point.x);
         
         if (price !== null && typeof price === 'number') {
            const timeNum = typeof time === 'number' ? time : Number(time || 0);
            let timeFormatted = '';
            if (timeNum) {
              const d = new Date(timeNum * 1000);
              timeFormatted = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            }
            setMouseCrosshair({
              x: param.point.x,
              y: param.point.y,
              price: Number(price),
              time: timeNum,
              formattedTime: timeFormatted
            });
            setCrosshairPoint({ time: timeNum, price: Number(price) });
         } else {
            setMouseCrosshair(null);
            setCrosshairPoint(null);
         }

         // Stable OHLC candle detection: resolves candle when hovering over chart, resets when outside data
         let candle: any = null;
         if (param.seriesData && seriesRef.current) {
            candle = param.seriesData.get(seriesRef.current);
         }
         if (!candle && param.time) {
            const targetTime = param.time;
            if (stateRef.current.candles.length > 0) {
               candle = stateRef.current.candles.find((c: any) => Math.floor(Number(c.time)) === Math.floor(Number(targetTime)));
            }
         }
         if (!candle && param.point && chartRef.current && stateRef.current.candles.length > 0) {
            const logical = chartRef.current.timeScale().coordinateToLogical(param.point.x);
            if (logical !== null && logical !== undefined) {
               const idx = Math.round(Number(logical));
               if (idx >= 0 && idx < stateRef.current.candles.length) {
                  candle = stateRef.current.candles[idx];
               }
            }
         }

         if (candle && typeof candle.open === 'number') {
            if (hoverDebounceTimerRef.current) {
               clearTimeout(hoverDebounceTimerRef.current);
               hoverDebounceTimerRef.current = null;
            }
            const cOpen = Number(candle.open);
            const cHigh = Number(candle.high);
            const cLow = Number(candle.low);
            const cClose = Number(candle.close);
            const cTime = candle.time;
            setHoveredCandle(prev => {
               if (prev && prev.time === cTime && prev.open === cOpen && prev.close === cClose) {
                  return prev;
               }
               return { open: cOpen, high: cHigh, low: cLow, close: cClose, time: cTime };
            });
         } else if (candle && typeof candle.value === 'number') {
            if (hoverDebounceTimerRef.current) {
               clearTimeout(hoverDebounceTimerRef.current);
               hoverDebounceTimerRef.current = null;
            }
            const cVal = Number(candle.value);
            const cTime = candle.time;
            setHoveredCandle(prev => {
               if (prev && prev.time === cTime && prev.open === cVal && prev.close === cVal) {
                  return prev;
               }
               return { open: cVal, high: cVal, low: cVal, close: cVal, time: cTime };
            });
         } else {
            if (!hoverDebounceTimerRef.current) {
               hoverDebounceTimerRef.current = setTimeout(() => {
                  setHoveredCandle(null);
                  hoverDebounceTimerRef.current = null;
               }, 60);
            }
         }
      } else {
         if (hoverDebounceTimerRef.current) {
            clearTimeout(hoverDebounceTimerRef.current);
            hoverDebounceTimerRef.current = null;
         }
         setMouseCrosshair(null);
         setCrosshairPoint(null);
         setHoveredCandle(null);
      }
    };
    chart.subscribeCrosshairMove(crosshairHandler);


    const loadInitialData = async () => {
      stateRef.current.isLoading = true;
      let initialData: any[] = [];
      const tfMs = timeframe || 60000;

      try {
         const res = await fetch(`/api/market/history/${selectedAsset.id}`);
         if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
               initialData = data;
            }
         }
      } catch (err) {
         console.warn('Failed to fetch history, using fallback candles:', err);
      }

      if (!initialData || initialData.length === 0) {
         initialData = generateInitialCandles(basePrice, tfMs);
      }

      stateRef.current.candles = initialData;
      const lastCandle = initialData[initialData.length - 1];
      if (lastCandle) {
        latestPriceRef.current = Number(lastCandle.close);
        stateRef.current.price = Number(lastCandle.close);
      }

      const formatData = (dataToFormat: any[]) => {
         const seen = new Set<number>();
         const list: any[] = [];
         const sorted = [...dataToFormat].sort((a, b) => Number(a.time) - Number(b.time));
         for (const c of sorted) {
            const t = Math.floor(Number(c.time));
            if (!t || seen.has(t)) continue;
            seen.add(t);
            if (selectedChartType === 'Area' || selectedChartType === 'Line') {
               list.push({ time: t as Time, value: Number(c.close) });
            } else {
               list.push({
                  time: t as Time,
                  open: Number(c.open),
                  high: Number(c.high),
                  low: Number(c.low),
                  close: Number(c.close)
               });
            }
         }
         return list;
      };

      const formatted = formatData(initialData);
      if (series && formatted.length > 0) {
         series.setData(formatted);

         // User Requirement 3: Ensure time scale numbers extend ahead of current market price and never end
         if (futureSeriesRef.current) {
           const stepSec = Math.max(5, tfMs / 1000);
           const lastT = Math.floor(Number(formatted[formatted.length - 1].time));
           const futureList: { time: Time; value: number }[] = [];
           for (let i = 0; i < formatted.length; i++) {
             futureList.push({ time: formatted[i].time, value: basePrice });
           }
           for (let i = 1; i <= 100; i++) {
             futureList.push({ time: (lastT + i * stepSec) as Time, value: basePrice });
           }
           futureSeriesRef.current.setData(futureList);
         }

         setTimeout(() => {
           if (chartRef.current) {
             const totalBars = formatted.length;
             const span = sharedZoomSpanRef.current || 22;
             chartRef.current.timeScale().applyOptions({
               barSpacing: 36,
               rightOffset: 10,
             });
             chartRef.current.timeScale().setVisibleLogicalRange({
               from: Math.max(0, totalBars - span),
               to: totalBars + 4
             });
           }
         }, 80);
      }

      socket.emit('subscribe', selectedAsset.id);
      stateRef.current.isLoading = false;
    };

    // Socket.IO Tick Listener
    const onTick = (data: any) => {
      const state = stateRef.current;
      if (!state || state.isLoading) return;
      
      const cleanSelected = (selectedAsset.id || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const isMatch = data.instrumentId === selectedAsset.id ||
                      data.instrumentId === selectedAsset.name ||
                      (data.normalizedId && data.normalizedId === cleanSelected) ||
                      (data.instrumentId && data.instrumentId.toLowerCase() === selectedAsset.id.toLowerCase());

      if (isMatch) {
        // User Requirement 2: Current market price cannot exceed upper or lower bounds
        const upperBound = basePrice * 1.0035;
        const lowerBound = basePrice * 0.9965;
        const rawP = typeof data.price === 'number' ? data.price : Number(data.price || basePrice);
        const clampedPrice = Number(Math.max(lowerBound, Math.min(upperBound, rawP)).toFixed(precision));

        latestPriceRef.current = clampedPrice;
        state.price = clampedPrice;
        setTick(prev => prev + 1);
        
        if (data.candle && seriesRef.current) {
          try {
            const c = data.candle;
            const time = Math.floor(Number(c.time)) as Time;
            const cOpen = Number(Math.max(lowerBound, Math.min(upperBound, Number(c.open))).toFixed(precision));
            const cHigh = Number(Math.max(lowerBound, Math.min(upperBound, Number(c.high))).toFixed(precision));
            const cLow = Number(Math.max(lowerBound, Math.min(upperBound, Number(c.low))).toFixed(precision));
            const cClose = Number(Math.max(lowerBound, Math.min(upperBound, Number(c.close))).toFixed(precision));

            if (state.candles && state.candles.length > 0) {
              const lastC = state.candles[state.candles.length - 1];
              if (lastC && Math.floor(Number(lastC.time)) === (time as number)) {
                lastC.open = cOpen;
                lastC.high = cHigh;
                lastC.low = cLow;
                lastC.close = cClose;
              } else if (!lastC || (time as number) > Math.floor(Number(lastC.time))) {
                state.candles.push({
                  time: time as number,
                  open: cOpen,
                  high: cHigh,
                  low: cLow,
                  close: cClose,
                  volume: Number(c.volume || 10)
                });
              }
            }
            if (selectedChartType === 'Area' || selectedChartType === 'Line') {
                seriesRef.current.update({ time, value: cClose });
            } else {
                seriesRef.current.update({
                  time,
                  open: cOpen,
                  high: cHigh,
                  low: cLow,
                  close: cClose
                });
            }
          } catch (e) {}
        }
      }
    };
    
    socket.on('market:tick', onTick);

    loadInitialData();

    // Local heartbeat to ensure active chart movement and timely pending orders execution
    const tfMs = timeframe || 60000;
    const localTickInterval = setInterval(() => {
      if (stateRef.current.isLoading) return;
      const nowSec = Math.floor(Date.now() / 1000);
      const curr = latestPriceRef.current || basePrice;
      const maxDeviation = basePrice * 0.0035;
      let drift = 0;
      if (curr > basePrice + maxDeviation) {
        drift = -0.00025 * curr; // pull back down from top boundary
      } else if (curr < basePrice - maxDeviation) {
        drift = 0.00025 * curr; // pull back up from bottom boundary
      }
      const delta = (Math.random() - 0.5) * (curr * 0.00015) + drift;
      let nextPrice = curr + delta;
      // Clamp strictly within corridor so price can never go out of upper or lower bounds
      const upperBound = basePrice * 1.0035;
      const lowerBound = basePrice * 0.9965;
      nextPrice = Math.max(lowerBound, Math.min(upperBound, nextPrice));
      nextPrice = Number(nextPrice.toFixed(precision));
      latestPriceRef.current = nextPrice;
      stateRef.current.price = nextPrice;
      setTick(prev => prev + 1);

      if (seriesRef.current && stateRef.current.candles.length > 0) {
        const bucketTime = Math.floor(nowSec / (tfMs / 1000)) * (tfMs / 1000);
        const lastCandle = stateRef.current.candles[stateRef.current.candles.length - 1];
        if (lastCandle && Math.floor(Number(lastCandle.time)) === bucketTime) {
          lastCandle.close = nextPrice;
          if (nextPrice > lastCandle.high) lastCandle.high = nextPrice;
          if (nextPrice < lastCandle.low) lastCandle.low = nextPrice;
        } else if (!lastCandle || bucketTime > Math.floor(Number(lastCandle.time))) {
          stateRef.current.candles.push({
            time: bucketTime,
            open: nextPrice,
            high: nextPrice,
            low: nextPrice,
            close: nextPrice,
            volume: 10
          });

          // Keep extending future timestamps continuously ahead of current market price
          if (futureSeriesRef.current) {
            const stepSec = Math.max(5, tfMs / 1000);
            const futureList: { time: Time; value: number }[] = [];
            const cList = stateRef.current.candles;
            const startIdx = Math.max(0, cList.length - 80);
            for (let i = startIdx; i < cList.length; i++) {
              futureList.push({ time: Math.floor(Number(cList[i].time)) as Time, value: basePrice });
            }
            for (let i = 1; i <= 100; i++) {
              futureList.push({ time: (bucketTime + i * stepSec) as Time, value: basePrice });
            }
            futureSeriesRef.current.setData(futureList);
          }
        }
        try {
          if (selectedChartType === 'Area' || selectedChartType === 'Line') {
            seriesRef.current.update({ time: bucketTime as Time, value: nextPrice });
          } else {
            seriesRef.current.update({
              time: bucketTime as Time,
              open: lastCandle ? Number(lastCandle.open) : nextPrice,
              high: lastCandle ? Math.max(Number(lastCandle.high), nextPrice) : nextPrice,
              low: lastCandle ? Math.min(Number(lastCandle.low), nextPrice) : nextPrice,
              close: nextPrice
            });
          }
        } catch (e) {}
        const curActive = stateRef.current.candles[stateRef.current.candles.length - 1];
        if (curActive) {
          setActiveCandle({
            open: Number(curActive.open),
            high: Number(curActive.high),
            low: Number(curActive.low),
            close: Number(curActive.close),
          });
        }
      }
    }, 1000);

    return () => {
      clearInterval(localTickInterval);
      socket.off('market:tick', onTick);
      try {
        chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleLogicalRangeClamp);
      } catch (_) {}
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      futureSeriesRef.current = null;
      indicatorsRef.current.clear();
      indicatorPriceLinesRef.current.clear();
    };
  }, [selectedAsset, timeframe, selectedChartType, activeChartIdx, chartLayout]);

  // Historical Data: Prepend older candles when user zooms out far
  const loadMoreHistory = useCallback(() => {
    if (!seriesRef.current || stateRef.current.isLoading) return;
    const candles = stateRef.current.candles;
    if (!candles || candles.length === 0 || candles.length >= 600) return;

    const firstCandle = candles[0];
    const tfMs = timeframe || 60000;
    const stepSec = Math.max(5, tfMs / 1000);
    const count = 100;
    const olderCandles: any[] = [];
    let prevClose = Number(firstCandle.open);
    const volBase = (prevClose * 0.003) * Math.sqrt(tfMs / 60000);

    for (let i = count; i >= 1; i--) {
      const time = Math.floor(firstCandle.time) - i * stepSec;
      const open = prevClose + (Math.random() - 0.5) * volBase;
      const high = Math.max(open, prevClose) + Math.random() * volBase * 0.5;
      const low = Math.min(open, prevClose) - Math.random() * volBase * 0.5;
      const close = prevClose;
      olderCandles.push({
        time,
        open: Number(open.toFixed(5)),
        high: Number(high.toFixed(5)),
        low: Number(low.toFixed(5)),
        close: Number(close.toFixed(5)),
        volume: 10
      });
      prevClose = open;
    }

    const combined = [...olderCandles, ...candles];
    stateRef.current.candles = combined;

    const seen = new Set<number>();
    const formatted: any[] = [];
    for (const c of combined) {
      const t = Math.floor(Number(c.time));
      if (!t || seen.has(t)) continue;
      seen.add(t);
      if (selectedChartType === 'Area' || selectedChartType === 'Line') {
        formatted.push({ time: t as Time, value: Number(c.close) });
      } else {
        formatted.push({
          time: t as Time,
          open: Number(c.open),
          high: Number(c.high),
          low: Number(c.low),
          close: Number(c.close)
        });
      }
    }
    seriesRef.current.setData(formatted);
  }, [timeframe, selectedChartType]);

  // Quotex Zoom In & Zoom Out Handler
  const handleZoomIn = useCallback(() => {
    if (!chartRef.current) return;
    try {
      const timeScale = chartRef.current.timeScale();
      const logicalRange = timeScale.getVisibleLogicalRange();
      if (logicalRange) {
        const span = logicalRange.to - logicalRange.from;
        // Zoom In: Display fewer candles, candles appear larger & easier to read, minimum 6 candles
        const newSpan = Math.max(6, Math.round(span * 0.72));
        if (newSpan === span) return;

        sharedZoomSpanRef.current = newSpan;
        setSharedZoomSpan(newSpan);

        const totalBars = stateRef.current.candles.length || 200;
        const isNearLiveEdge = logicalRange.to >= totalBars - 6;

        if (isNearLiveEdge) {
          // Keep latest candle visible when following live prices
          const to = totalBars + 4;
          timeScale.setVisibleLogicalRange({
            from: to - newSpan,
            to: to,
          });
          timeScale.applyOptions({ rightOffset: 10 });
        } else {
          // If user scrolled into history, zoom smoothly around current center without jumping
          const center = (logicalRange.from + logicalRange.to) / 2;
          timeScale.setVisibleLogicalRange({
            from: center - newSpan / 2,
            to: center + newSpan / 2,
          });
        }

        // Maintain auto-scaling for price axis
        chartRef.current.priceScale('right').applyOptions({
          autoScale: true,
          scaleMargins: { top: 0.18, bottom: 0.22 },
        });
      }
    } catch (e) {
      console.warn('zoom in error', e);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!chartRef.current) return;
    try {
      const timeScale = chartRef.current.timeScale();
      const logicalRange = timeScale.getVisibleLogicalRange();
      if (logicalRange) {
        const span = logicalRange.to - logicalRange.from;
        // Limit zoom out so it never zooms out beyond Image 1 (maximum ~55-58 candles)
        const MAX_ZOOM_OUT_SPAN = 58;
        if (span >= MAX_ZOOM_OUT_SPAN) return;
        const newSpan = Math.min(MAX_ZOOM_OUT_SPAN, Math.round(span * 1.35));
        if (newSpan === span) return;

        sharedZoomSpanRef.current = newSpan;
        setSharedZoomSpan(newSpan);

        // Load additional historical candles when zooming out far
        if (logicalRange.from <= 12) {
          loadMoreHistory();
        }

        const totalBars = stateRef.current.candles.length || 200;
        const isNearLiveEdge = logicalRange.to >= totalBars - 6;

        if (isNearLiveEdge) {
          const to = totalBars + 4;
          timeScale.setVisibleLogicalRange({
            from: to - newSpan,
            to: to,
          });
          timeScale.applyOptions({ rightOffset: 10 });
        } else {
          const center = (logicalRange.from + logicalRange.to) / 2;
          timeScale.setVisibleLogicalRange({
            from: center - newSpan / 2,
            to: center + newSpan / 2,
          });
        }

        // Maintain auto-scaling for price axis
        chartRef.current.priceScale('right').applyOptions({
          autoScale: true,
          scaleMargins: { top: 0.18, bottom: 0.22 },
        });
      }
    } catch (e) {
      console.warn('zoom out error', e);
    }
  }, [loadMoreHistory]);

  // Vertical Candle Zoom Logic (stretching / compressing candle heights on Price Scale)
  const verticalZoomFactorRef = useRef<number>(1.0);

  const applyVerticalZoom = useCallback((newFactor: number) => {
    if (!chartRef.current) return;
    const clamped = Math.max(0.25, Math.min(2.5, newFactor));
    verticalZoomFactorRef.current = clamped;

    const candleFraction = Math.max(0.18, Math.min(0.94, 0.60 * clamped));
    const totalMargin = 1 - candleFraction;
    const top = Math.max(0.02, Math.min(0.42, totalMargin * 0.45));
    const bottom = Math.max(0.03, Math.min(0.44, totalMargin * 0.55));

    try {
      chartRef.current.priceScale('right').applyOptions({
        autoScale: true,
        scaleMargins: { top, bottom }
      });
    } catch (e) {
      console.warn('applyVerticalZoom error', e);
    }
  }, []);

  const handleVerticalZoomIn = useCallback(() => {
    applyVerticalZoom(verticalZoomFactorRef.current * 1.15);
  }, [applyVerticalZoom]);

  const handleVerticalZoomOut = useCallback(() => {
    applyVerticalZoom(verticalZoomFactorRef.current * 0.87);
  }, [applyVerticalZoom]);

  // Global Keyboard Shortcuts for Zooming (+ / -)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomIn, handleZoomOut]);
  
  useEffect(() => {
    if (!chartRef.current) return;
    const isLight = themeMode === 'Light Mode';
    const isTwilight = themeMode === 'Twilight';
    chartRef.current.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: appSettings.bgImage ? 'transparent' : (isLight ? '#ffffff' : (isTwilight ? '#222733' : '#12161f')) },
        textColor: isLight ? '#6b7280' : '#8390a0',
      },
      grid: {
        vertLines: { color: !appSettings.showVerticalGridLines ? 'transparent' : (isLight ? `rgba(0,0,0,${appSettings.gridOpacity / 100})` : `rgba(255, 255, 255, ${appSettings.gridOpacity / 100})`) },
        horzLines: { color: !appSettings.showHorizontalGridLines ? 'transparent' : (isLight ? `rgba(0,0,0,${appSettings.gridOpacity / 100})` : `rgba(255, 255, 255, ${appSettings.gridOpacity / 100})`) },
      },
      crosshair: {
        mode: 0,
        vertLine: { 
          visible: true,
          labelVisible: true,
          color: isLight ? 'rgba(30, 41, 59, 0.65)' : 'rgba(255, 255, 255, 0.65)', 
          width: 1, 
          style: 2,
          labelBackgroundColor: '#1e88e5'
        },
        horzLine: { 
          visible: true,
          labelVisible: true,
          color: isLight ? 'rgba(30, 41, 59, 0.65)' : 'rgba(255, 255, 255, 0.65)', 
          width: 1, 
          style: 2,
          labelBackgroundColor: '#1e88e5'
        },
      }
    });

    if (seriesRef.current) {
      seriesRef.current.applyOptions({
        upColor: appSettings.upColor,
        downColor: appSettings.downColor,
        wickUpColor: appSettings.upColor,
        wickDownColor: appSettings.downColor,
      });
    }
  }, [themeMode, appSettings]);

  

    


  // Indicators Effect
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;
    
    const currentKeys = Array.from(indicatorsRef.current.keys());
    
    // Remove inactive
    currentKeys.forEach(key => {
       if (!activeIndicators.includes(key)) {
          const seriesList = indicatorsRef.current.get(key) || [];
          seriesList.forEach(item => chart.removeSeries(item.series));
          indicatorsRef.current.delete(key);
       }
    });

    const candles = stateRef.current.candles;
    if (candles.length === 0) return;

    // Check if any active oscillator exists to reserve compact bottom pane per IMG 1
    const activeOscillators = activeIndicators.filter(ind => {
       const userSetting = indicatorSettings[ind] || getDefaultIndicatorSettings(ind);
       const res = IndicatorEngine.calculate(ind, candles, userSetting);
       return res && res.type === 'oscillator' && !hiddenIndicators[ind];
    });
    const hasOscillator = activeOscillators.length > 0;
    // Dynamic height calculation: 1m button bottom is at ~108px from chart bottom.
    // Oscillator curve must stay strictly below 1m button (max 92px from bottom).
    const containerH = chartContainerRef.current?.clientHeight || 650;
    const maxOscHeight = 92;
    const oscBottomMargin = hasOscillator ? Math.max(0.20, Math.min(0.28, (maxOscHeight + 15) / containerH)) : 0.22;
    chart.priceScale('right').applyOptions({
       autoScale: true,
       scaleMargins: { top: 0.18, bottom: oscBottomMargin }
    });

    activeIndicators.forEach(indicator => {
       const userSetting = indicatorSettings[indicator] || getDefaultIndicatorSettings(indicator);
       const result = IndicatorEngine.calculate(indicator, candles, userSetting);
       if (!result) return;
       const isHidden = hiddenIndicators[indicator] === true;
       const isOscillator = result.type === 'oscillator';
       
       let seriesList = indicatorsRef.current.get(indicator);
       if (!seriesList) {
           seriesList = [];
           
           if (result.data && result.data.length > 0) {
               const firstPlot = userSetting?.plots ? (Object.values(userSetting.plots)[0] as { color?: string; lineWidth?: number } | undefined) : null;
               const color = result.color || userSetting?.plots?.['main']?.color || firstPlot?.color || '#2962FF';
               const lineWidth = (result.lineWidth || userSetting?.plots?.['main']?.lineWidth || firstPlot?.lineWidth || 2) as any;
               const series = chart.addSeries(LineSeries, { 
                   color, 
                   lineWidth, 
                   priceScaleId: isOscillator ? indicator : 'right',
                   visible: !isHidden
               });
               seriesList.push({ type: 'line', series, id: 'main' });
           }
           
           if (result.lines) {
               result.lines.forEach(l => {
                   const plotConfig = (userSetting?.plots?.[l.id] || (userSetting?.plots ? Object.values(userSetting.plots)[0] : null)) as { color?: string; lineWidth?: number } | null;
                   const color = l.color || plotConfig?.color || '#2962FF';
                   const lineWidth = (l.lineWidth || plotConfig?.lineWidth || 2) as any;
                   const series = chart.addSeries(LineSeries, { 
                       color, 
                       lineWidth, 
                       priceScaleId: isOscillator ? indicator : 'right',
                       visible: !isHidden
                   });
                   seriesList.push({ type: 'line', series, id: l.id });
               });
           }
           
           if (result.histograms) {
               result.histograms.forEach(h => {
                   const plotConfig = (userSetting?.plots?.[h.id] || (userSetting?.plots ? Object.values(userSetting.plots)[0] : null)) as { color?: string; lineWidth?: number } | null;
                   const color = h.color || plotConfig?.color || '#2962FF';
                   const series = chart.addSeries(HistogramSeries, { 
                       color,
                       priceScaleId: isOscillator ? indicator : 'right',
                       visible: !isHidden
                   });
                   seriesList.push({ type: 'histogram', series, id: h.id });
               });
           }

           if (isOscillator) {
               // Dynamic topMargin ensures the curve's highest peak is strictly below 1m button (within bottom 92px)
               const oscFraction = maxOscHeight / containerH;
               const topMargin = Math.max(0.72, Math.min(0.92, 1 - oscFraction + 0.02));
               const botMargin = 0.02;

               chart.priceScale(indicator).applyOptions({
                   scaleMargins: { top: topMargin, bottom: botMargin },
                   borderVisible: false,
               });
           }
           indicatorsRef.current.set(indicator, seriesList);
       } else {
           // Update dynamic styles, colors, and visibility on existing series
           if (isOscillator) {
               const oscFraction = maxOscHeight / containerH;
               const topMargin = Math.max(0.72, Math.min(0.92, 1 - oscFraction + 0.02));
               const botMargin = 0.02;

               chart.priceScale(indicator).applyOptions({
                   scaleMargins: { top: topMargin, bottom: botMargin },
                   borderVisible: false,
               });
           }

           seriesList.forEach(item => {
               try {
                   item.series.applyOptions({ visible: !isHidden });
                   if (item.id === 'main') {
                       const firstPlot = userSetting?.plots ? (Object.values(userSetting.plots)[0] as { color?: string; lineWidth?: number } | undefined) : null;
                       const c = result.color || userSetting?.plots?.['main']?.color || firstPlot?.color;
                       const lw = result.lineWidth || userSetting?.plots?.['main']?.lineWidth || firstPlot?.lineWidth;
                       if (c) item.series.applyOptions({ color: c });
                       if (lw) item.series.applyOptions({ lineWidth: lw as any });
                   } else if (item.type === 'line') {
                       const resLine = result.lines?.find(l => l.id === item.id);
                       const plotConfig = (userSetting?.plots?.[item.id] || (userSetting?.plots ? Object.values(userSetting.plots)[0] : null)) as { color?: string; lineWidth?: number } | null;
                       const c = resLine?.color || plotConfig?.color || result.color;
                       const lw = resLine?.lineWidth || plotConfig?.lineWidth || result.lineWidth;
                       if (c) item.series.applyOptions({ color: c });
                       if (lw) item.series.applyOptions({ lineWidth: lw as any });
                   } else if (item.type === 'histogram') {
                       const resHist = result.histograms?.find(h => h.id === item.id);
                       const plotConfig = (userSetting?.plots?.[item.id] || (userSetting?.plots ? Object.values(userSetting.plots)[0] : null)) as { color?: string } | null;
                       const c = resHist?.color || plotConfig?.color;
                       if (c) item.series.applyOptions({ color: c });
                   }
               } catch (e) {}
           });
       }
       
       // Helper to normalize timestamp to seconds
       const toChartTime = (t: number): Time => {
           const num = Number(t);
           return (num > 1e11 ? Math.floor(num / 1000) : Math.floor(num)) as Time;
       };

       // Update data
       seriesList.forEach(item => {
           let dataToSet = [];
           if (item.id === 'main') {
               dataToSet = result.data.map(d => ({ time: toChartTime(d.time), value: d.value }));
           } else if (item.type === 'line') {
               const lineData = result.lines?.find(l => l.id === item.id)?.data || [];
               dataToSet = lineData.map(d => ({ time: toChartTime(d.time), value: d.value }));
           } else if (item.type === 'histogram') {
               const histData = result.histograms?.find(h => h.id === item.id)?.data || [];
               dataToSet = histData.map(d => ({ time: toChartTime(d.time), value: d.value, color: d.color }));
           }
           
           // Filter invalid values, ensure unique times and sorted
           const validData = dataToSet.filter(d => d.time !== undefined && d.time !== null && !isNaN(d.time as number) && d.value !== undefined && d.value !== null && !isNaN(d.value) && isFinite(d.value));
           const uniqueData = Array.from(new Map(validData.map(item => [item.time, item])).values())
                .sort((a, b) => (a.time as number) - (b.time as number));
           
           if (uniqueData.length > 0) {
               try {
                   item.series.setData(uniqueData);
               } catch (e) { console.error('Error setting indicator data:', e); }
           }
       });
       
       // Note: markers logic can be added here if needed for Fractals
       if (result.markers && result.markers.length > 0) {
           const series = seriesList[0]?.series;
           if (series) {
               const markers = result.markers.map(m => ({
                   time: toChartTime(m.time),
                   position: m.position as any,
                   color: m.color,
                   shape: m.shape as any,
                   text: m.text
               })).sort((a, b) => (a.time as number) - (b.time as number));
               try {
                   series.setMarkers(markers);
               } catch(e) {}
           }
       }
    });

  }, [activeIndicators, indicatorSettings, hiddenIndicators, timeframe, selectedAsset, selectedChartType, stateRef.current.candles.length, tick]);

  // Keep track of positions via ref for the interval
  const positionsRef = useRef<BinaryPosition[]>([]);
  useEffect(() => { positionsRef.current = positions; }, [positions]);

  // Trade Expiration Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const prev = positionsRef.current;
      
      let hasChanges = false;
      let balanceToAdd = 0;
      const active: BinaryPosition[] = [];
      const closedTrades: TradeHistoryItem[] = [];

      prev.forEach(p => {
        // Collect live tick price for the mini sparkline chart (Image 3)
        if (latestPriceRef.current) {
          const curP = latestPriceRef.current;
          if (!p.priceHistory) p.priceHistory = [p.entryPrice];
          if (p.priceHistory[p.priceHistory.length - 1] !== curP) {
            p.priceHistory.push(curP);
            if (p.priceHistory.length > 50) p.priceHistory.shift();
          }
        }

        if (now >= p.expireTime) {
          hasChanges = true;
          const closePrice = latestPriceRef.current;
          let isWin = false;
          let isTie = false;

          if (p.type === 'UP') {
            if (closePrice > p.entryPrice) isWin = true;
            else if (closePrice === p.entryPrice) isTie = true;
          } else {
            if (closePrice < p.entryPrice) isWin = true;
            else if (closePrice === p.entryPrice) isTie = true;
          }

          let pnl = 0;
          if (isWin) {
            pnl = p.amount * p.payoutRate;
            balanceToAdd += (p.amount + pnl);
          } else if (isTie) {
            balanceToAdd += p.amount;
          } else {
            pnl = -p.amount;
          }

          if (p.line && seriesRef.current) {
            try { seriesRef.current.removePriceLine(p.line); } catch(e) {}
          }

          closedTrades.push({
            ...p,
            exitPrice: closePrice,
            pnl,
            timestamp: now,
            priceHistory: p.priceHistory || [p.entryPrice, closePrice]
          });
        } else {
          active.push(p);
        }
      });

      
      if (hasChanges) {
         setPositions(active);
         if (balanceToAdd > 0) setBalance(b => b + balanceToAdd);
         if (closedTrades.length > 0) {
            setTradeHistory(th => [...closedTrades, ...th].slice(0, 50));
            window.dispatchEvent(new CustomEvent('trade_closed', { detail: closedTrades[closedTrades.length - 1] }));
            
            // If tutorial trade closed, trigger the "Your Trade Result" modal (User Image 4)
            if (tutorialTradeIdRef.current) {
              const matchedTutTrade = closedTrades.find(ct => ct.id === tutorialTradeIdRef.current);
              if (matchedTutTrade) {
                setTutorialClosedTrade(matchedTutTrade);
                setTutorialStep('TRADE_RESULT');
                setIsOnboardingOpen(true);
                tutorialTradeIdRef.current = null;
              }
            }

            if (auth.currentUser) {
              closedTrades.forEach(ct => {
                updateDoc(doc(db, 'demoTrades', ct.id), {
                  exitPrice: ct.exitPrice,
                  pnl: ct.pnl,
                  status: 'CLOSED'
                }).catch(console.error).catch(e => console.warn("updateDoc err:", e));
                
                if (ct.pnl >= 0) { // Win or tie returns balance
                  setDoc(doc(db, 'demoLedger', ct.id + '_exit'), {
                    userId: auth.currentUser.uid,
                    amount: ct.amount + ct.pnl,
                    type: ct.pnl > 0 ? 'TRADE_WIN' : 'TRADE_TIE',
                    referenceId: ct.id,
                    timestamp: Date.now()
                  }).catch(console.error).catch(e => console.warn("setDoc err:", e));
                }
              });
            }
         }
      }

    }, 100);
    return () => clearInterval(interval);
  }, [setBalance]);

  // Trade Result Notification Listener
  useEffect(() => {
    const handleTradeClosed = (e: Event) => {
      const customEvent = e as CustomEvent<TradeHistoryItem>;
      setTradeResultNotification(customEvent.detail);
      showClosedTradePopup(customEvent.detail);
      setTimeout(() => {
        setTradeResultNotification(null);
      }, 7000);
    };
    
    const handleExecutePending = (e: Event) => {
       const customEvent = e as CustomEvent<any>;
       const order = customEvent.detail;
       if (order.amount < minBet) {
         return;
       }
       // Execute exactly like handleTrade but from order details
       if (balance < order.amount) {
         // Silently fail if not enough balance for pending order
         return;
       }
       setBalance(b => b - order.amount);
       
       const entryPrice = latestPriceRef.current;
       const durationSecsMap: Record<string, number> = {
          'M1': 60, 'M5': 300, 'M15': 900, 'M30': 1800, 'H1': 3600
       };
       const durationToUse = durationSecsMap[order.period] || 60;
       const expireTime = Date.now() + durationToUse * 1000;
       
       const shortTitle = appSettings.shortOrderLabel !== false
         ? `${order.type === 'UP' ? '▲' : '▼'} ${order.amount} ${currency}`
         : `${order.type === 'UP' ? 'BUY' : 'SELL'} ${currency}${order.amount}`;

       const line = seriesRef.current?.createPriceLine({
         price: entryPrice,
         color: order.type === 'UP' ? '#0ba259' : '#e33f4a',
         lineWidth: 2,
         lineStyle: 0,
         axisLabelVisible: true,
         title: shortTitle,
       });
       
    const newPos: BinaryPosition = {
      id: generateTradeUUID(),
      type: order.type,
      amount: order.amount,
      entryPrice,
      entryTime: Date.now(),
      expireTime,
      asset: order.asset,
      payoutRate: activePayoutRate,
      line,
      priceHistory: [entryPrice],
      sellDecayPoints: generateSellDecay(),
    };
    
    if (auth.currentUser) {
      setDoc(doc(db, 'demoTrades', newPos.id), {
        userId: auth.currentUser.uid,
        asset: newPos.asset,
        type: newPos.type,
        amount: newPos.amount,
        entryPrice: newPos.entryPrice,
        exitPrice: 0,
        pnl: 0,
        status: 'OPEN',
        entryTime: newPos.entryTime,
        expireTime: newPos.expireTime
      }).catch(console.error).catch(e => console.warn("setDoc err:", e));
      
      setDoc(doc(db, 'demoLedger', newPos.id + '_entry'), {
        userId: auth.currentUser.uid,
        amount: -newPos.amount,
        type: 'TRADE_LOSS', // Placeholder type for opening trade debit
        referenceId: newPos.id,
        timestamp: Date.now()
      }).catch(console.error).catch(e => console.warn("setDoc err:", e));
        }
    
    setPositions(prev => [...prev, newPos]);
    const decimals = (newPos.asset.toLowerCase().includes('crypto') || newPos.asset.toLowerCase().includes('bitcoin')) ? 2 : 5;
    addQuotexToast(`Trade opened with price: ${Number(newPos.entryPrice).toFixed(decimals)} ${newPos.asset}`, 'success');
    }; // Close handleExecutePending
    
    window.addEventListener('trade_closed', handleTradeClosed);
    window.addEventListener('execute_pending_order', handleExecutePending);
    return () => {
       window.removeEventListener('trade_closed', handleTradeClosed);
       window.removeEventListener('execute_pending_order', handleExecutePending);
    };
  }, [balance, setBalance]);

  const handleEarlyClose = (id: string, sellValue: number) => {
    const trade = positionsRef.current.find(p => p.id === id);
    if (!trade) return;

    // Quotex Image 6: Cannot sell a hedged trade (if opposite position open on same asset)
    const isHedged = positionsRef.current.some(p => p.id !== id && p.asset === trade.asset && p.type !== trade.type);
    if (isHedged) {
      addQuotexToast('You cannot sell a hedged trade', 'error');
      return;
    }
       
    if (trade.line && seriesRef.current) {
       try { seriesRef.current.removePriceLine(trade.line); } catch(e) {}
    }
       
    setBalance(b => b + sellValue);
       
    const closedTrade: TradeHistoryItem = {
       ...trade,
       exitPrice: latestPriceRef.current || trade.entryPrice,
       pnl: sellValue - trade.amount,
       timestamp: Date.now()
    };
    
    if (auth.currentUser) {
      updateDoc(doc(db, 'demoTrades', trade.id), {
        exitPrice: closedTrade.exitPrice,
        pnl: closedTrade.pnl,
        status: 'CLOSED'
      }).catch(console.error).catch(e => console.warn("updateDoc err:", e));
      
      if (sellValue > 0) {
        setDoc(doc(db, 'demoLedger', trade.id + '_exit'), {
          userId: auth.currentUser.uid,
          amount: sellValue,
          type: closedTrade.pnl > 0 ? 'TRADE_WIN' : 'TRADE_LOSS',
          referenceId: trade.id,
          timestamp: Date.now()
        }).catch(console.error).catch(e => console.warn("setDoc err:", e));
      }
    }

    setTradeHistory(th => [closedTrade, ...th].slice(0, 50));
    setPositions(prev => prev.filter(p => p.id !== id));
    showClosedTradePopup({ ...closedTrade, refundAmount: sellValue, isEarlySell: true });
    window.dispatchEvent(new CustomEvent('trade_closed', { detail: closedTrade }));
    // Quotex Image 5: Trade sold successfully popup
    addQuotexToast(`Trade sold for ${sellValue} ${currency} (${closedTrade.pnl.toFixed(2)} ${currency})`, 'success');
  };

  const handleMarketTrade = (signal: any) => {
    setSelectedAsset(signal.asset);
    setCurrentView('TRADE');
    setTimeout(() => {
       handleTrade(signal.direction);
    }, 500);
  };
  const handleTrade = (type: 'UP' | 'DOWN') => {
    if (investment < minBet) {
      showToast(`Minimum investment is ${minBet} ${currency}`, 'warning');
      return;
    }
    if (balance < investment) {
      showToast("Insufficient balance", 'warning');
      return;
    }
    setBalance(b => b - investment);

    if (isPendingTrade) {
       const newOrder = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          amount: investment,
          asset: selectedAsset.name,
          payoutRate: activePayoutRate,
          pendingType: pendingTradeType,
          quote: pendingQuote,
          time: pendingTime,
          period: pendingPeriod,
          createdAt: Date.now()
       };
       setPendingOrders(prev => [...prev, newOrder]);
       setActiveTab('ORDERS');
       setIsPendingTrade(false);
       return;
    }

    const entryPrice = latestPriceRef.current;
    const isTutorialTrade = isOnboardingOpen && (tutorialStep === 'CHOOSE_DIRECTION' || tutorialStep === 'SET_PARAMETERS');
    const tradeDurationSecs = isTutorialTrade ? 6 : durationSecs;
    const expireTime = Date.now() + tradeDurationSecs * 1000;

    const shortTitle = appSettings.shortOrderLabel !== false
      ? `${type === 'UP' ? '▲' : '▼'} ${investment} ${currency}`
      : `${type === 'UP' ? 'BUY' : 'SELL'} ${currency}${investment}`;

    const line = seriesRef.current?.createPriceLine({
      price: entryPrice,
      color: type === 'UP' ? '#0ba259' : '#e33f4a',
      lineWidth: 2,
      lineStyle: 0, // 2 is dashed, similar to Quotex active trades
      axisLabelVisible: true,
      title: shortTitle,
    });

    
    const newPos: BinaryPosition = {
      id: generateTradeUUID(),
      type,
      amount: investment,
      entryPrice,
      entryTime: Date.now(),
      expireTime,
      asset: selectedAsset.name,
      payoutRate: activePayoutRate,
      line,
      priceHistory: [entryPrice],
      sellDecayPoints: generateSellDecay(),
    };
    
    if (auth.currentUser) {
      setDoc(doc(db, 'demoTrades', newPos.id), {
        userId: auth.currentUser.uid,
        asset: newPos.asset,
        type: newPos.type,
        amount: newPos.amount,
        entryPrice: newPos.entryPrice,
        exitPrice: 0,
        pnl: 0,
        status: 'OPEN',
        entryTime: newPos.entryTime,
        expireTime: newPos.expireTime
      }).catch(console.error).catch(e => console.warn("setDoc err:", e));
      
      setDoc(doc(db, 'demoLedger', newPos.id + '_entry'), {
        userId: auth.currentUser.uid,
        amount: -newPos.amount,
        type: 'TRADE_LOSS', // Placeholder type for opening trade debit
        referenceId: newPos.id,
        timestamp: Date.now()
      }).catch(console.error).catch(e => console.warn("setDoc err:", e));
    }


    setPositions(prev => [...prev, newPos]);

    // Quotex Image 4: Trade opened with price notification popup
    const decimals = selectedAsset.id.includes('crypto') || selectedAsset.id.includes('bitcoin') ? 2 : (selectedAsset.decimals ?? 5);
    const formattedPrice = Number(entryPrice).toFixed(decimals);
    addQuotexToast(`Trade opened with price: ${formattedPrice} ${selectedAsset.name}`, 'success');

    if (isTutorialTrade) {
      tutorialTradeIdRef.current = newPos.id;
      setIsOnboardingOpen(false);
      showToast(`🎯 Demo ${type} trade placed! Watch the live chart as it resolves (6s)...`, 'info');
    } else if (isOnboardingOpen) {
      setIsOnboardingOpen(false);
      localStorage.setItem('quotex_onboarding_completed', 'true');
      localStorage.removeItem('show_onboarding_tutorial');
      showToast(`🎉 Demo ${type} trade placed successfully! Good luck!`, 'success');
    }
  };

  const formatTimeDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatTimeLeft = (expireTime: number) => {
    const ms = Math.max(0, expireTime - Date.now());
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s%60).toString().padStart(2, '0')}`;
  };

  const getActivePnl = (trade: BinaryPosition) => {
    const currentPrice = latestPriceRef.current;
    if (trade.type === 'UP') return currentPrice > trade.entryPrice ? trade.amount * trade.payoutRate : (currentPrice === trade.entryPrice ? 0 : -trade.amount);
    return currentPrice < trade.entryPrice ? trade.amount * trade.payoutRate : (currentPrice === trade.entryPrice ? 0 : -trade.amount);
  };

  const requestTrade = (type: 'UP' | 'DOWN') => {
    if (appSettings.oneClickTrade || isOnboardingOpen) {
      handleTrade(type);
    } else {
      setPendingConfirmTrade(type);
    }
  };

  const confirmPendingTrade = () => {
    if (!pendingConfirmTrade) return;
    const type = pendingConfirmTrade;
    if (dontAskConfirmAgain) {
      setAppSettings(prev => ({ ...prev, oneClickTrade: true }));
    }
    setPendingConfirmTrade(null);
    handleTrade(type);
  };

  return (
    <div className={`flex h-screen w-full bg-[var(--bg-main)] text-[var(--text-primary)] font-sans text-sm overflow-hidden select-none ${themeMode === 'Light Mode' ? 'theme-light' : themeMode === 'Twilight' ? 'dark theme-twilight' : 'dark theme-full-night'}`}>
      
      {/* ASSET SELECTOR MODAL */}
      {isAssetModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/60 flex pt-[60px] justify-center items-start">
          <div className="w-[800px] bg-[var(--bg-panel)] rounded shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[var(--border-color)] flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
              <h2 className="text-[var(--text-primary)] text-[19px] font-bold">Select trade pair</h2>
              <button onClick={() => setIsAssetModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <X size={20}/>
              </button>
            </div>
            
            {/* Tabs & Search */}
            <div className="p-4 flex flex-col gap-5 border-b border-[var(--border-color)]">
               <div className="flex gap-2">
                  {(['CURRENCIES', 'CRYPTO', 'COMMODITIES', 'STOCKS'] as const).map(tab => (
                     <button 
                       key={tab} 
                       onClick={() => setAssetTab(tab)}
                       className={`px-3 py-1.5 rounded text-[11px] font-black tracking-wide ${assetTab === tab ? 'bg-[#1e88e5] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'}`}
                     >
                       {tab}
                     </button>
                  ))}
               </div>
               <div className="flex gap-2 h-10">
                  <button className="bg-[var(--hover-bg)] w-16 rounded border border-[var(--border-color)] flex items-center justify-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    <Star size={14} className="fill-current" /> <span className="text-xs font-bold pt-0.5">0</span>
                  </button>
                  <div className="flex-1 bg-[var(--hover-bg)] rounded border border-[var(--border-color)] flex items-center px-4 gap-3 focus-within:border-[#8390a0] transition-colors">
                     <Search size={16} className="text-[var(--text-muted)]" />
                     <input 
                       type="text" 
                       placeholder="Search" 
                       className="bg-transparent border-none outline-none text-[var(--text-primary)] text-sm w-full placeholder-[#8390a0]"
                       value={searchQuery}
                       onChange={e => setSearchQuery(e.target.value)}
                     />
                  </div>
               </div>
            </div>

            {/* List Header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-2 border-b border-[var(--border-color)] text-[11px] font-medium text-[var(--text-muted)]">
               <div className="w-5"></div>
               <div>Name</div>
               <div className="w-24 text-right">24h changing</div>
               <div className="w-24 text-right">Profit 1+ min ▼</div>
               <div className="w-20 text-right">5+ min</div>
            </div>

            {/* List Body */}
            <div className="overflow-y-auto custom-scrollbar flex-1 pb-2">
               {sortedEnrichedAssets.map(asset => (
                  <div 
                    key={asset.id} 
                    onClick={() => { 
                      chooseTradingAsset(asset); 
                      setIsAssetModalOpen(false);
                      if (isOnboardingOpen && tutorialStep === 'HOW_TO_START') {
                        setTutorialStep('FIRST_PREDICTION');
                      }
                    }}
                    className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-3 items-center hover:bg-[var(--hover-bg)] cursor-pointer border-b border-[var(--border-color)]/50 group transition-colors"
                  >
                     <Star size={16} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" />
                     <div className="flex items-center gap-2">
                        <AssetIcon asset={asset} />
                        <span className="text-[var(--text-primary)] text-[13px] font-bold">{asset.name}</span>
                        {selectedAsset.id === asset.id && <Check size={14} className="text-[#1e88e5] ml-2" />}
                     </div>
                     {(() => {
                        // Use tick and asset.id to generate pseudo-random fluctuations
                        // Ensure tick changes dynamically over time
                        const baseChar = asset.id.charCodeAt(0) || 1;
                        
                        // 24h changing
                        const tick2m = Math.floor(tick / 120);
                        const tickOffset = (tick2m * 0.1) + baseChar;
                        const fluctuation24h = Math.sin(tickOffset) * 0.25;
                        const currentChange = parseFloat((asset.change24h + fluctuation24h).toFixed(2));
                        const isPos = currentChange >= 0;

                        // Profit 1+ min: base between 85-98, fluctuate rapidly
                        const base1 = 85 + (baseChar % 10);
                        const p1 = Math.min(98, Math.max(85, Math.round(base1 + Math.sin(tick2m * 0.5 + baseChar) * 8)));

                        // Profit 5+ min: base between 85-98, fluctuate
                        const baseChar2 = asset.id.length > 1 ? asset.id.charCodeAt(1) : 2;
                        const base5 = 85 + (baseChar2 % 10);
                        const p5 = Math.min(98, Math.max(85, Math.round(base5 + Math.cos(tick2m * 0.3 + baseChar2) * 8)));

                        return (
                           <>
                              <div className={`w-24 text-right text-[11px] font-bold flex items-center justify-end gap-1 ${isPos ? 'text-[#0ba259]' : 'text-[#e33f4a]'}`}>
                                 {isPos ? <ArrowUpCircle size={12}/> : <ArrowDownCircle size={12}/>}
                                 {isPos ? '+' : ''}{currentChange.toFixed(2)}%
                              </div>
                              <div className="w-24 text-right text-[13px] font-black text-[#f59e0b]">
                                 {p1}%
                              </div>
                              <div className="w-20 text-right text-[13px] font-black text-[#f59e0b]">
                                 {p5}%
                              </div>
                           </>
                        );
                     })()}
                  </div>
               ))}
               {filteredAssets.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-[var(--text-muted)] py-10 opacity-60">
                     <Search size={32} className="mb-2" />
                     <span className="text-sm">No pairs found</span>
                  </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <div className={`w-[60px] bg-[var(--bg-panel)] flex flex-col items-center py-2.5 border-r border-[var(--border-color)] shrink-0 z-20 justify-between overflow-y-auto ${isFocusMode ? 'hidden' : ''}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex flex-col gap-3 w-full items-center">
          <div onClick={() => setIsSidebarExpanded(true)} className="w-full flex justify-center py-1 cursor-pointer mb-0.5">
            <div className="flex flex-col items-center justify-center w-6 h-6 hover:opacity-80 transition-opacity cursor-pointer">
               <div className="flex flex-col gap-[3px] items-center justify-center w-5 h-5">
                 <div className="w-5 h-[2px] bg-[var(--text-primary)] rounded-full"></div>
                 <div className="w-4 h-[2px] bg-[var(--text-primary)] rounded-full mr-auto"></div>
                 <div className="w-5 h-[2px] bg-[var(--text-primary)] rounded-full"></div>
               </div>
            </div>
          </div>
          
          {/* Trade */}
          {/* TRADE */}
          <div onClick={() => setCurrentView('TRADE')} className="w-full flex flex-col items-center justify-center relative py-1 cursor-pointer group">
            <div className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${currentView === 'TRADE' ? (themeMode === 'Light Mode' ? 'bg-[#FAF2F4] text-[#A0002A]' : 'bg-[#1e88e5] text-white shadow-lg shadow-[#1e88e5]/25') : (themeMode === 'Light Mode' ? 'text-[#A0002A] group-hover:bg-[#FAF2F4]' : 'text-[var(--text-muted)] group-hover:bg-[var(--hover-bg)] group-hover:text-[var(--text-primary)]')}`}>
              <LineChart size={20} />
            </div>
            {currentView === 'TRADE' && <div className={`absolute -right-[1px] top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-l-full ${themeMode === 'Light Mode' ? 'bg-[#A0002A]' : 'bg-[#1e88e5]'}`}></div>}
            <span className={`text-[9px] font-bold uppercase mt-1 tracking-wider transition-colors ${currentView === 'TRADE' ? (themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-primary)]') : (themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]')}`}>{t('trade')}</span>
          </div>
          
          {/* Support */}
          <div onClick={() => setCurrentView('SUPPORT')} className="w-full flex flex-col items-center justify-center py-1 cursor-pointer hover:bg-[var(--hover-bg)]/40 rounded transition-colors group relative">
            <div className="flex flex-col items-center">
              <HelpCircle size={20} className={currentView === 'SUPPORT' ? (themeMode === 'Light Mode' ? 'text-[#A0002A]' : 'text-[var(--text-primary)]') : (themeMode === 'Light Mode' ? 'text-[#A0002A]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]')} />
              <span className={`text-[9px] font-bold uppercase mt-0.5 tracking-wider ${currentView === 'SUPPORT' ? (themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-primary)]') : (themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]')}`}>{t('support')}</span>
            </div>
            {currentView === 'SUPPORT' && <div className={`absolute -right-[1px] top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-l-full ${themeMode === 'Light Mode' ? 'bg-[#A0002A]' : 'bg-[#1e88e5]'}`}></div>}
          </div>

          {/* Account */}
          <div onClick={() => setCurrentView('ACCOUNT')} className="w-full flex flex-col items-center justify-center py-1 cursor-pointer hover:bg-[var(--hover-bg)]/40 rounded transition-colors group relative">
            <div className="flex flex-col items-center">
              <User size={20} className={currentView === 'ACCOUNT' ? (themeMode === 'Light Mode' ? 'text-[#A0002A]' : 'text-[var(--text-primary)]') : (themeMode === 'Light Mode' ? 'text-[#A0002A]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]')} />
              <span className={`text-[9px] font-bold uppercase mt-0.5 tracking-wider ${currentView === 'ACCOUNT' ? (themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-primary)]') : (themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]')}`}>{t('account')}</span>
            </div>
            {currentView === 'ACCOUNT' && <div className={`absolute -right-[1px] top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-l-full ${themeMode === 'Light Mode' ? 'bg-[#A0002A]' : 'bg-[#1e88e5]'}`}></div>}
          </div>

          {/* Tournaments */}
          <div onClick={() => setCurrentView('TOURNAMENTS')} className="w-full flex flex-col items-center justify-center py-1 cursor-pointer hover:bg-[var(--hover-bg)]/40 rounded transition-colors group relative">
            <div className="flex flex-col items-center">
              <Trophy size={20} className={currentView === 'TOURNAMENTS' ? (themeMode === 'Light Mode' ? 'text-[#A0002A]' : 'text-[var(--text-primary)]') : (themeMode === 'Light Mode' ? 'text-[#A0002A]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]')} />
              <span className={`text-[9px] font-bold uppercase text-center leading-tight mt-0.5 tracking-wider ${currentView === 'TOURNAMENTS' ? (themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-primary)]') : (themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]')}`}>TOURNA</span>
            </div>
            {currentView === 'TOURNAMENTS' && <div className={`absolute -right-[1px] top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-l-full ${themeMode === 'Light Mode' ? 'bg-[#A0002A]' : 'bg-[#1e88e5]'}`}></div>}
          </div>

          {/* Market */}
          <div onClick={() => setCurrentView('MARKET')} className="w-full flex flex-col items-center justify-center py-1 cursor-pointer hover:bg-[var(--hover-bg)]/40 rounded transition-colors group relative">
            <div className="flex flex-col items-center">
              <ShoppingBag size={20} className={currentView === 'MARKET' ? (themeMode === 'Light Mode' ? 'text-[#A0002A]' : 'text-[var(--text-primary)]') : (themeMode === 'Light Mode' ? 'text-[#A0002A]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]')} />
              <span className={`text-[9px] font-bold uppercase mt-0.5 tracking-wider ${currentView === 'MARKET' ? (themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-primary)]') : (themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]')}`}>{t('market')}</span>
            </div>
            {currentView === 'MARKET' && <div className={`absolute -right-[1px] top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-l-full ${themeMode === 'Light Mode' ? 'bg-[#A0002A]' : 'bg-[#1e88e5]'}`}></div>}
          </div>

          {/* Analytics */}
          <div onClick={() => setCurrentView('MORE')} className="w-full flex flex-col items-center justify-center py-1 cursor-pointer hover:bg-[var(--hover-bg)]/40 rounded transition-colors group relative">
            <div className="flex flex-col items-center">
              <MoreHorizontal size={20} className={currentView === 'MORE' ? (themeMode === 'Light Mode' ? 'text-[#A0002A]' : 'text-[var(--text-primary)]') : (themeMode === 'Light Mode' ? 'text-[#A0002A]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]')} />
              <span className={`text-[9px] font-bold uppercase mt-0.5 tracking-wider ${currentView === 'MORE' ? (themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-primary)]') : (themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]')}`}>{t('analytics')}</span>
            </div>
            {currentView === 'MORE' && <div className={`absolute -right-[1px] top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-l-full ${themeMode === 'Light Mode' ? 'bg-[#A0002A]' : 'bg-[#1e88e5]'}`}></div>}
          </div>
          
          {/* Sentiment bar under Analytics - fresh, crisp, razor-sharp styling per user IMG 3 */}
          <div className="w-full flex flex-col items-center relative mt-4 mb-3">
             <div className="text-[11px] font-black text-[#ff4b55] leading-none mb-1.5 select-none antialiased tracking-tight">{globalSentiment.down}%</div>
             <div className="w-2.5 h-[152px] bg-[#1e2430] rounded-full flex flex-col overflow-hidden relative" style={{ transform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden' }}>
                <div className="w-full bg-[#ff4b55] transition-all duration-700 ease-in-out" style={{ height: `${globalSentiment.down}%` }}></div>
                <div className="w-full bg-[#00c26f] transition-all duration-700 ease-in-out" style={{ height: `${globalSentiment.up}%` }}></div>
             </div>
             <div className="text-[11px] font-black text-[#00c26f] leading-none mt-1.5 select-none antialiased tracking-tight">{globalSentiment.up}%</div>
          </div>
        </div>

        {/* Bottom Tools & Buttons */}
        <div className="flex flex-col w-full items-center relative mt-auto pt-3 pb-3">
          <div className="relative mt-1">
            <button 
              onClick={() => setShowLayoutMenu(!showLayoutMenu)} 
              className={`w-9 h-9 rounded-lg hover:bg-[var(--hover-bg)] flex items-center justify-center transition-colors ${chartLayout !== '1' || showLayoutMenu ? 'text-[#1e88e5] bg-[#1e88e5]/15' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`} 
              title="Chart Multi-Screen Layout"
            >
              <LayoutGrid size={19}/>
            </button>
            {showLayoutMenu && (
              <>
                <div className="fixed inset-0 z-[9998]" onClick={() => setShowLayoutMenu(false)} />
                <div className="fixed left-[68px] bottom-28 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl shadow-2xl p-4 w-[290px] z-[9999] flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Multi-Screen Layout</span>
                    <button onClick={() => setShowLayoutMenu(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-md hover:bg-[var(--hover-bg)]"><X size={14}/></button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2.5">
                    <div onClick={() => {setChartLayout('1'); setShowLayoutMenu(false);}} className={`w-12 h-12 rounded-lg border-2 cursor-pointer flex p-1 transition-all ${chartLayout==='1'?'border-[#1e88e5] bg-[#1e88e5]/10':'border-[var(--border-color)] hover:border-gray-400'}`} title="Single Screen (1 Chart)">
                      <div className="w-full h-full border border-current rounded-sm"></div>
                    </div>
                    
                    <div onClick={() => {setChartLayout('2v'); setShowLayoutMenu(false);}} className={`w-12 h-12 rounded-lg border-2 cursor-pointer flex gap-[2px] p-1 transition-all ${chartLayout==='2v'?'border-[#1e88e5] bg-[#1e88e5]/10':'border-[var(--border-color)] hover:border-gray-400'}`} title="2 Charts (Vertical Split)">
                      <div className="w-1/2 h-full border border-current rounded-sm"></div>
                      <div className="w-1/2 h-full border border-current rounded-sm"></div>
                    </div>
                    
                    <div onClick={() => {setChartLayout('2h'); setShowLayoutMenu(false);}} className={`w-12 h-12 rounded-lg border-2 cursor-pointer flex flex-col gap-[2px] p-1 transition-all ${chartLayout==='2h'?'border-[#1e88e5] bg-[#1e88e5]/10':'border-[var(--border-color)] hover:border-gray-400'}`} title="2 Charts (Horizontal Split)">
                      <div className="w-full h-1/2 border border-current rounded-sm"></div>
                      <div className="w-full h-1/2 border border-current rounded-sm"></div>
                    </div>
                    
                    <div onClick={() => {setChartLayout('3'); setShowLayoutMenu(false);}} className={`w-12 h-12 rounded-lg border-2 cursor-pointer flex gap-[2px] p-1 transition-all ${chartLayout==='3'?'border-[#1e88e5] bg-[#1e88e5]/10':'border-[var(--border-color)] hover:border-gray-400'}`} title="3 Charts">
                      <div className="w-1/2 h-full border border-current rounded-sm"></div>
                      <div className="w-1/2 h-full flex flex-col gap-[2px]">
                        <div className="w-full h-1/2 border border-current rounded-sm"></div>
                        <div className="w-full h-1/2 border border-current rounded-sm"></div>
                      </div>
                    </div>

                    <div onClick={() => {setChartLayout('4'); setShowLayoutMenu(false);}} className={`w-12 h-12 rounded-lg border-2 cursor-pointer flex flex-wrap p-1 transition-all ${chartLayout==='4'?'border-[#1e88e5] bg-[#1e88e5]/10':'border-[var(--border-color)] hover:border-gray-400'}`} title="4 Charts (2x2 Grid)">
                      <div className="w-[calc(50%-1px)] h-[calc(50%-1px)] border border-current rounded-sm m-[0.5px]"></div>
                      <div className="w-[calc(50%-1px)] h-[calc(50%-1px)] border border-current rounded-sm m-[0.5px]"></div>
                      <div className="w-[calc(50%-1px)] h-[calc(50%-1px)] border border-current rounded-sm m-[0.5px]"></div>
                      <div className="w-[calc(50%-1px)] h-[calc(50%-1px)] border border-current rounded-sm m-[0.5px]"></div>
                    </div>

                    <div onClick={() => {setChartLayout('5'); setShowLayoutMenu(false);}} className={`w-12 h-12 rounded-lg border-2 cursor-pointer flex gap-[2px] p-1 transition-all ${chartLayout==='5'?'border-[#1e88e5] bg-[#1e88e5]/10':'border-[var(--border-color)] hover:border-gray-400'}`} title="5 Charts">
                      <div className="w-1/3 h-full border border-current rounded-sm flex flex-col gap-[2px]">
                         <div className="w-full h-1/2 border border-current rounded-sm"></div>
                         <div className="w-full h-1/2 border border-current rounded-sm"></div>
                      </div>
                      <div className="w-1/3 h-full border border-current rounded-sm flex flex-col gap-[2px]">
                         <div className="w-full h-1/2 border border-current rounded-sm"></div>
                         <div className="w-full h-1/2 border border-current rounded-sm"></div>
                      </div>
                      <div className="w-1/3 h-full border border-current rounded-sm"></div>
                    </div>

                    <div onClick={() => {setChartLayout('6'); setShowLayoutMenu(false);}} className={`w-12 h-12 rounded-lg border-2 cursor-pointer flex flex-wrap p-1 transition-all ${chartLayout==='6'?'border-[#1e88e5] bg-[#1e88e5]/10':'border-[var(--border-color)] hover:border-gray-400'}`} title="6 Charts (3x2 Grid)">
                      <div className="w-[calc(33.33%-1px)] h-[calc(50%-1px)] border border-current rounded-sm m-[0.5px]"></div>
                      <div className="w-[calc(33.33%-1px)] h-[calc(50%-1px)] border border-current rounded-sm m-[0.5px]"></div>
                      <div className="w-[calc(33.33%-1px)] h-[calc(50%-1px)] border border-current rounded-sm m-[0.5px]"></div>
                      <div className="w-[calc(33.33%-1px)] h-[calc(50%-1px)] border border-current rounded-sm m-[0.5px]"></div>
                      <div className="w-[calc(33.33%-1px)] h-[calc(50%-1px)] border border-current rounded-sm m-[0.5px]"></div>
                      <div className="w-[calc(33.33%-1px)] h-[calc(50%-1px)] border border-current rounded-sm m-[0.5px]"></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <button onClick={() => setIsPromotionOpen(true)} className="w-9 h-9 mt-2.5 rounded-lg hover:bg-[var(--hover-bg)] flex items-center justify-center transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]" title="Promotions"><Megaphone size={19}/></button>
          <button onClick={toggleFullscreen} className="w-9 h-9 mt-2.5 rounded-lg hover:bg-[var(--hover-bg)] flex items-center justify-center transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]" title="Fullscreen"><Scan size={19}/></button>
          <button onClick={() => setIsFullscreenModalOpen(true)} className="w-9 h-9 mt-2.5 rounded-lg hover:bg-[var(--hover-bg)] flex items-center justify-center transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]" title="Settings"><Settings size={19}/></button>
          <button 
            onClick={() => setIsJoinUsOpen(true)} 
            className={`w-[44px] h-[46px] mt-3.5 rounded-lg flex flex-col items-center justify-center transition-colors shadow-sm group ${
              themeMode === 'Light Mode'
                ? 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
                : 'bg-[#1c2430] hover:bg-[#253041] text-white'
            }`} 
            title="Join Us"
          >
            <Users size={17} className={themeMode === 'Light Mode' ? 'text-gray-700 group-hover:text-gray-900' : 'text-gray-200 group-hover:text-white transition-colors'}/>
            <span className={`text-[7.5px] font-black mt-1 tracking-wider select-none ${themeMode === 'Light Mode' ? 'text-gray-800' : 'text-white'}`}>JOIN US</span>
          </button>
          <button onClick={() => setCurrentView('SUPPORT')} className="w-[44px] h-[46px] mt-2.5 bg-[#0ba259] rounded-lg text-white flex flex-col items-center justify-center hover:bg-[#0ba259]/90 transition-colors shadow-lg shadow-[#0ba259]/20" title="Help & Support">
            <HelpCircle size={18}/>
            <span className="text-[8.5px] font-bold mt-0.5 select-none">Help</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
      {/* EXPANDED SIDEBAR OVERLAY */}
      {isSidebarExpanded && (
        <div className="fixed inset-0 z-[200] flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarExpanded(false)}></div>
          <div className="relative w-[280px] bg-[var(--bg-panel)] h-full flex flex-col border-r border-[var(--border-color)] shadow-2xl animate-in slide-in-from-left duration-200 overflow-y-auto">
            {/* Close button */}
            <div className="p-4 flex justify-start">
              <X size={24} className="text-[var(--text-primary)] cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setIsSidebarExpanded(false)} />
            </div>
            
            {/* Icons list (centered) */}
            <div className="flex flex-col items-center gap-5 mt-4">
               {/* TRADE */}
               <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => { setCurrentView('TRADE'); setIsSidebarExpanded(false); }}>
                 <div className={`w-10 h-10 rounded flex items-center justify-center ${themeMode === 'Light Mode' ? 'bg-[#FAF2F4] text-[#A0002A]' : 'bg-[#1e88e5] text-[var(--text-primary)]'}`}><LineChart size={20}/></div>
                 <span className={`text-[10px] font-bold uppercase tracking-wide ${themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-primary)]'}`}>{t('trade')}</span>
               </div>
               
               {/* SUPPORT */}
               <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => { setCurrentView('SUPPORT'); setIsSidebarExpanded(false); }}>
                 <div className={`w-10 h-10 rounded flex items-center justify-center transition-colors hover:bg-[var(--hover-bg)] ${themeMode === 'Light Mode' ? 'text-[#A0002A] hover:text-[#A0002A]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}><HelpCircle size={20}/></div>
                 <span className={`text-[10px] font-bold uppercase tracking-wide ${themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-primary)]'}`}>{t('support')}</span>
               </div>

               {/* ACCOUNT */}
               <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => { setCurrentView('ACCOUNT'); setIsSidebarExpanded(false); }}>
                 <div className={`w-10 h-10 rounded flex items-center justify-center transition-colors hover:bg-[var(--hover-bg)] ${themeMode === 'Light Mode' ? 'text-[#A0002A] hover:text-[#A0002A]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}><User size={20}/></div>
                 <span className={`text-[10px] font-bold uppercase tracking-wide ${themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-primary)]'}`}>{t('account')}</span>
               </div>

               {/* TOURNAMENTS */}
               <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => { setCurrentView('TOURNAMENTS'); setIsSidebarExpanded(false); }}>
                 <div className={`relative w-10 h-10 rounded flex items-center justify-center transition-colors hover:bg-[var(--hover-bg)] ${themeMode === 'Light Mode' ? 'text-[#A0002A] hover:text-[#A0002A]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                   <Trophy size={20}/>
                 </div>
                 <span className={`text-[10px] font-bold uppercase tracking-wide text-center ${themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-primary)]'}`}>TOURNA</span>
               </div>

               {/* MARKET */}
               <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => { setCurrentView('MARKET'); setIsSidebarExpanded(false); }}>
                 <div className={`relative w-10 h-10 rounded flex items-center justify-center transition-colors hover:bg-[var(--hover-bg)] ${themeMode === 'Light Mode' ? 'text-[#A0002A] hover:text-[#A0002A]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                   <ShoppingBag size={20}/>
                 </div>
                 <span className={`text-[10px] font-bold uppercase tracking-wide ${themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-primary)]'}`}>{t('market')}</span>
               </div>

               {/* MORE */}
               <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => { setCurrentView('MORE'); setIsSidebarExpanded(false); }}>
                 <div className={`w-10 h-10 rounded flex items-center justify-center transition-colors hover:bg-[var(--hover-bg)] ${themeMode === 'Light Mode' ? 'text-[#A0002A] hover:text-[#A0002A]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}><MoreHorizontal size={20}/></div>
                 <span className={`text-[10px] font-bold uppercase tracking-wide ${themeMode === 'Light Mode' ? 'text-[#0050A4]' : 'text-[var(--text-primary)]'}`}>{t('analytics')}</span>
               </div>
            </div>
            
            <div className="w-full px-6 mt-8 mb-6">
               <div className="w-full h-[1px] bg-[var(--hover-bg)]"></div>
            </div>
            
            <div className="flex flex-col px-6 gap-5 text-[15px] font-medium tracking-wide">
               <div className="text-[var(--text-primary)] text-sm mb-2 font-bold truncate">demo6a87e6a6f7de9f@qxbroker.com</div>
               <div className="text-[var(--text-primary)] hover:text-[#1e88e5] cursor-pointer transition-colors" onClick={() => { setCurrentView('deposit_history'); setIsSidebarExpanded(false); }}>{t('depositHistory')}</div>
               <div className="text-[var(--text-primary)] hover:text-[#1e88e5] cursor-pointer transition-colors" onClick={() => { setCurrentView('withdrawal_history'); setIsSidebarExpanded(false); }}>{t('withdrawalHistory')}</div>
               <div className="text-[var(--text-primary)] hover:text-[#1e88e5] cursor-pointer transition-colors" onClick={() => { setCurrentView('deposit'); setIsSidebarExpanded(false); }}>{t('deposit')}</div>
               <div className="text-[var(--text-primary)] hover:text-[#1e88e5] cursor-pointer transition-colors" onClick={() => { setCurrentView('withdrawal'); setIsSidebarExpanded(false); }}>{t('withdrawal')}</div>
               <div className="text-[var(--text-primary)] hover:text-[#1e88e5] cursor-pointer transition-colors" onClick={() => { setCurrentView('trade_history'); setIsSidebarExpanded(false); }}>{t('tradeHistory')}</div>
               <div className="text-[var(--text-primary)] hover:text-[#1e88e5] cursor-pointer transition-colors" onClick={() => { setCurrentView('ACCOUNT'); setIsSidebarExpanded(false); }}>{t('myAccount')}</div>
            </div>
            
            <div className="mt-12 px-6 py-6 flex flex-col gap-5 text-[15px] font-medium tracking-wide mb-8">
               <div className="text-[var(--text-primary)] hover:text-[#1e88e5] cursor-pointer transition-colors" onClick={() => navigate("/about")}>{t('aboutUs')}</div>
               <div 
                 className="text-[#1e88e5] hover:text-[#42a5f5] cursor-pointer flex items-center gap-2 font-bold transition-colors" 
                 onClick={() => { 
                   localStorage.removeItem('quotex_onboarding_completed');
                   localStorage.removeItem('tutorial_dismissed');
                   setTutorialStep('WELCOME');
                   setIsOnboardingOpen(true);
                   setIsSidebarExpanded(false); 
                 }}
               >
                 <GraduationCap size={18} /> Interactive Tutorial
               </div>
               <div className="text-[var(--text-primary)] hover:text-[#1e88e5] cursor-pointer transition-colors" onClick={() => { setCurrentView("SUPPORT"); setIsSidebarExpanded(false); }}>{t('support')}</div>
               <div className="text-[#e33f4a] hover:text-[#ff4b5a] cursor-pointer flex items-center gap-2 mt-4 transition-colors" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
                  <LogOut size={18} /> {t('logout')}
               </div>
            </div>
          </div>
        </div>
      )}

        {/* TOP HEADER */}
        <div className={`h-14 bg-[var(--bg-panel)] border-b border-[var(--border-color)] flex items-center justify-between px-4 shrink-0 z-20 ${isFocusMode ? 'hidden' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 select-none cursor-default" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
               <div className="relative w-8 h-7">
                 <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_5px_rgba(0,163,255,0.5)]">
                   <defs>
                     <linearGradient id="z-blue-trading" x1="0" y1="0" x2="1" y2="0">
                       <stop offset="0%" stopColor="#00d4ff" />
                       <stop offset="100%" stopColor="#0044ff" />
                     </linearGradient>
                     <linearGradient id="z-silver-trading" x1="0" y1="0" x2="1" y2="0">
                       <stop offset="0%" stopColor="#ffffff" />
                       <stop offset="100%" stopColor="#a0a0a0" />
                     </linearGradient>
                   </defs>
                   <path d="M 20 25 L 75 25 L 45 55 L 20 55 L 35 40 L 20 40 Z" fill="url(#z-blue-trading)"/>
                   <path d="M 40 75 L 95 75 L 65 45 L 40 45 L 55 60 L 40 60 Z" fill="url(#z-silver-trading)"/>
                 </svg>
               </div>
               <span className="text-[var(--text-primary)] font-black tracking-wider text-2xl flex items-center">ZORVE<span className="text-[#00a3ff]">X</span></span>
            </div>
            <div className="w-[1px] h-4 bg-[var(--hover-bg)]"></div>
            <span className="text-[10px] text-[var(--text-muted)] font-black tracking-[0.2em] pt-0.5">WEB TRADING PLATFORM</span>
          </div>
          
          <div onClick={() => setCurrentView("deposit")} className="hidden lg:flex bg-[#0ba259]/10 border border-[#0ba259]/50 rounded-full px-4 py-1.5 items-center gap-2 shadow-[0_0_15px_rgba(11,162,89,0.15)] cursor-pointer hover:bg-[#0ba259]/20 transition-colors">
            <span className="text-xl -ml-2 drop-shadow-md">🚀</span>
            <span className="text-[var(--text-primary)] text-[13px]">Get a <span className="font-bold underline decoration-[#0ba259] decoration-2 underline-offset-2">20% bonus</span> on your deposit!</span>
            <span className="bg-[#0ba259] text-white text-[11px] font-black px-2 py-0.5 rounded-sm ml-2">20%</span>
          </div>

          <div className="flex items-center gap-3">

            <button 
              onClick={() => setCurrentView('SUPPORT')} 
              title="Help & Support"
              className="relative w-9 h-9 flex items-center justify-center rounded-full bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg-strong)] transition-colors"
            >
              <HelpCircle size={18} />
            </button>
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative w-9 h-9 flex items-center justify-center rounded-full bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg-strong)] transition-colors">
              <Bell size={18} />
            </button>
            <div onClick={() => setShowAccountDropdown(!showAccountDropdown)} className="flex items-center bg-[var(--hover-bg)] rounded cursor-pointer overflow-hidden hover:bg-[var(--hover-bg-strong)] transition-colors relative">
              <div className="px-4 py-1.5 flex items-center gap-3 min-w-[140px]">
                {accountType === 'DEMO' ? <GraduationCap size={20} className="text-[var(--text-primary)]" /> : <User size={20} className="text-[var(--text-primary)]" />}
                <div className="flex flex-col justify-center">
                   <span className={`text-[10px] font-black leading-none uppercase tracking-wide ${accountType === 'DEMO' ? 'text-[#f59e0b]' : 'text-[#1e88e5]'}`}>{accountType === 'DEMO' ? t('demoAccount') : (t('realAccount') || 'REAL ACCOUNT')}</span>
                   <span className="text-[var(--text-primary)] text-[15px] font-bold leading-tight mt-0.5">{currency}{balance.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                </div>
              </div>
              <div className="px-2 border-l border-[#1f2631] self-stretch flex items-center justify-center bg-[var(--hover-bg)]">
                <ChevronDown size={14} className="text-[var(--text-primary)]" />
              </div>
            </div>
            <button onClick={() => setCurrentView('deposit')} className="bg-[#0ba259] hover:bg-[#0ba259]/90 text-white font-bold text-sm px-5 py-2.5 rounded flex items-center gap-1.5 transition-colors shadow-sm">
              <Plus size={16} strokeWidth={3} /> {t('deposit')}
            </button>
            <button onClick={() => setCurrentView('withdrawal')} className={`font-bold text-sm px-5 py-2.5 rounded transition-colors ${themeMode === 'Light Mode' ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 shadow-sm' : 'bg-[#3b4353] hover:bg-[#4a5468] text-white'}`}>
              {t('withdrawal')}
            </button>
          </div>

            {/* Account Dropdown */}
            {showAccountDropdown && (
              <div className="absolute top-14 right-40 w-[500px] bg-[#2b313f] shadow-2xl rounded-md flex border border-[var(--border-color)] z-50 overflow-hidden text-white">
                {/* Left side */}
                <div className="w-[300px] bg-[#2b313f] flex flex-col">
                   <div className="p-4 border-b border-[var(--border-color)]">
                      <div className="flex bg-[#3b4353] p-3 rounded items-center gap-3 mb-4">
                        <div className="w-10 h-10 flex items-center justify-center text-[#0ba259] shrink-0 -ml-2 -mt-2">
                           <Send size={24} className="-rotate-45" fill="currentColor"/>
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] font-bold text-[var(--text-primary)] tracking-wider">STANDARD:</div>
                          <div className="text-sm font-black">+0% profit</div>
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center bg-[#4a5468] rounded cursor-pointer hover:bg-[#5b667b]" onClick={(e) => { e.stopPropagation(); const newVal = !hideBalance; setHideBalance(newVal); localStorage.setItem('hideBalance', newVal.toString()); }}>
                          {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                        </div>
                      </div>
                      
                      <div className="font-bold text-base mb-1 truncate">babaji890-@gmail.com</div>
                      <div className="text-xs text-white mb-3">ID: 92472244</div>
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <span className="text-white">Currency:</span> {currentCurrencyCode}
                        <span 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setShowAccountDropdown(false); 
                            setIsExchangeModalOpen(true); 
                          }} 
                          className="bg-[#1e88e5] hover:bg-[#1976d2] text-[10px] px-2.5 py-0.5 rounded cursor-pointer text-white ml-2 font-semibold transition-colors shadow-sm tracking-wide"
                        >
                          CHANGE
                        </span>
                      </div>
                   </div>
                   
                   <div className="p-4 border-b border-[var(--border-color)] flex flex-col gap-2">
                     <div className="flex items-start gap-4 cursor-pointer group" onClick={() => { setAccountType('LIVE'); setShowAccountDropdown(false); }}>
                        <div className={`w-[18px] h-[18px] mt-1 rounded-full border-2 flex items-center justify-center shrink-0 ${accountType === 'LIVE' ? 'border-[#1e88e5]' : 'border-[var(--text-muted)]'}`}>
                            {accountType === 'LIVE' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center justify-between">
                              <div className="font-bold text-sm text-white transition-colors">{t('realAccount') || 'Real Account'}</div>
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  const newBal = (liveBalance || 0) + 10000;
                                  setLiveBalance(newBal);
                                  localStorage.setItem('rajadhan_balance', newBal.toString());
                                  showToast('Real Account topped up with +$10,000!', 'success');
                                }}
                                className="px-2 py-0.5 bg-[#00a65a] hover:bg-[#00b864] text-white rounded text-[10px] font-bold flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
                                title="Top up Real Account balance"
                              >
                                <span>+ Top Up ($10k)</span>
                              </button>
                           </div>
                           <div className="font-black text-[15px] text-[#00a65a] mt-0.5">{hideBalance ? '******' : `${currency}${liveBalance.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}`}</div>
                           <div className="text-[11px] text-white mt-1">The daily limit is not set</div>
                           <div className="text-[10px] font-bold text-[#1e88e5] mt-0.5 uppercase cursor-pointer hover:underline">SET LIMIT</div>
                        </div>
                     </div>
                   </div>
                   
                   <div className="p-5 flex flex-col gap-2 bg-[#262c3b]">
                     <div className="flex items-center gap-4 cursor-pointer group" onClick={() => { setAccountType('DEMO'); setShowAccountDropdown(false); }}>
                        <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 ${accountType === 'DEMO' ? 'border-[#1e88e5] bg-[#1e88e5]' : 'border-[var(--text-muted)]'}`}>
                            {accountType === 'DEMO' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                           <div>
                             <div className="font-bold text-sm text-white transition-colors">{t('demoAccount') || 'Demo Account'}</div>
                             <div className="font-black text-[15px] text-white mt-0.5 flex items-center gap-2">
                               {hideBalance ? '******' : `${currency}${demoBalance.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}`}
                               {demoBalance < 10000 && (
                                 <button onClick={(e) => { e.stopPropagation(); setIsRefreshing(true); setTimeout(() => { setDemoBalance(10000); setIsRefreshing(false); }, 500); }} className={`text-white hover:text-[#1e88e5] transition-colors ${isRefreshing ? 'animate-spin text-[#1e88e5]' : ''}`} title="Top up Demo Account">
                                   <RefreshCw size={12} strokeWidth={3} />
                                 </button>
                               )}
                             </div>
                           </div>
                           <PenTool size={14} className="text-white hover:text-white" />
                        </div>
                     </div>
                   </div>
                </div>
                
                {/* Right side */}
                <div className="flex-1 bg-[#1f2631] p-4 flex flex-col gap-4">
                   <div className="text-sm font-bold text-white hover:text-[#1e88e5] cursor-pointer" onClick={() => {setCurrentView('deposit_history'); setShowAccountDropdown(false)}}>{t('depositHistory') || 'Deposit History'}</div>
                   <div className="text-sm font-bold text-white hover:text-[#1e88e5] cursor-pointer" onClick={() => {setCurrentView('withdrawal_history'); setShowAccountDropdown(false)}}>{t('withdrawalHistory') || 'Withdrawal History'}</div>
                   <div className="text-sm font-bold text-white hover:text-[#1e88e5] cursor-pointer" onClick={() => {setCurrentView("deposit"); setShowAccountDropdown(false)}}>{t('deposit') || 'Deposit'}</div>
                   <div className="text-sm font-bold text-white hover:text-[#1e88e5] cursor-pointer" onClick={() => {setCurrentView("withdrawal"); setShowAccountDropdown(false)}}>{t('withdrawal') || 'Withdrawal'}</div>
                   <div className="text-sm font-bold text-white hover:text-[#1e88e5] cursor-pointer" onClick={() => {setCurrentView('trade_history'); setShowAccountDropdown(false)}}>{t('tradeHistory') || 'Trade History'}</div>
                   <div className="text-sm font-bold text-white hover:text-[#1e88e5] cursor-pointer mb-2" onClick={() => {setCurrentView("ACCOUNT"); setShowAccountDropdown(false)}}>{t('myAccount') || 'My account'}</div>
                   <div className="w-full h-[1px] bg-[#3b4353]"></div>
                   <div className="text-sm font-bold text-[#e33f4a] hover:text-[#ee4450] flex items-center gap-2 cursor-pointer mt-2" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                     {t('logout') || 'Logout'}
                   </div>
                </div>
              </div>
            )}
            
            {/* Notifications Dropdown (Image 3) */}
            {showNotifications && (
              <div className={`absolute top-14 right-4 w-[420px] max-h-[80vh] shadow-2xl rounded-lg flex flex-col z-50 overflow-hidden animate-in fade-in duration-150 ${
                themeMode === 'Light Mode'
                  ? 'bg-white border border-gray-200 text-gray-900'
                  : 'bg-[#1f2633] border border-[#2d3748] text-white'
              }`}>
                <div className={`p-3.5 px-4 border-b flex justify-between items-center shrink-0 ${
                  themeMode === 'Light Mode'
                    ? 'bg-white border-gray-200'
                    : 'bg-[#1f2633] border-[#2d3748]'
                }`}>
                   <span className={`font-extrabold text-[15px] tracking-tight ${themeMode === 'Light Mode' ? 'text-gray-900' : 'text-white'}`}>
                     Notifications
                   </span>
                   <div className="flex items-center gap-4">
                     <span 
                       onClick={() => { setNotifications([]); showToast('All notifications marked as read', 'info'); }}
                       className="text-[#1e88e5] hover:text-[#1565c0] text-xs font-bold uppercase cursor-pointer tracking-wider transition-colors"
                     >
                       MARK ALL AS READ
                     </span>
                     <button 
                       onClick={() => setShowNotifications(false)} 
                       className={`transition-colors cursor-pointer p-0.5 ${
                         themeMode === 'Light Mode' ? 'text-gray-400 hover:text-gray-700' : 'text-[#8492a6] hover:text-white'
                       }`}
                     >
                       <X size={16} />
                     </button>
                   </div>
                </div>
                <div className={`flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-5 relative min-h-[140px] ${
                  themeMode === 'Light Mode' ? 'bg-white' : 'bg-[#1f2633]'
                }`}>
                   {notifications.length === 0 ? (
                     <div className={`text-center py-14 text-sm font-medium select-none ${
                       themeMode === 'Light Mode' ? 'text-gray-500' : 'text-[#8492a6]'
                     }`}>
                       No notifications available.
                     </div>
                   ) : (
                     <>
                       <div className={`absolute left-[29px] top-5 bottom-5 w-[1px] z-0 ${
                         themeMode === 'Light Mode' ? 'bg-gray-200' : 'bg-[#2d3748]'
                       }`}></div>
                       {notifications.map(notif => (
                         <div key={notif.id} className="flex gap-4 relative z-10">
                           <div className="w-[32px] h-[32px] bg-[#1e88e5]/15 border border-[#1e88e5]/30 shrink-0 mt-1 flex items-center justify-center rounded-full">
                              <Bell size={15} className="text-[#1e88e5]" />
                           </div>
                           <div className="flex-1 bg-transparent relative">
                              <div className={`text-[11px] font-semibold mb-0.5 ${
                                themeMode === 'Light Mode' ? 'text-gray-500' : 'text-[#8492a6]'
                              }`}>
                                {new Date(notif.timestamp).toLocaleString()}
                              </div>
                              <div className={`text-[13px] font-medium leading-relaxed mb-1.5 ${
                                themeMode === 'Light Mode' ? 'text-gray-800' : 'text-white/90'
                              }`}>
                                {notif.message}
                              </div>
                              {notif.imageUrl && <img src={notif.imageUrl} alt="Notification" className="w-full h-auto rounded-md mb-2 object-cover max-h-48" />}
                           </div>
                         </div>
                       ))}
                     </>
                   )}
                </div>
              </div>
            )}

        </div>

        {/* CHART AREA */}
        <div className={`flex-1 relative bg-[var(--bg-chart)] ${currentView === 'TRADE' ? 'block' : 'hidden'}`} style={appSettings.bgImage ? { backgroundImage: `url(${appSettings.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
          <div className={`absolute inset-0 grid gap-[1px] bg-[#3b4353] ${
            chartLayout === '1' ? 'grid-cols-1 grid-rows-1' :
            chartLayout === '2v' ? 'grid-cols-2 grid-rows-1' :
            chartLayout === '2h' ? 'grid-cols-1 grid-rows-2' :
            chartLayout === '3' ? 'grid-cols-2 grid-rows-2' :
            chartLayout === '4' ? 'grid-cols-2 grid-rows-2' :
            chartLayout === '5' ? 'grid-cols-3 grid-rows-2' :
            chartLayout === '6' ? 'grid-cols-3 grid-rows-2' : 'grid-cols-1 grid-rows-1'
          }`}>
            {Array.from({ length: chartLayout === '1' ? 1 : chartLayout === '2v' || chartLayout === '2h' ? 2 : chartLayout === '3' ? 3 : chartLayout === '4' ? 4 : chartLayout === '5' ? 5 : chartLayout === '6' ? 6 : 1 }).map((_, i) => {
               if (i === activeChartIdx) {
                  return (
                     <div key={i} className={`relative w-full h-full overflow-hidden bg-[var(--bg-chart)] ${chartLayout === '3' && i === 0 ? 'row-span-2' : (chartLayout === '5' && i === 0 ? 'row-span-2' : '')} ${chartLayout !== '1' ? 'border-2 border-[#1e88e5]' : ''}`}>
                        
              <div 
                ref={chartContainerRef} 
                className="absolute inset-0 w-full h-full" 
                onMouseLeave={() => {
                  if (hoverDebounceTimerRef.current) {
                    clearTimeout(hoverDebounceTimerRef.current);
                    hoverDebounceTimerRef.current = null;
                  }
                  setHoveredCandle(null);
                }} 
              />
              
              {/* Compact Circular Zorvex Loader (0.20s / 200ms) */}
              {isChartLoading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-[var(--bg-chart)]/75 backdrop-blur-[2px] pointer-events-none select-none transition-opacity duration-200">
                  <div className="flex flex-col items-center justify-center gap-2">
                    {/* Compact Circular Spinner Container */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      {/* Outer Smooth Rotating Loading Arc Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-sky-500/20 border-t-[#00d4ff] border-r-[#0066ff] animate-spin"></div>
                      {/* Inner Micro Glow Ring */}
                      <div className="absolute inset-1 rounded-full border border-sky-400/15 border-b-[#00d4ff]/60 animate-spin [animation-duration:1.8s] [animation-direction:reverse]"></div>
                      {/* Dark Frosted Circular Core */}
                      <div className="w-11 h-11 rounded-full bg-[#12161f]/95 border border-white/10 shadow-[0_0_15px_rgba(0,163,255,0.35)] flex items-center justify-center">
                        {/* Zorvex SVG Emblem */}
                        <div className="w-6 h-5">
                          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_6px_rgba(0,163,255,0.8)]">
                            <defs>
                              <linearGradient id="z-blue-loader-circle" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#00d4ff" />
                                <stop offset="100%" stopColor="#0055ff" />
                              </linearGradient>
                              <linearGradient id="z-silver-loader-circle" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="100%" stopColor="#b0b0b0" />
                              </linearGradient>
                            </defs>
                            <path d="M 20 25 L 75 25 L 45 55 L 20 55 L 35 40 L 20 40 Z" fill="url(#z-blue-loader-circle)"/>
                            <path d="M 40 75 L 95 75 L 65 45 L 40 45 L 55 60 L 40 60 Z" fill="url(#z-silver-loader-circle)"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* Sleek Mini Brand Label */}
                    <div className="text-[10px] font-black tracking-widest text-[var(--text-primary)] flex items-center select-none uppercase">
                      ZORVE<span className="text-[#00a3ff]">X</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Interactive Price Scale Vertical Zoom Area (Y-Axis / Candles Vertical Zoom In & Out) */}
              <div 
                className="absolute top-0 right-0 bottom-6 w-[70px] z-10 cursor-ns-resize select-none touch-none bg-transparent"
                title="Scroll or drag up/down on Price Scale to vertically Zoom In/Out candles, double-click to reset"
                onWheel={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.deltaY < 0) {
                    handleVerticalZoomIn();
                  } else if (e.deltaY > 0) {
                    handleVerticalZoomOut();
                  }
                }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  priceScaleDragRef.current = {
                    isDragging: true,
                    startY: e.clientY,
                    accumulated: 0
                  };
                  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (!priceScaleDragRef.current.isDragging) return;
                  const dy = priceScaleDragRef.current.startY - e.clientY;
                  priceScaleDragRef.current.startY = e.clientY;
                  if (dy !== 0) {
                    // dy > 0: drag up -> vertically expand candles (zoom in)
                    // dy < 0: drag down -> vertically compress candles (zoom out)
                    applyVerticalZoom(verticalZoomFactorRef.current + dy * 0.015);
                  }
                }}
                onPointerUp={(e) => {
                  priceScaleDragRef.current.isDragging = false;
                  priceScaleDragRef.current.accumulated = 0;
                  try {
                    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
                  } catch (_) {}
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  verticalZoomFactorRef.current = 1.0;
                  if (chartRef.current && stateRef.current.candles.length > 0) {
                    const totalBars = stateRef.current.candles.length;
                    chartRef.current.timeScale().applyOptions({ barSpacing: 36, rightOffset: 10 });
                    chartRef.current.timeScale().setVisibleLogicalRange({
                      from: Math.max(0, totalBars - 18),
                      to: totalBars + 4
                    });
                    chartRef.current.priceScale('right').applyOptions({
                      autoScale: true,
                      scaleMargins: { top: 0.18, bottom: 0.22 }
                    });
                  }
                }}
              />
              
              {/* Active Screen Tag at bottom-left corner of active chart in multi-screen mode (User Request 1: Restored to original position) */}
              {chartLayout !== '1' && (
                <div className="absolute bottom-3 left-16 z-10 pointer-events-none select-none">
                  <div className="bg-[#1e88e5] text-white font-bold text-xs px-2.5 py-1 rounded shadow-lg flex items-center gap-1.5 border border-white/20">
                     <span className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center text-[10px] font-mono">{i + 1}</span>
                     <span>{selectedAsset.name}</span>
                     <span className="text-[9px] bg-white/25 px-1 py-0.2 rounded font-extrabold uppercase tracking-wider">ACTIVE</span>
                  </div>
                </div>
              )}

              {/* Candle OHLC inside Active Chart Tile in multi-screen mode (Req 4: Candle OHLC visible when cursor is on candle in selected chart) */}
              {chartLayout !== '1' && hoveredCandle && (() => {
                const ohlc = hoveredCandle;
                const diff = ohlc.close - ohlc.open;
                const diffPct = ohlc.open > 0 ? (diff / ohlc.open) * 100 : 0;
                const isUp = diff >= 0;
                const decimals = currentAssetDecimals;

                return (
                  <div className={`absolute top-3 ${i === 0 ? 'left-16' : 'left-3'} z-20 pointer-events-none select-none max-w-[calc(100%-85px)] overflow-hidden`}>
                    <div className={`px-2 py-0.5 rounded-md border backdrop-blur-md shadow-md flex items-center gap-1.5 font-mono text-[9.5px] leading-tight max-w-full overflow-hidden truncate ${
                      themeMode === 'Light Mode'
                        ? 'bg-white/95 border-gray-200 text-gray-800 shadow-sm'
                        : 'bg-[#18202d]/95 border-[#283244] text-gray-200 shadow-black/40'
                    }`}>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <span className="text-gray-400 font-sans text-[8.5px]">O:</span>
                        <span className="font-semibold">{ohlc.open.toFixed(decimals)}</span>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <span className="text-gray-400 font-sans text-[8.5px]">H:</span>
                        <span className="font-semibold">{ohlc.high.toFixed(decimals)}</span>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <span className="text-gray-400 font-sans text-[8.5px]">L:</span>
                        <span className="font-semibold">{ohlc.low.toFixed(decimals)}</span>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <span className="text-gray-400 font-sans text-[8.5px]">C:</span>
                        <span className={`font-bold ${isUp ? 'text-[#00c26f]' : 'text-[#ff4b55]'}`}>
                          {ohlc.close.toFixed(decimals)}
                        </span>
                      </div>
                      <div className={`text-[9px] font-bold px-1 py-0.2 rounded text-center shrink-0 ${
                        isUp ? 'bg-[#00c26f]/15 text-[#00c26f]' : 'bg-[#ff4b55]/15 text-[#ff4b55]'
                      }`}>
                        {isUp ? '+' : ''}{diff.toFixed(decimals)} ({isUp ? '+' : ''}{diffPct.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                );
              })()}
            
            {pendingDrawing && (
              <div 
                className="absolute inset-0 z-20 cursor-crosshair" style={{ touchAction: "none" }}
                onPointerDown={(e) => {
                  if (!chartRef.current || !seriesRef.current || !pendingDrawingRef.current) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                  const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
                  
                  const timeScale = chartRef.current.timeScale();
                  let logical = timeScale.coordinateToLogical(x);
                  const vr = timeScale.getVisibleLogicalRange();
                  if ((logical === null || logical === undefined) && vr && rect.width > 0) {
                    const bars = vr.to - vr.from;
                    logical = (vr.from + (x / rect.width) * bars) as any;
                  }

                  let price = seriesRef.current.coordinateToPrice(y);
                  if (price === null) {
                    price = seriesRef.current.coordinateToPrice(Math.max(5, Math.min(rect.height - 5, y)));
                  }
                  if (price === null) {
                    price = latestPriceRef.current || getAssetBasePrice(selectedAsset);
                  }

                  const rawTime = timeScale.coordinateToTime(x);
                  const time = rawTime ?? Math.floor(Date.now() / 1000);
                  
                  const point = { 
                    time: time as number, 
                    price, 
                    logical: (logical !== null && logical !== undefined) ? Number(logical) : undefined 
                  };

                  const type = pendingDrawingRef.current;
                  const normType = (type || '').toLowerCase();
                  const isSinglePoint = normType === 'horizontal line' || normType === 'vertical line' || normType === 'cross line';

                  if (isSinglePoint) {
                    const newId = Math.random().toString(36).substr(2, 9);
                    setActiveDrawings(prev => [...prev, {
                      id: newId, type, points: [point], color: appSettings.drawingColor || '#1e88e5', isComplete: true, name: type
                    }]);
                    setPendingDrawing(null);
                    pendingDrawingRef.current = null;
                    drawingStartPosRef.current = null;
                  } else if (!activeDrawingId) {
                    // Start 1st point of multi-point drawing
                    const newId = Math.random().toString(36).substr(2, 9);
                    drawingStartPosRef.current = { x, y };
                    setActiveDrawingId(newId);
                    setActiveDrawings(prev => [...prev, {
                      id: newId, type, points: [point], color: appSettings.drawingColor || '#1e88e5', isComplete: false, name: type
                    }]);
                    setCrosshairPoint(point);
                  } else {
                    // 2nd click to finalize multi-point drawing (click point 1, click point 2 mode)
                    setActiveDrawings(prev => {
                      const activeIndex = prev.findIndex(d => d.id === activeDrawingId);
                      if (activeIndex !== -1) {
                        const newDrawings = [...prev];
                        newDrawings[activeIndex] = {
                          ...newDrawings[activeIndex],
                          points: [...newDrawings[activeIndex].points, point],
                          isComplete: true
                        };
                        return newDrawings;
                      }
                      return prev;
                    });
                    setPendingDrawing(null);
                    pendingDrawingRef.current = null;
                    setActiveDrawingId(null);
                    setCrosshairPoint(null);
                    drawingStartPosRef.current = null;
                  }
                }}
                onPointerMove={(e) => {
                  if (!chartRef.current || !seriesRef.current || !activeDrawingId) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                  const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
                  
                  const timeScale = chartRef.current.timeScale();
                  let logical = timeScale.coordinateToLogical(x);
                  const vr = timeScale.getVisibleLogicalRange();
                  if ((logical === null || logical === undefined) && vr && rect.width > 0) {
                    const bars = vr.to - vr.from;
                    logical = (vr.from + (x / rect.width) * bars) as any;
                  }

                  let price = seriesRef.current.coordinateToPrice(y);
                  if (price === null) {
                    price = seriesRef.current.coordinateToPrice(Math.max(5, Math.min(rect.height - 5, y)));
                  }
                  if (price === null) {
                    price = latestPriceRef.current || getAssetBasePrice(selectedAsset);
                  }

                  const rawTime = timeScale.coordinateToTime(x);
                  const time = rawTime ?? Math.floor(Date.now() / 1000);

                  setCrosshairPoint({ 
                    time: time as number, 
                    price, 
                    logical: (logical !== null && logical !== undefined) ? Number(logical) : undefined 
                  });
                }}
                onPointerUp={(e) => {
                  if (!chartRef.current || !seriesRef.current || !activeDrawingId) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                  const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
                  
                  const startPos = drawingStartPosRef.current;
                  const dist = startPos ? Math.hypot(x - startPos.x, y - startPos.y) : 0;
                  
                  // If user dragged mouse across chart, finalize on release
                  if (dist > 12) {
                    const timeScale = chartRef.current.timeScale();
                    let logical = timeScale.coordinateToLogical(x);
                    const vr = timeScale.getVisibleLogicalRange();
                    if ((logical === null || logical === undefined) && vr && rect.width > 0) {
                      const bars = vr.to - vr.from;
                      logical = (vr.from + (x / rect.width) * bars) as any;
                    }

                    let price = seriesRef.current.coordinateToPrice(y);
                    if (price === null) {
                      price = seriesRef.current.coordinateToPrice(Math.max(5, Math.min(rect.height - 5, y)));
                    }
                    if (price === null) {
                      price = latestPriceRef.current || getAssetBasePrice(selectedAsset);
                    }

                    const rawTime = timeScale.coordinateToTime(x);
                    const time = rawTime ?? Math.floor(Date.now() / 1000);

                    const endPoint = { 
                      time: time as number, 
                      price, 
                      logical: (logical !== null && logical !== undefined) ? Number(logical) : undefined 
                    };
                    setActiveDrawings(prev => {
                      const activeIndex = prev.findIndex(d => d.id === activeDrawingId);
                      if (activeIndex !== -1) {
                        const newDrawings = [...prev];
                        newDrawings[activeIndex] = {
                          ...newDrawings[activeIndex],
                          points: [...newDrawings[activeIndex].points, endPoint],
                          isComplete: true
                        };
                        return newDrawings;
                      }
                      return prev;
                    });
                    setPendingDrawing(null);
                    pendingDrawingRef.current = null;
                    setActiveDrawingId(null);
                    setCrosshairPoint(null);
                    drawingStartPosRef.current = null;
                  }
                  // Otherwise (dist <= 12), user clicked to anchor point 1; keep active so they can move freely across chart to place point 2
                }}
                onPointerLeave={() => {
                }}
              />
            )}
            <ChartDrawingOverlay chart={chartRef.current} series={seriesRef.current} drawings={activeDrawings} crosshairPoint={crosshairPoint} activeDrawingId={activeDrawingId} onUpdateDrawingPoint={handleUpdateDrawingPoint} />
            


            {/* Quotex Trade Closed Result Popup Modal (Only in Single Chart, never in Multiple Charts - Req 3 & Image 3) */}
            {closedTradePopup && chartLayout === '1' && (
              <div className="absolute bottom-4 left-[200px] z-20 pointer-events-auto">
                <QuotexTradeClosedPopup
                  trade={closedTradePopup}
                  currency={currency}
                  onClose={() => setClosedTradePopup(null)}
                  isLight={themeMode === 'Light Mode'}
                />
              </div>
            )}

            {/* Trade Result Notification */}
            {!appSettings.hideTradeResults && tradeResultNotification && (
              <TradeResultOverlay 
                 trade={tradeResultNotification} 
                 chart={chartRef.current} 
                 series={seriesRef.current} 
                 onClose={() => setTradeResultNotification(null)}
                 currency={currency}
                />
            )}

          {/* Active Oscillators Sub-Pane: Low-opacity background pane matching Image 2 */}
          {activeIndicators.some(ind => INDICATOR_REGISTRY[ind]?.type === 'oscillator' && !hiddenIndicators[ind]) && (
            <div 
              style={{ height: '96px' }}
              className={`absolute bottom-0 left-0 right-0 pointer-events-none z-[1] select-none ${
                themeMode === 'Light Mode'
                  ? 'bg-slate-400/[0.04] border-t border-slate-300/40'
                  : 'bg-[#182337]/15 border-t border-[#293b54]/40'
              }`}
            >
              {/* Subtle low-opacity horizontal channel band matching Image 2 */}
              <div className="absolute inset-x-0 top-[22%] bottom-[22%] bg-sky-500/[0.015] border-y border-black/[0.03] dark:border-white/[0.03] pointer-events-none" />
            </div>
          )}

          {/* Active Oscillators Header: Raised to bottom-14 on multi-screen (Req 1) so it never covers pair tag */}
          {activeIndicators.some(ind => INDICATOR_REGISTRY[ind]?.type === 'oscillator' && !hiddenIndicators[ind]) && (
            <div className={`absolute ${chartLayout !== '1' ? 'bottom-14' : (hoveredCandle ? 'bottom-[126px]' : 'bottom-4')} left-[64px] z-20 flex items-center gap-2 pointer-events-auto select-none flex-wrap`}>
              {activeIndicators.filter(ind => INDICATOR_REGISTRY[ind]?.type === 'oscillator').map(indicator => {
                const isHidden = hiddenIndicators[indicator] === true;
                const userSetting = indicatorSettings[indicator] || getDefaultIndicatorSettings(indicator);

                // Extract plot colors (Image 1 style)
                const plots = userSetting?.plots || {};
                const plotColors: string[] = Object.values(plots).map((p: any) => p.color).filter(Boolean);
                if (plotColors.length === 0) {
                  const meta = INDICATOR_REGISTRY[indicator];
                  if (meta?.plots) {
                    meta.plots.forEach(mp => plotColors.push(mp.defaultColor));
                  }
                }

                // Extract parameters (Image 1 style: e.g. 14 14)
                const params = userSetting?.params || {};
                const paramValues = Object.values(params);

                return (
                  <div 
                    key={indicator}
                    className={`flex items-center gap-1.5 select-none pointer-events-auto py-1 px-2.5 rounded-md backdrop-blur-md transition-all shadow-md ${
                      themeMode === 'Light Mode'
                        ? 'bg-white/95 text-gray-800 border border-gray-200 shadow-md'
                        : (themeMode === 'Twilight'
                            ? 'bg-[#1e2433]/95 text-white border border-[#2e3a4e] shadow-sm'
                            : 'bg-[#131926]/90 text-white border border-[#263347] shadow-sm')
                    }`}
                  >
                    {/* Collapse/Chevron icon matching Image 1 */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); setEditingIndicator(indicator); }}
                      className={`w-4 h-4 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                        themeMode === 'Light Mode'
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-white/10 hover:bg-white/20 text-white/80'
                      }`}
                    >
                      <ChevronDown size={11} strokeWidth={2.5} />
                    </div>

                    {/* Visibility Toggle matching Image 1 */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleToggleIndicatorVisibility(indicator); }}
                      className={`transition-colors p-0.5 rounded cursor-pointer ${
                        isHidden 
                          ? 'text-[#ff4b55]' 
                          : (themeMode === 'Light Mode' ? 'text-gray-500 hover:text-gray-900' : 'text-white/60 hover:text-white')
                      }`}
                      title={isHidden ? "Show Indicator" : "Hide Indicator"}
                    >
                      {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>

                    {/* Indicator Name in BOLD UPPERCASE matching Image 1 */}
                    <span 
                      onClick={(e) => { e.stopPropagation(); setEditingIndicator(indicator); }}
                      className={`font-black tracking-wide text-[11px] uppercase cursor-pointer hover:text-[#1e88e5] transition-colors ${
                        isHidden 
                          ? 'line-through opacity-50 text-gray-400' 
                          : (themeMode === 'Light Mode' ? 'text-gray-900' : 'text-white')
                      }`}
                    >
                      {indicator}
                    </span>

                    {/* Plot Color Blocks matching Image 1 (green, blue, red squares) */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); setEditingIndicator(indicator); }}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      {plotColors.map((color, idx) => (
                        <div 
                          key={idx}
                          className="w-3 h-3 rounded-[2px] shadow-xs shrink-0" 
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Parameters in readable font matching Image 1 (e.g. 14 14) */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); setEditingIndicator(indicator); }}
                      className={`flex items-center gap-2 text-[11px] font-black font-mono cursor-pointer hover:text-[#1e88e5] ${
                        themeMode === 'Light Mode' ? 'text-gray-800' : 'text-white/90'
                      }`}
                    >
                      {paramValues.map((val: any, idx) => (
                        <span key={idx}>{val}</span>
                      ))}
                    </div>

                    {/* Pencil Edit Icon matching Image 1 */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingIndicator(indicator); }}
                      className={`transition-colors p-0.5 cursor-pointer ml-0.5 ${
                        themeMode === 'Light Mode' ? 'text-gray-500 hover:text-gray-900' : 'text-[#94a3b8] hover:text-white'
                      }`}
                      title="Indicator Settings"
                    >
                      <Pencil size={11} />
                    </button>

                    {/* Delete Red X Icon matching Image 1 */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteIndicator(indicator); }}
                      className="text-[#ff5252] hover:text-[#ff1744] transition-colors p-0.5 cursor-pointer"
                      title="Delete Indicator"
                    >
                      <X size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

            
                     </div>
                  );
               } else {
                  return (
                     <div key={i} 
                          className={`relative w-full h-full overflow-hidden bg-[var(--bg-chart)] border-2 border-transparent hover:border-gray-500 cursor-pointer ${chartLayout === '3' && i === 0 ? 'row-span-2' : (chartLayout === '5' && i === 0 ? 'row-span-2' : '')}`}
                          onClick={() => { setActiveChartIdx(i); setSelectedAsset(chartConfigs[i].asset); }}
                     >
                        <MiniChart 
                           themeMode={themeMode}
                           asset={chartConfigs[i].asset.name}
                           timeframe={chartConfigs[i].timeframe}
                           chartType={chartConfigs[i].chartType}
                           indicators={activeIndicators}
                           drawings={chartConfigs[i].drawings}
                           screenNumber={i + 1}
                           chartLayout={chartLayout}
                           pendingDrawing={pendingDrawing}
                           zoomSpan={sharedZoomSpan}
                           onZoomChange={(newSpan) => {
                              sharedZoomSpanRef.current = newSpan;
                              setSharedZoomSpan(newSpan);
                           }}
                           onAddDrawing={(drawing) => {
                              setChartConfigs(prev => {
                                 const next = [...prev];
                                 next[i] = {
                                    ...next[i],
                                    drawings: [...next[i].drawings, drawing]
                                 };
                                 return next;
                              });
                              setPendingDrawing(null);
                              pendingDrawingRef.current = null;
                           }}
                           onSelect={() => { setActiveChartIdx(i); setSelectedAsset(chartConfigs[i].asset); }}
                        />
                     </div>
                  );
               }
            })}
          </div>
          
          
          
          

          {/* Chart Top Left Overlay: Always shows [+] button (Image 1) so user can search & select pair; Pair tabs (Image 2) and PAIR INFORMATION are shown ONLY in Single Chart mode */}
          <div className="absolute top-3 left-4 z-20 flex flex-col gap-1.5 transition-all pointer-events-none">
            {/* Asset Tabs Row:
                - [+] button from Image 1 is shown on BOTH Single Chart and Multiple Charts (User Request)
                - Open asset pair tabs from Image 2 are hidden on multiple charts, shown ONLY on single chart (User Request)
            */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-[calc(100vw-350px)] custom-scrollbar pointer-events-auto">
              <button 
                onClick={() => setIsAssetModalOpen(true)}
                className="w-10 h-10 bg-[#1e88e5] rounded flex items-center justify-center text-white shadow-lg hover:bg-[#1e88e5]/90 transition-colors shrink-0 cursor-pointer"
                title="Add / Select Asset"
              >
                <Plus size={18} strokeWidth={3} />
              </button>
              {chartLayout === '1' && openAssets.map((asset, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    if (selectedAsset.id === asset.id) {
                      setIsAssetModalOpen(true);
                    } else {
                      setSelectedAsset(asset);
                    }
                  }}
                  className={`border rounded-md flex items-center h-12 shadow-sm group cursor-pointer shrink-0 transition-all ${
                    selectedAsset.id === asset.id 
                      ? (themeMode === 'Light Mode' 
                          ? 'border-2 border-[#1e88e5] bg-white shadow-md' 
                          : 'border-2 border-white/90 bg-[var(--bg-panel)] shadow-md')
                      : (themeMode === 'Light Mode'
                          ? 'border border-gray-300 bg-gray-100 hover:bg-white'
                          : 'border border-[var(--border-color)] bg-[var(--bg-panel)]/80 hover:bg-[var(--hover-bg)]')
                  }`}
                >
                  <div className="px-3 flex items-center gap-3 h-full rounded-l">
                    <div className="scale-110"><AssetIcon asset={asset} /></div>
                    <div className="flex flex-col justify-center">
                       <span className={`text-[11.5px] font-bold leading-tight ${
                         themeMode === 'Light Mode'
                           ? (selectedAsset.id === asset.id ? 'text-slate-900 font-black' : 'text-slate-700')
                           : (selectedAsset.id === asset.id ? 'text-white font-black' : 'text-slate-100 hover:text-white')
                       }`}>{asset.name}</span>
                       <span className="text-[#f59e0b] text-[12px] font-black leading-tight mt-0.5">
                         {(() => {
                            const { p1, p5 } = getAssetPayouts(asset);
                            return durationSecs < 300 ? p1 : p5;
                         })()}%
                       </span>
                    </div>
                  </div>
                  <div className="flex items-center h-full px-2">
                    {selectedAsset.id === asset.id ? (
                      <ChevronDown size={14} className={`mr-1 opacity-70 ${themeMode === 'Light Mode' ? 'text-slate-800' : 'text-white'}`} />
                    ) : null}
                    <button onClick={(e) => { e.stopPropagation(); setOpenAssets(prev => prev.filter((_, i) => i !== idx))}} className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      themeMode === 'Light Mode'
                        ? 'text-slate-500 hover:text-slate-900 hover:bg-black/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}>
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAIR INFORMATION Row:
                - Single Chart ONLY: clean gap below currency tabs.
                - Horizontal row: PAIR INFORMATION, and on its RIGHT SIDE: OHLC (User Request 1 & Image 1: Right side, never above).
            */}
            {chartLayout === '1' && (
              <div className="mt-2.5 flex items-center gap-2 flex-nowrap shrink-0 max-w-[calc(100vw-350px)] pointer-events-auto">
                <button 
                  onClick={() => setIsPairInfoOpen(true)}
                  className="flex items-center gap-1.5 text-[#1e88e5] text-xs font-bold bg-[#1e88e5]/10 px-2.5 py-1 rounded-full w-fit hover:bg-[#1e88e5]/20 transition-colors shadow-sm cursor-pointer shrink-0"
                >
                   <Info size={12} className="text-[#1e88e5]" /> <span className="text-[#1e88e5] uppercase">{t('pairInformation')}</span>
                </button>

                {/* Open Close High Low on the RIGHT SIDE of PAIR INFORMATION in a single horizontal line (User Request 1 & 4) */}
                {hoveredCandle && (() => {
                  const ohlc = hoveredCandle;
                  const diff = ohlc.close - ohlc.open;
                  const diffPct = ohlc.open > 0 ? (diff / ohlc.open) * 100 : 0;
                  const isUp = diff >= 0;
                  const decimals = currentAssetDecimals;

                  return (
                    <div style={{ pointerEvents: 'none' }} className="pointer-events-none select-none py-0.5 shrink-0">
                      <div className={`pointer-events-none select-none px-2 py-0.5 rounded-md border backdrop-blur-md shadow-md flex items-center gap-2 text-[10.5px] font-mono leading-tight ${
                        themeMode === 'Light Mode'
                          ? 'bg-white/95 border-gray-200 text-gray-800 shadow-sm'
                          : 'bg-[#18202d]/95 border-[#283244] text-gray-200 shadow-black/40'
                      }`}>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <span className="text-gray-400 font-sans text-[8.5px]">O:</span>
                          <span className="font-semibold">{ohlc.open.toFixed(decimals)}</span>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <span className="text-gray-400 font-sans text-[8.5px]">H:</span>
                          <span className="font-semibold">{ohlc.high.toFixed(decimals)}</span>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <span className="text-gray-400 font-sans text-[8.5px]">L:</span>
                          <span className="font-semibold">{ohlc.low.toFixed(decimals)}</span>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <span className="text-gray-400 font-sans text-[8.5px]">C:</span>
                          <span className={`font-bold ${isUp ? 'text-[#00c26f]' : 'text-[#ff4b55]'}`}>{ohlc.close.toFixed(decimals)}</span>
                        </div>
                        <div className={`text-[9px] font-bold px-1 py-0.2 rounded text-center shrink-0 ${isUp ? 'bg-[#00c26f]/15 text-[#00c26f]' : 'bg-[#ff4b55]/15 text-[#ff4b55]'}`}>
                          {isUp ? '+' : ''}{diff.toFixed(decimals)} ({isUp ? '+' : ''}{diffPct.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Active Overlay Indicators (Restored directly below PAIR INFORMATION in Single Chart mode) */}
            {chartLayout === '1' && activeIndicators.filter(ind => INDICATOR_REGISTRY[ind]?.type !== 'oscillator').length > 0 && (
              <div className="flex flex-col gap-1.5 mt-0.5 pointer-events-auto select-none">
                {activeIndicators.filter(ind => INDICATOR_REGISTRY[ind]?.type !== 'oscillator').map(indicator => {
                  const isHidden = hiddenIndicators[indicator] === true;
                  const userSetting = indicatorSettings[indicator] || getDefaultIndicatorSettings(indicator);

                  // Extract plot colors
                  const plots = userSetting?.plots || {};
                  const plotColors: string[] = Object.values(plots).map((p: any) => p.color).filter(Boolean);
                  if (plotColors.length === 0) {
                    const meta = INDICATOR_REGISTRY[indicator];
                    if (meta?.plots) {
                      meta.plots.forEach(mp => plotColors.push(mp.defaultColor));
                    }
                  }

                  // Extract parameters
                  const params = userSetting?.params || {};
                  const paramValues = Object.values(params);

                  return (
                    <div 
                      key={indicator}
                      className={`flex items-center gap-2 select-none pointer-events-auto py-1 px-2.5 rounded-md backdrop-blur-md transition-all shadow-md w-fit ${
                        themeMode === 'Light Mode'
                          ? 'bg-white/95 text-gray-800 border border-gray-200'
                          : (themeMode === 'Twilight'
                              ? 'bg-[#1e2433]/95 text-white border border-[#2e3a4e]'
                              : 'bg-[#131926]/95 text-white border border-[#263347]')
                      }`}
                    >
                      {/* Visibility Toggle */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleIndicatorVisibility(indicator); }}
                        className={`transition-colors p-0.5 rounded cursor-pointer ${
                          isHidden 
                            ? 'text-[#ff4b55]' 
                            : (themeMode === 'Light Mode' ? 'text-gray-500 hover:text-gray-900' : 'text-white/70 hover:text-white')
                        }`}
                        title={isHidden ? "Show Indicator" : "Hide Indicator"}
                      >
                        {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>

                      {/* Indicator Name in BOLD UPPERCASE */}
                      <span 
                        onClick={(e) => { e.stopPropagation(); setEditingIndicator(indicator); }}
                        className={`font-black tracking-wide text-[11px] uppercase cursor-pointer hover:text-[#1e88e5] transition-colors ${
                          isHidden 
                            ? 'line-through opacity-50 text-gray-400' 
                            : (themeMode === 'Light Mode' ? 'text-gray-900' : 'text-white')
                        }`}
                      >
                        {indicator}
                      </span>

                      {/* Color Swatch */}
                      <div 
                        onClick={(e) => { e.stopPropagation(); setEditingIndicator(indicator); }}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        {plotColors.map((color, idx) => (
                          <div 
                            key={idx}
                            className="w-3.5 h-3.5 rounded-[2px] shadow-xs shrink-0" 
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      {/* Parameters in bold font */}
                      <div 
                        onClick={(e) => { e.stopPropagation(); setEditingIndicator(indicator); }}
                        className={`flex items-center gap-1.5 text-[11px] font-black font-mono cursor-pointer hover:text-[#1e88e5] ${
                          themeMode === 'Light Mode' ? 'text-gray-800' : 'text-white'
                        }`}
                      >
                        {paramValues.map((val: any, idx) => (
                          <span key={idx}>{val}</span>
                        ))}
                      </div>

                      {/* Pencil Edit Icon */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingIndicator(indicator); }}
                        className={`transition-colors p-0.5 cursor-pointer ml-0.5 ${
                          themeMode === 'Light Mode' ? 'text-gray-500 hover:text-gray-900' : 'text-white/60 hover:text-white'
                        }`}
                        title="Indicator Settings"
                      >
                        <Pencil size={11} />
                      </button>

                      {/* Red X Delete Icon */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteIndicator(indicator); }}
                        className="text-[#ff4b55] hover:text-[#ff1744] transition-colors p-0.5 cursor-pointer ml-0.5"
                        title="Remove Indicator"
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Active Drawings Pills under PAIR INFORMATION (Single Chart mode) */}
            {chartLayout === '1' && activeDrawings && activeDrawings.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-0.5 pointer-events-auto select-none">
                {activeDrawings.map((drawing) => {
                  const isLight = themeMode === 'Light Mode';
                  const shapeName = drawing.type || 'Drawing';

                  return (
                    <div 
                      key={drawing.id}
                      className={`flex items-center gap-2 select-none pointer-events-auto py-1 px-2.5 rounded-md backdrop-blur-md transition-all shadow-md w-fit ${
                        isLight
                          ? 'bg-white/95 text-gray-800 border border-gray-200'
                          : (themeMode === 'Twilight'
                              ? 'bg-[#1e2433]/95 text-white border border-[#2e3a4e]'
                              : 'bg-[#131926]/95 text-white border border-[#263347]')
                      }`}
                    >
                      <PenTool size={11} className="text-[#1e88e5] shrink-0" />
                      
                      <span className={`font-black tracking-wide text-[11px] uppercase transition-colors ${
                        isLight ? 'text-gray-900' : 'text-white'
                      }`}>
                        {shapeName}
                      </span>

                      {/* Color indicator swatch */}
                      <div 
                        className="w-3.5 h-3.5 rounded-[2px] shadow-xs shrink-0" 
                        style={{ backgroundColor: drawing.color || '#1e88e5' }}
                      />

                      {/* Red X Delete button to remove drawing from chart */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDrawings(prev => prev.filter(d => d.id !== drawing.id));
                        }}
                        className="text-[#ff4b55] hover:text-[#ff2d39] transition-colors p-0.5 cursor-pointer ml-1"
                        title="Remove Drawing"
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quotex Trade Popups (Images 4, 5, 6 - Stacked directly below Indicator/Pair Information) */}
            {quotexToasts.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-1 pointer-events-auto select-none max-w-sm">
                {quotexToasts.map(toast => (
                  <div 
                    key={toast.id}
                    className={`flex items-center justify-between gap-3 px-3.5 py-2 rounded-md shadow-xl text-white font-semibold text-[12px] tracking-tight pointer-events-auto transition-all animate-in fade-in slide-in-from-top-1 duration-150 ${
                      toast.type === 'error' ? 'bg-[#e33f4a]' : 'bg-[#0ba259]'
                    }`}
                  >
                    <span className="leading-tight select-none">{toast.message}</span>
                    <button 
                      onClick={() => dismissQuotexToast(toast.id)}
                      className="w-[18px] h-[18px] rounded-full bg-[#1b2332]/75 hover:bg-[#1b2332] text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                      title="Dismiss"
                    >
                      <X size={10} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chart Bottom Left Toolbar */}
          <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1.5">
            <button 
              onClick={() => setOpenChartMenu(openChartMenu === 'drawings' ? null : 'drawings')}
              className={`w-10 h-10 border border-[var(--border-color)] rounded flex items-center justify-center shadow-lg transition-colors ${openChartMenu === 'drawings' ? 'bg-[#3b4353] text-white' : 'bg-[var(--bg-panel)] text-[var(--text-primary)] hover:bg-[var(--hover-bg-strong)]'}`}
            ><PenTool size={16}/></button>
            
            <button 
              onClick={() => setOpenChartMenu(openChartMenu === 'timeframe' ? null : 'timeframe')}
              className={`w-10 h-10 border border-[var(--border-color)] rounded flex items-center justify-center shadow-lg font-black text-xs transition-colors ${openChartMenu === 'timeframe' ? 'bg-[#3b4353] text-white' : 'bg-[var(--bg-panel)] text-[var(--text-primary)] hover:bg-[var(--hover-bg-strong)]'}`}
            >{selectedTimeframe}</button>
            
            <button 
              onClick={() => setOpenChartMenu(openChartMenu === 'chartType' ? null : 'chartType')}
              className={`w-10 h-10 border border-[var(--border-color)] rounded flex items-center justify-center shadow-lg transition-colors ${openChartMenu === 'chartType' ? 'bg-[#3b4353] text-white' : 'bg-[var(--bg-panel)] text-[var(--text-primary)] hover:bg-[var(--hover-bg-strong)]'}`}
            ><BarChart2 size={16}/></button>
            
            <button 
              onClick={() => setOpenChartMenu(openChartMenu === 'indicators' ? null : 'indicators')}
              className={`w-10 h-10 border border-[var(--border-color)] rounded flex items-center justify-center shadow-lg transition-colors ${openChartMenu === 'indicators' ? 'bg-[#3b4353] text-white' : 'bg-[var(--bg-panel)] text-[var(--text-primary)] hover:bg-[var(--hover-bg-strong)]'}`}
            ><Compass size={16}/></button>

            {/* Menus */}
            {openChartMenu === 'timeframe' && (
              <TimeframePopup 
                selected={selectedTimeframe} 
                onSelect={handleTimeframeSelect} 
              />
            )}
            {openChartMenu === 'chartType' && (
              <ChartTypePopup 
                selected={selectedChartType} 
                onSelect={(ct) => { setSelectedChartType(ct); setOpenChartMenu(null); }} 
              />
            )}
          </div>

          {openChartMenu === 'drawings' && <DrawingsMenu 
  onClose={() => setOpenChartMenu(null)} 
  activeDrawings={activeDrawings} 
  onRemove={(id) => setActiveDrawings(prev => prev.filter(d => d.id !== id))} 
  onSelect={(drawing) => { setPendingDrawing(drawing); pendingDrawingRef.current = drawing; setOpenChartMenu(null); }} 
  onClearAll={() => setActiveDrawings([])}
  drawingColor={appSettings.drawingColor}
  onColorChange={(c) => setAppSettings(prev => ({ ...prev, drawingColor: c }))}
/>}
          {openChartMenu === 'indicators' && (
            <IndicatorsMenu 
              onClose={() => setOpenChartMenu(null)} 
              activeIndicators={activeIndicators} 
              onRemove={handleDeleteIndicator} 
              onSelect={(indicator) => {
                handleAddIndicator(indicator);
                setEditingIndicator(indicator);
                setOpenChartMenu(null);
              }}
              onConfigure={(indicator) => {
                setEditingIndicator(indicator);
                setOpenChartMenu(null);
              }}
            />
          )}

          {/* Indicator Settings Drawer matching Image 1 */}
          {editingIndicator && (
            <IndicatorSettingsDrawer
              indicatorName={editingIndicator}
              isOpen={Boolean(editingIndicator)}
              onClose={() => setEditingIndicator(null)}
              onBack={() => setEditingIndicator(null)}
              settings={indicatorSettings[editingIndicator] || getDefaultIndicatorSettings(editingIndicator)}
              onUpdateSettings={(newSettings) => handleUpdateIndicatorSettings(newSettings, editingIndicator)}
              onSave={(newSettings) => handleUpdateIndicatorSettings(newSettings, editingIndicator)}
              onDelete={(name) => {
                handleDeleteIndicator(name || editingIndicator);
                setEditingIndicator(null);
              }}
            />
          )}

          {/* Faint Vertical "Trade Lines" simulation */}
          <div className="absolute inset-y-0 left-[60%] w-[1px] border-l border-dashed border-[#8390a0]/30 pointer-events-none">
            <div className="absolute top-10 left-2 text-[10px] text-[var(--text-primary)]">Beginning of trade</div>
          </div>
          <div className="absolute inset-y-0 left-[75%] w-[1px] border-l border-dashed border-[#8390a0]/30 pointer-events-none">
            <div className="absolute top-10 left-2 text-[10px] text-[var(--text-primary)]">End of trade</div>
          </div>

          {/* Quotex Zoom In & Zoom Out Controls: Only shown in Single Chart mode (User Request: Hidden in multiple charts) */}
          {chartLayout === '1' && (
            <div className={`absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center rounded overflow-hidden shadow-xs backdrop-blur-[2px] transition-all select-none ${
              themeMode === 'Light Mode'
                ? 'bg-white/50 hover:bg-white/80 border border-gray-300/60 text-gray-600'
                : 'bg-[#151c28]/40 hover:bg-[#151c28]/70 border border-white/10 text-gray-400'
            }`}>
              <button 
                onClick={handleZoomOut}
                className={`w-6 h-5 flex items-center justify-center transition-colors cursor-pointer border-r active:bg-white/10 ${
                  themeMode === 'Light Mode' 
                    ? 'border-gray-300/60 hover:text-black hover:bg-black/5' 
                    : 'border-white/10 hover:text-white hover:bg-white/5'
                }`}
                title="Zoom Out (-)"
              >
                <Minus size={11} strokeWidth={2.5} />
              </button>
              <button 
                onClick={handleZoomIn}
                className={`w-6 h-5 flex items-center justify-center transition-colors cursor-pointer active:bg-white/10 ${
                  themeMode === 'Light Mode' 
                    ? 'hover:text-black hover:bg-black/5' 
                    : 'hover:text-white hover:bg-white/5'
                }`}
                title="Zoom In (+)"
              >
                <Plus size={11} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
          
          {/* OTHER VIEWS */}
          {currentView === 'ACCOUNT' && <AccountView onBack={() => setCurrentView('TRADE')} />}
          {currentView === 'SUPPORT' && (
            <div className="absolute inset-0 z-40 bg-[var(--bg-main)] overflow-y-auto">
              <SupportView onBack={() => setCurrentView('TRADE')} />
            </div>
          )}
          {currentView === 'MARKET' && <MarketView onExecuteTrade={handleMarketTrade} onBack={() => setCurrentView('TRADE')} />}
          {currentView === 'MORE' && <MoreView tradeHistory={tradeHistory} onBack={() => setCurrentView('TRADE')} onNavigate={(tab) => {
             if (tab === 'DEPOSIT') setCurrentView('deposit');
             else if (tab === 'WITHDRAWAL') setCurrentView('withdrawal');
             else if (tab === 'WITHDRAWAL HISTORY') setCurrentView('withdrawal_history');
             else if (tab === 'DEPOSIT HISTORY') setCurrentView('deposit_history');
             else if (tab === 'TRADE HISTORY') setCurrentView('trade_history');
             else if (tab === 'MY ACCOUNT') setCurrentView('ACCOUNT');
             else if (tab === 'MARKET') setCurrentView('MARKET');
             else if (tab === 'TOURNAMENTS') setCurrentView('TOURNAMENTS');
          }} />}
          {currentView === 'TOURNAMENTS' && <TournamentView onBack={() => setCurrentView('TRADE')} />}
          {currentView === 'deposit_history' && <div className="absolute inset-0 z-40 bg-[var(--bg-panel)] overflow-y-auto"><HistoryView type="deposit" theme={THEMES[themeMode]} isLight={themeMode === 'Light Mode'} onBack={() => setCurrentView('TRADE')} /></div>}
          {currentView === 'withdrawal_history' && <div className="absolute inset-0 z-40 bg-[var(--bg-panel)] overflow-y-auto"><HistoryView type="withdrawal" theme={THEMES[themeMode]} isLight={themeMode === 'Light Mode'} onBack={() => setCurrentView('TRADE')} /></div>}
          {currentView === 'trade_history' && <div className="absolute inset-0 z-40 bg-[var(--bg-panel)] overflow-y-auto"><HistoryView type="trades" theme={THEMES[themeMode]} isLight={themeMode === 'Light Mode'} onBack={() => setCurrentView('TRADE')} /></div>}

      </div>

            {/* FULLSCREEN MODAL LAYER */}
      {isPromotionOpen && (
        <PromotionDashboard 
          isOpen={isPromotionOpen} 
          onClose={() => setIsPromotionOpen(false)} 
          themeMode={themeMode} 
        />
      )}
      {isFullscreenModalOpen && (
        <FullscreenModal 
          onClose={() => setIsFullscreenModalOpen(false)} 
          themeMode={themeMode}
          setThemeMode={setThemeMode}
          appSettings={appSettings}
          setAppSettings={setAppSettings}
          onDeposit={() => { setIsFullscreenModalOpen(false); setCurrentView('deposit'); }}
          onWithdrawal={() => { setIsFullscreenModalOpen(false); setCurrentView('withdrawal'); }}
        />
      )}

      {/* RIGHT SIDEBAR (TRADING CONTROLS) */}
      {currentView === 'TRADE' && (
      <div className="w-[300px] bg-[var(--bg-panel)] border-l border-[var(--border-color)] shrink-0 flex flex-col z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.02)]">
        <div className="p-4 border-b border-[var(--border-color)]">
          {/* Asset Info Header */}
          <div 
            onClick={() => setIsAssetModalOpen(true)}
            className="flex justify-between items-center mb-5 cursor-pointer hover:bg-[var(--hover-bg)] p-1.5 -m-1.5 rounded transition-colors group"
            title="Click to select any trading pair"
          >
            <div className="flex items-center gap-2">
              <AssetIcon asset={selectedAsset} />
              <span className="text-[var(--text-primary)] font-bold text-sm group-hover:text-[#1e88e5] transition-colors">{selectedAsset.name}</span>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-white transition-colors" />
            </div>
            <span className="text-[#f59e0b] text-sm font-bold">{(activePayoutRate * 100).toFixed(0)}%</span>
          </div>

          {/* Pending Trade Toggle */}
          <div className="flex items-center justify-between bg-[#f5f7f9] dark:bg-[#3b4353] px-4 py-2 mb-4 rounded">
             <div className="flex items-center gap-2 text-[#1e88e5] text-[11px] font-black uppercase">
               <Clock size={14} strokeWidth={3} />
               <span>Pending order</span>
             </div>
             <button onClick={() => setIsPendingTrade(!isPendingTrade)} className={`w-8 h-[18px] rounded-full relative transition-colors ${isPendingTrade ? 'bg-[#1e88e5]' : 'bg-[#d0d4da] dark:bg-[var(--text-muted)]'}`}>
               <div className={`absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white transition-all ${isPendingTrade ? 'right-[2px]' : 'left-[2px]'}`}></div>
             </button>
          </div>
          
          {isPendingTrade && (
             <div className="flex bg-[var(--hover-bg)] p-1 rounded mb-4">
                <button onClick={() => setPendingTradeType('QUOTE')} className={`flex-1 py-1.5 text-xs font-bold rounded ${pendingTradeType === 'QUOTE' ? 'bg-[#1e88e5] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>QUOTE</button>
                <button onClick={() => setPendingTradeType('TIME')} className={`flex-1 py-1.5 text-xs font-bold rounded ${pendingTradeType === 'TIME' ? 'bg-[#1e88e5] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>TIME</button>
             </div>
          )}
          
          {isPendingTrade && pendingTradeType === 'QUOTE' && (
             <div className="flex flex-col mb-4">
                <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1 font-medium px-1">
                  <span>Quote</span>
                </div>
                <input type="text" value={pendingQuote} onChange={e => setPendingQuote(e.target.value)} className="bg-transparent border border-[var(--border-color)] text-[var(--text-primary)] rounded p-2 text-lg font-mono mb-1 outline-none focus:border-[#1e88e5]" />
                <div className="text-[11px] text-[var(--text-muted)] mb-3 px-1">Current quote: {latestPriceRef.current.toFixed(5)}</div>
                
                <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1 font-medium px-1">
                  <span>Period</span>
                </div>
                <input type="text" value={pendingPeriod} onChange={e => setPendingPeriod(e.target.value)} className="bg-transparent border border-[var(--border-color)] text-[var(--text-primary)] rounded p-2 text-lg font-mono outline-none focus:border-[#1e88e5]" />
             </div>
          )}

          {isPendingTrade && pendingTradeType === 'TIME' && (
             <div className="flex flex-col mb-4">
                <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1 font-medium px-1">
                  <span>Time</span>
                </div>
                <input type="time" value={pendingTime} onChange={e => setPendingTime(e.target.value)} className="bg-transparent border border-[var(--border-color)] text-[var(--text-primary)] rounded p-2 text-lg font-mono mb-3 outline-none focus:border-[#1e88e5]" />
                
                <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1 font-medium px-1">
                  <span>Period</span>
                </div>
                <input type="text" value={pendingPeriod} onChange={e => setPendingPeriod(e.target.value)} className="bg-transparent border border-[var(--border-color)] text-[var(--text-primary)] rounded p-2 text-lg font-mono outline-none focus:border-[#1e88e5]" />
             </div>
          )}

          {(!isPendingTrade) && (
            <div id="trading-time-investment-panel" className="flex flex-col">
              {/* Time Control */}
          <div className={`flex flex-col relative mt-2 transition-all duration-300 ${
            isOnboardingOpen && tutorialStep === 'SET_PARAMETERS'
              ? 'ring-2 ring-[#1e88e5] shadow-[0_0_15px_rgba(30,136,229,0.35)] rounded-lg p-1 bg-[#1e88e5]/10 animate-pulse'
              : ''
          }`}>
            <div className="relative border-t border-b border-[var(--border-color)] py-2 flex items-center justify-between mt-2">
              <div className="absolute top-1 left-0 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] font-medium">
                <span>{t('time')}</span>
              </div>
              <button 
                onClick={() => setDurationSecs(Math.max(60, durationSecs - 60))}
                className={`w-10 h-10 mt-3 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all relative z-10 -ml-2 shadow-sm ${
                  themeMode === 'Light Mode'
                    ? 'bg-[#f4f5f8] hover:bg-white text-[#1f2631]'
                    : 'bg-[#202735] hover:bg-[#2b3548] text-white'
                }`}
              >
                <Minus size={20} strokeWidth={2.5}/>
              </button>
              <div className="flex flex-col items-center flex-1 mt-3" onClick={() => setShowTimeDropdown(!showTimeDropdown)}>
                <span className="text-[22px] font-bold text-[var(--text-primary)] leading-none tracking-tight">{formatTimeDuration(durationSecs)}</span>
                <span className="text-[10px] font-black text-[#3b82f6] mt-1.5 tracking-wider uppercase cursor-pointer">{t('switchTime')}</span>
              </div>
              <button 
                onClick={() => setDurationSecs(durationSecs + 60)}
                className={`w-10 h-10 mt-3 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all relative z-10 -mr-2 shadow-sm ${
                  themeMode === 'Light Mode'
                    ? 'bg-[#f4f5f8] hover:bg-white text-[#1f2631]'
                    : 'bg-[#202735] hover:bg-[#2b3548] text-white'
                }`}
              >
                <Plus size={20} strokeWidth={2.5}/>
              </button>
            </div>
            {showTimeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded shadow-xl z-50 p-2 grid grid-cols-4 gap-1.5">
                {[5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600, 7200, 14400].map(secs => (
                  <div 
                    key={secs} 
                    onClick={() => { setDurationSecs(secs); setShowTimeDropdown(false); }}
                    className="bg-[var(--hover-bg)] hover:bg-[var(--hover-bg-strong)] cursor-pointer rounded text-[11px] font-mono text-center py-2 text-[#4b5563] dark:text-[#d1d5db] font-medium"
                  >
                    {formatTimeDuration(secs)}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Investment Control */}
          <div className={`flex flex-col mb-4 relative mt-1 transition-all duration-300 ${
            isOnboardingOpen && tutorialStep === 'SET_PARAMETERS'
              ? 'ring-2 ring-[#1e88e5] shadow-[0_0_15px_rgba(30,136,229,0.35)] rounded-lg p-1 bg-[#1e88e5]/10 animate-pulse'
              : ''
          }`}>
            <div className="relative border-b border-[var(--border-color)] pb-2.5 pt-3.5 flex items-center justify-between">
              <div className="absolute top-[2px] left-0 text-[11px] text-[var(--text-muted)] font-medium pointer-events-none">
                {t('investment')} (Min: {minBet} {currency})
              </div>
              <button 
                onClick={() => {
                  const step = minBet >= 100 ? (investment > 500 ? 100 : (investment > 200 ? 50 : 10)) : (minBet >= 10 ? 5 : 1);
                  setInvestment(prev => Math.max(minBet, prev - step));
                }}
                className={`w-10 h-10 mt-3.5 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all relative z-10 -ml-2 shadow-sm ${
                  themeMode === 'Light Mode'
                    ? 'bg-[#f4f5f8] hover:bg-white text-[#1f2631]'
                    : 'bg-[#202735] hover:bg-[#2b3548] text-white'
                }`}
              >
                <Minus size={20} strokeWidth={2.5}/>
              </button>
              <div className="flex flex-col items-center flex-1 justify-center mt-3.5">
                <div className="flex items-center justify-center h-9">
                  <input 
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={investment || ''}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, '');
                      const val = parseInt(cleaned, 10);
                      setInvestment(isNaN(val) ? 0 : val);
                    }}
                    onBlur={() => {
                      if (!investment || investment < minBet) {
                        setInvestment(minBet);
                      }
                    }}
                    style={{ 
                      width: `${Math.max(1, (investment || 0).toString().length)}ch`,
                      fontSize: '30px',
                      lineHeight: '1',
                      height: '34px',
                      fontWeight: 800,
                      fontFamily: 'Inter, sans-serif'
                    }}
                    className="investment-input font-extrabold font-sans text-[var(--text-primary)] text-right leading-none tracking-tight bg-transparent outline-none border-none p-0 m-0"
                  />
                  <span 
                    style={{
                      fontSize: '30px',
                      lineHeight: '1',
                      height: '34px',
                      fontWeight: 800,
                      fontFamily: 'Inter, sans-serif'
                    }}
                    className="investment-currency font-extrabold font-sans text-[var(--text-primary)] leading-none select-none flex items-center ml-1"
                  >
                    {currency}
                  </span>
                </div>
                <span 
                  onClick={() => setShowInvestmentPresets(!showInvestmentPresets)}
                  className="text-[10px] font-black text-[#3b82f6] mt-1 tracking-wider uppercase cursor-pointer hover:underline select-none"
                >
                  {t('switch')}
                </span>
              </div>
              <button 
                onClick={() => {
                  const step = minBet >= 100 ? (investment >= 500 ? 100 : 50) : (minBet >= 10 ? 5 : 1);
                  setInvestment(prev => Math.max(minBet, prev + step));
                }}
                className={`w-10 h-10 mt-3.5 rounded-full flex items-center justify-center transition-colors relative z-10 -mr-2 shadow-sm cursor-pointer active:scale-95 ${
                  themeMode === 'Light Mode'
                    ? 'bg-[#f4f5f8] hover:bg-white text-[#1f2631]'
                    : 'bg-[#202735] hover:bg-[#2b3548] text-white'
                }`}
              >
                <Plus size={20} strokeWidth={2.5}/>
              </button>
            </div>

            {/* Quick Investment Presets Dropdown */}
            {showInvestmentPresets && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-lg shadow-2xl z-50 p-2 grid grid-cols-4 gap-1.5">
                {(minBet >= 1000
                  ? [minBet, minBet * 2, minBet * 5, minBet * 10, minBet * 20, minBet * 50, minBet * 100, minBet * 200]
                  : (minBet >= 100
                    ? [100, 200, 500, 1000, 2000, 5000, 10000, 20000]
                    : (minBet >= 10 
                      ? [minBet, minBet * 2, minBet * 5, minBet * 10, minBet * 20, minBet * 50, minBet * 100, minBet * 200]
                      : [1, 2, 4, 5, 10, 20, 50, 100]
                    )
                  )
                ).map(amt => (
                  <button 
                    key={amt} 
                    onClick={() => {
                      setInvestment(amt);
                      setShowInvestmentPresets(false);
                    }}
                    className={`cursor-pointer rounded text-[11px] font-bold text-center py-1.5 transition-colors ${
                      investment === amt 
                        ? 'bg-[#1e88e5] text-white shadow-sm' 
                        : 'bg-[var(--hover-bg)] hover:bg-[var(--hover-bg-strong)] text-[var(--text-primary)]'
                    }`}
                  >
                    {amt} {currency}
                  </button>
                ))}
              </div>
            )}
          </div>
            </div>
          )}
          {/* Payout Display */}
          <div className="flex justify-between items-end mt-6 mb-4 px-1">
            <span className="text-[11px] text-[#3b4353] dark:text-[var(--text-muted)] font-medium flex-1 flex items-center">
              {t('payout')} <div className="border-b-[2px] border-dotted border-[#8390a0]/30 flex-1 mx-3 mt-1"></div>
            </span>
            <span className="text-[#0ba259] dark:text-[#0ba259] font-black text-lg">{(investment * (1 + activePayoutRate)).toFixed(2)} {currency}</span>
          </div>

          <div className="flex gap-3 h-[132px]">
            {/* Vertical Traders' Choice / Sentiment - Crisp and fresh without blur */}
            <div className="w-6 flex flex-col items-center justify-between py-1 bg-[var(--bg-panel)] rounded h-[132px]">
              <span className="text-[10px] font-bold text-[#ff4b55] leading-none">{marketSentiment.down}%</span>
              <div className="w-1.5 flex-1 rounded-full overflow-hidden flex flex-col bg-[#1e2430] my-1" style={{ transform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden' }}>
                <div className="w-full bg-[#ff4b55] transition-all duration-700 ease-in-out" style={{ height: `${marketSentiment.down}%` }}></div>
                <div className="w-full bg-[#00c26f] transition-all duration-700 ease-in-out" style={{ height: `${marketSentiment.up}%` }}></div>
              </div>
              <span className="text-[10px] font-bold text-[#00c26f] leading-none">{marketSentiment.up}%</span>
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              {/* Action Buttons - Pending */}
          {isPendingTrade && (
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => requestTrade('UP')}
                className="relative w-full h-[60px] bg-[#a7dec1] dark:bg-[#0ba259] hover:bg-[#92d0af] dark:hover:bg-[#0ea960] active:scale-[0.98] rounded-md text-white flex items-center justify-between px-4 font-black transition-all overflow-hidden"
              >
                 <div className="flex flex-col items-start leading-tight">
                   <span className="uppercase tracking-wide text-[12px] font-bold text-white/90">{t('buyPending') || 'BUY PENDING'}</span>
                   <span className="text-[22px] tracking-tight">{ (investment * (1 + activePayoutRate)).toFixed(2) } {currency}</span>
                 </div>
                 <TrendingUp size={28} strokeWidth={3} className="opacity-90"/>
                 <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
              </button>
              <button 
                onClick={() => requestTrade('DOWN')}
                className="relative w-full h-[60px] bg-[#f1b8bb] dark:bg-[#e33f4a] hover:bg-[#ec9fa3] dark:hover:bg-[#ee4450] active:scale-[0.98] rounded-md text-white flex items-center justify-between px-4 font-black transition-all overflow-hidden"
              >
                 <div className="flex flex-col items-start leading-tight">
                   <span className="uppercase tracking-wide text-[12px] font-bold text-white/90">{t('sellPending') || 'SELL PENDING'}</span>
                   <span className="text-[22px] tracking-tight">{ (investment * (1 + activePayoutRate)).toFixed(2) } {currency}</span>
                 </div>
                 <TrendingDown size={28} strokeWidth={3} className="opacity-90"/>
                 <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
              </button>
            </div>
          )}

          {/* Action Buttons - Normal */}
          {!isPendingTrade && (
            <div id="trading-action-buttons-panel" className="flex flex-col gap-3">
              <button 
                onClick={() => requestTrade('UP')}
                className={`relative w-full h-[60px] bg-[#0ba259] hover:bg-[#0ea960] active:scale-[0.98] rounded-lg text-white flex items-center justify-between px-4 font-black transition-all overflow-hidden border-none outline-none ${
                  isOnboardingOpen && tutorialStep === 'CHOOSE_DIRECTION'
                    ? 'shadow-[0_0_24px_rgba(11,162,89,0.9)] animate-pulse'
                    : 'shadow-[0_4px_15px_rgba(11,162,89,0.3)]'
                }`}
              >
                 <div className="flex flex-col items-start leading-tight">
                   <span className="uppercase tracking-wider text-[12px] font-bold text-white/95">{t('buy') || 'BUY'}</span>
                   <span className="text-[22px] font-black tracking-tight">{ (investment * (1 + activePayoutRate)).toFixed(2) } {currency}</span>
                 </div>
                 <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white shrink-0">
                   <path d="M2 16L9 9L15 14L25 4M25 4H18M25 4V11" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                 <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
              </button>
              <button 
                onClick={() => requestTrade('DOWN')}
                className={`relative w-full h-[60px] bg-[#c83944] hover:bg-[#d63d4a] active:scale-[0.98] rounded-lg text-white flex items-center justify-between px-4 font-black transition-all overflow-hidden border-none outline-none ${
                  isOnboardingOpen && tutorialStep === 'CHOOSE_DIRECTION'
                    ? 'shadow-[0_0_24px_rgba(200,57,68,0.9)] animate-pulse'
                    : 'shadow-[0_4px_15px_rgba(200,57,68,0.3)]'
                }`}
              >
                 <div className="flex flex-col items-start leading-tight">
                   <span className="uppercase tracking-wider text-[12px] font-bold text-white/95">{t('sell') || 'SELL'}</span>
                   <span className="text-[22px] font-black tracking-tight">{ (investment * (1 + activePayoutRate)).toFixed(2) } {currency}</span>
                 </div>
                 <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white shrink-0">
                   <path d="M2 6L9 13L15 8L25 18M25 18H18M25 18V11" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                 <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
              </button>
            </div>
          )}
            </div>
          </div>
        </div>

        {/* Trades List Bottom Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-panel)]">
          {/* Tabs matching Image 1 & 2 */}
          <div className="flex gap-5 border-b border-[var(--border-color)] px-4 pt-3.5 pb-2.5 items-center">
             <div 
                className={`text-xs font-bold flex items-center cursor-pointer transition-colors ${
                  activeTab === 'TRADES' 
                    ? (themeMode === 'Light Mode' ? 'text-gray-950 font-extrabold' : 'text-white font-extrabold') 
                    : (themeMode === 'Light Mode' ? 'text-gray-700 hover:text-gray-950 font-bold' : 'text-[#8492a6] hover:text-white')
                }`}
                onClick={() => setActiveTab('TRADES')}
             >
                <span className="tracking-tight">{t('trades')}</span> 
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ml-1.5 transition-colors ${
                  themeMode === 'Light Mode'
                    ? (activeTab === 'TRADES' ? 'bg-[#cbd5e1] text-[#0f172a] shadow-xs' : 'bg-[#e2e8f0] text-[#1e293b]')
                    : (activeTab === 'TRADES' ? 'bg-[#1b2230] text-white shadow-xs' : 'bg-[#171d29] text-[#8492a6]')
                }`}>
                  {positions.length}
                </span>
             </div>
             <div 
                className={`text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'ORDERS' 
                    ? (themeMode === 'Light Mode' ? 'text-gray-950 font-extrabold' : 'text-white font-extrabold') 
                    : (themeMode === 'Light Mode' ? 'text-gray-700 hover:text-gray-950 font-bold' : 'text-[#8492a6] hover:text-white')
                }`}
                onClick={() => setActiveTab('ORDERS')}
             >
                <Clock size={13} strokeWidth={2.5}/> 
                <span>{t('orders')}</span> 
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-1 transition-colors ${
                  themeMode === 'Light Mode'
                    ? (activeTab === 'ORDERS' ? 'bg-[#cbd5e1] text-[#0f172a] shadow-xs' : 'bg-[#e2e8f0] text-[#1e293b]')
                    : (activeTab === 'ORDERS' ? 'bg-[#1b2230] text-white shadow-xs' : 'bg-[#171d29] text-[#8492a6]')
                }`}>
                  {pendingOrders.length}
                </span>
             </div>
             <div 
                className={`text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'CLOSED' 
                    ? (themeMode === 'Light Mode' ? 'text-gray-950 font-extrabold' : 'text-white font-extrabold') 
                    : (themeMode === 'Light Mode' ? 'text-gray-700 hover:text-gray-950 font-bold' : 'text-[#8492a6] hover:text-white')
                }`}
                onClick={() => setActiveTab('CLOSED')}
             >
                <span>{t('closed')}</span> 
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-1 transition-colors ${
                  themeMode === 'Light Mode'
                    ? (activeTab === 'CLOSED' ? 'bg-[#cbd5e1] text-[#0f172a] shadow-xs' : 'bg-[#e2e8f0] text-[#1e293b]')
                    : (activeTab === 'CLOSED' ? 'bg-[#1b2230] text-white shadow-xs' : 'bg-[#171d29] text-[#8492a6]')
                }`}>
                  {tradeHistory.filter(t => isWithinSessionWindow(t.timestamp)).length}
                </span>
             </div>
          </div>
          
          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
            {/* TRADES TAB (Active trades + Current 12AM-12PM session trades) */}
            {activeTab === 'TRADES' && (() => {
              const visibleClosed = tradeHistory.filter(t => isWithinSessionWindow(t.timestamp));
              const totalInSession = positions.length + visibleClosed.length;

              if (totalInSession === 0) {
                return (
                  <div className={`h-full flex flex-col items-center justify-center py-12 ${themeMode === 'Light Mode' ? 'text-gray-400' : 'text-[var(--text-muted)] opacity-50'}`}>
                    <PlaySquare size={32} className="mb-2" />
                    <span className="text-xs font-medium">{t('noActiveTrades')}</span>
                  </div>
                );
              }

              const dateHeaderStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }).toUpperCase();

              return (
                <div className="flex flex-col">
                  {/* Date Header matching Images 1, 2 & 3: 24 SEPTEMBER (11) */}
                  <div className="flex items-center justify-center gap-2 py-2 mb-2 border-b border-[var(--border-color)]">
                     <span className={`text-xs font-black uppercase tracking-wider ${themeMode === 'Light Mode' ? 'text-gray-600' : 'text-[#8492a6]'}`}>{dateHeaderStr}</span>
                     <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${themeMode === 'Light Mode' ? 'bg-gray-200 text-gray-700' : 'bg-[#20293a] text-[#8492a6]'}`}>{totalInSession}</span>
                  </div>

                  {/* Active Executing Trades (Images 1 & 2 - Collapsed by default, expand on click) */}
                  {positions.map(trade => {
                    const pnl = getActivePnl(trade);
                    const isProfitable = pnl > 0;
                    const msLeft = Math.max(0, trade.expireTime - Date.now());

                    const isUp = trade.type === 'UP';
                    const assetObj = QUOTEX_ASSETS.find(a => a.name === trade.asset || a.id === trade.asset);
                    const isCrypto = trade.asset.toLowerCase().includes('crypto') || trade.asset.toLowerCase().includes('bitcoin');
                    const decimals = isCrypto ? 2 : ((assetObj as any)?.decimals ?? 5);
                    const curPrice = latestPriceRef.current || trade.entryPrice;
                    const mult = Math.pow(10, decimals);

                    // User Requirement 3: Sell Now Logic (No 10s hard timer limit)
                    // 1. Starts at 40% of invested amount
                    // 2. Gradually and randomly decreases from 40% down to 0%
                    // 3. Once it hits 0%, Sell Now automatically disappears
                    const elapsed = Math.max(0, Date.now() - trade.entryTime);
                    const elapsedSec = Math.floor(elapsed / 1000);

                    let currentSellPct = 0;
                    if (trade.sellDecayPoints && trade.sellDecayPoints.length > 0) {
                      if (elapsedSec < trade.sellDecayPoints.length) {
                        currentSellPct = trade.sellDecayPoints[elapsedSec];
                      } else {
                        currentSellPct = 0;
                      }
                    } else {
                      currentSellPct = Math.max(0, 0.40 - (elapsedSec * 0.025));
                    }

                    const rawSellValue = trade.amount * currentSellPct;
                    const isZeroDec = currency === '₹' || currency === 'Rp' || currency === '৳';
                    // User Requirement 1: strictly format as 0.40 (not 0.4)
                    const formattedSellValue = isZeroDec ? Math.round(rawSellValue).toString() : rawSellValue.toFixed(2);
                    const sellValue = Number(rawSellValue.toFixed(2));
                    // Disappears automatically once it hits 0% or trade expires! No 10-second limit.
                    const canSell = currentSellPct > 0 && sellValue > 0 && msLeft >= 1000;

                    const diffVal = Math.round((curPrice - trade.entryPrice) * mult);
                    // Collapsed by default: user must click chevron/header to reveal details
                    const isExpanded = expandedTrades[trade.id] === true;
                    const isLight = themeMode === 'Light Mode';

                    return (
                      <div key={trade.id} className={`${
                        isLight 
                          ? 'bg-white hover:bg-[#f8fafd] border border-gray-200 text-gray-900 shadow-xs' 
                          : 'bg-[#222a38] hover:bg-[#263040] border border-[#2d384b] text-white shadow-xs'
                      } rounded-md p-2.5 transition-all mb-1.5 select-none text-xs`}>
                        {/* Header Row 1: Chevron, Asset icon, Name, Countdown Timer (Image 2 & 3) */}
                        <div 
                          onClick={() => setExpandedTrades(prev => ({ ...prev, [trade.id]: !prev[trade.id] }))}
                          className="flex justify-between items-center cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <button className={`p-0.5 transition-colors cursor-pointer ${isLight ? 'text-gray-400 hover:text-gray-800' : 'text-gray-400 hover:text-white'}`}>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                            <div className="scale-75 origin-left shrink-0">
                              <AssetIcon asset={assetObj || QUOTEX_ASSETS[0]} />
                            </div>
                            <span className={`text-xs font-bold tracking-wide truncate ${isLight ? 'text-gray-900' : 'text-white'}`}>{trade.asset}</span>
                          </div>
                          <div className={`text-[11px] font-mono font-medium shrink-0 ${isLight ? 'text-gray-500' : 'text-gray-300'}`}>
                            {formatTimeLeft(trade.expireTime)}
                          </div>
                        </div>

                        {/* Header Row 2: Direction & Amount, Current Return (Image 2 & 3) */}
                        <div 
                          onClick={() => setExpandedTrades(prev => ({ ...prev, [trade.id]: !prev[trade.id] }))}
                          className="flex justify-between items-center mt-1.5 pl-5 cursor-pointer select-none"
                        >
                          <div className={`flex items-center gap-1.5 text-xs font-bold ${trade.type === 'UP' ? 'text-[#00c26f]' : 'text-[#ff4b55]'}`}>
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${trade.type === 'UP' ? 'bg-[#00c26f]/20 text-[#00c26f]' : 'bg-[#ff4b55]/20 text-[#ff4b55]'}`}>
                              {trade.type === 'UP' ? <ArrowUp size={10} strokeWidth={3} /> : <ArrowDown size={10} strokeWidth={3} />}
                            </span>
                            <span className="font-mono">{trade.amount} {currency}</span>
                          </div>
                          <div className={`text-xs font-bold font-mono ${isProfitable ? 'text-[#00c26f]' : 'text-[#ff4b55]'}`}>
                            {isProfitable ? `+${(trade.amount + pnl).toFixed(2)} ${currency}` : `0.00 ${currency}`}
                          </div>
                        </div>

                        {/* Quotex Sell Now Button (User Requirement 1: No percentage pill, formatted strictly as 0.40) */}
                        {canSell && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEarlyClose(trade.id, sellValue);
                            }}
                            className="w-full mt-2 py-1.5 px-3 rounded flex items-center justify-between text-xs font-bold transition-all shadow-sm bg-[#0074e4] hover:bg-[#0066cc] active:scale-[0.99] text-white cursor-pointer"
                            title={`Sell now for ${formattedSellValue} ${currency}`}
                          >
                            <span className="tracking-wide">{t('sellNow') || 'Sell'}</span>
                            <span className="font-mono font-bold tracking-tight">
                              {formattedSellValue} {currency}
                            </span>
                          </button>
                        )}

                        {/* Expanded Section - Only shown when user clicks chevron */}
                        {isExpanded && (
                          <div className={`mt-2 pt-2 border-t animate-in fade-in duration-150 ${isLight ? 'border-gray-200' : 'border-[#323f54]'}`}>
                            {/* Mini Sparkline Chart */}
                            <MiniTradeSparkline 
                              entryPrice={trade.entryPrice}
                              priceHistory={trade.priceHistory}
                              currentPrice={curPrice}
                              isLight={isLight}
                            />

                            {/* Details matching Image 1 */}
                            <div className="space-y-1.5 text-[11px] font-sans mt-2.5">
                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>ID:</span>
                                <span className={`font-mono text-[11px] break-all leading-tight ${isLight ? 'text-gray-800' : 'text-white'}`}>{trade.id}</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Trade Pair:</span>
                                <span className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{trade.asset} <span className={isLight ? 'text-gray-400' : 'text-[#8492a6]'}>·</span> {Math.round(trade.payoutRate * 100)}%</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Open Price:</span>
                                <span className={`font-mono font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{Number(trade.entryPrice).toFixed(decimals)}</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Open time:</span>
                                <span className={`font-mono ${isLight ? 'text-gray-800' : 'text-white'}`}>{formatQuotexTimestamp(trade.entryTime, false)}</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Close Time:</span>
                                <span className={`font-mono ${isLight ? 'text-gray-800' : 'text-white'}`}>{formatQuotexTimestamp(trade.expireTime, true)}</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Duration:</span>
                                <span className={`font-mono ${isLight ? 'text-gray-800' : 'text-white'}`}>{formatTimeDuration(Math.round((trade.expireTime - trade.entryTime) / 1000))}</span>
                              </div>

                              <div className="flex justify-between items-end">
                                <div>
                                  <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Difference:</span>
                                  <span className={`font-mono font-black text-xs ${diffVal > 0 ? 'text-[#00c26f]' : diffVal < 0 ? 'text-[#ff4b55]' : (isLight ? 'text-gray-600' : 'text-gray-300')}`}>
                                    {diffVal >= 0 ? `+${diffVal}` : `${diffVal}`}
                                  </span>
                                </div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); showToast('Trade snapshot captured', 'success'); }}
                                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
                                    isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border border-gray-200' : 'bg-[#20293a] hover:bg-[#2b374c] text-white/80 hover:text-white'
                                  }`}
                                  title="Trade snapshot"
                                >
                                  <Camera size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Closed Trades for Current Session (Disappear after 12AM-12PM cycle - Image 2) */}
                  {visibleClosed.map(trade => {
                    const isProfitable = trade.pnl > 0;
                    const assetObj = QUOTEX_ASSETS.find(a => a.name === trade.asset || a.id === trade.asset);
                    const isCrypto = trade.asset.toLowerCase().includes('crypto') || trade.asset.toLowerCase().includes('bitcoin');
                    const decimals = isCrypto ? 2 : ((assetObj as any)?.decimals ?? 5);

                    const mult = Math.pow(10, decimals);
                    const diffVal = Math.round((trade.exitPrice - trade.entryPrice) * mult);
                    // Collapsed by default matching Image 2
                    const isExpanded = expandedTrades[trade.id] === true;
                    const isLight = themeMode === 'Light Mode';

                    return (
                      <div key={trade.id} className={`${
                        isLight 
                          ? 'bg-white hover:bg-[#f8fafd] border border-gray-200 text-gray-900 shadow-xs' 
                          : 'bg-[#222a38] hover:bg-[#263040] border border-[#2d384b] text-white shadow-xs'
                      } rounded-md p-2.5 transition-all mb-1.5 select-none text-xs`}>
                        {/* Header Row 1: Chevron, Asset icon, Name, Duration (Image 3 & 4) */}
                        <div 
                          onClick={() => setExpandedTrades(prev => ({ ...prev, [trade.id]: !prev[trade.id] }))}
                          className="flex justify-between items-center cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <button className={`p-0.5 transition-colors cursor-pointer ${isLight ? 'text-gray-400 hover:text-gray-800' : 'text-gray-400 hover:text-white'}`}>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                            <div className="scale-75 origin-left shrink-0">
                              <AssetIcon asset={assetObj || QUOTEX_ASSETS[0]} />
                            </div>
                            <span className={`text-xs font-bold tracking-wide truncate ${isLight ? 'text-gray-900' : 'text-white'}`}>{trade.asset}</span>
                          </div>
                          <div className={`text-[11px] font-mono font-medium shrink-0 ${isLight ? 'text-gray-500' : 'text-gray-300'}`}>
                            {formatTimeDuration(Math.round((trade.expireTime - trade.entryTime) / 1000))}
                          </div>
                        </div>

                        {/* Header Row 2: Direction & Amount, Closed Result on Right (Image 4) */}
                        <div 
                          onClick={() => setExpandedTrades(prev => ({ ...prev, [trade.id]: !prev[trade.id] }))}
                          className="flex justify-between items-center mt-1.5 pl-5 cursor-pointer select-none"
                        >
                          <div className={`flex items-center gap-1.5 text-xs font-bold ${trade.type === 'UP' ? 'text-[#00c26f]' : 'text-[#ff4b55]'}`}>
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${trade.type === 'UP' ? 'bg-[#00c26f]/20 text-[#00c26f]' : 'bg-[#ff4b55]/20 text-[#ff4b55]'}`}>
                              {trade.type === 'UP' ? <ArrowUp size={10} strokeWidth={3} /> : <ArrowDown size={10} strokeWidth={3} />}
                            </span>
                            <span className="font-mono">{trade.amount} {currency}</span>
                          </div>
                          {/* Close result shown on right side (Image 4) */}
                          <div className={`text-xs font-bold font-mono ${isProfitable ? 'text-[#00c26f]' : 'text-[#ff4b55]'}`}>
                            {isProfitable ? `+${(trade.amount + trade.pnl).toFixed(2)} ${currency}` : `0.00 ${currency}`}
                          </div>
                        </div>

                        {/* Expanded details - Only revealed when clicked */}
                        {isExpanded && (
                          <div className={`mt-2 pt-2 border-t animate-in fade-in duration-150 ${isLight ? 'border-gray-200' : 'border-[#323f54]'}`}>
                            <MiniTradeSparkline 
                              entryPrice={trade.entryPrice}
                              priceHistory={trade.priceHistory}
                              currentPrice={trade.exitPrice}
                              isLight={isLight}
                            />

                            <div className="space-y-1.5 text-[11px] font-sans mt-2.5">
                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>ID:</span>
                                <span className={`font-mono text-[11px] break-all leading-tight ${isLight ? 'text-gray-800' : 'text-white'}`}>{trade.id}</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Trade Pair:</span>
                                <span className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{trade.asset} <span className={isLight ? 'text-gray-400' : 'text-[#8492a6]'}>·</span> {Math.round(trade.payoutRate * 100)}%</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Open Price:</span>
                                <span className={`font-mono font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{Number(trade.entryPrice).toFixed(decimals)}</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Open time:</span>
                                <span className={`font-mono ${isLight ? 'text-gray-800' : 'text-white'}`}>{formatQuotexTimestamp(trade.entryTime, false)}</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Close Time:</span>
                                <span className={`font-mono ${isLight ? 'text-gray-800' : 'text-white'}`}>{formatQuotexTimestamp(trade.expireTime, true)}</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Duration:</span>
                                <span className={`font-mono ${isLight ? 'text-gray-800' : 'text-white'}`}>{formatTimeDuration(Math.round((trade.expireTime - trade.entryTime) / 1000))}</span>
                              </div>

                              <div className="flex justify-between items-end">
                                <div>
                                  <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Difference:</span>
                                  <span className={`font-mono font-black text-xs ${diffVal > 0 ? 'text-[#00c26f]' : diffVal < 0 ? 'text-[#ff4b55]' : (isLight ? 'text-gray-600' : 'text-gray-300')}`}>
                                    {diffVal >= 0 ? `+${diffVal}` : `${diffVal}`}
                                  </span>
                                </div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); showToast('Trade snapshot captured', 'success'); }}
                                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
                                    isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border border-gray-200' : 'bg-[#20293a] hover:bg-[#2b374c] text-white/80 hover:text-white'
                                  }`}
                                  title="Trade snapshot"
                                >
                                  <Camera size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            
            {/* CLOSED TAB (With session filtering - Image 2) */}
            {activeTab === 'CLOSED' && (() => {
              const visibleClosed = tradeHistory.filter(t => isWithinSessionWindow(t.timestamp));
              if (visibleClosed.length === 0) {
                return (
                  <div className={`h-full flex flex-col items-center justify-center py-12 ${themeMode === 'Light Mode' ? 'text-gray-400' : 'text-[var(--text-muted)] opacity-50'}`}>
                    <Clock size={32} className="mb-2" />
                    <span className="text-xs font-medium">{t('noClosedTrades')}</span>
                  </div>
                );
              }

              const dateHeaderStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }).toUpperCase();

              return (
                <div className="flex flex-col">
                  <div className="flex items-center justify-center gap-2 py-2 mb-2 border-b border-[var(--border-color)]">
                     <span className={`text-xs font-black uppercase tracking-wider ${themeMode === 'Light Mode' ? 'text-gray-600' : 'text-[#8492a6]'}`}>{dateHeaderStr}</span>
                     <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${themeMode === 'Light Mode' ? 'bg-gray-200 text-gray-700' : 'bg-[#20293a] text-[#8492a6]'}`}>{visibleClosed.length}</span>
                  </div>

                  {visibleClosed.map(trade => {
                    const isProfitable = trade.pnl > 0;
                    const assetObj = QUOTEX_ASSETS.find(a => a.name === trade.asset || a.id === trade.asset);
                    const isCrypto = trade.asset.toLowerCase().includes('crypto') || trade.asset.toLowerCase().includes('bitcoin');
                    const decimals = isCrypto ? 2 : ((assetObj as any)?.decimals ?? 5);

                    const mult = Math.pow(10, decimals);
                    const diffVal = Math.round((trade.exitPrice - trade.entryPrice) * mult);
                    // Collapsed by default matching Image 2
                    const isExpanded = expandedTrades[trade.id] === true;
                    const isLight = themeMode === 'Light Mode';

                    return (
                      <div key={trade.id} className={`${
                        isLight 
                          ? 'bg-white hover:bg-[#f8fafd] border border-gray-200 text-gray-900 shadow-xs' 
                          : 'bg-[#222a38] hover:bg-[#263040] border border-[#2d384b] text-white shadow-xs'
                      } rounded-md p-2.5 transition-all mb-1.5 select-none text-xs`}>
                        <div 
                          onClick={() => setExpandedTrades(prev => ({ ...prev, [trade.id]: !prev[trade.id] }))}
                          className="flex justify-between items-center cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <button className={`p-0.5 transition-colors cursor-pointer ${isLight ? 'text-gray-400 hover:text-gray-800' : 'text-gray-400 hover:text-white'}`}>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                            <div className="scale-75 origin-left shrink-0">
                              <AssetIcon asset={assetObj || QUOTEX_ASSETS[0]} />
                            </div>
                            <span className={`text-xs font-bold tracking-wide truncate ${isLight ? 'text-gray-900' : 'text-white'}`}>{trade.asset}</span>
                          </div>
                          <div className={`text-[11px] font-mono font-medium shrink-0 ${isLight ? 'text-gray-500' : 'text-gray-300'}`}>
                            {formatTimeDuration(Math.round((trade.expireTime - trade.entryTime) / 1000))}
                          </div>
                        </div>

                        <div 
                          onClick={() => setExpandedTrades(prev => ({ ...prev, [trade.id]: !prev[trade.id] }))}
                          className="flex justify-between items-center mt-1.5 pl-5 cursor-pointer select-none"
                        >
                          <div className={`flex items-center gap-1.5 text-xs font-bold ${trade.type === 'UP' ? 'text-[#00c26f]' : 'text-[#ff4b55]'}`}>
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${trade.type === 'UP' ? 'bg-[#00c26f]/20 text-[#00c26f]' : 'bg-[#ff4b55]/20 text-[#ff4b55]'}`}>
                              {trade.type === 'UP' ? <ArrowUp size={10} strokeWidth={3} /> : <ArrowDown size={10} strokeWidth={3} />}
                            </span>
                            <span className="font-mono">{trade.amount} {currency}</span>
                          </div>
                          <div className={`text-xs font-bold font-mono ${isProfitable ? 'text-[#00c26f]' : 'text-[#ff4b55]'}`}>
                            {isProfitable ? `+${(trade.amount + trade.pnl).toFixed(2)} ${currency}` : `0.00 ${currency}`}
                          </div>
                        </div>

                        {/* Expanded details - Only revealed when clicked */}
                        {isExpanded && (
                          <div className={`mt-2 pt-2 border-t animate-in fade-in duration-150 ${isLight ? 'border-gray-200' : 'border-[#323f54]'}`}>
                            <MiniTradeSparkline 
                              entryPrice={trade.entryPrice}
                              priceHistory={trade.priceHistory}
                              currentPrice={trade.exitPrice}
                              isLight={isLight}
                            />

                            <div className="space-y-1.5 text-[11px] font-sans mt-2.5">
                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>ID:</span>
                                <span className={`font-mono text-[11px] break-all leading-tight ${isLight ? 'text-gray-800' : 'text-white'}`}>{trade.id}</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Trade Pair:</span>
                                <span className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{trade.asset} <span className={isLight ? 'text-gray-400' : 'text-[#8492a6]'}>·</span> {Math.round(trade.payoutRate * 100)}%</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Open Price:</span>
                                <span className={`font-mono font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{Number(trade.entryPrice).toFixed(decimals)}</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Open time:</span>
                                <span className={`font-mono ${isLight ? 'text-gray-800' : 'text-white'}`}>{formatQuotexTimestamp(trade.entryTime, false)}</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Close Time:</span>
                                <span className={`font-mono ${isLight ? 'text-gray-800' : 'text-white'}`}>{formatQuotexTimestamp(trade.expireTime, true)}</span>
                              </div>

                              <div>
                                <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Duration:</span>
                                <span className={`font-mono ${isLight ? 'text-gray-800' : 'text-white'}`}>{formatTimeDuration(Math.round((trade.expireTime - trade.entryTime) / 1000))}</span>
                              </div>

                              <div className="flex justify-between items-end">
                                <div>
                                  <span className={`font-medium block text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8492a6]'}`}>Difference:</span>
                                  <span className={`font-mono font-black text-xs ${diffVal > 0 ? 'text-[#00c26f]' : diffVal < 0 ? 'text-[#ff4b55]' : (isLight ? 'text-gray-600' : 'text-gray-300')}`}>
                                    {diffVal >= 0 ? `+${diffVal}` : `${diffVal}`}
                                  </span>
                                </div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); showToast('Trade snapshot captured', 'success'); }}
                                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
                                    isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border border-gray-200' : 'bg-[#20293a] hover:bg-[#2b374c] text-white/80 hover:text-white'
                                  }`}
                                  title="Trade snapshot"
                                >
                                  <Camera size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            
            {/* ORDERS TAB */}
            {activeTab === 'ORDERS' && pendingOrders.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-50 py-12">
                <Clock size={32} className="mb-2" />
                <span className="text-xs font-medium">{t('noPendingOrders') || 'No pending orders'}</span>
              </div>
            )}

            {activeTab === 'ORDERS' && pendingOrders.map(order => (
               <div key={order.id} className="bg-[var(--hover-bg)] rounded-md p-3 text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                     <div className="flex items-center gap-2 text-xs font-bold">
                        {order.asset}
                     </div>
                     <div className="text-xs font-mono font-bold text-[var(--text-muted)]">
                       {formatTimeInTimezone(order.createdAt)}
                     </div>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-3">
                     <div className={`flex items-center gap-1.5 font-bold ${order.type === 'UP' ? 'text-[#0ba259]' : 'text-[#e33f4a]'}`}>
                        {order.type === 'UP' ? <TrendingUp size={16} strokeWidth={3}/> : <TrendingDown size={16} strokeWidth={3}/>} {order.amount} {currency}
                     </div>
                     <div className="font-bold text-[var(--text-primary)]">
                       {order.pendingType === 'QUOTE' ? `By Quote: ${order.quote}` : `By Time: ${order.time}`}
                     </div>
                  </div>
                  <button onClick={() => setPendingOrders(prev => prev.filter(o => o.id !== order.id))} className="w-full bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-bold rounded py-2 hover:bg-[var(--hover-bg)] transition-colors flex justify-center items-center gap-2">
                    {t('cancelOrder') || 'Cancel Order'}
                  </button>
               </div>
            ))}
          </div>
        </div>
      </div>
      )}
      
      
      
      {/* Onboarding Interactive Tutorial (Images 1 - 7) */}
      <OnboardingTutorialModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentStep={tutorialStep}
        onStepChange={setTutorialStep}
        selectedAsset={selectedAsset}
        tradeResult={tutorialClosedTrade || tradeResultNotification}
        onSelectAsset={(asset) => {
          chooseTradingAsset(asset);
          showToast(`Selected ${asset.name} (${asset.profit1m}% profit)`, 'info');
        }}
        onSelectDemo={() => {
          setAccountType('DEMO');
          setIsOnboardingOpen(false);
          showToast('Switched to Demo Account with $10,000 virtual balance', 'success');
        }}
        onSelectRealDeposit={() => {
          setAccountType('LIVE');
          setIsOnboardingOpen(false);
          setCurrentView('deposit');
        }}
        onSwitchToReal={() => {
          setAccountType('LIVE');
          localStorage.setItem('accountType', 'LIVE');
          setIsOnboardingOpen(false);
        }}
        onPlaceDemoTrade={(dir) => {
          setAccountType('DEMO');
          handleTrade(dir);
        }}
      />

      {/* Deposit Modal */}
      {currentView === 'deposit' && (
        <DepositWithdrawalModal 
          type="deposit" 
          isOpen={true}
          currency={currency}
          currentBalance={liveBalance}
          onBalanceUpdate={(newBal) => setLiveBalance(newBal)}
          isLight={themeMode === 'Light Mode'}
          onClose={() => setCurrentView('TRADE')}
          onSuccess={async (val, details) => {
            const userId = localStorage.getItem('user_uid') || 'trader_' + Date.now().toString().slice(-6);
            const email = localStorage.getItem('user_email') || 'User';
            try {
              await addDoc(collection(db, 'transactions'), {
                userId,
                email,
                type: 'DEPOSIT',
                amount: val,
                method: details?.method || 'Standard',
                utr: details?.utr || '',
                status: 'PENDING',
                timestamp: Date.now()
              }).catch(e => console.warn("addDoc err:", e));
              showToast('Deposit request submitted! Please wait for admin approval.', 'success');
              setCurrentView('TRADE');
            } catch (err) {
              console.error(err);
              showToast('Error submitting deposit.');
            }
          }}
        />
      )}

      {/* Withdrawal Modal */}
      {currentView === 'withdrawal' && (
        <DepositWithdrawalModal 
          type="withdrawal" 
          isOpen={true}
          currency={currency}
          currentBalance={liveBalance}
          onBalanceUpdate={(newBal) => setLiveBalance(newBal)}
          isLight={themeMode === 'Light Mode'}
          onClose={() => setCurrentView('TRADE')}
          onSuccess={async (val) => {
            if (val <= liveBalance) {
              const userId = localStorage.getItem('user_uid');
              const email = localStorage.getItem('user_email') || 'User';
              try {
                if (userId) {
                  // Pre-deduct the balance immediately
                  setLiveBalance(liveBalance - val); 
                  await addDoc(collection(db, 'transactions'), {
                    userId,
                    email,
                    type: 'WITHDRAWAL',
                    amount: val,
                    status: 'PENDING',
                    timestamp: Date.now()
                  }).catch(e => console.warn("addDoc err:", e));
                  showToast('Withdrawal request submitted! Please wait for admin approval.');
                  setCurrentView('TRADE');
                }
              } catch (err) {
                console.error(err);
                showToast('Error submitting withdrawal.');
              }
            } else {
              showToast('Insufficient Live Balance or invalid amount!');
            }
          }}
        />
      )}

      {/* Exchange Form Modal matching Image 3 and Currencies from Images 4 to 8 */}
      <ExchangeFormModal
        isOpen={isExchangeModalOpen}
        onClose={() => setIsExchangeModalOpen(false)}
        currentCurrencyCodeOrSymbol={currentCurrencyCode}
        currentBalance={accountType === 'LIVE' ? liveBalance : demoBalance}
        onConfirmExchange={(newCurrency, conversionFactor) => {
          convertCurrency(newCurrency.symbol, conversionFactor);
          localStorage.setItem('rajadhan_currency', newCurrency.symbol);
          localStorage.setItem('rajadhan_currency_code', newCurrency.code);
          showToast(`Currency successfully exchanged to ${newCurrency.code} (${newCurrency.name})`, 'success');
        }}
      />

      {/* PAIR INFORMATION MODAL */}
      <PairInformationModal
        isOpen={isPairInfoOpen}
        onClose={() => setIsPairInfoOpen(false)}
        asset={selectedAsset}
        currentPrice={latestPriceRef.current || stateRef.current.price || 1.00763}
        currency={currency}
        payout={durationSecs < 300 ? getAssetPayouts(selectedAsset).p1 : getAssetPayouts(selectedAsset).p5}
        onTradeNow={() => {
          setIsPairInfoOpen(false);
        }}
      />

      {/* Trade Confirmation Dialog (When 1-Click Trade is OFF) */}
      {pendingConfirmTrade && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-5 w-full max-w-sm shadow-2xl flex flex-col gap-4 text-[var(--text-primary)]">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${pendingConfirmTrade === 'UP' ? 'bg-[#0ba259]' : 'bg-[#e33f4a]'}`}>
                  {pendingConfirmTrade === 'UP' ? <TrendingUp size={18} strokeWidth={2.8} /> : <TrendingDown size={18} strokeWidth={2.8} />}
                </div>
                <h3 className="font-extrabold text-base tracking-tight">Confirm Trade</h3>
              </div>
              <button 
                onClick={() => setPendingConfirmTrade(null)} 
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-xs bg-[var(--hover-bg)] p-3.5 rounded-lg border border-[var(--border-color)]">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)] font-medium">Asset</span>
                <span className="font-bold text-[var(--text-primary)]">{selectedAsset.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)] font-medium">Direction</span>
                <span className={`font-black uppercase px-2 py-0.5 rounded text-[11px] ${pendingConfirmTrade === 'UP' ? 'bg-[#0ba259]/20 text-[#0ba259]' : 'bg-[#e33f4a]/20 text-[#e33f4a]'}`}>
                  {pendingConfirmTrade === 'UP' ? 'UP / CALL' : 'DOWN / PUT'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)] font-medium">Investment</span>
                <span className="font-extrabold text-sm text-[var(--text-primary)]">{investment} {currency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)] font-medium">Duration</span>
                <span className="font-bold text-[var(--text-primary)]">{formatTimeDuration(durationSecs)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)] font-medium">Expected Payout</span>
                <span className="font-black text-[#0ba259] text-sm">{ (investment * (1 + activePayoutRate)).toFixed(2) } {currency} (+{(activePayoutRate * 100).toFixed(0)}%)</span>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none px-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <input 
                type="checkbox" 
                checked={dontAskConfirmAgain} 
                onChange={e => setDontAskConfirmAgain(e.target.checked)} 
                className="w-4 h-4 rounded accent-[#1e88e5] cursor-pointer"
              />
              <span>Don't ask again (Enable 1-Click Trade)</span>
            </label>

            <div className="flex items-center gap-2.5 mt-1">
              <button 
                onClick={() => setPendingConfirmTrade(null)} 
                className="flex-1 py-2.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--hover-bg)] font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmPendingTrade} 
                className={`flex-1 py-2.5 rounded-lg text-white font-extrabold text-xs shadow-md transition-all cursor-pointer active:scale-95 ${pendingConfirmTrade === 'UP' ? 'bg-[#0ba259] hover:bg-[#0ba259]/90 shadow-[#0ba259]/20' : 'bg-[#e33f4a] hover:bg-[#e33f4a]/90 shadow-[#e33f4a]/20'}`}
              >
                Confirm {pendingConfirmTrade === 'UP' ? 'Buy' : 'Sell'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Style for scrollbar to match dark theme */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b4353; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4a5468; }
      `}</style>
    </div>
  );
}
