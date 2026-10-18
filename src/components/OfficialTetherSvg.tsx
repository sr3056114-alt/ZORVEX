import React from 'react';

interface TetherSvgProps {
  className?: string;
  size?: number;
}

/**
 * 100% Authentic Official Tether (USDT) Pentagon Jewel Vector Mark
 * Grounded in official brand vectors matching User Image 2 with sea-green (#50AF95)
 * gem shape, white 'T' stem, and horizontal torus ring.
 */
export const OfficialTetherSvg: React.FC<TetherSvgProps> = ({ className = '', size = 40 }) => {
  return (
    <div 
      className={`relative shrink-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 339.43 295.27" className="w-full h-full drop-shadow-sm">
        {/* Official Tether Sea-Green Pentagon Gem */}
        <path 
          d="M62.15,1.45l-61.89,130a2.52,2.52,0,0,0,.54,2.94L167.95,294.56a2.55,2.55,0,0,0,3.53,0L338.63,134.4a2.52,2.52,0,0,0,.54-2.94l-61.89-130A2.5,2.5,0,0,0,275,0H64.45a2.5,2.5,0,0,0-2.3,1.45h0Z" 
          fill="#50AF95" 
          fillRule="evenodd" 
        />
        {/* Official White Tether 'T' and Torus */}
        <path 
          d="M191.19,144.8v0c-1.2.09-7.4,0.46-21.23,0.46-11,0-18.81-.33-21.55-0.46v0c-42.51-1.87-74.24-9.27-74.24-18.13s31.73-16.25,74.24-18.15v28.91c2.78,0.2,10.74.67,21.74,0.67,13.2,0,19.81-.55,21-0.66v-28.9c42.42,1.89,74.08,9.29,74.08,18.13s-31.65,16.24-74.08,18.12h0Zm0-39.25V79.68h59.2V40.23H89.21V79.68H148.4v25.86c-48.11,2.21-84.29,11.74-84.29,23.16s36.18,20.94,84.29,23.16v82.9h42.78V151.83c48-2.21,84.12-11.73,84.12-23.14s-36.09-20.93-84.12-23.15h0Zm0,0h0Z" 
          fill="#FFFFFF" 
          fillRule="evenodd" 
        />
      </svg>
    </div>
  );
};
