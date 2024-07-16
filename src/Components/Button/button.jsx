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
      className={`rounded ${buttonColor ? buttonColor : 'bg-[#2B333B]'} font-normal text-base text-[#FFFFFF] ${className} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {!isThreedotLoading ? text : <BeatLoader color="#fff" size={smallLoader ? '7px' : '10px'} />}
    </button>
  );
};

export default Button;
