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

function QuestionnaryForm() {
    const { questionnaire_id, version_number } = useParams();
    const navigate = useNavigate();
    const { getAPI } = useApi();
    const { PatchAPI } = useApi();
    const { DeleteAPI } = useApi();
    let [sections, setSections] = useState([{
        section_name: 'Section 1',
        section_id: 'SEC1',
        pages: [{
            page_id: `SEC1_PG1`,
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
    const sectionRefs = useRef([]);
    const pageRefs = useRef({});
    const questionRefs = useRef([]);

    // text field related states
    const [textFieldSettings, setTextFieldSettings] = useState(false)
    const [fieldSettingParameters, setFieldSettingParameters] = useState(globalStates.textbox);

    console.log(fieldSettingParameters, 'VfieldSettingParametersfieldSettingParametersfieldSettingParameters')

    const handleInputClick = () => {
        console.log('inside tija')
        setTextFieldSettings(true)
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFieldSettingParameters((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

    const componentMap = {
        textboxfield: (props) =>
            <TextBoxField
                {...props}
                handleChange={handleInputClick}
                textFieldSettings={textFieldSettings}
                fieldSettingParameters={fieldSettingParameters}
            />,
        // checkbox: (props) => <CheckboxField {...props} />,
        // video: (props) => <VideoField {...props} />,
        // audio: (props) => <AudioField {...props} />,
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
            const newState = {};
            let currentIndex = 0;

            for (const [index, value] of Object.entries(prevState)) {
                const numIndex = parseInt(index);
                if (numIndex !== indexToRemove) {
                    newState[currentIndex] = value;
                    currentIndex++;
                }
            }

            return newState;
        });
    };

    const handleAddRemoveSection = (event, sectionIndex) => {
        if (event === 'add') {
            const len = sections.length;
            if (len > 0) {
                handleSaveSection(sections[len - 1].section_id);
            }
            const newSection = {
                section_name: `Section ${sections.length + 1}`,
                section_id: `SEC${sections.length + 1}`,
                pages: [{
                    page_id: `SEC${sections.length + 1}_PG1`,
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
            update[len] = false; // Mark the new section as not saved
            setDataIsSame(update);

        } else if (event === 'remove') {
            const isSaved = dataIsSame[sectionIndex];
            if (isSaved) {
                handleDeleteSection(sections[sectionIndex].section_id);
            }
            const updatedSections = sections.filter((_, index) => index !== sectionIndex);
            setSections(updatedSections);

            const updatedSavdSections = savedSection.filter((_, index) => index !== sectionIndex);
            setSavedSection(updatedSavdSections);

            removeIndexAndShift(sectionIndex);

            // Update the saved status
            const update = { ...dataIsSame };
            update.splice(sectionIndex, 1);
            setDataIsSame(update);
        } else {
            sections = sections.splice(0, sectionIndex);
            setSections([...sections]);
        }
    };

    const handleAddRemovePage = (event, sectionIndex, pageIndex) => {
        let currentSectionData = sections[sectionIndex];
        const update = { ...dataIsSame }
        update[sectionIndex] = false;
        setDataIsSame(update)
        if (event === 'add') {
            currentSectionData.pages = [
                ...currentSectionData.pages,
                {
                    page_id: `SEC${sectionIndex + 1}_PG${currentSectionData?.pages.length + 1}`,
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

    const handleAddRemoveQuestion = (event, sectionIndex, pageIndex, questionIndex) => {
        let currentPageData = sections[sectionIndex].pages[pageIndex];
        const update = { ...dataIsSame }
        update[sectionIndex] = false;
        setDataIsSame(update)

        if (event === 'add') {
            currentPageData.questions = [...currentPageData.questions, {
                question_id: `SEC${sectionIndex + 1}_PG${pageIndex + 1}_QUES${currentPageData?.questions.length + 1}`,
                question_name: `Question ${currentPageData.questions.length + 1}`,
            }];
        } else if (event === 'remove') {
            currentPageData.questions = currentPageData?.questions?.filter((_, index) => index !== questionIndex);
        }
        sections[sectionIndex].pages[pageIndex] = currentPageData;
        setSections([...sections]);
    };


    const handleQuestionIndexCapture = (question) => {
        setSelectedQuestionDetails(question);
    };

    // Function for dragging questions
    const Item = ({ item, index, itemSelected, dragHandleProps }) => {
        const { onMouseDown, onTouchStart } = dragHandleProps;

        return (
            <div onClick={() => handleQuestionIndexCapture(item)} className="disable-select select-none w-full bg-[#EFF1F8] mt-7 rounded-[10px] p-4 hover:border hover:border-[#2B333B]">
                <div ref={questionRefs} className='flex justify-between items-start cursor-pointer'>
                    {!fieldSettingParameters &&
                        <p className='mb-5 font-medium text-base text-[#000000]'>{item?.question_name}</p>
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
                            <img className='cursor-grab' src={`/Images/drag.svg`} alt="Drag" />
                        </div>
                        <img src="/Images/trash-black.svg" alt="delete" className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#FFFFFF]' onClick={() => handleAddRemoveQuestion('remove', item.sectionIndex, item.pageIndex, item.index)} />
                    </div>
                </div>
                {/* Render the selected component if the question is visible */}
                {inputVisibility[item.question_id] && (
                    <>
                        {React.createElement(componentMap[selectedComponent])}
                    </>
                )}

            </div>
        );
    };

    const handleMoveEnd = (newList, sectionIndex, pageIndex) => {
        sections[sectionIndex].pages[pageIndex].questions = newList;
        setSections([...sections]);
    };

    // API calling function
    const formDefaultDetails = useCallback(async () => {
        setPageLoading(true);
        const response = await getAPI(`questionnaires/${questionnaire_id}/${version_number}`);
        setFormDefaultInfo(response?.data?.data);
        setSections(response?.data?.data?.sections);
        const sections = response?.data?.data?.sections || [];

        // Map through the sections and add a property with a value of true
        const updatedSections = sections.map((section, index) => ({
            [index]: true // Add a new property or update an existing one
        }));
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

    const handleSaveSection = async (sectionId) => {
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
                        question_text: question.question_name,
                        component_type: Fieldsneeded[0]?.type,
                        label: globalStates[0]?.label,
                        help_text: globalStates[0]?.help_text,
                        // "placeholder_content": "e.g., johndoe123",
                        // "default_content": "johndoe123",
                        // "type": "single-line",
                        // "format": "alphanumeric",
                        // "number_of_characters": {
                        //     "min": 5,
                        //     "max": 20
                        // },
                        // "admin_field_notes": "This field is required for user registration."
                        // Include other necessary fields for questions here
                    }))
                }))
            };

            console.log(body, 'bodybodybodybody')
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
                setPageLoading(true);
                const response = await PatchAPI(`questionnaires/${questionnaire_id}/${version_number}`, body);
                setPageLoading(false);
                if (!(response?.data?.error)) {
                    setToastSuccess(response?.data?.message);

                    // Update the saved status
                    const update = { ...dataIsSame };
                    update[sectionIndex] = true;
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
                    update[sectionIndex] = true;
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
        setSelectedComponent('textboxfield');
        // Toggle visibility for the selected question
        setInputVisibility(prevState => ({
            ...prevState,
            [selectedQuestionDetails.question_id]: true,
        }));
    };

    const handleChoiceClick = () => {

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
        setFieldSettingParameters((prevState) => ({
            ...prevState,
            ['type']: type,
        }));
    }

    //function to save the field setting
    const handleSaveSettings = async () => {
        let body = {
            component_type: fieldSettingParameters?.Component_type,
            label: fieldSettingParameters?.label,
            help_text: fieldSettingParameters?.helptext,
            placeholder_content: fieldSettingParameters?.placeholderContent,
            default_content: fieldSettingParameters?.defaultContent,
            type: fieldSettingParameters?.type,
            format: fieldSettingParameters?.format,
            number_of_characters: {
                min: fieldSettingParameters?.min,
                max: fieldSettingParameters?.max,
            },
            admin_field_notes: fieldSettingParameters?.note,
        };
    
        try {
            const response = await PatchAPI(`field-settings/${questionnaire_id}/${version_number}`, body);
            console.log(response);
        } catch (error) {
            console.error(error); // Properly handle the error
        }
    };
    

    useEffect(() => {
        formDefaultDetails();
        setSavedSection(sections);
    }, []);

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
                                                className={`pl-2.5 p-2 rounded-full hover:bg-[#FFFFFF] ${dataIsSame[sectionIndex] ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => { if (!dataIsSame[sectionIndex]) handleSaveSection(sectionData?.section_id) }} />
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
                                            <div className='mt-7 bg-[#EFF1F8] rounded-[10px] w-full px-3 hover:border hover:border-[#2B333B]'>
                                                <button onClick={() => handleAddRemoveQuestion('add', sectionIndex, pageIndex)} className='flex items-center justify-center w-full py-7 font-semibold text-[#2B333B] text-base'>
                                                    <span className='mr-[15px]'>+</span>
                                                    <span>Add question</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleAddRemovePage('add', sectionIndex)}
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
                            {textFieldSettings ?
                                <TestFieldSetting
                                    handleInputChange={handleInputChange}
                                    formParameters={fieldSettingParameters}
                                    handleRadiobtn={handleRadiobtn}
                                    fieldSettingParameters={fieldSettingParameters}
                                    setFieldSettingParameters={setFieldSettingParameters}
                                    handleSaveSettings={handleSaveSettings}
                                /> :
                                (<AddFields
                                    buttons={Fieldsneeded}
                                    handleClick={handleClick}
                                />)
                            }
                        </div>
                    </div>
                </div>
            )
    );
}

export default QuestionnaryForm;
