import React from 'react'

function InputTextarea({
    label,
    htmlFor,
    id,
    type,
    value,
    className,
    validationError,
    placeholder,
    testId,
    maxLength,
    handleChange,
    disabled,
    labelStyle,
    mandatoryField,
}) {
    return (
        <div>
            <label htmlFor={htmlFor} className={labelStyle}>{label ? label : null} {mandatoryField ? <span className='text-[#FFA318]'>*</span> : null}</label>
            <textarea
                htmlFor={htmlFor}
                id={id}
                type={type}
                value={value}
                className={`placeholder:text-[#9FACB9] placeholder:font-normal placeholder:text-base
                    px-4 py-3 resize-none
                    font-normal text-base leading-[22px] focus:outline-none border border-[#AEB3B7]
                    ${validationError ? 'border border-[#FFA318]' : 'border border-[#AEB3B7]'} ${className} rounded `}
                placeholder={placeholder}
                data-testid={testId}
                maxLength={maxLength}
                onChange={(e) => handleChange(e, id, type)}
                disabled={disabled}
            >
            </textarea>
        </div>
    )
}

export default InputTextarea
