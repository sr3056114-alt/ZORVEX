
import React from 'react';
import { Plus } from 'lucide-react';
import { useBalance } from '../App';
import RajadhanLogo from './RajadhanLogo';

const Header: React.FC = () => {
  const { balance, floatingPnl } = useBalance();

  return (
    <header className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      <RajadhanLogo size="md" />
      
      <div className="flex items-center gap-1.5 bg-[#1e2329] rounded-full pl-2 pr-1 py-1 border border-white/10 shadow-lg ml-auto">
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center shadow-inner shrink-0">
          <span className="text-[10px] font-black text-black">₹</span>
        </div>
        <span className={`text-xs font-bold mr-1 tabular-nums transition-colors duration-300 ${floatingPnl > 0 ? 'text-green-400' : floatingPnl < 0 ? 'text-red-400' : 'text-white'}`}>
          ₹{(balance + floatingPnl).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <button className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors shrink-0">
          <Plus size={14} className="text-white" />
        </button>
      </div>
    </header>
  );
};

export default Header;
