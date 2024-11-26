import React, { useContext, useEffect, useState } from 'react'
import InputField from '../../../Components/InputField/InputField'
import InputTextarea from '../../../Components/InputField/InputTextarea'
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
    dataLoading,
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

        // Check for mandatory fields
        const errors = {};
        if (!editedDetails.public_name?.trim()) {
            errors.public_name = 'This field is mandatory';
        }
        if (!editedDetails.internal_name?.trim()) {
            errors.internal_name = 'This field is mandatory';
        }
        if (!editedDetails.description?.trim()) {
            errors.description = 'This field is mandatory';
        }

        setValidationErrors(errors);
        // If there are any validation errors, stop here
        if (Object.keys(errors).length > 0 || Object.keys(payload).length === 0) {
            return; // Don't proceed if there are errors or if there are no changes in the payload
        }
        setIsThreedotLoader(true);

        try {
            const response = await PatchAPI(`questionnaires/${questionnaire_id}`, payload);
            if (response?.data?.status === true) {
                setToastSuccess(response?.data?.message);
                setValidationErrors({});
                setIsThreedotLoader(false);
                // Delay the page refresh to allow the success message to be visible
                setTimeout(() => {
                    window.location.reload();
                }, 1000); // 2 second delay

            } else if (response?.data?.status === 409) {
                setValidationErrors({
                    ...validationErrors,
                    public_name: 'This public name already exists',
                });
                setIsThreedotLoader(false);
            } else if (response?.data?.status === 400) {
                const fieldErrors = {};

                // Check if public_name is too short and set the appropriate error
                if (editedDetails?.public_name?.length < 2) {
                    fieldErrors.public_name = 'Public name requires at least 2 characters';
                }

                // Check if internal_name is too short and set the appropriate error
                if (editedDetails?.internal_name?.length < 2) {
                    fieldErrors.internal_name = 'Internal name requires at least 2 characters';
                }
                // Set validation errors for the specific failing fields
                setValidationErrors({ ...errors, ...fieldErrors });

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

    // Logic to handle Save button enabling/disabling based on changes
    useEffect(() => {
        const hasChanges = Object.keys(Payload()).length > 0;
        setIsSaveDisabled(!hasChanges); // Disable the button if no changes, enable if there are changes
    }, [editedDetails, queSettingDetails]);
    console.log(queSettingDetails, 'queSettingDetails?.data')
    return (
        dataLoading ?
            <QuestionnarySettingShimmer />
            :

            <div className='mt-9'>
                <p className='font-medium text-[22px] text-[#2B333B]'>Questionnaire settings</p>
                <div className='mt-[22px] h-customh11 overflow-auto default-sidebar overflow-x-hidden'>
                    <div className='w-full mr-[114px]'>
                        <InputField
                            autoComplete='off'
                            label='Public name'
                            id='public_name'
                            type='text'
                            mandatoryField='true'
                            value={editedDetails?.public_name}
                            className='w-full mt-2.5 pr-2.5'
                            labelStyle='font-semibold text-base text-[#2B333B]'
                            placeholder='Enter Public name'
                            testId='publicName'
                            htmlFor='public_name'
                            maxLength={100}
                            handleChange={(e) => handleChange(e, 'public_name')}
                            validationError={validationErrors?.public_name}
                            questionnarySettings
                        />
                    </div>
                    <div className='w-full mt-6'>
                        <InputField
                            autoComplete='off'
                            label='Internal name'
                            id='internal_name'
                            type='text'
                            mandatoryField='true'
                            value={editedDetails?.internal_name || ''}
                            className='w-full mt-2.5 pr-2.5'
                            labelStyle='font-semibold text-base text-[#2B333B]'
                            placeholder='Enter Internal name'
                            testId='internalName'
                            htmlFor='internal_name'
                            maxLength={100}
                            handleChange={(e) => handleChange(e, 'internal_name')} // Ensure handleChange is passed
                            validationError={validationErrors?.internal_name}
                            questionnarySettings
                        />
                    </div>
                    <div className='w-full mt-6'>
                        <InputTextarea
                            className='h-[146px] w-full mt-2.5 px-[11px]'
                            label='Description'
                            htmlFor='description'
                            id='description'
                            mandatoryField='true'
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
                    <div className='w-full mt-6'>
                        <p className='font-semibold text-base text-[#6F7579] mb-2.5'>Service record</p>
                        <button
                            data-testId='service_type'
                            className='text-[#6F7579] bg-[#F5F5F5] p-4 rounded h-[45px] w-full cursor-not-allowed flex justify-between items-center text-base font-normal border border-[#AEB3B7]'>
                            <p>{queSettingDetails?.data?.services_type}</p>
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
                    testID='save-settings'
                    className={`w-full h-[50px] mt-[26px] ${isSaveDisabled ? 'bg-[#DDDDDD] hover:bg-[#DDDDDD]' : 'bg-[#2B333B] hover:bg-[#000000]'}`}
                    onClick={editQuestionnarySettings}
                    isThreedotLoading={isThreedotLoader}
                    disabled={isSaveDisabled} // Disable the button if no changes
                />
            </div>
    )
}

export default QuestionnarySettings