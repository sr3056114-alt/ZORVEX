import React from 'react';
import { Trophy, Award, TrendingUp, User } from 'lucide-react';

export const LeaderboardView: React.FC<{ currency: string }> = ({ currency }) => {
  const leaders = [
    { rank: 1, name: 'Alexandre M.', country: 'BR', profit: 48920.50, winRate: 84 },
    { rank: 2, name: 'Rajesh K.', country: 'IN', profit: 39410.00, winRate: 81 },
    { rank: 3, name: 'Dmitry V.', country: 'KZ', profit: 34180.20, winRate: 79 },
    { rank: 4, name: 'Chen Wei', country: 'SG', profit: 28940.00, winRate: 76 },
    { rank: 5, name: 'You (Real Account)', country: 'IN', profit: 12780.60, winRate: 78, isUser: true },
    { rank: 6, name: 'Lucas S.', country: 'MX', profit: 11200.00, winRate: 73 },
    { rank: 7, name: 'Elena R.', country: 'TR', profit: 9840.40, winRate: 71 },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Trophy className="text-[#f59e0b]" /> Global Traders Leaderboard
          </h2>
          <p className="text-xs text-[#8593a6] mt-1">
            Top performers in the current 24-hour trading session.
          </p>
        </div>
      </div>

      <div className="bg-[#1b212c] border border-[#27303f] rounded-2xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 px-5 py-3 text-[11px] font-bold text-[#8593a6] uppercase tracking-wider border-b border-[#27303f] bg-[#161b24]">
          <span className="col-span-2">Rank</span>
          <span className="col-span-5">Trader</span>
          <span className="col-span-3 text-right">Profit</span>
          <span className="col-span-2 text-right">Win Rate</span>
        </div>

        <div className="divide-y divide-[#27303f]">
          {leaders.map(l => (
            <div
              key={l.rank}
              className={`grid grid-cols-12 items-center px-5 py-3.5 text-xs transition-colors ${
                l.isUser ? 'bg-[#1e88e5]/10 font-bold' : 'hover:bg-[#202735]'
              }`}
            >
              <div className="col-span-2 flex items-center gap-2">
                {l.rank === 1 && <span className="text-xl">🥇</span>}
                {l.rank === 2 && <span className="text-xl">🥈</span>}
                {l.rank === 3 && <span className="text-xl">🥉</span>}
                {l.rank > 3 && <span className="font-mono text-[#8593a6] pl-2 font-bold">{l.rank}</span>}
              </div>

              <div className="col-span-5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#283244] flex items-center justify-center text-xs text-gray-300 font-bold shrink-0">
                  <User size={14} />
                </div>
                <div className="flex flex-col">
                  <span className={`font-bold ${l.isUser ? 'text-[#38bdf8]' : 'text-white'}`}>{l.name}</span>
                  <span className="text-[10px] text-gray-400">{l.country}</span>
                </div>
              </div>

              <div className="col-span-3 text-right font-mono font-bold text-[#00c26f]">
                +{currency}{l.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>

              <div className="col-span-2 text-right font-mono font-bold text-white/90">
                {l.winRate}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
