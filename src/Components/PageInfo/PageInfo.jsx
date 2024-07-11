import React from 'react';

function PageInfo ({ totalCount, currentPage, g2p }) {
    // Calculate the range of results displayed on the current page
    const resultsPerPage = 10; // Assuming 10 results per page
    const startIndex = (currentPage - 1) * resultsPerPage + 1;
    const endIndex = Math.min(currentPage * resultsPerPage, totalCount);

    return (
        <div className={`font-[400] text-[14px] leading-[24px] text-neutral-primary
        absolute top-0 right-6 flex items-center p-1  ${g2p ? 'py-0' : 'py-6'}`}>
            Showing {startIndex} to {endIndex} of {totalCount} results
        </div>
    );
}

export default PageInfo;
