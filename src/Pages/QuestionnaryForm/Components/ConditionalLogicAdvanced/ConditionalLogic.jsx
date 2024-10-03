import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { setModalOpen } from '../QuestionnaryFormSlice';
import useOnClickOutside from '../../../../CommonMethods/outSideClick';
import Button2 from '../../../../Components/Button2/ButtonLight';
import Button from '../../../../Components/Button/button';
import StaticDetails from './Components/StaticDetails/StaticDetails'
import AdvancedEditor from './Components/AdvancedEditor/AdvancedEditor';
import { useSelector } from 'react-redux';
import { setAllSectionDetails } from '../../../QuestionnaryForm/Components/ConditionalLogicAdvanced/Components/SectionDetailsSlice'
import useApi from '../../../../services/CustomHook/useApi';
import { useParams } from 'react-router-dom';


function ConditionalLogic({ setConditionalLogic }) {
    const modalRef = useRef();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('text'); // default is 'preField'
    const allSectionDetails = useSelector(state => state?.allsectiondetails?.allSectionDetails);
    const [showSectionList, setShowSectionList] = useState(false)
    const { getAPI } = useApi();
    const { questionnaire_id, version_number } = useParams();
    const [inputValue, setInputValue] = useState(''); // Track input value
    const [error, setError] = useState(''); // State to manage error message
    const [showMethodSuggestions, setShowMethodSuggestions] = useState(false); // State to track whether to show methods
    const [suggestions, setSuggestions] = useState([]); // For method suggestions
    const [selectedFieldType, setSelectedFieldType] = useState(); // Track the selected field type
    const textareaRef = useRef(null); // To reference the textarea
    const [sections, setSections] = useState({})
    const [searchResults, setSearchResults] = useState('')

    // Define string and date methods
    const stringMethods = ["toUpperCase()", "toLowerCase()", "trim()", "concat()", "endsWith()", "includes()", "startsWith()", "trimEnd()", "trimStart()"];
    const dateMethods = ["AddDays()", "SubtractDays()", "getFullYear()", "getMonth()", "getDate()", "getDay()", "getHours()", "getMinutes()", "getSeconds()", "getMilliseconds()", "getTime()", "Date()"];

    //this is my listing of types based on the component type
    const getFieldType = (componentType) => {
        let fieldType;

        switch (componentType) {
            case 'textboxfield':  // Handle both cases if they map to 'string'
                fieldType = '';
                break;
            case 'datefield':
                fieldType = new Date();
                break;
        }

        return fieldType;
    };

    // Handlers to switch tabs
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleClose = () => {
        dispatch(setConditionalLogic(false));
    };

    useOnClickOutside(modalRef, () => {
        dispatch(setModalOpen(false));
    });

    const handleListSectionDetails = async () => {
        setShowSectionList(true)
        const response = await getAPI(`questionnaires/${questionnaire_id}/${version_number}?suggestion=true`);
        dispatch(setAllSectionDetails(response.data));
        handleQuestionnaryObject(response.data);
    }
    useEffect(() => {
        handleListSectionDetails();
    }, [])

    const searchInArray = (searchTerm, dataArray) => {
        const cleanString = (str) => str.replace(/[_\.]/g, '').toLowerCase();
        // Helper function to search recursively
        const searchRecursively = (obj, term) => {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (searchRecursively(obj[key])) return true;
                } else if (
                    typeof obj[key] === 'string' &&
                    cleanString(obj[key]).includes(cleanString(term))
                ) {
                    return true;
                }
            }
            return false;
        };

        const cleanedSearchTerm = cleanString(searchTerm);

        // Perform the search
        const results = dataArray.filter(item => searchRecursively(item, cleanedSearchTerm));

        // Return empty array if no results found
        return results.length > 0 ? results : [];
    };

    //this is my function to store the cbasic sticture of my entire questionnary object
    function handleQuestionnaryObject(allSectionDetails) {
        let result = {};
        if (allSectionDetails?.data?.sections && allSectionDetails?.data?.sections.length > 0) {
            allSectionDetails?.data?.sections.forEach((section) => {
                let sectionObject = {
                    [(section.section_name).replaceAll(' ', '_')]: {}
                };
                if (section.pages && section.pages.length > 0) {
                    section.pages.forEach((page) => {
                        if (page.questions && page.questions.length > 0) {
                            page.questions.forEach((question) => {
                                const fieldType = getFieldType(question.component_type);
                                sectionObject[(section.section_name).replaceAll(' ', '_')][(page.page_name).replaceAll(' ', '_')] = {
                                    ...sectionObject[(section.section_name).replaceAll(' ', '_')][(page.page_name).replaceAll(' ', '_')],
                                    [(question.question_name).replaceAll(' ', '_')]: fieldType
                                }

                            });
                        }
                    });
                }
                result = {
                    ...result,
                    ...sectionObject
                }
                setSections(result);
            });
        }
    }


    // Handle input change and check for matches
    const handleInputField = (event) => {
        const value = event.target.value;
        setInputValue(value); // Update input value

        const lastChar = value.slice(-1);
        // If the last character is a dot, check the field type and show method suggestions

        if (lastChar === '.') {
            if (selectedFieldType === 'textboxfield') {
                setSuggestions(stringMethods);
                setShowMethodSuggestions(true);
            } else if (selectedFieldType === 'datefield') {
                setSuggestions(dateMethods);
                setShowMethodSuggestions(true);
            } else {
                setSuggestions([]);
                setShowMethodSuggestions(false);
            }
        } else {
            setSuggestions([]);
            setShowMethodSuggestions(false); // Reset method suggestions
        }

        // Automatically insert closing parentheses or brackets when typed
        if (lastChar === '(') {
            insertAtCaret(event.target, ')');
        } else if (lastChar === '[') {
            insertAtCaret(event.target, ']');
        } else if (lastChar === '{') {
            insertAtCaret(event.target, '}');
        }
        const searchResults = searchInArray(value, allSectionDetails?.data?.sections);
        setSearchResults(searchResults); // Assume you have a state to store search results

    };

    const insertAtCaret = (element, closingChar) => {
        const start = element.selectionStart;
        const end = element.selectionEnd;
        const textBefore = element.value.substring(0, start);
        const textAfter = element.value.substring(end);
        const newText = textBefore + closingChar + textAfter;

        element.value = newText;

        setTimeout(() => {
            element.selectionStart = element.selectionEnd = start;
        }, 0);
    };

    // Combined function to insert either a question or a method
    const handleClickToInsert = (textToInsert, isMethod, componentType) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            // Insert the text at the current caret position
            const textBefore = textarea.value.substring(0, start);
            const textAfter = textarea.value.substring(end);
            const newText = textBefore + textToInsert + textAfter;

            // Update the textarea value
            textarea.value = newText;
            setInputValue(newText);  // Update the inputValue state

        }

        if (isMethod) {
            setShowMethodSuggestions(false); // Hide method suggestions if a method was inserted


        } else {
            setSelectedFieldType(componentType)
        }
    };


    // Your handleSave function
    const handleSave = () => {
        setShowSectionList(false);
        try {

            // Assuming inputValue is the expression typed by the user
            let evalInputValue = inputValue
                .replaceAll('AddDays', 'setDate') // Replace AddDays with addDays function
                .replaceAll('SubtractDays(', 'setDate(-') // Replace SubtractDays with subtractDays function
                .replaceAll(' AND ', ' && ') // Replace AND with &&
                .replaceAll(' OR ', ' || '); // Replace OR with ||

            // Evaluate the modified string
            const result = eval(evalInputValue);

            if (typeof result === 'boolean') {
                console.log('Valid expression, result is a boolean:', result);
                setError(result);
                // No error message if the result is boolean
                // } else if(result === NaN){
                //     setError('please pass the parameter insdie the function');
            } else {
                console.log('Result is not a boolean:', result);
                setError(result);
            }
        } catch (error) {
            // Handle and log any evaluation errors
            console.error('Error evaluating the expression:', error.message);
            setError(error.message);

        }
    };

    return (
        <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>
            <div ref={modalRef} className='w-[80%] h-[80%] mx-auto bg-white rounded-[14px] relative p-[18px] flex'>
                <div className='w-[60%]'>
                    <p className='text-start text-lg text-[#2B333B] font-semibold'>shows when...</p>
                    <AdvancedEditor
                        handleListSectionDetails={handleListSectionDetails}
                        showSectionList={showSectionList}
                        inputValue={inputValue}
                        error={error}
                        showMethodSuggestions={showMethodSuggestions}
                        suggestions={suggestions}
                        handleClickToInsert={handleClickToInsert}
                        textareaRef={textareaRef}
                        handleInputField={handleInputField}

                    />
                </div>
                <div className='w-[40%]'>
                    <StaticDetails
                        handleTabClick={handleTabClick}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}

                    />
                    <div className='mt-5 flex items-center justify-between'>
                        <Button2
                            text='Cancel'
                            type='button'
                            data-testid='button1'
                            className='w-[162px] h-[50px] text-black font-semibold text-base'
                            onClick={() => handleClose()}
                        >
                        </Button2>
                        <Button
                            text='Save'
                            onClick={handleSave}
                            type='button'
                            data-testid='cancel'
                            className='w-[139px] h-[50px] border text-white border-[#2B333B] bg-[#2B333B] hover:bg-black text-base font-semibold ml-[59px]'
                        >
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConditionalLogic;
