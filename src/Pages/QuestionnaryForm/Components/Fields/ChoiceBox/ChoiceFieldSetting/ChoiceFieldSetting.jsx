import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import CommonComponents from '../../../CommonComponents/CommonComponents'
import InputWithDropDown from '../../../../../../Components/InputField/InputWithDropDown'
import InputField from '../../../../../../Components/InputField/InputField';
import OptionsComponent from '../../TextBox/TextFieldSetting/OptionalComponent/OptionalComponent';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useApi from '../../../../../../services/CustomHook/useApi';
import InfinateDropdown from '../../../../../../Components/InputField/InfinateDropdown';
import objectToQueryString from '../../../../../../CommonMethods/ObjectToQueryString';
import { useDispatch, useSelector } from 'react-redux';
import { addNewFixedChoice, removeFixedChoice, resetFixedChoice, setFixedChoiceValue, setNewComponent, updateFixedChoiceArray } from '../../fieldSettingParamsSlice';
import DraggableList from 'react-draggable-list';
import getOrdinal from '../../../../../../CommonMethods/getOrdinal';
import FixedChoiceDraggable from './FixedChoiceDraggable';
import ErrorMessage from '../../../../../../Components/ErrorMessage/ErrorMessage';
import { setShouldAutoSave } from '../../../QuestionnaryFormSlice';

function ChoiceFieldSetting({
    handleInputChange,
    formParameters,
    handleRadiobtn,
    fieldSettingParameters,
    // setFieldSettingParameters,
    handleSaveSettings,
    selectedQuestionId,
    handleBlur,
    setConditionalLogic,
    setIsDefaultLogic,
    defaultString,
    setDefaultString
}) {

    const [isLookupOpen, setIsLookupOpen] = useState(false);
    const [optionData, setOptionData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const lastEvaluatedKeyRef = useRef(null);
    const observer = useRef();

    const navigate = useNavigate();
    const { getAPI } = useApi();
    const dispatch = useDispatch();

    // Use `useSelector` to get the `fixedChoiceArray` from the Redux store
    const fixedChoiceArray = useSelector(state => state.fieldSettingParams.currentData[selectedQuestionId]?.fixedChoiceArray || []);

    const handleLookupOption = (option) => {
        // setFieldSettingParameters((prevState) => ({
        //     ...prevState,
        //     lookupOption: option.value,
        // }));
        setIsLookupOpen(false);
        dispatch(setNewComponent({ id: 'lookupOption', value: option.value, questionId: selectedQuestionId }))
        dispatch(setNewComponent({ id: 'lookupOptionChoice', value: option.choices, questionId: selectedQuestionId }))
        dispatch(setShouldAutoSave(true));
    };

    const handleRemoveLookup = () => {
        dispatch(setNewComponent({ id: 'lookupOption', value: '', questionId: selectedQuestionId }));
        dispatch(setNewComponent({ id: 'lookupOptionChoice', value: [], questionId: selectedQuestionId }))
        dispatch(setShouldAutoSave(true));
    }

    // List Functions
    const fetchLookupList = useCallback(async () => {
        setLoading(true);
        const params = Object.fromEntries(searchParams);
        if (lastEvaluatedKeyRef.current) {
            params.start_key = encodeURIComponent(JSON.stringify(lastEvaluatedKeyRef.current));
        }
        try {
            const response = await getAPI(`lookup-data${objectToQueryString(params)}`);
            // Transform the items array
            const transformedArray = response.data.data.items.map(item => ({
                value: item.lookup_id,
                label: item.name,
                choices: item.choices
            }));
            setOptionData(prevState => [...prevState, ...transformedArray]);
            lastEvaluatedKeyRef.current = response?.data?.data?.last_evaluated_key || null;
        } catch (error) {
            console.error('Error fetching questionnaires:', error);
        }

        setLoading(false);
        setIsFetchingMore(false);
    }, [searchParams]);

    //funtion for infinate scrooling of dropdown
    const lastElementRef = useCallback(node => {
        if (loading || isFetchingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0]?.isIntersecting && lastEvaluatedKeyRef.current) {
                setIsFetchingMore(true);
                fetchLookupList();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, isFetchingMore, fieldSettingParameters?.type]);

    const handleAddRemoveFixedChoice = (event, id) => {
        if (event === 'add') {
            dispatch(addNewFixedChoice({ questionId: selectedQuestionId }))
        } else if (event === 'remove') {
            dispatch(removeFixedChoice({ id, questionId: selectedQuestionId }))
        }
        dispatch(setShouldAutoSave(true));
    };

    // Create a ref map to store input refs
    const inputRefs = useRef({});

    const handleMoveEnd = (newList) => {
        // Remove any non-serializable values before dispatching
        const sanitizedNewList = newList.map(item => {
            const { setShouldAutoSave, ...rest } = item;
            return rest;
        });
        dispatch(updateFixedChoiceArray({ questionId: selectedQuestionId, newList: sanitizedNewList }));
    };

    useEffect(() => {
        fetchLookupList();
    }, [fetchLookupList]);

    return (
        <><div data-testid="field-settings" className='py-[34px] px-[32px] h-customh10'>
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
                    placeholder='Placeholder content'
                    placeholderContent='Text displayed in the field'
                    handleInputChange={handleInputChange}
                    formParameters={formParameters}
                    handleBlur={handleBlur}
                />
                <div className='flex flex-col justify-start mt-7 w-full relative'>
                    <label htmlFor="Label" className='font-semibold text-base text-[#2B333B]'>Default Content</label>
                    <div className='relative w-full'>
                        <input
                            type="text"
                            id='Label'
                            data-testid="default-value-input"
                            className='mt-[11px] w-full border border-[#AEB3B7] rounded py-[11px] pl-4 pr-11 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                            value={defaultString || ''} // Prefill the input with `defaultString` if it exists, otherwise empty string
                            onChange={(e) => setDefaultString(e.target.value)} // Update defaultString when input changes
                            placeholder='Populates the content'
                        />
                        <img
                            src="/Images/setting.svg"
                            alt="setting"
                            data-testid="default-value"
                            className='absolute top-5 right-3 cursor-pointer'
                            onClick={() => {
                                setIsDefaultLogic(true);
                                setConditionalLogic(false);
                            }}
                        />
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
                                id='Singleline'
                                value='Singleline'
                                checked={fieldSettingParameters?.type === 'dropdown'}
                                onClick={() => handleRadiobtn('dropdown')} />
                            <label data-testid='dropdown' htmlFor='Singleline' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                Dropdown
                            </label>
                        </div>
                        <div className="relative custom-radioBlue flex items-center mt-3">
                            <input
                                type='radio'
                                className='w-[17px] h-[17px]'
                                name='type'
                                id='SingleChoice'
                                value='SingleChoice'
                                checked={fieldSettingParameters?.type === 'single_choice'}
                                onClick={() => handleRadiobtn('single_choice')}
                            />
                            <label data-testid='single_choice' htmlFor='SingleChoice' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                Single Choice
                            </label>
                        </div>
                        <div className="relative custom-radioBlue flex items-center mt-3">
                            <input
                                type='radio'
                                className='w-[17px] h-[17px]'
                                name='type'
                                id='MultiChoice'
                                value='MultiChoice'
                                checked={fieldSettingParameters?.type === 'multi_choice'}
                                onClick={() => handleRadiobtn('multi_choice')} />
                            <label data-testid='multi_choice' htmlFor='MultiChoice' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                Multi Choice
                            </label>
                        </div>

                        <p className='font-semibold text-base text-[#2B333B] mt-8'>Source</p>
                        <div className="relative custom-radioBlue flex items-center mt-3">
                            <input
                                type='radio'
                                className='w-[17px] h-[17px]'
                                name='source'
                                id='FixedList'
                                value='FixedList'
                                checked={fieldSettingParameters?.source === 'fixedList'}
                                onClick={() => {
                                    dispatch(setNewComponent({ id: 'source', value: 'fixedList', questionId: selectedQuestionId }))
                                    dispatch(resetFixedChoice({ questionId: selectedQuestionId }))
                                    dispatch(setShouldAutoSave(true));
                                }} />  {/* handleSource('fixedList') */}
                            <label htmlFor='FixedList' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                Fixed List
                            </label>
                        </div>
                        {fieldSettingParameters?.source === 'fixedList' &&
                            <DraggableList
                                itemKey="id" // Adjust itemKey according to your unique identifier
                                template={FixedChoiceDraggable}
                                list={fixedChoiceArray.map((data, choiceIndex) => ({
                                    ...data,
                                    index: choiceIndex,
                                    selectedQuestionId: selectedQuestionId
                                }))}
                                onMoveEnd={handleMoveEnd}
                                container={() => document.body}
                            />}
                        <div className="relative custom-radioBlue flex items-center mt-3">
                            <input
                                type='radio'
                                className='w-[17px] h-[17px]'
                                name='source'
                                id='Lookup'
                                value='Lookup'
                                checked={fieldSettingParameters?.source === 'lookup'}
                                onClick={() => {
                                    dispatch(setNewComponent({
                                        id: 'source', value: 'lookup', questionId: selectedQuestionId
                                    }))
                                    dispatch(setShouldAutoSave(true));
                                }} />  {/* handleSource('lookup') */}
                            <label htmlFor='Lookup' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                Lookup
                            </label>
                        </div>

                        {fieldSettingParameters?.source === 'lookup' &&
                            <div className='w-full flex items-center mt-3'>
                                <div className='w-[90%]'>
                                    <InfinateDropdown
                                        label=''
                                        id='lookup'
                                        placeholder='Select the lookup list'
                                        className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px]'
                                        testID='lookup-dropdown'
                                        labeltestID='lookup-list'
                                        selectedOption={optionData.find(option => option.value === fieldSettingParameters?.lookupOption)}
                                        handleRemoveLookup={handleRemoveLookup}
                                        isDropdownOpen={isLookupOpen}
                                        setDropdownOpen={setIsLookupOpen}
                                        handleOptionClick={handleLookupOption}
                                        top='20px'
                                        close='true'
                                        options={optionData}
                                        lastElementRef={lastElementRef}
                                    />
                                </div>
                                <button onClick={() => navigate('/lookup-dataset', { state: { create: true } })} className='ml-4'>
                                    <img src="/Images/plus.svg" alt="plus" />
                                </button>
                            </div>}
                        {fieldSettingParameters?.source === 'lookup' && optionData.length === 0 && (
                            <ErrorMessage error={'No lookup list available. Please create one'} />
                        )}
                        {/* OptionsComponent added here */}
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
                                handleChange={(e) => handleInputChange(e)}
                                handleBlur={handleBlur}
                            />
                        </div>
                        <div className='mx-auto mt-7 flex flex-col items-center w-full'>
                            <button
                                type='button'
                                data-testId="add-conditional-logic"
                                className='w-[80%] mx-auto py-[13px] bg-black rounded font-semibold text-[#FFFFFF] text-base px-[52px]'
                                onClick={() => {
                                    setConditionalLogic(true),
                                        setIsDefaultLogic(false)
                                }
                                }  // Use arrow function
                            >
                                Add Conditional Logic
                            </button>
                            {fieldSettingParameters.conditional_logic &&
                                <p className='text-center italic mt-1'>Conditional Logic Added</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ChoiceFieldSetting