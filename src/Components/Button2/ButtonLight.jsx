import React from 'react';
import Image from '../../Components/Image/Image.jsx';

const Button2 = ({ className, text, type, onClick, testId, icon, disabled }) => {
    return (
        <button
            data-testid={testId}
            onClick={onClick}
            type={type || 'button'}
            className={`bg-[#fff] border border-[#2B333B] font-normal text-base  text-center
                leading-[24px] py-2 rounded ${className}`}
            disabled={disabled}>
            <div className='flex justify-center items-center gap-2'>
                {icon && <Image src={icon} />}
                {text}
            </div>
        </button>
    );
};

export default Button2;


