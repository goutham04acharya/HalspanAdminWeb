import React, { useCallback, useEffect } from 'react'
import Debounce from '../CommonMethods/debounce';

function Search({ className, onChange, searchValue, testId, setSearchValue, searchParams, setQueList, setSearchParams, setLoading, placeholder }) {

  // Search related functions
  const handleChange = (e, value) => {
    handleSearch(e, "search", value);
  };

  const handleSearch = (e, key, value) => {
    e.preventDefault();
    let params = Object.fromEntries(searchParams);

    delete params.start_key; // Reset the start_key when initiating a new search

    const trimmedValue = value;

    if (key === 'search') {
      if (trimmedValue === '') {
        // If search contains only special characters or is empty, clear the search parameter
        delete params[key];
        delete params.start_key;
      } else {
        params[key] = trimmedValue; // Trim the value before encoding
      }
    } else {
      params[key] = value;
    }
    setQueList([]);
    setSearchParams({ ...params });
  };

  const optimizedFn = useCallback(
    Debounce((e, value) => handleChange(e, value)),
    [searchParams]
  );

  const changeHandler = (e) => {
    let value = e.target.value;
    value = value.replace(/^\s+/, ''); // Remove leading spaces
    if (!value.trim()) {
      // If the value is empty or contains only spaces, do not proceed
      setSearchValue('');
      return;
    }

    let params = Object.fromEntries(searchParams);
    delete params.start_key;
    setSearchValue(value);
    optimizedFn(e, value); // This should call handleSearch with the current value
  };
  
  const handleSearchClose = () => {
    setLoading(true);
    let params = Object.fromEntries(searchParams);
    if (params['search'] !== '') delete params.search;
    setQueList([]);
    setSearchParams({ ...params });
    setSearchValue('');
    setLoading(false);
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
          onChange={(e) => {
            e.preventDefault();
            // optimizedFn(e, e.target.value);
            changeHandler(e);
          }}
          className={`w-full outline-0 ${className} pr-10 placeholder:text-[#2B333B] placeholder:text-base placeholder:font-normal`} />
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
  )
}

export default Search