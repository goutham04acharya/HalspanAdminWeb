import React from 'react'

function TextBoxField({
    label,
    testId,
    type,
    textId,
    HelpText,
    value,
    className,

}) {
    return (
        <div>
            <label htmlFor={textId} className='font-medium text-base text-black'>{label}</label>
            <input 
            data-testid ={testId}
            type={type} 
            id={textId} 
            value={value}
            className={`w-full border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] ${className}`}
            placeholder='Enter'
            />
            <p className='mt-2 font-normal text-sm text-[#2B333B]'>{HelpText}</p>
        </div>
    )
}

export default TextBoxField