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
    optional
}) => {

    return (
        <div>
            <label htmlFor={htmlFor} className={`font-semibold text-base text-[#2B333B] ${labelStyle}`}>{label ? label : null} {mandatoryField ? <span className='text-[#FFA318]'>*</span> : null}<span className='font-normal'>{optional}</span></label>
            <input
                autoComplete={autoComplete || 'off'}
                htmlFor={htmlFor}
                id={id}
                type={type}
                value={value}
                className={`placeholder:text-[#9FACB9] placeholder:font-normal placeholder:text-base
                    px-[10px] py-[11px] ${type === 'password' ? 'pr-[62px]' : ''}
                    font-normal text-base leading-[22px] focus:outline-none border border-[#AEB3B7]
                    ${validationError ? 'border border-[#FFA318]' : 'border border-[#AEB3B7]'} ${className} rounded `}
                placeholder={placeholder}
                data-testid={testId}
                maxLength={maxLength}
                onChange={(e) => handleChange(e, id, type)}
                onBlur={(e) => {
                    if(handleBlur) handleBlur(e)
                }}
            // disabled={ }
            />
            {validationError && <ErrorMessage error={validationError} />}
        </div>
    )
}

export default InputField