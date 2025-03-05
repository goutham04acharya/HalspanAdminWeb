import React, { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { setSelectedComponent } from "./QuestionnaryFormSlice";

function SideLayout({
  formDefaultInfo,
  sections,
  handlePageScroll,
  selectedSection,
  setSelectedSection,
  selectedPage,
  setSelectedPage,
  dropdownOpen,
  setDropdown,
  onDragEnd,
  formStatus,
  handleAddRemoveSection,
  handleSectionSaveOrder,
  handleSectionScroll,
  complianceLogic,
  setComplianceClick,
}) {
  const dispatch = useDispatch();

  const handleDropdown = (sectionId) => {
    if (dropdownOpen === sectionId) {
      setDropdown("");
      return;
    }
    setDropdown(sectionId);
  };

  useEffect(() => {
    if (sections?.length > 0) {
      setSelectedSection(sections[0]?.section_id);
      setDropdown(sections[0]?.section_id);
    }
  }, []);

  return (
    <div className="py-4">
      <div className="flex items-center px-9 pb-5">
        <img src="/Images/form-name.svg" alt="form-name" />
        <p
          title={formDefaultInfo?.internal_name}
          className="ml-3 font-semibold text-base text-[#2B333B] truncate w-[90%]"
        >
          {formDefaultInfo?.internal_name}
        </p>
      </div>
      <div className=" overflow-auto default-sidebar h-customh8">
        {/* onDragStart={handleDragStart} */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {sections?.length > 0 &&
                  sections?.map((sectionItem, sectionIndex) => (
                    <Draggable
                      key={sectionItem.section_id}
                      draggableId={sectionItem.section_id}
                      index={sectionIndex}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            // Ensure the transform exists and contains a Y-axis translation
                            transform: provided.draggableProps.style?.transform
                              ? `translateY(${
                                  provided.draggableProps.style.transform.split(
                                    ","
                                  )[1]
                                }`
                              : "none", // Fallback in case transform is null/undefined
                          }}
                          key={sectionItem?.section_id}
                        >
                          <div
                            onClick={() => {
                              setSelectedSection(sectionItem?.section_id);
                              setSelectedPage(null); // Reset selected page when a section is selected
                              handleDropdown(sectionItem?.section_id);
                              handleSectionScroll(
                                sectionIndex,
                                sectionItem?.section_id
                              );
                              setComplianceClick(false);
                            }}
                            className={`${
                              selectedSection === sectionItem?.section_id
                                ? "bg-[#d1d3d9b7]"
                                : "hover:bg-[#EFF1F8]"
                            } flex items-center w-full justify-between pl-11 pr-3 cursor-pointer`}
                          >
                            <div className="flex items-center w-[88%]">
                              <img
                                src="/Images/down-arrow.svg"
                                alt="down-arrow"
                                // className={dropdownOpen === sectionItem?.section_id ? 'rotate-0' : 'rotate-270'}
                              />
                              <p
                                data-testid={`sidebar-section-${sectionIndex}`}
                                title={sectionItem?.section_name}
                                className="font-normal text-base text-[#2B333B] ml-3 py-2 truncate"
                              >
                                {sectionItem?.section_name}
                              </p>
                            </div>
                            <div className="w-[12%] flex items-center">
                              {formStatus === "Draft" ? (
                                <img
                                  className="cursor-grab p-2 rounded-full hover:bg-[#FFFFFF] h-9 w-9"
                                  title="Drag"
                                  src={`/Images/drag.svg`}
                                  alt="Drag"
                                  {...provided.dragHandleProps}
                                />
                              ) : (
                                <img
                                  className="cursor-not-allowed p-2 rounded-full h-9 w-9"
                                  title="Drag"
                                  src={`/Images/drag.svg`}
                                  alt="Drag"
                                />
                              )}
                            </div>
                          </div>
                          {sectionItem?.pages?.length > 0 &&
                            sectionItem?.pages.map(
                              (pageItem, pageIndex) =>
                                dropdownOpen === sectionItem?.section_id && (
                                  <div
                                    key={pageItem?.page_id}
                                    onClick={() => {
                                      setSelectedSection(
                                        sectionItem?.section_id
                                      ); // Keep track of the section
                                      setSelectedPage(pageIndex); // Highlight the selected page
                                      handlePageScroll(
                                        sectionIndex,
                                        pageItem.page_id
                                      );
                                      setComplianceClick(false);
                                    }}
                                    className={`${
                                      selectedSection ===
                                        sectionItem?.section_id &&
                                      selectedPage === pageIndex
                                        ? "bg-[#d1d3d9b7]"
                                        : "hover:bg-[#EFF1F8]"
                                    } flex items-center pl-14 pr-2 cursor-pointer truncate`}
                                  >
                                    <p className="rounded-full min-w-2 h-2 bg-black mr-4"></p>
                                    <p
                                      data-testid={`sidebar-section-${sectionIndex}-page-${pageIndex}`}
                                      title={pageItem?.page_name}
                                      className="font-normal text-base text-[#2B333B] cursor-pointer py-2 truncate"
                                    >
                                      {pageItem?.page_name}
                                    </p>
                                  </div>
                                )
                            )}
                        </li>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        {complianceLogic.length > 0 && (
          <div
            className={`pl-11 py-2 cursor-pointer ${
              selectedSection === "compliance" ? "bg-[#d1d3d9b7]" : ""
            }`}
            onClick={() => {
              setComplianceClick(true);
              setSelectedSection("compliance");
              dispatch(setSelectedComponent("compliancelogic"));
            }}
          >
            Compliance Logic
          </div>
        )}
        <button
          onClick={
            formStatus === "Draft"
              ? () => {
                  handleAddRemoveSection("add");
                  handleSectionSaveOrder(sections);
                }
              : null
          }
          data-testid="add-section"
          className={`flex items-center ${
            formStatus === "Draft" ? "" : "cursor-not-allowed"
          } font-semibold text-[#2B333B] text-base mt-5 px-5`}
        >
          <span className="mr-[15px]">+</span>
          Add section
        </button>
      </div>
    </div>
  );
}

export default SideLayout;
