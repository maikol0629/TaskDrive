import React from 'react';

interface ArrowIconProps {
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ 
  direction = 'left', 
  className = "w-5 h-5" 
}) => {
  const getRotation = () => {
    switch (direction) {
      case 'right': return 'rotate-180';
      case 'up': return 'rotate-90';
      case 'down': return '-rotate-90';
      default: return '';
    }
  };

  return (
    <svg className={`${className} ${getRotation()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
};

export default ArrowIcon; 