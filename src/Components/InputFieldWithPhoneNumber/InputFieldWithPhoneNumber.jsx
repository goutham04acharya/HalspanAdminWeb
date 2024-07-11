import React, { useState } from 'react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const InputFieldWithPhoneNumber = ({
    value,
    onChange,
    type,
    onFocus,
    id,
    error,
    label,
    placeholder,
    testId,
    autoComplete,
    setEnteredLetter,
    className,
    maxLength,
    notifyFocusChange,
    editAction,
    countryCode

}) => {
    const handleKeyDown = (e) => {
        if (setEnteredLetter) {
            setEnteredLetter(e.key);
        }
    };
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
        if (notifyFocusChange) {
            notifyFocusChange('phoneNumber'); // Notify the parent about focus change
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <div className='flex flex-col gap-2 relative'>
            <label htmlFor={id} className='text-neutral-primary text-[14px] font-[500] leading-[16px]'>{label}</label>
            <div className={` ${editAction === 'yes' ? 'bg-[#D1D4D7]' : 'bg-[#F8F8F8]'}  text-neutral-primary px-[10px] py-[11px]
                     leading-[22px] focus:outline-none border-b focus:border-primary-normal flex justify-center items-center
                    ${error ? 'border-error' : 'border-[#DDDDDD]'} 
                    ${className} rounded-tl rounded-tr`} style={{ borderBottomColor: isFocused ? '#3B2A6F' : '' }}>
                <p
                    className=' top-0 left-0  text-primary-normal font-[400] text-[14px]
                    leading-[22px]  mr-2'
                >
                    +265
                </p>
                <input
                    maxLength={maxLength}
                    autoComplete='off'
                    data-testid={testId}
                    value={value}
                    type={type || 'text'}
                    className={` text-neutral-primary 
                    font-[400] text-[14px] leading-[22px] bg-transparent
                    ${className}`}
                    id={id}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e, id)}
                    onKeyDown={handleKeyDown}
                    style={{ outline: 'none' }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled = {editAction === 'yes'}
                />
            </div>
            {error && <ErrorMessage error={error} />}
        </div>
    );
};

export default InputFieldWithPhoneNumber;
