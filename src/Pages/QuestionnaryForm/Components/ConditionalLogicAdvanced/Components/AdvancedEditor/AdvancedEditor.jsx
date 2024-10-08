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
    secDetailsForSearching,
    sections,
    setShowMethodSuggestions
}) {
    const allSectionDetails = useSelector((state) => state?.allsectiondetails?.allSectionDetails);

    // State to track the user's input
    const [searchInput, setSearchInput] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    // Handle user input change and filter suggestions
    const handleSearchChange = (event) => {
        const value = event.target.value;
        const cursorPosition = event.target.selectionStart; // Get the cursor position
        setSearchInput(value);

        // Find the word around the cursor
        const leftPart = value.slice(0, cursorPosition);
        const rightPart = value.slice(cursorPosition);

        // Find the index of the last space before the cursor and the next space after the cursor
        const startOfWord = leftPart.lastIndexOf(' ') + 1;
        const endOfWord = rightPart.indexOf(' ') === -1 ? rightPart.length : rightPart.indexOf(' ');

        const wordToSearch = value.slice(startOfWord, cursorPosition + endOfWord);

        if (wordToSearch.trim() !== '') { // Only filter if the word is not empty
            const filteredData = secDetailsForSearching.filter((item) =>
                item.includes(wordToSearch)
            );
            setFilteredSuggestions(filteredData.length > 0 ? filteredData : []); // Update suggestions or set to empty array
        } else {
            // If input is cleared or no word to search, show all suggestions
            setFilteredSuggestions(secDetailsForSearching);
        }
    };


    const handleAddQuestion = (suggestion, sections) => {
        let allSections = sections
        const getVariableType = a => a.constructor.name.toLowerCase();
        let valueType = getVariableType(eval(`allSections.${suggestion}`))
        handleClickToInsert(suggestion, false, valueType);

        // After selecting a suggestion, show suggestions list again and hide error
        setShowMethodSuggestions(false);
        setFilteredSuggestions(secDetailsForSearching);
    }

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
                    onChange={(event) => { handleInputField(event, sections); handleSearchChange(event); }}
                    onMouseDown={(event) => { handleInputField(event); handleSearchChange(event); }}
                    ref={textareaRef}
                    value={inputValue}
                ></textarea>
                <span
                    className="absolute left-[2%] top-[6%] cursor-pointer">
                    =
                </span>
            </div>

            {/* Error message if no matching results */}
            {error ? (
                <div className="text-red-500 mt-2 w-[90%] break-words">{error}</div>
            ) : (
                // Show matching results if available
                showSectionList && Object.keys(sections).length > 0 && (
                    <div className="h-[260px] w-full border border-[#AEB3B7] p-2.5 overflow-y-auto scrollbar_gray">
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
                        ) : filteredSuggestions.length > 0 ? (
                            filteredSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="cursor-pointer"
                                    onClick={() => handleAddQuestion(suggestion, sections)}
                                >
                                    {suggestion}
                                </div>
                            ))
                        ) : (
                            searchInput.trim() !== '' && (
                                <div className="text-red-500 mt-2">No items found</div>
                            )
                        )}
                    </div>
                )
            )}
        </div>
    );
}

export default AdvancedEditor;