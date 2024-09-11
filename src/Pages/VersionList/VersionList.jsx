import React, { useCallback, useEffect, useState } from 'react'
import useApi from '../../services/CustomHook/useApi';
import { useNavigate, useParams } from 'react-router-dom';
import Table from '../../Pages/VersionList/Components/Table.jsx'
import Button2 from '../../Components/Button2/ButtonLight.jsx';
import QuestionnarySettings from './Components/QuestionnarySettings.jsx';

function VersionList() {
    const { getAPI } = useApi();
    const { public_name, questionnaire_id } = useParams()
    const navigate = useNavigate();
    const [versionList, setVersionList] = useState([])
    const [queSettingDetails, setQueSettingDetails] = useState()
    const [loading, setLoading] = useState(true);
    const [validationErrors, setValidationErrors] = useState({});
    const [editedDetails, setEditedDetails] = useState({
        public_name: '',
        internal_name: '',
        description: '',
    });

    const handleVersionList = async () => {
        setLoading(true);
        const response = await getAPI(`questionnaires/versions/${public_name}`)
        setVersionList(response?.data)
        setLoading(false);
    }

    const handleQuestionnariesSetting = async () => {
        setLoading(true);
        const response = await getAPI(`questionnaires/${questionnaire_id}`);
        setQueSettingDetails(response?.data);
        setEditedDetails({
            public_name: data?.public_name || '',
        });
        setLoading(false);
    };


    const handleChange = (e, id) => {
        const { value } = e.target;

        // Define a regular expression to allow only alphanumeric characters and spaces
        const regex = /^[a-zA-Z0-9 ]*$/;

        if (regex.test(value)) {
            setQueSettingDetails((prevState) => ({
                ...prevState,
                data: {
                    ...prevState.data,
                    [id]: value,
                },
            }));

            // Clear the validation error for the current field
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                [id]: '',
            }));
        }
    };

    console.log(queSettingDetails, 'setQueSettingDetails')
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
        <div className='p-7 bg-[#F4F6FA]'>
            <div className='px-[34px] py-[38px] w-full flex items-start bg-[#FFFFFF] h-customh6'>
                <div className='w-[75%]'>
                    <p className='mt-2 text-[28px] font-medium text-[#2B333B]'>{queSettingDetails?.data?.internal_name}</p>
                    <p className='mt-8 text-[22px] font-medium text-[#2B333B] '>Choose a Version</p>
                    <div className='mt-10'>
                        <Table
                            setVersionList={setVersionList}
                            versionList={versionList}
                            setLoading={setLoading}
                            loading={loading}
                        // lastElementRef={lastElementRef}
                        />
                        <Button2
                            testId='back-to-questionnaire'
                            onClick={() => navigate('/questionnaries')}
                            className='w-[315px] h-[50px] mt-5 font-semibold'
                            text='Back to all Questionnaires'
                        />
                    </div>
                </div>
                <div className='w-[25%] ml-[88px]'>
                    <div className='flex items-center'>
                        <Button2
                            testId='edit'
                            // onClick={handleNavigateBack}
                            className='w-[40%] h-[50px] ml-[32px] font-semibold text-[#2B333B]'
                            text='Edit'
                        />
                        <Button2
                            text='Duplicate'
                            testId='duplicate'
                            className='w-[60%] h-[50px] ml-[32px] font-semibold text-[#2B333B]l'
                        />
                    </div>
                    <QuestionnarySettings
                        queSettingDetails={queSettingDetails}
                        handleChange={handleChange}
                        setValidationErrors={setValidationErrors}
                        validationErrors={validationErrors}
                        editedDetails={editedDetails}
                    />
                </div>

            </div>
        </div>
    )
}

export default VersionList