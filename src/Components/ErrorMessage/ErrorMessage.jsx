import React from 'react'

const ErrorMessage = ({ error }) => {
  return (
    <motion.div
    initial={{ opacity: 0, y: 0 }}
    animate={{ opacity: 1, y:0 }}
    exit={{ opacity:0, y:0 }}
    transition={{ duration: 0.3 }}
    className='text-[#FFA318] font-normal text-base px-4 py-2 w-full justify-between flex items-center'
    >
    { error }
    <img src='/images/error-close.svg' alt='error-close'/>
    </motion.div>
  );
};

export default ErrorMessage