import React from 'react';

interface FlameIconProps {
  className?: string;
  size?: number;
}

/**
 * Ultra-Premium 3D Glowing Fiery Flame Icon
 * Grounded in User Image 6 with multi-tier gradients (electric yellow, amber orange, crimson fire)
 */
export const OfficialFlameIcon: React.FC<FlameIconProps> = ({
  className = '',
  size = 20
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 32 32" 
        className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(255,140,0,0.85)]"
        fill="none"
      >
        <defs>
          {/* Outer Fire Gradient */}
          <linearGradient id="outerFlameGrad" x1="16" y1="3" x2="16" y2="29" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE600" />
            <stop offset="25%" stopColor="#FF8800" />
            <stop offset="60%" stopColor="#FF3300" />
            <stop offset="100%" stopColor="#CC0000" />
          </linearGradient>

          {/* Inner Flame Glow */}
          <linearGradient id="innerFlameGrad" x1="16" y1="12" x2="16" y2="27" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFEE" />
            <stop offset="40%" stopColor="#FFEA33" />
            <stop offset="85%" stopColor="#FF8C00" />
            <stop offset="100%" stopColor="#FF4400" />
          </linearGradient>

          {/* Core Spark */}
          <linearGradient id="coreSparkGrad" x1="16" y1="18" x2="16" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFE066" />
          </linearGradient>
        </defs>

        {/* Outer Vibrant Fire Body */}
        <path 
          d="M16 2.5C16 2.5 18.2 6.8 18.2 9.5C18.2 11.2 17.5 12.5 16.5 13.5C20.5 12 24.5 15.5 24.5 20.5C24.5 25.2 20.7 29 16 29C11.3 29 7.5 25.2 7.5 20.5C7.5 16.5 10 13 13.2 10.2C13.2 6.8 16 2.5 16 2.5Z" 
          fill="url(#outerFlameGrad)" 
        />

        {/* Middle Luminous Flame */}
        <path 
          d="M16 11C16 11 18.5 14.5 18.5 17C18.5 18.2 17.8 19 16.8 19.5C19.8 19 21.5 21 21.5 23C21.5 25.8 19 27.5 16 27.5C13 27.5 10.5 25.8 10.5 23C10.5 20.5 12.2 18 14.5 16C14.5 13.8 16 11 16 11Z" 
          fill="url(#innerFlameGrad)" 
        />

        {/* Inner Glowing Core Spark */}
        <path 
          d="M16 18C16 18 17.5 20.5 17.5 22C17.5 23.5 16.5 25 15.8 25C15.1 25 14.5 23.5 14.5 22C14.5 20.5 16 18 16 18Z" 
          fill="url(#coreSparkGrad)" 
        />
      </svg>
    </div>
  );
};
