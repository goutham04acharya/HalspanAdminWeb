import React, { useCallback, useEffect, useState, useRef, useContext } from 'react';
import SideLayout from '../../Pages/QuestionnaryForm/Components/SideLayout';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../../services/CustomHook/useApi.js';
import FormShimmer from '../../Components/Shimmers/FormShimmer.jsx';
import DraggableList from 'react-draggable-list';
import AddFields from './Components/AddFieldComponents/AddFields.jsx';
import Fieldsneeded from './Components/AddFieldComponents/Field.js';
import GlobalContext from '../../Components/Context/GlobalContext.jsx';
import TextBoxField from './Components/Fields/TextBox/TextBoxField.jsx';
import TestFieldSetting from './Components/Fields/TextBox/TextFieldSetting/TextFieldSetting.jsx';
import EditableField from '../../Components/EditableField/EditableField.jsx';
import globalStates from '../../Pages/QuestionnaryForm/Components/Fields/GlobalStates.js'
import ChoiceBoxField from './Components/Fields/ChoiceBox/ChoiceBoxField.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { compareData, saveCurrentData, setNewComponent } from './Components/Fields/fieldSettingParamsSlice.js';
import ChoiceFieldSetting from './Components/Fields/ChoiceBox/ChoiceFieldSetting/ChoiceFieldSetting.jsx';
import { v4 as uuidv4 } from 'uuid';
import ConfirmationModal from '../../Components/Modals/ConfirmationModal/ConfirmationModal.jsx';

function QuestionnaryForm() {
    const { questionnaire_id, version_number } = useParams();
    const navigate = useNavigate();
    const { getAPI } = useApi();
    const { PatchAPI } = useApi();
    const { DeleteAPI } = useApi();
    const section1Id = `SEC-${uuidv4()}`;
    const page1Id = `${section1Id}_PG-${uuidv4()}`;
    let [sections, setSections] = useState([{
        section_name: 'Section 1',
        section_id: section1Id,
        pages: [{
            page_id: page1Id,
            page_name: 'Page 1',
            questions: []
        }]
    }]);
    const [dataIsSame, setDataIsSame] = useState({});
    const { setToastError, setToastSuccess } = useContext(GlobalContext);
    const [pageLoading, setPageLoading] = useState(false);
    const [formDefaultInfo, setFormDefaultInfo] = useState([]);
    const [savedSection, setSavedSection] = useState([]);
    const [selectedQuestionDetails, setSelectedQuestionDetails] = useState({})
    const [inputVisibility, setInputVisibility] = useState({});
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [isThreedotLoader, setIsThreedotLoader] = useState(false)
    const sectionRefs = useRef([]);
    const pageRefs = useRef({});
    const questionRefs = useRef([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null); // Track the section to delete
    const [showPageDeleteModal, setShowPageDeleteModal] = useState(false);
    const [pageToDelete, setPageToDelete] = useState({ sectionIndex: null, pageIndex: null });



    // text field related states
    const [textFieldSettings, setTextFieldSettings] = useState(false)
    const [fieldSettingParameters, setFieldSettingParameters] = useState(globalStates.textbox);

    const dispatch = useDispatch();
    const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);
    const savedData = useSelector(state => state.fieldSettingParams.savedData);

    const handleCancel = () => {
        setModalOpen(false);
        setSectionToDelete(null); // Reset the section to delete
    }

    const handleDeleteModal = (sectionIndex) => {
        setSectionToDelete(sectionIndex); // Set the section to delete
        setModalOpen(true);
    }

    const confirmDeleteSection = () => {
        if (sectionToDelete !== null) {
            handleAddRemoveSection('remove', sectionToDelete); // Trigger the deletion
            setModalOpen(false); // Close the modal
        }
    }

    const handleInputClick = (fieldSettingParameters) => {
        // setTextFieldSettings(true)
        // setSelectedComponent(fieldSettingParams[selectedQuestionDetails.question_id]?.componentType || false)
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        // Check if the input field is 'min' or 'max' and restrict to numbers
        const updatedValue = (id === 'min' || id === 'max')
            ? value.replace(/[^0-9]/g, '')  // Allow only numeric input
            : value;

        setFieldSettingParameters((prevState) => ({
            ...prevState,
            [id]: updatedValue,
        }));
        dispatch(setNewComponent({ id, value, questionId: selectedQuestionDetails?.question_id }));
        const data = selectedQuestionDetails?.question_id?.split('_')
        const update = { ...dataIsSame }
        update[data[0]] = false;
        setDataIsSame(update)
    }

    const componentMap = {
        textboxfield: (props) =>
            <TextBoxField
                {...props}
            // handleChange={handleInputClick}
            // textFieldSettings={textFieldSettings}
            // fieldSettingParameters={fieldSettingParameters}
            />,
        choiceboxfield: (props) =>
            <ChoiceBoxField
                {...props}
            // handleChange={handleInputClick}
            // textFieldSettings={textFieldSettings}
            // fieldSettingParameters={fieldSettingParameters}
            />,
        // checkbox: (props) => <CheckboxField {...props} />,
        // video: (props) => <VideoField {...props} />,
        // audio: (props) => <AudioField {...props} />,
    };

    const sideComponentMap = {
        "textboxfield": TestFieldSetting,
        "choiceboxfield": ChoiceFieldSetting,
        // Add other mappings here...
    };

    const scrollToSection = (index) => {
        if (sectionRefs.current[index]) {
            sectionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToPage = (sectionIndex, pageIndex) => {
        const pageRefKey = `${sectionIndex}-${pageIndex}`;
        if (pageRefs.current[pageRefKey]) {
            pageRefs.current[pageRefKey].scrollIntoView({ behavior: 'smooth' });
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Draft':
                return 'bg-[#D6DDEC] text-[#2B333B]';
            case 'Testing':
                return 'bg-[#F8F0DE] text-[#2B333B]';
            case 'Published':
                return 'bg-[#DEF4E1] text-[#2B333B]';
            case 'Retired':
                return 'bg-[#E8D7D7] text-[#2B333B]';
            default:
                return '-';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Draft':
                return 'Draft';
            case 'Testing':
                return 'Testing';
            case 'Published':
                return 'Published';
            case 'Retired':
                return 'Retired';
            default:
                return '-';
        }
    };

    // Form related code
    const removeIndexAndShift = (indexToRemove) => {
        setDataIsSame((prevState) => {
            const newState = { ...prevState };

            // Check if the key exists, and if so, delete it
            if (newState.hasOwnProperty(indexToRemove)) {
                delete newState[indexToRemove];
            }

            return newState;
        });;
    };

    const handleAddRemoveSection = (event, sectionIndex) => {
        if (event === 'add') {
            const len = sections.length;
            if (len > 0) {
                handleSaveSection(sections[len - 1].section_id, false);
            }
            const sectionId = `SEC-${uuidv4()}`;
            const pageId = `${sectionId}_PG-${uuidv4()}`;
            const newSection = {
                section_name: `Section ${sections.length + 1}`,
                section_id: sectionId,
                pages: [{
                    page_id: pageId,
                    page_name: 'Page 1',
                    questions: []
                }],
            };
            setSections([...sections, newSection]);

            setTimeout(() => {
                sectionRefs.current[sections.length - 1]?.scrollIntoView({ behavior: 'smooth' });
            }, 800);

            // Enable save button for the new section
            const update = { ...dataIsSame };
            update[sectionId] = false; // Mark the new section as not saved
            setDataIsSame(update);

        } else if (event === 'remove') {

            // Retrieve the boolean value associated with the sectionId
            const sectionId = sections?.[sectionIndex]?.section_id;
            const isSaved = dataIsSame?.[sectionId] || false;

            if (isSaved) {
                handleDeleteSection(sections[sectionIndex].section_id);
            }
            const updatedSections = sections.filter((_, index) => index !== sectionIndex);
            setSections(updatedSections);

            const updatedSavdSections = savedSection.filter((_, index) => index !== sectionIndex);
            setSavedSection(updatedSavdSections);

            removeIndexAndShift(sections[sectionIndex].section_id);

            // Update the saved status
            // const update = { ...dataIsSame };
            // update.splice(sectionIndex, 1);
            // setDataIsSame(update);
        } else {
            sections = sections.splice(0, sectionIndex);
            setSections([...sections]);
        }
    };

    const handleAddRemovePage = (event, sectionIndex, pageIndex, sectionId) => {
        let currentSectionData = sections[sectionIndex];
        const update = { ...dataIsSame }
        update[sectionId] = false;
        setDataIsSame(update)
        if (event === 'add') {
            currentSectionData.pages = [
                ...currentSectionData.pages,
                {
                    page_id: `${sectionId}_PG-${uuidv4()}`,
                    page_name: `Page ${currentSectionData?.pages.length + 1}`,
                    questions: []
                }
            ];
        } else if (event === 'remove') {
            currentSectionData.pages = currentSectionData?.pages?.filter((_, index) => index !== pageIndex);
        }

        sections[sectionIndex] = currentSectionData;
        setSections([...sections]);
    };

    const handleAddRemoveQuestion = (event, sectionIndex, pageIndex, questionIndex, pageId) => {
        let currentPageData = sections[sectionIndex].pages[pageIndex];
        const update = { ...dataIsSame }
        update[sections[sectionIndex].section_id] = false;
        setDataIsSame(update)
        if (event === 'add') {
            currentPageData.questions = [...currentPageData.questions, {
                question_id: `${pageId}_QUES-${uuidv4()}`,
                question_name: `Question ${currentPageData.questions.length + 1}`,
            }];
        } else if (event === 'remove') {
            currentPageData.questions = currentPageData?.questions?.filter((_, index) => index !== questionIndex);
        }
        sections[sectionIndex].pages[pageIndex] = currentPageData;
        setSections([...sections]);
    };

    const handleQuestionIndexCapture = (question) => {
        const isQuestionExists = fieldSettingParams && fieldSettingParams.hasOwnProperty(question.question_id);

        if (!isQuestionExists) {
            setSelectedComponent(false)
            setSelectedQuestionDetails(question);
            return;
        }

        if (compareData(fieldSettingParams, savedData)) {
            setSelectedQuestionDetails(question);
            setSelectedComponent(fieldSettingParams[question.question_id].componentType || false)
            return;
        }
        setToastError('Please save!');
    };

    // Function for dragging questions
    const Item = ({ item, index, itemSelected, dragHandleProps }) => {
        const { onMouseDown, onTouchStart } = dragHandleProps;

        return (
            <div
                data-testid={`question-sec`}
                onClick={() => handleQuestionIndexCapture(item)}
                className={`disable-select select-none w-full bg-[#EFF1F8] mt-7 rounded-[10px] p-4 hover:border hover:border-[#2B333B] ${item.question_id === selectedQuestionDetails.question_id ? 'border-black border' : ''}`}
            >
                <div ref={questionRefs} className='flex justify-between items-start cursor-pointer'>
                    {!fieldSettingParameters &&
                        <p className='mb-5 font-medium text-base text-[#000000] w-[25%]'>{item?.question_text}</p>

                    }
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
                        >
                            <img className='cursor-grab' title='Drag' src={`/Images/drag.svg`} alt="Drag" />
                        </div>
                        <img src="/Images/trash-black.svg" title='Delete' alt="delete" className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#FFFFFF]' onClick={() => handleAddRemoveQuestion('remove', item.sectionIndex, item.pageIndex, item.index)} />
                    </div>
                </div>
                {/* Render the selected component if the question is visible */}
                {inputVisibility[item.question_id] && (
                    <>
                        {React.createElement(
                            componentMap[fieldSettingParams[item.question_id]?.componentType],
                            {
                                // Pass the specific field settings to the component
                                handleChange: handleInputClick,
                                fieldSettingParameters: fieldSettingParams[item.question_id], // Pass the settings for this question ID
                            }
                        )}
                    </>
                )}

            </div>
        );
    };

    const handleMoveEnd = (newList, sectionIndex, pageIndex) => {
        sections[sectionIndex].pages[pageIndex].questions = newList;
        setSections([...sections]);
        const update = { ...dataIsSame }
        update[sections[sectionIndex].section_id] = false;
        setDataIsSame(update)
    };

    // API calling function
    const formDefaultDetails = useCallback(async () => {
        setPageLoading(true);
        const response = await getAPI(`questionnaires/${questionnaire_id}/${version_number}`);
        setFormDefaultInfo(response?.data?.data);
        setSections(response?.data?.data?.sections);
        const sections = response?.data?.data?.sections || [];

        // Create an object with section_id as the key and true as the value
        const updatedSections = sections.reduce((acc, section) => {
            acc[section.section_id] = true;
            return acc;
        }, {});

        setDataIsSame(updatedSections);

        setPageLoading(false);
    }, [getAPI, questionnaire_id, version_number]);

    //API for deleteing the section

    const handleDeleteSection = async (sectionId) => {
        try {
            const response = await DeleteAPI(`questionnaires/${questionnaire_id}/${version_number}?section_id=${sectionId}`);
            if (response?.data?.status === 200) {
                setToastSuccess(response?.data?.data?.message);
            } else {
                setToastError('Something went wrong.');
            }
        } catch (error) {
            setToastError('Something went wrong.');
        }
    };

    const handleSaveSection = async (sectionId, showShimmer = true) => {
        // Find the section to save
        const sectionToSave = sections.find(section => section.section_id === sectionId);
        const sectionIndex = sections.findIndex(section => section.section_id === sectionId);

        if (sectionToSave) {
            // Create a new object containing only the selected section's necessary fields
            let body = {
                section_id: sectionToSave.section_id,
                section_name: sectionToSave.section_name,
                pages: sectionToSave.pages.map(page => ({
                    page_id: page.page_id,
                    page_name: page.page_name,
                    questions: page.questions.map(question => ({
                        question_id: question.question_id
                    }))
                }))
            }

            // Recursive function to remove specified keys
            const removeKeys = (obj) => {
                if (Array.isArray(obj)) {
                    obj.forEach(removeKeys);
                } else if (typeof obj === 'object' && obj !== null) {
                    delete obj.created_at;
                    delete obj.updated_at;
                    delete obj.questionnaire_id;
                    delete obj.version_number;
                    Object.values(obj).forEach(removeKeys);
                }
            };

            // Remove keys from the cloned body
            removeKeys(body);

            try {
                if (showShimmer) {
                    setPageLoading(true);
                }
                const response = await PatchAPI(`questionnaires/${questionnaire_id}/${version_number}`, body);
                if (showShimmer) {
                    setPageLoading(false);
                }
                if (!(response?.data?.error)) {
                    if (showShimmer) {
                        setToastSuccess(response?.data?.message);
                    }

                    // Update the saved status
                    const update = { ...dataIsSame };

                    update[sections[sectionIndex].section_id] = true;
                    setDataIsSame(update);
                } else {
                    setToastError('Something went wrong.');
                }
            } catch (error) {
                setToastError('Something went wrong.');
            }
        }
    };

    // Save the section and page name
    const handleSaveSectionName = (value, index, secondIndex) => {
        if (secondIndex !== undefined && secondIndex !== null) {
            const updatedSections = [...sections];
            updatedSections[index].pages[secondIndex].page_name = value;
            setSections(updatedSections);
            handleAutoSave(updatedSections[index]?.section_id, updatedSections);
            return;
        }
        const updatedSections = [...sections];
        updatedSections[index].section_name = value;
        setSections(updatedSections);
        handleAutoSave(updatedSections[index]?.section_id, updatedSections);
    }

    const handleAutoSave = async (sectionId, updatedData) => {
        // Find the section to save
        const sectionToSave = updatedData.find(section => section.section_id === sectionId);
        const sectionIndex = updatedData.findIndex(section => section.section_id === sectionId);
        if (sectionToSave) {
            // Create a new object containing only the selected section's necessary fields
            let body = {
                section_id: sectionToSave.section_id,
                section_name: sectionToSave.section_name,
                pages: sectionToSave.pages.map(page => ({
                    page_id: page.page_id,
                    page_name: page.page_name,
                    questions: page.questions.map(question => ({
                        question_id: question.question_id,
                        question_text: question.question_name,
                        // Include other necessary fields for questions here
                    }))
                }))
            };

            // Recursive function to remove specified keys
            const removeKeys = (obj) => {
                if (Array.isArray(obj)) {
                    obj.forEach(removeKeys);
                } else if (typeof obj === 'object' && obj !== null) {
                    delete obj.created_at;
                    delete obj.updated_at;
                    delete obj.questionnaire_id;
                    delete obj.version_number;
                    Object.values(obj).forEach(removeKeys);
                }
            };

            // Remove keys from the cloned body
            removeKeys(body);

            try {
                const response = await PatchAPI(`questionnaires/${questionnaire_id}/${version_number}`, body);
                if (!(response?.data?.error)) {
                    // Update the saved status
                    const update = { ...dataIsSame };

                    update[sections[sectionIndex].section_id] = true;
                    setDataIsSame(update);
                } else {
                    setToastError('Something went wrong');
                }
            } catch (error) {
                setToastError('Something went wrong');
            }
        }
    };

    const handleTextboxClick = () => {
        // Check if selectedQuestionDetails is not empty
        if (!selectedQuestionDetails || Object.keys(selectedQuestionDetails).length === 0) {
            return;
        }
        setSelectedComponent('textboxfield');
        dispatch(setNewComponent({ id: 'componentType', value: 'textboxfield', questionId: selectedQuestionDetails?.question_id }));
        // Toggle visibility for the selected question
        setInputVisibility(prevState => ({
            ...prevState,
            [selectedQuestionDetails.question_id]: true,
        }));
    };

    const handleChoiceClick = () => {
        // Check if selectedQuestionDetails is not empty
        if (!selectedQuestionDetails || Object.keys(selectedQuestionDetails).length === 0) {
            return;
        }
        setSelectedComponent('choiceboxfield');
        dispatch(setNewComponent({ id: 'componentType', value: 'choiceboxfield', questionId: selectedQuestionDetails?.question_id }));
        // Toggle visibility for the selected question
        setInputVisibility(prevState => ({
            ...prevState,
            [selectedQuestionDetails.question_id]: true,
        }));
    };

    const handleClick = (functionName) => {
        const functionMap = {
            handleTextboxClick,
            handleChoiceClick,
        };

        if (functionMap[functionName]) {
            functionMap[functionName]();
        }
    };

    //function for handle radio button
    const handleRadiobtn = (type) => {
        dispatch(setNewComponent({ id: 'type', value: type, questionId: selectedQuestionDetails?.question_id }));
        setFieldSettingParameters((prevState) => ({
            ...prevState,
            ['type']: type,
        }));
    }

    const handleSource = (source) => {

    }

    //function to save the field setting
    const handleSaveSettings = async () => {
        setIsThreedotLoader(true);
        const len = sections.length;
        if (len > 0) {
            handleSaveSection(sections[len - 1].section_id, false);
        }
        let body = {
            component_type: fieldSettingParams?.[selectedQuestionDetails?.question_id]?.componentType,
            label: fieldSettingParams?.[selectedQuestionDetails?.question_id]?.label,
            help_text: fieldSettingParams?.[selectedQuestionDetails?.question_id]?.helptext,
            placeholder_content: fieldSettingParams?.[selectedQuestionDetails?.question_id]?.placeholderContent,
            default_content: fieldSettingParams?.[selectedQuestionDetails?.question_id]?.defaultContent,
            type: fieldSettingParams?.[selectedQuestionDetails?.question_id]?.type,
            format: fieldSettingParams?.[selectedQuestionDetails?.question_id]?.format,
            lookup_id: fieldSettingParams?.[selectedQuestionDetails?.question_id]?.lookupOption,
            number_of_characters: {
                min: fieldSettingParams?.[selectedQuestionDetails?.question_id]?.min,
                max: fieldSettingParams?.[selectedQuestionDetails?.question_id]?.max,
            },
            admin_field_notes: fieldSettingParams?.note,
            source: {
                [fieldSettingParams?.[selectedQuestionDetails?.question_id]?.source === 'fixedList' ? 'fixed_list' : 'lookup']:
                    fieldSettingParams?.[selectedQuestionDetails?.question_id]?.source === 'lookup' ?
                        fieldSettingParams?.[selectedQuestionDetails?.question_id]?.lookupOptionChoice :
                        fieldSettingParams?.[selectedQuestionDetails?.question_id]?.fixedChoiceArray
            },
        };

        try {
            const response = await PatchAPI(`field-settings/${questionnaire_id}/${version_number}`, body);
            console.log(response?.data?.status);
            setIsThreedotLoader(false);
            setToastSuccess(response?.data?.message)
            if (response?.data?.status >= 400) {
                setToastError(response?.data?.data?.message || 'Something went wrong.');
            }
            setSelectedComponent(false)
            dispatch(saveCurrentData());
        } catch (error) {
            console.error(error);
            setIsThreedotLoader(false);
            setToastError('Failed to update field settings.'); // Provide a user-friendly error message
            setSelectedComponent(false);
        }
    };

    useEffect(() => {
        formDefaultDetails();
        setSavedSection(sections);
    }, []);

    return (
        <>
            {pageLoading ? (
                <FormShimmer />
            ) : (
                <div className='border-t border-[#DCE0EC] flex items-start h-customh5'>
                    <div className='w-[20%]'>
                        <SideLayout formDefaultInfo={formDefaultInfo} sections={sections} setSections={setSections} handleSectionScroll={scrollToSection} handlePageScroll={scrollToPage} />
                    </div>
                    <div className='w-[50%] '>
                        <div className='flex items-center w-full border-b border-[#DCE0EC] py-[13px] px-[26px]'>
                            <p className='font-normal text-base text-[#2B333B]'>ID {formDefaultInfo?.questionnaire_id} - {formDefaultInfo?.asset_type} - Version {formDefaultInfo?.version_number}</p>
                            <button className={`py-[4px] px-[19px] rounded-[15px] text-[16px] font-normal text-[#2B333B] capitalize ml-[30px] cursor-default ${getStatusStyles(formDefaultInfo?.status)} `} title={`${getStatusText(formDefaultInfo?.status)}`}>
                                {getStatusText(formDefaultInfo?.status)}
                            </button>
                        </div>
                        <div className='bg-[#EFF1F8] w-full py-[30px] px-[26px] h-customh6 overflow-auto default-sidebar'>
                            <p className='font-semibold text-[22px] text-[#2B333B]' data-testid="questionnaire-management-section">{formDefaultInfo?.internal_name}</p>
                            {sections?.map((sectionData, sectionIndex) => (
                                <div
                                    key={sectionData?.section_id}
                                    ref={el => sectionRefs.current[sectionIndex] = el}
                                    className='my-[25px] p-[6px] pb-6 hover:border-[#2B333B] hover:border rounded-[10px]'
                                >
                                    <div className='flex items-center w-full justify-between gap-7'>
                                        <EditableField
                                            name={sectionData?.section_name}
                                            index={sectionIndex}
                                            handleSave={handleSaveSectionName}
                                            section={true}
                                            testId={`section-${sectionIndex}-name`}
                                        />
                                        <div className='flex items-center justify-end'>
                                            <img src="/Images/trash-black.svg"
                                                alt="delete"
                                                title='Delete'
                                                data-testid={`delete-btn-${sectionIndex}`}
                                                className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#FFFFFF]'
                                                // onClick={() => handleAddRemoveSection('remove', sectionIndex)}
                                                onClick={() => handleDeleteModal(sectionIndex)} // Open modal instead of directly deleting
                                            />
                                            <img src="/Images/save.svg"
                                                alt="save"
                                                title='Save'
                                                data-testid={`save-btn-${sectionIndex}`}
                                                className={`pl-2.5 p-2 rounded-full hover:bg-[#FFFFFF] ${dataIsSame[sectionData.section_id] ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => { if (!dataIsSame[sectionData.section_id]) handleSaveSection(sectionData?.section_id) }} />
                                        </div>
                                    </div>
                                    {sectionData?.pages.map((pageData, pageIndex) => (
                                        <div
                                            key={pageData?.page_id}
                                            ref={el => pageRefs.current[`${sectionIndex}-${pageIndex}`] = el}
                                            className='mt-7 mx-1 bg-white rounded-[10px] px-4 pt-4 pb-[22px] hover:border-[#2B333B] hover:border'
                                        >
                                            <div className='flex items-center justify-between gap-7'>
                                                <EditableField
                                                    name={pageData?.page_name}
                                                    index={sectionIndex}
                                                    secondIndex={pageIndex}
                                                    handleSave={handleSaveSectionName}
                                                    testId={`page-${pageIndex}-name`}
                                                />
                                                <div className='flex items-center justify-end'>
                                                    <img src="/Images/trash-black.svg"
                                                        title='Delete'
                                                        alt="Delete"
                                                        data-testid={`delete-page-sec-${sectionIndex}-${pageIndex}`}
                                                        className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#EFF1F8]'
                                                        // onClick={() => handleAddRemovePage('remove', sectionIndex, pageIndex)} 
                                                        onClick={() => {
                                                            setPageToDelete({ sectionIndex, pageIndex });
                                                            setShowPageDeleteModal(true);
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
                                                    index: questionIndex
                                                }))}
                                                onMoveEnd={(newList) => handleMoveEnd(newList, sectionIndex, pageIndex)}
                                                container={() => document.body}
                                            />
                                            <div className='mt-7 bg-[#EFF1F8] rounded-[10px] w-full px-3 hover:border hover:border-[#2B333B]'>
                                                <button
                                                    data-testid={`add-question-${sectionIndex}`}
                                                    onClick={() => handleAddRemoveQuestion('add', sectionIndex, pageIndex, '', pageData.page_id)}
                                                    className='flex items-center justify-center w-full py-7 font-semibold text-[#2B333B] text-base'>
                                                    <span className='mr-[15px]'>+</span>
                                                    <span>Add question</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleAddRemovePage('add', sectionIndex, '', sectionData.section_id)}
                                        data-testid={`add-page-sec-${sectionIndex}`}
                                        className='flex items-center justify-center w-full rounded-[10px] py-7 mt-6 bg-white font-semibold text-[#2B333B] text-base hover:border hover:border-[#2B333B]'>
                                        <span className='mr-[15px]'>+</span>
                                        <span>Add Page</span>
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => handleAddRemoveSection('add')}
                                data-testid="add-section"
                                className='lex items-center mt-8 font-semibold text-[#2B333B] text-base'>
                                <span className='mr-[15px]'>+</span>
                                Add section
                            </button>
                        </div>
                    </div>
                    <div className='w-[30%]'>
                        <div className='border-b border-[#DCE0EC] flex items-center w-full'>
                            <button className='w-1/2 py-[17px] px-[29px] flex items-center font-semibold text-base text-[#2B333B] border-l border-r border-[#EFF1F8]' onClick={() => navigate('/questionnaries/create-questionnary')}>
                                <img src="/Images/cancel.svg" className='pr-2.5' alt="canc" />
                                Cancel
                            </button>
                            <button className='w-1/2 py-[17px] px-[29px] flex items-center font-semibold text-base text-[#2B333B] border-l border-r border-[#EFF1F8]'>
                                <img src="/Images/preview.svg" className='pr-2.5' alt="preview" />
                                Preview
                            </button>
                            {/* <button className='w-1/3 py-[17px] px-[29px] font-semibold text-base text-[#FFFFFF] bg-[#2B333B] border-l border-r border-[#EFF1F8]'
                                onClick={() => handleSaveSection()}
                            >
                                Save
                            </button> */}
                        </div>
                        <div>
                            {selectedComponent ? (
                                React.createElement(
                                    sideComponentMap[selectedComponent],  // Dynamically select the component
                                    {
                                        handleInputChange: handleInputChange,
                                        formParameters: fieldSettingParams[selectedQuestionDetails.question_id],
                                        handleRadiobtn: handleRadiobtn,
                                        fieldSettingParameters: fieldSettingParams[selectedQuestionDetails.question_id],
                                        setFieldSettingParameters: setFieldSettingParameters,
                                        handleSaveSettings: handleSaveSettings,
                                        isThreedotLoader: isThreedotLoader,
                                        handleSource: handleSource,
                                        selectedQuestionDetails: selectedQuestionDetails
                                    }
                                )
                            ) : (
                                <AddFields
                                    buttons={Fieldsneeded}
                                    handleClick={handleClick}
                                />
                            )}

                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && (
                <ConfirmationModal
                    text='Delete Section'
                    subText='Are you sure you want to delete this section?'
                    button1Style='border border-[#2B333B] bg-[#2B333B]'
                    Button1text='Delete'
                    Button2text='Cancel'
                    src='delete-gray'
                    testIDBtn1='confirm-delete'
                    testIDBtn2='cancel-delete'
                    isModalOpen={isModalOpen}
                    setModalOpen={setModalOpen}
                    handleButton1={confirmDeleteSection} // Call confirmDeleteSection on confirmation
                    handleButton2={handleCancel} // Handle cancel button
                />
            )}
            {showPageDeleteModal && (
                <ConfirmationModal
                    text='Delete Page'
                    subText='Are you sure you want to delete this page?'
                    button1Style='border border-[#2B333B] bg-[#2B333B]'
                    Button1text='Delete'
                    Button2text='Cancel'
                    src='delete-gray'
                    testIDBtn1='confirm-delete'
                    testIDBtn2='cancel-delete'
                    isModalOpen={showPageDeleteModal} 
                    setModalOpen={setShowPageDeleteModal} 
                    handleButton1={() => {
                        handleAddRemovePage('remove', pageToDelete.sectionIndex, pageToDelete.pageIndex);
                        setShowPageDeleteModal(false);
                    }} // Call handleAddRemovePage and close modal on confirmation
                    handleButton2={() => setShowPageDeleteModal(false)} // Handle cancel button
                />
            )}

        </>
    );
}


export default QuestionnaryForm;
