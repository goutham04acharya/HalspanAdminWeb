import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
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
import ErrorMessage from '../../../../../../Components/ErrorMessage/ErrorMessage';
import { setShouldAutoSave } from '../../../QuestionnaryFormSlice';
import GlobalContext from '../../../../../../Components/Context/GlobalContext';
import { RegExpValidator } from 'regexpp';

import { setAllSectionDetails } from '../../../ConditionalLogicAdvanced/Components/SectionDetailsSlice';
import { useSelector } from 'react-redux';

function TestFieldSetting({
  handleInputChange,
  dataIsSame,
  formParameters,
  handleRadiobtn,
  fieldSettingParameters,
  selectedQuestionId,
  isThreedotLoader,
  handleBlur,
  validationErrors,
  setValidationErrors,
  setConditionalLogic,
  conditionalLogic
}) {

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [optionData, setOptionData] = useState([]);
  const { setToastError, setToastSuccess } = useContext(GlobalContext);

  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isValid, setIsValid] = useState(false)

  const allSectionDetails = useSelector(state => state?.allsectiondetails?.allSectionDetails);

  const lastEvaluatedKeyRef = useRef(null);
  const observer = useRef();

  const navigate = useNavigate();
  const { getAPI } = useApi();

  const dispatch = useDispatch();


  const options = [
    { value: 'Alpha', label: 'Alpha' },
    { value: 'Alphanumeric', label: 'Alphanumeric' },
    { value: 'Numeric', label: 'Numeric' },
    ...(fieldSettingParameters?.options?.field_validation ? [{ value: 'Custom Regular Expression', label: 'Custom Regular Expression' }] : [])
  ];

  const handleOptionClick = (option) => {
    setDropdownOpen(false);
    dispatch(setNewComponent({ id: 'format', value: option.value, questionId: selectedQuestionId }));
    // dispatch(setShouldAutoSave(true));
  };
  const validateRegex = (e) => {
    const value = e.target.value;
  
    // Check if the value is empty
    if (!value) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        regular_expression: 'Regular expression cannot be empty',
      }));
      return;
    }
  
    // Try creating a RegExp to check for validity
    try {
      new RegExp(value);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        regular_expression: '',
      }));
    } catch (err) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        regular_expression: 'Invalid regular expression',
      }));
    }
  };
  


  const handleRegularExpression = (event) => {
    // debugger
    const value = event.target.value;
    if (value === '' || validateRegex(value)) {

      dispatch(setNewComponent({ id: 'regular_expression', questionId: selectedQuestionId, value }));
      // dispatch(setShouldAutoSave(true));
    } else {
      // setToastError('Not a valid regex')
      // return false;
    }

  };

  const handleErrorMessage = (event) => {
    const value = event.target.value;
    dispatch(setNewComponent({ id: 'format_error', value, questionId: selectedQuestionId }));
    dispatch(setShouldAutoSave(true));
  };
  const handleLookupOption = (option) => {
    setIsLookupOpen(false);
    dispatch(setNewComponent({ id: 'lookupOption', value: option.value, questionId: selectedQuestionId }));
    dispatch(setShouldAutoSave(true));
  };

  const handleRemoveLookup = () => {
    dispatch(setNewComponent({ id: 'lookupOption', value: '', questionId: selectedQuestionId }));
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

  function isValidRegex(pattern) {
    try {
      new RegExp(pattern);
      return true;
    } catch (e) {
      return false;
    }
  }

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
                  id='Singleline'
                  value='Singleline'
                  checked={fieldSettingParameters?.type === 'single_line'}
                  onClick={() => handleRadiobtn('single_line')} />
                <label htmlFor='Singleline'
                  data-testid='single_line'
                  className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                  Single-line
                </label>
              </div>

              <div className="relative custom-radioBlue flex items-center mt-3">
                <input
                  type='radio'
                  className='w-[17px] h-[17px]'
                  name='type'
                  id='SingleChoice'
                  value='SingleChoice'
                  checked={fieldSettingParameters?.type === 'multi_line'}
                  onClick={() => handleRadiobtn('multi_line')} />
                <label
                  data-testid='multi_line'
                  htmlFor='SingleChoice' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                  Multi-line
                </label>
              </div>
              <div className="relative custom-radioBlue flex items-center mt-3">
                <input
                  type='radio'
                  className='w-[17px] h-[17px]'
                  name='type'
                  id='Lookup'
                  value='Lookup'
                  checked={fieldSettingParameters?.type === 'lookup'}
                  onClick={() => handleRadiobtn('lookup')} />
                <label htmlFor='Lookup' data-testid='lookup'
                  className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                  Lookup
                </label>
              </div>
              {fieldSettingParameters?.type === 'lookup' &&
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

            </div>
          </div>
          <div className='mt-7'>
            <InputWithDropDown
              label='Format'
              labelStyle='font-semibold text-[#2B333B] text-base'
              id='format'
              top='55px'
              placeholder='Select'
              className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-3'
              testID='format-dropdown'
              labeltestID='format-list'
              selectedOption={options.find(option => option.value === fieldSettingParameters?.format)}
              handleOptionClick={handleOptionClick}
              isDropdownOpen={isDropdownOpen}
              setDropdownOpen={setDropdownOpen}
              options={options}
            />
          </div>
          {(fieldSettingParameters?.format === "Custom Regular Expression" && fieldSettingParameters?.options?.field_validation === true)
            && <><div className='flex flex-col justify-start mt-7'>
              <label
                // htmlFor={placeholderContentId}
                className='font-semibold text-base text-[#2B333B]'>Regular Expression
              </label>
              <InputField
                type="text"
                id="regular_expression"
                className='mt-[11px] border w-full border-[#AEB3B7] rounded py-[11px] px-4 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                placeholder="Regex pattern (e.g. ^[a-zA-Z0-9]+$)"
                value={fieldSettingParameters?.regular_expression}
                handleBlur={(e) => validateRegex(e)}
                handleChange={(e) => handleInputChange(e)}
                // onBlur={(e)=>}
                testId="regex-input"
                maxLength={50}
                validationError={isValid ? 'Invalid Expression' : ''}
              />
            </div>{validationErrors?.regular_expression && (
              <ErrorMessage error={validationErrors?.regular_expression} />
            )}</>}

          {(fieldSettingParameters?.format === "Custom Regular Expression" && fieldSettingParameters?.options?.field_validation === true) && <div className='flex flex-col justify-start mt-7'>
            <label
              // htmlFor={placeholderContentId}
              className='font-semibold text-base text-[#2B333B]'>Format Error Message
            </label>
            <InputField
              type="text"
              id="format_error"
              className='mt-[11px] border w-full border-[#AEB3B7] rounded py-[11px] px-4 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
              placeholder="Enter a custom error message for invalid input"
              value={fieldSettingParameters?.format_error}
              handleChange={(e) => handleInputChange(e)}

              testId="format-error-input"
              maxLength={50} />
          </div>}
          <div className='mt-7'>
            <p className='font-semibold text-base text-[#2B333B]'>Number of Characters</p>
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
              <p className='mx-3 font-normal text-base text-[#2B333B]'>to</p>
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
            {validationErrors?.minMax && (
              <ErrorMessage error={validationErrors.minMax} />
            )}
          </div>
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

export default TestFieldSetting