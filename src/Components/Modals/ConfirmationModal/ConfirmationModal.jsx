import React, { useEffect, useRef } from 'react'
import Image from '../../Image/Image'
import useOnClickOutside from '../../../CommonMethods/outSideClick.js'
import { BeatLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';


function ConfirmationModal({ text, setReplaceCancel, subText, Button1text, Button2text, src, className, handleButton1, handleButton2, button1Style, testIDBtn1, testIDBtn2, isImportLoading, showLabel, setModalOpen, loading, publishedStatus , sectionWarningShown, setSectionWarningShown }) {

    const modalRef = useRef();
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setModalOpen(false));
        setSectionWarningShown(false);
    };

    // useOnClickOutside(modalRef, () => {
    //     dispatch(setModalOpen(false));
    // });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='bg-[#3931313b] pointer-events-auto w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>
            <div ref={modalRef} className='w-[512px] h-auto mx-auto bg-white rounded-[14px] relative pt-10 px-6 pb-6 '>
                <Image src="Error-close" className="absolute top-5 right-5 cursor-pointer" data-testid="close-btn" onClick={() => handleClose()} />
                <Image src={src} className={`${className} mx-auto`} />
                <p className='text-center text-lg text-[#2B333B] font-semibold mt-5'>{text}</p>
                <p className='font-normal text-base text-[#2B333B] mt-2 text-center break-words'>{subText}</p>
                {!sectionWarningShown &&
                <div className='mt-5 flex items-center justify-between'>
                    {!showLabel ? <button type='button' data-testid={testIDBtn1} className={`w-[200px] h-[50px] ${button1Style} text-white font-semibold text-base rounded`} onClick={() => handleButton1()}>
                        {!loading ? Button1text : <BeatLoader color="#fff" size={'10px'} />}
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
                    <button type='button' data-testid={testIDBtn2} className='w-[200px] h-[50px] border border-[#2B333B] rounded text-[#2B333B] hover:bg-[#EFF1F8] text-base font-semibold' onClick={() => {
                        handleButton2()
                        setReplaceCancel(true)
                    }}>
                        {Button2text}
                    </button>
                </div>}
            </div>
        </div>
    )
}

export default ConfirmationModal