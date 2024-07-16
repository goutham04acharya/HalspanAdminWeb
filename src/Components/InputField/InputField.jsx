import React, { useState } from 'react'

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


}) => {



    return (
        <div>
            <label htmlFor={htmlFor}>{label ? label : null}</label>
            <input
                autoComplete={autoComplete || 'off'}
                htmlFor={htmlFor}
                id={id}
                type={type}
                value={value}
                className={`placeholder:text-[#9FACB9] placeholder:font-normal placeholder:text-base
                    px-[10px] py-[11px] ${type === 'password' ? 'pr-[62px]' : ''}
                    font-normal text-sm leading-[22px] focus:outline-none border border-[#AEB3B7]
                    ${validationError ? 'border border-[#FFA318]' : 'border border-[#AEB3B7]'} ${className} rounded `}
                placeholder={placeholder}
                data-testid={testId}
                maxLength={maxLength}
                onChange={(e) => handleChange(e, id, type)}
            // disabled={ }

            />
        </div>
    )
}

export default InputField