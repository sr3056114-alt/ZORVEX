import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  Rocket, 
  Check, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Image as ImageIcon,
  HelpCircle,
  User,
  Maximize2,
  Settings,
  Volume2,
  Info,
  ArrowRight
} from 'lucide-react';
import { AssetInfo, AssetIcon, QUOTEX_ASSETS } from '../../pages/Trading';

export type TutorialStep = 
  | 'WELCOME'         // Image 1
  | 'EXPLORE_TERMINAL'// Image 2 / Image 3 (icons)
  | 'CHOOSE_ACCOUNT'  // Image 3 (shown when user closes Image 1)
  | 'HOW_TO_START'    // Image 4 (Asset Selection)
  | 'FIRST_PREDICTION'// Image 5 (Candlestick Up/Down Prediction)
  | 'SET_PARAMETERS'  // Image 6 (Step 1 of 2: Time & Investment left callout)
  | 'CHOOSE_DIRECTION'// Image 7 (Step 2 of 2: Buy & Sell left callout)
  | 'TRADE_RESULT'    // Image 4 (Your Trade Result: Red/Green PnL, Chart, Explore More Tools)
  | 'EXPLORE_PLATFORM_READY' // Image 5 (You're ready to explore the platform: Rocket, Start Trading)
  | 'COMPLETED';

interface OnboardingTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDemo: () => void;
  onSelectRealDeposit: () => void;
  onSwitchToReal?: () => void;
  onSelectAsset?: (asset: AssetInfo) => void;
  selectedAsset?: AssetInfo;
  onPlaceDemoTrade?: (direction: 'UP' | 'DOWN') => void;
  currentStep?: TutorialStep;
  onStepChange?: (step: TutorialStep) => void;
  tradeResult?: any;
}

// -------------------------------------------------------------
// Real-time market candlestick generator with live dynamic ticking
// Authentic high/low wicks, rectangular bodies, and moving price line
// -------------------------------------------------------------
function LiveMarketCandlesticks({ 
  count = 16, 
  speedMs = 600, 
  showPriceLine = true 
}: { 
  count?: number; 
  speedMs?: number; 
  showPriceLine?: boolean;
}) {
  const [candles, setCandles] = useState(() => {
    let price = 50;
    const initial = [];
    for (let i = 0; i < count; i++) {
      const isGreen = Math.random() > 0.45;
      const delta = (Math.random() * 8 + 3) * (isGreen ? 1 : -1);
      const open = Math.max(15, Math.min(85, price));
      const close = Math.max(15, Math.min(85, open + delta));
      const high = Math.min(95, Math.max(open, close) + Math.random() * 6);
      const low = Math.max(5, Math.min(open, close) - Math.random() * 6);
      initial.push({ open, high, low, close, isGreen: close >= open });
      price = close;
    }
    return initial;
  });

  const [currentPrice, setCurrentPrice] = useState(1.08425);

  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prev => {
        if (!prev.length) return prev;
        const next = [...prev];
        const lastIdx = next.length - 1;
        const last = { ...next[lastIdx] };
        const tick = (Math.random() - 0.48) * 4.5;
        last.close = Math.max(12, Math.min(90, last.close + tick));
        last.high = Math.max(last.high, last.close);
        last.low = Math.min(last.low, last.close);
        last.isGreen = last.close >= last.open;
        next[lastIdx] = last;
        return next;
      });

      const tickDelta = (Math.random() - 0.48) * 0.00014;
      setCurrentPrice(p => +(p + tickDelta).toFixed(5));
    }, speedMs);

    return () => clearInterval(interval);
  }, [speedMs]);

  const activeCandle = candles[candles.length - 1];
  const activeY = activeCandle ? 100 - activeCandle.close : 50;

  return (
    <div className="relative w-full h-full flex items-end justify-between px-1.5 pt-2 pb-2 overflow-hidden select-none pointer-events-none">
      {/* Background Price Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between py-3 opacity-15 pointer-events-none">
        <div className="border-b border-[#4a5568] border-dashed w-full"></div>
        <div className="border-b border-[#4a5568] border-dashed w-full"></div>
        <div className="border-b border-[#4a5568] border-dashed w-full"></div>
      </div>

      {/* Live moving horizontal price line */}
      {showPriceLine && (
        <div 
          className="absolute left-0 right-0 border-t border-dashed border-[#0ba259] z-10 transition-all duration-300 pointer-events-none"
          style={{ top: `${activeY}%`, borderColor: activeCandle?.isGreen ? '#0ba259' : '#e33f4a' }}
        >
          <div 
            className={`absolute right-1 -top-2.5 text-[8.5px] font-mono font-bold px-1 py-0.2 rounded text-white shadow-sm transition-colors duration-200 ${
              activeCandle?.isGreen ? 'bg-[#0ba259]' : 'bg-[#e33f4a]'
            }`}
          >
            {currentPrice.toFixed(5)}
          </div>
        </div>
      )}

      {candles.map((c, i) => {
        const color = c.isGreen ? '#0ba259' : '#e33f4a';
        const wickTop = 100 - c.high;
        const wickBottom = c.low;
        const bodyTop = 100 - Math.max(c.open, c.close);
        const bodyHeight = Math.max(4, Math.abs(c.close - c.open));

        return (
          <div key={i} className="relative flex flex-col items-center justify-center flex-1 h-full max-w-[13px] mx-[0.5px]">
            {/* Candle Wick */}
            <div 
              className="absolute w-[1.2px]"
              style={{
                top: `${wickTop}%`,
                bottom: `${wickBottom}%`,
                backgroundColor: color
              }}
            />
            {/* Candle Body */}
            <div 
              className="absolute w-[7px] rounded-[1px] z-10 transition-all duration-150"
              style={{
                top: `${bodyTop}%`,
                height: `${bodyHeight}%`,
                backgroundColor: color,
                boxShadow: c.isGreen ? '0 0 5px rgba(11,162,89,0.4)' : '0 0 5px rgba(227,63,74,0.4)'
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function OnboardingTutorialModal({
  isOpen,
  onClose,
  onSelectDemo,
  onSelectRealDeposit,
  onSwitchToReal,
  onSelectAsset,
  selectedAsset,
  onPlaceDemoTrade,
  currentStep: controlledStep,
  onStepChange,
  tradeResult,
}: OnboardingTutorialModalProps) {
  const [internalStep, setInternalStep] = useState<TutorialStep>('WELCOME');
  const currentStep = controlledStep ?? internalStep;

  // Asset picker state for Step 4
  const [showFullAssetList, setShowFullAssetList] = useState(false);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [selectedAssetTab, setSelectedAssetTab] = useState<'ALL' | 'CURRENCIES' | 'CRYPTO' | 'COMMODITIES' | 'STOCKS'>('ALL');

  // Synchronous calculation helper so the tooltip opens DIRECTLY in place without flying or sliding in
  const calculateStepPosition = (step: TutorialStep) => {
    if (typeof window === 'undefined' || window.innerWidth < 768) return null;
    const targetId = step === 'SET_PARAMETERS' 
      ? 'trading-time-investment-panel' 
      : 'trading-action-buttons-panel';
    const el = document.getElementById(targetId);
    const modalWidth = 340;
    if (el) {
      const rect = el.getBoundingClientRect();
      const left = Math.max(12, rect.left - modalWidth - 10);
      if (step === 'SET_PARAMETERS') {
        const top = Math.max(65, Math.min(window.innerHeight - 280, rect.top - 18));
        const targetY = rect.top + 70;
        const arrowTop = Math.max(35, Math.min(230, targetY - top));
        return { left, top, arrowTop };
      } else {
        const targetY = rect.top + 30;
        const top = Math.max(65, Math.min(window.innerHeight - 280, rect.top - 80));
        const arrowTop = Math.max(35, Math.min(230, targetY - top));
        return { left, top, arrowTop };
      }
    }
    const left = Math.max(12, window.innerWidth - 300 - modalWidth - 10);
    const top = step === 'SET_PARAMETERS' ? 145 : 310;
    const arrowTop = step === 'SET_PARAMETERS' ? 125 : 110;
    return { left, top, arrowTop };
  };

  // Exact dynamic positioning next to Time/Investment and Buy/Sell controls
  const [panelPos, setPanelPos] = useState<{
    left: number;
    top: number;
    arrowTop: number;
  } | null>(() => calculateStepPosition(currentStep));

  useEffect(() => {
    if (!isOpen) return;
    if (currentStep !== 'SET_PARAMETERS' && currentStep !== 'CHOOSE_DIRECTION') {
      setPanelPos(null);
      return;
    }

    const updatePosition = () => {
      const pos = calculateStepPosition(currentStep);
      if (pos) setPanelPos(pos);
    };

    updatePosition();
    const raf = requestAnimationFrame(updatePosition);
    const timer = setTimeout(updatePosition, 50);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, currentStep]);

  const setStep = (step: TutorialStep) => {
    if (step === 'SET_PARAMETERS' || step === 'CHOOSE_DIRECTION') {
      const immediatePos = calculateStepPosition(step);
      if (immediatePos) setPanelPos(immediatePos);
    }
    if (onStepChange) onStepChange(step);
    setInternalStep(step);
  };

  const handleWelcomeClose = () => {
    setStep('CHOOSE_ACCOUNT');
  };

  const handleLater = () => {
    setStep('CHOOSE_ACCOUNT');
  };

  const handleStartTutorial = () => {
    setStep('EXPLORE_TERMINAL');
  };

  const handleFinishTutorial = () => {
    // User requested: "TUTORIAL KHATAM HONE KE BAAD START TRADING PER CLICK KARNE PER REAL ACCOUNT OPEN HO JAYE AUTOMATIC"
    localStorage.setItem('quotex_onboarding_completed', 'true');
    localStorage.removeItem('show_onboarding_tutorial');
    if (onSwitchToReal) {
      onSwitchToReal();
    }
    onClose();
  };

  const handlePickAsset = (asset: AssetInfo) => {
    if (onSelectAsset) {
      onSelectAsset(asset);
    }
    // Proceed immediately to Step 5: Make Your First Prediction
    setShowFullAssetList(false);
    setStep('FIRST_PREDICTION');
  };

  // Filter assets for the asset picker modal in Step 4
  const filteredAssets = useMemo(() => {
    return QUOTEX_ASSETS.filter(asset => {
      const matchesTab = selectedAssetTab === 'ALL' || asset.category === selectedAssetTab;
      const matchesQuery = asset.name.toLowerCase().includes(assetSearchQuery.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [selectedAssetTab, assetSearchQuery]);

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // STEP 1: WELCOME TO QUOTEX (IMAGE 1)
  // -------------------------------------------------------------
  if (currentStep === 'WELCOME') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-[420px] bg-[#1d222d] border border-[#2e3748] rounded-2xl shadow-2xl p-6 text-center text-white overflow-hidden">
          {/* Close button */}
          <button 
            onClick={handleWelcomeClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
            title="Close"
          >
            <X size={20} />
          </button>

          {/* 3D Graduation Cap with Student ID Badge Illustration */}
          <div className="flex justify-center mb-5 mt-2">
            <div className="relative w-28 h-24 flex items-center justify-center">
              <div className="absolute w-14 h-16 bg-[#1e88e5] rounded-xl shadow-lg -rotate-12 -translate-x-3 translate-y-2 border border-[#60a5fa]/30 flex flex-col items-center justify-center p-1.5">
                <div className="w-5 h-5 rounded-full bg-white/90 mb-1 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1e88e5]"></div>
                </div>
                <div className="w-8 h-1.5 bg-white/70 rounded mb-1"></div>
                <div className="w-6 h-1 bg-white/50 rounded"></div>
              </div>

              {/* 3D Mortarboard Hat */}
              <div className="relative z-10 -translate-y-1 translate-x-2">
                <svg width="84" height="64" viewBox="0 0 84 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
                  <path d="M42 4L80 20L42 36L4 20L42 4Z" fill="#2d3748" stroke="#4a5568" strokeWidth="1.5" />
                  <path d="M42 6L76 20L42 34L8 20L42 6Z" fill="#1a202c" />
                  <path d="M22 28V42C22 47.5 31 52 42 52C53 52 62 47.5 62 42V28" fill="#171923" stroke="#2d3748" strokeWidth="1.5" />
                  <path d="M25 31V41C25 45 32.5 48.5 42 48.5C51.5 48.5 59 45 59 41V31" fill="#2d3748" />
                  <circle cx="42" cy="20" r="3" fill="#ecc94b" />
                  <path d="M42 20C40 28 32 35 28 40" stroke="#ecc94b" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="25" y="39" width="6" height="9" rx="2" fill="#ecc94b" />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mb-2.5">
            Welcome to Quotex
          </h2>

          <p className="text-[14px] text-gray-300 leading-relaxed mb-5 font-normal px-1">
            You’re now on a demo account <strong className="text-white font-bold">with $10,000 in virtual funds</strong>. Practice trading risk-free and get comfortable before using real money.
          </p>

          <div className="bg-[#17202f] border border-[#28354a] rounded-lg py-2.5 px-3.5 mb-5 flex items-center justify-center gap-2 text-xs text-gray-300">
            <div className="w-4 h-4 rounded-full bg-[#1e88e5] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              i
            </div>
            <span>80% of users start with the tutorial to trade smarter.</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleStartTutorial}
              className="w-full bg-[#0ba259] hover:bg-[#0ba259]/90 active:scale-[0.98] text-white font-black py-3.5 rounded-lg text-[15px] transition-all shadow-lg shadow-[#0ba259]/20"
            >
              Start Tutorial · 2 min
            </button>

            <button
              onClick={handleLater}
              className="text-[#2185d0] hover:text-[#42a5f5] text-sm font-semibold py-1.5 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 3: CHOOSE YOUR ACCOUNT (IMAGE 3)
  // -------------------------------------------------------------
  if (currentStep === 'CHOOSE_ACCOUNT') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-[560px] bg-[#1d222d] border border-[#2e3748] rounded-2xl shadow-2xl p-6 text-white overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Choose your account</h2>
            <button 
              onClick={() => {
                localStorage.setItem('quotex_onboarding_completed', 'true');
                onClose();
              }}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Card 1: Demo Account */}
            <div className="bg-[#171c26] border border-[#2a3446] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="text-white">
                    <Send size={20} className="rotate-[-25deg]" />
                  </div>
                  <h3 className="text-base font-bold text-white">Demo account</h3>
                </div>
                <p className="text-xs text-gray-400">
                  Your demo account has a 10,000 $ balance
                </p>
                <ul className="text-xs text-gray-300 space-y-1 pt-1.5 list-disc list-inside">
                  <li>Practice trading without risk</li>
                  <li>Refill balance anytime</li>
                  <li>Some assets are unavailable</li>
                </ul>
              </div>

              <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto shrink-0">
                <span className="text-base font-bold text-white hidden md:block">Without risk</span>
                <button
                  onClick={() => {
                    onSelectDemo();
                    handleFinishTutorial();
                  }}
                  className="w-full md:w-auto bg-[#2b3547] hover:bg-[#38445a] text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors text-center"
                >
                  Trading on a demo account
                </button>
              </div>
            </div>

            {/* Card 2: Real Account */}
            <div className="bg-[#171c26] border-2 border-[#0ba259] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative shadow-lg shadow-[#0ba259]/10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="text-[#0ba259]">
                    <Rocket size={20} />
                  </div>
                  <h3 className="text-base font-bold text-white">Real account</h3>
                </div>
                <p className="text-xs text-gray-400">
                  Top up your account with the minimum amount and start earning
                </p>
                <ul className="text-xs text-gray-300 space-y-1 pt-1.5 list-disc list-inside">
                  <li>Minimum deposit — $10</li>
                  <li>Access more assets and features</li>
                  <li>Join tournaments and earn real money</li>
                </ul>
              </div>

              <div className="flex flex-col items-start md:items-end gap-1.5 w-full md:w-auto shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-2xl font-black text-[#0ba259] leading-none">10 $</span>
                  <p className="text-[11px] text-gray-400">Minimum deposit</p>
                </div>
                <button
                  onClick={() => {
                    onSelectRealDeposit();
                    handleFinishTutorial();
                  }}
                  className="w-full md:w-auto bg-[#0ba259] hover:bg-[#0ba259]/90 text-white font-bold text-xs py-2.5 px-5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#0ba259]/20"
                >
                  <Check size={16} strokeWidth={3} /> Top up with 100 $
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 2: EXPLORE THE TERMINAL (EXACT USER IMAGE 3)
  // Sidebar with Main Menu (Image icon), Help (?), Profile (User) at top
  // Fullscreen, Back, Settings, Volume icons at bottom
  // Real market candlestick wicks & bodies + callout speech bubbles
  // -------------------------------------------------------------
  if (currentStep === 'EXPLORE_TERMINAL') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-[530px] bg-[#1d222d] border border-[#2e3748] rounded-2xl shadow-2xl p-6 text-center text-white overflow-hidden">
          <button 
            onClick={handleWelcomeClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5 z-20"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            Explore the Terminal
          </h2>

          <p className="text-[13px] text-gray-300 leading-relaxed mb-4 px-2">
            Here are the key elements of the platform: where to choose assets, set up trades, and follow the price chart. We’ll look at each in detail in the next steps.
          </p>

          <div className="bg-[#12161f] border border-[#283244] rounded-xl p-3 mb-4 text-left relative overflow-hidden">
            <div className="flex gap-2 h-52">
              {/* Left vertical sidebar matching USER IMAGE 3 with ALL exact icons */}
              <div className="w-9 bg-[#171d28] border-r border-[#242e3f] rounded-l flex flex-col items-center py-2.5 justify-between shrink-0 relative">
                {/* Top Section Icons: Image (Main Menu), Question/Help (?), User avatar */}
                <div className="flex flex-col items-center gap-3">
                  {/* 1. Image / Gallery icon (Main Menu) */}
                  <div className="p-1 rounded bg-[#2a3447] text-white shadow-sm flex items-center justify-center">
                    <ImageIcon size={14} strokeWidth={2.2} />
                  </div>
                  {/* 2. Help / FAQ icon (?) */}
                  <div className="p-1 text-gray-400 hover:text-white flex items-center justify-center">
                    <HelpCircle size={14} strokeWidth={2.2} />
                  </div>
                  {/* 3. User / Profile icon */}
                  <div className="p-1 text-gray-400 hover:text-white flex items-center justify-center">
                    <User size={14} strokeWidth={2.2} />
                  </div>
                </div>

                {/* Bottom Section Icons: Maximize (4 arrows), Left arrow, Gear (Settings), Speaker (Sound) */}
                <div className="flex flex-col items-center gap-2.5 mt-auto">
                  <div className="text-gray-400 hover:text-white flex items-center justify-center">
                    <Maximize2 size={12} strokeWidth={2} />
                  </div>
                  <div className="text-gray-400 hover:text-white flex items-center justify-center">
                    <ChevronLeft size={13} strokeWidth={2.5} />
                  </div>
                  <div className="text-gray-400 hover:text-white flex items-center justify-center">
                    <Settings size={12} strokeWidth={2} />
                  </div>
                  <div className="text-gray-400 hover:text-white flex items-center justify-center">
                    <Volume2 size={12} strokeWidth={2} />
                  </div>
                </div>
              </div>

              {/* Center chart with REAL financial market candlesticks with high/low wicks */}
              <div className="flex-1 bg-[#0b0e14] rounded p-2 relative flex flex-col justify-between overflow-hidden border border-[#1b2230]">
                {/* Speech Bubble 1: Main Menu callout pointing to the Image icon on the left (Image 3) */}
                <div className="absolute top-2 left-1.5 bg-[#252e3e] border border-[#3d4963] text-white text-[10px] py-1.5 px-2.5 rounded-md shadow-xl max-w-[155px] leading-tight z-30 flex items-center pointer-events-none animate-in fade-in duration-300">
                  <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[5px] border-r-[#252e3e]"></div>
                  <span><strong className="text-white font-bold">Main menu</strong> — platform menu and settings.</span>
                </div>

                {/* Speech Bubble 2: Price chart callout moved to BOTTOM with upward pointer so candles above are 100% visible */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#252e3e] border border-[#3d4963] text-white text-[10px] py-1 px-3 rounded-md shadow-xl whitespace-nowrap leading-tight z-30 text-center pointer-events-none animate-in fade-in duration-300">
                  <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-[#252e3e]"></div>
                  <span><strong className="text-white font-bold">Price chart</strong> — moves in real time</span>
                </div>

                {/* Horizontal price grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-3 pointer-events-none opacity-20">
                  <div className="border-b border-[#3b475e] border-dashed w-full"></div>
                  <div className="border-b border-[#3b475e] border-dashed w-full"></div>
                  <div className="border-b border-[#3b475e] border-dashed w-full"></div>
                </div>

                {/* Real Market Candlesticks container - elevated so candles remain completely visible above bottom bubble */}
                <div className="relative w-full h-full flex items-end justify-between px-1 pb-8 pt-3 z-0">
                  {[
                    { open: 30, high: 45, low: 22, close: 40, isGreen: true },
                    { open: 40, high: 48, low: 32, close: 35, isGreen: false },
                    { open: 35, high: 52, low: 30, close: 48, isGreen: true },
                    { open: 48, high: 62, low: 44, close: 58, isGreen: true },
                    { open: 58, high: 65, low: 46, close: 50, isGreen: false },
                    { open: 50, high: 54, low: 38, close: 42, isGreen: false },
                    { open: 42, high: 58, low: 40, close: 55, isGreen: true },
                    { open: 55, high: 68, low: 52, close: 64, isGreen: true },
                    { open: 64, high: 75, low: 58, close: 72, isGreen: true },
                    { open: 72, high: 78, low: 62, close: 66, isGreen: false },
                    { open: 66, high: 82, low: 64, close: 78, isGreen: true },
                    { open: 78, high: 90, low: 74, close: 88, isGreen: true },
                    { open: 88, high: 96, low: 84, close: 92, isGreen: true },
                  ].map((c, i) => {
                    const candleColor = c.isGreen ? '#0ba259' : '#e33f4a';
                    const wickTop = 100 - c.high;
                    const wickBottom = c.low;
                    const bodyTop = 100 - Math.max(c.open, c.close);
                    const bodyHeight = Math.max(4, Math.abs(c.close - c.open));

                    return (
                      <div key={i} className="relative flex flex-col items-center justify-center flex-1 h-full max-w-[13px]">
                        {/* High-Low Wick */}
                        <div 
                          className="absolute w-[1.5px]"
                          style={{
                            top: `${wickTop}%`,
                            bottom: `${wickBottom}%`,
                            backgroundColor: candleColor
                          }}
                        />
                        {/* Candlestick Body */}
                        <div 
                          className="absolute w-[6px] rounded-[1px] z-10"
                          style={{
                            top: `${bodyTop}%`,
                            height: `${bodyHeight}%`,
                            backgroundColor: candleColor,
                            boxShadow: c.isGreen ? '0 0 5px rgba(11,162,89,0.3)' : '0 0 5px rgba(227,63,74,0.3)'
                          }}
                        />
                        {/* Pulsing live tick on the last candle */}
                        {i === 12 && (
                          <div 
                            className="absolute -right-0.5 w-2 h-2 rounded-full bg-white shadow-lg animate-ping z-20"
                            style={{ top: `${bodyTop}%` }}
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* Dotted live price line across chart */}
                  <div className="absolute top-[8%] left-0 right-0 border-t border-dotted border-[#0ba259] opacity-70 pointer-events-none"></div>
                </div>
              </div>

              {/* Right trade panel with authentic BUY and SELL buttons */}
              <div className="w-28 bg-[#1a212e] rounded p-1.5 flex flex-col justify-between shrink-0 relative text-[10px] border border-[#263143]">
                <div className="flex items-center justify-between bg-[#252f40] px-1.5 py-1 rounded">
                  <div className="flex items-center gap-1">
                    <span>🇨🇦</span>
                    <span className="font-bold text-[9px]">USD/CAD</span>
                  </div>
                  <span className="text-[#0ba259] font-bold text-[9px]">89%</span>
                </div>

                <div className="bg-[#12161f] p-1 rounded text-center text-gray-300 font-mono text-[9px] border border-[#252f40]">
                  00:00:05
                </div>

                <div className="bg-[#12161f] p-1 rounded text-center text-white font-bold text-[9px] border border-[#252f40]">
                  10 $
                </div>

                {/* Quotex authentic BUY & SELL buttons */}
                <div className="flex flex-col gap-1">
                  <div className="w-full bg-[#0ba259] h-5 rounded flex items-center justify-between px-1.5 text-white font-black text-[9px] shadow-sm">
                    <span>BUY</span>
                    <span className="text-[8px]">▲</span>
                  </div>
                  <div className="w-full bg-[#c83944] h-5 rounded flex items-center justify-between px-1.5 text-white font-black text-[9px] shadow-sm">
                    <span>SELL</span>
                    <span className="text-[8px]">▼</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#17202f] border border-[#28354a] rounded-lg py-2.5 px-3.5 mb-4 text-xs text-gray-300 flex items-center justify-center gap-2">
            <span>💡</span>
            <span>Next, we’ll show you how to start trading — from asset to deal.</span>
          </div>

          <button
            onClick={() => setStep('HOW_TO_START')}
            className="w-full bg-[#1e88e5] hover:bg-[#1976d2] active:scale-[0.98] text-white font-bold py-3.5 rounded-lg text-[15px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1e88e5]/20"
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 4: HOW TO START TRADING? (IMAGE 4)
  // "JO SELECT PAIR HAI USHPER USER CLCIK KARE TOA USHKE SAMNE SARE PAIR KHUL JAYE KOI EK CHOOSE KARNE KE LIYE"
  // -------------------------------------------------------------
  if (currentStep === 'HOW_TO_START') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-[480px] bg-[#1d222d] border border-[#2e3748] rounded-2xl shadow-2xl p-6 text-white overflow-hidden">
          {/* Close button */}
          <button 
            onClick={handleWelcomeClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5 z-20"
          >
            <X size={20} />
          </button>

          {/* Heading */}
          <h2 className="text-2xl font-black text-white tracking-tight mb-2 text-center">
            How to Start Trading?
          </h2>

          <p className="text-[13px] text-gray-300 leading-relaxed mb-4 text-center px-2">
            Choose your first trading asset from the list. Each asset has its own <strong className="text-white font-bold">profit %</strong> and <strong className="text-white font-bold">volatility</strong>, and you can switch anytime.
          </p>

          {/* If showFullAssetList is TRUE, show ALL pairs with search & category filters */}
          {showFullAssetList ? (
            <div className="bg-[#151a24] border border-[#283244] rounded-xl p-3.5 mb-4 text-left animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[380px]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#283244]">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Select Any Trading Pair
                </span>
                <button 
                  onClick={() => setShowFullAssetList(false)}
                  className="text-xs text-[#2185d0] hover:text-[#42a5f5] font-semibold"
                >
                  View Simple
                </button>
              </div>

              {/* Category tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 custom-scrollbar shrink-0">
                {(['ALL', 'CURRENCIES', 'CRYPTO', 'COMMODITIES', 'STOCKS'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setSelectedAssetTab(tab)}
                    className={`px-2.5 py-1 rounded text-[10px] font-black tracking-wide whitespace-nowrap transition-colors ${
                      selectedAssetTab === tab 
                        ? 'bg-[#1e88e5] text-white' 
                        : 'bg-[#202736] text-gray-400 hover:text-white hover:bg-[#283448]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="flex items-center gap-2 bg-[#202736] px-3 py-1.5 rounded-lg text-xs text-gray-300 mb-2 border border-[#2c364a] shrink-0">
                <Search size={14} className="text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search pairs (e.g. USD, BTC, EUR)..."
                  value={assetSearchQuery}
                  onChange={(e) => setAssetSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-full"
                  autoFocus
                />
                {assetSearchQuery && (
                  <button onClick={() => setAssetSearchQuery('')} className="text-gray-400 hover:text-white">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Table header */}
              <div className="flex justify-between text-[11px] font-bold text-gray-400 px-2 pb-1.5 border-b border-[#283244] shrink-0">
                <span>Asset Name</span>
                <span>Profit Payout</span>
              </div>

              {/* Scrollable list of ALL pairs */}
              <div className="divide-y divide-[#232b3a] overflow-y-auto custom-scrollbar flex-1 pr-1">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => handlePickAsset(asset)}
                    className="flex items-center justify-between py-2 px-2 hover:bg-[#1e2736] rounded cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <AssetIcon asset={asset} />
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-white group-hover:text-[#1e88e5] transition-colors">
                          {asset.name}
                        </span>
                        <span className="text-[9px] text-gray-400">{asset.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-[#0ba259] bg-[#0ba259]/10 px-2 py-0.5 rounded">
                        +{asset.profit1m}%
                      </span>
                      <ChevronRight size={14} className="text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
                {filteredAssets.length === 0 && (
                  <div className="py-6 text-center text-xs text-gray-400">
                    No pairs matching "{assetSearchQuery}"
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Simple Asset Preview Card matching Image 4 */
            <div className="bg-[#151a24] border border-[#283244] rounded-xl p-3.5 mb-4 text-left relative">
              <div 
                onClick={() => setShowFullAssetList(true)}
                className="flex items-center justify-between gap-2 bg-[#202736] px-3 py-2 rounded-lg text-xs text-gray-400 mb-3 border border-[#2c364a] cursor-pointer hover:border-[#1e88e5] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-gray-400 group-hover:text-[#1e88e5]" />
                  <span className="group-hover:text-white">Click here to search all pairs...</span>
                </div>
                <span className="text-[10px] bg-[#1e88e5]/20 text-[#60a5fa] px-1.5 py-0.5 rounded font-bold">
                  Browse 30+
                </span>
              </div>

              <div className="flex justify-between text-[11px] font-bold text-gray-400 px-2 pb-1.5 border-b border-[#283244]">
                <span>Name</span>
                <span>Profit</span>
              </div>

              <div className="divide-y divide-[#232b3a] text-xs">
                {QUOTEX_ASSETS.slice(0, 4).map((asset) => (
                  <div 
                    key={asset.id}
                    onClick={() => handlePickAsset(asset)}
                    className="flex items-center justify-between py-2 px-2 hover:bg-white/5 rounded cursor-pointer transition-colors group"
                    title={`Click to trade with ${asset.name}`}
                  >
                    <div className="flex items-center gap-2">
                      <AssetIcon asset={asset} />
                      <span className="font-semibold text-white group-hover:text-[#1e88e5] transition-colors">
                        {asset.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#f59e0b] group-hover:text-[#0ba259] transition-colors">
                        {asset.profit1m}%
                      </span>
                      <ChevronRight size={14} className="text-gray-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hint banner */}
          <div className="bg-[#17202f] border border-[#28354a] rounded-lg py-2.5 px-3.5 mb-4 text-xs text-gray-300 flex items-center justify-center gap-2">
            <span>💡</span>
            <span>Let’s pick your first asset together. Click any pair or the button below.</span>
          </div>

          {/* Action button: opens all pairs or chooses current */}
          <button
            onClick={() => {
              if (!showFullAssetList) {
                setShowFullAssetList(true);
              } else {
                handlePickAsset(filteredAssets[0] || QUOTEX_ASSETS[0]);
              }
            }}
            className="w-full bg-[#1e88e5] hover:bg-[#1976d2] active:scale-[0.98] text-white font-bold py-3.5 rounded-lg text-[15px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1e88e5]/20"
          >
            <span>{showFullAssetList ? 'Choose Top Pair & Continue' : 'Select Asset / View All Pairs'}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 5: MAKE YOUR FIRST PREDICTION (IMAGE 5)
  // "FIR OPEN TRADE KARTE HI TIME AUR INVESTMENT KE LEFT SIDE MA OO KHULE"
  // Real market candlestick wicks & bodies + authentic BUY & SELL badges
  // -------------------------------------------------------------
  if (currentStep === 'FIRST_PREDICTION') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-[440px] bg-[#1d222d] border border-[#2e3748] rounded-2xl shadow-2xl p-6 text-center text-white overflow-hidden">
          <button 
            onClick={handleWelcomeClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            Make Your First Prediction
          </h2>

          <p className="text-[13px] text-gray-300 leading-relaxed mb-4 px-2">
            Your goal is to predict the direction of the price. Click <strong className="text-[#0ba259] font-bold">BUY</strong> if you think it will rise, or <strong className="text-[#e33f4a] font-bold">SELL</strong> if you think it will fall.
          </p>

          {/* Selected pair notification badge */}
          {selectedAsset && (
            <div className="flex items-center justify-center gap-2 mb-3 bg-[#17202f] border border-[#28354a] py-1.5 px-3 rounded-full text-xs text-gray-300 w-fit mx-auto">
              <span className="text-gray-400">Trading Pair:</span>
              <AssetIcon asset={selectedAsset} />
              <strong className="text-white font-bold">{selectedAsset.name}</strong>
              <span className="text-[#0ba259] font-black">+{selectedAsset.profit1m}%</span>
            </div>
          )}

          {/* Real Candlestick Prediction Graphic with Green / Red Trajectories and '?' */}
          <div className="bg-[#0b0e14] border border-[#252f40] rounded-xl p-4 mb-4 relative overflow-hidden h-48 flex flex-col justify-end shadow-inner">
            {/* Horizontal subtle price grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-3 pointer-events-none opacity-20">
              <div className="border-b border-[#3b475e] border-dashed w-full"></div>
              <div className="border-b border-[#3b475e] border-dashed w-full"></div>
              <div className="border-b border-[#3b475e] border-dashed w-full"></div>
            </div>

            <div className="relative z-10 flex items-end justify-start gap-1.5 h-36 pl-1">
              {/* Real financial candlesticks with authentic high-low wicks */}
              {[
                { open: 26, high: 38, low: 20, close: 34, isGreen: true },
                { open: 34, high: 48, low: 30, close: 44, isGreen: true },
                { open: 44, high: 50, low: 36, close: 40, isGreen: false },
                { open: 40, high: 56, low: 36, close: 52, isGreen: true },
                { open: 52, high: 64, low: 48, close: 60, isGreen: true },
                { open: 60, high: 66, low: 48, close: 54, isGreen: false },
                { open: 54, high: 74, low: 50, close: 70, isGreen: true },
                { open: 70, high: 88, low: 68, close: 84, isGreen: true },
              ].map((c, i) => {
                const candleColor = c.isGreen ? '#0ba259' : '#e33f4a';
                const wickTop = 100 - c.high;
                const wickBottom = c.low;
                const bodyTop = 100 - Math.max(c.open, c.close);
                const bodyHeight = Math.max(5, Math.abs(c.close - c.open));

                return (
                  <div key={i} className="relative flex flex-col items-center justify-center w-3 h-full">
                    {/* Wick */}
                    <div 
                      className="absolute w-[1.5px]"
                      style={{
                        top: `${wickTop}%`,
                        bottom: `${wickBottom}%`,
                        backgroundColor: candleColor
                      }}
                    />
                    {/* Body */}
                    <div 
                      className="absolute w-2.5 rounded-[1px] z-10"
                      style={{
                        top: `${bodyTop}%`,
                        height: `${bodyHeight}%`,
                        backgroundColor: candleColor,
                        boxShadow: c.isGreen ? '0 0 6px rgba(11,162,89,0.35)' : '0 0 6px rgba(227,63,74,0.35)'
                      }}
                    />
                    {/* Live glowing pulse on the peak candle */}
                    {i === 7 && (
                      <div 
                        className="absolute -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping z-20 shadow-lg"
                        style={{ top: `${bodyTop}%` }}
                      />
                    )}
                  </div>
                );
              })}

              {/* Trajectory paths & BUY / SELL Buttons with question mark */}
              <div className="relative flex-1 h-full flex flex-col justify-between py-1 pl-3">
                {/* UP / BUY prediction path */}
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 border-t-2 border-dashed border-[#0ba259] relative">
                    <div className="absolute -right-1.5 -top-1 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-[#0ba259]"></div>
                  </div>
                  <div className="px-2.5 py-1 bg-[#0ba259] rounded flex items-center justify-center gap-1 text-white font-black text-[11px] shadow-md shadow-[#0ba259]/30">
                    <span className="text-[9px]">▲</span>
                    <span>BUY</span>
                  </div>
                </div>

                {/* Big Question mark in center */}
                <div className="text-center font-black text-2xl text-white/90 pl-4 drop-shadow-md">
                  ?
                </div>

                {/* DOWN / SELL prediction path */}
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 border-t-2 border-dashed border-[#e33f4a] relative">
                    <div className="absolute -right-1.5 -top-1 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-[#e33f4a]"></div>
                  </div>
                  <div className="px-2.5 py-1 bg-[#e33f4a] rounded flex items-center justify-center gap-1 text-white font-black text-[11px] shadow-md shadow-[#e33f4a]/30">
                    <span className="text-[9px]">▼</span>
                    <span>SELL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#17202f] border border-[#28354a] rounded-lg py-2.5 px-3.5 mb-4 text-xs text-gray-300 flex items-center justify-center gap-2">
            <span>💡</span>
            <span>Click below to see where to set time, amount, and place your trade!</span>
          </div>

          {/* Open Your First Trade Button -> Opens Step 6 strictly to the left of Time & Investment */}
          <button
            onClick={() => setStep('SET_PARAMETERS')}
            className="w-full bg-[#1e88e5] hover:bg-[#1976d2] active:scale-[0.98] text-white font-bold py-3.5 rounded-lg text-[15px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1e88e5]/20"
          >
            <span>Open Your First Trade</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 6: SET TRADE PARAMETERS (EXACT IMAGE 1 - STEP 1 OF 2)
  // Perfectly matched to Image 1: background #4a5369, red graph icon, exact typography & pointer
  // Docked directly to the left of Time & Investment in the right trading panel
  // -------------------------------------------------------------
  if (currentStep === 'SET_PARAMETERS') {
    return (
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {/* Backdrop covers ONLY the left chart area, leaving the right 300px sidebar completely unblocked */}
        <div 
          className="fixed inset-y-0 left-0 right-0 md:right-[300px] bg-black/45 pointer-events-auto transition-opacity" 
          onClick={handleFinishTutorial} 
        />

        {/* Tooltip positioned directly to the LEFT of Time and Investment (Exact Image 1) */}
        <div 
          style={panelPos ? { left: `${panelPos.left}px`, top: `${panelPos.top}px` } : undefined}
          className={`fixed z-10 pointer-events-auto w-[340px] max-w-[calc(100vw-24px)] bg-[#4a5369] border border-[#5a6582]/40 rounded-xl shadow-2xl p-4 text-white animate-in fade-in duration-100 ${
            !panelPos ? 'inset-x-4 bottom-16 md:bottom-auto md:right-[308px] md:top-[145px]' : ''
          }`}
        >
          {/* Triangular Right Arrow Pointer seamlessly pointing straight to Time & Investment on the right sidebar */}
          <div 
            style={panelPos ? { top: `${panelPos.arrowTop}px` } : undefined}
            className={`hidden md:block absolute -right-[9px] -translate-y-1/2 w-0 h-0 border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent border-l-[9px] border-l-[#4a5369] drop-shadow-md ${
              !panelPos ? 'top-[52%]' : ''
            }`}
          />

          {/* Header (Exact Image 1: white box with red graph line + title + close) */}
          <div className="flex items-center justify-between mb-3.5 border-b border-[#5c6885]/40 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-[20px] h-[20px] bg-white border border-[#2b3345] rounded-[3px] flex items-center justify-center shadow-sm shrink-0">
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
                  <path d="M2 12.5L6.5 8L9.5 11L14 4" stroke="#e33f4a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-[16px] text-white tracking-tight">Set Trade Parameters</h3>
            </div>
            <button 
              onClick={handleFinishTutorial}
              className="text-gray-300 hover:text-white transition-colors p-0.5"
            >
              <X size={19} strokeWidth={2.4} />
            </button>
          </div>

          {/* Body (Exact Image 1 text, bullets, and tip) */}
          <div className="text-[13px] text-[#d6dbe4] mb-4 leading-relaxed">
            <p className="font-bold text-white text-[14px] mb-2.5">Before placing a trade:</p>
            <ul className="space-y-1.5 text-[13px] text-[#d6dbe4] mb-3.5">
              <li className="flex items-start gap-2.5">
                <span className="text-[12px] leading-none mt-1 text-[#cbd5e1]">•</span>
                <span>Choose <strong className="text-white font-bold">Time</strong> (trade duration)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[12px] leading-none mt-1 text-[#cbd5e1]">•</span>
                <span>Set <strong className="text-white font-bold">Amount</strong> (your investment)</span>
              </li>
            </ul>

            {/* Lightbulb Hint from Image 1 */}
            <div className="text-[13px] text-[#d6dbe4] leading-relaxed flex items-start gap-1.5">
              <span className="text-[14px] leading-none mt-0.5 shrink-0">💡</span>
              <span><strong className="text-white font-bold">Start small</strong> — you can always increase later as you gain confidence.</span>
            </div>
          </div>

          {/* Step 1 of 2 Pagination & Navigation (Exact Image 1: < chevron, STEP 1 OF 2, dots, > chevron) */}
          <div className="flex items-center justify-between pt-1">
            <button 
              onClick={() => setStep('FIRST_PREDICTION')}
              className="w-9 h-8 rounded-lg bg-[#556079] hover:bg-[#626e8a] text-gray-200 hover:text-white flex items-center justify-center transition-colors shadow-sm"
              title="Previous Step"
            >
              <ChevronLeft size={19} strokeWidth={2.4} />
            </button>

            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-white">
                STEP 1 OF 2
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <div className="w-2 h-2 rounded-full bg-[#7a86a3]"></div>
              </div>
            </div>

            <button 
              onClick={() => setStep('CHOOSE_DIRECTION')}
              className="w-9 h-8 rounded-lg bg-[#556079] hover:bg-[#626e8a] text-gray-200 hover:text-white flex items-center justify-center transition-colors shadow-sm"
              title="Next Step"
            >
              <ChevronRight size={19} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 7: CHOOSE TRADE DIRECTION (EXACT IMAGE 2 - STEP 2 OF 2)
  // Perfectly matched to Image 2: background #4a5369, bullseye icon, green ▲ and red ▼ triangles, exact pointer
  // Positioned directly to the LEFT of BUY & SELL buttons
  // -------------------------------------------------------------
  if (currentStep === 'CHOOSE_DIRECTION') {
    return (
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {/* Backdrop covers ONLY the left chart area, leaving the right 300px sidebar completely unblocked */}
        <div 
          className="fixed inset-y-0 left-0 right-0 md:right-[300px] bg-black/45 pointer-events-auto transition-opacity" 
          onClick={handleFinishTutorial} 
        />

        {/* Tooltip positioned directly to the LEFT of BUY and SELL buttons (Exact Image 2) */}
        <div 
          style={panelPos ? { left: `${panelPos.left}px`, top: `${panelPos.top}px` } : undefined}
          className={`fixed z-10 pointer-events-auto w-[340px] max-w-[calc(100vw-24px)] bg-[#4a5369] border border-[#5a6582]/40 rounded-xl shadow-2xl p-4 text-white animate-in fade-in duration-100 ${
            !panelPos ? 'inset-x-4 bottom-16 md:bottom-auto md:right-[308px] md:top-[300px]' : ''
          }`}
        >
          {/* Triangular Right Arrow Pointer pointing directly to BUY & SELL buttons on the right sidebar */}
          <div 
            style={panelPos ? { top: `${panelPos.arrowTop}px` } : undefined}
            className={`hidden md:block absolute -right-[9px] -translate-y-1/2 w-0 h-0 border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent border-l-[9px] border-l-[#4a5369] drop-shadow-md ${
              !panelPos ? 'top-[45%]' : ''
            }`}
          />

          {/* Header (Exact Image 2: Dartboard/Target icon 🎯 + title + close) */}
          <div className="flex items-center justify-between mb-3.5 border-b border-[#5c6885]/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none select-none shrink-0">🎯</span>
              <h3 className="font-bold text-[16px] text-white tracking-tight">Choose Trade Direction</h3>
            </div>
            <button 
              onClick={handleFinishTutorial}
              className="text-gray-300 hover:text-white transition-colors p-0.5"
            >
              <X size={19} strokeWidth={2.4} />
            </button>
          </div>

          {/* Body (Exact Image 2 text, green ▲, red ▼, and demo notice) */}
          <div className="text-[13px] text-[#d6dbe4] mb-4 leading-relaxed">
            <p className="text-[14px] text-white leading-relaxed mb-3.5">
              Click the <span className="text-[#00c853] font-bold text-base inline-block mx-0.5">▲</span> if you think the price will rise, or <span className="text-[#ff3d00] font-bold text-base inline-block mx-0.5">▼</span> if you think it will fall.
            </p>

            <div className="text-[13px] text-[#d6dbe4] leading-relaxed">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[14px] leading-none shrink-0">💡</span>
                <span>Select <strong className="text-white font-bold">Up</strong> or <strong className="text-white font-bold">Down</strong> to continue.</span>
              </div>
              <p className="italic text-[#9aa6be] text-[12px] pl-5">
                This is a demo — no risk involved.
              </p>
            </div>
          </div>

          {/* Step 2 of 2 Pagination & Navigation (Exact Image 2: < chevron, STEP 2 OF 2, dots, > chevron) */}
          <div className="flex items-center justify-between pt-1">
            <button 
              onClick={() => setStep('SET_PARAMETERS')}
              className="w-9 h-8 rounded-lg bg-[#556079] hover:bg-[#626e8a] text-gray-200 hover:text-white flex items-center justify-center transition-colors shadow-sm"
              title="Previous Step"
            >
              <ChevronLeft size={19} strokeWidth={2.4} />
            </button>

            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-white">
                STEP 2 OF 2
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#7a86a3]"></div>
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>

            {/* Step 2 of 2: Right chevron disabled matching exact User Image 2 */}
            <button 
              disabled={true}
              className="w-9 h-8 rounded-lg bg-[#3d465c]/40 text-gray-500 opacity-40 cursor-not-allowed pointer-events-none select-none flex items-center justify-center shadow-sm"
              title="Click BUY or SELL on the right sidebar to place your trade"
            >
              <ChevronRight size={19} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 8: YOUR TRADE RESULT (EXACT USER IMAGE 4)
  // Shows Loss (0 $) or Profit (+1.85 $), realistic candlestick card,
  // demo guidance note, tip pill, and "What's Next? — Explore More Tools →"
  // -------------------------------------------------------------
  if (currentStep === 'TRADE_RESULT') {
    const isWin = tradeResult?.status === 'WIN' || (tradeResult?.pnl && tradeResult.pnl > 0);
    const assetDisplayName = tradeResult?.asset || selectedAsset?.name || 'EUR/CHF (OTC)';
    const resultPnlText = isWin 
      ? `+${(tradeResult?.pnl > 0 ? tradeResult.pnl : 1.85).toFixed(2)} $`
      : '0 $';

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-[430px] bg-[#272d3e] border border-[#3c4860] rounded-2xl shadow-2xl p-6 text-white overflow-hidden">
          {/* Close button */}
          <button 
            onClick={handleFinishTutorial}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5 z-20"
          >
            <X size={20} />
          </button>

          {/* Heading (Exact Image 4) */}
          <h2 className="text-xl font-bold text-center text-white tracking-tight mb-2.5">
            Your Trade Result
          </h2>

          {/* Subtitle / Explanation (Exact Image 4) */}
          <p className="text-[13px] text-[#cbd3e1] text-center leading-relaxed mb-4 px-1">
            {isWin ? (
              <>
                Congratulations! Your prediction worked out — it appears in <span className="inline-flex items-center gap-1 font-bold text-white"><span className="w-2 h-2 rounded-full bg-[#0ba259] inline-block"></span> Green</span> on the chart. You've earned profit on this trade!
              </>
            ) : (
              <>
                This time your prediction didn't work out — it appears in <span className="inline-flex items-center gap-1 font-bold text-white"><span className="w-2 h-2 rounded-full bg-[#e33f4a] inline-block"></span> Red</span> on the chart. Losses are part of trading, and that's why demo is here — to practice safely.
              </>
            )}
          </p>

          {/* Blue Info Callout (Exact Image 4) */}
          <div className="bg-[#1d273a] border border-[#2b3a56] rounded-xl p-3 flex items-start gap-2.5 mb-3.5 text-left">
            <div className="w-4 h-4 rounded-full bg-[#1e88e5] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
              i
            </div>
            <p className="text-[12px] text-[#b0c0d8] leading-relaxed">
              On your demo account you can place unlimited trades without risk to practice and gain confidence.
            </p>
          </div>

          {/* Candlestick Chart Graphic Card (Exact Image 2 / Image 4) */}
          <div className="bg-[#121620] border border-[#263143] rounded-xl p-3 mb-3 relative overflow-hidden h-44 flex flex-col justify-between shadow-inner">
            {/* Header: Asset with icon (Exact Image 2: blue dot + red cross + EUR/CHF (OTC)) */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5 text-xs text-white/90 font-bold bg-[#1e2535] py-1 px-2 rounded-md border border-[#2d394e]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1e88e5]"></span>
                <span className="text-gray-300 font-bold text-xs leading-none">+</span>
                <span className="tracking-tight">{assetDisplayName}</span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">1 min</span>
            </div>

            {/* REAL MARKET LIVE CANDLESTICKS ENGINE BEHIND RESULT BADGE (Realistic financial market simulation) */}
            <div className="absolute inset-x-0 top-7 bottom-5 z-0 opacity-85 pointer-events-none">
              <LiveMarketCandlesticks count={18} speedMs={500} showPriceLine={true} />
            </div>

            {/* Center Result Badge (Exact Image 2 / Image 4) */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className={`px-7 py-3 rounded-2xl text-center shadow-2xl border ${
                isWin 
                  ? 'bg-[#0ba259] border-[#0ea960] shadow-[#0ba259]/40' 
                  : 'bg-[#d94436] border-[#ea4e40] shadow-[#d94436]/40'
              }`}>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/95 mb-0.5">
                  YOUR RESULT (P/L)
                </div>
                <div className="text-2xl font-black text-white tracking-tight">
                  {resultPnlText}
                </div>
              </div>
            </div>

            {/* Bottom time marker */}
            <div className="flex justify-between items-center z-10 text-[9px] text-gray-500 font-mono pt-1">
              <span>Entry: 1.08420</span>
              <span>Closed</span>
            </div>
          </div>

          {/* Tip Pill (Exact Image 4) */}
          <div className="bg-[#1f2637] border border-[#2e394e] rounded-lg py-2 px-3 text-center text-[11px] text-gray-300 mb-4 flex items-center justify-center gap-1.5">
            <span className="text-[13px]">💡</span>
            <span>Next, discover tools to sharpen your analysis and strategy.</span>
          </div>

          {/* Primary Action Button (Exact Image 4: What's Next? — Explore More Tools →) */}
          <button
            onClick={() => setStep('EXPLORE_PLATFORM_READY')}
            className="w-full bg-[#0070e0] hover:bg-[#0062c4] active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl text-[14px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0070e0]/25"
          >
            <span>What's Next? — Explore More Tools</span>
            <ChevronRight size={18} strokeWidth={2.6} />
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STEP 9: YOU'RE READY TO EXPLORE THE PLATFORM (EXACT USER IMAGE 3 / IMAGE 5)
  // Candlestick board running real market candles + Realistic 3D Rocket taking off
  // "You’re ready to explore the platform", help callout, and green "Start Trading" button
  // -------------------------------------------------------------
  if (currentStep === 'EXPLORE_PLATFORM_READY') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-[410px] bg-[#262c3c] border border-[#394358] rounded-2xl shadow-2xl p-6 text-white text-center overflow-hidden">
          {/* Close button */}
          <button 
            onClick={handleFinishTutorial}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5 z-20"
          >
            <X size={20} />
          </button>

          {/* Illustration: Real Market Candlestick Tablet Card with Realistic 3D Rocket (Exact Image 3) */}
          <div className="w-52 h-36 mx-auto mb-3 relative flex items-center justify-center">
            {/* Background tilted chart tablet running REAL market candles */}
            <div className="w-40 h-24 bg-[#121824] border border-[#2d3a52] rounded-xl shadow-2xl relative overflow-hidden flex flex-col justify-between p-1.5 rotate-[-5deg]">
              <div className="flex items-center justify-between text-[8.5px] text-gray-400 font-mono px-1">
                <span className="text-[#1e88e5] font-bold">EUR/USD</span>
                <span className="text-[#0ba259] font-bold">+87%</span>
              </div>
              <div className="relative w-full h-16 overflow-hidden">
                <LiveMarketCandlesticks count={10} speedMs={650} showPriceLine={false} />
              </div>
            </div>

            {/* Realistic 3D Rocket blasting off toward top-right (Matching Image 3 exactly) */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <svg 
                width="105" 
                height="105" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] transform translate-x-2 -translate-y-1"
              >
                <g transform="rotate(45 50 50)">
                  {/* Rocket Engine Flame (Vibrant Orange outer + Golden Yellow core with flicker) */}
                  <path 
                    d="M 43 68 C 36 78, 44 94, 50 99 C 56 94, 64 78, 57 68 Z" 
                    fill="url(#rocket-flame-outer)" 
                    className="animate-pulse"
                  />
                  <path 
                    d="M 46 68 C 42 74, 46 86, 50 91 C 54 86, 58 74, 54 68 Z" 
                    fill="url(#rocket-flame-inner)" 
                  />

                  {/* Left Swept Wing / Fin (Emerald Green - Exact Image 3) */}
                  <path 
                    d="M 39 52 C 22 56, 21 68, 38 68 Z" 
                    fill="#00c853" 
                    stroke="#009624" 
                    strokeWidth="1" 
                  />

                  {/* Right Fin (Subtle back perspective) */}
                  <path 
                    d="M 61 52 C 70 56, 69 68, 62 68 Z" 
                    fill="#00a844" 
                  />

                  {/* Rocket Fuselage (Aerodynamic Glossy White Body with 3D Depth) */}
                  <path 
                    d="M 40 68 C 36 50, 36 32, 50 18 C 64 32, 64 50, 60 68 Z" 
                    fill="url(#rocket-body-grad)" 
                    stroke="#cbd5e1" 
                    strokeWidth="0.8" 
                  />

                  {/* Blue Top Nosecone Cap (Cobalt Blue - Exact Image 3) */}
                  <path 
                    d="M 42 32 C 45 24, 47 20, 50 18 C 53 20, 55 24, 58 32 C 53 34, 47 34, 42 32 Z" 
                    fill="#0088ff" 
                  />

                  {/* Circular Eye / Porthole Window (Exact Image 3) */}
                  {/* Outer Cyan Ring */}
                  <circle cx="50" cy="44" r="11" fill="#0088ff" stroke="#38bdf8" strokeWidth="2" />
                  {/* Dark Pupil */}
                  <circle cx="50" cy="44" r="8" fill="#0b1320" />
                  {/* Specular White Reflection Glint */}
                  <circle cx="47.5" cy="41.5" r="2.2" fill="#ffffff" />
                </g>

                <defs>
                  <linearGradient id="rocket-body-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="40%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                  <linearGradient id="rocket-flame-outer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff7a00" />
                    <stop offset="100%" stopColor="#ff3d00" />
                  </linearGradient>
                  <linearGradient id="rocket-flame-inner" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffea00" />
                    <stop offset="100%" stopColor="#ffab00" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Heading (Exact Image 5) */}
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            You’re ready to explore the platform
          </h2>

          {/* Description (Exact Image 5) */}
          <p className="text-[13px] text-[#b8c2d3] leading-relaxed mb-5 max-w-[320px] mx-auto">
            Keep practicing on demo or switch to real trading anytime from the account menu in the top bar.
          </p>

          {/* Info Callout: Need help? (Exact Image 5) */}
          <div className="bg-[#1d273a] border border-[#2b3a56] rounded-xl py-2.5 px-3.5 mb-5 flex items-center justify-center gap-2 text-xs text-[#a9bbd8]">
            <div className="w-4 h-4 rounded-full bg-[#1e88e5] text-white flex items-center justify-center text-[10px] font-black shrink-0">
              i
            </div>
            <span>Need help? Go to Support in the sidebar.</span>
          </div>

          {/* Start Trading Green Button (Exact Image 5) */}
          <button
            onClick={handleFinishTutorial}
            className="w-full bg-[#00c853] hover:bg-[#00b048] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-[15px] transition-all flex items-center justify-center shadow-lg shadow-[#00c853]/25"
          >
            Start Trading
          </button>
        </div>
      </div>
    );
  }

  return null;
}
