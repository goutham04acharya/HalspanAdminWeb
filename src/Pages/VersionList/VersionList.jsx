import React, { useCallback, useContext, useEffect, useState } from 'react'
import useApi from '../../services/CustomHook/useApi';
import { useNavigate, useParams } from 'react-router-dom';
import Table from '../../Pages/VersionList/Components/Table.jsx'
import Button2 from '../../Components/Button2/ButtonLight.jsx';
import QuestionnarySettings from './Components/QuestionnarySettings.jsx';
import CreateModal from '../../Components/CustomModal/CreateModal.jsx';
import ConfirmationModal from '../../Components/Modals/ConfirmationModal/ConfirmationModal.jsx';
import { useDispatch } from 'react-redux';
import { setInitialData } from '../QuestionnaryForm/Components/Fields/fieldSettingParamsSlice.js';
import GlobalContext from '../../Components/Context/GlobalContext.jsx';
import { v4 as uuidv4 } from 'uuid';
import VersionEditModal from '../../Components/Modals/VersionEditModal.jsx';
import GridTable from './Components/GridTable.jsx';

function VersionList() {
    const { getAPI } = useApi();
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
        }]
    }]);
    const { public_name, questionnaire_id } = useParams();
    const { setToastError, setToastSuccess } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [formDefaultInfo, setFormDefaultInfo] = useState([]);
    const [versionList, setVersionList] = useState([])
    const [pageLoading, setPageLoading] = useState(false);
    const [dataIsSame, setDataIsSame] = useState({});
    const [queSettingDetails, setQueSettingDetails] = useState()
    const [loading, setLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState({});
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [dropdownsOpen, setDropdownsOpen] = useState(false);
    const [version, setVersion] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState([])
    const [editedDetails, setEditedDetails] = useState({
        public_name: '',
        internal_name: '',
        description: '',
    });
    const [selectedVersion, setSelectedVersion] = useState('');
    const handleOptionClick = (versionNumber) => {
        setSelectedVersion(versionNumber); // Set the clicked version as the selected version
        setDropdownsOpen(false); // Close the dropdown after selecting an option
    };
    const handleClose = () => {
        setIsCreateModalOpen(false)
        setDropdownsOpen(false)
        setVersion(false)
        setSelectedVersion('')
        // console.log(version, 'on close')
    }
    const handleDropdownClick = () => {
        setDropdownsOpen(!dropdownsOpen)
        // setIsCreateModalOpen(false)
    }
    let selectedVersionObj = {};
    const handleEditClick = () => {
        selectedVersionObj = versionList?.data?.items?.find(
            (version) => version.version_number === selectedVersion
        );

        if (selectedVersionObj) {
            setSelectedStatus(selectedVersionObj); // Set the selected version object to state
            console.log(selectedStatus.status, 'selectedStatus')
            if (selectedVersionObj.status === 'Draft') {
                setVersion(false); // Proceed with navigation
                navigate(`/questionnaries/create-questionnary/questionnary-form/${questionnaire_id}/${selectedVersion}`);
                // Additional logic like formDefaultDetails() or getFieldSetting() can be added here
            } else {
                console.log('Selected version is not in "Draft" status');
                setVersion(true); // Prevent navigation
            }
        } else {
            console.log('No version found with the selected version number');
        }
    };

    console.log(selectedVersion, 'asca')
    useEffect(() => {
        console.log(isCreateModalOpen, 'modal');
    }, [isCreateModalOpen]);

    const handleVersionList = async () => {
        setDataLoading(true);
        setLoading(true);
        const response = await getAPI(`questionnaires/versions/${questionnaire_id}`)
        setVersionList(response?.data)
        console.log(response)
        setLoading(false);
    }
    useEffect(() => {
        handleVersionList();
    }, []);

    const handleQuestionnariesSetting = async () => {
        setLoading(true);
        setDataLoading(true);
        const response = await getAPI(`questionnaires/${questionnaire_id}`);
        console.log(response, 'questionairre')
        setQueSettingDetails(response?.data);
        setDataLoading(false);
        setEditedDetails((prevState) => ({
            ...prevState,
            public_name: response?.data?.data?.public_name,
            internal_name: response?.data?.data?.internal_name,
            description: response?.data?.data?.description,
        }));
        setLoading(false);
    };


    const handleChange = (e, field) => {
        e.preventDefault();
        setEditedDetails((prevState) => ({
            ...prevState,
            [field]: e.target.value,
        }));
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [field]: '',
        }));
    };

    //implement infinate scroll here
    // const lastElementRef = useCallback(node => {
    //     if (loading || isFetchingMore) return;
    //     if (observer.current) observer.current.disconnect();
    //     observer.current = new IntersectionObserver(entries => {
    //       if (entries[0]?.isIntersecting && lastEvaluatedKeyRef.current) {
    //         setIsFetchingMore(true);
    //         fetchQuestionnaryList();
    //       }
    //     });
    //     if (node) observer.current.observe(node);
    //   }, [loading, isFetchingMore]);

    useEffect(() => {
        handleVersionList();
        handleQuestionnariesSetting();
    }, [])

    return (
        <>
            <div className='p-7 bg-[#F4F6FA]'>
                <div className='px-[34px] py-[38px] w-full flex items-start bg-[#FFFFFF] h-customh6'>
                    <div className='w-[75%]'>
                        <p className='mt-2 text-[28px] font-medium text-[#2B333B]'>{queSettingDetails?.data?.internal_name}</p>
                        <p className='mt-8 text-[22px] font-medium text-[#2B333B] '>Choose a Version</p>
                        <div className='mt-10'>
                            <GridTable
                                setVersionList={setVersionList}
                                versionList={versionList}
                                setLoading={setLoading}
                                loading={loading} />
                            <Button2
                                testId='back-to-questionnaire'
                                onClick={() => navigate('/questionnaries')}
                                className='w-[315px] h-[50px] mt-5 font-semibold'
                                text='Back to all Questionnaires' />
                        </div>
                    </div>
                    <div className='w-[25%] ml-[88px]'>
                        <div className='flex items-center'>
                            <Button2
                                testId='edit'
                                onClick={() => setIsCreateModalOpen(true)}
                                className='w-[40%] h-[50px] ml-[32px] font-semibold text-[#2B333B]'
                                text='Edit' />
                            <Button2
                                text='Duplicate'
                                testId='duplicate'
                                className='w-[60%] h-[50px] ml-[32px] font-semibold text-[#2B333B]l' />
                        </div>
                        <QuestionnarySettings
                            queSettingDetails={queSettingDetails}
                            handleChange={handleChange}
                            setValidationErrors={setValidationErrors}
                            validationErrors={validationErrors}
                            editedDetails={editedDetails}
                            setLoading={setLoading}
                            setDataLoading={setDataLoading}
                            dataLoading={dataLoading} />
                    </div>

                </div>

            </div>
            {isCreateModalOpen && <VersionEditModal
                text={`${version ? 'This question can’t be edited' : 'Edit Questionnaire'}`}
                subText={`${version ? 'Version ' + selectedVersion + ' is in ' + selectedStatus.status + ' state, therefore can’t be edited.' : 'Please select the version you want to edit.'}`}
                handleButton1={handleEditClick}
                Button1text='Edit'
                testIDBtn1='confirm-edit'
                testIDBtn2='cancel'
                button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000]'
                Button2text='Cancel'
                handleButton2={handleClose}
                handleClose={handleClose}
                isOpen={isCreateModalOpen}
                setModalOpen={setIsCreateModalOpen}
                versionListEdit={'Version List'}
                handleDropdownClick={handleDropdownClick}
                dropdownsOpen={dropdownsOpen}
                setDropdownsOpen={setDropdownsOpen}
                versionList={versionList}
                handleOptionClick={handleOptionClick}
                selectedVersion={selectedVersion}
                setSelectedVersion={setSelectedVersion}
                setVersion={setVersion}
                version={version}
            />}
        </>
    )
}

export default VersionList