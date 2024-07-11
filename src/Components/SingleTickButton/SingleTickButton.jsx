import React from 'react';
import { handleSearchParams } from '../../CommonMethods/ListFunctions';

const SingleTickButton = ({
    singleCheckText,
    isSelected,
    searchParams,
    setSearchParams,
    isLoading,
    dataTestId
}) => {
    const handleSingleButtonClick = (selectedText) => {
        handleSearchParams('citizen', selectedText.toLowerCase(), searchParams, setSearchParams);
    };
    return (
        <button className={`${isSelected ? 'bg-primary-normal text-[#fff]' : 'text-neutral-primary'} 
        px-6 py-1 rounded-[8px] text-[#ffffff] font-400 text-[14px] ${isLoading ? 'opacity-50' : ''}`} onClick={() =>
            handleSingleButtonClick(singleCheckText)} disabled={isLoading} data-testid={dataTestId}
        >
            {singleCheckText}
        </button>
    );
};

export default SingleTickButton;
