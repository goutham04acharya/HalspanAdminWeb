import React, { useState } from 'react'
import Shimmer from '../../../Components/Shimmers/Shimmer';

function Table({ loading, QueList, lastElementRef }) {

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
                return '-'; // Default styles when status doesn't match any condition
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
                <thead className='sticky top-0 bg-white z-[99]'>
                    <th className='min-w-[200px] text-start px-10 py-6 font-medium text-base text-[#2B333B]'>ID</th>
                    <th className='min-w-[300px] text-start py-6 font-medium text-base text-[#2B333B]'>INTERNAL NAME</th>
                    <th className='min-w-[400px] text-start py-6 font-medium text-base text-[#2B333B]'>PUBLIC NAME</th>
                    <th className='min-w-[200px] text-start py-6 font-medium text-base text-[#2B333B]'>STATUS</th>
                    <th className='min-w-[200px] text-start py-6 font-medium text-base text-[#2B333B]'>ASSET TYPE type</th>
                    <th className='min-w-[500px] text-start py-6 font-medium text-base text-[#2B333B]'>DESCRIPTION</th>
                </thead>
                {loading
                    ? <Shimmer column={6} row={10} firstIndex />
                    : <tbody className='bg-white'>
                        {QueList && QueList.map((QueInfo, index) => (
                            <React.Fragment key={index}>
                                <tr className='rounded-[10px] mt-[18px]'>
                                    <td className='pl-10 py-6 text-start bg-[#F4F6FA] rounded-tl-[10px] rounded-bl-[10px]'>{QueInfo?.questionnaire_id}</td>
                                    <td className=' py-6 text-start font-semibold truncate max-w-[100px] text-base text-[#2B333B] pr-6 cursor-pointer bg-[#F4F6FA]' title={QueInfo?.internal_name}><u>{QueInfo?.internal_name}</u></td>
                                    <td className=' py-6 text-start truncate max-w-[100px] bg-[#F4F6FA] pr-6' title={QueInfo?.public_name}>{QueInfo?.public_name}</td>
                                    <td data-testid="status" className='py-2 px-[10px] bg-[#F4F6FA]'>
                                        {QueInfo?.status
                                            ? (
                                                <span className={`py-[4px] px-[19px] rounded-[15px] text-[16px] font-normal text-[#2B333B] capitalize ${getStatusStyles(QueInfo?.status)} `} title={`${getStatusText(QueInfo?.status)}`}>
                                                    {getStatusText(QueInfo?.status)}
                                                </span>
                                            )
                                            : (
                                                <span className=''>
                                                    -
                                                </span>
                                            )}
                                    </td>
                                    {/* <td className={`py-6 text-start bg-[#F4F6FA]  px-6 ${getStatusStyles(QueInfo?.status)}`} title={`${getStatusText(QueInfo?.status)}`}>{getStatusText(QueInfo?.status) || '-'}</td> */}
                                    <td className=' py-6 text-start bg-[#F4F6FA] pr-6'>{QueInfo?.asset_type}</td>
                                    <td className=' py-6 text-start bg-[#F4F6FA] pr-6 truncate max-w-[200px] rounded-tr-[10px] rounded-br-[10px]'>{QueInfo?.description}</td>
                                </tr>
                                <tr className='h-4 bg-white'>
                                </tr>
                                <div ref={lastElementRef} className='h-1' />
                            </React.Fragment>
                        ))}
                    </tbody>}
            </table>
        </div>
    )
}

export default Table