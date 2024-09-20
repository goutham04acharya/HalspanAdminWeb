import React from 'react'

function DateTimeField({
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
            <div className='relative'>
                <input
                    data-testid='input'
                    type={type}
                    id={textId}
                    value={value}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg mt-5 bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
                    placeholder={fieldSettingParameters?.placeholderContent ||
                        (fieldSettingParameters?.type === 'date'
                            ? 'dd-mm-yyyy'
                            : fieldSettingParameters?.type === 'time'
                                ? 'hh:mm:ss'
                                : 'dd-mm-yyyy hh:mm:ss')}
                    onClick={() => handleChange(fieldSettingParameters)}
                />
                {fieldSettingParameters?.type === 'date' &&
                    <img src="/Images/calendar.svg" alt="calender" className='absolute top-8 right-3 cursor-pointer' />}
                {fieldSettingParameters?.type === 'time' &&
                    <img src="/Images/clock.svg" alt="clock" className='absolute top-8 right-3 cursor-pointer' />}
                {fieldSettingParameters?.type === 'datetime' &&
                    <img src="/Images/calendar-clock.svg" alt="calender-clock" className='absolute top-8 right-3 cursor-pointer' />}
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

export default DateTimeField