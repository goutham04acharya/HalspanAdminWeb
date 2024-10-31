import React from 'react'
import CommonComponents from '../../../CommonComponents/CommonComponents';
import InputField from '../../../../../../Components/InputField/InputField';
import OptionsComponent from '../../TextBox/TextFieldSetting/OptionalComponent/OptionalComponent';
import { setNewComponent } from '../../fieldSettingParamsSlice';
import { useDispatch } from 'react-redux';
import { setShouldAutoSave } from '../../../QuestionnaryFormSlice';


function FloorPlanSettings({ handleInputChange,
    formParameters,
    handleBlur,
    handleRadiobtn,
    fieldSettingParameters,
    selectedQuestionId,
    setConditionalLogic

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
                        <p className='font-semibold text-base text-[#2B333B]'>Pin Drop</p>
                        <div className='mt-2.5'>
                            <div className="relative custom-radioBlue flex items-center" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='pin_drop'
                                    id='pin_drop_yes'
                                    value='pin_drop'
                                    checked={fieldSettingParameters?.pin_drop === 'yes'}
                                    onClick={() => {
                                        dispatch(setNewComponent({ id: 'pin_drop', value: 'yes', questionId: selectedQuestionId }));
                                        dispatch(setShouldAutoSave(true));
                                    }}
                                />
                                <label htmlFor='pin_drop_yes'
                                    data-testid='pindrop-yes'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Yes
                                </label>
                            </div>
                            <div className="relative custom-radioBlue flex items-center mt-2.5" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='pin_drop'
                                    id='pin_drop_no'
                                    value='pin_drop_no'
                                    checked={fieldSettingParameters?.pin_drop === 'no'}
                                    onClick={() => {
                                        dispatch(setNewComponent({ id: 'pin_drop', value: 'no', questionId: selectedQuestionId }));
                                        dispatch(setShouldAutoSave(true));
                                    }}
                                />
                                <label htmlFor='pin_drop_no'
                                    data-testid='pindrop-no'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='mt-7'>
                        <p className='font-semibold text-base text-[#2B333B]'>Draw on Image</p>
                        <div className="relative custom-radioBlue flex items-center mt-2.5" data-testid='yes'>
                            <input
                                type='radio'
                                className='w-[17px] h-[17px]'
                                name='draw_image'
                                id='draw_image_yes'
                                value='draw_image_yes'
                                checked={fieldSettingParameters?.draw_image === 'yes'}
                                onClick={() => {
                                    dispatch(setNewComponent({ id: 'draw_image', value: 'yes', questionId: selectedQuestionId }));
                                    dispatch(setShouldAutoSave(true));
                                }} />
                            <label htmlFor='draw_image_yes'
                                data-testid='draw-yes'
                                className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                Yes
                            </label>
                        </div>
                        <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                            <input
                                type='radio'
                                className='w-[17px] h-[17px]'
                                name='draw_image'
                                id='draw_image_no'
                                value='draw_image_no'
                                checked={fieldSettingParameters?.draw_image === 'no'}
                                onClick={() => {
                                    dispatch(setNewComponent({ id: 'draw_image', value: 'no', questionId: selectedQuestionId }));
                                    dispatch(setShouldAutoSave(true));
                                }}
                            />
                            <label htmlFor='draw_image_no'
                                data-testid='draw-no'
                                className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                No
                            </label>
                        </div>
                    </div>
                    <OptionsComponent selectedQuestionId={selectedQuestionId} fieldSettingParameters={fieldSettingParameters}/>
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
                    <div className='mx-auto mt-7 flex flex-col items-center w-full'>
                        <button
                            data-testid="add-conditional-logic"
                            type='button'
                            className='w-[80%] mx-auto py-[13px] bg-black rounded font-semibold text-[#FFFFFF] text-base px-[52px]'
                            onClick={() => setConditionalLogic(true)}  // Use arrow function
                        >
                            Add Conditional Logic
                        </button>
                        {fieldSettingParameters.conditional_logic &&
                            <p className='text-center italic mt-1'>Conditional Logic Added</p>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default FloorPlanSettings