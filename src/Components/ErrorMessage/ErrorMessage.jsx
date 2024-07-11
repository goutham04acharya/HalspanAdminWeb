import React from 'react';
import { motion } from 'framer-motion';

const ErrorMessage = ({ error }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className='text-error font-[400] text-[12px] leading-[20px]'
        >
            {error}
        </motion.div>
    );
};

export default ErrorMessage;
