import React, { useState, useCallback } from "react"
import Debounce from "../CommonMethods/debounce"

function Search({
  className,
  testId,
  setQueList,
  searchParams,
  setSearchParams,
  setLoading,
  placeholder,
  setLookupList,
}) {
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("")

  const debouncedSetSearch = useCallback(
    Debounce((value) => {
      setDebouncedSearchValue(value)
    }, 300),
    [],
  )

  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value
      setSearchValue(newValue)

      const trimmedValue = newValue.trimStart()
      if (trimmedValue !== debouncedSearchValue) {
        debouncedSetSearch(trimmedValue)
      }
    },
    [debouncedSearchValue, debouncedSetSearch],
  )

  React.useEffect(() => {
    const params = Object.fromEntries(searchParams)

    if (!debouncedSearchValue) {
      delete params.search
      setQueList([])
    } else {
      params.search = encodeURIComponent(debouncedSearchValue)
    }
    delete params.start_key
    setSearchParams(params)
  }, [debouncedSearchValue, searchParams, setQueList, setSearchParams])

  const handleSearchClose = () => {
    setSearchValue("")
    setDebouncedSearchValue("")
    const params = Object.fromEntries(searchParams)
    delete params.search
    delete params.start_key
    setSearchParams(params)
    setQueList([])
  }

  return (
    <div className="w-full border border-[#AEB3B7] rounded px-5 py-3">
      <div className="flex items-center relative">
        <img src="/Images/search.svg" alt="search" className="w-auto h-auto mr-2" />
        <input
          data-testid={testId}
          type="text"
          value={searchValue}
          placeholder={placeholder}
          onChange={handleChange}
          className={`w-full outline-0 ${className} pr-10 placeholder:text-[#2B333B] placeholder:text-base placeholder:font-normal`}
        />
        {searchValue && (
          <img
            src="/Images/gray-close.svg"
            alt="gray-close"
            className="absolute right-2 top-0 cursor-pointer"
            onClick={handleSearchClose}
          />
        )}
      </div>
    </div>
  )
}

export default Search

