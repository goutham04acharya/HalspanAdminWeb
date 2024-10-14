import React from 'react'
import CommonComponents from '../../../CommonComponents/CommonComponents'
import InputField from '../../../../../../Components/InputField/InputField'
import OptionsComponent from '../../TextBox/TextFieldSetting/OptionalComponent/OptionalComponent'


function GPSFieldSetting({
    handleInputChange,
    formParameters,
    handleBlur,
    fieldSettingParameters,
    selectedQuestionId,
    setConditionalLogic
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
                    />
                    <OptionsComponent selectedQuestionId={selectedQuestionId} />
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
                    <div className='mx-auto mt-7 flex flex-col items-center w-full'>
                        <button
                            type='button'
                            data-testid="add-conditional-logic"
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

export default GPSFieldSetting