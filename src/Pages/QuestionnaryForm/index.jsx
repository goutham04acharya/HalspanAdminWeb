import React from 'react'
import SideLayout from '../../Pages/QuestionnaryForm/Components/SideLayout'
import { useNavigate } from 'react-router-dom'
// import Form from './Componenets/form'
// import AddFields from './Componenets/AddFieldsComponent/AddFieldsFields'
// import fieldsneeded from './Componenets/AddFieldsComponent/fields'
// import TestFieldSetting from './Componenets/TestFieldSetting/TestFieldSetting'

function QuestionnaryForm() {
    const navigate = useNavigate();
    return (
        <div className='border-t border-[#DCE0EC] flex items-start h-customh5'>
            <div className='w-[20%]'>
                <SideLayout />
            </div>
            <div className='w-[50%] '>
                <div className='flex items-center w-full border-b border-[#DCE0EC] py-[13px] px-[26px]'>
                    <p>ID 3453  -  Door - Version 5</p>
                    <button type='button' className='px-5 py-1 bg-[#D6DDEC] rounded-[15px] font-normal text-base text-[#2B333B] ml-[30px]'>
                        Draft
                    </button>
                </div>
                <div className='bg-[#EFF1F8] w-full py-[30px] px-[26px] h-customh6'>
                    <p className='font-semibold text-[22px] text-[#2B333B]'>Inspection A</p>
                    <div className='mt-[25px] p-4 hover:border-[#2B333B] hover:border rounded-[10px]'>
                        <div className='flex items-center w-full justify-between'>
                            <p className='text-[#2B333B] font-medium text-[22px]'>Section 1</p>
                            <img src="/public/Images/save.svg" alt="save" />
                        </div>
                        <div className='mt-7 w-full bg-white rounded-[10px] px-4 pt-4 pb-[22px] hover:border-[#2B333B] hover:border'>
                            <p className='text-[#2B333B] font-medium text-[22px]'>Page 1</p>
                            <div className='bg-[#EFF1F8] mt-7 rounded-[10px] p-4'>
                                <p className='mb-5 font-medium text-base text-[#000000]'>Question 1</p>
                            </div>
                            <div className='mt-7 bg-[#EFF1F8] rounded-[10px] w-full px-3 hover:border'>
                                <button type='button' className='flex items-center justify-center w-full py-7 font-semibold text-[#2B333B] text-base'>
                                    +
                                    <span className='ml-[4]'>Add question</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <button type='button' className='flex items-center justify-center w-full py-7 mt-6 bg-white font-semibold text-[#2B333B] text-base'>
                                +
                                <span className='ml-[4]'>Add Page</span>
                            </button>
                        </div>
                        <button className='flex items-center mt-8 font-semibold text-[#2B333B] text-base'>
                            + Add section
                        </button>
                    </div>
                </div>
            </div>
            <div className='w-[30%]'>
                <div className='border-b border-[#DCE0EC] flex items-center w-full'>
                    <button className='w-1/3 py-[17px] px-[29px] flex items-center font-semibold text-base text-[#2B333B] border-l border-r border-[#EFF1F8]' onClick={()=> navigate('/questionnaries/create-questionnary')}>
                    <img src="/public/Images/cancle.png" className='pr-2.5' alt="cancle" />
                        Cancle
                    </button>
                    <button className='w-1/3 py-[17px] px-[29px] flex items-center font-semibold text-base text-[#2B333B] border-l border-r border-[#EFF1F8]'>
                    <img src="/public/Images/preview.png" className='pr-2.5' alt="preview" />
                        Preview
                    </button>
                    <button className='w-1/3 py-[17px] px-[29px] font-semibold text-base text-[#FFFFFF] bg-[#2B333B] border-l border-r border-[#EFF1F8]'>
                        Save
                    </button>
                </div>
                {/* <AddFields buttons={fieldsneeded} /> */}
                {/* <TestFieldSetting/> */}
            </div>
        </div>
    )
}

export default QuestionnaryForm