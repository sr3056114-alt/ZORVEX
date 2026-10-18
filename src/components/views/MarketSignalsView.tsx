import React from 'react';
import { Activity, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { MarketSignal } from '../../types';

interface MarketSignalsViewProps {
  onExecuteTrade: (signal: MarketSignal) => void;
  currency: string;
}

export const MarketSignalsView: React.FC<MarketSignalsViewProps> = ({
  onExecuteTrade,
}) => {
  const mockSignals: MarketSignal[] = [
    { id: '1', pair: 'EUR/USD (OTC)', direction: 'BUY', probability: 89, timeframe: '1m' },
    { id: '2', pair: 'BTC/USD', direction: 'BUY', probability: 92, timeframe: '1m' },
    { id: '3', pair: 'USD/JPY (OTC)', direction: 'SELL', probability: 85, timeframe: '5m' },
    { id: '4', pair: 'Gold (OTC)', direction: 'BUY', probability: 88, timeframe: '2m' },
    { id: '5', pair: 'GBP/USD (OTC)', direction: 'SELL', probability: 83, timeframe: '1m' },
    { id: '6', pair: 'Apple (OTC)', direction: 'BUY', probability: 91, timeframe: '1m' },
    { id: '7', pair: 'CAD/CHF (OTC)', direction: 'SELL', probability: 75, timeframe: '15m' },
    { id: '8', pair: 'Silver', direction: 'BUY', probability: 84, timeframe: '1m' },
    { id: '9', pair: 'USD/EGP (OTC)', direction: 'BUY', probability: 81, timeframe: '5m' },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto w-full text-[var(--text-primary)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-[var(--text-primary)]">
            <Zap className="text-[#f59e0b]" /> Market AI Signals
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
            Real-time algorithmic trading suggestions powered by predictive price momentum models.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
        {mockSignals.map(sig => {
          const isBuy = sig.direction === 'BUY';
          return (
            <div
              key={sig.id}
              className="bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-[var(--hover-bg-strong)] rounded-2xl p-5 flex flex-col gap-4 shadow-xl transition-all"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-base text-[var(--text-primary)]">{sig.pair}</span>
                <span className="text-[11px] font-mono bg-[var(--hover-bg)] px-2.5 py-0.5 rounded text-[var(--text-muted)] border border-[var(--border-color)]">
                  {sig.timeframe}
                </span>
              </div>

              <div className="flex justify-between items-center bg-[var(--hover-bg)] border border-[var(--border-color)]/50 rounded-xl p-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#8593a6] font-bold uppercase tracking-wider mb-1">
                    Direction
                  </span>
                  <span className={`font-black flex items-center gap-1.5 text-sm ${isBuy ? 'text-[#00c26f]' : 'text-[#ff4b55]'}`}>
                    {isBuy ? <TrendingUp size={16} strokeWidth={3} /> : <TrendingDown size={16} strokeWidth={3} />}
                    {sig.direction}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-[#8593a6] font-bold uppercase tracking-wider mb-1">
                    Probability
                  </span>
                  <span className="text-[var(--text-primary)] font-black text-sm">{sig.probability}%</span>
                </div>
              </div>

              <button
                onClick={() => onExecuteTrade(sig)}
                className={`w-full py-2.5 rounded-xl font-black text-xs text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                  isBuy
                    ? 'bg-[#00c26f] hover:bg-[#00c26f]/90 shadow-[#00c26f]/20'
                    : 'bg-[#ff4b55] hover:bg-[#ff4b55]/90 shadow-[#ff4b55]/20'
                }`}
              >
                <Activity size={14} />
                <span>Execute {sig.direction} Trade</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
