import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import { QUOTEX_ASSETS } from '../../../pages/Trading';
import { useLanguage } from '../../context/LanguageContext';

type Signal = {
  id: string;
  asset: typeof QUOTEX_ASSETS[0];
  direction: 'UP' | 'DOWN';
  probability: number;
  timeframe: string;
  expiresIn: number;
};

export default function MarketView({ onExecuteTrade, onBack }: { onExecuteTrade: (signal: Signal) => void, onBack?: () => void }) {
  const { t } = useLanguage();
  const [signals, setSignals] = useState<Signal[]>([]);

  useEffect(() => {
    const generateSignals = () => {
      const newSignals: Signal[] = [];
      const shuffled = [...QUOTEX_ASSETS].sort(() => Math.random() - 0.5);
      for (let i = 0; i < 9; i++) {
        const randomAsset = shuffled[i % shuffled.length];
        newSignals.push({
          id: Math.random().toString(36).substring(7),
          asset: randomAsset,
          direction: Math.random() > 0.45 ? 'UP' : 'DOWN',
          probability: Math.floor(Math.random() * 20) + 75,
          timeframe: ['1m', '5m', '15m'][Math.floor(Math.random() * 3)],
          expiresIn: Math.floor(Math.random() * 120) + 30
        });
      }
      setSignals(newSignals);
    };

    generateSignals();
    const interval = setInterval(generateSignals, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 bg-[var(--bg-main)] overflow-y-auto absolute inset-0 z-40">
      <div className="p-4 sm:p-8 max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button 
                onClick={onBack} 
                className="p-2 bg-[var(--hover-bg)] hover:bg-[var(--hover-bg-strong)] text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 font-bold text-xs border border-[var(--border-color)] shadow-sm"
              >
                <ArrowLeft size={16} />
                <span>{t('trade') || 'Trade'}</span>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-black text-[var(--text-primary)] mb-1 flex items-center gap-2">
                <Zap className="text-[#f59e0b]" /> {t('marketSignals') || 'Market Signals'}
              </h1>
              <p className="text-[var(--text-muted)] text-xs sm:text-sm font-medium">
                {t('realTimeOpportunities') || 'Real-time high probability market signals'}
              </p>
            </div>
          </div>

          <div className="bg-[var(--hover-bg)] px-4 py-2 rounded-xl border border-[var(--border-color)] text-[#0ba259] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 bg-[#0ba259] rounded-full animate-pulse"></div>
            {t('active') || 'Active'}
          </div>
        </div>

        {/* Signals Grid: 9 signals in 3x3 layout matching the horizontal rows above */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
          {signals.map(signal => (
            <div key={signal.id} className="bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl p-5 hover:border-[#1e88e5]/60 transition-all flex flex-col gap-4 shadow-sm hover:shadow-md">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[var(--text-primary)] font-bold text-lg">{signal.asset.name}</span>
                  <span className="text-[var(--text-muted)] text-xs font-medium">{signal.asset.category} • {signal.timeframe}</span>
                </div>
                <div className="text-2xl">{signal.asset.flags}</div>
              </div>
              
              <div className="flex justify-between items-center bg-[var(--hover-bg)] border border-[var(--border-color)]/60 rounded-xl p-3">
                <div className="flex flex-col">
                  <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider mb-1">
                    {t('direction') || 'DIRECTION'}
                  </span>
                  {signal.direction === 'UP' ? (
                    <span className="text-[#0ba259] font-black flex items-center gap-1"><TrendingUp size={16} /> {t('up') || 'UP'}</span>
                  ) : (
                    <span className="text-[#e33f4a] font-black flex items-center gap-1"><TrendingDown size={16} /> {t('down') || 'DOWN'}</span>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider mb-1">
                    {t('probability') || 'PROBABILITY'}
                  </span>
                  <span className="text-[var(--text-primary)] font-black">{signal.probability}%</span>
                </div>
              </div>

              <button 
                onClick={() => onExecuteTrade(signal)}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95 ${signal.direction === 'UP' ? 'bg-[#0ba259] hover:bg-[#0ba259]/90 shadow-[#0ba259]/20' : 'bg-[#e33f4a] hover:bg-[#e33f4a]/90 shadow-[#e33f4a]/20'}`}
              >
                <Activity size={18} /> {t('executeTrade') || 'Execute Trade'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
