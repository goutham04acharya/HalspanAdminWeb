import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import ImageUploader from '../../../../../Components/ImageUploader/ImageUploader';
import ErrorMessage from '../../../../../Components/ErrorMessage/ErrorMessage';

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


}) {
    const [fileName, setFileName] = useState('');
    console.log(fileName, 'ssssssss')
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileName(file ? file.name : '');
        handleChange(fieldSettingParameters);
        console.log(file, 'file akkaka')
        // if (file.length < 1) {
        //     setValue((prev) => ({
        //         ...prev,
        //         [question?.question_id]: true
        //     }));
        // }else{
        //     setValue((prev) => ({
        //         ...prev,
        //         [question?.question_id]: false
        //     }));
        // }

    };
    function handleFunction(e) {
        const value = e.target.value;
        setValue((prev) => ({
            ...prev,
            [question?.question_id]: value || false
        }));
        console.log(value, 'am checking e')
    }

    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                maxLength={100}
                title={preview ? question?.label : fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all  break-words block w-full max-w-[85%] ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {preview ? question?.label : fieldSettingParameters?.label}
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
                />
                <span className="placeholder ml-5 text-base font-normal text-[#9FACB9]">
                    {fileName || (fieldSettingParameters?.placeholderContent) || 'No file chosen'}
                </span>
            </div> : <div className={``}>
                <ImageUploader maxImages={question?.field_range?.max} drawOnImage={question?.asset_extras?.draw_image === 'yes' ? true : false} />
            </div>}
            {/* {(question?.question_id && validationErrors?.preview_photofield && validationErrors.preview_photofield[question.question_id]) && (
                <ErrorMessage error={validationErrors.preview_photofield[question.question_id]} />
            )} */}
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