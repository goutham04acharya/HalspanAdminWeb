import React, { useEffect, useState } from 'react'
import CommonComponents from '../../../CommonComponents/CommonComponents'
import InputWithDropDown from '../../../../../../Components/InputField/InputWithDropDown'
import InputField from '../../../../../../Components/InputField/InputField';
import OptionsComponent from './OptionalComponent/OptionalComponent';

function TestFieldSetting({ handleInputChange, formParameters, handleRadiobtn, fieldSettingParameters, setFieldSettingParameters, handleSaveSettings }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [optionData, setOptionData] = useState([]);

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
  };

  useEffect(() => {
    const fetchLookupData = async () => {
      if (fieldSettingParameters?.type === 'lookup') {
        try {
          const response = await getAPI(`lookup-data`);
          setOptionData(response.data); // Assuming response.data contains the options array
        } catch (error) {
          console.error('Error fetching lookup data:', error);
        }
      }
    };

    fetchLookupData();
  }, [fieldSettingParameters?.type]);

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
                checked={fieldSettingParameters.type === 'single_line'}
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
                checked={fieldSettingParameters.type === 'multi_line'}
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
                checked={fieldSettingParameters.type === 'lookup'}
                onClick={() => handleRadiobtn('lookup')} />
              <label htmlFor='Lookup' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                Lookup
              </label>
            </div>
            {fieldSettingParameters?.type === 'lookup' &&
              <div className='w-full flex items-center mt-3'>
                <div className='w-[90%]'>
                  <InputWithDropDown
                    label=''
                    id='lookup'
                    placeholder='Select the file'
                    className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px]'
                    testID='lookup-dropdown'
                    labeltestID='option0'
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    top='20px'
                    close='true'
                    options={optionData} />
                </div>
                <button className='ml-4'>
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
                selectedOption={options.find(option => option.value === fieldSettingParameters.format)}
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
                  value={fieldSettingParameters.min}
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
                  value={fieldSettingParameters.max}
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
            <OptionsComponent />
            <div className='mt-7'>
              <InputField
                autoComplete='off'
                label='Admin Field Notes'
                id='note'
                type='text'
                value={fieldSettingParameters.note}
                className='w-full mt-2.5'
                labelStyle='font-semibold text-base text-[#2B333B]'
                placeholder='Notes'
                testId='Notes'
                htmlFor='note'
                maxLength={250}
                handleChange={(e) => handleInputChange(e)} />
            </div>
            <div className='mx-auto w-[80%] mt-7 flex items-center justify-center'>
              <button className='border border-black py-[13px] mr-3 rounded'
                onClick={handleSaveSettings}
              >
                Save
              </button>
              <button type='button' className='py-[13px] bg-black rounded font-semibold text-[#FFFFFF] text-base px-[52px] w-full'>
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