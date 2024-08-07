import React from 'react'

function FormShimmer() {
    return (
        <div className='border-t border-[#DCE0EC] flex items-start h-customh5'>
            <div className='w-[20%]'>
            </div>
            <div className='w-[50%] animate-pulse bg-slate-200'>
                <div className='flex items-center w-full border-b border-[#DCE0EC] py-[13px] px-[26px]'>
                    <div className=' flex items-center'>
                        <p className='font-normal text-base text-[#2B333B]'>ID -</p>
                        <p className='animate-pulse bg-[#FFFFFF] rounded h-4 px-6 py-3 mx-3'> </p>
                        <p className='animate-pulse bg-slate-200 rounded '></p>
                        <p className='animate-pulse bg-slate-200 rounded '>- Version</p>
                        <p className='animate-pulse bg-[#FFFFFF] rounded-[15px] h-4 px-6 py-3 mx-3'></p>
                    </div>
                    <button className='py-[4px] px-[19px] rounded-[15px] text-[16px] font-normal text-[#2B333B] capitalize ml-[30px] cursor-default animate-pulse bg-slate-200'>
                    </button>
                </div>
                <div className='w-full py-[30px] px-[26px] h-customh6 animate-pulse  overflow-auto default-sidebar'>
                    <p className='font-semibold text-[22px] text-[#2B333B] overflow-hidden'></p>
                    <div className=''>
                        <div className='mt-[25px] p-4 hover:border-[#2B333B] hover:border rounded-[10px] bg-slate-200 border border-[#DDDDDD]'>
                            <div className='flex items-center w-full justify-between'>
                                <p className='text-[#2B333B] font-medium text-[22px]'></p>
                            </div>
                            <div className='mt-7 w-full bg-white rounded-[10px] px-4 pt-4 pb-[22px] hover:border-[#2B333B] hover:border'>
                                <p className='text-[#2B333B] font-medium text-[22px]'></p>
                                <div className='bg-[#EFF1F8] mt-7 rounded-[10px] p-4 hover:border hover:border-[#2B333B]'>
                                    <p className='mb-5 font-medium text-base text-[#000000]'></p>
                                </div>
                                <div className='mt-7 bg-[#EFF1F8] rounded-[10px] w-full px-3 hover:border hover:border-[#2B333B]'>
                                    <button type='button' className='flex items-center justify-center w-full py-7 font-semibold text-[#2B333B] text-base'>

                                        <span className='ml-[4]'></span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <button type='button' className='flex items-center justify-center w-full rounded-[10px] py-7 mt-6 bg-white font-semibold text-[#2B333B] text-base hover:border hover:border-[#2B333B]'>

                                    <span className='ml-[4]'></span>
                                </button>
                            </div>
                        </div>
                        <div className='mt-[25px] p-4 hover:border-[#2B333B] hover:border rounded-[10px] bg-slate-200 border border-[#DDDDDD]'>
                            <div className='flex items-center w-full justify-between'>
                                <p className='text-[#2B333B] font-medium text-[22px]'></p>
                            </div>
                            <div className='mt-7 w-full bg-white rounded-[10px] px-4 pt-4 pb-[22px] hover:border-[#2B333B] hover:border'>
                                <p className='text-[#2B333B] font-medium text-[22px]'></p>
                                <div className='bg-[#EFF1F8] mt-7 rounded-[10px] p-4 hover:border hover:border-[#2B333B]'>
                                    <p className='mb-5 font-medium text-base text-[#000000]'></p>
                                </div>
                                <div className='mt-7 bg-[#EFF1F8] rounded-[10px] w-full px-3 hover:border hover:border-[#2B333B]'>
                                    <button type='button' className='flex items-center justify-center w-full py-7 font-semibold text-[#2B333B] text-base'>

                                        <span className='ml-[4]'></span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <button type='button' className='flex items-center justify-center w-full rounded-[10px] py-7 mt-6 bg-white font-semibold text-[#2B333B] text-base hover:border hover:border-[#2B333B]'>

                                    <span className='ml-[4]'></span>
                                </button>
                            </div>
                        </div>
                        <button className='flex items-center mt-8 font-semibold text-[#2B333B] text-base'>
                        </button>
                    </div>
                </div>
            </div>
            <div className='w-[30%]'>
                <div className='border-b border-[#DCE0EC] flex items-center w-full'>
                    <button className='w-1/3 py-[17px] px-[29px] flex items-center font-semibold text-base text-[#2B333B] border-l border-r border-[#EFF1F8]'>
                        <img src="/Images/cancle.png" className='pr-2.5' alt="cancle" />
                        Cancle
                    </button>
                    <button className='w-1/3 py-[17px] px-[29px] flex items-center font-semibold text-base text-[#2B333B] border-l border-r border-[#EFF1F8]'>
                        <img src="/Images/preview.png" className='pr-2.5' alt="preview" />
                        Preview
                    </button>
                    <button className='w-1/3 py-[17px] px-[29px] font-semibold text-base text-[#FFFFFF] bg-[#2B333B] border-l border-r border-[#EFF1F8]'>
                        Save
                    </button>
                </div>
                {/* <AddFields buttons={fieldsneeded} /> */}
                {/* <TestFieldSetting/> */}
            </div>
        </div >
    )
}

export default FormShimmer