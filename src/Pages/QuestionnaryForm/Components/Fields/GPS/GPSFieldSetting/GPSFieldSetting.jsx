import React from 'react'
import CommonComponents from '../../../CommonComponents/CommonComponents'
import InputField from '../../../../../../Components/InputField/InputField'
import OptionsComponent from '../../TextBox/TextFieldSetting/OptionalComponent/OptionalComponent'


function GPSFieldSetting({
    handleInputChange,
    formParameters,
    handleBlur,
    fieldSettingParameters,
    validationErrors,
    selectedQuestionId,
    setConditionalLogic,
    formStatus,
    setEditorCheck,
}) {
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
                        formStatus={formStatus}
                        validationErrors={validationErrors}
                        selectedQuestionId={selectedQuestionId}
                    />
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
                            htmlFor='admin_field_notes'
                            formStatus={formStatus}
                            maxLength={500}
                            handleChange={(e) => handleInputChange(e)} />
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
                                        setEditorCheck((prev) => {
                                            return {
                                                ...prev,
                                                conditonalEditor: prev.conditonalEditor.filter(
                                                    (item) => item.questionId !== selectedQuestionId
                                                ),
                                            };
                                        });
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
        </>
    )
}

export default GPSFieldSetting