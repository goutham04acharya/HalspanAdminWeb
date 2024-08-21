import React, { useCallback, useEffect, useRef, useState } from 'react'
import CommonComponents from '../../../CommonComponents/CommonComponents'
import InputWithDropDown from '../../../../../../Components/InputField/InputWithDropDown'
import InputField from '../../../../../../Components/InputField/InputField';
import OptionsComponent from './OptionalComponent/OptionalComponent';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useApi from '../../../../../../services/CustomHook/useApi';
import InfinateDropdown from '../../../../../../Components/InputField/InfinateDropdown';
import objectToQueryString from '../../../../../../CommonMethods/ObjectToQueryString';
import { useDispatch } from 'react-redux';
import { setNewComponent } from '../../fieldSettingParamsSlice';
import Button from '../../../../../../Components/Button/button';

function TestFieldSetting({
  handleInputChange,
  formParameters,
  handleRadiobtn,
  fieldSettingParameters,
  setFieldSettingParameters,
  handleSaveSettings,
  selectedQuestionId,
  isThreedotLoader,
  handleBlur,
  setShouldAutoSave
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


  const options = [
    { value: 'Alpha', label: 'Alpha' },
    { value: 'Alphanumeric', label: 'Alphanumeric' },
    { value: 'Numeric', label: 'Numeric' },
    { value: 'Custom Regular Expression', label: 'Custom Regular Expression' }
  ];

  const handleOptionClick = (option) => {
    setFieldSettingParameters((prevState) => ({
      ...prevState,
      format: option.value,
    }));
    setDropdownOpen(false);
    dispatch(setNewComponent({ id: 'format', value: option.value, questionId: selectedQuestionId }));
    setShouldAutoSave(true)
  };

  const handleLookupOption = (option) => {
    setFieldSettingParameters((prevState) => ({
      ...prevState,
      lookupOption: option.value,
    }));
    setIsLookupOpen(false);
    dispatch(setNewComponent({ id: 'lookupOption', value: option.value, questionId: selectedQuestionId }));
    setShouldAutoSave(true)
  };

  const handleRemoveLookup = () => {
    dispatch(setNewComponent({ id: 'lookupOption', value: '', questionId: selectedQuestionId }));
    setShouldAutoSave(true)
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
        label: item.name
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


  useEffect(() => {
    fetchLookupList();
  }, [fetchLookupList]);

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
          helpTextPlaceholder='Enter Help Text'
          placeholderContentId='placeholder'
          placeholder='Placeholder Content'
          placeholderContent='Text Displayed in the field'
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
                id='Singleline'
                value='Singleline'
                checked={fieldSettingParameters?.type === 'single_line'}
                onClick={() => handleRadiobtn('single_line')} />
              <label htmlFor='Singleline' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                Single line
              </label>
            </div>

            <div className="relative custom-radioBlue flex items-center mt-3" data-testid='single-choice'>
              <input
                type='radio'
                className='w-[17px] h-[17px]'
                name='type'
                id='SingleChoice'
                value='SingleChoice'
                checked={fieldSettingParameters?.type === 'multi_line'}
                onClick={() => handleRadiobtn('multi_line')} />
              <label htmlFor='SingleChoice' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                Multi-line
              </label>
            </div>
            <div className="relative custom-radioBlue flex items-center mt-3" data-testid='lookup'>
              <input
                type='radio'
                className='w-[17px] h-[17px]'
                name='type'
                id='Lookup'
                value='Lookup'
                checked={fieldSettingParameters?.type === 'lookup'}
                onClick={() => handleRadiobtn('lookup')} />
              <label htmlFor='Lookup' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                Lookup
              </label>
            </div>
            {fieldSettingParameters?.type === 'lookup' &&
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
            <div className='mt-7'>
              <InputWithDropDown
                label='Format'
                labelStyle='font-semibold text-[#2B333B] text-base'
                id='format'
                top='55px'
                placeholder='Select'
                className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-3'
                testID='format-dropdown'
                labeltestID='option0'
                selectedOption={options.find(option => option.value === fieldSettingParameters?.format)}
                handleOptionClick={handleOptionClick}
                isDropdownOpen={isDropdownOpen}
                setDropdownOpen={setDropdownOpen}
                options={options} />
            </div>
            <div className='mt-7'>
              <p className='font-semibold text-base text-[#2B333B]'>Number of Characters</p>
              <div className='flex items-center mt-3'>
                <InputField
                  autoComplete='off'
                  label=''
                  id='min'
                  type='text'
                  value={fieldSettingParameters?.min}
                  className='w-full mt-2.5'
                  labelStyle=''
                  placeholder='Minimum'
                  testId='minChar'
                  htmlFor='min'
                  maxLength={10}
                  handleChange={(e) => handleInputChange(e)} />
                <p className='mx-3 font-normal text-base text-[#2B333B] mt-2'> to</p>
                <InputField
                  autoComplete='off'
                  label=''
                  id='max'
                  type='text'
                  value={fieldSettingParameters?.max}
                  className='w-full mt-2.5'
                  labelStyle=''
                  placeholder='Maximum'
                  testId='maxChar'
                  htmlFor='max'
                  maxLength={10}
                  handleChange={(e) => handleInputChange(e)} />
              </div>
            </div>
            {/* OptionsComponent added here */}
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
                maxLength={255}
                handleChange={(e) => handleInputChange(e)} />
            </div>
            <div className='mx-auto mt-7 flex items-center w-full'>
              {/* <Button
                text='Save'
                testID='Save'
                className='bg-black py-[13px] font-semibold text-[#FFFFFF] text-base mr-3 rounded w-[30%]'
                onClick={handleSaveSettings}
                isThreedotLoading={isThreedotLoader}
              >
              </Button> */}
              <button type='button' className='w-full py-[13px] bg-black rounded font-semibold text-[#FFFFFF] text-base px-[52px]'>
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

export default TestFieldSetting