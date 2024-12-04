import React, { useRef, useState, useEffect } from 'react';
import Image from '../../../Components/Image/Image.jsx';
import useOnClickOutside from '../../../CommonMethods/outSideClick.js';
import { BeatLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import DIsplayContentField from './Fields/DisplayContent/DIsplayContentField.jsx';
import FloorPlanField from './Fields/FloorPlan/FloorPlanField.jsx';
import TextBoxField from './Fields/TextBox/TextBoxField.jsx';
import DateTimeField from './Fields/DateTime/DateTimeField.jsx';
import GPSField from './Fields/GPS/GPSField.jsx';
import SignatureField from './Fields/Signature/SignatureField.jsx';
import FileField from './Fields/File/FileFIeld.jsx';
import ChoiceBoxField from './Fields/ChoiceBox/ChoiceBoxField.jsx';
import NumberField from './Fields/Number/NumberField.jsx';
import AssetLocationField from './Fields/AssetLocation/AssetLocationField.jsx';
import PhotoField from './Fields/PhotoField/PhotoFIeld.jsx';
import VideoField from './Fields/VideoField/VideoField.jsx';
import useApi from '../../../services/CustomHook/useApi.js';
import TagScanField from './Fields/TagScan/TagScanField.jsx';
import {
    resetFields,
    setFieldEditable,
} from './defaultContentPreviewSlice.js';
import { useSelector } from 'react-redux';

function PreviewModal({ text, subText, setModalOpen, Button1text, Button2text, src, className, handleButton1, handleButton2, button1Style, testIDBtn1, testIDBtn2, isImportLoading, showLabel, questionnaire_id, version_number, setValidationErrors, validationErrors, formDefaultInfo, fieldSettingParameters }) {
    const modalRef = useRef();
    const { getAPI } = useApi();
    const dispatch = useDispatch();
    const [currentSection, setCurrentSection] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [value, setValue] = useState({})
    const [isFormatError, setIsFormatError] = useState(false);
    const [totalPagesNavigated, setTotalPagesNavigated] = useState(0);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false); // Add a loading state  
    const [conditionalValues, setConditionalValues] = useState({});
    const [complianceLogic, setComplianceLogic] = useState([]);
    const [showComplianceScreen, setShowComplianceScreen] = useState(false);
    const [isLastPage, setIsLastPage] = useState(false);
    const fieldStatus = useSelector(state => state?.defaultContent?.fieldStatus);
    // const fieldValues = useSelector(state => state?.fields?.fieldValues);
    console.log(value, 'conditiona values')
    console.log(sections, 'nahanahha')

    const handleConditionalLogic = async (data) => {
        let result = {};

        data.forEach((section, sectionIndex) => {
            const sectionKey = section.section_name.replace(/\s+/g, '_')// Convert section name to key format
            result[sectionKey] = {}; // Initialize the section key

            section.pages.forEach((page, pageIndex) => {
                const pageKey = page.page_name.replace(/\s+/g, '_') // Convert page name to key format
                result[sectionKey][pageKey] = {}; // Initialize the page key within the section

                page.questions.forEach((question, questionIndex) => {
                    const questionKey = question.label.replace(/\s+/g, '_') // Convert label to key format
                    result[sectionKey][pageKey][questionKey] = ""; // Assign empty string as value
                });
            });
        });
        return result;


    }

    const updateConditionalValues = async (data) => {
        const result = await handleConditionalLogic(data);
        setConditionalValues(result);
    };

    useEffect(() => {
        const fetchSections = async () => {
            setLoading(true);
            try {
                const [layoutResponse, questionnaireResponse] = await Promise.all([
                    getAPI(`questionnaires/layout/${questionnaire_id}/${version_number}`),
                    getAPI(`questionnaires/${questionnaire_id}/${version_number}`)
                ]);

                const questionnaireSections = questionnaireResponse?.data?.data?.sections;
                const layoutSections = layoutResponse?.data?.data?.sections;
                const complianceRules = layoutResponse?.data?.data?.compliance_logic;

                // Store compliance logic
                setComplianceLogic(complianceRules || []);

                // ... rest of the section organization logic remains the same
                const sectionIdMap = {};
                layoutSections.forEach((section) => {
                    sectionIdMap[section.id] = section.index;
                });

                const reorganizedSections = questionnaireSections.sort((a, b) => {
                    return sectionIdMap[a.section_id] - sectionIdMap[b.section_id];
                });

                setSections(reorganizedSections);
                updateConditionalValues(reorganizedSections);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, [questionnaire_id, version_number]);

    const evaluateComplianceLogic = () => {
        let results = [];

        const preprocessLogic = (logic) => {
            // Replace occurrences of getMonth() with getMonth() + 1
            if (logic.includes("getMonth()")) {
                logic = logic.replace(/getMonth\(\)/g, "getMonth() + 1");
            }

            // Replace occurrences of getDay() comparisons with string days
            if (logic.includes("getDay()")) {
                const daysMap = {
                    "Sunday": 0,
                    "Monday": 1,
                    "Tuesday": 2,
                    "Wednesday": 3,
                    "Thursday": 4,
                    "Friday": 5,
                    "Saturday": 6
                };

                logic = logic.replace(/getDay\(\)\s*(===|!==)\s*"(.*?)"/g, (match, operator, day) => {
                    return `getDay() ${operator} ${daysMap[day] ?? `"${day}"`}`;
                });
            }

            // Wrap new Date() for any necessary processing (can be extended if required)
            if (logic.includes("new Date(")) {
                try {
                    eval(logic); // Test the validity of the new Date logic
                } catch (error) {
                    console.error("Error evaluating new Date logic:", error);
                    throw error; // Re-throw the error for handling
                }
            }

            return logic;
        };

        results = complianceLogic.map(rule => {
            let evaluationResult = {
                STATUS: '',
                REASON: '',
                ACTIONS: [],
                GRADE: ''
            };

            try {
                // Preprocess the rule's default_content
                let processedContent = preprocessLogic(rule.default_content);

                // Define variables that will be set in eval
                let STATUS = '';
                let REASON = '';
                let ACTIONS = [];
                let GRADE = '';

                // Evaluate the processed logic
                eval(processedContent);

                // Store the results
                evaluationResult = { STATUS, REASON, ACTIONS, GRADE };
                console.log(evaluationResult, 'result eval');

                return {
                    label: rule.label,
                    ...evaluationResult,
                    conditionMet: STATUS === 'Pass'
                };
            } catch (error) {
                console.error("Error while evaluating:", error);
                return {
                    label: rule.label,
                    STATUS: 'Error',
                    REASON: error.message,
                    ACTIONS: [],
                    GRADE: '',
                    conditionMet: false
                };
            }
        });

        return results;
    };

    // Initial State: Exclude sections with non-empty `section_conditional_logic`
    const initialAllPages = sections
        .filter((section) => !section.section_conditional_logic || section.section_conditional_logic.trim() === '')
        .filter((section) => {
            if (section.section_conditional_logic) {
                try {
                    // Evaluate the section's conditional logic
                    return eval(section.section_conditional_logic);
                } catch (err) {
                    console.error('Error evaluating section conditional logic:', err);
                    return false; // Exclude the section if evaluation fails
                }
            }
            return true; // Include sections without conditional logic
        })
        .flatMap((section) =>
            section.pages.map((page) => ({
                page_name: page.page_name,
                page_id: page.page_id,
            }))
        );

    // Dynamically evaluate `section_conditional_logic` and update pages
    const getEvaluatedAllPages = () => {
        return sections
            .filter((section) => {
                if (section.section_conditional_logic) {
                    try {
                        // Evaluate the section's conditional logic
                        return eval(section.section_conditional_logic);
                    } catch (err) {
                        console.error('Error evaluating section conditional logic:', err);
                        return false; // Exclude the section if evaluation fails
                    }
                }
                return true; // Include sections without conditional logic
            })
            .flatMap((section) =>
                section.pages.map((page) => ({
                    page_name: page.page_name,
                    page_id: page.page_id,
                }))
            );
    };

    // Usage
    // console.log('Initial Pages:', initialAllPages);

    // Simulate user interaction or dynamic evaluation
    const allPages = getEvaluatedAllPages();
    console.log('Evaluated Pages:', allPages);

    const validateFormat = (value, format, regex) => {
        switch (format) {
            case 'Alpha':
                return /^[a-zA-Z]+$/.test(value);
            case 'Alphanumeric':
                return /^[a-zA-Z0-9]+$/.test(value);
            case 'Numeric':
                return /^[0-9]+$/.test(value);
            case 'Custom Regular Expression':
                return new RegExp(regex).test(value);
            default:
                return true; // Allow any format if not specified  
        }
    };




    // const handleNextClick = () => {
    // const questions = sections[currentSection].pages[currentPage].questions;
    //     const errors = questions.reduce((acc, question) => {
    //         // First check if the question should be visible based on conditional logic
    //         let isVisible = true;
    // if (question.conditional_logic !== '') {
    //     try {
    //         if (question.conditional_logic.includes("new Date(")) {
    //             // Handle date-specific logic
    //             isVisible = eval(question.conditional_logic);
    //         } else if (question.conditional_logic.includes("getMonth(")) {
    //             // Handle month-specific logic with adjustment
    //             const replacedLogic = question.conditional_logic.replace("getMonth()", "getMonth() + 1");
    //             isVisible = eval(replacedLogic);
    //         } else {
    //             // Handle regular conditional logic
    //             isVisible = eval(question.conditional_logic);
    //         }
    //     } catch (error) {
    //         console.error("Error evaluating conditional logic:", error);
    //         isVisible = false;
    //     }
    // }
    //         // Only validate if the question is visible
    //         if (isVisible) {
    //             // Validate based on component type
    //             switch (question.component_type) {
    //                 case 'textboxfield':
    //                     if (!question.options?.optional) {
    //                         if (value[question.question_id] === '' || value[question.question_id] === undefined) {
    //                             acc[question.question_id] = 'This is a mandatory field';
    //                         } else if (question.format_error && !validateFormat(value[question.question_id], question.format, question.regular_expression)) {
    //                             acc[question.question_id] = question.format_error;
    //                         }
    //                     }
    //                     break;

    //                 case 'choiceboxfield':
    //                     if (!question?.options?.optional) {
    //                         if (value[question?.question_id] === '' || value[question?.question_id] === undefined) {
    //                             acc[question.question_id] = 'This is a mandatory field';
    //                         } else {
    //                             break;
    //                         }
    //                     }
    //                 case 'numberfield':
    //                     if (!question.options?.optional && (value[question.question_id] === '' || value[question.question_id] === undefined)) {
    //                         acc[question.question_id] = 'This is a mandatory field';
    //                     }
    //                     break;

    //                 case 'dateTimefield':
    //                     if (!question.options?.optional && (!value[question.question_id] || value[question.question_id] === undefined)) {
    //                         acc[question.question_id] = 'This is a mandatory field';
    //                     }
    //                     break;

    //                 case 'photofield':
    //                     if (!question?.options?.optional) {
    //                         if (value[question?.question_id] === false || value[question?.question_id] === undefined) {
    //                             acc[question.question_id] = 'This is a mandatory field';
    //                         }
    //                     }
    //                 case 'filefield':
    //                     if (!question?.options?.optional) {
    //                         if (value[question?.question_id] === false || value[question?.question_id] === undefined) {
    //                             acc[question.question_id] = 'This is a mandatory field';
    //                         }
    //                     }
    //                 case 'videofield':
    //                     if (!question?.options?.optional) {
    //                         if (value[question?.question_id] === false || value[question?.question_id] === undefined) {
    //                             acc[question.question_id] = 'This is a mandatory field';
    //                         }
    //                     }
    //                 case 'gpsfield':
    //                     if (!question.options?.optional && (value[question.question_id] === false || value[question.question_id] === undefined)) {
    //                         acc[question.question_id] = 'This is a mandatory field';
    //                     }
    //                     break;
    //             }
    //         }
    //         return acc;
    //     }, {});

    // if (Object.keys(errors).length > 0) {
    //     setValidationErrors((prevErrors) => ({
    //         ...prevErrors,
    //         preview_textboxfield: errors,
    //         preview_choiceboxfield: errors,
    //         preview_numberfield: errors,
    //         preview_datetimefield: errors,
    //         preview_photofield: errors,
    //         preview_filefield: errors,
    //         preview_videofield: errors,
    //         preview_gpsfield: errors,
    //     }));
    // } else {
    //     const isLastSection = currentSection === sections.length - 1;
    //     const isLastPageInSection = currentPage === sections[currentSection].pages.length - 1;

    //     if (isLastSection && isLastPageInSection) {
    //         setShowComplianceScreen(true);
    //         setIsLastPage(true);
    //     } else if (currentPage < sections[currentSection].pages.length - 1) {
    //         setCurrentPage(currentPage + 1);
    //         setTotalPagesNavigated(totalPagesNavigated + 1);
    //     } else {
    //         setCurrentSection(currentSection + 1);
    //         setCurrentPage(0);
    //         setTotalPagesNavigated(totalPagesNavigated + 1);
    //     }
    // }
    // };

    const handleNextClick = () => {
        console.log('oooo');
        const currentSectionData = sections[currentSection + 1];
        let isSectionVisible = true; // Default to true unless logic makes it false
    
        console.log(currentSectionData, 'currentSectionData');
        console.log(currentPage, 'currentPage');
        
        const pageConditionalLogic = currentSectionData.pages[currentPage]?.page_conditional_logic;
        const sectionConditionalLogic = currentSectionData?.section_conditional_logic;
        console.log(pageConditionalLogic, 'pageConditionalLogic');
        console.log(sectionConditionalLogic, 'sectionConditionalLogic');
    
        // Helper function to evaluate logic
        const evaluateLogic = (logic) => {
            try {
                if (logic.includes("new Date(")) {
                    // Handle date-specific logic
                    return eval(logic);
                } else if (logic.includes("getMonth(")) {
                    // Handle month-specific logic with adjustment
                    const replacedLogic = logic.replace("getMonth()", "getMonth() + 1");
                    return eval(replacedLogic);
                } else if (logic.includes("getDay()")) {
                    // Handle day-specific logic
                    const daysMap = {
                        Sunday: 0,
                        Monday: 1,
                        Tuesday: 2,
                        Wednesday: 3,
                        Thursday: 4,
                        Friday: 5,
                        Saturday: 6,
                    };
                    const replacedLogic = logic.replace(
                        /getDay\(\)\s*(===|!==)\s*"(.*?)"/g,
                        (match, operator, day) => `getDay() ${operator} ${daysMap[day] ?? `"${day}"`}`
                    );
                    return eval(replacedLogic);
                } else {
                    // Handle regular conditional logic
                    return eval(logic);
                }
            } catch (error) {
                console.error("Error evaluating conditional logic:", error);
                return false;
            }
        };
    
        // Evaluate sectionConditionalLogic first
        if (sectionConditionalLogic) {
            console.log('Evaluating sectionConditionalLogic...');
            isSectionVisible = evaluateLogic(sectionConditionalLogic);
        }
    
        // If section is visible, evaluate pageConditionalLogic
        if (isSectionVisible && pageConditionalLogic) {
            console.log('Evaluating pageConditionalLogic...');
            isSectionVisible = evaluateLogic(pageConditionalLogic);
        }
    
        // Proceed based on the combined visibility
        if (isSectionVisible) {
            console.log('Section is visible, proceeding...');
            const questions = sections[currentSection].pages[currentPage].questions;
            const errors = questions.reduce((acc, question) => {
                let isVisible = true;
    
                // Evaluate question conditional logic
                if (question.conditional_logic !== '') {
                    console.log('Evaluating question conditional logic...');
                    isVisible = evaluateLogic(question.conditional_logic);
                }
    
                // Validate questions if visible
                if (isVisible) {
                    switch (question.component_type) {
                        case 'textboxfield':
                            if (!question.options?.optional) {
                                if (value[question.question_id] === '' || value[question.question_id] === undefined) {
                                    acc[question.question_id] = 'This is a mandatory field';
                                } else if (question.format_error && !validateFormat(value[question.question_id], question.format, question.regular_expression)) {
                                    acc[question.question_id] = question.format_error;
                                }
                            }
                            break;
    
                        case 'choiceboxfield':
                            if (!question?.options?.optional && (value[question?.question_id] === '' || value[question?.question_id] === undefined)) {
                                acc[question.question_id] = 'This is a mandatory field';
                            }
                            break;
    
                        case 'numberfield':
                            if (!question.options?.optional && (value[question.question_id] === '' || value[question.question_id] === undefined)) {
                                acc[question.question_id] = 'This is a mandatory field';
                            }
                            break;
    
                        case 'dateTimefield':
                            if (!question.options?.optional && (!value[question.question_id] || value[question.question_id] === undefined)) {
                                acc[question.question_id] = 'This is a mandatory field';
                            }
                            break;
    
                        case 'photofield':
                        case 'filefield':
                        case 'videofield':
                        case 'gpsfield':
                            if (!question?.options?.optional && (value[question?.question_id] === false || value[question?.question_id] === undefined)) {
                                acc[question.question_id] = 'This is a mandatory field';
                            }
                            break;
    
                        default:
                            console.warn(`Unknown component type: ${question.component_type}`);
                    }
                }
    
                return acc;
            }, {});
    
            // Handle errors or navigate to the next step
            if (Object.keys(errors).length > 0) {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    ...errors,
                }));
            } else {
                const isLastSection = currentSection === sections.length - 1;
                const isLastPageInSection = currentPage === sections[currentSection].pages.length - 1;
    
                if (isLastSection && isLastPageInSection) {
                    setShowComplianceScreen(true);
                    setIsLastPage(true);
                } else if (currentPage < sections[currentSection].pages.length - 1) {
                    setCurrentPage(currentPage + 1);
                    setTotalPagesNavigated(totalPagesNavigated + 1);
                } else {
                    setCurrentSection(currentSection + 1);
                    setCurrentPage(0);
                    setTotalPagesNavigated(totalPagesNavigated + 1);
                }
            }
        } else {
            console.log(`Section ${currentSectionData.section_name} is hidden due to conditional logic.`);
        }
    };
    




    const handleBackClick = () => {
        if (showComplianceScreen) {
            setShowComplianceScreen(false);
            setIsLastPage(false);
            return;
        }

        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            setTotalPagesNavigated(totalPagesNavigated - 1);
        } else if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
            setCurrentPage(sections[currentSection - 1].pages.length - 1);
            setTotalPagesNavigated(totalPagesNavigated - 1);
        }
    };

    const renderQuestion = (question) => {
        const commonProps = {
            preview: true,
            setValidationErrors,
            validationErrors,
            sections: sections[currentSection],
            setConditionalValues,
            conditionalValues,
        };

        switch (question?.component_type) {
            case 'textboxfield':
                return <TextBoxField
                    sections={sections[currentSection]}
                    validationErrors={validationErrors}
                    setValidationErrors={setValidationErrors}
                    question={question}
                    preview
                    setConditionalValues={setConditionalValues}
                    conditionalValues={setConditionalValues}
                    setIsFormatError={setIsFormatError}
                    question_id={question?.question_id}
                    testId="preview"
                    setValue={setValue}
                    values={value[question?.question_id]}
                // setFieldEditable={setFieldEditable}
                // setFieldValue={setFieldValue}
                />
            case 'displayfield':
                return <DIsplayContentField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'gpsfield':
                return <GPSField preview setValidationErrors={setValidationErrors} setValue={setValue} question={question} validationErrors={validationErrors} />;
            case 'signaturefield':
                return <SignatureField preview choiceValue={value[question?.question_id]} setValue={setValue} setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'filefield':
                return <FileField preview sections={sections[currentSection]} setConditionalValues={setConditionalValues} conditionalValues={conditionalValues} setValue={setValue} value={value} setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'choiceboxfield':
                return <ChoiceBoxField
                    sections={sections[currentSection]}
                    validationErrors={validationErrors}
                    setValidationErrors={setValidationErrors}
                    question={question}
                    preview
                    setConditionalValues={setConditionalValues}
                    conditionalValues={setConditionalValues}
                    setIsFormatError={setIsFormatError}
                    question_id={question?.question_id}
                    testId="preview"
                    setValue={setValue}
                    choiceValue={value[question?.question_id]}
                    fieldSettingParameters={question}
                />
            case 'dateTimefield':
                return <DateTimeField preview sections={sections[currentSection]} setConditionalValues={setConditionalValues} conditionalValues={conditionalValues} setValue={setValue} dateValue={value} setValidationErrors={setValidationErrors} validationErrors={validationErrors} helpText={question?.help_text} question={question} fieldSettingParameters={question} label={question?.label} place type={question?.type} handleChange={''} />;
            case 'numberfield':
                return <NumberField preview sections={sections[currentSection]} setConditionalValues={setConditionalValues} conditionalValues={conditionalValues} setValue={setValue} setValidationErrors={setValidationErrors} fieldValue={value[question?.question_id]} question={question} validationErrors={validationErrors} />;
            case 'assetLocationfield':
                return <AssetLocationField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'floorPlanfield':
                return <FloorPlanField preview setValidationErrors={setValidationErrors} setValue={setValue} question={question} validationErrors={validationErrors} />;
            case 'photofield':
                return <PhotoField preview sections={sections[currentSection]} setConditionalValues={setConditionalValues} conditionalValues={conditionalValues} setValue={setValue} photoValue={value} setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'videofield':
                return <VideoField preview sections={sections[currentSection]} setConditionalValues={setConditionalValues} conditionalValues={conditionalValues} setValue={setValue} photoValue={value} setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'tagScanfield':
                return <TagScanField preview setValue={setValue} photoValue={value} setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            default:
                return <p>Unknown Field</p>;
        }
    };

    Object.entries(conditionalValues).forEach(([key, value]) => {
        window[key] = value;
    });

    // const isLastSectionAndPage = () => {
    //     const nextSectionData = sections[currentSection + 1];
    //     let isSectionEval = false;
    //     if(nextSectionData?.section_conditional_logic){
    //         isSectionEval = eval(nextSectionData?.section_conditional_logic)
    //     }
    //     console.log(isSectionEval, 'dddddddddddddd')
    //     if(isSectionEval){
    //         return false;
    //     }else{
    //         return currentSection === sections.length - 1 &&
    //         currentPage === sections[currentSection]?.pages.length - 1;
    //     }

    // };
    const isLastSectionAndPage = () => {
        const isLastSectionAndPage = () => {
            // Check if we are on the last section and last page
            const isLastPageInSection =
                currentPage === sections[currentSection]?.pages.length - 1;
            const isLastSection = currentSection === sections.length - 1;

            // If already on the last section and page, return true to show "Submit"
            if (isLastSection && isLastPageInSection) {
                return true;
            }

            // Otherwise, evaluate the next section's conditional logic
            const nextSectionData = sections[currentSection + 1];
            if (nextSectionData?.section_conditional_logic) {
                try {
                    const isSectionEval = eval(nextSectionData.section_conditional_logic);
                    console.log(isSectionEval, "Evaluated section logic");
                    return isSectionEval; // Show "Submit" if the next section logic is false
                } catch (err) {
                    console.error("Error evaluating section conditional logic:", err);
                    return false; // Fallback to "Next" if evaluation fails
                }
            }

            // Default: Proceed to "Next" if no conditional logic exists
            return false;
        };
    };


    useEffect(() => {
        sections.forEach(section => {
            section.pages.forEach(page => {
                page.questions.forEach(question => {
                    const { default_conditional_logic, default_content } = question;

                    // Check if default_conditional_logic is not empty
                    if (!fieldStatus[question?.question_id]) {
                        if (default_conditional_logic) {
                            try {
                                // Evaluate the string expression
                                if (default_content === "advance") {
                                    const result = eval(default_conditional_logic);
                                    setValue((prev) => ({
                                        ...prev,
                                        [question.question_id]: result

                                    }))
                                } else {
                                    setValue((prev) => ({
                                        ...prev,
                                        [question.question_id]: default_conditional_logic

                                    }))
                                }

                            } catch (error) {
                                // Log the error if eval fails
                                console.error(`Failed to evaluate "${default_conditional_logic}":`, error);
                            }
                        }
                    }
                });
            });
        });
    }, [conditionalValues])

    const handleClose = () => {
        setModalOpen(false)
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            preview_textboxfield: '',
            preview_choiceboxfield: '',
            preview_numberfield: '',
            preview_datetimefield: '',
            preview_photofield: '',
            preview_filefield: '',
            preview_videofield: '',
            preview_gpsfield: '',
        }));
        dispatch(resetFields())
    }
    function addDays(date) {
        if (date) {
            let result = date;
            result.setDate(result.getDate() + 1);
            // return result
        }

    }
    return (
        <div className='bg-[#0e0d0d71] pointer-events-auto w-full h-screen absolute top-0 flex flex-col z-[999]'>
            <div className='flex justify-end p-2'>
                <img src='/Images/close-preview.svg' className=' relative hover:bg-[#0e0d0d71] p-2 rounded-lg shadow-md hover:cursor-pointer' onClick={() => handleClose()}></img>
            </div>
            <div ref={modalRef} data-testid="mobile-preview" className='h-[740px] flex justify-between mt-[50px] flex-col border-[5px] border-[#2B333B] w-[367px] mx-auto bg-slate-100 rounded-[55px] relative pb-6 '>
                <p className='text-center text-3xl text-[#2B333B] font-semibold mt-7 mb-3'>{formDefaultInfo?.internal_name}</p>
                <div className='h-[calc(100vh-280px)] overflow-y-scroll overflow-x-hidden scrollHide w-full bg-slate-100 rounded-md'>
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <BeatLoader color="#2B333B" size='20px' />
                        </div>
                    ) : showComplianceScreen ? (
                        <div className="p-4">
                            <h2 className="text-2xl font-bold text-[#2B333B] items-center w-full flex justify-center mb-4">Compliance Results</h2>
                            {evaluateComplianceLogic().map((result, index) => (
                                <>
                                    <div
                                        key={index}
                                        className={`mb-4 p-4 rounded-lg shadow transition-all duration-200 bg-white`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-[#2B333B]">{result?.label}</h3>
                                            <span
                                                className={` p-2 rounded-full gap-2 flex text-sm font-medium ${result?.STATUS === 'Pass' ? 'bg-green-500' : 'bg-red-500 text-white'}`}
                                            >
                                                <img src={`${result?.STATUS === 'Pass' ? '/Images/compliant.svg' : '/Images/non-compliant.svg'}`} width={12} />
                                                {result?.STATUS === 'Pass' ? 'Compliant' : 'Non-Compliant'}
                                            </span>
                                        </div>

                                    </div>
                                    {result?.STATUS === 'Fail' && <div
                                        key={index}
                                        className={`mb-4 p-4 rounded-lg shadow transition-all duration-200 bg-white`}
                                    >
                                        <div className="flex flex-col gap-4">
                                            {/* <h3 className="font-semibold text-[#2B333B]">STATUS: {result?.STATUS}</h3> */}
                                            <div className=' flex items-center gap-2'>
                                                <h3 className="font-semibold text-[#2B333B]">REASON: </h3>
                                                <span className='text-sm'>{result?.REASON}</span>
                                            </div>
                                            <div className=' flex items-center gap-2'>
                                                <h3 className="font-semibold text-[#2B333B]">ACTION: </h3>
                                                <span className='text-sm'>{result?.ACTIONS}</span>
                                            </div>

                                        </div>

                                    </div>}
                                </>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <p className="text-center text-2xl text-[#2B333B] font-[500] mt-3 mb-3">
                                {sections[currentSection]?.section_name}
                            </p>
                            <div className="w-[305px] relative bg-gray-200 mx-auto rounded-full h-2.5 ">
                                <div className="bg-[#2B333B] absolute h-2.5 rounded-l" style={{ width: `${((totalPagesNavigated) / allPages.length * 100).toFixed(0)}%` }}></div>
                                <div className='flex justify-between pt-5'>
                                    <p>Step {totalPagesNavigated + 1} of {allPages.length}</p>
                                    <span className="text-sm text-gray-600">{((totalPagesNavigated) / allPages.length * 100).toFixed(0)}%</span>
                                </div>
                            </div>

                            <div className='bg-white text-[#2B333B] py-[10px] px-[30px] mt-16'>{sections[currentSection]?.pages[currentPage]?.page_name}</div>
                            <div className='flex flex-col justify-between'>

                                {sections[currentSection]?.pages[currentPage]?.questions?.map((list, index) => {

                                    if (list?.conditional_logic !== '') {
                                        // debugger
                                        // addDays(Section_1.Page_1.Question_1)
                                        if (list?.conditional_logic.includes("new Date(")) {
                                            try {
                                                let result = eval(list?.conditional_logic)
                                                if (!eval(list?.conditional_logic)) {
                                                    return null;
                                                }
                                            } catch (error) {
                                                console.log(error, error)
                                                return null;
                                            }

                                        } else if (list?.conditional_logic.includes("getMonth(")) {
                                            const replacedLogic = list?.conditional_logic.replace("getMonth()", "getMonth() + 1")
                                            try {
                                                if (!eval(replacedLogic)) {
                                                    return null;
                                                }
                                            } catch (error) {
                                                console.log(error, 'j')
                                                return null;
                                            }
                                        } else if (list?.conditional_logic.includes("getDay()")) {
                                            const daysMap = {
                                                "Sunday": 0,
                                                "Monday": 1,
                                                "Tuesday": 2,
                                                "Wednesday": 3,
                                                "Thursday": 4,
                                                "Friday": 5,
                                                "Saturday": 6
                                            };
                                            // Replace day names with corresponding numeric values
                                            const replacedLogic = list.conditional_logic.replace(/getDay\(\)\s*(===|!==)\s*"(.*?)"/g, (match, operator, day) => {
                                                return `getDay() ${operator} ${daysMap[day] ?? `"${day}"`}`;
                                            });

                                            // Remove parentheses from around the entire string, if they exist
                                            const logicWithoutBrackets = replacedLogic.replace(/^\((.*)\)$/, '$1');
                                            console.log(logicWithoutBrackets, 'modified logic')
                                            try {
                                                let result = eval(logicWithoutBrackets); // Evaluate the modified logic
                                                console.log(result, 'Evaluation Result');
                                                if (!result) {
                                                    return null; // If the logic evaluates to false, return null
                                                }
                                            } catch (error) {
                                                console.error(error, 'Error evaluating getDay logic');
                                                return null;
                                            }
                                        } else {
                                            try {
                                                // debugger
                                                if (!eval(list?.conditional_logic)) {
                                                    return null;
                                                }
                                            } catch (error) {
                                                console.log(error, 'j')
                                                return null;
                                            }
                                        }
                                    }
                                    return (
                                        <div
                                            data-testid={`preview-section-${currentSection}-page-${currentPage}-question-${index}`}
                                            className="mt-3 mb-3 bg-white mx-4 rounded-xl py-4 px-2"
                                            key={index}
                                        >
                                            <div className="px-2">{renderQuestion(list)}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                <div className='mt-5 flex items-center px-2 justify-between'>
                    {!showLabel ? <button type='button' data-testid="back" className={`w-[100px] h-[45px] ${button1Style} text-white font-semibold text-sm rounded-full`} onClick={handleBackClick}>
                        Back
                    </button> :
                        <>
                            <input
                                data-testid="import-file"
                                type="file"
                                accept=".csv"
                                onChange={handleButton1}
                                disabled={isImportLoading}
                                id="file-upload"
                                style={{ display: 'none' }} // Hide the actual input field  
                            />
                            <label
                                htmlFor="file-upload"
                                className={`w-[200px] h-[50px] ${button1Style} text-white font-semibold text-base rounded ${isImportLoading ? 'cursor-not-allowed' : 'cursor-pointer'} flex justify-center items-center`}>
                                {isImportLoading ? (
                                    <BeatLoader color="#fff" size='10px' />
                                ) : (
                                    <>
                                        {Button1text}
                                    </>
                                )}
                            </label>
                        </>}
                    {!showComplianceScreen && (
                        <button
                            type='button'
                            data-testid="next"
                            className={`w-[100px] h-[45px] ${button1Style} text-white font-semibold text-sm rounded-full`}
                            onClick={handleNextClick}
                        >
                            {isLastSectionAndPage() ? 'Submit' : 'Next'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PreviewModal
