import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../src/components/Toast';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Globe, Eye, EyeOff, ArrowRight, Search, Check, Loader2 } from 'lucide-react';

import { auth, db } from '../src/firebase';
import { useBalance } from '../App';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import Footer from '../src/components/Footer';
import { ALL_COUNTRIES, DEFAULT_COUNTRY, CountryItem } from '../src/data/countries';
import { CURRENCIES, getCurrencyByCode } from '../src/data/currencies';
import { CurrencyFlag } from '../src/components/CurrencyFlag';
import QuotexLanguageDropdown from '../src/components/QuotexLanguageDropdown';
import { useLanguage } from '../src/context/LanguageContext';

// Valid promo codes database with bonuses
const VALID_PROMO_CODES: Record<string, { bonus: string; description: string }> = {
  WELCOME100: { bonus: '+100% Deposit Bonus', description: 'Double your first real deposit' },
  PROFIT50: { bonus: '+50% Deposit Bonus', description: '50% extra bonus balance' },
  BONUS50: { bonus: '+50% Extra Balance', description: 'Boosts your trading margin' },
  RISKFREE: { bonus: '1 Risk-Free Trade', description: 'Protected trade voucher up to $50' },
  VIP2026: { bonus: 'VIP Status Tier', description: 'Max payout rates up to 98%' },
};

export default function Auth() {
  const { setCurrency } = useBalance();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t, language, setLanguage } = useLanguage();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>('SIGNUP');
  const [showLang, setShowLang] = useState(false);
  const [lang, setLang] = useState('EN');

  // Form states matching Image 1 & Image 2 (Defaults: US country & USD currency)
  const [selectedCountry, setSelectedCountry] = useState<CountryItem>(DEFAULT_COUNTRY);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; bonus: string } | null>(null);

  const [isTermsAccepted, setIsTermsAccepted] = useState(true);
  const [isNonUsResident, setIsNonUsResident] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Background chart simulation with thin/thick candles & controlled wicks
  const [mockCandles, setMockCandles] = useState<any[]>([]);

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setIsCountryOpen(false);
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(e.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    if (window.location.pathname.includes('/login')) {
      setActiveTab('LOGIN');
    } else {
      setActiveTab('SIGNUP');
    }
    
    // Background Trading Chart Simulation
    // Big, tall, prominent candles matching Image 3 (never tiny candles)
    let price = 1.08500;
    const initial = Array.from({ length: 44 }).map((_, i) => {
       const open = price;
       // Alternate swings for realistic bold market waves
       const dir = (i % 2 === 0 || i % 5 === 0) ? -1 : 1;
       // Large prominent candle body - always big, never tiny
       const move = dir * (0.00380 + Math.random() * 0.00520);
       const close = open + move;
       
       // High/low wick extensions
       const isLongWick = (i % 4 === 0);
       const wickExtension = isLongWick 
         ? (0.00160 + Math.random() * 0.00140) 
         : (0.00060 + Math.random() * 0.00080);
       
       const high = Math.max(open, close) + wickExtension;
       const low = Math.min(open, close) - wickExtension;
       price = close;
       return { open, close, high, low, isLongWick };
    });
    setMockCandles(initial);

    const interval = setInterval(() => {
       setMockCandles(prev => {
          if (prev.length === 0) return prev;
          const newCandles = [...prev];
          const last = { ...newCandles[newCandles.length - 1] };
          const move = (Math.random() - 0.49) * 0.00050;
          last.close += move;
          if (last.close > last.high) last.high = last.close;
          if (last.close < last.low) last.low = last.close;
          newCandles[newCandles.length - 1] = last;
          return newCandles;
       });
    }, 120);

    const addInterval = setInterval(() => {
       setMockCandles(prev => {
          const newCandles = [...prev.slice(1)];
          const lastClose = prev[prev.length - 1].close;
          const dir = Math.random() > 0.48 ? 1 : -1;
          const move = dir * (0.00380 + Math.random() * 0.00520);
          const close = lastClose + move;
          const wick = 0.00080 + Math.random() * 0.00120;
          newCandles.push({
             open: lastClose,
             close: close,
             high: Math.max(lastClose, close) + wick,
             low: Math.min(lastClose, close) - wick,
             isLongWick: Math.random() > 0.7
          });
          return newCandles;
       });
    }, 2400);

    return () => { 
      clearInterval(interval); 
      clearInterval(addInterval); 
    };
  }, []);

  const maxPrice = Math.max(...mockCandles.map(c => c?.high || 0), 1.09200);
  const minPrice = Math.min(...mockCandles.map(c => c?.low || 0), 1.07800);
  const range = maxPrice - minPrice || 1;
  const getY = (val: number) => 100 - ((val - minPrice) / range) * 100;

  // Filter countries by search query (All world countries)
  const filteredCountries = ALL_COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Filter currencies by search query
  const filteredCurrencies = CURRENCIES.filter(c =>
    c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.symbol.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const activeCurrInfo = getCurrencyByCode(selectedCurrency);

  // Apply promo code logic
  const handleApplyPromo = () => {
    const trimmed = promoCode.trim().toUpperCase();
    if (!trimmed) {
      showToast('Please enter a promo code first.');
      return;
    }
    const found = VALID_PROMO_CODES[trimmed];
    if (found) {
      setAppliedPromo({ code: trimmed, bonus: found.bonus });
      showToast(`Promo code applied: ${found.bonus} (${found.description})`, 'success');
    } else {
      showToast('Invalid promo code. Try WELCOME100 or PROFIT50');
    }
  };

  // Helper to resolve currency symbol
  const getSymbol = (curr: string) => {
    const c = getCurrencyByCode(curr);
    return c ? c.symbol : '$';
  };

  // Standard Email & Password Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter both email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.');
      return;
    }

    if (activeTab === 'SIGNUP') {
      if (password.length < 6) {
        showToast('Password must be at least 6 characters.');
        return;
      }
      if (!isTermsAccepted) {
        showToast('You must accept the Service Agreement to continue.');
        return;
      }
      if (!isNonUsResident) {
        showToast('Please confirm your non-US tax residency declaration.');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const currInfo = getCurrencyByCode(selectedCurrency);
      const currSymbol = currInfo.symbol;
      const initialDemoBalance = Math.round(10000 * currInfo.ratePerUSD);

      if (activeTab === 'SIGNUP') {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = cred.user;

        setCurrency(currSymbol);
        localStorage.setItem('user_uid', user.uid);
        localStorage.setItem('rajadhan_currency', currSymbol);
        localStorage.setItem('rajadhan_currency_code', currInfo.code);
        localStorage.setItem('user_email', user.email || email);
        localStorage.setItem('quotex_account_type', 'DEMO');

        const uniqueNickname = 'Trader_' + Math.floor(100000 + Math.random() * 900000);
        
        // Save user record to Firestore with selected currency, country, and language
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          userId: user.uid,
          email: user.email,
          country: selectedCountry.name,
          countryCode: selectedCountry.code,
          currency: currInfo.code,
          currencySymbol: currSymbol,
          nickname: uniqueNickname,
          appliedPromo: appliedPromo ? appliedPromo.code : null,
          role: 'USER',
          status: 'ACTIVE',
          language: language || 'English',
          demo_balance: initialDemoBalance,
          balance: 0,
          real_balance: 0,
          createdAt: new Date().toISOString()
        }, { merge: true }).catch(err => console.warn('users setDoc warning:', err));

        // Initialize demo wallet with userId
        await setDoc(doc(db, 'demoWallets', user.uid), {
          userId: user.uid,
          balance: initialDemoBalance,
          currency: currInfo.code,
          updatedAt: Date.now()
        }, { merge: true }).catch(err => console.warn('demoWallets setDoc warning:', err));

        // Set flag so interactive onboarding tutorial launches automatically for new registered user
        localStorage.setItem('start_onboarding_tutorial_on_mount', 'true');
        localStorage.removeItem('quotex_onboarding_completed');
        localStorage.removeItem('tutorial_dismissed');

        showToast(t('registration') + ' successful! Welcome to the platform.', 'success');
        navigate('/trade');
      } else {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const user = cred.user;

        localStorage.setItem('user_uid', user.uid);
        localStorage.setItem('user_email', user.email || email);
        localStorage.setItem('quotex_account_type', 'DEMO');

        // Retrieve existing user document and restore user's registered currency and language
        const snap = await getDoc(doc(db, 'users', user.uid)).catch(() => null);
        if (snap && snap.exists()) {
          const data = snap.data();
          if (data.language) {
            setLanguage(data.language);
          }
          const userCurr = data.currency || 'USD';
          const info = getCurrencyByCode(userCurr);
          setCurrency(info.symbol);
          localStorage.setItem('rajadhan_currency', info.symbol);
          localStorage.setItem('rajadhan_currency_code', info.code);
        } else {
          setCurrency(currSymbol);
          localStorage.setItem('rajadhan_currency', currSymbol);
          localStorage.setItem('rajadhan_currency_code', currInfo.code);
        }

        showToast(t('login') + ' successful!', 'success');
        navigate('/trade');
      }
    } catch (err: any) {
      let msg = err.message || 'Authentication error';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please log in.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      showToast(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct Google Sign In / Sign Up Handler
  const handleGoogleAuth = async () => {
    try {
      setIsGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      localStorage.setItem('user_uid', user.uid);
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef).catch(() => null);

      const currInfo = getCurrencyByCode(selectedCurrency);
      const currSymbol = currInfo.symbol;
      const initialDemoBalance = Math.round(10000 * currInfo.ratePerUSD);

      if (!snap || !snap.exists()) {
        const uniqueNick = user.displayName 
          ? user.displayName.replace(/\s+/g, '_')
          : 'Trader_' + Math.floor(100000 + Math.random() * 900000);

        await setDoc(userRef, {
          uid: user.uid,
          userId: user.uid,
          email: user.email,
          name: user.displayName || 'Google Trader',
          photoURL: user.photoURL || '',
          country: selectedCountry.name,
          countryCode: selectedCountry.code,
          currency: currInfo.code,
          currencySymbol: currSymbol,
          nickname: uniqueNick,
          role: 'USER',
          status: 'ACTIVE',
          language: language || 'English',
          demo_balance: initialDemoBalance,
          balance: 0,
          real_balance: 0,
          appliedPromo: appliedPromo ? appliedPromo.code : null,
          createdAt: new Date().toISOString()
        }, { merge: true }).catch(err => console.warn('users setDoc warning:', err));

        await setDoc(doc(db, 'demoWallets', user.uid), {
          userId: user.uid,
          balance: initialDemoBalance,
          currency: currInfo.code,
          updatedAt: Date.now()
        }, { merge: true }).catch(err => console.warn('demoWallets setDoc warning:', err));

        setCurrency(currSymbol);
        localStorage.setItem('rajadhan_currency', currSymbol);
        localStorage.setItem('rajadhan_currency_code', currInfo.code);
      } else {
        const data = snap.data();
        if (data.language) {
          setLanguage(data.language);
        }
        const userCurr = data.currency || 'USD';
        const info = getCurrencyByCode(userCurr);
        setCurrency(info.symbol);
        localStorage.setItem('rajadhan_currency', info.symbol);
        localStorage.setItem('rajadhan_currency_code', info.code);
      }

      localStorage.setItem('user_email', user.email || '');
      localStorage.setItem('quotex_account_type', 'DEMO');

      showToast(`Welcome ${user.displayName || user.email}!`, 'success');
      navigate('/trade');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        showToast('Google authentication was cancelled.');
      } else if (err.code === 'auth/popup-blocked') {
        showToast('Popup was blocked by your browser. Please allow popups.');
      } else {
        showToast(err.message || 'Google authentication failed.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Password reset
  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      showToast('Please enter your registered email address.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      showToast('Password reset link sent to your email!', 'success');
      setShowForgotModal(false);
      setResetEmail('');
    } catch (err: any) {
      showToast(err.message || 'Failed to send reset email.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1219] font-sans text-white flex flex-col relative overflow-y-auto overflow-x-hidden select-none">
       
       {/* Animated Background Trading Chart with Big Prominent Candles (matching Image 3) */}
       <div className="absolute inset-0 z-0 opacity-35 pointer-events-none overflow-hidden" style={{ perspective: '1000px' }}>
          <div className="absolute inset-0" style={{ transform: 'rotateX(18deg) scale(1.08)', transformOrigin: 'bottom' }}>
             <svg width="100%" height="100%" preserveAspectRatio="none" className="absolute inset-0">
                <pattern id="grid-bg-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
                  <path d="M 70 0 L 0 0 0 70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid-bg-pattern)" />
                
                {/* Background Candlesticks - Big & Tall, never small */}
                {mockCandles.map((c, i) => {
                   const x = (i / 44) * 100 + "%";
                   const isUp = c.close >= c.open;
                   const color = isUp ? '#00c26f' : '#ff4a5a';
                   const topY = getY(Math.max(c.open, c.close));
                   const bottomY = getY(Math.min(c.open, c.close));
                   const top = topY + "%";
                   const high = getY(c.high) + "%";
                   const low = getY(c.low) + "%";
                   // Always tall, big prominent body height - never small
                   const height = Math.max(7.5, bottomY - topY) + "%";

                   return (
                      <g key={i}>
                        {/* Centered Wick */}
                        <line 
                          x1={`calc(${x} + 7px)`} 
                          y1={high} 
                          x2={`calc(${x} + 7px)`} 
                          y2={low} 
                          stroke={color} 
                          strokeWidth="1.8" 
                        />
                        {/* Big Prominent Candle Body */}
                        <rect x={x} y={top} width="14px" height={height} fill={color} rx="1" />
                      </g>
                   );
                })}
             </svg>
          </div>
       </div>
       <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-[#0e1219] via-[#0e1219]/70 to-transparent"></div>
       
       {/* Auth Header */}
       <div className="h-[70px] w-full flex items-center justify-between px-6 md:px-12 border-b border-[#212938]/80 bg-[#141a24]/90 backdrop-blur-md relative z-20">
           <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
             <div className="relative w-8 h-7">
               <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(0,163,255,0.6)]">
                 <defs>
                   <linearGradient id="z-blue-pro" x1="0" y1="0" x2="1" y2="0">
                     <stop offset="0%" stopColor="#00d4ff" />
                     <stop offset="100%" stopColor="#0055ff" />
                   </linearGradient>
                   <linearGradient id="z-silver-pro" x1="0" y1="0" x2="1" y2="0">
                     <stop offset="0%" stopColor="#ffffff" />
                     <stop offset="100%" stopColor="#b0b0b0" />
                   </linearGradient>
                 </defs>
                 <path d="M 20 25 L 75 25 L 45 55 L 20 55 L 35 40 L 20 40 Z" fill="url(#z-blue-pro)"/>
                 <path d="M 40 75 L 95 75 L 65 45 L 40 45 L 55 60 L 40 60 Z" fill="url(#z-silver-pro)"/>
               </svg>
             </div>
             <span className="text-white font-black tracking-wider text-2xl flex items-center">
               ZORVE<span className="text-[#00a3ff]">X</span>
             </span>
           </div>
           {/* Quotex 23-Language Selector */}
           <QuotexLanguageDropdown />
       </div>

       {/* Center Container with Pro-Level Card matching Image 2 */}
       <div className="flex-1 flex justify-center items-center px-4 py-8 relative z-20">
          <div className="w-full max-w-[420px] bg-[#1c212c] border border-[#273244] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.65)] flex flex-col overflow-hidden">
             
             {/* Header Rounded Pill Tabs (Image 2) */}
             <div className="p-4 pb-2">
                <div className="flex bg-[#12161f] p-1 rounded-xl border border-[#202837]">
                   <button 
                     type="button"
                     className={`flex-1 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all cursor-pointer ${
                       activeTab === 'LOGIN' 
                         ? 'bg-[#273244] text-white shadow-md' 
                         : 'text-[#8291a5] hover:text-white'
                     }`}
                     onClick={() => { setActiveTab('LOGIN'); navigate('/login'); }}
                   >
                     Login
                   </button>
                   <button 
                     type="button"
                     className={`flex-1 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all cursor-pointer ${
                       activeTab === 'SIGNUP' 
                         ? 'bg-[#273244] text-white shadow-md' 
                         : 'text-[#8291a5] hover:text-white'
                     }`}
                     onClick={() => { setActiveTab('SIGNUP'); navigate('/signup'); }}
                   >
                     Registration
                   </button>
                </div>
             </div>

             {/* Form Fields Body */}
             <form onSubmit={handleSubmit} className="px-6 py-4 flex flex-col gap-4">
                
                {/* Registration Fields (Image 2) */}
                {activeTab === 'SIGNUP' && (
                  <>
                    {/* 1. Country / Region of Residence with Floating Notch */}
                    {/* 1. Country / Region of Residence with Floating Notch (All World Countries) */}
                    <div className="relative" ref={countryDropdownRef}>
                      <div 
                        onClick={() => setIsCountryOpen(!isCountryOpen)}
                        className="relative border border-[#2f3a4e] hover:border-[#3e4d66] focus-within:border-[#0088ff] rounded-xl px-3.5 pt-4 pb-2.5 cursor-pointer bg-[#171c26] transition-all"
                      >
                         {/* Floating Label */}
                         <span className="absolute -top-2 left-3 bg-[#1c212c] px-1 text-[11px] font-medium text-[#7d8c9f] leading-none select-none">
                           Country / Region of residence
                         </span>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 text-sm font-medium text-white truncate min-w-0">
                               <CurrencyFlag code={selectedCountry.code} size={20} className="shrink-0" />
                               <span className="truncate">{selectedCountry.name}</span>
                            </div>
                            <ChevronDown size={17} className={`text-[#7d8c9f] shrink-0 ml-2 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
                         </div>
                      </div>

                      {/* Searchable Country Popup (All World Countries - None Missing) */}
                      {isCountryOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#171c26] border border-[#2f3a4e] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in">
                           <div className="p-2.5 border-b border-[#242e3f] flex items-center gap-2 bg-[#12161f]">
                              <Search size={15} className="text-gray-400 shrink-0" />
                              <input 
                                type="text"
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                placeholder="Search country (e.g. United States, India)..."
                                className="w-full bg-transparent text-white text-xs outline-none placeholder-gray-500"
                                autoFocus
                              />
                           </div>
                           <div className="max-h-56 overflow-y-auto custom-scrollbar p-1">
                              {filteredCountries.length === 0 ? (
                                <div className="px-3 py-4 text-center text-xs text-gray-400">
                                  No country found
                                </div>
                              ) : (
                                filteredCountries.map(c => (
                                  <div
                                    key={c.code}
                                    onClick={() => {
                                      setSelectedCountry(c);
                                      setIsCountryOpen(false);
                                      setCountrySearch('');
                                    }}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                                      selectedCountry.code === c.code 
                                        ? 'bg-[#0088ff]/20 text-[#0088ff] font-bold' 
                                        : 'text-gray-300 hover:bg-[#202837] hover:text-white'
                                    }`}
                                  >
                                     <div className="flex items-center gap-2.5 min-w-0">
                                        <CurrencyFlag code={c.code} size={20} className="shrink-0" />
                                        <span className="truncate">{c.name}</span>
                                     </div>
                                     <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                       <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">{c.code}</span>
                                       {selectedCountry.code === c.code && <Check size={14} className="text-[#0088ff]" />}
                                     </div>
                                  </div>
                                ))
                              )}
                           </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Currency Dropdown with Floating Notch (With round icons, flags & symbols) */}
                    <div className="relative" ref={currencyDropdownRef}>
                      <div 
                        onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                        className="relative border border-[#2f3a4e] hover:border-[#3e4d66] focus-within:border-[#0088ff] rounded-xl px-3.5 pt-4 pb-2.5 cursor-pointer bg-[#171c26] transition-all"
                      >
                         <span className="absolute -top-2 left-3 bg-[#1c212c] px-1 text-[11px] font-medium text-[#7d8c9f] leading-none select-none">
                           Currency
                         </span>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 truncate min-w-0">
                               <CurrencyFlag code={activeCurrInfo.code} size={20} className="shrink-0" />
                               <span className="text-sm font-bold text-white tracking-wide">
                                 {activeCurrInfo.code}
                                </span>
                               <span className="text-xs text-gray-400 font-medium truncate">({activeCurrInfo.symbol} - {activeCurrInfo.name})</span>
                            </div>
                            <ChevronDown size={17} className={`text-[#7d8c9f] shrink-0 ml-2 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                         </div>
                      </div>

                      {/* Currency Dropdown Menu with Search and Icons */}
                      {isCurrencyOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#171c26] border border-[#2f3a4e] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in">
                           <div className="p-2.5 border-b border-[#242e3f] flex items-center gap-2 bg-[#12161f]">
                              <Search size={15} className="text-gray-400 shrink-0" />
                              <input 
                                type="text"
                                value={currencySearch}
                                onChange={(e) => setCurrencySearch(e.target.value)}
                                placeholder="Search currency (USD, EUR, GBP, INR...)..."
                                className="w-full bg-transparent text-white text-xs outline-none placeholder-gray-500"
                                autoFocus
                              />
                           </div>
                           <div className="max-h-56 overflow-y-auto custom-scrollbar p-1">
                              {filteredCurrencies.length === 0 ? (
                                <div className="px-3 py-4 text-center text-xs text-gray-400">
                                  No currency found
                                </div>
                              ) : (
                                filteredCurrencies.map(curr => (
                                  <div
                                    key={curr.code}
                                    onClick={() => {
                                      setSelectedCurrency(curr.code);
                                      setIsCurrencyOpen(false);
                                      setCurrencySearch('');
                                    }}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                                      selectedCurrency === curr.code 
                                        ? 'bg-[#0088ff]/20 text-[#0088ff]' 
                                        : 'text-gray-300 hover:bg-[#202837] hover:text-white'
                                    }`}
                                  >
                                     <div className="flex items-center gap-2.5 min-w-0">
                                        <CurrencyFlag code={curr.code} size={20} className="shrink-0" />
                                        <span className="font-bold text-white tracking-wide">{curr.code}</span>
                                        <span className="text-gray-400 truncate text-[11px]">{curr.name}</span>
                                     </div>
                                     <div className="flex items-center gap-2 shrink-0 ml-2">
                                       <span className="text-xs font-mono font-bold text-[#00c26f] bg-[#00c26f]/10 px-2 py-0.5 rounded">
                                         {curr.symbol}
                                       </span>
                                       {selectedCurrency === curr.code && (
                                         <Check size={14} className="text-[#0088ff]" />
                                       )}
                                     </div>
                                  </div>
                                ))
                              )}
                           </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* 3. Email Input with Floating Notch */}
                <div className="relative">
                   <div className="relative border border-[#2f3a4e] hover:border-[#3e4d66] focus-within:border-[#0088ff] rounded-xl px-3.5 pt-3.5 pb-2 bg-[#171c26] transition-all">
                      <span className="absolute -top-2 left-3 bg-[#1c212c] px-1 text-[11px] font-medium text-[#7d8c9f] leading-none select-none">
                        Email
                      </span>
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        required
                        className="w-full bg-transparent text-sm text-white outline-none placeholder-[#4e5b70]"
                      />
                   </div>
                </div>

                {/* 4. Password Input with Floating Notch & Show/Hide Eye Toggle */}
                <div className="relative">
                   <div className="relative border border-[#2f3a4e] hover:border-[#3e4d66] focus-within:border-[#0088ff] rounded-xl px-3.5 pt-3.5 pb-2 bg-[#171c26] transition-all flex items-center">
                      <span className="absolute -top-2 left-3 bg-[#1c212c] px-1 text-[11px] font-medium text-[#7d8c9f] leading-none select-none">
                        Password
                      </span>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full bg-transparent text-sm text-white outline-none placeholder-[#4e5b70] pr-2"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[#68768a] hover:text-white cursor-pointer transition-colors p-1"
                        tabIndex={-1}
                      >
                         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                   </div>
                </div>

                {/* 5. Promo Code (Optional) with Inline "| Apply" Button (Image 2) */}
                {activeTab === 'SIGNUP' && (
                  <div className="relative">
                     <div className="relative border border-[#2f3a4e] hover:border-[#3e4d66] focus-within:border-[#0088ff] rounded-xl pl-3.5 pr-2 pt-3.5 pb-2 bg-[#171c26] transition-all flex items-center">
                        <span className="absolute -top-2 left-3 bg-[#1c212c] px-1 text-[11px] font-medium text-[#7d8c9f] leading-none select-none">
                          Promo code (optional)
                        </span>
                        <input 
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="e.g. WELCOME100"
                          className="w-full bg-transparent text-sm text-white outline-none placeholder-[#4e5b70] uppercase font-mono"
                        />
                        <div className="flex items-center shrink-0">
                           <span className="text-[#3b475c] mx-2 font-mono">|</span>
                           <button
                             type="button"
                             onClick={handleApplyPromo}
                             className="text-xs font-bold text-[#0088ff] hover:text-[#38bdf8] transition-colors cursor-pointer px-1 py-0.5"
                           >
                             Apply
                           </button>
                        </div>
                     </div>
                     {appliedPromo && (
                       <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-[#00c26f] animate-in fade-in">
                          <Check size={13} strokeWidth={3} /> {appliedPromo.bonus} ({appliedPromo.code})
                       </div>
                     )}
                  </div>
                )}

                {/* 6. Checkboxes (Image 2) */}
                {activeTab === 'SIGNUP' && (
                  <div className="flex flex-col gap-2.5 pt-1">
                     {/* Checkbox 1: 18+ & Service Agreement */}
                     <label className="flex items-start gap-3 cursor-pointer group select-none">
                        <input 
                          type="checkbox"
                          checked={isTermsAccepted}
                          onChange={(e) => setIsTermsAccepted(e.target.checked)}
                          className="w-4 h-4 mt-0.5 rounded border-[#38455c] bg-[#12161f] text-[#0088ff] focus:ring-0 accent-[#0088ff] cursor-pointer"
                        />
                        <span className="text-xs text-[#8f9eb1] leading-relaxed group-hover:text-gray-300">
                          I confirm that I am 18 years old or older and accept{' '}
                          <span 
                            onClick={(e) => { e.stopPropagation(); navigate('/faq'); }} 
                            className="text-[#0088ff] hover:underline font-medium"
                          >
                            Service Agreement
                          </span>
                        </span>
                     </label>

                     {/* Checkbox 2: Non-US Citizen Declaration */}
                     <label className="flex items-start gap-3 cursor-pointer group select-none">
                        <input 
                          type="checkbox"
                          checked={isNonUsResident}
                          onChange={(e) => setIsNonUsResident(e.target.checked)}
                          className="w-4 h-4 mt-0.5 rounded border-[#38455c] bg-[#12161f] text-[#0088ff] focus:ring-0 accent-[#0088ff] cursor-pointer"
                        />
                        <span className="text-xs text-[#8f9eb1] leading-relaxed group-hover:text-gray-300">
                          I declare and confirm that I am not a citizen or resident of the US for tax purposes
                        </span>
                     </label>
                  </div>
                )}

                {/* Login: Forgot Password Link */}
                {activeTab === 'LOGIN' && (
                  <div className="flex justify-end -mt-1">
                     <button
                       type="button"
                       onClick={() => setShowForgotModal(true)}
                       className="text-xs font-semibold text-[#0088ff] hover:underline cursor-pointer"
                     >
                        Forgot your password?
                     </button>
                  </div>
                )}

                {/* Primary Submit Button: Vibrant Quotex Blue with Arrow (Image 2) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0088ff] hover:bg-[#0077e6] active:bg-[#006bd1] text-white font-bold h-12 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,136,255,0.4)] cursor-pointer mt-1 disabled:opacity-50"
                >
                   {isSubmitting ? (
                     <Loader2 size={20} className="animate-spin" />
                   ) : (
                     <>
                        <span className="text-base tracking-wide">
                          {activeTab === 'SIGNUP' ? 'Registration' : 'Login'}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                           <ArrowRight size={13} strokeWidth={3} />
                        </div>
                     </>
                   )}
                </button>

                {/* Divider: Sign in via (Image 2) */}
                <div className="relative flex items-center justify-center my-1">
                   <div className="border-t border-[#263040] w-full"></div>
                   <span className="bg-[#1c212c] px-3 text-xs font-medium text-[#6f7e94] whitespace-nowrap">
                     Sign in via
                   </span>
                   <div className="border-t border-[#263040] w-full"></div>
                </div>

                {/* Google Sign In Button (Image 2 & Point 2) */}
                <div className="flex justify-center pb-2">
                   <button
                     type="button"
                     onClick={handleGoogleAuth}
                     disabled={isGoogleLoading}
                     title="Sign in directly with Google"
                     className="w-20 h-12 bg-[#222938] hover:bg-[#2b3548] border border-[#313e54] hover:border-[#425370] rounded-xl flex items-center justify-center transition-all shadow-md cursor-pointer disabled:opacity-50 group transform hover:scale-105 active:scale-95"
                   >
                      {isGoogleLoading ? (
                        <Loader2 size={20} className="animate-spin text-white" />
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                          />
                        </svg>
                      )}
                   </button>
                </div>

             </form>
          </div>
       </div>

       {/* Forgot Password Modal */}
       {showForgotModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#1c212c] border border-[#2b3749] rounded-2xl max-w-sm w-full p-6 shadow-2xl">
               <h3 className="text-lg font-bold text-white mb-1">Reset Password</h3>
               <p className="text-xs text-gray-400 mb-4">
                 Enter your registered email address to receive a secure password reset link.
               </p>
               <input 
                 type="email"
                 value={resetEmail}
                 onChange={(e) => setResetEmail(e.target.value)}
                 placeholder="name@example.com"
                 className="w-full bg-[#12161f] border border-[#2e3a4e] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#0088ff] mb-4"
               />
               <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="px-4 py-2 bg-[#0088ff] hover:bg-[#0077e6] text-white rounded-lg text-xs font-bold"
                  >
                    Send Reset Link
                  </button>
               </div>
            </div>
         </div>
       )}

       <Footer />
    </div>
  );
}
