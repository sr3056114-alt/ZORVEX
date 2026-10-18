import React from 'react';

interface PaytmSvgProps {
  className?: string;
  size?: number;
  pure?: boolean;
}

/**
 * 100% Authentic, High-Contrast Official PayTM Brand Mark
 * Navy Blue 'pay' (#002970) and Electric Cyan 'tm' (#00BAF2)
 * Specially designed with bold vector glyphs so it stays 100% visible
 * and crystal-sharp even in small preview badges.
 */
export const OfficialPaytmSvg: React.FC<PaytmSvgProps> = ({
  className = '',
  size = 40,
  pure = false
}) => {
  const isMini = size < 28 || pure;

  if (isMini) {
    return (
      <div 
        className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden ${className}`}
        style={{
          width: pure ? '100%' : Math.max(24, Math.round(size * 1.5)),
          height: pure ? '100%' : Math.max(14, size),
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        title="Paytm"
      >
        <svg 
          viewBox="0 0 76 24" 
          className="w-full h-full object-contain" 
          fill="none"
        >
          {/* Bold, high-contrast 'Pay' in Navy Blue */}
          <g fill="#002970">
            {/* P */}
            <path d="M 4 2 L 15 2 C 19.5 2 22.5 4.8 22.5 9 C 22.5 13.2 19.5 16 15 16 L 10 16 L 10 22 L 4 22 Z M 10 6.5 L 10 11.5 L 14.5 11.5 C 16.5 11.5 17.5 10.5 17.5 9 C 17.5 7.5 16.5 6.5 14.5 6.5 Z" />
            {/* a */}
            <path d="M 28 8.5 C 32 8.5 34.5 10.5 34.5 13.5 L 34.5 22 L 30 22 L 30 20 C 28.8 21.5 26.8 22.4 24.2 22.4 C 20.5 22.4 18 20.2 18 17 C 18 13.8 20.5 11.8 25 11.8 C 26.8 11.8 28.5 12.3 30 13.2 L 30 12.5 C 29.5 11 28 10.2 26 10.2 C 24.2 10.2 22.8 10.8 22 11.8 L 19 9.5 C 21 7.8 24.5 8.5 28 8.5 Z M 30 17 C 28.8 16.2 27.2 15.8 25.8 15.8 C 23.8 15.8 22.8 16.6 22.8 17.8 C 22.8 19 23.8 19.8 25.8 19.8 C 27.8 19.8 30 18.8 30 17 Z" />
            {/* y */}
            <path d="M 37 9 L 41.5 9 L 45 16.5 L 48.5 9 L 53 9 L 47 21 C 45 24.5 43 25.8 39.5 25.8 C 38 25.8 36.8 25.5 36 24.8 L 37.5 21.8 C 38.2 22.2 39 22.5 40 22.5 C 41.5 22.5 42.5 21.5 43.2 20 Z" />
          </g>

          {/* Bold, high-contrast 'tm' in Vivid Electric Cyan */}
          <g fill="#00BAF2">
            {/* t */}
            <path d="M 57 4 L 57 9 L 61 9 L 61 12.5 L 57 12.5 L 57 18 C 57 19.2 57.8 19.8 59 19.8 C 59.8 19.8 60.5 19.5 61.2 19 L 62 22 C 60.8 22.8 59.2 23.2 57.5 23.2 C 54.2 23.2 52.5 21.2 52.5 18 L 52.5 12.5 L 49.5 12.5 L 49.5 9 L 52.5 9 L 52.5 5 Z" />
            {/* m */}
            <path d="M 64 9 L 68 9 L 68 11.2 C 69 9.8 70.8 8.8 73 8.8 C 76.5 8.8 78 11 78 15 L 78 22 L 74 22 L 74 15.5 C 74 13.8 73 13 71.5 13 C 70 13 68 14.2 68 16.2 L 68 22 L 64 22 Z" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 bg-white rounded-lg px-2.5 py-1 border border-gray-200 shadow-sm overflow-hidden ${className}`}
      style={{ width: size * 1.35, height: size }}
    >
      <svg viewBox="0 0 115 36" className="w-full h-full object-contain">
        {/* 'Pay' in Official Navy Blue (#002970) */}
        <g fill="#002970">
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M 4 4 L 18 4 C 24 4 28 7.5 28 13 C 28 18.5 24 22 18 22 L 11 22 L 11 30 L 4 30 Z M 11 9 L 11 17 L 17.5 17 C 20.5 17 22 15.5 22 13 C 22 10.5 20.5 9 17.5 9 Z" 
          />
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M 33 11 C 37.5 11 40.5 13.5 40.5 17.2 L 40.5 30 L 35 30 L 35 27.5 C 33.5 29.5 31 30.5 28 30.5 C 23.5 30.5 20.5 27.5 20.5 23.5 C 20.5 19.5 23.5 17 28.5 17 C 30.5 17 32.5 17.5 34.5 18.5 L 34.5 17.8 C 33.8 15.8 32.2 14.8 29.8 14.8 C 27.8 14.8 26.2 15.8 25.5 17 L 21 14.5 C 22.8 12.2 27 11 33 11 Z M 34.5 23 C 33.2 22 31.5 21.4 29.8 21.4 C 27.2 21.4 25.8 22.5 25.8 24 C 25.8 25.5 27.2 26.6 29.8 26.6 C 32.2 26.6 34.5 25.2 34.5 23 Z" 
          />
          <path d="M 43 12 L 48.5 12 L 53 22 L 57.5 12 L 63 12 L 56 26.5 C 54 30.5 51.5 32.5 47.5 32.5 C 45.5 32.5 44 32 43 31.2 L 44.5 27.2 C 45.2 27.6 46.2 27.8 47.2 27.8 C 49 27.8 50.2 26.8 51 25 L 52 23 Z" />
        </g>

        {/* 'tm' in Official Paytm Cyan (#00BAF2) */}
        <g fill="#00BAF2">
          <path d="M 68 5 L 68 12 L 73 12 L 73 16.5 L 68 16.5 L 68 23.5 C 68 25.2 68.8 26 70.5 26 C 71.5 26 72.2 25.6 73 25 L 74.2 29 C 73 30 71 30.5 69 30.5 C 65 30.5 63 28 63 24 L 63 16.5 L 59 16.5 L 59 12 L 63 12 L 63 7 Z" />
          <path d="M 76 12 L 81 12 L 81 14.5 C 82.2 12.8 84.2 11.8 86.8 11.8 C 89.5 11.8 91.5 13.2 92.5 15.2 C 94 13.2 96.5 11.8 99.8 11.8 C 104.2 11.8 106.5 14.5 106.5 19.5 L 106.5 30 L 101 30 L 101 20.5 C 101 18.2 99.8 17.2 97.8 17.2 C 95.8 17.2 94.2 18.8 94.2 21.2 L 94.2 30 L 88.8 30 L 88.8 20.5 C 88.8 18.2 87.5 17.2 85.5 17.2 C 83.5 17.2 82 18.8 82 21.2 L 82 30 L 76 30 Z" />
        </g>
      </svg>
    </div>
  );
};
