import React, { useRef, useState } from 'react'
import Image from '../Image/Image.jsx';
import useOnClickOutside from '../../CommonMethods/outSideClick.js';
import { BeatLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import Button from '../Button/button.jsx';

function VersionEditModal({ text, subText, setVersion, loading, setLoading,  version, setSelectedVersion, handleDropdownClick, handleOptionClick, selectedVersion, dropdownsOpen, setDropdownsOpen, Button1text, isOpen, versionListEdit, Button2text, src, className, setModalOpen, handleButton1, handleButton2, button1Style, versionNumber, versionList, testIDBtn1, edit, duplicate, setDuplicate, setEdit, testIDBtn2, isImportLoading, showLabel }) {

    const modalRef = useRef();

    const handleClose = () => {
        setModalOpen(false);
        setDropdownsOpen(false)
        setVersion(false)
        setSelectedVersion('')
        setDuplicate(false)
        setEdit(false)
        setLoading(false)
    };

    useOnClickOutside(modalRef, () => {
        setModalOpen(false);
        setDropdownsOpen(false);
        setVersion(false)
        setSelectedVersion('')
        setDuplicate(false)
        setEdit(false)
    });

    return (
        <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>
            <div ref={modalRef} className='w-[512px] h-auto mx-auto bg-white rounded-[14px] relative pt-10 px-6 pb-6 '>
                <Image src="Error-close" className="absolute top-5 right-5 cursor-pointer" testId="modal-close" onClick={() => handleClose()} />
                {version && <Image src="testing-error" className={`${className} mx-auto mb-4`} />}
                <p className={`${!version ? '' : 'text-center mt-5'} text-lg text-[#2B333B] font-semibold `}>{text}</p>
                <p className={`font-normal text-base text-[#2B333B] mt-2 ${!version ? '' : 'text-center w-[348px] mx-auto mt-[17px] mb-[28px]'} break-words`}>{subText}</p>
                {!version && <>
                    <div className='flex w-full h-[36px] relative'>
                        <input
                            type="text"
                            // id={versionListInfo?.version_number}
                            data-testid="Version"
                            placeholder={'Select'}
                            onClick={handleDropdownClick}
                            value={selectedVersion ? `Version ${selectedVersion}` : ''}
                            className={`border w-full border-[#AEB3B7] outline-0 rounded px-[18px] placeholder:font-normal placeholder:text-base`}
                            readOnly
                        />
                        <img
                            src="/Images/open-status.svg"
                            alt="open-filter"
                            onClick={handleDropdownClick}
                            className={`absolute mt-3 right-5 transition-transform duration-300 text-[#2B333B] ${dropdownsOpen ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </div>
                    {dropdownsOpen && (
                        <ul className="relative bg-white border border-[#AEB3B7] mt-1 w-full z-[100000]">
                            {versionList?.data?.items?.map(versionNumber => (
                                <li key={versionNumber}
                                    data-testid={`Version-${versionNumber?.version_number}`}
                                    className='py-2 px-4 cursor-pointer hover:bg-[#F4F6FA]'
                                    onClick={() => handleOptionClick(versionNumber?.version_number)}>
                                    Version {versionNumber?.version_number}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
                }
                {!version && <div className='mt-5 flex items-center justify-between'>
                    {!showLabel ? <button type='button' data-testid={testIDBtn1} className={`w-[200px] h-[50px] ${button1Style} text-white font-semibold text-base rounded`} onClick={() => handleButton1()}>
                        {!loading ? Button1text : <BeatLoader color="#fff" size={'10px'} /> }
                    </button> :
                        <>
                            <input
                                data-testid="import-file"
                                type="file"
                                accept=".csv"
                                onChange={handleButton1}
                                disabled={isImportLoading}
                                id="file-upload"
                                style={{ display: 'none' }} // Hide the actual input field
                            />
                            <label
                                htmlFor="file-upload"
                                className={`w-[200px] h-[50px] ${button1Style} text-white font-semibold text-base rounded ${isImportLoading ? 'cursor-not-allowed' : 'cursor-pointer'} flex justify-center items-center`}>
                                {isImportLoading ? (
                                    <BeatLoader color="#fff" size='10px' />
                                ) : (
                                    <>
                                        {Button1text}
                                    </>
                                )}
                            </label>
                        </>}
                    <button type='button' data-testid={testIDBtn2} className='w-[200px] h-[50px] border border-[#2B333B] rounded text-[#2B333B] hover:bg-[#EFF1F8] text-base font-semibold' onClick={() => handleButton2()}>
                    {!loading ? Button2text : <BeatLoader color="#fff" size={'10px'} /> }
                    </button>
                </div>}
            </div>
        </div>
    )
}

export default VersionEditModal