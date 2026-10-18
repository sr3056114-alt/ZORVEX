
import React from 'react';

interface RajadhanLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const RajadhanLogo: React.FC<RajadhanLogoProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`font-black tracking-tighter uppercase ${sizes[size]}`}>
        <span className="text-white">RAJA</span>
        <span className="text-yellow-400">DHAN</span>
      </div>
      <div className="flex flex-col -gap-1">
        <div className="h-1 w-4 bg-red-500 rounded-full"></div>
        <div className="h-1 w-6 bg-yellow-400 rounded-full"></div>
        <div className="h-1 w-4 bg-green-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default RajadhanLogo;
