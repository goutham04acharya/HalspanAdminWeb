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
    fieldSettingParameters,


}) => {

    return (
        <div>
            <label htmlFor={textId} className='font-medium text-base text-[#000000] absolute top-5'>{fieldSettingParameters?.label}</label>
            {fieldSettingParameters?.type === 'multi_line' ?
                <textarea
                    data-testid={testId}
                    type={type}
                    id={textId}
                    value={value}
                    className={`h-[156px] resize-none w-full break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={fieldSettingParameters?.placeholderContent}
                    onClick={() => handleChange(fieldSettingParameters)}
                />
                :
                <input
                    data-testid={testId}
                    type={type}
                    id={textId}
                    value={value}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={fieldSettingParameters?.placeholderContent}
                    onClick={() => handleChange(fieldSettingParameters)}
                />
            }
            <p className='mt-2 font-normal text-sm text-[#2B333B]'>{fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default TextBoxField