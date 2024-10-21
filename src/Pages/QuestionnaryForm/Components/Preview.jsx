import React, { useRef, useState } from 'react';
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

function PreviewModal({ text, subText, Button1text, Button2text, src, className, handleButton1, handleButton2, button1Style, testIDBtn1, testIDBtn2, isImportLoading, showLabel, setModalOpen, sections, setValidationErrors, validationErrors, formDefaultInfo }) {

    const modalRef = useRef();
    const dispatch = useDispatch();
    const [currentSection, setCurrentSection] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [value, setValue] = useState({})
    const [isFormatError, setIsFormatError] = useState(false);
    const totalPages = Array.isArray(sections) ? sections.reduce((acc, section) => acc + (Array.isArray(section.pages) ? section.pages.length : 0), 0) : 0;
    console.log(totalPages, 'total pages')
    let counter = 0;
    const pages = sections.flatMap((section) => section.pages.map((page) => ({ page_name: page.page_name, page_id: page.page_id, index: counter++ })));

    console.log(pages, 'pages')
    // const [currentPage, setCurrentPage] = useState(0);
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
        const questions = sections[currentSection]?.pages[currentPage]?.questions;
        console.log(questions, 'akjckjajk')
        const errors = questions?.reduce((acc, question) => {
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
            } else if (question?.component_type === 'signaturefield' && !question?.options?.optional) {
                console.log(value[question?.question_id] || value[question?.question_id])
                if (value[question?.question_id] === false || value[question?.question_id] === null) {
                    acc[question.question_id] = 'This is a mandatory field';
                }
            } else if (question?.component_type === 'numberfield' && !question?.options?.optional) {
                console.log(value[question?.question_id], 'value number')
                if (value[question?.question_id] === '' || value[question?.question_id] === undefined) {
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
                preview_signaturefield: errors,
                preview_numberfield: errors
            }));
        } else {
            console.log(sections,'kokoo')
            if (currentPage < sections[currentSection].pages.length - 1) {
                setCurrentPage(currentPage + 1);
            } else if (currentSection < sections.length-1) {
                const newCurrentPage = currentPage+1;
                console.log(newCurrentPage,'new page')
                setCurrentSection(currentSection + 1);
                setCurrentPage(newCurrentPage);
            } else {
                // Do nothing if you're on the last page of the last section  
            }
        }
    };

    const handleBackClick = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        } else if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
            setCurrentPage(sections[currentSection - 1].pages.length - 1);
        }
    };



    console.log(value, 'ooooooooooo')

    const renderQuestion = (question) => {
        if (!question) {
            return <p>No question data available.</p>;
        }
        switch (question.component_type) {
            case 'textboxfield':
                // question_id={question?.question_id} validationErrors={validationErrors} options={question?.options} HelpText={question?.help_text} fieldSettingParameters={question} label={question?.label} place type={question?.type} handleChange={''}  
                return <TextBoxField setIsFormatError={setIsFormatError} id={question?.question_id} preview value={value[question?.question_id]} setValue={setValue} question_id={question?.question_id} question={question} setValidationErrors={setValidationErrors} validationErrors={validationErrors} />;
            case 'displayfield':
                return <DIsplayContentField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'gpsfield':
                return <GPSField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'signaturefield':
                return <SignatureField preview choiceValue={value[question?.question_id]} setValue={setValue} setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'filefield':
                return <FileField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'choiceboxfield':
                return <ChoiceBoxField preview choiceValue={value[question?.question_id]} setValue={setValue} setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'dateTimefield':
                return <DateTimeField preview setValue={setValue} choiceValue={value} helpText={question?.help_text} question={question} fieldSettingParameters={question} label={question?.label} place type={question?.type} handleChange={''} />;
            case 'numberfield':
                return <NumberField preview setValue={setValue} setValidationErrors={setValidationErrors} fieldValue={value[question?.question_id]} question={question} validationErrors={validationErrors} />;
            case 'assetLocationfield':
                return <AssetLocationField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'floorPlanfield':
                return <FloorPlanField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'photofield':
                return <PhotoField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'videofield':
                return <VideoField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            default:
                return <p>Unknown Field</p>;
        }
    };

    useOnClickOutside(modalRef, () => {
        dispatch(setModalOpen(false));
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            preview_textboxfield: '', // Or remove the key if you prefer  
        }));
    });
    console.log((currentPage + 1) / pages.length * 100, 'dhanush')
    return (
        <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>

            <div ref={modalRef} className='h-[740px] flex justify-between flex-col border-[5px] border-[#2B333B] w-[367px] mx-auto bg-white rounded-[55px] relative px-4 pb-6 '>
                <p className='text-center text-3xl text-[#2B333B] font-semibold mt-7 mb-3'>{formDefaultInfo?.internal_name}</p>
                <div>
                    {/* <Image src="Error-close" className="absolute top-5 right-5 cursor-pointer" data-testid="close-btn" onClick={() => handleClose()} /> */}
                    <Image src={src} className={`${className} mx-auto`} />
                </div>
                <div className='h-[calc(100vh-280px)] overflow-y-scroll overflow-x-hidden scrollBar w-full bg-slate-100 rounded-md'>
                    <div>
                        <p className="text-center text-2xl text-[#2B333B] font-[500] mt-7 mb-3">
                            {sections[currentSection]?.section_name}
                        </p>
                        <div className="w-[305px] relative bg-gray-200 mx-auto rounded-full h-2.5 ">
                            <div className="bg-[#2B333B] absolute h-2.5 rounded-l" style={{ width: `${((currentPage) / pages.length * 100).toFixed(1)}%` }}></div>
                            <div className='flex justify-between pt-5'>
                                <p>Step {currentPage + 1} of {pages.length}</p>
                                <span className="text-sm text-gray-600">{((currentPage + 1) / pages.length * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                    <div className='mt-12'>
                        <div className='bg-white p-[10px] mb-[10px]'>{pages[currentPage].page_name}</div>
                        {currentPage < pages.length && sections.flatMap((section) => section.pages.map((page) => ({ page_name: page.page_name, page_id: page.page_id, questions: page.questions }))).find((page) => page.page_id === pages[currentPage].page_id).questions.map((question, index) => (
                            <div className='mt-5' key={index}>
                                <div className='px-2'>{renderQuestion(question)}</div>
                            </div>
                        ))}
                    </div>

                </div>
                <div className='mt-5 flex items-center justify-between'>
                    {!showLabel ? <button type='button' data-testid={testIDBtn1} className={`w-[131px] h-[50px] ${button1Style} text-white font-semibold text-base rounded`} onClick={handleBackClick}>
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
                    <button type='button' data-testid={testIDBtn2} onClick={handleNextClick} className={`w-[131px] h-[50px] ${button1Style} text-white font-semibold text-base rounded`}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PreviewModal
