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

function PreviewModal({ text, subText, Button1text, Button2text, src, className, handleButton1, handleButton2, button1Style, testIDBtn1, testIDBtn2, isImportLoading, showLabel, setModalOpen, questionnaire_id, version_number, setValidationErrors, validationErrors, formDefaultInfo, fieldSettingParameters }) {

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

    // const evaluateComplianceLogic = () => {
    //     return complianceLogic.map(rule => {
    //         try {
    //             const result = eval(rule?.default_content);
    //             // v1 result kkk
    //             const conditionResult = eval(rule?.default_content);
    //             return {
    //                 label: rule?.label,
    //                 result: result?.toString(),
    //                 tookIfPath: conditionResult
    //             };
    //         } catch (error) {
    //             console.log("Error while evaluating")
    //         }
    //     });
    // };
    const evaluateComplianceLogic = () => {
        return complianceLogic.map(rule => {
            // Get the condition part before the question mark
            const conditionPart = rule.default_content.split('?')[0].trim();

            // Evaluate the condition to determine which path was executed
            const conditionResult = eval(rule);

            // Get the full evaluation result
            const result = eval(rule.default_content);

            return {
                label: rule.label,
                result: result?.toString(),
                // If condition is true, it took the "if" path (green), otherwise "else" path (red)
                tookIfPath: conditionResult
            };
        });
    };

    const allPages = sections.flatMap((section) => section.pages.map((page) => ({ page_name: page.page_name, page_id: page.page_id })));

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

    const handleNextClick = () => {
        const questions = sections[currentSection].pages[currentPage].questions;
        const errors = questions.reduce((acc, question) => {
            if (question?.component_type === 'textboxfield' && !question?.options?.optional) {
                if (value[question?.question_id] === '' || value[question?.question_id] === undefined) {
                    acc[question.question_id] = 'This is a mandatory field';
                } else if (question?.format_error && !validateFormat(value[question?.question_id], question?.format, question?.regular_expression)) {
                    acc[question.question_id] = question?.format_error;
                }
            } else if (question?.component_type === 'choiceboxfield' && !question?.options?.optional) {
                if (value[question?.question_id] === '' || value[question?.question_id] === undefined) {
                    acc[question.question_id] = 'This is a mandatory field';
                }
            } else if (question?.component_type === 'numberfield' && !question?.options?.optional) {
                if (value[question?.question_id] === '' || value[question?.question_id] === undefined) {
                    acc[question.question_id] = 'This is a mandatory field';
                }
            } else if (question?.component_type === 'dateTimefield' && !question?.options?.optional) {
                if (!value[question?.question_id] || value[question?.question_id] === undefined) {
                    acc[question.question_id] = 'This is a mandatory field';
                }
            }
            else if (question?.component_type === 'photofield' && !question?.options?.optional) {
                if (value[question?.question_id] === false || value[question?.question_id] === undefined) {
                    acc[question.question_id] = 'This is a mandatory field';
                }
            }
            else if (question?.component_type === 'filefield' && !question?.options?.optional) {
                if (value[question?.question_id] === false || value[question?.question_id] === undefined) {
                    acc[question.question_id] = 'This is a mandatory field';
                }
            }
            else if (question?.component_type === 'videofield' && !question?.options?.optional) {
                if (value[question?.question_id] === false || value[question?.question_id] === undefined) {
                    acc[question.question_id] = 'This is a mandatory field';
                }
            } else if (question?.component_type === 'gpsfield' && !question?.options?.optional) {
                if (value[question?.question_id] === false || value[question?.question_id] === undefined) {
                    acc[question.question_id] = 'This is a mandatory field';
                }
            }
            return acc;
        }, {});
        if (Object.keys(errors).length > 0) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_textboxfield: errors,
                preview_choiceboxfield: errors,
                preview_numberfield: errors,
                preview_datetimefield: errors,
                preview_photofield: errors,
                preview_filefield: errors,
                preview_videofield: errors,
                preview_gpsfield: errors,
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
        // if ((question.conditional_logic !== "" && eval(question?.conditional_logic))) return null;

        if (!question) {
            return <p>No question data available.</p>;
        }
        switch (question.component_type) {
            case 'textboxfield':
                return <TextBoxField sections={sections[currentSection]} setConditionalValues={setConditionalValues} conditionalValues={conditionalValues} setIsFormatError={setIsFormatError} id={question?.question_id} testId={`preview`} preview value={value[question?.question_id]} setValue={setValue} question_id={question?.question_id} question={question} setValidationErrors={setValidationErrors} validationErrors={validationErrors} />;
            case 'displayfield':
                return <DIsplayContentField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'gpsfield':
                return <GPSField preview setValidationErrors={setValidationErrors} setValue={setValue} question={question} validationErrors={validationErrors} />;
            case 'signaturefield':
                return <SignatureField preview choiceValue={value[question?.question_id]} setValue={setValue} setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'filefield':
                return <FileField preview sections={sections[currentSection]} setConditionalValues={setConditionalValues} conditionalValues={conditionalValues} setValue={setValue} value={value} setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'choiceboxfield':
                return <ChoiceBoxField preview sections={sections[currentSection]} setConditionalValues={setConditionalValues} conditionalValues={conditionalValues} fieldSettingParameters={fieldSettingParameters[question?.question_id]} choiceValue={value[question?.question_id]} setValue={setValue} setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
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
    const isLastSectionAndPage = () => {
        return currentSection === sections.length - 1 &&
            currentPage === sections[currentSection]?.pages.length - 1;
    };

    useEffect(() => {
        sections.forEach(section => {
            section.pages.forEach(page => {
                page.questions.forEach(question => {
                    const { default_conditional_logic, default_content } = question;

                    // Check if default_conditional_logic is not empty
                    if (default_conditional_logic) {
                        try {
                            // Evaluate the string expression
                            if (default_content === "advance") {
                                const result = eval(default_conditional_logic);
                                console.log(`Evaluation of "${default_conditional_logic}":`, result);
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
                });
            });
        });
    }, [conditionalValues])

    return (
        <div className='bg-[#0e0d0d71] pointer-events-auto w-full h-screen absolute top-0 flex flex-col z-[999]'>
            <div className='flex justify-end p-2'>
                <img src='/Images/close-preview.svg' className=' relative hover:bg-[#0e0d0d71] p-2 rounded-lg shadow-md hover:cursor-pointer' onClick={() => dispatch(setModalOpen(false))}></img>
            </div>
            <div ref={modalRef} data-testid="mobile-preview" className='h-[740px] flex justify-between mt-[50px] flex-col border-[5px] border-[#2B333B] w-[367px] mx-auto bg-white rounded-[55px] relative px-4 pb-6 '>
                <p className='text-center text-3xl text-[#2B333B] font-semibold mt-7 mb-3'>{formDefaultInfo?.internal_name}</p>
                <div className='h-[calc(100vh-280px)] overflow-y-scroll overflow-x-hidden scrollBar w-full bg-slate-100 rounded-md'>
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <BeatLoader color="#2B333B" size='20px' />
                        </div>
                    ) : showComplianceScreen ? (
                        <div className="p-4">
                            <h2 className="text-2xl font-bold text-[#2B333B] items-center w-full flex justify-center mb-4">Compliance Results</h2>
                            {evaluateComplianceLogic().map((result, index) => (
                                <div
                                    key={index}
                                    className={`mb-4 p-4 rounded-lg shadow transition-all duration-200 bg-white`}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-[#2B333B]">{result?.label}</h3>
                                        <span
                                            className={`px-4 py-1.5 rounded-full flex gap-3 text-sm font-medium ${result?.tookIfPath
                                                ? 'bg-[#4CD95A] text-[#2B333B] border '
                                                : 'bg-[#FA303B] text-white border '
                                                }`}
                                        >
                                            <img src={result?.tookIfPath ? '/Images/compliant.svg' : '/Images/non-compliant.svg'} width={10} />
                                            {result?.result}
                                        </span>
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <p className="text-center text-2xl text-[#2B333B] font-[500] mt-7 mb-3">
                                {sections[currentSection]?.section_name}
                            </p>
                            <div className="w-[305px] relative bg-gray-200 mx-auto rounded-full h-2.5 ">
                                <div className="bg-[#2B333B] absolute h-2.5 rounded-l" style={{ width: `${((totalPagesNavigated) / allPages.length * 100).toFixed(0)}%` }}></div>
                                <div className='flex justify-between pt-5'>
                                    <p>Step {totalPagesNavigated + 1} of {allPages.length}</p>
                                    <span className="text-sm text-gray-600">{((totalPagesNavigated) / allPages.length * 100).toFixed(0)}%</span>
                                </div>
                            </div>

                            <div className='bg-white p-[10px] mt-16'>{sections[currentSection]?.pages[currentPage]?.page_name}</div>
                            <div className='flex flex-col justify-between'>

                                {sections[currentSection]?.pages[currentPage]?.questions?.map((list, index) => {
                                    if (list?.conditional_logic !== '') {
                                        if (list?.conditional_logic.includes("new Date(")) {
                                            try {
                                                if (!eval(list?.conditional_logic)) {
                                                    return null;
                                                }
                                            } catch (error) {
                                                console.log(error,error)
                                            }

                                        } else {
                                            try {
                                                if (!eval(list?.conditional_logic)) {
                                                    return null;
                                                }
                                            } catch (error) {
                                                console.log(error, 'j')
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
                <div className='mt-5 flex items-center justify-between'>
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
