import React from 'react';
import { Trophy, Calendar, Users, Award, CheckCircle } from 'lucide-react';

export const TournamentsView: React.FC<{ currency: string }> = ({ currency }) => {
  const tournaments = [
    { id: 1, title: 'Weekly Pro Championship', prize: 50000, fee: 'FREE', participants: 4890, endsIn: '2d 14h', active: true },
    { id: 2, title: 'Crypto Scalper Cup', prize: 25000, fee: `${currency}10`, participants: 1820, endsIn: '5h 32m', active: true },
    { id: 3, title: 'Weekend OTC Master', prize: 15000, fee: 'FREE', participants: 2310, endsIn: '3d 20h', active: false },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <Trophy className="text-[#f59e0b]" /> Live Trading Tournaments
        </h2>
        <p className="text-xs text-[#8593a6] mt-1">
          Compete against global traders and win real cash prizes directly credited to your Real Account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tournaments.map(t => (
          <div key={t.id} className="bg-[#1b212c] border border-[#27303f] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-base text-white">{t.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.active ? 'bg-[#00c26f]/20 text-[#00c26f]' : 'bg-gray-700 text-gray-300'}`}>
                  {t.active ? 'ACTIVE' : 'UPCOMING'}
                </span>
              </div>

              <div className="bg-[#141822] rounded-xl p-3 flex justify-between items-center mb-4">
                <div>
                  <span className="text-[10px] text-[#8593a6] font-bold block uppercase">Prize Pool</span>
                  <span className="text-lg font-black text-[#f59e0b] font-mono">
                    {currency}{t.prize.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#8593a6] font-bold block uppercase">Entry Fee</span>
                  <span className="text-sm font-bold text-white font-mono">{t.fee}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1"><Users size={14} /> {t.participants} Traders</span>
                <span className="flex items-center gap-1 font-mono text-[#38bdf8]"><Calendar size={14} /> {t.endsIn}</span>
              </div>
            </div>

            <button className="w-full py-2.5 bg-[#1e88e5] hover:bg-[#1976d2] font-black text-xs text-white rounded-xl transition-transform active:scale-95 shadow-md cursor-pointer">
              Join Tournament
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
