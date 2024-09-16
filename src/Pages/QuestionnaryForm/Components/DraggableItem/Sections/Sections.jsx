import React, { useContext, useEffect, useRef, useState } from 'react'
import EditableField from '../../../../../Components/EditableField/EditableField'
import DraggableList from 'react-draggable-list'
import GlobalContext from '../../../../../Components/Context/GlobalContext';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedAddQuestion, setSelectedQuestionId, setShouldAutoSave, setShowPageDeleteModal, setSelectedSectionData, setDataIsSame, setFormDefaultInfo, setSavedSection, setSelectedComponent, setSectionToDelete, setPageToDelete, setQuestionToDelete, setShowquestionDeleteModal, setModalOpen } from '../../QuestionnaryFormSlice'
import Pages from '../PagesList/Pages';



function Sections({
    item,
    dragHandleProps,

}) {
    const { sectionData,
        sectionIndex,
        expandedSections,
        setExpandedSections,
        handleSaveSectionName,
        dataIsSame,
        selectedQuestionId,
        handleAddRemovePage,
        handleAddRemoveQuestion,
        sections,
        setSections,
        handleAutoSave,
    } = item

    console.log(sectionIndex, 'sectionIndex')

    const sectionRefs = useRef([]);
    const dispatch = useDispatch();
    const { onMouseDown, onTouchStart } = dragHandleProps;

    const handleDeleteModal = (sectionIndex, sectionData) => {
        console.log(sectionIndex, 'sectionIndex')
        dispatch(setSectionToDelete(sectionIndex)); // Set the section to delete
        setSelectedSectionData(sectionData)
        dispatch(setModalOpen(true));
    }

    const handleMoveEndPages = (newList, sectionIndex, pageIndex) => {
        // Create a copy of the sections array to avoid direct mutation
        const updatedSections = [...sections];

        const updatedNewList = newList.map(item => ({
            ...item.pageData, // Spread the pageData properties (questions, page_id, page_name)
            sectionIndex: item.sectionIndex,
            index: item.index,
        }));
        console.log(updatedNewList, 'updatedNewList')

        // Update the specific section's pages with the updated pages
        updatedSections[sectionIndex] = {
            ...updatedSections[sectionIndex],
            pages: updatedNewList,
        };
        console.log(newList, 'newListnewList')

        // Update the sections state with the updatedSections array
        setSections(updatedSections);
        console.log(updatedSections, 'updatedSections')

        // Retrieve the sectionId using the sectionIndex
        const sectionId = updatedSections[sectionIndex].section_id;
        console.log(sections, 'sectionID')

        // Update dataIsSame for the current section
        const update = { ...dataIsSame };
        update[sectionId] = false;
        dispatch(setDataIsSame(update));

        // Call handleAutoSave with the correct sectionId and updated sections
        handleAutoSave(sectionId, updatedSections);
    };

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
                    <div
                        className="disable-select dragHandle"
                        onMouseDown={(e) => {
                            document.body.style.overflow = "hidden";
                            onMouseDown(e);
                        }}
                        onMouseUp={() => {
                            document.body.style.overflow = "visible";
                        }}
                        onTouchStart={(e) => {
                            document.body.style.overflow = "hidden";
                            onTouchStart(e);
                        }}
                        onTouchEnd={() => {
                            document.body.style.overflow = "visible";
                        }}
                    >
                        <img
                            className='cursor-grab p-2 mb-2 absolute top-0 right-[80px] z-[9] rounded-full hover:bg-[#FFFFFF]'
                            title='Drag'
                            src={`/Images/drag.svg`}
                            alt="Drag"
                        />
                    </div>
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
                    <DraggableList
                        itemKey="page_id"
                        template={Pages}
                        list={sectionData?.pages?.map((pageData, pageIndex) => ({
                            pageData,
                            sectionIndex,
                            index: pageIndex,
                            setShouldAutoSave: setShouldAutoSave,
                            selectedQuestionId: selectedQuestionId,
                            handleAddRemoveQuestion: handleAddRemoveQuestion,
                            sections: sections,
                            setSections: setSections
                        }))}
                        onMoveEnd={(newList) => handleMoveEndPages(newList, sectionIndex)}
                        container={() => document.body}

                    >
                    </DraggableList>
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