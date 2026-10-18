import React, { useState } from 'react';

interface CurrencyFlagProps {
  code: string;
  size?: number;
  className?: string;
}

// Map currencies to their respective country 2-letter ISO codes
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: 'us',
  EUR: 'eu',
  GBP: 'gb',
  INR: 'in',
  BRL: 'br',
  IDR: 'id',
  MYR: 'my',
  KZT: 'kz',
  THB: 'th',
  UAH: 'ua',
  VND: 'vn',
  NGN: 'ng',
  EGP: 'eg',
  MXN: 'mx',
  JPY: 'jp',
  BDT: 'bd',
  PHP: 'ph',
  TRY: 'tr',
  KRW: 'kr',
  PKR: 'pk',
  COP: 'co', // Colombia
  ARS: 'ar', // Argentina
  CLP: 'cl', // Chile
  PEN: 'pe', // Peru
  ZAR: 'za', // South Africa
  AED: 'ae', // United Arab Emirates
  SAR: 'sa', // Saudi Arabia
  CAD: 'ca', // Canada
  AUD: 'au', // Australia
  CHF: 'ch', // Switzerland
  SGD: 'sg', // Singapore
  CNY: 'cn', // China
  RUB: 'ru', // Russia
  PLN: 'pl', // Poland
  NZD: 'nz', // New Zealand
  QAR: 'qa', // Qatar
  KWD: 'kw', // Kuwait
  DZD: 'dz', // Algeria
  MAD: 'ma', // Morocco
  KES: 'ke', // Kenya
  GHS: 'gh', // Ghana
  TZS: 'tz', // Tanzania
  UGX: 'ug', // Uganda
  LKR: 'lk', // Sri Lanka
  NPR: 'np', // Nepal
  UZS: 'uz', // Uzbekistan
  AZN: 'az', // Azerbaijan
  GEL: 'ge', // Georgia
  AMD: 'am', // Armenia
  BYN: 'by', // Belarus
  IQD: 'iq', // Iraq
  ILS: 'il', // Israel
  DKK: 'dk', // Denmark
  SEK: 'se', // Sweden
  NOK: 'no', // Norway
  HUF: 'hu', // Hungary
  CZK: 'cz', // Czech Republic
  RON: 'ro', // Romania
  BGN: 'bg', // Bulgaria
  HRK: 'hr', // Croatia
  RSD: 'rs', // Serbia
};

export const CurrencyFlag: React.FC<CurrencyFlagProps> = ({ code, size = 20, className = '' }) => {
  const [hasError, setHasError] = useState(false);
  const cleanCode = (code || '').trim().toUpperCase();

  // Determine country ISO code (2 letters)
  const countryIso = cleanCode.length === 2 
    ? cleanCode.toLowerCase()
    : (CURRENCY_TO_COUNTRY[cleanCode] || cleanCode.slice(0, 2).toLowerCase());

  // Render inline SVG for backup/offline
  const renderFallbackSvg = () => {
    switch (cleanCode) {
      case 'COP':
      case 'CO':
        // Colombia (Yellow top 50%, Blue 25%, Red 25%)
        return (
          <svg viewBox="0 0 60 60" width={size} height={size} className="rounded-full shrink-0 shadow-xs border border-white/20">
            <clipPath id={`cf-co-${size}`}><circle cx="30" cy="30" r="30" /></clipPath>
            <g clipPath={`url(#cf-co-${size})`}>
              <rect x="0" y="0" width="60" height="30" fill="#FCD116" />
              <rect x="0" y="30" width="60" height="15" fill="#003893" />
              <rect x="0" y="45" width="60" height="15" fill="#CE1126" />
            </g>
          </svg>
        );

      case 'ARS':
      case 'AR':
        // Argentina (Light blue, white with sun, light blue)
        return (
          <svg viewBox="0 0 60 60" width={size} height={size} className="rounded-full shrink-0 shadow-xs border border-white/20">
            <clipPath id={`cf-ar-${size}`}><circle cx="30" cy="30" r="30" /></clipPath>
            <g clipPath={`url(#cf-ar-${size})`}>
              <rect x="0" y="0" width="60" height="20" fill="#74ACDF" />
              <rect x="0" y="20" width="60" height="20" fill="#FFFFFF" />
              <circle cx="30" cy="30" r="5" fill="#F6B40E" />
              <rect x="0" y="40" width="60" height="20" fill="#74ACDF" />
            </g>
          </svg>
        );

      case 'CLP':
      case 'CL':
        // Chile (Blue box with white star, White top, Red bottom)
        return (
          <svg viewBox="0 0 60 60" width={size} height={size} className="rounded-full shrink-0 shadow-xs border border-white/20">
            <clipPath id={`cf-cl-${size}`}><circle cx="30" cy="30" r="30" /></clipPath>
            <g clipPath={`url(#cf-cl-${size})`}>
              <rect x="0" y="0" width="60" height="30" fill="#FFFFFF" />
              <rect x="0" y="30" width="60" height="30" fill="#D52B1E" />
              <rect x="0" y="0" width="30" height="30" fill="#0039A6" />
              <polygon points="15,6 18,14 26,14 19,19 22,27 15,22 8,27 11,19 4,14 12,14" fill="#FFFFFF" />
            </g>
          </svg>
        );

      case 'PEN':
      case 'PE':
        // Peru (Red, White, Red vertical bars)
        return (
          <svg viewBox="0 0 60 60" width={size} height={size} className="rounded-full shrink-0 shadow-xs border border-white/20">
            <clipPath id={`cf-pe-${size}`}><circle cx="30" cy="30" r="30" /></clipPath>
            <g clipPath={`url(#cf-pe-${size})`}>
              <rect x="0" y="0" width="20" height="60" fill="#D91023" />
              <rect x="20" y="0" width="20" height="60" fill="#FFFFFF" />
              <rect x="40" y="0" width="20" height="60" fill="#D91023" />
            </g>
          </svg>
        );

      case 'ZAR':
      case 'ZA':
        // South Africa
        return (
          <svg viewBox="0 0 60 60" width={size} height={size} className="rounded-full shrink-0 shadow-xs border border-white/20">
            <clipPath id={`cf-za-${size}`}><circle cx="30" cy="30" r="30" /></clipPath>
            <g clipPath={`url(#cf-za-${size})`}>
              <rect x="0" y="0" width="60" height="30" fill="#E03C31" />
              <rect x="0" y="30" width="60" height="30" fill="#001489" />
              <polygon points="0,0 28,30 0,60" fill="#000000" />
              <polygon points="0,0 35,30 0,60" stroke="#FFB81C" strokeWidth="3" fill="none" />
              <polygon points="0,15 32,30 60,30 60,30 32,30 0,45" fill="#007749" stroke="#FFFFFF" strokeWidth="2" />
            </g>
          </svg>
        );

      case 'AED':
      case 'AE':
        // United Arab Emirates (Red vertical, Green, White, Black horizontal)
        return (
          <svg viewBox="0 0 60 60" width={size} height={size} className="rounded-full shrink-0 shadow-xs border border-white/20">
            <clipPath id={`cf-ae-${size}`}><circle cx="30" cy="30" r="30" /></clipPath>
            <g clipPath={`url(#cf-ae-${size})`}>
              <rect x="15" y="0" width="45" height="20" fill="#00732F" />
              <rect x="15" y="20" width="45" height="20" fill="#FFFFFF" />
              <rect x="15" y="40" width="45" height="20" fill="#000000" />
              <rect x="0" y="0" width="18" height="60" fill="#FF0000" />
            </g>
          </svg>
        );

      case 'SAR':
      case 'SA':
        // Saudi Arabia (Green with white sword/script)
        return (
          <svg viewBox="0 0 60 60" width={size} height={size} className="rounded-full shrink-0 shadow-xs border border-white/20">
            <clipPath id={`cf-sa-${size}`}><circle cx="30" cy="30" r="30" /></clipPath>
            <g clipPath={`url(#cf-sa-${size})`}>
              <rect width="60" height="60" fill="#006C35" />
              <rect x="14" y="34" width="32" height="3" fill="#FFFFFF" rx="1.5" />
              <circle cx="20" cy="24" r="3" fill="#FFFFFF" />
              <circle cx="30" cy="24" r="3" fill="#FFFFFF" />
              <circle cx="40" cy="24" r="3" fill="#FFFFFF" />
            </g>
          </svg>
        );

      case 'GBP':
      case 'GB':
        return (
          <svg viewBox="0 0 60 60" width={size} height={size} className="rounded-full shrink-0 shadow-xs border border-white/20">
            <clipPath id={`cf-gb-${size}`}><circle cx="30" cy="30" r="30" /></clipPath>
            <g clipPath={`url(#cf-gb-${size})`}>
              <rect width="60" height="60" fill="#012169" />
              <line x1="0" y1="0" x2="60" y2="60" stroke="#fff" strokeWidth="12" />
              <line x1="60" y1="0" x2="0" y2="60" stroke="#fff" strokeWidth="12" />
              <line x1="0" y1="0" x2="60" y2="60" stroke="#C8102E" strokeWidth="6" />
              <line x1="60" y1="0" x2="0" y2="60" stroke="#C8102E" strokeWidth="6" />
              <rect x="22" y="0" width="16" height="60" fill="#fff" />
              <rect x="0" y="22" width="60" height="16" fill="#fff" />
              <rect x="25" y="0" width="10" height="60" fill="#C8102E" />
              <rect x="0" y="25" width="60" height="10" fill="#C8102E" />
            </g>
          </svg>
        );

      case 'USD':
      case 'US':
        return (
          <svg viewBox="0 0 60 60" width={size} height={size} className="rounded-full shrink-0 shadow-xs border border-white/20">
            <clipPath id={`cf-us-${size}`}><circle cx="30" cy="30" r="30" /></clipPath>
            <g clipPath={`url(#cf-us-${size})`}>
              <rect width="60" height="60" fill="#fff" />
              {[0, 2, 4, 6, 8, 10, 12].map(i => (
                <rect key={i} x="0" y={i * (60/13)} width="60" height={60/13} fill="#B22234" />
              ))}
              <rect x="0" y="0" width="28" height="32" fill="#3C3B6E" />
              <circle cx="7" cy="8" r="1.5" fill="#fff" />
              <circle cx="14" cy="8" r="1.5" fill="#fff" />
              <circle cx="21" cy="8" r="1.5" fill="#fff" />
              <circle cx="10.5" cy="16" r="1.5" fill="#fff" />
              <circle cx="17.5" cy="16" r="1.5" fill="#fff" />
              <circle cx="7" cy="24" r="1.5" fill="#fff" />
              <circle cx="14" cy="24" r="1.5" fill="#fff" />
              <circle cx="21" cy="24" r="1.5" fill="#fff" />
            </g>
          </svg>
        );

      case 'INR':
      case 'IN':
        return (
          <svg viewBox="0 0 60 60" width={size} height={size} className="rounded-full shrink-0 shadow-xs border border-white/20">
            <clipPath id={`cf-in-${size}`}><circle cx="30" cy="30" r="30" /></clipPath>
            <g clipPath={`url(#cf-in-${size})`}>
              <rect x="0" y="0" width="60" height="20" fill="#FF9933" />
              <rect x="0" y="20" width="60" height="20" fill="#FFFFFF" />
              <rect x="0" y="40" width="60" height="20" fill="#138808" />
              <circle cx="30" cy="30" r="6" stroke="#000080" strokeWidth="1.2" fill="none" />
              <circle cx="30" cy="30" r="1.5" fill="#000080" />
            </g>
          </svg>
        );

      default:
        // Generic styled round flag badge with country initials
        return (
          <div 
            className="rounded-full flex items-center justify-center font-bold text-[9px] text-white border border-white/20 bg-linear-to-tr from-[#1e293b] to-[#334155]"
            style={{ width: size, height: size }}
          >
            {cleanCode.slice(0, 2)}
          </div>
        );
    }
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden shadow-xs border border-white/20 bg-[#171c26] select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {!hasError ? (
        <img
          src={`https://flagcdn.com/w80/${countryIso}.png`}
          alt={cleanCode}
          className="w-full h-full object-cover rounded-full pointer-events-none"
          onError={() => setHasError(true)}
          crossOrigin="anonymous"
          loading="lazy"
        />
      ) : (
        renderFallbackSvg()
      )}
    </div>
  );
};

export const CountryFlag: React.FC<CurrencyFlagProps> = CurrencyFlag;
export default CurrencyFlag;
