import React from 'react'
import Modal from 'react-responsive-modal'
import Image from '../Image/Image'
import { BeatLoader } from 'react-spinners'

const ConfirmModal = ({ text, subText, Button1text, Button2text, src, className, isModalOpen, handleButton1, handleButton2, button1Style, button2Style, testIDBtn1, testIDBtn2, handleClose, isLoading }) => {
  return (
    <Modal center open={isModalOpen} onClose={handleClose} closeIcon={<div style={{ color: 'white' }} disabled></div>}>
      <div className='confirmModal w-[476px] mx-auto bg-white rounded-[14px] relative'>
        <Image src="close" className="absolute -top-[22px] right-0 cursor-pointer" onClick={() => handleClose()} testId="close"/>
        <Image src={src} className={`${className} mx-auto`} />
        <p className='text-center text-lg text-[#2B333B] font-semibold mt-5'>{text}</p>
        <p className='font-normal text-base text-[#2B333B] mt-2 text-center'>{subText}</p>
        <div className='mt-6 px-6 flex items-center justify-between'>
          <button type='button' data-testid={testIDBtn1} className={`w-[200px] h-[50px] ${button1Style} text-white font-semibold text-base rounded`} onClick={() => handleButton1()}>
            {!isLoading ? Button1text : <BeatLoader color="#fff" size='10px' />}
          </button>
          <button type='button' data-testid={testIDBtn2} className={`w-[200px] h-[50px] ${button2Style} border border-[#2B333B] rounded text-[#2B333B] text-base font-semibol`} onClick={() => handleButton2()}>
            {Button2text}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal