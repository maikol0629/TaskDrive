import React from 'react';
import Link from 'next/link';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  href: string;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  isActive = false,
  href,
  badge
}) => {
  return (
    <Link
      href={href}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
        isActive 
          ? 'bg-[#5226A6] text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className={isActive ? 'text-white' : 'text-gray-500'}>
        {icon}
      </span>
      <span className="font-medium flex items-center">
        {label}
        {badge && badge > 0 && (
          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
            {badge}
          </span>
        )}
      </span>
    </Link>
  );
};

export default NavItem; 