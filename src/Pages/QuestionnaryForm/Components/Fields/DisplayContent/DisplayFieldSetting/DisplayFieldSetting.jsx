import React, { useState } from 'react'
import CommonComponents from '../../../CommonComponents/CommonComponents'
import InputField from '../../../../../../Components/InputField/InputField'
import OptionsComponent from '../../TextBox/TextFieldSetting/OptionalComponent/OptionalComponent'
import ConfirmationModal from '../../../../../../Components/Modals/ConfirmationModal/ConfirmationModal';
import { setNewComponent } from '../../fieldSettingParamsSlice';
import { useDispatch } from 'react-redux';
import InfinateDropdown from '../../../../../../Components/InputField/InfinateDropdown';
import InputWithDropDown from '../../../../../../Components/InputField/InputWithDropDown';
import useApi from '../../../../../../services/CustomHook/useApi';
import ErrorMessage from '../../../../../../Components/ErrorMessage/ErrorMessage';

function DisplayFieldSetting({
    handleInputChange,
    formParameters,
    handleBlur,
    fieldSettingParameters,
    setShouldAutoSave,
    selectedQuestionId,
    handleRadiobtn,
    setReplaceModal,
    setInputValue,
    inputValue,
}) {
    const dispatch = useDispatch();
    const { getAPI } = useApi();
    console.log(fieldSettingParameters?.componentType, 'fieldSettingParameters')
    // const { uploadImage, uploading, error } = useS3Upload();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selectedUrlOption, setSelectedUrlOption] = useState(fieldSettingParameters?.format || '');
    const [errorMessage, setErrorMessage] = useState(false);

    const options = [
        { value: 'http', label: 'http' },
        { value: 'https', label: 'https' },
        { value: 'mailto', label: 'mailto' },
        { value: 'tel', label: 'tel' }
    ];

    const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    const handleOptionClick = (option) => {
        setSelectedUrlOption(option.value);
        setDropdownOpen(false);
        dispatch(setNewComponent({ id: 'url', value: option.value, questionId: selectedQuestionId }));
        setShouldAutoSave(true)

        // Prefill the input field based on the selected option
        if (option.value === 'http' || option.value === 'https') {
            setInputValue(`${option.value}://`);
        } else {
            setInputValue('');
        }
    };

    const handleFileUploadClick = () => {
        if (selectedFile) {
            setReplaceModal(true);
        } else {
            document.getElementById('file-upload').click();
        }
    };

    const handleUploadImage = async () => {
        const response = await getAPI(`field-settings/upload?folder_name=${fieldSettingParameters?.componentType}&file_name=${selectedFile?.name}`);
        console.log(response, 'response')
    }

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];

            // Validate file type
            if (!validFileTypes.includes(file.type)) {
                setErrorMessage(true);
                setSelectedFile(null); // Reset selected file
                return;
            }

            // Clear error if valid file is selected
            setSelectedFile(file);
            setErrorMessage(false);
            handleUploadImage();
            setReplaceModal(false);
        }
    };


    const handleImage = () => {
        dispatch(setNewComponent({ id: 'pin_drop', value: 'no', questionId: selectedQuestionId }));
        dispatch(setNewComponent({ id: 'draw_image', value: 'no', questionId: selectedQuestionId }));
        setShouldAutoSave(true)
    }

    return (
        <>
            <div data-testid="field-settings" className='py-[34px] px-[32px] h-customh10'>
                <p className='font-semibold text-[#2B333B] text-[22px]'>Field settings</p>
                <div className='mt-[14px] h-customh9 overflow-auto default-sidebar'>
                    <CommonComponents
                        labelID='label'
                        labelName='Label'
                        labelPlaceholder='Question 1'
                        helpTextId='Help Text'
                        helpText='Help Text'
                        helpTextPlaceholder='Enter help text'
                        handleInputChange={handleInputChange}
                        formParameters={formParameters}
                        handleBlur={handleBlur}
                        assetLocation={true}
                    />
                    <div className='mt-7'>
                        <p className='font-semibold text-base text-[#2B333B]'>Type</p>
                        <div className='mt-2.5'>
                            <div className="relative custom-radioBlue flex items-center" data-testid='yes'>
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    id='heading'
                                    value='heading'
                                    checked={fieldSettingParameters?.type === 'heading'}
                                    onClick={() => handleRadiobtn('heading')} />
                                <label htmlFor='heading'
                                    data-testid='heading'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Heading
                                </label>
                            </div>
                            {fieldSettingParameters?.type === 'heading' &&
                                <InputField
                                    autoComplete='off'
                                    id='heading'
                                    type='text'
                                    value={fieldSettingParameters?.heading}
                                    className='w-full mt-2.5'
                                    placeholder='Enter heading'
                                    testId='heading-input'
                                    htmlFor='heading'
                                    maxLength={100}
                                    handleChange={(e) => handleInputChange(e)} />
                            }
                            <div className="relative custom-radioBlue flex items-center mt-3">
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    id='text'
                                    value='text'
                                    checked={fieldSettingParameters?.type === 'text'}
                                    onClick={() => handleRadiobtn('text')} />
                                <label
                                    data-testid='text'
                                    htmlFor='text' className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Text
                                </label>
                            </div>
                            {fieldSettingParameters?.type === 'text' &&
                                <InputField
                                    autoComplete='off'
                                    id='text'
                                    type='text'
                                    value={fieldSettingParameters?.text}
                                    className='w-full mt-2.5'
                                    placeholder='Enter text'
                                    testId='text-input'
                                    htmlFor='text'
                                    maxLength={100}
                                    handleChange={(e) => handleInputChange(e)} />
                            }
                            <div className="relative custom-radioBlue flex items-center mt-3">
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    id='image'
                                    value='image'
                                    checked={fieldSettingParameters?.type === 'image'}
                                    onClick={() => {
                                        handleRadiobtn('image'),
                                            handleImage()
                                    }} />
                                <label htmlFor='image' data-testid='image'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    Image
                                </label>
                            </div>
                            {fieldSettingParameters?.type === 'image' && (
                                <>
                                    <div className='flex items-center mt-2.5'>
                                        <div className='relative w-[60%]'>
                                            <input
                                                type="file"
                                                id="file-upload"
                                                data-testId="add-image"
                                                className='hidden'
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                onClick={handleFileUploadClick}
                                                className='bg-[#2B333B] rounded h-[50px] w-full flex items-center justify-center cursor-pointer font-semibold text-base text-white'
                                            >
                                                Add Image
                                                <img src="/Images/fileUpload.svg" alt="Upload" className='ml-2.5' />
                                            </label>
                                        </div>
                                        {selectedFile && <label className='ml-3'>{selectedFile.name}</label>}
                                    </div>
                                    {errorMessage &&
                                        <ErrorMessage error={'Only JPG, JPEG, and PNG files are allowed.'} />}
                                    <div>
                                        <div className='mt-7'>
                                            <p className='font-semibold text-base text-[#2B333B]'>Pin Drop</p>
                                            <div className='mt-2.5'>
                                                <div className="relative custom-radioBlue flex items-center" data-testid='yes'>
                                                    <input
                                                        type='radio'
                                                        className='w-[17px] h-[17px]'
                                                        name='pin_drop'
                                                        id='pin_drop_yes'
                                                        value='pin_drop_yes'
                                                        checked={fieldSettingParameters?.pin_drop === 'yes'}
                                                        onClick={() => {
                                                            dispatch(setNewComponent({ id: 'pin_drop', value: 'yes', questionId: selectedQuestionId }));
                                                            setShouldAutoSave(true);
                                                        }} />
                                                    <label htmlFor='pin_drop_yes'
                                                        data-testid='pindrop-yes'
                                                        className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="relative custom-radioBlue flex items-center mt-2.5" data-testid='yes'>
                                                    <input
                                                        type='radio'
                                                        className='w-[17px] h-[17px]'
                                                        name='pin_drop'
                                                        id='pin_drop_no'
                                                        value='pin_drop_no'
                                                        checked={fieldSettingParameters?.pin_drop === 'no'}
                                                        onClick={() => {
                                                            dispatch(setNewComponent({ id: 'pin_drop', value: 'no', questionId: selectedQuestionId }));
                                                            setShouldAutoSave(true);
                                                        }} />
                                                    <label htmlFor='pin_drop_no'
                                                        data-testid='pindrop-no'
                                                        className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='my-7'>
                                            <p className='font-semibold text-base text-[#2B333B]'>Draw on Image</p>
                                            <div className="relative custom-radioBlue flex items-center mt-2.5" data-testid='yes'>
                                                <input
                                                    type='radio'
                                                    className='w-[17px] h-[17px]'
                                                    name='draw_image'
                                                    id='draw_image_yes'
                                                    value='draw_image_yes'
                                                    checked={fieldSettingParameters?.draw_image === 'yes'}
                                                    onClick={() => {
                                                        dispatch(setNewComponent({ id: 'draw_image', value: 'yes', questionId: selectedQuestionId }));
                                                        setShouldAutoSave(true);
                                                    }} />
                                                <label htmlFor='draw_image_yes'
                                                    data-testid='draw-yes'
                                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="relative custom-radioBlue flex items-center mt-3" data-testid='yes'>
                                                <input
                                                    type='radio'
                                                    className='w-[17px] h-[17px]'
                                                    name='draw_image'
                                                    id='draw_image_no'
                                                    value='draw_image_no'
                                                    checked={fieldSettingParameters?.draw_image === 'no'}
                                                    onClick={() => {
                                                        dispatch(setNewComponent({ id: 'draw_image', value: 'no', questionId: selectedQuestionId }));
                                                        setShouldAutoSave(true);
                                                    }} />
                                                <label htmlFor='draw_image_no'
                                                    data-testid='draw-no'
                                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="relative custom-radioBlue flex items-center mt-3">
                                <input
                                    type='radio'
                                    className='w-[17px] h-[17px]'
                                    name='type'
                                    id='url'
                                    value='url'
                                    checked={fieldSettingParameters?.type === 'url'}
                                    onClick={() => handleRadiobtn('url')} />
                                <label htmlFor='url' data-testid='url'
                                    className='ml-7 font-normal text-base text-[#2B333B] cursor-pointer'>
                                    URL
                                </label>
                            </div>
                            {fieldSettingParameters?.type === 'url' &&
                                <InputWithDropDown
                                    id='url'
                                    top='30px'
                                    placeholder='Select'
                                    className='w-full cursor-pointer placeholder:text-[#9FACB9] h-[45px] mt-3'
                                    testID='url-dropdown'
                                    labeltestID='url-list'
                                    selectedOption={options.find(option => option.value === fieldSettingParameters?.url)}
                                    handleOptionClick={handleOptionClick}
                                    isDropdownOpen={isDropdownOpen}
                                    setDropdownOpen={setDropdownOpen}
                                    options={options}
                                    close={true}
                                    setSelectedUrlOption={setSelectedUrlOption}
                                    selectedQuestionId={selectedQuestionId}
                                />
                            }
                            {fieldSettingParameters?.url && (
                                <InputField
                                    autoComplete='off'
                                    id='urlValue'
                                    type='text'
                                    value={inputValue} // Controlled by your component's state
                                    className='w-full mt-2.5'
                                    placeholder={
                                        selectedUrlOption === 'mailto'
                                            ? 'eg: support@halspan.com'
                                            : selectedUrlOption === 'tel'
                                                ? 'eg: +44 7911 123456'
                                                : 'Enter text'
                                    }
                                    testId='urlValue'
                                    htmlFor='urlValue'
                                    maxLength={100}
                                    handleChange={(e) => handleInputChange(e)} // Ensure this updates correctly
                                />
                            )}
                        </div>
                    </div>
                    <OptionsComponent setShouldAutoSave={setShouldAutoSave} selectedQuestionId={selectedQuestionId} />
                    <div className='mt-7'>
                        <InputField
                            autoComplete='off'
                            label='Admin Field Notes'
                            id='note'
                            type='text'
                            value={fieldSettingParameters?.note}
                            className='w-full mt-2.5'
                            labelStyle='font-semibold text-base text-[#2B333B]'
                            placeholder='Notes'
                            testId='Notes'
                            htmlFor='note'
                            maxLength={500}
                            handleChange={(e) => handleInputChange(e)} />
                    </div>
                    <div className='mx-auto mt-7 flex items-center w-full'>
                        <button type='button' className='w-[80%] mx-auto py-[13px] bg-black rounded font-semibold text-[#FFFFFF] text-base px-[52px]'>
                            Add Conditional Logic
                        </button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default DisplayFieldSetting