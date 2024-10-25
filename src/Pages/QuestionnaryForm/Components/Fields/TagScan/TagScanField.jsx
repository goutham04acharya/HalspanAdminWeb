import React from 'react'

function TagScanField({
    type,
    textId,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    preview,
    question
}) {
    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                title={preview ? question?.label : fieldSettingParameters?.label}
                maxLength={100}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] ${preview ? question?.label : fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {preview ? question?.label : fieldSettingParameters?.label}
            </label>
            <div className='mt-4'>
                <button type="button" className='bg-[#bbbfc6] rounded w-[180px] h-[50px] text-base font-semibold' >
                    Tag Scan
                </button>
            </div>
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={preview ? question?.help_text : fieldSettingParameters?.helptext}
            >
                {preview ? question?.help_text : fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default TagScanField