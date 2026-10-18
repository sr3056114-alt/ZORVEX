import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Activity, ShieldCheck, Search, TrendingUp, RefreshCw } from 'lucide-react';

export default function AdminMarketData() {
  const [instruments, setInstruments] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const unsubInst = onSnapshot(collection(db, 'instruments'), (snap) => {
      const insts: any[] = [];
      snap.docs.forEach(d => { insts.push({ id: d.id, ...d.data() }); });
      setInstruments(insts);
    }, (e) => console.warn('instruments snap:', e));

    const unsubData = onSnapshot(collection(db, 'marketData'), (snap) => {
      const data: Record<string, any> = {};
      snap.docs.forEach(d => { data[d.id] = d.data(); });
      setMarketData(prev => ({ ...prev, ...data }));
    }, (e) => console.warn('marketData snap:', e));

    const fetchPrices = () => {
      fetch('/api/market/prices')
        .then(r => r.json())
        .then(data => {
          if (data && typeof data === 'object') {
            setMarketData(prev => ({ ...prev, ...data }));
          }
        })
        .catch(() => {});
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 3000);

    return () => { unsubInst(); unsubData(); clearInterval(interval); };
  }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
      await updateDoc(doc(db, 'instruments', id), { status: newStatus });
      
      // Audit log
      await setDoc(doc(db, 'auditLogs', Date.now().toString()), {
         adminId: localStorage.getItem('user_email') || 'Admin',
         action: 'STATUS_CHANGE',
         module: 'MarketData',
         details: `Changed ${id} status to ${newStatus}`,
         timestamp: Date.now()
      });
    } catch(e) { console.error(e); }
  };

  const filteredAssets = instruments.filter(asset => {
    if (searchTerm) {
      if (!asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !asset.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !asset.category?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    }
    if (categoryFilter !== 'ALL' && asset.category !== categoryFilter) return false;
    
    const isOpen = asset.status !== 'CLOSED';
    if (statusFilter === 'ACTIVE' && !isOpen) return false;
    if (statusFilter === 'INACTIVE' && isOpen) return false;
    return true;
  });

  const categories = ['ALL', ...Array.from(new Set(instruments.map(a => a.category || 'General')))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="text-blue-500" /> Market Data Monitoring
          </h2>
          <p className="text-[#8390a0] text-sm mt-1">Centralized market data engine control and monitoring.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full text-sm font-bold border border-green-500/20">
          <ShieldCheck size={16} /> Data Feed Active
        </div>
      </div>

      <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8390a0]" />
          <input 
            type="text" 
            placeholder="Search symbols, names, categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#151a23] border border-[#2b3342] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#3d72ff]"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-[#151a23] border border-[#2b3342] rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
            {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#151a23] border border-[#2b3342] rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Open</option>
            <option value="INACTIVE">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-[#1a202c] border border-[#2b3342] rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#151a23] border-b border-[#2b3342]">
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Instrument</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Category</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Current Rate</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Market Status</th>
              <th className="p-4 text-xs font-bold text-[#8390a0] uppercase">Data Freshness</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => {
              const data = marketData[asset.id] || {};
              const isOpen = asset.status !== 'CLOSED';
              const lastUpdate = data.lastUpdate ? data.lastUpdate * 1000 : Date.now();
              const isStale = Date.now() - lastUpdate > 10000;
              const rate = data.currentPrice ? data.currentPrice.toFixed(5) : 'Loading...';

              return (
                <tr key={asset.id} className="border-b border-[#2b3342] hover:bg-[#2b3342]/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{asset.name || asset.id}</div>
                    <div className="text-xs text-[#8390a0]">{asset.symbol || asset.id}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-[#2b3342] rounded text-xs font-bold text-[#8390a0]">
                      {asset.category}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-white">{rate}</td>
                  <td className="p-4">
                    <button onClick={() => toggleStatus(asset.id, asset.status || 'OPEN')} className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${isOpen ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                      {isOpen ? 'OPEN' : 'CLOSED'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {isStale ? (
                        <span className="text-yellow-500 text-xs font-bold flex items-center gap-1">
                           Stale ({Math.floor((Date.now() - lastUpdate)/1000)}s ago)
                        </span>
                      ) : (
                        <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                          <RefreshCw size={12} className="animate-spin" /> Live
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredAssets.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#8390a0]">No instruments found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
