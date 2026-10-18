import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { AssetInfo, AssetIcon } from '../../pages/Trading';

interface PairInformationModalProps {
  asset: AssetInfo;
  currentPrice: number;
  currency: string;
  payout: number;
  isOpen: boolean;
  onClose: () => void;
  onTradeNow: () => void;
}

export const PairInformationModal: React.FC<PairInformationModalProps> = ({
  asset,
  currentPrice,
  currency,
  payout,
  isOpen,
  onClose,
  onTradeNow,
}) => {
  const [selectedChangeTab, setSelectedChangeTab] = useState<'5m' | '60m' | '1d'>('5m');

  if (!isOpen) return null;

  // Format price with correct precision
  const precision = asset.category === 'CRYPTO' ? 2 : (asset.id.includes('jpy') ? 3 : 5);
  const formattedPrice = currentPrice ? currentPrice.toFixed(precision) : '1.00763';

  // Calculate schedule dates based on current date
  const now = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const scheduleDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    return {
      date: `${d.getDate()} ${monthNames[d.getMonth()]}`,
      weekday: weekdayNames[d.getDay()],
      time: '17:00 - 16:59',
    };
  });

  // Dynamic sentiment values based on asset id hash
  const charCodeSum = (asset.id || 'asset').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const sellPercent = 60 + (charCodeSum % 25); // e.g. 71%
  const buyPercent = 100 - sellPercent; // e.g. 29%

  const minInvestFormatted = currency === '$' ? '1 $' : (currency === '₹' ? 'Rs 300' : `300 ${currency}`);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-[840px] bg-[#1e2330] border border-[#2b3548] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close button & title info */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#2b3548]/60">
          <div className="flex items-center gap-3">
            {/* White round close button matching Image 2 */}
            <button
              onClick={onClose}
              className="w-7 h-7 bg-white hover:bg-gray-100 text-black rounded-full flex items-center justify-center font-bold shadow-md cursor-pointer transition-all active:scale-90 shrink-0"
              title="Close"
            >
              <X size={16} strokeWidth={3} />
            </button>

            <div className="flex items-center gap-2">
              <div className="scale-110">
                <AssetIcon asset={asset} />
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2">
                {asset.name}
                <span className="text-[#f59e0b] font-black text-sm sm:text-base">
                  {payout}%
                </span>
              </h2>
            </div>
          </div>

          <div className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
            <span className="text-white font-bold">Open Now</span>
            <span className="text-gray-500 font-normal">/</span>
            <span className="text-gray-400">Closes today at 16:59</span>
          </div>
        </div>

        {/* Price, Session Change, Trade Now */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-8 sm:gap-12">
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Price Now</div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {formattedPrice}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Session Change</div>
              <div className="text-base sm:text-lg font-bold text-[#2ebd85]">
                +2.44%
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onTradeNow();
              onClose();
            }}
            className="bg-[#0088ff] hover:bg-[#0077ee] text-white px-5 sm:px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-[#0088ff]/25 cursor-pointer active:scale-95 transition-all"
          >
            <span>Trade Now</span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight size={13} strokeWidth={3} />
            </div>
          </button>
        </div>

        {/* Traders' Sentiment Bar */}
        <div className="mb-6 bg-[#161a24]/60 rounded-lg p-3 border border-[#2b3548]/40">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-bold text-white">Sell</div>
              <div className="text-[11px] text-gray-400">Traders' Sentiment</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-white">{sellPercent}%</span>
              <div className="w-[180px] sm:w-[360px] h-2.5 bg-[#2ebd85] rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-[#ff4b5a] transition-all duration-500" 
                  style={{ width: `${sellPercent}%` }}
                />
              </div>
              <span className="text-sm font-black text-white">{buyPercent}%</span>
            </div>
          </div>
        </div>

        {/* 4 Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#161a24]/40 border border-[#2b3548]/40 rounded-lg p-3">
            <div className="text-[11px] text-gray-400 font-medium mb-1">Minimum investment</div>
            <div className="text-sm font-bold text-white">{minInvestFormatted}</div>
          </div>

          <div className="bg-[#161a24]/40 border border-[#2b3548]/40 rounded-lg p-3">
            <div className="text-[11px] text-gray-400 font-medium mb-1">Profit - 1 min</div>
            <div className="text-sm font-bold text-[#2ebd85]">{payout}%</div>
          </div>

          <div className="bg-[#161a24]/40 border border-[#2b3548]/40 rounded-lg p-3">
            <div className="text-[11px] text-gray-400 font-medium mb-1">Profit - 5+ min</div>
            <div className="text-sm font-bold text-[#2ebd85]">{payout}%</div>
          </div>

          <div className="bg-[#161a24]/40 border border-[#2b3548]/40 rounded-lg p-3">
            <div className="text-[11px] text-gray-400 font-medium mb-1">Expiry time</div>
            <div className="text-sm font-bold text-white">1 min - 4 hour</div>
          </div>
        </div>

        {/* Bottom Split: Left Change Analysis & Right Trading Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Left Column: Change Tabs & Visual Container */}
          <div className="flex flex-col">
            {/* 3 Change Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => setSelectedChangeTab('5m')}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  selectedChangeTab === '5m'
                    ? 'bg-[#151922] border-[#3b475d] shadow-inner'
                    : 'bg-[#1a202c]/50 border-transparent hover:border-[#2b3548]'
                }`}
              >
                <div className="text-[11px] text-gray-400 font-medium">5 min change</div>
                <div className="text-sm font-bold text-[#ff4b5a] mt-0.5">-0.1%</div>
              </button>

              <button
                onClick={() => setSelectedChangeTab('60m')}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  selectedChangeTab === '60m'
                    ? 'bg-[#151922] border-[#3b475d] shadow-inner'
                    : 'bg-[#1a202c]/50 border-transparent hover:border-[#2b3548]'
                }`}
              >
                <div className="text-[11px] text-gray-400 font-medium">60 min change</div>
                <div className="text-sm font-bold text-[#2ebd85] mt-0.5">+0.63%</div>
              </button>

              <button
                onClick={() => setSelectedChangeTab('1d')}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  selectedChangeTab === '1d'
                    ? 'bg-[#151922] border-[#3b475d] shadow-inner'
                    : 'bg-[#1a202c]/50 border-transparent hover:border-[#2b3548]'
                }`}
              >
                <div className="text-[11px] text-gray-400 font-medium">1 day change</div>
                <div className="text-sm font-bold text-[#2ebd85] mt-0.5">+3.49%</div>
              </button>
            </div>

            {/* Diagonal hatching texture box as seen in Image 2 */}
            <div className="h-32 sm:h-36 rounded-lg bg-[#141822] border border-[#2b3548]/50 relative overflow-hidden flex items-center justify-center mb-3">
              <svg className="w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="diag-stripes" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="16" stroke="#94a3b8" strokeWidth="4" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#diag-stripes)" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Live Trend Analysis
                </span>
              </div>
            </div>

            {/* Performance Footer */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium px-1">
              <div>
                1 month change <span className="text-[#2ebd85] font-bold">+8.99%</span>
              </div>
              <div>
                1 year change <span className="text-[#2ebd85] font-bold">+13.45%</span>
              </div>
              <div>
                YTD change <span className="text-[#2ebd85] font-bold">+6.66%</span>
              </div>
            </div>
          </div>

          {/* Right Column: Trading Schedule */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-white mb-2 tracking-wide">
              Trading Schedule
            </h3>

            <div className="overflow-hidden border border-[#2b3548]/40 rounded-lg bg-[#161a24]/40">
              <div className="grid grid-cols-3 text-xs text-gray-400 font-semibold px-3 py-2 border-b border-[#2b3548]/50">
                <div>Date</div>
                <div>Weekday</div>
                <div className="text-right">Trading Time</div>
              </div>

              <div className="divide-y divide-[#2b3548]/30">
                {scheduleDays.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-3 text-xs px-3 py-1.5 hover:bg-white/[0.02] transition-colors">
                    <div className="text-gray-200 font-medium">{item.date}</div>
                    <div className="text-gray-300">{item.weekday}</div>
                    <div className="text-right text-gray-400 font-mono">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
