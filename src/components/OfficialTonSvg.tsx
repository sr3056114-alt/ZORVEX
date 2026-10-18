import React from 'react';

interface TonSvgProps {
  className?: string;
  size?: number;
}

/**
 * 100% Authentic Official The Open Network (TON) Coin Logo
 * Grounded in official TON Foundation vectors matching Image 2
 */
export const OfficialTonSvg: React.FC<TonSvgProps> = ({
  className = '',
  size = 40
}) => {
  return (
    <div 
      className={`relative rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden ${className}`}
      style={{ width: size, height: size, backgroundColor: '#0098EA' }}
    >
      <svg viewBox="0 0 56 56" className="w-full h-full">
        {/* Sky Blue Circle Base */}
        <circle cx="28" cy="28" r="28" fill="#0098EA" />
        {/* Official TON White Gem/Triangle with Center Divider */}
        <path 
          fill="#FFFFFF" 
          d="M37.6,15.6H18.4c-3.5,0-5.7,3.8-4,6.9l11.8,20.5c0.8,1.3,2.7,1.3,3.5,0l11.8-20.5 C43.3,19.4,41.1,15.6,37.6,15.6L37.6,15.6z M26.3,36.8l-2.6-5l-6.2-11.1c-0.4-0.7,0.1-1.6,1-1.6h7.8L26.3,36.8L26.3,36.8z M38.5,20.7l-6.2,11.1l-2.6,5V19.1h7.8C38.4,19.1,38.9,20,38.5,20.7z" 
        />
      </svg>
    </div>
  );
};
