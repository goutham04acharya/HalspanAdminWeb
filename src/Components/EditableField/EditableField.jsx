import React, { useState, useRef, useEffect, useContext } from 'react';
import GlobalContext from '../Context/GlobalContext';

const EditableField = ({ name, index, secondIndex, handleSave, section, testId, formStatus }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(name);
    const inputRef = useRef(null);

    const { setToastError } = useContext(GlobalContext);

    useEffect(() => {
        if (isEditing) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleClick = () => {
        setInputValue(name);
        if(formStatus === 'Draft'){
            setIsEditing(true);
        }else{
            setIsEditing(false);
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (inputValue === name) {
            return;
        }
        if (!inputValue || inputValue?.trim() === '') {
            return;
        }
        handleSave(inputValue, index, secondIndex);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (!inputValue || inputValue?.trim() === '') {
                setToastError('Field required. Please enter a value');
                return;
            }
            setIsEditing(false);
            if (inputValue === name) {
                return;
            }
            handleSave(inputValue, index, secondIndex);
        }
    };

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <>
            {isEditing ? (
                <input
                    data-testid={testId}
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    maxLength={100}
                    className='text-[#2B333B] p-[10px] font-medium text-[22px] focus:outline-none border border-[#AEB3B7] rounded mb-1'
                />
            ) : (
                <p
                    data-testid={testId}
                    onClick={handleClick}
                    title={name}
                    className={`text-[#2B333B] p-[10px] font-medium text-[22px] ${formStatus === 'Draft' ? 'cursor-pointer' : 'cursor-default'} rounded mb-1 w-[85%] break-all break-words ml-1 ${section ? 'hover:bg-white' : 'hover:bg-[#EFF1F8]'}`}
                >
                    {name}
                </p>
            )}
        </>
    );
};

export default EditableField;
