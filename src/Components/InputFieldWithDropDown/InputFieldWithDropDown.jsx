/* eslint-disable max-len */
import React, { useRef, useState, useEffect } from 'react';
import { useOnClickOutside } from '../../CommonMethods/outsideClick';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Image from '../Image/Image';
import InformationList from '../InformationList/InformationList';
import Modal from 'react-responsive-modal';

function InputFieldWithDropDown (props) {
    const { labelName, value, placeholder, options, id, error, handleInput, testId, information, disable } = props;
    const [show, setShow] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const infoRef = useRef();
    const outsideClickRef = useRef();
    const buttonRef = useRef();
    const dropdownRef = useRef();
    useOnClickOutside(outsideClickRef, () => {
        setShow(false);
    });

    useOnClickOutside(infoRef, () => {
        setShowInfo(false);
    });
    const calculateDropdownPosition = () => {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - buttonRect.bottom - 40;
        // 40px
        const dropdownHeight = dropdownRef.current.clientHeight;

        if (spaceBelow < dropdownHeight) {
            dropdownRef.current.style.top = `-${dropdownHeight - 22}px`;
        } else {
            dropdownRef.current.style.top = '100%';
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
        <div className=" flex flex-col relative gap-2">
            <div className='flex items-center'>
                <label htmlFor={id} className='text-neutral-primary text-[14px] font-[500] leading-[16px] mr-4'>
                    {labelName}</label>
                {information &&
                    <div ref={infoRef} className='flex'>
                        <Image src="info_icon" className="w-5 h-5 cursor-pointer relative" onClick={() => setShowInfo(!showInfo)} />
                        <div className='absolute z-10 ml-5'>
                            <Modal center open={showInfo} onClose={() => setShowInfo(false)} closeIcon={<Image src='x' />} styles={{ modal: { borderRadius: 10 } }} >
                                <InformationList
                                    heading={information.heading}
                                    information={information.information}
                                />
                            </Modal>
                        </div>
                    </div>
                }
            </div>
            <div ref={outsideClickRef} className={` ${disable ? 'bg-[#D1D4D7]' : 'bg-[#F8F8F8]'} text-neutral-primary
                     leading-[22px] focus:outline-none border-b focus:border-primary-normal flex justify-center items-center
                     rounded-tl rounded-tr  ${error ? 'border-error' : 'border-[#DDDDDD]'}
                     `} style={{ borderBottomColor: show ? '#3B2A6F' : '' }}>
                <button
                    ref={buttonRef}
                    onClick={() => setShow(!show)}
                    data-testid={testId}
                    title={value}
                    disabled={disable}
                    className={`flex justify-between items-center px-[10px] py-[10px] w-full font-[400] text-[14px]
        ${value === '' ? 'text-[#8E949A]' : 'text-[#4F5962]'} 
        outline-0 overflow-hidden whitespace-nowrap`}
                    type="button" aria-expanded="false">
                    <span className=' truncate max-w-[300px] '>{value === '' ? placeholder : value}</span>
                    {show
                        ? <img loading="lazy" decoding="async" src="/images/chevron-up.svg" alt="icon" />
                        : <img loading="lazy" decoding="async" src="/images/chevron-dark-down.svg" alt="icon" />
                    }
                </button>
                <ul id="#patient-dropdownMenuButton1"
                    data-testid={`${labelName.replaceAll(' ', '_').toLowerCase()}_dropdown_list`} ref={dropdownRef}
                    className={`scrollBar
                m-0 shadow-lg z-[9999] absolute !left-0 w-full p-2 
                border border-[#E5E4E5] max-h-[210px] overflow-auto bg-[#fff]
                ${show === true ? 'show' : 'hidden'}`} aria-labelledby="patient-dropdownMenuButton1"
                >
                    {console.log('options', options)}
                    {options.map((item, index = 0) => (
                        <li data-testid={`${item?.replaceAll(' ', '_').toLowerCase()}`} onClick={(e) => {
                            e.preventDefault(); setShow(false);
                            handleInput(item, id);
                        }} key={index} className="automatic hover:bg-[#F2F4F5] rounded-lg p-2 cursor-pointer">
                            <a className="dropdown-item font-normal text-xs text-[#444652]" data-testid={`${testId}_${index}`}
                                href="/">
                                {item}
                            </a>
                        </li>
                    ))}

                </ul>
            </div>
            {(!show && value !== '' && information) && <p className='text-[#A4A9AE] font-normal text-[14px] leading-[22px]'>{information?.information?.List1[value]?.text}</p>}
            {(error && !show) && <ErrorMessage error={error} />}
        </div>
    );
}

export default InputFieldWithDropDown;
