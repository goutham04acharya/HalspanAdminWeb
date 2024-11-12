import React, { useState, useEffect, useRef } from 'react';
import Shimmer from '../../../Components/Shimmers/Shimmer';
import useApi from '../../../services/CustomHook/useApi';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../../Components/Modals/ConfirmationModal/ConfirmationModal';

export function GridTable({ setVersionList, versionList, setLoading, loading, lastElemendivef, setSelectedVersion, selectedVersion, questionnaireId }) {
    const { PatchAPI } = useApi();
    const options = ['Draft', 'Testing', 'Published', 'Retired'];
    const [dropdownsOpen, setDropdownsOpen] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);
    const [pendingStatusChange, setPendingStatusChange] = useState(null);
    const dropdownRefs = useRef([]);
    const navigate = useNavigate();

    const handleDropdownClick = (version_number) => {
        setDropdownsOpen({
            [version_number]: !dropdownsOpen[version_number],
        });
    };

    const handleOptionClick = async (status, questionnaire_id, version_number) => {
        const previousPublishedVersion = versionList?.data?.items.find(
            item => item.status === 'Published'
        );

        // Check if trying to publish and there's already a published version
        if (status === 'Published' && previousPublishedVersion) {
            setPendingStatusChange({
                status,
                questionnaire_id,
                version_number,
                previousPublishedVersion
            });
            setModalOpen(true);
            // Close dropdown
            setDropdownsOpen((prev) => ({
                ...prev,
                [version_number]: false,
            }));
            return;
        }

        setDropdownsOpen((prev) => ({
            ...prev,
            [version_number]: false,
        }));
        // For non-publish status changes or when no previous published version exists
        await updateVersionStatus(status, questionnaire_id, version_number);
    };

    const updateVersionStatus = async (status, questionnaire_id, version_number, previousPublishedVersion = null) => {
        setLoading(true);
        try {
            // If publishing and there's a previous published version, retire it first
            if (status === 'Published' && previousPublishedVersion) {
                await PatchAPI(
                    `questionnaires/status/${questionnaire_id}/${previousPublishedVersion.version_number}`,
                    { status: 'Retired' }
                );

                // Update version list state for retired version
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

            // Update version list state for new status
            setVersionList((prevVersionList) => {
                const updatedVersions = prevVersionList.data.items.map((item) => {
                    if (item.version_number === version_number) {
                        return { ...item, status };
                    }
                    return item;
                });
                return { ...prevVersionList, data: { ...prevVersionList.data, items: updatedVersions } };
            });

        } catch (error) {
            console.error('Error updating status:', error);
        }
        setLoading(false);
    };

    const handleConfirmPublish = async () => {
        if (pendingStatusChange) {
            const { status, questionnaire_id, version_number, previousPublishedVersion } = pendingStatusChange;
            await updateVersionStatus(status, questionnaire_id, version_number, previousPublishedVersion);
        }
        setModalOpen(false);
        setPendingStatusChange(null);
    };

    const handleCancel = () => {
        setModalOpen(false);
        setPendingStatusChange(null);
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
                return '-';
        }
    };

    return (
        <>
            <div className='overflow-auto scrollbar_gray h-customh11'>
                <div className='flex flex-col'>
                    <div className='sticky top-0 bg-white z-[99]'>
                        <div className='flex'>
                            <div className='min-w-[300px] text-start px-10 py-6 font-medium text-base text-[#2B333B]'>NAME</div>
                            <div className='min-w-[300px] text-start px-10 py-6 font-medium text-base text-[#2B333B]'>LAST EDITED</div>
                            <div className='min-w-[300px] bg-white text-start px-10 py-6 font-medium text-base text-[#2B333B]'>EDITED BY</div>
                            <div className='min-w-[300px] bg-white text-start px-10 py-6 font-medium text-base text-[#2B333B]'>STATUS</div>
                        </div>
                    </div>
                    {loading
                        ? <Shimmer column={4} row={10} firstIndex version />
                        : <div className='bg-white'>
                            {versionList?.data?.items.sort((a, b) => b.version_number - a.version_number).map((versionListInfo, index) => (
                                <React.Fragment key={index}>
                                    <div className='rounded-[10px] mt-[10px] flex w-full relative' ref={el => dropdownRefs.current[index] = el}>
                                        <div className='py-6 text-start truncate min-w-[300px] bg-[#F4F6FA] px-10 rounded-tl-[10px] rounded-bl-[10px] font-semibold text-base text-[#2B333B] cursor-pointer underline'>
                                            <a data-testid={`version-${index}`} onClick={() => navigate(`/questionnaries/create-questionnary/questionnary-form/${versionListInfo?.questionnaire_id}/${versionListInfo?.version_number}`)}>Version {versionListInfo?.version_number}</a>
                                        </div>
                                        <div className='py-6 text-start truncate min-w-[300px] bg-[#F4F6FA] px-10 font-normal text-base text-[#2B333B] flex flex-col justify-center'>
                                            {new Date(versionListInfo?.updated_at * 1000).toLocaleDateString('default', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </div>
                                        <div className='py-6 text-start truncate min-w-[300px] bg-[#F4F6FA] px-10 font-normal text-base text-[#2B333B] flex flex-col justify-center'>
                                            {versionListInfo?.updated_by?.name || '-'}
                                        </div>
                                        <div className='py-6 text-start truncate min-w-[300px] bg-[#F4F6FA] px-10 rounded-tr-[10px] rounded-br-[10px] font-normal text-base text-[#2B333B]'>
                                            {versionListInfo?.status ? (
                                                <div>
                                                    {(versionListInfo?.status === 'Draft' || versionListInfo?.status === 'Testing') ? (
                                                        <div className='flex w-[164px] h-[36px] border border-[#AEB3B7] rounded px-[18px] bg-white items-center cursor-pointer'
                                                            onClick={() => handleDropdownClick(versionListInfo?.version_number)}>
                                                            {loading ? <Shimmer column={1} row={1} dropdown /> : <input
                                                                type="text"
                                                                data-testid="status"
                                                                id={versionListInfo?.version_number}
                                                                value={versionListInfo?.status}
                                                                className={`w-full placeholder:font-normal placeholder:text-base outline-0 border-0 cursor-pointer`}
                                                                readOnly
                                                            />}
                                                            <img
                                                                src="/Images/open-status.svg"
                                                                alt="open-filter"
                                                                className={`w-5 transition-transform duration-300 text-[#2B333B] ${dropdownsOpen[versionListInfo?.version_number] ? 'rotate-180' : 'rotate-0'}`}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className={`py-2 px-4 rounded-[15px] ${getStatusStyles(versionListInfo?.status)}`}>
                                                            {versionListInfo?.status}
                                                        </span>
                                                    )}
                                                    {dropdownsOpen[versionListInfo?.version_number] && (
                                                        <ul className={`absolute bg-white border border-[#AEB3B7] mt-1 w-[164px] ${versionList?.data?.items.length > 2 ? ((index >= versionList?.data?.items.length - 2) ? 'top-[-145px]' : 'top-[58px]') : 'top-[58px]'} z-10`}>
                                                            {options.map(option => (
                                                                <li key={option}
                                                                    data-testid={`${option}`}
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
                                    <div ref={lastElemendivef} className='h-1' />
                                </React.Fragment>
                            ))}
                        </div>
                    }
                </div>
            </div>
            {isModalOpen && <ConfirmationModal
                setModalOpen={setModalOpen}
                isOpen={isModalOpen}
                Button1text='Publish'
                Button2text='Cancel'
                handleButton2={handleCancel}
                handleButton1={handleConfirmPublish}
                text="Confirm Publishing"
                subText="Another version is already published. Proceeding will retire the existing published version. Do you want to continue?"
                button1Style='border border-[#2B333B] bg-[#2B333B] hover:bg-[#000000]'
                src={`testing-error`}
                loading={loading}
                publishedStatus
            />}
        </>
    );
}

export default GridTable;