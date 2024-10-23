
import React, { useCallback, useEffect, useState, useRef, useContext } from 'react';
import SideLayout from '../../Pages/QuestionnaryForm/Components/SideLayout';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../../services/CustomHook/useApi.js';
import FormShimmer from '../../Components/Shimmers/FormShimmer.jsx';
import AddFields from './Components/AddFieldComponents/AddFields.jsx';
import Fieldsneeded from './Components/AddFieldComponents/Field.js';
import GlobalContext from '../../Components/Context/GlobalContext.jsx';
import TestFieldSetting from './Components/Fields/TextBox/TextFieldSetting/TextFieldSetting.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { resetFixedChoice, setInitialData, setNewComponent } from './Components/Fields/fieldSettingParamsSlice.js';
import ChoiceFieldSetting from './Components/Fields/ChoiceBox/ChoiceFieldSetting/ChoiceFieldSetting.jsx';
import { v4 as uuidv4 } from 'uuid';
import ConfirmationModal from '../../Components/Modals/ConfirmationModal/ConfirmationModal.jsx';
import DateTimeFieldSetting from './Components/Fields/DateTime/DateTimeFieldSetting/DateTimeFieldSetting.jsx';
import AssetLocationFieldSetting from './Components/Fields/AssetLocation/AssetLocationFieldSetting/AssetLocationFieldSetting.jsx';
import NumberFieldSetting from './Components/Fields/Number/NumberFieldSetting/NumberFieldSetting.jsx';
import FloorPlanSettings from './Components/Fields/FloorPlan/FloorPlanSettings/FloorPlanSettings.jsx';
import PhotoFieldSetting from './Components/Fields/PhotoField/PhtoFieldSetting/PhotoFieldSetting.jsx';
import VideoFieldSetting from './Components/Fields/VideoField/VideoFieldSetting/VideoFieldSetting.jsx';
import FileFieldSetting from './Components/Fields/File/FileFieldSetting/FileFieldSetting.jsx';
import SignatureFieldSetting from './Components/Fields/Signature/SignatureFieldSetting/SignatureFieldSetting.jsx';
import GPSFieldSetting from './Components/Fields/GPS/GPSFieldSetting/GPSFieldSetting.jsx';
import DisplayFieldSetting from './Components/Fields/DisplayContent/DisplayFieldSetting/DisplayFieldSetting.jsx';
import Sections from './Components/DraggableItem/Sections/Sections.jsx';
import { setSelectedAddQuestion, setSelectedQuestionId, setShouldAutoSave, setSelectedSectionData, setDataIsSame, setFormDefaultInfo, setSavedSection, setSelectedComponent, setSectionToDelete, setPageToDelete, setQuestionToDelete, setShowquestionDeleteModal, setShowPageDeleteModal, setModalOpen } from './Components/QuestionnaryFormSlice.js'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditableField from '../../Components/EditableField/EditableField.jsx';
import PreviewModal from './Components/Preview.jsx';
import ConditionalLogic from './Components/ConditionalLogicAdvanced/ConditionalLogic.jsx';


const QuestionnaryForm = () => {
    const { questionnaire_id, version_number } = useParams();
    const navigate = useNavigate();
    const { getAPI } = useApi();
    const { PatchAPI } = useApi();
    const { DeleteAPI } = useApi();
    const dispatch = useDispatch();
    const section1Id = `SEC-${uuidv4()}`;
    const page1Id = `${section1Id}_PG-${uuidv4()}`;
    let [sections, setSections] = useState([{
        section_name: 'Section 1',
        section_id: section1Id,
        pages: [{
            page_id: page1Id,
            page_name: 'Page 1',
            questions: []
        }],

    }]);

    const sectionRefs = useRef([]);
    const { setToastError, setToastSuccess } = useContext(GlobalContext);
    const [pageLoading, setPageLoading] = useState(false);
    const [isThreedotLoader, setIsThreedotLoader] = useState(false)
    const [validationErrors, setValidationErrors] = useState({});
    const [showReplaceModal, setReplaceModal] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [previewModal, setPreviewModal] = useState(false)
    // const [expandedSections, setExpandedSections] = useState({ 0: true }); // Set first section open by default
    const [expandedSections, setExpandedSections] = useState({ 0: true }); // Set first section open by default\
    const [conditionalLogic, setConditionalLogic] = useState(false);
    const [isDefaultLogic, setIsDefaultLogic] = useState(false);
    const [defaultString, setDefaultString] = useState('')
    // text field related states
    const selectedAddQuestion = useSelector((state) => state?.questionnaryForm?.selectedAddQuestion);
    const selectedQuestionId = useSelector((state) => state?.questionnaryForm?.selectedQuestionId);
    const shouldAutoSave = useSelector((state) => state?.questionnaryForm?.shouldAutoSave);
    const selectedSectionData = useSelector((state) => state?.questionnaryForm?.selectedSectionData);
    const dataIsSame = useSelector((state) => state?.questionnaryForm?.dataIsSame);
    const formDefaultInfo = useSelector((state) => state?.questionnaryForm?.formDefaultInfo);
    const savedSection = useSelector((state) => state?.questionnaryForm?.savedSection);
    const selectedComponent = useSelector((state) => state?.questionnaryForm?.selectedComponent);
    const sectionToDelete = useSelector((state) => state?.questionnaryForm?.sectionToDelete);
    const pageToDelete = useSelector((state) => state?.questionnaryForm?.pageToDelete);
    const questionToDelete = useSelector((state) => state?.questionnaryForm?.questionToDelete);
    const showquestionDeleteModal = useSelector((state) => state?.questionnaryForm?.showquestionDeleteModal);
    const showPageDeleteModal = useSelector((state) => state?.questionnaryForm?.showPageDeleteModal);
    const isModalOpen = useSelector((state) => state?.questionnaryForm?.isModalOpen);

    const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);
    // const savedData = useSelector(state => state.fieldSettingParams.savedData);  
    const debounceTimerRef = useRef(null); // Use useRef to store the debounce timer  
    const [latestSectionId, setLatestSectionId] = useState(null);
    const [saveClick, setSaveClick] = useState(false)
    const [isSectionSaved, setIsSectionSaved] = useState({});
    const [sectionName, setSectionName] = useState('')
    const [pageName, setPageName] = useState('')

    useEffect(() => {
        if (sections.length > 0) {
            const lastSection = sections[sections.length - 1]; // Get the latest section
            setLatestSectionId(lastSection.section_id);
            // handleSectionSaveOrder(sections)
        }
    }, [sections]); // This useEffect runs whenever `sections` changes



    // // to open and close the sections
    const toggleSection = (sectionIndex) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionIndex]: !prev[sectionIndex], // Toggle the section's expanded state
        }));
    };

    const handleCancel = () => {
        dispatch(setModalOpen(false));
        dispatch(setSectionToDelete(null)); // Reset the section to delete
    }
    const validateRegex = (value) => {
        const regexPattern = /^[a-zA-Z0-9\.\^\$\|\?\*\+\(\)\[\{\\\}\-\_\^\[\]\{\}\(\)\*\+\?\.\$\|\\]+$/;
        if (!regexPattern.test(value) || value.trim() === '') {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                regular_expression: 'Invalid regular expression',
            }));
        } else {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                regular_expression: '',
            }));
        }
    };
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        let updatedValue = value;
        // Restrict numeric input if the id is 'fileType'
        if (id === 'fileType') {
            // Remove numbers, spaces around commas, and trim any leading/trailing spaces
            updatedValue = value
                .replace(/[0-9]/g, '')      // Remove numbers
                .replace(/\s*,\s*/g, ',')   // Remove spaces around commas
                .replace(/[^a-zA-Z,]/g, ''); // Allow only alphabets and commas
        } else if (id === 'fileSize' || id === 'min' || id === 'max' || (id === 'incrementby' && fieldSettingParams?.[selectedQuestionId]?.type === 'integer')) {
            updatedValue = value.replace(/[^0-9]/g, ''); // Allow only numeric input
        } else if ((id === 'incrementby' && fieldSettingParams?.[selectedQuestionId]?.type === 'float')) {
            updatedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/(\.\d{2})\d+/, '$1');
        }
        //     // replace(/[^0-9.]/g, ''): Removes anything that is not a number or decimal point.
        //     // replace(/(\..*)\./g, '$1'): Ensures that only one decimal point is allowed by removing any additional decimal points.
        //     // replace(/(\.\d{2})\d+/, '$1'): Restricts the decimal part to exactly two digits by trimming anything beyond two decimal places.

        // Update the state dynamically
        dispatch(setNewComponent({ id, value: updatedValue, questionId: selectedQuestionId }));
        if (id === 'regular_expression') {
            // Clear the error message when the user focuses on the field again  
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                regular_expression: '',
            }));
        }

        // Don't forget to update the state and trigger auto-save
        dispatch(setNewComponent({ id, value: updatedValue, questionId: selectedQuestionId }));

        if (id === 'format_error') {
            dispatch(setNewComponent({ id: 'format_error', value: updatedValue, questionId: selectedQuestionId }));
        }
        // Check if the input field's id is the one you want to manage with inputValue
        if (id === 'urlValue') {
            if (updatedValue.length <= fieldSettingParams?.[selectedQuestionId].urlType.length) {
                updatedValue = fieldSettingParams?.[selectedQuestionId].urlType
            }

            dispatch(setNewComponent({ id, value: updatedValue, questionId: selectedQuestionId }));
        } else {
            dispatch(setNewComponent({ id, value: updatedValue, questionId: selectedQuestionId }));
        }

        if (id === 'max') {
            dispatch(setNewComponent({ id: 'max', value: updatedValue, questionId: selectedQuestionId }));
        }
        dispatch(setNewComponent({ id, value: updatedValue, questionId: selectedQuestionId }));

        if (id === 'min') {
            dispatch(setNewComponent({ id: 'min', value: updatedValue, questionId: selectedQuestionId }));
        }

        // Additional validation logic (min and max comparison)
        if (id === 'min' || id === 'max') {
            const minValue = id === 'min' ? updatedValue : fieldSettingParams?.[selectedQuestionId]?.min;
            const maxValue = (id === 'max') ? updatedValue : fieldSettingParams?.[selectedQuestionId]?.max

            if (Number(minValue) > Number(maxValue) || Number(minValue) === 0 && Number(maxValue) === 0) {
                setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    minMax: 'Minimum value should be less than maximum',
                }));
            } else {
                // Clear the error if values are valid
                setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    minMax: '',
                }));
            }
        }

        // Validate incrementby value against the max range
        if (id === 'incrementby') {
            const maxRange = Number(fieldSettingParams?.[selectedQuestionId]?.max);

            if (Number(updatedValue) > maxRange) {
                setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    incrementby: `Value cannot exceed the maximum range of ${maxRange}`,
                }));
            } else {
                // Clear the error if within the range
                setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    incrementby: '',
                }));
            }
        }

        const data = selectedQuestionId?.split('_');
        const update = { ...dataIsSame };
        update[data[0]] = false;
        setDataIsSame(update);


        // Clear any existing debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set a new debounce timer
        debounceTimerRef.current = setTimeout(() => {
            dispatch(setShouldAutoSave(true));
        }, 100); // 100ms delay before auto-saving
    };

    const sideComponentMap = {
        "textboxfield": TestFieldSetting,
        "choiceboxfield": ChoiceFieldSetting,
        "dateTimefield": DateTimeFieldSetting,
        "assetLocationfield": AssetLocationFieldSetting,
        "numberfield": NumberFieldSetting,
        "floorPlanfield": FloorPlanSettings,
        "photofield": PhotoFieldSetting,
        "videofield": VideoFieldSetting,
        "filefield": FileFieldSetting,
        "signaturefield": SignatureFieldSetting,
        "gpsfield": GPSFieldSetting,
        "displayfield": DisplayFieldSetting,
        // Add other mappings here...
    };

    const scrollToSection = (index, sectionId) => {
        // Check if section is closed, if so, expand it
        if (!expandedSections[index]) {
            toggleSection(index); // Assuming toggleSection will expand the section
        }

        // Add a slight delay to ensure DOM update before scrolling
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.error(`Element with id ${sectionId} not found`);
            }
        }, 300); // Delay to allow the section to open and render the page
    };

    const scrollToPage = (sectionIndex, pageId) => {

        // Check if the section is closed, if so, expand it
        if (!expandedSections[sectionIndex]) {
            toggleSection(sectionIndex); // Assuming toggleSection will expand the section
        }

        // Add a slight delay to ensure DOM update before scrolling
        setTimeout(() => {
            const element = document.getElementById(pageId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.error(`Element with id ${pageId} not found`);
            }
        }, 300); // Delay to allow the section to open and render the page
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
        dispatch(setDataIsSame((prevState) => {
            const newState = { ...prevState };

            // Check if the key exists, and if so, delete it
            if (newState.hasOwnProperty(indexToRemove)) {
                delete newState[indexToRemove];
            }

            return newState;
        }));;
    };

    const handleAddRemoveSection = (event, sectionIndex) => {
        if (event === 'add') {
            const sectionId = `SEC-${uuidv4()}`;
            const pageId = `${sectionId}_PG-${uuidv4()}`;
            const newSection = {
                section_name: `Section ${sections && sections.length + 1}`,
                section_id: sectionId,
                pages: [{
                    page_id: pageId,
                    page_name: 'Page 1',
                    questions: []
                }],
            };
            setSections((prevSections) => {
                const updatedSections = prevSections.concat(newSection);
                handleSectionSaveOrder(updatedSections); // Call handleSectionSaveOrder with the updated sections   
                return updatedSections;
            })

            setTimeout(() => {
                sectionRefs.current[sections && sections.length]?.scrollIntoView({ behavior: 'smooth' });
            }, 400);

            // Enable save button for the new section
            const update = { ...dataIsSame };
            update[sectionId] = false; // Mark the new section as not saved
            dispatch(setDataIsSame(update));
            handleSectionSaveOrder(sections);
            // return sectionId;

        } else if (event === 'remove') {
            // After any delete we remove focus on add question and change the field setting
            dispatch(setSelectedQuestionId(false))
            dispatch(setSelectedAddQuestion({}));
            dispatch(setSelectedComponent(''));

            // Retrieve the boolean value associated with the sectionId
            const sectionId = sections?.[sectionIndex]?.section_id;
            const isSaved = dataIsSame?.[sectionId] || false;

            if (isSaved) {
                handleDeleteSection(sections[sectionIndex]?.section_id);
            }
            const updatedSections = sections.filter((_, index) => index !== sectionIndex);
            setSections(updatedSections);

            const updatedSavdSections = savedSection.filter((_, index) => index !== sectionIndex);
            dispatch(setSavedSection(updatedSavdSections));

            removeIndexAndShift(sections[sectionIndex].section_id);
            handleSectionSaveOrder(updatedSections);

        } else {
            sections = sections?.splice(0, sectionIndex);
            setSections([...sections]);
        }
    };
    const confirmDeletePage = () => {
        if (pageToDelete.sectionIndex !== null && pageToDelete.pageIndex !== null) {
            handleAddRemovePage('remove', pageToDelete.sectionIndex, pageToDelete.pageIndex, sections[pageToDelete.sectionIndex].section_id);
            dispatch(setShowPageDeleteModal(false));
        }
    }

    const confirmDeleteQuestion = () => {
        if (questionToDelete.sectionIndex !== null && questionToDelete.pageIndex !== null && questionToDelete.questionIndex !== null) {
            handleAddRemoveQuestion('remove', questionToDelete.sectionIndex, questionToDelete.pageIndex, questionToDelete.questionIndex, sections[questionToDelete.sectionIndex].pages[questionToDelete.pageIndex].page_id);
            dispatch(setShowquestionDeleteModal(false));
        }
    }

    const handleAddRemovePage = (event, sectionIndex, pageIndex, sectionId) => {
        let currentSectionData = sections[sectionIndex];
        const update = { ...dataIsSame }
        update[sectionId] = false;
        dispatch(setDataIsSame(update));

        if (event === 'add') {
            if (currentSectionData.pages.length < 20) {

                const SectionData = [...sections];  // Create a copy of the sections array
                const currentSectionData = { ...SectionData[sectionIndex] };  // Copy the specific section data

                // Add a new page to the current section's pages array
                currentSectionData.pages = [
                    ...currentSectionData.pages,
                    {
                        page_id: `${sectionId}_PG-${uuidv4()}`,
                        page_name: `Page ${currentSectionData?.pages.length + 1}`,
                        questions: []
                    }
                ];

                // Save the updated section back to the sections array
                SectionData[sectionIndex] = currentSectionData;

                // Update the state with the new sections array
                setSections(SectionData);

            } else {
                setToastError("Limit reached: Maximum of 20 pages allowed.");
                return; // Exit the function if the limit is reached
            }
            // setIsSectionSaved(prevState => ({ ...prevState, [sectionId]: false }));
        } else if (event === 'remove') {
            // After any delete we remove focus on add question and change the field setting
            dispatch(setSelectedQuestionId(false));
            dispatch(setSelectedAddQuestion({}));
            dispatch(setSelectedComponent(''));

            const SectionData = [...sections];  // Create a copy of the sections array
            const currentSectionData = { ...SectionData[sectionIndex] };  // Copy the specific section data

            const sectionId = currentSectionData.pages[pageIndex].page_id.split('_')[0];
            const pageId = currentSectionData.pages[pageIndex].page_id

            // Update the pages array by filtering out the page at the specified index
            currentSectionData.pages = currentSectionData.pages.filter((_, index) => index !== pageIndex);

            // Save the updated section back to the sections array
            SectionData[sectionIndex] = currentSectionData;

            // Update the state with the new sections array
            setSections(SectionData);

        }
    };

    const handleAddRemoveQuestion = (event, sectionIndex, pageIndex, questionIndex, pageId) => {
        let currentPageData = { ...sections[sectionIndex].pages[pageIndex] }; // Clone currentPageData
        const update = { ...dataIsSame };
        update[sections[sectionIndex].section_id] = false;
        dispatch(setDataIsSame(update));
        const sectionId = sections[sectionIndex].section_id;
        if (event === 'add') {
            if (currentPageData.questions.length < 20) {
                dispatch(setSelectedAddQuestion({ sectionIndex, pageIndex, questionIndex, pageId }));
                dispatch(setSelectedQuestionId(''));
            } else {
                setToastError("Limit reached: Maximum of 20 questions allowed.");
                return; // Exit the function if the limit is reached
            }
            // if (!isSectionSaved[sectionId]) {
            //     handleSaveSection(sectionId, false);
            // }
            // setIsSectionSaved(prevState => ({ ...prevState, [sectionId]: false }));
        } else if (event === 'remove') {
            dispatch(setSelectedQuestionId(false));
            dispatch(setSelectedAddQuestion({}));

            const questionId = currentPageData.questions[questionIndex].question_id;
            const sectionId = currentPageData.questions[questionIndex].question_id.split('_')[0];

            // Filter out the removed question and update currentPageData
            currentPageData.questions = currentPageData.questions.filter((_, index) => index !== questionIndex);

            // Create a new array for sections to avoid mutating the original state
            const currentSectionData = sections.map((section, secIndex) => {
                if (secIndex === sectionIndex) {
                    // Clone the section's pages array and update the current page
                    return {
                        ...section,
                        pages: section.pages.map((page, pgIndex) => pgIndex === pageIndex ? currentPageData : page)
                    };
                }
                return section;
            });
            // if (!isSectionSaved[sectionId]) {
            //     handleSaveSection(sectionId, currentSectionData, false); // Call auto-save function 
            // }

            // setIsSectionSaved(prevState => ({ ...prevState, [pageId.split('_')[0]]: false }));
        }

        // Reset the selected component
        dispatch(setSelectedComponent(false));

        // Update the sections state by setting a new array (deep copy)
        setSections([...sections.map((section, secIndex) => {
            if (secIndex === sectionIndex) {
                return {
                    ...section,
                    pages: section.pages.map((page, pgIndex) => pgIndex === pageIndex ? currentPageData : page)
                };
            }
            return section;
        })]);
    };

    // API call to get form details with field settings
    const formDefaultDetails = useCallback(async () => {
        setPageLoading(true);
        try {
            const response = await getAPI(`questionnaires/${questionnaire_id}/${version_number}`);
            if (!response?.error) {
                dispatch(setFormDefaultInfo(response?.data?.data));
                const sectionsData = response?.data?.data?.sections || [];
                // if (sectionsData.length === 1) {  
                //     // If no sections are present, skip calling GetSectionOrder  
                //     setSections(sectionsData);  
                //     return;  
                //   } 
                // Extract field settings data from sections  
                const fieldSettingsData = sectionsData.flatMap(section => section.pages.flatMap(page => page.questions.map(question => ({
                    updated_at: question?.updated_at,
                    display_type: question?.display_type,
                    component_type: question?.component_type,
                    questionnaire_id: question?.questionnaire_id,
                    label: question?.label,
                    question_id: question?.question_id,
                    field_range: question?.field_range,
                    asset_extras: question?.asset_extras,
                    field_texts: question?.field_texts,
                    type: question?.type,
                    source_value: question?.source_value,
                    source: question?.source,
                    help_text: question?.help_text,
                    placeholder_content: question?.placeholder_content,
                    format: question?.format,
                    regular_expression: question?.regular_expression,
                    format_error: question?.format_error,
                    options: question?.options,
                    conditional_logic: question?.conditional_logic,
                    default_conditional_logic: question?.default_conditional_logic
                }))));

                // Transform field settings data into the desired structure  
                const transformedFieldSettingsData = {
                    message: "Field settings",
                    data: {
                        items: fieldSettingsData,
                        last_evaluated_key: null,
                    },
                    status: true,
                    time: response?.data?.time,
                };

                dispatch(setInitialData(transformedFieldSettingsData.data.items));

                const sectionOrder = await GetSectionOrder();
                if (sectionOrder === 'no_data') {
                    setSections(sectionsData);
                    return;
                }

                if (sectionOrder) {
                    const orderedSectionsData = [...sectionsData].sort((a, b) => {
                        return sectionOrder.indexOf(a.section_id) - sectionOrder.indexOf(b.section_id);
                    });

                    dispatch(setDataIsSame(orderedSectionsData));
                    setSections(orderedSectionsData); // Set ordered sections  
                } else {
                    // If sectionOrder is invalid, use initial sections order  
                    setSections(sectionsData);
                }
            } else {
                setToastError('Something went wrong fetching form details');
            }
        } catch (error) {
            setToastError('An error occurred during the API call');
        } finally {
            setPageLoading(false);
        }
    }, [getAPI, questionnaire_id, version_number, dispatch, setFormDefaultInfo, setDataIsSame, setToastError]);

    const handleDeleteSection = async (sectionId) => {
        try {
            const response = await DeleteAPI(`questionnaires/${questionnaire_id}/${version_number}?section_id=${sectionId}`);
            if (response?.data?.status === 200) {
                setToastSuccess(response?.data?.data?.message);
                // Update the sections array by removing the deleted section  
                const updatedSections = sections.filter(section => section.section_id !== sectionId);
                setSections(updatedSections);
                // Call handleSectionSaveOrder to update the layout  
                handleSectionSaveOrder(updatedSections);
            } else {
                setToastError('Something went wrong.');
            }
        } catch (error) {
            setToastError('Something went wrong.');
        }
    }

    const handleSaveSection = async (sectionId, isSaving = true, payloadString, defaultString) => {
        handleSectionSaveOrder(sections)
        // Find the section to save  
        const sectionToSave = sections.find(section => section.section_id.includes(sectionId));
        const sectionIndex = sections.findIndex(section => section.section_id.includes(sectionId));
        if (sectionToSave) {
            const isDataSame = dataIsSame[sectionId];
            if (isDataSame && !payloadString) {
                setIsThreedotLoader(false);
                setConditionalLogic(false)
                // If data is the same, return early and don't call the API  
                return;
            }
            // Create a new object containing only the selected section's necessary fields  
            let body = {
                section_id: sectionToSave.section_id,
                section_name: sectionToSave.section_name,
                pages: sectionToSave.pages.map(page => ({
                    page_id: page.page_id,
                    page_name: page.page_name,
                    questions: page.questions.map(question => ({
                        question_id: question.question_id,
                        question_name: fieldSettingParams[question.question_id].label,
                        conditional_logic: fieldSettingParams[question.question_id]['conditional_logic'] || '',
                        default_conditional_logic: fieldSettingParams[question.question_id]['default_conditional_logic'] || '',
                        component_type: fieldSettingParams[question.question_id].componentType,
                        label: fieldSettingParams[question.question_id].label,
                        help_text: fieldSettingParams[question.question_id].helptext,
                        placeholder_content: fieldSettingParams[question.question_id].placeholderContent,
                        default_content: fieldSettingParams[question.question_id].defaultContent,
                        type: fieldSettingParams[question.question_id].type,
                        format: fieldSettingParams[question.question_id].format,
                        regular_expression: fieldSettingParams[question?.question_id]?.regular_expression,
                        format_error: fieldSettingParams[question?.question_id]?.format_error,
                        field_range: {
                            min: fieldSettingParams[question.question_id].min,
                            max: fieldSettingParams[question.question_id].max,
                        },
                        admin_field_notes: fieldSettingParams[question.question_id].note,
                        source: fieldSettingParams[question.question_id].source,
                        source_value:
                            question.source === 'fixedList' ?
                                fieldSettingParams[question.question_id].fixedChoiceArray :
                                fieldSettingParams[question.question_id].lookupOptionChoice
                        ,
                        lookup_id: fieldSettingParams[question.question_id].lookupOption,
                        options: fieldSettingParams[question.question_id].options,
                        default_value: fieldSettingParams[question.question_id].defaultValue,
                        increment_by: fieldSettingParams[question.question_id].incrementby,
                        field_texts: {
                            pre_field_text: fieldSettingParams[question.question_id].preField,
                            post_field_text: fieldSettingParams[question.question_id].postField
                        },
                        asset_extras: {
                            draw_image: fieldSettingParams[question.question_id].draw_image,
                            pin_drop: fieldSettingParams[question.question_id].pin_drop,
                            include_metadata: fieldSettingParams[question.question_id].include_metadata,
                            file_size: fieldSettingParams[question.question_id].fileSize,
                            file_type: fieldSettingParams[question.question_id].fileType,
                        },
                        display_type: (() => {
                            switch (fieldSettingParams[question.question_id].type) {
                                case 'heading':
                                    return { heading: fieldSettingParams[question.question_id].heading };
                                case 'text':
                                    return { text: fieldSettingParams[question.question_id].text };
                                case 'image':
                                    return { image: fieldSettingParams[question.question_id].image };
                                case 'url':
                                    return {
                                        url: {
                                            type: fieldSettingParams[question.question_id].urlType,  // Assuming urlType is a field in fieldSettingParams  
                                            value: fieldSettingParams[question.question_id].urlValue // Assuming urlValue is a field in fieldSettingParams  
                                        }
                                    };
                                default:
                                    return {}; // Return an empty object if componentType doesn't match any case  
                            }
                        })(),
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
            console.log(body,'kkkkkk')
            try {
                if (isSaving) {
                    // ... call the API ...  
                    const response = await PatchAPI(`questionnaires/${questionnaire_id}/${version_number}`, body);
                    // setSaveClick(true)
                    if (!(response?.error)) {
                        setToastSuccess(response?.data?.message);
                       
                        setIsThreedotLoader(false);
                        setConditionalLogic(false);
                        setIsDefaultLogic(false);
                        // Update the saved status  
                        const update = { ...dataIsSame };
                        update[sections[sectionIndex].section_id] = true;

                        dispatch(setDataIsSame((prevState) => ({ ...prevState, [sectionId]: true })));
                        setSaveClick(false)

                    } else {
                        setToastError('Something went wrong.');
                    }
                }

            } catch (error) {
                setToastError('Something went wrong');
            }
        }

    };

    // Save the section and page name
    const handleSaveSectionName = (value, sectionIndex, pageIndex) => {
        // Create a deep copy of sections
        let updatedSections = sections.map((section, idx) => {
            if (idx === sectionIndex) {
                return {
                    ...section, // Shallow copy the section
                    pages: section.pages ? section.pages.map((page, pIdx) => (
                        pageIndex === pIdx ? { ...page } : page // Shallow copy the page if needed
                    )) : section.pages
                };
            }
            return section;
        });

        // Check if a pageIndex is provided to update a page name or section name
        if (pageIndex !== undefined && pageIndex !== null) {
            updatedSections[sectionIndex].pages[pageIndex].page_name = value; // Safe to update now
            setPageName(value)
        } else {
            updatedSections[sectionIndex].section_name = value;
            setSectionName(value)
        }

        // Update the sections state
        setSections(updatedSections);

        // Call handleSaveSection with the section ID and updated sections
        // handleSaveSection(updatedSections[sectionIndex]?.section_id, updatedSections);
        // setSectionName(value)
    };

    const addNewQuestion = useCallback((componentType, additionalActions = () => { }) => {
        if (!selectedAddQuestion?.pageId) return;

        // Generate a unique question ID
        const questionId = `${selectedAddQuestion.pageId}_QUES-${uuidv4()}`;

        // Set the selected component and question ID
        dispatch(setSelectedComponent(componentType));
        dispatch(setSelectedQuestionId(questionId));
        dispatch(setSelectedAddQuestion({ questionId }));

        // Retrieve the current page data
        const currentPageData = sections[selectedAddQuestion.sectionIndex].pages[selectedAddQuestion.pageIndex];

        // Create a new question object and add it to the current page's questions array
        const newQuestion = {
            question_id: questionId,
            question_name: `Question ${currentPageData.questions.length + 1}`,
        };
        currentPageData.questions = [...currentPageData.questions, newQuestion];

        // Dispatch actions to set the new component's properties
        dispatch(setNewComponent({ id: 'label', value: newQuestion.question_name, questionId }));
        dispatch(setNewComponent({ id: 'componentType', value: componentType, questionId }));

        dispatch(setShouldAutoSave(true));

        // Execute any additional actions specific to the question type
        additionalActions(questionId);
    }, [dispatch, sections, selectedAddQuestion, setSelectedComponent, setSelectedQuestionId, setSelectedAddQuestion]);

    const handleTextboxClick = useCallback(() => {
        addNewQuestion('textboxfield', (questionId) => {
            dispatch(setNewComponent({ id: 'type', value: 'single_line', questionId }));
        });
    }, [addNewQuestion]);

    const handleChoiceClick = useCallback(() => {
        addNewQuestion('choiceboxfield', (questionId) => {
            dispatch(setNewComponent({ id: 'source', value: 'fixedList', questionId }));
            dispatch(resetFixedChoice({ questionId }));
            dispatch(setNewComponent({ id: 'type', value: 'dropdown', questionId }));
        });
    }, [addNewQuestion, dispatch]);

    const handleDateTimeClick = useCallback(() => {
        addNewQuestion('dateTimefield', (questionId) => {
            dispatch(setNewComponent({ id: 'type', value: 'date', questionId }));

        })
    })

    const handleNumberClick = useCallback(() => {
        addNewQuestion('numberfield', (questionId) => {
            dispatch(setNewComponent({ id: 'type', value: 'integer', questionId }));
            dispatch(setNewComponent({ id: 'source', value: 'entryfield', questionId }));

        });
    }, [addNewQuestion]);

    const handleAssetLocationClick = useCallback(() => {
        addNewQuestion('assetLocationfield', (questionId) => {
        })
    })

    const handleFloorPlanClick = useCallback(() => {
        addNewQuestion('floorPlanfield', (questionId) => {
            dispatch(setNewComponent({ id: 'pin_drop', value: 'no', questionId }));
            dispatch(setNewComponent({ id: 'draw_image', value: 'no', questionId }));

        });
    }, [addNewQuestion]);

    const handlePhotoClick = useCallback(() => {
        addNewQuestion('photofield', (questionId) => {
            dispatch(setNewComponent({ id: 'draw_image', value: 'no', questionId }));
            dispatch(setNewComponent({ id: 'include_metadata', value: 'no', questionId }));
            dispatch(setNewComponent({ id: 'max', value: '3', questionId }));

        });
    }, [addNewQuestion]);

    const handleVideoClick = useCallback(() => {
        addNewQuestion('videofield', (questionId) => {
            dispatch(setNewComponent({ id: 'max', value: '3', questionId }));

        })
    });

    const handleFileClick = useCallback(() => {
        addNewQuestion('filefield', (questionId) => {
            dispatch(setNewComponent({ id: 'max', value: '3', questionId }));
        })
    });

    const handleSignatureClick = useCallback(() => {
        addNewQuestion('signaturefield', (questionId) => {
        })
    });

    const handleGPSClick = useCallback(() => {
        addNewQuestion('gpsfield', (questionId) => {
        })
    });

    const handleDisplayClick = useCallback(() => {
        addNewQuestion('displayfield', (questionId) => {
            dispatch(setNewComponent({ id: 'type', value: 'heading', questionId }));
        })
    });

    const handleClick = useCallback((functionName) => {
        const functionMap = {
            handleTextboxClick,
            handleChoiceClick,
            handleDateTimeClick,
            handleAssetLocationClick,
            handleNumberClick,
            handleFloorPlanClick,
            handlePhotoClick,
            handleVideoClick,
            handleFileClick,
            handleSignatureClick,
            handleGPSClick,
            handleDisplayClick,
        };

        functionMap[functionName]?.();
    }, [handleTextboxClick, handleChoiceClick, handleDateTimeClick, handleAssetLocationClick, handleNumberClick, handleFloorPlanClick, handlePhotoClick, handleVideoClick, handleFileClick, handleSignatureClick, handleGPSClick, handleDisplayClick]);

    //function for handle radio button
    const handleRadiobtn = (type) => {
        // Dispatch the type selection
        const fieldsToReset = ['text', 'heading', 'image', 'url'];
        dispatch(setNewComponent({ id: 'type', value: type, questionId: selectedQuestionId }));

        // Handle resetting specific fields if the selected type is 'text'
        fieldsToReset.forEach((field) => {
            if (field !== type) {
                dispatch(setNewComponent({ id: field, value: '', questionId: selectedQuestionId }));
            }
        });
        // Auto-save the settings
        handleSaveSection();
    };

    // 

    const handleDeleteModal = (sectionIndex, sectionData) => {
        dispatch(setSectionToDelete(sectionIndex)); // Set the section to delete  
        dispatch(setSelectedSectionData(sectionData));
        dispatch(setModalOpen(true));
    }

    const confirmDeleteSection = () => {
        if (sectionToDelete !== null) {
            handleDeleteSection(sections[sectionToDelete].section_id);
            handleAddRemoveSection('remove', sectionToDelete); // Remove the section from the sections state  
            dispatch(setModalOpen(false)); // Close the modal  
        }
    }

    const handleSectionSaveOrder = async (updatedSection) => {
        const body = {
            "public_name": formDefaultInfo.public_name,
            "sections": updatedSection.map((section, index) => ({
                index: index,
                id: section.section_id
            }))
        }
        try {
            const response = await PatchAPI(`questionnaires/layout/${questionnaire_id}/${version_number}`, body);
            if (!(response?.data?.error)) {
                // Success
            } else {
                setToastError('Something went wrong');
            }
        } catch (error) {
            setToastError('Something went wrong');
        }
    }

    const GetSectionOrder = async () => {
        try {
            const response = await getAPI(`questionnaires/layout/${questionnaire_id}/${version_number}`);
            if (!response?.error) {

                // Extract section IDs in the order provided
                const sectionOrder = response.data.data.sections.map(section => section?.id);
                return sectionOrder; // Return the ordered section IDs
            } else if (response?.data?.status === 404) {
                return 'no_data'
            } else {
                setToastError('Something went wrong!!');
                return []; // Return an empty array if there is an error
            }
        } catch (error) {
            setToastError('Something went wrong');
            return []; // Return an empty array in case of an error
        }
    };


    const onDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(sections || []);
        const [removed] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, removed);

        setExpandedSections({ 0: false })
        setSections(reorderedItems);
        dispatch(setSavedSection(reorderedItems));
        handleSectionSaveOrder(reorderedItems); // Call handleSectionSaveOrder with the updated sections  
    }


    const handleBlur = (e) => {
        const sectionId = selectedQuestionId.split('_')[0]
        handleSaveSection(sectionId, false);
    }
    //this is for diplay content field replace modal function
    const handleConfirmReplace = () => {
        setReplaceModal(false);
        document.getElementById('file-upload').click();
    };

    useEffect(() => {
        formDefaultDetails();
        dispatch(setSavedSection(sections));
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
                            <p
                                title={formDefaultInfo?.internal_name}
                                className={`font-semibold text-[22px] text-[#2B333B] truncate w-[90%] ${sections && sections.length === 0 ? 'mb-3' : ''}`}
                                data-testid="questionnaire-management-section">{formDefaultInfo?.internal_name}
                            </p>
                            <div>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="droppable">
                                        {(provided) => (
                                            <ul {...provided.droppableProps} ref={provided.innerRef}>
                                                {sections.map((sectionData, sectionIndex) => (
                                                    <Draggable
                                                        key={sectionData.section_id}
                                                        draggableId={sectionData.section_id}
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
                                                                        ? `translateY(${provided.draggableProps.style.transform.split(",")[1]}`
                                                                        : "none", // Fallback in case transform is null/undefined
                                                                }}

                                                                className="disable-select select-none w-full rounded-[10px] p-[6px] my-4 border hover:border-[#2B333B] border-transparent mb-2.5"
                                                            >
                                                                <div className="flex justify-between w-full">
                                                                    <div className='flex items-center w-[90%]' style={{ width: '-webkit-fill-available' }}>
                                                                        <img
                                                                            src="/Images/open-Filter.svg"
                                                                            alt="down-arrow"
                                                                            data-testId={`open-${sectionIndex}`}
                                                                            className={`cursor-pointer pl-2 transform transition-transform duration-300 ${expandedSections[sectionIndex] ? "rotate-180 ml-2" : "" // Rotate 180deg when expanded
                                                                                }`}
                                                                            onClick={() => toggleSection(sectionIndex)} // Toggle section on click
                                                                        />
                                                                        <EditableField
                                                                            name={sectionData?.section_name}
                                                                            index={sectionIndex}
                                                                            handleSave={handleSaveSectionName}
                                                                            section={true}
                                                                            testId={`section-${sectionIndex}-name`}
                                                                            saveClick={saveClick}
                                                                            setSaveClick={setSaveClick}
                                                                            setSectionName={setSectionName}
                                                                            sectionName={sectionName}
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <img
                                                                            className="cursor-grab p-2 rounded-full hover:bg-[#FFFFFF]"
                                                                            title="Drag"
                                                                            src={`/Images/drag.svg`}
                                                                            alt="Drag"
                                                                            {...provided.dragHandleProps}
                                                                        />
                                                                        <img src="/Images/trash-black.svg"
                                                                            alt="delete"
                                                                            title='Delete'
                                                                            data-testid={`delete-btn-${sectionIndex}`}
                                                                            className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#FFFFFF] '
                                                                            // onClick={() => handleAddRemoveSection('remove', sectionIndex)}
                                                                            onClick={() => {
                                                                                handleDeleteModal(sectionIndex, sectionData)

                                                                            }} // Open modal instead of directly deleting
                                                                        />
                                                                        <img
                                                                            src="/Images/save.svg"
                                                                            alt="save"
                                                                            title="Save"
                                                                            data-testid={`save-btn-${sectionIndex}`}
                                                                            className={`pl-2.5 p-2 rounded-full hover:bg-[#FFFFFF] mr-6 cursor-pointer`}
                                                                            onClick={() => {
                                                                                handleSaveSection(sectionData?.section_id);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <Sections
                                                                    sectionData={sectionData}
                                                                    sectionIndex={sectionIndex}
                                                                    selectedQuestionId={selectedQuestionId}
                                                                    handleAddRemoveQuestion={handleAddRemoveQuestion}
                                                                    expandedSections={expandedSections}
                                                                    setExpandedSections={setExpandedSections}
                                                                    handleSaveSectionName={handleSaveSectionName}
                                                                    dataIsSame={dataIsSame}
                                                                    setSections={setSections}
                                                                    sections={sections}
                                                                    handleAddRemovePage={handleAddRemovePage}
                                                                    handleSaveSection={handleSaveSection}
                                                                    handleAutoSave={handleSaveSection}
                                                                    handleDeleteModal={handleDeleteModal}
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
                                    onClick={() => {
                                        handleAddRemoveSection('add');
                                        handleSectionSaveOrder(sections);
                                    }}
                                    data-testid="add-section"
                                    className='flex items-center font-semibold text-[#2B333B] text-base mt-5'>
                                    <span className='mr-[15px]'>+</span>
                                    Add section
                                </button>

                            </div>
                        </div>
                    </div>
                    <div className='w-[30%]'>
                        <div className='border-b border-[#DCE0EC] flex items-center w-full'>
                            <button className='w-1/3 py-[17px] px-[29px] flex items-center font-semibold text-base text-[#2B333B] border-l border-r border-[#EFF1F8] bg-[#FFFFFF] hover:bg-[#EFF1F8]' onClick={() => navigate('/questionnaries/create-questionnary')}>
                                <img src="/Images/cancel.svg" className='pr-2.5' alt="canc" />
                                Cancel
                            </button>
                            <button onClick={() => {
                                // Open the custom modal  
                                setPreviewModal(true)

                            }} className='w-1/3 py-[17px] px-[29px] flex items-center font-semibold text-base text-[#2B333B] border-l border-r border-[#EFF1F8] bg-[#FFFFFF] hover:bg-[#EFF1F8]'>
                                <img src="/Images/preview.svg" className='pr-2.5' alt="preview" />
                                Preview
                            </button>

                            <button data-testid="save" className='w-1/3 py-[17px] px-[29px] font-semibold text-base text-[#FFFFFF] bg-[#2B333B] hover:bg-[#000000] border-l border-r border-[#EFF1F8]' onClick={() => {

                                handleSaveSection(latestSectionId);
                            }}>
                                Save
                            </button>

                        </div>
                        <div>
                            {selectedComponent ? (
                                React.createElement(
                                    sideComponentMap[selectedComponent],  // Dynamically select the component
                                    {
                                        handleInputChange: handleInputChange,
                                        formParameters: fieldSettingParams[selectedQuestionId],
                                        handleRadiobtn: handleRadiobtn,
                                        fieldSettingParameters: fieldSettingParams[selectedQuestionId],
                                        // setFieldSettingParameters: setFieldSettingParameters,
                                        // handleSaveSettings: handleSaveSettings,
                                        isThreedotLoader: isThreedotLoader,
                                        selectedQuestionId: selectedQuestionId,
                                        handleBlur: handleBlur,
                                        setShouldAutoSave: setShouldAutoSave,
                                        validationErrors: validationErrors,
                                        setReplaceModal: setReplaceModal,
                                        setInputValue: setInputValue,
                                        inputValue: inputValue,
                                        questionData: dataIsSame[selectedSectionData],
                                        setValidationErrors: setValidationErrors,
                                        setConditionalLogic: setConditionalLogic,
                                        conditionalLogic: conditionalLogic,
                                        setIsDefaultLogic: setIsDefaultLogic,
                                        isDefaultLogic: isDefaultLogic,
                                        setDefaultString: setDefaultString,
                                        defaultString: defaultString

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
                    subText={`You are about to delete the ${selectedSectionData?.section_name} section containing multiple pages. This action cannot be undone.`}
                    button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000]'
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
                    subText={`You are about to delete the ${selectedSectionData?.page_name} page containing multiple questions. This action cannot be undone.`}
                    button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000]'
                    Button1text='Delete'
                    Button2text='Cancel'
                    src='delete-gray'
                    testIDBtn1='confirm-delete-page'
                    testIDBtn2='cancel-delete'
                    isModalOpen={showPageDeleteModal}
                    setModalOpen={setShowPageDeleteModal}
                    handleButton1={confirmDeletePage} // Call handleAddRemovePage and close modal on confirmation
                    handleButton2={() => dispatch(setShowPageDeleteModal(false))} // Handle cancel button
                />

            )}
            {showquestionDeleteModal && (
                <ConfirmationModal
                    text='Delete Question'
                    subText={`You are about to delete the ${selectedSectionData?.label} question. This action cannot be undone.`}
                    button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000]'
                    Button1text='Delete'
                    Button2text='Cancel'
                    src='delete-gray'
                    testIDBtn1='confirm-delete'
                    testIDBtn2='cancel-delete'
                    isModalOpen={showquestionDeleteModal}
                    setModalOpen={setShowquestionDeleteModal}
                    handleButton1={confirmDeleteQuestion}
                    handleButton2={() => dispatch(setShowquestionDeleteModal(false))}
                />
            )}
            {showReplaceModal && (
                <ConfirmationModal
                    text='Replace Image'
                    subText='This will replace the existing image. This action cannot be undone.'
                    button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000]'
                    Button1text='Replace'
                    Button2text='Cancel'
                    src='replace'
                    testIDBtn1='confirm-replace-image'
                    testIDBtn2='cancel'
                    isModalOpen={showReplaceModal}
                    setModalOpen={setReplaceModal}
                    handleButton1={handleConfirmReplace} // Replace the image and close modal on confirmation
                    handleButton2={() => setReplaceModal(false)} // Handle cancel button
                />
            )}
            {previewModal && <PreviewModal
                isModalOpen={previewModal}
                setModalOpen={setPreviewModal}
                Button1text={'Back'}
                Button2text={'Next'}
                src=''
                button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000]'

            />}
            {(conditionalLogic || isDefaultLogic) && (
                <ConditionalLogic
                    setConditionalLogic={setConditionalLogic}
                    conditionalLogic={conditionalLogic}
                    handleSaveSection={handleSaveSection}
                    isDefaultLogic={isDefaultLogic}
                    setIsDefaultLogic={setIsDefaultLogic}
                    setDefaultString={setDefaultString}
                    defaultString={defaultString}
                />

            )}
        </>
    );
}

export default QuestionnaryForm;

