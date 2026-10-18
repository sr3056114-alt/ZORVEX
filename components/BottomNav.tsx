
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, Diamond, User } from 'lucide-react';

const CustomJackpotIcon = ({ active }: any) => (
  <div className="relative w-16 h-16 flex flex-col items-center justify-center">
    {/* Wheel - Matching the image segments and colors */}
    <div className={`w-14 h-14 rounded-full border-[4px] border-[#fbc02d] bg-[#1e2329] overflow-hidden relative shadow-lg z-10 ${active ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
      <div className="absolute inset-0 bg-[conic-gradient(#fbc02d_0deg_60deg,#2196f3_60deg_120deg,#f44336_120deg_180deg,#fbc02d_180deg_240deg,#2196f3_240deg_300deg,#f44336_300deg_360deg)]"></div>
      
      {/* Center cap - White as in the image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full border border-[#fbc02d] shadow-sm z-20"></div>
    </div>
    
    {/* Stand - Red as in the image */}
    <div className="w-8 h-4 bg-[#b71c1c] -mt-1 z-0 flex flex-col items-center justify-end relative">
       {/* Base - Blue as in the image */}
       <div className="w-12 h-1 bg-[#1976d2] absolute -bottom-1 rounded-full shadow-sm"></div>
    </div>
  </div>
);

const NavIcon = ({ icon: Icon, active, color, isSpecial }: { icon: any, active: boolean, color: string, isSpecial?: boolean }) => {
  const colorClasses: { [key: string]: string } = {
    blue: 'from-blue-400 to-blue-600 shadow-blue-500/40',
    orange: 'from-orange-400 to-orange-600 shadow-orange-500/40',
    yellow: 'from-yellow-400 to-yellow-600 shadow-yellow-500/40',
    purple: 'from-purple-400 to-purple-600 shadow-purple-500/40',
    emerald: 'from-emerald-400 to-emerald-600 shadow-emerald-500/40',
  };

  const glowClasses: { [key: string]: string } = {
    blue: 'bg-blue-500/20',
    orange: 'bg-orange-500/20',
    yellow: 'bg-yellow-500/20',
    purple: 'bg-purple-500/20',
    emerald: 'bg-emerald-500/20',
  };

  if (isSpecial) {
    return (
      <div className="relative flex flex-col items-center justify-center group">
        {active && (
          <div className="absolute -inset-4 bg-yellow-500/20 blur-xl rounded-full animate-pulse" />
        )}
        <div className={`
          relative z-10 p-1 rounded-2xl transition-all duration-300
          ${active 
            ? 'bg-transparent shadow-[0_0_25px_rgba(251,192,45,0.4)] scale-110 border border-yellow-500/40' 
            : 'bg-transparent scale-100 border border-transparent'}
        `}>
          <Icon active={active} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center group">
      {/* Active Glow Effect */}
      {active && (
        <div className={`absolute -inset-4 ${glowClasses[color]} blur-2xl rounded-full animate-pulse`} />
      )}
      
      <div className={`
        relative z-10 p-2.5 rounded-2xl transition-all duration-300
        ${active 
          ? `bg-gradient-to-b ${colorClasses[color]} shadow-[0_0_20px_rgba(0,0,0,0.3)] scale-110` 
          : 'bg-white/5 hover:bg-white/10 scale-100'}
      `}>
        <Icon 
          size={22} 
          className={`transition-colors duration-300 ${active ? 'text-white' : 'text-gray-400'}`}
          strokeWidth={active ? 2.5 : 2}
        />
      </div>
    </div>
  );
};

const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Home, color: 'blue' },
    { label: 'Activity', path: '/activity', icon: Trophy, color: 'orange' },
    { label: 'Invite', path: '/invite-spin', icon: CustomJackpotIcon, color: 'yellow', isSpecial: true },
    { label: 'Promotion', path: '/refer', icon: Diamond, color: 'purple' },
    { label: 'Account', path: '/me', icon: User, color: 'emerald' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] z-[100] h-24">
      {/* Premium Background with Gradient and Border */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1c22] via-[#0b0e11] to-black backdrop-blur-2xl border-t border-white/10 shadow-[0_-15px_40px_rgba(0,0,0,0.8)]" />
      
      {/* Subtle Top Highlight Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="relative h-full flex items-center">
        <div className="grid grid-cols-5 w-full items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className="flex flex-col items-center gap-1.5 transition-all active:scale-90"
              >
                <NavIcon 
                  icon={item.icon} 
                  active={isActive} 
                  color={item.color} 
                  isSpecial={item.isSpecial}
                />
                <span className={`
                  text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300
                  ${isActive ? 'text-white opacity-100 scale-105' : 'text-gray-500 opacity-60'}
                `}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        :root {
          --blue-rgb: 59, 130, 246;
          --orange-rgb: 249, 115, 22;
          --yellow-rgb: 234, 179, 8;
          --purple-rgb: 168, 85, 247;
          --emerald-rgb: 16, 185, 129;
        }
      `}</style>
    </div>
  );
};

export default BottomNav;
