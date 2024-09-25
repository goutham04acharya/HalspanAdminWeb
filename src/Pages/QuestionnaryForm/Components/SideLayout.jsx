import React, { useState } from 'react'
import useObjects from '../../../customHooks/useObjects'

function SideLayout({ formDefaultInfo, sections, handleSection, handlePage, handleSectionScroll, handlePageScroll }) {

    // Create the initial dropdown state
    const initialDropdownState = sections.reduce((acc, sectionItem, index) => {
        acc[index] = false;  // Set all dropdowns to false initially
        return acc;
    }, {});

    // State for dropdowns
    const [dropdownOpen, setDropdown] = useObjects(initialDropdownState);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedPage, setSelectedPage] = useState(null);

    const handleDropdown = (index) => {
        setDropdown(index, !dropdownOpen[index])
    }

    return (
        <div className='py-4'>
            <div className='flex items-center px-9'>
                <img src="/Images/form-name.svg" alt="form-name" />
                <p
                    title={formDefaultInfo?.internal_name}
                    className='ml-3 font-semibold text-base text-[#2B333B] truncate w-[90%]'>{formDefaultInfo?.internal_name}</p>
            </div>
            <div className='mt-5 overflow-auto default-sidebar h-customh8'>
                {sections?.length > 0 && sections?.map((sectionItem, sectionIndex) => (
                    <div key={sectionItem?.section_id}>
                        <div
                            onClick={() => {
                                setSelectedSection(sectionIndex);
                                setSelectedPage(null); // Reset selected page when a section is selected
                                handleDropdown(sectionIndex);
                                handleSectionScroll(sectionIndex, sectionItem?.section_id);
                            }}
                            className={`${selectedSection === sectionIndex ? 'bg-[#d1d3d9b7]' : 'hover:bg-[#EFF1F8]'} flex items-center pl-11 pr-3 cursor-pointer`}>
                            <img src="/Images/down-arrow.svg" alt="down-arrow" />
                            <p
                                data-testid={`sidebar-section-${sectionIndex}`}
                                title={sectionItem?.section_name}
                                className='font-normal text-base text-[#2B333B] ml-3 py-2 truncate'
                            >
                                {sectionItem?.section_name}
                            </p>
                        </div>
                        {sectionItem?.pages?.length > 0 && sectionItem?.pages.map((pageItem, pageIndex) => (
                            dropdownOpen[sectionIndex] && (
                                <div
                                    key={pageItem?.page_id}
                                    onClick={() => {
                                        setSelectedSection(sectionIndex); // Keep track of the section
                                        setSelectedPage(pageIndex); // Highlight the selected page
                                        handlePageScroll(sectionIndex, pageItem.page_id);
                                    }}
                                    className={`${selectedSection === sectionIndex && selectedPage === pageIndex ? 'bg-[#d1d3d9b7]' : 'hover:bg-[#EFF1F8]'} flex items-center pl-14 pr-2 cursor-pointer truncate`}>
                                    <p className='rounded-full min-w-2 h-2 bg-black mr-4'></p>
                                    <p
                                        data-testid={`sidebar-page-${pageIndex}`}
                                        title={pageItem?.page_name}
                                        className='font-normal text-base text-[#2B333B] cursor-pointer py-2 truncate'
                                    >
                                        {pageItem?.page_name}
                                    </p>
                                </div>)
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideLayout