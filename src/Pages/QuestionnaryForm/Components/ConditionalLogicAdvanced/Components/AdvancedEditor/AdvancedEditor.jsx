import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

function AdvancedEditor({
    handleListSectionDetails,
    showSectionList,
    inputValue,
    error,
    showMethodSuggestions,
    suggestions,
    handleClickToInsert,
    textareaRef,
    handleInputField
 }) {
    const allSectionDetails = useSelector((state) => state?.allsectiondetails?.allSectionDetails);

    return (
        <div className='mr-[18px] mt-[8%]'>
            <div className='relative'>
                <label htmlFor="editor"></label>
                <textarea
                    name="editor"
                    id="editor"
                    className='resize-none border border-[#AEB3B7] h-[230px] w-full py-[14px] pr-[14px] pl-[4%] rounded outline-0 text-2xl'
                    onChange={(event) => { handleInputField(event) }}
                    ref={textareaRef}
                    value={inputValue}
                ></textarea>
                <span
                    className="absolute left-[2%] top-[6%] cursor-pointer"
                    onClick={() => handleListSectionDetails()}
                >
                    =
                </span>
            </div>
            {/* Error message if no matching results */}
            {error && <div className='text-red-500 mt-2'>{error}</div>}

            {/* Show matching results if available */}
            {showSectionList && (
                <div className='h-[260px] w-auto border border-[#AEB3B7] p-2.5 overflow-y-auto scrollbar_gray'>
                    {/* Conditionally show method suggestions or the normal question list */}
                    {showMethodSuggestions ? (
                        <div className="suggestions-box">
                            {suggestions.map((method, index) => (
                                <div
                                    key={index}
                                    className="suggestion-item cursor-pointer"
                                    onClick={() => handleClickToInsert(method, true)} // Pass true for method
                                >
                                    {method}
                                </div>
                            ))}
                        </div>
                    ) : (
                        allSectionDetails?.data?.sections?.map((section) => {
                            const sectionName = section.section_name.replace(/\s+/g, '_');

                            if (inputValue && !sectionName.includes(inputValue)) {
                                return null; // Skip section if it doesn't match input
                            }

                            return (
                                <div key={section.section_id}>
                                    <p className='cursor-pointer' onClick={() => handleClickToInsert(`sections.${sectionName}`)}>
                                    sections.{sectionName}
                                    </p>
                                    {section.pages?.length > 0 ? (
                                        section.pages.map((page) => {
                                            const pageName = page.page_name.replace(/\s+/g, '_');

                                            if (inputValue && !pageName.includes(inputValue)) {
                                                return null; // Skip page if it doesn't match input
                                            }

                                            return (
                                                <div key={page.page_id}>
                                                    <p className='cursor-pointer' onClick={() => handleClickToInsert(`sections.${sectionName}.${pageName}`)}>
                                                    sections.{sectionName}.{pageName}
                                                    </p>
                                                    {page.questions?.length > 0 ? (
                                                        page.questions.map((question) => {
                                                            const questionName = question.question_name ? question.question_name.replace(/\s+/g, '_') : 'No_Question_Text';

                                                            if (inputValue && !questionName.includes(inputValue)) {
                                                                return null; // Skip question if it doesn't match input
                                                            }

                                                            return (
                                                                <p
                                                                    key={question.question_id}
                                                                    className='cursor-pointer'
                                                                    onClick={() => handleClickToInsert(`sections.${sectionName}.${pageName}.${questionName}`,false, question.component_type)}
                                                                >
                                                                sections.{sectionName}.{pageName}.{questionName}
                                                                </p>
                                                            );
                                                        })
                                                    ) : (
                                                        '' // No questions message
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        '' // No pages message
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}

export default AdvancedEditor;
