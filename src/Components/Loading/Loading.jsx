import React from 'react';
import image from '../../components/loader.json';
import Image from '../Image/Image';
import LoadingDot from '../LottieLoader/LoadingDot';

const Loading = () => {
    return (
        <div className='flex flex-col justify-center items-center h-screen '>
            <div className='relative'>
                <Image
                    src= 'loaderTopImage'
                    className={'w-[124px] h-[124px] mb-[1px]'}
                />
                <LoadingDot
                    animation={image}
                    width="152px"
                    className='absolute top-6 -left-7'
                />
            </div>
        </div>

    );
};

export default Loading;
