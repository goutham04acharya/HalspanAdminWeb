import React, { useRef } from 'react'
import Image from '../../Image/Image'
import useOnClickOutside from '../../../CommonMethods/outSideClick.js'

function ConfirmationModal({ text, subText, Button1text, Button2text, src, className, setModalOpen, handleButton1, handleButton2, button1Style, testIDBtn1, testIDBtn2 }) {
    
  const modalRef = useRef();
  const handleClose = () => {
    setModalOpen(false);
  };

  useOnClickOutside(modalRef, () => {
    setModalOpen(false);
  });

    return (
        <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>
            <div ref={modalRef} className='w-[512px] h-auto mx-auto bg-white rounded-[14px] relative pt-10 px-6 pb-6 '>
                <Image src="Error-close" className="absolute top-5 right-5 cursor-pointer" data-testid="close-btn" onClick={() => handleClose()} />
                <Image src={src} className={`${className} mx-auto`} />
                <p className='text-center text-lg text-[#2B333B] font-semibold mt-5'>{text}</p>
                <p className='font-normal text-base text-[#2B333B] mt-2 text-center'>{subText}</p>
                <div className='mt-5 flex items-center justify-between'>
                    <button type='button' data-testid={testIDBtn1} className={`w-[200px] h-[50px] ${button1Style} text-white font-semibold text-base rounded`} onClick={() => handleButton1()}>
                        {Button1text}
                    </button>
                    <button type='button' data-testid={testIDBtn2} className='w-[200px] h-[50px] border border-[#2B333B] rounded text-[#2B333B] text-base font-semibold' onClick={() => handleButton2()}>
                        {Button2text}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal