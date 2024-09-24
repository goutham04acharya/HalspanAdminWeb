import React, { useState, useEffect, useRef } from 'react';
import Shimmer from '../../../Components/Shimmers/Shimmer';
import useApi from '../../../services/CustomHook/useApi';

export function GridTable({ setVersionList, versionList, loading, lastElemendivef }) {
    const { PatchAPI } = useApi();
    const options = ['Draft', 'Testing', 'Published', 'Retired'];
    const [dropdownsOpen, setDropdownsOpen] = useState({});
    const dropdownRefs = useRef([]);

    const handleDropdownClick = (version_number) => {
        setDropdownsOpen((prev) => ({
            ...prev,
            [version_number]: !prev[version_number],
        }));
    };

    const handleOptionClick = async (status, questionnaire_id, version_number) => {
        const previousPublishedVersion = versionList?.data?.items.find(
            item => item.status === 'Published'
        );
        try {
            if (status === 'Published' && previousPublishedVersion) {
                await PatchAPI(
                    `questionnaires/status/${questionnaire_id}/${previousPublishedVersion.version_number}`,
                    { status: 'Retired' }
                );

                // Update version list state
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

            // Update selected version's status
            await PatchAPI(
                `questionnaires/status/${questionnaire_id}/${version_number}`,
                { status }
            );

            // Update version list state
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
        
        // Close dropdown after selecting an option
        setDropdownsOpen((prev) => ({
            ...prev,
            [version_number]: false,
        }));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRefs.current.some(ref => ref && ref.contains(event.target))) {
                return;
            }
            setDropdownsOpen({});
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='overflow-auto default-sidebar h-customh11'>
            <div className='flex flex-col'>
                <div className='sticky top-0 bg-white z-[99]'>
                    <div className='flex'>
                        <div className='min-w-[300px] text-start px-10 py-6 font-medium text-base text-[#2B333B]'>NAME</div>
                        <div className='min-w-[300px] text-start px-10 py-6 font-medium text-base text-[#2B333B]'>LAST EDITED</div>
                        <div className='min-w-[300px] text-start px-10 py-6 font-medium text-base text-[#2B333B]'>EDITED BY</div>
                        <div className='min-w-[300px] text-start px-10 py-6 font-medium text-base text-[#2B333B]'>STATUS</div>
                    </div>
                </div>
                {loading
                    ? <Shimmer column={4} row={10} firstIndex />
                    : <div className='bg-white'>
                        {versionList?.data?.items.map((versionListInfo, index) => (
                            <React.Fragment key={index}>
                                <div className='rounded-[10px] mt-[18px] flex w-full relative' ref={el => dropdownRefs.current[index] = el}>
                                    <div className='py-6 text-start truncate min-w-[300px] bg-[#F4F6FA] px-10 rounded-tl-[10px] rounded-bl-[10px] font-semibold text-base text-[#2B333B] cursor-pointer'>
                                        <u>Version {versionListInfo?.version_number}</u>
                                    </div>
                                    <div className='py-6 text-start truncate min-w-[300px] bg-[#F4F6FA] px-10 font-normal text-base text-[#2B333B]'>
                                        {new Date(versionListInfo?.updated_at * 1000).toLocaleDateString('default', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </div>
                                    <div className='py-6 text-start truncate min-w-[300px] bg-[#F4F6FA] px-10 font-normal text-base text-[#2B333B]'>
                                        {versionListInfo?.updated_by?.name}
                                    </div>
                                    <div className='py-6 text-start truncate min-w-[300px] bg-[#F4F6FA] px-10 rounded-tr-[10px] rounded-br-[10px] font-normal text-base text-[#2B333B]'>
                                        {versionListInfo?.status ? (
                                            <div>
                                                {(versionListInfo?.status === 'Draft' || versionListInfo?.status === 'Retired') && (
                                                    <div className='flex w-[164px] h-[36px] border border-[#AEB3B7] rounded px-[18px] bg-white items-center cursor-pointer'
                                                    onClick={() => handleDropdownClick(versionListInfo?.version_number)}>
                                                        <input
                                                            type="text"
                                                            id={versionListInfo?.version_number}
                                                            value={versionListInfo?.status}
                                                            className={`w-full placeholder:font-normal placeholder:text-base outline-0 border-0 cursor-pointer`}
                                                            readOnly
                                                        />
                                                        <img
                                                            src="/Images/open-status.svg"
                                                            alt="open-filter"
                                                            className={`w-5 transition-transform duration-300 text-[#2B333B] ${dropdownsOpen[versionListInfo?.version_number] ? 'rotate-180' : 'rotate-0'}`}
                                                        />
                                                    </div>
                                                )}
                                                {dropdownsOpen[versionListInfo?.version_number] && (
                                                    <ul className="absolute bg-white border border-[#AEB3B7] mt-1 w-[164px] top-[58px] z-10">
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
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </div>
                                </div>
                                <div className='h-4 bg-white'></div>
                                <div ref={lastElemendivef} className='h-1' />
                            </React.Fragment>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
}

export default GridTable;
