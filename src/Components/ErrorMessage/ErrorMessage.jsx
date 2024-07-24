import React from 'react'
import { motion } from 'framer-motion'

const ErrorMessage = ({ error, closeeIcon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.3 }}
      className='text-[#000000] bg-[#FFA318] font-normal text-base px-4 py-2  mt-1 w-full justify-between flex items-center'
    >
      {error}
      {closeeIcon &&
        <img src='/Images/Error-close.svg' alt='error-close' />}
    </motion.div>
  );
};

export default ErrorMessage