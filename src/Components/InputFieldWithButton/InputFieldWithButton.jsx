/* eslint-disable max-len */
import React, { useState } from 'react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Image from '../Image/Image';
import formatTime from '../../CommonMethods/formatTimer';
import { BeatLoader } from 'react-spinners';

const InputFieldWithButton = ({
    value,
    onChange,
    type,
    onFocus,
    id,
    error,
    label,
    placeholder,
    loginError,
    showLoginError,
    testId,
    autoComplete,
    buttonText,
    buttonDisabled,
    setEnteredLetter,
    className,
    maxLength,
    onClick,
    verified,
    inputDisabled,
    resend,
    timer,
    isLoading,
    handleResend,
    phoneNumber,
    countryCode,
    setCountryCode,
    setNumberMaxLength,
    buttonTestId,
    setVerified,
    verify
}) => {
    const handleKeyDown = (e) => {
        if (setEnteredLetter) {
            setEnteredLetter(e.key);
        }
    };

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        onFocus(id);
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleCountryCode = () => {
        if ((import.meta.env.VITE_STAGE === 'qa' || import.meta.env.VITE_STAGE === 'dev') && !verify) {
            setVerified(prevState => {
                return { ...prevState, phoneNumber: false };
            });
            if (countryCode === '+265') {
                setCountryCode('+91');
                setNumberMaxLength(12);
            } else {
                setCountryCode('+265');
                setNumberMaxLength(11);
            }
        }
    };

    const handleResendClick = () => {
        if (!isLoading) {
            handleResend(id);
        }
    };

    return (
        <div className='flex flex-col gap-2 relative'>
            <label htmlFor={id} className='text-neutral-primary text-[14px] font-[500] leading-[16px]'>{label}</label>
            <div className='bg-[#F8F8F8] relative w-fit flex justify-center items-center'>
                {phoneNumber &&
                <div data-testid='change_code' onClick={handleCountryCode} className={`min-w-[45px] pl-[10px] font-[400] text-[14px] leading-[22px] text-primary-normal py-[11px] border-b ${isFocused ? 'border-primary-normal' : 'border-[#DDDDDD]'} ${error ? 'border-error' : 'border-[#DDDDDD]'}`}>
                    {countryCode}
                </div>}
                <input
                    disabled={inputDisabled || isLoading}
                    maxLength={maxLength}
                    autoComplete={autoComplete || 'off'}
                    data-testid={testId}
                    value={value}
                    type={type || 'text'}
                    className={`placeholder:text-neutral-secondary bg-[#F8F8F8] text-neutral-primary px-[10px] py-[11px]
                    font-[400] text-[14px] leading-[22px] focus:outline-none border-b focus:border-primary-normal pr-[119px]
                    ${error || loginError ? 'border-error' : 'border-[#DDDDDD]'} ${className}`}
                    id={id}
                    placeholder={placeholder}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={(e) => onChange(e, id)}
                    onKeyDown={handleKeyDown}
                />
                {verified
                    ? <div className='absolute top-0 right-0 items-center h-[45px] mr-3 flex gap-[10px]'>
                        <Image src='greenTick' />
                        <div data-testid={buttonTestId} className='text-accent-positive font-[400] text-[14px] leading-[22px]'>
                            VERIFIED
                        </div>
                    </div>
                    : <button data-testid={buttonTestId} className='absolute top-0 right-0 bg-[#FFFFFF] w-[95px] h-[34px] rounded-[8px] text-primary-normal
                    disabled:text-neutral-secondary font-[400] text-[14px] leading-[22px] my-[5px] mr-3 disabled:border-[#F5F5F5]
                        border-neutral-secondary border' disabled={buttonDisabled || isLoading} onClick={() => onClick(buttonText, id)}
                    >
                        {!isLoading
                            ? buttonText
                            : <span>{<BeatLoader color='#3B2A6F' size='7px' />}</span>}
                    </button>}
            </div>
            <div className={`flex items-center ${error ? 'justify-between' : 'justify-end'}`}>
                {error && <ErrorMessage error={error} />}
                {id?.includes('Otp') && (resend
                    ? <div className='font-[400] text-[12px] leading-[20px] text-neutral-primary'>
                        Didn’t receive OTP?
                        {timer > 0
                            ? <span> &nbsp;Resend in {formatTime(timer)}</span>
                            : <span onClick={handleResendClick} className={`${isLoading ? 'cursor-default' : 'cursor-pointer'} text-primary-normal`}> &nbsp;Resend</span>}
                    </div>
                    : <div className='text-accent-information font-[400] text-[12px] leading-[24px]'>
                        Resend limit is 3 times
                    </div>)}
            </div>
            {showLoginError && loginError && !error && <ErrorMessage error={loginError} />}
        </div>
    );
};

export default InputFieldWithButton;
