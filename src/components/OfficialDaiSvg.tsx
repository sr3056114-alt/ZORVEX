import React from 'react';

interface DaiSvgProps {
  className?: string;
  size?: number;
}

/**
 * 100% Authentic Official DAI Stablecoin Coin
 * Fixed geometry with fillRule="evenodd" and outer gold coin rim matching Image 2
 */
export const OfficialDaiSvg: React.FC<DaiSvgProps> = ({
  className = '',
  size = 40
}) => {
  return (
    <div 
      className={`relative rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden ${className}`}
      style={{ width: size, height: size, backgroundColor: '#F4B731' }}
    >
      <svg viewBox="0 0 32 32" className="w-full h-full">
        {/* Outer Gold Coin Base */}
        <circle cx="16" cy="16" r="16" fill="#F4B731" />
        {/* Inner Gold Coin Rim Bevel */}
        <circle cx="16" cy="16" r="14.8" fill="#F5AC37" stroke="#E59C20" strokeWidth="0.8" />
        
        {/* Official White MakerDAO DAI Glyph with fillRule="evenodd" so counter cutouts render cleanly */}
        <path 
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.277 8h6.552c3.985 0 7.006 2.116 8.13 5.194H26v1.861h-1.611c.031.294.047.594.047.898v.046c0 .342-.02.68-.06 1.01H26v1.86h-2.08C22.767 21.905 19.77 24 15.83 24H9.277v-5.131H7v-1.86h2.277v-1.954H7v-1.86h2.277V8zm1.831 10.869v3.462h4.72c2.914 0 5.078-1.387 6.085-3.462H11.108zm11.366-1.86H11.108v-1.954h11.37c.041.307.063.622.063.944v.045c0 .329-.023.65-.067.964zM15.83 9.665c2.926 0 5.097 1.424 6.098 3.528h-10.82V9.666h4.72z" 
          fill="#FFFFFF" 
        />
      </svg>
    </div>
  );
};
