import React from 'react'

function FloorPrintField({
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
                className='font-medium text-base text-[#000000] text-ellipsis whitespace-nowrap block w-full max-w-[90%] truncate'>
                {fieldSettingParameters?.label}
            </label>
            <div className='mt-2'>
                <img src="/public/Images/HalspanGrayLogo.svg" alt="image" />
            </div>
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] truncate'
                title={fieldSettingParameters?.helptext}
            >
                {fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default FloorPrintField