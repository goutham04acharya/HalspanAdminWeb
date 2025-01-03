import React, { useEffect, useState } from 'react'
import CommonComponents from '../../../CommonComponents/CommonComponents';
import InputField from '../../../../../../Components/InputField/InputField';
import OptionsComponent from '../../TextBox/TextFieldSetting/OptionalComponent/OptionalComponent';
import { useDispatch } from 'react-redux';
import { setNewComponent } from '../../fieldSettingParamsSlice';
import ErrorMessage from '../../../../../../Components/ErrorMessage/ErrorMessage';
import { setShouldAutoSave } from '../../../QuestionnaryFormSlice';
import { defaultContentConverter } from '../../../../../../CommonMethods/defaultContentConverter';


function NumberFieldSetting({
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
    const [activeTab, setActiveTab] = useState('postField'); // default is 'preField'
    const dispatch = useDispatch();

    // Handlers to switch tabs
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        // Check if the type is 'rating', if so, set the source to 'slider'
        if (fieldSettingParameters?.type === 'rating' && fieldSettingParameters?.source !== 'slider') {
            dispatch(setNewComponent({ id: 'source', value: 'slider', questionId: selectedQuestionId }));
        }
    }, [fieldSettingParameters?.type, fieldSettingParameters?.source, dispatch, selectedQuestionId]);


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
                        formStatus={formStatus}
                    />
                    <div className='flex flex-col justify-start mt-7 w-full relative'>
                        <label htmlFor="Label" className='font-semibold text-base text-[#2B333B]'>Default Content</label>
                        <div className='flex items-center justify-between w-full'>
                            <div className='relative w-full'>
                                <input
                                type="text"
                                id='Label'
                                data-testid="default-value-input"
                                className='mt-[11px] w-full border border-[#AEB3B7] rounded py-[11px] pl-4 pr-11 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                                placeholder='Populates the content'
                                disabled={formStatus !== 'Draft'}
                                value={
                                    fieldSettingParameters?.default_conditional_logic
                                    ? defaultContentConverter(fieldSettingParameters?.default_conditional_logic)
                                    : ''
                                } // Prefill the input with `defaultString` if it exists, otherwise empty string
                                onChange={
                                    formStatus === 'Draft'
                                    ? (e) =>
                                        dispatch(
                                            setNewComponent({
                                            id: 'default_conditional_logic',
                                            value: e.target.value,
                                            questionId: selectedQuestionId,
                                            })
                                        )
                                    : null
                                }
                                />
                                <img
                                src="/Images/setting.svg"
                                alt="setting"
                                data-testid="default-value"
                                className={`absolute top-5 right-3 ${formStatus === 'Draft' ? 'cursor-pointer' : 'cursor-not-allowed'} `}
                                onClick={
                                    formStatus === 'Draft'
                                    ? () => {
                                        setIsDefaultLogic(true);
                                        setConditionalLogic(false);
                                        }
                                    : null
                                }
                                />
                            </div>

                            {/* Conditionally render the delete icon */}
                            {fieldSettingParameters?.default_conditional_logic && (
                                <img
                                src="/Images/trash-black.svg"
                                alt="delete"
                                data-testid="delete-default-value"
                                className='w-7 h-7 cursor-pointer ml-3 mt-2'
                                onClick={() => {
                                    dispatch(
                                    setNewComponent({
                                        id: 'default_conditional_logic',
                                        value: '',
                                        questionId: selectedQuestionId,
                                    })
                                    );
                                }}
                                />
                            )}
                            </div>
                    </div>
                    <div className='mt-7'>
                        <p className='font-semibold text-base text-[#2B333B]'>Type</p>
                        <div className='mt-2.5'>
                            <div className="relative custom-radioBlue flex items-center" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    disabled={formStatus !== 'Draft'}
                                    id='integer'
                                    value='integer'
                                    checked={fieldSettingParameters?.type === 'integer'}
                                    onClick={() => {
                                        handleRadiobtn('integer');
                                    }} />
                                <label htmlFor='integer'
                                    data-testid='integer'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Integer
                                </label>
                            </div>
                            <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    disabled={formStatus !== 'Draft'}
                                    id='float'
                                    value='float'
                                    checked={fieldSettingParameters?.type === 'float'}
                                    onClick={() => handleRadiobtn('float')} />
                                <label htmlFor='float'
                                    data-testid='float'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Float (Decimal)
                                </label>
                            </div>
                            <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    disabled={formStatus !== 'Draft'}
                                    id='rating'
                                    value='rating'
                                    checked={fieldSettingParameters?.type === 'rating'}
                                    onClick={() => handleRadiobtn('rating')} />
                                <label htmlFor='rating'
                                    data-testid='rating'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Rating
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
                                    id='entryfield'
                                    value='entryfield'
                                    disabled={fieldSettingParameters?.type === 'rating' || formStatus !== 'Draft'}
                                    checked={fieldSettingParameters?.source === 'entryfield'}
                                    onClick={() => {
                                        if (fieldSettingParameters?.type !== 'rating') {
                                            dispatch(setNewComponent({ id: 'source', value: 'entryfield', questionId: selectedQuestionId }));
                                            dispatch(setShouldAutoSave(true));
                                        }
                                    }}
                                />
                                <label htmlFor='entryfield'
                                    data-testid='entryfield'
                                    className={`ml-7 font-normal text-base ${fieldSettingParameters?.type === 'rating' ? 'text-[#DDDDDD] cursor-not-allowed' : 'cursor-pointer text-[#2B333B]'}`}>
                                    Entry Field
                                </label>
                            </div>
                            <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='source'
                                    id='slider'
                                    value='slider'
                                    disabled={formStatus !== 'Draft'}
                                    checked={fieldSettingParameters?.source === 'slider'}
                                    onClick={() => {
                                        dispatch(setNewComponent({ id: 'source', value: 'slider', questionId: selectedQuestionId }));
                                        dispatch(setShouldAutoSave(true));
                                    }} />
                                <label htmlFor='slider'
                                    data-testid='slider'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Slider
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
                                        if (fieldSettingParameters?.type !== 'rating') {
                                            dispatch(setNewComponent({ id: 'source', value: 'both', questionId: selectedQuestionId }));
                                            dispatch(setShouldAutoSave(true));
                                        }
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
                    <div className='mt-7'>
                        <p className='font-semibold text-base text-[#2B333B]'>Range</p>
                        <div className='flex items-center mt-3 w-full'>
                            <InputField
                                autoComplete='off'
                                label=''
                                id='min'
                                type='text'
                                value={fieldSettingParameters?.min || ''}
                                className='w-full'
                                labelStyle=''
                                placeholder='Minimum'
                                testId='minChar'
                                formStatus={formStatus}
                                htmlFor='min'
                                maxLength={10}
                                handleChange={(e) => handleInputChange(e)} />
                            <p className='mx-3 font-normal text-base text-[#2B333B]'> to</p>
                            {console.log(fieldSettingParameters?.max, 'max')}
                            <InputField
                                autoComplete='off'
                                label=''
                                id='max'
                                type='text'
                                formStatus={formStatus}
                                value={fieldSettingParameters?.max || ''}
                                className='w-full'
                                labelStyle=''
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
                    {(fieldSettingParameters?.source === 'slider' || fieldSettingParameters?.source === 'both' || fieldSettingParameters?.type === 'rating') &&
                        <div className='mt-7'>
                            <InputField
                                autoComplete='off'
                                label='Increment By'
                                id='incrementby'
                                type='text'
                                formStatus={formStatus}
                                value={fieldSettingParameters?.incrementby || ''}
                                className='w-full mt-2.5'
                                labelStyle=''
                                placeholder='Increment By'
                                testId='increment'
                                htmlFor='incrementby'
                                maxLength={10}
                                handleChange={(e) => handleInputChange(e)} />
                        </div>
                    }
                    {validationErrors?.incrementby && (
                        <ErrorMessage error={validationErrors.incrementby} />
                    )}
                    <div className='mt-7'>
                        <div className='flex justify-between'>
                            <p
                                data-testid="pre-field-option" className={`font-semibold text-base ${formStatus === 'Draft' ? 'cursor-pointer' : 'cursor-not-allowed'} ${activeTab === 'preField' ? 'text-black border-b-2 border-[#000000] pb-2' : 'text-[#9FACB9]'
                                    }`}
                                onClick={formStatus === 'Draft' ? () => handleTabClick('preField') : null}
                                disabled={formStatus !== 'Draft'}
                            >
                                Pre-field Text
                            </p>
                            <p
                                data-testid="post-field-option" className={`font-semibold text-base ${formStatus === 'Draft' ? 'cursor-pointer' : 'cursor-not-allowed'} ${activeTab === 'postField' ? 'text-black border-b-2 border-[#000000] pb-2' : 'text-[#9FACB9]'
                                    }`}
                                onClick={formStatus === 'Draft' ? () => handleTabClick('postField') : null}
                                disabled={formStatus !== 'Draft'}
                            >
                                Post-field Text
                            </p>
                        </div>
                        {/* Display the Pre-field input if preField is active */}
                        {activeTab === 'preField' && (
                            <div className='mt-3'>
                                <InputField
                                    autoComplete='off'
                                    id='preField'
                                    type='preField'
                                    value={fieldSettingParameters?.preField || ''}
                                    className='w-full'
                                    labelStyle='font-semibold text-base text-[#2B333B]'
                                    placeholder='Pre-field text'
                                    testId='field-text'
                                    htmlFor='preField'
                                    formStatus={formStatus}
                                    maxLength={50}
                                    handleChange={(e) => handleInputChange(e)} // Ensure 'onChange' is used instead of 'handleChange'
                                />
                            </div>
                        )}
                        {/* Display the Post-field input if postField is active */}
                        {activeTab === 'postField' && (
                            <div className='mt-3'>
                                <InputField
                                    autoComplete='off'
                                    id='postField'
                                    type='postField'
                                    value={fieldSettingParameters?.postField || ''}
                                    className='w-full'
                                    formStatus={formStatus}
                                    labelStyle='font-semibold text-base text-[#2B333B]'
                                    placeholder='Post-field text'
                                    testId='field-text'
                                    htmlFor='postField'
                                    maxLength={50}
                                    handleChange={(e) => handleInputChange(e)} // Ensure 'onChange' is used instead of 'handleChange'
                                />
                            </div>
                        )}
                    </div>
                    <OptionsComponent selectedQuestionId={selectedQuestionId} fieldSettingParameters={fieldSettingParameters} formStatus={formStatus} />
                    <div className='mt-7'>
                        <InputField
                            autoComplete='off'
                            label='Admin Field Notes'
                            id='admin_field_notes'
                            type='text'
                            formStatus={formStatus}
                            value={fieldSettingParameters?.admin_field_notes || ''}
                            className='w-full mt-2.5'
                            labelStyle='font-semibold text-base text-[#2B333B]'
                            placeholder='Notes'
                            testId='Notes'
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

export default NumberFieldSetting