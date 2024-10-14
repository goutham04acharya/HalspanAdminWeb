import React, { useRef } from 'react'
import Image from '../../../Components/Image/Image.jsx';
import useOnClickOutside from '../../../CommonMethods/outSideClick.js';
import { BeatLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';


function PreviewModal({ text, subText, Button1text, Button2text, src, className, handleButton1, handleButton2, button1Style, testIDBtn1, testIDBtn2, isImportLoading, showLabel, setModalOpen }) {

    const modalRef = useRef();
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setModalOpen(false));
    };

    useOnClickOutside(modalRef, () => {
        dispatch(setModalOpen(false));
    });

    return (
        <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>
            
            <div ref={modalRef} className='h-[740px] flex justify-between flex-col border-[5px] border-black w-[367px] mx-auto bg-white rounded-[55px] relative px-4 pb-6 '>
            <p className='text-center text-4xl text-[#2B333B] font-semibold mt-7 mb-3'>Installation</p>
                <div>
                    {/* <Image src="Error-close" className="absolute top-5 right-5 cursor-pointer" data-testid="close-btn" onClick={() => handleClose()} /> */}
                    <Image src={src} className={`${className} mx-auto`} />
                    
                    <p className='font-normal text-base text-[#2B333B] mt-2 text-center break-words'>{subText}</p>
                </div>
                <div className='h-full w-full bg-slate-100 rounded-md'></div>
                <div className='mt-5 flex items-center justify-between'>
                    {!showLabel ? <button type='button' data-testid={testIDBtn1} className={`w-[131px] h-[50px] ${button1Style} text-white font-semibold text-base rounded`} onClick={() => handleButton1()}>
                        {Button1text}
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
                    <button type='button' data-testid={testIDBtn2} className={`w-[131px] h-[50px] ${button1Style} text-white font-semibold text-base rounded`} onClick={() => handleButton2()}>
                        {Button2text}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PreviewModal