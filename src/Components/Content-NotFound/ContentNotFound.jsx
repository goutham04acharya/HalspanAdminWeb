import React from 'react'

function ContentNotFound({text, className}) {
  return (
    <div className='h-customh1 flex flex-col items-center justify-center'>
        <img src="/Images/Content-NotFound.svg" alt="NotFound" className='mx-auto h-auto w-auto' />
        <p className={`font-medium text-2xl -mt-8 text-[#2B333B] text-cenetr ${className}`}>{text}</p>
    </div>
  )
}

export default ContentNotFound