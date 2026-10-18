import React, { useState, useEffect } from 'react';
import { X, Search, Star, ArrowDown, ArrowUp } from 'lucide-react';

import { AssetCategory, Asset, ASSETS } from '../src/constants';

interface AssetSelectorProps {
  onClose?: () => void;
  onSelect: (asset: Asset) => void;
  currentAssetId?: string;
  inline?: boolean;
}

export const AssetSelector: React.FC<AssetSelectorProps> = ({ onClose, onSelect, currentAssetId, inline }) => {
  const [activeTab, setActiveTab] = useState<AssetCategory>('CURRENCIES');
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState(ASSETS);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(a => ({
        ...a,
        change: Number((a.change + (Math.random() * 0.04 - 0.02)).toFixed(2))
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredAssets = assets.filter(a => 
    a.category === activeTab && 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => b.profit1Min - a.profit1Min);

  return (
    <div className={inline ? "flex flex-col text-white w-full h-[600px] bg-[#0b0e11] rounded-xl overflow-hidden border border-white/10" : "fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-[#0b0e11] flex flex-col text-white"}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
        <h2 className="text-xl font-bold">Select trade pair</h2>
        {!inline && (
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-2 gap-4 border-b border-white/10 shrink-0 overflow-x-auto no-scrollbar">
        {(['CURRENCIES', 'CRYPTO', 'COMMODITIES', 'STOCKS'] as AssetCategory[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-[#00a8ff]' : 'text-gray-400 hover:text-gray-200'}`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00a8ff] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="p-4 flex gap-3 shrink-0">
        <button className="bg-[#1e222d] px-4 py-2 rounded-lg flex items-center gap-2 text-gray-400 hover:text-white transition-colors border border-white/5">
          <Star size={16} /> 0
        </button>
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e222d] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#00a8ff] transition-colors"
          />
        </div>
      </div>

      {/* Sort Header */}
      <div className="px-4 pb-2 shrink-0">
        <span className="text-xs text-gray-400">Sort by: <span className="text-white border-b border-dashed border-white/30 pb-0.5 cursor-pointer">Name ▼</span></span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredAssets.map(asset => (
          <div 
            key={asset.id}
            onClick={() => onSelect(asset)}
            className={`flex items-center justify-between p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${currentAssetId === asset.id ? 'bg-white/5' : ''}`}
          >
            <div className="flex items-center gap-3">
              <button className="text-gray-500 hover:text-yellow-500 transition-colors">
                <Star size={18} />
              </button>
              
              {/* Fake Icon for Asset */}
              <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full bg-blue-500 border border-[#0b0e11] flex items-center justify-center text-[8px] font-bold">
                  {asset.name.charAt(0)}
                </div>
                <div className="w-5 h-5 rounded-full bg-red-500 border border-[#0b0e11] flex items-center justify-center text-[8px] font-bold">
                  {asset.name.includes('/') ? asset.name.split('/')[1].charAt(0) : asset.name.charAt(1)}
                </div>
              </div>

              <div>
                <div className="font-bold text-sm flex items-center gap-1">
                  {asset.name} {asset.isOTC && <span className="text-gray-400 font-normal">(OTC)</span>}
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${asset.change >= 0 ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
              {asset.change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {asset.change > 0 ? '+' : ''}{asset.change}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
