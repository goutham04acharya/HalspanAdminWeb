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
import { setSelectedAddQuestion, setSelectedQuestionId, setShouldAutoSave, setSelectedSectionData, setDataIsSame, setFormDefaultInfo, setSavedSection, setSelectedComponent, setSectionToDelete, setPageToDelete, setQuestionToDelete, setShowquestionDeleteModal, setShowPageDeleteModal, setModalOpen } from './Components/QuestionnaryFormSlice.js'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditableField from '../../Components/EditableField/EditableField.jsx';


function QuestionnaryForm() {
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
    const [expandedSections, setExpandedSections] = useState({ 0: true }); // Set first section open by default
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

    useEffect(() => {
        if (sections.length > 0) {
            const lastSection = sections[sections.length - 1]; // Get the latest section
            setLatestSectionId(lastSection.section_id);
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

    const confirmDeleteSection = () => {
        if (sectionToDelete !== null) {
            handleAddRemoveSection('remove', sectionToDelete); // Trigger the deletion     
            dispatch(setModalOpen(false)); // Close the modal  
            handleSectionSaveOrder(sections);
            setTimeout(() => {
                window.location.reload();
            }, 2000); // 2 second delay  
        }
    }

    const confirmDeletePage = () => {
        if (pageToDelete.sectionIndex !== null && pageToDelete.pageIndex !== null) { // Check if indices are valid
            handleAddRemovePage('remove', pageToDelete.sectionIndex, pageToDelete.pageIndex, selectedSectionData); // Pass selectedSectionData instead of undefined pageData
            dispatch(setShowPageDeleteModal(false));
        }
    }

    const confirmDeleteQuestion = () => {
        if (questionToDelete.sectionIndex !== null && questionToDelete.pageIndex !== null && questionToDelete.questionIndex !== null) {
            handleAddRemoveQuestion('remove', questionToDelete.sectionIndex, questionToDelete.pageIndex, questionToDelete.questionIndex);
            dispatch(setShowquestionDeleteModal(false));
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
            const len = sections.length;
            if (len > 0) {
                // Call handleSectionSaveOrder with the current sections before adding a new one
                handleSectionSaveOrder(sections);
                handleSaveSection(sections[len - 1].section_id, false);
            }
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
                const updatedSections = [...prevSections, newSection];

                // Open the newly added section
                setExpandedSections((prev) => ({
                    ...prev,
                    [updatedSections.length - 1]: true, // Set the last section to open
                }));

                return updatedSections;
            });

            setTimeout(() => {
                sectionRefs.current[sections && sections.length]?.scrollIntoView({ behavior: 'smooth' });
            }, 400);

            // Enable save button for the new section
            const update = { ...dataIsSame };
            update[sectionId] = false; // Mark the new section as not saved
            dispatch(setDataIsSame(update));

        } else if (event === 'remove') {
            // After any delete we remove focus on add question and change the field setting
            // dispatch(setSelectedQuestionId(false))
            dispatch(setSelectedQuestionId(false))
            dispatch(setSelectedAddQuestion({}));
            dispatch(setSelectedComponent(''));

            // Retrieve the boolean value associated with the sectionId
            const sectionId = sections?.[sectionIndex]?.section_id;
            const isSaved = dataIsSame?.[sectionId] || false;

            if (isSaved) {
                handleDeleteSection(sections[sectionIndex].section_id);
            }
            const updatedSections = sections.filter((_, index) => index !== sectionIndex);
            setSections(updatedSections);

            const updatedSavdSections = savedSection.filter((_, index) => index !== sectionIndex);
            dispatch(setSavedSection(updatedSavdSections));

            removeIndexAndShift(sections[sectionIndex].section_id);

        } else {
            sections = sections?.splice(0, sectionIndex);
            setSections([...sections]);
        }
    };

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

                // Call handleAutoSave with the updated section data
                handleAutoSave(sectionId, SectionData);
            } else {
                setToastError("Limit reached: Maximum of 20 pages allowed.");
                return; // Exit the function if the limit is reached
            }
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

            // Call handleAutoSave with the updated section data
            handleAutoSave(sectionId, SectionData, pageId);
        }
    };

    const handleAddRemoveQuestion = (event, sectionIndex, pageIndex, questionIndex, pageId) => {
        let currentPageData = { ...sections[sectionIndex].pages[pageIndex] }; // Clone currentPageData
        const update = { ...dataIsSame };
        update[sections[sectionIndex].section_id] = false;
        dispatch(setDataIsSame(update));

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

            handleAutoSave(sectionId, currentSectionData, '', questionId); // Call auto-save function
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

    // API to get the fieldSettingData 

    const getFieldSetting = async () => {
        const response = await getAPI(`field-settings/${questionnaire_id}`);
        if (!response.error) {
            dispatch(setInitialData(response?.data?.data?.items))
        } else {
            setToastError('Something went wrong!')
        }
    }

    // API calling function
    const formDefaultDetails = useCallback(async () => {
        setPageLoading(true);
        try {
            const response = await getAPI(`questionnaires/${questionnaire_id}/${version_number}`);
            if (!response?.error) {
                dispatch(setFormDefaultInfo(response?.data?.data));
                const sectionsData = response?.data?.data?.sections || [];

                const sectionOrder = await GetSectionOrder();

                if (sectionOrder === 'no_data') {
                    setSections(sectionsData);
                    return;
                }

                // If sectionOrder is valid, proceed with sorting
                if (sectionOrder) {
                    const orderedSections = sectionOrder.map(orderId =>
                        sectionsData.find(section => section.section_id === orderId)
                    ).filter(Boolean); // Filter out any undefined sections

                    // Create an object with section_id as the key and true as the value
                    const updatedSections = orderedSections.reduce((acc, section) => {
                        acc[section.section_id] = true;
                        return acc;
                    }, {});

                    dispatch(setDataIsSame(updatedSections));
                    setSections(orderedSections); // Set ordered sections
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
        handleSectionSaveOrder(sections);
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
                        question_id: question.question_id,
                        question_name: question?.question_name,
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
                const response = await PatchAPI(`questionnaires/${questionnaire_id}/${version_number}`, body);
                if (!(response?.data?.error)) {
                    if (showShimmer) {
                        setToastSuccess(response?.data?.message);
                    }

                    // Update the saved status
                    const update = { ...dataIsSame };
                    update[sections[sectionIndex].section_id] = true;
                    dispatch(setDataIsSame(update));
                } else {
                    setToastError('Something went wrong.');
                }
            } catch (error) {
                setToastError('Something went wrong.');
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
        } else {
            updatedSections[sectionIndex].section_name = value;
        }

        // Update the sections state
        setSections(updatedSections);

        // Call handleAutoSave with the section ID and updated sections
        handleAutoSave(updatedSections[sectionIndex]?.section_id, updatedSections);
    };

    const handleAutoSave = async (sectionId, updatedData, pageId, questionId) => {
        // Find the section to save
        const sectionToSave = updatedData.find(section => section.section_id === sectionId);
        const sectionIndex = updatedData.findIndex(section => section.section_id === sectionId);
        if (sectionToSave) {
            // Create a new object containing only the selected section's necessary fields
            let body = {
                section_id: sectionToSave?.section_id,
                section_name: sectionToSave?.section_name,
                pages: sectionToSave?.pages.map(page => ({
                    page_id: page?.page_id,
                    page_name: page?.page_name,
                    questions: page?.questions.map(question => ({
                        question_id: question?.question_id,
                        question_text: question?.question_name,
                        question_name: question?.question_name,
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

            const queryParams = [];

            if (pageId) {
                queryParams.push(`page_deleted=${pageId}`);
            }

            if (questionId) {
                queryParams.push(`question_deleted=${questionId}`);
            }

            const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

            try {
                const response = await PatchAPI(`questionnaires/${questionnaire_id}/${version_number}${queryString}`, body);
                if (!(response?.data?.error)) {
                    // Update the saved status
                    const update = { ...dataIsSame };
                    update[sections[sectionIndex].section_id] = true;
                    dispatch(setDataIsSame(update));
                } else {
                    setToastError('Something went wrong');
                }
            } catch (error) {
                setToastError('Something went wrong');
            }
        }
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
        handleAutoSaveSettings();
    };

    const handleAutoSaveSettings = async () => {
        const payload = {
            component_type: fieldSettingParams?.[selectedQuestionId]?.componentType,
            label: fieldSettingParams?.[selectedQuestionId]?.label,
            help_text: fieldSettingParams?.[selectedQuestionId]?.helptext,
            placeholder_content: fieldSettingParams?.[selectedQuestionId]?.placeholderContent,
            default_content: fieldSettingParams?.[selectedQuestionId]?.defaultContent,
            type: fieldSettingParams?.[selectedQuestionId]?.type,
            format: fieldSettingParams?.[selectedQuestionId]?.format,
            field_range: {
                min: fieldSettingParams?.[selectedQuestionId]?.min,
                max: fieldSettingParams?.[selectedQuestionId]?.max,
            },
            admin_field_notes: fieldSettingParams?.[selectedQuestionId]?.note,
            source: fieldSettingParams?.[selectedQuestionId]?.source,
            source_value:
                fieldSettingParams?.[selectedQuestionId]?.source === 'fixedList' ?
                    fieldSettingParams?.[selectedQuestionId]?.fixedChoiceArray :
                    fieldSettingParams?.[selectedQuestionId]?.lookupOptionChoice
            ,
            lookup_id: fieldSettingParams?.[selectedQuestionId]?.lookupOption,
            options: fieldSettingParams?.[selectedQuestionId]?.options,
            default_value: fieldSettingParams?.[selectedQuestionId]?.defaultValue,
            increment_by: fieldSettingParams?.[selectedQuestionId]?.incrementby,
            field_texts: {
                pre_field_text: fieldSettingParams?.[selectedQuestionId]?.preField,
                post_field_text: fieldSettingParams?.[selectedQuestionId]?.postField
            },
            asset_extras: {
                draw_image: fieldSettingParams?.[selectedQuestionId]?.draw_image,
                pin_drop: fieldSettingParams?.[selectedQuestionId]?.pin_drop,
                include_metadata: fieldSettingParams?.[selectedQuestionId]?.include_metadata,
                file_size: fieldSettingParams?.[selectedQuestionId]?.fileSize,
                file_type: fieldSettingParams?.[selectedQuestionId]?.fileType,
            },
            display_type: (() => {
                switch (fieldSettingParams?.[selectedQuestionId]?.type) {
                    case 'heading':
                        return { heading: fieldSettingParams?.[selectedQuestionId]?.heading };
                    case 'text':
                        return { text: fieldSettingParams?.[selectedQuestionId]?.text };
                    case 'image':
                        return { image: fieldSettingParams?.[selectedQuestionId]?.image };
                    case 'url':
                        return {
                            url: {
                                type: fieldSettingParams?.[selectedQuestionId]?.urlType,  // Assuming urlType is a field in fieldSettingParams
                                value: fieldSettingParams?.[selectedQuestionId]?.urlValue // Assuming urlValue is a field in fieldSettingParams
                            }
                        };
                    default:
                        return {}; // Return an empty object if componentType doesn't match any case
                }
            })(),
        };

        try {
            const response = await PatchAPI(`field-settings/${questionnaire_id}/${selectedQuestionId}`, payload);
            if (response?.data?.status >= 401) {
                setToastError(response?.data?.data?.message || 'Something went wrong');
            }
            dispatch(saveCurrentData());
        } catch (error) {
            setToastError('Failed to update field settings');
        }
    };

    const handleDeleteModal = (sectionIndex, sectionData) => {
        dispatch(setSectionToDelete(sectionIndex)); // Set the section to delete
        dispatch(setSelectedSectionData(sectionData));
        dispatch(setModalOpen(true));
        // setSections(sectionData)
    };

    // handleSectionSaveOrder
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
                const sectionOrder = response.data.data.sections.map(section => section.id);
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

        setExpandedSections({0: false})
        console.log("nnnnn", reorderedItems)
        setSections(reorderedItems);
        dispatch(setSavedSection(reorderedItems));
        handleSectionSaveOrder(reorderedItems);
    };

    const handleBlur = (e) => {
        handleAutoSaveSettings();
        const sectionId = selectedQuestionId.split('_')[0]
        handleAutoSave(sectionId, sections);
    }
    //this is for diplay content field replace modal function
    const handleConfirmReplace = () => {
        setReplaceModal(false);
        document.getElementById('file-upload').click();
    };

    useEffect(() => {
        formDefaultDetails();
        getFieldSetting();
        dispatch(setSavedSection(sections));
    }, []);

    useEffect(() => {
        if (shouldAutoSave) {
            handleAutoSaveSettings();
            const sectionId = selectedQuestionId.split('_')[0]
            handleAutoSave(sectionId, sections);
            dispatch(setShouldAutoSave(false)); // Reset the flag after auto-saving
        }
    }, [fieldSettingParams, shouldAutoSave]); // Add dependencies as needed
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
                                                                    <div className='flex items-center w-[90%]' style={{width: '-webkit-fill-available'}}>
                                                                        <img
                                                                            src="/Images/open-Filter.svg"
                                                                            alt="down-arrow"
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
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center w-[10%]">
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
                                                                            className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#FFFFFF]'
                                                                            // onClick={() => handleAddRemoveSection('remove', sectionIndex)}
                                                                            onClick={() => handleDeleteModal(sectionIndex, sectionData)} // Open modal instead of directly deleting
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
                                                                    handleAutoSave={handleAutoSave}
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
                                        handleAddRemoveSection('add'),
                                            handleSectionSaveOrder(updatedSection)
                                    }
                                    }
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
                            <button className='w-1/3 py-[17px] px-[29px] flex items-center font-semibold text-base text-[#2B333B] border-l border-r border-[#EFF1F8] bg-[#FFFFFF] hover:bg-[#EFF1F8]'>
                                <img src="/Images/preview.svg" className='pr-2.5' alt="preview" />
                                Preview
                            </button>

                            <button data-testid="save" className='w-1/3 py-[17px] px-[29px] font-semibold text-base text-[#FFFFFF] bg-[#2B333B] hover:bg-[#000000] border-l border-r border-[#EFF1F8]' onClick={() => {
                                if (!dataIsSame[latestSectionId])
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
        </>
    );
}

export default QuestionnaryForm;
