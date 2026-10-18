import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './src/context/LanguageContext';
import { ToastProvider } from './src/components/Toast';

import Landing from './pages/Landing';
import Trading from './pages/Trading';
import Auth from './pages/Auth';
import About from './pages/About';
import Faq from './pages/Faq';
import Blog from './pages/Blog';
import AdminPanel from './pages/AdminPanel';

// Audio Context
interface AudioContextType {
  playBgMusic: () => void;
  stopBgMusic: () => void;
  playSfx: (sound: string) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
}

const AudioContext = createContext<AudioContextType>({
  playBgMusic: () => {},
  stopBgMusic: () => {},
  playSfx: () => {},
  isMuted: false,
  setIsMuted: () => {},
});

export const useAudio = () => useContext(AudioContext);

// Balance Context
export interface UserProfile {
  nickname?: string;
  email?: string;
  country?: string;
  uid?: string;
  avatar?: string;
}

interface BalanceContextType {
  accountType: 'REAL' | 'DEMO' | 'LIVE';
  setAccountType: (type: 'REAL' | 'DEMO' | 'LIVE') => void;
  demoBalance: number;
  setDemoBalance: (val: number | ((prev: number) => number)) => void;
  liveBalance: number;
  setLiveBalance: (val: number | ((prev: number) => number)) => void;
  balance: number;
  setBalance: (val: number | ((prev: number) => number)) => void;
  dailyBet: number;
  weeklyBet: number;
  rebateBalance: number;
  dailyDeposit: number;
  setDailyDeposit: (val: number | ((prev: number) => number)) => void;
  showDocumentVerification: boolean;
  setShowDocumentVerification: (val: boolean) => void;
  currency: string;
  setCurrency: (val: string) => void;
  convertCurrency: (val: number) => number;
  usdRate: number;
  setUsdRate: (val: number) => void;
  highestMultiplier: number;
  claimedJackpots: string[];
  attendanceStats: any;
  setAttendanceStats: (val: any) => void;
  userProfile: UserProfile;
  setUserProfile: (val: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  bankAccount: any;
  setBankAccount: (val: any) => void;
  upiAccount: any;
  setUpiAccount: (val: any) => void;
  usdtAccount: any;
  setUsdtAccount: (val: any) => void;
  withdrawalRecords: any[];
  addWithdrawalRecord: (record: any) => void;
  totalBonus: number;
  todayBonus: number;
  firstDepositAmount: number;
  setFirstDepositAmount: (val: number) => void;
  claimedFirstDepositTiers: any[];
  setClaimedFirstDepositTiers: (val: any) => void;
  vipCycleStartDate: string;
  inviteSpinsAvailable: number;
  setInviteSpinsAvailable: (val: number | ((prev: number) => number)) => void;
  spins: number;
  setSpins: (val: number | ((prev: number) => number)) => void;
  invitedFriends: number;
  setInvitedFriends: (val: number | ((prev: number) => number)) => void;
  depositSpinsAvailable: number;
  setDepositSpinsAvailable: (val: number | ((prev: number) => number)) => void;
  wagerRequirement: number;
  setWagerRequirement: (val: number | ((prev: number) => number)) => void;
  addBonus: (val: number) => void;
  addBetAmount: (val: number) => void;
  updateMaxMultiplier: (val: number) => void;
  claimJackpot: (id: string, reward: number) => void;
  claimRebate: () => void;
  resetWeeklyProgress: () => void;
  resetDailyProgress: () => void;
  simulateFriendDeposit: () => void;
  registerPendingBet: (bet: any) => void;
  pendingBets: any[];
  floatingPnl: number;
  setFloatingPnl: (val: number | ((prev: number) => number)) => void;
  usableBalance: number;
  showInsufficientBalance: () => void;
}

export const BalanceContext = createContext<BalanceContextType | null>(null);

export const useBalance = () => {
  const ctx = useContext(BalanceContext);
  if (!ctx) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return ctx;
};

export function App() {
  const [accountType, setAccountTypeState] = useState<'REAL' | 'DEMO' | 'LIVE'>(() => {
    return (localStorage.getItem('rajadhan_account_type') as any) || 'REAL';
  });

  const [demoBalance, setDemoBalance] = useState<number>(() => {
    const saved = localStorage.getItem('rajadhan_demo_balance');
    return saved ? parseFloat(saved) : 10000;
  });

  const [liveBalance, setLiveBalance] = useState<number>(() => {
    const saved = localStorage.getItem('rajadhan_balance');
    return saved ? parseFloat(saved) : 10000;
  });

  const setAccountType = useCallback((type: 'REAL' | 'DEMO' | 'LIVE') => {
    setAccountTypeState(type);
    localStorage.setItem('rajadhan_account_type', type);
  }, []);

  const balance = accountType === 'DEMO' ? demoBalance : liveBalance;
  const setBalance = useCallback((val: number | ((prev: number) => number)) => {
    if (accountType === 'DEMO') {
      setDemoBalance(val);
    } else {
      setLiveBalance(val);
    }
  }, [accountType]);

  const [currency, setCurrency] = useState<string>(() => localStorage.getItem('rajadhan_currency') || '$');
  const [usdRate, setUsdRate] = useState<number>(1);
  const [dailyBet, setDailyBet] = useState<number>(0);
  const [weeklyBet, setWeeklyBet] = useState<number>(0);
  const [rebateBalance, setRebateBalance] = useState<number>(0);
  const [dailyDeposit, setDailyDeposit] = useState<number>(0);
  const [showDocumentVerification, setShowDocumentVerification] = useState<boolean>(false);
  const [highestMultiplier, setHighestMultiplier] = useState<number>(0);
  const [claimedJackpots, setClaimedJackpots] = useState<string[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<any>({});
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('rajadhan_user_profile');
      return saved ? JSON.parse(saved) : { nickname: 'Trader', email: 'user@zorvex.com' };
    } catch {
      return { nickname: 'Trader', email: 'user@zorvex.com' };
    }
  });

  const [bankAccount, setBankAccount] = useState<any>(null);
  const [upiAccount, setUpiAccount] = useState<any>(null);
  const [usdtAccount, setUsdtAccount] = useState<any>(null);
  const [withdrawalRecords, setWithdrawalRecords] = useState<any[]>([]);
  const [totalBonus, setTotalBonus] = useState<number>(0);
  const [todayBonus, setTodayBonus] = useState<number>(0);
  const [firstDepositAmount, setFirstDepositAmount] = useState<number>(0);
  const [claimedFirstDepositTiers, setClaimedFirstDepositTiers] = useState<any[]>([]);
  const [vipCycleStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [inviteSpinsAvailable, setInviteSpinsAvailable] = useState<number>(0);
  const [invitedFriends, setInvitedFriends] = useState<number>(0);
  const [depositSpinsAvailable, setDepositSpinsAvailable] = useState<number>(0);
  const [wagerRequirement, setWagerRequirement] = useState<number>(0);
  const [pendingBets, setPendingBets] = useState<any[]>([]);
  const [floatingPnl, setFloatingPnl] = useState<number>(0);
  const [insufficientModalOpen, setInsufficientModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Sync balances to localStorage
  useEffect(() => {
    localStorage.setItem('rajadhan_balance', liveBalance.toString());
  }, [liveBalance]);

  useEffect(() => {
    localStorage.setItem('rajadhan_demo_balance', demoBalance.toString());
  }, [demoBalance]);

  useEffect(() => {
    localStorage.setItem('rajadhan_currency', currency);
  }, [currency]);

  const convertCurrency = useCallback((amount: number) => {
    return amount * usdRate;
  }, [usdRate]);

  const addWithdrawalRecord = useCallback((record: any) => {
    setWithdrawalRecords(prev => [record, ...prev]);
  }, []);

  const addBonus = useCallback((bonus: number) => {
    setLiveBalance(prev => prev + bonus);
    setTotalBonus(prev => prev + bonus);
    setTodayBonus(prev => prev + bonus);
  }, []);

  const addBetAmount = useCallback((bet: number) => {
    setDailyBet(prev => prev + bet);
    setWeeklyBet(prev => prev + bet);
  }, []);

  const updateMaxMultiplier = useCallback((mult: number) => {
    setHighestMultiplier(prev => Math.max(prev, mult));
  }, []);

  const claimJackpot = useCallback((id: string, reward: number) => {
    setClaimedJackpots(prev => [...prev, id]);
    addBonus(reward);
  }, [addBonus]);

  const claimRebate = useCallback(() => {
    addBonus(rebateBalance);
    setRebateBalance(0);
  }, [addBonus, rebateBalance]);

  const resetWeeklyProgress = useCallback(() => setWeeklyBet(0), []);
  const resetDailyProgress = useCallback(() => setDailyBet(0), []);
  const simulateFriendDeposit = useCallback(() => {
    setInvitedFriends(prev => prev + 1);
    setInviteSpinsAvailable(prev => prev + 1);
  }, []);

  const registerPendingBet = useCallback((bet: any) => {
    setPendingBets(prev => [...prev, bet]);
  }, []);

  const showInsufficientBalance = useCallback(() => {
    setInsufficientModalOpen(true);
  }, []);

  const balanceValue = useMemo<BalanceContextType>(() => ({
    accountType,
    setAccountType,
    demoBalance,
    setDemoBalance,
    liveBalance,
    setLiveBalance,
    balance,
    setBalance,
    dailyBet,
    weeklyBet,
    rebateBalance,
    dailyDeposit,
    setDailyDeposit,
    showDocumentVerification,
    setShowDocumentVerification,
    currency,
    setCurrency,
    convertCurrency,
    usdRate,
    setUsdRate,
    highestMultiplier,
    claimedJackpots,
    attendanceStats,
    setAttendanceStats,
    userProfile,
    setUserProfile,
    bankAccount,
    setBankAccount,
    upiAccount,
    setUpiAccount,
    usdtAccount,
    setUsdtAccount,
    withdrawalRecords,
    addWithdrawalRecord,
    totalBonus,
    todayBonus,
    firstDepositAmount,
    setFirstDepositAmount,
    claimedFirstDepositTiers,
    setClaimedFirstDepositTiers,
    vipCycleStartDate,
    inviteSpinsAvailable,
    setInviteSpinsAvailable,
    spins: inviteSpinsAvailable,
    setSpins: setInviteSpinsAvailable,
    invitedFriends,
    setInvitedFriends,
    depositSpinsAvailable,
    setDepositSpinsAvailable,
    wagerRequirement,
    setWagerRequirement,
    addBonus,
    addBetAmount,
    updateMaxMultiplier,
    claimJackpot,
    claimRebate,
    resetWeeklyProgress,
    resetDailyProgress,
    simulateFriendDeposit,
    registerPendingBet,
    pendingBets,
    floatingPnl,
    setFloatingPnl,
    usableBalance: balance + floatingPnl,
    showInsufficientBalance,
  }), [
    accountType, setAccountType, demoBalance, liveBalance, balance, setBalance,
    dailyBet, weeklyBet, rebateBalance, dailyDeposit, showDocumentVerification,
    currency, convertCurrency, usdRate, highestMultiplier, claimedJackpots,
    attendanceStats, userProfile, bankAccount, upiAccount, usdtAccount,
    withdrawalRecords, addWithdrawalRecord, totalBonus, todayBonus,
    firstDepositAmount, claimedFirstDepositTiers, vipCycleStartDate,
    inviteSpinsAvailable, invitedFriends, depositSpinsAvailable,
    wagerRequirement, addBonus, addBetAmount, updateMaxMultiplier,
    claimJackpot, claimRebate, resetWeeklyProgress, resetDailyProgress,
    simulateFriendDeposit, registerPendingBet, pendingBets, floatingPnl,
    showInsufficientBalance,
  ]);

  const audioValue = useMemo<AudioContextType>(() => ({
    playBgMusic: () => {},
    stopBgMusic: () => {},
    playSfx: () => {},
    isMuted,
    setIsMuted,
  }), [isMuted]);

  return (
    <BalanceContext.Provider value={balanceValue}>
      <AudioContext.Provider value={audioValue}>
        <LanguageProvider>
          <ToastProvider>
            {insufficientModalOpen && (
              <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#1e2329] border border-red-500/30 rounded-[2rem] p-6 w-full max-w-xs shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                    <span className="text-red-500 text-3xl font-black">!</span>
                  </div>
                  <h3 className="text-xl font-black text-white text-center mb-2">Insufficient Balance</h3>
                  <p className="text-gray-400 text-sm text-center mb-6">You don't have enough balance to place this trade. Please top up or switch accounts.</p>
                  <button
                    onClick={() => setInsufficientModalOpen(false)}
                    className="w-full bg-[#1e88e5] hover:bg-[#1976d2] text-white py-3 rounded-xl font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            <HashRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/alphasandeep" element={<Trading />} />
                <Route path="/alphatrader" element={<Trading />} />
                <Route path="/trade" element={<Trading />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </HashRouter>
          </ToastProvider>
        </LanguageProvider>
      </AudioContext.Provider>
    </BalanceContext.Provider>
  );
}

export default App;
