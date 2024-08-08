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
    const [isOpenSidebar, setIsOpenSidebar] = useState(false);

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

    // Function for dragging questions
    const Item = ({ item, itemSelected, dragHandleProps }) => {
        const { onMouseDown, onTouchStart } = dragHandleProps;

        return (
            <div className="disable-select select-none w-full bg-[#EFF1F8] mt-7 rounded-[10px] p-4 hover:border hover:border-[#2B333B]">
                <div className='flex justify-between items-start'>
                    {console.log(item, 'naananaynaynayaynayanyan')}
                    <p className='mb-5 font-medium text-base text-[#000000]'>{item.question_name}</p>
                    <div className='flex items-center'>
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
                <TextBoxField />
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
                        <SideLayout formDefaultInfo={formDefaultInfo} sections={sections} setSections={setSections} />
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
                                <div key={sectionData?.section_id} className='my-[25px] p-4 hover:border-[#2B333B] hover:border rounded-[10px]'>
                                    <div className='flex items-center w-full justify-between'>
                                        <p className='text-[#2B333B] font-medium text-[22px]'>{sectionData?.section_name}</p>
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
                                        <div key={pageData?.page_id} className='mt-7 w-full bg-white rounded-[10px] px-4 pt-4 pb-[22px] hover:border-[#2B333B] hover:border'>
                                            <div className='flex items-center justify-between'>
                                                <p className='text-[#2B333B] font-medium text-[22px]'>{pageData?.page_name}</p>
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
                        {/* <AddFields buttons={Fieldsneeded} /> */}
                        <TestFieldSetting />
                    </div>
                </div>
            )
    );
}

export default QuestionnaryForm;
