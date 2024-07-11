import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from '../Image/Image';
function PasswordValidator ({ newPassword, setIsCriteriaMet }) {
    // eslint-disable-next-line no-useless-escape
    const specialCharacter = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    useEffect(() => {
        // Check if all conditions are met
        const conditionsMet =
            newPassword.length > 7 &&
            newPassword.length <= 12 &&
            /[A-Z]/.test(newPassword) &&
            /[a-z]/.test(newPassword) &&
            /\d/.test(newPassword) &&
            // eslint-disable-next-line no-useless-escape
            specialCharacter.test(newPassword);

        // Update state accordingly
        setIsCriteriaMet(conditionsMet);
    }, [newPassword]);
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className='m-1'
            transition={{ duration: 1 }}>
            <p className="text-neutral-secondary font-[400] text-[14px] text-left mb-[4px]">
                Password must have atleast:</p>
            <div className="flex items-center gap-2 mb-1">
                <Image src={`${(newPassword.length > 7 && newPassword.length <= 12) ? 'greenTick' : 'grayDot'}`}
                    alt='Key' className = 'w-5 h-5' />
                <p className={'font-[400] text-[14px] text-neutral-secondary'}>8-12 characters</p>
            </div>

            <div className="flex items-center gap-2 mb-1">
                <Image src={`${/[A-Z]/.test(newPassword) ? 'greenTick' : 'grayDot'}`} alt='Key' className = 'w-5 h-5 rounded'/>
                <p className={'font-[400] text-[14px] text-neutral-secondary'}>1 uppercase</p>
            </div>

            <div className="flex items-center gap-2 mb-1">
                <Image src={`${/[a-z]/g.test(newPassword) ? 'greenTick' : 'grayDot'}`} alt='Key' className = 'w-5 h-5'/>
                <p className={'font-[400] text-[14px] text-neutral-secondary'}>1 lowercase</p>
            </div>

            <div className="flex items-center gap-2 mb-1">
                <Image src={`${/\d/g.test(newPassword) ? 'greenTick' : 'grayDot'}`} alt='Key' className = 'w-5 h-5'/>
                <p className={'font-[400] text-[14px] text-neutral-secondary'}>1 number</p>
            </div>
            <div className="flex items-center gap-2 mb-1">
                <Image src={`${specialCharacter.test(newPassword) ? 'greenTick' : 'grayDot'}`}
                    alt='Key' className = 'w-5 h-5'/>
                <p className={'font-[400] text-[14px] text-neutral-secondary'}>1 special character</p>
            </div>
        </motion.div>
    );
}

export default PasswordValidator;
