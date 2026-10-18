import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, ArrowRight, Check } from 'lucide-react';
import { CURRENCIES, CurrencyInfo, getCurrencyByCode } from '../data/currencies';
import { CurrencyFlag } from './CurrencyFlag';

interface ExchangeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrencyCodeOrSymbol: string;
  currentBalance: number;
  onConfirmExchange: (newCurrency: CurrencyInfo, conversionFactor: number) => void;
}

export const ExchangeFormModal: React.FC<ExchangeFormModalProps> = ({
  isOpen,
  onClose,
  currentCurrencyCodeOrSymbol,
  currentBalance,
  onConfirmExchange,
}) => {
  const fromCurrency = getCurrencyByCode(currentCurrencyCodeOrSymbol);
  
  // Default target: if currently GBP, default to USD; otherwise default to GBP (as seen in Image 3)
  const initialTarget = fromCurrency.code === 'GBP' ? getCurrencyByCode('USD') : getCurrencyByCode('GBP');
  const [toCurrency, setToCurrency] = useState<CurrencyInfo>(initialTarget);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Keep target currency sensible when fromCurrency changes
  useEffect(() => {
    if (toCurrency.code === fromCurrency.code) {
      const next = CURRENCIES.find(c => c.code !== fromCurrency.code);
      if (next) setToCurrency(next);
    }
  }, [fromCurrency.code]);

  if (!isOpen) return null;

  // Real exchange rate calculation
  // ratePerUSD is units per 1 USD
  // 1 toCurrency = (fromCurrency.ratePerUSD / toCurrency.ratePerUSD) fromCurrency
  const rateRatio = fromCurrency.ratePerUSD / toCurrency.ratePerUSD;
  const exchangeAmount = Math.max(0, currentBalance);
  
  // 3% exchange fee deduction as specified in Image 3
  const feeRate = 0.03;
  const conversionFactor = (toCurrency.ratePerUSD / fromCurrency.ratePerUSD) * (1 - feeRate);
  const grossReceived = exchangeAmount * (toCurrency.ratePerUSD / fromCurrency.ratePerUSD);
  const netReceived = grossReceived * (1 - feeRate);

  const handleProceed = () => {
    onConfirmExchange(toCurrency, conversionFactor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black/75 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#1f2631] border border-[#2d3748] rounded-xl shadow-2xl w-full max-w-[530px] text-white p-6 relative select-none animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-[19px] font-bold text-white tracking-wide">Exchange Form</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-md transition-colors hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Currency Selectors Grid */}
        <div className="grid grid-cols-2 gap-4 mt-2 mb-6">
          {/* My Currency (Source) */}
          <div className="relative border border-[#3b4758] rounded-lg px-3.5 py-2.5 bg-[#171c24]">
            <span className="absolute -top-2.5 left-3 bg-[#1f2631] px-1 text-[11px] text-[#8e9aa8] font-medium">
              My Currency:
            </span>
            <div className="flex items-center gap-2.5 pt-0.5">
              <CurrencyFlag code={fromCurrency.code} size={22} />
              <span className="font-bold text-[15px] text-white tracking-wider">
                {fromCurrency.code}
              </span>
            </div>
          </div>

          {/* New Currency (Target with dropdown) */}
          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="relative border border-[#3b4758] hover:border-[#4f5d73] rounded-lg px-3.5 py-2.5 bg-[#171c24] cursor-pointer transition-colors flex items-center justify-between"
            >
              <span className="absolute -top-2.5 left-3 bg-[#1f2631] px-1 text-[11px] text-[#8e9aa8] font-medium">
                New Currency:
              </span>
              <div className="flex items-center gap-2.5 pt-0.5">
                <CurrencyFlag code={toCurrency.code} size={22} />
                <span className="font-bold text-[15px] text-white tracking-wider">
                  {toCurrency.code}
                </span>
              </div>
              <div className="text-gray-400">
                {isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {/* Dropdown Menu (Images 4 - 8) */}
            {isDropdownOpen && (
              <div 
                className="absolute top-full left-0 right-0 mt-1 bg-[#1a212c] border border-[#344052] rounded-lg shadow-2xl max-h-[250px] overflow-y-auto z-50 py-1"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#4b5568 #1a212c' }}
              >
                {CURRENCIES.map((cur) => {
                  const isSelected = cur.code === toCurrency.code;
                  return (
                    <div
                      key={cur.code}
                      onClick={() => {
                        setToCurrency(cur);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer border-b border-white/[0.04] last:border-0 transition-colors ${
                        isSelected ? 'bg-[#283344]' : 'hover:bg-[#232b38]'
                      }`}
                    >
                      <CurrencyFlag code={cur.code} size={22} />
                      <span className="font-bold text-[14px] text-white tracking-wide">
                        {cur.code}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center Exchange Overview */}
        <div className="flex items-center justify-between py-5 px-1 my-2">
          {/* Left: You are exchanging */}
          <div className="flex flex-col items-center flex-1 text-center">
            <span className="text-[12px] text-[#8e9aa8] font-medium mb-1">You are exchanging:</span>
            <span className="text-[17px] font-bold text-white font-mono tracking-tight">
              {exchangeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              {fromCurrency.code}
            </span>
          </div>

          {/* Badges in Center: Circle badge -> Circle badge */}
          <div className="flex items-center gap-3 px-3 shrink-0">
            {/* From Badge */}
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-[15px] shadow-lg"
              style={{ backgroundColor: fromCurrency.badgeBg }}
            >
              {fromCurrency.badgeText}
            </div>

            {/* Arrow */}
            <ArrowRight size={22} className="text-gray-300 stroke-[2.2]" />

            {/* To Badge */}
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-[15px] shadow-lg"
              style={{ backgroundColor: toCurrency.badgeBg }}
            >
              {toCurrency.badgeText}
            </div>
          </div>

          {/* Right: You will receive */}
          <div className="flex flex-col items-center flex-1 text-center">
            <span className="text-[12px] text-[#8e9aa8] font-medium mb-1">You will receive:</span>
            <span className="text-[17px] font-bold text-white font-mono tracking-tight">
              {netReceived.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              {toCurrency.code}
            </span>
          </div>
        </div>

        {/* Fee and Rate Text */}
        <div className="text-center text-[12px] text-[#8e9aa8] font-medium mt-3 mb-6">
          Exchange Fee: 3%. {rateRatio.toFixed(2)} {fromCurrency.code} = 1 {toCurrency.code}
        </div>

        {/* Bottom Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleProceed}
            className="flex-1 bg-[#0ba259] hover:bg-[#098e4e] text-white font-bold py-3 px-4 rounded-md transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0ba259]/20 active:scale-[0.99]"
          >
            <Check size={18} strokeWidth={3} />
            <span className="tracking-wide">Yes, proceed</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#374151] hover:bg-[#434e61] text-white font-semibold py-3 px-4 rounded-md transition-all flex items-center justify-center active:scale-[0.99]"
          >
            <span className="tracking-wide">No, go back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
