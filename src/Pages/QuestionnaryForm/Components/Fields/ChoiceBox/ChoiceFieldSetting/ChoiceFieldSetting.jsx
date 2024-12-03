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
import FixedChoiceDraggable from './FixedChoiceDraggable';
import ErrorMessage from '../../../../../../Components/ErrorMessage/ErrorMessage';
import { setShouldAutoSave } from '../../../QuestionnaryFormSlice';

function ChoiceFieldSetting({
    handleInputChange,
    formParameters,
    handleRadiobtn,
    fieldSettingParameters,
    selectedQuestionId,
    handleBlur,
    setConditionalLogic,
    isDefaultLogic,
    setIsDefaultLogic,
    defaultString,
    formStatus
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
    // const fixedChoiceArray = useSelector(state => state.fieldSettingParams.currentData[selectedQuestionId]?.source_value || []);
    const fixedChoiceArray = useSelector(state => state.fieldSettingParams.currentData[selectedQuestionId]?.fixedChoiceArray || []);
    const handleLookupOption = (option) => {
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

    if (isDefaultLogic) {
        defaultString = defaultString.replaceAll(':', 'else')
            .replaceAll('?', 'then')
            .replaceAll('', 'if');
        // Return null as JSX expects a valid return inside {}
    }
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
                    formStatus={formStatus}
                    fieldSettingParameters={fieldSettingParameters}
                    assetLocation={true}
                    />

                {/* <div className='flex flex-col justify-start mt-7 w-full relative'>
                    <label htmlFor="Label" className='font-semibold text-base text-[#2B333B]'>Default Content</label>
                    <div className='relative w-full'>
                        <input
                            type="text"
                            id='Label'
                            data-testid="default-value-input"
                            disabled={formStatus !== 'Draft'}
                            className='mt-[11px] w-full border border-[#AEB3B7] rounded py-[11px] pl-4 pr-11 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                            value={fieldSettingParameters?.default_conditional_logic ? defaultContentConverter(fieldSettingParameters?.default_conditional_logic) : ''} // Prefill the input with `defaultString` if it exists, otherwise empty string
                            onChange={formStatus === 'Draft' ?(e) => dispatch(setNewComponent({ id: 'default_conditional_logic', value: e.target.value, questionId: selectedQuestionId }))
                        : null} 
                            // Update defaultString when input changes
                            placeholder='Populates the content'
                        />
                        <img
                            src="/Images/setting.svg"
                            alt="setting"
                            data-testid="default-value"
                            className={`absolute top-5 right-3 ${formStatus === 'Draft' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            onClick={formStatus === 'Draft' ?() => {
                                setIsDefaultLogic(true);
                                setConditionalLogic(false);
                            }:null}
                        />
                    </div>
                </div> */}
                <div className='mt-7'>
                    <p className='font-semibold text-base text-[#2B333B]'>Type</p>
                    <div className='mt-2.5'>
                        <div className="relative custom-radioBlue flex items-center" data-testid='yes'>
                            <input
                                type='radio'
                                className='w-[17px] h-[17px]'
                                name='type'
                                id='Singleline'
                                disabled={formStatus !== 'Draft'}
                                value='Singleline'
                                checked={fieldSettingParameters?.type === 'dropdown'}
                                onClick={formStatus === 'Draft' ?() => handleRadiobtn('dropdown'):null} />
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
                                disabled={formStatus !== 'Draft'}
                                value='SingleChoice'
                                checked={fieldSettingParameters?.type === 'single_choice'}
                                onClick={formStatus === 'Draft' ?() => handleRadiobtn('single_choice'):null}
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
                                disabled={formStatus !== 'Draft'}
                                value='MultiChoice'
                                checked={fieldSettingParameters?.type === 'multi_choice'}
                                onClick={formStatus === 'Draft' ?() => handleRadiobtn('multi_choice'):null} />
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
                                disabled={formStatus !== 'Draft'}
                                value='FixedList'
                                checked={fieldSettingParameters?.source === 'fixedList'}
                                onClick={formStatus === 'Draft' ?() => {
                                    dispatch(setNewComponent({ id: 'source', value: 'fixedList', questionId: selectedQuestionId }))
                                    dispatch(resetFixedChoice({ questionId: selectedQuestionId }))
                                    dispatch(setShouldAutoSave(true));
                                }:null} />  {/* handleSource('fixedList') */}
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
                                    formStatus: formStatus,
                                    selectedQuestionId: selectedQuestionId
                                }))}
                                onMoveEnd={handleMoveEnd}
                                container={formStatus === 'Draft' ?() => document.body : null}
                            />}
                        <div className="relative custom-radioBlue flex items-center mt-3">
                            <input
                                type='radio'
                                className='w-[17px] h-[17px]'
                                name='source'
                                id='Lookup'
                                value='Lookup'
                                disabled={formStatus !== 'Draft'}
                                checked={fieldSettingParameters?.source === 'lookup'}
                                onClick={formStatus === 'Draft' ?() => {
                                    dispatch(setNewComponent({
                                        id: 'source', value: 'lookup', questionId: selectedQuestionId
                                    }))
                                    dispatch(setShouldAutoSave(true));
                                }:null} />  {/* handleSource('lookup') */}
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
                                        handleRemoveLookup={formStatus === 'Draft' ?handleRemoveLookup: null}
                                        isDropdownOpen={formStatus === 'Draft' ?isLookupOpen:false}
                                        setDropdownOpen={formStatus === 'Draft' ?setIsLookupOpen:null}
                                        handleOptionClick={formStatus === 'Draft' ?handleLookupOption:null}
                                        top='20px'
                                        close='true'
                                        options={optionData}
                                        lastElementRef={lastElementRef}
                                        formStatus={formStatus}
                                    />
                                </div>
                                <button onClick={formStatus === 'Draft' ?() => navigate('/lookup-dataset', { state: { create: true } }):null} className={`${formStatus === 'Draft' ? 'cursor-pointer':'cursor-not-allowed'} ml-4`}>
                                    <img src="/Images/plus.svg" alt="plus" />
                                </button>
                            </div>}
                        {fieldSettingParameters?.source === 'lookup' && optionData.length === 0 && (
                            <ErrorMessage error={'No lookup list available. Please create one'} />
                        )}
                        {/* OptionsComponent added here */}
                        <OptionsComponent selectedQuestionId={selectedQuestionId} fieldSettingParameters={fieldSettingParameters} formStatus={formStatus}/>
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
                                maxLength={formStatus === 'Draft' ?500:0}
                                handleChange={formStatus === 'Draft' ?(e) => handleInputChange(e):null}
                                handleBlur={handleBlur}
                                formStatus={formStatus}
                            />
                        </div>
                        <div className='mx-auto mt-7 flex flex-col items-center w-full'>
                            <button
                                type='button'
                                data-testId="add-conditional-logic"
                                className={`w-[80%] mx-auto py-[13px] ${formStatus === 'Draft' ? '' : 'cursor-not-allowed'} bg-black rounded font-semibold text-[#FFFFFF] text-base px-[52px]`}
                                onClick={formStatus === 'Draft' ?() => {
                                    setConditionalLogic(true),
                                        setIsDefaultLogic(false)
                                }
                                :null}  // Use arrow function
                            >
                                Add Conditional Logic
                            </button>
                            {fieldSettingParameters?.conditional_logic &&
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