import React from 'react'

function DIsplayContentField({
    label,
    type,
    textId,
    HelpText,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    testId
}) {
    return (
        <div>
            {fieldSettingParameters?.type === 'heading' &&
                <p data-testid="heading" className='font-normal text-xl text-[#2B333B] max-w-[90%] break-words py-3'>{fieldSettingParameters?.heading}</p>
            }
            {fieldSettingParameters?.type === 'text' &&
                <p data-testid="text" className='font-normal text-base text-[#2B333B] max-w-[90%] break-words py-3'>{fieldSettingParameters?.text}</p>
            }
            {fieldSettingParameters?.type === 'image' && 
                <img
                    src={fieldSettingParameters?.image} // assuming 'fieldSettingParameters.image' holds the S3 URL of the uploaded image
                    className="mt-8"
                    data-testid="uploaded-image"
                />
            }
            {fieldSettingParameters?.type === 'url' &&
                <p data-testid="url" className='font-normal text-base text-[#2B333B] max-w-[90%] break-words py-3 cursor-pointer'><a href="#" className='underline'>{fieldSettingParameters?.urlValue}</a></p>
            }
        </div>
    )
}


export default DIsplayContentField