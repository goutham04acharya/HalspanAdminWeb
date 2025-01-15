/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from '../Image/Image';

const Toast = ({ message, type, setToastmessage, bottom}) => {
    const [showToast, setShowToast] = useState(true);

    /* This `useEffect` hook is setting a timer using `setTimeout` function to hide the toast message
    after 5 seconds (5000 milliseconds) and also resetting the `toastMessage` state to an empty
    string. The `clearTimeout` function is used to clear the timer when the component unmounts. The
    empty dependency array `[]` ensures that this effect runs only once when the component mounts. */
    useEffect(() => {
        let delay
        if(message?.length > 100){
            delay = 5000
        }
        const timer = setTimeout(() => {
            setShowToast(false);
            setToastmessage('');
        }, delay || 3000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    let initial;
    let animate;
    if (bottom) {
        initial = { opacity: 0 };
        animate = { opacity: 1 };
    } else {
        initial = { x: 1000 };
        animate = { x: 0 };
    }

    return (
        <>
            {showToast && (
                <motion.div
                    initial={initial}
                    animate={animate}
                    transition={{ duration: 1 }}
                    exit={{ opacity: 0.5 }}
                    onClick={() => { setShowToast(!showToast); setToastmessage(''); }}
                    style={{ zIndex: '999999' }}
                    className={`cursor-pointer w-[400px] rounded-[4px] px-5 py-[15px] flex justify-between items-center absolute z-50 gap-4 ${bottom ? 'bottom-[6vh] right-2/4 translate-x-1/2' : 'top-7 right-5'}
                        ${type === 'success'
                    ? 'bg-[#7D7C7C]'
                    : type === 'warning'
                        ? 'bg-[#FFA318]'
                        : type === 'error' ? 'bg-[#FFA318]' : 'bg-accent-information'}`} >
                    <p className={`font-[400] text-[14px] leading-[24px] break-words w-[90%] ${type === 'error' ? 'text-[#000]' : 'text-[#fff]'}`} id="toast-message">{message || 'Something went wrong'}</p>
                    <span className='w-[10%]'>
                        {<Image src={`toast-${type}`} />}
                    </span>
                </motion.div>
            )}
        </>
    );
};

export default Toast;


