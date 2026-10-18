import React, { useEffect, useState, useRef } from 'react';
import { Wifi, Activity } from 'lucide-react';

interface RealisticLoaderProps {
  isLoading: boolean;
  message?: string;
  onFinished?: () => void;
}

export const getNetworkSpeedInfo = (): { delayMs: number; speedLabel: string; pingMs: number; isHighSpeed: boolean } => {
  const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
  const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;

  if (conn) {
    const downlink = conn.downlink || 15; // Mbps
    const rtt = conn.rtt || 24; // Round trip time in ms
    const effectiveType = conn.effectiveType || '4g';

    if (effectiveType === 'slow-2g' || downlink < 0.5) {
      return { delayMs: 800, speedLabel: '2G (Slow Connection)', pingMs: Math.max(160, rtt), isHighSpeed: false };
    }
    if (effectiveType === '2g' || downlink < 1.5) {
      return { delayMs: 500, speedLabel: '3G (Moderate)', pingMs: Math.max(85, rtt), isHighSpeed: false };
    }
    if (effectiveType === '3g' || downlink < 5) {
      return { delayMs: 300, speedLabel: '3G / 4G (Good)', pingMs: Math.max(45, rtt), isHighSpeed: true };
    }
    if (rtt < 40 && downlink >= 10) {
      return { delayMs: 140, speedLabel: 'Ultra-Fast (High Speed)', pingMs: Math.min(20, rtt || 18), isHighSpeed: true };
    }
    return { delayMs: 190, speedLabel: 'Fast 4G / Wi-Fi', pingMs: rtt || 30, isHighSpeed: true };
  }

  // Modern default: ultra fast connection
  return { delayMs: 150, speedLabel: 'High Speed Connection', pingMs: 22, isHighSpeed: true };
};

export const RealisticLoader: React.FC<RealisticLoaderProps> = ({
  isLoading,
  message = 'Loading live market feed...',
  onFinished,
}) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [speedInfo, setSpeedInfo] = useState<{ speedLabel: string; pingMs: number; isHighSpeed: boolean }>({
    speedLabel: 'High Speed',
    pingMs: 22,
    isHighSpeed: true,
  });

  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timerRef.current.forEach(t => clearTimeout(t));
    timerRef.current = [];
  };

  useEffect(() => {
    clearAllTimers();

    if (!isLoading) {
      if (visible) {
        setProgress(100);
        const t = setTimeout(() => {
          setVisible(false);
          setProgress(0);
          onFinished?.();
        }, 110);
        timerRef.current.push(t);
      }
      return () => clearAllTimers();
    }

    const info = getNetworkSpeedInfo();
    setSpeedInfo(info);
    setVisible(true);
    setProgress(20);

    // Dynamic speed-adaptive animation: fast network completes in 140ms, slow takes longer
    const t1 = setTimeout(() => setProgress(62), info.delayMs * 0.3);
    const t2 = setTimeout(() => setProgress(90), info.delayMs * 0.65);
    const t3 = setTimeout(() => {
      setProgress(100);
      const finishTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
        onFinished?.();
      }, 90);
      timerRef.current.push(finishTimer);
    }, info.delayMs);

    timerRef.current.push(t1, t2, t3);

    return () => clearAllTimers();
  }, [isLoading, message]);

  if (!visible) return null;

  return (
    <>
      {/* Top Neon Slim Progress Bar (Quotex / Fast Trading Terminal Style) */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[99999] pointer-events-none overflow-hidden bg-black/40">
        <div
          className="h-full bg-gradient-to-r from-[#1e88e5] via-[#00c26f] to-[#38bdf8] shadow-[0_0_12px_#00c26f] transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Sleek Floating Top-Center Frosted Live Badge (Non-blocking, Ultra-Attractive) */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[99998] pointer-events-none select-none animate-in fade-in slide-in-from-top-2 duration-150">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#151c28]/95 border border-white/15 shadow-[0_8px_25px_rgba(0,0,0,0.5)] backdrop-blur-md text-white text-xs font-semibold">
          {/* Animated Spinner with Quotex Emerald Glow */}
          <div className="relative w-3.5 h-3.5 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full border-2 border-[#00c26f]/20 border-t-[#00c26f] animate-spin" />
            <div className="w-1.5 h-1.5 bg-[#00c26f] rounded-full animate-ping" />
          </div>

          <span className="text-white text-[11px] font-bold tracking-tight truncate max-w-[240px]">
            {message}
          </span>

          <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/10 text-[10px] text-[#38bdf8] font-mono shrink-0">
            <Wifi size={10} className={speedInfo.isHighSpeed ? 'text-[#00c26f]' : 'text-[#f59e0b]'} />
            <span className="text-white/80">{speedInfo.pingMs}ms</span>
            <span className="text-white/40">•</span>
            <span className="text-[#00c26f] font-bold">{progress}%</span>
          </div>
        </div>
      </div>
    </>
  );
};
