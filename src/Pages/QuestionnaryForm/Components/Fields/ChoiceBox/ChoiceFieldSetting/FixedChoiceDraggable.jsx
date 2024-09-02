import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewFixedChoice, removeFixedChoice, setFixedChoiceValue } from '../../fieldSettingParamsSlice';

const FixedChoiceDraggable = ({ item, dragHandleProps }) => {
    const { id, value, index, selectedQuestionId, setShouldAutoSave } = item;
    const dispatch = useDispatch();
    const [localValue, setLocalValue] = useState(value);
    const debounceTimerRef = useRef(null); // Ref to store the debounce timer

    // Use `useSelector` to get the `fixedChoiceArray` from the Redux store
    const fixedChoiceArray = useSelector(state => state.fieldSettingParams.currentData[selectedQuestionId]?.fixedChoiceArray || []);

    const handleFixedChoiceChange = (e) => {
        const { value } = e.target;
        setLocalValue(value);
        dispatch(setFixedChoiceValue({ id, value, questionId: selectedQuestionId }));
        console.log('dispatched....')
        
        // Clear any existing debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set a new debounce timer
        debounceTimerRef.current = setTimeout(() => {
            setShouldAutoSave(true);
        }, 1000); // 1000ms delay before auto-saving
    };

    const handleAddRemoveFixedChoice = (event, id) => {
        if (event === 'add') {
            dispatch(addNewFixedChoice({ questionId: selectedQuestionId }))
        } else if (event === 'remove') {
            dispatch(removeFixedChoice({ id, questionId: selectedQuestionId }))
        }
        setShouldAutoSave(true);
    };

    return (
        <div className="disable-select select-none w-full pt-3 rounded-[10px]">
            <div className='flex justify-between items-start cursor-pointer'>
                <div className='flex items-center justify-center w-full'>
                    <div
                        className="disable-select dragHandle"
                        onMouseDown={(e) => {
                            document.body.style.overflow = "hidden";
                            dragHandleProps.onMouseDown(e);
                        }}
                        onMouseUp={() => {
                            document.body.style.overflow = "visible";
                        }}
                    >
                        <img className='cursor-grab' src={`/Images/drag.svg`} alt="Drag" />
                    </div>
                    <input
                        type="text"
                        className='w-full border border-[#AEB3B7] rounded py-[11px] px-4 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                        placeholder={`Choice ${index + 1}`}
                        onChange={handleFixedChoiceChange}
                        value={localValue}
                        id={id}
                        data-testid={`choice-${index + 1}`}
                        maxLength={50}
                    />
                    {fixedChoiceArray.length > 1 && <img
                        src="/Images/trash-black.svg"
                        alt="delete"
                        className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#FFFFFF]'
                        onClick={() => handleAddRemoveFixedChoice('remove', id)}
                        data-testid={`delete-choice-${index + 1}`}
                    />}
                    <img
                        src="/Images/add.svg"
                        alt="add"
                        data-testid={`add-choice-${index + 2}`}
                        className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#FFFFFF]'
                        onClick={() => handleAddRemoveFixedChoice('add', id)}
                    />
                </div>
            </div>
        </div>
    );
};

export default FixedChoiceDraggable;