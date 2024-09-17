import React, { useRef } from 'react'
import EditableField from '../../../../../Components/EditableField/EditableField';
import DraggableList from 'react-draggable-list';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedAddQuestion, setSelectedQuestionId, setShouldAutoSave, setSelectedSectionData, setDataIsSame, setFormDefaultInfo, setSavedSection, setSelectedComponent, setSectionToDelete, setPageToDelete, setQuestionToDelete, setShowquestionDeleteModal, setShowPageDeleteModal, setModalOpen } from '../../QuestionnaryFormSlice'
import Questions from '../Questions/Questions';


function Pages({ item,
    dragHandleProps,

}) {
    const { pageIndex,
        pageData,
        setShouldAutoSave,
        handleSaveSectionName,
        sectionIndex,
        handleAddRemoveQuestion,
        handleDeletequestionModal,
        sections,
        handleAutoSave,
        setSections } = item;

    const { onMouseDown, onTouchStart } = dragHandleProps;

    const pageRefs = useRef({});
    const dispatch = useDispatch();
    const selectedAddQuestion = useSelector((state) => state?.questionnaryForm?.selectedAddQuestion);
    const selectedQuestionId = useSelector((state) => state?.questionnaryForm?.selectedQuestionId);
    const dataIsSame = useSelector((state) => state?.questionnaryForm?.dataIsSame);

    const handleMoveEnd = (newList, sectionIndex, pageIndex) => {

        // Create a copy of the sections array to avoid direct mutation
        const updatedSections = [...sections];

        // Create a copy of the specific page's data to avoid mutating the original data
        const updatedPages = [...updatedSections[sectionIndex].pages];

        // Create a copy of the questions and update with the new list
        updatedPages[pageIndex] = {
            ...updatedPages[pageIndex],
            questions: newList,
        };

        // Update the specific section's pages with the updated pages
        updatedSections[sectionIndex] = {
            ...updatedSections[sectionIndex],
            pages: updatedPages,
        };

        // Update the sections state with the updatedSections array
        setSections(updatedSections);

        // Retrieve the sectionId using the sectionIndex
        const sectionId = updatedSections[sectionIndex].section_id;

        // Update dataIsSame for the current section
        const update = { ...dataIsSame };
        update[sectionId] = false;
        dispatch(setDataIsSame(update));

        // Call handleAutoSave with the correct sectionId and updated sections
        handleAutoSave(sectionId, updatedSections);
    };

    const handleDeletePageModal = (sectionIndex, pageIndex, pageData) => {
        dispatch(setPageToDelete({ sectionIndex, pageIndex })); // Ensure you're setting both sectionIndex and pageIndex correctly
        dispatch(setSelectedSectionData(pageData));
        dispatch(setModalOpen(true));
    }

    return (
        <div>
            <div
                key={pageData?.page_id}
                id={pageData?.page_id}
                ref={el => pageRefs.current[`${sectionIndex}-${pageIndex}`] = el}
                className='mt-1 mx-1 bg-white rounded-[10px] px-4 pt-4 pb-[22px] hover:border-[#2B333B] hover:border'
            >
                <div className='flex items-start justify-between gap-7'>
                    <EditableField
                        name={pageData?.page_name}
                        index={sectionIndex}
                        secondIndex={pageIndex}
                        handleSave={handleSaveSectionName}
                        testId={`page-${pageIndex}-name`}
                        maxLength={1}
                    />
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
                                className='cursor-grab p-2 mb-2 absolute top-[18px] right-[60px] z-[9] rounded-full hover:bg-[#EFF1F8]'
                                title='Drag'
                                src={`/Images/drag.svg`}
                                alt="Drag"
                            />
                        </div>
                        <img src="/Images/trash-black.svg"
                            title='Delete'
                            alt="Delete"
                            data-testid={`delete-page-sec-${sectionIndex}-${pageIndex}`}
                            className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#EFF1F8] w-[47px]'
                            onClick={() => {
                                handleDeletePageModal(sectionIndex, pageIndex, pageData),
                                    dispatch(setShowPageDeleteModal(true));
                            }}
                        />
                    </div>
                </div>
                <DraggableList
                    itemKey="question_id"
                    template={Questions}
                    list={pageData?.questions?.map((questionData, questionIndex) => ({
                        ...questionData,
                        sectionIndex,
                        pageIndex,
                        index: questionIndex,
                        setShouldAutoSave: setShouldAutoSave,
                        selectedQuestionId: selectedQuestionId,
                        handleDeletequestionModal: handleDeletequestionModal,

                    }))}
                    onMoveEnd={(newList) => handleMoveEnd(newList, sectionIndex, pageIndex)}
                    container={() => document.body}
                />
                <div className={`mt-7 rounded-[10px] w-full px-3 hover:border border-[#2B333B] ${selectedAddQuestion?.pageId === pageData?.page_id ? 'border bg-[#d1d3d9b7]' : 'bg-[#EFF1F8]'}`}>
                    <button data-testid={`add-question-btn-section-${sectionIndex + 1}-page-${pageIndex + 1}`} onClick={() => handleAddRemoveQuestion('add', sectionIndex, pageIndex, '', pageData.page_id)} className='flex items-center justify-center w-full py-7 font-semibold text-[#2B333B] text-base'>
                        <span className='mr-[15px]'>+</span>
                        <span>Add question</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Pages