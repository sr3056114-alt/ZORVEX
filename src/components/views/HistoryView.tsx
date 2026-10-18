import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Activity, ArrowDownLeft, ArrowUpRight, Zap, Target, TrendingUp, ShieldCheck } from 'lucide-react';
import { useBalance } from '../../../App';
import { useLanguage } from '../../context/LanguageContext';

export default function HistoryView({ type, theme, isLight, onBack }: { type: 'deposit' | 'withdrawal' | 'trades', theme: any, isLight: boolean, onBack?: () => void }) {
  const { currency, withdrawalRecords, pendingBets } = useBalance();
  const { t } = useLanguage();
  const [deposits, setDeposits] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    if (type === 'deposit') {
      const dHist = JSON.parse(localStorage.getItem('deposit_history') || '[]');
      setDeposits(dHist.sort((a: any, b: any) => b.timestamp - a.timestamp));
    } else if (type === 'trades') {
      const tHist = JSON.parse(localStorage.getItem('rajadhan_bet_history') || '[]');
      
      const pendingAsTrades = pendingBets.map(pb => ({
        game: pb.game,
        amount: pb.amount,
        result: 'pending',
        payout: 0,
        timestamp: pb.timestamp || Date.now()
      }));
      const combinedTrades = [...pendingAsTrades, ...tHist];
      setTrades(combinedTrades.sort((a: any, b: any) => b.timestamp - a.timestamp));
    }
  }, [type, pendingBets]);

  const renderStatus = (status: string) => {
    if (status === 'Completed' || status === 'win' || status === 'loss') {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.1)]">
          <CheckCircle size={12} /> {status === 'Completed' ? t('completed') : status}
        </div>
      );
    }
    if (status === 'Pending' || status === 'Processing' || status === 'pending') {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(234,179,8,0.1)] animate-pulse">
          <Clock size={12} /> {status === 'pending' ? t('inProgress') : t('pending')}
        </div>
      );
    }
    if (status === 'Rejected') {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.1)]">
          <XCircle size={12} /> {t('rejected')}
        </div>
      );
    }
    return <span className="text-gray-400 text-xs font-bold uppercase">{status}</span>;
  };

  const getHeaderIcon = () => {
    if (type === 'deposit') return <ArrowDownLeft size={24} className="text-[#0ba259]" />;
    if (type === 'withdrawal') return <ArrowUpRight size={24} className="text-[#e33f4a]" />;
    return <Activity size={24} className="text-[#1e88e5]" />;
  };

  const getHeaderTitle = () => {
    if (type === 'deposit') return t('depositLedger') || t('depositHistory');
    if (type === 'withdrawal') return t('withdrawalLedger') || t('withdrawalHistory');
    return t('tradeTerminal') || t('tradeHistory');
  };

  return (
    <div className="min-h-full p-4 md:p-8 bg-gradient-to-b from-[#11151c] to-[#0b0e14]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="relative mb-8 p-6 rounded-2xl bg-[#1a202c]/80 backdrop-blur-md border border-[#2b3342] shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500/5 to-transparent blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            {onBack && (
              <button onClick={onBack} className="p-2.5 bg-[#202736] hover:bg-[#2a3441] border border-[#3b4353] rounded-xl transition-all shadow-lg text-white">
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#11151c] border border-[#2b3342] shadow-inner">
                  {getHeaderIcon()}
                </div>
                <h2 className="text-2xl font-black text-white tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  {getHeaderTitle()}
                </h2>
              </div>
              <p className="text-xs text-[#8390a0] mt-1 tracking-widest uppercase font-semibold">{t('realtimeRecords')}</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#11151c] rounded-lg border border-[#2b3342]">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-[#8390a0] uppercase tracking-wider">{t('systemOnline')}</span>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-4 relative">
          
          {type === 'deposit' && deposits.length === 0 && (
            <div className="p-12 text-center border border-dashed border-[#2b3342] rounded-2xl text-[#8390a0] bg-[#1a202c]/30 backdrop-blur">
               <Zap size={40} className="mx-auto mb-4 opacity-20" />
               <p className="font-bold text-lg tracking-wide">{t('noHistoryRecords')}</p>
            </div>
          )}
          {type === 'withdrawal' && withdrawalRecords.length === 0 && (
            <div className="p-12 text-center border border-dashed border-[#2b3342] rounded-2xl text-[#8390a0] bg-[#1a202c]/30 backdrop-blur">
               <ShieldCheck size={40} className="mx-auto mb-4 opacity-20" />
               <p className="font-bold text-lg tracking-wide">{t('noHistoryRecords')}</p>
            </div>
          )}
          {type === 'trades' && trades.length === 0 && (
            <div className="p-12 text-center border border-dashed border-[#2b3342] rounded-2xl text-[#8390a0] bg-[#1a202c]/30 backdrop-blur">
               <Target size={40} className="mx-auto mb-4 opacity-20" />
               <p className="font-bold text-lg tracking-wide">{t('noHistoryRecords')}</p>
            </div>
          )}

          {type === 'deposit' && deposits.map((d, i) => (
            <div key={i} className="group p-5 bg-[#1a202c]/60 hover:bg-[#202736]/80 backdrop-blur border border-[#2b3342] hover:border-[#1e88e5]/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 shadow-lg relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0ba259] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#11151c] border border-[#2b3342] flex items-center justify-center shadow-inner group-hover:border-[#0ba259]/30 transition-colors">
                  <ArrowDownLeft size={20} className="text-[#0ba259]" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xl font-black text-white tracking-tight">{currency}{d.amount}</span>
                    <span className="text-xs font-bold text-[#1e88e5] uppercase px-2 py-0.5 rounded bg-[#1e88e5]/10">{d.method}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#8390a0] font-medium">
                    <span className="flex items-center gap-1"><Clock size={12}/> {new Date(d.timestamp).toLocaleString()}</span>
                    {d.utr && <span className="text-gray-400">UTR: <span className="text-gray-300 select-all">{d.utr}</span></span>}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">{renderStatus(d.status)}</div>
            </div>
          ))}

          {type === 'withdrawal' && withdrawalRecords.map((w, i) => (
            <div key={i} className="group p-5 bg-[#1a202c]/60 hover:bg-[#202736]/80 backdrop-blur border border-[#2b3342] hover:border-[#e33f4a]/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 shadow-lg relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#e33f4a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#11151c] border border-[#2b3342] flex items-center justify-center shadow-inner group-hover:border-[#e33f4a]/30 transition-colors">
                  <ArrowUpRight size={20} className="text-[#e33f4a]" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xl font-black text-white tracking-tight">{currency}{w.amount}</span>
                    <span className="text-xs font-bold text-[#e33f4a] uppercase px-2 py-0.5 rounded bg-[#e33f4a]/10">{w.method}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#8390a0] font-medium">
                    <span className="flex items-center gap-1"><Clock size={12}/> {w.date} {w.time}</span>
                    {w.method === 'BANK' && <span>A/C: <span className="text-gray-300">{w.details.accountNumber}</span></span>}
                    {w.method === 'UPI' && <span>UPI: <span className="text-gray-300">{w.details.upiId}</span></span>}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">{renderStatus(w.status)}</div>
            </div>
          ))}

          {type === 'trades' && trades.map((t, i) => {
            const isPending = t.result === 'pending';
            const isWin = t.result === 'win';
            const colorClass = isPending ? 'text-yellow-400' : (isWin ? 'text-green-400' : 'text-red-400');
            const bgClass = isPending ? 'from-yellow-500/20' : (isWin ? 'from-green-500/20' : 'from-red-500/20');
            const borderHover = isPending ? 'hover:border-yellow-500/50' : (isWin ? 'hover:border-green-500/50' : 'hover:border-red-500/50');
            
            return (
              <div key={i} className={`group p-5 bg-[#1a202c]/60 hover:bg-[#202736]/80 backdrop-blur border border-[#2b3342] ${borderHover} rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 shadow-lg relative overflow-hidden`}>
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${bgClass} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#11151c] border border-[#2b3342] flex items-center justify-center shadow-inner group-hover:bg-[#1a202c] transition-colors">
                    <TrendingUp size={20} className={isPending ? 'text-yellow-500' : (isWin ? 'text-green-500' : 'text-red-500')} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-wide mb-1 flex items-center gap-2">
                       {t.game}
                       {isPending && <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping"></span>}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[#8390a0] font-medium">
                      <span className="flex items-center gap-1"><Clock size={12}/> {new Date(t.timestamp).toLocaleString()}</span>
                      <span className="px-2 py-0.5 rounded bg-[#11151c] border border-[#2b3342]">Staked: {currency}{t.amount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className={`text-xl font-black ${colorClass} tracking-tight font-mono`}>
                    {isPending ? 'PROCESSING' : (isWin ? '+' : '-')}{currency}{isPending ? t.amount : (isWin ? t.payout : t.amount)}
                  </div>
                  {renderStatus(t.result)}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
