import React, { useRef, useState } from 'react';
import Image from '../Image/Image';
import { useOnClickOutside } from '../../CommonMethods/outsideClick';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import InputTypeCheckbox from './InputTypeCheckbox';
import Button from '../Button/Button';
import Button2 from '../Button2/Button2';

export default function InputSearchMultiselect (
    { testId, id, handleInput, handleSearchItem, label, value, submitSelected, className, allOptions }) {
    const [options, setOptions] = useState(allOptions);
    const [search, setSearch] = useState('');
    const [timer, setTimer] = useState(null);
    const [show, setShow] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value === undefined ? [] : value);

    const outsideClickRef = useRef();

    useOnClickOutside(outsideClickRef, () => {
        setShow(false);
    });
    const handleSearch = async (e) => {
        const newValue = e.target.value;
        setSearch(newValue);
        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            const value = await handleSearchItem(id, newValue);
            if (value.length > 0 && newValue !== '') {
                setOptions(value);
            } else {
                setOptions(allOptions);
            }
        }, 500);
        setTimer(newTimer);
    };

    const handleCheckBox = (value) => {
        let checkBoxArray = selectedValue === undefined ? [] : selectedValue;
        if (value.target.checked) {
            // If checkbox is checked, add the value to checkedItems array
            checkBoxArray = [...checkBoxArray, value.target.value];
        } else {
            // If checkbox is unchecked, remove the value from checkedItems array
            checkBoxArray = checkBoxArray.filter(item => item !== value.target.value);
        }
        setSelectedValue(checkBoxArray);
    };
    return (
        <div className='ml-2 pr-2'>
            <label htmlFor={id} className='text-neutral-primary text-[14px] font-[500] leading-[16px]'>{label}</label>

            <div ref={outsideClickRef} className={`google-key relative ${(submitSelected && selectedValue?.length === 0)
                ? 'google-key-error'
                : 'google-key-border'}`}>
                <input
                    type="text"
                    value={search}
                    onClick={() => setShow(true)}
                    placeholder={(value !== undefined && value?.length !== 0) ? `${value.length} selected` : 'Search'}
                    onChange={handleSearch}
                    className={className}
                    data-testid={testId}
                    title={search}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Image src={'search_icon'} className="h-6 w-6 text-gray-400" />
                </div>
                <ul id="#patient-dropdownMenuButton1"
                    className={`bg-[#FFFFFF] 
                m-0 shadow-lg z-[9999] absolute !left-0 w-full p-2 
                border border-[#E5E4E5]
                ${show === true ? 'show' : 'hidden'}`} aria-labelledby="patient-dropdownMenuButton1"
                >
                    <li>
                        <ul className='max-h-[250px] overflow-auto scrollBar bg-[#fff]'>
                            {options.map((item, index = 0) => (
                                <li key={index} className="automatic hover:bg-[#F2F4F5] rounded-lg p-1 cursor-pointer">
                                    <InputTypeCheckbox
                                        key={index}
                                        id={item}
                                        testId={`${testId}_${index}`}
                                        checkboxText={item}
                                        handleOnChange={handleCheckBox}
                                        Checked={selectedValue !== undefined ? selectedValue.includes(item) : false}
                                    />
                                </li>
                            ))}
                        </ul>
                    </li>
                    <div className='flex gap-2'>
                        <Button2
                            text={'Clear All'}
                            onClick={() => {
                                setSearch('');
                                setShow(false);
                                setSelectedValue([]);
                                handleInput([], id);
                            }}
                            testId={`clear_all_${testId}`}
                            // disabled={loading}
                            className={'border-none text-primary-normal py-2 px-[35px] h-10'}
                        />
                        <Button
                            text={'Apply'}
                            testId={`apply_${testId}`}
                            className = 'max-w-[150px] h-10 ml-4 px-[51px]'
                            onClick={() => {
                                setSearch('');
                                setShow(false);
                                handleInput(selectedValue, id);
                            }}
                            // isLoading={loading}
                            // disabled={loading}
                        />
                    </div>

                </ul>
            </div>
            {(submitSelected && selectedValue?.length === 0) &&
            <div className=''><ErrorMessage error={'Required field'} /></div>}
        </div>

    );
}
