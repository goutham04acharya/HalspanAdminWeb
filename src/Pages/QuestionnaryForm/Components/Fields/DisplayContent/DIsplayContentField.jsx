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
            <label
                data-testid="label-name"
                htmlFor={textId}
                title={fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all  break-words block w-full max-w-[85%] ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {fieldSettingParameters?.label}
            </label>
            {fieldSettingParameters?.type === 'heading' &&
                <p className='font-normal text-xl text-[#2B333B] max-w-[90%] break-words py-3'>{fieldSettingParameters?.heading}</p>
            }
            {fieldSettingParameters?.type === 'text' &&
                <p className='font-normal text-xl text-[#2B333B] max-w-[90%] break-words py-3'>{fieldSettingParameters?.text}</p>
            }
            {fieldSettingParameters?.type === 'image' &&
                <p className='font-normal text-xl text-[#2B333B] max-w-[90%] break-words py-3'>{fieldSettingParameters?.image}</p>
            }
            {fieldSettingParameters?.type === 'url' &&
                <p className='font-normal text-xl text-[#2B333B] max-w-[90%] break-words py-3'>{fieldSettingParameters?.url}</p>
            }
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={fieldSettingParameters?.helptext}
            >
                {fieldSettingParameters?.helptext}</p>
        </div>
    )
}


export default DIsplayContentField