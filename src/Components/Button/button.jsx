import React from 'react';
import { BeatLoader } from 'react-spinners';

const Button = ({
  testID,
  text,
  className,
  buttonColor,
  onClick,
  disabled,
  isThreedotLoading,
  smallLoader,
}) => {
  return (
    <button
      data-testid={testID}
      onClick={onClick}
      disabled={disabled || isThreedotLoading}
      className={` ${className} rounded h-[50px] ${buttonColor ? buttonColor : 'bg-[#2B333B] hover:bg-[#000000]'} font-normal text-base text-[#FFFFFF] ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className='flex justify-center items-center gap-2 h-full' data-testid="save-conditional-logic">
        {!isThreedotLoading ? text : <BeatLoader color="#fff" size={smallLoader ? '7px' : '10px'} />}
      </div>
    </button>
  );
};

export default Button;
