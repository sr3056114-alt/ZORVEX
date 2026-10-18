import React, { useEffect } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { ClosedTrade } from '../types';
import { TRADING_ASSETS } from '../constants';
import { AssetIcon } from './AssetIcons';

export type ClosedTradeData = ClosedTrade;

export interface ClosedTradePopupProps {
  trade: ClosedTrade;
  currency: string;
  onClose: () => void;
  isLight?: boolean;
}

export const QuotexTradeClosedPopup: React.FC<ClosedTradePopupProps> = ({
  trade,
  currency,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isWin = trade.pnl > 0;
  const isTie = trade.pnl === 0;

  const assetObj = TRADING_ASSETS.find(a => a.name === trade.asset || a.id === trade.asset) || TRADING_ASSETS[0];

  const payoutDisplay = isWin
    ? (trade.amount + trade.pnl).toFixed(2)
    : (trade.refundAmount ? trade.refundAmount.toFixed(2) : '0.00');

  return (
    <div className="pointer-events-auto select-none animate-in fade-in slide-in-from-left-2 duration-150">
      <div className="rounded-lg px-3.5 py-3 shadow-2xl border bg-[#1c222d] border-[#293242] text-white min-w-[210px] max-w-[240px]">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <AssetIcon asset={assetObj} />
            <span className="text-xs font-bold truncate text-white">
              {trade.asset}
            </span>
            <span className="text-[#788292] text-xs">·</span>
            <span className="text-[#788292] text-xs font-mono">
              {trade.durationSecs}s
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-[#788292] hover:text-white p-0.5 rounded transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X size={13} strokeWidth={2.2} />
          </button>
        </div>

        {/* Trade Direction Badge: BUY / SELL */}
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold">
          <span className={`px-1.5 py-0.5 rounded flex items-center gap-1 ${
            trade.direction === 'BUY' ? 'bg-[#00c26f]/20 text-[#00c26f]' : 'bg-[#ff4b55]/20 text-[#ff4b55]'
          }`}>
            {trade.direction === 'BUY' ? <TrendingUp size={11} strokeWidth={3} /> : <TrendingDown size={11} strokeWidth={3} />}
            {trade.direction}
          </span>
          <span className="text-white/60 font-mono">{trade.amount} {currency}</span>
        </div>

        {/* PnL Display */}
        <div className="mt-2 text-[18px] font-black font-mono tracking-tight leading-none">
          {isWin ? (
            <span className="text-[#00c26f]">{`+${payoutDisplay} ${currency}`}</span>
          ) : isTie ? (
            <span className="text-white">{`${payoutDisplay} ${currency}`}</span>
          ) : (
            <span className="text-[#ff4b55]">{`${payoutDisplay} ${currency}`}</span>
          )}
        </div>
      </div>
    </div>
  );
};
