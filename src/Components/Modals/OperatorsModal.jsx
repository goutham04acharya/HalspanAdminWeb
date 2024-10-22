import React, { useRef } from 'react'
import Image from '../../Components/Image/Image.jsx'
import useOnClickOutside from '../../CommonMethods/outSideClick.js'
import { useDispatch } from 'react-redux';


function OperatorsModal({ setIsOperatorModal, isStringMethodModal, setIsStringMethodModal }) {

    const modalRef = useRef();
    const dispatch = useDispatch();

    const handleClose = () => {
        setIsOperatorModal(false);
        setIsStringMethodModal(false);
    };

    useOnClickOutside(modalRef, () => {
        setIsOperatorModal(false);
        setIsStringMethodModal(false);
    });

    return (
        <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>
            <div ref={modalRef} className='w-[512px] h-auto mx-auto bg-white rounded-[14px] relative p-6 '>
                <Image src="Error-close"
                    className={`absolute ${isStringMethodModal ? 'top-[15%]' : 'top-[9%]'} right-5 cursor-pointer`}
                    data-testid="close-btn"
                    onClick={() => handleClose()} />
                <p className='text-center text-lg text-[#2B333B] font-semibold'>
                    {isStringMethodModal ? 'String Manipulation' : 'Comparison and Logical Operators'}
                </p>
                {isStringMethodModal ?
                    <div className='mt-5 flex flex-col items-center justify-center px-2.5 pb-2.5 w-full'>
                        <p className='font-normal text-base text-[#2B333B]'>toUpperCase()</p>
                        <p className='font-normal text-base text-[#2B333B]'>toLowerCase()</p>
                        <p className='font-normal text-base text-[#2B333B]'>trim()</p>
                    </div>
                    :
                    <div className='mt-5 flex items-start justify-between px-2.5 pb-2.5 w-full'>
                        <div className='w-[80%]'>
                            <p className='font-normal text-base text-[#2B333B]'>==</p>
                            <p className='font-normal text-base text-[#2B333B]'>!=</p>
                            <p className='font-normal text-base text-[#2B333B]'>&gt;(Number, DateTime) </p>
                            <p className='font-normal text-base text-[#2B333B]'>&lt;(Number, DateTime)</p>
                            <p className='font-normal text-base text-[#2B333B]'>&gt;=(Number, DateTime)</p>
                            <p className='font-normal text-base text-[#2B333B]'>&lt;=(Number, DateTime)</p>
                            <p className='font-normal text-base text-[#2B333B]'>Includes() (String)</p>
                            <p className='font-normal text-base text-[#2B333B]'>StartsWith() (String)</p>
                            <p className='font-normal text-base text-[#2B333B]'>EndsWith() (String)</p>
                        </div>
                        <div className='w-[20%]'>
                            <p className='font-normal text-base text-[#2B333B]'>AND</p>
                            <p className='font-normal text-base text-[#2B333B]'>OR</p>
                            <p className='font-normal text-base text-[#2B333B]'>!</p>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default OperatorsModal