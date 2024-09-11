import React from 'react'
import InputField from '../../../Components/InputField/InputField'
import InputTextarea from '../../../Components/InputField/InputTextarea'
import InputWithDropDown from '../../../Components/InputField/InputWithDropDown'
import Button from '../../../Components/Button/button'

function QuestionnarySettings({
    queSettingDetails,
    handleChange,
    setValidationErrors,
    validationErrors,
    editedDetails,
}) {
    
    console.log(queSettingDetails?.data?.internal_name, 'nameee')
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
                        value={queSettingDetails?.data?.public_name || ''}
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
                        value={queSettingDetails?.data?.internal_name || ''}
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
                        value={queSettingDetails?.data?.description || ''}
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
                        className='w-full mt-2.5 text-[#6F7579] bg-[#F5F5F5]'
                        labelStyle='font-semibold text-base text-[#6F7579]'
                        placeholder='Enter Public name'
                        testId='ID'
                        htmlFor='ID'
                        maxLength={100}
                        handleChange={handleChange}
                        disabled
                    />
                </div>
                <div className='w-full mt-6'>
                    <InputWithDropDown
                        label='Asset type'
                        labelStyle='font-semibold text-base text-[#6F7579]'
                        id='asset_type'
                        placeholder='Select'
                        className='w-full cursor-pointer mt-2.5 placeholder:text-[#9FACB9] text-[#6F7579] bg-[#F5F5F5] h-[45px]'
                        top='53px'
                        testID='drop-btn'
                        labeltestID='asset'
                        // options={options}
                        // isDropdownOpen={openDropdown === 'asset_type'}
                        // setDropdownOpen={() => setOpenDropdown(openDropdown === 'asset_type' ? null : 'asset_type')}
                        selectedOption={queSettingDetails?.data?.asset_type}
                    // handleOptionClick={(option) => handleOptionClick(option, 'asset_type')}
                    // dropdownRef={assetDropdownRef}
                    // validationError={validationErrors?.asset_type}
                    disabled
                    />
                </div>
                <div className='w-full mt-6'>
                    <InputWithDropDown
                        label='Language'
                        labelStyle='font-semibold text-base text-[#6F7579]'
                        id='language'
                        placeholder='Select'
                        className='w-full cursor-pointer mt-2.5 placeholder:text-[#9FACB9] text-[#6F7579] bg-[#F5F5F5] h-[45px]'
                        top='53px'
                        testID='language-drop-btn'
                        labeltestID='language'
                        // options={options1}
                        // isDropdownOpen={openDropdown === 'language'}
                        // setDropdownOpen={() => setOpenDropdown(openDropdown === 'language' ? null : 'language')}
                        selectedOption={queSettingDetails?.data?.language}
                    // handleOptionClick={(option) => handleOptionClick(option, 'language')}
                    // dropdownRef={languageDropdownRef}
                    // validationError={validationErrors?.language}
                    disabled
                    />
                </div>
                <div className='mt-6'>
                    <p className='font-semibold text-[#6F7579] text-base'>Ad Hoc / Non TAG questionnaire</p>
                    <div className='mt-2.5'>
                        <div className="relative custom-radioBlue flex items-center" data-testid='yes'
                        >
                            <input type='radio'
                                className='w-[17px] h-[17px]'
                                name='is_adhoc'
                                id='yes'
                                value='Yes'
                                checked={queSettingDetails?.data?.is_adhoc === 'Yes'}
                            // onChange={handleadhocChange}
                            />
                            <label htmlFor='yes' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                Yes
                            </label>
                        </div>
                        <div className="relative custom-radioBlue flex items-center mt-[12px]" data-testid='no'
                        >
                            <input type='radio'
                                className='w-[17px] h-[17px]'
                                name='is_adhoc'
                                id='no'
                                value='No'
                                checked={queSettingDetails?.data?.is_adhoc === 'No'}
                            // onChange={handleadhocChange}
                            />
                            <label htmlFor='no' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
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
            // onClick={handleCreateQuestionnary}
            // isThreedotLoading={isThreedotLoader}
            />
        </div>

    )
}

export default QuestionnarySettings