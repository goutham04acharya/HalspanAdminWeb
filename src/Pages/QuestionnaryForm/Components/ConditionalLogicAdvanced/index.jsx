import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { setModalOpen } from '../../../QuestionnaryForm/Components/QuestionnaryFormSlice';
import useOnClickOutside from '../../../../CommonMethods/outSideClick';
import Button2 from '../../../../Components/Button2/ButtonLight';
import Button from '../../../../Components/Button/button';



function ConditionalLogic() {
    const modalRef = useRef();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('text'); // default is 'preField'

    // Handlers to switch tabs
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleClose = () => {
        dispatch(setModalOpen(false));
    };

    useOnClickOutside(modalRef, () => {
        dispatch(setModalOpen(false));
    });

    return (
        <div className='bg-[#3931313b] w-full h-screen absolute top-0 flex flex-col items-center justify-center z-[999]'>
            <div ref={modalRef} className='w-[80%] h-[80%] mx-auto bg-white rounded-[14px] relative p-[18px] flex'>
                <div className='w-[60%]'>
                    <p className='text-start text-lg text-[#2B333B] font-semibold'>shows when...</p>
                </div>
                <div className='w-[40%]'>
                    <div className='mt-7'>
                        <div className='flex justify-between'>
                            <p
                                data-testid="pre-field-option"
                                className={`font-semibold text-base cursor-pointer ${activeTab === 'text' ? 'text-black border-b-2 border-[#000000] pb-2' : 'text-[#9FACB9]'}`}
                                onClick={() => handleTabClick('text')}
                            >
                                Text
                            </p>
                            <p
                                data-testid="post-field-option"
                                className={`font-semibold text-base cursor-pointer ${activeTab === 'number' ? 'text-black border-b-2 border-[#000000] pb-2' : 'text-[#9FACB9]'}`}
                                onClick={() => handleTabClick('number')}
                            >
                                number
                            </p>
                            <p
                                data-testid="post-field-option"
                                className={`font-semibold text-base cursor-pointer ${activeTab === 'date' ? 'text-black border-b-2 border-[#000000] pb-2' : 'text-[#9FACB9]'}`}
                                onClick={() => handleTabClick('date')}
                            >
                                date
                            </p>
                            <p
                                data-testid="post-field-option"
                                className={`font-semibold text-base cursor-pointer ${activeTab === 'file' ? 'text-black border-b-2 border-[#000000] pb-2' : 'text-[#9FACB9]'}`}
                                onClick={() => handleTabClick('file')}
                            >
                                file
                            </p>
                        </div>
                        {/* Display the Pre-field input if preField is active */}
                        {activeTab === 'text' && (
                            <div className='mt-3 p-[18px] bg-[#EFF1F8]'>
                                <p className='font-semibold text-lg text-[#2B333B]'>Common Yes/No Calculations</p>
                                <div className='mt-4'>
                                    <p className='font-semibold text-base text-[#000000]'>Equals</p>
                                    <p className='font-normal text-base text-[#000000]'>=(AssetName == "Door")</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Includes</p>
                                    <p className='font-normal text-base text-[#000000]'>=(AssetName.Includes("Door"))</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Not Equal to</p>
                                    <p className='font-normal text-base text-[#000000]'>=(AssetName != "Door")</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Does not Include</p>
                                    <p className='font-normal text-base text-[#000000]'>=(!AssetName.Includes("Door"))</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Combined Logic</p>
                                    <p className='font-normal text-base text-[#000000]'>=If ((AssetName.StartsWith("J") AND AssetName.EndsWith("th")) OR AssetLastName.Includes("th")) then "Snowing" else "Raining"</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'number' && (
                            <div className='mt-3 p-[18px] bg-[#EFF1F8]'>
                                <p className='font-semibold text-lg text-[#2B333B]'>Common Yes/No Calculations</p>
                                <div className='mt-4'>
                                    <p className='font-semibold text-base text-[#000000]'>Equals</p>
                                    <p className='font-normal text-base text-[#000000]'>=(AssetNumber = 0)</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Not Equal to</p>
                                    <p className='font-normal text-base text-[#000000]'>=(AssetNumber != 0)</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Smaller</p>
                                    <p className='font-normal text-base text-[#000000]'>=(AssetName &gt 20)</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Larger</p>
                                    <p className='font-normal text-base text-[#000000]'>=(AssetName &lt 20)</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Smaller or Equal</p>
                                    <p className='font-normal text-base text-[#000000]'>=(AssetNumber &lt= 20)</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Larger or Equal</p>
                                    <p className='font-normal text-base text-[#000000]'>=(AssetNumber &gt= 20)</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Combined Logic</p>
                                    <p className='font-normal text-base text-[#000000]'>=If ((Quantity &gt 5 AND Number1 &lt10) OR Number2 &lt20) then 50 else 10</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'date' && (
                            <div className='mt-3 p-[18px] bg-[#EFF1F8]'>
                                <p className='font-semibold text-lg text-[#2B333B]'>Common Yes/No Calculations</p>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Date is before Today</p>
                                    <p className='font-normal text-base text-[#000000]'>=(StartDate &lt "Today")</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Date is before or equal to Today</p>
                                    <p className='font-normal text-base text-[#000000]'>=StartDate &lt= Today</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Date is after Today</p>
                                    <p className='font-normal text-base text-[#000000]'>=(StartDate &gt "Today")</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Date is after or equal to Today</p>
                                    <p className='font-normal text-base text-[#000000]'>=(StartDate &gt= "Today")</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Date is with "X" days of Set date</p>
                                    <p className='font-normal text-base text-[#000000]'>=(Math.abs(startDate - setDate) == 5)</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Combined Logic</p>
                                    <p className='font-normal text-base text-[#000000]'>=If ((StartDate.getFullYear() &gt 2000 AND EndDate.getMonth() &lt 10) OR StartDate.getMonth() &lt 3 ) then 19/06/2024 else 20/04/2025</p>
                                </div>
                            </div>
                        )}
                        {/* Display the Post-field input if postField is active */}
                        {activeTab === 'file' && (
                            <div className='mt-3 p-[18px] bg-[#EFF1F8]'>
                                <p className='font-semibold text-lg text-[#2B333B]'>Common Yes/No Calculations</p>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Has Atleast One File</p>
                                    <p className='font-normal text-base text-[#000000]'>=(UploadDamagedDoor() &lt 0)</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Has No Files</p>
                                    <p className='font-normal text-base text-[#000000]'>=(UploadDamagedDoor() = 0)</p>
                                </div>
                                <div className='mt-3'>
                                    <p className='font-semibold text-base text-[#000000]'>Number of Files is</p>
                                    <p className='font-normal text-base text-[#000000]'>=(UploadDamagedDoor() = 5)</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='mt-5 flex items-center justify-between'>
                        <Button2
                        text='Cancel'
                            type='button'
                            data-testid='button1'
                            className='w-[200px] h-[50px] text-black font-semibold text-base rounded'
                            onClick={() => handleClose()}
                        >
                        </Button2>
                        <Button
                            text='Save'
                            type='button'
                            data-testid='cancel'
                            className='w-[200px] h-[50px] border text-white border-[#2B333B] rounded bg-[#2B333B] text-base font-semibold'
                        >
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConditionalLogic;
