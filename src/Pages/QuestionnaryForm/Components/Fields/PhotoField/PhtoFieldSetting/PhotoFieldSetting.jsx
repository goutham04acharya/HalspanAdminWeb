import React from 'react'
import { useDispatch } from 'react-redux';
import CommonComponents from '../../../CommonComponents/CommonComponents';
import { setNewComponent } from '../../fieldSettingParamsSlice';
import OptionsComponent from '../../TextBox/TextFieldSetting/OptionalComponent/OptionalComponent';
import InputField from '../../../../../../Components/InputField/InputField';
import ErrorMessage from '../../../../../../Components/ErrorMessage/ErrorMessage';
import { setShouldAutoSave } from '../../../QuestionnaryFormSlice';


function PhotoFieldSetting({
    handleInputChange,
    formParameters,
    handleBlur,
    handleRadiobtn,
    fieldSettingParameters,
    selectedQuestionId,
    validationErrors,
    setConditionalLogic,
    formStatus
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
                        formStatus={formStatus}
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
                                formStatus={formStatus}
                                testId='minChar'
                                htmlFor='min'
                                maxLength={formStatus === 'Draft' ? 10 : 0}
                                handleChange={formStatus === 'Draft' ? (e) => handleInputChange(e) : null} />
                            <p className='mx-3 font-normal text-base text-[#2B333B]'> to</p>
                            <InputField
                                autoComplete='off'
                                label=''
                                id='max'
                                type='text'
                                value={fieldSettingParameters?.max}
                                className='w-full'
                                labelStyle=''
                                formStatus={formStatus}
                                placeholder='Maximum'
                                testId='maxChar'
                                htmlFor='max'
                                maxLength={formStatus === 'Draft' ? 10 : 0}
                                handleChange={formStatus === 'Draft' ? (e) => handleInputChange(e) : null} />
                        </div>
                        {validationErrors?.minMax && (
                            <ErrorMessage error={validationErrors.minMax} />
                        )}
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
                                    disabled={formStatus !== 'Draft'}
                                    value='draw_image_yes'
                                    checked={fieldSettingParameters?.draw_image === 'yes'}
                                    onClick={formStatus === 'Draft' ? () => {
                                        dispatch(setNewComponent({ id: 'draw_image', value: 'yes', questionId: selectedQuestionId }));
                                        dispatch(setShouldAutoSave(true));
                                    } : null}
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
                                    disabled={formStatus !== 'Draft'}
                                    value='draw_image_no'
                                    checked={fieldSettingParameters?.draw_image === 'no'}
                                    onClick={formStatus === 'Draft' ? () => {
                                        dispatch(setNewComponent({ id: 'draw_image', value: 'no', questionId: selectedQuestionId }));
                                        dispatch(setShouldAutoSave(true));
                                    } : null}
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
                                    disabled={formStatus !== 'Draft'}
                                    checked={fieldSettingParameters?.include_metadata === 'yes'}
                                    onClick={formStatus === 'Draft' ? () => {
                                        dispatch(setNewComponent({ id: 'include_metadata', value: 'yes', questionId: selectedQuestionId }));
                                        dispatch(setShouldAutoSave(true));
                                    } : null} />
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
                                    disabled={formStatus !== 'Draft'}
                                    value='include_metadata_no'
                                    checked={fieldSettingParameters?.include_metadata === 'no'}
                                    onClick={formStatus === 'Draft' ? () => {
                                        dispatch(setNewComponent({ id: 'include_metadata', value: 'no', questionId: selectedQuestionId }));
                                        dispatch(setShouldAutoSave(true));
                                    } : null}
                                />
                                <label htmlFor='include_metadata_no'
                                    data-testid='metadata-no'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    No
                                </label>
                            </div>
                        </div>
                        <OptionsComponent selectedQuestionId={selectedQuestionId} formStatus={formStatus} />
                        <div className='mt-7'>
                            <InputField
                                autoComplete='off'
                                label='Admin Field Notes'
                                id='admin_field_notes'
                                type='text'
                                value={fieldSettingParameters?.admin_field_notes}
                                className='w-full mt-2.5'
                                labelStyle='font-semibold text-base text-[#2B333B]'
                                placeholder='Notes'
                                testId='Notes'
                                formStatus={formStatus}
                                htmlFor='admin_field_notes'
                                maxLength={formStatus === 'Draft' ? 500 : 0}
                                handleChange={formStatus === 'Draft' ? handleInputChange : null}
                                handleBlur={formStatus === 'Draft' ? handleBlur : null}
                            />
                        </div>
                        <div className='mx-auto mt-7 flex flex-col items-center w-full'>
                            <div className='flex items-center w-full'>
                                <button
                                    type='button'
                                    data-testid="add-conditional-logic"
                                    className={`mx-auto py-[13px] ${formStatus === 'Draft' ? '' : 'cursor-not-allowed'} bg-black rounded font-semibold text-[#FFFFFF] text-base ${fieldSettingParameters?.conditional_logic ? 'px-[40px] w-[50%] ' : 'px-[52px] w-[80%]'}`}
                                    onClick={formStatus === 'Draft' ? () => setConditionalLogic(true) : null}  // Use arrow function
                                >
                                    Add Conditional Logic
                                </button>
                                {fieldSettingParameters?.conditional_logic &&
                                    <button
                                        type='button'
                                        data-testid="remove-conditional-logic"
                                        className={`w-[50%] mx-auto py-[13px] ${formStatus === 'Draft' ? '' : 'cursor-not-allowed'} bg-white border border-[#000000] rounded font-semibold text-[#000000] text-base px-[40px] ml-5`}
                                        onClick={() => {
                                            dispatch(setNewComponent({ id: 'conditional_logic', value: '', questionId: selectedQuestionId }))
                                        }}
                                    >
                                        Remove Conditional Logic
                                    </button>
                                }
                            </div>
                            {fieldSettingParameters?.conditional_logic &&
                                <p className='text-center italic mt-1'>Conditional Logic Added</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PhotoFieldSetting