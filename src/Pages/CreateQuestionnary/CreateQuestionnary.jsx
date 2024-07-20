import React, { useState, useRef, useEffect } from 'react'
import NavrBar from '../../Components/NavBar/NavrBar'
import InputField from '../../Components/InputField/InputField';
import InputTextarea from '../../Components/InputField/InputTextarea';
import InputWithDropDown from '../../Components/InputField/InputWithDropDown';
import Button from '../../Components/Button/button';
import Button2 from '../../Components/Button2/ButtonLight';
import { useNavigate } from 'react-router-dom';


function CreateQuestionnary() {
    const navigate = useNavigate();
    const [createDetails, setCreateDetails] = useState({
        publicName: '',
        internalName: '',
        description: '',
        assetType: '',
        language: '',
        adHoc: '',
    });
    //drodown related states
    const [openDropdown, setOpenDropdown] = useState({
        assetdropdown: false,
        languagedropdown: false,
})

    const [selectedOption, setSelectedOption] = useState({
        AssetType: null,
        Language: null,
    });
    const dropdownRef = useRef(null); // Reference to detect outside clicks

    const options = [
        { value: 'Door', label: 'Door' }
    ];
    const options1 = [
        { valie: 'UK- English', label: 'UK- English' }
    ]

    // //function to select the dropdown options
    // const handleSelect = (option, id) => {
    //     console.log(options, id)
    //     setSelectedOption(prevOptions => ({
    //         ...prevOptions,
    //         [id]: option.value
    //     }));
    //     setOpenDropdown(null);
    // };

    //function for store the usetypes values
    const handleChange = (e) => {
        const { id, value } = e.target;
        setCreateDetails(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleNavigateBack = (e) => {
        navigate('/QuestionnariesList')
    }

    const handleCreateQuestionnary = () => {
        return;
    }

    // function to close the dropdown when we click outside
    const handleOptionClick = (option, id) => {
        setSelectedOption(prevOptions => ({
            ...prevOptions,
            [id]: option.value
        }));
        setOpenDropdown(null);
        setSelectedOption(option);
        setOpenDropdown(null); // Close the dropdown
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='bg-[#F4F6FA]'>
            <div className='m-7 bg-white py-10 px-9'>
                <p className='font-medium text-[#2B333B] text-[28px]'>Create Questionnaire</p>
                <p className='font-medium text-[#2B333B] text-[22px] mt-8'>Questionnaire settings</p>
                <div className='flex items-start'>
                    <div className=' w-[70%]'>
                        <div className='mt-8 flex items-start w-full'>
                            <div className='w-1/2 mr-[114px]'>
                                <InputField
                                    autoComplete='off'
                                    label='Public name *'
                                    id='publicName'
                                    type='text'
                                    value={createDetails?.publicName}
                                    className='w-full mt-2.5'
                                    labelStyle='font-semibold text-base text-[#2B333B]'
                                    placeholder='Enter Public name'
                                    testId='publicName'
                                    htmlFor='publicName'
                                    maxLength={50}
                                    handleChange={handleChange}
                                    validationError={true}
                                />
                            </div>
                            <div className='w-1/2'>
                                <InputField
                                    autoComplete='off'
                                    label='Internal name *'
                                    id='internal name'
                                    type='text'
                                    value={createDetails?.internalName}
                                    className='w-full mt-2.5'
                                    labelStyle='font-semibold text-base text-[#2B333B]'
                                    placeholder='Enter Internal name'
                                    testId='internal name'
                                    htmlFor='internal name'
                                    maxLength={50}
                                    handleChange={handleChange}
                                    validationError={true}
                                />
                            </div>
                        </div>
                        <div className='mt-8 flex items-start'>
                            <div className='w-1/2 mr-[114px]'>
                                <InputWithDropDown
                                    label='Asset type'
                                    labelStyle='font-semibold text-base text-[#2B333B]'
                                    id='AssetType'
                                    placeholder='Select'
                                    className='w-full cursor-pointer mt-2.5'
                                    top='30px'
                                    options={options}
                                    onSelect={(option) => handleSelect(option, 'AssetType')}
                                    isDropdownOpen={openDropdown === 'AssetType'}
                                    setDropdownOpen={() => setOpenDropdown(openDropdown === 'AssetType' ? null : 'AssetType')}
                                    selectedOption={selectedOption.AssetType}
                                    handleOptionClick={option => handleOptionClick(option, 'AssetType')}
                                    dropdownRef={dropdownRef} // Pass reference
                                />
                            </div>
                            <div className='w-1/2'>
                                <InputWithDropDown
                                    label='Language'
                                    labelStyle='font-semibold text-base text-[#2B333B]'
                                    id='Language'
                                    placeholder='Select'
                                    className={`w-full cursor-pointer mt-2.5`}
                                    top='30px'
                                    options={options1}
                                    onSelect={(option) => handleSelect(option, 'Language')}
                                    isDropdownOpen={openDropdown === 'Language'}
                                    setDropdownOpen={() => setOpenDropdown(openDropdown === 'Language' ? null : 'Language')}
                                    selectedOption={selectedOption.Language}
                                    handleOptionClick={option => handleOptionClick(option, 'Language')}
                                    dropdownRef={dropdownRef} // Pass reference
                                />
                            </div>
                        </div>
                    </div>
                    <div className='w-[30%] ml-[114px] mt-8'>
                        <InputTextarea
                            className='h-[160px] w-full mt-2.5'
                            label='Description'
                            htmlFor='description'
                            id='description'
                            labelStyle='font-normal text-base text-[#2B333B]'
                            value={createDetails?.description}
                            placeholder='Enter Description'
                            testId='description'
                            maxLength={100}
                            handleChange={handleChange}
                        />
                    </div>
                </div>
                <div className='mt-8'>
                    <p className='font-semibold text-[#2B333B] text-base'>Ad Hoc / Non TAG questionnaire</p>
                    <div className='mt-2.5'>
                        <div>
                            <input type="radio" className='w-[17px] h-[17px]' name="yes" id="yes" />
                            <label htmlFor="yes" className='ml-2.5 font-normal text-base text-[#2B333B]'>Yes</label>
                        </div>
                        <div className='mt-2.5'>
                            <input type="radio" className='w-[17px] h-[17px]' name="yes" id="NO" />
                            <label htmlFor="NO" className='ml-2.5 font-normal text-base text-[#2B333B]'>No</label>
                        </div>
                    </div>
                </div>
                <div className='mt-8'>
                    <Button
                        text='Create Questionnaire'
                        testID='Create-Questionnaire'
                        className='w-[280px] h-[50px]'
                        onClick={handleCreateQuestionnary}
                    // isThreedotLoading
                    ></Button>
                    <Button2
                        testId='Cancel'
                        onClick={handleNavigateBack}
                        className='w-[162px] h-[50px] ml-[32px]'
                        text='Cancel'
                    />
                </div>
            </div>
        </div>
    )
}

export default CreateQuestionnary