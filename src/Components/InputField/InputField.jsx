/* eslint-disable indent */
import React, { useState } from 'react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Image from '../Image/Image';

const InputField = ({
    value,
    onChange,
    type,
    givenType,
    onFocus,
    id,
    error,
    label,
    inputType,
    placeholder,
    loginError,
    showLoginError,
    testId,
    autoComplete,
    setEnteredLetter,
    className,
    notShowErrorBottom,
    maxLength,
    divClassName,
    editAction,
    disableInput,
    ViewClass
}) => {
    const [isPasswordType, setIsPasswordType] = useState(true);

    const handleKeyDown = (e) => {
        if (setEnteredLetter) {
            setEnteredLetter(e.key);
        }
    };

    return (
        <div className={`flex flex-col gap-2 relative ${divClassName || ''}`}>
            <label htmlFor={id} className='text-neutral-primary text-[14px] font-[500] leading-[16px]'>{label}</label>
            <input
                autoComplete={autoComplete || 'off'}
                data-testid={testId}
                value={value}
                type={givenType ? isPasswordType ? 'password' : 'text' : type || 'text'}
                className={`placeholder:text-neutral-secondary text-neutral-primary 
                ${ViewClass || ((editAction === 'yes' || disableInput) ? 'bg-[#D1D4D7]' : 'bg-[#F8F8F8]')} 
                px-[10px] py-[11px] ${type === 'password' ? 'pr-[62px]' : ''} 
                    font-[400] text-[14px] leading-[22px] focus:outline-none border-b focus:border-primary-normal 
                    ${error || loginError ? 'border-error' : 'border-[#DDDDDD]'} ${className} rounded-tl rounded-tr `}
                id={id}
                placeholder={placeholder}
                onFocus={() => onFocus(id)}
                onChange={(e) => onChange(e, id, inputType)}
                onKeyDown={handleKeyDown}
                maxLength={maxLength}
                disabled = {editAction === 'yes' || disableInput}

            />
            {/* && value.length > 0 */}
            {givenType === 'password' && value.length > 0 &&
                <div className={`absolute right-0 py-[18.79px] pl-[10px] pr-[23.77px] cursor-pointer 
                    ${error || loginError ? 'bottom-[30px]' : 'bottom-0'}`}
                    onClick={() => setIsPasswordType(prevState => !prevState)}>
                    {isPasswordType ? <Image src='SHOW' /> : <Image src='HIDE' />}
                </div>
            }
            {!notShowErrorBottom && error && <ErrorMessage error={error} />}
            {showLoginError && loginError && !error && <ErrorMessage error={loginError} />}
        </div>
    );
};

export default InputField;
