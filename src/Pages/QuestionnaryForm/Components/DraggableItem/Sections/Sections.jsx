import React, { useContext, useEffect, useRef, useState } from "react";
import EditableField from "../../../../../Components/EditableField/EditableField";
import DraggableList from "react-draggable-list";
import { useDispatch, useSelector } from "react-redux";
import {
  setShouldAutoSave,
  setShowPageDeleteModal,
  setSelectedSectionData,
  setPageToDelete,
  setModalOpen,
  setDataIsSame
} from "../../QuestionnaryFormSlice";
import Pages from "../PagesList/Pages";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Sections({sectionData,
  sectionIndex,
  expandedSections,
  setExpandedSections,
  handleSaveSectionName,
  dataIsSame,
  handleAddRemovePage,
  handleAddRemoveQuestion,
  sections,
  setSections,
  handleAutoSave,
 }) {

  const sectionRefs = useRef([]);
  const dispatch = useDispatch();
  // const { onMouseDown, onTouchStart } = dragHandleProps;

  const handleDeletePageModal = (sectionIndex, pageIndex, pageData) => {
    dispatch(setPageToDelete({ sectionIndex, pageIndex })); // Ensure you're setting both sectionIndex and pageIndex correctly
    dispatch(setSelectedSectionData(pageData));
    dispatch(setModalOpen(true));
  }

  // Load expanded sections from localStorage on component mount
  useEffect(() => {
    const savedExpandedSections = localStorage.getItem("expandedSections");
    if (savedExpandedSections) {
      setExpandedSections(JSON.parse(savedExpandedSections));
    }
  }, []);

  // Save expanded sections to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("expandedSections", JSON.stringify(expandedSections));
  }, [expandedSections]);


  const onDragEnd = (result) => {
    if (!result.destination) return;
  
    const { source, destination } = result;
    // const sectionIndex = source.droppableId; // Assuming sectionIndex is provided by droppableId
    const pageIndex = source.index;
  
    // Create a copy of the current section's pages
    const updatedSections = [...sections];
    const reorderedPages = Array.from(updatedSections[sectionIndex]?.pages || []);
  
    // Reorder the pages based on drag and drop
    const [movedPage] = reorderedPages.splice(pageIndex, 1);
    reorderedPages.splice(destination.index, 0, movedPage);
  
    // Map reordered pages with updated indices
    const updatedPageList = reorderedPages.map((pageData, index) => ({
      ...pageData,  // Spread the existing page properties
      sectionIndex: sectionIndex,  // Set the sectionIndex for each page
      index: index,  // Update the page index in the reordered list
    }));
  
    // Update the specific section with the reordered pages
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      pages: updatedPageList,
    };
  
    // Set the updated sections state
    setSections(updatedSections);
  
    // Retrieve the sectionId from the updatedSections
    const sectionId = updatedSections[sectionIndex].section_id;
  
    // Update dataIsSame for the current section
    const updatedDataIsSame = { ...dataIsSame };
    updatedDataIsSame[sectionId] = false;
    dispatch(setDataIsSame(updatedDataIsSame));
  
    // Call handleAutoSave with the correct sectionId and updated sections
    handleAutoSave(sectionId, updatedSections);
  };

  return (
    <div
      key={sectionData?.section_id}
      id={sectionData?.section_id}
      ref={(el) => (sectionRefs.current[sectionIndex] = el)}
      className={`${expandedSections[sectionIndex]
        ? ""
        : "pb-0 mt-[10px] mb-0"
        }`}
    >
      {expandedSections[sectionIndex] && (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {sectionData?.pages?.map((pageData, pageIndex) => (
                    <Draggable
                      key={pageData.page_id}
                      draggableId={pageData.page_id}
                      index={pageIndex}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          // {...provided.dragHandleProps}
                          className="disable-select select-none w-full rounded-[10px] p-4 border mt-1 hover:border-[#2B333B] border-transparent bg-[#FFFFFF] mb-2.5"
                        >
                          <div className="flex justify-between">
                            <div className="flex items-center w-full">
                              {/* <img
                                src="/Images/open-Filter.svg"
                                alt="down-arrow"
                                className={`cursor-pointer pt-6 pl-2 transform transition-transform duration-300 mr-2 ${expandedSections[sectionIndex] ? "rotate-180 mt-5 ml-2" : "" // Rotate 180deg when expanded
                                  }`}
                                onClick={() => toggleSection(sectionIndex)} // Toggle section on click
                              /> */}
                              <EditableField
                                name={pageData?.page_name}
                                index={sectionIndex}
                                secondIndex={pageIndex}
                                handleSave={handleSaveSectionName}
                                testId={`page-${pageIndex}-name`}
                                maxLength={1}
                              />
                            </div>
                            <div className="flex items-center">
                              <img
                                className="cursor-grab p-2 rounded-full hover:bg-[#EFF1F8]"
                                title="Drag"
                                src={`/Images/drag.svg`}
                                alt="Drag"
                                {...provided.dragHandleProps}
                              />
                               <img src="/Images/trash-black.svg"
                                title='Delete'
                                alt="Delete"
                                data-testid={`delete-page-sec-${sectionIndex}-${pageIndex}`}
                                className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#EFF1F8] w-[47px]'
                                onClick={() => {
                                  handleDeletePageModal(sectionIndex, pageIndex, pageData),
                                    dispatch(setShowPageDeleteModal(true));
                                }}
                              />
                            </div>
                          </div>
                          <Pages
                            pageIndex={pageIndex}
                            pageData={pageData}
                            setShouldAutoSave={setShouldAutoSave}
                            handleSaveSectionName={handleSaveSectionName}
                            sectionIndex={sectionIndex}
                            handleAddRemoveQuestion={handleAddRemoveQuestion}
                            sections={sections}
                            handleAutoSave={handleAutoSave}
                            setSections={setSections}
                          />
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>

          <button
            onClick={() =>
              handleAddRemovePage(
                "add",
                sectionIndex,
                "",
                sectionData.section_id
              )
            }
            data-testid={`add-page-sec-${sectionIndex}`}
            className="flex items-center justify-center w-full rounded-[10px] py-7 mt-6 bg-white font-semibold text-[#2B333B] text-base hover:border hover:border-[#2B333B]"
          >
            <span className="mr-[15px]">+</span>
            <span>Add page</span>
          </button>
        </>
      )}
    </div>
  );
}

export default Sections;
