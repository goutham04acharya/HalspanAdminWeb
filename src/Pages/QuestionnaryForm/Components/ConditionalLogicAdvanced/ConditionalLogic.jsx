
import React, { useContext, useEffect, useRef, useState } from 'react'
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
import BasicEditor from './Components/BasicEditor/BasicEditor';
import { buildConditionExpression, buildLogicExpression } from '../../../../CommonMethods/BasicEditorLogicBuilder';
import GlobalContext from '../../../../Components/Context/GlobalContext';



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
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [tab, setTab] = useState(false);
    const [submitSelected, setSubmitSelected] = useState(false);
    const { setToastError, setToastSuccess } = useContext(GlobalContext);
    const [selectionArray, setSelectionArray] = useState([])

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

    //this is my listing of types based on the component type
    const getFieldType = (componentType) => {
        let fieldType;

        switch (componentType) {
            case 'textboxfield, choiceboxfield, assetLocationfield, floorPlanfield, signaturefield, gpsfield, displayfield':  // Handle both cases if they map to 'string'
                fieldType = '';
                break;
            case 'dateTimefield':
                fieldType = new Date();
                break;
            case 'numberfield, photofield, videofield, filefield':
                fieldType = 1;
                break;
            default: fieldType = ''
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
                    const questionName = `${pageName}.${question.question_name.replace(/\s+/g, '_')}`;
                    sectionDetailsArray.push(questionName); // Add section.page.question
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
            if (selectedFieldType === 'textboxfield, choiceboxfield, assetLocationfield, floorPlanfield, signaturefield, gpsfield, displayfield') {
                setSuggestions(stringMethods);
                setShowMethodSuggestions(true);
            } else if (selectedFieldType === 'dateTimefield') {
                setSuggestions(dateMethods);
                setShowMethodSuggestions(true);
            } else if (selectedFieldType === 'numberfield, photofield, videofield, filefield') {
                setShowMethodSuggestions(false);
                setSuggestions('')

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

            if (lastChar === ' ' || textBefore.length === 0) {
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
                    fieldType = 'textboxfield, choiceboxfield, assetLocationfield, floorPlanfield, signaturefield, gpsfield, displayfield';
                    break;
                case 'number':
                    fieldType = 'numberfield ,photofield, videofield, filefield';
                    break;
                case 'date':
                    fieldType = 'dateTimefield';
                    break;
            }
            setSelectedFieldType(fieldType);
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

    // Main function to split the expression and reconstruct conditions
    // const parseLogicExpression = (expression) => {
    //     const conditionGroups = expression.split('||').map(group => trimParentheses(group));

    //     return conditionGroups.map(group => {
    //         const conditions = group.split('&&').map(condition => {
    //             condition = trimParentheses(condition);

    //             // Adjust regex to capture question name, logic, and value with optional spaces
    //             const matches = condition.match(/([\w.]+)\s*(!?)(includes|does not include|===|!==|<|>|<=|>=)\s*(\d+|'[^']+')/);

    //             if (matches) {
    //                 // Destructure the match to extract question name, logic, and value
    //                 let [, question_name, negate, condition_logic, value] = matches;

    //                 // If the negate flag is present, adjust the condition logic
    //                 if (negate) {
    //                     if (condition_logic === 'includes') {
    //                         condition_logic = 'does not include';
    //                     } else {
    //                         // Convert logical operators to corresponding values in conditions
    //                         if (condition_logic === '===') condition_logic = 'equals';
    //                         else if (condition_logic === '!==') condition_logic = 'not equals to';
    //                         else if (condition_logic === '<') condition_logic = 'smaller';
    //                         else if (condition_logic === '>') condition_logic = 'larger';
    //                         else if (condition_logic === '<=') condition_logic = 'smaller or equal';
    //                         else if (condition_logic === '>=') condition_logic = 'larger or equal';
    //                     }
    //                 } else {
    //                     // Convert logical operators to corresponding values in conditions
    //                     if (condition_logic === '===') condition_logic = 'equals';
    //                     else if (condition_logic === '!==') condition_logic = 'not equals to';
    //                     else if (condition_logic === '<') condition_logic = 'smaller';
    //                     else if (condition_logic === '>') condition_logic = 'larger';
    //                     else if (condition_logic === '<=') condition_logic = 'smaller or equal';
    //                     else if (condition_logic === '>=') condition_logic = 'larger or equal';
    //                 }

    //                 // Remove quotes if the value is a string
    //                 value = value.startsWith("'") ? value.slice(1, -1) : Number(value);

    //                 // Return the object in the correct structure
    //                 return {
    //                     question_name: question_name.trim(),
    //                     condition_logic: condition_logic.trim(),
    //                     value: value,
    //                     dropdown: false,
    //                     condition_dropdown: false,
    //                     condition_type: 'textboxfield'
    //                 };
    //             }

    //             // Return null or handle errors if format doesn't match
    //             return null;
    //         });
    //         if (conditions.filter(cond => cond !== null).length > 0) {
    //             return {
    //                 conditions: conditions.filter(cond => cond !== null)
    //             };
    //         } else {
    //             if (!tab) {
    //                 setToastError(`Oh no! To use the basic editor you'll have to use a simpler expression.Please go back to the advanced editor.`);
    //             }
    //             return {
    //                 conditions: [
    //                     {
    //                         'question_name': '',
    //                         'condition_logic': '',
    //                         'value': '',
    //                         'dropdown': false,
    //                         'condition_dropdown': false,
    //                         'condition_type': 'textboxfield'
    //                     },
    //                 ]
    //             };
    //         }

    //     });
    // };
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
                // Adjust regex to capture question name, logic, and value with optional spaces(dont remove these regex)
                // const matches = condition.match(/(!?)\s*([\w.]+)\s*(includes|does not include|===|!==|<|>|<=|>=)\s*(\d+|'[^']+')/);
                // const matches = condition.match(/(!?)\s*([\w.]+)\s*(includes|does not include|===|!==|<|>|<=|>=)\s*(\d+|'[^']*'|[^'"\s]+)/);
                // const matches = condition.match(/(!?)\s*([\w.]+)\s*(\.includes|does not include|===|!==|<|>|<=|>=)\s*('([^']*)'|\(([^()]*)\)|\d+)/);
                const matches = condition.match(/(!?)\s*([\w.]+)\s*(\.includes|does not include|===|!==|<|>|<=|>=)\s*(['"]([^'"]*)['"]|\(([^()]*)\)|\d+)/);

                if (matches) {

                    // Destructure the match to extract question name, logic, and value
                    let [, negate, question_name, condition_logic, value] = matches;
                    // If the negate flag is present, adjust the condition logic
                    if (question_name.includes('.length')) {
                        
                        question_name = question_name.replace('.length', '');
                      }
                    let question = getDetails(question_name.trim(), allSectionDetails.data)
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
                        else if (condition_logic === '===') condition_logic = 'number of files is';

                       

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

                    // Return the object in the correct structure

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
            evalInputValue.replaceAll('AddDays', 'setDate') // Replace AddDays with addDays function
            evalInputValue.replaceAll('SubtractDays(', 'setDate(-') // Replace SubtractDays with subtractDays function
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

    const validateConditions = () => {
        for (let i = 0; i < conditions.length; i++) {
            for (let j = 0; j < conditions[i].conditions.length; j++) {
                const condition = conditions[i].conditions[j];
                if (condition.condition_logic === 'has atleast one file' || condition.condition_logic === 'has no files') {

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
            console.log(error, 'oooooooooooooooooooooooo')
        }
        const sectionId = selectedQuestionId.split('_')[0];

        console.log('condition', condition_logic)

        handleSaveSection(sectionId, true, condition_logic);
        dispatch(setNewComponent({ id: 'conditional_logic', value: condition_logic, questionId: selectedQuestionId }));
    }

    return (
        <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>
            <div ref={modalRef} className='w-[80%] h-[83%] mx-auto bg-white rounded-[14px] relative p-[18px] '>
                <div className='w-full'>
                    {tab ?
                        <div className='flex h-customh14'>
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
                                    setActiveTab={setActiveTab} />
                            </div>
                        </div> :
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
                    }
                    <div className='flex justify-between items-end'>
                        <div className='flex gap-5 items-end'>
                            <p onClick={() => setTab(false)} className={tab ? 'text-lg text-[#9FACB9] font-semibold px-[1px] border-b-2 border-white cursor-pointer' : 'text-[#2B333B] font-semibold px-[1px] border-b-2 border-[#2B333B] text-lg cursor-pointer'}>Basic Editor</p>
                            <p data-testId="advance-editor-tab" onClick={() => setTab(true)} className={!tab ? 'text-lg text-[#9FACB9] font-semibold px-[1px] border-b-2 border-white cursor-pointer' : 'text-[#2B333B] font-semibold px-[1px] border-b-2 border-[#2B333B] text-lg cursor-pointer'}>Advanced Editor</p>
                        </div>
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
                                onClick={tab ? handleSave : handleSaveBasicEditor}
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