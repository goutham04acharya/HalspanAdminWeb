/* eslint-disable max-len */
import React from 'react';
import CardHeader from '../CardHeader';

function SetLimitViewShimmer () {
    return (
        <div>
            <CardHeader
                activePath='set-limit'
                paths={['financials']}
                pathurls={['finanacials/set-limit']}
                header='Set Limit'
                minHeightRequired={true}
                buttonText={'Update'}
                navigationPath=''
                table={true}
                headerWithoutButton={false}
            >
                <div className='p-10'>
                    <p className='font-semibold text-lg text-[#4F5962]'>Maximum Account Balances</p>
                    <div className='mt-7 w-full flex items-start'>
                        <div className='w-1/3'>
                            <p className='font-normal text-sm text-[#A4A9AE]'>Agent</p>
                            <p className='mt-2 font-normal text-sm text-[#4F5962] h-[26px] mr-3 bg-slate-200 rounded animate-pulse'></p>
                        </div>
                        <div className='w-1/3'>
                            <p className='font-normal text-sm text-[#A4A9AE]'>Merchant</p>
                            <p className='mt-2 font-normal text-sm text-[#4F5962] h-[26px] mr-3 bg-slate-200 rounded animate-pulse'></p>
                        </div>
                        <div className='w-1/3'>
                            <p className='font-normal text-sm text-[#A4A9AE]'>Customer</p>
                            <p className='mt-2 font-normal text-sm text-[#4F5962] h-[26px] mr-3 bg-slate-200 rounded animate-pulse'></p>
                        </div>
                    </div>
                    <p className='font-semibold text-lg text-[#4F5962] mt-8'>Transaction Limit</p>
                    <div className='mt-7'>
                        <div className='flex items-start justify-between w-full'>
                            <div className='h-[26px] mr-3 bg-slate-200 rounded animate-pulse w-[25%]'></div>
                            <p className='font-normal text-sm text-[#0066F6]'>*Full KYC is daily maximum transaction limit</p>
                        </div>
                        <div className='tab-content'>
                            {/* Tab 1 Content */}
                            <div className='mt-5 w-full flex items-start'>
                                <div className='w-1/3'>
                                    <p className='font-normal text-sm text-[#A4A9AE]'>Agent</p>
                                    <p className='mt-1 font-normal text-sm text-[#4F5962] h-[26px] mr-3 bg-slate-200 rounded animate-pulse'></p>
                                </div>
                                <div className='w-1/3'>
                                    <p className='font-normal text-sm text-[#A4A9AE]'>Merchant</p>
                                    <p className='mt-1 font-normal text-sm text-[#4F5962] h-[26px] mr-3 bg-slate-200 rounded animate-pulse'></p>
                                </div>
                                <div className='w-1/3'>
                                    <p className='font-normal text-sm text-[#A4A9AE]'>Customer</p>
                                    <p className='mt-1 font-normal text-//sm text-[#4F5962] h-[26px] mr-3 bg-slate-200 rounded animate-pulse'></p>
                                </div>
                            </div>
                            <p className='font-semibold text-lg text-[#4F5962] mt-8'>Transaction Limit</p>
                        </div>
                        <div className='tab-content'>
                            {/* Tab 2 Content */}
                            <div className='mt-5 w-full flex items-start'>
                                <div className='w-1/3'>
                                    <p className='font-normal text-sm text-[#A4A9AE]'>Agent</p>
                                    <p className='mt-1 font-normal text-sm text-[#4F5962] h-[26px] mr-3 bg-slate-200 rounded animate-pulse'></p>
                                </div>
                                <div className='w-1/3'>
                                    <p className='font-normal text-sm text-[#A4A9AE]'>Merchant</p>
                                    <p className='mt-1 font-normal text-sm text-[#4F5962] h-[26px] mr-3 bg-slate-200 rounded animate-pulse'></p>
                                </div>
                                <div className='w-1/3'>
                                    <p className='font-normal text-sm text-[#A4A9AE]'>Customer</p>
                                    <p className='mt-1 font-normal text-sm text-[#4F5962] h-[26px] mr-3 bg-slate-200 rounded animate-pulse'></p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </CardHeader >
        </div>
    );
}

export default SetLimitViewShimmer;
