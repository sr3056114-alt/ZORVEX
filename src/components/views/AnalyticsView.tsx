import React from 'react';
import { BarChart3, TrendingUp, PieChart, ShieldCheck } from 'lucide-react';

export const AnalyticsView: React.FC<{ currency: string; balance: number }> = ({ currency, balance }) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <BarChart3 className="text-[#1e88e5]" /> Trading Analytics & Performance
        </h2>
        <p className="text-xs text-[#8593a6] mt-1">
          Detailed metrics and portfolio turnover analysis for your Real Account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1b212c] border border-[#27303f] p-4 rounded-2xl">
          <span className="text-xs text-[#8593a6] uppercase font-bold tracking-wider block mb-1">
            Turnover (Total Volume)
          </span>
          <div className="text-2xl font-black font-mono text-white">
            {currency}{(balance * 3.4).toFixed(2)}
          </div>
          <span className="text-[10px] text-[#00c26f] font-semibold mt-1 inline-block">
            +18.4% this week
          </span>
        </div>

        <div className="bg-[#1b212c] border border-[#27303f] p-4 rounded-2xl">
          <span className="text-xs text-[#8593a6] uppercase font-bold tracking-wider block mb-1">
            Net Profit
          </span>
          <div className="text-2xl font-black font-mono text-[#00c26f]">
            +{currency}{(balance * 0.42).toFixed(2)}
          </div>
          <span className="text-[10px] text-[#00c26f] font-semibold mt-1 inline-block">
            Profitable session
          </span>
        </div>

        <div className="bg-[#1b212c] border border-[#27303f] p-4 rounded-2xl">
          <span className="text-xs text-[#8593a6] uppercase font-bold tracking-wider block mb-1">
            Win Ratio
          </span>
          <div className="text-2xl font-black font-mono text-white">
            78.5%
          </div>
          <span className="text-[10px] text-gray-400 font-semibold mt-1 inline-block">
            Based on last 50 trades
          </span>
        </div>
      </div>

      <div className="bg-[#1b212c] border border-[#27303f] p-5 rounded-2xl">
        <h3 className="font-bold text-sm mb-4">Top Performing Instruments</h3>
        <div className="space-y-3">
          {[
            { name: 'EUR/USD (OTC)', win: 84, volume: `${currency}4,200` },
            { name: 'BTC/USD', win: 80, volume: `${currency}3,100` },
            { name: 'Gold (OTC)', win: 76, volume: `${currency}2,800` },
          ].map(item => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-[#141822] rounded-xl text-xs">
              <span className="font-bold text-white">{item.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 font-mono">Vol: {item.volume}</span>
                <span className="text-[#00c26f] font-bold font-mono">{item.win}% Win</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
