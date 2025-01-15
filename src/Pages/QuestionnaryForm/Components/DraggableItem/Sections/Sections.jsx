import React, { useEffect, useRef } from "react";
import EditableField from "../../../../../Components/EditableField/EditableField";
import Pages from "../PagesList/Pages";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import {
  setShowPageDeleteModal,
  setSelectedSectionData,
  setPageToDelete,
  setDataIsSame,
  setSelectedQuestionId,
  setSelectedComponent
} from "../../QuestionnaryFormSlice";

const Sections = ({
  sectionData,
  sectionIndex,
  handleSaveSectionName,
  dataIsSame,
  handleAddRemovePage,
  handleAddRemoveQuestion,
  sections,
  setSections,
  // handleAutoSave,
  setSelectedPage,
  formStatus,
  setDropdown,
  setPageConditionLogicId,
}) => {
  const sectionRefs = useRef([]);
  const dispatch = useDispatch();

  const handleDeletePageModal = (sectionIndex, pageIndex, pageData) => {
    dispatch(setPageToDelete({ sectionIndex, pageIndex }));
    dispatch(setSelectedSectionData(pageData));
  };
  const onDragUpdate = (result) => {
    const { destination, draggableId } = result;

    if (!destination) {
      return;
    }

    // Get the dragged element
    const draggedElement = document.querySelector(`[data-rbd-draggable-id='${draggableId}']`);

    if (draggedElement) {
      // Scroll the container if the dragged element is near the top or bottom
      const container = draggedElement.closest("[data-rbd-droppable-id]");
      if (container) {
        const { top, bottom } = draggedElement.getBoundingClientRect();
        const { top: containerTop, bottom: containerBottom } = container.getBoundingClientRect();

        const buffer = 50; // Buffer distance in pixels

        // Scroll up if the dragged element is near the top
        if (top < containerTop + buffer) {
          container.scrollBy(0, -10);
        }

        // Scroll down if the dragged element is near the bottom
        if (bottom > containerBottom - buffer) {
          container.scrollBy(0, 10);
        }
      }
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedSections = [...sections];
    const reorderedPages = Array.from(updatedSections[sectionIndex]?.pages || []);
    const [movedPage] = reorderedPages.splice(source.index, 1);
    reorderedPages.splice(destination.index, 0, movedPage);

    const updatedPageList = reorderedPages.map((pageData, index) => ({
      ...pageData,
      sectionIndex: sectionIndex,
      index: index,
    }));

    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      pages: updatedPageList,
    };

    setSections(updatedSections);

    const sectionId = updatedSections[sectionIndex].section_id;
    const updatedDataIsSame = { ...dataIsSame };
    updatedDataIsSame[sectionId] = false;
    dispatch(setDataIsSame(updatedDataIsSame));
    // handleAutoSave(sectionId, updatedSections);
  };

  useEffect(() => {
    const initialDropdownState = sections.reduce((acc, _, i) => ({ ...acc, [i]: false }), {});
    setDropdown(initialDropdownState);
  }, []);

  return (
    <div
      key={sectionData?.section_id}
      id={sectionData?.section_id}
      ref={(el) => (sectionRefs.current[sectionIndex] = el)}
      className={"pb-0 mt-[10px] mb-0"}
    >
      <>
        <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
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
                        style={{
                          ...provided.draggableProps.style,
                          transform: provided.draggableProps.style?.transform
                            ? `translateY(${provided.draggableProps.style.transform.split(",")[1]}`
                            : "none",
                        }}
                        onClick={() => {
                          setSelectedPage(pageIndex);
                        }}
                        id={`${pageData?.page_id}-scroll`}
                        className="disable-select select-none w-full rounded-[10px] p-4 border mt-1 hover:border-[#2B333B] border-transparent bg-[#FFFFFF] mb-2.5"
                      >
                        <div className="flex justify-between w-full">
                          <div className="flex items-center w-full">
                            <EditableField
                              name={pageData?.page_name}
                              index={sectionIndex}
                              secondIndex={pageIndex}
                              handleSave={handleSaveSectionName}
                              testId={`page-${pageIndex}-name`}
                              maxLength={1}
                              formStatus={formStatus}
                            />
                          </div>
                          <div className="flex items-center ">
                            {pageData.page_conditional_logic ? (
                              <img
                                src="/Images/condition-added.svg"
                                alt="Condition Added"
                                title="Condition Added"
                                className={`pl-2.5 w-12 ${formStatus === 'Draft' ? 'cursor-pointer hover:bg-[#FFFFFF]' : 'cursor-not-allowed'
                                  } p-2 rounded-full`}
                                onClick={
                                  formStatus === 'Draft'
                                    ? () => {
                                      setPageConditionLogicId(pageData?.page_id);
                                      dispatch(setSelectedQuestionId(''));
                                      dispatch(setSelectedComponent(null));
                                    }
                                    : null
                                }
                              />
                            ) : (
                              <img
                                src="/Images/setting.svg"
                                title="page-condition-logic"
                                alt="page-condition-logic"
                                data-testid={`add-condition-section-${sectionIndex}-page-${pageIndex}`}
                                className={`pl-2.5 ${formStatus === 'Draft' ? 'cursor-pointer hover:bg-[#EFF1F8]' : 'cursor-not-allowed'
                                  } p-2 rounded-full w-[80px]`}
                                onClick={
                                  formStatus === 'Draft'
                                    ? () => {
                                      setPageConditionLogicId(pageData?.page_id);
                                      dispatch(setSelectedQuestionId(''));
                                      dispatch(setSelectedComponent(null));
                                    }
                                    : null
                                }
                              />
                            )}
                            {formStatus === 'Draft' ? (
                              <img
                                className="cursor-grab p-2 rounded-full hover:bg-[#EFF1F8]"
                                title="Drag"
                                src="/Images/drag.svg"
                                alt="Drag"
                                {...provided.dragHandleProps}
                              />
                            ) : (
                              <img
                                className="cursor-not-allowed p-2 rounded-full"
                                title="Drag"
                                src="/Images/drag.svg"
                                alt="Drag"
                              />
                            )}

                            {/* Delete Button */}
                            <img
                              src="/Images/trash-black.svg"
                              title="Delete"
                              alt="Delete"
                              data-testid={`delete-page-sec-${sectionIndex}-${pageIndex}`}
                              className={`pl-2.5 ${formStatus === 'Draft' ? 'cursor-pointer hover:bg-[#EFF1F8]' : 'cursor-not-allowed'} p-2 rounded-full w-[47px]`}
                              onClick={
                                formStatus === 'Draft'
                                  ? () => {
                                    handleDeletePageModal(sectionIndex, pageIndex, pageData);
                                    dispatch(setShowPageDeleteModal(true));
                                  }
                                  : null
                              }
                            />
                          </div>
                        </div>
                        <Pages
                          pageIndex={pageIndex}
                          pageData={pageData}
                          handleSaveSectionName={handleSaveSectionName}
                          sectionIndex={sectionIndex}
                          handleAddRemoveQuestion={handleAddRemoveQuestion}
                          sections={sections}
                          // handleAutoSave={handleAutoSave}
                          setSections={setSections}
                          formStatus={formStatus}
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
          onClick={
            formStatus === 'Draft'
              ? () => handleAddRemovePage("add", sectionIndex, "", sectionData.section_id)
              : null
          }
          data-testid={`add-page-sec-${sectionIndex}`}
          className="flex items-center justify-center w-full rounded-[10px] py-7 mt-4 bg-white font-semibold text-[#2B333B] text-base hover:border hover:border-[#2B333B]"
        >
          <span className="mr-[15px]">+</span>
          <span>Add page</span>
        </button>
      </>
    </div>
  );
};

export default Sections;
