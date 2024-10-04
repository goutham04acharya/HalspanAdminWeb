import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function AdvancedEditor({
    handleListSectionDetails,
    showSectionList,
    inputValue,
    error,
    showMethodSuggestions,
    suggestions,
    handleClickToInsert,
    textareaRef,
    handleInputField,
    secDetailsForSearching
}) {
    const allSectionDetails = useSelector((state) => state?.allsectiondetails?.allSectionDetails);

    // State to track the user's input
    const [searchInput, setSearchInput] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    // Handle user input change and filter suggestions
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchInput(value);

        if (value.trim() !== '') { // Only filter if something is typed
            const filteredData = secDetailsForSearching.filter((item) =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuggestions(filteredData.length > 0 ? filteredData : []); // Update suggestions or set to empty array
        } else {
            // If input is cleared, show all suggestions
            setFilteredSuggestions(secDetailsForSearching);
        }
    };

    // Populate all items initially
    useEffect(() => {
        setFilteredSuggestions(secDetailsForSearching);
    }, [secDetailsForSearching]); // This will run whenever secDetailsForSearching changes

    return (
        <div className='mr-[18px] mt-[8%]'>
            <div className='relative'>
                <label htmlFor="editor"></label>
                <textarea
                    name="editor"
                    id="editor"
                    className='resize-none border border-[#AEB3B7] h-[230px] w-full py-[14px] pr-[14px] pl-[4%] rounded outline-0 text-2xl'
                    onChange={(event) => { handleInputField(event); handleSearchChange(event); }}
                    onMouseDown={(event) => { handleInputField(event); handleSearchChange(event); }}
                    ref={textareaRef}
                    value={inputValue}
                ></textarea>
                <span
                    className="absolute left-[2%] top-[6%] cursor-pointer"
                    onClick={() => handleListSectionDetails()}
                >
                    =
                </span>
            </div>

            {/* Error message if no matching results */}
            {error && <div className='text-red-500 mt-2'>{error}</div>}

            {/* Show matching results if available */}
            {showSectionList && (
                <div className='h-[260px] w-[50%] border border-[#AEB3B7] p-2.5 overflow-y-auto scrollbar_gray'>
                    {/* Conditionally show method suggestions or the normal question list */}
                    {showMethodSuggestions ? (
                        <div className="suggestions-box">
                            {suggestions.map((method, index) => (
                                <div
                                    key={index}
                                    className="suggestion-item cursor-pointer"
                                    onClick={() => handleClickToInsert(method, true)} // Pass true for method
                                >
                                    {method}
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Show filtered suggestions or "No items found" if none match
                        filteredSuggestions.length > 0 ? (
                            filteredSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="cursor-pointer"
                                    onClick={() => handleClickToInsert(suggestion)}
                                >
                                    {suggestion}
                                </div>
                            ))
                        ) : (
                            searchInput.trim() !== '' && <div className='text-red-500 mt-2'>No items found</div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default AdvancedEditor;
