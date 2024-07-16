import React from 'react'
import Image from '../../Components/Image/Image.jsx'

function NavrBar() {
    return (
        <div className='p-8 flex w-full justify-between items-center'>
            <Image src="HalspanGrayLogo" className="w-auto" />
            <div className='flex items-center w-full'>
                <div className='flex items-center ml-[50px]'>
                    <Image src="Questionnaires" className="w-auto" />
                    <p className='font-semibold text-base text-[#2B333B] ml-4'>Questionnaires</p>
                </div>
                <div className='flex items-center ml-[50px]'>
                    <Image src="LookupDataset" className="w-auto" />
                    <p className='font-semibold text-base text-[#2B333B] ml-4'>Lookup Dataset</p>
                </div>
                <div className='flex items-center ml-[50px]'>
                    <Image src="Myaccount" className="w-auto" />
                    <p className='font-semibold text-base text-[#2B333B] ml-4'>My account</p>
                </div>
                <div className='flex items-center ml-[50px]'>
                    <Image src="Logout" className="w-auto" />
                    <p className='font-semibold text-base text-[#2B333B] ml-4'>Logout</p>
                </div>
            </div>
        </div>
    )
}

export default NavrBar