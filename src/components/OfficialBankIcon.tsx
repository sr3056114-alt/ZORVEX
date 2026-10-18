import React from 'react';

interface BankIconProps {
  className?: string;
  size?: number;
}

/**
 * Official 3D Isometric Neoclassical Bank Building Icon
 * Grounded in User Reference with 100% Transparent Background (No dark box / No background color)
 */
export const OfficialBankIcon: React.FC<BankIconProps> = ({
  className = '',
  size = 40
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 bg-transparent ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
        fill="none"
      >
        <defs>
          {/* Roof Slate Gradient */}
          <linearGradient id="roofGrad" x1="50" y1="12" x2="50" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          {/* Pillars White Marble Gradient */}
          <linearGradient id="pillarGrad" x1="0" y1="36" x2="1" y2="36">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Gold Inscription Gradient */}
          <linearGradient id="goldTextGrad" x1="50" y1="18" x2="50" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Windows Blue Reflection */}
          <linearGradient id="windowBlueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* 1. Base Marble Steps (3-tier stone steps) */}
        <polygon points="12,85 88,85 84,91 16,91" fill="#94A3B8" />
        <rect x="16" y="81" width="68" height="4.5" rx="0.5" fill="#CBD5E1" />
        <rect x="20" y="77" width="60" height="4" rx="0.5" fill="#E2E8F0" />
        <rect x="24" y="73" width="52" height="4" rx="0.5" fill="#F8FAFC" />

        {/* 2. Main Facade Wall */}
        <rect x="26" y="38" width="48" height="35" fill="#334155" />

        {/* 3. Deep Blue Glass Windows */}
        <rect x="30" y="44" width="7" height="23" rx="1.5" fill="url(#windowBlueGrad)" />
        <rect x="63" y="44" width="7" height="23" rx="1.5" fill="url(#windowBlueGrad)" />
        
        {/* Window Pane Dividers */}
        <line x1="30" y1="55" x2="37" y2="55" stroke="#E0F2FE" strokeWidth="0.8" opacity="0.8" />
        <line x1="63" y1="55" x2="70" y2="55" stroke="#E0F2FE" strokeWidth="0.8" opacity="0.8" />

        {/* 4. Golden Entrance Doors in Center */}
        <rect x="44" y="48" width="12" height="25" rx="1" fill="#78350F" />
        <rect x="45" y="49" width="4.5" height="23" rx="0.5" fill="#D97706" />
        <rect x="50.5" y="49" width="4.5" height="23" rx="0.5" fill="#B45309" />
        <circle cx="48.5" cy="61" r="0.75" fill="#FEF08A" />
        <circle cx="51.5" cy="61" r="0.75" fill="#FEF08A" />

        {/* 5. Four Classical White Roman Pillars */}
        <rect x="24" y="37" width="5.5" height="36" rx="0.8" fill="url(#pillarGrad)" />
        <rect x="38" y="37" width="5.5" height="36" rx="0.8" fill="url(#pillarGrad)" />
        <rect x="56.5" y="37" width="5.5" height="36" rx="0.8" fill="url(#pillarGrad)" />
        <rect x="70.5" y="37" width="5.5" height="36" rx="0.8" fill="url(#pillarGrad)" />

        {/* Pillar Capitols & Bases */}
        <rect x="23" y="36" width="7.5" height="2" rx="0.5" fill="#FFFFFF" />
        <rect x="37" y="36" width="7.5" height="2" rx="0.5" fill="#FFFFFF" />
        <rect x="55.5" y="36" width="7.5" height="2" rx="0.5" fill="#FFFFFF" />
        <rect x="69.5" y="36" width="7.5" height="2" rx="0.5" fill="#FFFFFF" />

        <rect x="23" y="71" width="7.5" height="2" rx="0.5" fill="#CBD5E1" />
        <rect x="37" y="71" width="7.5" height="2" rx="0.5" fill="#CBD5E1" />
        <rect x="55.5" y="71" width="7.5" height="2" rx="0.5" fill="#CBD5E1" />
        <rect x="69.5" y="71" width="7.5" height="2" rx="0.5" fill="#CBD5E1" />

        {/* 6. Entablature / Architrave */}
        <rect x="20" y="32" width="60" height="4.5" fill="#E2E8F0" />
        <line x1="20" y1="36" x2="80" y2="36" stroke="#94A3B8" strokeWidth="0.5" />

        {/* 7. Triangular Classical Pediment */}
        <polygon points="50,13 18,32 82,32" fill="#F8FAFC" />
        <polygon points="50,16 23,31 77,31" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.5" />

        {/* 8. Gold Pediment Inscription "BANK" and "$" Symbol */}
        <text 
          x="50" 
          y="23" 
          textAnchor="middle" 
          fill="url(#goldTextGrad)" 
          fontSize="6" 
          fontWeight="900" 
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.5"
        >
          $
        </text>
        <text 
          x="50" 
          y="29" 
          textAnchor="middle" 
          fill="url(#goldTextGrad)" 
          fontSize="6.8" 
          fontWeight="900" 
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="1"
        >
          BANK
        </text>

        {/* 9. Classical Hip Slate Roof on Top */}
        <polygon points="50,11 50,13 82,32 80,30" fill="url(#roofGrad)" />
      </svg>
    </div>
  );
};
