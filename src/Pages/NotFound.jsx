import React from 'react';
import Image from '../components/Image/Image';
import { useNavigate } from 'react-router-dom';

function NotFound ({ link }) {
    const navigate = useNavigate();
    return (

        <div className='flex flex-col h-screen w-screen justify-center items-center gap-10'>
            <Image src='404' />
            <div className='flex flex-col justify-center items-center gap-1 font-[400]'>
                <h1 className='text-[#000103] text-[20px] leading-[28px]'>Page Not Found</h1>
                <p className='text-neutral-secondary text-[14px]
                    leading-[24px]'>We can’t find the page you’re looking for </p>
                <button
                    onClick={() => { link !== undefined || link ? navigate(`${link}`) : navigate(-1); }}
                    className=' text-[14px] font-[400] py-[8px] w-[200px] h-[40px] mt-[30px]
                    rounded-[6px]  bg-primary-normal text-[#ffffff]'>
                    Go Back
                </button>
            </div>

        </div>

    );
}

export default NotFound;
