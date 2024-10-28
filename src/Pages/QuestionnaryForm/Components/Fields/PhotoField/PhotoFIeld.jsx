import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ImageUploader from '../../../../../Components/ImageUploader/ImageUploader';
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';
import { findSectionAndPageName } from '../../../../../CommonMethods/SectionPageFinder';

function PhotoField({ label,
    type,
    textId,
    HelpText,
    value,
    className,
    handleChange,
    fieldSettingParameters,
    testId,
    preview,
    question,
    validationErrors,
    setValidationErrors,
    setValue,
    photoValue,
    setConditionalValues,
    sections


}) {
    const [fileName, setFileName] = useState('');
    const [fileState, setFileState] = useState({}); // Create a state to store the filename  
    console.log(fileState, 'file state state')
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return; // Exit if no files are selected

        // Create a new file list that includes existing files plus new selections
        const newFilesList = [
            ...(fileState[question?.question_id] || []), // Existing files
            ...files.map(file => file) // New files
        ];
        console.log(newFilesList, 'new file list')
        // Update fileName to display all file names as a comma-separated list
        setFileName(newFilesList.map(file => file.name).join(', '));

        // Update fileState with the new files list
        setFileState((prev) => ({
            ...prev,
            [question?.question_id]: newFilesList
        }));

        const updatedFileCount = newFilesList.length;

        // Check if the minimum required number of files has been uploaded
        if (updatedFileCount >= question?.field_range?.min) {
            setValue((prev) => ({
                ...prev,
                [question?.question_id]: true
            }));
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                preview_filefield: '' // Clear validation error if criteria met
            }));
        } else {
            setValue((prev) => ({
                ...prev,
                [question?.question_id]: false
            }));
        }

        // Update conditional values to track the current file count
        const { section_name, page_name, label } = findSectionAndPageName(sections, question?.question_id);
        setConditionalValues((prevValues) => ({
            ...prevValues,
            [section_name]: {
                ...prevValues[section_name],
                [page_name]: {
                    ...prevValues[section_name]?.[page_name],
                    [label]: newFilesList
                }
            }
        }));

        console.log(newFilesList, 'Updated File List');
        console.log(updatedFileCount, 'Updated File Count');
    };




    const handleImageRemove = (fileNameToRemove) => {
        
        console.log(fileNameToRemove, 'file name to remove')
        setFileState((prev) => {
            // Directly filter the files array for the current question_id
            const updatedFiles = (prev[question?.question_id] || [])?.filter(
                (fileName) => fileName !== fileNameToRemove
            ) ;
            // const updatedFiles = (prev[question?.question_id] || []).filter(
            //     (fileName) => fileName !== fileNameToRemove
            // );
            const updatedFileCount = updatedFiles.length;
            console.log(updatedFiles, 'updated files after removal');

            // Update validation state based on the new file count
            if (updatedFileCount < question?.field_range?.min) {
                setValue((prev) => ({
                    ...prev,
                    [question?.question_id]: false
                }));
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    preview_filefield: 'Minimum file requirement not met'
                }));
            } else {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    preview_filefield: ''
                }));
            }

            // Update conditional values to reflect the new file count
            const { section_name, page_name, label } = findSectionAndPageName(sections, question?.question_id);
            setConditionalValues((prevValues) => ({
                ...prevValues,
                [section_name]: {
                    ...prevValues[section_name],
                    [page_name]: {
                        ...prevValues[section_name]?.[page_name],
                        [label]: updatedFileCount
                    }
                }
            }));

            // Directly update fileState without creating a new object
            console.log(updatedFiles, 'updatedFiles updatedFiles')
            return {
                ...prev,
                [question?.question_id]: updatedFiles
            };
        });
    };




    function handleFunction(e) {
        const value = e.target.value;
        setValue((prev) => ({
            ...prev,
            [question?.question_id]: value || false
        }));
        console.log(value, 'am checking e')
    }

    const handleBlur = (e) => {
        if (e.target.value === '') {
            setValue((prev) => ({
                ...prev,
                [question?.question_id]: false
            }));
        }
    }
    console.log(fileState, 'ddddddkdkdkkdkdkdk')

    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                maxLength={100}
                title={preview ? question?.label : fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all  break-words block w-full max-w-[85%] ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {preview ? question?.label : fieldSettingParameters?.label}{(!question?.options?.optional && preview) && <span className='text-red-500'>*</span>}
            </label>
            {!preview ? <div className={`custom-file-input-wrapper w-full h-auto mt-5 flex items-center bg-white border border-[#AEB3B7] p-2 rounded-lg`}>
                <label
                    htmlFor={textId}
                    className={`custom-file-label flex-1 py-3 px-4 bg-[#DFE0E2] rounded max-w-[30%] outline-0 font-semibold text-base text-[#505B66] cursor-pointer ${className}`}
                >
                    {fileName
                        ? `Upload Photo (${fileName})`
                        : `Upload Photo (${fieldSettingParameters?.max})`}
                </label>
                <input
                    data-testid="input"
                    type="file"
                    id={textId}
                    className="hidden-input"
                    onChange={handleFileChange}
                    onBlur={handleBlur}
                />
                <span className="placeholder ml-5 text-base font-normal text-[#9FACB9]">
                    {fileName || (fieldSettingParameters?.placeholderContent) || 'No file chosen'}
                </span>
            </div> : <div className={``}>
                <ImageUploader setFileState={setFileState} setValue={setValue} handleFileChange={handleFileChange} handleRemoveImage={handleImageRemove} minImages={question?.field_range?.min} maxImages={question?.field_range?.max} drawOnImage={question?.asset_extras?.draw_image === 'yes' ? true : false} question={question} />
            </div>}
            {(question?.question_id && validationErrors?.preview_photofield && validationErrors.preview_photofield[question.question_id]) && (
                <ErrorMessage error={validationErrors.preview_photofield[question.question_id]} />
            )}
            <p
                data-testid="help-text"
                className='italic mt-2 font-normal text-sm text-[#2B333B] break-words max-w-[90%]'
                title={preview ? question?.help_text : fieldSettingParameters?.helptext}
            >
                {preview ? question?.help_text : fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default PhotoField
