import React from 'react';

export default function FilterCheckbox ({
    id,
    searchParams,
    valueOf,
    checkboxText,
    handleSearchParams,
    isLoading
}) {
    /**
     * The function `handleOnChangeCheckbox` updates the state by toggling the boolean value of a
     * specific checkbox identified by `valueOf` and `id`.
     */
    const handleOnChangeCheckbox = () => {
        handleSearchParams(valueOf, id);
    };
    const getCheckedValue = () => {
        const params = Object.fromEntries(searchParams);
        if (params[valueOf]) {
            if (params[valueOf].split(',').includes(id)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    return (
        <div className="filter-checkbox checkbox relative">
            <input
                className=''
                type="checkbox"
                value={id}
                id={id}
                disabled={isLoading}
                checked={getCheckedValue()}
                onChange={() => handleOnChangeCheckbox()}
            />
            <label
                htmlFor={id}
                className={`inline-block pl-4 hover:cursor-pointer text-base font-normal text-neutral-primary capitalize 
                ${isLoading ? 'opacity-50' : ''}`}
            >
                {checkboxText}
            </label>
        </div>
    );
}
