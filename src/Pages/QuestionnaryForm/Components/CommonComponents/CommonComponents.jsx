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
    formParameters,
    handleBlur,
    setFocusInput,
    assetLocation,
    formStatus,
    fieldSettingParameters,
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
                    onChange={formStatus === 'Draft' ? (e) => handleInputChange(e) : null}
                    value={formParameters?.label || ''}
                    id='label'
                    onBlur={formStatus === 'Draft' ? (e) => handleBlur(e) : null}
                    data-testid="label-name-input"
                    disabled={formStatus !== 'Draft'}
                    maxLength={formStatus === 'Draft' ? 2500 : null}
                    onFocus={formStatus === 'Draft' ? () => {
                        if (setFocusInput) {
                            setFocusInput('');
                        }
                    } : null}
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
                    value={formParameters?.helptext || ''}
                    id='helptext'
                    onBlur={(e) => handleBlur(e)}
                    data-testid="help-text-input"
                    maxLength={2500}
                    disabled={formStatus !== 'Draft'}
                    onFocus={() => {
                        if (setFocusInput) {
                            setFocusInput('');
                        }
                    }}
                    onMouseDown={(e) => {
                        // Get the position where the mouse was clicked
                        const clickPosition = e.currentTarget.selectionStart;
                    }}
                />
            </div>
            {(!assetLocation || fieldSettingParameters?.type === 'dropdown' ) &&
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
                        value={formParameters?.placeholderContent || ''}
                        onChange={formStatus === 'Draft' ? (e) => handleInputChange(e) : null}
                        id='placeholderContent'
                        disabled={formStatus !== 'Draft'}
                        onBlur={formStatus === 'Draft' ? (e) => handleBlur(e) : null}
                        data-testid="placeholder-input"
                        maxLength={2500}
                        onFocus={() => {
                            if (setFocusInput) {
                                setFocusInput('');
                            }
                        }}
                    />
                </div>}
        </div>
    )
}

export default CommonComponents