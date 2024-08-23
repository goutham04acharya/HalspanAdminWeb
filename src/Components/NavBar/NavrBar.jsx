import React from 'react'
import Image from '../../Components/Image/Image.jsx'
import { Navigate, useNavigate } from 'react-router-dom';

function NavrBar({setModalOpen}) {
    const navigate = useNavigate();

    const handleLogoutModal= () =>{
        setModalOpen(true);
    }
    return (
        <div className='p-7 flex w-full justify-between items-center bg-white'>
            <Image src="HalspanGrayLogo" className="w-auto" />
            <div className='flex items-center gap-[50px]'>
                <div 
                onClick={()=> navigate('/questionnaries')}
                className='flex items-center cursor-pointer h-[35px]'>
                    <Image src="questionnaries" className="w-auto" />
                    <p className='font-semibold text-base text-[#2B333B] ml-4'>
                        Questionnaries
                    </p>
                </div>
                <div 
                data-testid="lookup-dataset"
                onClick={()=> navigate('/lookup-dataset')}
                className='flex items-center cursor-pointer h-[35px]'>
                    <Image src="LookupDataset" className="w-auto" />
                    <p className='font-semibold text-base text-[#2B333B] ml-4'>
                        Lookup Dataset
                    </p>
                </div>
                <div className='flex items-center cursor-pointer h-[35px]'>
                    <Image src="Myaccount" className="w-auto" />
                    <p className='font-semibold text-base text-[#2B333B] ml-4'>My Account</p>
                </div>
                <div className='flex items-center cursor-pointer h-[35px]' onClick={()=>handleLogoutModal()} >
                    <Image src="Logout" className="w-auto" />
                    <p className='font-semibold text-base text-[#2B333B] ml-4'>Logout</p>
                </div>
            </div>
        </div>
    )
}

export default NavrBar