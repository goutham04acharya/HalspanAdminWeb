import React from 'react'
import ImageZoomPin from '../../../../../Components/PinOnTheFloor/PinOnTheFloor'

function FloorPlanField({
    type,
    textId,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    helpText,
    preview,
    question,
    setValue,
    setValidationErrors,
    validationErrors
}) {
    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                title={preview ? question?.label : fieldSettingParameters?.label}
                maxLength={100}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {preview ? question?.label : fieldSettingParameters?.label}{(!question?.options?.optional && preview) && <span className='text-red-500'>*</span>}
            </label>
            <div className='mt-2'>
                {/* <img src="/Images/HalspanGrayLogo.svg" alt="image" /> */}
                {preview && <ImageZoomPin floorPlan setValidationErrors={setValidationErrors} setValue={setValue} />}
            </div>
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={preview ? question?.help_text : fieldSettingParameters?.helptext}
            >
                {preview? question?.help_text : fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default FloorPlanField