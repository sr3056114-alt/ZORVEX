
import React from 'react';

export const CustomJackpotIcon = ({ scale = 1, size, className }: { scale?: number, size?: number, className?: string }) => (
  <div 
    className={`relative flex flex-col items-center justify-center ${className || ''}`} 
    style={{ 
      transform: `scale(${scale})`, 
      width: size || 140, 
      height: size || 140 
    }}
  >
    {/* Wheel - Matching the image segments and colors */}
    <div className="w-28 h-28 rounded-full border-[6px] border-[#fbc02d] bg-[#1e2329] overflow-hidden relative shadow-xl z-10">
      <div className="absolute inset-0 animate-[spin_6s_linear_infinite] bg-[conic-gradient(#fbc02d_0deg_60deg,#2196f3_60deg_120deg,#f44336_120deg_180deg,#fbc02d_180deg_240deg,#2196f3_240deg_300deg,#f44336_300deg_360deg)]"></div>
      
      {/* Center cap - White as in the image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-[#fbc02d] shadow-lg z-20"></div>
    </div>
    
    {/* Stand - Red as in the image */}
    <div className="w-14 h-8 bg-[#b71c1c] -mt-1 z-0 flex flex-col items-center justify-end relative">
       {/* Base - Blue as in the image */}
       <div className="w-24 h-1.5 bg-[#1976d2] absolute -bottom-1 rounded-full shadow-lg"></div>
    </div>
  </div>
);
