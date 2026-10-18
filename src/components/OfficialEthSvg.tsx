import React from 'react';

interface EthSvgProps {
  className?: string;
  size?: number;
}

/**
 * 100% Authentic Official Ethereum (ETH) 3D Faceted Crystal Prism
 * Pure crystal on transparent background (black background removed as requested in Image 1)
 */
export const OfficialEthSvg: React.FC<EthSvgProps> = ({
  className = '',
  size = 40
}) => {
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 256 417" className="w-[88%] h-[88%] drop-shadow-sm">
        {/* Top Left Upper Facet */}
        <polygon fill="#8C8C8C" points="127.962 0 0 212.32 127.962 287.959 127.962 154.158" />
        {/* Top Right Upper Facet */}
        <polygon fill="#343434" points="127.961 0 125.166 9.5 125.166 285.168 127.961 287.958 255.923 212.32" />
        {/* Center Left Mid Facet */}
        <polygon fill="#393939" points="0.001 212.321 127.961 287.958 127.961 154.159" />
        {/* Center Right Mid Facet */}
        <polygon fill="#141414" points="127.961 287.958 255.921 212.321 127.961 154.159" />
        {/* Bottom Left Inverted Facet */}
        <polygon fill="#8C8C8C" points="127.962 416.905 127.962 312.185 0 236.585" />
        {/* Bottom Right Inverted Facet */}
        <polygon fill="#3C3C3B" points="127.961 312.187 126.386 314.107 126.386 412.306 127.961 416.907 256 236.587" />
      </svg>
    </div>
  );
};
