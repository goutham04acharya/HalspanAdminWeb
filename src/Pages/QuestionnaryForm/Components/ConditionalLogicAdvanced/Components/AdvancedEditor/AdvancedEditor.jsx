import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

function AdvancedEditor({ handleListSectionDetails, showSectionList }) {
    const allSectionDetails = useSelector((state) => state?.allsectiondetails?.allSectionDetails);
    const textareaRef = useRef(null); // To reference the textarea
    const [inputValue, setInputValue] = useState(''); // Track input value
    const [error, setError] = useState(''); // State to manage error message
    const [selectedFieldType, setSelectedFieldType] = useState(null); // Track the selected field type


    //this is my listing of types based on the component type
    const getFieldType = (componentType) => {
        let fieldType;
    
        switch (componentType) {
            case 'textbox':
            case 'textboxfield':  // Handle both cases if they map to 'string'
                fieldType = '';
                break;
            case 'datefield':
                fieldType = new Date;
                break;
            default:
                fieldType = 'unknown';  // Default case if componentType is not recognized
                break;
        }
    
        return fieldType;
    };


    //this is my function to store the cbasic sticture of my entire questionnary object
    function handleQuestionnaryObject(data) {
        const result = [];

        if (allSectionDetails?.data?.sections && allSectionDetails?.data?.sections.length > 0) {
            allSectionDetails?.data?.sections.forEach((section) => {
                console.log(section, 'nnnn')
                const sectionObject = {
                    section_id: section.section_id,
                    section_name: section.section_name,
                    pages: []
                };

                if (section.pages && section.pages.length > 0) {
                    section.pages.forEach((page) => {
                        const pageObject = {
                            page_id: page.page_id,
                            page_name: page.page_name,
                            questions: []
                        };

                        if (page.questions && page.questions.length > 0) {
                            page.questions.forEach((question) => {
                                const fieldType = getFieldType(question.component_type);
                                const questionObject = {
                                    question_id: question.question_id,
                                    question_name: question.question_name,
                                    component_type: question.component_type || 'unknown', // Handle null component_type
                                    field_type: fieldType  // Add the field type based on component_type

                                };
                                console.log(question.component_type, 'mmmmm')
                                pageObject.questions.push(questionObject);
                            });
                        }

                        sectionObject.pages.push(pageObject);
                    });
                }

                result.push(sectionObject);
            });
        }
        console.log(result, 'result')
        return result;
    }

    useEffect(() => {
        handleQuestionnaryObject();
    }, []);

    // Handle input change and check for matches
    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value); // Update input value

        // If there's no match and input is not empty, show error
        if (!checkForMatches(value) && value.trim() !== '') {
            setError('No matching variables found.');
        } else {
            setError(''); // Clear error if matches found
        }

        const lastChar = value.slice(-1);
        if (lastChar === '(') {
            insertAtCaret(event.target, ')');
        } else if (lastChar === '[') {
            insertAtCaret(event.target, ']');
        } else if (lastChar === '{') {
            insertAtCaret(event.target, '}');
        }
    };

    const insertAtCaret = (element, closingChar) => {
        const start = element.selectionStart;
        const end = element.selectionEnd;
        const textBefore = element.value.substring(0, start);
        const textAfter = element.value.substring(end);
        const newText = textBefore + closingChar + textAfter;

        element.value = newText;

        setTimeout(() => {
            element.selectionStart = element.selectionEnd = start;
        }, 0);
    };

    // Handle click on section/page/question to add to textarea
    const handleClickToInsert = (textToInsert) => {
        const textarea = textareaRef.current;
        if (textarea) {
            insertAtCaret(textarea, textToInsert);
        }
    };

    // Check if there are any matches based on input value
    const checkForMatches = (value) => {
        const matches = [];

        allSectionDetails?.data?.sections?.forEach((section) => {
            const sectionName = section.section_name.replace(/\s+/g, '_');
            if (sectionName.includes(value)) {
                matches.push(sectionName);
            }

            section.pages?.forEach((page) => {
                const pageName = page.page_name.replace(/\s+/g, '_');
                if (sectionName.includes(value) || pageName.includes(value)) {
                    matches.push(`${sectionName}.${pageName}`);
                }

                page.questions?.forEach((question) => {
                    const questionName = question.question_name ? question.question_name.replace(/\s+/g, '_') : 'No_Question_Text';
                    if (sectionName.includes(value) || pageName.includes(value) || questionName.includes(value)) {
                        matches.push(`${sectionName}.${pageName}.${questionName}`);
                    }
                });
            });
        });

        return matches.length > 0;
    };

    return (
        <div className='mr-[18px] mt-[8%]'>
            <div className='relative'>
                <label htmlFor="editor"></label>
                <textarea
                    name="editor"
                    id="editor"
                    className='resize-none border border-[#AEB3B7] h-[230px] w-full py-[14px] pr-[14px] pl-[4%] rounded outline-0 text-2xl'
                    onChange={() => { handleInputChange(event) }}
                    ref={textareaRef} // Attach the ref to the textarea
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
                    {allSectionDetails?.data?.sections?.map((section) => {
                        const sectionName = section.section_name.replace(/\s+/g, '_');

                        if (inputValue && !sectionName.includes(inputValue)) {
                            return null; // Skip section if it doesn't match input
                        }

                        return (
                            <div key={section.section_id}>
                                <p className='cursor-pointer' onClick={() => handleClickToInsert(sectionName)}>
                                    {sectionName}
                                </p>
                                {section.pages?.length > 0 ? (
                                    section.pages.map((page) => {
                                        const pageName = page.page_name.replace(/\s+/g, '_');

                                        if (inputValue && !pageName.includes(inputValue)) {
                                            return null; // Skip page if it doesn't match input
                                        }

                                        return (
                                            <div key={page.page_id}>
                                                <p className='cursor-pointer' onClick={() => handleClickToInsert(`${sectionName}.${pageName}`)}>
                                                    {sectionName}.{pageName}
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
                                                                onClick={() => handleClickToInsert(`${sectionName}.${pageName}.${questionName}`)}
                                                            >
                                                                {sectionName}.{pageName}.{questionName}
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
                    })}
                </div>
            )}

        </div>
    );
}

export default AdvancedEditor;
