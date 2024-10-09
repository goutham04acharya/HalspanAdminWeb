import React, { useRef, useState } from 'react'
import Image from '../../../Components/Image/Image.jsx';
import useOnClickOutside from '../../../CommonMethods/outSideClick.js';
import { BeatLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import DIsplayContentField from './Fields/DisplayContent/DIsplayContentField.jsx';
import FloorPlanField from './Fields/FloorPlan/FloorPlanField.jsx';
import TextBoxField from './Fields/TextBox/TextBoxField.jsx';


function PreviewModal({ text, subText, Button1text, Button2text, src, className, handleButton1, handleButton2, button1Style, testIDBtn1, testIDBtn2, isImportLoading, showLabel, setModalOpen, sections }) {

    const modalRef = useRef();
    const dispatch = useDispatch();
    const [currentSection, setCurrentSection] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [sliderValue, setSliderValue] = useState(0);
    console.log(sections, 'sections mmdmd')
    const totalPages = sections.reduce((acc, section) => acc + section.pages.length, 0);

    const handleNextClick = () => {
        if (currentPage < sections[currentSection].pages.length - 1) {
            setCurrentPage(currentPage + 1);
            setSliderValue((currentPage + 1) / sections[currentSection].pages.length * 100);
        } else if (currentSection < sections.length - 1) {
            setCurrentSection(currentSection + 1);
            setCurrentPage(0);
            setSliderValue(0);
        }
    };

    const handleBackClick = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            setSliderValue((currentPage - 1) / sections[currentSection].pages.length * 100);
        } else if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
            setCurrentPage(sections[currentSection - 1].pages.length - 1);
            setSliderValue(100);
        }
    };

    const renderQuestion = (question) => {
        console.log(question)
        switch (question.component_type) {
            case 'textboxfield':
                return <TextBoxField preview helpText={question?.help_text} fieldSettingParameters={question} label={question?.label} place type={question?.type} handleChange={''} />;
            case 'displayfield':
                return <DIsplayContentField />;
            case 'gpsfield':
                return <p>GPS Field</p>;
            case 'signaturefield':
                return <p>Signature Field</p>;
            case 'filefield':
                return <p>File Field</p>;
            case 'choiceboxfield':
                return <p>Choice Box Field</p>;
            case 'dateTimefield':
                return <p>Date Time Field</p>;
            case 'numberfield':
                return <p>Number Field</p>;
            case 'assetLocationfield':
                return <p>Asset Location Field</p>;
            case 'floorPlanfield':
                return <FloorPlanField />;
            case 'photofield':
                return <p>Photo Field</p>;
            case 'videofield':
                return <p>Video Field</p>;
            default:
                return <p>Unknown Field</p>;
        }
    };



    useOnClickOutside(modalRef, () => {
        dispatch(setModalOpen(false));
    });

    return (
        <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>

            <div ref={modalRef} className='h-[740px] flex justify-between flex-col border-[5px] border-[#2B333B] w-[367px] mx-auto bg-white rounded-[55px] relative px-4 pb-6 '>
                <p className='text-center text-3xl text-[#2B333B] font-semibold mt-7 mb-3'>Installation</p>
                <div>
                    {/* <Image src="Error-close" className="absolute top-5 right-5 cursor-pointer" data-testid="close-btn" onClick={() => handleClose()} /> */}
                    <Image src={src} className={`${className} mx-auto`} />
                </div>
                <div className='h-full w-full bg-slate-100 rounded-md'>
                    <div>
                        <p className="text-center text-2xl text-[#2B333B] font-[500] mt-7 mb-3">
                            {sections[currentSection].section_name}
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
                        {sections[currentSection].pages[currentPage].questions.map((question, index) => (
                            <div className=''>
                                <div className='px-2' key={index}>{renderQuestion(question)}</div>
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