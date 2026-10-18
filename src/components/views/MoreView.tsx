import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { useBalance } from '../../../App';
import { useLanguage } from '../../context/LanguageContext';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const PIE_COLORS = ['#0ba259', '#3b82f6', '#e33f4a', '#f87171', '#f59e0b'];

export default function MoreView({ theme, isLight, onBack, onNavigate, tradeHistory = [] }: { theme?: any, isLight?: boolean, onBack?: () => void, onNavigate?: (tab: string) => void, tradeHistory?: any[] }) {
  const { balance } = useBalance();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('ANALYTICS');
  
  const tabs = [
    { id: 'DEPOSIT', label: t('deposit') },
    { id: 'WITHDRAWAL', label: t('withdrawal') },
    { id: 'WITHDRAWAL HISTORY', label: t('withdrawalHistory') },
    { id: 'DEPOSIT HISTORY', label: t('depositHistory') },
    { id: 'TRADE HISTORY', label: t('tradeHistory') },
    { id: 'MY ACCOUNT', label: t('myAccount') },
    { id: 'MARKET', label: t('market') },
    { id: 'TOURNAMENTS', label: t('tournaments') },
    { id: 'ANALYTICS', label: t('analytics') }
  ];
  
  const currentTheme = theme || {
    bg: isLight ? 'bg-white' : 'bg-[#12161f]',
    panelBg: isLight ? 'bg-[#f5f7f9]' : 'bg-[#1f2631]',
    text: isLight ? 'text-[#1f2631]' : 'text-white',
    textMuted: isLight ? 'text-[#8390a0]' : 'text-[#8390a0]',
    border: isLight ? 'border-gray-200' : 'border-[#3b4353]',
    hover: isLight ? 'hover:bg-gray-100' : 'hover:bg-[#2a303d]'
  };

  // Calculations
  const stats = useMemo(() => {
    if (!tradeHistory || tradeHistory.length === 0) {
      return {
        turnover: 3500.50,
        totalTrades: 142,
        netProfit: 450.25,
        winRate: 64.5,
        minTrade: 10,
        maxTrade: 500,
        maxProfit: 420.50,
        pieData: [
           { name: 'EUR/USD', value: 45 },
           { name: 'BTC/USD', value: 25 },
           { name: 'ETH/USD', value: 15 },
           { name: 'GBP/JPY', value: 10 },
           { name: 'GOLD', value: 5 }
        ],
        lineData: Array.from({length: 10}).map((_, i) => ({ name: `Day ${i+1}`, val: Math.floor(Math.random() * 500) - 100 }))
      };
    }

    const turnover = tradeHistory.reduce((acc, tr) => acc + (tr.amount || 0), 0);
    const totalTrades = tradeHistory.length;
    const netProfit = tradeHistory.reduce((acc, tr) => acc + (tr.pnl || 0), 0);
    const profitableTrades = tradeHistory.filter(tr => (tr.pnl || 0) > 0).length;
    const winRate = totalTrades > 0 ? Number(((profitableTrades / totalTrades) * 100).toFixed(1)) : 0;
    const minTrade = Math.min(...tradeHistory.map(tr => tr.amount || 0));
    const maxTrade = Math.max(...tradeHistory.map(tr => tr.amount || 0));
    const maxProfit = Math.max(...tradeHistory.map(tr => tr.pnl || 0));

    return { turnover, totalTrades, netProfit, winRate, minTrade, maxTrade, maxProfit, pieData: [
      { name: 'EUR/USD', value: 50 },
      { name: 'BTC/USD', value: 30 },
      { name: 'ETH/USD', value: 20 }
    ], lineData: Array.from({length: 10}).map((_, i) => ({ name: `Day ${i+1}`, val: 40 + i * 5 })) };
  }, [tradeHistory]);

  return (
    <div className={`absolute inset-0 z-40 flex flex-col ${currentTheme.bg}`}>
      {/* Header */}
      <div className={`h-16 flex items-center px-4 border-b ${currentTheme.border} shrink-0`}>
        <button onClick={onBack} className={`mr-4 ${currentTheme.textMuted} hover:${currentTheme.text} transition-colors cursor-pointer`}>
           <ArrowLeft size={20} />
        </button>
        <div className="flex gap-1 h-full overflow-x-auto custom-scrollbar items-end">
           {tabs.map(tab => (
             <div 
               key={tab.id} 
               onClick={() => {
                 if (tab.id === 'ANALYTICS') {
                   setActiveTab(tab.id);
                 } else if (onNavigate) {
                   onNavigate(tab.id);
                 }
               }}
               className={`px-4 py-3 cursor-pointer text-sm font-bold uppercase transition-colors whitespace-nowrap ${activeTab === tab.id ? currentTheme.text + ' border-b-2 border-[#1e88e5]' : currentTheme.textMuted + ' ' + currentTheme.hover}`}
             >
               {tab.label}
             </div>
           ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {/* Profile Card */}
        <div className={`${currentTheme.panelBg} rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6 mb-6 shadow-sm border ${currentTheme.border}`}>
           <div className="w-20 h-20 rounded-full bg-[#3b4353] flex items-center justify-center shrink-0">
              <User size={32} className="text-white" />
           </div>
           <div className="flex-1 flex flex-col items-center md:items-start">
             <div className="flex items-center gap-2 mb-1">
               <h2 className={`${currentTheme.text} text-xl font-bold`}>tradersandeep890@gmail.com</h2>
               <div className="bg-[#0ba259]/20 text-[#0ba259] text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#0ba259]"></div> VIP
               </div>
             </div>
             <div className={`${currentTheme.textMuted} text-sm mb-4`}>ID: 92472244</div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mt-2">
                <div className="flex flex-col">
                   <div className={`${currentTheme.text} text-sm font-bold`}>{t('turnover')}</div>
                   <div className="text-xl font-black text-[#1e88e5]">${stats.turnover.toFixed(2)}</div>
                </div>
                <div className="flex flex-col">
                   <div className={`${currentTheme.text} text-sm font-bold`}>{t('totalTradesCount')}</div>
                   <div className="text-xl font-black text-[#1e88e5]">{stats.totalTrades}</div>
                </div>
                <div className="flex flex-col">
                   <div className={`${currentTheme.text} text-sm font-bold`}>{t('netProfit')}</div>
                   <div className={`text-xl font-black ${stats.netProfit >= 0 ? 'text-[#0ba259]' : 'text-[#e33f4a]'}`}>
                     {stats.netProfit > 0 ? '+' : ''}${stats.netProfit.toFixed(2)}
                   </div>
                </div>
             </div>
           </div>
        </div>

        {/* Analytics Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${activeTab !== 'ANALYTICS' ? 'hidden' : ''}`}>
          {/* Left Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Stats Card */}
            <div className={`${currentTheme.panelBg} rounded-xl p-6 shadow-sm border ${currentTheme.border}`}>
              <h3 className={`${currentTheme.text} font-bold text-[15px] mb-6`}>{t('profitableTradesPercent')}</h3>
              
              <div className="flex justify-between items-end mb-6">
                <div className="flex flex-col">
                   <div className={`${currentTheme.text} font-bold mb-1`}>${stats.minTrade.toFixed(2)}</div>
                   <div className="flex gap-1 mb-2">
                     <div className="h-1 w-4 bg-[#3b4353]"></div><div className="h-1 w-4 bg-[#3b4353]"></div><div className="h-1 w-4 bg-[#3b4353]"></div><div className="h-1 w-4 bg-[#3b4353]"></div>
                   </div>
                   <span className={`${currentTheme.textMuted} text-xs`}>{t('minTradeAmount')}</span>
                </div>
                <div className="flex flex-col">
                   <div className={`${currentTheme.text} font-bold mb-1`}>${stats.maxTrade.toFixed(2)}</div>
                   <div className="flex gap-1 mb-2">
                     <div className="h-1 w-4 bg-[#3b4353]"></div><div className="h-1 w-4 bg-[#3b4353]"></div><div className="h-1 w-4 bg-[#3b4353]"></div><div className="h-1 w-4 bg-[#3b4353]"></div>
                   </div>
                   <span className={`${currentTheme.textMuted} text-xs`}>{t('maxTradeAmount')}</span>
                </div>
                <div className="flex flex-col">
                   <div className={`${currentTheme.text} font-bold mb-1`}>${stats.maxProfit.toFixed(2)}</div>
                   <div className="flex gap-1 mb-2">
                     <div className="h-1 w-4 bg-[#3b4353]"></div><div className="h-1 w-4 bg-[#3b4353]"></div><div className="h-1 w-4 bg-[#3b4353]"></div><div className="h-1 w-4 bg-[#3b4353]"></div>
                   </div>
                   <span className={`${currentTheme.textMuted} text-xs`}>{t('maxTradeProfit')}</span>
                </div>
              </div>

              {/* Range Indicator */}
              <div className={`w-24 bg-[var(--bg-panel)] rounded p-2 border ${currentTheme.border}`}>
                <div className="flex h-1.5 w-full mb-1">
                  <div className="w-1/3 bg-[#e33f4a] rounded-l"></div>
                  <div className="w-1/3 bg-[#f59e0b]"></div>
                  <div className="w-1/3 bg-[#0ba259] rounded-r"></div>
                </div>
                <div className={`flex justify-between text-[8px] ${currentTheme.textMuted}`}>
                  <span>-1K-0</span>
                  <span>0-1K</span>
                  <span>+1K</span>
                </div>
              </div>
            </div>

            {/* Pie Chart Card */}
            <div className={`${currentTheme.panelBg} rounded-xl p-6 flex-1 min-h-[300px] flex flex-col shadow-sm border ${currentTheme.border}`}>
              <h3 className={`${currentTheme.text} font-bold text-[15px] mb-4`}>{t('topAssetsProfit')}</h3>
              
              <div className="flex-1 flex items-center relative">
                 <div className="w-[180px] h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.pieData}
                          innerRadius={25}
                          outerRadius={90}
                          paddingAngle={0}
                          dataKey="value"
                          stroke="none"
                        >
                          {stats.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
                 
                 {/* Legend */}
                 <div className="ml-4 flex flex-col gap-3">
                   {stats.pieData.map((item, idx) => (
                     <div key={idx} className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{backgroundColor: PIE_COLORS[idx % PIE_COLORS.length]}}></div>
                       <span className={`${currentTheme.text} text-xs font-bold`}>{item.name} <span className={`${currentTheme.text} ml-1`}>{item.value}%</span></span>
                     </div>
                   ))}
                 </div>
              </div>

            </div>
          </div>

          {/* Right Column (Charts) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
             {/* Line Chart 1 */}
             <div className={`${currentTheme.panelBg} rounded-xl p-6 h-[280px] flex flex-col shadow-sm border ${currentTheme.border}`}>
                <h3 className={`${currentTheme.text} font-bold text-[15px] mb-4`}>{t('profitableTrades')}</h3>
                <div className="flex-1">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3b4353" />
                        <XAxis dataKey="name" stroke="#8390a0" tick={{fill: '#8390a0', fontSize: 10}} axisLine={{stroke: '#3b4353'}} tickLine={false} />
                        <YAxis stroke="#8390a0" tick={{fill: '#8390a0', fontSize: 10}} axisLine={false} tickLine={false} domain={[0, 100]} />
                        <Line type="monotone" dataKey="val" stroke="#0ba259" strokeWidth={2} dot={false} />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Line Chart 2 */}
             <div className={`${currentTheme.panelBg} rounded-xl p-6 h-[280px] flex flex-col shadow-sm border ${currentTheme.border}`}>
                <h3 className={`${currentTheme.text} font-bold text-[15px] mb-4`}>{t('profitableTradesPercent')}</h3>
                <div className="flex-1">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3b4353" />
                        <XAxis dataKey="name" stroke="#8390a0" tick={{fill: '#8390a0', fontSize: 10}} axisLine={{stroke: '#3b4353'}} tickLine={false} />
                        <YAxis stroke="#8390a0" tick={{fill: '#8390a0', fontSize: 10}} axisLine={false} tickLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                        <Line type="monotone" dataKey="val" stroke="#0ba259" strokeWidth={2} dot={false} />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
