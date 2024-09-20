import React, { useState, useEffect } from 'react';
import Shimmer from '../../../Components/Shimmers/Shimmer';
import useApi from '../../../services/CustomHook/useApi';
import FilterDropdown from '../../../Components/InputField/FilterDropdown';
import { useParams } from 'react-router-dom';

function Table({
    setVersionList,
    versionList,
    loading,
    lastElementRef
}) {
    const { PatchAPI } = useApi();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const options = ['Draft', 'Testing', 'Published', 'Retired'];
    // const { questionnaire_id, version_number } = useParams();
    const [dropdownsOpen, setDropdownsOpen] = useState({});

    const handleDropdownClick = (event, version_number) => {
        setDropdownsOpen((prev) => ({
            ...prev,
            [version_number]: !prev[version_number], // Toggle the specific dropdown
        }));
    };
    useEffect(() => {
        // Set selected option based on the versionList's status after loading the data
        if (versionList?.data?.items?.length) {
            const initialStatus = versionList?.data?.items[0]?.status || 'Draft';
            setSelectedOption(initialStatus);
        }
    }, [versionList]);

    // const handleDropdownClick = (event, version_number) => {
    //     console.log(version_number)
    //     if ((version_number && event === 'Draft') || (version_number && event === 'Testing')) {
    //         setDropdownOpen(!isDropdownOpen);
    //         console.log(isDropdownOpen)
    //     }
    // };

    const handleOptionClick = async (status, questionnaire_id, version_number) => {
        const previousPublishedVersion = versionList?.data?.items.find(
            item => item.status === 'Published'
        );
        
        // Set the dropdown to close after selecting an option
        setDropdownsOpen((prev) => ({
            ...prev,
            [version_number]: false, // Close the dropdown for this version
        }));
    
        try {
            // If the selected status is "Published" and there's a previous "Published" version
            if (status === 'Published' && previousPublishedVersion) {
                // Update the previous published version to "Retired"
                await PatchAPI(
                    `questionnaires/status/${questionnaire_id}/${previousPublishedVersion.version_number}`,
                    { status: 'Retired' }
                );
    
                // Update the version list state to reflect the retired version
                setVersionList((prevVersionList) => {
                    const updatedVersions = prevVersionList.data.items.map((item) => {
                        if (item.version_number === previousPublishedVersion.version_number) {
                            return { ...item, status: 'Retired' };
                        }
                        return item;
                    });
                    return { ...prevVersionList, data: { ...prevVersionList.data, items: updatedVersions } };
                });
            }
    
            // Update the newly selected version's status
            await PatchAPI(
                `questionnaires/status/${questionnaire_id}/${version_number}`,
                { status }
            );
    
            // Update the version list state to reflect the new status
            setVersionList((prevVersionList) => {
                const updatedVersions = prevVersionList.data.items.map((item) => {
                    if (item.version_number === version_number) {
                        return { ...item, status };
                    }
                    return item;
                });
                return { ...prevVersionList, data: { ...prevVersionList.data, items: updatedVersions } };
            });
    
            console.log('Status updated');
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };
    

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
                                    <td className='py-6 text-start truncate max-w-[100px] bg-[#F4F6FA] px-10 rounded-tl-[10px] rounded-bl-[10px] font-semibold text-base text-[#2B333B] cursor-pointer'><u>Version {versionListInfo?.version_number}</u></td>
                                    <td className='py-6 text-start truncate max-w-[100px] bg-[#F4F6FA] px-10 font-normal text-base text-[#2B333B]'>{new Date(versionListInfo?.updated_at * 1000).toLocaleDateString('default', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                    </td>
                                    <td className='py-6 text-start truncate max-w-[100px] bg-[#F4F6FA] px-10 font-normal text-base text-[#2B333B]'>{versionListInfo?.updated_by?.name}</td>
                                    <td className='py-6 text-start truncate max-w-[100px] bg-[#F4F6FA] px-10 rounded-tr-[10px] rounded-br-[10px] font-normal text-base text-[#2B333B]'>
                                        {versionListInfo?.status
                                            ? (
                                                <div className=''>
                                                    {(versionListInfo?.status === 'Draft' || versionListInfo?.status === 'Testing')
                                                        ? (
                                                            <div className='flex w-[164px] h-[36px] relative'>
                                                                <input
                                                                    type="text"
                                                                    id={versionListInfo?.version_number}
                                                                    // placeholder={selectedOption}
                                                                    onClick={(e) => handleDropdownClick(versionListInfo?.status, versionListInfo?.version_number)}
                                                                    value={versionListInfo?.status}
                                                                    className={`border w-full border-[#AEB3B7] outline-0 rounded px-[18px] placeholder:font-normal placeholder:text-base`}
                                                                    readOnly
                                                                />
                                                                <img
                                                                    src="/Images/open-status.svg"
                                                                    alt="open-filter"
                                                                    onClick={() => handleDropdownClick(versionListInfo?.status, versionListInfo?.version_number)}
                                                                    className={`absolute mt-3 right-5 transition-transform duration-300 text-[#2B333B] ${dropdownsOpen[versionListInfo?.version_number] ? 'rotate-180' : 'rotate-0'}`}
                                                                />
                                                            </div>
                                                        )
                                                        : (
                                                            <span className={`py-2 px-4 rounded-[15px] ${getStatusStyles(versionListInfo?.status)}`}>
                                                                {versionListInfo?.status}
                                                            </span>
                                                        )}
                                                    {dropdownsOpen[versionListInfo?.version_number] && (versionListInfo?.status === 'Draft' || versionListInfo?.status === 'Testing') && (
                                                        <ul className="absolute bg-white border border-[#AEB3B7] mt-1 w-[164px] z-[100000]">
                                                            {options.map(option => (
                                                                <li key={option}
                                                                    className='py-2 px-4 cursor-pointer hover:bg-[#F4F6FA]'
                                                                    onClick={() => handleOptionClick(option, versionListInfo?.questionnaire_id, versionListInfo?.version_number)}>
                                                                    {option}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}

                                                </div>
                                            )
                                            : (
                                                <span>
                                                    -
                                                </span>
                                            )}
                                    </td>
                                </tr>
                                <tr className='h-4 bg-white'></tr>
                                <div ref={lastElementRef} className='h-1' />
                            </React.Fragment>
                        ))}
                    </tbody>
                }
            </table>
        </div>
    )
}

export default Table;
