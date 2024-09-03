import React from 'react';
import Image from '../../../../../Components/Image/Image';

const AssetLocationField = ({
    label,
    type,
    textId,
    HelpText,
    value,
    className,
    handleChange,
    // above are not sent
    fieldSettingParameters,
    testId
}) => {

    return (
        <div data-testid="asset-location">
            <label
                data-testid="label-name"
                htmlFor={textId}
                title={fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}
                maxLength={100}
            >
                {fieldSettingParameters?.label}
            </label>
            <div className='relative mt-5'>
                <label htmlFor={textId} className='font-medium text-base text-black'>Site</label>
                <input
                    data-testid='input'
                    type={type}
                    id={textId}
                    value={value}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
                    placeholder='Select'
                    onClick={handleChange}
                />
                <div className='absolute right-4 top-[74%] -translate-y-1/2'>
                    <Image src='down' />
                </div>
            </div>
            <div className='relative mt-8'>
                <label htmlFor={textId} className='font-medium text-base text-black'>Building</label>
                <input
                    data-testid='input'
                    type={type}
                    id={textId}
                    value={value}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
                    placeholder='Select'
                    onClick={handleChange}
                />
                <div className='absolute right-4 top-[74%] -translate-y-1/2'>
                    <Image src='down' />
                </div>
            </div>
            <div className='relative mt-8'>
                <label htmlFor={textId} className='font-medium text-base text-black'>Floor</label>
                <input
                    data-testid='input'
                    type={type}
                    id={textId}
                    value={value}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
                    placeholder='Select'
                    onClick={handleChange}
                />
                <div className='absolute right-4 top-[74%] -translate-y-1/2'>
                    <Image src='down' />
                </div>
            </div>
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={fieldSettingParameters?.helptext}
            >
                {fieldSettingParameters?.helptext}
            </p>
        </div>
    );
};

export default AssetLocationField;
