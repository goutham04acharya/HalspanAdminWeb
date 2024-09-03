import React from 'react'
import { useDispatch } from 'react-redux';
import CommonComponents from '../../../CommonComponents/CommonComponents';
import { setNewComponent } from '../../fieldSettingParamsSlice';
import OptionsComponent from '../../TextBox/TextFieldSetting/OptionalComponent/OptionalComponent';
import InputField from '../../../../../../Components/InputField/InputField';

function PhotoFieldSetting({ handleInputChange,
    formParameters,
    handleBlur,
    handleRadiobtn,
    fieldSettingParameters,
    setShouldAutoSave,
    selectedQuestionId,

}) {
    const dispatch = useDispatch();
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
                        placeholderContentId='placeholder'
                        placeholder='Placeholder Content'
                        placeholderContent='Text displayed in the field'
                        handleInputChange={handleInputChange}
                        formParameters={formParameters}
                        handleBlur={handleBlur}
                        assetLocation={true}
                    />
                    <div className='mt-7'>
                        <p className='font-semibold text-base text-[#2B333B]'>Number of Photos</p>
                        <div className='flex items-center mt-3'>
                            <InputField
                                autoComplete='off'
                                label=''
                                id='min'
                                type='text'
                                value={fieldSettingParameters?.min}
                                className='w-full'
                                labelStyle=''
                                placeholder='Minimum'
                                testId='minChar'
                                htmlFor='min'
                                maxLength={10}
                                handleChange={(e) => handleInputChange(e)} />
                            <p className='mx-3 font-normal text-base text-[#2B333B]'> to</p>
                            <InputField
                                autoComplete='off'
                                label=''
                                id='max'
                                type='text'
                                value={fieldSettingParameters?.max}
                                className='w-full'
                                labelStyle=''
                                placeholder='Maximum'
                                testId='maxChar'
                                htmlFor='max'
                                maxLength={10}
                                handleChange={(e) => handleInputChange(e)} />
                        </div>
                    </div>
                    <div className='mt-7'>
                        <p className='font-semibold text-base text-[#2B333B]'>Draw on Image</p>
                        <div className='mt-2.5'>
                            <div className="relative custom-radioBlue flex items-center" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='draw_image'
                                    id='draw_image_yes'
                                    value='draw_image_yes'
                                    checked={fieldSettingParameters?.draw_image === 'yes'}
                                    onClick={() => {
                                        dispatch(setNewComponent({ id: 'draw_image', value: 'yes', questionId: selectedQuestionId }));
                                        setShouldAutoSave(true);
                                    }}
                                />
                                <label htmlFor='draw_image_yes'
                                    data-testid='draw-yes'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Yes
                                </label>
                            </div>
                            <div className="relative custom-radioBlue flex items-center mt-2.5" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='draw_image'
                                    id='draw_image_no'
                                    value='draw_image_no'
                                    checked={fieldSettingParameters?.draw_image === 'no'}
                                    onClick={() => {
                                        dispatch(setNewComponent({ id: 'draw_image', value: 'no', questionId: selectedQuestionId }));
                                        setShouldAutoSave(true);
                                    }}
                                />
                                <label htmlFor='draw_image_no'
                                    data-testid='draw-no'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    No
                                </label>
                            </div>
                        </div>
                        <div className='mt-7'>
                            <p className='font-semibold text-base text-[#2B333B]'>Include Metadata</p>
                            <div className="relative custom-radioBlue flex items-center mt-2.5" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='include_metadata'
                                    id='include_metadata_yes'
                                    value='include_metadata_yes'
                                    checked={fieldSettingParameters?.include_metadata === 'yes'}
                                    onClick={() => {
                                        dispatch(setNewComponent({ id: 'include_metadata', value: 'yes', questionId: selectedQuestionId }));
                                        setShouldAutoSave(true);
                                    }} />
                                <label htmlFor='include_metadata_yes'
                                    data-testid='metadata-yes'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Yes
                                </label>
                            </div>
                            <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='include_metadata'
                                    id='include_metadata_no'
                                    value='include_metadata_no'
                                    checked={fieldSettingParameters?.include_metadata === 'no'}
                                    onClick={() => {
                                        dispatch(setNewComponent({ id: 'include_metadata', value: 'no', questionId: selectedQuestionId }));
                                        setShouldAutoSave(true);
                                    }}
                                />
                                <label htmlFor='include_metadata_no'
                                    data-testid='metadata-no'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    No
                                </label>
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
                                handleChange={handleInputChange}
                                handleBlur={handleBlur}
                            />
                        </div>
                        <div className='mx-auto mt-7 flex items-center w-full'>
                            <button type='button' className='w-[80%] mx-auto py-[13px] bg-[#2B333B] hover:bg-black rounded font-semibold text-[#FFFFFF] text-base px-[52px]'>
                                Add Conditional Logic
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PhotoFieldSetting