import React from 'react';
import { setNewComponent } from '../../Pages/QuestionnaryForm/Components/Fields/fieldSettingParamsSlice';
import { useDispatch } from 'react-redux';

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
    labeltestID,
    validationError,
    close,
    setSelectedUrlOption,
    selectedQuestionId,
    formStatus,
    textFieldLookup,
    assetType,
    language,
    services
}) {
    const dispatch = useDispatch();

    const handleRemove = () => {
        setSelectedUrlOption('');
        dispatch(setNewComponent({ id: 'urlType', value: '', questionId: selectedQuestionId }));
        dispatch(setNewComponent({ id: 'urlValue', value: '', questionId: selectedQuestionId }));
        setDropdownOpen(false);
    }

    return (
        <div className='cursor-pointer w-full relative' ref={dropdownRef}>
            <label htmlFor={id} className={labelStyle}>{label} {mandatoryField ? <span className='text-[#FFA318]'>*</span> : null}</label>
            <div>
                <input
                    type="text"
                    id={id}
                    placeholder={placeholder}
                    onClick={() => {
                        setDropdownOpen ? setDropdownOpen(isDropdownOpen ? null : id) : null}} // Add condition here
                    data-testid={testID}
                    value={selectedOption ? selectedOption.label : ''}
                    className={`${className} ${validationError ? 'border border-[#FFA318]' : 'border border-[#AEB3B7]'} outline-0 rounded px-[18px] placeholder:font-normal placeholder:text-base`}
                    readOnly
                    disabled={formStatus !== 'Draft' && !language && !assetType && !services}
                />
                {(selectedOption && close) ?
                    <img src="/Images/gray-close.svg" alt="close" className={`absolute right-4 transition-transform duration-300 top-[22px]`} onClick={()=> handleRemove()} />
                    :
                    <img src="/Images/open-Filter.svg" alt="open-filter" className={`absolute right-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                        style={{ top }} />
                }
            </div>
            {isDropdownOpen && (
                <ul className="absolute bg-white border border-[#AEB3B7] mt-1 w-full z-10">
                    {options.map((option, index) => (
                        <li key={option.value}
                            data-testid={`${labeltestID}-${index}`}                            
                            className='py-2 px-4 cursor-pointer hover:bg-[#F4F6FA]'
                            onClick={() => {handleOptionClick(option)
                                setDropdownOpen(false)}    // Close dropdown after selection
                            }>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default InputWithDropDown;
