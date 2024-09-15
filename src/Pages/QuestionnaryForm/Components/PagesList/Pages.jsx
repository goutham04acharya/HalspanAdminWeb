import React, { useRef } from 'react'
import EditableField from '../../../../Components/EditableField/EditableField';
import DraggableList from 'react-draggable-list';
import DraggableItem from '../DraggableItem/DraggableItem';
import { useSelector } from 'react-redux';
import { setSelectedAddQuestion, setSelectedQuestionId, setShouldAutoSave, setSelectedSectionData, setDataIsSame, setFormDefaultInfo, setSavedSection, setSelectedComponent, setSectionToDelete, setPageToDelete, setQuestionToDelete, setShowquestionDeleteModal } from '../QuestionnaryFormSlice'

function Pages({ pageData,
    handleSaveSectionName,
    sectionIndex,
    pageIndex,
    handleAddRemoveQuestion,
    handleMoveEnd,
    handleDeletePgaeModal,
    setShowPageDeleteModal,
    handleDeletequestionModal

}) {

    const pageRefs = useRef({});
    const selectedAddQuestion = useSelector((state) => state?.questionnaryForm?.selectedAddQuestion);
    const selectedQuestionId = useSelector((state) => state?.questionnaryForm?.selectedQuestionId);


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
                        <img src="/Images/drag.svg" alt="drag" className='p-2 rounded-full hover:bg-[#EFF1F8] cursor-pointer' />
                        <img src="/Images/trash-black.svg"
                            title='Delete'
                            alt="Delete"
                            data-testid={`delete-page-sec-${sectionIndex}-${pageIndex}`}
                            className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#EFF1F8] w-[47px]'
                            onClick={() => {
                                handleDeletePgaeModal(sectionIndex, pageIndex, pageData),
                                    setShowPageDeleteModal(true)
                            }}
                        />
                    </div>
                </div>
                <DraggableList
                    itemKey="question_id"
                    template={DraggableItem}
                    list={pageData.questions.map((questionData, questionIndex) => ({
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