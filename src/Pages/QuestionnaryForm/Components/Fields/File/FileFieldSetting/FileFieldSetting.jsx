import React from 'react'
import { useDispatch } from 'react-redux';
import CommonComponents from '../../../CommonComponents/CommonComponents';
import InputField from '../../../../../../Components/InputField/InputField';
import OptionsComponent from '../../TextBox/TextFieldSetting/OptionalComponent/OptionalComponent';
import ErrorMessage from '../../../../../../Components/ErrorMessage/ErrorMessage';


function FileFieldSetting({ handleInputChange,
    formParameters,
    handleBlur,
    handleRadiobtn,
    fieldSettingParameters,
    selectedQuestionId,
    validationErrors,
    setConditionalLogic,
    formStatus
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
                        <InputField
                            autoComplete='off'
                            label='File Size'
                            optional='(System Max 10MB. Use whole number)'
                            id='fileSize'
                            type='text'
                            value={fieldSettingParameters?.fileSize}
                            className='w-full mt-2.5'
                            labelStyle=''
                            placeholder='e.g. 5'
                            testId='file-size'
                            formStatus={formStatus}
                            htmlFor='fileSize'
                            maxLength={10}
                            handleChange={(e) => handleInputChange(e)} />
                    </div>
                    <div className='mt-7'>
                        <InputField
                            autoComplete='off'
                            label='File Type'
                            optional='(Enter comma separated list, don’t include the.)'
                            id='fileType'
                            type='text'
                            value={fieldSettingParameters?.fileType}
                            className='w-full mt-2.5'
                            formStatus={formStatus}
                            labelStyle=''
                            placeholder='File type by extension (e.g., pdf, doc, docx)'
                            testId='file-type'
                            htmlFor='fileType'
                            handleChange={(e) => handleInputChange(e)} />
                    </div>
                    <div className='mt-7'>
                        <p className='font-semibold text-base text-[#2B333B]'>Number of Files</p>
                        <div className='flex items-center mt-3'>
                            <InputField
                                autoComplete='off'
                                label=''
                                id='min'
                                type='text'
                                value={fieldSettingParameters?.min}
                                className='w-full'
                                labelStyle=''
                                formStatus={formStatus}
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
                                formStatus={formStatus}
                                placeholder='Maximum'
                                testId='maxChar'
                                htmlFor='max'
                                maxLength={10}
                                handleChange={(e) => handleInputChange(e)} />
                        </div>
                        {validationErrors?.minMax && (
                            <ErrorMessage error={validationErrors.minMax} />
                        )}
                    </div>
                    <OptionsComponent selectedQuestionId={selectedQuestionId} formStatus={formStatus} />
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
                            formStatus={formStatus}
                            maxLength={500}
                            handleChange={handleInputChange}
                            handleBlur={handleBlur}
                        />
                    </div>
                    <div className='mx-auto mt-7 flex flex-col items-center w-full'>
                        <button
                            type='button'
                            disabled={formStatus !== 'Draft'}
                            data-testid="add-conditional-logic"
                            className={`w-[80%] mx-auto py-[13px] ${formStatus === 'Draft' ? '' : 'cursor-not-allowed'} bg-black rounded font-semibold text-[#FFFFFF] text-base px-[52px]`}
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

export default FileFieldSetting