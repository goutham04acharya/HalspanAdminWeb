import React from 'react'

function DateTimeField({
    label,
    type,
    textId,
    HelpText,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    testId
}) {
    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                title={fieldSettingParameters?.label}
                className='font-medium text-base text-[#000000] overflow-hidden break-all  break-words block w-full max-w-[85%]'>
                {fieldSettingParameters?.label}
            </label>
                <input
                    data-testid='input'
                    type={type}
                    id={textId}
                    value={value}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={(fieldSettingParameters?.placeholderContent)|| 'dd-mm-yyyy'}
                    onClick={() => handleChange(fieldSettingParameters)}
                />
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] truncate'
                title={fieldSettingParameters?.helptext}
            >
                {fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default DateTimeField