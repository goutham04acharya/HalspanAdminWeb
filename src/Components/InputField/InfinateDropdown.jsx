import React from 'react';

function InfinateDropdown({
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
    labeltestID,
    validationError,
    close,
    setSelectedOption,
    lastElementRef,
    handleRemoveLookup
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
                    data-testid={testID}
                    value={selectedOption ? selectedOption.label : ''}
                    className={`${className} ${validationError ? 'border border-[#FFA318]' : 'border border-[#AEB3B7]'} outline-0 rounded px-[18px] placeholder:font-normal placeholder:text-base`}
                    readOnly
                />
                {(selectedOption && close) ?
                    <img src="/Images/gray-close.svg" alt="close" className={`absolute right-4 transition-transform duration-300 top-[11px]`} onClick={() => handleRemoveLookup()} />
                    :
                    <img src="/Images/open-Filter.svg" alt="open-filter" className={`absolute right-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                        style={{ top }} />
                }
            </div>
            {isDropdownOpen && (
                <ul className="absolute bg-white border border-[#AEB3B7] mt-1 w-full z-10 max-h-[300px] overflow-auto scrollBar">
                    {options.map(option => (
                        <li key={option.value}
                            data-testid={labeltestID}
                            className='py-2 px-4 cursor-pointer hover:bg-[#F4F6FA]'
                            onClick={() => handleOptionClick(option)}>
                            {option.label}
                        </li>
                    ))}
                    <li ref={lastElementRef} className='h-1'></li>
                </ul>
            )}
        </div>
    );
}

export default InfinateDropdown;
