import React from 'react'

function StaticDetails({
    activeTab,
    setActiveTab,
    handleTabClick,
}) {
    return (
        <div className=''>
            <div className='mt-4'>
                <div className='flex justify-between'>
                    <p
                        data-testid="pre-field-option"
                        className={`font-semibold text-base text-center cursor-pointer w-1/4 ${activeTab === 'text' ? 'text-black border-b-2 border-[#000000] pb-2 w-1/4 text-center' : 'text-[#9FACB9] border-b border-[#DDDDDD]'}`}
                        onClick={() => handleTabClick('text')}
                    >
                        Text
                    </p>
                    <p
                        data-testid="post-field-option"
                        className={`font-semibold text-base text-center cursor-pointer w-1/4 ${activeTab === 'number' ? 'text-black border-b-2 border-[#000000] pb-2 w-1/4 text-center' : 'text-[#9FACB9] border-b border-[#DDDDDD]'}`}
                        onClick={() => handleTabClick('number')}
                    >
                        Number
                    </p>
                    <p
                        data-testid="post-field-option"
                        className={`font-semibold text-base text-center cursor-pointer w-1/4 ${activeTab === 'date' ? 'text-black border-b-2 border-[#000000] pb-2 w-1/4 text-center' : 'text-[#9FACB9] border-b border-[#DDDDDD]'}`}
                        onClick={() => handleTabClick('date')}
                    >
                        Date/Time
                    </p>
                    <p
                        data-testid="post-field-option"
                        className={`font-semibold text-base text-center cursor-pointer w-1/4 ${activeTab === 'file' ? 'text-black border-b-2 border-[#000000] pb-2 w-1/4 text-center' : 'text-[#9FACB9] border-b border-[#DDDDDD]'}`}
                        onClick={() => handleTabClick('file')}
                    >
                        File
                    </p>
                </div>
                {/* Display the Pre-field input if preField is active */}
                {activeTab === 'text' && (
                    <div className='mt-3 p-[18px] bg-[#EFF1F8] h-customh12'>
                        <p className='font-semibold text-lg text-[#2B333B]'>Common Yes/No Calculations</p>
                        <div className='mt-4'>
                            <p className='font-semibold text-base text-[#000000]'>Equals</p>
                            <p className='font-normal text-base text-[#000000]'>=(AssetName == "Door")</p>
                        </div>
                        <div className='mt-4'>
                            <p className='font-semibold text-base text-[#000000]'>Includes</p>
                            <p className='font-normal text-base text-[#000000]'>=(AssetName.Includes("Door"))</p>
                        </div>
                        <div className='mt-4'>
                            <p className='font-semibold text-base text-[#000000]'>Not Equal to</p>
                            <p className='font-normal text-base text-[#000000]'>=(AssetName != "Door")</p>
                        </div>
                        <div className='mt-4'>
                            <p className='font-semibold text-base text-[#000000]'>Does not Include</p>
                            <p className='font-normal text-base text-[#000000]'>=(!AssetName.Includes("Door"))</p>
                        </div>
                        <div className='mt-4'>
                            <p className='font-semibold text-base text-[#000000]'>Combined Logic</p>
                            <p className='font-normal text-base text-[#000000]'>=If ((AssetName.StartsWith("J") AND AssetName.EndsWith("th")) OR AssetLastName.Includes("th")) </p>
                        </div>
                    </div>
                )}
                {activeTab === 'number' && (
                    <div className='mt-3 p-[18px] bg-[#EFF1F8] h-customh12'>
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
                            <p className='font-normal text-base text-[#000000]'>=(AssetName {'<'} 20)</p>
                        </div>
                        <div className='mt-3'>
                            <p className='font-semibold text-base text-[#000000]'>Larger</p>
                            <p className='font-normal text-base text-[#000000]'>=(AssetName {'>'} 20)</p>
                        </div>
                        <div className='mt-3'>
                            <p className='font-semibold text-base text-[#000000]'>Smaller or Equal</p>
                            <p className='font-normal text-base text-[#000000]'>=(AssetNumber {'<='} 20)</p>
                        </div>
                        <div className='mt-3'>
                            <p className='font-semibold text-base text-[#000000]'>Larger or Equal</p>
                            <p className='font-normal text-base text-[#000000]'>=(AssetNumber {'>='} 20)</p>
                        </div>
                    </div>
                )}
                {activeTab === 'date' && (
                    <div className='mt-3 p-[18px] bg-[#EFF1F8] h-customh12'>
                        <p className='font-semibold text-lg text-[#2B333B]'>Common Yes/No Calculations</p>
                        <div className='mt-3'>
                            <p className='font-semibold text-base text-[#000000]'>Date is before Today</p>
                            <p className='font-normal text-base text-[#000000]'>=(StartDate &lt; "Today")</p>
                        </div>
                        <div className='mt-3'>
                            <p className='font-semibold text-base text-[#000000]'>Date is before or equal to Today</p>
                            <p className='font-normal text-base text-[#000000]'>=StartDate &lt;= Today</p>
                        </div>
                        <div className='mt-3'>
                            <p className='font-semibold text-base text-[#000000]'>Date is after Today</p>
                            <p className='font-normal text-base text-[#000000]'>=(StartDate &gt; "Today")</p>
                        </div>
                        <div className='mt-3'>
                            <p className='font-semibold text-base text-[#000000]'>Date is after or equal to Today</p>
                            <p className='font-normal text-base text-[#000000]'>=(StartDate &gt;= "Today")</p>
                        </div>
                        <div className='mt-3'>
                            <p className='font-semibold text-base text-[#000000]'>Date is with "X" days of Set date</p>
                            <p className='font-normal text-base text-[#000000]'>=(Math.abs(startDate - setDate) == 5)</p>
                        </div>
                    </div>
                )}
                {/* Display the Post-field input if postField is active */}
                {activeTab === 'file' && (
                    <div className='mt-3 p-[18px] bg-[#EFF1F8] h-customh12'>
                        <p className='font-semibold text-lg text-[#2B333B]'>Common Yes/No Calculations</p>
                        <div className='mt-3'>
                            <p className='font-semibold text-base text-[#000000]'>Has Atleast One File</p>
                            <p className='font-normal text-base text-[#000000]'>=(UploadDamagedDoor() &lt; 0)</p>
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
        </div>
    )
}

export default StaticDetails