import React from 'react'

function Search({className, onChange, handleSearchClose}) {
    return (
        <div className='w-full border border-[#AEB3B7] rounded px-5 py-3'>
            <div className='flex items-center relative'>
                <img src="/Images/search.svg" alt="search" className='w-auto h-auto mr-2' />
                <input type="text" 
                placeholder='Search by Name and Description' 
                onChange={onChange}
                className={`w-full outline-0 ${className} pr-10 placeholder:text-[#2B333B] placeholder:text-base placeholder:font-normal`} />
                <img src="/Images/gray-close.svg" alt="gray-close" className='absolute right-2 top-0 cursor-pointer' onClick={handleSearchClose}/>
            </div>
        </div>
    )
}

export default Search