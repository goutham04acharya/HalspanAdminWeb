import React from 'react';
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


const Questions = ({
    item,
    dragHandleProps,

}) => {

    const dispatch = useDispatch();
    const { onMouseDown, onTouchStart } = dragHandleProps;
    const { index, selectedQuestionId } = item;
    const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);

    const handleDeletequestionModal = (sectionIndex, pageIndex, questionData) => {
        dispatch(setQuestionToDelete({ sectionIndex, pageIndex, questionIndex: questionData.index }));
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
            />
        tagScanfield: (props) =>
            <TagScanField
                {...props}
            />,
    };

    const handleQuestionIndexCapture = (question) => {
        // Update state for selected question and reset component state
        dispatch(setSelectedQuestionId(question.question_id));
        dispatch(setSelectedAddQuestion({ questionId: question.question_id }));
        const componentType = fieldSettingParams[question.question_id]?.componentType;
        dispatch(setSelectedComponent(componentType));
    };

    return (
        <div
            data-testid={`section-${item.sectionIndex + 1}-page-${item.pageIndex + 1}-question-${index + 1}`}
            onClick={() => handleQuestionIndexCapture(item)}
            className={`disable-select select-none w-full rounded-[10px] p-4 hover:border border-[#2B333B] ${item.question_id === selectedQuestionId ? 'border bg-[#d1d3d9b7]' : 'bg-[#EFF1F8]'
                }`}
        >
            <div className='flex justify-between items-start cursor-pointer'>
                <div className='flex items-center justify-end w-full'>
                    {/* Drag Handle */}
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
                        <img
                            className='cursor-grab p-2 mb-2 absolute top-2 right-12 z-[9] rounded-full hover:bg-[#FFFFFF]'
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
                        className='pl-2.5 cursor-pointer absolute top-2 right-2 p-2 mb-2 z-[9] rounded-full hover:bg-[#FFFFFF]'
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeletequestionModal(item.sectionIndex, item.pageIndex, item);
                            dispatch(setShowquestionDeleteModal(true));
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
                            testId: `section-${item.sectionIndex + 1}-page-${item.pageIndex + 1}-question-${index + 1}`,
                            fieldSettingParameters: fieldSettingParams[item.question_id], // Pass the settings for this question ID
                        }
                    )}
                </>
            )}
        </div>
    );
};

export default Questions;
