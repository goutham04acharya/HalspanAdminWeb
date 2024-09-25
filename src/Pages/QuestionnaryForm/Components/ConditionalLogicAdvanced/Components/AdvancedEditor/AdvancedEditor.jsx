import React from 'react';
import { useSelector } from 'react-redux';

function AdvancedEditor({ handleListSectionDetails, showSectionList }) {
    const allSectionDetails = useSelector((state) => state?.allsectiondetails?.allSectionDetails);
    console.log(allSectionDetails, 'mmmmmmmmmmmmmmm');

    return (
        <div className='mr-[18px] mt-[8%]'>
            <div className='relative'>
                <label htmlFor="editor"></label>
                <textarea
                    name="editor"
                    id="editor"
                    className='resize-none border border-[#AEB3B7] h-[230px] w-full py-[14px] pr-[14px] pl-[26px] rounded outline-0'
                ></textarea>
                <span
                    className="absolute left-[3%] top-[15.5%] cursor-pointer"
                    onClick={() => handleListSectionDetails()}
                >
                    =
                </span>
            </div>
            {showSectionList &&
                <div className='h-[260px] w-auto border border-[#AEB3B7] p-2.5 overflow-y-auto'>
                    {allSectionDetails?.map((section) => (
                        <div key={section.section_id}>
                            {section.pages?.map((page) => (
                                <div key={page.page_id}>
                                    {page.questions.length > 0 ? (
                                        page.questions.map((question) => (
                                            <p key={question.question_id}>
                                                {`${section.section_name}. ${page.page_name}. ${question.question_name}`}
                                            </p>
                                        ))
                                    ) : (
                                        '' // No output if there are no questions
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}

                </div>
            }
        </div>
    );
}

export default AdvancedEditor;
