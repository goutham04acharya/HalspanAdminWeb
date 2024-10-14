import React from 'react'

const SignatureField = ({
    label,
    type,
    textId,
    HelpText,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    testId,
    preview,
    question

}) => {

    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                maxLength={100}
                title={preview ? question?.label:fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%]  ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {preview ? question?.label:fieldSettingParameters?.label}
            </label>
            <textarea
                data-testid='input'
                type={type}
                id={textId}
                value={value}
                className={`h-[156px] resize-none w-full break-words border border-[#AEB3B7] rounded-lg bg-white ${preview ? 'mt-1' : 'mt-5'} py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                placeholder={preview ? question?.placeholder_content:fieldSettingParameters?.placeholderContent || 'Sign here'}
                onClick={() => handleChange(fieldSettingParameters)}
            />
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={preview ? question?.help_text:fieldSettingParameters?.helptext}
            >
                {preview ? question?.help_text:fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default SignatureField