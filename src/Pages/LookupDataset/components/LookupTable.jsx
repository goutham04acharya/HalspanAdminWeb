import React, { useState } from 'react'
import Shimmer from '../../../Components/Shimmers/Shimmer';
import Image from '../../../Components/Image/Image';

function LookupTable({ loading, LookupList, lastElementRef, handleView, setDeleteModal }) {

    return (
        <div className='overflow-auto default-sidebar h-customh4'>
            <table className='w-full'>
                <thead className='sticky top-0 bg-white z-[99]'>
                    <tr>
                        <th className='min-w-[200px] text-start px-10 py-6 font-medium text-base text-[#2B333B] uppercase'>ID</th>
                        <th className='min-w-[400px] text-start py-6 font-medium text-base text-[#2B333B] uppercase'>NAME</th>
                        <th className='min-w-[200px] text-start py-6 font-medium text-base text-[#2B333B] uppercase'>ACTIONS</th>
                    </tr>
                </thead>
                {loading
                    ? <Shimmer column={3} row={10} firstIndex />
                    : <tbody className='bg-white'>
                        {LookupList && LookupList.map((LookupInfo, index) => (
                            <React.Fragment key={index}>
                                <tr className='rounded-[10px] mt-[18px]'>
                                    <td className='pl-10 py-5 text-start bg-[#F4F6FA] rounded-tl-[10px] rounded-bl-[10px]'>{LookupInfo?.lookup_id}</td>
                                    <td className='py-5 text-start font-semibold max-w-[100px] text-base text-[#2B333B] pr-6 bg-[#F4F6FA]' title={LookupInfo?.name}>{LookupInfo?.name}</td>
                                    <td className='py-5 text-center bg-[#F4F6FA] flex justify-start items-center gap-4'>
                                        <p
                                            className='underline cursor-pointer'
                                            onClick={() => handleView(LookupInfo?.lookup_id, LookupInfo?.name, LookupInfo?.choices)}
                                        >
                                            View
                                        </p>
                                        <Image testId="delete" onClick={() => setDeleteModal({ id: LookupInfo?.lookup_id, open: true})} src='delete' className='cursor-pointer' />
                                    </td>
                                </tr>
                                <tr className='h-4 bg-white'></tr>
                                <tr ref={lastElementRef} className='h-1' />
                            </React.Fragment>
                        ))}
                    </tbody>}
            </table>
        </div>
    )
}

export default LookupTable