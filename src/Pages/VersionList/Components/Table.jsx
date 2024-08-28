import React from 'react'
import Shimmer from '../../../Components/Shimmers/Shimmer';


function Table({
    setVersionList,
    versionList,
    loading

}) {
    console.log(versionList?.data, 'versionList?.data')
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
                    <th className='min-w-[200px] text-start px-10 py-6 font-medium text-base text-[#2B333B]'>NAME</th>
                    <th className='min-w-[300px] text-start py-6 font-medium text-base text-[#2B333B]'>LAST EDITED</th>
                    <th className='min-w-[400px] text-start py-6 font-medium text-base text-[#2B333B]'>EDITED BY</th>
                    <th className='min-w-[200px] text-start py-6 font-medium text-base text-[#2B333B] pl-[18px]'>STATUS</th>
                </thead>
                {loading
                    ? <Shimmer column={4} row={10} firstIndex />
                    : <tbody className='bg-white'>
                        {versionList?.data && versionList?.data?.items.map((versionListInfo, index) => (
                            <React.Fragment key={index}>
                                <tr className='rounded-[10px] mt-[18px]'>
                                    <td className=' py-6 text-start truncate max-w-[100px] bg-[#F4F6FA] pl-6 rounded-tl-[10px] rounded-bl-[10px]'>Version{versionListInfo?.version_number}</td>
                                    <td className=' py-6 text-start truncate max-w-[100px] bg-[#F4F6FA] pr-6' >{versionListInfo?.updated_at}</td>
                                    <td className=' py-6 text-start truncate max-w-[100px] bg-[#F4F6FA] pr-6' >{versionListInfo?.updated_by?.name}</td>
                                    <td className=' py-6 text-start truncate max-w-[100px] bg-[#F4F6FA] pr-6 rounded-bl-[10px] rounded-br-[10px]' >
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
                            </React.Fragment>
                        ))}
                    </tbody>
                }
            </table>
        </div>
    )
}

export default Table