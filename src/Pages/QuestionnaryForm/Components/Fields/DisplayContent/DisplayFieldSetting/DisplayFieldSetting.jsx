import React, { useState } from 'react'
import InputField from '../../../../../../Components/InputField/InputField'
import OptionsComponent from '../../TextBox/TextFieldSetting/OptionalComponent/OptionalComponent'
import { setNewComponent } from '../../fieldSettingParamsSlice';
import { useDispatch } from 'react-redux';
import InputWithDropDown from '../../../../../../Components/InputField/InputWithDropDown';
import useApi from '../../../../../../services/CustomHook/useApi';
import ErrorMessage from '../../../../../../Components/ErrorMessage/ErrorMessage';
import { v4 as uuidv4 } from 'uuid'; // Make sure you import uuidv4 if not already done
import { setShouldAutoSave } from '../../../QuestionnaryFormSlice';


function DisplayFieldSetting({
    handleInputChange,
    fieldSettingParameters,
    selectedQuestionId,
    handleRadiobtn,
    setReplaceModal,
    setConditionalLogic
}) {
    const dispatch = useDispatch();
    const { getAPI } = useApi();
    // const { uploadImage, uploading, error } = useS3Upload();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selectedUrlOption, setSelectedUrlOption] = useState(fieldSettingParameters?.format || '');
    const [errorMessage, setErrorMessage] = useState(false);


    const options = [
        { value: 'http://', label: 'http://' },
        { value: 'https://', label: 'https://' },
        { value: 'mailto:', label: 'mailto:' },
        { value: 'tel:', label: 'tel:' }
    ];

    const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    const handleOptionClick = (option) => {
        setSelectedUrlOption(option.value);
        // setTypeInput(option.value)
        setDropdownOpen(false);

        dispatch(setNewComponent({ id: 'urlType', value: option.value, questionId: selectedQuestionId }));
        dispatch(setNewComponent({ id: 'urlValue', value: (option.value === 'mailto:' || option.value === 'tel:') ? `${option.value} ` : option.value, questionId: selectedQuestionId }));

        dispatch(setShouldAutoSave(true));

        // Update the input value (make sure you use the correct state updater)
    };

    const handleFileUploadClick = () => {
        if (selectedFile) {
            setReplaceModal(true);
            dispatch(setShouldAutoSave(true));
        } else {
            document.getElementById('file-upload').click();
        }
    };

    const handleUploadImage = async (file) => {
        try {
            // Format the file name
            const formattedFileName = encodeURIComponent(file?.name.replace(/\s+/g, '_'));

            // Call your API to get the pre-signed URL
            const response = await getAPI(
                `field-settings/upload?folder_name=display_content&file_name=${`${uuidv4()}-${formattedFileName}`}`
            );

            if (response?.data?.status) {

                const { url } = response?.data?.data;

                // Set up custom headers
                const customHeaders = {
                    'Content-Type': 'image/*',
                    'x-amz-acl': 'public-read',
                };

                // Upload the image to S3 using the pre-signed URL
                const uploadResponse = await fetch(url, {
                    method: 'PUT',
                    headers: customHeaders,
                    body: file,  // Send the actual file content
                });
                dispatch(setNewComponent({ id: 'image', value: uploadResponse?.url.split('?')[0], questionId: selectedQuestionId }));
                dispatch(setShouldAutoSave(true));

                // Check if the upload was successful
                if (uploadResponse.ok) {
                    console.log('Image uploaded successfully!');
                } else {
                    console.error('Failed to upload image:', uploadResponse.status, uploadResponse.statusText);
                    const errorText = await uploadResponse.text();
                    console.error('Response body:', errorText); // Log the full response for more insight
                }
            } else {
                // Log the error message if status is false
                console.error('Failed to get pre-signed URL', response?.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error during the image upload process:', error);
        }
    };


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
            handleUploadImage(file);  // Pass file directly here
            setReplaceModal(false);
        }
    };

    const extractFileNameFromUrl = (url) => {
        if (!url) return '';

        // Extract filename from URL
        const filenameWithQuery = url.substring(url.lastIndexOf('/') + 1);

        // Decode URL-encoded characters
        const decodedFilename = decodeURIComponent(filenameWithQuery);

        // Remove the first 36 characters (UUID + hyphen) from the filename
        const filenameWithoutUuid = decodedFilename.substring(37);

        // Optionally, replace specific characters if needed
        // For example, replace spaces with underscores
        const cleanedFilename = filenameWithoutUuid.replace(/ /g, '_');

        return cleanedFilename;
    };


    const handleImage = () => {
        dispatch(setNewComponent({ id: 'pin_drop', value: 'no', questionId: selectedQuestionId }));
        dispatch(setNewComponent({ id: 'draw_image', value: 'no', questionId: selectedQuestionId }));
        dispatch(setShouldAutoSave(true));
    }

    return (
        <>
            <div data-testid="field-settings" className='py-[34px] px-[32px] h-customh10'>
                <p className='font-semibold text-[#2B333B] text-[22px]'>Field settings</p>
                <div className='mt-[14px] h-customh9 overflow-auto default-sidebar'>
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
                                    <div className='flex items-start mt-2.5'>
                                        <div className='relative w-[50%]'>
                                            <input
                                                type="file"
                                                id="file-upload"
                                                data-testId="add-image"
                                                className='hidden'
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                onClick={handleFileUploadClick}
                                                data-testid="upload-image" className='bg-[#2B333B] rounded h-[50px] w-full flex items-center justify-center cursor-pointer font-semibold text-base text-white'
                                            >
                                                Add Image
                                                <img src="/Images/fileUpload.svg" alt="Upload" className='ml-2.5' />
                                            </label>
                                        </div>
                                        {(fieldSettingParameters?.image || selectedFile) && (
                                            <label className='ml-3 break-words max-w-[50%]'>{selectedFile?.name || extractFileNameFromUrl(fieldSettingParameters.image)}</label>
                                        )}
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
                                                            dispatch(setShouldAutoSave(true));
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
                                                            dispatch(setShouldAutoSave(true));
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
                                                        dispatch(setShouldAutoSave(true));
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
                                                        dispatch(setShouldAutoSave(true));
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
                                    testID={'url-dropdown'}
                                    labeltestID='url-list'
                                    selectedOption={options.find(option => option.value === fieldSettingParameters?.urlType)}
                                    handleOptionClick={handleOptionClick}
                                    isDropdownOpen={isDropdownOpen}
                                    setDropdownOpen={setDropdownOpen}
                                    options={options}
                                    close={true}
                                    setSelectedUrlOption={setSelectedUrlOption}
                                    selectedQuestionId={selectedQuestionId}
                                />
                            }
                            {fieldSettingParameters?.urlType && (
                                <InputField
                                    autoComplete='off'
                                    id='urlValue'
                                    type='text'
                                    value={fieldSettingParameters?.urlValue}
                                    className='w-full mt-2.5'
                                    placeholder={
                                        selectedUrlOption === 'mailto:'
                                            ? 'eg: support@halspan.com'
                                            : selectedUrlOption === 'tel:'
                                                ? 'eg: +44 7911 123456'
                                                : selectedUrlOption === 'http://' || selectedUrlOption === 'https://'
                                                    ? `eg: ${selectedUrlOption} example.com`
                                                    : 'Enter text'
                                    }
                                    testId='urlInput'
                                    htmlFor='urlValue'
                                    maxLength={100}
                                    handleChange={(e) => handleInputChange(e)} // Ensure this updates correctly
                                />
                            )}
                        </div>
                    </div>
                    <OptionsComponent selectedQuestionId={selectedQuestionId} />
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
                    <div className='mx-auto mt-7 flex flex-col items-center w-full'>
                        <button
                            type='button'
                            className='w-[80%] mx-auto py-[13px] bg-black rounded font-semibold text-[#FFFFFF] text-base px-[52px]'
                            onClick={() => setConditionalLogic(true)}  // Use arrow function
                        >
                            Add Conditional Logic
                        </button>
                        {fieldSettingParameters.conditional_logic &&
                            <p className='text-center italic mt-1'>Conditional Logic Added</p>
                        }
                    </div>
                </div>
            </div >
        </>
    )
}

export default DisplayFieldSetting