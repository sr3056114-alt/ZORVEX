import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  CreditCard, Plus, Edit2, Trash2, Save, X, Check, RefreshCw, 
  AlertCircle, QrCode, Flame, Wallet, Coins, Search, ArrowUpRight
} from 'lucide-react';
import { PaymentMethodIcon } from '../PaymentMethodIcon';
import { ALL_QUOTEX_METHODS, QuotexPaymentMethod } from '../../data/quotexPaymentMethods';

export default function AdminPayments() {
  const [methods, setMethods] = useState<QuotexPaymentMethod[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [filterTab, setFilterTab] = useState<'ALL' | 'POPULAR' | 'EPAY' | 'CRYPTO' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<QuotexPaymentMethod>({
    id: '',
    name: '',
    category: 'POPULAR',
    type: 'UPI',
    networkBadge: '',
    status: 'ACTIVE',
    minAmount: 10,
    maxAmount: 10000,
    processingTime: 'Instant',
    instructions: '',
    credentials: '',
    upiId: '',
    showUpiId: true,
    scannerUrl: '',
    order: 1
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 4500);
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'paymentMethods'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as QuotexPaymentMethod));
      list.sort((a, b) => (a.order || 99) - (b.order || 99));
      setMethods(list);
    }, (err) => {
      console.warn("Firestore paymentMethods error:", err);
      showNotification("Error loading payment methods: " + err.message, "error");
    });
    return () => unsub();
  }, []);

  // Quick 1-click status toggle directly from table
  const handleToggleStatus = async (item: QuotexPaymentMethod) => {
    const nextStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      setMethods(prev => prev.map(m => m.id === item.id ? { ...m, status: nextStatus } : m));
      await updateDoc(doc(db, 'paymentMethods', item.id), {
        status: nextStatus,
        isActive: nextStatus === 'ACTIVE',
        updatedAt: Date.now()
      });
      showNotification(`"${item.name}" is now ${nextStatus}! Platform updated in real-time.`, 'success');
    } catch (err: any) {
      console.error(err);
      try {
        await setDoc(doc(db, 'paymentMethods', item.id), {
          ...item,
          status: nextStatus,
          isActive: nextStatus === 'ACTIVE',
          updatedAt: Date.now()
        }, { merge: true });
        showNotification(`"${item.name}" is now ${nextStatus}!`, 'success');
      } catch (e: any) {
        showNotification("Failed to update status: " + e.message, "error");
      }
    }
  };

  // Seed or re-sync all 25+ Quotex methods
  const handleSeedQuotexMethods = async () => {
    if (!window.confirm("Do you want to sync all 25+ official Quotex payment methods (Popular, E-Pay, and 21 Crypto) to your platform?")) {
      return;
    }
    setSeeding(true);
    try {
      for (const m of ALL_QUOTEX_METHODS) {
        await setDoc(doc(db, 'paymentMethods', m.id), {
          ...m,
          isActive: m.status === 'ACTIVE',
          updatedAt: Date.now()
        }, { merge: true });
      }
      showNotification(`Successfully synced ${ALL_QUOTEX_METHODS.length} official Quotex payment methods!`, "success");
    } catch (err: any) {
      console.error(err);
      showNotification("Error seeding methods: " + err.message, "error");
    } finally {
      setSeeding(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showNotification("File size exceeds 2MB limit", "error");
      return;
    }
    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `payment_scanners/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, scannerUrl: url }));
      showNotification("Scanner QR code uploaded successfully!", "success");
    } catch(err) {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFormData(prev => ({ ...prev, scannerUrl: event.target!.result as string }));
            showNotification("Scanner image attached!", "success");
          }
        };
        reader.readAsDataURL(file);
      } catch (readErr: any) {
        showNotification("Error reading image: " + readErr.message, "error");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const methodId = formData.id || `pm_${formData.category.toLowerCase()}_${Date.now()}`;
      const payload: QuotexPaymentMethod = {
        id: methodId,
        name: formData.name.trim(),
        category: formData.category,
        type: formData.type,
        networkBadge: formData.networkBadge || '',
        status: formData.status,
        minAmount: Number(formData.minAmount) || 10,
        maxAmount: Number(formData.maxAmount) || 50000,
        processingTime: formData.processingTime || 'Instant',
        instructions: formData.instructions || '',
        credentials: formData.credentials || '',
        upiId: formData.upiId || formData.credentials || '',
        showUpiId: formData.showUpiId ?? true,
        scannerUrl: formData.scannerUrl || '',
        order: Number(formData.order) || 10
      };

      await setDoc(doc(db, 'paymentMethods', methodId), {
        ...payload,
        isActive: payload.status === 'ACTIVE',
        updatedAt: Date.now()
      }, { merge: true });

      showNotification(`Payment method "${formData.name}" saved successfully!`, 'success');
      setShowAdd(false);
      setFormData({
        id: '',
        name: '',
        category: 'POPULAR',
        type: 'UPI',
        networkBadge: '',
        status: 'ACTIVE',
        minAmount: 10,
        maxAmount: 10000,
        processingTime: 'Instant',
        instructions: '',
        credentials: '',
        upiId: '',
        showUpiId: true,
        scannerUrl: '',
        order: 1
      });
    } catch (err: any) {
      console.error(err);
      showNotification("Failed to save payment method: " + err.message, "error");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the platform?`)) return;
    try {
      await deleteDoc(doc(db, 'paymentMethods', id));
      showNotification(`"${name}" removed successfully!`, 'success');
    } catch (err: any) {
      console.error(err);
      showNotification("Failed to delete method: " + err.message, "error");
    }
  };

  const handleEdit = (m: QuotexPaymentMethod) => {
    setFormData({
      id: m.id,
      name: m.name,
      category: m.category || 'POPULAR',
      type: m.type || 'UPI',
      networkBadge: m.networkBadge || '',
      status: m.status || 'ACTIVE',
      minAmount: m.minAmount || 10,
      maxAmount: m.maxAmount || 10000,
      processingTime: m.processingTime || 'Instant',
      instructions: m.instructions || '',
      credentials: m.credentials || '',
      upiId: m.upiId || m.credentials || '',
      showUpiId: m.showUpiId ?? true,
      scannerUrl: m.scannerUrl || '',
      order: m.order || 1
    });
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered list
  const filteredMethods = useMemo(() => {
    return methods.filter(m => {
      // Category filter
      if (filterTab === 'POPULAR' && m.category !== 'POPULAR') return false;
      if (filterTab === 'EPAY' && m.category !== 'EPAY') return false;
      if (filterTab === 'CRYPTO' && m.category !== 'CRYPTO') return false;
      if (filterTab === 'ACTIVE' && m.status !== 'ACTIVE') return false;
      if (filterTab === 'INACTIVE' && m.status !== 'INACTIVE') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (m.name || '').toLowerCase().includes(q);
        const matchesType = (m.type || '').toLowerCase().includes(q);
        const matchesCategory = (m.category || '').toLowerCase().includes(q);
        const matchesBadge = (m.networkBadge || '').toLowerCase().includes(q);
        return matchesName || matchesType || matchesCategory || matchesBadge;
      }
      return true;
    });
  }, [methods, filterTab, searchQuery]);

  return (
    <div className="space-y-6">
      {notice && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-sm shadow-md animate-in slide-in-from-top-2 duration-200 ${
          notice.type === 'success' 
            ? 'bg-[#0ba259]/15 border-[#0ba259]/40 text-[#0ba259]' 
            : 'bg-[#e33f4a]/15 border-[#e33f4a]/40 text-[#e33f4a]'
        }`}>
          <div className="flex items-center gap-2.5">
            {notice.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span className="font-medium">{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-gray-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* TOP CONTROLS & HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#1a202c] p-6 rounded-xl border border-[#2b3342]">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h2 className="text-xl font-bold text-white tracking-tight">Deposit & Payment Gateway Management</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00a65a]/20 text-[#00a65a] border border-[#00a65a]/30">
              Live Quotex Sync
            </span>
          </div>
          <p className="text-xs text-[#8390a0]">
            Manage all 25+ real payment methods (Popular, E-Pay, and 21 Crypto currencies). Set receiving wallets, QR scanners, and limits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button 
            disabled={seeding}
            onClick={handleSeedQuotexMethods}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00a65a] hover:bg-[#00a65a]/90 text-white rounded-lg font-bold text-xs transition-colors shadow-md shadow-[#00a65a]/20 disabled:opacity-50"
            title="Import all 25+ Quotex methods matching the screenshots"
          >
            <RefreshCw size={15} className={seeding ? 'animate-spin' : ''} />
            <span>{seeding ? 'Syncing...' : 'Sync All 25+ Quotex Methods'}</span>
          </button>

          <button 
            onClick={() => {
              setShowAdd(!showAdd);
              if (showAdd) {
                setFormData({
                  id: '',
                  name: '',
                  category: 'POPULAR',
                  type: 'UPI',
                  networkBadge: '',
                  status: 'ACTIVE',
                  minAmount: 10,
                  maxAmount: 10000,
                  processingTime: 'Instant',
                  instructions: '',
                  credentials: '',
                  upiId: '',
                  showUpiId: true,
                  scannerUrl: '',
                  order: 1
                });
              }
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e88e5] hover:bg-[#1976d2] text-white rounded-lg font-bold text-xs transition-colors shadow-md shadow-[#1e88e5]/20"
          >
            {showAdd ? <X size={15} /> : <Plus size={15} />}
            <span>{showAdd ? 'Close Form' : 'Add Payment Method'}</span>
          </button>
        </div>
      </div>

      {/* ADD / EDIT MODAL FORM */}
      {showAdd && (
        <form onSubmit={handleSave} className="bg-[#1a202c] p-6 rounded-xl border border-[#2b3342] space-y-5 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#2b3342] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00a65a]"></span>
              <h3 className="font-bold text-base text-white">
                {formData.id ? `Edit: ${formData.name}` : 'Add New Payment Gateway Method'}
              </h3>
            </div>
            <button type="button" onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Quick preset selector to easily create Quotex items */}
          <div className="bg-[#141923] p-3.5 rounded-lg border border-[#262f3e]">
            <span className="text-[11px] font-bold text-[#848e9c] uppercase block mb-2">
              Quick Presets (Auto-fills Quotex configuration & authentic logo):
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'PhonePe', category: 'POPULAR', min: 10, type: 'PHONEPE', badge: '' },
                { name: 'UPI', category: 'POPULAR', min: 10, type: 'UPI', badge: '' },
                { name: 'UPI Intent', category: 'POPULAR', min: 10, type: 'UPI_INTENT', badge: '' },
                { name: 'Binance Pay', category: 'POPULAR', min: 10, type: 'BINANCE_PAY', badge: '' },
                { name: 'PayTM', category: 'POPULAR', min: 10, type: 'PAYTM', badge: '' },
                { name: 'USDT (TRC-20)', category: 'POPULAR', min: 10, type: 'USDT_TRC20', badge: 'TRC-20' },
                { name: 'USDT (BEP-20)', category: 'POPULAR', min: 20, type: 'USDT_BEP20', badge: 'BEP-20' },
                { name: 'USDT (ERC-20)', category: 'POPULAR', min: 10, type: 'USDT_ERC20', badge: 'ERC-20' },
                { name: 'Bitcoin (BTC)', category: 'CRYPTO', min: 50, type: 'BTC', badge: '' },
                { name: 'Ethereum (ETH)', category: 'CRYPTO', min: 50, type: 'ETH', badge: '' },
                { name: 'Litecoin (LTC)', category: 'CRYPTO', min: 15, type: 'LTC', badge: '' },
                { name: 'Tron (TRX)', category: 'CRYPTO', min: 15, type: 'TRX', badge: '' },
                { name: 'The Open Network (TON)', category: 'CRYPTO', min: 15, type: 'TON', badge: '' }
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      name: p.name,
                      category: p.category as any,
                      minAmount: p.min,
                      type: p.type,
                      networkBadge: p.badge
                    }));
                  }}
                  className="px-2.5 py-1 text-xs rounded-md bg-[#252c3b] hover:bg-[#00a65a] hover:text-white text-gray-300 font-medium transition-colors border border-[#333e52]"
                >
                  + {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#8390a0] mb-1">Method Display Name *</label>
              <input 
                required 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white focus:outline-none focus:border-[#00a65a] text-sm" 
                placeholder="e.g. USDT (TRC-20) or PhonePe" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8390a0] mb-1">Category (Where it appears) *</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({ ...formData, category: e.target.value as any })} 
                className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white text-sm outline-none cursor-pointer"
              >
                <option value="POPULAR">POPULAR (Shows in Popular Region & Left Tab)</option>
                <option value="EPAY">E-PAY (Shows in E-Pay section & Left Tab)</option>
                <option value="CRYPTO">CRYPTO (Shows in Crypto section & Left Tab)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8390a0] mb-1">Network Badge (Optional)</label>
              <select 
                value={formData.networkBadge || ''} 
                onChange={e => setFormData({ ...formData, networkBadge: e.target.value })} 
                className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white text-sm outline-none cursor-pointer"
              >
                <option value="">None (Standard)</option>
                <option value="TRC-20">TRC-20 (Tron)</option>
                <option value="ERC-20">ERC-20 (Ethereum)</option>
                <option value="BEP-20">BEP-20 (BNB Smart Chain)</option>
                <option value="Polygon">Polygon (PoS)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8390a0] mb-1">Status (Platform Visibility) *</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })} 
                className={`w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 font-bold text-sm outline-none cursor-pointer ${
                  formData.status === 'ACTIVE' ? 'text-[#00a65a]' : 'text-[#e33f4a]'
                }`}
              >
                <option value="ACTIVE" className="text-[#00a65a]">ACTIVE (Visible to users)</option>
                <option value="INACTIVE" className="text-[#e33f4a]">INACTIVE (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8390a0] mb-1">Minimum Deposit Amount ($) *</label>
              <input 
                type="number" 
                required
                value={formData.minAmount} 
                onChange={e => setFormData({ ...formData, minAmount: Number(e.target.value) })} 
                className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#00a65a]" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8390a0] mb-1">Maximum Deposit Amount ($) *</label>
              <input 
                type="number" 
                required
                value={formData.maxAmount} 
                onChange={e => setFormData({ ...formData, maxAmount: Number(e.target.value) })} 
                className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#00a65a]" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#8390a0] mb-1">
                Receiving Wallet Address / Merchant UPI ID *
              </label>
              <input 
                required 
                type="text" 
                value={formData.credentials} 
                onChange={e => setFormData({ ...formData, credentials: e.target.value, upiId: e.target.value })} 
                className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white text-sm font-mono focus:outline-none focus:border-[#00a65a]" 
                placeholder="e.g. TRC20 address or merchant@ybl" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8390a0] mb-1">
                Custom Scanner QR Code Image (Optional)
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="file" 
                  accept="image/png,image/jpeg,image/webp" 
                  onChange={handleImageUpload}
                  className="text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#252f40] file:text-white hover:file:bg-[#323f54] cursor-pointer"
                />
                {uploadingImage && <span className="text-xs text-[#00a65a] animate-pulse">Uploading...</span>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8390a0] mb-1">User Transfer Instructions</label>
            <textarea 
              rows={2}
              value={formData.instructions} 
              onChange={e => setFormData({ ...formData, instructions: e.target.value })} 
              className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#00a65a]" 
              placeholder="e.g. Send only USDT via TRC20 network. Then submit the 12-digit UTR/hash below." 
            />
          </div>

          {/* Live Preview Card */}
          <div className="bg-[#12161f] p-4 rounded-xl border border-[#262f3e] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#8390a0] font-bold">Platform Preview:</span>
              <div className="bg-white rounded-lg px-4 py-2.5 flex items-center gap-3 shadow-sm">
                <PaymentMethodIcon name={formData.name} type={formData.type} networkBadge={formData.networkBadge} size={32} />
                <div>
                  <span className="text-[#1e2329] font-bold text-xs block leading-tight">{formData.name || 'Method Name'}</span>
                  <span className="text-[#707a8a] text-[10px] font-medium block">Min. ${(formData.minAmount || 10).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => setShowAdd(false)}
                className="px-4 py-2.5 bg-[#252c3b] hover:bg-[#323b4e] text-gray-300 rounded-lg text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-[#00a65a] hover:bg-[#00a65a]/90 text-white rounded-lg text-xs font-bold transition-colors shadow-md shadow-[#00a65a]/25 flex items-center gap-2"
              >
                <Save size={15} />
                <span>Save Method</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* FILTER TABS & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1a202c] p-3 rounded-xl border border-[#2b3342]">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'ALL', label: `All (${methods.length})` },
            { id: 'POPULAR', label: `Popular (${methods.filter(m => m.category === 'POPULAR').length})` },
            { id: 'EPAY', label: `E-Pay (${methods.filter(m => m.category === 'EPAY').length})` },
            { id: 'CRYPTO', label: `Crypto (${methods.filter(m => m.category === 'CRYPTO').length})` },
            { id: 'ACTIVE', label: `Active (${methods.filter(m => m.status === 'ACTIVE').length})` },
            { id: 'INACTIVE', label: `Inactive (${methods.filter(m => m.status === 'INACTIVE').length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                filterTab === tab.id 
                  ? 'bg-[#00a65a] text-white shadow-sm' 
                  : 'text-gray-400 hover:text-white hover:bg-[#252c3b]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search method..."
            className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00a65a]"
          />
        </div>
      </div>

      {/* PAYMENT METHODS LIST / TABLE */}
      <div className="bg-[#1a202c] rounded-xl border border-[#2b3342] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141923] text-gray-400 font-bold uppercase tracking-wider border-b border-[#2b3342]">
              <tr>
                <th className="py-3.5 px-4">Method & Official Icon</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Min / Max Limit</th>
                <th className="py-3.5 px-4">Receiving Address / UPI ID</th>
                <th className="py-3.5 px-4">Visibility Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242c3b]">
              {filteredMethods.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle size={36} className="text-gray-500" />
                      <p className="text-sm">No payment methods found.</p>
                      <button 
                        onClick={handleSeedQuotexMethods}
                        className="px-4 py-2 bg-[#00a65a] hover:bg-[#00a65a]/90 text-white rounded-lg font-bold text-xs transition-colors"
                      >
                        Populate All 25+ Quotex Methods
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMethods.map((m) => (
                  <tr key={m.id} className="hover:bg-[#202736] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <PaymentMethodIcon name={m.name} type={m.type} networkBadge={m.networkBadge} size={32} />
                        <div>
                          <span className="font-bold text-white block text-sm">{m.name}</span>
                          <span className="text-[10px] text-gray-400">
                            {m.networkBadge ? `Network: ${m.networkBadge}` : m.type}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        m.category === 'POPULAR'
                          ? 'bg-[#00a65a]/20 text-[#00a65a] border border-[#00a65a]/30'
                          : m.category === 'EPAY'
                          ? 'bg-[#1e88e5]/20 text-[#1e88e5] border border-[#1e88e5]/30'
                          : 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
                      }`}>
                        {m.category === 'POPULAR' && <Flame size={11} />}
                        {m.category === 'EPAY' && <Wallet size={11} />}
                        {m.category === 'CRYPTO' && <Coins size={11} />}
                        {m.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-white block">${(m.minAmount || 10).toFixed(2)}</span>
                      <span className="text-[10px] text-gray-400 font-mono">Max: ${(m.maxAmount || 50000).toFixed(2)}</span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-mono text-[11px] text-gray-300 truncate" title={m.credentials}>
                        {m.credentials || 'Not configured'}
                      </div>
                      {m.scannerUrl && (
                        <span className="text-[10px] text-[#00a65a] flex items-center gap-1 mt-0.5">
                          <QrCode size={11} /> Custom QR Active
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleToggleStatus(m)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                          m.status === 'ACTIVE' 
                            ? 'bg-[#00a65a]/20 text-[#00a65a] hover:bg-[#00a65a]/30 border border-[#00a65a]/40' 
                            : 'bg-[#e33f4a]/20 text-[#e33f4a] hover:bg-[#e33f4a]/30 border border-[#e33f4a]/40'
                        }`}
                        title="Click to toggle status on live platform"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'ACTIVE' ? 'bg-[#00a65a]' : 'bg-[#e33f4a]'}`} />
                        {m.status}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(m)}
                          className="p-1.5 rounded-md bg-[#252c3b] hover:bg-[#323b4e] text-gray-300 hover:text-white transition-colors"
                          title="Edit details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(m.id, m.name)}
                          className="p-1.5 rounded-md bg-[#e33f4a]/10 hover:bg-[#e33f4a]/20 text-[#e33f4a] transition-colors"
                          title="Delete method"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
