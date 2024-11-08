import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewFixedChoice, removeFixedChoice, setFixedChoiceValue } from '../../fieldSettingParamsSlice';
import {setShouldAutoSave}  from '../../../QuestionnaryFormSlice'

const FixedChoiceDraggable = ({ item, dragHandleProps }) => {
    const { id, value, index, selectedQuestionId, formStatus } = item;
    const dispatch = useDispatch();
    const [localValue, setLocalValue] = useState(value);
    const debounceTimerRef = useRef(null); // Ref to store the debounce timer

    // Use `useSelector` to get the `fixedChoiceArray` from the Redux store
    const fixedChoiceArray = useSelector(state => state.fieldSettingParams.currentData[selectedQuestionId]?.fixedChoiceArray || []);

    const handleFixedChoiceChange = (e) => {
        const { value } = e.target;
        setLocalValue(value);
        dispatch(setFixedChoiceValue({ id, value, questionId: selectedQuestionId }));
        
        // Clear any existing debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set a new debounce timer
        debounceTimerRef.current = setTimeout(() => {
            dispatch(setShouldAutoSave(true));
        }, 1000); // 1000ms delay before auto-saving
    };

    const handleAddRemoveFixedChoice = (event, id) => {
        if (event === 'add') {
            dispatch(addNewFixedChoice({ questionId: selectedQuestionId }))
        } else if (event === 'remove') {
            dispatch(removeFixedChoice({ id, questionId: selectedQuestionId }))
        }
        dispatch(setShouldAutoSave(true));
    };

    return (
        <div className="disable-select select-none w-full pt-3 rounded-[10px]">
            <div className='flex justify-between items-start cursor-pointer'>
                <div className='flex items-center justify-center w-full'>
                    <div
                        className="disable-select dragHandle"
                        onMouseDown={formStatus === 'Draft' ?(e) => {
                            document.body.style.overflow = "hidden";
                            dragHandleProps.onMouseDown(e);
                        }:null}
                        onMouseUp={formStatus === 'Draft' ?() => {
                            document.body.style.overflow = "visible";
                        }:null}
                    >
                        <img className={`${formStatus === 'Draft' ? 'cursor-grab' : 'cursor-not-allowed'}`} src={`/Images/drag.svg`} alt="Drag" />
                    </div>
                    <input
                        type="text"
                        className='w-full border border-[#AEB3B7] rounded py-[11px] px-4 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                        placeholder={`Choice ${index + 1}`}
                        onChange={formStatus === 'Draft' ?handleFixedChoiceChange:null}
                        value={localValue}
                        id={id}
                        disabled={formStatus !== 'Draft'}
                        data-testid={`choice-${index + 1}`}
                        maxLength={50}
                    />
                    {fixedChoiceArray.length > 1 && <img
                        src="/Images/trash-black.svg"
                        alt="delete"
                        className={`pl-2.5 ${formStatus === 'Draft' ? 'cursor-pointer' : 'cursor-not-allowed'} p-2 rounded-full hover:bg-[#FFFFFF]`}
                        onClick={formStatus === 'Draft' ?() => handleAddRemoveFixedChoice('remove', id):null}
                        data-testid={`delete-choice-${index + 1}`}
                    />}
                    <img
                        src="/Images/add.svg"
                        alt="add"
                        data-testid={`add-choice-${index + 2}`}
                        className={`pl-2.5 ${formStatus === 'Draft' ? 'cursor-pointer' : 'cursor-not-allowed'} p-2 rounded-full hover:bg-[#FFFFFF]`}
                        onClick={formStatus === 'Draft' ?() => handleAddRemoveFixedChoice('add', id):null}
                    />
                </div>
            </div>
        </div>
    );
};

export default FixedChoiceDraggable;