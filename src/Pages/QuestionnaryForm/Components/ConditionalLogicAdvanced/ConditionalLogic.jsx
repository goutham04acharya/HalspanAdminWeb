
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
import { setComplianceLogicCondition, setNewComponent, setNewLogic } from '../Fields/fieldSettingParamsSlice';
import BasicEditor from './Components/BasicEditor/BasicEditor';
import { buildConditionExpression, buildLogicExpression } from '../../../../CommonMethods/BasicEditorLogicBuilder';
import GlobalContext from '../../../../Components/Context/GlobalContext';
import dayjs from 'dayjs';
import OperatorsModal from '../../../../Components/Modals/OperatorsModal';
import { DateValidator } from './DateFieldChecker';
import { defaultContentConverter } from '../../../../CommonMethods/defaultContentConverter';
import ComplianceBasicEditor from './Components/ComplianceLogicBasicEditor/ComplianceBasicEditor';
import { generateElseBlockString, generateTernaryOperation, generateThenActionString } from '../../../../CommonMethods/ComplianceBasicEditorLogicBuilder';
import parseExpression from '../../../../CommonMethods/advancedToBasicLogic';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { formatDate, reverseFormat, reversingFormat } from "../../../../CommonMethods/FormatDate";


// Extend Day.js with the custom parse format plugin
dayjs.extend(customParseFormat);

function ConditionalLogic({ setConditionalLogic, conditionalLogic, handleSaveSection, isDefaultLogic, setIsDefaultLogic, setDefaultString, defaultString, complianceState, setSectionConditionLogicId, sectionConditionLogicId, pageConditionLogicId, setPageConditionLogicId,
    setCompliancestate, complianceLogic, setComplianceLogic, sectionsData, setConditions, conditions, setSectionDetails, sectionDetails, editorCheck, setEditorCheck, questionWithUuid }) {

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
    const [questionType, setQuestionType] = useState([])
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
    const [showChoiceValues, setShowChoiceValues] = useState(false)
    const [logic, setLogic] = useState('')
    const [isChoiceboxField, setIsChoiceboxField] = useState(false);
    const [choiceboxValues, setChoiceboxValues] = useState([])
    const [complianceCondition, setComplianceCondition] = useState('')
    const [datetimefieldQuestions, setDatetimefieldQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState('')
    const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);
    const complianceLogicCondition = useSelector(state => state.fieldSettingParams.conditions);
    const conditionalLogicData = useSelector(state => state.fieldSettingParams.editorToggle)
    const { complianceLogicId } = useSelector((state) => state?.questionnaryForm)
    const [choiceBoxOptions, setChoiceBoxOptions] = useState({});
    const [ evaluateObject,setEvaluateObject] = useState({})
    const [userInput, setUserInput] = useState({
        ifStatements: [],
        elseIfStatements: [],
        elseStatement: {}
    });
    const [render, setRender] = useState(0);
    const complianceInitialState = [
        {
            'conditions': [
                {
                    'question_name': '',
                    'condition_logic': '',
                    'value': '',
                    'dropdown': false,
                    'condition_dropdown': false,
                    'condition_type': 'textboxfield',
                },
            ]
        }
    ]

    useEffect(() => {
        const choiceBoxOptionsObj = {};
        questionType.forEach((question) => {
            if (fieldSettingParams[question.question_id] && fieldSettingParams[question.question_id].componentType === 'choiceboxfield') {
                if (fieldSettingParams[question?.question_id]?.source === 'fixedList') {
                    choiceBoxOptionsObj[question.question_id] = fieldSettingParams[question.question_id].fixedChoiceArray
                } else {
                    choiceBoxOptionsObj[question.question_id] = fieldSettingParams[question.question_id].lookupOptionChoice;
                }
            }
        }
        );
        setChoiceBoxOptions(choiceBoxOptionsObj);
    }, [questionType, fieldSettingParams]);

    const combinedArray = questionType.map((question) => {
        const choiceValues = choiceBoxOptions[question.question_id] || [];
        return {
            question_detail: question.question_detail,
            question_type: question.question_type,
            choice_values: choiceValues,
            type: question.type
        };
    });
    // Define string and date methods
    const stringMethods = ["toUpperCase()", "toLowerCase()", "trim()", "includes()"];
    const dateTimeMethods = ["AddDays()", "SubtractDays()", "getFullYear()", "getMonth()", "getDate()", "getDay()", "getHours()", "getMinutes()", "getSeconds()", "getMilliseconds()", "getTime()"];
    const dateMethods = ["AddDays()", "SubtractDays()", "getFullYear()", "getMonth()", "getDate()", "getDay()"]
    const timeMethods = ["getHours()", "getMinutes()", "getSeconds()", "getMilliseconds()", "getTime()"]
    const fileMethods = ["()"];
    const notRequiredConditions = ["toUpperCase()", "toLowerCase()", "trim()"].concat(dateTimeMethods).concat(dateMethods).concat(timeMethods).concat(fileMethods)

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
        setSectionConditionLogicId('');
        setPageConditionLogicId('');
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
        const questionDetailsArray = [];
        // Access the sections from the data object
        allSectionDetails?.sections?.forEach((section) => {
            const sectionName = section.section_name;

            // Access pages within each section
            section.pages?.forEach((page) => {
                const pageName = `${sectionName}.${page.page_name}`;

                // Access questions within each page
                page.questions?.forEach((question) => {
                    if (question.question_id !== selectedQuestionId && (!['assetLocationfield', 'floorPlanfield', 'signaturefield', 'gpsfield', 'displayfield'].includes(question?.component_type))) {
                        const questionName = `${pageName}.${question.question_name}`;
                        sectionDetailsArray.push(questionName); // Add section.page.question
                        questionDetailsArray.push({
                            'question_type': question?.component_type,
                            'question_id': question?.question_id,
                            'question_name': question?.question_name,
                            'question_detail': questionName,
                            'type': question?.type
                        });
                    }
                });
            });
        });
        // Return the array containing all the details
        setSecDetailsForSearching(sectionDetailsArray);
        setQuestionType(questionDetailsArray);
    };

    //function for filtering for the basic editor -- does not need section and page
    const filterQuestions = () => {
        // Initialize an empty array to hold the flattened details
        const sectionDetailsArray = [];

        // Access the sections from the data object
        allSectionDetails?.sections?.forEach((section) => {
            const sectionName = section.section_name;
            // sectionDetailsArray.push(sectionName); // Add the section name

            // Access pages within each section
            section.pages?.forEach((page) => {
                const pageName = `${sectionName}.${page.page_name}`;
                // sectionDetailsArray.push(pageName); // Add section.page

                // Access questions within each page
                page.questions?.forEach((question) => {
                    const questionId = question?.question_id;
                    const questionName = `${pageName}.${question.question_name}`;
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
        dispatch(setAllSectionDetails(sectionDetails));
        handleQuestionnaryObject(sectionDetails);
        setIsThreedotLoaderBlack(false);
    }
    useEffect(() => {
        handleListSectionDetails();
        let condition_logic = getFinalComplianceLogic(conditions)
        if (condition_logic !== '' || condition_logic !== undefined) {
            condition_logic
                ?.replace(/ACTIONS\.push\(['"](.*?)['"]\)/g, `ACTIONS += '$1'`) // Replace ACTION.push logic
                ?.replace('/\b(?<!\w\.)\?(?!\w+\))/g', ' then ')
                ?.replace(/&&/g, 'and') // Replace && with and
                ?.replace(/||/g, 'or') // Replace || with or
                ?.replace(/.length/g, '.()')
        }
        if (condition_logic?.includes(':')) {
            // Split by colon and rebuild with "else if" and "else" logic
            const parts = condition_logic.split(':');
            const lastPart = parts.pop(); // Remove the last part
            condition_logic = parts.map(part => part.trim()).join(' else if ') + ' else ' + lastPart.trim();
        }

        // if (!condition_logic && complianceLogic && defaultContentConverter(complianceLogic?.[0]?.default_content) && !isDefaultLogic) {
        //     setToastError(`Oh no! To use the basic editor you'll have to use a simpler expression.Please go back to the advanced editor.`);
        // }



        // Check if the toast should be shown
        if (complianceState) {
            if (editorCheck.isAdvanceEditorCompliance) {
                setToastError(
                    `Oh no! To use the basic editor you'll have to use a simpler expression. Please go back to the advanced editor.`
                );
            }
        } else {
            // Find the question in conditionalEditor array
            const existingQuestion = editorCheck.conditonalEditor.find(
                (item) => item.questionId === selectedQuestionId
            );

            // If the question exists and isAdvanceEditor is true, show the toast
            if (existingQuestion?.isAdvanceEditor) {
                setToastError(
                    `Oh no! To use the basic editor you'll have to use a simpler expression. Please go back to the advanced editor.`
                );
            }
        }

    }, [conditions])



    useEffect(() => {
        if (allSectionDetails) {
            filterSectionDetails(); // Call this when the state is updated
        }
    }, [allSectionDetails]);

    function handleQuestionnaryObject(allSectionDetails) {
        let result = {};
        let evalObject ={}
        if (allSectionDetails?.sections && allSectionDetails?.sections.length > 0) {
            allSectionDetails.sections.forEach((section) => {
                const sectionKey = section.section_name;
                let sectionObject = {
                    [sectionKey]: {}
                };
                if (section.pages && section.pages.length > 0) {
                    section.pages.forEach((page) => {
                        const pageKey = page.page_name;
                        sectionObject[sectionKey][pageKey] = {};

                        if (page.questions && page.questions.length > 0) {
                            page.questions.forEach((question) => {
                                if (question?.component_type === 'dateTimefield') {
                                    datetimefieldQuestions.push(question); // Push to temporary array
                                }
                                const questionKey = question.question_name;
                                const fieldType = getFieldType(question.component_type);
                                sectionObject[sectionKey][pageKey][questionKey] = fieldType;
                                evalObject[question.question_id.replace(/-/g, '_')] = fieldType;
                            });
                        }
                    });
                }

                result = {
                    ...result,
                    ...sectionObject
                }
                setSections(result);
                setEvaluateObject(evalObject)
            });
            setDatetimefieldQuestions(datetimefieldQuestions);
        }
    }

    // Handle input change and check for matches
    const handleInputField = (event, sections) => {

        setError('');
        // handleClickToInsert(suggestion, false, valueType);
        setShowMethodSuggestions(false);
        setShowSectionList(true)
        const value = event.target.value;
        // let questionName = value?.split('.')[2]?.replace('_', ' ');
        const regex = /\b[^.\s]+ [^.\s]+\.[^.\s]+ [^.\s]+\.[^.\s]+ [^.\s]+\b/g;
        let questionMatches = value.match(regex);
        setLogic(value);
        setInputValue(value)
        const updatedLogic = parseExpression(value)
        // setConditions(updatedLogic)
        const cursorPosition = event.target.selectionStart; // Get the cursor position
        // If the last character is a dot, check the field type and show method suggestions
        if (value[cursorPosition - 1] === '.') {
            if (selectedFieldType === 'textboxfield, choiceboxfield, assetLocationfield, floorPlanfield, signaturefield, gpsfield, displayfield') {
                setSuggestions(stringMethods);
                setShowMethodSuggestions(true);
            } else if (selectedFieldType === 'dateTimefield') {
                // Find the question with the matching ID
                const matchedQuestion = datetimefieldQuestions.find((question) =>
                    questionMatches?.some((match) => match?.split('.')[2]?.replaceAll('_', ' ') === question.question_name)
                );
                // Check the type and set suggestions accordingly
                if (matchedQuestion) {
                    switch (matchedQuestion.type) {
                        case 'date':
                            setSuggestions(dateMethods);
                            break;
                        case 'time':
                            setSuggestions(timeMethods);
                            break;
                        case 'datetime':
                            setSuggestions(dateTimeMethods);
                            break;
                        default:
                            setSuggestions([]); // Default case if type is not recognized
                            break;
                    }
                    setShowMethodSuggestions(true);
                } else {
                    console.warn('No matching question found for the selectedQuestionId.');
                    setShowMethodSuggestions(false);
                }
            }
            else if (selectedFieldType.includes('photofield')) {
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
                        setSuggestions(dateTimeMethods);
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
            const cursorPosition = textarea.selectionStart;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const textBefore = textarea.value.substring(0, start);
            const textAfter = textarea.value.substring(end);
            const charBeforeCursor = cursorPosition > 0 ? textarea.value[cursorPosition - 1] : '';
            let newText;

            if ((charBeforeCursor === ' ' || charBeforeCursor === '.' || charBeforeCursor === `'`) || cursorPosition === 0) {
                newText = textBefore + textToInsert + textAfter;
            } else {
                const lastSpaceIndex = textBefore.lastIndexOf(' ');
                const textToKeep = textBefore.slice(0, lastSpaceIndex + 1);
                newText = textToKeep + textToInsert + textAfter;
            }

            textarea.value = newText;

            // Handle includes()
            if (textToInsert === 'includes()') {
                const includesIndex = newText.indexOf('includes()');
                if (includesIndex !== -1) {
                    const updatedText = newText.replace('includes()', `includes('')`);
                    textarea.value = updatedText;

                    const cursorPosition = includesIndex + 'includes("'.length;
                    setTimeout(() => {
                        textarea.setSelectionRange(cursorPosition, cursorPosition);
                        textarea.focus();
                    }, 0);
                }
            }

            setShowSectionList(false);
            setInputValue(textarea.value);
            setLogic(textarea.value);

            // 🔎 Check if selectedQuestion is a 'choiceboxfield'
            const matchedQuestion = combinedArray?.find(
                (item) =>
                    item?.question_detail === selectedQuestion &&
                    item?.question_type === "choiceboxfield"
            );

            if (matchedQuestion) {
                setChoiceboxValues(matchedQuestion.choice_values);
            } else {
                setChoiceboxValues([]);
            }

            if (isMethod) {
                setShowMethodSuggestions(false);
                setShowChoiceValues(true); // Automatically show choice values
                setIsChoiceboxField(true);
                setShowSectionList(true)
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
                        fieldType = ['numberfield'];
                        break;
                    case 'array':
                        fieldType = ['photofield', 'videofield', 'filefield'];
                        break;
                    case 'date':
                        fieldType = ['dateTimefield'];
                        break;
                    default:
                        fieldType = [];
                }
                setSelectedFieldType(fieldType.join(', '));
            }
        }
    };

    function getDetails(path, data) {
        // Step 1: Split the path by '.' to get section, page, and question names
        const [sectionPart, pagePart, questionPart] = path.split('.');
        // Step 2: Replace underscores with spaces to match the actual names
        const sectionName = sectionPart;
        const pageName = pagePart;
        const questionName = questionPart;

        // Step 3: Search for the matching section in the data
        const matchingSection = data?.find(section => section?.section_name === sectionName);
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
        // Default structure if no expression is provided
        if (!expression || expression === '') {
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
            }];
        }

        // Helper function to trim parentheses
        const trimParentheses = (expression) => {
            let trimmedExpression = expression.trim();

            // Remove outer parentheses if they exist
            while (trimmedExpression.startsWith('(') && trimmedExpression.endsWith(')')) {
                // Check if these are matching outer parentheses
                let count = 0;
                let isMatchingPair = true;

                for (let i = 0; i < trimmedExpression.length; i++) {
                    if (trimmedExpression[i] === '(') count++;
                    if (trimmedExpression[i] === ')') count--;

                    // If count goes negative before the end, these aren't matching outer parentheses
                    if (count < 0 && i < trimmedExpression.length - 1) {
                        isMatchingPair = false;
                        break;
                    }
                }

                // Only trim if we found matching outer parentheses
                if (isMatchingPair && count === 0) {
                    trimmedExpression = trimmedExpression.slice(1, -1).trim();
                } else {
                    break;
                }
            }

            return trimmedExpression;
        };
        // Helper function to convert a timestamp into a date string
        const convertTimestampToDate = (timestamp) => {
            const date = timestamp.split('/')[0].length === 1 ? `0${timestamp}` : timestamp;
            return date
        };
        // Helper function to parse date conditions
        const parseDateCondition = (condition) => {
            const pattern = /formatDateWithOffset\('([^']+)',\s*(\d+),\s*([\w_.]+)\)/;
            const match = condition?.match(pattern);
            if (!match) {
                return null;
            }
            const [_, timestamp, offsetDays, question_name] = match;
            const question = getDetails(question_name.trim(), allSectionDetails.sections);
            let passingDate = convertTimestampToDate(timestamp);
            passingDate = dayjs(passingDate, 'DD/MM/YYYY');
            return {
                question_name: question_name.trim(),
                condition_logic: 'date is “X” date of set date',
                value: offsetDays,
                dropdown: false,
                condition_dropdown: false,
                condition_type: question?.component_type,
                date: passingDate
            };
        };

        // Parse individual conditions in each group
        const parseConditions = (group) => {
            const conditions = group.split('&&').map(condition => {
                condition = trimParentheses(condition);
                const dateCondition = parseDateCondition(condition);
                if (dateCondition) return dateCondition;
                // Regex to match logical conditions
                // const matches = condition.match(/^\s*(!?)\s*([\w.()[\]{}\-+*%&^$#@!|\\/<>?:`'"]+)\s*(\.includes|\?.includes|does not include|===|!==|<|>|<=|>=)\s*(['"]([^'"]*)['"]|\(([^()]*)\)|\d+|new\s+Date\(\))/);
                // const matches = condition.match(/^\s*(!?)\s*([\w\s.()[\]{}\-+*%&^$#@!|\\/<>?:`'"]+)\s*(\.includes|\?.includes|does not include|===|==|!==|<|>|<=|>=)\s*(['"]([^'"]*)['"]|\(([^()]*)\)|\d+|new\s+Date\(\))/);
                const matches = condition.match(/^\s*(!?)\s*([^\n]+?)\s*(\.includes|\?.includes|does not include|===|==|!==|<|>|<=|>=)\s*(['"]([^'"]*)['"]|\(([^()]*)\)|\d+|new\s+Date\(\))/);

                if (matches) {
                    // Destructure the match to extract question name, logic, and value
                    let [, negate, question_name, condition_logic, value] = matches;
                    // If the negate flag is present, adjust the condition logic
                    if (question_name.includes('.length')) {
                        question_name = question_name.replaceAll('.length', '');
                    }
                    let question = getDetails(question_name.trim(), allSectionDetails.sections);
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
                        if ((condition_logic === '===' || condition_logic === '==') && value == 0) condition_logic = 'has no files'
                        else if (condition_logic === '>=' || condition_logic === '=>') condition_logic = 'has atleast one file';
                        else if (condition_logic === '===' || condition_logic === '==') condition_logic = 'number of file is';

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
                            if (condition_logic === '===' || condition_logic === '==') condition_logic = 'equals';
                            else if (condition_logic === '!==') condition_logic = 'not equals to';
                            else if (condition_logic === '<') condition_logic = 'smaller';
                            else if (condition_logic === '>') condition_logic = 'larger';
                            else if (condition_logic === '<=') condition_logic = 'smaller or equal';
                            else if (condition_logic === '>=') condition_logic = 'larger or equal';
                        }
                    } else {
                        // Convert logical operators to corresponding values in conditions
                        if (condition_logic === '===' || condition_logic === '==') condition_logic = 'equals';
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

                return null;
            });

            return {
                conditions: conditions.filter(c => c !== null)
            };
        };

        const conditionGroups = expression.split('||').map(group => trimParentheses(group));

        const parsedConditions = conditionGroups.map(group => parseConditions(group));

        // Check if total conditions exceed the limit
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
                    const selectedLogic = complianceLogic[complianceLogicId];
                    // Use defaultContentConverter to transform default_content if selectedLogic exists
                    if (selectedLogic) {
                        const transformedContent = defaultContentConverter(selectedLogic.default_content);
                        setConditions(parseLogicExpression(transformedContent));
                        setInputValue(replaceUUIDs(transformedContent, questionWithUuid));
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
            //adding this to check whether the advane editor or the default logic
            let conditionalLogic = ''
            if (sectionConditionLogicId) {
                const section = sectionsData.find(section => section.section_id === sectionConditionLogicId);
                // Get the section_condition_logic if it exists
                const sectionConditionLogic = section?.section_conditional_logic || '';
                conditionalLogic = sectionConditionLogic
            } else if (pageConditionLogicId) {
                const sectionId = pageConditionLogicId.split('_')[0]
                const section = sectionsData.find(section => section.section_id.includes(sectionId));
                const page = section?.pages.find(page => page.page_id.includes(pageConditionLogicId));
                const pageConditionLogic = page?.page_conditional_logic || '';
                conditionalLogic = pageConditionLogic;
            } else if (isDefaultLogic) {
                conditionalLogic = replaceUUIDs(fieldSettingParams[selectedQuestionId]['default_conditional_logic'] || '', questionWithUuid);
            } else {
                conditionalLogic = fieldSettingParams[selectedQuestionId]['conditional_logic'] || '';
                // dispatch(setNewComponent({ id: 'conditional_logic', value: conditionalLogic, questionId: selectedQuestionId }));
            }
            // Replace && with "and" and || with "or"
            conditionalLogic = conditionalLogic.replace(/\s&&\s/g, ' and ').replace(/\s\|\|\s/g, ' or ');
            conditionalLogic = conditionalLogic.replace(/\s&&\s/g, ' AND ').replace(/\s\|\|\s/g, ' OR ');
            conditionalLogic = conditionalLogic.replace(/\s&&\s/g, ' And ').replace(/\s\|\|\s/g, ' Or ');
            // conditionalLogic = conditionalLogic.replace(/\b(?<!\w\.)\?(?!\w+\))/g, ' then ').replace(/\s:\s/g, ' else '); // Replace the : with ' else ' // Replace the ? with ' then '
            conditionalLogic = conditionalLogic.replace(/^ /, 'if '); // Replace the : with ' else ' // Replace the ? with ' then '
            conditionalLogic = conditionalLogic.replace(/sections\./g, '') // Replace the : with ' else ' // Replace the ? with ' then '
            conditionalLogic = conditionalLogic.replace(/\.length\b/g, '.()');
            conditionalLogic = conditionalLogic.replaceAll(
                /new Date\(new Date\((\w+\.\w+\.\w+)\)\.setDate\(new Date\(\1\)\.getDate\(\) \+ (\d+)\)\)\.toLocaleDateString\("en-GB"\)/g,
                '$1.AddDays($2)'
            );
            conditionalLogic = conditionalLogic.replaceAll(
                /new Date\(new Date\((\w+\.\w+\.\w+)\)\.setDate\(new Date\(\1\)\.getDate\(\) - (\d+)\)\)\.toLocaleDateString\("en-GB"\)/g,
                '$1.SubtractDays($2)'
            );
            // dispatch(setNewComponent({ id: 'conditional_logic', value: conditionalLogic, questionId: selectedQuestionId }))
            // Conditional transformation for `?` and `:`, skipping valid question names
            const questionRegex = /([a-zA-Z0-9_]+\.[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+\??)/g;
            const parts = conditionalLogic.split(questionRegex);
            //this function is for not to replace the special char in the question name
            conditionalLogic = parts
                .map(part => {
                    // Transform only non-question parts
                    if (!questionRegex.test(part)) {
                        return part
                            .replaceAll(/\s\?\s/g, ' then ') // Replace "?" with "then"
                            .replaceAll(/\s:\s/g, ' else ') // Replace ":" with "else"
                    }
                    return part; // Leave question names unchanged
                })
                .join('');

            setInputValue(conditionalLogic);
        };
        if (selectedQuestionId || sectionConditionLogicId || pageConditionLogicId || isDefaultLogic) {
            findSelectedQuestion(); // Set the existing conditional logic as input value
        }
    }, [selectedQuestionId]);


    function initializeQuestionValues(questionWithUuid) {
        return Object.values(questionWithUuid).reduce((acc, uuid) => {
            // Replace dashes with underscores in the UUID
            const sanitizedUuid = uuid.replace(/-/g, '_');
            // Initialize each question value as empty string (or you could use null)
            acc[sanitizedUuid] = '';
            return acc;
        }, {});
    }
    console.log(sections,'popo')
    const handleSave = async () => {
        if (!complianceState) {
            setEditorCheck((prev) => {
                const updatedConditionalEditor = prev.conditonalEditor.map((item) =>
                    item.questionId === selectedQuestionId
                        ? { ...item, isBasicEditor: false, isAdvanceEditor: true }
                        : item
                );

                // Check if the question already exists
                const questionExists = prev.conditonalEditor.some(
                    (item) => item.questionId === selectedQuestionId
                );

                return {
                    ...prev,
                    conditonalEditor: questionExists
                        ? updatedConditionalEditor // Update existing
                        : [
                            ...prev.conditonalEditor,
                            { questionId: selectedQuestionId, isBasicEditor: false, isAdvanceEditor: true }
                        ] // Add new if not exists
                };
            });
        } else {
            setEditorCheck((prev) => ({
                ...prev,
                isBasicEditorCompliance: false,
                isAdvanceEditorCompliance: true
            }));
        }

        let sectionId = selectedQuestionId.split('_')[0].length > 1 ? selectedQuestionId.split('_')[0] : selectedQuestionId.split('_')[1];
        if (sectionConditionLogicId) {
            sectionId = sectionConditionLogicId
        }
        if (pageConditionLogicId) {
            sectionId = pageConditionLogicId.split('_')[0]
        }

        setShowSectionList(false);

        try {
            const addSectionPrefix = (input) => {
                return input.replace(/\b([\w\s]+\.[\w\s]+\.[\w\s]+)\b/g, 'evaluateObject.$1');
            };

            const handleError = (message) => {
                setError(message);
                setIsThreedotLoader(false);
            };
            setComplianceCondition(inputValue)
            let evalInputValue = inputValue.replaceAll('.()', '.length');

            if (isDefaultLogic || complianceState) {
                setDefaultString(evalInputValue);
            }
            // Replace `AddDays` with the new Date handling for addition and format as dd/mm/yyyy
            evalInputValue = evalInputValue.replaceAll(
                /(\w+\.\w+\.\w+)\.AddDays\((\d+)\)/g,
                'new Date(new Date($1).setDate(new Date($1).getDate() + $2)).toLocaleDateString("en-GB")'
            );
            // Replace `SubtractDays` with the new Date handling for subtraction and format as dd/mm/yyyy
            evalInputValue = evalInputValue.replaceAll(
                /(\w+\.\w+\.\w+)\.SubtractDays\((\d+)\)/g,
                'new Date(new Date($1).setDate(new Date($1).getDate() - $2)).toLocaleDateString("en-GB")'
            );

            evalInputValue = evalInputValue.replaceAll(/ACTIONS?\s*\+=\s*"(.*?)"/g, `ACTIONS.push('$1')`)
                .replaceAll('if', '')
                .replaceAll('if', ' ')

            if (complianceState) {

                evalInputValue = evalInputValue.replaceAll('{', '(')
                    .replaceAll('else', ':')
                    .replaceAll('then', '?')
                    .replaceAll('}', ')')
            }

            // Replace "and" with "&&", ensuring it's a logical operator, not part of a string or identifier
            evalInputValue = evalInputValue.replaceAll(/\s+and\s+/g, " && ").replaceAll(/\s+or\s+/g, " || ");
            evalInputValue = evalInputValue.replaceAll(/\s+And\s+/g, " && ").replaceAll(/\s+Or\s+/g, " || ");
            evalInputValue = evalInputValue.replaceAll(/\s+AND\s+/g, " && ").replaceAll(/\s+OR\s+/g, " || ");
            let expression = evalInputValue.toString();

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

                    // Validate if the month is between 1 and 12
                    if (monthValue < 1 || monthValue > 12) {
                        setError("Invalid month. Please enter a value between 1 and 12.");
                        return;
                    }

                    // Continue with other logic if needed
                } else {
                    setConditions
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
            // if(evalInputValue.includes('Today')){
            //     evalInputValue = evalInputValue.replace(/Today/g, `new Date().toISOString().split('T')[0]`);
            // }


            const functionCallRegex = new RegExp(`\\.(${methods.join('|')})\\(\\)`, 'g');
            if (functionCallRegex.test(evalInputValue)) {
                handleError('Please pass the parameter inside the function');
                return; // Stop execution if validation fails
            }

            console.log(evalInputValue, 'evalInputValue');
            let payloadString = expression;
            evalInputValue = addSectionPrefix(evalInputValue);
            // Extract variable names from the payloadString using a regex
            // const variableRegex = /\b(\w+\.\w+\.\w+)\b/g;
            const variableRegex = /^\w+\.\w+\.[^\.]+$/;
            const variableNames = payloadString.match(variableRegex) || [];

            // Validate if all variable names exist in secDetailsForSearching
            // const invalidVariables = variableNames.filter(variable => !secDetailsForSearching.includes(variable));
            //this function is for considering the special char as a valid expression
            // const invalidVariables = variableNames.filter(variable => {
            //     // Normalize and sanitize the variable name (e.g., remove special characters for comparison)
            //     const sanitizedVariable = variable.replaceAll(/[^\w.]/g, ''); // Remove special characters except dots
            //     return !secDetailsForSearching.some(item => {
            //         const sanitizedItem = item.replace(/[^\w.]/g, ''); // Remove special characters in the searchable list
            //         return sanitizedItem === sanitizedVariable;
            //     });
            // });

            // if (invalidVariables.length > 0) {
            //     handleError(`Invalid variable name(s): ${invalidVariables.join(', ')}`);
            //     return;
            // }
            if (isDefaultLogic || complianceState) {
                payloadString = payloadString.replaceAll('else', ':')
                    .replaceAll('then', '?')
                    .replaceAll('if', ' ');
                evalInputValue = evalInputValue.replaceAll('else', ':')
                    .replaceAll('then', '?')
                    .replaceAll('if', ' ');
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
            let STATUS = ''
            let ACTIONS = []
            let REASON = ''
            let GRADE = '';
            const questionValues = initializeQuestionValues(questionWithUuid);
            console.log(questionValues, "questionValues")
            // evalInputValue = Object.keys(questionWithUuid).reduce((logic, questionName) => {
            //     let sanitizedUuid = (questionWithUuid[questionName] || "").replace(/-/g, '_');
            //     let replacement = `${sanitizedUuid}`;
            //     return logic.replace(new RegExp(`\\b${questionName}\\b`, 'g'), replacement);
            // }, evalInputValue);
            evalInputValue = Object.keys(questionWithUuid).reduce((logic, questionName) => {
                // Escape all special regex characters
                let escapedQuestionName = questionName.replace(/[-[\]{}()*+?.,\\^$|#\s/~`!@#%^&_=:"';<>]/g, '\\$&');
                return logic.replace(new RegExp(escapedQuestionName, 'g'), questionWithUuid[questionName].replace(/-/g, '_')).trim();
            }, evalInputValue);

            // **Fix: Remove unwanted `questionWithUuid.` reference**
            if (evalInputValue.includes('bddtest#')) {
                evalInputValue = evalInputValue.replace(/bddtest#/g, "");
            }
            evalInputValue = evalInputValue.replace(/questionWithUuid\./g, "");
            const wrappedEval = `(function(questionValues) { 
                                        try {
                                            return ${evalInputValue};
                                        } catch (error) {
                                            console.error("Evaluation error:", error);
                                            return false;
                                        }
                                     })(${JSON.stringify(questionValues)})`;
            const result = eval(wrappedEval);
            if (isDefaultLogic || complianceState) {
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
                    const updatedLogic = Array.isArray(prevLogic) ? [...prevLogic] : []; // Clone the existing state array

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
                if (complianceState) {
                    payloadString = evalInputValue;
                    setInputValue(payloadString)
                    setConditions(complianceInitialState)
                    dispatch(setComplianceLogicCondition(complianceInitialState))
                    handleSaveSection(sectionId, true, payloadString, isDefaultLogic, complianceState);
                    return;
                }
                
                evalInputValue = evalInputValue.replace(/evaluateObject\./g, "");questionWithUuid
                console.log(evalInputValue, 'at end')
                handleSaveSection(sectionId, true, evalInputValue, isDefaultLogic, complianceState);

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
        expression = trimParentheses(expression)
        const parts = expression.split(/\s*&&\s*|\s*\|\|\s*/);
        const errors = [];
        // Define the list of methods that don't require an operator
        const typeMethods = ["includes()"];   // Update the regex to match valid expressions
        // const validExpressionRegex = /^\(?\s*[a-zA-Z0-9_\.]+(?:\([^\)]*\))?\s*(===|==|!==|>|<|>=|<=)\s*("[^"]*"|\d+|[a-zA-Z0-9_\.]+)\s*\)?(\s*(AND|OR)\s*\(?\s*[a-zA-Z0-9_\.]+(?:\([^\)]*\))?\s*(===|==|!==|>|<|>=|<=)\s*("[^"]*"|\d+|[a-zA-Z0-9_\.]+)\s*\)?)*$/i;
        const validExpressionRegex = /^\(?\s*[a-zA-Z0-9_.@#$&?!-]+(?:\([^\)]*\))?\s*(===|==|!==|>|<|>=|<=)\s*("[^"]*"|\d+|[a-zA-Z0-9_.@#$&?!-]+)\s*\)?(\s*(AND|OR)\s*\(?\s*[a-zA-Z0-9_.@#$&?!-]+(?:\([^\)]*\))?\s*(===|==|!==|>|<|>=|<=)\s*("[^"]*"|\d+|[a-zA-Z0-9_.@#$&?!-]+)\s*\)?)*$/i;

        // const addDaysValidator = /^new Date\(new Date\((sections\.[\w\.]+)\)\.setDate\(new Date\(\1\)\.getDate\(\) [+-] \d+\)\)\.toLocaleDateString\("en-GB"\) === "\d{2}\/\d{2}\/\d{4}"$/;
        const addDaysValidator = /^new Date\(new Date\((sections\.[\w\.]+)\)\.setDate\(new Date\(\1\)\.getDate\(\) [+-] \d+\)\)\.toLocaleDateString\("en-GB"\)\s*(==|!=|===|!==|<|>|<=|>=)\s*"\d{2}\/\d{2}\/\d{4}"$/;


        // Define a regex to detect incomplete expressions (e.g., missing operators or values)
        const incompleteExpressionRegex = /^[a-zA-Z0-9_\.]+(?:\([^\)]*\))?$/;

        // Regex for valid date format (dd/mm/yyyy)
        const validDateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

        parts.forEach((part, index) => {
            part = part.replaceAll(/^\s+|\s+$/g, '');

            // Check for incomplete expressions
            part = trimParentheses(part)

            //trimming the conditions to avoid space issue
            part = part.trim();
            const displayPart = part.replaceAll(/sections\./g, '');

            // Check if the expression contains any method from the typeMethods list
            const containsTypeMethod = typeMethods.some(method => part.includes(method));

            //checking for the includes 
            if (part.includes('includes(')) {
                const result = part.match(/includes\((["'])(.*?)\1\)/)[2]; // Extract the string inside the includes() parentheses
                if (!result) {
                    error.push(`Error in the ${part}: missing values inside the function`)
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
                    const value = dateMatch[1].trim().replaceAll(/"/g, ''); // Remove quotes

                    // Validate date value (either "Today" or a valid date format)
                    if (value !== 'Today' && (expression.includes('setDate')) && !validDateRegex.test(value)) {
                        errors.push(`Error in expression: "${value}" is not a valid date. Use 'dd/mm/yyyy' or 'Today'.`);
                    }
                } else {
                    errors.push(`Error in expression: Date field is missing or incorrectly formatted.`);
                }
            }
            // Check if the part matches the valid expression pattern
            else if (!validExpressionRegex.test(part) && !addDaysValidator.test(part)) {
                // errors.push(`Error in expression: "${displayPart}" is incorrect.`);
                errors.push(`Error in expression: The Expression format is incorrect.`);

            }
            // If the expression is correct, log that it's valid
            else {
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
        if (complianceState) {
            for (let i = 0; i < conditions.length; i++) {
                for (let j = 0; j < conditions[i].conditions.length; j++) {
                    const condition = conditions[i].conditions[j];
                    const status = conditions[i].thenAction
                    const elseStatus = conditions[i].elseBlock
                    if (showInputValue(condition.condition_logic)) {

                        if (condition.question_name === '' || condition.condition_logic === '' || status === undefined || elseStatus === undefined) {
                            return true;
                        }
                    } else {
                        if (
                            condition.question_name === '' ||
                            condition.condition_logic === '' ||
                            condition.value === '' || status === undefined || elseStatus === undefined
                        ) {
                            return true;  // Return true if any key is empty  
                        }
                    }
                }

                // Validate elseIfBlocks  
                if (conditions[i].elseIfBlocks) {
                    for (let k = 0; k < conditions[i].elseIfBlocks.length; k++) {
                        for (let l = 0; l < conditions[i].elseIfBlocks[k].conditions.length; l++) {
                            const elseIfCondition = conditions[i].elseIfBlocks[k].conditions[l];
                            const status = conditions[i].elseIfBlocks[k].thenActions;
                            if (showInputValue(elseIfCondition.condition_logic)) {

                                if (elseIfCondition.question_name === '' || elseIfCondition.condition_logic === '' || status === undefined) {
                                    return true;
                                }
                            } else {
                                if (
                                    elseIfCondition.question_name === '' ||
                                    elseIfCondition.condition_logic === '' ||
                                    elseIfCondition.value === '' || status === undefined
                                ) {
                                    return true;  // Return true if any key is empty  
                                }
                            }
                        }
                    }
                }
            }
            return false;  // Return false if all keys have values  
        } else {
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
            return false;
        }
    };

    const getComplianceLogic = (condition) => {

        // to get the value expression
        const getValue = (val, condtionType) => {
            let resultValue = '';
            switch (condtionType) {
                case "choiceboxfield": resultValue = `"${val}"`;
                    break;
                case "numberfield": resultValue = val;
                    break;
                case "photofield": resultValue = val;
                    break;
                case "filefield": resultValue = val;
                    break;
                case "videofield": resultValue = val;
                    break;
                case "displayfield": resultValue = val;
                    break;
                case "textboxfield": resultValue = val;
                    break;
            }
            return resultValue
        }

        // to get the condition expression
        const getConditionValue = (item) => {
            let resultExpression = '';
            switch (item.condition_logic) {
                case "includes":
                    resultExpression = `${item.question_name}.includes("${item.value}")`;
                    break;
                case "equals":
                    if (item.condition_type === 'choiceboxfield' || item.condition_type === 'numberfield') {
                        resultExpression = `${item.question_name} === ${getValue(item.value, item.condition_type)}`
                    } else {
                        resultExpression = `${item.question_name} === "${getValue(item.value, item.condition_type)}"`;
                    }
                    break;
                case "not equal to":
                    if (item.condition_type === 'choiceboxfield' || item.condition_type === 'numberfield') {
                        resultExpression = `${item.question_name} !== ${getValue(item.value, item.condition_type)}`
                    } else {
                        resultExpression = `${item.question_name} !== "${getValue(item.value, item.condition_type)}"`;
                    }
                    break;
                case "does not include":
                    resultExpression = `!${item.question_name}.includes("${item.value}")`;
                    break;
                case "smaller":
                    resultExpression = `${item.question_name} < ${getValue(item.value, item.condition_type)}`;
                    break;
                case "larger":
                    resultExpression = `${item.question_name} > ${getValue(item.value, item.condition_type)}`;
                    break;
                case "smaller or equal":
                    resultExpression = `${item.question_name} <= ${getValue(item.value, item.condition_type)}`;
                    break;
                case "larger or equal":
                    resultExpression = `${item.question_name} >= ${getValue(item.value, item.condition_type)}`;
                    break;
                case "has no files":
                    resultExpression = `${item.question_name}.length == 0`;
                    break;
                case "has atleast one file":
                    resultExpression = `${item.question_name}.length > 0`;
                    break;
                case "number of file is":
                    resultExpression = `${item.question_name}.length == ${getValue(item.value, item.condition_type)}`;
                    break;
                case "date is before today":
                    resultExpression = `${item.question_name} < new Date()`;
                    break;
                case "date is after or equal to today":
                    resultExpression = `${item.question_name} >= new Date()`;
                    break;
                case "date is before or equal to today":
                    resultExpression = `${item.question_name} <= new Date()`;
                    break;
                case "date is after today":
                    resultExpression = `${item.question_name} > new Date()`;
                    break;
                // case "date is “Xd” date of set date":
                //     resultExpression = `Math.abs(${item.question_name} - new Date(${item.date})) == ${item.value}`;
                //     break;
                case 'date is “X” date of set date':
                    const formatteDate = formatDate(item.date);
                    const actualFormat = reverseFormat(formatteDate)
                    return `formatDateWithOffset('${formatteDate}', ${item.value}, ${item.question_name})`
                // return `new Date(${item.question_name} * 1000).toDateString() === new Date(new Date(${actualFormat} * 1000).setDate(new Date(${actualFormat} * 1000).getDate() + ${item.value})).toDateString();`
                default:
                    // Handle unknown condition logic  
                    console.error(`Unknown condition logic: ${item.condition_logic}`);
                    break;
            }
            return resultExpression;
        }

        const formatExpression = (expr) => {
            // Split the expression into parts by "||"
            const orParts = expr.split("||").map((part) => part.trim());

            // Add parentheses around each "&&" group
            const formatted = orParts
                .map((part) => {
                    if (part.includes("&&")) {
                        return `(${part})`;
                    }
                    return part;
                })
                .join(" || ");

            return formatted;
        };

        let result = '';

        condition.map((item, index) => {
            if (item.orClicked && index !== 0) {
                result += '|| ';
            }

            if (item.andClicked && index !== 0) {
                result += ' && ';
            }

            result += `${getConditionValue(item)}`;
        });

        return formatExpression(result.toString());
    }

    const getFinalComplianceLogic = () => {
        let finalString = '';
        if (conditions[0]?.conditions === undefined) {
            return
        }
        finalString += conditions[0]?.conditions[0]?.question_name !== '' ? 'if (' + getComplianceLogic(conditions[0]?.conditions) + ')' : ''
        if (conditions[0].thenAction) {
            finalString += ' ? ' + generateThenActionString(conditions[0]?.thenAction) + `${conditions[0]?.elseIfBlocks ? '' : ' : '}`;
        }
        if (conditions[0]?.elseIfBlocks) {
            finalString += ' : '
            conditions[0]?.elseIfBlocks?.map((outerItem) => {
                if (outerItem.conditions.length > 0) {
                    finalString += '(' + getComplianceLogic(outerItem?.conditions) + ')';
                }
                if (outerItem?.thenActions) {
                    finalString += ' ? ' + generateThenActionString(outerItem?.thenActions[0]) + ' : ';
                }
            })

        }
        if (conditions[0].elseBlock) {
            finalString += generateElseBlockString(conditions[0].elseBlock);
        }
        return finalString;
    }
    function getReplacedComplianceLogic(conditions) {
        let condition_logic = conditions; // Assuming this is your input string

        // Step 1: Replace ternary operator pattern
        condition_logic = condition_logic.replace(/\)\s*\?\s*\(/g, ') then (');

        // Step 2: Replace && with "and"
        condition_logic = condition_logic.replace(/&&/g, 'and');

        // Step 3: Replace || with "or"
        condition_logic = condition_logic.replace(/\|\|/g, 'or');

        // Step 4: Replace .length with .()
        condition_logic = condition_logic.replace(/\.length/g, '.()');

        // Step 5: Replace ACTIONS.push() with ACTIONS =
        condition_logic = condition_logic.replace(/ACTIONS\.push\(['"](.*?)['"]\)/g, "ACTIONS = '$1'");

        // Step 6: Handle if-else conversion from ternary
        if (condition_logic.includes(':')) {
            const parts = condition_logic.split(':');
            const lastPart = parts.pop();
            condition_logic = parts.map(part => part.trim()).join(' else if ') + ' else ' + lastPart.trim();
        }

        return condition_logic;
    }

    const handleTab = () => {
        if (!notRequiredConditions.some(element => inputValue.includes(element))) {
            let parsedLogic = parseLogicExpression(inputValue)
            setConditions(parsedLogic)
        }
    }
    let isAdvance = false;
    useEffect(() => {
        if (!complianceState && !isDefaultLogic) {
            let condition_logic = buildConditionExpression(conditions, combinedArray, isAdvance = true)
            condition_logic = condition_logic?.replaceAll('new Date()', '"Today"')
            setInputValue(condition_logic);
        }
        else if (isDefaultLogic && !complianceState) {
        } else {
            try {
                let condition_logic = getFinalComplianceLogic(conditions)
                condition_logic = getReplacedComplianceLogic(condition_logic)
                if (condition_logic?.includes(':')) {
                    // Split by colon and rebuild with "else if" and "else" logic
                    const parts = condition_logic?.split(':');
                    const lastPart = parts.pop(); // Remove the last part
                    condition_logic = parts.map(part => part.trim()).join(' else if ') + ' else ' + lastPart.trim();
                }
                setInputValue(replaceUUIDs(condition_logic, questionWithUuid) || defaultContentConverter(replaceUUIDs(complianceLogic[0].default_content, questionWithUuid)));
            } catch (error) {
                console.error('Error while converting', error);
            }
        }
    }, [conditions])






    const handleSaveBasicEditor = () => {

        if (!complianceState) {
            setEditorCheck((prev) => {
                const updatedConditionalEditor = prev.conditonalEditor.map((item) =>
                    item.questionId === selectedQuestionId
                        ? { ...item, isBasicEditor: true, isAdvanceEditor: false }
                        : item
                );
                // Check if the question already exists
                const questionExists = prev.conditonalEditor.some(
                    (item) => item.questionId === selectedQuestionId
                );
                return {
                    ...prev,
                    conditonalEditor: questionExists
                        ? updatedConditionalEditor
                        : [
                            ...prev.conditonalEditor,
                            { questionId: selectedQuestionId, isBasicEditor: true, isAdvanceEditor: false }
                        ]
                };
            });
        } else {
            setEditorCheck((prev) => ({
                ...prev,
                isBasicEditorCompliance: true,
                isAdvanceEditorCompliance: false
            }));
        }

        setSubmitSelected(true);
        if (validateConditions()) {
            return;
        }
        if (complianceState) {

            let compliance_logic = getFinalComplianceLogic(conditions);
            compliance_logic = replaceQuestionKey(compliance_logic, questionWithUuid);
            setComplianceLogic((prev) => {
                return prev.map((item, index) =>
                    index === complianceLogicId
                        ? { ...item, default_content: compliance_logic }
                        : item
                );
            });
        }

        let condition_logic;
        if (!complianceState) {
            try {
                condition_logic = buildConditionExpression(conditions, combinedArray);
            } catch (error) {
            }
        } else {
            condition_logic = conditions;
        }
        let sectionId
        if (sectionConditionLogicId) {
            sectionId = sectionConditionLogicId
        } else if (pageConditionLogicId) {
            sectionId = pageConditionLogicId.split('_')[0]
        } else if (selectedQuestionId) {
            sectionId = selectedQuestionId.split('_')[0].length > 1 ? selectedQuestionId.split('_')[0] : selectedQuestionId.split('_')[1];
        }
        if (!complianceState) {
            condition_logic = Object.keys(questionWithUuid).reduce((logic, questionName) => {
                // Escape all special regex characters
                let escapedQuestionName = questionName.replace(/[-[\]{}()*+?.,\\^$|#\s/~`!@#%^&_=:"';<>]/g, '\\$&');
                return logic.replace(new RegExp(escapedQuestionName, 'g'), questionWithUuid[questionName].replace(/-/g, '_')).trim();
            }, condition_logic);
        }
        if (!complianceState) {
            dispatch(setNewComponent({ id: 'conditional_logic', value: condition_logic, questionId: selectedQuestionId }));
        } else {
            dispatch(setComplianceLogicCondition(conditions));
        }
        handleSaveSection(sectionId, true, condition_logic);
        setConditionalLogic(false);
        setCompliancestate(false);
        setSectionConditionLogicId(false);
        setPageConditionLogicId(false);
    }
    function replaceQuestionKey(expression, state) {
        const regex = /\b[^.\s]+ [^.\s]+\.[^.\s]+ [^.\s]+\.[^.\s]+ [^.\s]+\b/g;
        return expression.replace(regex, match => {
            return state[match] || match;
        });
    }
    function escapeRegex(str) {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s/~`!@#%^&_=:"';<>]/g, '\\$&');
    }
    function replaceUUIDs(questionWithUUID, replacements) {
        let updatedString = questionWithUUID;
        if (!updatedString) {
            return '';
        }
        Object.entries(replacements).forEach(([key, value]) => {
            const escapedValue = escapeRegex(value);
            const regex = new RegExp(escapedValue, "g"); // Global replacement
            updatedString = updatedString.replace(regex, key);
        });
        return updatedString;
    }
    useEffect(() => {
        let compliance_logic;
        if (!complianceState) {
            if (sectionConditionLogicId) {
                // Find the section with the matching section ID
                const section = sectionsData.find(section => section.section_id === sectionConditionLogicId);

                if (section) {
                    // Extract and parse the section's conditional logic
                    compliance_logic = parseLogicExpression(replaceUUIDs(section?.section_conditional_logic, questionWithUuid));
                } else {
                    console.error('Section not found for the given sectionConditionLogicId');
                }
            } else if (pageConditionLogicId) {
                let pageFound = false;

                // Iterate through sections to find the page with the matching page ID
                sectionsData.forEach(section => {
                    const page = section.pages?.find(page => page.page_id === pageConditionLogicId);

                    if (page) {
                        pageFound = true;
                        // Extract and parse the page's conditional logic
                        compliance_logic = parseLogicExpression(replaceUUIDs(page.page_conditional_logic, questionWithUuid));
                    }
                });

                if (!pageFound) {
                    console.error('Page not found for the given pageConditionLogicId');
                }
            }
            else {
                // Default: Extract and parse the conditional logic from the selected question
                compliance_logic = parseLogicExpression(replaceUUIDs(fieldSettingParams[selectedQuestionId]?.conditional_logic, questionWithUuid));

            }
            setConditions(compliance_logic)
        } else {
            if (complianceLogicCondition[0] !== undefined) {
                setConditions(complianceLogicCondition);
            } else {
                setConditions(complianceInitialState)
            }
        }
    }, [selectedQuestionId])

    return (
        <>
            <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>
                <div ref={modalRef} className='!w-[80%] h-[90%] mx-auto bg-white rounded-[14px] relative p-[18px] overflow-hidden'>
                    <div className='w-full h-full'>
                        {(tab === 'advance' || isDefaultLogic) ? (
                            <div className='flex flex-col h-[calc(100%-20px)]'>
                                <div className='flex flex-1 overflow-auto default-sidebar'>
                                    <div className='w-[60%]'>
                                        {conditionalLogic || sectionConditionLogicId || pageConditionLogicId ? (
                                            <p className='text-start text-[22px] text-[#2B333B] font-semibold'>Shows when...</p>
                                        ) : complianceState ? (
                                            <p className='text-start text-[22px] text-[#2B333B] font-semibold'>Compliance Logic</p>
                                        ) : (
                                            <p className='text-start text-[22px] text-[#2B333B] font-semibold'>Default Value</p>
                                        )}

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
                                            setSelectedQuestion={setSelectedQuestion}
                                            isChoiceboxField={isChoiceboxField}
                                            choiceboxValues={choiceboxValues}
                                        ></AdvancedEditor>
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
                                            complianceState={complianceState}
                                        />
                                    </div>
                                </div>
                                <div className='mt-4 pt-2'>
                                    <div className={`${isDefaultLogic ? 'flex justify-end items-end w-full' : 'flex justify-between items-end'}`}>
                                        {!isDefaultLogic &&
                                            <div className='flex gap-5 items-end'>
                                                <button onClick={() => { setTab('basic'); handleTab() }} className={tab === 'advance' ? 'text-lg text-[#9FACB9] font-semibold px-[1px] border-b-2 border-white cursor-pointer' : 'text-[#2B333B] font-semibold px-[1px] border-b-2 border-[#2B333B] text-lg cursor-pointer'}>Basic Editor</button>
                                                <p data-testId="advance-editor-tab" onClick={() => setTab('advance')} className={tab === 'basic' ? 'text-lg text-[#9FACB9] font-semibold px-[1px] border-b-2 border-white cursor-pointer' : 'text-[#2B333B] font-semibold px-[1px] border-b-2 border-[#2B333B] text-lg cursor-pointer'}>Advanced Editor</p>
                                            </div>
                                        }
                                        <div className='w-[40%]'>
                                            <Button2
                                                text='Cancel'
                                                type='button'
                                                testId='cancel'
                                                data-testid='button1'
                                                className='w-[48%] h-[50px] text-black font-semibold text-base mr-[4%]'
                                                onClick={() => handleClose()}
                                            />
                                            <Button
                                                testID={'save-conditional-logic'}
                                                text='Save'
                                                onClick={(tab == 'advance' || isDefaultLogic) ? handleSave : handleSaveBasicEditor}
                                                type='button'
                                                data-testid='cancel'
                                                className='w-[48%] h-[50px] border text-white border-[#2B333B] bg-[#2B333B] hover:bg-black text-base font-semibold'
                                                isThreedotLoading={isThreedotLoader}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (!isDefaultLogic && !complianceState) ? (
                            <div className='flex flex-col h-[calc(100%-20px)]'>
                                <div className='flex-1 overflow-auto default-sidebar'>
                                    <BasicEditor
                                        secDetailsForSearching={filterQuestions()}
                                        questions={allSectionDetails}
                                        sections={sections}
                                        setShowMethodSuggestions={setShowMethodSuggestions}
                                        isThreedotLoaderBlack={isThreedotLoaderBlack}
                                        conditions={conditions}
                                        setConditions={setConditions}
                                        submitSelected={submitSelected}
                                        setSubmitSelected={setSubmitSelected}
                                        selectedQuestionId={selectedQuestionId}
                                        conditionalLogicData={conditionalLogicData}
                                        sectionConditionLogicId={sectionConditionLogicId}
                                        pageConditionLogicId={pageConditionLogicId}
                                        combinedArray={combinedArray}
                                        render={render}
                                        setRender={setRender}
                                    />
                                </div>
                                <div className='mt-4 pt-2'>
                                    <div className={`${isDefaultLogic ? 'flex justify-end items-end w-full' : 'flex justify-between items-end'}`}>
                                        {!isDefaultLogic &&
                                            <div className='flex gap-5 items-end'>
                                                <button onClick={() => setTab('basic')} className={tab === 'advance' ? 'text-lg text-[#9FACB9] font-semibold px-[1px] border-b-2 border-white cursor-pointer' : 'text-[#2B333B] font-semibold px-[1px] border-b-2 border-[#2B333B] text-lg cursor-pointer'}>Basic Editor</button>
                                                <p data-testId="advance-editor-tab" onClick={() => setTab('advance')} className={tab === 'basic' ? 'text-lg text-[#9FACB9] font-semibold px-[1px] border-b-2 border-white cursor-pointer' : 'text-[#2B333B] font-semibold px-[1px] border-b-2 border-[#2B333B] text-lg cursor-pointer'}>Advanced Editor</p>
                                            </div>
                                        }
                                        <div className='w-[40%]'>
                                            <Button2
                                                text='Cancel'
                                                type='button'
                                                testId='cancel'
                                                data-testid='button1'
                                                className='w-[48%] h-[50px] text-black font-semibold text-base mr-[4%]'
                                                onClick={() => handleClose()}
                                            />
                                            <Button
                                                testID={'save-conditional-logic'}
                                                text='Save'
                                                onClick={(tab == 'advance' || isDefaultLogic) ? handleSave : handleSaveBasicEditor}
                                                type='button'
                                                data-testid='cancel'
                                                className='w-[48%] h-[50px] border text-white border-[#2B333B] bg-[#2B333B] hover:bg-black text-base font-semibold'
                                                isThreedotLoading={isThreedotLoader}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (complianceState) && (
                            <div className='flex flex-col h-[calc(100%-20px)]'>
                                <div className='flex-1 overflow-auto default-sidebar'>
                                    <ComplianceBasicEditor
                                        secDetailsForSearching={filterQuestions()}
                                        questions={allSectionDetails}
                                        sections={sections}
                                        setShowMethodSuggestions={setShowMethodSuggestions}
                                        isThreedotLoaderBlack={isThreedotLoaderBlack}
                                        conditions={conditions}
                                        setConditions={setConditions}
                                        submitSelected={submitSelected}
                                        setSubmitSelected={setSubmitSelected}
                                        setUserInput={setUserInput}
                                        combinedArray={combinedArray}
                                    />
                                </div>
                                <div className='mt-4 pt-2'>
                                    <div className={`${isDefaultLogic ? 'flex justify-end items-end w-full' : 'flex justify-between items-end'}`}>
                                        {!isDefaultLogic &&
                                            <div className='flex gap-5 items-end'>
                                                <button onClick={() => setTab('basic')} className={tab === 'advance' ? 'text-lg text-[#9FACB9] font-semibold px-[1px] border-b-2 border-white cursor-pointer' : 'text-[#2B333B] font-semibold px-[1px] border-b-2 border-[#2B333B] text-lg cursor-pointer'}>Basic Editor</button>
                                                <p data-testId="advance-editor-tab" onClick={() => setTab('advance')} className={tab === 'basic' ? 'text-lg text-[#9FACB9] font-semibold px-[1px] border-b-2 border-white cursor-pointer' : 'text-[#2B333B] font-semibold px-[1px] border-b-2 border-[#2B333B] text-lg cursor-pointer'}>Advanced Editor</p>
                                            </div>
                                        }
                                        <div className='w-[40%]'>
                                            <Button2
                                                text='Cancel'
                                                type='button'
                                                testId='cancel'
                                                data-testid='button1'
                                                className='w-[48%] h-[50px] text-black font-semibold text-base mr-[4%]'
                                                onClick={() => handleClose()}
                                            />
                                            <Button
                                                testID={'save-conditional-logic'}
                                                text='Save'
                                                onClick={(tab == 'advance' || isDefaultLogic) ? handleSave : handleSaveBasicEditor}
                                                type='button'
                                                data-testid='cancel'
                                                className='w-[48%] h-[50px] border text-white border-[#2B333B] bg-[#2B333B] hover:bg-black text-base font-semibold'
                                                isThreedotLoading={isThreedotLoader}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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