import React, { useCallback, useContext, useEffect, useState } from 'react'
import useApi from '../../services/CustomHook/useApi';
import { useNavigate, useParams } from 'react-router-dom';
import Button2 from '../../Components/Button2/ButtonLight.jsx';
import QuestionnarySettings from './Components/QuestionnarySettings.jsx';
import { useDispatch } from 'react-redux';
import GlobalContext from '../../Components/Context/GlobalContext.jsx';
import { v4 as uuidv4 } from 'uuid';
import VersionEditModal from '../../Components/Modals/VersionEditModal.jsx';
import GridTable from './Components/GridTable.jsx';

function VersionList() {
    const { getAPI } = useApi();
    const { PatchAPI } = useApi();
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
    const [edit, setEdit] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState([])
    const [duplicate, setDuplicate] = useState(false)
    const [editedDetails, setEditedDetails] = useState({
        public_name: '',
        internal_name: '',
        description: '',
    });
    const [buttonDisable, setButtonDisable] = useState(false)
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
        setEdit(false)
        setDuplicate(false)
    }
    const handleDropdownClick = () => {
        setDropdownsOpen(!dropdownsOpen)
        // setIsCreateModalOpen(false)
    }
    let selectedVersionObj = {};
    const handleDuplicateClick = async () => {

        if (!selectedVersion) {
            setToastError('Please select a version to duplicate.');
            return;
        }

        // Find the selected version object from the version list
        const selectedVersionObj = versionList?.data?.items?.find(
            (version) => version.version_number === selectedVersion
        );
        setLoading(true)
        setButtonDisable(true)
        if (selectedVersionObj) {
            try {
                const payload = {
                    questionnaire_id,
                    public_name: queSettingDetails?.data?.public_name,
                    from_version_number: selectedVersion
                };

                const response = await PatchAPI('questionnaires/duplicate', payload);
                setToastSuccess('Version duplicated successfully.');
                handleClose(); // Close the modal
                // Fetch the updated version list after duplicating
                await handleVersionList();
            } catch (error) {
                setToastError('An error occurred while duplicating the version.');
                console.error(error);
            }
        } else {
            setToastError('No version found with the selected version number.');
        }
        setLoading(false)
        setButtonDisable(false)
    };

    const handleEditClick = () => {
        selectedVersionObj = versionList?.data?.items?.find(
            (version) => version.version_number === selectedVersion
        );
        setLoading(true)
        setButtonDisable(true)
        if (selectedVersionObj) {
            setSelectedStatus(selectedVersionObj); // Set the selected version object to state
            if (selectedVersionObj.status === 'Draft') {
                setVersion(false); // Proceed with navigation
                navigate(`/questionnaries/create-questionnary/questionnary-form/${questionnaire_id}/${selectedVersion}`);
                // Additional logic like formDefaultDetails() or getFieldSetting() can be added here
            } else {
                setVersion(true); // Prevent navigation
            }
        } else {
        }
        setLoading(false)
        setButtonDisable(false)
    };

    const handleVersionList = async () => {
        setDataLoading(true);
        setLoading(true);
        const response = await getAPI(`questionnaires/versions/${questionnaire_id}`)
        setVersionList(response?.data)
        setLoading(false);
    }

    const handleQuestionnariesSetting = async () => {
        setLoading(true);
        setDataLoading(true);
        const response = await getAPI(`questionnaires/${questionnaire_id}`);
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
    useEffect(() => {
        handleVersionList();
        handleQuestionnariesSetting();
    }, [])

    return (
        <>
            <div className='p-7 bg-[#F4F6FA]'>
                <div className='px-[34px] py-[38px] w-full flex items-start bg-[#FFFFFF] h-customh6'>
                    <div className='w-[75%]'>
                        <p className='mt-2 text-[28px] font-medium text-[#2B333B] break-words'>{queSettingDetails?.data?.internal_name}</p>
                        <p className='mt-8 text-[22px] font-medium text-[#2B333B] '>Choose a Version</p>
                        <div className='mt-10'>
                            <GridTable
                                setVersionList={setVersionList}
                                versionList={versionList}
                                setLoading={setLoading}
                                loading={loading}
                                setSelectedVersion={setSelectedVersion}
                                selectedVersion={selectedVersion}
                            />
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
                                onClick={() => {
                                    setIsCreateModalOpen(true)
                                    setEdit(true)
                                }}
                                className='w-[40%] h-[50px] font-semibold text-[#2B333B]'
                                text='Edit' />
                            <Button2
                                text='Duplicate'
                                onClick={() => {
                                    setIsCreateModalOpen(true)
                                    setDuplicate(true);
                                }}
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
                text={`${version ? 'This question can’t be edited' : duplicate ? 'Select Version' : edit ? 'Edit Questionnaire' : ''}`}
                subText={`${version ? 'Version ' + selectedVersion + ' is in ' + selectedStatus.status + ' state, therefore can’t be edited.' : edit ? 'Please select the version you want to edit.' : duplicate ? 'Please select the version you want to duplicate.' : ''}`}
                handleButton1={edit ? handleEditClick : handleDuplicateClick}
                Button1text={edit ? 'Edit' : 'Duplicate'}
                button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000]'
                Button2text='Cancel'
                testIDBtn1={edit ? 'confirm-edit' : 'confirm-duplicate'}
                testIDBtn2='cancel-btn-modal'
                handleButton2={handleClose}
                handleClose={handleClose}
                isOpen={isCreateModalOpen}
                loading={loading}
                setLoading={setLoading}
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
                setDuplicate={setDuplicate}
                setEdit={setEdit}
                edit={edit}
                duplicate={duplicate}
                questionnaireId={questionnaire_id}
                buttonDisable={buttonDisable}
            />}
        </>
    )
}

export default VersionList