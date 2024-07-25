import React, { useState } from 'react'
import PageNavigation from '../../../Components/PageNavigation/PageNavigation'
import Shimmer from '../../../Components/Shimmers/Shimmer';

function Table({ loading, QueList }) {
    console.log(QueList?.items);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Draft':
                return 'bg-[#D6DDEC] text-[#2B333B]';
            case 'Testing':
                return 'bg-[#F8F0DE] text-[#2B333B]';
            case 'Published':
                return 'bg-[#DEF4E1] text-[#2B333B]';
            case 'Retired':
                return 'bg-[#E8D7D7] text-[#2B333B]';
            default:
                return ''; // Default styles when status doesn't match any condition
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Draft':
                return 'Draft';
            case 'Testing':
                return 'Testing';
            case 'Published':
                return 'Published';
            case 'Retired':
                return 'Retired';
            default:
                return '-'; // Default text when status doesn't match any condition
        }
    };

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
                {loading
                    ? <Shimmer column={6} row={10} firstIndex />
                    : <tbody className='bg-white'>
                        {QueList?.items?.map((QueInfo, index) => (
                            <><tr key={index} className='rounded-[10px] mt-[18px]'>
                                <td className='pl-10 py-6 text-start bg-[#F4F6FA]'>{QueInfo?.questionnaire_id}</td>
                                <td className=' py-6 text-start font-semibold text-base text-[#2B333B] cursor-pointer bg-[#F4F6FA]'><u>{QueInfo?.internal_name}</u></td>
                                <td className=' py-6 text-start truncate w-[100px] bg-[#F4F6FA]' title={QueInfo?.public_name}>{QueInfo?.public_name}</td>
                                <td className={`py-6 text-start bg-[#F4F6FA] ${getStatusStyles(QueInfo.status)}`} title={`${getStatusText(QueInfo.status)}`}>{getStatusText(QueInfo?.status) || '-'}</td>
                                <td className=' py-6 text-start bg-[#F4F6FA]'>{QueInfo?.asset_type}</td>
                                <td className=' py-6 text-start bg-[#F4F6FA]'>{QueInfo?.description}</td>
                            </tr><tr className='h-4 bg-white'></tr></>))}
                    </tbody>}
            </table>
        </div>
    )
}

export default Table