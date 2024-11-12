import React from 'react'
import { useSelector } from 'react-redux';
import { setComplianceLogicId, setSelectedComponent } from '../../QuestionnaryFormSlice';
import { useDispatch } from 'react-redux';
import { defaultContentConverter } from '../../../../../CommonMethods/defaultContentConverter';


function ComplanceLogicField({ complianceLogic, setComplianceLogic, addNewCompliance, complianceSaveHandler, setIsDeleteComplianceLogic }) {
  const dispatch = useDispatch()
  const { complianceLogicId } = useSelector((state) => state?.questionnaryForm)
  console.log(complianceLogicId, 'kkkkkkkkkkkk')

  return (
    <div className='bg-white rounded-[10px] font-medium p-4 mt-8'>
      <div className='flex justify-between'>
        <p className='text-xl text-[#2B333B] mb-7'>Compliance</p>
        <div className='flex'>
          <img
            src="/Images/trash-black.svg"
            alt="delete"
            title='Delete'
            className=' cursor-pointer mr-4 z-[9] rounded-full hover:bg-[#FFFFFF] h-[26px]'
            onClick={() => setIsDeleteComplianceLogic(true)}
          />
          <img src="/Images/save.svg"
            onClick={() => complianceSaveHandler()}
            alt="save" title="Save" data-testid="save-btn-1" class=" h-[26px] rounded-full hover:bg-[#FFFFFF] cursor-pointer" />
        </div>
      </div>

      {complianceLogic.map((item, index) => (
        <div data-testid="section-1-page-1-question-5" 
        className={`disable-select select-none w-full rounded-[10px] mb-4 p-4 hover:border border-[#2B333B] ${complianceLogicId === index ? 'bg-[#d1d3d9b7] border border-[#2B333B]' : 'bg-[#EFF1F8]'}`}
          onClick={() => {
            dispatch(setComplianceLogicId(index))
            dispatch(setSelectedComponent('compliancelogic'))
          }}
        >
          <div className='flex justify-between items-start'>
            <label data-testid="label-name" maxlength="100" class="font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] h-auto">{item?.label}</label>
            <img
              src="/Images/trash-black.svg"
              alt="delete"
              title='Delete'
              className=' cursor-pointer mb-2 z-[9] rounded-full hover:bg-[#FFFFFF]'
              onClick={() => {
                addNewCompliance(true, index);
              }}
            />
          </div>
          <input data-testid="input"
            class="w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 mt-3 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] undefined"
            value={defaultContentConverter(item?.default_content || '')}
          />
          <p data-testid="help-text" class="italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]"></p>
        </div>))
      }
      <button onClick={() => addNewCompliance()} data-testid="add-page-sec-0" class="bg-[#EFF1F8] flex items-center justify-center w-full rounded-[10px] py-7 mt-6 font-semibold text-[#2B333B] text-base hover:border hover:border-[#2B333B]">
        <span class="mr-[15px]">+</span>
        <span>Add Compliance</span></button>
    </div>
  )
}

export default ComplanceLogicField