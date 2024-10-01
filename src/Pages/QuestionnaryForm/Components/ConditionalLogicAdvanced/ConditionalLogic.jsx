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

    // Define string and date methods
    const stringMethods = ["toUpperCase()", "toLowerCase()", "trim()"];
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
    }
    useEffect(() => {
        handleListSectionDetails();
    }, [])

    //this is my function to store the cbasic sticture of my entire questionnary object
    function handleQuestionnaryObject() {
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
        console.log(result, 'ananahana')
        return result;
    }

    useEffect(() => {
        handleQuestionnaryObject();
    }, []);

    // Handle input change and check for matches
    const handleInputField = (event) => {
        const value = event.target.value;
        setInputValue(value); // Update input value
        console.log(inputValue, 'm')

        // If there's no match and input is not empty, show error
        if (!checkForSameQueName(value) && value.trim() !== '') {
            setError('No matching variables found.');
        } else {
            setError(''); // Clear error if matches found
        }

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
    const handleClickToInsert = (textToInsert, isMethod, componentType ) => {
        console.log(componentType, 'componentType')
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

            // Move the caret position after the inserted text
            // setTimeout(() => {
            //     textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
            //     textarea.focus();
            // }, 0);
        }

        if (isMethod) {
            setShowMethodSuggestions(false); // Hide method suggestions if a method was inserted

        }else{
            console.log(typeof textToInsert, 'mnbvcxz')
            setSelectedFieldType(componentType)
        }
    };

    // Check if there are any matches based on input value
    const checkForSameQueName = (value) => {
        const matches = [];

        allSectionDetails?.data?.sections?.forEach((section) => {
            const sectionName = section.section_name.replace(/\s+/g, '_');
            if (sectionName.includes(value)) {
                matches.push(sectionName);
            }

            section.pages?.forEach((page) => {
                const pageName = page.page_name.replace(/\s+/g, '_');
                if (sectionName.includes(value) || pageName.includes(value)) {
                    matches.push(`${sectionName}.${pageName}`);
                }

                page.questions?.forEach((question) => {
                    const questionName = question.question_name ? question.question_name.replace(/\s+/g, '_') : 'No_Question_Text';
                    if (sectionName.includes(value) || pageName.includes(value) || questionName.includes(value)) {
                        matches.push(`${sectionName}.${pageName}.${questionName}`);
                    }
                });
            });
        });

        return matches.length > 0;
    };
    // Your handleSave function
    const handleSave = () => {
        try {

            // Assuming inputValue is the expression typed by the user
            const result = eval(inputValue);  // Evaluate the expression
            if (typeof result === 'boolean') {
                console.log('Valid expression, result is a boolean:', result);
                // No error message if the result is boolean
            } else {
                console.log('Result is not a boolean:', result);
            }
        } catch (error) {
            // Handle and log any evaluation errors
            console.error('Error evaluating the expression:', error.message);
        }
    };
    console.log(sections, 'sectionssssss')

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
