import React from 'react'

function Table() {
    return (
        <div className='overflow-auto default-sidebar h-customh4'>
            <table>
                <thead>
                    <th className='min-w-[200px] text-start px-10 py-6 font-medium text-base text-[#2B333B]'>ID</th>
                    <th className='min-w-[300px] text-start py-6 font-medium text-base text-[#2B333B]'>Internal Name</th>
                    <th className='min-w-[500px] text-start py-6 font-medium text-base text-[#2B333B]'>Public Name</th>
                    <th className='min-w-[200px] text-start py-6 font-medium text-base text-[#2B333B]'>Status</th>
                    <th className='min-w-[200px] text-start py-6 font-medium text-base text-[#2B333B]'>asset type</th>
                    <th className='min-w-[500px] text-start py-6 font-medium text-base text-[#2B333B]'>Description</th>
                </thead>
                <tbody>
                    <tr className='bg-[#F4F6FA] rounded-[10px]'>
                        <td className='pl-10 py-6 text-start'>14573</td>
                        <td className=' py-6 text-start font-semibold text-base text-[#2B333B]'><u>Inspection A</u></td>
                        <td className=' py-6 text-start truncate' title='public_name'>Lorem ipsum dolor sit amet, cons</td>
                        <td className=' py-6 text-start'>Draft</td>
                        <td className=' py-6 text-start'>Door</td>
                        <td className=' py-6 text-start'>Lorem ipsum dolor sit amet, cons</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Table