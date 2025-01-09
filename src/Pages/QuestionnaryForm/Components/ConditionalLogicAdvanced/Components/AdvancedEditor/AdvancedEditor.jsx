import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import { setNewComponent } from '../../../Fields/fieldSettingParamsSlice';
import { useDispatch } from 'react-redux';

function AdvancedEditor({
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
    setShowMethodSuggestions,
    isThreedotLoaderBlack,
    smallLoader,
    setSelectedType

}) {
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


        const wordToSearch = value.slice(startOfWord, cursorPosition + endOfWord).trim();
        // Check for specific characters and prevent showing the error
        const specialCharacters = ['(', '{', '!', '[', ']', '}', ')'];

        if (specialCharacters.some(char => wordToSearch.startsWith(char))) {
            setFilteredSuggestions(secDetailsForSearching); // Show all suggestions
        } else if (wordToSearch !== '') { // Only filter if the word is not empty
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

        // Split the suggestion string into keys for nested access
        const keys = suggestion.split('.'); // Example: "Section_1.Page_1.Question_1?" -> ["Section_1", "Page_1", "Question_1?"]

        // Use reduce to dynamically access the nested property
        const propertyValue = keys.reduce((obj, key) => obj?.[key], sections);

        // Get the type of the value
        const getVariableType = (a) => a?.constructor?.name?.toLowerCase(); // Handle cases where a is undefined
        const valueType = getVariableType(propertyValue);

        // Set the selected type and perform further actions
        setSelectedType(valueType);
        handleClickToInsert(suggestion, false, valueType);

        // After selecting a suggestion, show suggestions list again and hide error
        setShowMethodSuggestions(false);
        setFilteredSuggestions(secDetailsForSearching);
    };



    const regex = /\b[^.\s]+_[^.\s]+\.[^.\s]+_[^.\s]+\.[^.\s]+_[^.\s]+\b/g;

    const handleKeyDown = (event) => {
        const { selectionStart } = textareaRef.current;
        const value = inputValue;

        // Check if the backspace key is pressed
        if (event.key === "Backspace" && selectionStart > 0) {
            // Find all regex matches in the input value
            const matches = [...value.matchAll(regex)];

            // Check if the cursor is at the end of any match
            for (let match of matches) {
                const start = match.index;
                const end = match.index + match[0].length;

                // If the cursor is at the end of the match, delete the entire match
                if (selectionStart === end) {
                    event.preventDefault(); // Prevent default backspace behavior

                    // Remove the matched string
                    const newValue =
                        value.slice(0, start) + value.slice(end);
                    handleInputField({ target: { value: newValue } }); // Update the value
                    return;
                }
            }
        }
    };


    // Populate all items initially
    useEffect(() => {
        setFilteredSuggestions(secDetailsForSearching);
    }, [secDetailsForSearching]); // This will run whenever secDetailsForSearching changes

    return (
        <div className='mr-[18px] mt-[4%]'>
            <div className='relative h-[230px]'>
                <label htmlFor="editor"></label>
                <textarea
                    name="editor"
                    id="editor"
                    data-testid="conditional-logic-text"
                    className='resize-none border border-[#AEB3B7] h-[230px] scrollBar w-full py-[14px] pr-[14px] pl-[4%] rounded outline-0 text-xl'
                    onChange={(event) => {
                        handleInputField(event, sections); handleSearchChange(event);
                    }}
                    onKeyDown={handleKeyDown} // Intercept key presses
                    ref={textareaRef}
                    value={inputValue}
                // value={isDefaultLogic ? fieldSettingParams[selectedQuestionId]?.default_conditional_logic : fieldSettingParams[selectedQuestionId]?.conditional_logic}
                ></textarea>
                <span className="absolute left-[2%] top-[6.9%] cursor-pointer">=</span>
            </div>

            {/* Error message if no matching results */}
            {error ? (
                <div className="text-[#000000] bg-[#FFA318] font-normal text-base px-4 py-2  mt-1 w-full justify-start flex items-center break-all">
                    <span data-testid="error-message" className='w-[4%] mr-2'><img src="/Images/alert-icon.svg" alt="" className='min-w-6' /></span>
                    {error}</div>
            ) : (
                isThreedotLoaderBlack ? (
                    <BeatLoader color="#000" size={smallLoader ? '7px' : '10px'} />
                ) : (
                    showSectionList && Object.keys(sections).length > 0 && (
                        <div className='pl-2.5 py-2.5 pr-1.5 h-[260px] w-[60%] overflow-y-auto scrollbar_gray border-l border-b border-r border-[#AEB3B7]'>
                            <div className="pr-1">
                                {/* Conditionally show method suggestions or the normal question list */}
                                {showMethodSuggestions ? (
                                    <div className="suggestions-box">
                                        {suggestions.map((method, index) => (
                                            <div
                                                key={index}
                                                data-testid={`condition-${index}`}
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
                                            data-testid={`suggestion-${index}`}
                                            className="cursor-pointer"
                                            onClick={() => handleAddQuestion(suggestion, sections)}
                                        >
                                            {suggestion}
                                        </div>
                                    ))
                                ) : (
                                    searchInput.trim() !== '' && (
                                        <div className="text-[#000000] bg-[#FFA318] font-normal text-base px-4 py-2  mt-1 w-full justify-start flex items-center break-words">
                                            <span className='mr-4'><img src="/Images/alert-icon.svg" alt="" /></span>
                                            No items found
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )
                )
            )}
        </div>
    );
}

export default AdvancedEditor;