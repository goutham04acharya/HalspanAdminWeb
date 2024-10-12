import React from 'react'

function QuestionnarySettingShimmer() {
    return (
        <div className='mt-9'>
            <p className='font-medium text-[22px] text-[#2B333B]'>Questionnaire settings</p>
            <div className='mt-[22px] h-customh11 overflow-auto default-sidebar overflow-x-hidden'>
                <div className='w-full mr-[114px]'>
                <p className='font-semibold text-base text-[#6F7579] mb-2.5'>Public name</p>
                    <div className='animate-pulse bg-slate-200 h-[50px]'></div>
                </div>
                <div className='w-full mt-6'>
                <p className='font-semibold text-base text-[#6F7579] mb-2.5'>Internal name</p>
                    <div className='animate-pulse bg-slate-200 h-[50px]'></div>
                </div>
                <div className='w-full mt-6'>
                <p className='font-semibold text-base text-[#6F7579] mb-2.5'>Description</p>
                    <div className='animate-pulse bg-slate-200 h-[50px]'></div>
                </div>
                <div className='mt-5'>
                <p className='font-semibold text-base text-[#6F7579] mb-2.5'>ID</p>
                    <div className='animate-pulse bg-slate-200 h-[50px]'></div>
                </div>
                <div className='w-full mt-6'>
                    <p className='font-semibold text-base text-[#6F7579] mb-2.5'>Asset type</p>
                    <div className='animate-pulse bg-slate-200 h-[50px]'></div>
                </div>
                <div className='w-full mt-6'>
                    <p className='font-semibold text-base text-[#6F7579] mb-2.5'>Language</p>
                    <div className='animate-pulse bg-slate-200 h-[50px]'></div>
                </div>
                <div className='mt-6'>
                    <p className='font-semibold text-[#6F7579] text-base'>Ad Hoc / Non TAG questionnaire</p>
                    <div className='mt-2.5'>
                        <div className='animate-pulse bg-slate-200 h-[50px]'></div>
                        <div className="relative custom-radiodisabled flex items-center mt-[12px]" data-testid='no'>
                            <div className='animate-pulse bg-slate-200 h-[50px]'></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='animate-pulse bg-slate-200 h-[50px] mt-[26px]'></div>
        </div>
    )
}

export default QuestionnarySettingShimmer