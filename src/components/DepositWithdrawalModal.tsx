import React, { useState, useEffect } from 'react';
import { 
  X, 
  Globe, 
  ChevronDown, 
  ChevronRight, 
  Flame, 
  Wallet, 
  Hexagon, 
  ArrowLeft, 
  Copy, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  QrCode,
  Building2,
  Sparkles,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { PaymentMethodIcon } from './PaymentMethodIcon';
import DepositSuccessModal from './DepositSuccessModal';

export interface DepositWithdrawalModalProps {
  type?: 'deposit' | 'withdrawal' | 'deposit_history' | 'withdrawal_history' | 'transactions';
  isOpen?: boolean;
  isLight?: boolean;
  onClose: () => void;
  onSuccess?: (val: number, details?: any) => Promise<void> | void;
  currency?: string;
  currentBalance?: number;
  onBalanceUpdate?: (newBalance: number) => void;
}

export interface PaymentMethodItem {
  id: string;
  name: string;
  category: 'popular' | 'epay' | 'crypto';
  minAmount: number;
  iconType: string;
  network?: string;
  badge?: string;
}

export const DepositWithdrawalModal: React.FC<DepositWithdrawalModalProps> = ({
  type = 'deposit',
  isOpen = true,
  isLight = false,
  onClose,
  onSuccess,
  currency = 'USD',
  currentBalance = 0,
  onBalanceUpdate,
}) => {
  // Main Tab: 'deposit' | 'withdrawal' | 'history'
  const getInitialTab = (): 'deposit' | 'withdrawal' | 'history' => {
    if (type === 'deposit_history' || type === 'withdrawal_history' || type === 'transactions') {
      return 'history';
    }
    return type === 'withdrawal' ? 'withdrawal' : 'deposit';
  };

  const [activeTab, setActiveTab] = useState<'deposit' | 'withdrawal' | 'history'>(getInitialTab());

  // Category filter in Deposit/Withdrawal: 'POPULAR' | 'E-PAY' | 'CRYPTO'
  const [selectedCategory, setSelectedCategory] = useState<'POPULAR' | 'E-PAY' | 'CRYPTO'>('POPULAR');

  // Country selector
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  // Selected payment method for checkout/processing
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodItem | null>(null);

  // Form states
  const [amount, setAmount] = useState<number>(activeTab === 'deposit' ? 100 : 50);
  const [utrNumber, setUtrNumber] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [appliedBonus, setAppliedBonus] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastProcessedAmount, setLastProcessedAmount] = useState(100);

  // Transaction history filter
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'DEPOSIT' | 'WITHDRAWAL'>('ALL');
  const [transactionsList, setTransactionsList] = useState<any[]>([]);

  useEffect(() => {
    setActiveTab(getInitialTab());
    setAmount(type === 'withdrawal' ? 50 : 100);
    setSelectedMethod(null);
  }, [type]);

  // Load transactions for the History tab
  useEffect(() => {
    const userId = localStorage.getItem('user_uid');
    let unsub: (() => void) | null = null;

    try {
      const q = userId
        ? query(collection(db, 'transactions'), where('userId', '==', userId), limit(50))
        : query(collection(db, 'transactions'), limit(50));

      unsub = onSnapshot(q, (snap) => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Also combine with localStorage fallback
        const localDeposits = JSON.parse(localStorage.getItem('deposit_history') || '[]');
        const localWithdrawals = JSON.parse(localStorage.getItem('withdrawal_history') || '[]');
        
        const combined = [...docs, ...localDeposits, ...localWithdrawals];
        // Sort descending by timestamp
        combined.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setTransactionsList(combined);
      }, (err) => {
        console.warn('transactions listener error:', err);
        const localDeposits = JSON.parse(localStorage.getItem('deposit_history') || '[]');
        const localWithdrawals = JSON.parse(localStorage.getItem('withdrawal_history') || '[]');
        const combined = [...localDeposits, ...localWithdrawals];
        combined.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setTransactionsList(combined);
      });
    } catch (e) {
      console.warn('transactions load error:', e);
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  if (isOpen === false) return null;

  // Exact methods from User Image 1:
  // Popular in your region (8)
  const popularMethods: PaymentMethodItem[] = [
    { id: 'phonepe', name: 'PhonePe', category: 'popular', minAmount: 10, iconType: 'PhonePe' },
    { id: 'upi', name: 'UPI', category: 'popular', minAmount: 10, iconType: 'UPI' },
    { id: 'binance-pay', name: 'Binance Pay', category: 'popular', minAmount: 10, iconType: 'Binance Pay' },
    { id: 'paytm', name: 'PayTM', category: 'popular', minAmount: 10, iconType: 'PayTM' },
    { id: 'usdt-bep20', name: 'USDT (BEP-20)', category: 'popular', minAmount: 20, iconType: 'USDT (BEP-20)', network: 'BEP-20' },
    { id: 'usdt-trc20', name: 'USDT (TRC-20)', category: 'popular', minAmount: 10, iconType: 'USDT (TRC-20)', network: 'TRC-20' },
    { id: 'upi-intent', name: 'UPI Intent', category: 'popular', minAmount: 10, iconType: 'UPI Intent' },
    { id: 'usdt-erc20', name: 'USDT (ERC-20)', category: 'popular', minAmount: 50, iconType: 'USDT (ERC-20)', network: 'ERC-20' },
  ];

  // E-Pay (4)
  const epayMethods: PaymentMethodItem[] = [
    { id: 'epay-upi-intent', name: 'UPI Intent', category: 'epay', minAmount: 10, iconType: 'UPI Intent' },
    { id: 'epay-upi', name: 'UPI', category: 'epay', minAmount: 10, iconType: 'UPI' },
    { id: 'epay-paytm', name: 'PayTM', category: 'epay', minAmount: 10, iconType: 'PayTM' },
    { id: 'epay-phonepe', name: 'PhonePe', category: 'epay', minAmount: 10, iconType: 'PhonePe' },
  ];

  // Crypto (21)
  const cryptoMethods: PaymentMethodItem[] = [
    { id: 'crypto-usdt-trc20', name: 'USDT (TRC-20)', category: 'crypto', minAmount: 10, iconType: 'USDT (TRC-20)', network: 'TRC-20' },
    { id: 'crypto-usdt-bep20', name: 'USDT (BEP-20)', category: 'crypto', minAmount: 20, iconType: 'USDT (BEP-20)', network: 'BEP-20' },
    { id: 'crypto-usdt-erc20', name: 'USDT (ERC-20)', category: 'crypto', minAmount: 50, iconType: 'USDT (ERC-20)', network: 'ERC-20' },
    { id: 'crypto-btc', name: 'Bitcoin (BTC)', category: 'crypto', minAmount: 50, iconType: 'Bitcoin' },
    { id: 'crypto-eth', name: 'Ethereum (ETH)', category: 'crypto', minAmount: 50, iconType: 'Ethereum' },
    { id: 'crypto-binance', name: 'Binance Pay', category: 'crypto', minAmount: 10, iconType: 'Binance Pay' },
    { id: 'crypto-ltc', name: 'Litecoin (LTC)', category: 'crypto', minAmount: 10, iconType: 'Litecoin' },
    { id: 'crypto-xrp', name: 'Ripple (XRP)', category: 'crypto', minAmount: 10, iconType: 'Ripple' },
    { id: 'crypto-trx', name: 'Tron (TRX)', category: 'crypto', minAmount: 10, iconType: 'Tron' },
    { id: 'crypto-doge', name: 'Dogecoin (DOGE)', category: 'crypto', minAmount: 10, iconType: 'Dogecoin' },
    { id: 'crypto-usdc', name: 'USDC (ERC-20)', category: 'crypto', minAmount: 20, iconType: 'USDC' },
    { id: 'crypto-matic', name: 'Polygon (MATIC)', category: 'crypto', minAmount: 15, iconType: 'Polygon' },
    { id: 'crypto-shib', name: 'Shiba Inu (SHIB)', category: 'crypto', minAmount: 20, iconType: 'Shiba Inu' },
    { id: 'crypto-bch', name: 'Bitcoin Cash (BCH)', category: 'crypto', minAmount: 20, iconType: 'Bitcoin Cash' },
    { id: 'crypto-ton', name: 'TON (Toncoin)', category: 'crypto', minAmount: 15, iconType: 'TON' },
    { id: 'crypto-dai', name: 'Dai (DAI)', category: 'crypto', minAmount: 20, iconType: 'Dai' },
    { id: 'crypto-dash', name: 'Dash', category: 'crypto', minAmount: 15, iconType: 'Dash' },
    { id: 'crypto-sol', name: 'Solana (SOL)', category: 'crypto', minAmount: 20, iconType: 'Solana' },
    { id: 'crypto-avax', name: 'Avalanche (AVAX)', category: 'crypto', minAmount: 20, iconType: 'Avalanche' },
    { id: 'crypto-ada', name: 'Cardano (ADA)', category: 'crypto', minAmount: 15, iconType: 'Cardano' },
    { id: 'crypto-dot', name: 'Polkadot (DOT)', category: 'crypto', minAmount: 15, iconType: 'Polkadot' },
  ];

  // Withdrawal methods (Bank transfer + E-pay + Crypto)
  const withdrawalMethods: PaymentMethodItem[] = [
    { id: 'w-phonepe', name: 'PhonePe', category: 'popular', minAmount: 10, iconType: 'PhonePe' },
    { id: 'w-upi', name: 'UPI', category: 'popular', minAmount: 10, iconType: 'UPI' },
    { id: 'w-paytm', name: 'PayTM', category: 'popular', minAmount: 10, iconType: 'PayTM' },
    { id: 'w-bank', name: 'Bank Transfer (IMPS)', category: 'popular', minAmount: 20, iconType: 'Bank' },
    { id: 'w-usdt-trc20', name: 'USDT (TRC-20)', category: 'crypto', minAmount: 10, iconType: 'USDT (TRC-20)', network: 'TRC-20' },
    { id: 'w-usdt-bep20', name: 'USDT (BEP-20)', category: 'crypto', minAmount: 20, iconType: 'USDT (BEP-20)', network: 'BEP-20' },
    { id: 'w-binance-pay', name: 'Binance Pay', category: 'popular', minAmount: 10, iconType: 'Binance Pay' },
    { id: 'w-btc', name: 'Bitcoin (BTC)', category: 'crypto', minAmount: 50, iconType: 'Bitcoin' },
  ];

  const handleSelectMethod = (method: PaymentMethodItem) => {
    setSelectedMethod(method);
    setAmount(Math.max(method.minAmount, activeTab === 'deposit' ? 100 : 50));
    setUtrNumber('');
    setRecipientAddress('');
    setAccountHolderName('');
    setIfscCode('');
    setPhoneNumber('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcessSubmit = async () => {
    if (!selectedMethod) return;
    setIsSubmitting(true);
    try {
      if (activeTab === 'deposit') {
        const bonusAmount = appliedBonus ? amount * 0.5 : 0;
        const totalCredited = amount + bonusAmount;
        const updated = currentBalance + totalCredited;
        if (onBalanceUpdate) onBalanceUpdate(updated);

        const utrVal = utrNumber.trim() || `REF${Date.now().toString().slice(-8)}`;
        if (onSuccess) {
          await onSuccess(amount, {
            method: selectedMethod.name,
            utr: utrVal,
            category: selectedMethod.category,
            bonus: bonusAmount
          });
        }
        
        // Save local backup
        const localHist = JSON.parse(localStorage.getItem('deposit_history') || '[]');
        localHist.unshift({
          type: 'DEPOSIT',
          method: selectedMethod.name,
          amount,
          utr: utrVal,
          status: 'PENDING',
          timestamp: Date.now()
        });
        localStorage.setItem('deposit_history', JSON.stringify(localHist.slice(0, 50)));

        setLastProcessedAmount(amount);
        setShowSuccessModal(true);
      } else {
        if (amount > currentBalance && currentBalance > 0) {
          alert('Insufficient funds for withdrawal. Your balance is ' + currency + currentBalance.toFixed(2));
          setIsSubmitting(false);
          return;
        }
        const updated = Math.max(0, currentBalance - amount);
        if (onBalanceUpdate) onBalanceUpdate(updated);

        if (onSuccess) {
          await onSuccess(amount, {
            method: selectedMethod.name,
            account: recipientAddress,
            name: accountHolderName,
            ifsc: ifscCode,
            phone: phoneNumber
          });
        }

        // Save local backup
        const localHist = JSON.parse(localStorage.getItem('withdrawal_history') || '[]');
        localHist.unshift({
          type: 'WITHDRAWAL',
          method: selectedMethod.name,
          amount,
          account: recipientAddress,
          status: 'PENDING',
          timestamp: Date.now()
        });
        localStorage.setItem('withdrawal_history', JSON.stringify(localHist.slice(0, 50)));

        alert(`Withdrawal request of ${currency}${amount} submitted successfully! Your funds will be credited within 1-24 hours.`);
        setSelectedMethod(null);
        setActiveTab('history');
      }
    } catch (e) {
      console.error(e);
      alert('Error processing request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const countries = [
    { name: 'India', flag: '🇮🇳' },
    { name: 'United States', flag: '🇺🇸' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'Bangladesh', flag: '🇧🇩' },
    { name: 'Pakistan', flag: '🇵🇰' },
    { name: 'Indonesia', flag: '🇮🇩' },
    { name: 'Brazil', flag: '🇧🇷' },
    { name: 'Vietnam', flag: '🇻🇳' },
  ];

  const filteredTransactions = transactionsList.filter(t => {
    if (historyFilter === 'ALL') return true;
    return (t.type || '').toUpperCase() === historyFilter;
  });

  return (
    <>
      {/* Deposit Success Modal */}
      {showSuccessModal && (
        <DepositSuccessModal 
          amount={lastProcessedAmount}
          currency={currency}
          onClose={() => {
            setShowSuccessModal(false);
            onClose();
          }}
        />
      )}

      {/* Main Overlay */}
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-[#1b212c] border border-[#2b3546] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col text-white max-h-[92vh]">
          
          {/* Header with Title, Tabs for Deposit / Withdrawal / Transactions & Close Button */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#2b3546] bg-[#161b24] select-none">
            <div className="flex items-center gap-6">
              
              {/* Authentic Quotex Tab Navigation */}
              <div className="flex items-center gap-1 sm:gap-2">
                
                {/* Deposit Tab */}
                <button
                  type="button"
                  onClick={() => { setActiveTab('deposit'); setSelectedMethod(null); }}
                  className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'deposit'
                      ? 'bg-[#00c26f] text-white shadow-lg shadow-[#00c26f]/25'
                      : 'text-gray-400 hover:text-white hover:bg-[#202735]'
                  }`}
                >
                  <ArrowDownLeft size={16} strokeWidth={2.5} />
                  <span>Deposit</span>
                </button>

                {/* Withdrawal Tab */}
                <button
                  type="button"
                  onClick={() => { setActiveTab('withdrawal'); setSelectedMethod(null); }}
                  className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'withdrawal'
                      ? 'bg-[#1e88e5] text-white shadow-lg shadow-[#1e88e5]/25'
                      : 'text-gray-400 hover:text-white hover:bg-[#202735]'
                  }`}
                >
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                  <span>Withdrawal</span>
                </button>

                {/* Transactions / History Tab */}
                <button
                  type="button"
                  onClick={() => { setActiveTab('history'); setSelectedMethod(null); }}
                  className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'history'
                      ? 'bg-[#2b3546] text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-[#202735]'
                  }`}
                >
                  <Clock size={15} />
                  <span>Transactions</span>
                </button>

              </div>

              {/* Balance display badge */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#202735] border border-[#2c3647] text-xs font-mono">
                <span className="text-gray-400 font-medium">Real:</span>
                <span className="font-bold text-[#00c26f]">{currency}{currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#202735] transition-colors cursor-pointer"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* TAB 1: DEPOSIT */}
          {activeTab === 'deposit' && (
            <>
              {/* Subheader: Country selector dropdown */}
              <div className="px-6 pt-3.5 pb-2 relative z-30">
                <div 
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="w-full bg-[#242b38] border border-[#333e52] rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer hover:border-gray-500 transition-colors shadow-inner"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-gray-300" />
                    <span className="text-sm font-semibold text-white">{selectedCountry}</span>
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Country Dropdown Menu */}
                {isCountryDropdownOpen && (
                  <div className="absolute left-6 right-6 top-[54px] bg-[#1d232f] border border-[#333e52] rounded-xl shadow-2xl py-2 z-40 max-h-60 overflow-y-auto">
                    {countries.map((c) => (
                      <div
                        key={c.name}
                        onClick={() => { setSelectedCountry(c.name); setIsCountryDropdownOpen(false); }}
                        className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer hover:bg-[#283244] transition-colors ${
                          selectedCountry === c.name ? 'text-[#00c26f] font-bold bg-[#00c26f]/10' : 'text-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base">{c.flag}</span>
                          <span>{c.name}</span>
                        </div>
                        {selectedCountry === c.name && <Check size={16} className="text-[#00c26f]" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Body: Two-Column Quotex Layout */}
              <div className="p-6 pt-2 flex-1 overflow-y-auto flex flex-col md:flex-row gap-6">

                {/* Left Column: Categories (POPULAR, E-PAY, CRYPTO) */}
                <div className="w-full md:w-[250px] shrink-0 flex flex-col gap-3">
                  
                  {/* Category 1: POPULAR */}
                  <div
                    onClick={() => { setSelectedCategory('POPULAR'); setSelectedMethod(null); }}
                    className={`rounded-2xl p-4 cursor-pointer transition-all shadow-md select-none ${
                      selectedCategory === 'POPULAR'
                        ? 'bg-[#00c26f] text-white shadow-[#00c26f]/20'
                        : 'bg-[#222937] hover:bg-[#283142] text-gray-200 border border-[#2b3546]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Flame size={20} className={selectedCategory === 'POPULAR' ? 'text-white fill-white' : 'text-emerald-400'} />
                      <span className="font-extrabold text-sm tracking-wider uppercase">POPULAR</span>
                    </div>
                    <div className={`text-xs font-semibold mb-3 ${selectedCategory === 'POPULAR' ? 'text-emerald-100' : 'text-gray-400'}`}>
                      8 methods
                    </div>
                    {/* Preview Mini Icons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="w-6 h-6 rounded-full bg-[#5f259f] flex items-center justify-center text-[10px] text-white font-bold shadow-xs">pe</div>
                      <div className="h-6 px-1.5 rounded bg-white flex items-center justify-center shadow-xs">
                        <span className="text-[9px] font-black text-gray-800 italic">UPI</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#f0b90b] flex items-center justify-center text-[11px] text-black font-black shadow-xs">◇</div>
                      <div className="h-6 px-1.5 rounded bg-[#002e6e] flex items-center justify-center shadow-xs">
                        <span className="text-[9px] font-black text-[#00b9f5]">Paytm</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#50af95] flex items-center justify-center text-[11px] text-white font-black shadow-xs">₮</div>
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                        selectedCategory === 'POPULAR' ? 'bg-white/20 text-white' : 'bg-[#2f394c] text-gray-300'
                      }`}>+3</span>
                    </div>
                  </div>

                  {/* Category 2: E-PAY */}
                  <div
                    onClick={() => { setSelectedCategory('E-PAY'); setSelectedMethod(null); }}
                    className={`rounded-2xl p-4 cursor-pointer transition-all shadow-md select-none ${
                      selectedCategory === 'E-PAY'
                        ? 'bg-[#00c26f] text-white shadow-[#00c26f]/20'
                        : 'bg-[#222937] hover:bg-[#283142] text-gray-200 border border-[#2b3546]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet size={18} className={selectedCategory === 'E-PAY' ? 'text-white' : 'text-blue-400'} />
                      <span className="font-extrabold text-sm tracking-wider uppercase">E-PAY</span>
                    </div>
                    <div className={`text-xs font-semibold mb-3 ${selectedCategory === 'E-PAY' ? 'text-emerald-100' : 'text-gray-400'}`}>
                      4 methods
                    </div>
                    {/* Preview Mini Icons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="h-6 px-1.5 rounded bg-white flex items-center justify-center shadow-xs">
                        <span className="text-[9px] font-black text-gray-800 italic">UPI</span>
                      </div>
                      <div className="h-6 px-1.5 rounded bg-white flex items-center justify-center shadow-xs">
                        <span className="text-[9px] font-black text-emerald-600 italic">UPI</span>
                      </div>
                      <div className="h-6 px-1.5 rounded bg-[#002e6e] flex items-center justify-center shadow-xs">
                        <span className="text-[9px] font-black text-[#00b9f5]">Paytm</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#5f259f] flex items-center justify-center text-[10px] text-white font-bold shadow-xs">pe</div>
                    </div>
                  </div>

                  {/* Category 3: CRYPTO */}
                  <div
                    onClick={() => { setSelectedCategory('CRYPTO'); setSelectedMethod(null); }}
                    className={`rounded-2xl p-4 cursor-pointer transition-all shadow-md select-none ${
                      selectedCategory === 'CRYPTO'
                        ? 'bg-[#00c26f] text-white shadow-[#00c26f]/20'
                        : 'bg-[#222937] hover:bg-[#283142] text-gray-200 border border-[#2b3546]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Hexagon size={18} className={selectedCategory === 'CRYPTO' ? 'text-white' : 'text-amber-400'} />
                      <span className="font-extrabold text-sm tracking-wider uppercase">CRYPTO</span>
                    </div>
                    <div className={`text-xs font-semibold mb-3 ${selectedCategory === 'CRYPTO' ? 'text-emerald-100' : 'text-gray-400'}`}>
                      21 methods
                    </div>
                    {/* Preview Mini Icons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="w-6 h-6 rounded-full bg-[#f0b90b] flex items-center justify-center text-[10px] text-black font-black shadow-xs">◇</div>
                      <div className="w-6 h-6 rounded-full bg-[#50af95] flex items-center justify-center text-[10px] text-white font-black shadow-xs">₮</div>
                      <div className="w-6 h-6 rounded-full bg-[#f7931a] flex items-center justify-center text-[11px] text-white font-bold shadow-xs">₿</div>
                      <div className="w-6 h-6 rounded-full bg-[#627eea] flex items-center justify-center text-[10px] text-white font-bold shadow-xs">Ξ</div>
                      <div className="w-6 h-6 rounded-full bg-[#345d9d] flex items-center justify-center text-[10px] text-white font-bold shadow-xs">Ł</div>
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                        selectedCategory === 'CRYPTO' ? 'bg-white/20 text-white' : 'bg-[#2f394c] text-gray-300'
                      }`}>+16</span>
                    </div>
                  </div>

                </div>

                {/* Right Column: Methods Grid OR Selected Method Checkout Form */}
                <div className="flex-1 flex flex-col min-h-0">
                  {selectedMethod ? (
                    /* Method Checkout View */
                    <div className="bg-[#161b24] border border-[#2b3546] rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in duration-150">
                      {/* Top Bar with Back Button */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#2b3546]">
                        <button
                          onClick={() => setSelectedMethod(null)}
                          className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <ArrowLeft size={16} />
                          <span>Back to methods</span>
                        </button>
                        <div className="flex items-center gap-2">
                          <PaymentMethodIcon name={selectedMethod.name} size={28} />
                          <span className="font-bold text-sm text-white">{selectedMethod.name}</span>
                        </div>
                      </div>

                      {/* Amount Input */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs text-[#8593a6] font-semibold uppercase tracking-wider">
                            Deposit Amount
                          </label>
                          <span className="text-xs text-gray-400">
                            Min: <strong className="text-white">${selectedMethod.minAmount}.00</strong>
                          </span>
                        </div>

                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                          <input
                            type="number"
                            min={selectedMethod.minAmount}
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full bg-[#202735] border border-[#2c3647] rounded-xl pl-8 pr-4 py-2.5 text-base font-bold text-white focus:outline-none focus:border-[#00c26f]"
                          />
                        </div>

                        {/* Amount Presets */}
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2.5">
                          {[10, 50, 100, 250, 500, 1000].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setAmount(preset)}
                              className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                amount === preset
                                  ? 'bg-[#00c26f] border-[#00c26f] text-white'
                                  : 'bg-[#202735] border-[#2c3647] text-gray-300 hover:border-gray-500'
                              }`}
                            >
                              ${preset}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Payment Details Container */}
                      <div className="bg-[#12161f] border border-[#2b3546] rounded-xl p-4 flex flex-col gap-3">
                        {selectedMethod.category === 'crypto' ? (
                          <>
                            <div className="text-xs text-gray-400 flex items-center justify-between">
                              <span>Deposit Address ({selectedMethod.network || 'Official'}):</span>
                              <span className="text-amber-400 font-semibold text-[11px]">Instant Automated Verification</span>
                            </div>
                            <div className="flex items-center justify-between bg-[#191f2b] border border-[#283243] rounded-lg p-2.5">
                              <span className="font-mono text-xs text-gray-200 truncate select-all">
                                0x71C...8B39qXQuotexOfficialDepositWallet
                              </span>
                              <button
                                onClick={() => handleCopy('0x71C3D8210928aF39B88081298412491b8B39qX')}
                                className="ml-2 px-2.5 py-1 bg-[#232c3d] hover:bg-[#2e3a50] rounded text-xs font-semibold text-gray-200 flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                {copied ? <Check size={14} className="text-[#00c26f]" /> : <Copy size={14} />}
                                <span>{copied ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>

                            <div>
                              <label className="text-xs text-gray-400 block mb-1">Blockchain TxID / Hash (Optional):</label>
                              <input
                                type="text"
                                value={utrNumber}
                                onChange={e => setUtrNumber(e.target.value)}
                                placeholder="Paste your transaction hash"
                                className="w-full bg-[#191f2b] border border-[#283243] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00c26f]"
                              />
                            </div>
                          </>
                        ) : selectedMethod.name === 'Binance Pay' ? (
                          <>
                            <div className="text-xs text-gray-400 flex items-center justify-between">
                              <span>Binance Pay ID:</span>
                              <span className="text-[#f0b90b] font-semibold text-[11px]">Zero Fee Transfer</span>
                            </div>
                            <div className="flex items-center justify-between bg-[#191f2b] border border-[#283243] rounded-lg p-2.5">
                              <span className="font-mono text-sm font-bold text-yellow-400 select-all">
                                294819204
                              </span>
                              <button
                                onClick={() => handleCopy('294819204')}
                                className="ml-2 px-2.5 py-1 bg-[#232c3d] hover:bg-[#2e3a50] rounded text-xs font-semibold text-gray-200 flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                {copied ? <Check size={14} className="text-[#00c26f]" /> : <Copy size={14} />}
                                <span>{copied ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                            <div>
                              <label className="text-xs text-gray-400 block mb-1">Binance Order ID / Reference:</label>
                              <input
                                type="text"
                                value={utrNumber}
                                onChange={e => setUtrNumber(e.target.value)}
                                placeholder="e.g. 293810293"
                                className="w-full bg-[#191f2b] border border-[#283243] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00c26f]"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            {/* UPI / PhonePe / Paytm Details */}
                            <div className="text-xs text-gray-400 flex items-center justify-between">
                              <span>Official UPI VPA / ID:</span>
                              <span className="text-emerald-400 font-semibold text-[11px]">Instant UPI Auto-Credit</span>
                            </div>
                            <div className="flex items-center justify-between bg-[#191f2b] border border-[#283243] rounded-lg p-2.5">
                              <span className="font-mono text-sm font-bold text-white select-all">
                                pay.quotex@icici
                              </span>
                              <button
                                onClick={() => handleCopy('pay.quotex@icici')}
                                className="ml-2 px-2.5 py-1 bg-[#232c3d] hover:bg-[#2e3a50] rounded text-xs font-semibold text-gray-200 flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                {copied ? <Check size={14} className="text-[#00c26f]" /> : <Copy size={14} />}
                                <span>{copied ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>

                            <div>
                              <label className="text-xs text-gray-400 block mb-1">
                                Enter 12-digit UTR / Ref Number:
                              </label>
                              <input
                                type="text"
                                maxLength={12}
                                value={utrNumber}
                                onChange={e => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                                placeholder="e.g. 428901238910"
                                className="w-full bg-[#191f2b] border border-[#283243] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00c26f]"
                              />
                            </div>
                          </>
                        )}

                        {/* Promo Bonus Checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            checked={appliedBonus}
                            onChange={e => setAppliedBonus(e.target.checked)}
                            className="rounded text-[#00c26f] focus:ring-0"
                          />
                          <span className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                            <Sparkles size={14} className="text-amber-400" /> Apply 50% First Deposit Bonus (+${(amount * 0.5).toFixed(0)})
                          </span>
                        </label>
                      </div>

                      {/* Submit Action Button */}
                      <button
                        onClick={handleProcessSubmit}
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer bg-[#00c26f] hover:bg-[#00c26f]/90 shadow-[#00c26f]/25"
                      >
                        <span>{isSubmitting ? 'Processing...' : `Deposit ${currency}${amount}`}</span>
                        <ArrowRight size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  ) : (
                    /* Payment Methods Cards Grid */
                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5 custom-scrollbar">
                      
                      {/* Section 1: Popular in your region (8) */}
                      {(selectedCategory === 'POPULAR' || selectedCategory === 'E-PAY') && (
                        <div>
                          <div className="text-sm font-bold text-white mb-2.5 flex items-center justify-between">
                            <span>Popular in your region ({popularMethods.length})</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {popularMethods.map((m) => (
                              <div
                                key={m.id}
                                onClick={() => handleSelectMethod(m)}
                                className="bg-white hover:bg-gray-50 rounded-xl p-3 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all group border border-transparent hover:border-gray-300"
                              >
                                <div className="flex items-center gap-3">
                                  <PaymentMethodIcon name={m.name} type={m.iconType} size={36} />
                                  <div className="flex flex-col">
                                    <span className="font-bold text-gray-900 text-sm group-hover:text-black">
                                      {m.name}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">
                                      Min. ${m.minAmount}.00
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Section 2: E-Pay (4) */}
                      {(selectedCategory === 'POPULAR' || selectedCategory === 'E-PAY') && (
                        <div>
                          <div className="text-sm font-bold text-white mb-2.5">
                            <span>E-Pay ({epayMethods.length})</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {epayMethods.map((m) => (
                              <div
                                key={m.id}
                                onClick={() => handleSelectMethod(m)}
                                className="bg-white hover:bg-gray-50 rounded-xl p-3 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all group border border-transparent hover:border-gray-300"
                              >
                                <div className="flex items-center gap-3">
                                  <PaymentMethodIcon name={m.name} type={m.iconType} size={36} />
                                  <div className="flex flex-col">
                                    <span className="font-bold text-gray-900 text-sm group-hover:text-black">
                                      {m.name}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">
                                      Min. ${m.minAmount}.00
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Section 3: Crypto (21) */}
                      {(selectedCategory === 'POPULAR' || selectedCategory === 'CRYPTO') && (
                        <div>
                          <div className="text-sm font-bold text-white mb-2.5">
                            <span>Crypto ({cryptoMethods.length})</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {cryptoMethods.map((m) => (
                              <div
                                key={m.id}
                                onClick={() => handleSelectMethod(m)}
                                className="bg-white hover:bg-gray-50 rounded-xl p-3 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all group border border-transparent hover:border-gray-300"
                              >
                                <div className="flex items-center gap-3">
                                  <PaymentMethodIcon name={m.name} type={m.iconType} size={36} />
                                  <div className="flex flex-col">
                                    <span className="font-bold text-gray-900 text-sm group-hover:text-black">
                                      {m.name}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">
                                      Min. ${m.minAmount}.00
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>

              </div>
            </>
          )}

          {/* TAB 2: WITHDRAWAL */}
          {activeTab === 'withdrawal' && (
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-5 custom-scrollbar">
              
              {/* Balance Summary Header Card */}
              <div className="bg-[#242b38] border border-[#333e52] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1e88e5]/15 border border-[#1e88e5]/30 flex items-center justify-center text-[#1e88e5]">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Available for Withdrawal</div>
                    <div className="text-2xl font-black text-white">
                      {currency}{currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-gray-300 bg-[#1a202c] px-4 py-2 rounded-xl border border-[#2b3546]">
                  <div>Commission: <span className="text-[#00c26f] font-bold">0% (Free)</span></div>
                  <div>Processing: <span className="text-white font-bold">1 - 24 Hours</span></div>
                </div>
              </div>

              {selectedMethod ? (
                /* Withdrawal Checkout Form */
                <div className="bg-[#161b24] border border-[#2b3546] rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-[#2b3546]">
                    <button
                      onClick={() => setSelectedMethod(null)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                      <span>Back to withdrawal methods</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <PaymentMethodIcon name={selectedMethod.name} size={28} />
                      <span className="font-bold text-sm text-white">{selectedMethod.name}</span>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-[#8593a6] font-semibold uppercase tracking-wider">
                        Withdrawal Amount
                      </label>
                      <span className="text-xs text-gray-400">
                        Min: <strong className="text-white">${selectedMethod.minAmount}.00</strong>
                      </span>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input
                        type="number"
                        min={selectedMethod.minAmount}
                        max={currentBalance}
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-[#202735] border border-[#2c3647] rounded-xl pl-8 pr-4 py-2.5 text-base font-bold text-white focus:outline-none focus:border-[#1e88e5]"
                      />
                    </div>

                    {/* Percentage buttons */}
                    <div className="grid grid-cols-4 gap-2 mt-2.5">
                      {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setAmount(Math.max(selectedMethod.minAmount, Math.floor(currentBalance * pct)))}
                          className="py-1.5 rounded-lg text-xs font-bold border border-[#2c3647] bg-[#202735] text-gray-300 hover:border-[#1e88e5] hover:text-white transition-colors cursor-pointer"
                        >
                          {pct * 100}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Beneficiary Inputs */}
                  <div className="bg-[#12161f] border border-[#2b3546] rounded-xl p-4 flex flex-col gap-3">
                    {selectedMethod.category === 'crypto' ? (
                      <>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">
                            Your Receiving Wallet Address ({selectedMethod.network || 'Crypto'}):
                          </label>
                          <input
                            type="text"
                            value={recipientAddress}
                            onChange={e => setRecipientAddress(e.target.value)}
                            placeholder="Enter your crypto address"
                            className="w-full bg-[#191f2b] border border-[#283243] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#1e88e5]"
                          />
                        </div>
                      </>
                    ) : selectedMethod.name.includes('Bank') ? (
                      <>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Bank Account Number:</label>
                          <input
                            type="text"
                            value={recipientAddress}
                            onChange={e => setRecipientAddress(e.target.value)}
                            placeholder="Enter 9-18 digit account number"
                            className="w-full bg-[#191f2b] border border-[#283243] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#1e88e5]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Account Holder Full Name:</label>
                          <input
                            type="text"
                            value={accountHolderName}
                            onChange={e => setAccountHolderName(e.target.value)}
                            placeholder="Full name matching bank records"
                            className="w-full bg-[#191f2b] border border-[#283243] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1e88e5]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">IFSC Code:</label>
                            <input
                              type="text"
                              value={ifscCode}
                              onChange={e => setIfscCode(e.target.value.toUpperCase())}
                              placeholder="e.g. SBIN0001234"
                              className="w-full bg-[#191f2b] border border-[#283243] rounded-lg px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-[#1e88e5]"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Phone Number:</label>
                            <input
                              type="text"
                              value={phoneNumber}
                              onChange={e => setPhoneNumber(e.target.value)}
                              placeholder="+91..."
                              className="w-full bg-[#191f2b] border border-[#283243] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1e88e5]"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">
                            {selectedMethod.name} UPI ID / VPA:
                          </label>
                          <input
                            type="text"
                            value={recipientAddress}
                            onChange={e => setRecipientAddress(e.target.value)}
                            placeholder="e.g. user@okhdfcbank or 9876543210@ybl"
                            className="w-full bg-[#191f2b] border border-[#283243] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1e88e5]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Account Holder Full Name:</label>
                          <input
                            type="text"
                            value={accountHolderName}
                            onChange={e => setAccountHolderName(e.target.value)}
                            placeholder="Full name matching your bank account"
                            className="w-full bg-[#191f2b] border border-[#283243] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1e88e5]"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleProcessSubmit}
                    disabled={isSubmitting || amount <= 0 || amount > currentBalance}
                    className="w-full py-3.5 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer bg-[#1e88e5] hover:bg-[#1e88e5]/90 shadow-[#1e88e5]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Submitting...' : `Withdraw ${currency}${amount}`}</span>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                /* Withdrawal Methods Grid */
                <div>
                  <div className="text-sm font-bold text-white mb-3">
                    <span>Select Withdrawal Method ({withdrawalMethods.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {withdrawalMethods.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleSelectMethod(m)}
                        className="bg-white hover:bg-gray-50 rounded-xl p-3 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all group border border-transparent hover:border-gray-300"
                      >
                        <div className="flex items-center gap-3">
                          <PaymentMethodIcon name={m.name} type={m.iconType} size={36} />
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-sm group-hover:text-black">
                              {m.name}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              Min. ${m.minAmount}.00 • Instant
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: TRANSACTIONS / HISTORY */}
          {activeTab === 'history' && (
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
              
              {/* Filter Tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-[#2b3546]">
                <div className="flex items-center gap-2">
                  {(['ALL', 'DEPOSIT', 'WITHDRAWAL'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setHistoryFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        historyFilter === f
                          ? 'bg-[#1e88e5] text-white shadow-sm'
                          : 'bg-[#202735] text-gray-400 hover:text-white'
                      }`}
                    >
                      {f === 'ALL' ? 'All Transactions' : f === 'DEPOSIT' ? 'Deposits' : 'Withdrawals'}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-gray-400 font-mono">
                  {filteredTransactions.length} records
                </span>
              </div>

              {/* Transactions List */}
              {filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                  <Clock size={36} className="text-gray-600 mb-3" />
                  <div className="font-bold text-white text-base mb-1">No Transactions Found</div>
                  <p className="text-xs max-w-sm text-gray-400 mb-4">
                    Your deposit and withdrawal operations will appear here with real-time status updates.
                  </p>
                  <button
                    onClick={() => setActiveTab('deposit')}
                    className="px-5 py-2 bg-[#00c26f] hover:bg-[#00c26f]/90 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Make a Deposit
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {filteredTransactions.map((tx, idx) => {
                    const isDep = (tx.type || '').toUpperCase() === 'DEPOSIT';
                    const isPending = (tx.status || '').toUpperCase() === 'PENDING';
                    const isCompleted = (tx.status || '').toUpperCase() === 'COMPLETED' || (tx.status || '').toUpperCase() === 'SUCCESS';

                    return (
                      <div
                        key={tx.id || idx}
                        className="bg-[#202735] border border-[#2c3647] rounded-xl p-3.5 flex items-center justify-between hover:border-gray-500 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isDep ? 'bg-[#00c26f]/15 text-[#00c26f]' : 'bg-[#1e88e5]/15 text-[#1e88e5]'
                          }`}>
                            {isDep ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white flex items-center gap-2">
                              <span>{isDep ? 'Deposit' : 'Withdrawal'} via {tx.method || 'Standard'}</span>
                              {tx.utr && (
                                <span className="text-[10px] font-mono text-gray-400 bg-[#161b24] px-1.5 py-0.5 rounded">
                                  Ref: {tx.utr}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {new Date(tx.timestamp || Date.now()).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className={`font-black text-base font-mono ${
                            isDep ? 'text-[#00c26f]' : 'text-[#e33f4a]'
                          }`}>
                            {isDep ? '+' : '-'}{currency}{Number(tx.amount || 0).toFixed(2)}
                          </div>
                          <div className="mt-1">
                            {isCompleted ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00c26f]/15 text-[#00c26f] border border-[#00c26f]/30 flex items-center gap-1">
                                <CheckCircle size={10} /> Completed
                              </span>
                            ) : isPending ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 flex items-center gap-1 animate-pulse">
                                <Clock size={10} /> Pending
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1">
                                <XCircle size={10} /> Rejected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default DepositWithdrawalModal;
