import React from 'react';

interface XrpSvgProps {
  className?: string;
  size?: number;
}

/**
 * 100% Authentic 3D Realistic Ripple (XRP) Black Token Coin
 * Grounded in official brand vectors matching Image 3
 */
export const OfficialXrpSvg: React.FC<XrpSvgProps> = ({
  className = '',
  size = 40
}) => {
  return (
    <div 
      className={`relative rounded-full flex items-center justify-center shrink-0 shadow-md overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          {/* Outer metallic bevel ring */}
          <radialGradient id="xrpOuterRing" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#484C55" />
            <stop offset="35%" stopColor="#26282E" />
            <stop offset="70%" stopColor="#181A1F" />
            <stop offset="100%" stopColor="#0E0F12" />
          </radialGradient>
          
          {/* Inner recessed coin face */}
          <radialGradient id="xrpInnerFace" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#23262C" />
            <stop offset="60%" stopColor="#15171B" />
            <stop offset="100%" stopColor="#0F1013" />
          </radialGradient>

          {/* Subtle rim highlight */}
          <linearGradient id="xrpRimHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6E7587" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#26282E" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
          </linearGradient>

          {/* 3D shadow for white XRP emblem */}
          <filter id="xrpEmblemShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.85" />
          </filter>
        </defs>

        {/* Outer 3D Coin Bevel Ring */}
        <circle cx="50" cy="50" r="48" fill="url(#xrpOuterRing)" />
        <circle cx="50" cy="50" r="47.5" fill="none" stroke="url(#xrpRimHighlight)" strokeWidth="1.5" />
        
        {/* Recessed Inner Dark Coin Face */}
        <circle cx="50" cy="50" r="37.5" fill="url(#xrpInnerFace)" stroke="#0A0B0D" strokeWidth="1.8" />

        {/* 3D Embossed White XRP Dual-Chevron Emblem */}
        <g transform="translate(19.2, 19.2) scale(1.92)" filter="url(#xrpEmblemShadow)">
          <path 
            d="M23.07 8h2.89l-6.015 5.957a5.621 5.621 0 01-7.89 0L6.035 8H8.93l4.57 4.523a3.556 3.556 0 004.996 0L23.07 8zM8.895 24.563H6l6.055-5.993a5.621 5.621 0 017.89 0L26 24.562h-2.895L18.5 20a3.556 3.556 0 00-4.996 0l-4.61 4.563z" 
            fill="#FFFFFF" 
          />
        </g>
      </svg>
    </div>
  );
};
