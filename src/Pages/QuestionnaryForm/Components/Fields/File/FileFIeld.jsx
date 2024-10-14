import React, { useState } from 'react'
import { useSelector } from 'react-redux';

function FileField({
    textId,
    className,
    handleChange,
    fieldSettingParameters,
    preview,
    question
}) {

    const [fileName, setFileName] = useState('');



    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileName(file ? file.name : '');
        handleChange(fieldSettingParameters);
    };

    return (
        <div>
            <label
                data-testid="label-name"
                htmlFor={textId}
                maxLength={100}
                title={preview ? question?.label :fieldSettingParameters?.label}
                className={`font-medium text-base text-[#000000] overflow-hidden break-all  break-words block w-full max-w-[85%]  ${fieldSettingParameters?.label === '' ? 'h-[20px]' : 'h-auto'}`}>
                {preview ? question?.label :fieldSettingParameters?.label}
            </label>
            <div className={`custom-file-input-wrapper w-full h-auto ${preview ? 'mt-1' : 'mt-5'} flex items-center bg-white border border-[#AEB3B7] p-2 rounded-lg`}>
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
                    {fileName || (preview ? question?.placeholder_content :fieldSettingParameters?.placeholderContent) || 'No file chosen'}
                </span>
            </div>
            <p
                data-testid="help-text"
                className={`italic mt-2 font-normal ${preview ? ' ml-1 text-xs' : 'text-sm'} text-[#2B333B] break-words max-w-[90%]`}
                title={preview ? question?.help_text : fieldSettingParameters?.helptext}
            >
                {preview ? question?.help_text : fieldSettingParameters?.helptext}</p>
        </div>
    )
}

export default FileField