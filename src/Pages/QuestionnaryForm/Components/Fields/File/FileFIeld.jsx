import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import FileUploader from '../../../../../Components/FileUploader/FileUploader';
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';

function FileField({
    textId,
    className,
    handleChange,
    fieldSettingParameters,
    preview,
    question,
    setValue,
    setValidationErrors,
    validationErrors
}) {

    const [fileName, setFileName] = useState('');
    const [fileState, setFileState] = useState({ files: [] });   

    const handleFileChange = (e) => {
        // debugger
        const file = e.target.files[0];
        setFileName(file ? file.name : '');
        // handleChange(fieldSettingParameters);    
        console.log(file, 'file akkaka')
        setFileState((prev) => ({ ...prev, [question?.question_id]: file.name })); // Store the filename in the state    
        if (Object.keys({ ...fileState, [question?.question_id]: file.name }).length >= question?.field_range?.min) {
            // debugger
            setValue((prev) => ({
                ...prev,
                [question?.question_id]: true
            }));
            setValidationErrors((prevErrors) => ({
                
                ...prevErrors,
                preview_filefield: '', // Or remove the key if you prefer     
            }))
            console.log(validationErrors.preview_filefield, 'ffffffffffffffffffffffff')
        } else {
            setValue((prev) => ({
                ...prev,
                [question?.question_id]: false
            }));
        }
    };
    

    const handleFileRemove = (index) => {
        setFileState((prev) => {
            const newState = { ...prev };
            delete newState[question?.question_id];
            return newState;
        });
        if (Object.keys(fileState).length < question?.field_range?.min) {
            setValue((prev) => ({
                ...prev,
                [question?.question_id]: false
            }));
        }
    };

    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                maxLength={100}
                title={preview ? question?.label : fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all  break-words block w-full max-w-[85%]  ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {preview ? question?.label : fieldSettingParameters?.label}{(!question?.options?.optional && preview) && <span className='text-red-500'>*</span>}
            </label>
            {!preview ? <div className={`custom-file-input-wrapper w-full h-auto ${preview ? 'mt-1' : 'mt-5'} flex items-center bg-white border border-[#AEB3B7] p-2 rounded-lg`}>
                <label
                    htmlFor={textId}
                    className={`custom-file-label flex-1 py-3 px-4 bg-[#DFE0E2] rounded max-w-[30%] outline-0 font-semibold text-base text-[#505B66] cursor-pointer ${className}`}
                >
                    {fileName
                        ? `Upload File (${fileName})`
                        : `Upload File (${preview ? question?.field_range?.max : fieldSettingParameters?.max})`} {/* Ensure proper string rendering */}
                </label>
                <input
                    data-testid="input"
                    type="file"
                    id={textId}
                    className="hidden-input"
                    onChange={handleFileChange}
                />
                <span className="placeholder ml-5 text-base font-normal text-[#9FACB9]">
                    {fileName || (preview ? question?.placeholder_content : fieldSettingParameters?.placeholderContent) || 'No file chosen'}
                </span>
            </div> : <div>
                <FileUploader setValidationErrors={setValidationErrors} validationErrors={validationErrors} setValue={setValue} fileType={question?.asset_extras?.file_type} fileSize={question?.asset_extras?.file_size} min={question?.field_range?.min} max={question?.field_range?.max} handleChange={handleFileChange} setFileState={setFileState} handleRemove={handleFileRemove} fileState={fileState} />
            </div>}
            {(question?.question_id && validationErrors?.preview_filefield && validationErrors.preview_filefield[question.question_id]) && (
                <ErrorMessage error={validationErrors.preview_filefield[question.question_id]} />
            )}
            <p
                data-testid="help-text"
                className={`italic mt-2 font-normal ${preview ? ' ml-1 text-xs' : 'text-sm'} text-[#2B333B] break-words max-w-[90%]`}
                title={preview ? question?.help_text : fieldSettingParameters?.helptext}
            >
                {preview ? question?.help_text : fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default FileField;
