import React, { useState } from 'react';
import { Trophy, Clock, Target, Calendar, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useBalance } from '../../../App';
import { useToast } from '../../components/Toast';
import { db } from '../../../src/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../../context/LanguageContext';

export default function TournamentView({ onBack, isLight }: { onBack?: () => void; isLight?: boolean }) {
  const { currency } = useBalance();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DETAIL'>('OVERVIEW');
  const [tournaments, setTournaments] = useState<any[]>([]);

  React.useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tournaments'), (snap) => {
      setTournaments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn('TournamentView snapshot err:', err));
    return () => unsub();
  }, []);

  const featured = tournaments.find(t => t.status === 'ACTIVE') || tournaments[0];
  const upcoming = tournaments.filter(t => t.status === 'UPCOMING');

  return (
    <div className={`flex-1 ${isLight ? 'bg-[#f4f6f9]' : 'bg-[#12161e]'} overflow-hidden flex flex-col absolute inset-0 z-40`}>
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col custom-scrollbar pb-10">
        
        {/* Top Banner Header */}
        <div className="w-full relative rounded-xl overflow-hidden mb-6 h-[220px] lg:h-[280px] bg-gradient-to-r from-[#031533] to-[#01081a] shadow-lg flex items-center shrink-0">
           {/* Decorative Background Elements */}
           <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(30,136,229,0.4) 0%, transparent 40%), radial-gradient(circle at 85% 50%, rgba(245,158,11,0.2) 0%, transparent 40%)'
           }}></div>
           <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#020b1e] to-transparent z-10 pointer-events-none"></div>

           {onBack && (
              <button onClick={onBack} className="absolute top-4 left-4 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur transition-colors cursor-pointer">
                 <ArrowLeft size={16} />
              </button>
           )}

           {/* Content */}
           <div className="relative z-20 flex w-full items-center justify-between px-8 lg:px-16 h-full">
              <div className="flex flex-col z-20">
                 <div className="flex items-center gap-2 mb-2">
                    <Trophy size={20} className="text-[#f59e0b]" />
                    <span className="text-[#f59e0b] font-bold text-sm tracking-widest uppercase">
                       {t('liveTrading')}
                    </span>
                 </div>
                 <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight drop-shadow-md mb-2 uppercase">
                   {t('tournaments')}
                 </h1>
                 <p className="text-[#8390a0] text-sm lg:text-base font-bold mb-6">
                   {t('tradeSkillsWin')}
                 </p>
                 
                 <div className="flex items-center gap-6 text-xs lg:text-sm text-white font-bold">
                    <div className="flex items-center gap-2">
                       <Target size={16} className="text-[#f59e0b]"/> {t('realMarketTrades')}
                    </div>
                    <div className="flex items-center gap-2">
                       <Calendar size={16} className="text-[#f59e0b]"/> {t('dailyWeeklyEvents')}
                    </div>
                    <div className="flex items-center gap-2">
                       <Trophy size={16} className="text-[#f59e0b]"/> {t('leaderboard')}
                    </div>
                 </div>
              </div>
              <div className="hidden lg:block relative z-20 h-[90%] w-[400px]">
                 <div className="w-full h-full relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#f59e0b]/20 rounded-full blur-[80px]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Trophy size={160} className="text-[#f59e0b] drop-shadow-[0_10px_25px_rgba(245,158,11,0.5)]" strokeWidth={1} />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Main Left Column */}
           <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Featured Tournament Card */}
              <div className="bg-[#1f2631] border border-[#3b4353] rounded-xl overflow-hidden shadow-lg relative">
                 <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                       <div>
                          <div className="flex items-center gap-2 text-[#f59e0b] text-xs font-black uppercase tracking-wider mb-2">
                             <span>🔥 {t('featuredTournament')}</span>
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-2">{featured?.title || 'Weekly Trading Championship'}</h2>
                          <p className="text-[#8390a0] text-sm max-w-md leading-relaxed">
                             {featured ? featured.desc : 'Trade XAUUSD, EURUSD, GBPUSD and win big! Prove your skills and take your place on the leaderboard.'}
                          </p>
                       </div>
                       
                       <div className="bg-[#12161e] border border-[#2b313f] rounded-lg p-3 flex flex-col items-center min-w-[140px] shrink-0">
                          <span className="text-[#8390a0] text-xs font-bold mb-2">{t('endsIn')}</span>
                          <div className="flex gap-2 text-white font-black">
                             <div className="flex flex-col items-center"><span className="text-xl">04</span><span className="text-[9px] text-[#8390a0]">{t('daysShort')}</span></div><span className="opacity-50 text-xl">:</span>
                             <div className="flex flex-col items-center"><span className="text-xl">12</span><span className="text-[9px] text-[#8390a0]">{t('hoursShort')}</span></div><span className="opacity-50 text-xl">:</span>
                             <div className="flex flex-col items-center"><span className="text-xl">36</span><span className="text-[9px] text-[#8390a0]">{t('minutesShort')}</span></div><span className="opacity-50 text-xl">:</span>
                             <div className="flex flex-col items-center"><span className="text-xl">22</span><span className="text-[9px] text-[#8390a0]">{t('secondsShort')}</span></div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#12161e] border border-[#2b313f] rounded-xl p-4 mb-6">
                       <div className="flex flex-col gap-1">
                          <span className="text-[#8390a0] text-xs font-bold">{t('prizePool')}</span>
                          <span className="text-[#f59e0b] text-2xl font-black">{currency}{featured?.pool || "10,000"}</span>
                       </div>
                       <div className="flex flex-col justify-center border-l border-[#2b313f] pl-4">
                          <span className="text-[#8390a0] text-xs font-bold mb-1">{t('entryFee')}</span>
                          <span className="text-white font-bold">{featured ? (featured.fee === 0 ? t('freeEntry') : currency + featured.fee) : t('freeEntry')}</span>
                       </div>
                       <div className="flex flex-col justify-center border-l border-[#2b313f] pl-4">
                          <span className="text-[#8390a0] text-xs font-bold mb-1">{t('minTrades')}</span>
                          <span className="text-white font-bold">{featured?.minTrades || 20}</span>
                       </div>
                       <div className="flex flex-col justify-center border-l border-[#2b313f] pl-4">
                          <span className="text-[#8390a0] text-xs font-bold mb-1">{t('markets')}</span>
                          <span className="text-white font-bold text-xs">{featured?.markets || "Forex | Gold"}</span>
                       </div>
                    </div>
                    
                    <button onClick={() => showToast(t('registeredSuccess'), "success")} className="w-full bg-[#1e88e5] hover:bg-[#1e88e5]/90 text-white font-bold py-3.5 rounded-lg flex justify-center items-center gap-2 transition-colors shadow-lg shadow-[#1e88e5]/20 cursor-pointer">
                       {t('joinTournament')} <ArrowRight size={16} />
                    </button>
                 </div>
              </div>
              
              {/* Live Leaderboard */}
              <div className="bg-[#1f2631] border border-[#3b4353] rounded-xl overflow-hidden shadow-lg">
                 <div className="flex justify-between items-center p-5 border-b border-[#3b4353]">
                    <div className="flex items-center gap-2 text-white font-bold">
                       <Trophy size={18} className="text-[#f59e0b]" /> {t('liveLeaderboard')}
                    </div>
                    <button className="text-[#1e88e5] text-xs font-bold hover:underline cursor-pointer">{t('viewAll')}</button>
                 </div>
                 <div className="p-0">
                    <table className="w-full text-left text-sm">
                       <thead className="text-[#8390a0] text-xs font-bold border-b border-[#2b313f]">
                          <tr>
                             <th className="py-3 px-5 font-normal">#</th>
                             <th className="py-3 px-5 font-normal">{t('trader')}</th>
                             <th className="py-3 px-5 font-normal text-right">{t('totalProfit')}</th>
                             <th className="py-3 px-5 font-normal text-right">{t('trades')}</th>
                             <th className="py-3 px-5 font-normal text-right">{t('winRate')}</th>
                          </tr>
                       </thead>
                       <tbody className="text-white font-medium divide-y divide-[#2b313f]">
                          {[
                             { rank: 1, name: 'ProTrader007', profit: '3,245.00', trades: 48, winRate: '83%' },
                             { rank: 2, name: 'KingGold', profit: '2,890.00', trades: 62, winRate: '77%' },
                             { rank: 3, name: 'TradeMaster', profit: '2,560.00', trades: 55, winRate: '72%' },
                             { rank: 4, name: 'RiskTaker', profit: '2,340.00', trades: 41, winRate: '68%' },
                             { rank: 5, name: 'AlphaTrader', profit: '2,120.00', trades: 37, winRate: '65%' },
                          ].map((tRank, i) => (
                             <tr key={i} className="hover:bg-[#2b313f]/50 transition-colors">
                                <td className="py-3 px-5">
                                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${tRank.rank === 1 ? 'bg-[#f59e0b] text-black' : tRank.rank === 2 ? 'bg-[#94a3b8] text-black' : tRank.rank === 3 ? 'bg-[#b45309] text-white' : 'bg-[#2b313f] text-[#8390a0]'}`}>
                                      {tRank.rank}
                                   </div>
                                </td>
                                <td className="py-3 px-5 flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-[#2b313f] flex items-center justify-center overflow-hidden border border-[#3b4353]">
                                      <User size={14} className="text-[#8390a0]" />
                                   </div>
                                   {tRank.name}
                                </td>
                                <td className="py-3 px-5 text-right text-[#0ba259]">{currency}{tRank.profit}</td>
                                <td className="py-3 px-5 text-right text-[#8390a0]">{tRank.trades}</td>
                                <td className="py-3 px-5 text-right">{tRank.winRate}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
              
              {/* Upcoming Tournaments List */}
              <div className="bg-[#1f2631] border border-[#3b4353] rounded-xl overflow-hidden shadow-lg mb-6">
                 <div className="flex justify-between items-center p-5 border-b border-[#3b4353]">
                    <div className="flex items-center gap-2 text-white font-bold">
                       <Calendar size={18} className="text-[#1e88e5]" /> {t('upcomingTournaments')}
                    </div>
                    <button className="text-[#1e88e5] text-xs font-bold hover:underline cursor-pointer">{t('viewAll')}</button>
                 </div>
                 <div className="p-0">
                    <table className="w-full text-left text-sm">
                       <thead className="text-[#8390a0] text-xs font-bold border-b border-[#2b313f]">
                          <tr>
                             <th className="py-3 px-5 font-normal">{t('featuredTournament')}</th>
                             <th className="py-3 px-5 font-normal">{t('prizePool')}</th>
                             <th className="py-3 px-5 font-normal">{t('entryFee')}</th>
                             <th className="py-3 px-5 font-normal">{t('time')}</th>
                             <th className="py-3 px-5 font-normal text-right">{t('pendingOrder')}</th>
                          </tr>
                       </thead>
                       <tbody className="text-white font-medium divide-y divide-[#2b313f]">
                          {upcoming.map((uTour, i) => (
                             <tr key={i} className="hover:bg-[#2b313f]/50 transition-colors">
                                <td className="py-3 px-5">
                                   <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded bg-[#12161e] border border-[#2b313f] flex items-center justify-center text-lg`}>
                                         {uTour.icon}
                                      </div>
                                      <div className="flex flex-col">
                                         <span className="font-bold">{uTour.title}</span>
                                         <span className="text-[10px] text-[#8390a0]">{uTour.desc}</span>
                                      </div>
                                   </div>
                                </td>
                                <td className="py-3 px-5 text-[#0ba259]">{currency}{uTour.pool}</td>
                                <td className="py-3 px-5 text-[#8390a0]">{uTour.fee === 0 ? t('freeEntry') : currency + uTour.fee}</td>
                                <td className="py-3 px-5 text-xs text-[#8390a0]">{new Date(uTour.start).toLocaleDateString() + ' ' + new Date(uTour.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                <td className="py-3 px-5 text-right">
                                   <button onClick={() => showToast(t('registeredSuccess'), "success")} className="px-3 py-1.5 border border-[#1e88e5]/30 bg-[#1e88e5]/10 text-[#1e88e5] text-[10px] font-bold uppercase rounded flex items-center gap-1 hover:bg-[#1e88e5]/20 ml-auto transition-colors cursor-pointer">
                                      {t('registerNow')} <ArrowRight size={10} />
                                   </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
           
           {/* Right Sidebar */}
           <div className="flex flex-col gap-6">
              
              {/* Your Stats */}
              <div className="bg-[#1f2631] border border-[#3b4353] rounded-xl overflow-hidden shadow-lg">
                 <div className="p-4 border-b border-[#3b4353] flex items-center gap-2 text-white font-bold">
                    <Trophy size={16} className="text-[#f59e0b]" /> {t('overview')}
                 </div>
                 <div className="p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-[#2b313f] pb-3">
                       <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-full bg-[#2b313f] flex items-center justify-center text-[#1e88e5]">
                             <Trophy size={14} />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[#8390a0] text-[10px] font-bold">#</span>
                             <span className="text-white font-bold">#24</span>
                          </div>
                       </div>
                       <span className="text-[#0ba259] text-xs font-bold flex items-center gap-0.5"><ArrowRight size={12} className="-rotate-45" /> 12</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b border-[#2b313f] pb-3">
                       <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-full bg-[#2b313f] flex items-center justify-center text-[#0ba259]">
                             <span className="font-black text-sm">$</span>
                          </div>
                          <span className="text-[#8390a0] text-xs font-bold">{t('totalProfit')}</span>
                       </div>
                       <span className="text-white font-bold">{currency}0.00</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b border-[#2b313f] pb-3">
                       <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-full bg-[#2b313f] flex items-center justify-center text-[#f59e0b]">
                             <Calendar size={14} />
                          </div>
                          <span className="text-[#8390a0] text-xs font-bold">{t('tournaments')}</span>
                       </div>
                       <span className="text-white font-bold">3</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-full bg-[#2b313f] flex items-center justify-center text-[#1e88e5]">
                             <Target size={14} />
                          </div>
                          <span className="text-[#8390a0] text-xs font-bold">{t('winRate')}</span>
                       </div>
                       <span className="text-white font-bold">66.7%</span>
                    </div>
                 </div>
              </div>
              
              {/* Prize Structure */}
              <div className="bg-[#1f2631] border border-[#3b4353] rounded-xl overflow-hidden shadow-lg">
                 <div className="p-4 border-b border-[#3b4353] flex items-center gap-2 text-white font-bold">
                    <Trophy size={16} className="text-[#f59e0b]" /> {t('prizePool')}
                 </div>
                 <div className="p-2">
                    {([
                       { place: '1', prize: featured?.prizes?.[0] || 4000, icon: 'bg-[#f59e0b] text-black' },
                       { place: '2', prize: featured?.prizes?.[1] || 2500, icon: 'bg-[#94a3b8] text-black' },
                       { place: '3', prize: featured?.prizes?.[2] || 1500, icon: 'bg-[#b45309] text-white' },
                       { place: '4', prize: featured?.prizes?.[3] || 1000, icon: 'bg-[#1e88e5] text-white' },
                       { place: '5', prize: featured?.prizes?.[4] || 500, icon: 'bg-[#8b5cf6] text-white' },
                    ]).map((p, i) => (
                       <div key={i} className="flex items-center justify-between p-3 hover:bg-[#2b313f] rounded transition-colors">
                          <div className="flex items-center gap-3">
                             <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${p.icon}`}>
                                {i + 1}
                             </div>
                             <span className="text-[#8390a0] text-xs font-medium">#{p.place}</span>
                          </div>
                          <span className="text-white font-bold text-sm">{currency}{typeof p.prize === "number" ? p.prize.toLocaleString() : p.prize}</span>
                       </div>
                    ))}
                 </div>
              </div>
              
              {/* Promo Graphic */}
              <div className="w-full relative rounded-xl overflow-hidden h-[160px] bg-gradient-to-r from-[#051024] to-[#0a1936] shadow-lg flex items-center shrink-0 border border-[#1e88e5]/30 group cursor-pointer">
                 <div className="absolute right-0 bottom-0 opacity-50 z-0">
                    <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#1e88e5" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="translate-x-4 translate-y-4">
                       <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                       <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                 </div>
                 <div className="relative z-10 p-6 flex flex-col h-full justify-center">
                    <h3 className="text-white font-black text-xl leading-tight drop-shadow-md mb-1">
                       {t('tradeSkillsWin')}
                    </h3>
                    <div className="mt-3">
                       <button onClick={() => showToast(t('registeredSuccess'), "success")} className="bg-[#1e88e5] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg group-hover:bg-[#1e88e5]/90 transition-colors flex items-center gap-1 cursor-pointer">
                          {t('joinTournament')} <ArrowRight size={12}/>
                       </button>
                    </div>
                 </div>
              </div>
              
           </div>
        </div>
      </div>
    </div>
  );
}
