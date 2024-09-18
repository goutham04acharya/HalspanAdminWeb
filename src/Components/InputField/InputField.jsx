import React, { useState } from 'react'
import ErrorMessage from '../ErrorMessage/ErrorMessage'

const InputField = ({
    autoComplete,
    label,
    id,
    type,
    value,
    className,
    placeholder,
    testId,
    htmlFor,
    validationError,
    maxLength,
    handleChange,
    mandatoryField,
    labelStyle,
    handleBlur,
    optional,
    prefixValue
}) => {
 
    return (
        <div>
            <label htmlFor={htmlFor} className={`font-semibold text-base text-[#2B333B] ${labelStyle}`}>{label ? label : null} {mandatoryField ? <span className='text-[#FFA318]'>*</span> : null}<span className='font-normal'>{optional}</span></label>
            <div className='relative'>
                <input
                    autoComplete={autoComplete || 'off'}
                    htmlFor={htmlFor}
                    id={id}
                    type={type}
                    value={value}
                    className={`placeholder:text-[#9FACB9] placeholder:font-normal placeholder:text-base
                     py-[11px] ${type === 'password' ? 'pr-[62px]' : ''} ${prefixValue ? 'pl-[26%] pr-[10px]' : 'pl-[10px] pr-[10px]'}}
                    font-normal text-base leading-[22px] focus:outline-none border border-[#AEB3B7]
                    ${validationError ? 'border border-[#FFA318]' : 'border border-[#AEB3B7]'} ${className} rounded `}
                    placeholder={prefixValue ? '' : placeholder}
                    data-testid={testId}
                    maxLength={maxLength}
                    onChange={(e) => handleChange(e, id, type)}
                    onBlur={(e) => {
                        if (handleBlur) handleBlur(e)
                    }}
                />
                {prefixValue !== undefined && <p className='absolute top-5 left-[6%]'>{prefixValue}</p>}
            </div>
            {validationError && <ErrorMessage error={validationError} />}
        </div>
    )
}

export default InputField