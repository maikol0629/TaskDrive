<<<<<<< HEAD
import React from 'react';

type ButtonRoundedProps = {
  text: string;
  className?: string;
  iconLeft?: React.ReactNode;
};

const LeftIconButton = ({ text, className, iconLeft }: ButtonRoundedProps) => {
  return (
    <button
      className={`
        font-semibold text-[20px]
        bg-white hover:bg-[#F2EBF3] transition-colors duration-200
        w-[232px] h-[35px] text-[#2B222C]
        flex items-center justify-start gap-x-2 px-3
        cursor-pointer
        ${className ?? ''}
      `}
    >
      {iconLeft}
      {text}
    </button>
  );
};

const BackButton = ({ text, className }: { text: string; className?: string }) => {
  return (
    <button className={`
      font-medium text-[20px] w-[108px] h-[41px] 
      text-[#483078] cursor-pointer hover:underline 
      transition duration-200 ${className ?? ''}`}>
      {text}
    </button>
  );
}

const NewTaskButton = ({ text, className }: { text: string; className?: string }) => {
  return (
    <button
      className={`
        rounded-[5px] font-medium text-[20px] 
        bg-[#483078] text-white w-[650px] h-[50px] 
        hover:bg-[#3e276b] transition duration-200
        ${className ?? ''}
      `}
    >
      {text}
    </button>
  );
};


const SecondaryButton = ({ text, className, onClick }: { text: string; className?: string; onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-[5px] border border-[#E4E4E7] bg-transparent 
        text-[#2B222C] text-[20px] font-medium 
        w-[160px] h-[50px] hover:bg-[#F2EBF3] transition 
        ${className ?? ''}
      `}
    >
      {text}
    </button>
  );
};


export { LeftIconButton, BackButton, NewTaskButton, SecondaryButton };
=======
export { default } from './Button';
>>>>>>> michael
