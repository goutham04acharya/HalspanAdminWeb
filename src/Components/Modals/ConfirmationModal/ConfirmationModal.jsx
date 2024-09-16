import React, { useRef } from 'react'
import Image from '../../Image/Image'
import useOnClickOutside from '../../../CommonMethods/outSideClick.js'
import { BeatLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setShowquestionDeleteModal, setModalOpen } from '../../../Pages/QuestionnaryForm/Components/QuestionnaryFormSlice.js'


function ConfirmationModal({ text, subText, Button1text, Button2text, src, className, handleButton1, handleButton2, button1Style, testIDBtn1, testIDBtn2, isImportLoading, showLabel }) {

    const modalRef = useRef();
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setModalOpen(false));
        dispatch(setShowquestionDeleteModal(false));
    };

    useOnClickOutside(modalRef, () => {
        dispatch(setModalOpen(false));
    });

    return (
        <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>
            <div ref={modalRef} className='w-[512px] h-auto mx-auto bg-white rounded-[14px] relative pt-10 px-6 pb-6 '>
                <Image src="Error-close" className="absolute top-5 right-5 cursor-pointer" data-testid="close-btn" onClick={() => handleClose()} />
                <Image src={src} className={`${className} mx-auto`} />
                <p className='text-center text-lg text-[#2B333B] font-semibold mt-5'>{text}</p>
                <p className='font-normal text-base text-[#2B333B] mt-2 text-center break-words'>{subText}</p>
                <div className='mt-5 flex items-center justify-between'>
                   {!showLabel ? <button type='button' data-testid={testIDBtn1} className={`w-[200px] h-[50px] ${button1Style} text-white font-semibold text-base rounded`} onClick={() => handleButton1()}>
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
                    <button type='button' data-testid={testIDBtn2} className='w-[200px] h-[50px] border border-[#2B333B] rounded text-[#2B333B] hover:bg-[#EFF1F8] text-base font-semibold' onClick={() => handleButton2()}>
                        {Button2text}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal