import React from 'react'
import Debounce from '../CommonMethods/debounce';

function Search({ className, searchValue, testId, setSearchValue, searchParams, setQueList, setSearchParams, setLoading, placeholder }) {
  const handleChange = Debounce((e) => {
    const value = e.target.value.trim();
    let params = Object.fromEntries(searchParams);
    
    // Keep the old list until new data arrives
    if (!value) {
      delete params.search;
    } else {
      params.search = encodeURIComponent(value);
    }
    delete params.start_key;
    setSearchParams(params);
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    handleChange(e);
  };
  
  const handleSearchClose = () => {
    let params = Object.fromEntries(searchParams);
    delete params.search;
    delete params.start_key;
    setSearchValue('');
    setSearchParams(params);
  };

  return (
    <div className='w-full border border-[#AEB3B7] rounded px-5 py-3'>
      <div className='flex items-center relative'>
        <img src="/Images/search.svg" alt="search" className='w-auto h-auto mr-2' />
        <input
          data-testid={testId}
          type="text"
          value={searchValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          className={`w-full outline-0 ${className} pr-10 placeholder:text-[#2B333B] placeholder:text-base placeholder:font-normal`}
        />
        {searchValue && (
          <img
            src="/Images/gray-close.svg"
            alt="gray-close"
            className='absolute right-2 top-0 cursor-pointer'
            onClick={handleSearchClose}
          />
        )}
      </div>
    </div>
  );
}

export default Search;