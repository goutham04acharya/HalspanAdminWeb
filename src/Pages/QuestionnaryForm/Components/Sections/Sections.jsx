import React, { useContext, useEffect, useRef, useState } from 'react'
import EditableField from '../../../../Components/EditableField/EditableField'
import DraggableList from 'react-draggable-list'
import GlobalContext from '../../../../Components/Context/GlobalContext';
import { useDispatch } from 'react-redux';


function Sections({
    sectionData,
    sectionIndex,
    expandedSections,
    setExpandedSections,
    handleSaveSectionName,
    dataIsSame,
    setDataIsSame,
    selectedAddQuestion,
    handleDeletePgaeModal,
    setShowPageDeleteModal,
    setSelectedSectionData,
    setModalOpen,
    setSectionToDelete,
    setSections,
    sections,
    selectedQuestionId,
    handleAddRemovePage,
    componentMap,
}) {
    const sectionRefs = useRef([]);
    const pageRefs = useRef({});
    const dispatch = useDispatch();
    const { setToastError, setToastSuccess } = useContext(GlobalContext);

    // Function for dragging questions
    const Item = ({ item, index, itemSelected, dragHandleProps }) => {
        const { onMouseDown, onTouchStart } = dragHandleProps;

        return (
            <div
                data-testid={`section-${item.sectionIndex + 1}-page-${item.pageIndex + 1}-question-${item.index + 1}`}
                onClick={() => handleQuestionIndexCapture(item)}
                className={`disable-select select-none w-full  rounded-[10px] p-4 hover:border border-[#2B333B] ${item.question_id === selectedQuestionId ? 'border bg-[#d1d3d9b7]' : 'bg-[#EFF1F8]'}`}
            >
                <div className='flex justify-between items-start cursor-pointer'>
                    <div className='flex items-center justify-end w-full'>
                        <div
                            className="disable-select dragHandle"
                            onMouseDown={(e) => {
                                document.body.style.overflow = "hidden";
                                onMouseDown(e);
                            }}
                            onMouseUp={() => {
                                document.body.style.overflow = "visible";
                            }}
                            onTouchStart={(e) => {
                                document.body.style.overflow = "hidden";
                                onTouchStart(e);
                            }}
                            onTouchEnd={() => {
                                document.body.style.overflow = "visible";
                            }}
                        >
                            <img className='cursor-grab p-2 mb-2 absolute top-2 right-12 z-[9] rounded-full hover:bg-[#FFFFFF]' title='Drag' src={`/Images/drag.svg`} alt="Drag" />
                        </div>
                        <img
                            src="/Images/trash-black.svg"
                            alt="delete"
                            title='Delete'
                            className={`pl-2.5 cursor-pointer absolute top-2 right-2 p-2 mb-2 z-[9] rounded-full hover:bg-[#FFFFFF]`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeletequestionModal(item.sectionIndex, item.pageIndex, item);
                                setShowquestionDeleteModal(true);
                            }}
                        />
                    </div>
                </div>
                {/* Render the selected component if the question is visible */}
                {fieldSettingParams[item.question_id] && (
                    <>
                        {React.createElement(
                            componentMap[fieldSettingParams[item.question_id]?.componentType],
                            {
                                // Pass the specific field settings to the component
                                testId: `section-${item.sectionIndex + 1}-page-${item.pageIndex + 1}-question-${item.index + 1}`,
                                fieldSettingParameters: fieldSettingParams[item.question_id], // Pass the settings for this question ID
                            }
                        )}
                    </>
                )
                }
            </div>
        );
    };


    const handleAddRemoveQuestion = (event, sectionIndex, pageIndex, questionIndex, pageId) => {
        let currentPageData = sections[sectionIndex].pages[pageIndex];
        const update = { ...dataIsSame }
        update[sections[sectionIndex]?.section_id] = false;
        setDataIsSame(update)
        if (event === 'add') {
            if (currentPageData.questions.length < 20) {
                dispatch(setSelectedAddQuestion({ sectionIndex, pageIndex, questionIndex, pageId }));
                dispatch(setSelectedQuestionId(''));
            } else {
                setToastError("Limit reached: Maximum of 20 questions allowed.");
                return; // Exit the function if the limit is reached
            }
        } else if (event === 'remove') {
            dispatch(setSelectedQuestionId(false));
            dispatch(setSelectedAddQuestion({}));
            const questionId = currentPageData.questions[questionIndex].question_id
            const sectionId = currentPageData.questions[questionIndex].question_id.split('_')[0]
            currentPageData.questions = currentPageData?.questions?.filter((_, index) => index !== questionIndex);
            const currentSectionData = [...sections]
            currentSectionData[sectionIndex].pages[pageIndex] = currentPageData;
            handleAutoSave(sectionId, currentSectionData, '', questionId);
            // After any delete we remove focus on add question and change the field setting
        }
        setSelectedComponent(false);
        sections[sectionIndex].pages[pageIndex] = currentPageData;
        setSections([...sections]);
    };

    //this is for modal of delete section
    const handleDeleteModal = (sectionIndex, sectionData) => {
        setSectionToDelete(sectionIndex); // Set the section to delete
        setSelectedSectionData(sectionData)
        setModalOpen(true);
    }


    // to open and close the sections
    const toggleSection = (sectionIndex) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionIndex]: !prev[sectionIndex], // Toggle the section's expanded state
        }));
    };

    // Load expanded sections from localStorage on component mount
    useEffect(() => {
        const savedExpandedSections = localStorage.getItem('expandedSections');
        if (savedExpandedSections) {
            setExpandedSections(JSON.parse(savedExpandedSections));
        }
    }, []);

    // Save expanded sections to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('expandedSections', JSON.stringify(expandedSections));
    }, [expandedSections]);

    return (
        <div
            key={sectionData?.section_id}
            ref={el => sectionRefs.current[sectionIndex] = el}
            className={`p-[6px] hover:border-[#2B333B] hover:border rounded-[10px] ${expandedSections[sectionIndex] ? 'pb-6 my-[25px]' : 'pb-0 mt-[10px] mb-0'}`}>
            <div className='flex items-start justify-between w-full gap-3 relative'>
                {/* <img src="/Images/open-Filter.svg" alt="down-arrow" className='cursor-pointer pt-6 pl-2' /> */}
                <div className='flex items-start'>
                    <img
                        src="/Images/open-Filter.svg"
                        alt="down-arrow"
                        className={`cursor-pointer pt-6 pl-2 transform transition-transform duration-300 mr-2 ${expandedSections[sectionIndex] ? 'rotate-180 mt-5 ml-2' : '' // Rotate 180deg when expanded
                            }`}
                        onClick={() => toggleSection(sectionIndex)} // Toggle section on click
                    />
                    <EditableField
                        name={sectionData?.section_name}
                        index={sectionIndex}
                        handleSave={handleSaveSectionName}
                        section={true}
                        testId={`section-${sectionIndex}-name`}
                    />
                </div>
                <div className='flex items-center justify-end'>
                    <img src="/Images/drag.svg" alt="drag" className='p-2 rounded-full hover:bg-[#FFFFFF] cursor-pointer' />
                    <img src="/Images/trash-black.svg"
                        alt="delete"
                        title='Delete'
                        data-testid={`delete-btn-${sectionIndex}`}
                        className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#FFFFFF]'
                        // onClick={() => handleAddRemoveSection('remove', sectionIndex)}
                        onClick={() => handleDeleteModal(sectionIndex, sectionData)} // Open modal instead of directly deleting
                    />
                    <img src="/Images/save.svg"
                        alt="save"
                        title='Save'
                        data-testid={`save-btn-${sectionIndex}`}
                        className={`pl-2.5 p-2 rounded-full hover:bg-[#FFFFFF] ${dataIsSame[sectionData.section_id] ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => { if (!dataIsSame[sectionData.section_id]) handleSaveSection(sectionData?.section_id) }} />
                </div>
            </div>
            {expandedSections[sectionIndex] && (
                <>
                    {sectionData?.pages.map((pageData, pageIndex) => (
                        <div
                            key={pageData?.page_id}
                            ref={el => pageRefs.current[`${sectionIndex}-${pageIndex}`] = el}
                            className='mt-1 mx-1 bg-white rounded-[10px] px-4 pt-4 pb-[22px] hover:border-[#2B333B] hover:border'
                        >
                            <div className='flex items-start justify-between gap-7'>
                                <EditableField
                                    name={pageData?.page_name}
                                    index={sectionIndex}
                                    secondIndex={pageIndex}
                                    handleSave={handleSaveSectionName}
                                    testId={`page-${pageIndex}-name`}
                                    maxLength={1}
                                />
                                <div className='flex items-center justify-end'>
                                    <img src="/Images/drag.svg" alt="drag" className='p-2 rounded-full hover:bg-[#EFF1F8] cursor-pointer' />
                                    <img src="/Images/trash-black.svg"
                                        title='Delete'
                                        alt="Delete"
                                        data-testid={`delete-page-sec-${sectionIndex}-${pageIndex}`}
                                        className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#EFF1F8] w-[47px]'
                                        onClick={() => {
                                            handleDeletePgaeModal(sectionIndex, pageIndex, pageData),
                                                setShowPageDeleteModal(true)
                                        }}
                                    />
                                </div>
                            </div>
                            <DraggableList
                                itemKey="question_id"
                                template={Item}
                                list={pageData.questions.map((questionData, questionIndex) => ({
                                    ...questionData,
                                    sectionIndex,
                                    pageIndex,
                                    index: questionIndex,
                                }))}
                                onMoveEnd={(newList) => handleMoveEnd(newList, sectionIndex, pageIndex)}
                                container={() => document.body}
                            />
                            <div className={`mt-7 rounded-[10px] w-full px-3 hover:border border-[#2B333B] ${selectedAddQuestion?.pageId === pageData?.page_id ? 'border bg-[#d1d3d9b7]' : 'bg-[#EFF1F8]'}`}>
                                <button data-testid={`add-question-btn-section-${sectionIndex + 1}-page-${pageIndex + 1}`} onClick={() => handleAddRemoveQuestion('add', sectionIndex, pageIndex, '', pageData.page_id)} className='flex items-center justify-center w-full py-7 font-semibold text-[#2B333B] text-base'>
                                    <span className='mr-[15px]'>+</span>
                                    <span>Add question</span>
                                </button>
                            </div>
                        </div>
                    ))}
                    {/* Place "Add Page" button here, outside of the pages map */}
                    <button
                        onClick={() => handleAddRemovePage('add', sectionIndex, '', sectionData.section_id)}
                        data-testid={`add-page-sec-${sectionIndex}`}
                        className='flex items-center justify-center w-full rounded-[10px] py-7 mt-6 bg-white font-semibold text-[#2B333B] text-base hover:border hover:border-[#2B333B]'>
                        <span className='mr-[15px]'>+</span>
                        <span>Add page</span>
                    </button>
                </>
            )}
        </div>
    )
}

export default Sections