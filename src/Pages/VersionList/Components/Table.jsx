import React from 'react'
import Shimmer from '../../../Components/Shimmers/Shimmer';


function Table({
    setVersionList,
    versionList,
    loading,
    lastElementRef

}) {
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
        <div className='overflow-auto default-sidebar h-customh11'>
            <table>
                <thead className='sticky top-0 bg-white z-[99]'>
                    <th className='min-w-[300px] text-start px-10 py-6 font-medium text-base text-[#2B333B]'>NAME</th>
                    <th className='min-w-[300px] text-start px-10 py-6 font-medium text-base text-[#2B333B]'>LAST EDITED</th>
                    <th className='min-w-[300px] text-start px-10 py-6 font-medium text-base text-[#2B333B]'>EDITED BY</th>
                    <th className='min-w-[300px] text-start px-10 py-6 font-medium text-base text-[#2B333B]'>STATUS</th>
                </thead>
                {loading
                    ? <Shimmer column={4} row={10} firstIndex />
                    : <tbody className='bg-white'>
                        {versionList?.data && versionList?.data?.items.map((versionListInfo, index) => (
                            <React.Fragment key={index}>
                                <tr className='rounded-[10px] mt-[18px]'>
                                    <td className=' py-6 text-start truncate max-w-[100px] bg-[#F4F6FA] px-10 rounded-tl-[10px] rounded-bl-[10px] font-semibold text-base text-[#2B333B] cursor-pointer'><u>Version {versionListInfo?.version_number}</u></td>
                                    <td className=' py-6 text-start truncate max-w-[100px] bg-[#F4F6FA] px-10 font-normal text-base text-[#2B333B]'>{new Date(versionListInfo?.updated_at * 1000).toLocaleDateString('default', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                    </td>
                                    <td className=' py-6 text-start truncate max-w-[100px] bg-[#F4F6FA] px-10 font-normal text-base text-[#2B333B]'>{versionListInfo?.updated_by?.name}</td>
                                    <td className=' py-6 text-start truncate max-w-[100px] bg-[#F4F6FA] px-10 rounded-tr-[10px] rounded-br-[10px] font-normal text-base text-[#2B333B]'>
                                        {versionListInfo?.status
                                            ? (
                                                <span className={`py-[4px] px-[19px] rounded-[15px] text-[16px] font-normal text-[#2B333B] capitalize ${getStatusStyles(versionListInfo?.status)} `} title={`${getStatusText(versionListInfo?.status)}`}>
                                                    {getStatusText(versionListInfo?.status)}
                                                </span>
                                            )
                                            : (
                                                <span className=''>
                                                    -
                                                </span>
                                            )}
                                    </td>
                                </tr>
                                <tr className='h-4 bg-white'>
                                </tr>
                                <div ref={lastElementRef} className='h-1' />
                            </React.Fragment>
                        ))}
                    </tbody>
                }
            </table>
        </div>
    )
}

export default Table