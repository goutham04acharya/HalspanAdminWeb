import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// import { compareData, resetFixedChoice, saveCurrentData, setInitialData, setNewComponent } from './Components/Fields/fieldSettingParamsSlice.js';


function DraggableItem({ item, index, itemSelected, dragHandleProps, setSelectedQuestionId, selectedQuestionId, setSelectedAddQuestion, setSelectedComponent, componentMap }) {

    const { onMouseDown, onTouchStart } = dragHandleProps;
    const dispatch = useDispatch();
    const debounceTimerRef = useRef(null); // Ref to store the debounce timer
    const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);
    

    const handleQuestionIndexCapture = (question) => {
        // Update state for selected question and reset component state
        setSelectedQuestionId(question.question_id);
        setSelectedAddQuestion({ questionId: question.question_id });
        const componentType = fieldSettingParams[question.question_id]?.componentType;
        setSelectedComponent(componentType);
    };

    return (
        <div
            data-testid={`section-${item.sectionIndex + 1}-page-${item.pageIndex + 1}-question-${item.index + 1}`}
            onClick={() => handleQuestionIndexCapture(item)}
            className={`disable-select select-none w-full  rounded-[10px] p-4 hover:border border-[#2B333B] ${item.question_id === selectedQuestionId ? 'border bg-[#d1d3d9b7]' : 'bg-[#EFF1F8]'}`}
        >
            <div className='flex justify-between items-start cursor-pointer'>
                <div className='flex items-center justify-end w-full'>
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
                        <img className='cursor-grab p-2 mb-2 absolute top-2 right-12 z-[9] rounded-full hover:bg-[#FFFFFF]' title='Drag' src={`/Images/drag.svg`} alt="Drag" />
                    </div>
                    <img
                        src="/Images/trash-black.svg"
                        alt="delete"
                        title='Delete'
                        className={`pl-2.5 cursor-pointer absolute top-2 right-2 p-2 mb-2 z-[9] rounded-full hover:bg-[#FFFFFF]`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeletequestionModal(item.sectionIndex, item.pageIndex, item);
                            setShowquestionDeleteModal(true);
                        }}
                    />
                </div>
            </div>
            {/* Render the selected component if the question is visible */}
            {fieldSettingParams[item.question_id] && (
                <>
                    {React.createElement(
                        componentMap[fieldSettingParams[item.question_id]?.componentType],
                        {
                            // Pass the specific field settings to the component
                            testId: `section-${item.sectionIndex + 1}-page-${item.pageIndex + 1}-question-${item.index + 1}`,
                            fieldSettingParameters: fieldSettingParams[item.question_id], // Pass the settings for this question ID
                        }
                    )}
                </>
            )
            }
        </div>
    );
}

export default DraggableItem