import React, { useContext, useState } from 'react'
import InputField from '../../../Components/InputField/InputField'
import InputTextarea from '../../../Components/InputField/InputTextarea'
import InputWithDropDown from '../../../Components/InputField/InputWithDropDown'
import Button from '../../../Components/Button/button'
import useApi from '../../../services/CustomHook/useApi'
import GlobalContext from '../../../Components/Context/GlobalContext'

function QuestionnarySettings({
    queSettingDetails,
    handleChange,
    setValidationErrors,
    validationErrors,
    editedDetails,
    setLoading
}) {

    const { PatchAPI } = useApi();
    const { setToastError, setToastSuccess } = useContext(GlobalContext);
    const [isThreedotLoader, setIsThreedotLoader] = useState(false)

    const editQuestionnarySettings = async () => {
        const questionnaire_id = queSettingDetails?.data?.questionnaire_id;

        const payload = {
            public_name: editedDetails?.public_name,
            internal_name: editedDetails?.internal_name,
            description: editedDetails?.description
        };

        setIsThreedotLoader(true);

        try {
            const response = await PatchAPI(`questionnaires/${questionnaire_id}`, payload);
            console.log(response, 'nayan')
            // Handle success and update the state as needed
            if (response?.status === 200) {
                console.log("Questionnaire settings updated successfully");
                setIsThreedotLoader(false);

            } else {
                // Handle any validation errors or unsuccessful responses
                console.error('Error updating questionnaire:', response);
                setIsThreedotLoader(false);
            }
        } catch (error) {
            console.error('Error occurred during the API call:', error);
            setIsThreedotLoader(false);
        }
    };

    return (
        <div className='mt-9'>
            <p className='font-medium text-[22px] text-[#2B333B]'>Questionnaire settings</p>
            <div className='mt-[22px] h-customh11 overflow-auto default-sidebar'>
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
                    <button className='text-[#6F7579] bg-[#F5F5F5] p-4 rounded h-[45px] w-full cursor-not-allowed flex justify-between items-center text-base font-normal border border-[#AEB3B7]'>
                        <p>{queSettingDetails?.data?.asset_type}</p>
                        <img src="/Images/open-Filter.svg" alt="" />
                    </button>
                </div>
                <div className='w-full mt-6'>
                    <p className='font-semibold text-base text-[#6F7579] mb-2.5'>Language</p>
                    <button className='text-[#6F7579] bg-[#F5F5F5] p-4 rounded h-[45px] w-full cursor-not-allowed flex justify-between items-center text-base font-normal border border-[#AEB3B7]'>
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
                className='w-full h-[50px] mt-[26px]'
                onClick={editQuestionnarySettings}
                isThreedotLoading={isThreedotLoader}
            />
        </div>

    )
}

export default QuestionnarySettings