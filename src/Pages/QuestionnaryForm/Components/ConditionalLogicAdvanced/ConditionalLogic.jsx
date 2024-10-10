
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
import { setNewComponent } from '../Fields/fieldSettingParamsSlice';


function ConditionalLogic({ setConditionalLogic, conditionalLogic, handleSaveSection }) {
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
    const [secDetailsForSearching, setSecDetailsForSearching] = useState([])
    const selectedQuestionId = useSelector((state) => state?.questionnaryForm?.selectedQuestionId);
    const [isThreedotLoader, setIsThreedotLoader] = useState(false)
    const [isThreedotLoaderBlack, setIsThreedotLoaderBlack] = useState(false)


    // Define string and date methods
    const stringMethods = ["toUpperCase()", "toLowerCase()", "trim()", "includes()"];
    const dateMethods = ["AddDays()", "SubtractDays()", "getFullYear()", "getMonth()", "getDate()", "getDay()", "getHours()", "getMinutes()", "getSeconds()", "getMilliseconds()", "getTime()", "Date()"];
    const fileMethods = ['()'];

    //this is my listing of types based on the component type
    const getFieldType = (componentType) => {
        let fieldType;

        switch (componentType) {
            case 'textboxfield':
            case 'choiceboxfield':
            case 'assetLocationfield':
            case 'floorPlanfield':
            case 'signaturefield':
            case 'gpsfield':
            case 'displayfield':
                fieldType = 's';  // Handle all these cases similarly
                break;
            case 'dateTimefield':
                fieldType = new Date();
                break;
            case 'numberfield':
                fieldType = 1;  // Handle all numeric-related fields similarly
                break;
            case 'photofield':
                fieldType = [];
                break;
            case 'videofield':
                fieldType = [];
                break;
            case 'filefield':
                fieldType = [];
                break;
            default:
                fieldType = '';
        }

        return fieldType;
    };

    // Handlers to switch tabs
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleClose = () => {
        setConditionalLogic(false);
    };

    useOnClickOutside(modalRef, () => {
        dispatch(setModalOpen(false));
    });

    //function for filtering the search
    const filterSectionDetails = () => {
        // Initialize an empty array to hold the flattened details
        const sectionDetailsArray = [];

        // Access the sections from the data object
        allSectionDetails?.data?.sections?.forEach((section) => {
            const sectionName = section.section_name.replace(/\s+/g, '_');
            // sectionDetailsArray.push(sectionName); // Add the section name

            // Access pages within each section
            section.pages?.forEach((page) => {
                const pageName = `${sectionName}.${page.page_name.replace(/\s+/g, '_')}`;
                // sectionDetailsArray.push(pageName); // Add section.page

                // Access questions within each page
                page.questions?.forEach((question) => {
                    if (question.question_id !== selectedQuestionId) {
                        const questionName = `${pageName}.${question.question_name.replace(/\s+/g, '_')}`;
                        sectionDetailsArray.push(questionName); // Add section.page.question
                    }
                });
            });
        });
        // Return the array containing all the details
        setSecDetailsForSearching(sectionDetailsArray);
    };

    const handleListSectionDetails = async () => {
        setIsThreedotLoaderBlack(true);
        setShowSectionList(true)
        const response = await getAPI(`questionnaires/${questionnaire_id}/${version_number}?suggestion=true`);
        dispatch(setAllSectionDetails(response.data));
        handleQuestionnaryObject(response.data);
        setIsThreedotLoaderBlack(false);
    }

    useEffect(() => {
        handleListSectionDetails();
    }, [])

    useEffect(() => {
        if (allSectionDetails) {
            filterSectionDetails(); // Call this when the state is updated
        }
    }, [allSectionDetails]);

    //this is my function to store the cbasic sticture of my entire questionnary object
    // function handleQuestionnaryObject(allSectionDetails) {
    //     let result = {};
    //     if (allSectionDetails?.data?.sections && allSectionDetails?.data?.sections.length > 0) {
    //         allSectionDetails?.data?.sections.forEach((section) => {
    //             let sectionObject = {
    //                 [(section.section_name).replaceAll(' ', '_')]: {}
    //             };
    //             let skip = true
    //             if (section.pages && section.pages.length > 0) {
    //                 section.pages.forEach((page) => {
    //                     if (page.questions && page.questions.length > 0) {
    //                         page.questions.forEach((question) => {
    //                             if (question.question_id !== selectedQuestionId) {
    //                                 skip = false
    //                                 const fieldType = getFieldType(question.component_type);
    //                                 sectionObject[(section.section_name).replaceAll(' ', '_')][(page.page_name).replaceAll(' ', '_')] = {
    //                                     ...sectionObject[(section.section_name).replaceAll(' ', '_')][(page.page_name).replaceAll(' ', '_')],
    //                                     [(question.question_name).replaceAll(' ', '_')]: fieldType
    //                                 }
    //                             } else {
    //                                 skip = true
    //                             }
    //                         });
    //                     }
    //                 });
    //             }
    //             if (!skip) {
    //                 result = {
    //                     ...result,
    //                     ...sectionObject
    //                 }
    //                 console.log(result,'result rnjtih')
    //                 setSections(result);
    //             }

    //         });
    //     }
    // }

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
    const handleInputField = (event, sections) => {
        setError('');
        setSelectedFieldType('')
        setShowMethodSuggestions(false);
        setShowSectionList(true)
        const value = event.target.value;
        setInputValue(value); // Update input value

        const lastChar = value.slice(-1);
        // If the last character is a dot, check the field type and show method suggestions
        if (lastChar === '.') {
            console.log(selectedFieldType, 'type')
            if (selectedFieldType === 'textboxfield, choiceboxfield, assetLocationfield, floorPlanfield, signaturefield, gpsfield, displayfield') {
                setSuggestions(stringMethods);
                setShowMethodSuggestions(true);
            } else if (selectedFieldType === 'dateTimefield') {
                setSuggestions(dateMethods);
                setShowMethodSuggestions(true);
            } else if (selectedFieldType === 'photofield') {
                setSuggestions(fileMethods);
                setShowMethodSuggestions(true); // Reset method suggestions
            } else if (selectedFieldType === 'videofield') {
                setSuggestions(fileMethods);
                setShowMethodSuggestions(true); // Reset method suggestions
            } else if (selectedFieldType === 'filefield') {
                setSuggestions(fileMethods);
                setShowMethodSuggestions(true); // Reset method suggestions
            } else if (selectedFieldType === 'numberfield') {
                setSuggestions('')
                setShowMethodSuggestions(false); // Reset method suggestions
            } else {
                const cursorPosition = event.target.selectionStart; // Get the cursor position

                // Find the word around the cursor
                const leftPart = value.slice(0, cursorPosition);
                const rightPart = value.slice(cursorPosition);

                // Find the index of the last space before the cursor and the next space after the cursor
                const startOfWord = leftPart.lastIndexOf(' ') + 1;
                const endOfWord = rightPart.indexOf(' ') === -1 ? rightPart.length - 1 : rightPart.indexOf(' ') - 1;

                const wordToSearch = value.slice(startOfWord, cursorPosition + endOfWord);

                let allSections = sections;
                console.log(sections, 'lllllllll')
                const getVariableType = a => a.constructor.name.toLowerCase();
                let valueType = ''
                try {
                    valueType = getVariableType(eval(`allSections.${wordToSearch}`))
                } catch (e) {

                }
                switch (valueType) {
                    case 'string':
                        setSuggestions(stringMethods);
                        setShowMethodSuggestions(true);
                        break;
                    case 'date':
                        setSuggestions(dateMethods);
                        setShowMethodSuggestions(true);
                        break;
                    case 'number':
                        setShowMethodSuggestions(false);
                        break;
                    case 'file':
                        setSuggestions(fileMethods);
                        setShowMethodSuggestions(true);
                        break;
                    default:
                        setSuggestions([]);
                        setShowMethodSuggestions(false);
                }
            }
        } else {
            setSuggestions([]);
            setShowMethodSuggestions(false); // Reset method suggestions
        }

    };
    console.log(suggestions, 'suggegege')

    // Combined function to insert either a question or a method
    const handleClickToInsert = (textToInsert, isMethod, componentType) => {
        console.log(componentType, 'componentType')
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            // Get the value before and after the current selection
            const textBefore = textarea.value.substring(0, start);
            const textAfter = textarea.value.substring(end);

            // Check if there's a space or if the input is empty
            const lastChar = textBefore.slice(-1);
            let newText;

            if ((lastChar === ' ' || lastChar === '.') || textBefore.length === 0) {
                // Append the text if there's a space or the input is empty
                newText = textBefore + textToInsert + textAfter;
            } else {
                // Replace the last word if there's no space
                const lastSpaceIndex = textBefore.lastIndexOf(' ');
                const textToKeep = textBefore.slice(0, lastSpaceIndex + 1); // Include the space
                newText = textToKeep + textToInsert + textAfter;
            }

            // Update the textarea value
            textarea.value = newText;
            setInputValue(newText);  // Update the inputValue state
            setShowSectionList(false);
        }

        if (isMethod) {
            setShowMethodSuggestions(false); // Hide method suggestions if a method was inserted
        } else {
            let fieldType = '';
            switch (componentType) {
                case 'string':
                    fieldType = [
                        'textboxfield',
                        'choiceboxfield',
                        'assetLocationfield',
                        'floorPlanfield',
                        'signaturefield',
                        'gpsfield',
                        'displayfield'
                    ];
                    break;
                case 'number':
                    fieldType = [
                        'numberfield',
                    ];
                    break;
                case 'array':
                    fieldType = [
                        'photofield',
                        'videofield',
                        'filefield'
                    ];
                    break;
                case 'date':
                    fieldType = 'dateTimefield';
                    break;
                default:
                    fieldType = ''; // Handle any unexpected cases
            }

            setSelectedFieldType(fieldType);

        }
    };

    useEffect(() => {
        // Assuming `allSectionDetails` contains the fetched data and 
        // you have a way to map `selectedQuestionId` to the relevant question
        const findSelectedQuestion = () => {
            allSectionDetails?.data?.sections?.forEach((section) => {
                section.pages?.forEach((page) => {
                    page.questions?.forEach((question) => {
                        if (question.question_id === selectedQuestionId) {
                            // Pre-fill the editor with the conditional logic of the selected question
                            let conditionalLogic = question.conditional_logic || '';

                            // Replace && with "and" and || with "or"
                            conditionalLogic = conditionalLogic.replace(/\s&&\s/g, ' and ').replace(/\s\|\|\s/g, ' or ');

                            setInputValue(conditionalLogic);
                        }
                    });
                });
            });
        };
        if (selectedQuestionId) {
            findSelectedQuestion(); // Set the existing conditional logic as input value
        }
    }, [selectedQuestionId, allSectionDetails]);

    // Your handleSave function
    const handleSave = async () => {
        const sectionId = selectedQuestionId.split('_')[0];
        setShowSectionList(false);
        try {
            // Function to add "sections." to section IDs
            const addSectionPrefix = (input) => {
                return input.replace(/\b(\w+\.\w+\.\w+)\b/g, 'sections.$1');
            };
            // Apply the section prefix function to the inputValue
            let evalInputValue = (inputValue)
            console.log(evalInputValue,'before')
            evalInputValue.replaceAll('AddDays', 'setDate') // Replace AddDays with addDays function
            evalInputValue.replaceAll('SubtractDays(', 'setDate(-') // Replace SubtractDays with subtractDays function
            evalInputValue.replaceAll('()', 'length'); // Replace () with length function
            console.log(typeof evalInputValue,'after')

            let expression = evalInputValue.toString();

            // Replace "and" with "&&", ensuring it's a logical operator, not part of a string or identifier
            expression = expression.replaceAll(/\s+and\s+/g, " && ").replaceAll(/\s+or\s+/g, " || ");
            expression = expression.replaceAll(/\s+And\s+/g, " && ").replaceAll(/\s+Or\s+/g, " || ");
            expression = expression.replaceAll(/\s+AND\s+/g, " && ").replaceAll(/\s+OR\s+/g, " || ");
            evalInputValue = expression

            // Check for the "includes" method being used without a parameter
            const includesRegex = /\.includes\(\)/;
            if (includesRegex.test(evalInputValue)) {
                setError('Please pass the parameter inside the function');
                setIsThreedotLoader(false);
                return; // Stop execution if validation fails
            }
            let payloadString = expression;
            evalInputValue = addSectionPrefix(evalInputValue);
            console.log(payloadString, 'evalInputValue')

            // Extract variable names from the payloadString using a regex
            const variableRegex = /\b(\w+\.\w+\.\w+)\b/g;
            const variableNames = payloadString.match(variableRegex) || [];

            // Validate if all variable names exist in secDetailsForSearching
            const invalidVariables = variableNames.filter(variable => !secDetailsForSearching.includes(variable));

            if (invalidVariables.length > 0) {
                setError(`Invalid variable name(s): ${invalidVariables.join(', ')}`);
                setIsThreedotLoader(false);
                return; // Stop execution if invalid variables are found
            }
            // Evaluate the modified string
            const result = eval(evalInputValue);
            setIsThreedotLoader(true);
            if (!error) {
                setError(result);
                handleSaveSection(sectionId, true, payloadString);
                dispatch(setNewComponent({ id: 'conditional_logic', value: payloadString, questionId: selectedQuestionId }));
            } else if (typeof result === 'boolean') {
                console.log('Valid expression, result is a boolean:', result);
                setError(''); // Clear the error since result is valid
                setIsThreedotLoader(false);
            } else if (isNaN(result)) {
                setError('Please pass the parameter inside the function');
                setIsThreedotLoader(false);
            } else {
                console.log('Result is not a boolean:', result);
                setError(result);
                setIsThreedotLoader(false);
            }
        } catch (error) {
            // Handle and log any evaluation errors
            console.error('Error evaluating the expression:', error.message);
            setError(error.message);
            setIsThreedotLoader(false);
        }
    };
    return (
        <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>
            <div ref={modalRef} className='w-[80%] h-[80%] mx-auto bg-white relative p-[18px] flex'>
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
                        secDetailsForSearching={secDetailsForSearching}
                        sections={sections}
                        setShowMethodSuggestions={setShowMethodSuggestions}
                        isThreedotLoaderBlack={isThreedotLoaderBlack}
                        selectedFieldType={selectedFieldType}
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
                            testID='save-conditional-logic'
                            className='w-[139px] h-[50px] border text-white border-[#2B333B] bg-[#2B333B] hover:bg-black text-base font-semibold ml-[59px]'
                            isThreedotLoading={isThreedotLoader}
                        >
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConditionalLogic;