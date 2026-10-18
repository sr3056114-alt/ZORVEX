import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAudio } from '../App';

import RajadhanLogo from './RajadhanLogo';

interface GameWrapperProps {
  children: React.ReactNode;
  gameName: string;
}

const GameWrapper: React.FC<GameWrapperProps> = ({ children, gameName }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'popup' | 'loading' | 'game'>('popup');
  const [hasActiveTrades, setHasActiveTrades] = useState(false);
  const { playBgMusic, stopBgMusic } = useAudio();

  useEffect(() => {
    const saved = localStorage.getItem('rajadhan_trading_positions');
    if (saved) {
      try {
        const positions = JSON.parse(saved);
        if (positions.length > 0) {
          setHasActiveTrades(true);
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (step === 'game' && gameName !== 'Trading') {
      playBgMusic(gameName);
    }
    return () => {
      stopBgMusic();
    };
  }, [step, gameName, playBgMusic, stopBgMusic]);

  const handleConfirm = () => {
    setStep('loading');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (step === 'loading') {
      const timer = setTimeout(() => {
        setStep('game');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (step === 'game') {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0c10] flex items-center justify-center font-sans text-white">
      <AnimatePresence mode="wait">
        {step === 'popup' && (
          <motion.div
            key="popup"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-b from-[#1e2329] to-[#0b0e11] p-8 rounded-[32px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-sm w-full mx-4 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

            {hasActiveTrades ? (
              <>
                <motion.div 
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)] border border-red-400/30 relative z-10"
                >
                  <span className="text-4xl drop-shadow-lg">⚠️</span>
                </motion.div>
                <h2 className="text-2xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 relative z-10">Wait for closed Trade</h2>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed relative z-10">You have active trades running. Please close them before playing <span className="text-white font-bold">{gameName}</span>.</p>
                <div className="flex gap-3 w-full relative z-10">
                  <button
                    onClick={() => navigate('/')}
                    className="flex-1 py-4 rounded-xl font-black text-lg bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] active:scale-95"
                  >
                    Back to Home
                  </button>
                </div>
              </>
            ) : (
              <>
                <motion.div 
                  initial={{ y: -10, scale: 0.9 }}
                  animate={{ y: 0, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2rem] mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.4)] border border-blue-400/30 relative z-10"
                >
                  <span className="text-5xl drop-shadow-xl">🎮</span>
                </motion.div>
                <h2 className="text-3xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 relative z-10 tracking-tight">Ready to Play?</h2>
                <p className="text-gray-400 text-base mb-8 relative z-10">Do you want to enter <span className="text-white font-bold text-lg">{gameName}</span>?</p>
                <div className="flex gap-4 w-full relative z-10">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-4 rounded-2xl font-bold text-base bg-white/5 hover:bg-white/10 transition-all text-gray-300 border border-white/10 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 py-4 rounded-2xl font-black text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95"
                  >
                    Play Now
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center"
          >
            <RajadhanLogo size="xl" className="mb-8 animate-pulse" />
            
            <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
              />
            </div>
            <p className="mt-4 text-sm font-bold text-gray-400 tracking-widest uppercase animate-pulse">Loading...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameWrapper;
