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

function ChoiceFieldSetting({
    handleInputChange,
    formParameters,
    handleRadiobtn,
    fieldSettingParameters,
    setFieldSettingParameters,
    handleSaveSettings,
    selectedQuestionDetails
}) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isLookupOpen, setIsLookupOpen] = useState(false);
    const [selectedLookup, setSelectedLookup] = useState(null);
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
    const fixedChoiceArray = useSelector(state => state.fieldSettingParams[selectedQuestionDetails.question_id]?.fixedChoiceArray || []);

    const handleLookupOption = (option) => {
        setFieldSettingParameters((prevState) => ({
            ...prevState,
            lookupOption: option.value,
        }));
        setIsLookupOpen(false);
        dispatch(setNewComponent({ id: 'lookupOption', value: option.value, questionId: selectedQuestionDetails?.question_id }))
        dispatch(setNewComponent({ id: 'lookupOptionChoice', value: option.choices, questionId: selectedQuestionDetails?.question_id }))
    };

    const handleRemoveOption = () => {
        setFieldSettingParameters((prevState) => ({
            ...prevState,
            lookupOption: '',
        }));
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
            dispatch(addNewFixedChoice({ questionId: selectedQuestionDetails?.question_id }))
        } else if (event === 'remove') {
            dispatch(removeFixedChoice({ id, questionId: selectedQuestionDetails?.question_id }))
        }
    };

    // Create a ref map to store input refs
    const inputRefs = useRef({});

    // Function to handle focusing an input
    const focusInput = (id) => {
        console.log('first')
        if (inputRefs.current[id]) {
            console.log('first.................')
            inputRefs.current[id].focus();
        }
    };

    // Function for dragging Choices
    const Item = React.memo(forwardRef(({ item, dragHandleProps, focusInput }, ref) => {
        const dispatch = useDispatch();
        const [localValue, setLocalValue] = useState(item.value || '');
    
        // Handle input change
        const handleFixedChoiceChange = useCallback((e) => {
            const { value } = e.target;
            setLocalValue(value);
            dispatch(setFixedChoiceValue({ id: item.id, value, questionId: selectedQuestionDetails?.question_id }));
        }, [dispatch, item.id, selectedQuestionDetails?.question_id]);
    
        // Focus input when required
        useEffect(() => {
            console.log('second')
            console.log(ref)
            console.log(focusInput, 'focusInput')
            console.log(item.id === focusInput, 'yes')
            if (item.id === focusInput && ref.current) {
                console.log('second......')
                ref.current.focus();
            }
        }, [item.id, focusInput, ref, localValue]);
    
        return (
            <div className={`disable-select select-none w-full mt-7 rounded-[10px]`}>
                <div className='flex justify-between items-start cursor-pointer'>
                    <div className='flex items-center justify-center w-full'>
                        <div
                            className="disable-select dragHandle"
                            onMouseDown={(e) => {
                                document.body.style.overflow = "hidden";
                                dragHandleProps.onMouseDown(e);
                            }}
                            onMouseUp={() => {
                                document.body.style.overflow = "visible";
                            }}
                        >
                            <img className='cursor-grab' src={`/Images/drag.svg`} alt="Drag" />
                        </div>
                        <input
                            type="text"
                            ref={ref}
                            className='w-full border border-[#AEB3B7] rounded py-[11px] px-4 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                            placeholder={`${getOrdinal(item?.index + 1)} Choice`}
                            onChange={handleFixedChoiceChange}
                            value={localValue}
                            id='choice'
                            onClick={() => focusInput(item.id)} // Call focusInput on click
                        />
                        <img
                            src="/Images/trash-black.svg"
                            alt="delete"
                            className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#FFFFFF]'
                            onClick={() => handleAddRemoveFixedChoice('remove', item.id)}
                        />
                        <img
                            src="/Images/add.svg"
                            alt="add"
                            className='pl-2.5 cursor-pointer p-2 rounded-full hover:bg-[#FFFFFF]'
                            onClick={() => handleAddRemoveFixedChoice('add', item.id)}
                        />
                    </div>
                </div>
            </div>
        );
    }));

    const handleMoveEnd = (newList) => {
        dispatch(updateFixedChoiceArray({ questionId: selectedQuestionDetails.question_id, newList }));
    };

    useEffect(() => {
        fetchLookupList();
    }, [fetchLookupList]);

    return (
        <><div className='py-[34px] px-[32px] h-customh10'>
            <p className='font-semibold text-[#2B333B] text-[22px]'>Field settings</p>
            <div className='mt-[14px] h-customh9 overflow-auto default-sidebar'>
                <CommonComponents
                    labelID='label'
                    labelName='Label'
                    labelPlaceholder='Question 1'
                    helpTextId='Help Text'
                    helpText='Help Text'
                    helpTextPlaceholder='Enter Help Text'
                    placeholderContentId='placeholder'
                    placeholder='Placeholder Content'
                    placeholderContent='Text Displayed in the field'
                    handleInputChange={handleInputChange}
                    formParameters={formParameters} />
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
                                id='Singleline'
                                value='Singleline'
                                checked={fieldSettingParameters?.type === 'dropdown'}
                                onClick={() => handleRadiobtn('dropdown')} />
                            <label htmlFor='Singleline' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                Dropdown
                            </label>
                        </div>

                        <div className="relative custom-radioBlue flex items-center mt-3" data-testid='single-choice'>
                            <input
                                type='radio'
                                className='w-[17px] h-[17px]'
                                name='type'
                                id='SingleChoice'
                                value='SingleChoice'
                                checked={fieldSettingParameters?.type === 'single_choice'}
                                onClick={() => handleRadiobtn('single_choice')} />
                            <label htmlFor='SingleChoice' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                Single Choice
                            </label>
                        </div>
                        <div className="relative custom-radioBlue flex items-center mt-3" data-testid='lookup'>
                            <input
                                type='radio'
                                className='w-[17px] h-[17px]'
                                name='type'
                                id='MultiChoice'
                                value='MultiChoice'
                                checked={fieldSettingParameters?.type === 'multi_choice'}
                                onClick={() => handleRadiobtn('multi_choice')} />
                            <label htmlFor='MultiChoice' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                Multi Choice
                            </label>
                        </div>

                        <p className='font-semibold text-base text-[#2B333B] mt-8'>Source</p>
                        <div className="relative custom-radioBlue flex items-center mt-3" data-testid='lookup'>
                            <input
                                type='radio'
                                className='w-[17px] h-[17px]'
                                name='source'
                                id='FixedList'
                                value='FixedList'
                                checked={fieldSettingParameters?.source === 'fixedList'}
                                onClick={() => {
                                    dispatch(setNewComponent({ id: 'source', value: 'fixedList', questionId: selectedQuestionDetails?.question_id }))
                                    dispatch(resetFixedChoice({ questionId: selectedQuestionDetails?.question_id }))
                                }
                                } />  {/* handleSource('fixedList') */}
                            <label htmlFor='FixedList' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                Fixed List
                            </label>
                        </div>
                        {fieldSettingParameters?.source === 'fixedList' &&
                            <DraggableList
                                itemKey="id" // Adjust itemKey according to your unique identifier
                                template={(props) => (
                                    <Item
                                        {...props}
                                        focusInput={focusInput}
                                        ref={(ref) => {
                                            inputRefs.current[props.item.id] = ref;
                                        }}
                                    />
                                )}
                                list={fixedChoiceArray.map((data, choiceIndex) => ({
                                    ...data,
                                    index: choiceIndex,
                                }))}
                                onMoveEnd={handleMoveEnd}
                                container={() => document.body}
                            />}
                        <div className="relative custom-radioBlue flex items-center mt-3" data-testid='lookup'>
                            <input
                                type='radio'
                                className='w-[17px] h-[17px]'
                                name='source'
                                id='Lookup'
                                value='Lookup'
                                checked={fieldSettingParameters?.source === 'lookup'}
                                onClick={() => dispatch(setNewComponent({ id: 'source', value: 'lookup', questionId: selectedQuestionDetails?.question_id }))} />  {/* handleSource('lookup') */}
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
                                        placeholder='Select the file'
                                        className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px]'
                                        testID='lookup-dropdown'
                                        labeltestID='option0'
                                        selectedOption={optionData.find(option => option.value === fieldSettingParameters?.lookupOption)}
                                        handleRemoveOption={handleRemoveOption}
                                        isDropdownOpen={isLookupOpen}
                                        setDropdownOpen={setIsLookupOpen}
                                        handleOptionClick={handleLookupOption}
                                        top='20px'
                                        close='true'
                                        options={optionData}
                                        lastElementRef={lastElementRef} />
                                </div>
                                <button onClick={() => navigate('/lookup-dataset', { state: { create: true } })} className='ml-4'>
                                    <img src="/Images/plus.svg" alt="plus" />
                                </button>
                            </div>}
                        {/* OptionsComponent added here */}
                        <OptionsComponent />
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
                                maxLength={250}
                                handleChange={(e) => handleInputChange(e)} />
                        </div>
                        <div className='mx-auto mt-7 flex items-center w-full'>
                            <button className='bg-black py-[13px] font-semibold text-[#FFFFFF] text-base mr-3 rounded w-[30%]'
                                onClick={handleSaveSettings}
                            >
                                Save
                            </button>
                            <button type='button' className='w-[70%] py-[13px] bg-black rounded font-semibold text-[#FFFFFF] text-base px-[52px]'>
                                Add Conditional Logic
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ChoiceFieldSetting