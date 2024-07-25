/* eslint-disable max-len */
import React, { useState } from 'react';

export default function PageNavigation({ handlePrevPage, handleNextPage, prevPageExist, nextPage, currentPage, loading }) {
    const [isHoveredPrev, setIsHoveredPrev] = useState(false);
    const [isHoveredNext, setIsHoveredNext] = useState(false);

    return (
        <div className='flex justify-between items-center px-10 fixed bottom-[40px] left-0 
        w-full py-3'>
            <div>
                <button type='button' disabled={loading || (!prevPageExist && currentPage == 1)}
                    data-testid="previous"
                    className='flex items-center border border-[#2B333B] h-10 justify-center hover:text-[#2B333B] rounded
                text-[#2B333B] text-[12px] font-bold px-3 disabled:text-[#BFBECF] w-[143px]'
                    onClick={() => handlePrevPage()}
                >
                    <div className='pr-3 h-full flex items-center'>
                        <img
                            src={isHoveredPrev  && nextPage ? '/Images/arrow-left.svg' :
                                (prevPageExist ? '/Images/arrow-left.svg' : '/Images/arrow-left.svg')}
                            alt='icon'
                        />
                    </div>
                    Previous
                </button>
            </div>
            <div>
                <button type='button' disabled={loading || !nextPage}
                    data-testid="next"
                    className='flex items-center border border-[#2B333B] h-10 justify-center hover:text-[#2B333B] rounded
                text-[#2B333B] text-[12px] font-bold px-3 disabled:text-[#BFBECF] w-[143px]'
                    onClick={() => handleNextPage()}
                >
                    Next
                    <div className='pl-3 h-full flex items-center'>
                        <img
                            src={isHoveredNext && nextPage ? '/Images/arrow-right.svg' :
                                (nextPage ? '/Images/arrow-right.svg' : '/Images/arrow-right.svg')}
                            alt='icon'
                        />
                    </div>
                </button>
            </div>
        </div>
    );
}
