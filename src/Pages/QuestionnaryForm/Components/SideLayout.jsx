import React from 'react'

function SideLayout({ formDefaultInfo, sections }) {
    console.log(sections, 'naan')
    return (
        <div className='py-4 px-9'>
            <div className='flex items-center'>
                <img src="/Images/form-name.svg" alt="form-name" />
                <p className='ml-3 font-semibold text-base text-[#2B333B]'>{formDefaultInfo?.internal_name}</p>
            </div>
            <div>
                {sections.length > 0 && sections.map((sectionItem) => (
                    <div key={sectionItem?.section_id}>
                        <p className='font-normal text-base text-[#2B333B]'>{sectionItem?.section_name}</p>
                        {sectionItem?.pages.length > 0 && sectionItem?.pages.map((pageItem) => (
                            <div key={sectionItem?.page_id}>
                                <p className='font-normal text-base text-[#2B333B] cursor-pointer'>{pageItem?.page_name}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideLayout