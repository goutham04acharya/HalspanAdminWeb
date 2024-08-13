import React, { useState } from 'react'
import CommonComponents from '../../../CommonComponents/CommonComponents'
import InputWithDropDown from '../../../../../../Components/InputField/InputWithDropDown'
import InputField from '../../../../../../Components/InputField/InputField';
import OptionsComponent from './OptionalComponent/OptionalComponent';

function TestFieldSetting({ handleInputChange, formParameters }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const { type } = formParameters; // Destructure the type from formParameters

  const renderTypeSpecificFields = (type) => {
    switch (type) {
      case 'Single-line':
        return 'signle-line'; // No additional fields for Singleline
      case 'Multi-line':
        return 'Multi-line'; // No additional fields for SingleChoice
      case 'Lookup':
        return 'Lookup'; // Add logic for Lookup here
      default:
        return null;
    }
  };

  return (
    <div className='py-[34px] px-[32px] h-customh10'>
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
        />
        <div className='flex flex-col justify-start mt-7 w-full relative'>
          <label htmlFor="Label" className='font-semibold text-base text-[#2B333B]'>Default Content</label>
          <div className='relative w-full'>
            <input type="text" id='Label' className='mt-[11px] w-full border border-[#AEB3B7] rounded py-[11px] pl-4 pr-11 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
              placeholder='Populates the content'
            />
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
              // checked={createDetails.type === 'Singleline'}
              // onChange={handleadhocChange}
              />
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
              // checked={createDetails.type === 'SingleChoice'}
              // onChange={handleadhocChange}
              />
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
              // checked={createDetails.type === 'Lookup'}
              // onChange={handleadhocChange}
              />
              <label htmlFor='Lookup' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                Lookup
              </label>
            </div>
            {type === 'lookup' &&
              <div className='w-full flex items-center'>
                <div className='w-[90%] mt-3'>
                  <InputWithDropDown
                    label=''
                    id='lookup'
                    placeholder='Select the file'
                    className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px]'
                    testID='lookup-dropdown'
                    labeltestID='option0'
                    selectedOption={selectedOption}
                    top='20px'
                  // close='true'
                  // options={options}
                  />
                </div>
                <button className='ml-4'>
                  <img src="/Images/plus.svg" alt="plus" />
                </button>
              </div>
            }
            <div className='mt-7'>
              <InputWithDropDown
                label='Format'
                labelStyle='font-semibold text-[#2B333B] text-base'
                id='lookup'
                placeholder='Select'
                className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-3'
                testID='lookup-dropdown'
                labeltestID='option0'
                selectedOption={selectedOption}
                top='55px'
              // close='true'
              // options={options}
              />
            </div>
            <div className='mt-7'>
              <p className='font-semibold text-base text-[#2B333B]'>Number of Characters</p>
              <div className='flex items-center mt-3'>
                <InputField
                  autoComplete='off'
                  label=''
                  id='minChar'
                  type='text'
                  // value={createDetails.internal_name}
                  className='w-full mt-2.5'
                  labelStyle=''
                  placeholder='Minimum'
                  testId='minChar'
                  htmlFor='minChar'
                  maxLength={100}
                // handleChange={handleChange}
                />
                <p className='mx-3 font-normal text-base text-[#2B333B] mt-2'> to</p>
                <InputField
                  autoComplete='off'
                  label=''
                  id='maxChar'
                  type='text'
                  // value={createDetails.internal_name}
                  className='w-full mt-2.5'
                  labelStyle=''
                  placeholder='Maximum'
                  testId='maxChar'
                  htmlFor='maxChar'
                  maxLength={100}
                // handleChange={handleChange}
                />
              </div>
            </div>
            {/* OptionsComponent added here */}
            <OptionsComponent />
            <div className='mt-7'>
              <InputField
                autoComplete='off'
                label='Admin Field Notes'
                id='Notes'
                type='text'
                // value={createDetails.internal_name}
                className='w-full mt-2.5'
                labelStyle='font-semibold text-base text-[#2B333B]'
                placeholder='Notes'
                testId='Notes'
                htmlFor='Notes'
              // maxLength={100}
              // handleChange={handleChange}
              // validationError={validationErrors?.internal_name}
              />
            </div>
            <div className='mx-auto w-[80%] mt-7 flex items-center justify-center'>
              <button type='button' className='py-[13px] bg-black rounded font-semibold text-[#FFFFFF] text-base px-[52px] w-full'>
                Add Conditional Logic
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestFieldSetting