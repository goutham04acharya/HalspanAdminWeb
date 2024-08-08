import React from 'react'

function TestFieldSetting() {
  return (
    <div className='py-[34px] px-[32px]'>
      <p className='font-semibold text-[#2B333B] text-[22px]'>Field settings</p>
      <div className='mt-[14px] h-customh9 overflow-auto default-sidebar'>
        <div className='flex flex-col justify-start'>
          <label htmlFor="Label" className='font-semibold text-base text-[#2B333B]'>Label</label>
          <input type="text" id='Label' className='mt-[11px] border border-[#AEB3B7] rounded py-[11px] px-4 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
            placeholder='Question 1'
          />
        </div>
        <div className='flex flex-col justify-start mt-7'>
          <label htmlFor="Label" className='font-semibold text-base text-[#2B333B]'>Help Text</label>
          <input type="text" id='Label' className='mt-[11px] border border-[#AEB3B7] rounded py-[11px] px-4 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
            placeholder='Notes'
          />
        </div>
        <div className='flex flex-col justify-start mt-7'>
          <label htmlFor="Label" className='font-semibold text-base text-[#2B333B]'>Placeholder Content</label>
          <input type="text" id='Label' className='mt-[11px] border border-[#AEB3B7] rounded py-[11px] px-4 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
            placeholder='Text Displayed in the field'
          />
        </div>
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
            <div className="relative custom-radioBlue flex items-center" data-testid='yes'
            >
              <input type='radio'
                className='w-[17px] h-[17px]'
                name='type'
                id='Singleline'
                value='Singleline'
              // checked={createDetails.type === 'Yes'}
              // onChange={handleadhocChange} 
              />
              <label htmlFor='yes' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                Single line
              </label>
            </div>
            <div className="relative custom-radioBlue flex items-center mt-3" data-testid='no'
            >
              <input type='radio'
                className='w-[17px] h-[17px]'
                name='type'
                id=' Single Choice'
                value=' Single Choice'
              //  checked={createDetails.is_adhoc === 'No'}
              // onChange={handleadhocChange} 
              />
              <label htmlFor='no' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                Multi-line
              </label>
            </div>
            <div className="relative custom-radioBlue flex items-center mt-3" data-testid='no'
            >
              <input type='radio'
                className='w-[17px] h-[17px]'
                name='type'
                id='no'
              // value='No' checked={createDetails.is_adhoc === 'No'}
              // onChange={handleadhocChange} 
              />
              <label htmlFor='no' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                Lookup
              </label>
            </div>
          </div>
        </div>
        <div className='mt-7'>
          <p className='font-semibold text-[#2B333B] text-base'>Source</p>
          <div className='flex flex-col justify-start mt-7 w-full relative'>
            <label htmlFor="Label" className='font-semibold text-base text-[#2B333B]'>Default Content</label>
            <div className='relative w-full'>
              <input type="text" id='Label' className='mt-[11px] w-full border border-[#AEB3B7] rounded py-[11px] pl-4 pr-11 font-normal text-base text-[#2B333B] placeholder:text-[#9FACB9] outline-0'
                placeholder='Populates the content'
              />
              <img src="/Images/setting.svg" alt="setting" className='absolute top-5 right-3 cursor-pointer' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestFieldSetting