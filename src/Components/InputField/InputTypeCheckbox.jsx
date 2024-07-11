import React from 'react';

export default function InputTypeCheckbox (
    {
        id,
        checkboxText, handleOnChange, Checked, testId, disabled, index, selectedIndex,
        type
    }) {
    return (
        <div className="label-checkbox relative my-2 flex items-center">
            <input
                className="checkbox"
                type="checkbox"
                value={id}
                id={id}
                checked={Checked}
                disabled={disabled}
                onClick={(e) => {
                    handleOnChange(e, id, type || 'checkBox', index, selectedIndex, checkboxText);
                }}
            />
            <label
                htmlFor={id}
                data-testid={testId}
                className={`inline-block ml-4 ${!disabled ? 'hover:cursor-pointer' : ''} 
                text-[14px] leading-[22px] font-[400] text-neutral-primary`}>
                {checkboxText}
            </label>
        </div>
    );
}
