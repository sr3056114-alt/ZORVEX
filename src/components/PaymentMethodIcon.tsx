import React from 'react';
import { OfficialPhonePeSvg } from './OfficialPhonePeSvg';
import { OfficialUpiSvg } from './OfficialUpiSvg';
import { OfficialPaytmSvg } from './OfficialPaytmSvg';
import { OfficialTetherSvg } from './OfficialTetherSvg';
import { OfficialBinanceSvg } from './OfficialBinanceSvg';
import { OfficialUsdcSvg } from './OfficialUsdcSvg';
import { OfficialBtcSvg } from './OfficialBtcSvg';
import { OfficialBchSvg } from './OfficialBchSvg';
import { OfficialPolygonSvg } from './OfficialPolygonSvg';
import { OfficialEthSvg } from './OfficialEthSvg';
import { OfficialTronSvg } from './OfficialTronSvg';
import { OfficialDaiSvg } from './OfficialDaiSvg';
import { OfficialDashSvg } from './OfficialDashSvg';
import { OfficialKuCoinSvg } from './OfficialKuCoinSvg';
import { OfficialDogeSvg } from './OfficialDogeSvg';
import { OfficialXrpSvg } from './OfficialXrpSvg';
import { OfficialShibSvg } from './OfficialShibSvg';
import { OfficialTonSvg } from './OfficialTonSvg';
import { OfficialLtcSvg } from './OfficialLtcSvg';
import { OfficialBankIcon } from './OfficialBankIcon';

export interface PaymentIconProps {
  name?: string;
  type?: string;
  iconKey?: string;
  networkBadge?: string;
  size?: number;
  className?: string;
}

export const PaymentMethodIcon: React.FC<PaymentIconProps> = ({
  name = '',
  type = '',
  iconKey = '',
  networkBadge = '',
  size = 40,
  className = ''
}) => {
  const normKey = (iconKey || name || type || '').toLowerCase();

  // Helper badge for networks: TRC-20 (red Tron), ERC-20 (gray Ethereum), BEP-20 (yellow BNB), Polygon (purple)
  const renderNetworkBadge = (badge: string) => {
    const b = badge.toLowerCase();
    
    // TRC-20 (Tron) - Red circle with official white Tron diamond
    if (b.includes('trc') || b.includes('tron')) {
      return (
        <div 
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#EF0027] border-2 border-white flex items-center justify-center shadow-md overflow-hidden"
          title="Tron (TRC-20)"
        >
          <svg viewBox="0 0 100 100" className="w-2.5 h-2.5">
            <polygon points="12,18 92,10 50,92 38,38" fill="#FFFFFF" />
            <polygon points="42,42 82,18 52,82" fill="#D6001F" />
          </svg>
        </div>
      );
    }

    // BEP-20 (BNB Smart Chain) - Yellow circle with official black Binance rhombuses
    if (b.includes('bep') || b.includes('bsc') || b.includes('binance')) {
      return (
        <div 
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#F0B90B] border-2 border-white flex items-center justify-center shadow-md overflow-hidden"
          title="BNB Smart Chain (BEP-20)"
        >
          <svg viewBox="0 0 100 100" className="w-2.5 h-2.5 fill-black">
            <polygon points="50,16 66,32 50,48 34,32" />
            <polygon points="22,44 38,60 22,76 6,60" />
            <polygon points="78,44 94,60 78,76 62,60" />
            <polygon points="50,72 66,88 50,104 34,88" />
            <polygon points="50,44 64,58 50,72 36,58" />
          </svg>
        </div>
      );
    }

    // ERC-20 (Ethereum) - Dark slate circle with official faceted white Ethereum diamond
    if (b.includes('erc') || b.includes('eth')) {
      return (
        <div 
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#3D4554] border-2 border-white flex items-center justify-center shadow-md overflow-hidden"
          title="Ethereum (ERC-20)"
        >
          <svg viewBox="0 0 100 100" className="w-2.5 h-2.5">
            <polygon points="50,12 80,50 50,63" fill="#D1D5DB" />
            <polygon points="50,12 20,50 50,63" fill="#FFFFFF" />
            <polygon points="50,66 80,52 50,88" fill="#D1D5DB" />
            <polygon points="50,66 20,52 50,88" fill="#F3F4F6" />
          </svg>
        </div>
      );
    }

    // Polygon - Purple circle with official Polygon mark
    if (b.includes('polygon') || b.includes('matic')) {
      return (
        <div 
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#8247E5] border-2 border-white flex items-center justify-center shadow-md overflow-hidden p-0.5"
          title="Polygon"
        >
          <svg viewBox="0 0 32 32" className="w-full h-full fill-white">
            <path d="M21.092 12.693c-.369-.215-.848-.215-1.254 0l-2.879 1.654-1.955 1.078-2.879 1.653c-.369.216-.848.216-1.254 0l-2.288-1.294c-.369-.215-.627-.61-.627-1.042V12.19c0-.431.221-.826.627-1.042l2.25-1.258c.37-.216.85-.216 1.256 0l2.25 1.258c.37.216.628.611.628 1.042v1.654l1.955-1.115v-1.653a1.16 1.16 0 00-.627-1.042l-4.17-2.372c-.369-.216-.848-.216-1.254 0l-4.244 2.372A1.16 1.16 0 006 11.076v4.78c0 .432.221.827.627 1.043l4.244 2.372c.369.215.849.215 1.254 0l2.879-1.618 1.955-1.114 2.879-1.617c.369-.216.848-.216 1.254 0l2.251 1.258c.37.215.627.61.627 1.042v2.552c0 .431-.22.826-.627 1.042l-2.25 1.294c-.37.216-.85.216-1.255 0l-2.251-1.258c-.37-.216-.628-.611-.628-1.042v-1.654l-1.955 1.115v1.653c0 .431.221.827.627 1.042l4.244 2.372c.369.216.848.216 1.254 0l4.244-2.372c.369-.215.627-.61.627-1.042v-4.78a1.16 1.16 0 00-.627-1.042l-4.28-2.409z" />
          </svg>
        </div>
      );
    }

    return null;
  };

  // Auto-detect network badge if not explicitly passed
  let detectedBadge = networkBadge;
  if (!detectedBadge) {
    if (normKey.includes('trc-20') || normKey.includes('trc20')) detectedBadge = 'TRC-20';
    else if (normKey.includes('erc-20') || normKey.includes('erc20')) detectedBadge = 'ERC-20';
    else if (normKey.includes('bep-20') || normKey.includes('bep20')) detectedBadge = 'BEP-20';
    else if (normKey.includes('polygon') || normKey.includes('matic')) detectedBadge = 'Polygon';
  }

  // ==========================================
  // 1. TETHER USDT (100% Authentic Official Pentagon Jewel Mark)
  // Matching User Image 2 with sea-green gem & white T + torus
  // ==========================================
  if (normKey.includes('usdt') || normKey.includes('tether')) {
    return (
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <OfficialTetherSvg size={size} className={className} />
        {detectedBadge && renderNetworkBadge(detectedBadge)}
      </div>
    );
  }

  // ==========================================
  // 2. BINANCE PAY (Official Golden-Amber 4-Rhombus Geometric Emblem)
  // Matching User Image 3
  // ==========================================
  if (normKey.includes('binance pay') || normKey.includes('binance_pay') || (normKey.includes('binance') && !normKey.includes('usdt') && !normKey.includes('usdc'))) {
    return <OfficialBinanceSvg size={size} className={className} />;
  }

  // ==========================================
  // 3. BITCOIN (BTC) (Official Orange Coin with Clockwise-Tilted ₿)
  // Matching User Image 5
  // ==========================================
  if ((normKey.includes('bitcoin') && !normKey.includes('cash')) || normKey === 'btc') {
    return <OfficialBtcSvg size={size} className={className} />;
  }

  // ==========================================
  // 4. BITCOIN CASH (BCH) (Official Vibrant Green with Counter-Tilted ₿)
  // Matching User Image 6
  // ==========================================
  if (normKey.includes('bitcoin cash') || normKey === 'bch') {
    return <OfficialBchSvg size={size} className={className} />;
  }

  // ==========================================
  // 5. ETHEREUM (ETH) (Official 3D Faceted Crystal Prism)
  // Grounded in official brand vectors matching Image 1
  // ==========================================
  if (normKey.includes('ethereum') || normKey === 'eth') {
    return <OfficialEthSvg size={size} className={className} />;
  }

  // ==========================================
  // 6. TRON (TRX) (Official Red Circle Emblem with White Crystal)
  // Grounded in official brand vectors matching Image 2
  // ==========================================
  if (normKey.includes('tron') || normKey === 'trx') {
    return <OfficialTronSvg size={size} className={className} />;
  }

  // ==========================================
  // 7. KUCOIN PAY / KCS (Official Teal Green Circle Emblem)
  // Grounded in official brand vectors matching Image 6
  // ==========================================
  if (normKey.includes('kucoin') || normKey === 'kcs') {
    return <OfficialKuCoinSvg size={size} className={className} />;
  }

  // ==========================================
  // 8. PHONEPE (Official 100% Authentic Vector Circle with Devanagari 'पे')
  // Checked before UPI so 'PhonePe UPI' or 'Phone' correctly resolves to PhonePe
  // Matches User Image 1 exactly with official PhonePe purple and white 'पे'
  // ==========================================
  if (normKey.includes('phone')) {
    return <OfficialPhonePeSvg size={size} className={className} />;
  }

  // ==========================================
  // 9. PAYTM (Official Circular White Badge with Navy Blue Ring)
  // Checked before UPI so 'Paytm UPI' correctly resolves to Paytm
  // Matches User Image 1 exactly
  // ==========================================
  if (normKey.includes('paytm')) {
    return <OfficialPaytmSvg size={size} className={className} />;
  }

  // ==========================================
  // 10. UPI & UPI INTENT (Official NPCI Unified Payments Interface Vector Logo)
  // Grounded in official NPCI vectors matching User Image 2 with bold italic UPI,
  // rightward green/orange arrows, and UNIFIED PAYMENTS INTERFACE subtext
  // ==========================================
  if (normKey.includes('upi') || normKey.includes('bhim')) {
    return (
      <div 
        className={`relative flex items-center justify-center shrink-0 bg-white rounded-lg px-1.5 py-0.5 border border-gray-200 shadow-sm overflow-hidden ${className}`}
        style={{ width: size * 1.35, height: size }}
      >
        <OfficialUpiSvg />
      </div>
    );
  }

  // ==========================================
  // GOOGLE PAY (GPAY)
  // ==========================================
  if (normKey.includes('gpay') || normKey.includes('google pay')) {
    return (
      <div 
        className={`relative flex items-center justify-center shrink-0 bg-white rounded-lg px-2 py-1 border border-gray-200 shadow-sm ${className}`}
        style={{ width: size * 1.15, height: size }}
      >
        <svg viewBox="0 0 100 40" className="w-full h-full">
          <path d="M18,9 C23,9 26.5,10.8 28.5,12.8 L25.5,15.8 C24,14.3 21.5,13.2 18,13.2 C12.5,13.2 8,17.8 8,23.2 C8,28.8 12.5,33.2 18,33.2 C24.2,33.2 27,29 27.5,26.2 L18,26.2 L18,22.2 L31.5,22.2 C31.8,23 32,24 32,25.2 C32,31.2 27.8,37.2 18,37.2 C10,37.2 4,31 4,23.2 C4,15.5 10,9 18,9 Z" fill="#4285F4" />
          <text x="36" y="30" fill="#5F6368" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="18">Pay</text>
        </svg>
      </div>
    );
  }

  // ==========================================
  // 11. USDC (USD Coin)
  // Matching User Image 4 with official royal blue circle, dual arcs, and centered '$'
  // ==========================================
  if (normKey.includes('usdc')) {
    return (
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <OfficialUsdcSvg size={size} className={className} />
        {detectedBadge && renderNetworkBadge(detectedBadge)}
      </div>
    );
  }

  // ==========================================
  // 12. LITECOIN (LTC)
  // Grounded in official brand vectors matching Image 3
  // ==========================================
  if (normKey.includes('litecoin') || normKey === 'ltc') {
    return <OfficialLtcSvg size={size} className={className} />;
  }

  // ==========================================
  // 13. DASH
  // Grounded in official brand vectors matching Image 5
  // ==========================================
  if (normKey.includes('dash')) {
    return <OfficialDashSvg size={size} className={className} />;
  }

  // ==========================================
  // 14. POLYGON (MATIC / POL)
  // Matching User Image 7 with official purple dual-interlocking hexagon loop
  // ==========================================
  if (normKey.includes('polygon') || normKey.includes('matic') || normKey === 'pol') {
    return <OfficialPolygonSvg size={size} className={className} />;
  }

  // ==========================================
  // 15. DAI (MakerDAO Stablecoin)
  // Grounded in official brand vectors matching Image 4
  // ==========================================
  if (normKey.includes('dai')) {
    return <OfficialDaiSvg size={size} className={className} />;
  }

  // ==========================================
  // 16. SHIBA INU (SHIB)
  // Grounded in official brand vectors matching Image 1
  // ==========================================
  if (normKey.includes('shiba') || normKey.includes('shib')) {
    return (
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <OfficialShibSvg size={size} className={className} />
        {renderNetworkBadge('ERC-20')}
      </div>
    );
  }

  // ==========================================
  // 17. DOGECOIN (DOGE)
  // Grounded in official brand vectors matching Image 7
  // ==========================================
  if (normKey.includes('doge')) {
    return <OfficialDogeSvg size={size} className={className} />;
  }

  // ==========================================
  // 18. RIPPLE (XRP)
  // 3D Realistic Black Token Coin matching Image 3
  // ==========================================
  if (normKey.includes('ripple') || normKey.includes('xrp')) {
    return <OfficialXrpSvg size={size} className={className} />;
  }

  // ==========================================
  // 19. THE OPEN NETWORK (TON)
  // Grounded in official TON Foundation vectors matching Image 2
  // ==========================================
  if (normKey.includes('ton') || normKey.includes('the open network')) {
    return <OfficialTonSvg size={size} className={className} />;
  }

  // ==========================================
  // BANK TRANSFER / BANK ACCOUNT (Official 3D Building matching Image 3)
  // ==========================================
  if (normKey.includes('bank')) {
    return <OfficialBankIcon size={size} className={className} />;
  }

  // Default Fallback
  return (
    <div 
      className={`relative rounded-full flex items-center justify-center shrink-0 shadow-sm bg-[#1e88e5]/20 text-[#1e88e5] ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 fill-none stroke-current" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    </div>
  );
};
