import React from 'react'
import { useDispatch } from 'react-redux';
import OptionsComponent from '../../TextBox/TextFieldSetting/OptionalComponent/OptionalComponent';
import CommonComponents from '../../../CommonComponents/CommonComponents';
import { setNewComponent } from '../../fieldSettingParamsSlice';
import InputField from '../../../../../../Components/InputField/InputField';

function TagScanFieldSetting({
    handleInputChange,
    formParameters,
    handleBlur,
    fieldSettingParameters,
    handleRadiobtn,
    selectedQuestionId,
    validationErrors,
    setConditionalLogic,
    setIsDefaultLogic,
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
                        <p className='font-semibold text-base text-[#2B333B]'>Type</p>
                        <div className='mt-2.5'>
                            <div className="relative custom-radioBlue flex items-center" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    id='NFC'
                                    value='NFC'
                                    disabled={formStatus !== 'Draft'}
                                    checked={fieldSettingParameters?.type === 'NFC'}
                                    onClick={() => {
                                        handleRadiobtn('NFC');
                                        dispatch(setNewComponent({ id: 'type', value: 'NFC', questionId: selectedQuestionId }));
                                    }} />
                                <label htmlFor='NFC'
                                    data-testid='NFC'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    NFC
                                </label>
                            </div>
                            <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    id='RFiD'
                                    value='RFiD'
                                    disabled={formStatus !== 'Draft'}
                                    checked={fieldSettingParameters?.type === 'RFiD'}
                                    onClick={() => handleRadiobtn('RFiD')} />
                                <label htmlFor='RFiD'
                                    data-testid='RFiD'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    RFiD
                                </label>
                            </div>
                            <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    id='QR'
                                    disabled={formStatus !== 'Draft'}
                                    value='QR'
                                    checked={fieldSettingParameters?.type === 'QR'}
                                    onClick={() => handleRadiobtn('QR')} />
                                <label htmlFor='QR'
                                    data-testid='QR'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    QR
                                </label>
                            </div>
                            <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    id='Barcode'
                                    value='Barcode'
                                    disabled={formStatus !== 'Draft'}
                                    checked={fieldSettingParameters?.type === 'Barcode'}
                                    onClick={() => handleRadiobtn('Barcode')} />
                                <label htmlFor='Barcode'
                                    data-testid='Barcode'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Barcode
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='mt-7'>
                        <p className='font-semibold text-base text-[#2B333B]'>Source</p>
                        <div className='mt-2.5'>
                            <div className="relative custom-radioBlue flex items-center" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='source'
                                    id='uid'
                                    value='uid'
                                    disabled={formStatus !== 'Draft'}
                                    checked={fieldSettingParameters?.source === 'uid'}
                                    onClick={() => {
                                        dispatch(setNewComponent({ id: 'source', value: 'uid', questionId: selectedQuestionId }));
                                        dispatch(setShouldAutoSave(true));
                                    }}
                                />
                                <label htmlFor='uid'
                                    data-testid='uid'
                                    className={`ml-7 font-normal text-base cursor-pointer text-[#2B333B]'}`}>
                                    UID (0-F, 14 digits)
                                </label>
                            </div>
                            <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='source'
                                    id='Payload'
                                    value='Payload'
                                    disabled={formStatus !== 'Draft'}
                                    checked={fieldSettingParameters?.source === 'Payload'}
                                    onClick={() => {
                                        dispatch(setNewComponent({ id: 'source', value: 'Payload', questionId: selectedQuestionId }));
                                        dispatch(setShouldAutoSave(true));
                                    }} />
                                <label htmlFor='Payload'
                                    data-testid='Payload'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Payload
                                </label>
                            </div>
                            <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='source'
                                    id='both'
                                    value='both'
                                    disabled={fieldSettingParameters?.type === 'rating' || formStatus !== 'Draft'}
                                    checked={fieldSettingParameters?.source === 'both'}
                                    onClick={() => {
                                        dispatch(setNewComponent({ id: 'source', value: 'both', questionId: selectedQuestionId }));
                                        dispatch(setShouldAutoSave(true));
                                    }}
                                />
                                <label htmlFor='both'
                                    data-testid='both'
                                    className={`ml-7 font-normal text-base ${fieldSettingParameters?.type === 'rating' ? 'text-[#DDDDDD] cursor-not-allowed' : 'text-[#2B333B] cursor-pointer'}`}>
                                    Both
                                </label>
                            </div>
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
                            maxLength={500}
                            handleChange={handleInputChange}
                            handleBlur={handleBlur}
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
        </>

    )
}

export default TagScanFieldSetting