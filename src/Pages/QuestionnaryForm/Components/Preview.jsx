import React, { useRef, useState } from 'react'
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
    const [sliderValue, setSliderValue] = useState(0);
    console.log(sections, 'sections mmdmd')
    const totalPages = Array.isArray(sections) ? sections.reduce((acc, section) => acc + (Array.isArray(section.pages) ? section.pages.length : 0), 0) : 0;

    const handleNextClick = () => {
        if (currentPage < sections[currentSection].pages.length - 1) {
            setCurrentPage(currentPage + 1);
            setSliderValue((currentPage + 1) / sections[currentSection].pages.length * 100);
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_textboxfield: '', // Or remove the key if you prefer
            }));
        } else if (currentSection < sections.length - 1) {
            setCurrentSection(currentSection + 1);
            setCurrentPage(0);
            // setSliderValue(0);
        }
    };
    // console.log((currentPage + 1) / sections[currentSection].pages.length * 100, '(currentPage + 1) / sections[currentSection].pages.length * 100')

    const handleBackClick = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            setSliderValue((currentPage - 1) / sections[currentSection].pages.length * 100);
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_textboxfield: '', // Or remove the key if you prefer
            }));
        } else if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
            setCurrentPage(sections[currentSection - 1].pages.length - 1);
            // setSliderValue(100);
        }
    };

    const renderQuestion = (question) => {
        if (!question) {
            return <p>No question data available.</p>;
        }
        console.log(question)
        switch (question.component_type) {
            case 'textboxfield':
                // question_id={question?.question_id} validationErrors={validationErrors} options={question?.options} HelpText={question?.help_text} fieldSettingParameters={question} label={question?.label} place type={question?.type} handleChange={''}
                return <TextBoxField preview question={question} setValidationErrors={setValidationErrors} validationErrors={validationErrors} />;
            case 'displayfield':
                return <DIsplayContentField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'gpsfield':
                return <GPSField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'signaturefield':
                return <SignatureField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'filefield':
                return <FileField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'choiceboxfield':
                return <ChoiceBoxField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
            case 'dateTimefield':
                return <DateTimeField preview helpText={question?.help_text} question={question} fieldSettingParameters={question} label={question?.label} place type={question?.type} handleChange={''} />;
            case 'numberfield':
                return <NumberField preview setValidationErrors={setValidationErrors} question={question} validationErrors={validationErrors} />;
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

    return (
        <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>

            <div ref={modalRef} className='h-[740px] flex justify-between flex-col border-[5px] border-[#2B333B] w-[367px] mx-auto bg-white rounded-[55px] relative px-4 pb-6 '>
                <p className='text-center text-3xl text-[#2B333B] font-semibold mt-7 mb-3'>Installation</p>
                <div>
                    {/* <Image src="Error-close" className="absolute top-5 right-5 cursor-pointer" data-testid="close-btn" onClick={() => handleClose()} /> */}
                    <Image src={src} className={`${className} mx-auto`} />
                </div>
                <div className='h-[calc(100vh-280px)] overflow-y-scroll scrollBar w-full bg-slate-100 rounded-md'>
                    <div>
                        <p className="text-center text-2xl text-[#2B333B] font-[500] mt-7 mb-3">
                            {formDefaultInfo?.internal_name}
                        </p>
                        <div className="w-[305px] relative bg-gray-200 mx-auto rounded-full h-2.5 ">
                            <input className="bg-[#2B333B] absolute appearance-none h-2.5 rounded-l" value={sliderValue} onChange={(e) => setSliderValue(e.target.value)} style={{ width: { sliderValue } }}></input>
                            <div className='flex justify-between pt-5'>
                                <p>Step {currentPage + 1} of {totalPages}</p>
                                <span className="text-sm text-gray-600">{sliderValue}%</span>
                            </div>
                        </div>
                    </div>
                    <div className='mt-12'>
                        <div className='bg-white p-[10px] mb-[10px]'>{sections[currentSection].pages[currentPage].page_name}</div>
                        {sections[currentSection]?.pages[currentPage]?.questions?.length > 0 ? (
                            sections[currentSection].pages[currentPage].questions.map((question, index) => (
                                <div className='mt-5' key={index}>
                                    
                                    <div className='px-2'>{renderQuestion(question)}</div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-2xl text-[#2B333B] font-[500] mt-7 mb-3">No questions available.</p>
                        )}
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