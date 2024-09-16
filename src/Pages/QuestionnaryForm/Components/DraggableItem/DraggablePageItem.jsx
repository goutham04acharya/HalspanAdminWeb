import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedAddQuestion, setSelectedQuestionId, setSelectedSectionData, setDataIsSame, setFormDefaultInfo, setSavedSection, setSelectedComponent, setSectionToDelete, setPageToDelete, setQuestionToDelete, setShowquestionDeleteModal, setShowPageDeleteModal, setModalOpen } from '../QuestionnaryFormSlice'

function DraggablePageItem({ item,
    dragHandleProps, }) {

    const dispatch = useDispatch();
    const { onMouseDown, onTouchStart } = dragHandleProps;
    const { index, selectedQuestionId, setShouldAutoSave } = item;
    const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);

    const handleDeletePageModal = (sectionIndex, pageIndex, pageData) => {
        dispatch(setPageToDelete({ sectionIndex, pageIndex })); // Ensure you're setting both sectionIndex and pageIndex correctly
        dispatch(setSelectedSectionData(pageData));
        dispatch(setModalOpen(true));
    }

    const handlePageIndexCapture = (question) => {
        // Update state for selected question and reset component state
        dispatch(setSelectedQuestionId(question.question_id));
        dispatch(setSelectedAddQuestion({ questionId: question.question_id }));
        const componentType = fieldSettingParams[question.question_id]?.componentType;
        dispatch(setSelectedComponent(componentType));
    };


    return (
        <div
            data-testid={`section-${item.sectionIndex + 1}-page-${item.pageIndex + 1}`}
            onClick={() => handlePageIndexCapture(item)}
            className={`disable-select select-none w-full rounded-[10px] p-4 pt-4 pb-[22px] hover:border border-[#2B333B] bg-white ${item.question_id === selectedQuestionId ? 'border bg-[#d1d3d9b7]' : 'bg-[#EFF1F8]'}`}
        >
            <div className='flex justify-between items-start cursor-pointer'>
                <div className='flex items-center justify-end w-full'>
                    {/* Drag Handle */}
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
                            className='cursor-grab p-2 mb-2 absolute top-2 right-12 z-[9] rounded-full hover:bg-[#FFFFFF]'
                            title='Drag'
                            src={`/Images/drag.svg`}
                            alt="Drag"
                        />
                    </div>
                    <img
                        src="/Images/trash-black.svg"
                        alt="delete"
                        title='Delete'
                        className='pl-2.5 cursor-pointer absolute top-2 right-2 p-2 mb-2 z-[9] rounded-full hover:bg-[#FFFFFF]'
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePageModal(item.sectionIndex, item.pageIndex, item);
                            dispatch(setShowPageDeleteModal(true));
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default DraggablePageItem