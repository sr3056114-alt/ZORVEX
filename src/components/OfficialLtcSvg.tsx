import React from 'react';

interface LtcSvgProps {
  className?: string;
  size?: number;
}

/**
 * 100% Authentic Official Litecoin (LTC) Coin Logo
 * Grounded in official Litecoin Foundation vectors matching Image 3
 */
export const OfficialLtcSvg: React.FC<LtcSvgProps> = ({
  className = '',
  size = 40
}) => {
  return (
    <div 
      className={`relative rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden ${className}`}
      style={{ width: size, height: size, backgroundColor: '#345D9D' }}
    >
      <svg viewBox="0 0 32 32" className="w-full h-full">
        {/* Royal Blue Circle Base */}
        <circle cx="16" cy="16" r="16" fill="#345D9D" />
        {/* Official Slanted White Litecoin Ł Glyph */}
        <path 
          fill="#FFFFFF" 
          d="M10.427 19.214L9 19.768l.688-2.759 1.444-.58L13.213 8h5.129l-1.519 6.196 1.41-.571-.68 2.75-1.427.571-.848 3.483H23L22.127 24H9.252z"
        />
      </svg>
    </div>
  );
};
