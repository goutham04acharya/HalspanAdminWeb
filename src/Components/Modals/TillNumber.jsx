/* eslint-disable max-len */
import React from 'react';
import Modal from 'react-responsive-modal';

function TillNumber ({ isModalOpen, setModalOpen, user }) {
    const handleClose = () => {
        setModalOpen(false);
    };
    return (
        <div className='merchant'>
            <Modal center open={isModalOpen} onClose={handleClose}
                closeIcon={<div style={{ color: 'white' }} disabled></div>}
            >
                <img src="/images/gray-close.svg"
                    alt="close-icon" onClick={handleClose} className='absolute top-4 right-2.5 cursor-pointer'/>
                <div className='customModal p-2.5'>
                    <div className='p-[30px] flex flex-wrap overflow-auto scrollBar h-[298px] w-[383px] bg-white'>
                        {user?.till_numbers?.map((item) => (
                            <p key={item} className='w-1/3 py-3 font-normal text-sm text-[#4F5962]'>{item}</p>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default TillNumber;
