import React from 'react'

function SideLayout({ formDefaultInfo, sections, handleSection, handlePage }) {
    console.log(sections, 'naan')
    return (
        <div className='py-4'>
            <div className='flex items-center px-9'>
                <img src="/Images/form-name.svg" alt="form-name" />
                <p className='ml-3 font-semibold text-base text-[#2B333B]'>{formDefaultInfo?.internal_name}</p>
            </div>
            <div className='mt-5 overflow-auto default-sidebar h-customh8'>
                {sections.length > 0 && sections.map((sectionItem) => (
                    <div key={sectionItem?.section_id}>
                        <div className='flex items-center px-11 hover:bg-[#EFF1F8] cursor-pointer'
                        >
                            <img src="/Images/down-arrow.svg" alt="down-arrow" />
                            <p className='font-normal text-base text-[#2B333B] ml-3 py-[14px]'>{sectionItem?.section_name}</p>
                        </div>
                        {sectionItem?.pages.length > 0 && sectionItem?.pages.map((pageItem) => (
                            <div key={sectionItem?.page_id} className='flex items-center pl-14 hover:bg-[#EFF1F8] cursor-pointer'>
                                <p className='rounded-full w-2 h-2 bg-black mr-4'></p>
                                <p className='font-normal text-base text-[#2B333B] cursor-pointer py-[14px]'>{pageItem?.page_name}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideLayout