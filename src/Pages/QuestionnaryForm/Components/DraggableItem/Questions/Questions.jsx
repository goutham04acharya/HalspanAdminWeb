import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextBoxField from '../../Fields/TextBox/TextBoxField';
import ChoiceBoxField from '../../Fields/ChoiceBox/ChoiceBoxField';
import DateTimeField from '../../Fields/DateTime/DateTimeField';
import AssetLocationField from '../../Fields/AssetLocation/AssetLocationField';
import NumberField from '../../Fields/Number/NumberField';
import FloorPlanField from '../../Fields/FloorPlan/FloorPlanField';
import PhotoField from '../../Fields/PhotoField/PhotoFIeld';
import VideoField from '../../Fields/VideoField/VideoField';
import FileField from '../../Fields/File/FileFIeld';
import SignatureField from '../../Fields/Signature/SignatureField';
import GPSField from '../../Fields/GPS/GPSField';
import DIsplayContentField from '../../Fields/DisplayContent/DIsplayContentField';
import { setSelectedAddQuestion, setSelectedQuestionId, setSelectedSectionData, setShouldAutoSave, setDataIsSame, setFormDefaultInfo, setSavedSection, setSelectedComponent, setSectionToDelete, setPageToDelete, setQuestionToDelete, setShowquestionDeleteModal, setShowPageDeleteModal } from '../../QuestionnaryFormSlice'
import ComplanceLogicField from '../../Fields/ComplianceLogic/ComplanceLogicField';
import TagScanField from '../../Fields/TagScan/TagScanField';
import { formControlClasses } from '@mui/material';
import { saveCurrentData, setComplianceLogicCondition, setCurrentData, setcurrentQuestionLabel } from '../../Fields/fieldSettingParamsSlice';


const Questions = ({
    item,
    dragHandleProps,
    questionData,

}) => {

    const dispatch = useDispatch();
    const { onMouseDown, onTouchStart } = dragHandleProps;
    const { index, selectedQuestionId, formStatus, sections, replaceComplianceLogic } = item;
    const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);
    const savedData = useSelector(state => state.fieldSettingParams.savedData);
    const currentQuestionLabel = useSelector(state => state.fieldSettingParams.currentQuestionLabel);
    const { conditions } = useSelector(state => state.fieldSettingParams);

    const handleDeletequestionModal = (sectionIndex, pageIndex, item) => {
        dispatch(setSelectedQuestionId(item?.question_id))
        dispatch(setQuestionToDelete({ sectionIndex, pageIndex, questionIndex: item.index, questionName: fieldSettingParams[item.question_id].label }));
        dispatch(setSelectedSectionData(fieldSettingParams[selectedQuestionId]));
        dispatch(setShowquestionDeleteModal(true));
    };

    const componentMap = {
        textboxfield: (props) =>
            <TextBoxField
                {...props}
            />,
        choiceboxfield: (props) =>
            <ChoiceBoxField
                {...props}
            />,
        dateTimefield: (props) =>
            <DateTimeField
                {...props}
            />,
        assetLocationfield: (props) =>
            <AssetLocationField
                {...props}
            />,
        numberfield: (props) =>
            <NumberField
                {...props}
            />,
        floorPlanfield: (props) =>
            <FloorPlanField
                {...props}
            />,
        photofield: (props) =>
            <PhotoField
                {...props}
            />,
        videofield: (props) =>
            <VideoField
                {...props}
            />,
        filefield: (props) =>
            <FileField
                {...props}
            />,
        signaturefield: (props) =>
            <SignatureField
                {...props}
            />,
        gpsfield: (props) =>
            <GPSField
                {...props}
            />,
        displayfield: (props) =>
            <DIsplayContentField
                {...props}
            />,
        compliancelogic: (props) =>
            <ComplanceLogicField
                {...props}
            />,
        tagScanfield: (props) =>
            <TagScanField
                {...props}
            />,
    };
    const handleQuestionIndexCapture = (question) => {
        if (selectedQuestionId && currentQuestionLabel[selectedQuestionId] !== fieldSettingParams[selectedQuestionId]?.label) {
        }
        let currentLabel = {
            id: question.question_id,
            label: findQuestionPath(question?.question_id, fieldSettingParams[question?.question_id].label),
        }
        dispatch(setcurrentQuestionLabel(currentLabel))
        // Update state for selected question and reset component state
        dispatch(setSelectedQuestionId(question.question_id));
        dispatch(setSelectedAddQuestion({ questionId: question.question_id }));
        const componentType = fieldSettingParams[question.question_id]?.componentType;
        dispatch(setSelectedComponent(componentType));
    };

    //getting the path of the question
    const findQuestionPath = (questionId, label) => {
        for (const section of sections) {
            for (const page of section.pages) {
                for (const question of page.questions) {
                    if (question.question_id === questionId && !label) {
                        return `${section?.section_name?.replace(/ /g, "_")}.${page?.page_name?.replace(/ /g, "_")}.${question?.label?.replace(/ /g, "_")}`;
                    } else {
                        return `${section?.section_name?.replace(/ /g, "_")}.${page?.page_name?.replace(/ /g, "_")}.${label?.replace(/ /g, "_")}`;
                    }
                }
            }
        }
        return null; // Return null if question ID is not found
    };

    function recursiveUpdate(obj, oldName, newName) {
        return obj.map((item) => {
            let newItem = { ...item }; // Create a shallow copy of the object
    
            Object.keys(newItem).forEach((key) => {
                if (key === 'conditions') {
                    newItem[key] = newItem[key].map((condition) => ({
                        ...condition, // Create a new condition object
                        question_name: condition.question_name.includes(oldName)
                            ? condition.question_name.replace(oldName, newName)
                            : condition.question_name
                    }));
                } else if (key === 'elseIfBlocks') {
                    newItem[key] = newItem[key].map((conditionsgrp) => ({
                        ...conditionsgrp, // Create a new conditions group object
                        conditions: conditionsgrp.conditions.map((condition) => ({
                            ...condition, // Create a new condition object
                            question_name: condition.question_name.includes(oldName)
                                ? condition.question_name.replace(oldName, newName)
                                : condition.question_name
                        }))
                    }));
                }
            });
    
            return newItem;
        });
    }
    const handleQuestionLabelChange = (questionId) => {
        if (!fieldSettingParams[questionId]) return fieldSettingParams; // If questionId is not found, return original data

        // Create a new copy of fieldSettingParams
        const updatedFieldSettingParams = { ...fieldSettingParams };
        // Iterate through the object and update conditionally
        Object.keys(updatedFieldSettingParams).forEach((key) => {
            if (
                updatedFieldSettingParams[key].conditional_logic &&
                updatedFieldSettingParams[key].conditional_logic.includes(currentQuestionLabel[questionId].replace(/ /g, '_'))
            ) {
                updatedFieldSettingParams[key] = {
                    ...updatedFieldSettingParams[key],
                    conditional_logic: updatedFieldSettingParams[key].conditional_logic.replace(
                        new RegExp(currentQuestionLabel[questionId].replace(/ /g, '_'), 'g'),
                        findQuestionPath(questionId, fieldSettingParams[questionId]?.label).replace(/ /g, '_')
                    )
                };
                replaceComplianceLogic(currentQuestionLabel[questionId].replace(/ /g, '_'), findQuestionPath(questionId, fieldSettingParams[questionId]?.label).replace(/ /g, '_'));
                dispatch(setComplianceLogicCondition(recursiveUpdate(recursiveUpdate(conditions, currentQuestionLabel[questionId].replace(/ /g, '_'), findQuestionPath(questionId, fieldSettingParams[questionId]?.label).replace(/ /g, '_')))));
            }
        });
        console.log(updatedFieldSettingParams, 'updated')
        dispatch(setCurrentData(updatedFieldSettingParams));
        dispatch(saveCurrentData(updatedFieldSettingParams));
        return updatedFieldSettingParams;
        // Update the state
    };

    return (
        <div
            data-testid={`section-${item.sectionIndex + 1}-page-${item.pageIndex + 1}-question-${index + 1}`}
            onClick={() => handleQuestionIndexCapture(item)}
            className={`disable-select select-none w-full rounded-[10px] p-4 mb-4 hover:border border-[#2B333B] ${item.question_id === selectedQuestionId ? 'border bg-[#d1d3d9b7]' : 'bg-[#EFF1F8]'
                }`}
        >
            <div className='flex justify-between items-start cursor-pointer'>
                <div className='flex items-center justify-end w-full'>
                    {/* Drag Handle */}
                    <div
                        className="disable-select dragHandle"
                        onMouseDown={formStatus === 'Draft' ? (e) => {
                            document.body.style.overflow = "hidden";
                            onMouseDown(e);
                        } : null}
                        onMouseUp={formStatus === 'Draft' ? () => {
                            document.body.style.overflow = "visible";
                        } : null}
                        onTouchStart={formStatus === 'Draft' ? (e) => {
                            document.body.style.overflow = "hidden";
                            onTouchStart(e);
                        } : null}
                        onTouchEnd={formStatus === 'Draft' ? () => {
                            document.body.style.overflow = "visible";
                        } : null}
                    >
                        <img
                            className={`${formStatus === 'Draft' ? 'cursor-grab hover:bg-[#FFFFFF]' : 'cursor-not-allowed'} p-2 mb-2 absolute top-2 right-12 z-[9] rounded-full`}
                            title='Drag'
                            src={`/Images/drag.svg`}
                            alt="Drag"
                        />
                    </div>

                    {/* Delete Icon */}
                    <img
                        src="/Images/trash-black.svg"
                        alt="delete"
                        title='Delete'
                        className={`pl-2.5 ${formStatus === 'Draft' ? 'cursor-pointer hover:bg-[#FFFFFF]' : 'cursor-not-allowed'} absolute top-2 right-2 p-2 mb-2 z-[9] rounded-full `}
                        onClick={formStatus === 'Draft' ? (e) => {
                            e.stopPropagation();
                            handleDeletequestionModal(item.sectionIndex, item.pageIndex, item);
                            dispatch(setShowquestionDeleteModal(true));
                        } : null}
                    />
                </div>
            </div>

            {/* Render the selected component if the question is visible */}
            {fieldSettingParams[item.question_id] && (
                <>
                    {React.createElement(
                        componentMap[fieldSettingParams[item.question_id]?.componentType],
                        {
                            testId: `section-${item.sectionIndex + 1}-page-${item.pageIndex + 1}-question-${index + 1}`,
                            fieldSettingParameters: fieldSettingParams[item.question_id], // Pass the settings for this question ID
                            formStatus: formStatus
                        }
                    )}
                </>
            )}
        </div>
    );
};

export default Questions;
