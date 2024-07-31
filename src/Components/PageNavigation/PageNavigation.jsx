
import React, { useState } from 'react';
import { BeatLoader } from 'react-spinners';


export default function PageNavigation({ handlePrevPage, handleNextPage, prevPageExist, nextPage, currentPage, loading, smallLoader, setPrevLoader, prevLoader, nextLoader }) {

  return (
    <div className='flex justify-between items-center px-10 fixed bottom-[40px] left-0 w-full py-3'>
      <div>
        <button type='button' disabled={loading || (!prevPageExist && currentPage === 1)}
          data-testid="previous"
          className={`flex items-center border border-[#2B333B] h-10 justify-center rounded text-[#2B333B] text-[12px] font-bold px-3 disabled:text-[#9FACB9] disabled:border-[#9FACB9] w-[143px]`}
          onClick={handlePrevPage}
        >
          {prevLoader ?
            <BeatLoader color="#000" size={smallLoader ? '7px' : '10px'} />
            :
            <div className='flex items-center'>
              <div className='pr-3 h-full flex items-center'>
                <img
                  src={(prevPageExist ? '/Images/arrow-left.svg' : '/Images/disable-arrow-left.svg')}
                  alt='icon'
                />
              </div>
              Previous
            </div>
          }
        </button>
      </div>
      <div>
        <button type='button' disabled={loading || !nextPage}
          data-testid="next"
          className='flex items-center border border-[#2B333B] h-10 justify-center rounded text-[#2B333B] text-[12px] font-bold px-3 disabled:text-[#9FACB9] disabled:border-[#9FACB9] w-[143px]'
          onClick={handleNextPage}
        >
          {nextLoader ? (
            <BeatLoader color="#000" size={smallLoader ? '7px' : '10px'} />
          ) : (
            <div className='flex items-center'>
              Next
              <div className='pl-3 h-full flex items-center'>
                <img
                  src={nextPage ? '/Images/arrow-right.svg' : '/Images/disable-arrow-right.svg'}
                  alt='icon'
                />
              </div>
            </div>
          )}
        </button>

      </div >
    </div >
  );
}

