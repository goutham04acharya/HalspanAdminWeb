import React, { useCallback, useEffect, useState, useRef } from 'react'
import SideLayout from '../../Pages/QuestionnaryForm/Components/SideLayout'
import { useNavigate, useParams } from 'react-router-dom'
import useApi from '../../services/CustomHook/useApi.js';
import FormShimmer from '../../Components/Shimmers/FormShimmer.jsx';
import DraggableList from 'react-draggable-list';


// import Form from './Componenets/form'
// import AddFields from './Componenets/AddFieldsComponent/AddFieldsFields'
// import fieldsneeded from './Componenets/AddFieldsComponent/fields'
// import TestFieldSetting from './Componenets/TestFieldSetting/TestFieldSetting'

function QuestionnaryForm() {
    const { questionnaire_id, version_number } = useParams()
    const navigate = useNavigate();
    const { getAPI } = useApi();
    let [sections, setSections] = useState([{
        section_name: 'Section 1',
        section_id: 'SEC1',
        pages: [{
            page_id: `SEC1_PG1`,
            page_name: 'Page 1',
            questions: []
        }]
    }])
    const [pageLoding, setPageLoading] = useState(false);
    const [formDefaultInfo, setFormDefaultInfo] = useState([])

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
                return '-'; // Default styles when status doesn't match any condition
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
                return '-'; // Default text when status doesn't match any condition
        }
    };

    //form related codes are starts here
    const containerRef = useRef(null);
    const handleAddRemoveSection = (event, sectionIndex) => {
        console.log(sectionIndex, 'sec')
        if (event === 'add') {
            console.log(sections, 'hhh')
            setSections([...sections, {
                section_name: `Section ${sections.length + 1}`,
                section_id: `SEC${sections.length + 1}`,
                pages: [{
                    page_id: `SEC${sections.length + 1}_PG1`,
                    page_name: 'Page 1',
                    questions: []
                }]
            }])
        } else if (event === 'remove') {
            // Remove the section at the specified index
            const updatedSections = sections.filter((_, index) => index !== sectionIndex);
            setSections(updatedSections);
        } else {
            sections = sections.splice(0, sectionIndex);
            setSections([...sections]);
        }
    }

    const handleAddRemovePage = (event, sectionIndex, pageIndex) => {
        let currentSectionData = sections[sectionIndex];

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
            // Remove the page at the specified index
            currentSectionData.pages = currentSectionData?.pages?.filter((_, index) => index !== pageIndex);
        }

        sections[sectionIndex] = currentSectionData;
        setSections([...sections]);
    };

    const handleAddRemoveQuestion = (event, sectionIndex, pageIndex) => {
        console.log(sectionIndex, event, 'sectionIndex')
        let currentPageData = sections[sectionIndex].pages[pageIndex];
        console.log(currentPageData, 'hhhfhfhf')
        if (event === 'add') {
            currentPageData.questions = [...currentPageData.questions, {
                question_id: `SEC${sectionIndex + 1}_PG${pageIndex + 1}_QUES${currentPageData.questions.length + 1}`,
                question_name: `Question ${currentPageData.questions.length + 1}`,
            }]
        } else {

        }
        sections[sectionIndex].pages[pageIndex] = currentPageData;
        setSections([...sections])
    }

    //function for drag the questions
    const Item = ({ item, itemSelected, dragHandleProps }) => {
        const { onMouseDown, onTouchStart } = dragHandleProps;

        return (
            <div
                className="disable-select select-none w-full flex items-center justify-between"
            >
                <div className='flex items-center'>
                    <div
                        className="disable-select dragHandle"
                        onMouseDown={(e) => {
                            console.log("mouseDown");
                            document.body.style.overflow = "hidden";
                            onMouseDown(e);
                        }}
                        onMouseUp={() => {
                            document.body.style.overflow = "visible";
                        }}
                    >
                        <img className='cursor-grab' src="/Images/drag.svg" />
                    </div>
                    {/* Other item content goes here */}
                </div>
            </div>
        );
    };


    const handleMoveEnd = (newList, sectionIndex, pageIndex) => {
        sections[sectionIndex].pages[pageIndex].questions = newList;
        setSections([...sections])
    }

    //Api calling fun
    const formDefaultDetails = useCallback(async () => {
        setPageLoading(true);
        const response = await getAPI(`questionnaires/${questionnaire_id}/${version_number}`);
        setFormDefaultInfo(response?.data?.data);
        setSections(response?.data?.data?.sections)
        setPageLoading(false);
        console.log(formDefaultInfo?.sections);
    }, [getAPI, questionnaire_id, version_number]);

    useEffect(() => {
        formDefaultDetails();
    }, [])

    console.log(sections, 'sectionssections')

    return (
        pageLoding
            ?
            <FormShimmer />
            :
            (
                <div className='border-t border-[#DCE0EC] flex items-start h-customh5'>
                    <div className='w-[20%]'>
                        <SideLayout formDefaultInfo={formDefaultInfo} />
                    </div>
                    <div className='w-[50%] '>
                        <div className='flex items-center w-full border-b border-[#DCE0EC] py-[13px] px-[26px]'>
                            <p className='font-normal text-base text-[#2B333B]'>ID {formDefaultInfo?.questionnaire_id} - {formDefaultInfo?.asset_type} - Version {formDefaultInfo?.asset_type}</p>
                            <button className={`py-[4px] px-[19px] rounded-[15px] text-[16px] font-normal text-[#2B333B] capitalize ml-[30px] cursor-default ${getStatusStyles(formDefaultInfo?.status)} `} title={`${getStatusText(formDefaultInfo?.status)}`}>
                                {getStatusText(formDefaultInfo?.status)}
                            </button>
                        </div>
                        <div className='bg-[#EFF1F8] w-full py-[30px] px-[26px] h-customh6 overflow-auto default-sidebar'>
                            <p className='font-semibold text-[22px] text-[#2B333B]'>{formDefaultInfo?.internal_name}</p>
                            {sections?.map((sectionData, sectionIndex) => (
                                <div key={sectionData?.section_id} className='my-[25px] p-4 hover:border-[#2B333B] hover:border rounded-[10px]'>
                                    <div className='flex items-center w-full justify-between'>
                                        <p className='text-[#2B333B] font-medium text-[22px]'>{sectionData?.section_name}</p>
                                        <div className='flex items-center justify-end'>
                                            <img src="/Images/trash-black.svg" alt="save" className='pl-2.5 cursor-pointer' onClick={() => handleAddRemoveSection('remove', sectionIndex)} />
                                            <img src="/Images/save.svg" alt="save" className='pl-2.5 cursor-pointer' />
                                        </div>
                                    </div>
                                    {sectionData?.pages.map((pageData, pageIndex) => (
                                        <div key={pageData?.page_id} className='mt-7 w-full bg-white rounded-[10px] px-4 pt-4 pb-[22px] hover:border-[#2B333B] hover:border'>
                                            <div className='flex items-center justify-between'>
                                                <p className='text-[#2B333B] font-medium text-[22px]'>{pageData?.page_name}</p>
                                                <div className='flex items-center justify-end'>
                                                    <img src="/Images/trash-black.svg" alt="save" className='pl-2.5 cursor-pointer' onClick={() => handleAddRemoveSection('remove', sectionIndex)} />
                                                </div>
                                            </div>
                                            {console.log(sectionData, 'sections')}
                                            {sectionData?.pages[pageIndex]?.questions && sectionData?.pages[pageIndex]?.questions.map((questionData) => (
                                                <div key={questionData?.question_id} className='bg-[#EFF1F8] mt-7 rounded-[10px] p-4 hover:border hover:border-[#2B333B] flex justify-between items-start'>
                                                    <p className='mb-5 font-medium text-base text-[#000000]'>{questionData?.question_name}</p>
                                                    <div className='flex items-start'>
                                                        <DraggableList
                                                            itemKey="question_id"
                                                            template={Item}
                                                            list={pageData.questions}
                                                            onMoveEnd={(newList) => handleMoveEnd(newList, sectionIndex, pageIndex)}
                                                            container={() => containerRef.current}
                                                        />
                                                        <img src="/Images/trash-black.svg" alt="delete" className='pl-2.5 cursor-pointer' />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className='mt-7 bg-[#EFF1F8] rounded-[10px] w-full px-3 hover:border hover:border-[#2B333B]'>
                                                <button
                                                    type='button'
                                                    onClick={() => handleAddRemoveQuestion('add', sectionIndex, pageIndex)}
                                                    className='flex items-center justify-center w-full py-7 font-semibold text-[#2B333B] text-base'>
                                                    +
                                                    <span className='ml-[4]'>Add question</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div>
                                        <button
                                            type='button'
                                            onClick={() => handleAddRemovePage('add', sectionIndex)}
                                            className='flex items-center justify-center w-full rounded-[10px] py-7 mt-6 bg-white font-semibold text-[#2B333B] text-base hover:border hover:border-[#2B333B]'>
                                            +
                                            <span className='ml-[4]'>Add Page</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button className='flex items-center mt-8 font-semibold text-[#2B333B] text-base' onClick={() => handleAddRemoveSection('add')}>
                                + Add section
                            </button>
                        </div>
                    </div><div className='w-[30%]'>
                        <div className='border-b border-[#DCE0EC] flex items-center w-full'>
                            <button className='w-1/3 py-[17px] px-[29px] flex items-center font-semibold text-base text-[#2B333B] border-l border-r border-[#EFF1F8]' onClick={() => navigate('/questionnaries/create-questionnary')}>
                                <img src="/Images/cancle.png" className='pr-2.5' alt="cancle" />
                                Cancle
                            </button>
                            <button className='w-1/3 py-[17px] px-[29px] flex items-center font-semibold text-base text-[#2B333B] border-l border-r border-[#EFF1F8]'>
                                <img src="/Images/preview.png" className='pr-2.5' alt="preview" />
                                Preview
                            </button>
                            <button className='w-1/3 py-[17px] px-[29px] font-semibold text-base text-[#FFFFFF] bg-[#2B333B] border-l border-r border-[#EFF1F8]'>
                                Save
                            </button>
                        </div>
                        {/* <AddFields buttons={fieldsneeded} /> */}
                        {/* <TestFieldSetting/> */}
                    </div>
                </div >
            )

    )
}

export default QuestionnaryForm