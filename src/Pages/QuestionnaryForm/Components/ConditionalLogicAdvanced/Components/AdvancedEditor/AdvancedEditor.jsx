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
    setSelectedType,
    combinedArray,
    setSelectedQuestion,
    isChoiceboxField,
    choiceboxValues
}) {
    const [searchInput, setSearchInput] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [choiceValues, setChoiceValues] = useState([]);
    const [showChoiceValues, setShowChoiceValues] = useState(false);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        const cursorPosition = event.target.selectionStart;
        setSearchInput(value);

        const leftPart = value.slice(0, cursorPosition);
        const rightPart = value.slice(cursorPosition);

        const startOfWord = leftPart.lastIndexOf(' ') + 1;
        const endOfWord = rightPart.indexOf(' ') === -1 ? rightPart.length : rightPart.indexOf(' ');

        const wordToSearch = value.slice(startOfWord, cursorPosition + endOfWord).trim();
        const specialCharacters = ['(', '{', '!', '[', ']', '}', ')'];

        if (specialCharacters.some(char => wordToSearch.startsWith(char))) {
            setFilteredSuggestions(secDetailsForSearching);
        } else if (wordToSearch !== '') {
            const filteredData = secDetailsForSearching.filter((item) =>
                item.includes(wordToSearch)
            );
            setFilteredSuggestions(filteredData.length > 0 ? filteredData : []);
        } else {
            setFilteredSuggestions(secDetailsForSearching);
        }
    };

    const handleAddQuestion = (suggestion, sections, e) => {
        const keys = suggestion.split('.');
        const propertyValue = keys.reduce((obj, key) => obj?.[key], sections);
        const getVariableType = (a) => a?.constructor?.name?.toLowerCase();
        const valueType = getVariableType(propertyValue);
        setSelectedQuestion(suggestion)
        const matchedQuestion = combinedArray.find(
            (item) =>
                item.question_detail === suggestion &&
                item.question_type === "choiceboxfield"
        );
        if(matchedQuestion.question_type === 'choiceboxfield'){
            
        }
        setSelectedType(valueType);
        handleClickToInsert(suggestion, false, valueType);

        setShowMethodSuggestions(false);
        setFilteredSuggestions(secDetailsForSearching);
    };

    const handleChoiceValueClick = (value) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const cursorPosition = textarea.selectionStart;
            const textBefore = textarea.value.substring(0, cursorPosition);
            const textAfter = textarea.value.substring(cursorPosition);

            const newText = textBefore + `"${value}"` + textAfter;
            textarea.value = newText;

            handleInputField({ target: { value: newText } });
            setShowChoiceValues(false);
        }
    };

    const handleKeyDown = (event) => {
        const { selectionStart } = textareaRef.current;
        const value = inputValue;

        if (event.key === "Backspace" && selectionStart > 0) {
            const regex = /\b[^.\s]+_[^.\s]+\.[^.\s]+_[^.\s]+\.[^.\s]+_[^.\s]+\b/g;
            const matches = [...value.matchAll(regex)];

            for (let match of matches) {
                const start = match.index;
                const end = match.index + match[0].length;

                if (selectionStart === end) {
                    event.preventDefault();

                    const newValue = value.slice(0, start) + value.slice(end);
                    handleInputField({ target: { value: newValue } });
                    return;
                }
            }
        }
    };

    useEffect(() => {
        setFilteredSuggestions(secDetailsForSearching);
    }, [secDetailsForSearching]);

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
                    onKeyDown={handleKeyDown}
                    ref={textareaRef}
                    value={inputValue}
                >
                </textarea>
                <span className="absolute left-[2%] top-[6.9%] cursor-pointer">=</span>
            </div>
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
                                
                                {showMethodSuggestions ? (
                                    <div className="suggestions-box">
                                        {suggestions.map((method, index) => (
                                            <div
                                                key={index}
                                                data-testid={`condition-${index}`}
                                                className="suggestion-item cursor-pointer"
                                                onClick={() => handleClickToInsert(method, true)}
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
                                            onClick={(e) => handleAddQuestion(suggestion, sections, e)}
                                        >
                                            {suggestion}
                                        </div>
                                    ))
                                ) : (isChoiceboxField === true) ? (
                                    choiceboxValues.map((values, index) => (
                                        <div
                                            key={index}
                                            data-testid={`choicevalues-${index}`}
                                            className="cursor-pointer"
                                            onClick={(e) => handleClickToInsert(values.value, false)}
                                        >
                                            {values.value}
                                        </div>
                                    ))
                                ) : (searchInput.trim() !== '' && filteredSuggestions.length === 0) ? (
                                    <div className="text-[#000000] bg-[#FFA318] font-normal text-base px-4 py-2  mt-1 w-full justify-start flex items-center break-words">
                                        <span className='mr-4'><img src="/Images/alert-icon.svg" alt="" /></span>
                                        No items found
                                    </div>
                                ) : (
                                    (filteredSuggestions.length === 0 && searchInput.trim() === '') && <div>
                                        No questions available for the current questionnaire
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                )
            )}
            {showChoiceValues && (
                <div className="choice-values-dropdown">
                    {choiceValues.map((choice) => (
                        <div
                            key={choice.uuid}
                            onClick={() => handleChoiceValueClick(choice.value)}
                            className="choice-value-item"
                        >
                            {choice.value}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// export default AdvancedEditor;

export default AdvancedEditor;