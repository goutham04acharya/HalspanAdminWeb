import React, { useRef, useState, useEffect } from 'react';
import Image from '../Image/Image';
import { useOnClickOutside } from '../../CommonMethods/outsideClick';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export default function InputSearch ({ testId, id, handleInput, handleSearchItem, label, value, submitSelected, className }) {
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState(value);
    const [timer, setTimer] = useState(null);
    const [show, setShow] = useState(false);

    const outsideClickRef = useRef();
    const buttonRef = useRef();
    const dropdownRef = useRef();

    useOnClickOutside(outsideClickRef, () => {
        setShow(false);
    });
    const handleSearch = async (e) => {
        const newValue = e.target.value;
        setSearch(newValue);
        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            const value = await handleSearchItem(id, newValue);
            setOptions(value);
            if (value.length > 0 && newValue !== '') {
                setShow(true);
            } else {
                setShow(false);
            }
        }, 500);
        setTimer(newTimer);
        handleInput('', id);
    };
    const calculateDropdownPosition = () => {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - buttonRect.bottom - 40;
        // 40px
        const dropdownHeight = dropdownRef.current.clientHeight;

        if (spaceBelow < dropdownHeight) {
            dropdownRef.current.style.top = `-${dropdownHeight - 22}px`;
        } else {
            dropdownRef.current.style.top = '105%';
        }
    };
    useEffect(() => {
        window.addEventListener('resize', calculateDropdownPosition);
        calculateDropdownPosition(); // Initial position calculation
        return () => {
            window.removeEventListener('resize', calculateDropdownPosition);
        };
    }, [show]);
    return (
        <div className='ml-2 pr-2'>
            <label htmlFor={id} className='text-neutral-primary text-[14px] font-[500] leading-[16px]'>{label}</label>

            <div ref={outsideClickRef} className={`google-key relative mt-1 ${(submitSelected && value?.trim() === '')
                ? 'google-key-error'
                : 'google-key-border'}`}>
                <input
                    type="text"
                    ref={buttonRef}
                    value={search}
                    placeholder="Search"
                    onChange={handleSearch}
                    className={'w-full'}
                    data-testid={testId}
                    title={search}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Image src={'search_icon'} className="h-6 w-6 text-gray-400" />
                </div>
                <ul id="#patient-dropdownMenuButton1" ref={dropdownRef}
                    className={`bg-[#FFFFFF] 
                m-0 shadow-lg z-[9999] absolute !left-0 w-full p-2 
                border border-[#E5E4E5]
                ${show === true ? 'show' : 'hidden'}`} aria-labelledby="patient-dropdownMenuButton1"
                >
                    <li>
                        <ul className='max-h-[200px] overflow-auto scrollBar bg-[#fff]'>
                            {options.map((item, index = 0) => (
                                <li onClick={(e) => {
                                    e.preventDefault(); setShow(false);
                                    setSearch(item);
                                    handleInput(item, id);
                                }} key={index} className="automatic hover:bg-[#F2F4F5] rounded-lg p-2 cursor-pointer">
                                    <a
                                        data-testid={`${testId}_${index}`}
                                        className="dropdown-item font-normal text-xs text-[#444652]"
                                        href="/">
                                        {item}
                                    </a>
                                </li>
                            ))}

                        </ul>
                    </li>

                </ul>
            </div>
            {(submitSelected && value?.trim() === '') && <div className='mt-2'><ErrorMessage error={'Required field'} /></div>}
        </div>

    );
}
