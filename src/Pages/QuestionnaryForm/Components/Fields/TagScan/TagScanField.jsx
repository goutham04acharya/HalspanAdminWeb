import React from 'react'

function TagScanField({
    type,
    textId,
    value,
    className,
    handleChange,
    fieldSettingParameters,
}) {
    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                title={fieldSettingParameters?.label}
                maxLength={100}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {fieldSettingParameters?.label}
            </label>
            <div className='mt-4'>
                <button type="button" className='bg-[#bbbfc6] rounded w-[180px] h-[50px] text-base font-semibold' >
                    Tag Scan
                </button>
            </div>
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={fieldSettingParameters?.helptext}
            >
                {fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default TagScanField