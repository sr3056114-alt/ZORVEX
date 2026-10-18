
import React from 'react';

interface RajadhanLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const RajadhanLogo: React.FC<RajadhanLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-4xl',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg border border-white/20`}>
        <span className="font-black text-black tracking-tighter">R</span>
      </div>
      <span className={`font-black tracking-tighter text-white ${sizeClasses[size].split(' ')[2]}`}>
        RAJADHAN
      </span>
    </div>
  );
};

export default RajadhanLogo;
