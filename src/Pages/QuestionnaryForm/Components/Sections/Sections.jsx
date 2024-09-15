import React, { useContext, useEffect, useRef, useState } from 'react'
import EditableField from '../../../../Components/EditableField/EditableField'
import DraggableList from 'react-draggable-list'
import GlobalContext from '../../../../Components/Context/GlobalContext';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedAddQuestion, setSelectedQuestionId, setShouldAutoSave, setSelectedSectionData, setDataIsSame, setFormDefaultInfo, setSavedSection, setSelectedComponent, setSectionToDelete, setPageToDelete, setQuestionToDelete, setShowquestionDeleteModal } from '../QuestionnaryFormSlice'
import TextBoxField from '../Fields/TextBox/TextBoxField';
import ChoiceBoxField from '../Fields/ChoiceBox/ChoiceBoxField';
import DateTimeField from '../Fields/DateTime/DateTimeField';
import AssetLocationField from '../Fields/AssetLocation/AssetLocationField';
import NumberField from '../Fields/Number/NumberField';
import FloorPlanField from '../Fields/FloorPlan/FloorPlanField';
import PhotoField from '../Fields/PhotoField/PhotoFIeld';
import VideoField from '../Fields/VideoField/VideoField';
import FileField from '../Fields/File/FileFIeld';
import SignatureField from '../Fields/Signature/SignatureField';
import GPSField from '../Fields/GPS/GPSField';
import DIsplayContentField from '../Fields/DisplayContent/DIsplayContentField';
import Pages from '../PagesList/Pages';



function Sections({
    sectionData,
    sectionIndex,
    expandedSections,
    setExpandedSections,
    handleSaveSectionName,
    dataIsSame,
    handleDeletePgaeModal,
    setShowPageDeleteModal,
    selectedQuestionId,
    handleAddRemovePage,
    handleDeleteModal,
    handleSaveSection,
    handleAddRemoveQuestion,
    handleDeletequestionModal,
    handleMoveEnd,
}) {
    const sectionRefs = useRef([]);
    const dispatch = useDispatch();
    const { setToastError, setToastSuccess } = useContext(GlobalContext);
    const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);
    const selectedAddQuestion = useSelector((state) => state?.questionnaryForm?.selectedAddQuestion);


    // to open and close the sections

    const toggleSection = (sectionIndex) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionIndex]: !prev[sectionIndex], // Toggle the section's expanded state
        }));
    };

    // Load expanded sections from localStorage on component mount
    useEffect(() => {
        const savedExpandedSections = localStorage.getItem('expandedSections');
        if (savedExpandedSections) {
            setExpandedSections(JSON.parse(savedExpandedSections));
        }
    }, []);

    // Save expanded sections to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('expandedSections', JSON.stringify(expandedSections));
    }, [expandedSections]);


    return (
        <div
            key={sectionData?.section_id}
            id={sectionData?.section_id}
            ref={el => sectionRefs.current[sectionIndex] = el}
            className={`p-[6px] hover:border-[#2B333B] hover:border rounded-[10px] ${expandedSections[sectionIndex] ? 'pb-6 my-[25px]' : 'pb-0 mt-[10px] mb-0'}`}>
            <div className='flex items-start justify-between w-full gap-3 relative'>
                {/* <img src="/Images/open-Filter.svg" alt="down-arrow" className='cursor-pointer pt-6 pl-2' /> */}
                <div className='flex items-start'>
                    <img
                        src="/Images/open-Filter.svg"
                        alt="down-arrow"
                        className={`cursor-pointer pt-6 pl-2 transform transition-transform duration-300 mr-2 ${expandedSections[sectionIndex] ? 'rotate-180 mt-5 ml-2' : '' // Rotate 180deg when expanded
                            }`}
                        onClick={() => toggleSection(sectionIndex)} // Toggle section on click
                    />
                    <EditableField
                        name={sectionData?.section_name}
                        index={sectionIndex}
                        handleSave={handleSaveSectionName}
                        section={true}
                        testId={`section-${sectionIndex}-name`}
                    />
                </div>
                <div className='flex items-center justify-end'>
                    <img src="/Images/drag.svg" alt="drag" className='p-2 rounded-full hover:bg-[#FFFFFF] cursor-pointer' />
                    <img src="/Images/trash-black.svg"
                        alt="delete"
                        title='Delete'
                        data-testid={`delete-btn-${sectionIndex}`}
                        className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#FFFFFF]'
                        // onClick={() => handleAddRemoveSection('remove', sectionIndex)}
                        onClick={() => handleDeleteModal(sectionIndex, sectionData)} // Open modal instead of directly deleting
                    />
                    <img src="/Images/save.svg"
                        alt="save"
                        title='Save'
                        data-testid={`save-btn-${sectionIndex}`}
                        className={`pl-2.5 p-2 rounded-full hover:bg-[#FFFFFF] ${dataIsSame[sectionData.section_id] ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => { if (!dataIsSame[sectionData.section_id]) handleSaveSection(sectionData?.section_id) }} />
                </div>
            </div>
            {expandedSections[sectionIndex] && (
                <>
                    {sectionData?.pages.map((pageData, pageIndex) => (
                        <Pages
                            pageData={pageData}
                            handleSaveSectionName={handleSaveSectionName}
                            sectionIndex={sectionIndex}
                            pageIndex={pageIndex}
                            handleAddRemoveQuestion={handleAddRemoveQuestion}
                            handleMoveEnd={handleMoveEnd}
                            handleDeletePgaeModal={handleDeletePgaeModal}
                            setShowPageDeleteModal={setShowPageDeleteModal}
                        />
                    ))}
                    {/* Place "Add Page" button here, outside of the pages map */}
                    <button
                        onClick={() => handleAddRemovePage('add', sectionIndex, '', sectionData.section_id)}
                        data-testid={`add-page-sec-${sectionIndex}`}
                        className='flex items-center justify-center w-full rounded-[10px] py-7 mt-6 bg-white font-semibold text-[#2B333B] text-base hover:border hover:border-[#2B333B]'>
                        <span className='mr-[15px]'>+</span>
                        <span>Add page</span>
                    </button>
                </>
            )}
        </div>
    )
}

export default Sections