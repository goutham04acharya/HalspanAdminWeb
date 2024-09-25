import React from 'react'
import CommonComponents from '../../../CommonComponents/CommonComponents'
import InputField from '../../../../../../Components/InputField/InputField'
import OptionsComponent from '../../TextBox/TextFieldSetting/OptionalComponent/OptionalComponent'
import { useDispatch } from 'react-redux';
import { setNewComponent } from '../../fieldSettingParamsSlice';
import {setShouldAutoSave} from '../../../QuestionnaryFormSlice';

function DateTimeFieldSetting({
  handleInputChange,
  formParameters,
  handleBlur,
  handleRadiobtn,
  fieldSettingParameters,
  selectedQuestionId,

}) {
  const dispatch = useDispatch();

  const handletimeradiobtn = (format) => {
    dispatch(setNewComponent({ id: 'format', value: format, questionId: selectedQuestionId }));
    handleAutoSaveSettings();
}

  const handleTime = () => {
    dispatch(setNewComponent({ id: 'format', value: '24', questionId: selectedQuestionId }));
    dispatch(setShouldAutoSave(true));
  }

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
                  id='date'
                  value='date'
                  checked={fieldSettingParameters?.type === 'date'}
                  onClick={() => handleRadiobtn('date')} />
                <label htmlFor='date'
                  data-testid='date'
                  className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                  Date
                </label>
              </div>
              <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                <input
                  type='radio'
                  className='w-[17px] h-[17px]'
                  name='type'
                  id='time'
                  value='time'
                  checked={fieldSettingParameters?.type === 'time'}
                  onClick={() => {
                    handleRadiobtn('time');
                    handleTime();
                  }} />
                <label htmlFor='time'
                  data-testid='time'
                  className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                  Time
                </label>
              </div>
              <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                <input
                  type='radio'
                  className='w-[17px] h-[17px]'
                  name='type'
                  id='datetime'
                  value='datetime'
                  checked={fieldSettingParameters?.type === 'datetime'}
                  onClick={() => handleRadiobtn('datetime')} />
                <label htmlFor='datetime'
                  data-testid='date-time'
                  className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                  Date & Time
                </label>
              </div>
            </div>
          </div>
          {((fieldSettingParameters?.type === 'time') || (fieldSettingParameters?.type === 'datetime')) &&
            <div className='mt-7'>
              <p className='font-semibold text-base text-[#2B333B]'>Format</p>
              <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                <input
                  type='radio'
                  className='w-[17px] h-[17px]'
                  name='format'
                  id='format12'
                  value='format12'
                  checked={fieldSettingParameters?.format === '12'}
                  onClick={() => {
                    handletimeradiobtn('12')
                  }} />
                <label htmlFor='format12'
                  data-testid='format-12'
                  className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                  12
                </label>
              </div>
              <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                <input
                  type='radio'
                  className='w-[17px] h-[17px]'
                  name='format'
                  id='format24'
                  value='format24'
                  checked={fieldSettingParameters?.format === '24'}
                  onClick={() => handletimeradiobtn('24')} />
                <label htmlFor='format24'
                  data-testid='format-24'
                  className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                  24
                </label>
              </div>
            </div>
          }
          {/* <div className='mt-7'>
            <InputField
              autoComplete='off'
              label='Default Value'
              optional='(e.g. dd/mm/yyyy)'
              id='defaultValue'
              type='text'
              value={fieldSettingParameters?.defaultValue}
              className='w-full mt-2.5'
              labelStyle=''
              placeholder='Now'
              testId='defaultValue'
              htmlFor='defaultValue'
              maxLength={10}
              handleChange={(e) => handleInputChange(e)} />
          </div> */}
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
          <div className='mx-auto mt-7 flex items-center w-full'>
            <button type='button' className='w-[80%] mx-auto py-[13px] bg-black rounded font-semibold text-[#FFFFFF] text-base px-[52px]'>
              Add Conditional Logic
            </button>
          </div>
        </div>
      </div >
    </>
  )
}

export default DateTimeFieldSetting