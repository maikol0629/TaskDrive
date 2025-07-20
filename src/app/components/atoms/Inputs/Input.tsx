import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6] focus:ring-1";
  const errorClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";
  const combinedClasses = `${baseClasses} ${errorClasses} ${className}`.trim();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={combinedClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input; 