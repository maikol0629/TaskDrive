import React from 'react';

interface EnvelopeIconProps {
  className?: string;
}

const EnvelopeIcon: React.FC<EnvelopeIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" stroke="currentColor" fill="none" />
      <path d="M3 7l9 6 9-6" strokeWidth="2" stroke="currentColor" fill="none" />
    </svg>
  );
};

export default EnvelopeIcon; 