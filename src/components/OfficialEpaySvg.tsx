import React from 'react';

interface EpaySvgProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

/**
 * Official Premium E-Pay Brand Logo
 * Mastercrafted Interlocking Blue & Orange Rounded Rhombuses
 * Ultra-crisp geometry, vibrant 3D specular gradients, realistic depth & glossy sheen
 */
export const OfficialEpaySvg: React.FC<EpaySvgProps> = ({
  className = '',
  size = 24,
  showText = false
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title="E-Pay"
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] overflow-visible" 
        fill="none"
      >
        <defs>
          {/* Deep Royal Electric Blue with specular lighting */}
          <linearGradient id="epayBlueLux" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#00C8FF" />
            <stop offset="35%" stopColor="#0075FF" />
            <stop offset="70%" stopColor="#0052D4" />
            <stop offset="100%" stopColor="#002D80" />
          </linearGradient>

          {/* Vivid Radiant Tangerine-Orange with golden glow */}
          <linearGradient id="epayOrangeLux" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#FFC107" />
            <stop offset="30%" stopColor="#FF7700" />
            <stop offset="75%" stopColor="#FF3D00" />
            <stop offset="100%" stopColor="#C41C00" />
          </linearGradient>

          {/* Specular curved gloss highlight */}
          <linearGradient id="epayGlossLux" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Realistic depth shadow for the intertwining loops */}
          <filter id="epayInnerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        <g filter="url(#epayInnerGlow)">
          {/* Top-Left Blue Diamond Loop */}
          <path 
            d="M 38 10 
               C 42 6 48 6 52 10 
               L 66 24 
               C 70 28 70 34 66 38 
               L 48 56 
               C 44 60 38 60 34 56 
               L 20 42 
               C 16 38 16 32 20 28 
               Z 
               M 37 21 
               C 35.5 19.5 33 19.5 31.5 21 
               L 26 26.5 
               C 24.5 28 24.5 30.5 26 32 
               L 35 41 
               C 36.5 42.5 39 42.5 40.5 41 
               L 55 26.5 
               C 56.5 25 56.5 22.5 55 21 
               L 46 12 
               C 44.5 10.5 42 10.5 40.5 12 
               Z"
            fill="url(#epayBlueLux)"
            fillRule="evenodd"
          />

          {/* Bottom-Right Orange Diamond Loop */}
          <path 
            d="M 62 34 
               C 66 30 72 30 76 34 
               L 90 48 
               C 94 52 94 58 90 62 
               L 72 80 
               C 68 84 62 84 58 80 
               L 44 66 
               C 40 62 40 56 44 52 
               Z 
               M 61 45 
               C 59.5 43.5 57 43.5 55.5 45 
               L 50 50.5 
               C 48.5 52 48.5 54.5 50 56 
               L 59 65 
               C 60.5 66.5 63 66.5 64.5 65 
               L 79 50.5 
               C 80.5 49 80.5 46.5 79 45 
               L 70 36 
               C 68.5 34.5 66 34.5 64.5 36 
               Z"
            fill="url(#epayOrangeLux)"
            fillRule="evenodd"
          />

          {/* Interlocking Link Overlap: Blue wraps cleanly over orange right leg, under left leg */}
          <path 
            d="M 52 28 L 66 42 C 67 43 67 45 66 46 L 61 51 C 60 52 58 52 57 51 L 43 37 C 42 36 42 34 43 33 L 48 28 C 49 27 51 27 52 28 Z"
            fill="url(#epayBlueLux)"
          />

          {/* Specular 3D Gloss Highlight Stripe across upper Blue apex */}
          <path 
            d="M 38 10 C 42 6 48 6 52 10 L 66 24 C 67.5 25.5 67.5 27.5 66 29 L 61 24 C 59.5 22.5 56.5 22.5 55 24 L 46 15 C 44.5 13.5 41.5 13.5 40 15 L 35 10 C 36 10 37 10 38 10 Z"
            fill="url(#epayGlossLux)"
          />

          {/* Specular 3D Gloss Highlight Stripe across upper Orange apex */}
          <path 
            d="M 62 34 C 66 30 72 30 76 34 L 90 48 C 91.5 49.5 91.5 51.5 90 53 L 85 48 C 83.5 46.5 80.5 46.5 79 48 L 70 39 C 68.5 37.5 65.5 37.5 64 39 L 59 34 C 60 34 61 34 62 34 Z"
            fill="url(#epayGlossLux)"
          />
        </g>
      </svg>
    </div>
  );
};
