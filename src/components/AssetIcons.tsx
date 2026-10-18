import React from 'react';
import { AssetInfo } from '../types';
import { DollarSign, Bitcoin, Coins } from 'lucide-react';

export const AssetIcon: React.FC<{ asset: AssetInfo }> = ({ asset }) => {
  if (asset.category === 'CRYPTO') {
    return (
      <div className="w-5 h-5 rounded-full bg-[#f59e0b] flex items-center justify-center text-white shrink-0 shadow-sm">
        <Bitcoin size={12} strokeWidth={2.5} />
      </div>
    );
  }

  if (asset.category === 'COMMODITIES') {
    return (
      <div className="w-5 h-5 rounded-full bg-[#eab308] flex items-center justify-center text-black shrink-0 font-bold text-[9px] shadow-sm">
        Au
      </div>
    );
  }

  if (asset.category === 'STOCKS') {
    return (
      <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center text-white shrink-0 font-bold text-[9px] shadow-sm">
        {asset.name.substring(0, 2)}
      </div>
    );
  }

  // Currencies / Forex
  return (
    <div className="flex -space-x-1.5 items-center shrink-0">
      <div className="w-4 h-4 rounded-full bg-[#1e88e5] text-white flex items-center justify-center text-[8px] font-bold border border-[#1b212c]">
        {asset.name.substring(0, 1)}
      </div>
      <div className="w-4 h-4 rounded-full bg-[#00c26f] text-white flex items-center justify-center text-[8px] font-bold border border-[#1b212c]">
        {asset.name.substring(4, 5) || '$'}
      </div>
    </div>
  );
};
