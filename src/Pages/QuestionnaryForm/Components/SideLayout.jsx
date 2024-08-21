import React from 'react'
import useObjects from '../../../customHooks/useObjects'

function SideLayout({ formDefaultInfo, sections, handleSection, handlePage, handleSectionScroll, handlePageScroll }) {

    // Create the initial dropdown state
    const initialDropdownState = sections.reduce((acc, sectionItem, index) => {
        acc[index] = false;  // Set all dropdowns to false initially
        return acc;
    }, {});

    // State for dropdowns
    const [dropdownOpen, setDropdown] = useObjects(initialDropdownState);

    const handleDropdown = (index) => {
        setDropdown(index, !dropdownOpen[index])
    }

    return (
        <div className='py-4'>
            <div className='flex items-center px-9'>
                <img src="/Images/form-name.svg" alt="form-name" />
                <p className='ml-3 font-semibold text-base text-[#2B333B] '>{formDefaultInfo?.internal_name}</p>
            </div>
            <div className='mt-5 overflow-auto default-sidebar h-customh8'>
                {sections?.length > 0 && sections?.map((sectionItem, sectionIndex) => (
                    <div key={sectionItem?.section_id}>
                        <div
                            onClick={() => {
                                handleDropdown(sectionIndex)
                                handleSectionScroll(sectionIndex)
                            }}
                            className='flex items-center px-11 hover:bg-[#EFF1F8] cursor-pointer'>
                            <img src="/Images/down-arrow.svg" alt="down-arrow" />
                            <p
                                data-testid={`sidebar-section-${sectionIndex}`}
                                title={sectionItem?.section_name}
                                className='font-normal text-base text-[#2B333B] ml-3 py-[14px] truncate'
                            >
                                {sectionItem?.section_name}
                            </p>
                        </div>
                        {sectionItem?.pages?.length > 0 && sectionItem?.pages.map((pageItem, pageIndex) => (
                            dropdownOpen[sectionIndex] && (
                                <div
                                    key={sectionItem?.page_id}
                                    onClick={() => handlePageScroll(sectionIndex, pageIndex)}
                                    className='flex items-center pl-14 hover:bg-[#EFF1F8] cursor-pointer truncate'
                                >
                                    <p className='rounded-full min-w-2 h-2 bg-black mr-4'></p>
                                    <p
                                        data-testid={`sidebar-page-${pageIndex}`}
                                        title={pageItem?.page_name}
                                        className='font-normal text-base text-[#2B333B] cursor-pointer py-[14px] truncate'
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