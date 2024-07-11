import React from 'react';

export default function InputTypeRadio ({ label, id, handleRadioButton, checkedState, name, disabled }) {
    return (
        <div class="relative custom-radioBlue py-2" >
            <input
                id={id}
                type="radio"
                name={name}
                onChange={handleRadioButton}
                checked={checkedState}
                disabled={disabled}
            />
            <label
                for={id}
                className="ml-5 text-neutral-primary text-[16px]
                        leading-[20px] font-normal cursor-pointer">{label}</label>
        </div>
    );
}
