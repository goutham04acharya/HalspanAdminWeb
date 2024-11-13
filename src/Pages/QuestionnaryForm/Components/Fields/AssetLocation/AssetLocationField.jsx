// import React, { useState } from 'react';
// import Image from '../../../../../Components/Image/Image';
// import InfinateDropdown from '../../../../../Components/InputField/InfinateDropdown';

// const AssetLocationField = ({
//     label,
//     type,
//     textId,
//     HelpText,
//     value,
//     className,
//     handleChange,
//     fieldSettingParameters,
//     testId,
//     preview,
//     question
// }) => {
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const [selectedSite, setSelectedSite] = useState(null);
//     const [selectedLocation, setSelectedLocation] = useState(null);

//     const siteOptions = [
//         { label: 'Site 1', value: 1 },
//         { label: 'Site 2', value: 2 },
//         { label: 'Site 3', value: 3 },
//         { label: 'Site 4', value: 4 },
//         { label: 'Site 5', value: 5 }
//     ];

//     const locationOptions = [
//         { label: 'Location 1', value: 1, site: 1 },
//         { label: 'Location 2', value: 2, site: 1 },
//         { label: 'Location 3', value: 3, site: 2 },
//         { label: 'Location 4', value: 4, site: 2 },
//         { label: 'Location 5', value: 5, site: 3 }
//     ];

//     const levelOptions = [
//         { label: 'Level 1', value: 1, location: 1 },
//         { label: 'Level 2', value: 2, location: 1 },
//         { label: 'Level 3', value: 3, location: 2 },
//         { label: 'Level 4', value: 4, location: 3 },
//         { label: 'Level 5', value: 5, location: 4 }
//     ];

//     const handleSiteChange = (siteId) => {
//         setSelectedSite(siteId);
//     };

//     const handleLocationChange = (locationId) => {
//         setSelectedLocation(locationId);
//     };

//     return (
//         <div data-testid="asset-location">
//             <label
//                 data-testid="label-name"
//                 htmlFor={textId}
//                 title={preview ? question?.label : fieldSettingParameters?.label}
//                 className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] ${(preview ? question?.label : fieldSettingParameters?.label) === '' ? 'h-[20px]' : 'h-auto'}`}
//                 maxLength={100}
//             >
//                 {preview ? question?.label : fieldSettingParameters?.label}
//             </label>
//             {preview && (
//                 <div className={`relative ${preview ? 'mt-3' : 'mt-5'}`}>
//                     <label htmlFor={textId} className='font-medium text-base text-black'>Site</label>
//                     <InfinateDropdown
//                         label='Site'
//                         testID='input'
//                         type={type}
//                         id='Site'
//                         isDropdownOpen={isDropdownOpen}
//                         setDropdownOpen={setIsDropdownOpen}
//                         options={siteOptions}
//                         className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
//                         placeholder='Site'
//                         onChange={(siteId) => handleSiteChange(siteId)}
//                     />
//                     <div className='absolute right-4 top-[74%] -translate-y-1/2'>
//                         <Image src='down' />
//                     </div>
//                 </div>
//             )}
//             {selectedSite && (
//                 <div className={`relative ${preview ? 'mt-5' : 'mt-8'}`}>
//                     <label htmlFor={textId} className='font-medium text-base text-black'>Location</label>
//                     <InfinateDropdown
//                         label='Location'
//                         testID='input'
//                         type={type}
//                         id='Location'
//                         isDropdownOpen={isDropdownOpen}
//                         setDropdownOpen={setIsDropdownOpen}
//                         options={locationOptions.filter(location => location.site === selectedSite)}
//                         className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
//                         placeholder='Location'
//                         onChange={(locationId) => handleLocationChange(locationId)}
//                     />
//                     <div className='absolute right-4 top-[74%] -translate-y-1/2'>
//                         <Image src='down' />
//                     </div>
//                 </div>
//             )}
//             {selectedLocation && (
//                 <div className={`relative ${preview ? 'mt-4' : 'mt-8'}`}>
//                     <label htmlFor={textId} className='font-medium text-base text-black'>Level</label>
//                     <InfinateDropdown
//                         label='Level'
//                         testID='input'
//                         type={type}
//                         id='Level'
//                         isDropdownOpen={isDropdownOpen}
//                         setDropdownOpen={setIsDropdownOpen}
//                         options={levelOptions.filter(level => level.location === selectedLocation)}
//                         className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
//                         placeholder='Level'
//                     />
//                     <div className='absolute right-4 top-[74%] -translate-y-1/2'>
//                         <Image src='down' />
//                     </div>
//                 </div>
//             )}
//             {!preview && <><div className={`relative ${preview ? 'mt-3' : 'mt-5'}`}>
//                 <label htmlFor={textId} className='font-medium text-base text-black'>Site</label>
//                 <input
//                     data-testid='input'
//                     type={type}
//                     id={textId}
//                     value={value}
//                     className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
//                     placeholder='Select'
//                     onClick={handleChange} />
//                 <div className='absolute right-4 top-[74%] -translate-y-1/2'>
//                     <Image src='down' />
//                 </div>
//             </div><div className={`relative ${preview ? 'mt-5' : 'mt-8'}`}>
//                     <label htmlFor={textId} className='font-medium text-base text-black'>Building</label>
//                     <input
//                         data-testid='input'
//                         type={type}
//                         id={textId}
//                         value={value}
//                         className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
//                         placeholder='Select'
//                         onClick={handleChange} />
//                     <div className='absolute right-4 top-[74%] -translate-y-1/2'>
//                         <Image src='down' />
//                     </div>
//                 </div><div className={`relative ${preview ? 'mt-4' : 'mt-8'}`}>
//                     <label htmlFor={textId} className='font-medium text-base text-black'>Floor</label>
//                     <input
//                         data-testid='input'
//                         type={type}
//                         id={textId}
//                         value={value}
//                         className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
//                         placeholder='Select'
//                         onClick={handleChange} />
//                     <div className='absolute right-4 top-[74%] -translate-y-1/2'>
//                         <Image src='down' />
//                     </div>
//                 </div></>}
//             <p
//                 data-testid="help-text"
//                 className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
//                 title={preview ? question?.help_text : fieldSettingParameters?.helptext}
//             >
//                 {preview ? question?.help_text : fieldSettingParameters?.helptext}
//             </p>
//         </div>
//     );
// };

// export default AssetLocationField;
import React, { useState } from 'react';
import Image from '../../../../../Components/Image/Image';
import InfinateDropdown from '../../../../../Components/InputField/InfinateDropdown';

const AssetLocationField = ({
    label,
    type,
    textId,
    HelpText,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    testId,
    preview,
    question
}) => {
    const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);

    const [selectedSite, setSelectedSite] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);

    const siteOptions = [
        { label: '17 Alexander ridge', value: 1 },
        { label: 'Belper Campus', value: 2 },
        { label: 'Blackpool Campus', value: 3 },
        { label: 'Lymington Campus', value: 4 },
        { label: 'Mexborough Campus', value: 5 }
    ];

    const locationOptions = [
        { label: '049 Nicola flat', value: 1, site: 1 },
        { label: '139 Mark street', value: 2, site: 1 },
        { label: '2223new york buildin', value: 3, site: 2 },
        { label: '26 Wilkinson dam', value: 4, site: 2 },
        { label: "3 Rowley road", value: 5, site: 3 }
    ];

    const levelOptions = [
        { label: 'building in site', value: 1, location: 1 },
        { label: '2 Alexander ridge', value: 2, location: 1 },
        { label: '70 Nicola flat', value: 3, location: 2 },
        { label: '951 Mark street', value: 4, location: 3 },
        { label: 'Empire Building', value: 5, location: 4 }
    ];

    const handleSiteChange = (siteId) => {
        setSelectedSite(prev => {
            if (prev === siteId) {
                return null;
            } else {
                return siteId;
            }
        });
        setIsSiteDropdownOpen(false);
        setSelectedLocation(null);
        setSelectedLevel(null);
    };
    const handleLocationChange = (locationId) => {
        setSelectedLocation(prev => {
            if (prev === locationId) {
                return null;
            } else {
                return locationId;
            }
        });
        setIsLocationDropdownOpen(false);
        setSelectedLevel(null);
    };

    const handleLevelChange = (levelId) => {
        setSelectedLevel(prev => {
            if (prev === levelId) {
                return null;
            } else {
                return levelId;
            }
        });
        setIsLevelDropdownOpen(false);
    };

    return (
        <div data-testid="asset-location">
            <label
                data-testid="label-name"
                htmlFor={textId}
                title={preview ? question?.label : fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all block w-full max-w-[85%] ${(preview ? question?.label : fieldSettingParameters?.label) === '' ? 'h-[20px]' : 'h-auto'}`}
                maxLength={100}
            >
                {preview ? question?.label : fieldSettingParameters?.label}
            </label>
            {preview && (
                <div className={`relative mt-3 `}>
                    {/* <label htmlFor={textId} className='font-medium text-base text-black'>Site</label> */}
                    <InfinateDropdown
                        assets
                        label='Site'
                        testID='site'
                        type={type}
                        labeltestID='site'
                        id='Site'
                        isDropdownOpen={isSiteDropdownOpen}
                        setDropdownOpen={setIsSiteDropdownOpen}
                        selectedOption={selectedSite}
                        options={siteOptions}
                        className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
                        placeholder='Site'
                        handleOptionClick={(siteId) => handleSiteChange(siteId)}
                        assetLocation
                    />
                </div>
            )}
            {(preview && !selectedSite) && <div className={`relative ${preview ? 'mt-5' : 'mt-8'}`}>
                <label htmlFor={textId} className='font-medium text-base text-black'>Building</label>
                <input
                    data-testid='building'
                    type={type}
                    id={textId}
                    value={value}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
                    placeholder='Select'
                    onClick={handleChange} />
                <div className='absolute right-4 top-[74%] -translate-y-1/2'>
                    <Image src='down' />
                </div>
            </div>}
            {(preview && selectedSite) && (
                <div className={`relative ${preview ? 'mt-5' : 'mt-8'}`}>
                    {/* <label htmlFor={textId} className='font-medium text-base text-black'>Location</label> */}
                    <InfinateDropdown
                        assets
                        label='Building'
                        testID='location'
                        labeltestID='building'
                        type={type}
                        id='Location'
                        isDropdownOpen={isLocationDropdownOpen}
                        setDropdownOpen={setIsLocationDropdownOpen}
                        selectedOption={selectedLocation}
                        options={locationOptions.filter(location => location.site === selectedSite.value)}
                        className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
                        placeholder='Building'
                        handleOptionClick={(locationId) => handleLocationChange(locationId)}
                        assetLocation
                    />
                </div>
            )}
            {(preview && !selectedLocation) && <div className={`relative ${preview ? 'mt-5' : 'mt-8'}`}>
                <label htmlFor={textId} className='font-medium text-base text-black'>Floor</label>
                <input
                    data-testid='floorplan'
                    type={type}
                    id={textId}
                    value={value}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
                    placeholder='Select'
                    onClick={handleChange} />
                <div className='absolute right-4 top-[74%] -translate-y-1/2'>
                    <Image src='down' />
                </div>
            </div>}
            {(preview && selectedLocation) && (
                <div className={`relative ${preview ? 'mt-4' : 'mt-8'}`}>
                    {/* <label htmlFor={textId} className='font-medium text-base text-black'>Level</label> */}
                    <InfinateDropdown
                        assets
                        label='Floor'
                        testID='level'
                        labeltestID='floor'
                        type={type}
                        id='Level'
                        isDropdownOpen={isLevelDropdownOpen}
                        setDropdownOpen={setIsLevelDropdownOpen}
                        selectedOption={selectedLevel}
                        options={levelOptions.filter(level => level.location === selectedLocation.value)}
                        className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
                        placeholder='Floor'
                        handleOptionClick={(levelId) => handleLevelChange(levelId)}
                        assetLocation
                    />
                </div>
            )}
            {!preview && <><div className={`relative ${preview ? 'mt-3' : 'mt-5'}`}>
                <label htmlFor={textId} className='font-medium text-base text-black'>Site</label>
                <input
                    data-testid='site'
                    type={type}
                    id={textId}
                    value={value}
                    className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
                    placeholder='Select'
                    onClick={handleChange} />
                <div className='absolute right-4 top-[74%] -translate-y-1/2'>
                    <Image src='down' />
                </div>
            </div><div className={`relative ${preview ? 'mt-5' : 'mt-8'}`}>
                    <label htmlFor={textId} className='font-medium text-base text-black'>Building</label>
                    <input
                        data-testid='building'
                        type={type}
                        id={textId}
                        value={value}
                        className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
                        placeholder='Select'
                        onClick={handleChange} />
                    <div className='absolute right-4 top-[74%] -translate-y-1/2'>
                        <Image src='down' />
                    </div>
                </div><div className={`relative ${preview ? 'mt-4' : 'mt-8'}`}>
                    <label htmlFor={textId} className='font-medium text-base text-black'>Floor</label>
                    <input
                        data-testid='floorplan'
                        type={type}
                        id={textId}
                        value={value}
                        className={`w-full h-auto break-words border border-[#AEB3B7] rounded-lg bg-white py-3 px-4 outline-0 font-normal text-base text-[#2B333B] placeholder:text-base placeholder:font-base placeholder:text-[#9FACB9] mt-5 ${className}`}
                        placeholder='Select'
                        onClick={handleChange} />
                    <div className='absolute right-4 top-[74%] -translate-y-1/2'>
                        <Image src='down' />
                    </div>
                </div></>}
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={preview ? question?.help_text : fieldSettingParameters?.helptext}
            >
                {preview ? question?.help_text : fieldSettingParameters?.helptext}
            </p>
        </div>
    );
};

export default AssetLocationField;
