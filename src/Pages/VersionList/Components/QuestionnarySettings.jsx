import React, { useContext, useEffect, useState } from 'react'
import InputField from '../../../Components/InputField/InputField'
import InputTextarea from '../../../Components/InputField/InputTextarea'
import InputWithDropDown from '../../../Components/InputField/InputWithDropDown'
import Button from '../../../Components/Button/button'
import useApi from '../../../services/CustomHook/useApi'
import GlobalContext from '../../../Components/Context/GlobalContext'
import QuestionnarySettingShimmer from '../../../Components/Shimmers/QuestionnarySettingShimmer'

function QuestionnarySettings({
    queSettingDetails,
    handleChange,
    setValidationErrors,
    validationErrors,
    editedDetails,
    dataLoading
}) {

    const { PatchAPI } = useApi();
    const { setToastError, setToastSuccess } = useContext(GlobalContext);
    const [isThreedotLoader, setIsThreedotLoader] = useState(false)
    const [isSaveDisabled, setIsSaveDisabled] = useState(true); // Initially disable save button


    // Function to detect changes and dynamically build payload
    const Payload = () => {
        const changes = {};
        if (editedDetails?.public_name !== queSettingDetails?.data?.public_name) {
            changes.public_name = editedDetails?.public_name;
        }
        if (editedDetails?.internal_name !== queSettingDetails?.data?.internal_name) {
            changes.internal_name = editedDetails?.internal_name;
        }
        if (editedDetails?.description !== queSettingDetails?.data?.description) {
            changes.description = editedDetails?.description;
        }
        return changes;
    };

    const editQuestionnarySettings = async () => {
        const questionnaire_id = queSettingDetails?.data?.questionnaire_id;
        const payload = Payload();

        if (Object.keys(payload).length === 0) {
            return; // If no changes, don't proceed
        }

        setIsThreedotLoader(true);

        try {
            const response = await PatchAPI(`questionnaires/${questionnaire_id}`, payload);
            if (response?.data?.status === true) {
                setToastSuccess(response?.data?.message);
                setValidationErrors({});
                setIsThreedotLoader(false);
                setIsSaveDisabled(true); // Disable button again after successful save
            } else if (response?.data?.status === 409) {
                setValidationErrors({
                    ...validationErrors,
                    public_name: 'This public name already exists',
                });
                setIsThreedotLoader(false);
            } else {
                setToastError('Something went wrong!');
                setIsThreedotLoader(false);
            }
        } catch (error) {
            setToastError('Something went wrong!');
            setIsThreedotLoader(false);
        }
    };

    // Enable the save button if there are any changes
    useEffect(() => {
        const hasChanges = Object.keys(Payload()).length > 0;
        setIsSaveDisabled(!hasChanges); // Disable the button if no changes
    }, [editedDetails, queSettingDetails]);

    return (
        dataLoading ? 
        <QuestionnarySettingShimmer/>
        :
        <div className='mt-9'>
            <p className='font-medium text-[22px] text-[#2B333B]'>Questionnaire settings</p>
            <div className='mt-[22px] h-customh12 overflow-auto default-sidebar overflow-x-hidden'>
                <div className='w-full mr-[114px]'>
                    <InputField
                        autoComplete='off'
                        label='Public name'
                        id='public_name'
                        type='text'
                        value={editedDetails?.public_name}
                        className='w-full mt-2.5'
                        labelStyle='font-semibold text-base text-[#2B333B]'
                        placeholder='Enter Public name'
                        testId='publicName'
                        htmlFor='public_name'
                        maxLength={100}
                        handleChange={(e) => handleChange(e, 'public_name')}
                        validationError={validationErrors?.public_name}
                    />
                </div>
                <div className='w-full mt-6'>
                    <InputField
                        autoComplete='off'
                        label='Internal name'
                        id='internal_name'
                        type='text'
                        value={editedDetails?.internal_name || ''}
                        className='w-full mt-2.5'
                        labelStyle='font-semibold text-base text-[#2B333B]'
                        placeholder='Enter Internal name'
                        testId='internalName'
                        htmlFor='internal_name'
                        maxLength={100}
                        handleChange={(e) => handleChange(e, 'internal_name')} // Ensure handleChange is passed
                        validationError={validationErrors?.internal_name}
                    />
                </div>
                <div className='w-full mt-6'>
                    <InputTextarea
                        className='h-[146px] w-full mt-2.5'
                        label='Description'
                        htmlFor='description'
                        id='description'
                        labelStyle='font-semibold text-base text-[#2B333B]'
                        value={editedDetails?.description || ''}
                        placeholder='Enter Description'
                        testId='description'
                        maxLength={500}
                        handleChange={(e) => handleChange(e, 'description')} // Ensure handleChange is passed
                        validationError={validationErrors?.description}
                    />
                </div>
                <div className='mt-5'>
                    <InputField
                        autoComplete='off'
                        label='ID'
                        id='ID'
                        type='text'
                        value={queSettingDetails?.data?.questionnaire_id}
                        className='w-full mt-2.5 text-[#6F7579] bg-[#F5F5F5] cursor-not-allowed'
                        labelStyle='font-semibold text-base text-[#6F7579]'
                        placeholder='Enter Public name'
                        testId='ID'
                        htmlFor='ID'
                        maxLength={100}
                        disabled
                    />
                </div>
                <div className='w-full mt-6'>
                    <p className='font-semibold text-base text-[#6F7579] mb-2.5'>Asset type</p>
                    <button
                        data-testId='assetType'
                        className='text-[#6F7579] bg-[#F5F5F5] p-4 rounded h-[45px] w-full cursor-not-allowed flex justify-between items-center text-base font-normal border border-[#AEB3B7]'>
                        <p>{queSettingDetails?.data?.asset_type}</p>
                        <img src="/Images/open-Filter.svg" alt="" />
                    </button>
                </div>
                <div className='w-full mt-6'>
                    <p className='font-semibold text-base text-[#6F7579] mb-2.5'>Language</p>
                    <button
                        data-testId='language'
                        className='text-[#6F7579] bg-[#F5F5F5] p-4 rounded h-[45px] w-full cursor-not-allowed flex justify-between items-center text-base font-normal border border-[#AEB3B7]'>
                        <p>{queSettingDetails?.data?.language}</p>
                        <img src="/Images/open-Filter.svg" alt="" />
                    </button>
                </div>
                <div className='mt-6'>
                    <p className='font-semibold text-[#6F7579] text-base'>Ad Hoc / Non TAG questionnaire</p>
                    <div className='mt-2.5'>
                        <div className="relative custom-radiodisabled flex items-center" data-testid='yes'>
                            <input
                                type='radio'
                                className='w-[17px] h-[17px]'
                                name='is_adhoc'
                                id='yes'
                                value='Yes'
                                data-testId='yes'
                                checked={queSettingDetails?.data?.is_adhoc === true}  // Checks if is_adhoc is true
                                disabled  // Disables the input
                            />
                            <label htmlFor='yes' className='ml-7 font-normal text-base text-[#6F7579] cursor-not-allowed'>
                                Yes
                            </label>
                        </div>
                        <div className="relative custom-radiodisabled flex items-center mt-[12px]" data-testid='no'>
                            <input
                                type='radio'
                                className='w-[17px] h-[17px]'
                                name='is_adhoc'
                                id='no'
                                value='No'
                                data-testId='no'
                                checked={queSettingDetails?.data?.is_adhoc === false}  // Checks if is_adhoc is false
                                disabled  // Disables the input
                            />
                            <label htmlFor='no' className='ml-7 font-normal text-base text-[#6F7579] cursor-not-allowed'>
                                No
                            </label>
                        </div>
                    </div>
                </div>

            </div>
            <Button
                text='Save settings'
                testID='createQuestionnaireBtn'
                className={`w-full h-[50px] mt-[26px] ${isSaveDisabled? 'bg-[#DDDDDD] hover:bg-[#DDDDDD]' : 'bg-[#2B333B] hover:bg-[#000000]'}`}
                onClick={editQuestionnarySettings}
                isThreedotLoading={isThreedotLoader}
                disabled={isSaveDisabled} // Disable the button if no changes
            />
        </div>
    )
}

export default QuestionnarySettings