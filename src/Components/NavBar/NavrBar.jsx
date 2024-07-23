import React from 'react'
import Image from '../../Components/Image/Image.jsx'

function NavrBar({setModalOpen}) {
    const handleLogoutModal= () =>{
        setModalOpen(true);
    }

    return (
        <div className='p-7 flex w-full justify-between items-center bg-white'>
            <Image src="HalspanGrayLogo" className="w-auto" />
            <div className='flex items-center'>
                <div className='flex items-center ml-[50px] cursor-pointer'>
                    <Image src="Questionnaires" className="w-auto" />
                    <p className='font-semibold text-base text-[#2B333B] ml-4'>Questionnaires</p>
                </div>
                <div className='flex items-center ml-[50px] cursor-pointer'>
                    <Image src="LookupDataset" className="w-auto" />
                    <p className='font-semibold text-base text-[#2B333B] ml-4'>Lookup Dataset</p>
                </div>
                <div className='flex items-center ml-[50px] cursor-pointer'>
                    <Image src="Myaccount" className="w-auto" />
                    <p className='font-semibold text-base text-[#2B333B] ml-4'>My account</p>
                </div>
                <div className='flex items-center ml-[50px] cursor-pointer' onClick={()=>handleLogoutModal()} >
                    <Image src="Logout" className="w-auto" />
                    <p className='font-semibold text-base text-[#2B333B] ml-4'>Logout</p>
                </div>
            </div>
        </div>
    )
}

export default NavrBar