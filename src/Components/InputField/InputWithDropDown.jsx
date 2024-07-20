import React, { useState } from 'react'

function InputWithDropDown({ className, id, placeholder, testID, setSelectedOption, selectedOption, setDropdownOpen, isDropdownOpen, options, handleOptionClick, onSelect, labelStyle, label, top }) {


    return (
        <div className='w-auto cursor-pointer'>
            <label htmlFor={id} className={labelStyle}>{label}</label>
            <div className='relative'>
                <input type="text"
                    id={id}
                    placeholder={placeholder}
                    onFocus={handleFocus}
                    data-testId={testID}
                    value={selectedOption ? selectedOption.label : `${placeholder}`}
                    className={`${className} border border-[#AEB3B7] outline-0 h-[45px] rounded px-[18px] placeholder:text-[#2B333B] placeholder:font-normal placeholder:text-base`}
                />
                <img src="/Images/open-Filter.svg" alt="open-filter" className={`absolute right-4`}  style={{ top }} />
            </div>
            {isDropdownOpen && (
                <ul className="absolute bg-white border border-gray-300 mt-1 z-10">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => handleOptionClick(option)}
                            className="cursor-pointer p-2 hover:bg-gray-200"
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default InputWithDropDown