
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
import { compareData, resetFixedChoice, saveCurrentData, setInitialData, setNewComponent } from './Components/Fields/fieldSettingParamsSlice.js';
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
import { setSelectedAddQuestion, setSelectedQuestionId, setShouldAutoSave, setSelectedSectionData, setDataIsSame, setFormDefaultInfo, setSavedSection, setSelectedComponent, setSectionToDelete, setShowquestionDeleteModal, setShowPageDeleteModal, setModalOpen, setShowCancelModal, setAssetType } from './Components/QuestionnaryFormSlice.js'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditableField from '../../Components/EditableField/EditableField.jsx';
import PreviewModal from './Components/Preview.jsx';
import ConditionalLogic from './Components/ConditionalLogicAdvanced/ConditionalLogic.jsx';
import TagScanFieldSetting from './Components/Fields/TagScan/TagScanFieldSettings/TagScanFieldSetting.jsx';
import ComplanceLogicField from './Components/Fields/ComplianceLogic/ComplanceLogicField.jsx';
import ComplianceFieldSetting from './Components/Fields/ComplianceLogic/ComplianceFieldSetting/ComplianceFieldSetting.jsx';
import Button from '../../Components/Button/button.jsx';


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
    const [conditionalLogic, setConditionalLogic] = useState(false);
    const [isDefaultLogic, setIsDefaultLogic] = useState(false);
    const [defaultString, setDefaultString] = useState('')
    const [compareSavedSections, setCompareSavedSections] = useState(sections);

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
    const showCancelModal = useSelector((state) => state?.questionnaryForm?.showCancelModal);
    const showPageDeleteModal = useSelector((state) => state?.questionnaryForm?.showPageDeleteModal);
    const isModalOpen = useSelector((state) => state?.questionnaryForm?.isModalOpen);

    const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);
    const savedFieldSettingParams = useSelector(state => state.fieldSettingParams.savedData);
    const { complianceLogicId } = useSelector(state => state?.questionnaryForm)
    const savedData = useSelector(state => state.fieldSettingParams.savedData);
    const debounceTimerRef = useRef(null); // Use useRef to store the debounce timer  
    const [saveClick, setSaveClick] = useState(false)
    const [sectionName, setSectionName] = useState('')
    const [pageName, setPageName] = useState('')
    const [complianceLogic, setComplianceLogic] = useState([]);
    const [complianceState, setCompliancestate] = useState(false)
    const [isDeleteComplianceLogic, setIsDeleteComplianceLogic] = useState(false);
    const [selectedSection, setSelectedSection] = useState(sections[0].section_id);
    const [selectedPage, setSelectedPage] = useState(null);
    const [formStatus, setFormStatus] = useState();
    const [globalSaveLoading, setGlobalSaveLoading] = useState(false)
    // Create the initial dropdown state
    const [dropdownOpen, setDropdown] = useState(sections[0].section_id);

    const handleCancel = () => {
        dispatch(setModalOpen(false));
        setIsDeleteComplianceLogic(false);
        dispatch(setSectionToDelete(null)); // Reset the section to delete
    }

    const handleInputChange = (e) => {
        // debugger
        console.log(e,'file type')
        const { id, value } = e.target;
        let updatedValue = value;
        console.log(updatedValue, 'ddsssdd')
        // Restrict numeric input if the id is 'fileType'
        if (id === 'fileType') {
            // debugger
            // Remove numbers, spaces around commas, and trim any leading/trailing spaces
            updatedValue = value
                .replace(/\s*,\s*/g, ',')   // Remove spaces around commas
                .replace(/[^a-zA-Z0-9,]/g, ''); // Allow only alphabets and commas
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
        'compliancelogic': ComplianceFieldSetting,
        "tagScanfield": TagScanFieldSetting,
        // Add other mappings here...
    };

    const scrollToSection = (index, sectionId) => {
        // Add a slight delay to ensure DOM update before scrolling
        setTimeout(() => {
            const element = document.getElementById(`${sectionId}-scroll`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.error(`Element with id ${sectionId} not found`);
            }
        }, 300); // Delay to allow the section to open and render the page
    };

    const scrollToPage = (sectionIndex, pageId) => {
        // Add a slight delay to ensure DOM update before scrolling
        setTimeout(() => {
            const element = document.getElementById(`${pageId}-scroll`);
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
            setToastSuccess('Page deleted successfully')
        }
    }

    const confirmDeleteQuestion = () => {
        if (questionToDelete.sectionIndex !== null && questionToDelete.pageIndex !== null && questionToDelete.questionIndex !== null) {
            handleAddRemoveQuestion('remove', questionToDelete.sectionIndex, questionToDelete.pageIndex, questionToDelete.questionIndex, sections[questionToDelete.sectionIndex].pages[questionToDelete.pageIndex].page_id);
            dispatch(setShowquestionDeleteModal(false));
            setToastSuccess('Question deleted successfully')
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
                setFormStatus(response?.data?.data?.status);
                const sectionsData = response?.data?.data?.sections || [];
                console.log(response?.data?.data?.asset_type, 'resdscsdcdsd')
                dispatch(setAssetType(response?.data?.data?.asset_type))
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
                    default_content: question?.default_content || '',
                    conditional_logic: question?.conditional_logic,
                    default_conditional_logic: question?.default_conditional_logic,
                    attribute_data_lfp: question?.attribute_data_lfp,
                    service_record_lfp: question?.service_record_lfp,
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
                    setCompareSavedSections(sectionsData)
                    return;
                }

                if (sectionOrder) {
                    const orderedSectionsData = [...sectionsData].sort((a, b) => {
                        return sectionOrder.indexOf(a.section_id) - sectionOrder.indexOf(b.section_id);
                    });

                    dispatch(setDataIsSame(orderedSectionsData));
                    setSections(orderedSectionsData); // Set ordered sections  
                    setCompareSavedSections(orderedSectionsData)
                } else {
                    // If sectionOrder is invalid, use initial sections order  
                    setSections(sectionsData);
                    setCompareSavedSections(sectionsData)
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
                
                // setAssetType()
                // Call handleSectionSaveOrder to update the layout  
                handleSectionSaveOrder(updatedSections);
            } else {
                setToastError('Something went wrong.');
            }
        } catch (error) {
            setToastError('Something went wrong.');
        }
    }

    const handleSaveSection = async (sectionId, isSaving = true, payloadString, defaultString, compliance) => {
        // handleSectionSaveOrder(sections, compliance, payloadString)
        // Find the section to save  
        sectionId = sectionId?.replace('bddtest#','')
        if (compliance) {
            let compliance = [...complianceLogic]
            // console.log(compliance,'gggggggggggggggggg')
            compliance[complianceLogicId].default_content = payloadString;
            setComplianceLogic((prev) =>
                prev.map((item, index) =>
                    index === complianceLogicId
                        ? { ...item, default_content: payloadString }
                        : item
                )
            );
            setIsThreedotLoader(false);
            setConditionalLogic(false);
            setIsDefaultLogic(false);
            setCompliancestate(false);
            setSaveClick(false);
        }

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
                section_name: sectionToSave.section_name.replace(/^\s+|\s+$/g, ''),
                pages: sectionToSave.pages.map(page => (
                    {
                        page_id: page.page_id,
                        page_name: page.page_name.replace(/^\s+|\s+$/g, ''),
                        questions: page.questions.map(question => ({
                            question_id: question.question_id,
                            question_name: fieldSettingParams[question.question_id].label.replace(/^\s+|\s+$/g, ''),
                            conditional_logic: (!defaultString && payloadString && selectedQuestionId === question.question_id) ? payloadString : fieldSettingParams[question.question_id]['conditional_logic'] || '',
                            default_conditional_logic: (defaultString && payloadString && selectedQuestionId === question.question_id) ? payloadString : fieldSettingParams[question.question_id]['default_conditional_logic'] || '',
                            component_type: fieldSettingParams[question.question_id].componentType,
                            label: fieldSettingParams[question.question_id].label,
                            help_text: fieldSettingParams[question.question_id].helptext,
                            placeholder_content: fieldSettingParams[question.question_id].placeholderContent,
                            default_content: payloadString && selectedQuestionId === question.question_id ? 'advance' : savedFieldSettingParams?.[question.question_id]?.['default_conditional_logic'] !== fieldSettingParams?.[question.question_id]?.['default_conditional_logic'] ? 'direct' : fieldSettingParams[question.question_id].default_content || '',
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
                                fieldSettingParams[question.question_id].source === 'fixedList' ?
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
                                file_size: fieldSettingParams[question.question_id].file_size,
                                file_type: fieldSettingParams[question.question_id].file_type,
                            },
                            attribute_data_lfp: fieldSettingParams[question.question_id].attribute_data_lfp,
                            service_record_lfp: fieldSettingParams[question.question_id].service_record_lfp,
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
            try {
                if (isSaving) {
                    // ... call the API ...  
                    // const response = await PatchAPI(`questionnaires/${questionnaire_id}/${version_number}`, body);
                    // setSaveClick(true)
                    // if (!(response?.error)) {
                    // setToastSuccess(response?.data?.message);
                    // setCompareSavedSections(sections);

                    if (defaultString) {
                        dispatch(setNewComponent({ id: 'default_conditional_logic', value: payloadString, questionId: selectedQuestionId }))
                    } else {
                        dispatch(setNewComponent({ id: 'conditional_logic', value: payloadString, questionId: selectedQuestionId }))
                    }
                    dispatch(saveCurrentData());
                    setIsThreedotLoader(false);
                    setConditionalLogic(false);
                    setIsDefaultLogic(false);
                    setCompliancestate(false)
                    // Update the saved status  
                    const update = { ...dataIsSame };
                    update[sections[sectionIndex].section_id] = true;

                    dispatch(setDataIsSame((prevState) => ({ ...prevState, [sectionId]: true })));
                    setSaveClick(false)
                }
            } catch (error) {
                console.log(error)
                setToastError('Something went wrong');
            }
        }

    }

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
            dispatch(setNewComponent({ id: 'format', value: "Alphanumeric", questionId }));
            dispatch(setNewComponent({ id: 'max', value: "2500", questionId }));
            dispatch(setNewComponent({ id: 'options', value: { 'visible': true }, questionId }));
        });
    }, [addNewQuestion]);

    const handleChoiceClick = useCallback(() => {
        addNewQuestion('choiceboxfield', (questionId) => {
            dispatch(setNewComponent({ id: 'source', value: 'fixedList', questionId }));
            dispatch(resetFixedChoice({ questionId }));
            dispatch(setNewComponent({ id: 'type', value: 'dropdown', questionId }));
            dispatch(setNewComponent({ id: 'options', value: { 'visible': true }, questionId }));
        });
    }, [addNewQuestion, dispatch]);

    const handleDateTimeClick = useCallback(() => {
        addNewQuestion('dateTimefield', (questionId) => {
            dispatch(setNewComponent({ id: 'type', value: 'date', questionId }));
            dispatch(setNewComponent({ id: 'options', value: { 'visible': true }, questionId }));
        })
    })

    const handleNumberClick = useCallback(() => {
        addNewQuestion('numberfield', (questionId) => {
            dispatch(setNewComponent({ id: 'type', value: 'integer', questionId }));
            dispatch(setNewComponent({ id: 'source', value: 'entryfield', questionId }));
            dispatch(setNewComponent({ id: 'options', value: { 'visible': true }, questionId }));
        });
    }, [addNewQuestion]);

    const handleAssetLocationClick = useCallback(() => {
        addNewQuestion('assetLocationfield', (questionId) => {
            dispatch(setNewComponent({ id: 'options', value: { 'visible': true }, questionId }));
        })
    })

    const handleFloorPlanClick = useCallback(() => {
        addNewQuestion('floorPlanfield', (questionId) => {
            dispatch(setNewComponent({ id: 'pin_drop', value: 'no', questionId }));
            dispatch(setNewComponent({ id: 'draw_image', value: 'no', questionId }));
            dispatch(setNewComponent({ id: 'options', value: { 'visible': true }, questionId }));

        });
    }, [addNewQuestion]);

    const handlePhotoClick = useCallback(() => {
        addNewQuestion('photofield', (questionId) => {
            dispatch(setNewComponent({ id: 'draw_image', value: 'no', questionId }));
            dispatch(setNewComponent({ id: 'include_metadata', value: 'no', questionId }));
            dispatch(setNewComponent({ id: 'max', value: '3', questionId }));
            dispatch(setNewComponent({ id: 'options', value: { 'visible': true }, questionId }));

        });
    }, [addNewQuestion]);

    const handleVideoClick = useCallback(() => {
        addNewQuestion('videofield', (questionId) => {
            dispatch(setNewComponent({ id: 'max', value: '3', questionId }));
            dispatch(setNewComponent({ id: 'options', value: { 'visible': true }, questionId }));
            dispatch(setNewComponent({ id: 'fileSize', value: "10", questionId }));
        })
    });

    const handleFileClick = useCallback(() => {
        addNewQuestion('filefield', (questionId) => {
            dispatch(setNewComponent({ id: 'max', value: '3', questionId }));
            dispatch(setNewComponent({ id: 'options', value: { 'visible': true }, questionId }));
            dispatch(setNewComponent({ id: 'fileSize', value: "10", questionId }));
        })
    });

    const handleSignatureClick = useCallback(() => {
        addNewQuestion('signaturefield', (questionId) => {
            dispatch(setNewComponent({ id: 'options', value: { 'visible': true }, questionId }));
        })
    });

    const handleGPSClick = useCallback(() => {
        addNewQuestion('gpsfield', (questionId) => {
            dispatch(setNewComponent({ id: 'options', value: { 'visible': true }, questionId }));
        })
    });

    const handleDisplayClick = useCallback(() => {
        addNewQuestion('displayfield', (questionId) => {
            dispatch(setNewComponent({ id: 'type', value: 'heading', questionId }));
            dispatch(setNewComponent({ id: 'options', value: { 'visible': true }, questionId }));
        })
    });
    // function to handle the compliance logic click
    const handleComplianceLogicClick = () => {
        let arr = complianceLogic || [];
        arr.push({
            label: `Status`,
            default_content: ''
        });
        setComplianceLogic(arr)
        dispatch(setSelectedComponent('compliancelogic'))

    };

    const handleTagScanClick = useCallback(() => {
        addNewQuestion('tagScanfield', (questionId) => {
            dispatch(setNewComponent({ id: 'type', value: 'NFC', questionId }));
            dispatch(setNewComponent({ id: 'source', value: 'Payload', questionId }));
            dispatch(setNewComponent({ id: 'options', value: { 'visible': true }, questionId }));

        });
    }, [addNewQuestion]);

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
            handleComplianceLogicClick,
            handleTagScanClick,
        };

        functionMap[functionName]?.();
    }, [handleTextboxClick, handleChoiceClick, handleDateTimeClick, handleAssetLocationClick, handleNumberClick, handleFloorPlanClick, handlePhotoClick, handleVideoClick, handleFileClick, handleSignatureClick, handleGPSClick, handleDisplayClick, handleComplianceLogicClick, handleTagScanClick]);

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
    // const confirmDeleteSection = () => {
    //     if (sectionToDelete !== null) {
    //         const updatedSections = sections.filter((section) => section.section_id !== selectedSectionData.section_id);
    //         setSections(updatedSections); // Assuming setSections updates the state
    //         // Update sections state
    //         setSectionToDelete(null);  // Reset sectionToDelete
    //         dispatch(setModalOpen(false));  // Close modal
    //         // globalSaveHandler(updatedSections);
    //         console.log(updatedSections, sections, '555555')
    //     }
    // };

    const handleSectionSaveOrder = async (updatedSection, compliance, payloadString) => {
        const body = {
            "public_name": formDefaultInfo.public_name,
            "sections": updatedSection.map((section, index) => ({
                index: index,
                id: section.section_id
            })),
            'compliance_logic': complianceLogic,
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
                setComplianceLogic(response?.data?.data?.compliance_logic)
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

        // setExpandedSections({ 0: false })
        setSections(reorderedItems);
        dispatch(setSavedSection(reorderedItems));
        // handleSectionSaveOrder(reorderedItems); // Call handleSectionSaveOrder with the updated sections  
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

    const addNewCompliance = (type, index) => {
        let newArr = [...complianceLogic]; // Create a copy of the current state array
        //type will be sent for deleting the  compliance logic state we will check for type if delete than splice array
        if (type) {
            newArr.splice(index, 1);
            dispatch(setSelectedComponent('null'))
            setComplianceLogic(newArr);
            return
        }
        newArr.push({
            label: `Status ${newArr.length + 1}`,
            default_content: ''
        });
        setComplianceLogic(newArr); // Set the new array in state
    }

    const complianceSaveHandler = async () => {
        const body = {
            compliance_logic: complianceLogic,
        }
        try {
            const response = await PatchAPI(`questionnaires/layout/${questionnaire_id}/${version_number}`, body);
            if (!(response?.data?.error)) {
                setToastSuccess('Compliance Logic Saved Successfully')
            } else {
                setToastError('Something went wrong');
            }
        } catch (error) {
            setToastError('Something went wrong');
        }
    }
    //this is the function called when you click on delete of compliance logic
    const handleDeleteComplianceLogic = async () => {
        const body = {
            compliance_logic: []
        };
        try {
            const response = await PatchAPI(`questionnaires/layout/${questionnaire_id}/${version_number}`, body);
            setComplianceLogic([]);
            setIsDeleteComplianceLogic(false);
            dispatch(setSelectedComponent(null));
            setToastSuccess('Compliance Logic deleted Successfully')
        } catch (error) {
            console.error("Error deleting compliance logic:", error);
        }
    };

    // Function to compare sections state with compareSavedSections to show the cancle modal or not
    const compareSections = (sections, compareSavedSections) => {
        if (sections.length !== compareSavedSections.length) {
            return false; // Different number of sections
        }

        // Compare each section in detail (excluding questions)
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const savedSection = compareSavedSections[i];

            // Compare section names and ids
            if (section.section_name !== savedSection.section_name ||
                section.section_id !== savedSection.section_id) {
                return false; // Section names or ids are different
            }

            // Compare pages within each section (excluding questions)
            if (section.pages.length !== savedSection.pages.length) {
                return false; // Different number of pages
            }

            // Compare each page's details (without comparing questions)
            for (let j = 0; j < section.pages.length; j++) {
                const page = section.pages[j];
                const savedPage = savedSection.pages[j];

                // Compare page names and page_ids
                if (page.page_name !== savedPage.page_name ||
                    page.page_id !== savedPage.page_id) {
                    return false; // Different page names or page_ids
                }
            }
        }

        return true; // Sections and pages match
    };

    // Function to compare sections state with compareSavedSections (related to showing the cancle modal)
    const hasUnsavedChanges = () => {
        // If sections have changed, or compareData is false, we show the modal
        return (
            !compareSections(sections, compareSavedSections) ||
            !compareData(fieldSettingParams, savedFieldSettingParams)
        );
    };
    // Cancel button click handler (related to showing the cancle modal)
    const handleDataChanges = () => {
        if (hasUnsavedChanges() && formStatus === 'Draft') {
            dispatch(setShowCancelModal(true)); // Show confirmation modal if there are unsaved changes
        } else {
            navigate(`/questionnaries/version-list/${questionnaire_id}`);
        }
    };

    // Confirmation modal "Confirm" button action (related to showing the cancle modal)
    const handleConfirmCancel = () => {
        dispatch(setShowCancelModal(false));
        navigate(`/questionnaries/version-list/${questionnaire_id}`);
    };

    const globalSaveHandler = async () => {
        setGlobalSaveLoading(true)
        try {
            // Deep clone sections to avoid direct state mutation
            let sectionBody = {
                sections: JSON.parse(JSON.stringify(sections))
            };
            for (const key in fieldSettingParams) {
                const keys = key.split("_");
                let sectionKey = '';
                let pageKey = '';
                let questionKey = '';

                if (keys.length > 3) {
                    // replaciing as bdd records will have aditional key as bddtest# which will bot be there in the  normal user journey
                    sectionKey = keys[1].replace('bddtest#', '');
                    pageKey = keys[2];
                    questionKey = keys[3];
                } else {
                    sectionKey = keys[0].replace('bddtest#', '');
                    pageKey = keys[1];
                    questionKey = keys[2];
                }
                // Traverse sectionBody to find matching keys and update values
                sectionBody.sections.forEach(section => {
                    if (section.section_id.includes(sectionKey)) {
                        section.pages.forEach(page => {
                            if (page.page_id.includes(pageKey)) {
                                page.questions.forEach((question, index) => {
                                    if (question.question_id.includes(questionKey)) {
                                        // Replace the question in sectionBody with updated values
                                        page.questions[index] = {
                                            question_id: question.question_id,
                                            question_name: fieldSettingParams[question.question_id].label,
                                            conditional_logic: fieldSettingParams[question.question_id]['conditional_logic'] || '',
                                            default_conditional_logic: fieldSettingParams[question.question_id]['default_conditional_logic'] || '',
                                            component_type: fieldSettingParams[question.question_id].componentType,
                                            label: fieldSettingParams[question.question_id].label,
                                            help_text: fieldSettingParams[question.question_id].helptext,
                                            placeholder_content: fieldSettingParams[question.question_id].placeholderContent,
                                            default_content: fieldSettingParams[question.question_id].default_content || '',
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
                                                fieldSettingParams[question.question_id].source === 'fixedList' ?
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
                                            attribute_data_lfp: fieldSettingParams[question.question_id].attribute_data_lfp,
                                            service_record_lfp: fieldSettingParams[question.question_id].service_record_lfp,
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
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
            function cleanSections() {
                // Ensure sectionBody is an array before proceeding
                if (Array.isArray(sectionBody['sections'])) {
                    sectionBody['sections'].forEach(section => {
                        delete section.created_at;
                        delete section.updated_at;
                        delete section.questionnaire_id;
                        delete section.version_number;
                        delete section['ttl'];
                    });
                } else {
                    console.error("sectionBody is not an array:", sectionBody);
                }
            }

            cleanSections();

            let response = await PatchAPI(`questionnaires/${questionnaire_id}/${version_number}`, sectionBody)
            handleSectionSaveOrder(sections);
            setToastSuccess(response?.data?.message);
            setGlobalSaveLoading(false)
        } catch (error) {
            console.log(error);
            setGlobalSaveLoading(false)
        }
    };

    return (
        <>
            {pageLoading ? (
                <FormShimmer />
            ) : (
                <div className='border-t border-[#DCE0EC] flex items-start h-customh5'>
                    <div className='w-[20%]'>
                        <SideLayout formDefaultInfo={formDefaultInfo}
                            selectedSection={selectedSection}
                            setSelectedSection={setSelectedSection}
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                            sections={sections}
                            setSections={setSections}
                            handleSectionScroll={scrollToSection}
                            handlePageScroll={scrollToPage}
                            setDropdown={setDropdown}
                            dropdownOpen={dropdownOpen}
                            onDragEnd={onDragEnd}
                            formStatus={formStatus}
                            handleAddRemoveSection={handleAddRemoveSection}
                            handleSectionSaveOrder={handleSectionSaveOrder}
                            handleDeleteModal={handleDeleteModal}

                        />
                    </div>
                    <div className='w-[50%] '>
                    <div className='flex justify-between items-center w-full border-b border-[#DCE0EC] py-[13px] px-[26px]'>
                            <div className='flex items-center'>
                                <p className='font-normal text-base text-[#2B333B]'>ID {formDefaultInfo?.questionnaire_id} - {formDefaultInfo?.asset_type} - Version {formDefaultInfo?.version_number}</p>
                                <button className={`py-[4px] px-[19px] rounded-[15px] text-[16px] font-normal text-[#2B333B] capitalize ml-[30px] cursor-default ${getStatusStyles(formDefaultInfo?.status)} `} title={`${getStatusText(formDefaultInfo?.status)}`}>
                                    {getStatusText(formDefaultInfo?.status)}
                                </button>
                            </div>
                            {formStatus !== 'Draft' && <p className='font-normal pl-2 italic text-base text-[#fcb91e]'>* {formStatus} questionnaires cannot be edited</p>}
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
                                            <ul
                                                {...provided.droppableProps} ref={provided.innerRef}
                                            >
                                                {sections.map((sectionData, sectionIndex) => (
                                                    <Draggable
                                                        key={sectionData.section_id}
                                                        draggableId={sectionData.section_id}
                                                        index={sectionIndex}
                                                    >
                                                        {(provided) => (
                                                            <li
                                                                className={`disable-select select-none w-full rounded-[10px] p-[6px] my-4 
                                                                    ${(selectedSection === sectionData.section_id || selectedSection === null) ? '' : 'hidden'} 
                                                                    border hover:border-[#2B333B] border-transparent mb-2.5`}
                                                            >
                                                                <div className="flex justify-between w-full"
                                                                    id={`${sectionData.section_id}-scroll`}
                                                                >
                                                                    <div className='flex items-center w-[90%]' style={{ width: '-webkit-fill-available' }}>
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
                                                                            formStatus={formStatus}
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <img src="/Images/trash-black.svg"
                                                                            alt="delete"
                                                                            title='Delete'
                                                                            data-testid={`delete-btn-${sectionIndex}`}
                                                                            className={`pl-2.5 w-12 ${formStatus === 'Draft' ? 'cursor-pointer hover:bg-[#FFFFFF]' : 'cursor-not-allowed'} p-2 rounded-full  `}
                                                                            onClick={formStatus === 'Draft' ? () => handleDeleteModal(sectionIndex, sectionData) : null}
                                                                        />
                                                                        {/* <img
                                                                            src="/Images/save.svg"
                                                                            alt="save"
                                                                            title="Save"
                                                                            data-testid={`save-btn-${sectionIndex}`}
                                                                            className={`pl-2.5 p-2 rounded-full mr-6 ${formStatus === 'Draft' ? 'cursor-pointer hover:bg-[#FFFFFF]' : 'cursor-not-allowed'}`}
                                                                            onClick={formStatus === 'Draft' ? () => {
                                                                                handleSaveSection(sectionData?.section_id);
                                                                            } : null}
                                                                        /> */}
                                                                    </div>
                                                                </div>
                                                                <Sections
                                                                    sectionData={sectionData}
                                                                    sectionIndex={sectionIndex}
                                                                    selectedQuestionId={selectedQuestionId}
                                                                    handleAddRemoveQuestion={handleAddRemoveQuestion}
                                                                    handleSaveSectionName={handleSaveSectionName}
                                                                    dataIsSame={dataIsSame}
                                                                    setSections={setSections}
                                                                    sections={sections}
                                                                    handleAddRemovePage={handleAddRemovePage}
                                                                    handleSaveSection={handleSaveSection}
                                                                    handleAutoSave={handleSaveSection}
                                                                    handleDeleteModal={handleDeleteModal}
                                                                    selectedSection={selectedSection}
                                                                    setSelectedSection={setSelectedSection}
                                                                    selectedPage={selectedPage}
                                                                    setSelectedPage={setSelectedPage}
                                                                    formStatus={formStatus}
                                                                    setDropdown={setDropdown}
                                                                    dropdownOpen={dropdownOpen}
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
                                {/* //add section buttion was there here */}
                            </div>
                            {(selectedComponent === 'compliancelogic' || complianceLogic?.length > 0) && (
                                <div>
                                    <ComplanceLogicField addNewCompliance={addNewCompliance} complianceLogic={complianceLogic} setComplianceLogic={setComplianceLogic} complianceSaveHandler={complianceSaveHandler} setIsDeleteComplianceLogic={setIsDeleteComplianceLogic} formStatus={formStatus} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='w-[30%]'>
                        <div className='border-b border-[#DCE0EC] flex items-center w-full'>
                            <button className='w-1/3 py-[17px] px-[29px] flex items-center font-semibold text-base text-[#2B333B] border-l border-r border-[#EFF1F8] bg-[#FFFFFF] hover:bg-[#EFF1F8]'
                                onClick={() => handleDataChanges()}>
                                <img src="/Images/cancel.svg" className='pr-2.5' alt="cancle" />
                                Cancel
                            </button>
                            <button data-testid="preview" className='w-1/3 py-[17px] px-[29px] flex items-center font-semibold text-base text-[#2B333B] border-l border-r border-[#EFF1F8] bg-[#FFFFFF] hover:bg-[#EFF1F8]' onClick={() => {
                                setPreviewModal(true)
                            }}>
                                <img src="/Images/preview.svg" className='pr-2.5' alt="preview" />
                                Preview
                            </button>
                            <Button
                                testID="save"
                                isThreedotLoading={globalSaveLoading}
                                text='Save'
                                className='w-1/3 h-[60px] py-[17px] px-[29px] rounded-none font-semibold text-base text-[#FFFFFF] bg-[#2B333B] hover:bg-[#000000] border-l border-r border-[#EFF1F8]'
                                disabled={formStatus !== 'Draft'} onClick={() => {
                                    globalSaveHandler();
                                }}
                            />
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
                                        complianceLogic: complianceLogic,
                                        setComplianceLogic: setComplianceLogic,
                                        setIsDefaultLogic: setIsDefaultLogic,
                                        isDefaultLogic: isDefaultLogic,
                                        setDefaultString: setDefaultString,
                                        defaultString: defaultString,
                                        complianceState: complianceState,
                                        setCompliancestate: setCompliancestate,
                                        complianceSaveHandler: complianceSaveHandler,
                                        scrollToPage: scrollToPage,
                                        formStatus: formStatus
                                    }
                                )
                            ) : (
                                <AddFields
                                    buttons={Fieldsneeded}
                                    handleClick={handleClick}
                                    formStatus={formStatus}
                                />
                            )}

                        </div>
                    </div>
                </div >
            )}
            {
                isModalOpen && (
                    <ConfirmationModal
                        text='Delete Section'
                        subText={`You are about to delete the "${selectedSectionData?.section_name}" section containing multiple pages. This action cannot be undone.`}
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
                )
            }
            {
                isDeleteComplianceLogic && (
                    <ConfirmationModal
                        text='Delete Compliance Logic'
                        subText={`You are about to delete the Compliance Logic section containing multiple Status. This action cannot be undone.`}
                        button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000]'
                        Button1text='Delete'
                        Button2text='Cancel'
                        src='delete-gray'
                        testIDBtn1='confirm-delete'
                        testIDBtn2='cancel-delete'
                        isModalOpen={isDeleteComplianceLogic}
                        setModalOpen={setIsDeleteComplianceLogic}
                        handleButton1={handleDeleteComplianceLogic} // Call confirmDeleteSection on confirmation
                        handleButton2={() => (setIsDeleteComplianceLogic(false))} // Handle cancel button
                    />
                )
            }
            {
                showPageDeleteModal && (
                    <ConfirmationModal
                        text='Delete Page'
                        subText={`${selectedSectionData?.['questions'].length > 0 ? `You are about to delete the "${selectedSectionData?.page_name}" page containing multiple questions. This action cannot be undone.` : 'Are you sure you want to delete this page?'}`}
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
                )
            }
            {
                showquestionDeleteModal && (
                    <ConfirmationModal
                        text='Delete Question'
                        subText={`You are about to delete the "${selectedSectionData?.label}" question. This action cannot be undone.`}
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
                )
            }
            {
                showCancelModal && (
                    <ConfirmationModal
                        text='Leave Questionnaire'
                        subText={`Changes that you made may not be saved.`}
                        button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000]'
                        Button1text='Leave'
                        Button2text='Stay'
                        src='x-circle'
                        testIDBtn1='confirm-Leave'
                        testIDBtn2='cancel-Leave'
                        isModalOpen={showCancelModal}
                        setModalOpen={setShowCancelModal}
                        handleButton1={handleConfirmCancel}
                        handleButton2={() => dispatch(setShowCancelModal(false))}
                    />
                )
            }
            {
                showReplaceModal && (
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
                )
            }
            {
                (conditionalLogic || isDefaultLogic || complianceState) && (
                    <ConditionalLogic
                        setConditionalLogic={setConditionalLogic}
                        conditionalLogic={conditionalLogic}
                        handleSaveSection={handleSaveSection}
                        isDefaultLogic={isDefaultLogic}
                        setIsDefaultLogic={setIsDefaultLogic}
                        setDefaultString={setDefaultString}
                        defaultString={defaultString}
                        complianceState={complianceState}
                        setCompliancestate={setCompliancestate}
                        complianceLogic={complianceLogic}
                        setComplianceLogic={setComplianceLogic}
                    />
                )
            }
            {
                previewModal === true && <PreviewModal
                    isModalOpen={previewModal}
                    setModalOpen={setPreviewModal}
                    Button1text={'Back'}
                    Button2text={'Next'}
                    button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000]'
                    sections={sections}
                    setValidationErrors={setValidationErrors}
                    validationErrors={validationErrors}
                    formDefaultInfo={formDefaultInfo}
                    questionnaire_id={questionnaire_id}
                    version_number={version_number}
                    fieldSettingParameters={fieldSettingParams}
                />
            }
        </>
    );
}

export default QuestionnaryForm;

