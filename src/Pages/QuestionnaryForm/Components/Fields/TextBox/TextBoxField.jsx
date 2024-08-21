import React from 'react'

const TextBoxField = ({
    label,
    type,
    textId,
    HelpText,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    testId

}) => {

    return (
        <div>
            <label data-testid="label-name" htmlFor={textId} className='font-medium text-base text-[#000000] absolute top-5'>{fieldSettingParameters?.label}</label>
            {fieldSettingParameters?.type === 'multi_line' ?
                <textarea
                    data-testid='input'
                    type={type}
                    id={textId}
                    value={value}
                    className={`h-[156px] resize-none w-full break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={fieldSettingParameters?.placeholderContent}
                    onClick={() => handleChange(fieldSettingParameters)}
                />
                :
                <input
                    data-testid='input'
                    type={type}
                    id={textId}
                    value={value}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={fieldSettingParameters?.placeholderContent}
                    onClick={() => handleChange(fieldSettingParameters)}
                />
            }
            <p data-testid="help-text" className='mt-2 font-normal text-sm text-[#2B333B]'>{fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default TextBoxField