import React from 'react';
import { BeatLoader } from 'react-spinners';
import Image from '../../Components/Image/Image.jsx';

const Button2 = ({ 
    className, 
    text, 
    type, 
    onClick, 
    testId, 
    icon, 
    disabled, 
    isThreedotLoading, 
    smallLoader 
}) => {
    return (
        <button
            data-testid={testId}
            onClick={onClick}
            type={type || 'button'}
            className={`bg-[#fff] hover:bg-[#EFF1F8] h-[50px] border border-[#2B333B] text-base text-center
                leading-[24px] py-2 rounded ${className} ${disabled || isThreedotLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={disabled || isThreedotLoading}>
            <div className='flex justify-center items-center gap-2' data-testid="cancel">
                {isThreedotLoading ? (
                    <BeatLoader color="#2B333B" size={smallLoader ? '7px' : '10px'} />
                ) : (
                    <>
                        {icon && <Image src={icon} />}
                        {text}
                    </>
                )}
            </div>
        </button>
    );
};

export default Button2;
