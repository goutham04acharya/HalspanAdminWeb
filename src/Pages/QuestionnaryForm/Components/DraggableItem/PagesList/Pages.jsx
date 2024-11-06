import React, { useCallback, useEffect, useRef, useState } from "react";
import EditableField from "../../../../../Components/EditableField/EditableField";
import DraggableList from "react-draggable-list";
import { useDispatch, useSelector } from "react-redux";
import {
  setDataIsSame,
} from "../../QuestionnaryFormSlice";
import Questions from "../Questions/Questions";

function Pages({ pageIndex,
  pageData,
  sectionIndex,
  handleAddRemoveQuestion,
  handleDeletequestionModal,
  sections,
  handleAutoSave,
  setSections,
}) {

  const pageRefs = useRef({});
  const dispatch = useDispatch();
  const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);

  const selectedAddQuestion = useSelector(
    (state) => state?.questionnaryForm?.selectedAddQuestion
  );
  const selectedQuestionId = useSelector(
    (state) => state?.questionnaryForm?.selectedQuestionId
  );
  const dataIsSame = useSelector(
    (state) => state?.questionnaryForm?.dataIsSame
  );

  const handleMoveEnd = (newList, sectionIndex, pageIndex) => {
    // Create a copy of the sections array to avoid direct mutation
    const updatedSections = [...sections];

    // Create a copy of the specific page's data to avoid mutating the original data
    const updatedPages = [...updatedSections[sectionIndex].pages];

    // Create a copy of the questions and update with the new list
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      questions: newList,
    };

    // Update the specific section's pages with the updated pages
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      pages: updatedPages,
    };

    // Update the sections state with the updatedSections array
    setSections(updatedSections);

    // Retrieve the sectionId using the sectionIndex
    const sectionId = updatedSections[sectionIndex].section_id;

    // Update dataIsSame for the current section
    const update = { ...dataIsSame };
    update[sectionId] = false;
    dispatch(setDataIsSame(update));

    // Call handleAutoSave with the correct sectionId and updated sections
    handleAutoSave(sectionId, updatedSections);
  };

  return (
    <div>
      <div
        key={pageData?.page_id}
        id={pageData?.page_id}
        ref={(el) => (pageRefs.current[`${sectionIndex}-${pageIndex}`] = el)}
      // className="mt-1 mx-1 bg-white rounded-[10px] px-4 pt-4 pb-[22px] hover:border-[#2B333B] border border-transparent"
      >
        <div className="flex items-start justify-between gap-7">
          <div className="flex items-center justify-end">
          </div>
        </div>
        <DraggableList
          itemKey="question_id"
          template={Questions}
          list={pageData?.questions?.map((questionData, questionIndex) => ({
            ...questionData,
            sectionIndex,
            pageIndex,
            index: questionIndex,
            selectedQuestionId: selectedQuestionId,
            handleDeletequestionModal: handleDeletequestionModal,
          }))}
          onMoveEnd={(newList) =>
            handleMoveEnd(newList, sectionIndex, pageIndex)
          }
          container={() => document.body}
        />
        <div
          className={`${selectedAddQuestion.questionIndex === '' ? 'mt-0' : 'mt-4'} rounded-[10px] w-full px-3 hover:border border-[#2B333B] ${selectedAddQuestion?.pageId === pageData?.page_id
            ? "border bg-[#d1d3d9b7]"
            : "bg-[#EFF1F8]"
            }`}
        >
          <button
            data-testid={`add-question-btn-section-${sectionIndex + 1}-page-${pageIndex + 1
              }`}
            onClick={() =>
              handleAddRemoveQuestion(
                "add",
                sectionIndex,
                pageIndex,
                "",
                pageData.page_id
              )
            }
            className="flex items-center justify-center w-full py-7 font-semibold text-[#2B333B] text-base"
          >
            <span className="mr-[15px]">+</span>
            <span>Add question</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pages;
