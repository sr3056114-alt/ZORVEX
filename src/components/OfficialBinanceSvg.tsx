import React from 'react';

interface BinanceSvgProps {
  className?: string;
  size?: number;
}

/**
 * 100% Authentic Official Binance Diamond Emblem
 * Grounded in official brand vectors matching User Image 3 with golden-yellow (#F3BA2F)
 * 4-rhombus geometric construction.
 */
export const OfficialBinanceSvg: React.FC<BinanceSvgProps> = ({ className = '', size = 40 }) => {
  return (
    <div 
      className={`relative shrink-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 126.6 126.6" className="w-full h-full drop-shadow-sm">
        {/* Top Chevron */}
        <polygon fill="#F3BA2F" points="38.171,53.203 62.759,28.616 87.36,53.216 101.667,38.909 62.759,0 23.864,38.896" />
        {/* Left Diamond */}
        <rect x="3.644" y="53.188" transform="matrix(0.7071 0.7071 -0.7071 0.7071 48.7933 8.8106)" fill="#F3BA2F" width="20.233" height="20.234" />
        {/* Bottom Chevron */}
        <polygon fill="#F3BA2F" points="38.171,73.408 62.759,97.995 87.359,73.396 101.674,87.695 101.667,87.703 62.759,126.611 23.863,87.716 23.843,87.696" />
        {/* Right Diamond */}
        <rect x="101.64" y="53.189" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 235.5457 29.0503)" fill="#F3BA2F" width="20.234" height="20.233" />
        {/* Center Diamond */}
        <polygon fill="#F3BA2F" points="77.271,63.298 77.277,63.298 62.759,48.78 52.03,59.509 52.029,59.509 50.797,60.742 48.254,63.285 48.254,63.285 48.234,63.305 48.254,63.326 62.759,77.831 77.277,63.313 77.284,63.305" />
      </svg>
    </div>
  );
};
