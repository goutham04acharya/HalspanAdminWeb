
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { setModalOpen, setSelectedComponent } from '../QuestionnaryFormSlice';
import { setModalOpen, setSelectedComponent } from '../QuestionnaryFormSlice';
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
import BasicEditor from './Components/BasicEditor/BasicEditor';
import { buildConditionExpression, buildLogicExpression } from '../../../../CommonMethods/BasicEditorLogicBuilder';
import GlobalContext from '../../../../Components/Context/GlobalContext';
import { reverseFormat } from '../../../../CommonMethods/FormatDate';
import dayjs from 'dayjs';
import moment from 'moment/moment';
import ChoiceBoxField from '../Fields/ChoiceBox/ChoiceBoxField';



function ConditionalLogic({ setConditionalLogic, conditionalLogic, handleSaveSection, isDefaultLogic, setIsDefaultLogic, setDefaultString, defaultString }) {
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
    const selectedComponent = useSelector((state) => state?.questionnaryForm?.selectedComponent);

    const [isThreedotLoader, setIsThreedotLoader] = useState(false)
    const [isThreedotLoaderBlack, setIsThreedotLoaderBlack] = useState(false)
    const [selectedType, setSelectedType] = useState('');
    const [tab, setTab] = useState(false);
    const [submitSelected, setSubmitSelected] = useState(false);
    const { setToastError, setToastSuccess } = useContext(GlobalContext);

    const [conditions, setConditions] = useState([{
        'conditions': [
            {
                'question_name': '',
                'condition_logic': '',
                'value': '',
                'dropdown': false,
                'condition_dropdown': false,
                'condition_type': 'textboxfield'
            },
        ]
    },
    ])

    // Define string and date methods
    const stringMethods = ["toUpperCase()", "toLowerCase()", "trim()", "includes()"];
    const dateMethods = ["AddDays()", "SubtractDays()", "getFullYear()", "getMonth()", "getDate()", "getDay()", "getHours()", "getMinutes()", "getSeconds()", "getMilliseconds()", "getTime()", "Date()"];
    const fileMethods = ["()"];

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
        setIsDefaultLogic(false);
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

    //function for filtering for the basic editor -- does not need section and page
    const filterQuestions = () => {
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
                    const questionId = question?.question_id;
                    const questionName = `${pageName}.${question.question_name.replace(/\s+/g, '_')}`;
                    if (questionId !== selectedQuestionId) {
                        sectionDetailsArray.push(questionName);
                    } else {

                    }

                });
            });
        });
        // Return the array containing all the details
        return sectionDetailsArray;
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
        // setSelectedFieldType('')
        setShowMethodSuggestions(false);
        setShowSectionList(true)
        const value = event.target.value;
        setInputValue(value); // Update input value
        const lastChar = value.slice(-1);
        // If the last character is a dot, check the field type and show method suggestions
        if (lastChar === '.') {
            if (selectedFieldType === 'textboxfield, choiceboxfield, assetLocationfield, floorPlanfield, signaturefield, gpsfield, displayfield') {
                setSuggestions(stringMethods);
                setShowMethodSuggestions(true);
            } else if (selectedFieldType === 'dateTimefield') {
                setSuggestions(dateMethods);
                setShowMethodSuggestions(true);
            } else if (selectedFieldType.includes('photofield')) {
                setSuggestions(fileMethods);
                setShowMethodSuggestions(true); // Reset method suggestions
            } else if (selectedFieldType.includes('videofield')) {
                setSuggestions(fileMethods);
                setShowMethodSuggestions(true); // Reset method suggestions
            } else if (selectedFieldType.includes('filefield')) {
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

    // Combined function to insert either a question or a method
    const handleClickToInsert = (textToInsert, isMethod, componentType) => {
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
                    fieldType = ['dateTimefield'];
                    break;
                default:
                    fieldType = []; // Handle any unexpected cases
            }

            setSelectedFieldType(fieldType.join(', '));
        }
    };

    function getDetails(path, data) {
        // Step 1: Split the path by '.' to get section, page, and question names
        const [sectionPart, pagePart, questionPart] = path.split('.');

        // Step 2: Replace underscores with spaces to match the actual names
        const sectionName = sectionPart.replace(/_/g, ' ');
        const pageName = pagePart.replace(/_/g, ' ');
        const questionName = questionPart.replace(/_/g, ' ');

        // Step 3: Search for the matching section in the data
        const matchingSection = data?.sections.find(section => section.section_name === sectionName);
        if (!matchingSection) {
            return null; // No matching section found
        }

        // Step 4: Search for the matching page in the section
        const matchingPage = matchingSection.pages.find(page => page.page_name === pageName);
        if (!matchingPage) {
            return null; // No matching page found
        }

        // Step 5: Search for the matching question in the page
        const matchingQuestion = matchingPage.questions.find(question => question.question_name === questionName);
        if (!matchingQuestion) {
            return null; // No matching question found
        }

        // Step 6: Return the matching question details
        return matchingQuestion;
    }

    // Helper function to trim unnecessary parentheses
    const trimParentheses = (expression) => {
        let trimmedExpression = expression.trim();

        // Trim the outermost parentheses if they match
        if (trimmedExpression.startsWith('(') && trimmedExpression.endsWith(')')) {
            // Check if it's a balanced pair of parentheses
            let parenthesesCount = 0;
            for (let i = 0; i < trimmedExpression.length; i++) {
                if (trimmedExpression[i] === '(') parenthesesCount++;
                if (trimmedExpression[i] === ')') parenthesesCount--;

                // If we reach the end and it's still balanced, trim
                if (i === trimmedExpression.length - 1 && parenthesesCount === 0) {
                    return trimmedExpression.slice(1, -1).trim();
                }
            }
        }
        return trimmedExpression;
    };

    const parseLogicExpression = (expression) => {
        if (!expression) {
            return [{
                'conditions': [
                    {
                        'question_name': '',
                        'condition_logic': '',
                        'value': '',
                        'dropdown': false,
                        'condition_dropdown': false,
                        'condition_type': 'textboxfield'
                    },
                ]
            },
            ]
        }
        const conditionGroups = expression.split('||').map(group => trimParentheses(group));

        const parsedConditions = conditionGroups.map(group => {
            const conditions = group.split('&&').map(condition => {
                condition = trimParentheses(condition);
                if (condition.includes('Math.abs')) {
                    const regex = /\s*\(\s*([^)]+)\s*-\s*(\d{2}\/\d{2}\/\d{4})\s*\)\s*==\s*(\d+)/;
                    const matching = condition.match(regex);
                    if (matching) {
                        const questionName = matching[1];  // Captures everything inside the parentheses
                        const dateKey = matching[2];       // Captures the date in dd/mm/yyyy format
                        const value = matching[3];         // Captures the numeric value after ==

                        let question = getDetails(questionName.trim(), allSectionDetails.data)
                        let condition_logic = 'date is “X” date of set date'
                        const date = dayjs(dateKey, 'DD/MM/YYYY');
                        return {
                            question_name: questionName.trim(),
                            condition_logic: condition_logic.trim(),
                            value: value,
                            dropdown: false,
                            condition_dropdown: false,
                            condition_type: question?.component_type,
                            date

                        };

                    }
                }
                // Adjust regex to capture question name, logic, and value with optional spaces(dont remove these regex)
                // const matches = condition.match(/(!?)\s*([\w.]+)\s*(includes|does not include|===|!==|<|>|<=|>=)\s*(\d+|'[^']+')/);
                // const matches = condition.match(/(!?)\s*([\w.]+)\s*(includes|does not include|===|!==|<|>|<=|>=)\s*(\d+|'[^']*'|[^'"\s]+)/);
                // const matches = condition.match(/(!?)\s*([\w.]+)\s*(\.includes|does not include|===|!==|<|>|<=|>=)\s*('([^']*)'|\(([^()]*)\)|\d+)/);
                // const matches = condition.match(/(!?)\s*([\w.]+)\s*(\.includes|does not include|===|!==|<|>|<=|>=)\s*(['"]([^'"]*)['"]|\(([^()]*)\)|\d+)/);
                const matches = condition.match(/(!?)\s*([\w.]+)\s*(\.includes|does not include|===|!==|<|>|<=|>=)\s*(['"]([^'"]*)['"]|\(([^()]*)\)|\d+|new\s+Date\(\))/);

                if (matches) {
                    // Destructure the match to extract question name, logic, and value
                    let [, negate, question_name, condition_logic, value] = matches;
                    // If the negate flag is present, adjust the condition logic
                    if (question_name.includes('.length')) {

                        question_name = question_name.replace('.length', '');
                    }
                    let question = getDetails(question_name.trim(), allSectionDetails.data)

                    //this if block is for dateTime only. returning value inside this if block to stop further execution
                    if (question?.component_type === 'dateTimefield') {
                        //assigning new Date() value
                        if (value.includes('new Date()')) {
                            value = 'new Date()';
                        }
                        if (condition_logic === '<') condition_logic = 'date is before today'
                        else if (condition_logic === '>=' || condition_logic === '=>') condition_logic = 'date is after or equal to today';
                        else if (condition_logic === '<=' || condition_logic === '=<') condition_logic = 'date is before or equal to today';
                        else if (condition_logic === '>') condition_logic = 'date is after today'

                        return {
                            question_name: question_name.trim(),
                            condition_logic: condition_logic.trim(),
                            value: '',
                            dropdown: false,
                            condition_dropdown: false,
                            condition_type: question?.component_type
                        };
                    }

                    if (['photofield', 'videofield', 'filefield'].includes(question?.component_type)) {
                        if (value.startsWith("(") && value.endsWith(")")) {
                            // If the value is enclosed in parentheses, treat it as a string
                            value = value.slice(2, -2); // Remove parentheses
                        } else if (value.startsWith("'") && value.endsWith("'")) {
                            // If the value is a string in quotes, remove quotes
                            value = value.slice(1, -1);
                        } else if (value.startsWith('"') && value.endsWith('"')) {
                            // If the value is a string in quotes, remove quotes
                            value = value.slice(1, -1);
                        } else {
                            // Convert to a number if it's not a string
                            value = Number(value);
                        }
                        if (condition_logic === '===' && value == 0) condition_logic = 'has no files'
                        else if (condition_logic === '>=' || condition_logic === '=>') condition_logic = 'has atleast one file';
                        else if (condition_logic === '===') condition_logic = 'number of file is';

                        return {
                            question_name: question_name.trim(),
                            condition_logic: condition_logic.trim(),
                            value: value,
                            dropdown: false,
                            condition_dropdown: false,
                            condition_type: question?.component_type
                        };

                    }
                    if (negate) {
                        if (condition_logic.includes('includes')) {
                            condition_logic = 'does not include';
                        } else {
                            // Convert logical operators to corresponding values in conditions
                            if (condition_logic === '===') condition_logic = 'equals';
                            else if (condition_logic === '!==') condition_logic = 'not equals to';
                            else if (condition_logic === '<') condition_logic = 'smaller';
                            else if (condition_logic === '>') condition_logic = 'larger';
                            else if (condition_logic === '<=') condition_logic = 'smaller or equal';
                            else if (condition_logic === '>=') condition_logic = 'larger or equal';
                        }
                    } else {
                        // Convert logical operators to corresponding values in conditions
                        if (condition_logic === '===') condition_logic = 'equals';
                        else if (condition_logic === '!==') condition_logic = 'not equals to';
                        else if (condition_logic === '<') condition_logic = 'smaller';
                        else if (condition_logic === '>') condition_logic = 'larger';
                        else if (condition_logic === '<=') condition_logic = 'smaller or equal';
                        else if (condition_logic === '>=') condition_logic = 'larger or equal';
                        else if (condition_logic.includes('includes')) condition_logic = 'includes';
                    }

                    // Remove quotes if the value is a string
                    if (value.startsWith("(") && value.endsWith(")")) {
                        // If the value is enclosed in parentheses, treat it as a string
                        value = value.slice(2, -2); // Remove parentheses
                    } else if (value.startsWith("'") && value.endsWith("'")) {
                        // If the value is a string in quotes, remove quotes
                        value = value.slice(1, -1);
                    } else if (value.startsWith('"') && value.endsWith('"')) {
                        // If the value is a string in quotes, remove quotes
                        value = value.slice(1, -1);
                    } else {
                        // Convert to a number if it's not a string
                        value = Number(value);
                    }

                    return {
                        question_name: question_name.trim(),
                        condition_logic: condition_logic.trim(),
                        value: value,
                        dropdown: false,
                        condition_dropdown: false,
                        condition_type: question?.component_type
                    };
                }

                // Return null or handle errors if format doesn't match
                return null;
            });

            if (conditions.filter(cond => cond !== null).length > 0) {
                return {
                    conditions: conditions.filter(cond => cond !== null)
                };
            } else {
                if (!tab) {
                    setToastError(`Oh no! To use the basic editor you'll have to use a simpler expression. Please go back to the advanced editor.`);
                }
                return {
                    conditions: [
                        {
                            'question_name': '',
                            'condition_logic': '',
                            'value': '',
                            'dropdown': false,
                            'condition_dropdown': false,
                            'condition_type': 'textboxfield'
                        },
                    ]
                };
            }
        });

        // Check if the total number of conditions across all groups exceeds 10
        const totalConditions = parsedConditions.reduce((sum, group) => sum + group.conditions.length, 0);

        if (totalConditions > 10) {
            setToastError(`Oh no! To use the basic editor you'll have to use a simpler expression. Please go back to the advanced editor.`);
        }
        return parsedConditions;
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
                            conditionalLogic = conditionalLogic.replace(/\s&&\s/g, ' AND ').replace(/\s\|\|\s/g, ' OR ');
                            conditionalLogic = conditionalLogic.replace(/\s&&\s/g, ' And ').replace(/\s\|\|\s/g, ' Or ');
                            conditionalLogic = conditionalLogic.replace(/\?/g, ' then ').replace(/\s:\s/g, ' else '); // Replace the : with ' else ' // Replace the ? with ' then '
                            conditionalLogic = conditionalLogic.replace(/^ /, 'if '); // Replace the : with ' else ' // Replace the ? with ' then '
                            conditionalLogic = conditionalLogic.replace(/sections\./g, '') // Replace the : with ' else ' // Replace the ? with ' then '




                            setInputValue(conditionalLogic);
                            setConditions(parseLogicExpression(question.conditional_logic));
                        }
                    });
                });
            });
        };
        if (selectedQuestionId) {
            findSelectedQuestion(); // Set the existing conditional logic as input value
        }
    }, [selectedQuestionId, allSectionDetails, tab]);

    // Your handleSave function
    // const handleSave = async () => {
    //     const sectionId = selectedQuestionId.split('_')[0];
    //     setShowSectionList(false);
    //     try {
    //         // Function to add "sections." to section IDs
    //         const addSectionPrefix = (input) => {
    //             return input.replace(/\b(\w+\.\w+\.\w+)\b/g, 'sections.$1');
    //         };

    //         // New function to modify string (replace () with length())
    //         const modifyString = (input) => {
    //             if (selectedType === 'array') {
    //                 const lastIndex = input.lastIndexOf('()');
    //                 if (lastIndex !== -1) {
    //                     return input.slice(0, lastIndex) + 'length' + input.slice(lastIndex + 2);
    //                 }
    //             }
    //             return input;
    //         };

    //         // Apply the section prefix function to the inputValue
    //         let evalInputValue = modifyString(inputValue);
    //         let showdefaultValue = evalInputValue
    //         // New function to format dates and remove quotes from new Date
    //         const formatDates = (input) => {
    //             // First, replace MM/DD/YYYY format with new Date(YYYY, MM-1, DD)
    //             let formatted = input.replace(/\b(\d{2})\/(\d{2})\/(\d{4})\b/g, (match, month, day, year) => {
    //                 return `new Date(${year}, ${parseInt(month) - 1}, ${day})`;
    //             });

    //             // Then, remove quotes from around new Date expressions
    //             formatted = formatted.replace(/"(new Date\([^)]+\))"/g, '$1');
    //             return formatted;
    //         };

    //         // Apply the formatDates function
    //         evalInputValue = formatDates(evalInputValue);
    //         // Log the updated input after date replacement

    //         evalInputValue = evalInputValue.replaceAll('AddDays(', 'setDate(') // Replace AddDays with addDays function
    //         evalInputValue = evalInputValue.replaceAll('SubtractDays(', 'setDate(-') // Replace SubtractDays with subtractDays function
    //         evalInputValue = evalInputValue.replace('Today()', 'new Date()'); // Replace () with length function
    //         evalInputValue = evalInputValue.replace('else', ':'); // Replace () with length function
    //         evalInputValue = evalInputValue.replace('then', '?'); // Replace () with length function
    //         evalInputValue = evalInputValue.replace('if', ''); // Replace () with length function


    //         let expression = evalInputValue.toString();

    //         // Replace "and" with "&&", ensuring it's a logical operator, not part of a string or identifier
    //         expression = expression.replaceAll(/\s+and\s+/g, " && ").replaceAll(/\s+or\s+/g, " || ");
    //         expression = expression.replaceAll(/\s+And\s+/g, " && ").replaceAll(/\s+Or\s+/g, " || ");
    //         expression = expression.replaceAll(/\s+AND\s+/g, " && ").replaceAll(/\s+OR\s+/g, " || ");
    //         evalInputValue = expression
    //         // Check for the "includes" method being used without a parameter
    //         let methods = [
    //             "AddDays", "SubtractDays", "getFullYear", "getMonth", "getDate",
    //             "getDay", "getHours", "getMinutes", "getSeconds", "getMilliseconds",
    //             "getTime", "Date", "Today", "setDate", "includes"
    //         ]
    //         const functionCallRegex = new RegExp(`\\.(${methods.join('|')})\\(\\)`, 'g');
    //         if (functionCallRegex.test(evalInputValue)) {
    //             setError('Please pass the parameter inside the function');
    //             setIsThreedotLoader(false);
    //             return; // Stop execution if validation fails
    //         }
    //         let payloadString = expression;
    //         evalInputValue = addSectionPrefix(evalInputValue);

    //         // Extract variable names from the payloadString using a regex
    //         const variableRegex = /\b(\w+\.\w+\.\w+)\b/g;
    //         const variableNames = payloadString.match(variableRegex) || [];

    //         // Validate if all variable names exist in secDetailsForSearching
    //         const invalidVariables = variableNames.filter(variable => !secDetailsForSearching.includes(variable));

    //         if (invalidVariables.length > 0) {
    //             setError(`Invalid variable name(s): ${invalidVariables.join(', ')}`);
    //             setIsThreedotLoader(false);
    //             return; // Stop execution if invalid variables are found
    //         }

    //         // Evaluate the modified string
    //         const result = eval(evalInputValue);
    //         setIsThreedotLoader(true)

    //         if (isDefaultLogic === true) {
    //             if (selectedComponent === 'choiceboxfield') {
    //                 setDefaultString(evalInputValue);

    //             } else if (selectedComponent === 'dateTimefield') {
    //                 const defaultResult = moment(eval(evalInputValue), "DD/MM/YYYY", true);
    //                 setIsThreedotLoader(true);
    //                 if (defaultResult.isValid()) {
    //                     console.log('Successful');
    //                 } else {
    //                     setError('Please follow the DD/MM/YYYY Date Format');
    //                     return;
    //                 }
    //             } else if (selectedComponent === 'numberfield') { // Corrected this part
    //                 setDefaultString(evalInputValue);
    //             }
    //         } else {
    //             console.log('am ehere')
    //         }


    //         if (!error) {
    //             handleSaveSection(sectionId, true, payloadString);
    //             dispatch(setNewComponent({ id: 'default_conditional_logic', value: defaultString, questionId: selectedQuestionId }));
    //             // dispatch(setNewComponent({ id: 'conditional_logic', value: payloadString, questionId: selectedQuestionId }));
    //         } else if (typeof result === 'boolean') {
    //             setError(''); // Clear the error since result is valid
    //             setIsThreedotLoader(false);
    //         } else if (isNaN(result)) {
    //             setError('Please pass the parameter inside the function');
    //             setIsThreedotLoader(false);
    //         } else {
    //             console.log('Result is not a boolean:', result);
    //             setError(result);
    //             setIsThreedotLoader(false);
    //         }
    //     } catch (error) {
    //         // Handle and log any evaluation errors
    //         console.error('Error evaluating the expression:', error.message);
    //         setError(error.message);
    //         setIsThreedotLoader(false);
    //     }
    // };

    const handleSave = async () => {
        const sectionId = selectedQuestionId.split('_')[0];
        setShowSectionList(false);
        try {
            const addSectionPrefix = (input) => {
                return input.replace(/\b(\w+\.\w+\.\w+)\b/g, 'sections.$1');
            };

            const modifyString = (input) => {
                if (selectedType === 'array') {
                    const lastIndex = input.lastIndexOf('()');
                    if (lastIndex !== -1) {
                        return input.slice(0, lastIndex) + 'length' + input.slice(lastIndex + 2);
                    }
                }
                return input;
            };

            let evalInputValue = modifyString(inputValue);
            evalInputValue = evalInputValue.replaceAll('AddDays(', 'setDate(')
                .replaceAll('SubtractDays(', 'setDate(-')
                .replace('Today()', 'new Date()')
                .replace('else', ':')
                .replace('then', '?')
                .replace('if', '');
            let showdefaultValue = evalInputValue
            // New function to format dates and remove quotes from new Date
            const formatDates = (input) => {
                // First, replace MM/DD/YYYY format with new Date(YYYY, MM-1, DD)
                let formatted = input.replace(/\b(\d{2})\/(\d{2})\/(\d{4})\b/g, (match, month, day, year) => {
                    return `new Date(${year}, ${parseInt(month) - 1}, ${day})`;
                });

                // Then, remove quotes from around new Date expressions
                formatted = formatted.replace(/"(new Date\([^)]+\))"/g, '$1');
                return formatted;
            };

            // Apply the formatDates function
            evalInputValue = formatDates(evalInputValue);
            // Log the updated input after date replacement

            evalInputValue = evalInputValue.replaceAll('AddDays(', 'setDate(') // Replace AddDays with addDays function
            evalInputValue = evalInputValue.replaceAll('SubtractDays(', 'setDate(-') // Replace SubtractDays with subtractDays function
            evalInputValue = evalInputValue.replace('Today()', 'new Date()'); // Replace () with length function
            evalInputValue = evalInputValue.replace('else', ':'); // Replace () with length function
            evalInputValue = evalInputValue.replace('then', '?'); // Replace () with length function
            evalInputValue = evalInputValue.replace('if', ''); // Replace () with length function


            let expression = evalInputValue.toString();

            // Replace "and" with "&&", ensuring it's a logical operator, not part of a string or identifier
            expression = expression.replaceAll(/\s+and\s+/g, " && ").replaceAll(/\s+or\s+/g, " || ");
            expression = expression.replaceAll(/\s+And\s+/g, " && ").replaceAll(/\s+Or\s+/g, " || ");
            expression = expression.replaceAll(/\s+AND\s+/g, " && ").replaceAll(/\s+OR\s+/g, " || ");
            evalInputValue = expression
            // Check for the "includes" method being used without a parameter
            let methods = [
                "AddDays", "SubtractDays", "getFullYear", "getMonth", "getDate",
                "getDay", "getHours", "getMinutes", "getSeconds", "getMilliseconds",
                "getTime", "Date", "Today", "setDate", "includes"
            ]
            const functionCallRegex = new RegExp(`\\.(${methods.join('|')})\\(\\)`, 'g');
            if (functionCallRegex.test(evalInputValue)) {
                setError('Please pass the parameter inside the function');
                setIsThreedotLoader(false);
                return; // Stop execution if validation fails
            }

            let payloadString = expression;
            evalInputValue = addSectionPrefix(evalInputValue);

            // Extract variable names from the payloadString using a regex
            const variableRegex = /\b(\w+\.\w+\.\w+)\b/g;
            const variableNames = payloadString.match(variableRegex) || [];

            // Validate if all variable names exist in secDetailsForSearching
            const invalidVariables = variableNames.filter(variable => !secDetailsForSearching.includes(variable));

            if (invalidVariables.length > 0) {
                setError(`Invalid variable name(s): ${invalidVariables.join(', ')}`);
                setIsThreedotLoader(false);
                return;
            }

            const result = eval(evalInputValue);

            // Split and Validate Expression
            const validationResult = splitAndValidate(evalInputValue);

            // Return early if validation errors exist
            if (validationResult.some(msg => msg.includes('Error'))) {
                setError(validationResult.join('\n'));
                setIsThreedotLoader(false);
                return; // Stop execution if validation fails
            }
            setIsThreedotLoader(true);

            if (isDefaultLogic === true) {
                if (selectedComponent === 'choiceboxfield') {
                    setDefaultString(evalInputValue);

                } else if (selectedComponent === 'dateTimefield') {
                    const defaultResult = moment(eval(evalInputValue), "DD/MM/YYYY", true);
                    setIsThreedotLoader(true);
                    if (defaultResult.isValid()) {
                        console.log('Successful');
                    } else {
                        setError('Please follow the DD/MM/YYYY Date Format');
                        return;
                    }
                } else if (selectedComponent === 'numberfield') { // Corrected this part
                    setDefaultString(evalInputValue);
                }
            } else {
                console.log('Non-default logic');
            }

            if (!error) {
                handleSaveSection(sectionId, true, payloadString);
                dispatch(setNewComponent({ id: 'default_conditional_logic', value: defaultString, questionId: selectedQuestionId }));
                // dispatch(setNewComponent({ id: 'conditional_logic', value: payloadString, questionId: selectedQuestionId }));
            } else if (typeof result === 'boolean') {
                setError('');  // Clear the error since the result is valid
                setIsThreedotLoader(false);
            } else if (isNaN(result)) {
                setError('Please pass the parameter inside the function');
                setIsThreedotLoader(false);
            } else {
                setError(result);
                setIsThreedotLoader(false);
            }
        } catch (error) {
            console.error('Error evaluating the expression:', error.message);
            setError(error.message);
            setIsThreedotLoader(false);
        }
    };

    function splitAndValidate(expression) {
        // const cleanExpression = expression.replace(/^\(|\)$/g, '').trim();
        const parts = expression.split(/\s*&&\s*|\s*\|\|\s*/);
        const errors = [];

        // Define the list of methods that don't require an operator
        const typeMethods = ["AddDays()", "SubtractDays()", "getFullYear()", "getMonth()", "getDate()", "getDay()", "getHours()", "getMinutes()", "getSeconds()", "getMilliseconds()", "getTime()", "Date()", "includes()"];        // Update the regex to match valid expressions

        const validExpressionRegex = /^[a-zA-Z0-9_\.]+(?:\([^\)]*\))?\s*(===|==|!=|>|<|>=|<=)\s*("[^"]*"|\d+|[a-zA-Z0-9_\.]+)$/;

        // Define a regex to detect incomplete expressions (e.g., missing operators or values)
        const incompleteExpressionRegex = /^[a-zA-Z0-9_\.]+(?:\([^\)]*\))?$/;

        // Regex for valid date format (dd/mm/yyyy)
        const validDateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

        parts.forEach((part, index) => {
            part = part.replace(/^\s+|\s+$/g, '');

            // Check for incomplete expressions
            part = trimParentheses(part)
            const displayPart = part.replace(/sections\./g, '');

            // Check if the expression contains any method from the typeMethods list
            const containsTypeMethod = typeMethods.some(method => part.includes(method));

            //checking for the includes 
            if (part.includes('includes(')) {
                const result = part.match(/includes\((["'])(.*?)\1\)/)[2]; // Extract the string inside the includes() parentheses
                if(!result){
                    error.push(`Error in the ${part}: missing vaalues inside the function`)
                }
            }
            // If it contains a method that doesn't require an operator, mark as correct
            else if (containsTypeMethod) {
                errors.push(`Expression is correct (contains a valid method).`);
            }
            else if (incompleteExpressionRegex.test(part) && !part.endsWith(')')) {
                errors.push(`Error in expression: "${displayPart}" is incomplete (missing operator or value).`);
            }
            // Check if it's a date type
            else if (selectedType === 'date') {
                const dateMatch = part.match(/===\s*(.*)$/);  // Capture the value after '==='
                if (dateMatch) {
                    const value = dateMatch[1].trim().replace(/"/g, ''); // Remove quotes

                    // Validate date value (either "Today" or a valid date format)
                    if (value !== 'Today' && !validDateRegex.test(value)) {
                        errors.push(`Error in expression: "${value}" is not a valid date. Use 'dd/mm/yyyy' or 'Today'.`);
                    }
                } else {
                    errors.push(`Error in expression: Date field is missing or incorrectly formatted.`);
                }
            }
            // Check if the part matches the valid expression pattern
            else if (!validExpressionRegex.test(part)) {
                errors.push(`Error in expression: "${displayPart}" is incorrect.`);
            }
            // If the expression is correct, log that it's valid
            else {
                console.log(`Expression is correct.`);
            }
        });

        return errors.length > 0 ? errors : ["All expressions are valid."];
    }

    const showInputValue = (key) => {
        //this is the array of cndition where the input value  tap will not be  shown
        let arr = ['has no files', 'has atleast one file', 'date is before today', 'date is before or equal to today', 'date is after today', 'date is after or equal to today']
        // check whether the condition key  is there in array, if yes then return false because the input value should not be shown 
        if (arr.includes(key)) {
            return true;
        }
        // if  its not there then return tru as the input box is required for  other condiitons 
        return false;
    }

    const validateConditions = () => {
        for (let i = 0; i < conditions.length; i++) {
            for (let j = 0; j < conditions[i].conditions.length; j++) {
                const condition = conditions[i].conditions[j];
                if (showInputValue(condition.condition_logic)) {

                    if (condition.question_name === '' || condition.condition_logic === '') {
                        return true;
                    }
                } else {
                    if (
                        condition.question_name === '' ||
                        condition.condition_logic === '' ||
                        condition.value === ''
                    ) {
                        return true;  // Return true if any key is empty
                    }
                }
            }
        }
        return false;  // Return false if all keys have values
    };

    const handleSaveBasicEditor = () => {
        setSubmitSelected(true);
        if (validateConditions()) {
            return;
        }
        let condition_logic;
        try {
            condition_logic = buildConditionExpression(conditions);
        } catch (error) {
        }
        const sectionId = selectedQuestionId.split('_')[0];

        handleSaveSection(sectionId, true, condition_logic);
        dispatch(setNewComponent({ id: 'conditional_logic', value: condition_logic, questionId: selectedQuestionId }));
    }


    return (
        <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>
            <div ref={modalRef} className='w-[80%] h-[83%] mx-auto bg-white rounded-[14px] relative p-[18px] '>
                <div className='w-full'>
                    {(tab || isDefaultLogic) ? (
                        <div className='flex h-customh14'>
                            <div className='w-[60%]'>
                                {!isDefaultLogic ?
                                    <p className='text-start text-lg text-[#2B333B] font-semibold'>shows when...</p>
                                    :
                                    <p className='text-start text-[22px] text-[#2B333B] font-semibold'>Default Value</p>
                                }
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
                                    setSelectedType={setSelectedType}
                                />
                            </div>
                            <div className='w-[40%]'>
                                <StaticDetails
                                    handleTabClick={handleTabClick}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    isDefaultLogic={isDefaultLogic}
                                    selectedFieldType={selectedFieldType}
                                />
                            </div>
                        </div>) : (
                        !isDefaultLogic && (
                            <BasicEditor
                                secDetailsForSearching={filterQuestions()}
                                questions={allSectionDetails.data}
                                sections={sections}
                                setShowMethodSuggestions={setShowMethodSuggestions}
                                isThreedotLoaderBlack={isThreedotLoaderBlack}
                                conditions={conditions}
                                setConditions={setConditions}
                                submitSelected={submitSelected}
                                setSubmitSelected={setSubmitSelected}
                            />
                        )
                    )}
                    <div className={`${isDefaultLogic ? 'flex justify-end items-end w-full' : 'flex justify-between items-end'}`}>
                        {!isDefaultLogic &&
                            <div className='flex gap-5 items-end'>
                                <p onClick={() => setTab(true)} className={tab ? 'text-lg text-[#9FACB9] font-semibold px-[1px] border-b-2 border-white cursor-pointer' : 'text-[#2B333B] font-semibold px-[1px] border-b-2 border-[#2B333B] text-lg cursor-pointer'}>Basic Editor</p>
                                <p data-testId="advance-editor-tab" onClick={() => setTab(true)} className={!tab ? 'text-lg text-[#9FACB9] font-semibold px-[1px] border-b-2 border-white cursor-pointer' : 'text-[#2B333B] font-semibold px-[1px] border-b-2 border-[#2B333B] text-lg cursor-pointer'}>Advanced Editor</p>
                            </div>
                        }
                        <div>
                            <Button2
                                text='Cancel'
                                type='button'
                                testId='cancel'
                                data-testid='button1'
                                className='w-[162px] h-[50px] text-black font-semibold text-base'
                                onClick={() => handleClose()}
                            >
                            </Button2>
                            <Button
                                text='Save'
                                onClick={tab || isDefaultLogic ? handleSave : handleSaveBasicEditor}
                                type='button'
                                data-testid='cancel'
                                className='w-[139px] h-[50px] border text-white border-[#2B333B] bg-[#2B333B] hover:bg-black text-base font-semibold ml-[28px]'
                            >
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ConditionalLogic;