import QuotexLanguageDropdown from '../src/components/QuotexLanguageDropdown';
import { useLanguage } from '../src/context/LanguageContext';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, Shield, Zap, Award, ArrowRight, TrendingUp, TrendingDown, 
  Monitor, Activity, Headphones, Gift, CreditCard, Star, Users, 
  BarChart, Clock, CheckCircle2, Play, Apple, Smartphone, Plus, Minus,
  ChevronDown, ChevronUp, Info, Bell, Volume2, Maximize2, Settings,
  HelpCircle, Trophy, ShoppingBag, MoreHorizontal, User, Check, X,
  ArrowUp, ArrowDown, ChevronRight, ChevronLeft, MessageSquare, Flame,
  Share2, Crosshair, HeartPulse, Handshake, DollarSign, Wallet,
  Sliders, Menu, Diamond
} from 'lucide-react';
import Footer from '../src/components/Footer';

export default function Landing() {
  const navigate = useNavigate();
  const [showLang, setShowLang] = useState(false);
  const [lang, setLang] = useState('EN');

  // Chart candles simulation
  const [mockCandles, setMockCandles] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState(43.9919);
  
  // Interactive Hero Preview Controls
  const [pendingTradeEnabled, setPendingTradeEnabled] = useState(false);
  const [heroTradeAmount, setHeroTradeAmount] = useState(15);
  const [heroTradeTime, setHeroTradeTime] = useState('00:00:05');
  const [heroActiveTab, setHeroActiveTab] = useState<'TRADES' | 'ORDERS'>('TRADES');

  // Mouse wheel and scroll slide-up state for platform tab (to slide over login/register buttons)
  const [scrollSlide, setScrollSlide] = useState(0);
  const [isTabSlidUp, setIsTabSlidUp] = useState(false);

  // Interactive Prediction Simulator (Section 5 - Image 5)
  const [predictionChoice, setPredictionChoice] = useState<'UP' | 'DOWN' | null>(null);
  const [predictionState, setPredictionState] = useState<'idle' | 'simulating' | 'win'>('idle');

  // Interactive Reviews Modal & Expansion (Section 6 - Image 6)
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);

  // Interactive FAQ Accordion (Section 7 - Image 7)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const toggleLang = (l: string) => {
    setLang(l);
    setShowLang(false);
  };

  // Scroll listener to smoothly slide platform tab up over registration/login buttons
  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY;
      const offset = Math.min(Math.max(top * 0.9, 0), 180);
      setScrollSlide(offset);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHeroWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 15 && !isTabSlidUp) {
      setIsTabSlidUp(true);
    } else if (e.deltaY < -15 && window.scrollY < 30 && isTabSlidUp) {
      setIsTabSlidUp(false);
    }
  };

  useEffect(() => {
    let price = 44.0000;
    // 50 professional candlesticks: prominent bodies, mostly short tight wicks, with selective longer wicks
    const initial = Array.from({ length: 50 }).map((_, i) => {
       const open = price;
       const dir = (i % 3 === 0 || i % 7 === 0 || i % 11 === 0) ? -1 : 1;
       // Prominent solid body movement
       const move = dir * (0.0016 + Math.random() * 0.0028);
       const close = open + move;
       
       // Selective long wick on every 5th or 8th candle; other candles have tight short wicks
       const isLongWick = (i % 5 === 0 || i % 8 === 0);
       const wick = isLongWick 
         ? (0.0016 + Math.random() * 0.0014) 
         : (0.00025 + Math.random() * 0.00030);

       const high = Math.max(open, close) + wick;
       const low = Math.min(open, close) - wick;
       price = close;
       return { open, close, high, low, isLongWick };
    });
    setMockCandles(initial);
    setCurrentPrice(price);

    const interval = setInterval(() => {
       setMockCandles(prev => {
          if(prev.length === 0) return prev;
          const newCandles = [...prev];
          const last = { ...newCandles[newCandles.length - 1] };
          const move = (Math.random() - 0.49) * 0.0008;
          last.close += move;
          if (last.close > last.high) last.high = last.close;
          if (last.close < last.low) last.low = last.close;
          newCandles[newCandles.length - 1] = last;
          setCurrentPrice(last.close);
          return newCandles;
       });
    }, 120);

    const addInterval = setInterval(() => {
       setMockCandles(prev => {
          const newCandles = [...prev.slice(1)];
          const lastClose = prev[prev.length - 1].close;
          const nextMove = (Math.random() - 0.49) * 0.0020;
          newCandles.push({
             open: lastClose,
             close: lastClose + nextMove,
             high: Math.max(lastClose, lastClose + nextMove) + 0.0010,
             low: Math.min(lastClose, lastClose + nextMove) - 0.0010
          });
          return newCandles;
       });
    }, 2400);

    return () => { clearInterval(interval); clearInterval(addInterval); };
  }, []);

  // Center candles dynamically in the vertical middle of the chart canvas
  const candleLows = mockCandles.map(c => c?.low || 0);
  const candleHighs = mockCandles.map(c => c?.high || 0);
  const rawMin = candleLows.length > 0 ? Math.min(...candleLows) : 43.9850;
  const rawMax = candleHighs.length > 0 ? Math.max(...candleHighs) : 44.0150;
  const spread = Math.max(rawMax - rawMin, 0.0070);
  const minPrice = rawMin - spread * 0.35;
  const maxPrice = rawMax + spread * 0.35;
  const range = maxPrice - minPrice || 1;
  const getY = (val: number) => 100 - ((val - minPrice) / range) * 100;

  // Fixed #1 Review (Image 3 - Strictly never changes, always fixed at #1)
  const FIXED_FIRST_REVIEW = {
    id: 1,
    name: 'Rahima',
    date: '29.01.2025',
    earned: '$8400',
    rating: 5,
    shortText: 'As a beginner, I really appreciated the demo account. It let me experiment with different indicators and strategies without the fear of...',
    fullText: 'As a beginner, I really appreciated the demo account. It let me experiment with different indicators and strategies without the fear of losing money. The platform feels very intuitive and modern, and when I switched to a live account, the withdrawal of my first profit was completed within hours. Truly the best platform I have used.'
  };

  // Rotating Pool of Verified Top-Tier Trader Reviews
  // Changes dynamically every 1 day, always ensuring >= 6 cards shown (never less than Image 3)
  const DYNAMIC_REVIEWS_POOL = [
    {
      id: 2,
      name: 'Terwase',
      date: '03.12.2024',
      earned: '$913',
      rating: 5,
      shortText: 'The interface is easy and simple to understand and use. The proximity ratio for placing an up or down trade/buy or sell ratio is 1:1. The app work...',
      fullText: 'The interface is easy and simple to understand and use. The proximity ratio for placing an up or down trade/buy or sell ratio is 1:1. The app works lightning fast on both mobile and desktop. Payout rates up to 95% on major currency pairs are genuine and execution is instant without slippage.'
    },
    {
      id: 3,
      name: 'Abhi',
      date: '28.11.2024',
      earned: '$1041',
      rating: 5,
      shortText: 'Quotex is a great trading platform. Previously, I tried some trading apps, but now that I have found Quotex, I am sticking to it. Moreover, their...',
      fullText: 'Quotex is a great trading platform. Previously, I tried some trading apps, but now that I have found Quotex, I am sticking to it. Moreover, their customer support responds 24/7 within minutes, deposit methods are diverse and convenient, and verification is straightforward. Highly recommended to all serious traders.'
    },
    {
      id: 4,
      name: 'Sonal',
      date: '25.11.2024',
      earned: '$398',
      rating: 5,
      shortText: "I've had nothing but positive experiences with Quotex over the years that I've been using it. The platform's intuitive and user-friendly design...",
      fullText: "I've had nothing but positive experiences with Quotex over the years that I've been using it. The platform's intuitive and user-friendly design makes charting and technical analysis seamless. The drawing tools and indicators are built directly into the charts with high precision."
    },
    {
      id: 5,
      name: 'Md Imran',
      date: '24.11.2024',
      earned: '$217',
      rating: 5,
      shortText: 'In binary trading, Quotex is very good for me! The broker\'s deposit and withdrawal system is very good. Best regards, Quotex broker from me. 💜 ...',
      fullText: 'In binary trading, Quotex is very good for me! The broker\'s deposit and withdrawal system is very good. Best regards, Quotex broker from me. 💜 Keep up the fantastic quality and speedy transactions. Transparent quotes and fair trading conditions make all the difference.'
    },
    {
      id: 6,
      name: 'Shree Ganesh',
      date: '01.11.2024',
      earned: '$379',
      rating: 5,
      shortText: "I've been using Quotex for some time now, and the experience has been excellent. The platform is straightforward to navigate, with a clean and...",
      fullText: "I've been using Quotex for some time now, and the experience has been excellent. The platform is straightforward to navigate, with a clean and clutter-free layout. Even during periods of high market volatility, orders execute right on the tick."
    },
    {
      id: 7,
      name: 'Vikram Malhotra',
      date: '18.01.2025',
      earned: '$1520',
      rating: 5,
      shortText: 'The fast 15-minute withdrawals directly to bank and crypto made Quotex my primary trading platform. Execution is immediate with 0% commission...',
      fullText: 'The fast 15-minute withdrawals directly to bank and crypto made Quotex my primary trading platform. Execution is immediate with 0% commission on both deposits and cashouts. The chart analysis with Bollinger Bands is crystal clear.'
    },
    {
      id: 8,
      name: 'Elena Rostova',
      date: '14.01.2025',
      earned: '$2470',
      rating: 5,
      shortText: 'Cleanest lightweight charts in the industry. Multi-chart layouts and customized indicators allow me to execute OTC pairs simultaneously with high accuracy...',
      fullText: 'Cleanest lightweight charts in the industry. Multi-chart layouts and customized indicators allow me to execute OTC pairs simultaneously with high accuracy. Payout percentages up to 98% are real and verified.'
    },
    {
      id: 9,
      name: 'Tariq Al-Mansoor',
      date: '10.01.2025',
      earned: '$3850',
      rating: 5,
      shortText: 'VIP status features and trader signals are remarkably accurate. Customer support helped me complete account verification within minutes...',
      fullText: 'VIP status features and trader signals are remarkably accurate. Customer support helped me complete account verification within minutes. Very secure and highly dependable trading conditions.'
    },
    {
      id: 10,
      name: 'Priya Sharma',
      date: '06.01.2025',
      earned: '$3200',
      rating: 5,
      shortText: 'I started with the $10,000 demo account for 2 weeks to test my strategy. Switched to a real account and now earning consistently every week...',
      fullText: 'I started with the $10,000 demo account for 2 weeks to test my strategy. Switched to a real account and now earning consistently every week. The instant order placement gives full confidence.'
    },
    {
      id: 11,
      name: 'Carlos Mendes',
      date: '02.01.2025',
      earned: '$960',
      rating: 5,
      shortText: 'The 95% payout rate on OTC EUR/USD pairs on weekends is unparalleled. Instant deposits via local payment methods with zero fees...',
      fullText: 'The 95% payout rate on OTC EUR/USD pairs on weekends is unparalleled. Instant deposits via local payment methods with zero fees. The best binary options broker on the market.'
    },
    {
      id: 12,
      name: 'Adebayo Johnson',
      date: '27.12.2024',
      earned: '$1840',
      rating: 5,
      shortText: 'Transparent pricing and real tick data. The mobile experience is blazing fast, so I can place trades while traveling with zero hassle...',
      fullText: 'Transparent pricing and real tick data. The mobile experience is blazing fast, so I can place trades while traveling with zero hassle. Never had a rejected withdrawal.'
    },
    {
      id: 13,
      name: 'David O\'Connor',
      date: '21.12.2024',
      earned: '$5200',
      rating: 5,
      shortText: 'Trading crypto and forex indices 24/7 with instant payouts. Quotex has built something truly world-class for modern retail traders...',
      fullText: 'Trading crypto and forex indices 24/7 with instant payouts. Quotex has built something truly world-class for modern retail traders. Support team is always polite and helpful.'
    }
  ];

  // Daily Dynamic Reviews:
  // - Review #1 (Rahima, $8400) is FIXED and never changes.
  // - Reviews #2 to #6+ rotate daily so every day brings fresh authentic positive reviews.
  // - Always at least 6 cards (never less than Image 3).
  const reviewsData = useMemo(() => {
    const today = new Date();
    // Daily epoch seed (changes once every 24 hours at midnight UTC)
    const daySeed = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    
    const pool = [...DYNAMIC_REVIEWS_POOL];
    const rotated: typeof pool = [];
    
    // Pick 5 distinct cards deterministically for the current day
    for (let i = 0; i < 5; i++) {
      const idx = (daySeed * 3 + i * 2) % pool.length;
      const picked = pool.splice(idx, 1)[0];
      if (picked) rotated.push(picked);
    }
    
    // Return fixed #1 review + 5 daily rotating reviews (total: 6, never less than Image 3)
    return [FIXED_FIRST_REVIEW, ...rotated];
  }, []);

  // FAQ Data matching Image 7
  const faqData = [
    {
      id: 0,
      question: 'How do I learn how to trade?',
      answer: 'To learn how to trade on our platform, you can practice with our completely free demo account pre-loaded with $10,000 in virtual funds with zero risk. In addition, we provide interactive educational guides, built-in indicator strategies, and video tutorials designed for beginners and advanced traders alike.'
    },
    {
      id: 1,
      question: 'How long does it take to withdraw funds?',
      answer: 'On average, the withdrawal procedure takes from 1 to 5 business days from the date of the receipt of the corresponding request of the Client, and depends only on the volume of simultaneously processed requests. The company always strives to process withdrawals on the very same day the request is received.'
    },
    {
      id: 2,
      question: 'What is trading platform and what it is for?',
      answer: 'A trading platform is a specialized digital software system that allows clients to conduct financial market transactions, view live real-time price quotes, analyze trends with technical indicators, and manage their personal trading portfolios efficiently from any computer or mobile device.'
    },
    {
      id: 3,
      question: 'Can I trade using a phone / mobile device?',
      answer: 'Yes! Our platform is fully responsive and optimized for all mobile phones and tablets. You can use our web application directly in your mobile browser or download our dedicated mobile application for iOS and Android to trade on the go with real-time market updates.'
    },
    {
      id: 4,
      question: 'What is the minimum deposit amount?',
      answer: 'The minimum deposit amount is only $10 (or the equivalent in your preferred account currency). This low threshold enables anyone to start learning real financial trading without requiring high starting capital.'
    },
    {
      id: 5,
      question: 'Are there any deposit or withdrawal fees?',
      answer: 'No. The company charges 0% commission on deposits and withdrawals. However, third-party payment systems or bank card processors may apply standard foreign currency conversion or transfer fees depending on the selected method.'
    }
  ];

  // Prediction simulation trigger
  const handleSimulatePrediction = (choice: 'UP' | 'DOWN') => {
    setPredictionChoice(choice);
    setPredictionState('simulating');
    setTimeout(() => {
      setPredictionState('win');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#11141a] font-sans text-white flex flex-col relative overflow-y-auto overflow-x-hidden">
      
      {/* Background Animated Candles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="absolute inset-0 flex items-center justify-between w-[200%] animate-[slide-bg_60s_linear_infinite]">
           {Array.from({length: 40}).map((_, i) => {
              const isUp = Math.random() > 0.5;
              const h = 20 + Math.random() * 40;
              const top = 10 + Math.random() * 30;
              return (
                 <div key={i} className="relative w-16" style={{ height: `${h}%`, top: `${top}%` }}>
                    <div className={`absolute left-1/2 -translate-x-1/2 w-2 h-[140%] -top-[20%] ${isUp ? 'bg-[#0ba259]' : 'bg-[#e33f4a]'}`}></div>
                    <div className={`absolute inset-0 ${isUp ? 'bg-[#0ba259]' : 'bg-[#e33f4a]'} rounded-sm`}></div>
                 </div>
              );
           })}
        </div>
      </div>
      
      <style>{`
        @keyframes slide-bg {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Navigation */}
      <nav className="h-[80px] w-full flex items-center justify-between px-8 bg-[#1f2631]/80 backdrop-blur-md border-b border-[#2a303d] relative z-50">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
             <div className="relative w-8 h-7">
               <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_5px_rgba(0,163,255,0.5)]">
                 <defs>
                   <linearGradient id="z-blue-landing" x1="0" y1="0" x2="1" y2="0">
                     <stop offset="0%" stopColor="#00d4ff" />
                     <stop offset="100%" stopColor="#0044ff" />
                   </linearGradient>
                   <linearGradient id="z-silver-landing" x1="0" y1="0" x2="1" y2="0">
                     <stop offset="0%" stopColor="#ffffff" />
                     <stop offset="100%" stopColor="#a0a0a0" />
                   </linearGradient>
                 </defs>
                 <path d="M 20 25 L 75 25 L 45 55 L 20 55 L 35 40 L 20 40 Z" fill="url(#z-blue-landing)"/>
                 <path d="M 40 75 L 95 75 L 65 45 L 40 45 L 55 60 L 40 60 Z" fill="url(#z-silver-landing)"/>
               </svg>
             </div>
             <span className="text-white font-black tracking-wider text-2xl flex items-center">ZORVE<span className="text-[#00a3ff]">X</span></span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-[15px] font-bold text-gray-300">
            <a href="/trade" className="hover:text-white transition-colors">Demo account</a>
            <a href="/about" className="hover:text-white transition-colors">About us</a>
            <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
          </div>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="text-gray-300 hover:text-white font-bold text-[15px] transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-[#0ba259] hover:bg-[#0ea960] text-white font-bold px-6 py-2.5 rounded transition-all shadow-[0_0_15px_rgba(11,162,89,0.3)] transform hover:scale-105 cursor-pointer"
            >
              Sign up
            </button>
          </div>

          <div className="relative border-l border-[#2a303d] pl-6 ml-2">
            <QuotexLanguageDropdown />
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center pt-16 px-4 relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-center mb-6 leading-tight max-w-4xl drop-shadow-xl">
          Smart Platform for <br/><span className="text-[#0ba259]">Smarter Investments</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl mb-10">
          Register and get $10,000 on a demo account for learning to trade.
        </p>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/signup')}
            className="bg-[#0ba259] hover:bg-[#0ea960] text-white font-black text-lg px-8 py-4 rounded transition-all shadow-[0_0_20px_rgba(11,162,89,0.4)] transform hover:scale-105 cursor-pointer"
          >
            Registration
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="bg-[#1f2631] hover:bg-[#2a303d] border border-[#2a303d] text-white font-bold text-lg px-8 py-4 rounded transition-all flex items-center gap-3 cursor-pointer"
          >
            Log in <ArrowRight size={20} />
          </button>
        </div>

        {/* TRADING INTERFACE PREVIEW MOCKUP (Image 2 & Image 3 - Full Quotex Platform with all icons) */}
        <div 
          onWheel={handleHeroWheel}
          style={{ 
             transform: `translateY(-${Math.max(scrollSlide, isTabSlidUp ? 175 : 0)}px)`,
             transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="mt-14 w-full max-w-6xl rounded-t-2xl overflow-hidden border-t border-l border-r border-[#2a303d] shadow-[0_-30px_100px_rgba(0,0,0,0.95)] relative bg-[#131722] z-30"
        >
          
          {/* Browser Top Window Bar (Image 3) with Slide-Up Toggle */}
          <div 
             onClick={() => setIsTabSlidUp(!isTabSlidUp)}
             className="h-10 bg-[#1e2532] flex items-center justify-between px-4 border-b border-[#2a303d] cursor-pointer hover:bg-[#222b39] transition-colors select-none"
             title="Click or scroll mouse to slide platform tab up over registration"
          >
             <div className="flex gap-2 items-center">
               <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
               <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
               <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
             </div>
             <div className="bg-[#10141d] px-16 sm:px-24 py-1 rounded text-xs font-mono font-medium text-gray-400 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#0ba259]"></span>
               rajadhan.com/trade
             </div>
             <div className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-bold bg-[#263143] px-2.5 py-0.5 rounded border border-[#37455c]">
               {isTabSlidUp || scrollSlide > 60 ? (
                 <><span>▼ Slide Down</span></>
               ) : (
                 <><span>▲ Slide Up</span></>
               )}
             </div>
          </div>

          {/* Quotex Header Bar (Image 2) */}
          <div className="h-12 bg-[#1b2230] border-b border-[#283245] flex items-center justify-between px-3 text-xs select-none">
             <div className="flex items-center gap-3">
               <button className="text-gray-400 hover:text-white p-1">
                 <Menu size={18} />
               </button>
               <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/trade')}>
                 {/* Quotex 4-bar waveform logo */}
                 <div className="flex items-end gap-[2px] h-4">
                   <div className="w-[3px] h-3 bg-[#0ba259] rounded-xs"></div>
                   <div className="w-[3px] h-4 bg-white rounded-xs"></div>
                   <div className="w-[3px] h-2 bg-[#0ba259] rounded-xs"></div>
                   <div className="w-[3px] h-3.5 bg-white rounded-xs"></div>
                 </div>
                 <span className="font-black tracking-wider text-sm text-white">QUOTEX</span>
                 <span className="text-[9px] uppercase tracking-widest text-[#718096] font-bold ml-1 hidden sm:inline">WEB TRADING PLATFORM</span>
               </div>
             </div>

             <div className="flex items-center gap-3">
               <div className="relative p-1.5 text-gray-400 hover:text-white cursor-pointer">
                 <Bell size={16} />
                 <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#e33f4a] text-white text-[9px] font-bold rounded-full flex items-center justify-center">1</span>
               </div>

               {/* Account Balance Dropdown */}
               <div className="flex items-center gap-2 bg-[#242d3d] hover:bg-[#283448] px-3 py-1.5 rounded border border-[#344055] cursor-pointer">
                 <Diamond size={13} className="text-[#a855f7]" />
                 <div className="text-left leading-tight">
                   <div className="text-[9px] uppercase text-gray-400 font-bold">REAL ACCOUNT</div>
                   <div className="text-xs font-bold text-white font-mono">$12,780.61</div>
                 </div>
                 <ChevronDown size={14} className="text-gray-400 ml-1" />
               </div>

               {/* Deposit & Withdrawal */}
               <button onClick={() => navigate('/trade')} className="bg-[#0ba259] hover:bg-[#0da960] text-white font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-sm cursor-pointer">
                 <Plus size={14} /> Deposit
               </button>
               <button onClick={() => navigate('/trade')} className="bg-[#242d3d] hover:bg-[#2e3a4e] text-white font-bold px-3 py-1.5 rounded border border-[#344055] cursor-pointer">
                 Withdrawal
               </button>
             </div>
          </div>
          
          {/* Main Applet Body: Left Bar + Chart Canvas + Right Sidebar (Image 2) */}
          <div className="relative w-full h-[520px] flex overflow-hidden bg-[#111622] select-none">
            
            {/* Left Vertical Icon Bar (Image 2) */}
            <div className="w-14 bg-[#1b2230] border-r border-[#263143] flex flex-col justify-between py-3 items-center shrink-0 z-20">
               <div className="flex flex-col gap-4 items-center w-full">
                  <div className="w-10 h-10 bg-[#0088ff] text-white rounded-lg flex flex-col items-center justify-center cursor-pointer shadow-md">
                     <BarChart size={18} />
                     <span className="text-[8px] font-bold uppercase mt-0.5">TRADE</span>
                  </div>
                  <div className="text-gray-400 hover:text-white flex flex-col items-center justify-center cursor-pointer py-1">
                     <HelpCircle size={18} />
                     <span className="text-[8px] font-bold uppercase mt-0.5">SUPPORT</span>
                  </div>
                  <div className="text-gray-400 hover:text-white flex flex-col items-center justify-center cursor-pointer py-1">
                     <User size={18} />
                     <span className="text-[8px] font-bold uppercase mt-0.5">ACCOUNT</span>
                  </div>
                  <div className="relative text-gray-400 hover:text-white flex flex-col items-center justify-center cursor-pointer py-1">
                     <Trophy size={18} />
                     <span className="text-[8px] font-bold uppercase mt-0.5">TOURN.</span>
                     <span className="absolute -top-1 right-0 w-3.5 h-3.5 bg-[#0088ff] text-white text-[8px] font-bold rounded-full flex items-center justify-center">3</span>
                  </div>
                  <div className="text-gray-400 hover:text-white flex flex-col items-center justify-center cursor-pointer py-1">
                     <ShoppingBag size={18} />
                     <span className="text-[8px] font-bold uppercase mt-0.5">MARKET</span>
                  </div>
                  <div className="text-gray-400 hover:text-white flex flex-col items-center justify-center cursor-pointer py-1">
                     <MoreHorizontal size={18} />
                     <span className="text-[8px] font-bold uppercase mt-0.5">MORE</span>
                  </div>
               </div>

               {/* Bottom Controls */}
               <div className="flex flex-col gap-2 items-center w-full pt-2 border-t border-[#263143]">
                  <Maximize2 size={14} className="text-gray-400 hover:text-white cursor-pointer" />
                  <Volume2 size={14} className="text-gray-400 hover:text-white cursor-pointer" />
                  <Settings size={14} className="text-gray-400 hover:text-white cursor-pointer" />
                  <div className="w-8 h-8 rounded bg-[#0ba259] text-white flex items-center justify-center text-[9px] font-bold mt-1 shadow-md cursor-pointer" title="Help">
                     Help
                  </div>
               </div>
            </div>

            {/* Central Chart Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden border-r border-[#263143]">
               
               {/* Asset Tabs Bar (Image 2) */}
               <div className="h-10 bg-[#161c28] border-b border-[#263143] flex items-center px-2 gap-1.5 overflow-x-auto custom-scrollbar">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1e2636] hover:bg-[#253043] rounded text-xs text-gray-300 font-bold cursor-pointer">
                     <span className="text-xs">🇦🇺🇨🇭</span>
                     <span>AUD/CHF</span>
                     <span className="text-[#0ba259] text-[10px]">86%</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1e2636] hover:bg-[#253043] rounded text-xs text-gray-300 font-bold cursor-pointer">
                     <span className="text-xs">🇺🇸🇨🇦</span>
                     <span>USD/CAD</span>
                     <span className="text-[#0ba259] text-[10px]">88%</span>
                  </div>
                  {/* Active Selected Tab */}
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#28354a] border border-[#3b4b66] rounded text-xs text-white font-bold cursor-pointer shadow-sm">
                     <span className="text-xs">🇺🇸🇪🇬</span>
                     <span>USD/EGP (OTC)</span>
                     <span className="text-[#0ba259] text-[10px]">93%</span>
                     <X size={12} className="text-gray-400 hover:text-white ml-1" />
                  </div>
                  {/* Plus Tab Button */}
                  <div className="w-7 h-7 rounded bg-[#0088ff] hover:bg-[#0077e6] text-white flex items-center justify-center cursor-pointer shadow-xs ml-1">
                     <Plus size={16} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-bold text-[#0ba259] ml-1">85%</span>
               </div>

               {/* Chart Toolbar (Image 2) */}
               <div className="h-9 px-3 flex items-center justify-between text-xs text-gray-400 border-b border-white/[0.04] bg-[#131722]">
                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0ba259]"></span>
                        14:33:44 UTC
                     </div>
                     <div className="bg-[#0088ff]/15 hover:bg-[#0088ff]/25 border border-[#0088ff]/40 text-[#0099ff] px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                        <Info size={11} /> PAIR INFORMATION
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                     <span className="text-[10px] text-gray-500 font-mono">44.0028</span>
                  </div>
               </div>

               {/* SVG Canvas Area */}
               <div className="flex-1 relative overflow-hidden bg-[#111622]">
                  {/* Grid Lines */}
                  <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
                     <pattern id="grid-quotex" width="60" height="40" patternUnits="userSpaceOnUse">
                       <path d="M 60 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                     </pattern>
                     <rect width="100%" height="100%" fill="url(#grid-quotex)" />
                  </svg>

                  {/* Left Chart Floating Tools (Image 2) */}
                  <div className="absolute left-3 top-4 flex flex-col gap-2 z-20">
                     <div className="w-8 h-8 rounded bg-[#1e2636] hover:bg-[#273247] border border-[#2b374d] text-gray-300 flex items-center justify-center cursor-pointer shadow-md">
                        <Sliders size={14} />
                     </div>
                     <div className="w-8 h-8 rounded bg-[#1e2636] hover:bg-[#273247] border border-[#2b374d] text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-md">
                        1m
                     </div>
                     <div className="w-8 h-8 rounded bg-[#1e2636] hover:bg-[#273247] border border-[#2b374d] text-gray-300 flex items-center justify-center cursor-pointer shadow-md">
                        <Activity size={14} />
                     </div>
                     <div className="w-8 h-8 rounded bg-[#1e2636] hover:bg-[#273247] border border-[#2b374d] text-gray-300 flex items-center justify-center cursor-pointer shadow-md">
                        <Crosshair size={14} />
                     </div>
                  </div>

                  {/* Vertical Expiration Markers (Image 2) */}
                  <div className="absolute top-0 bottom-0 left-[68%] w-[1px] border-r border-dashed border-gray-600 pointer-events-none z-10">
                     <span className="absolute top-2 -translate-x-1/2 text-[9px] text-gray-400 font-mono whitespace-nowrap">Beginning of trade</span>
                  </div>
                  <div className="absolute top-0 bottom-0 left-[82%] w-[1px] border-r border-dashed border-white/40 pointer-events-none z-10">
                     <span className="absolute top-2 -translate-x-1/2 text-[9px] text-gray-300 font-mono whitespace-nowrap">End of trade 17</span>
                  </div>

                  {/* Candlesticks SVG - Prominent Bodies & Selective Wicks */}
                  <svg width="100%" height="100%" preserveAspectRatio="none" className="absolute inset-0 z-10 overflow-visible">
                     {mockCandles.map((c, i) => {
                        const x = (i / 50) * 88 + 1 + "%";
                        const isUp = c.close >= c.open;
                        const color = isUp ? '#00c26f' : '#ff4b55';
                        const topY = getY(Math.max(c.open, c.close));
                        const bottomY = getY(Math.min(c.open, c.close));
                        const top = topY + "%";
                        const high = getY(c.high) + "%";
                        const low = getY(c.low) + "%";
                        // Prominent, solid candlestick body height
                        const height = Math.max(2.4, bottomY - topY) + "%";

                        return (
                           <g key={i}>
                             {/* Fine centered wick (shorter on most candles, longer on selective candles) */}
                             <line x1={`calc(${x} + 3.75px)`} y1={high} x2={`calc(${x} + 3.75px)`} y2={low} stroke={color} strokeWidth="1.2" strokeLinecap="round" />
                             {/* Prominent solid candle body */}
                             <rect x={x} y={top} width="7.5px" height={height} fill={color} rx="0.5" />
                           </g>
                        );
                     })}
                     
                     {/* Live Price Horizontal Line & Tag (Image 2) */}
                     {mockCandles.length > 0 && (() => {
                        const currentY = getY(currentPrice) + "%";
                        return (
                          <g>
                            <line x1="0" y1={currentY} x2="100%" y2={currentY} stroke="#0099ff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.85" />
                            <circle cx="82%" cy={currentY} r="3.5" fill="#0099ff" />
                            <circle cx="82%" cy={currentY} r="9" fill="#0099ff" opacity="0.35" className="animate-[pulse-soft_1s_ease-in-out_infinite]" />
                          </g>
                        );
                     })()}
                  </svg>

                  {/* Floating Executed Trade Pill on Chart (Image 2) */}
                  <div className="absolute left-[18%] bottom-6 bg-[#1f283a]/95 border border-[#313f57] rounded-lg px-3 py-2 flex items-center gap-3 text-xs shadow-xl z-20">
                     <div className="flex items-center gap-1.5">
                        <span className="text-xs">🇪🇬</span>
                        <span className="font-bold text-white">USD/EGP (...)</span>
                        <span className="text-gray-400 font-mono text-[11px]">· 00:05</span>
                     </div>
                     <div className="font-bold text-[#00c26f] font-mono">
                        +28.95 $
                     </div>
                     <X size={13} className="text-gray-400 hover:text-white cursor-pointer ml-1" />
                  </div>

                  {/* Zoom Controls at Bottom Center (Image 2) */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex items-center gap-1 bg-[#1c2433]/90 border border-[#2b374d] rounded px-2 py-0.5 text-xs text-gray-300 z-20">
                     <button className="hover:text-white font-bold px-1">−</button>
                     <span className="text-gray-600">|</span>
                     <button className="hover:text-white font-bold px-1">+</button>
                  </div>

                  {/* Right Price Scale Axis */}
                  <div className="absolute top-0 bottom-0 right-0 w-16 bg-[#131824]/90 border-l border-[#263143] flex flex-col justify-between py-4 text-[10px] font-mono text-gray-500 items-center z-20 pointer-events-none">
                     <span>{maxPrice.toFixed(4)}</span>
                     <span>{((maxPrice * 2 + minPrice) / 3).toFixed(4)}</span>
                     <span>{((maxPrice + minPrice * 2) / 3).toFixed(4)}</span>
                     <span>{minPrice.toFixed(4)}</span>
                     
                     {/* Active Blue Price Tag + Countdown Badge (Image 2) */}
                     <div 
                        className="absolute w-full bg-[#0088ff] text-white text-[10px] font-bold py-1 text-center shadow-[0_0_12px_rgba(0,136,255,0.4)] transition-all duration-75 flex items-center justify-between px-1" 
                        style={{ top: `calc(${Math.min(Math.max(getY(currentPrice), 10), 90)}% - 10px)` }}
                     >
                       <span className="text-[8px] bg-black/40 px-0.5 rounded font-mono">00:17</span>
                       <span className="font-mono">{currentPrice.toFixed(4)}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Trading Action Panel (Image 2) */}
            <div className="w-72 bg-[#1b2230] p-4 flex flex-col justify-between z-30 shrink-0 select-none">
               
               {/* Pair and Pending Trade Row (Image 2) */}
               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="text-base">🇪🇬</span>
                        <div>
                           <div className="font-black text-white text-xs tracking-tight">USD/EGP (OTC)</div>
                           <div className="text-[10px] text-[#00c26f] font-bold">93% Payout</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-1.5">
                        <span className="text-[9px] uppercase font-bold text-gray-400">PENDING TRADE</span>
                        <div 
                           onClick={() => setPendingTradeEnabled(!pendingTradeEnabled)}
                           className={`w-7 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${pendingTradeEnabled ? 'bg-[#0088ff]' : 'bg-[#2b3648]'}`}
                        >
                           <div className={`w-3 h-3 rounded-full bg-white transition-transform ${pendingTradeEnabled ? 'translate-x-3' : 'translate-x-0'}`}></div>
                        </div>
                     </div>
                  </div>

                  {/* Time Box (Image 2) */}
                  <div className="bg-[#141a24] border border-[#263245] rounded-lg p-2">
                     <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-1">
                        <span>Time</span>
                        <span className="text-[#0088ff] hover:underline cursor-pointer">SWITCH TIME</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <button onClick={() => setHeroTradeTime('00:00:05')} className="w-7 h-7 rounded bg-[#222b3b] hover:bg-[#2b374c] text-white font-bold flex items-center justify-center cursor-pointer">−</button>
                        <span className="text-sm font-bold font-mono text-white">{heroTradeTime}</span>
                        <button onClick={() => setHeroTradeTime('00:01:00')} className="w-7 h-7 rounded bg-[#222b3b] hover:bg-[#2b374c] text-white font-bold flex items-center justify-center cursor-pointer">+</button>
                     </div>
                  </div>

                  {/* Investment Box (Image 2) */}
                  <div className="bg-[#141a24] border border-[#263245] rounded-lg p-2">
                     <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-1">
                        <span>Investment</span>
                        <span className="text-[#0088ff] hover:underline cursor-pointer">SWITCH</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <button onClick={() => setHeroTradeAmount(Math.max(1, heroTradeAmount - 5))} className="w-7 h-7 rounded bg-[#222b3b] hover:bg-[#2b374c] text-white font-bold flex items-center justify-center cursor-pointer">−</button>
                        <span className="text-sm font-bold font-mono text-white">{heroTradeAmount} $</span>
                        <button onClick={() => setHeroTradeAmount(heroTradeAmount + 5)} className="w-7 h-7 rounded bg-[#222b3b] hover:bg-[#2b374c] text-white font-bold flex items-center justify-center cursor-pointer">+</button>
                     </div>
                  </div>

                  {/* BUY Button (Changed from Up to BUY) */}
                  <button 
                     onClick={() => navigate('/trade')}
                     className="w-full h-11 bg-[#00c26f] hover:bg-[#00ad63] rounded-lg flex items-center justify-between px-4 text-white font-black text-sm shadow-[0_4px_14px_rgba(0,194,111,0.35)] active:scale-98 transition-all cursor-pointer"
                  >
                     <span className="tracking-wide uppercase font-black text-sm">BUY</span>
                     <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <ArrowUp size={15} strokeWidth={3} />
                     </span>
                  </button>

                  {/* Payout Calculation (Image 2) */}
                  <div className="text-center text-[11px] font-medium text-gray-400">
                     Your payout: <span className="font-bold text-white font-mono">{(heroTradeAmount * 1.93).toFixed(2)} $</span>
                  </div>

                  {/* SELL Button (Changed from Down to SELL) */}
                  <button 
                     onClick={() => navigate('/trade')}
                     className="w-full h-11 bg-[#ff4b55] hover:bg-[#eb424c] rounded-lg flex items-center justify-between px-4 text-white font-black text-sm shadow-[0_4px_14px_rgba(255,75,85,0.35)] active:scale-98 transition-all cursor-pointer"
                  >
                     <span className="tracking-wide uppercase font-black text-sm">SELL</span>
                     <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <ArrowDown size={15} strokeWidth={3} />
                     </span>
                  </button>
               </div>

               {/* Bottom Trades & Orders Mini List (Image 2) */}
               <div className="border-t border-[#263143] pt-2 mt-2">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                     <div className="flex items-center gap-1 cursor-pointer">
                        <span className={heroActiveTab === 'TRADES' ? 'text-white' : 'text-gray-400'}>Trades</span>
                        <span className="text-[10px] bg-[#28354a] px-1.5 py-0.2 rounded text-gray-300 font-mono">0</span>
                     </div>
                     <div className="flex items-center gap-1 cursor-pointer">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-[10px] bg-[#28354a] px-1.5 py-0.2 rounded text-gray-300 font-mono">0</span>
                     </div>
                  </div>

                  <div className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                     21 MAY <span className="text-gray-500 font-mono">(9)</span>
                  </div>

                  {/* Sample rows matching Image 2 with BUY / SELL labels */}
                  <div className="space-y-1 text-[10px] font-sans">
                     <div className="bg-[#141a24] p-1.5 rounded flex justify-between items-center border border-white/[0.03]">
                        <div className="flex items-center gap-1">
                           <span>🇪🇬</span>
                           <span className="font-bold text-white">USD/EGP</span>
                           <span className="text-[#ff4b55] font-bold">SELL 15$</span>
                        </div>
                        <div className="text-right">
                           <div className="font-mono text-gray-400 text-[9px]">00:00:05</div>
                           <div className="font-bold text-[#00c26f] font-mono">+28.95 $</div>
                        </div>
                     </div>

                     <div className="bg-[#141a24] p-1.5 rounded flex justify-between items-center border border-white/[0.03]">
                        <div className="flex items-center gap-1">
                           <span>🇦🇺</span>
                           <span className="font-bold text-white">AUD/CHF</span>
                           <span className="text-[#00c26f] font-bold">BUY 15$</span>
                        </div>
                        <div className="text-right">
                           <div className="font-mono text-gray-400 text-[9px]">00:00:43</div>
                           <div className="font-bold text-[#00c26f] font-mono">+27.90 $</div>
                        </div>
                     </div>
                  </div>
               </div>

            </div>

          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#11141a] to-transparent z-40 pointer-events-none"></div>
        </div>
      </div>
      
      {/* Metrics & Trust Section */}
      <div className="bg-[#1f2631] py-16 relative z-10 border-y border-[#2a303d]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
           <div className="flex flex-col items-center text-center">
             <div className="text-4xl font-black text-[#0ba259] mb-2 drop-shadow-[0_0_10px_rgba(11,162,89,0.3)]">4.5M+</div>
             <div className="text-sm text-[#8390a0] font-bold uppercase tracking-wider">Active Traders</div>
           </div>
           <div className="flex flex-col items-center text-center">
             <div className="text-4xl font-black text-[#1e88e5] mb-2 drop-shadow-[0_0_10px_rgba(30,136,229,0.3)]">1.2M+</div>
             <div className="text-sm text-[#8390a0] font-bold uppercase tracking-wider">Trades Today</div>
           </div>
           <div className="flex flex-col items-center text-center">
             <div className="text-4xl font-black text-[#e33f4a] mb-2 drop-shadow-[0_0_10px_rgba(227,63,74,0.3)]">$3.5M+</div>
             <div className="text-sm text-[#8390a0] font-bold uppercase tracking-wider">Paid Out Today</div>
           </div>
           <div className="flex flex-col items-center text-center">
             <div className="text-4xl font-black text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">No. 1</div>
             <div className="text-sm text-[#8390a0] font-bold uppercase tracking-wider">Trading Platform 2026</div>
           </div>
        </div>
      </div>

      {/* Features Section (Image 4) */}
      <div className="bg-[#11141a] py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Features of the platform</h2>
          <p className="text-center text-gray-400 mb-14 max-w-2xl mx-auto text-base md:text-lg">We regularly improve our platform to make your trading comfortable and safe.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1f2631] p-8 rounded-2xl border border-[#2a303d] flex flex-col items-start hover:border-[#1e88e5] transition-all duration-300 group hover:shadow-[0_10px_40px_rgba(30,136,229,0.15)] transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#1e88e5]/10 text-[#1e88e5] rounded-xl flex items-center justify-center mb-6 shadow-inner">
                 <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast execution</h3>
              <p className="text-gray-400 mb-6 flex-1 text-sm leading-relaxed">
                Experience lightning-fast trade execution with our robust infrastructure. Enter and exit the market at the exact right moment.
              </p>
              <button onClick={() => navigate('/signup')} className="text-[#1e88e5] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer">Start Trading <ArrowRight size={16} /></button>
            </div>
            
            <div className="bg-[#1f2631] p-8 rounded-2xl border border-[#2a303d] flex flex-col items-start hover:border-[#0ba259] transition-all duration-300 group hover:shadow-[0_10px_40px_rgba(11,162,89,0.15)] transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#0ba259]/10 text-[#0ba259] rounded-xl flex items-center justify-center mb-6 shadow-inner">
                 <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Reliable</h3>
              <p className="text-gray-400 mb-6 flex-1 text-sm leading-relaxed">
                Your funds and personal data are protected by industry-leading security protocols and two-factor authentication.
              </p>
              <button onClick={() => navigate('/signup')} className="text-[#0ba259] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer">Learn More <ArrowRight size={16} /></button>
            </div>
            
            <div className="bg-[#1f2631] p-8 rounded-2xl border border-[#2a303d] flex flex-col items-start hover:border-[#e33f4a] transition-all duration-300 group hover:shadow-[0_10px_40px_rgba(227,63,74,0.15)] transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#e33f4a]/10 text-[#e33f4a] rounded-xl flex items-center justify-center mb-6 shadow-inner">
                 <Award size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Integrated signals</h3>
              <p className="text-gray-400 mb-6 flex-1 text-sm leading-relaxed">
                Signals with 87% accuracy rate will help you to build a profitable strategy. Professional analytics at your fingertips.
              </p>
              <button onClick={() => navigate('/signup')} className="text-[#e33f4a] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer">Try Signals <ArrowRight size={16} /></button>
            </div>
          </div>

          {/* 5 Cards Row (Image 4) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            <div className="bg-[#1f2631] p-6 rounded-xl border border-[#2a303d] flex flex-col items-center text-center hover:border-[#1e88e5] transition-all duration-300">
              <div className="w-12 h-12 bg-[#11141a] border border-[#2a303d] rounded-full flex items-center justify-center mb-4 shadow-inner text-[#1e88e5]">
                 <Monitor size={22} />
              </div>
              <h3 className="text-sm font-bold text-white">User-friendly interface</h3>
            </div>
            <div className="bg-[#1f2631] p-6 rounded-xl border border-[#2a303d] flex flex-col items-center text-center hover:border-[#1e88e5] transition-all duration-300">
              <div className="w-12 h-12 bg-[#11141a] border border-[#2a303d] rounded-full flex items-center justify-center mb-4 shadow-inner text-[#1e88e5]">
                 <Activity size={22} />
              </div>
              <h3 className="text-sm font-bold text-white">Trading indicators</h3>
            </div>
            <div className="bg-[#1f2631] p-6 rounded-xl border border-[#2a303d] flex flex-col items-center text-center hover:border-[#1e88e5] transition-all duration-300">
              <div className="w-12 h-12 bg-[#11141a] border border-[#2a303d] rounded-full flex items-center justify-center mb-4 shadow-inner text-[#1e88e5]">
                 <Headphones size={22} />
              </div>
              <h3 className="text-sm font-bold text-white">Support 24/7</h3>
            </div>
            <div className="bg-[#1f2631] p-6 rounded-xl border border-[#2a303d] flex flex-col items-center text-center hover:border-[#1e88e5] transition-all duration-300">
              <div className="w-12 h-12 bg-[#11141a] border border-[#2a303d] rounded-full flex items-center justify-center mb-4 shadow-inner text-[#1e88e5]">
                 <Gift size={22} />
              </div>
              <h3 className="text-sm font-bold text-white">Bonus programs</h3>
            </div>
            <div className="bg-[#1f2631] p-6 rounded-xl border border-[#2a303d] flex flex-col items-center text-center hover:border-[#1e88e5] transition-all duration-300 col-span-2 md:col-span-1">
              <div className="w-12 h-12 bg-[#11141a] border border-[#2a303d] rounded-full flex items-center justify-center mb-4 shadow-inner text-[#1e88e5]">
                 <CreditCard size={22} />
              </div>
              <h3 className="text-sm font-bold text-white">Deposits and withdrawals</h3>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* IMAGE 5: "Grow your capital by making the right trading predictions" */}
          {/* ========================================================================= */}
          <div className="mt-16 bg-[#e9edf2] text-[#111827] rounded-3xl p-8 md:p-14 border border-[#d6dfea] shadow-2xl relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
               
               {/* Left Column: Title, Subtitle, CTA and Interactive Chart */}
               <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                     <h2 className="text-3xl md:text-5xl font-black text-[#111827] tracking-tight leading-[1.15] mb-5">
                        Grow your capital by making the right trading predictions
                     </h2>
                     <p className="text-[#4b5563] text-base md:text-lg mb-8 leading-relaxed max-w-xl font-medium">
                        Will the price go up or down? Predict the price movement of a trading asset and place a trade.
                     </p>

                     {/* CTA Button and Demo Practice Subtext */}
                     <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
                        <button 
                           onClick={() => navigate('/trade')}
                           className="bg-[#0ba259] hover:bg-[#0da960] text-white font-bold px-8 py-3.5 rounded-xl shadow-[0_4px_16px_rgba(11,162,89,0.35)] transition-all transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
                        >
                           Try it for free
                        </button>
                        <div className="flex items-center gap-1.5 text-xs md:text-sm text-[#6b7280] font-semibold">
                           <ChevronLeft size={16} className="text-[#9ca3af]" />
                           Practice on a demo account without registration.
                        </div>
                     </div>
                  </div>

                  {/* Interactive Prediction Chart Illustration (Matching Image 5) */}
                  <div className="relative w-full h-36 mt-4">
                     <svg viewBox="0 0 450 140" className="w-full h-full overflow-visible">
                        {/* Horizontal Baseline Dotted Guideline */}
                        <line x1="10" y1="75" x2="440" y2="75" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" />
                        
                        {/* Smooth Blue Price Trend Line */}
                        <path 
                           d="M 10 140 L 15 135 L 25 138 L 40 105 L 55 125 L 75 85 L 90 95 L 115 55 L 130 90 L 145 68 L 160 120 L 175 105 L 195 80 L 210 100 L 225 75" 
                           fill="none" 
                           stroke="#0088ff" 
                           strokeWidth="2.5" 
                           strokeLinecap="round" 
                           strokeLinejoin="round" 
                        />

                        {/* Prediction Split Trajectories (Up Green Dotted, Down Red Dotted) */}
                        <path 
                           d="M 225 75 Q 240 60 260 45" 
                           fill="none" 
                           stroke="#00c26f" 
                           strokeWidth="2.5" 
                           strokeDasharray="2 3" 
                           strokeLinecap="round" 
                        />
                        <path 
                           d="M 225 75 Q 240 90 260 105" 
                           fill="none" 
                           stroke="#ff4b55" 
                           strokeWidth="2.5" 
                           strokeDasharray="2 3" 
                           strokeLinecap="round" 
                        />

                        {/* Glowing Active Anchor Node */}
                        <circle cx="225" cy="75" r="14" fill="#0088ff" opacity="0.2" className="animate-ping" />
                        <circle cx="225" cy="75" r="8" fill="#1e293b" stroke="#0088ff" strokeWidth="2.5" />
                        <circle cx="225" cy="75" r="3.5" fill="#ffffff" />
                     </svg>

                     {/* Interactive Mini Prediction Buttons overlay */}
                     <div className="absolute right-4 bottom-2 flex items-center gap-2">
                        <button 
                           onClick={() => handleSimulatePrediction('UP')}
                           className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
                              predictionChoice === 'UP' ? 'bg-[#00c26f] text-white ring-2 ring-[#00c26f]/50' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                           }`}
                        >
                           <ArrowUp size={12} strokeWidth={3} /> Up (Call)
                        </button>
                        <button 
                           onClick={() => handleSimulatePrediction('DOWN')}
                           className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
                              predictionChoice === 'DOWN' ? 'bg-[#ff4b55] text-white ring-2 ring-[#ff4b55]/50' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                           }`}
                        >
                           <ArrowDown size={12} strokeWidth={3} /> Down (Put)
                        </button>
                        {predictionState === 'win' && (
                           <span className="text-xs font-bold text-[#00c26f] bg-green-100 px-2 py-1 rounded border border-green-200 animate-in fade-in">
                              +93% Profit!
                           </span>
                        )}
                     </div>
                  </div>
               </div>

               {/* Right Column: 4 Step Cards (2x2 Grid) + 3D Cash Illustration */}
               <div className="lg:col-span-5 flex flex-col justify-between h-full">
                  <div className="grid grid-cols-2 gap-4">
                     {/* Step 1 */}
                     <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/90 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-[#0ba259] text-white flex items-center justify-center mb-4 shadow-sm">
                           <Crosshair size={24} strokeWidth={2.5} />
                        </div>
                        <h4 className="font-bold text-[#111827] text-sm md:text-base leading-tight">1. Select an asset</h4>
                     </div>

                     {/* Step 2 */}
                     <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/90 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-[#0ba259] text-white flex items-center justify-center mb-4 shadow-sm">
                           <HeartPulse size={24} strokeWidth={2.5} />
                        </div>
                        <h4 className="font-bold text-[#111827] text-sm md:text-base leading-tight">2. Monitor the chart</h4>
                     </div>

                     {/* Step 3 */}
                     <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/90 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-[#0ba259] text-white flex items-center justify-center mb-4 shadow-sm">
                           <Handshake size={24} strokeWidth={2.5} />
                        </div>
                        <h4 className="font-bold text-[#111827] text-sm md:text-base leading-tight">3. Place a trade</h4>
                     </div>

                     {/* Step 4 */}
                     <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/90 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-[#0ba259] text-white flex items-center justify-center mb-4 shadow-sm">
                           <Wallet size={24} strokeWidth={2.5} />
                        </div>
                        <h4 className="font-bold text-[#111827] text-sm md:text-base leading-tight">4. Get the result</h4>
                     </div>
                  </div>

                  {/* 3D Cash Banknotes & Trade Badges Graphic (Matching Image 5) */}
                  <div className="relative mt-8 flex items-end justify-end select-none">
                     <div className="relative w-44 h-28 flex items-end justify-end">
                        {/* Banknote Stack */}
                        <div className="absolute bottom-0 right-2 w-32 h-16 bg-[#0ba259] border-2 border-[#098348] rounded-xl shadow-lg transform -rotate-1 flex items-center justify-center">
                           <div className="w-28 h-12 border border-white/30 rounded-lg flex items-center justify-between px-2 text-white font-bold font-mono text-xs">
                              <span>$</span>
                              <span className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center">★</span>
                              <span>100</span>
                           </div>
                        </div>
                        <div className="absolute bottom-3 right-6 w-32 h-16 bg-[#10b981] border-2 border-[#059669] rounded-xl shadow-xl transform rotate-3 flex items-center justify-center">
                           <div className="w-28 h-12 border border-white/40 rounded-lg flex items-center justify-between px-2 text-white font-bold font-mono text-xs">
                              <span>$</span>
                              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</span>
                              <span>100</span>
                           </div>
                        </div>
                        {/* Floating Trading Bubbles */}
                        <div className="absolute top-1 left-4 w-7 h-7 rounded-full bg-[#ff4b55] text-white shadow-md flex items-center justify-center animate-bounce">
                           <ArrowDown size={14} strokeWidth={3} />
                        </div>
                        <div className="absolute top-4 right-0 w-8 h-8 rounded-full bg-[#00c26f] text-white shadow-lg flex items-center justify-center animate-pulse">
                           <ArrowUp size={16} strokeWidth={3} />
                        </div>
                     </div>
                  </div>
               </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* IMAGE 6: "What people say about us" (Testimonials Grid & Modals) */}
          {/* ========================================================================= */}
          <div className="mt-24 pt-12 border-t border-[#263143]">
             <div className="text-center max-w-3xl mx-auto mb-14">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                   What people say about us
                </h2>
                <p className="text-gray-400 text-base md:text-lg">
                   We asked our customers to rate Quotex on a five-point scale.
                </p>
             </div>

             {/* 6 Review Cards in 3x2 Grid (Image 6) */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviewsData.map((review) => (
                   <div 
                      key={review.id}
                      className="bg-[#1a2230] hover:bg-[#1e2838] border border-[#273447] hover:border-[#0088ff]/40 rounded-2xl p-7 flex flex-col justify-between transition-all duration-200 shadow-md group"
                   >
                      <div>
                         {/* Header: Name, Date, Earned */}
                         <div className="flex justify-between items-start mb-3">
                            <div>
                               <h3 className="text-lg font-bold text-white tracking-wide">{review.name}</h3>
                               <span className="text-xs text-gray-400 font-mono">{review.date}</span>
                            </div>
                            <div className="text-xs font-mono font-bold text-gray-300 bg-[#242e40] px-2.5 py-1 rounded border border-[#344257]">
                               Earned: <span className="text-[#00c26f]">{review.earned}</span>
                            </div>
                         </div>

                         {/* 5 Green Stars */}
                         <div className="flex items-center gap-1 text-[#00c26f] mb-4">
                            {Array.from({ length: review.rating }).map((_, idx) => (
                               <Star key={idx} size={15} fill="#00c26f" strokeWidth={0} />
                            ))}
                         </div>

                         {/* Review Snippet */}
                         <p className="text-sm text-gray-300 leading-relaxed font-sans mb-6">
                            {review.shortText}
                         </p>
                      </div>

                      {/* Read More Link */}
                      <button 
                         onClick={() => setSelectedReview(review)}
                         className="text-[#0088ff] hover:text-[#38bdf8] font-bold text-xs flex items-center gap-1.5 transition-colors group-hover:gap-2.5 cursor-pointer text-left self-start"
                      >
                         Read More <ArrowRight size={14} />
                      </button>
                   </div>
                ))}
             </div>

             {/* View All Reviews Button (Image 6) */}
             <div className="flex justify-center mt-12">
                <button 
                   onClick={() => setShowAllReviewsModal(true)}
                   className="bg-[#00c26f] hover:bg-[#00b064] text-white font-bold px-8 py-3.5 rounded-full flex items-center gap-2.5 shadow-[0_4px_20px_rgba(0,194,111,0.35)] transition-all transform hover:scale-105 cursor-pointer"
                >
                   View all reviews <ArrowRight size={16} strokeWidth={2.5} />
                </button>
             </div>
          </div>

          {/* ========================================================================= */}
          {/* IMAGE 7: "Frequently asked questions" (Accordions & 3D Help Box) */}
          {/* ========================================================================= */}
          <div className="mt-28 pt-12 border-t border-[#263143]">
             <div className="text-center max-w-3xl mx-auto mb-14">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                   Frequently asked questions
                </h2>
                <p className="text-gray-400 text-base md:text-lg">
                   See the the most common questions of new traders answered here.
                </p>
             </div>

             {/* FAQ Accordion List */}
             <div className="max-w-4xl mx-auto space-y-3.5">
                {faqData.map((faq) => {
                   const isOpen = expandedFaq === faq.id;
                   return (
                      <div 
                         key={faq.id}
                         className="bg-[#1a2230] hover:bg-[#1e2736] border border-[#283547] rounded-xl transition-colors overflow-hidden"
                      >
                         <button 
                            onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                            className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
                         >
                            <span className="font-bold text-white text-base md:text-lg tracking-wide pr-4">
                               {faq.question}
                            </span>
                            <span className="text-[#0088ff] font-bold text-2xl leading-none flex items-center justify-center w-7 h-7">
                               {isOpen ? '−' : '+'}
                            </span>
                         </button>

                         {isOpen && (
                            <div className="px-6 pb-6 pt-1 text-gray-300 text-sm md:text-base leading-relaxed border-t border-[#283547]/60 animate-in fade-in duration-150">
                               {faq.answer}
                            </div>
                         )}
                      </div>
                   );
                })}
             </div>

             {/* Bottom Questions Prompt Box & 3D Chair Graphic (Image 7) */}
             <div className="max-w-4xl mx-auto mt-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-[#151b27] border border-[#253245] rounded-2xl p-6 md:p-8">
                <div className="flex-1">
                   <p className="text-base text-gray-300 font-medium mb-1">
                      Do you have other questions?
                   </p>
                   <p className="text-sm text-gray-400">
                      Go to all questions in the{' '}
                      <span onClick={() => navigate('/faq')} className="text-[#0088ff] hover:underline font-bold cursor-pointer">
                         FAQ section
                      </span>{' '}
                      or{' '}
                      <span onClick={() => navigate('/about')} className="text-[#0088ff] hover:underline font-bold cursor-pointer">
                         contact us
                      </span>.
                   </p>
                </div>

                {/* 3D Modern Question Graphic with Beautiful Gradient & Glow (Image 2) */}
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0 select-none group">
                   {/* Soft Ambient Backlight Glow */}
                   <div className="absolute inset-2 bg-gradient-to-tr from-[#0ba259]/35 via-[#0088ff]/25 to-[#00f2fe]/20 rounded-3xl blur-xl opacity-80 group-hover:opacity-100 transition-opacity"></div>
                   
                   {/* Outer Rounded Box with Rich Vibrant Emerald-Teal-Navy Gradient */}
                   <div className="w-20 h-20 bg-gradient-to-br from-[#132c38] via-[#103a32] to-[#0c1e2b] border-2 border-[#00c26f]/60 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(11,162,89,0.3)] flex items-center justify-center relative transform group-hover:scale-105 transition-transform duration-300">
                      {/* Middle Nested Box with Radial Depth */}
                      <div className="w-14 h-14 bg-gradient-to-tr from-[#0e1724] via-[#152e2e] to-[#1c3e38] rounded-xl border border-[#00c26f]/30 flex items-center justify-center shadow-inner">
                         {/* Inner Core Box with Glowing Emerald-to-Teal Accent */}
                         <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ba259] to-[#0088ff] shadow-[0_0_12px_rgba(0,194,111,0.6)] flex items-center justify-center opacity-90">
                            <div className="w-3 h-3 rounded-sm bg-white/40 backdrop-blur-sm"></div>
                         </div>
                      </div>
                      {/* Floating Bright Neon Green Question Mark */}
                      <div className="absolute -top-3.5 -right-2.5 text-4xl font-black text-[#00ff88] drop-shadow-[0_4px_16px_rgba(0,255,136,0.85)] animate-pulse select-none">
                         ?
                      </div>
                   </div>
                </div>
             </div>

          </div>

        </div>
      </div>

      {/* Global Trading Stats Section */}
      <div className="py-24 bg-[#11141a] border-t border-[#2a303d] relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <div className="w-12 h-12 bg-[#1e88e5]/10 text-[#1e88e5] rounded-lg flex items-center justify-center mb-4">
                 <Users size={24} />
              </div>
              <h4 className="text-4xl font-black text-white mb-2">3.5M+</h4>
              <p className="text-gray-400 font-medium">Registered Traders</p>
            </div>
            
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <div className="w-12 h-12 bg-[#0ba259]/10 text-[#0ba259] rounded-lg flex items-center justify-center mb-4">
                 <BarChart size={24} />
              </div>
              <h4 className="text-4xl font-black text-white mb-2">$85M+</h4>
              <p className="text-gray-400 font-medium">Daily Trading Volume</p>
            </div>
            
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <div className="w-12 h-12 bg-[#e33f4a]/10 text-[#e33f4a] rounded-lg flex items-center justify-center mb-4">
                 <Clock size={24} />
              </div>
              <h4 className="text-4xl font-black text-white mb-2">15 Min</h4>
              <p className="text-gray-400 font-medium">Average Withdrawal</p>
            </div>
            
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-lg flex items-center justify-center mb-4">
                 <Star size={24} />
              </div>
              <h4 className="text-4xl font-black text-white mb-2">4.8/5</h4>
              <p className="text-gray-400 font-medium">App Store Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile App CTA */}
      <div className="py-20 bg-gradient-to-br from-[#1f2631] to-[#11141a] border-t border-[#2a303d]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-bold mb-6 text-white leading-tight">Trade anywhere with<br/><span className="text-[#1e88e5]">our mobile app</span></h2>
              <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto md:mx-0">
                Get full access to all trading tools, fast execution, and integrated signals directly from your smartphone. Available for iOS and Android.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <button className="w-full sm:w-auto bg-[#11141a] border border-[#2a303d] hover:border-gray-500 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-3 transition-all cursor-pointer">
                  <Apple size={24} />
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Download on the</div>
                    <div className="text-sm font-bold leading-none">App Store</div>
                  </div>
                </button>
                <button className="w-full sm:w-auto bg-[#11141a] border border-[#2a303d] hover:border-gray-500 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-3 transition-all cursor-pointer">
                  <Play size={24} />
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">GET IT ON</div>
                    <div className="text-sm font-bold leading-none">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="flex-1 flex justify-center items-center relative">
               <div className="absolute inset-0 bg-[#1e88e5]/20 blur-[100px] rounded-full"></div>
               <div className="w-64 h-[500px] bg-[#11141a] border-[8px] border-[#2a303d] rounded-[2.5rem] relative shadow-2xl flex flex-col overflow-hidden z-10">
                  {/* Phone Mockscreen */}
                  <div className="h-16 bg-[#1f2631] border-b border-[#2a303d] flex items-center justify-between px-4">
                     <span className="text-white font-black text-sm">EUR/USD</span>
                     <span className="text-[#0ba259] font-bold text-sm">1.08500</span>
                  </div>
                  <div className="flex-1 bg-gradient-to-b from-[#11141a] to-[#1f2631] relative p-4 flex flex-col justify-end">
                     <svg className="absolute top-10 left-0 w-full h-1/2" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,80 Q10,70 20,80 T40,60 T60,70 T80,40 T100,50 L100,100 L0,100 Z" fill="rgba(30,136,229,0.1)" />
                        <path d="M0,80 Q10,70 20,80 T40,60 T60,70 T80,40 T100,50" fill="none" stroke="#1e88e5" strokeWidth="2" />
                     </svg>
                     <div className="grid grid-cols-2 gap-2 relative z-10">
                        <div className="bg-[#e33f4a] h-12 rounded-lg flex items-center justify-center text-white font-bold"><TrendingDown size={18} className="mr-1"/>SELL</div>
                        <div className="bg-[#0ba259] h-12 rounded-lg flex items-center justify-center text-white font-bold"><TrendingUp size={18} className="mr-1"/>BUY</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Full Text Modal */}
      {selectedReview && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#1a2230] border border-[#2d394d] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
               <button 
                  onClick={() => setSelectedReview(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
               >
                  <X size={18} />
               </button>
               <div className="flex justify-between items-start mb-4 pr-6">
                  <div>
                     <h3 className="text-xl font-bold text-white">{selectedReview.name}</h3>
                     <span className="text-xs text-gray-400 font-mono">{selectedReview.date}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#00c26f] bg-[#00c26f]/10 border border-[#00c26f]/30 px-3 py-1 rounded-full">
                     Earned: {selectedReview.earned}
                  </div>
               </div>
               <div className="flex items-center gap-1 text-[#00c26f] mb-4">
                  {Array.from({ length: selectedReview.rating }).map((_, idx) => (
                     <Star key={idx} size={16} fill="#00c26f" strokeWidth={0} />
                  ))}
               </div>
               <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 font-sans">
                  {selectedReview.fullText}
               </p>
               <button 
                  onClick={() => setSelectedReview(null)}
                  className="w-full bg-[#0088ff] hover:bg-[#0077e6] text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
               >
                  Close
               </button>
            </div>
         </div>
      )}

      {/* View All Reviews Modal */}
      {showAllReviewsModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#151c27] border border-[#2a3649] rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
               <div className="p-6 border-b border-[#2a3649] flex items-center justify-between">
                  <div>
                     <h3 className="text-2xl font-bold text-white">All Trader Reviews</h3>
                     <p className="text-xs text-gray-400">Verified traders and real community payouts</p>
                  </div>
                  <button 
                     onClick={() => setShowAllReviewsModal(false)}
                     className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                  >
                     <X size={20} />
                  </button>
               </div>
               <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
                  {[FIXED_FIRST_REVIEW, ...DYNAMIC_REVIEWS_POOL].map(r => (
                     <div key={r.id} className="bg-[#1c2432] p-4 rounded-xl border border-[#2a384c]">
                        <div className="flex justify-between items-center mb-2">
                           <span className="font-bold text-white text-base">{r.name}</span>
                           <span className="text-xs font-mono font-bold text-[#00c26f]">Earned: {r.earned}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#00c26f] mb-2">
                           {Array.from({ length: r.rating }).map((_, idx) => (
                              <Star key={idx} size={14} fill="#00c26f" strokeWidth={0} />
                           ))}
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{r.fullText}</p>
                     </div>
                  ))}
               </div>
               <div className="p-4 border-t border-[#2a3649] bg-[#111620] flex justify-end">
                  <button 
                     onClick={() => setShowAllReviewsModal(false)}
                     className="bg-[#00c26f] hover:bg-[#00b064] text-white font-bold px-6 py-2 rounded-lg text-sm cursor-pointer"
                  >
                     Close Reviews
                  </button>
               </div>
            </div>
         </div>
      )}

      <Footer />
    </div>
  );
}
