import React, { useState } from 'react'
import CommonComponents from '../../../CommonComponents/CommonComponents'
import InputField from '../../../../../../Components/InputField/InputField'
import OptionsComponent from '../../TextBox/TextFieldSetting/OptionalComponent/OptionalComponent'

function DisplayFieldSetting({
    handleInputChange,
    formParameters,
    handleBlur,
    fieldSettingParameters,
    setShouldAutoSave,
    selectedQuestionId,
    handleRadiobtn,
}) {

    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <>
            <div data-testid="field-settings" className='py-[34px] px-[32px] h-customh10'>
                <p className='font-semibold text-[#2B333B] text-[22px]'>Field settings</p>
                <div className='mt-[14px] h-customh9 overflow-auto default-sidebar'>
                    <CommonComponents
                        labelID='label'
                        labelName='Label'
                        labelPlaceholder='Question 1'
                        helpTextId='Help Text'
                        helpText='Help Text'
                        helpTextPlaceholder='Enter help text'
                        handleInputChange={handleInputChange}
                        formParameters={formParameters}
                        handleBlur={handleBlur}
                        assetLocation={true}
                    />
                    <div className='mt-7'>
                        <p className='font-semibold text-base text-[#2B333B]'>Type</p>
                        <div className='mt-2.5'>
                            <div className="relative custom-radioBlue flex items-center" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    id='heading'
                                    value='heading'
                                    checked={fieldSettingParameters?.type === 'heading'}
                                    onClick={() => handleRadiobtn('heading')} />
                                <label htmlFor='heading'
                                    data-testid='heading'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Heading
                                </label>
                            </div>
                            {fieldSettingParameters?.type === 'heading' &&
                                <InputField
                                    autoComplete='off'
                                    id='heading'
                                    type='text'
                                    value={fieldSettingParameters?.heading}
                                    className='w-full mt-2.5'
                                    placeholder='Enter heading'
                                    testId='heading'
                                    htmlFor='heading'
                                    maxLength={100}
                                    handleChange={(e) => handleInputChange(e)} />
                            }
                            <div className="relative custom-radioBlue flex items-center mt-3">
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    id='text'
                                    value='text'
                                    checked={fieldSettingParameters?.type === 'text'}
                                    onClick={() => handleRadiobtn('text')} />
                                <label
                                    data-testid='text'
                                    htmlFor='text' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Text
                                </label>
                            </div>
                            {fieldSettingParameters?.type === 'text' &&
                                <InputField
                                    autoComplete='off'
                                    id='text'
                                    type='text'
                                    value={fieldSettingParameters?.text}
                                    className='w-full mt-2.5'
                                    placeholder='Enter text'
                                    testId='text'
                                    htmlFor='text'
                                    maxLength={100}
                                    handleChange={(e) => handleInputChange(e)} />
                            }
                            <div className="relative custom-radioBlue flex items-center mt-3">
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    id='image'
                                    value='image'
                                    checked={fieldSettingParameters?.type === 'image'}
                                    onClick={() => handleRadiobtn('image')} />
                                <label htmlFor='image' data-testid='image'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Image
                                </label>
                            </div>
                            {fieldSettingParameters?.type === 'image' && (
                                <div className='flex items-center mt-2.5'>
                                    <div className='relative w-[60%]'>
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className='hidden'
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className='bg-[#2B333B] rounded h-[50px] w-full flex items-center justify-center cursor-pointer font-semibold text-base text-white'
                                        >
                                            Add Image
                                            <img src="/Images/fileUpload.svg" alt="Upload" className='ml-2.5' />
                                        </label>
                                    </div>
                                    {selectedFile && <label className='ml-3'>{selectedFile.name}</label>}
                                </div>
                            )}
                            <div className="relative custom-radioBlue flex items-center mt-3">
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    id='url'
                                    value='url'
                                    checked={fieldSettingParameters?.type === 'url'}
                                    onClick={() => handleRadiobtn('url')} />
                                <label htmlFor='url' data-testid='url'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    URL
                                </label>
                            </div>
                        </div>
                    </div>
                    <OptionsComponent setShouldAutoSave={setShouldAutoSave} selectedQuestionId={selectedQuestionId} />
                    <div className='mt-7'>
                        <InputField
                            autoComplete='off'
                            label='Admin Field Notes'
                            id='note'
                            type='text'
                            value={fieldSettingParameters?.note}
                            className='w-full mt-2.5'
                            labelStyle='font-semibold text-base text-[#2B333B]'
                            placeholder='Notes'
                            testId='Notes'
                            htmlFor='note'
                            maxLength={500}
                            handleChange={(e) => handleInputChange(e)} />
                    </div>
                    <div className='mx-auto mt-7 flex items-center w-full'>
                        <button type='button' className='w-[80%] mx-auto py-[13px] bg-black rounded font-semibold text-[#FFFFFF] text-base px-[52px]'>
                            Add Conditional Logic
                        </button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default DisplayFieldSetting