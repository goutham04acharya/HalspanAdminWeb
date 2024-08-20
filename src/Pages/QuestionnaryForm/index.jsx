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
import { compareData, saveCurrentData, setInitialData, setNewComponent } from './Components/Fields/fieldSettingParamsSlice.js';
import ChoiceFieldSetting from './Components/Fields/ChoiceBox/ChoiceFieldSetting/ChoiceFieldSetting.jsx';
import { v4 as uuidv4 } from 'uuid';

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

    // text field related states
    const [textFieldSettings, setTextFieldSettings] = useState(false)
    const [selectedAddQuestion, setSelectedAddQuestion] = useState('')
    const [selectedQuestionId, setSelectedQuestionId] = useState('')
    const [shouldAutoSave, setShouldAutoSave] = useState(false);
    const [fieldSettingParameters, setFieldSettingParameters] = useState(globalStates.textbox);

    const dispatch = useDispatch();
    const fieldSettingParams = useSelector(state => state.fieldSettingParams.currentData);
    const savedData = useSelector(state => state.fieldSettingParams.savedData);


    const handleInputClick = (fieldSettingParameters) => {
        // setTextFieldSettings(true)
        console.log(fieldSettingParams, 'fieldSettingParams')
        console.log(fieldSettingParams[selectedQuestionId], '[selectedQuestionId]?')
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
        dispatch(setNewComponent({ id, value, questionId: selectedQuestionId }));
        const data = selectedQuestionId?.split('_')
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
            console.log(dataIsSame, 'dataIsSame');

            // Retrieve the boolean value associated with the sectionId
            const sectionId = sections?.[sectionIndex]?.section_id;
            const isSaved = dataIsSame?.[sectionId] || false;

            console.log(isSaved, 'isSaved');
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

    useEffect(() => {
        console.log('first')
    }, [])

    const handleAddRemoveQuestion = (event, sectionIndex, pageIndex, questionIndex, pageId) => {
        let currentPageData = sections[sectionIndex].pages[pageIndex];
        const update = { ...dataIsSame }
        console.log(sections[sectionIndex].section_id, 'ooooooooooooooooooooooo sections[sectionIndex].section_id')
        update[sections[sectionIndex].section_id] = false;
        setDataIsSame(update)
        if (event === 'add') {
            setSelectedAddQuestion({ sectionIndex, pageIndex, questionIndex, pageId });
            setSelectedComponent(false);
            setSelectedQuestionId('');
        } else if (event === 'remove') {
            currentPageData.questions = currentPageData?.questions?.filter((_, index) => index !== questionIndex);
        }
        sections[sectionIndex].pages[pageIndex] = currentPageData;
        setSections([...sections]);
    };

    const handleQuestionIndexCapture = (question) => {
        console.log('Function called...');
        console.log('Question:', question);
        console.log('Field Setting Parameters:', fieldSettingParams);
        console.log('fieldSettingParams[question.questionId]', fieldSettingParams[question.question_id]);
        console.log('componentType', fieldSettingParams[question.question_id]?.componentType);

        // Update state for selected question and reset component state
        setSelectedQuestionId(question.question_id);
        setSelectedAddQuestion({ questionId: question.question_id });
        const componentType = fieldSettingParams[question.question_id]?.componentType;
        console.log(componentType, 'componentType')
        setSelectedComponent(componentType);
    };


    // Function for dragging questions
    const Item = ({ item, index, itemSelected, dragHandleProps }) => {
        const { onMouseDown, onTouchStart } = dragHandleProps;

        return (
            <div
                onClick={() => handleQuestionIndexCapture(item)}
                className={`disable-select select-none w-full bg-[#EFF1F8] mt-7 rounded-[10px] p-4 hover:border hover:border-[#2B333B] ${item.question_id === selectedQuestionId ? 'border-black border' : ''}`}
            >
                <div className='flex justify-between items-start cursor-pointer'>
                    {!fieldSettingParameters && (
                        <p className='mb-5 font-medium text-base text-[#000000] w-[25%]'>{item?.question_text}</p>
                    )}
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
                            onTouchStart={(e) => {
                                document.body.style.overflow = "hidden";
                                onTouchStart(e);
                            }}
                            onTouchEnd={() => {
                                document.body.style.overflow = "visible";
                            }}
                        >
                            <img className='cursor-grab' src={`/Images/drag.svg`} alt="Drag" />
                        </div>
                        <img
                            src="/Images/trash-black.svg"
                            alt="delete"
                            className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#FFFFFF]'
                            onClick={() => handleAddRemoveQuestion('remove', item.sectionIndex, item.pageIndex, item.index)}
                        />
                    </div>
                </div>
                {/* Render the selected component if the question is visible */}
                {fieldSettingParams[item.question_id] && (
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
        console.log(sections[sectionIndex].section_id, 'zzzzzzzzzzzzzzzzzzzzz sections[sectionIndex].section_id')
        update[sections[sectionIndex].section_id] = false;
        setDataIsSame(update)
    };

    // API to get the fieldSettingData 
    const getFieldSetting = async () => {
        const response = await getAPI(`field-settings/${questionnaire_id}`);
        console.log(response, 'response.......')
        if (!response.error) {
            dispatch(setInitialData(response?.data?.data?.items))
        } else {
            setToastError('Something went wrong!')
        }
    }

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

        console.log(updatedSections, 'bbbbbbbbbbbbbbbbbbbb, updatedSections'); // Output: { "SEC-d4dc4fe9-d61a-46e0-b475-ce939f7074f5": true, "SEC1": true }
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
                setToastError('Something went wrong');
            }
        } catch (error) {
            setToastError('Something went wrong');
        }
    };

    const handleSaveSection = async (sectionId, showShimmer = true) => {
        // Find the section to save
        const sectionToSave = sections.find(section => section.section_id === sectionId);
        const sectionIndex = sections.findIndex(section => section.section_id === sectionId);

        if (sectionToSave) {
            console.log(sectionToSave.section_id, 'sectionToSave.section_i')
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

            console.log(body, 'body body body body')
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
                    console.log(sections[sectionIndex].section_id, 'nnnnnnnnnnnnnnnnnnnnnnnnn sections[sectionIndex].section_id')
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

    // Save the section and page name
    const handleSaveSectionName = (value, index, secondIndex) => {
        const updatedSections = [...sections];

        // Check if secondIndex is provided to update a page name or a section name
        if (secondIndex !== undefined && secondIndex !== null) {
            updatedSections[index].pages[secondIndex].page_name = value;
        } else {
            updatedSections[index].section_name = value;
        }

        // Update the sections state
        setSections(updatedSections);

        // Call handleAutoSave with the section ID and updated sections
        handleAutoSave(updatedSections[index]?.section_id, updatedSections);
    };


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
                    console.log(sections[sectionIndex].section_id, 'mmmmmmmmmmmmmmmmm sections[sectionIndex].section_id')
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

    const addNewQuestion = (componentType, questionPrefix) => {
        if (!selectedAddQuestion.pageId) {
            return;
        }

        // Generate a unique question ID
        const questionId = `${selectedAddQuestion.pageId}_QUES-${uuidv4()}`;
        console.log(questionId, 'questionId');

        // Set the selected component and question ID
        setSelectedComponent(componentType);
        setSelectedQuestionId(questionId);
        setSelectedAddQuestion({ questionId: questionId });

        // Retrieve the current page data based on the selected section and page index
        const currentPageData = sections[selectedAddQuestion.sectionIndex].pages[selectedAddQuestion.pageIndex];
        console.log(currentPageData, 'currentPageData');

        // Create a new question object and add it to the current page's questions array
        currentPageData.questions = [
            ...currentPageData.questions,
            {
                question_id: questionId,
                question_name: `Question ${currentPageData.questions.length}`,
            }
        ];

        // Dispatch actions to set the new component's properties
        dispatch(setNewComponent({ id: 'label', value: `Question ${currentPageData.questions.length}`, questionId }));
        dispatch(setNewComponent({ id: 'componentType', value: componentType, questionId }));
    };

    const handleTextboxClick = () => addNewQuestion('textboxfield');
    const handleChoiceClick = () => addNewQuestion('choiceboxfield');

    const handleClick = (functionName) => {
        const functionMap = {
            handleTextboxClick,
            handleChoiceClick,
        };

        // Call the corresponding function from the map
        functionMap[functionName]?.();
    };


    //function for handle radio button
    const handleRadiobtn = (type) => {
        dispatch(setNewComponent({ id: 'type', value: type, questionId: selectedQuestionId }));
        handleAutoSaveSettings();
    }

    //function to save the field setting
    const handleSaveSettings = async () => {
        setIsThreedotLoader(true);
        const len = sections.length;
        if (len > 0) {
            handleSaveSection(sections[len - 1].section_id, false);
        }
        console.log('saving.......')
        const payload = {
            component_type: fieldSettingParams?.[selectedQuestionId]?.componentType,
            label: fieldSettingParams?.[selectedQuestionId]?.label,
            help_text: fieldSettingParams?.[selectedQuestionId]?.helptext,
            placeholder_content: fieldSettingParams?.[selectedQuestionId]?.placeholderContent,
            default_content: fieldSettingParams?.[selectedQuestionId]?.defaultContent,
            type: fieldSettingParams?.[selectedQuestionId]?.type,
            format: fieldSettingParams?.[selectedQuestionId]?.format,
            number_of_characters: {
                min: fieldSettingParams?.[selectedQuestionId]?.min,
                max: fieldSettingParams?.[selectedQuestionId]?.max,
            },
            admin_field_notes: fieldSettingParams?.[selectedQuestionId]?.note,
            source: {
                [fieldSettingParams?.[selectedQuestionId]?.source === 'fixedList' ? 'fixed_list' : 'lookup']:
                    fieldSettingParams?.[selectedQuestionId]?.source === 'fixedList' ?
                        fieldSettingParams?.[selectedQuestionId]?.fixedChoiceArray :
                        fieldSettingParams?.[selectedQuestionId]?.lookupOptionChoice
            },
        };
        try {
            const response = await PatchAPI(`field-settings/${questionnaire_id}/${selectedQuestionId}`, payload);
            console.log(response?.data?.status);
            setIsThreedotLoader(false);
            setToastSuccess(response?.data?.message)
            if (response?.data?.status >= 400) {
                setToastError(response?.data?.data?.message || 'Something went wrong');
            }
            dispatch(saveCurrentData());
        } catch (error) {
            console.error(error);
            setIsThreedotLoader(false);
            setToastError('Failed to update field settings'); // Provide a user-friendly error message
            setSelectedComponent(false);
        }
    };

    const handleAutoSaveSettings = async () => {
        console.log('auto saving.......')
        console.log(fieldSettingParams?.[selectedQuestionId]?.source === 'fixedList' ? 'fixed_list' : 'lookup', 'source.......')
        console.log(fieldSettingParams?.[selectedQuestionId]?.fixedChoiceArray, '123.......')
        console.log(fieldSettingParams?.[selectedQuestionId]?.lookupOptionChoice, '0987.......')
        console.log({
            [fieldSettingParams?.[selectedQuestionId]?.source === 'fixedList' ? 'fixed_list' : 'lookup']:
                fieldSettingParams?.[selectedQuestionId]?.source === 'fixedList' ?
                    fieldSettingParams?.[selectedQuestionId]?.fixedChoiceArray :
                    fieldSettingParams?.[selectedQuestionId]?.lookupOptionChoice
        }, 'qwertyui.......')
        const payload = {
            component_type: fieldSettingParams?.[selectedQuestionId]?.componentType,
            label: fieldSettingParams?.[selectedQuestionId]?.label,
            help_text: fieldSettingParams?.[selectedQuestionId]?.helptext,
            placeholder_content: fieldSettingParams?.[selectedQuestionId]?.placeholderContent,
            default_content: fieldSettingParams?.[selectedQuestionId]?.defaultContent,
            type: fieldSettingParams?.[selectedQuestionId]?.type,
            format: fieldSettingParams?.[selectedQuestionId]?.format,
            number_of_characters: {
                min: fieldSettingParams?.[selectedQuestionId]?.min,
                max: fieldSettingParams?.[selectedQuestionId]?.max,
            },
            admin_field_notes: fieldSettingParams?.[selectedQuestionId]?.note,
            source: {
                [fieldSettingParams?.[selectedQuestionId]?.source === 'fixedList' ? 'fixed_list' : 'lookup']:
                    fieldSettingParams?.[selectedQuestionId]?.source === 'fixedList' ?
                        fieldSettingParams?.[selectedQuestionId]?.fixedChoiceArray :
                        fieldSettingParams?.[selectedQuestionId]?.lookupOptionChoice
            },
            lookup_id: fieldSettingParams?.[selectedQuestionId]?.lookupOption
        };
        try {
            const response = await PatchAPI(`field-settings/${questionnaire_id}/${selectedQuestionId}`, payload);
            console.log(response?.data?.status);
            if (response?.data?.status >= 400) {
                setToastError(response?.data?.data?.message || 'Something went wrong');
            }
            dispatch(saveCurrentData());
        } catch (error) {
            console.error(error);
            setToastError('Failed to update field settings');
        }
    };

    const handleBlur = (e) => {
        handleAutoSaveSettings();
        const sectionId = selectedQuestionId.split('_')[0]
        console.log(sectionId, 'sectionId,,,,,,,,,........')
        console.log('handleBlur api call........')
        handleAutoSave(sectionId, sections);
    }

    useEffect(() => {
        formDefaultDetails();
        getFieldSetting();
        setSavedSection(sections);
    }, []);

    useEffect(() => {
        if (shouldAutoSave) {
            handleAutoSaveSettings();
            setShouldAutoSave(false); // Reset the flag after auto-saving
        }
    }, [fieldSettingParams, shouldAutoSave]); // Add dependencies as needed
    

    return (
        pageLoading
            ?
            <FormShimmer />
            :
            (
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
                                                data-testid={`delete-btn-${sectionIndex}`}
                                                className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#FFFFFF]'
                                                onClick={() => handleAddRemoveSection('remove', sectionIndex)} />
                                            <img src="/Images/save.svg"
                                                alt="save"
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
                                                        alt="save"
                                                        data-testid={`delete-page-sec-${sectionIndex}-${pageIndex}`}
                                                        className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#EFF1F8]' onClick={() => handleAddRemovePage('remove', sectionIndex, pageIndex)} />
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
                                            <div className={`mt-7 bg-[#EFF1F8] rounded-[10px] w-full px-3 hover:border border-[#2B333B] ${selectedAddQuestion?.pageId === pageData?.page_id ? 'border' : ''}`}>
                                                <button onClick={() => handleAddRemoveQuestion('add', sectionIndex, pageIndex, '', pageData.page_id)} className='flex items-center justify-center w-full py-7 font-semibold text-[#2B333B] text-base'>
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
                                        formParameters: fieldSettingParams[selectedQuestionId],
                                        handleRadiobtn: handleRadiobtn,
                                        fieldSettingParameters: fieldSettingParams[selectedQuestionId],
                                        setFieldSettingParameters: setFieldSettingParameters,
                                        handleSaveSettings: handleSaveSettings,
                                        isThreedotLoader: isThreedotLoader,
                                        selectedQuestionId: selectedQuestionId,
                                        handleBlur: handleBlur,
                                        setShouldAutoSave: setShouldAutoSave
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
            )
    );
}

export default QuestionnaryForm;
