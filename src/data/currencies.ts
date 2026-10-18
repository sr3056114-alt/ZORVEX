export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  ratePerUSD: number; // units per 1 USD
  minBet: number;
  badgeBg: string;
  badgeText: string;
}

// Complete list of currencies with round icons, country flags, and conversion factors
export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', ratePerUSD: 1.0, minBet: 1, badgeBg: '#0ba259', badgeText: '$' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', ratePerUSD: 0.93, minBet: 1, badgeBg: '#1d4ed8', badgeText: '€' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', ratePerUSD: 0.79, minBet: 1, badgeBg: '#0070e0', badgeText: '£' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', ratePerUSD: 87.0, minBet: 100, badgeBg: '#ea580c', badgeText: '₹' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', ratePerUSD: 5.75, minBet: 5, badgeBg: '#16a34a', badgeText: 'R$' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩', ratePerUSD: 16300, minBet: 15000, badgeBg: '#dc2626', badgeText: 'Rp' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾', ratePerUSD: 4.45, minBet: 5, badgeBg: '#2563eb', badgeText: 'RM' },
  { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge', flag: '🇰🇿', ratePerUSD: 505.0, minBet: 500, badgeBg: '#0891b2', badgeText: '₸' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭', ratePerUSD: 34.5, minBet: 35, badgeBg: '#2563eb', badgeText: '฿' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', flag: '🇺🇦', ratePerUSD: 41.6, minBet: 40, badgeBg: '#ca8a04', badgeText: '₴' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', flag: '🇻🇳', ratePerUSD: 25400, minBet: 25000, badgeBg: '#b91c1c', badgeText: '₫' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬', ratePerUSD: 1550, minBet: 1500, badgeBg: '#15803d', badgeText: '₦' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', flag: '🇪🇬', ratePerUSD: 50.5, minBet: 50, badgeBg: '#b45309', badgeText: 'E£' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', flag: '🇲🇽', ratePerUSD: 20.2, minBet: 20, badgeBg: '#15803d', badgeText: 'Mex$' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', ratePerUSD: 153.0, minBet: 150, badgeBg: '#be123c', badgeText: '¥' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', flag: '🇧🇩', ratePerUSD: 121.0, minBet: 120, badgeBg: '#15803d', badgeText: '৳' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', flag: '🇵🇭', ratePerUSD: 58.5, minBet: 60, badgeBg: '#1d4ed8', badgeText: '₱' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷', ratePerUSD: 36.5, minBet: 35, badgeBg: '#b91c1c', badgeText: '₺' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷', ratePerUSD: 1440, minBet: 1500, badgeBg: '#0284c7', badgeText: '₩' },
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', flag: '🇵🇰', ratePerUSD: 278.0, minBet: 300, badgeBg: '#dc2626', badgeText: 'Rs' },
  { code: 'COP', symbol: 'Col$', name: 'Colombian Peso', flag: '🇨🇴', ratePerUSD: 4180, minBet: 4000, badgeBg: '#ea580c', badgeText: 'Col$' },
  { code: 'ARS', symbol: 'AR$', name: 'Argentine Peso', flag: '🇦🇷', ratePerUSD: 1040, minBet: 1000, badgeBg: '#0284c7', badgeText: 'AR$' },
  { code: 'CLP', symbol: 'CLP$', name: 'Chilean Peso', flag: '🇨🇱', ratePerUSD: 950, minBet: 900, badgeBg: '#dc2626', badgeText: 'CLP$' },
  { code: 'PEN', symbol: 'S/.', name: 'Peruvian Sol', flag: '🇵🇪', ratePerUSD: 3.75, minBet: 4, badgeBg: '#be123c', badgeText: 'S/.' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦', ratePerUSD: 18.2, minBet: 20, badgeBg: '#16a34a', badgeText: 'R' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪', ratePerUSD: 3.67, minBet: 4, badgeBg: '#0ba259', badgeText: 'AED' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', ratePerUSD: 3.75, minBet: 4, badgeBg: '#15803d', badgeText: 'SAR' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦', ratePerUSD: 1.39, minBet: 1, badgeBg: '#dc2626', badgeText: 'CA$' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', ratePerUSD: 1.54, minBet: 1, badgeBg: '#2563eb', badgeText: 'A$' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', ratePerUSD: 0.88, minBet: 1, badgeBg: '#dc2626', badgeText: 'CHF' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', ratePerUSD: 1.34, minBet: 1, badgeBg: '#be123c', badgeText: 'S$' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', ratePerUSD: 7.24, minBet: 7, badgeBg: '#dc2626', badgeText: '¥' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺', ratePerUSD: 96.0, minBet: 100, badgeBg: '#2563eb', badgeText: '₽' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', flag: '🇵🇱', ratePerUSD: 4.05, minBet: 4, badgeBg: '#dc2626', badgeText: 'zł' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', flag: '🇳🇿', ratePerUSD: 1.68, minBet: 2, badgeBg: '#0070e0', badgeText: 'NZ$' }
];

export const DEFAULT_CURRENCY = CURRENCIES[0]; // USD

export function getCurrencyByCode(code: string): CurrencyInfo {
  if (!code) return CURRENCIES[0];
  const found = CURRENCIES.find(c => c.code.toUpperCase() === code.toUpperCase());
  if (found) return found;
  // Try by symbol
  const bySymbol = CURRENCIES.find(c => c.symbol === code);
  if (bySymbol) return bySymbol;
  // Default to USD
  return CURRENCIES[0];
}

export function getCurrencySymbolOrCode(codeOrSymbol: string): { code: string; symbol: string } {
  const cur = getCurrencyByCode(codeOrSymbol);
  return { code: cur.code, symbol: cur.symbol };
}
