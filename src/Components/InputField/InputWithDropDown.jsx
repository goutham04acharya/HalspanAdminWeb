import React from 'react';

function InputWithDropDown({
    className,
    id,
    placeholder,
    testID,
    selectedOption,
    setDropdownOpen,
    isDropdownOpen,
    options,
    handleOptionClick,
    labelStyle,
    label,
    top,
    dropdownRef,
    mandatoryField,
}) {

    return (
        <div className='cursor-pointer w-full relative' ref={dropdownRef}>
            <label htmlFor={id} className={labelStyle}>{label} {mandatoryField ? <span className='text-[#FFA318]'>*</span> : null}</label>
            <div>
                <input
                    type="text"
                    id={id}
                    placeholder={placeholder}
                    onClick={() => setDropdownOpen(isDropdownOpen ? null : id)}
                    data-testId={testID}
                    value={selectedOption ? selectedOption.label : ''}
                    className={`${className} border border-[#AEB3B7] outline-0 h-[45px] rounded px-[18px] placeholder:text-[#2B333B] placeholder:font-normal placeholder:text-base`}
                    readOnly
                />
                <img src="/Images/open-Filter.svg" alt="open-filter" className='absolute right-4' style={{ top }} />
            </div>
            {isDropdownOpen && (
                <ul className="absolute bg-white border border-[#AEB3B7] mt-1 w-full z-10">
                    {options.map(option => (
                        <li key={option.value}
                            className='py-2 px-4 cursor-pointer hover:bg-[#F4F6FA]'
                            onClick={() => handleOptionClick(option)}>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default InputWithDropDown;
