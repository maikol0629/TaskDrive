<<<<<<< HEAD
import React from 'react';

type InputProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
};

export const TextInput = ({ value, onChange, placeholder, className }: InputProps) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        w-[650px] h-[50px] rounded-[5px] border border-[#E4E4E7] 
        text-[#2B222C] text-[18px] px-4 focus:outline-none focus:ring-2 focus:ring-[#C9A3E8]
        ${className ?? ''}
      `}
    />
  );
};

type TextAreaProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
};

export const TextArea = ({ value, onChange, placeholder, className }: TextAreaProps) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className={`
        w-[650px] rounded-[5px] border border-[#E4E4E7] 
        text-[#2B222C] text-[18px] px-4 py-3 resize-none
        focus:outline-none focus:ring-2 focus:ring-[#C9A3E8]
        ${className ?? ''}
      `}
    />
  );
};

type DateInputProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export const DateInput = ({ value, onChange, className }: DateInputProps) => {
  return (
    <input
      type="date"
      value={value}
      onChange={onChange}
      className={`
        w-[650px] h-[50px] rounded-[5px] border border-[#E4E4E7] 
        text-[#2B222C] text-[18px] px-4 focus:outline-none focus:ring-2 focus:ring-[#C9A3E8]
        ${className ?? ''}
      `}
    />
  );
};
=======
export { default } from './Input'; 
>>>>>>> michael
