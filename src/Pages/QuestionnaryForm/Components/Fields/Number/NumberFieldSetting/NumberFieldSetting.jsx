import React, { useState } from 'react'
import CommonComponents from '../../../CommonComponents/CommonComponents';
import InputField from '../../../../../../Components/InputField/InputField';
import OptionsComponent from '../../TextBox/TextFieldSetting/OptionalComponent/OptionalComponent';
import { useDispatch } from 'react-redux';
import { setNewComponent } from '../../fieldSettingParamsSlice';

function NumberFieldSetting({
    handleInputChange,
    formParameters,
    handleBlur,
    fieldSettingParameters,
    handleRadiobtn,
    setShouldAutoSave,
    selectedQuestionId,
    handleAutoSaveSettings,

}) {
    const [activeTab, setActiveTab] = useState('postField'); // default is 'preField'
    const dispatch = useDispatch();

    // Handlers to switch tabs
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

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
                    />
                    <div className='flex flex-col justify-start mt-7 w-full relative'>
                        <label htmlFor="Label" className='font-semibold text-base text-[#2B333B]'>Default Content</label>
                        <div className='relative w-full'>
                            <input type="text" id='Label' className='mt-[11px] w-full border border-[#AEB3B7] rounded py-[11px] pl-4 pr-11 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                                placeholder='Populates the content' />
                            <img src="/Images/setting.svg" alt="setting" className='absolute top-5 right-3 cursor-pointer' />
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
                                    checked={fieldSettingParameters?.source === 'entryfield'}
                                    onClick={() => {
                                        dispatch(setNewComponent({ id: 'source', value: 'entryfield', questionId: selectedQuestionId }));
                                        setShouldAutoSave(true);
                                    }}
                                />
                                <label htmlFor='entryfield'
                                    data-testid='entryfield'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
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
                                    checked={fieldSettingParameters?.source === 'slider'}
                                    onClick={() => {
                                        dispatch(setNewComponent({ id: 'source', value: 'slider', questionId: selectedQuestionId }));
                                        setShouldAutoSave(true);
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
                                    checked={fieldSettingParameters?.source === 'both'}
                                    onClick={() => {
                                        dispatch(setNewComponent({ id: 'source', value: 'both', questionId: selectedQuestionId }));
                                        setShouldAutoSave(true);
                                    }} />
                                <label htmlFor='both'
                                    data-testid='both'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Both
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='mt-7'>
                        <p className='font-semibold text-base text-[#2B333B]'>Range</p>
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
                        <InputField
                            autoComplete='off'
                            label='Increment By'
                            id='incrementby'
                            type='text'
                            value={fieldSettingParameters?.incrementby}
                            className='w-full mt-2.5'
                            labelStyle=''
                            placeholder='Increment By'
                            testId='incrementby'
                            htmlFor='incrementby'
                            maxLength={10}
                            handleChange={(e) => handleInputChange(e)} />
                    </div>
                    <div className='mt-7'>
                        <div className='flex justify-between'>
                            <p
                                className={`font-semibold text-base cursor-pointer ${activeTab === 'preField' ? 'text-black border-b-2 border-[#000000] pb-2' : 'text-[#9FACB9]'
                                    }`}
                                onClick={() => handleTabClick('preField')}
                            >
                                Pre-field Text
                            </p>
                            <p
                                className={`font-semibold text-base cursor-pointer ${activeTab === 'postField' ? 'text-black border-b-2 border-[#000000] pb-2' : 'text-[#9FACB9]'
                                    }`}
                                onClick={() => handleTabClick('postField')}
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
                                    value={fieldSettingParameters?.preField}
                                    className='w-full'
                                    labelStyle='font-semibold text-base text-[#2B333B]'
                                    placeholder='Pre-field text'
                                    testId='preField'
                                    htmlFor='preField'
                                    maxLength={500}
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
                                    value={fieldSettingParameters?.postField}
                                    className='w-full'
                                    labelStyle='font-semibold text-base text-[#2B333B]'
                                    placeholder='Post-field text'
                                    testId='postField'
                                    htmlFor='postField'
                                    maxLength={500}
                                    handleChange={(e) => handleInputChange(e)} // Ensure 'onChange' is used instead of 'handleChange'
                                />
                            </div>
                        )}
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
        </>

    )
}

export default NumberFieldSetting