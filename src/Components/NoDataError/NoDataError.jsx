import React from 'react';
import Image from '../Image/Image';

const NoDataError = ({ heading, text, className, topValue }) => {
    return (
        <div className={`flex flex-col justify-center items-center font-[400] ${className}`}>
            <Image className='h-[152px] w-[129px]' src='no_data_clipboard' />
            <div className={`text-[20px] leading-[28px] text-neutral-primary ${topValue}`}>{heading}</div>
            <div className='text-[14px] leading-[24px] text-neutral-secondary'>{text}</div>
        </div>
    );
};

export default NoDataError;
