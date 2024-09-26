import React from 'react';
import { useSelector } from 'react-redux';

function AdvancedEditor({ handleListSectionDetails, showSectionList }) {
    const allSectionDetails = useSelector((state) => state?.allsectiondetails?.allSectionDetails);
    console.log(allSectionDetails, 'me')

    return (
        <div className='mr-[18px] mt-[8%]'>
            <div className='relative'>
                <label htmlFor="editor"></label>
                <textarea
                    name="editor"
                    id="editor"
                    className='resize-none border border-[#AEB3B7] h-[230px] w-full py-[14px] pr-[14px] pl-[5%] rounded outline-0'
                ></textarea>
                <span
                    className="absolute left-[3%] top-[6%] cursor-pointer"
                    onClick={() => handleListSectionDetails()}
                >
                    =
                </span>
            </div>
            {showSectionList && (
                <div className='h-[260px] w-auto border border-[#AEB3B7] p-2.5 overflow-y-auto scrollbar_gray'>
                    {allSectionDetails?.data?.sections?.map((section) => (
                        <div key={section.section_id}>
                            {/* Always display the section name */}
                            <p>{section.section_name}</p>

                            {/* Check if pages exist */}
                            {section.pages?.length > 0 ? (
                                section.pages.map((page) => (
                                    <div key={page.page_id}>
                                        {/* Always display page name */}
                                        <p>{section.section_name}.{page.page_name}</p>
                                        {page.questions?.length > 0 ? (
                                            page.questions.map((question) => (
                                                <p key={question.question_id}>
                                                    {section.section_name}.{page.page_name}.{question.question_text || 'No Question Text'} {/* Display Question Text */}
                                                </p>
                                            ))
                                        ) : (
                                            '' // Message for no questions
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No Pages Available</p> // Message for no pages
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdvancedEditor;
