
import React, { useEffect } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Headset } from 'lucide-react';

import { CustomJackpotIcon } from './CustomJackpotIcon';

const FloatingSpinIcon = () => (
  <div className="w-14 h-14 animate-bounce flex items-center justify-center relative overflow-visible">
    <CustomJackpotIcon scale={0.4} className="drop-shadow-[0_0_15px_rgba(255,235,59,0.6)]" />
    <div className="absolute -bottom-2 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full border border-yellow-400 shadow-lg whitespace-nowrap z-20">
      JACKPOT
    </div>
  </div>
);

const FloatingCustomerServiceIcon = () => (
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
    <Headset size={24} className="text-white" />
  </div>
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const publicPaths = ['/login', '/register', '/forgot-password'];
    const isPublicPath = publicPaths.includes(location.pathname);
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser && !isPublicPath) {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  const gamePages = [
    '/play', '/jet-x', '/mines', '/chicken-road', '/go-crash', 
    '/spin-wheel', '/coin-flip', '/plinko', '/lucky-777', 
    '/andar-bahar', '/fruit-cutter', '/teen-patti', '/rummy'
  ];
  const fullScreenPages = [
    '/live-chat', '/deposit-spin', '/invite-spin', 
    '/deposit', '/wallet', '/withdraw', '/deposit-history', 
    '/withdrawal-history', '/bet-history', '/transaction-history',
    '/notifications', '/gifts', '/game-stats', '/settings', 
    '/feedback', '/announcements', '/guide', '/about', '/vip',
    '/add-bank', '/add-upi', '/add-usdt', '/payment-gateway', '/usdt-payment-gateway',
    '/login', '/register', '/forgot-password'
  ];
  
  const isGamePage = gamePages.includes(location.pathname);
  const isFullScreenPage = fullScreenPages.includes(location.pathname);
  const isActivityPage = location.pathname === '/activity';
  const isTradingPage = location.pathname === '/trading';
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  
  // Only show bottom nav on main tabs
  const showBottomNav = ['/', '/activity', '/refer', '/me'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#0b0e11] flex justify-center overflow-x-hidden relative">
      {/* Global Background for Desktop */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(46,167,255,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.05),transparent)] pointer-events-none z-0" />
      
      <div className={`flex flex-col min-h-screen w-full max-w-[500px] ${isGamePage ? 'bg-black' : isTradingPage ? 'bg-[#1e222d]' : isAuthPage ? 'bg-black' : 'bg-gradient-to-b from-[#0b0e11] via-[#1a1c22] to-black'} text-white relative shadow-[0_0_100px_rgba(0,0,0,0.8)] border-x border-white/5 overflow-hidden z-10`}>
        {location.pathname === '/' && <Header />}
        <main className={`flex-1 ${showBottomNav ? 'pb-24' : (isTradingPage || isFullScreenPage) ? 'pb-0' : 'pb-4'} ${isGamePage || isActivityPage || isTradingPage || isFullScreenPage || showBottomNav ? 'px-0 pt-0' : 'px-4 pt-4'}`}>
          {children}
        </main>
        
        {/* Floating Action Buttons */}
        {showBottomNav && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[500px] pointer-events-none z-[120] flex justify-end px-4">
            <div className="flex flex-col gap-5 pointer-events-auto items-end">
              <Link to="/live-chat" className="active:scale-95 transition-transform hover:scale-110 drop-shadow-xl">
                <FloatingCustomerServiceIcon />
              </Link>
              <Link to="/deposit-spin" className="active:scale-95 transition-transform hover:scale-110 drop-shadow-xl">
                <FloatingSpinIcon />
              </Link>
            </div>
          </div>
        )}

        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
};

export default Layout;
