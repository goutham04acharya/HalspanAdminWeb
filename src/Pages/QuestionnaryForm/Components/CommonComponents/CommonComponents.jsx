import React from 'react'

function CommonComponents({
    labelID,
    labelName,
    labelPlaceholder,
    helpTextId,
    helpText,
    helpTextPlaceholder,
    placeholderContentId,
    placeholder,
    placeholderContent,
    handleInputChange,
    formParameters

}) {
    return (
        <div>
            <div className='flex flex-col justify-start'>
                <label
                    htmlFor={labelID}
                    className='font-semibold text-base text-[#2B333B]'>{labelName}
                </label>
                <input
                    type="text"
                    // id={labelID}
                    className='mt-[11px] border border-[#AEB3B7] rounded py-[11px] px-4 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                    placeholder={labelPlaceholder}
                    onChange={(e) => handleInputChange(e)}
                    value={formParameters.label}
                    id='label'
                />
            </div>
            <div className='flex flex-col justify-start mt-7'>
                <label
                    htmlFor={helpTextId}
                    className='font-semibold text-base text-[#2B333B]'>{helpText}
                </label>
                <input
                    type="text"
                    // id={helpTextId}
                    className='mt-[11px] border border-[#AEB3B7] rounded py-[11px] px-4 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                    placeholder={helpTextPlaceholder}
                    onChange={(e) => handleInputChange(e)}
                    value={formParameters.helptext}
                    id='helptext'

                />
            </div>
            <div className='flex flex-col justify-start mt-7'>
                <label
                    htmlFor={placeholderContentId}
                    className='font-semibold text-base text-[#2B333B]'>{placeholder}
                </label>
                <input
                    type="text"
                    // id={placeholderContentId}
                    className='mt-[11px] border border-[#AEB3B7] rounded py-[11px] px-4 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                    placeholder={placeholderContent}
                    value={formParameters.placeholderContent}
                    onChange={(e) => handleInputChange(e)}
                    id='placeholderContent'
                />
            </div>
        </div>
    )
}

export default CommonComponents