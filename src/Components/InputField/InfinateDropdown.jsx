import React, { useState, useEffect } from 'react';

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
    handleRemoveLookup,
    preview,
    choiceBox,
    assets,
    type, // 'multi_choice', 'single_choice', or other
    handleMultiSelectChange, // for multi-choice
    formStatus,
    textFieldLookup,
    assetLocation,
    failGrade,
    mainDivStyle,
    readonly
}) {

    const [searchTerm, setSearchTerm] = useState(''); // Initialize searchTerm
    const [filteredOptions, setFilteredOptions] = useState(options || []); // Initialize filteredOptions
    // Update filteredOptions whenever options or searchTerm changes
    useEffect(() => {
        if (options) {
            setFilteredOptions(
                options.filter(option =>
                    (preview ? option.value : option.label)
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [options, searchTerm, preview]);

    return (
        <div className={`cursor-pointer w-full relative mt-3 ${mainDivStyle}`} ref={dropdownRef}>
            <label htmlFor={id} className={labelStyle}>
                {label} {mandatoryField ? <span className='text-[#FFA318]'>*</span> : null}
            </label>
            <div>
                <input
                    type="text"
                    id={id}
                    placeholder={placeholder}
                    onClick={() => setDropdownOpen(isDropdownOpen ? null : id)}
                    data-testid={testID}
                    disabled={!preview ? (formStatus !== 'Draft' && !choiceBox && !preview && !textFieldLookup && !assetLocation) : readonly}
                    value={preview ? selectedOption : (selectedOption ? selectedOption.label : '')}
                    className={`${className} ${validationError ? 'border border-[#FFA318]' : 'border border-[#AEB3B7]'} outline-0 rounded px-[18px] placeholder:font-normal placeholder:text-base`}
                    readOnly
                />
                {(selectedOption && close) ?
                    <img src="/Images/gray-close.svg" alt="close" className={`absolute right-4 transition-transform duration-300 top-[11px]`} onClick={() => handleRemoveLookup()} />
                    :
                    <img src="/Images/open-Filter.svg" alt="open-filter" className={`absolute right-4 ${assets ? 'bottom-5' : ''} transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                        style={{ top }} />
                }
            </div>
            {isDropdownOpen && (
                <div className="absolute bg-white border border-[#AEB3B7] mt-1 w-full z-10">
                    {/* Search bar - Fixed at top */}
                    <div className="p-2 bg-white">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 border rounded outline-0"
                            data-testid='search-lookup-data'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* Scrollable options container */}
                    <div className="max-h-[250px] overflow-auto scrollBar">
                        <ul>
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, index) => (
                                    <li
                                        key={preview ? option.id : option.value}
                                        data-testid={`${labeltestID}-${index}`}
                                        className="py-2 px-4 cursor-pointer hover:bg-[#F4F6FA]"
                                    >
                                        {type === 'multi_choice' ? (
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOption?.some(sel => sel.value === option.value)}
                                                    onChange={() => handleMultiSelectChange(option)}
                                                />
                                                <span>{preview ? option.value : option.label}</span>
                                            </label>
                                        ) : type === 'single_choice' ? (
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name={id}
                                                    value={option.value}
                                                    checked={selectedOption?.value === option.value}
                                                    onChange={() => handleOptionClick(option)}
                                                />
                                                <span>{preview ? option.value : option.label}</span>
                                            </label>
                                        ) : (
                                            <div onClick={() => handleOptionClick(option)}>
                                                {preview ? option.value : option.label}
                                            </div>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <p className="p-5">No search results found</p>
                            )}
                            <li ref={lastElementRef} className="h-1"></li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InfinateDropdown;
