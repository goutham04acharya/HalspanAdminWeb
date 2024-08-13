import React from 'react'

const TextBoxField = ({
    label,
    testId,
    type,
    textId,
    HelpText,
    value,
    className,
    handleChange,
    textFieldSettingParameters,
   

}) => {

    return (
        <div>
            <label htmlFor={textId} className='font-medium text-base text-black'>{textFieldSettingParameters?.label}</label>
            <input
                data-testid={testId}
                type={type}
                id={textId}
                value={value}
                className={`w-full border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                placeholder={textFieldSettingParameters?.placeholderContent}
                onClick={() => handleChange()}
            />
            <p className='mt-2 font-normal text-sm text-[#2B333B]'>{textFieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default TextBoxField