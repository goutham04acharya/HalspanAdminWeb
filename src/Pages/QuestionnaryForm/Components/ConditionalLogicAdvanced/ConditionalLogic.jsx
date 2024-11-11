
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
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
import OperatorsModal from '../../../../Components/Modals/OperatorsModal';
import { DateValidator } from './DateFieldChecker';
import { defaultContentConverter } from '../../../../CommonMethods/defaultContentConverter';



function ConditionalLogic({ setConditionalLogic, conditionalLogic, handleSaveSection, isDefaultLogic, setIsDefaultLogic, setDefaultString, defaultString, complianceState,
    setCompliancestate, complianceLogic }) {
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
    const [tab, setTab] = useState('basic');
    const [submitSelected, setSubmitSelected] = useState(false);
    const { setToastError, setToastSuccess } = useContext(GlobalContext);
    const [isOperatorModal, setIsOperatorModal] = useState(false);
    const [isStringMethodModal, setIsStringMethodModal] = useState(false)

    const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);
    const { complianceLogicId } = useSelector((state) => state?.questionnaryForm)
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
    const dateMethods = ["AddDays()", "SubtractDays()", "getFullYear()", "getMonth()", "getDate()", "getDay()", "getHours()", "getMinutes()", "getSeconds()", "getMilliseconds()", "getTime()"];
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
    const handleTabClick = (event) => {
        setActiveTab(event);
    };

    const handleClose = () => {
        setConditionalLogic(false);
        setIsDefaultLogic(false);
        setCompliancestate(false);
    };

    useOnClickOutside(modalRef, () => {
        dispatch(setModalOpen(false));
    });

    //function for filtering the search does not need section and page
    const filterSectionDetails = () => {
        // Initialize an empty array to hold the flattened details
        const sectionDetailsArray = [];

        // Access the sections from the data object
        allSectionDetails?.data?.sections?.forEach((section) => {
            const sectionName = section.section_name.replace(/\s+/g, '_');

            // Access pages within each section
            section.pages?.forEach((page) => {
                const pageName = `${sectionName}.${page.page_name.replace(/\s+/g, '_')}`;

                // Access questions within each page
                page.questions?.forEach((question) => {
                    if (question.question_id !== selectedQuestionId && (!['assetLocationfield', 'floorPlanfield', 'signaturefield', 'gpsfield', 'displayfield'].includes(question?.component_type))) {
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
                    if (questionId !== selectedQuestionId && (!['assetLocationfield', 'floorPlanfield', 'signaturefield', 'gpsfield', 'displayfield'].includes(question?.component_type))) {
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
        setInputValue(value)
        // if (isDefaultLogic) {
        //     dispatch(setNewComponent({ id: 'default_conditional_logic', value: value, questionId: selectedQuestionId }))
        // } else {
        //     dispatch(setNewComponent({ id: 'conditional_logic', value: value, questionId: selectedQuestionId }))
        // }
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
            setShowSectionList(false);
            setInputValue(newText)
            // if (isDefaultLogic) {
            //     dispatch(setNewComponent({ id: 'default_conditional_logic', value: newText, questionId: selectedQuestionId }))
            // } else {
            //     dispatch(setNewComponent({ id: 'conditional_logic', value: newText, questionId: selectedQuestionId }))
            // }  // Update the inputValue state
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
                    // const regex = /\s*\(\s*([^)]+)\s*-\s*(\d{2}\/\d{2}\/\d{4})\s*\)\s*==\s*(\d+)/;
                    // const matching = condition.match(regex);
                    const regex = /\s*\(\s*([^)]+)\s*-\s*new Date\(\s*(\d{4})\s*,\s*(\d{1,2})\s*,\s*(\d{1,2})\s*\)\s*\)\s*==\s*(\d+)/;
                    const matching = condition.match(regex);
                    if (matching) {
                        // const questionName = matching[1];  // Captures everything inside the parentheses
                        // const dateKey = matching[2];       // Captures the date in dd/mm/yyyy format
                        // const value = matching[3];         // Captures the numeric value after ==
                        const questionName = matching[1];   // Captures everything inside the parentheses
                        const year = matching[2];           // Captures the year from new Date
                        const month = String(parseInt(matching[3], 10) + 1).padStart(2, '0'); // Adjust 0-indexed month and pad
                        const day = String(matching[4]).padStart(2, '0'); // Capture day and pad
                        const value = matching[5];
                        const dateKey = `${day}/${month}/${year}`;

                        let question = getDetails(questionName.trim(), allSectionDetails.data)
                        let condition_logic = 'date is “X” date of set date'
                        const date = dayjs(dateKey, 'DD/MM/YYYY');
                        return {
                            question_name: questionName.trim(),
                            condition_logic: condition_logic.trim(),
                            value: value / (24 * 60 * 60 * 1000),
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
                if (tab !== 'advance') {
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
        const fetchData = async () => {
            if (complianceState) {
                try {
                    const response = await getAPI(`questionnaires/layout/${questionnaire_id}/${version_number}`);
                    // Extract default_content based on selected index
                    const selectedLogic = response?.data?.data?.compliance_logic[complianceLogicId];

                    // Use defaultContentConverter to transform default_content if selectedLogic exists
                    if (selectedLogic) {
                        const transformedContent = defaultContentConverter(selectedLogic.default_content);
                        setInputValue(transformedContent);
                    } else {
                        setInputValue('');
                    }
                } catch (error) {
                    console.error("Error fetching layout:", error);
                }
            }
        };

        fetchData();
    }, [complianceState, questionnaire_id, version_number, complianceLogicId]);

    useEffect(() => {
        // Assuming `allSectionDetails` contains the fetched data and 
        // you have a way to map `selectedQuestionId` to the relevant question
        const findSelectedQuestion = () => {
            allSectionDetails?.data?.sections?.forEach((section) => {
                section.pages?.forEach((page) => {
                    page.questions?.forEach((question) => {
                        if (question.question_id === selectedQuestionId) {
                            // Pre-fill the editor with the conditional logic of the selected question

                            //adding this to check whether the advane editor or the default logic
                            let conditionalLogic = ''
                            if (isDefaultLogic) {
                                conditionalLogic = question.default_conditional_logic || '';
                            } else {
                                conditionalLogic = question.conditional_logic || '';
                            }


                            // Replace && with "and" and || with "or"
                            conditionalLogic = conditionalLogic.replace(/\s&&\s/g, ' and ').replace(/\s\|\|\s/g, ' or ');
                            conditionalLogic = conditionalLogic.replace(/\s&&\s/g, ' AND ').replace(/\s\|\|\s/g, ' OR ');
                            conditionalLogic = conditionalLogic.replace(/\s&&\s/g, ' And ').replace(/\s\|\|\s/g, ' Or ');
                            conditionalLogic = conditionalLogic.replace(/\?/g, ' then ').replace(/\s:\s/g, ' else '); // Replace the : with ' else ' // Replace the ? with ' then '
                            conditionalLogic = conditionalLogic.replace(/^ /, 'if '); // Replace the : with ' else ' // Replace the ? with ' then '
                            conditionalLogic = conditionalLogic.replace(/sections\./g, '') // Replace the : with ' else ' // Replace the ? with ' then '
                            conditionalLogic = conditionalLogic.replace(/\slength\s/g, '()') // Replace the : with ' else ' // Replace the ? with ' then '

                            // dispatch(setNewComponent({ id: 'conditional_logic', value: conditionalLogic, questionId: selectedQuestionId }))
                            setInputValue(conditionalLogic)

                            {
                                !isDefaultLogic &&
                                    setConditions(parseLogicExpression(question.conditional_logic));
                            }
                        }
                    });
                });
            });
        };
        if (selectedQuestionId) {
            findSelectedQuestion(); // Set the existing conditional logic as input value
        }
    }, [selectedQuestionId, allSectionDetails]);

    const handleSave = async () => {
        const sectionId = selectedQuestionId.split('_')[0].length > 1 ? selectedQuestionId.split('_')[0] : selectedQuestionId.split('_')[1];
        console.log(sectionId, 'section id')
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

            const handleError = (message) => {
                setError(message);
                setIsThreedotLoader(false);
            };

            let evalInputValue = modifyString(inputValue);

            if (isDefaultLogic || complianceState) {
                setDefaultString(evalInputValue);
            }
            // Replace `AddDays` with the new Date handling for addition and format as dd/mm/yyyy
            // Replace `AddDays` with the new Date handling for addition and format as dd/mm/yyyy
            // Replace `AddDays` with the new Date handling for addition and format as dd/mm/yyyy
            evalInputValue = evalInputValue.replaceAll(
                /((?:\w+\.)*\w+)\.AddDays\((\d+)\)/g,
                '(function(date) { const result = new Date(date); result.setDate(result.getDate() + $2); return result.toLocaleDateString("en-GB"); })($1)'
            );

            // Replace `SubtractDays` with the new Date handling for subtraction and format as dd/mm/yyyy
            evalInputValue = evalInputValue.replaceAll(
                /((?:\w+\.)*\w+)\.SubtractDays\((\d+)\)/g,
                '(function(date) { const result = new Date(date); result.setDate(result.getDate() - $2); return result.toLocaleDateString("en-GB"); })($1)'
            );



            evalInputValue = evalInputValue
                .replaceAll('Today()', 'new Date()')
                .replaceAll('if', '');
            console.log(evalInputValue, 'evalInputValue')
            let expression = evalInputValue.toString();

            // Replace "and" with "&&", ensuring it's a logical operator, not part of a string or identifier
            expression = expression.replaceAll(/\s+and\s+/g, " && ").replaceAll(/\s+or\s+/g, " || ");
            expression = expression.replaceAll(/\s+And\s+/g, " && ").replaceAll(/\s+Or\s+/g, " || ");
            expression = expression.replaceAll(/\s+AND\s+/g, " && ").replaceAll(/\s+OR\s+/g, " || ");
            evalInputValue = expression
            console.log(evalInputValue, 'evalInputValue')
            // Check for the "includes" method being used without a parameter
            let methods = [
                "AddDays", "SubtractDays", "includes"
            ]
            if (evalInputValue.includes('getMonth')) {
                // Extract the value after `getMonth()` with any comparison operator using regex
                const monthValueMatch = evalInputValue.match(/getMonth\(\)\s*(===|!==|>=|<=|>|<)\s*(\d+)/);

                // Check if a valid match was found
                if (monthValueMatch) {
                    const operator = monthValueMatch[1]; // Capture the operator (e.g., ===, !==, >=, etc.)
                    const monthValue = parseInt(monthValueMatch[2], 10); // Convert extracted value to a number

                    console.log(`Operator: ${operator}, Month Value: ${monthValue}`);

                    // Validate if the month is between 1 and 12
                    if (monthValue < 1 || monthValue > 12) {
                        setError("Invalid month. Please enter a value between 1 and 12.");
                        return;
                    }

                    // Continue with other logic if needed
                } else {
                    setError("Invalid format. Please use the format `getMonth() === value`.");
                    return;
                }
            }

            if (evalInputValue.includes('getDay')) {
                // Extract the value after `getDay()` with any comparison operator using case-insensitive regex
                const dayValueMatch = evalInputValue.match(/getDay\(\)\s*(===|!==|>=|<=|>|<)\s*"(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)"/i);

                // Check if a valid match was found
                if (dayValueMatch) {
                    const operator = dayValueMatch[1]; // Capture the operator (e.g., ===, !==, etc.)
                    const dayValue = dayValueMatch[2].toLowerCase(); // Capture and normalize day value to lowercase

                    console.log(`Operator: ${operator}, Day Value: ${dayValue}`);

                    // Validate day value against valid days (in lowercase)
                    const validDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
                    if (!validDays.includes(dayValue)) {
                        setError("Invalid day. Please enter a valid day from Sunday to Saturday.");
                        return;
                    }

                    // Continue with other logic if needed
                } else {
                    setError("Invalid format. Please use the format `getDay() === \"Day\"`.");
                    return;
                }
            }
            if (evalInputValue.includes('getFullYear')) {
                // Extract the value after `getFullYear()` with any comparison operator using regex
                const yearValueMatch = evalInputValue.match(/getFullYear\(\)\s*(===|!==|>=|<=|>|<)\s*(\d{4,})/);

                // Check if a valid match was found
                if (yearValueMatch) {
                    const operator = yearValueMatch[1]; // Capture the operator (e.g., ===, !==, etc.)
                    const yearValue = parseInt(yearValueMatch[2], 10); // Capture and parse the year value

                    console.log(`Operator: ${operator}, Year Value: ${yearValue}`);

                    // Validate if the year is a valid 4-digit number (between 1000 and 9999)
                    if (isNaN(yearValue) || yearValue < 1000 || yearValue > 9999) {
                        setError("Invalid year. Please enter a valid 4-digit year");
                        return;
                    }

                    // Continue with other logic if needed
                } else {
                    setError("Invalid format. Please use the format `getFullYear() === <year>`.");
                    return;
                }
            }
            if (evalInputValue.includes('getTime')) {
                // Match getTime() with a quoted `hh:mm:ss` format
                const timeMatches = evalInputValue.match(/getTime\(\)\s*(===|!==|>=|<=|>|<)\s*"(\d{2}:\d{2}:\d{2})"/g);

                if (timeMatches) {
                    for (const timeMatch of timeMatches) {
                        const [, operator, timeValue] = timeMatch.match(/getTime\(\)\s*(===|!==|>=|<=|>|<)\s*"(\d{2}:\d{2}:\d{2})"/);

                        console.log(`Operator: ${operator}, Time Value: ${timeValue}`);

                        // Validate `hh:mm:ss` format strictly for each time value
                        const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
                        if (!timePattern.test(timeValue)) {
                            setError(`Invalid time: "${timeValue}". Please enter a valid time in 'hh:mm:ss' format`);
                            return;
                        }
                    }
                    // Continue with other logic if all times are valid
                } else {
                    setError("Invalid format. Please use the format `getTime() === \"hh:mm:ss\"`.");
                    return;
                }
            }
            if (evalInputValue.includes('getSeconds')) {
                // Match getSeconds() with either a quoted 2-digit seconds number or raw number
                const timeMatches = evalInputValue.match(/getSeconds\(\)\s*(===|!==|>=|<=|>|<)\s*"?([0-5]\d)"?/g);

                if (timeMatches) {
                    for (const timeMatch of timeMatches) {
                        const [, operator, seconds] = timeMatch.match(/getSeconds\(\)\s*(===|!==|>=|<=|>|<)\s*"?([0-5]\d)"?/);

                        console.log(`Operator: ${operator}, Seconds Value: ${seconds}`);

                        // Validate that seconds are exactly two digits and between 00 and 59
                        if (!/^[0-5][0-9]$/.test(seconds)) {
                            setError(`Invalid seconds: "${seconds}". Please enter a valid two-digit value between 00 and 59.`);
                            return;
                        }
                    }
                    // Continue with other logic if all times are valid
                } else {
                    setError("Invalid format. Please use the format `getSeconds() === \"ss\"` the seconds should to between 0 - 59 ");
                    return;
                }
            }
            if (evalInputValue.includes('getHours')) {
                // Match getHours() with either a two-digit number and a comparison operator
                const timeMatches = evalInputValue.match(/getHours\(\)\s*(===|!==|>=|<=|>|<)\s*(\d{2})/g);

                if (timeMatches) {
                    for (const timeMatch of timeMatches) {
                        const [, operator, hours] = timeMatch.match(/getHours\(\)\s*(===|!==|>=|<=|>|<)\s*(\d{2})/);

                        console.log(`Operator: ${operator}, Hours Value: ${hours}`);

                        // Ensure the hours value is a two-digit number between 00 and 23
                        if (parseInt(hours) < 0 || parseInt(hours) > 23) {
                            setError(`Invalid hours: "${hours}". The value must be a valid number between 00 and 23.`);
                            return;
                        }
                    }
                    // Continue with other logic if all times are valid
                } else {
                    setError("Invalid format. Please use the format `getHours() === hh` where hh is a two-digit number.");
                    return;
                }
            }
            if (evalInputValue.includes('getMinutes')) {
                // Match getMinutes() with a comparison operator and a two-digit number
                const timeMatches = evalInputValue.match(/getMinutes\(\)\s*(===|!==|>=|<=|>|<)\s*(\d{2})/g);

                if (timeMatches) {
                    for (const timeMatch of timeMatches) {
                        const [, operator, minutes] = timeMatch.match(/getMinutes\(\)\s*(===|!==|>=|<=|>|<)\s*(\d{2})/);

                        console.log(`Operator: ${operator}, Minutes Value: ${minutes}`);

                        // Ensure the minutes value is a two-digit number between 00 and 59
                        if (parseInt(minutes) < 0 || parseInt(minutes) > 59) {
                            setError(`Invalid minutes: "${minutes}". The value must be a valid number between 00 and 59.`);
                            return;
                        }
                    }
                    // Continue with other logic if all times are valid
                } else {
                    setError("Invalid format. Please use the format `getMinutes() === mm` where mm is a two-digit number.");
                    return;
                }
            }
            if (evalInputValue.includes('getMilliseconds')) {
                // Match getMilliseconds() with a comparison operator and a three-digit number
                const timeMatches = evalInputValue.match(/getMilliseconds\(\)\s*(===|!==|>=|<=|>|<)\s*(\d{3,})/g);

                if (timeMatches) {
                    for (const timeMatch of timeMatches) {
                        const [, operator, milliseconds] = timeMatch.match(/getMilliseconds\(\)\s*(===|!==|>=|<=|>|<)\s*(\d{3,})/);

                        console.log(`Operator: ${operator}, Milliseconds Value: ${milliseconds}`);

                        // Ensure the milliseconds value is a number
                        const millisecondsValue = parseInt(milliseconds);

                        // Validate that the milliseconds value is within the range 0 to 999
                        if (millisecondsValue < 0 || millisecondsValue > 999) {
                            setError(`Invalid milliseconds: "${milliseconds}". The value must be between 000 and 999.`);
                            return;
                        }
                    }
                    // Continue with other logic if all times are valid
                } else {
                    setError("Invalid format. Please use the format `getMilliseconds() === nnn` where nnn is a three-digit number.");
                    return;
                }
            }








            const functionCallRegex = new RegExp(`\\.(${methods.join('|')})\\(\\)`, 'g');
            if (functionCallRegex.test(evalInputValue)) {
                handleError('Please pass the parameter inside the function');
                return; // Stop execution if validation fails
            }

            let payloadString = expression;
            evalInputValue = addSectionPrefix(evalInputValue);
            console.log(evalInputValue, 'expression')
            // Extract variable names from the payloadString using a regex
            const variableRegex = /\b(\w+\.\w+\.\w+)\b/g;
            const variableNames = payloadString.match(variableRegex) || [];

            // Validate if all variable names exist in secDetailsForSearching
            const invalidVariables = variableNames.filter(variable => !secDetailsForSearching.includes(variable));

            if (invalidVariables.length > 0) {
                handleError(`Invalid variable name(s): ${invalidVariables.join(', ')}`);
                return;
            }
            if (isDefaultLogic || complianceState) {
                payloadString = payloadString.replaceAll('else', ':')
                    .replaceAll('then', '?')
                    .replaceAll('if', ' ');
                evalInputValue = evalInputValue.replaceAll('else', ':')
                    .replaceAll('then', '?')
                    .replaceAll('if', ' ');
                // Return null as JSX expects a valid return inside {}
            }
            //just checking for datetimefield before the evaluating the expression (only for default checking)
            if ((isDefaultLogic || complianceState) && selectedComponent === "dateTimefield" && (evalInputValue.includes('setDate'))) {
                let invalid = DateValidator(evalInputValue)
                if (invalid) {
                    if (invalid) {
                        handleError(`Error in ${invalid.join(', ')}  (Please follow dd/mm/yyyy format)`);
                        return
                    }
                }
            }
            const result = eval(evalInputValue);
            if (isDefaultLogic) {
                switch (selectedComponent) {
                    case 'choiceboxfield':
                    case 'textboxfield':
                        if (typeof result !== 'string') {
                            handleError('The evaluated result is not a string. Only expects a string.');
                            return;
                        }
                        break;
                    case 'numberfield':
                        const parsedResult = Number(result);

                        // Check if the type is 'integer'
                        if (fieldSettingParams[selectedQuestionId].type === 'integer') {
                            // Ensure result is an integer
                            if (!Number.isInteger(parsedResult) || result.toString().includes('.')) {
                                handleError('The evaluated result should only be an integer.');
                                return;
                            }
                        }
                        // Check if the type is 'float'
                        else if (fieldSettingParams[selectedQuestionId].type === 'float') {
                            // Ensure result is a valid float (allow dot and digits)
                            if (!/^\d+(\.\d+)?$/.test(result)) {
                                handleError('The evaluated result should be a valid float (number and dot).');
                                return;
                            }
                        } else {
                            setError('');  // No error, valid number
                        }
                        break;
                    default:
                        break;
                }
            } else if (complianceState) {
                switch (selectedComponent) {
                    case 'numberfield':
                    case 'choiceboxfield':
                    case 'textboxfield':
                    case 'dateTimefield':
                    case 'assetLocationfield':
                    case 'floorPlanfield':
                    case 'photofield':
                    case 'videofield':
                    case 'filefield':
                    case 'signaturefield':
                    case 'gpsfield':
                    case 'displayfield':
                    case 'compliancelogic':
                    case 'tagScanfield':
                        if (typeof result !== 'string') {
                            handleError('The evaluated result is not a string. The field type expects a string.');
                            return;
                        }
                        break;
                }
            }

            if (!isDefaultLogic && !complianceState) {
                const validationResult = splitAndValidate(evalInputValue);

                if (validationResult.some(msg => msg.includes('Error'))) {
                    handleError(validationResult.join('\n'));
                    return; // Stop execution if validation fails
                }
            }
            if (complianceState) {
                setConditionalLogic((prevLogic) => {
                    const updatedLogic = Array.isArray(prevLogic) ? [...prevLogic] : [];; // Clone the existing state array

                    // Check if the index exists in the array
                    if (updatedLogic[complianceLogicId]) {
                        // Update the `defaultContent` key of the object at the specified index
                        updatedLogic[complianceLogicId].default_content = payloadString; // Replace "yourPayloadString" with your actual payload

                        // Return the updated array to set the new state
                        return updatedLogic;
                    }

                    return prevLogic; // If index doesn't exist, return the original state without changes
                });
            }

            setIsThreedotLoader(true);
            if (!error) {
                handleSaveSection(sectionId, true, payloadString, isDefaultLogic, complianceState);

            } else if (typeof result === 'boolean') {
                handleError('');  // Clear the error since the result is valid
                setIsThreedotLoader(false);
            } else if (isNaN(result)) {
                handleError('Please pass the parameter inside the function');
            } else {
                handleError(result);
            }
        } catch (error) {
            const handleError = (message) => {
                setError(message);
                setIsThreedotLoader(false);
            };
            handleError(`Error evaluating the expression: ${error.message}`);
        }
    };

    function splitAndValidate(expression) {
        console.log(expression, 'njnj')
        const parts = expression.split(/\s*&&\s*|\s*\|\|\s*/);
        const errors = [];

        // Define the list of methods that don't require an operator
        const typeMethods = ["includes()"];   // Update the regex to match valid expressions

        const validExpressionRegex = /^[a-zA-Z0-9_\.]+(?:\([^\)]*\))?\s*(===|==|!==|>|<|>=|<=)\s*("[^"]*"|\d+|[a-zA-Z0-9_\.]+)$/;

        // Define a regex to detect incomplete expressions (e.g., missing operators or values)
        const incompleteExpressionRegex = /^[a-zA-Z0-9_\.]+(?:\([^\)]*\))?$/;

        // Regex for valid date format (dd/mm/yyyy)
        const validDateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

        parts.forEach((part, index) => {
            part = part.replace(/^\s+|\s+$/g, '');

            // Check for incomplete expressions
            part = trimParentheses(part)
            if (part.includes('includes(')) {

            } else {
                part = part.replace(/[()]/g, '')
            }
            //trimming the conditions to avoid space issue
            part = part.trim();
            const displayPart = part.replace(/sections\./g, '');

            // Check if the expression contains any method from the typeMethods list
            const containsTypeMethod = typeMethods.some(method => part.includes(method));

            //checking for the includes 
            if (part.includes('includes(')) {
                const result = part.match(/includes\((["'])(.*?)\1\)/)[2]; // Extract the string inside the includes() parentheses
                if (!result) {
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
            else if (selectedType === 'date' && (expression.includes('setDate'))) {
                const dateMatch = part.match(/===\s*(.*)$/);  // Capture the value after '==='
                if (dateMatch) {
                    const value = dateMatch[1].trim().replace(/"/g, ''); // Remove quotes

                    // Validate date value (either "Today" or a valid date format)
                    if (value !== 'Today' && (expression.includes('setDate')) && !validDateRegex.test(value)) {
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
        const sectionId = selectedQuestionId.split('_')[0].length > 1 ? selectedQuestionId.split('_')[0] : selectedQuestionId.split('_')[1];

        handleSaveSection(sectionId, true, condition_logic);
        dispatch(setNewComponent({ id: 'conditional_logic', value: condition_logic, questionId: selectedQuestionId }));
    }

    return (
        <>
            <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>
                <div ref={modalRef} className='w-[80%] h-[83%] mx-auto bg-white rounded-[14px] relative p-[18px] '>
                    <div className='w-full'>
                        {(tab === 'advance' || isDefaultLogic || complianceState) ? (
                            <div className='flex h-customh14'>
                                <div className='w-[60%]'>
                                    {!isDefaultLogic ?
                                        <p className='text-start text-lg text-[#2B333B] font-semibold'>Shows when...</p>
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
                                        isDefaultLogic={isDefaultLogic}
                                    />
                                </div>
                                <div className='w-[40%]'>
                                    <StaticDetails
                                        handleTabClick={handleTabClick}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        isDefaultLogic={isDefaultLogic}
                                        selectedFieldType={selectedFieldType}
                                        isOperatorModal={isOperatorModal}
                                        setIsOperatorModal={setIsOperatorModal}
                                        setIsStringMethodModal={setIsStringMethodModal}
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
                        <div className={`${isDefaultLogic || complianceState ? 'flex justify-end items-end w-full' : 'flex justify-between items-end'}`}>
                            {!isDefaultLogic && !complianceState &&
                                <div className='flex gap-5 items-end'>
                                    <button onClick={() => setTab('basic')} className={tab === 'advance' ? 'text-lg text-[#9FACB9] font-semibold px-[1px] border-b-2 border-white cursor-pointer' : 'text-[#2B333B] font-semibold px-[1px] border-b-2 border-[#2B333B] text-lg cursor-pointer'}>Basic Editor</button>
                                    <p data-testId="advance-editor-tab" onClick={() => setTab('advance')} className={tab === 'basic' ? 'text-lg text-[#9FACB9] font-semibold px-[1px] border-b-2 border-white cursor-pointer' : 'text-[#2B333B] font-semibold px-[1px] border-b-2 border-[#2B333B] text-lg cursor-pointer'}>Advanced Editor</p>
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
                                    onClick={(tab == 'advance' || isDefaultLogic || complianceState) ? handleSave : handleSaveBasicEditor}
                                    type='button'
                                    data-testid='cancel'
                                    className='w-[139px] h-[50px] border text-white border-[#2B333B] bg-[#2B333B] hover:bg-black text-base font-semibold ml-[28px]'
                                    isThreedotLoading={isThreedotLoader}
                                >
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {(isOperatorModal || isStringMethodModal) &&
                <OperatorsModal
                    setIsOperatorModal={setIsOperatorModal}
                    isOperatorModal={isOperatorModal}
                    setIsStringMethodModal={setIsStringMethodModal}
                    isStringMethodModal={isStringMethodModal}
                />
            }
        </>
    );
}

export default ConditionalLogic;