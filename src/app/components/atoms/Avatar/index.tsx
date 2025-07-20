import React from 'react';

interface AvatarProps {
  name?: string | null;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  email, 
  size = 'md', 
  onClick,
  className = ''
}) => {
  // Generar iniciales del nombre o email
  const getInitials = () => {
    if (name && name.trim()) {
      const nameParts = name.trim().split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    
    if (email) {
      const emailPart = email.split('@')[0];
      return emailPart.substring(0, 2).toUpperCase();
    }
    
    return 'U';
  };

  // Generar color de fondo basado en el email o nombre
  const getBackgroundColor = () => {
    const str = name || email || 'user';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generar colores suaves pero distintivos
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, 65%)`;
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        text-white 
        font-semibold 
        cursor-pointer 
        hover:ring-2 
        hover:ring-white 
        hover:ring-opacity-50 
        transition-all
        ${className}
      `}
      style={{ backgroundColor: getBackgroundColor() }}
      onClick={onClick}
      title={name || email || 'Usuario'}
    >
      {getInitials()}
    </div>
  );
};

export default Avatar; 